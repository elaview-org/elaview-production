using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using ElaviewBackend.Tests.Integration.Fixtures;
using ElaviewBackend.Tests.Shared.Extensions;
using ElaviewBackend.Tests.Shared.Factories;
using ElaviewBackend.Tests.Shared.Models;
using FluentAssertions;
using Xunit;

namespace ElaviewBackend.Tests.Integration.Notifications;

[Collection("Integration")]
public sealed class NotificationMutationsTests(IntegrationTestFixture fixture)
    : IntegrationTestBase(fixture) {
    [Fact]
    public async Task MarkNotificationRead_MarksAsRead() {
        var user = await CreateAndLoginUserAsync();
        var notification = await SeedNotificationAsync(user.Id);

        var response = await Client.MutateAsync<MarkNotificationReadResponse>(
            """
            mutation($input: MarkNotificationReadInput!) {
                markNotificationRead(input: $input) {
                    notification {
                        id
                        isRead
                        readAt
                    }
                }
            }
            """,
            new { input = new { id = notification.Id } });

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.MarkNotificationRead.Notification.IsRead.Should()
            .BeTrue();
        response.Data!.MarkNotificationRead.Notification.ReadAt.Should()
            .NotBeNull();
    }

    [Fact]
    public async Task MarkAllNotificationsRead_MarksAllAsRead() {
        var user = await CreateAndLoginUserAsync();
        await SeedNotificationAsync(user.Id);
        await SeedNotificationAsync(user.Id);
        await SeedNotificationAsync(user.Id);

        var response =
            await Client.MutateAsync<MarkAllNotificationsReadResponse>("""
                mutation {
                    markAllNotificationsRead {
                        count
                    }
                }
                """);

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.MarkAllNotificationsRead.Count.Should().Be(3);
    }

    [Fact]
    public async Task DeleteNotification_DeletesNotification() {
        var user = await CreateAndLoginUserAsync();
        var notification = await SeedNotificationAsync(user.Id);

        var response = await Client.MutateAsync<DeleteNotificationResponse>("""
                mutation($input: DeleteNotificationInput!) {
                    deleteNotification(input: $input) {
                        success
                    }
                }
                """,
            new { input = new { id = notification.Id } });

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.DeleteNotification.Success.Should().BeTrue();
    }

    [Fact]
    public async Task UpdateNotificationPreference_CreatesPreference() {
        var user = await CreateAndLoginUserAsync();

        var response =
            await Client.MutateAsync<UpdateNotificationPreferenceResponse>("""
                    mutation($input: UpdateNotificationPreferenceInput!) {
                        updateNotificationPreference(input: $input) {
                            preference {
                                id
                                notificationType
                                emailEnabled
                                pushEnabled
                                inAppEnabled
                            }
                        }
                    }
                    """,
                new {
                    input = new {
                        notificationType = "BOOKING_REQUESTED",
                        emailEnabled = false,
                        pushEnabled = true,
                        inAppEnabled = true
                    }
                });

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.UpdateNotificationPreference.Preference.EmailEnabled
            .Should().BeFalse();
        response.Data!.UpdateNotificationPreference.Preference.PushEnabled
            .Should().BeTrue();
    }

    [Fact]
    public async Task SendMessage_SendsMessage() {
        var user = await CreateAndLoginUserAsync();
        var (otherUser, _) = await SeedAdvertiserAsync();
        var conversation =
            await SeedConversationWithParticipantsAsync(null, user.Id,
                otherUser.Id);

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
                    content = "Hello, this is a test message"
                }
            });

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.SendMessage.Message.Content.Should()
            .Be("Hello, this is a test message");
        response.Data!.SendMessage.Message.SenderUserId.Should().Be(user.Id);
    }

    [Fact]
    public async Task MarkConversationRead_UpdatesLastReadAt() {
        var user = await CreateAndLoginUserAsync();
        var (otherUser, _) = await SeedAdvertiserAsync();
        var conversation =
            await SeedConversationWithParticipantsAsync(null, user.Id,
                otherUser.Id);

        var response = await Client.MutateAsync<MarkConversationReadResponse>(
            """
            mutation($input: MarkConversationReadInput!) {
                markConversationRead(input: $input) {
                    participant {
                        id
                        userId
                        lastReadAt
                    }
                }
            }
            """,
            new { input = new { conversationId = conversation.Id } });

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.MarkConversationRead.Participant.LastReadAt.Should()
            .NotBeNull();
        response.Data!.MarkConversationRead.Participant.UserId.Should()
            .Be(user.Id);
    }

    private async Task<Notification> SeedNotificationAsync(Guid userId,
        Action<Notification>? customize = null) {
        var notification = NotificationFactory.Create(userId, customize);
        using var scope = Fixture.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        context.Notifications.Add(notification);
        await context.SaveChangesAsync();
        return notification;
    }

    private async Task<Conversation> SeedConversationWithParticipantsAsync(
        Guid? bookingId, params Guid[] userIds) {
        var conversation = ConversationFactory.Create(bookingId);
        using var scope = Fixture.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        context.Conversations.Add(conversation);
        await context.SaveChangesAsync();

        foreach (var userId in userIds) {
            var participant =
                ConversationParticipantFactory.Create(conversation.Id, userId);
            context.ConversationParticipants.Add(participant);
        }

        await context.SaveChangesAsync();

        return conversation;
    }
}