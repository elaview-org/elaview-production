import Modal from "@/components/modal";
import SignupForm from "@/app/(auth)/signup/signup-form";

export default function Page() {
  return (
    <Modal size="sm">
      <SignupForm />
    </Modal>
  );
}
