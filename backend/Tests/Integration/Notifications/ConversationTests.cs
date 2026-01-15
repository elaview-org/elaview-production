using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using ElaviewBackend.Tests.Integration.Fixtures;
using ElaviewBackend.Tests.Shared.Extensions;
using ElaviewBackend.Tests.Shared.Factories;
using ElaviewBackend.Tests.Shared.Models;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace ElaviewBackend.Tests.Integration.Notifications;

[Collection("Integration")]
public sealed class ConversationTests(IntegrationTestFixture fixture) : IntegrationTestBase(fixture) {
    [Fact]
    public async Task CreateBookingConversation_CreatesConversation() {
        var (advertiser, advertiserProfile) = await SeedAdvertiserAsync();
        var (_, ownerProfile) = await SeedSpaceOwnerAsync();
        await LoginAsync(advertiser.Email, "Test123!");

        var campaign = await SeedCampaignAsync(advertiserProfile.Id);
        var space = await SeedSpaceAsync(ownerProfile.Id);
        var booking = await SeedBookingAsync(campaign.Id, space.Id);

        var response = await Client.MutateAsync<CreateBookingConversationResponse>("""
            mutation($input: CreateBookingConversationInput!) {
                createBookingConversation(input: $input) {
                    conversation {
                        id
                        bookingId
                    }
                }
            }
            """,
            new { input = new { bookingId = booking.Id } });

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.CreateBookingConversation.Conversation.BookingId.Should().Be(booking.Id);
    }

    [Fact]
    public async Task CreateBookingConversation_ExistingConversation_ReturnsSameConversation() {
        var (advertiser, advertiserProfile) = await SeedAdvertiserAsync();
        var (_, ownerProfile) = await SeedSpaceOwnerAsync();
        await LoginAsync(advertiser.Email, "Test123!");

        var campaign = await SeedCampaignAsync(advertiserProfile.Id);
        var space = await SeedSpaceAsync(ownerProfile.Id);
        var booking = await SeedBookingAsync(campaign.Id, space.Id);

        var response1 = await Client.MutateAsync<CreateBookingConversationResponse>("""
            mutation($input: CreateBookingConversationInput!) {
                createBookingConversation(input: $input) {
                    conversation { id bookingId }
                }
            }
            """,
            new { input = new { bookingId = booking.Id } });

        var response2 = await Client.MutateAsync<CreateBookingConversationResponse>("""
            mutation($input: CreateBookingConversationInput!) {
                createBookingConversation(input: $input) {
                    conversation { id bookingId }
                }
            }
            """,
            new { input = new { bookingId = booking.Id } });

        response1.Errors.Should().BeNullOrEmpty();
        response2.Errors.Should().BeNullOrEmpty();
        response1.Data!.CreateBookingConversation.Conversation.Id
            .Should().Be(response2.Data!.CreateBookingConversation.Conversation.Id);
    }

    [Fact]
    public async Task CreateBookingConversation_InvalidBooking_ReturnsError() {
        var user = await CreateAndLoginUserAsync();

        var response = await Client.MutateAsync<CreateBookingConversationResponse>("""
            mutation($input: CreateBookingConversationInput!) {
                createBookingConversation(input: $input) {
                    conversation { id }
                }
            }
            """,
            new { input = new { bookingId = Guid.NewGuid() } });

        response.Errors.Should().NotBeNullOrEmpty();
        response.Errors!.First().Message.Should().Contain("not found");
    }

    [Fact]
    public async Task GetConversationById_ReturnsConversation() {
        var (advertiser, advertiserProfile) = await SeedAdvertiserAsync();
        var (otherUser, _) = await SeedSpaceOwnerAsync();
        await LoginAsync(advertiser.Email, "Test123!");

        var conversation = await SeedConversationWithParticipantsAsync(null, advertiser.Id, otherUser.Id);

        var response = await Client.QueryAsync<ConversationByIdResponse>("""
            query($id: ID!) {
                conversationById(id: $id) {
                    id
                    bookingId
                    updatedAt
                }
            }
            """,
            new { id = conversation.Id });

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.ConversationById.Should().NotBeNull();
        response.Data!.ConversationById!.Id.Should().Be(conversation.Id);
    }

    [Fact]
    public async Task GetConversationById_Unauthenticated_ReturnsAuthError() {
        var response = await Client.QueryAsync<ConversationByIdResponse>("""
            query($id: ID!) {
                conversationById(id: $id) {
                    id
                }
            }
            """,
            new { id = Guid.NewGuid() });

        response.Errors.Should().NotBeNullOrEmpty();
        response.Errors!.Should().ContainSingle()
            .Which.Extensions.Should().ContainKey("code")
            .WhoseValue?.ToString().Should().Be("AUTH_NOT_AUTHENTICATED");
    }

    [Fact]
    public async Task GetMessagesByConversation_ReturnsMessages() {
        var (advertiser, _) = await SeedAdvertiserAsync();
        var (otherUser, _) = await SeedSpaceOwnerAsync();
        await LoginAsync(advertiser.Email, "Test123!");

        var conversation = await SeedConversationWithParticipantsAsync(null, advertiser.Id, otherUser.Id);
        await SeedMessageAsync(conversation.Id, advertiser.Id);
        await SeedMessageAsync(conversation.Id, otherUser.Id);
        await SeedMessageAsync(conversation.Id, advertiser.Id);

        var response = await Client.QueryAsync<MessagesByConversationResponse>("""
            query($conversationId: ID!) {
                messagesByConversation(conversationId: $conversationId) {
                    nodes {
                        id
                        type
                        content
                        senderUserId
                    }
                }
            }
            """,
            new { conversationId = conversation.Id });

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.MessagesByConversation.Nodes.Should().HaveCount(3);
    }

    [Fact]
    public async Task GetMessagesByConversation_EmptyConversation_ReturnsEmptyList() {
        var (advertiser, _) = await SeedAdvertiserAsync();
        var (otherUser, _) = await SeedSpaceOwnerAsync();
        await LoginAsync(advertiser.Email, "Test123!");

        var conversation = await SeedConversationWithParticipantsAsync(null, advertiser.Id, otherUser.Id);

        var response = await Client.QueryAsync<MessagesByConversationResponse>("""
            query($conversationId: ID!) {
                messagesByConversation(conversationId: $conversationId) {
                    nodes {
                        id
                    }
                }
            }
            """,
            new { conversationId = conversation.Id });

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.MessagesByConversation.Nodes.Should().BeEmpty();
    }

    [Fact]
    public async Task SendMessage_WithAttachments_SendsMessage() {
        var (advertiser, _) = await SeedAdvertiserAsync();
        var (otherUser, _) = await SeedSpaceOwnerAsync();
        await LoginAsync(advertiser.Email, "Test123!");

        var conversation = await SeedConversationWithParticipantsAsync(null, advertiser.Id, otherUser.Id);

        var response = await Client.MutateAsync<SendMessageResponse>("""
            mutation($input: SendMessageInput!) {
                sendMessage(input: $input) {
                    message {
                        id
                        type
                        content
                        senderUserId
                    }
                }
            }
            """,
            new {
                input = new {
                    conversationId = conversation.Id,
                    content = "Check out these attachments",
                    type = "TEXT",
                    attachments = new[] { "https://example.com/file1.pdf", "https://example.com/file2.pdf" }
                }
            });

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.SendMessage.Message.Content.Should().Be("Check out these attachments");
    }

    [Fact]
    public async Task MarkConversationRead_NotParticipant_ReturnsError() {
        var user = await CreateAndLoginUserAsync();
        var (user1, _) = await SeedAdvertiserAsync();
        var (user2, _) = await SeedSpaceOwnerAsync();

        var conversation = await SeedConversationWithParticipantsAsync(null, user1.Id, user2.Id);

        var response = await Client.MutateAsync<MarkConversationReadResponse>("""
            mutation($input: MarkConversationReadInput!) {
                markConversationRead(input: $input) {
                    participant {
                        id
                    }
                }
            }
            """,
            new { input = new { conversationId = conversation.Id } });

        response.Errors.Should().NotBeNullOrEmpty();
        response.Errors!.First().Message.Should().Contain("not a participant");
    }

    private async Task<Conversation> SeedConversationWithParticipantsAsync(Guid? bookingId, params Guid[] userIds) {
        var conversation = ConversationFactory.Create(bookingId);
        using var scope = Fixture.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        context.Conversations.Add(conversation);
        await context.SaveChangesAsync();

        foreach (var userId in userIds) {
            var participant = ConversationParticipantFactory.Create(conversation.Id, userId);
            context.ConversationParticipants.Add(participant);
        }
        await context.SaveChangesAsync();

        return conversation;
    }

    private async Task<Message> SeedMessageAsync(Guid conversationId, Guid senderUserId) {
        var message = MessageFactory.Create(conversationId, senderUserId);
        using var scope = Fixture.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        context.Messages.Add(message);
        await context.SaveChangesAsync();
        return message;
    }
}
