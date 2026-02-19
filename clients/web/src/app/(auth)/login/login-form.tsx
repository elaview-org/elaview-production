"use client";

import { Button } from "@/components/primitives/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/primitives/field";
import { Input } from "@/components/primitives/input";
import api from "@/api/client";

export default function LoginForm() {
  const [state, action, pending] = api.auth.useLogin();

  return (
    <form className={"flex flex-col gap-6"} action={action}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            name={"email"}
            type="email"
            placeholder="m@example.com"
            defaultValue={state.data.email}
            required
          />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            {/*todo*/}
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            name={"password"}
            type="password"
            defaultValue={state.data.password}
            required
          />
        </Field>
        <Field>
          <p aria-live="polite">{state.message}</p>
        </Field>
        <Field>
          <Button type="submit" disabled={pending}>
            Login
          </Button>
        </Field>
        <FieldSeparator>Or continue with</FieldSeparator>
        <Field>
          <Button variant="outline" type="button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="52 42 88 66">
              <path
                fill="#4285f4"
                d="M58 108h14V74L52 59v43c0 3.32 2.69 6 6 6"
              />
              <path
                fill="#34a853"
                d="M120 108h14c3.32 0 6-2.69 6-6V59l-20 15"
              />
              <path
                fill="#fbbc04"
                d="M120 48v26l20-15v-8c0-7.42-8.47-11.65-14.4-7.2"
              />
              <path fill="#ea4335" d="M72 74V48l24 18 24-18v26L96 92" />
              <path
                fill="#c5221f"
                d="M52 51v8l20 15V48l-5.6-4.2c-5.94-4.45-14.4-.22-14.4 7.2"
              />
            </svg>
            Login with Gmail
          </Button>
          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="underline underline-offset-4">
              Sign up
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
