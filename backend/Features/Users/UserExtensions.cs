using ElaviewBackend.Data.Entities;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Users;

[ExtendObjectType<User>]
public static class UserExtensions {
    // [Authorize]
    // [BindMember(nameof(User.AdvertiserProfile))]
    // public static AdvertiserProfile? GetAdvertiserProfile([Parent] User user)
    //     => user.AdvertiserProfile;
    //
    // [Authorize]
    // [BindMember(nameof(User.SpaceOwnerProfile))]
    // public static SpaceOwnerProfile? GetSpaceOwnerProfile([Parent] User user)
    //     => user.SpaceOwnerProfile;
}