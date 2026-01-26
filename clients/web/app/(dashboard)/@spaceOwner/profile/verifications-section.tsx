import { FragmentType, getFragmentData, graphql } from "@/types/gql";
import { IconCheck } from "@tabler/icons-react";

export const VerificationsSection_UserFragment = graphql(`
  fragment VerificationsSection_UserFragment on User {
    email
    phone
    spaceOwnerProfile {
      onboardingComplete
    }
  }
`);

type Props = {
  data: FragmentType<typeof VerificationsSection_UserFragment>;
};

export default function VerificationsSection({ data }: Props) {
  const user = getFragmentData(VerificationsSection_UserFragment, data);
  const profile = user.spaceOwnerProfile!;

  const verifications = [
    {
      label: "Identity",
      verified: profile.onboardingComplete,
    },
    {
      label: "Email address",
      verified: !!user.email,
    },
    {
      label: "Phone number",
      verified: !!user.phone,
    },
  ];

  const verifiedCount = verifications.filter((v) => v.verified).length;

  if (verifiedCount === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">
        {user.spaceOwnerProfile ? `${user.email.split("@")[0]}'s` : "Your"}{" "}
        confirmed information
      </h2>
      <ul className="flex flex-col gap-2">
        {verifications
          .filter((v) => v.verified)
          .map((item) => (
            <li key={item.label} className="flex items-center gap-3">
              <IconCheck className="text-foreground size-5" />
              <span>{item.label}</span>
            </li>
          ))}
      </ul>
    </div>
  );
}