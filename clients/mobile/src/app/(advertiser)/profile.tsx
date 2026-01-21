import ProfileContent from "@/components/features/ProfileContent";
import { mockUser, mockPaymentMethods } from "@/mocks/user";

export default function Profile() {
  return (
    <ProfileContent
      user={mockUser}
      paymentMethods={mockPaymentMethods}
      perspective="advertiser"
    />
  );
}
