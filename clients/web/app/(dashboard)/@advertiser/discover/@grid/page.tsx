import SpaceCard from "./space-card";
import Modal from "@/components/modal";
import LoginForm from "@/app/(auth)/login/login-form";
import spaces from "@/app/(dashboard)/@advertiser/discover/spaces.json";

export default function Page() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {spaces.map((space) => (
        <Modal key={space.id} trigger={<SpaceCard {...space} />}>
          <LoginForm />
        </Modal>
      ))}
    </div>
  );
}
