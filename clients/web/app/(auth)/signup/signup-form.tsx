"use client";

import signup from "./signup.action";
import {Button} from "@/shared/components/ui/button";
import {Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator} from "@/shared/components/ui/field";
import {Input} from "@/shared/components/ui/input";

import {useActionState} from "react";

export default function SignupForm() {
    const [state, action, pending] = useActionState(signup, {
        success: false,
        message: "",
        data: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        }
    });

    return <form className={"flex flex-col gap-6"} action={action}>
        <FieldGroup>
            <div className="flex flex-col items-center gap-1 text-center">
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-muted-foreground text-sm text-balance">
                    Fill in the form below to create your account
                </p>
            </div>
            <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input id="name" name="name" type="text" placeholder="John Doe"
                       defaultValue={state.data.name} required/>
            </Field>
            <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" name="email" type="email" placeholder="m@example.com"
                       defaultValue={state.data.email} required/>
                <FieldDescription>
                    We&apos;ll use this to contact you. We will not share your email
                    with anyone else.
                </FieldDescription>
            </Field>
            <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input id="password" name="password" type="password"
                       defaultValue={state.data.password} required/>
                <FieldDescription>
                    Must be at least 8 characters long.
                </FieldDescription>
            </Field>
            <Field>
                <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
                <Input id="confirm-password" name="confirmPassword" type="password"
                       defaultValue={state.data.confirmPassword} required/>
                <FieldDescription>Please confirm your password.</FieldDescription>
            </Field>
            <Field>
                <p aria-live="polite">{state.message}</p>
            </Field>
            <Field>
                <Button type="submit" disabled={pending}>Create Account</Button>
            </Field>
            <FieldSeparator>Or continue with</FieldSeparator>
            <Field>
                <Button variant="outline" type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="52 42 88 66">
                        <path fill="#4285f4" d="M58 108h14V74L52 59v43c0 3.32 2.69 6 6 6"/>
                        <path fill="#34a853" d="M120 108h14c3.32 0 6-2.69 6-6V59l-20 15"/>
                        <path fill="#fbbc04" d="M120 48v26l20-15v-8c0-7.42-8.47-11.65-14.4-7.2"/>
                        <path fill="#ea4335" d="M72 74V48l24 18 24-18v26L96 92"/>
                        <path fill="#c5221f"
                              d="M52 51v8l20 15V48l-5.6-4.2c-5.94-4.45-14.4-.22-14.4 7.2"/>
                    </svg>
                    Sign up with Gmail
                </Button>
                <FieldDescription className="px-6 text-center">
                    Already have an account? <a href="/login">Sign in</a>
                </FieldDescription>
            </Field>
        </FieldGroup>
    </form>;
}