using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using ElaviewBackend.Tests.Integration.Fixtures;
using ElaviewBackend.Tests.Shared.Extensions;
using ElaviewBackend.Tests.Shared.Factories;
using ElaviewBackend.Tests.Shared.Models;
using FluentAssertions;
using HotChocolate.Subscriptions;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace ElaviewBackend.Tests.Integration.Notifications;

[Collection("Integration")]
public sealed class SubscriptionTests(IntegrationTestFixture fixture) : IntegrationTestBase(fixture) {
    [Fact]
    public async Task TopicEventSender_CanSendNotificationEvent() {
        var user = await CreateAndLoginUserAsync();
        var notification = NotificationFactory.Create(user.Id);

        using var scope = Fixture.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        context.Notifications.Add(notification);
        await context.SaveChangesAsync();

        var eventSender = scope.ServiceProvider.GetService<ITopicEventSender>();
        eventSender.Should().NotBeNull("ITopicEventSender should be registered");

        if (eventSender != null) {
            await eventSender.SendAsync($"notifications:{user.Id}", notification);
        }

        var notifications = await Client.QueryAsync<MyNotificationsResponse>("""
            query {
                myNotifications {
                    nodes {
                        id
                    }
                }
            }
            """);

        notifications.Errors.Should().BeNullOrEmpty();
        notifications.Data!.MyNotifications.Nodes.Should().HaveCount(1);
    }

    [Fact]
    public async Task TopicEventSender_CanSendMessageEvent() {
        var (user, _) = await SeedAdvertiserAsync();
        var (otherUser, _) = await SeedSpaceOwnerAsync();
        await LoginAsync(user.Email, "Test123!");

        var conversation = await SeedConversationWithParticipantsAsync(null, user.Id, otherUser.Id);
        var message = MessageFactory.Create(conversation.Id, user.Id);

        using var scope = Fixture.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        context.Messages.Add(message);
        await context.SaveChangesAsync();

        var eventSender = scope.ServiceProvider.GetService<ITopicEventSender>();
        eventSender.Should().NotBeNull("ITopicEventSender should be registered");

        if (eventSender != null) {
            await eventSender.SendAsync($"messages:{conversation.Id}", message);
        }

        var messages = await Client.QueryAsync<MessagesByConversationResponse>("""
            query($conversationId: ID!) {
                messagesByConversation(conversationId: $conversationId) {
                    nodes {
                        id
                    }
                }
            }
            """,
            new { conversationId = conversation.Id });

        messages.Errors.Should().BeNullOrEmpty();
        messages.Data!.MessagesByConversation.Nodes.Should().HaveCount(1);
    }

    [Fact]
    public async Task SendMessage_Mutation_TriggersMessageCreation() {
        var (user, _) = await SeedAdvertiserAsync();
        var (otherUser, _) = await SeedSpaceOwnerAsync();
        await LoginAsync(user.Email, "Test123!");

        var conversation = await SeedConversationWithParticipantsAsync(null, user.Id, otherUser.Id);

        var response = await Client.MutateAsync<SendMessageResponse>("""
            mutation($input: SendMessageInput!) {
                sendMessage(input: $input) {
                    message {
                        id
                        content
                    }
                }
            }
            """,
            new { input = new { conversationId = conversation.Id, content = "Test message for subscription" } });

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.SendMessage.Message.Content.Should().Be("Test message for subscription");
    }

    [Fact]
    public async Task TopicEventSender_IsRegistered() {
        using var scope = Fixture.Services.CreateScope();
        var eventSender = scope.ServiceProvider.GetService<ITopicEventSender>();
        eventSender.Should().NotBeNull("ITopicEventSender should be registered by HotChocolate");
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
}
