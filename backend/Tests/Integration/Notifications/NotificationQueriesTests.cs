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
public sealed class NotificationQueriesTests(IntegrationTestFixture fixture)
    : IntegrationTestBase(fixture) {
    [Fact]
    public async Task GetMyNotifications_ReturnsNotifications() {
        var user = await CreateAndLoginUserAsync();
        await SeedNotificationAsync(user.Id);
        await SeedNotificationAsync(user.Id);

        var response = await Client.QueryAsync<MyNotificationsResponse>("""
            query {
                myNotifications {
                    nodes {
                        id
                        type
                        title
                        body
                        isRead
                    }
                }
            }
            """);

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.MyNotifications.Nodes.Should().HaveCount(2);
    }

    [Fact]
    public async Task GetMyNotifications_Unauthenticated_ReturnsAuthError() {
        var response = await Client.QueryAsync<MyNotificationsResponse>("""
            query {
                myNotifications {
                    nodes {
                        id
                    }
                }
            }
            """);

        response.Errors.Should().NotBeNullOrEmpty();
        response.Errors!.Should().ContainSingle()
            .Which.Extensions.Should().ContainKey("code")
            .WhoseValue?.ToString().Should().Be("AUTH_NOT_AUTHENTICATED");
    }

    [Fact]
    public async Task GetUnreadNotificationsCount_ReturnsCorrectCount() {
        var user = await CreateAndLoginUserAsync();
        await SeedNotificationAsync(user.Id);
        await SeedNotificationAsync(user.Id);
        await SeedNotificationAsync(user.Id, n => {
            n.IsRead = true;
            n.ReadAt = DateTime.UtcNow;
        });

        var response =
            await Client.QueryAsync<UnreadNotificationsCountResponse>("""
                query {
                    unreadNotificationsCount
                }
                """);

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.UnreadNotificationsCount.Should().Be(2);
    }

    [Fact]
    public async Task GetNotificationById_ReturnsNotification() {
        var user = await CreateAndLoginUserAsync();
        var notification = await SeedNotificationAsync(user.Id);

        var response = await Client.QueryAsync<NotificationByIdResponse>("""
                query($id: ID!) {
                    notificationById(id: $id) {
                        id
                        type
                        title
                        body
                        isRead
                    }
                }
                """,
            new { id = notification.Id });

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.NotificationById.Should().NotBeNull();
        response.Data!.NotificationById!.Id.Should().Be(notification.Id);
    }

    [Fact]
    public async Task GetNotificationById_OtherUser_ReturnsNull() {
        var user = await CreateAndLoginUserAsync();
        var (otherUser, _) = await SeedAdvertiserAsync();
        var notification = await SeedNotificationAsync(otherUser.Id);

        var response = await Client.QueryAsync<NotificationByIdResponse>("""
                query($id: ID!) {
                    notificationById(id: $id) {
                        id
                    }
                }
                """,
            new { id = notification.Id });

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.NotificationById.Should().BeNull();
    }

    [Fact]
    public async Task GetNotificationById_NonExistent_ReturnsNull() {
        var user = await CreateAndLoginUserAsync();

        var response = await Client.QueryAsync<NotificationByIdResponse>("""
                query($id: ID!) {
                    notificationById(id: $id) {
                        id
                    }
                }
                """,
            new { id = Guid.NewGuid() });

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.NotificationById.Should().BeNull();
    }

    [Fact]
    public async Task GetMyNotificationPreferences_ReturnsPreferences() {
        var user = await CreateAndLoginUserAsync();
        await SeedNotificationPreferenceAsync(user.Id,
            NotificationType.BookingRequested);
        await SeedNotificationPreferenceAsync(user.Id,
            NotificationType.PaymentReceived);

        var response =
            await Client.QueryAsync<MyNotificationPreferencesResponse>("""
                query {
                    myNotificationPreferences {
                        id
                        notificationType
                        emailEnabled
                        pushEnabled
                        inAppEnabled
                    }
                }
                """);

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.MyNotificationPreferences.Should().HaveCount(2);
    }

    [Fact]
    public async Task GetMyConversations_ReturnsConversations() {
        var user = await CreateAndLoginUserAsync();
        var (otherUser, _) = await SeedAdvertiserAsync();
        var conversation =
            await SeedConversationWithParticipantsAsync(null, user.Id,
                otherUser.Id);

        var response = await Client.QueryAsync<MyConversationsResponse>("""
            query {
                myConversations {
                    nodes {
                        id
                        bookingId
                        updatedAt
                    }
                }
            }
            """);

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.MyConversations.Nodes.Should().HaveCount(1);
        response.Data!.MyConversations.Nodes.First().Id.Should()
            .Be(conversation.Id);
    }

    [Fact]
    public async Task GetMyConversations_NotParticipant_ReturnsEmpty() {
        var user = await CreateAndLoginUserAsync();
        var (user1, _) = await SeedAdvertiserAsync();
        var (user2, _) = await SeedSpaceOwnerAsync();
        await SeedConversationWithParticipantsAsync(null, user1.Id, user2.Id);

        var response = await Client.QueryAsync<MyConversationsResponse>("""
            query {
                myConversations {
                    nodes {
                        id
                    }
                }
            }
            """);

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.MyConversations.Nodes.Should().BeEmpty();
    }

    [Fact]
    public async Task GetMyConversations_Unauthenticated_ReturnsAuthError() {
        var response = await Client.QueryAsync<MyConversationsResponse>("""
            query {
                myConversations {
                    nodes {
                        id
                    }
                }
            }
            """);

        response.Errors.Should().NotBeNullOrEmpty();
        response.Errors!.Should().ContainSingle()
            .Which.Extensions.Should().ContainKey("code")
            .WhoseValue?.ToString().Should().Be("AUTH_NOT_AUTHENTICATED");
    }

    [Fact]
    public async Task GetMyNotifications_OnlyReturnsOwnNotifications() {
        var user = await CreateAndLoginUserAsync();
        var (otherUser, _) = await SeedAdvertiserAsync();
        await SeedNotificationAsync(user.Id);
        await SeedNotificationAsync(otherUser.Id);
        await SeedNotificationAsync(otherUser.Id);

        var response = await Client.QueryAsync<MyNotificationsResponse>("""
            query {
                myNotifications {
                    nodes {
                        id
                    }
                }
            }
            """);

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.MyNotifications.Nodes.Should().HaveCount(1);
    }

    [Fact]
    public async Task GetUnreadConversationsCount_ReturnsCorrectCount() {
        var user = await CreateAndLoginUserAsync();
        var (otherUser, _) = await SeedAdvertiserAsync();
        var conversation =
            await SeedConversationWithParticipantsAsync(null, user.Id,
                otherUser.Id);
        await SeedMessageAsync(conversation.Id, otherUser.Id);

        var response =
            await Client.QueryAsync<UnreadConversationsCountResponse>("""
                query {
                    unreadConversationsCount
                }
                """);

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.UnreadConversationsCount.Should().Be(1);
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

    private async Task<Message> SeedMessageAsync(Guid conversationId,
        Guid senderUserId) {
        var message = MessageFactory.Create(conversationId, senderUserId);
        using var scope = Fixture.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        context.Messages.Add(message);
        await context.SaveChangesAsync();
        return message;
    }

    private async Task<NotificationPreference> SeedNotificationPreferenceAsync(
        Guid userId, NotificationType notificationType) {
        var preference =
            NotificationPreferenceFactory.Create(userId, notificationType);
        using var scope = Fixture.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        context.NotificationPreferences.Add(preference);
        await context.SaveChangesAsync();
        return preference;
    }
}