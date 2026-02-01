import { GalleryVerticalEnd } from "lucide-react";
import Image from "next/image";
import LoginForm from "@/app/(auth)/login/login-form";
import { authenticatedRedirect } from "@/lib/auth";

export default async function Page() {
  await authenticatedRedirect();

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Elaview
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          fill
          src="https://picsum.photos/seed/login/1920/1080"
          alt="Login background"
          className="object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
