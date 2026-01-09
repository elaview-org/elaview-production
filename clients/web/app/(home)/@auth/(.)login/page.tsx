import Modal from "@/components/modal";
// import LoginPage from "@/app/(auth)/login/page";
import LoginForm from "@/app/(auth)/login/login-form";

export default function Page() {
  return (
    <Modal size="sm">
      <LoginForm />
      {/*<Image*/}
      {/*  width={0}*/}
      {/*  height={0}*/}
      {/*  src="/placeholder.svg"*/}
      {/*  alt="Image"*/}
      {/*  className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"*/}
      {/*/>*/}
    </Modal>
  );
}
