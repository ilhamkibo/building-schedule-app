"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { LoginSchema, loginSchema } from "@/validators/login-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Image from "next/image";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { login, isLoggingIn } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "admin",
      password: "password",
    },
  });

  const onSubmit = (data: LoginSchema) => {
    login(data);
  };

  const onInvalid = () => {
    const firstError =
      errors.username?.message ||
      errors.password?.message ||
      "Form tidak valid";

    toast.error(firstError);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex items-center gap-2">
        <Image
          src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/images/dunlop-logo.jpg`}
          alt="Sumi Rubber Indonesia Logo"
          width={70}
          height={70}
          className="rounded-lg"
          unoptimized
        />
        <div className="">
          <h1 className="text-2xl font-bold">Building Schedule App</h1>
          <h1 className="text-xl font-bold text-muted-foreground">PT. Sumi Rubber Indonesia</h1>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your username below to login
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
            <FieldGroup>
              <Field>
                <FieldLabel>Username</FieldLabel>
                <Input placeholder="Username" {...register("username")} />
              </Field>


              <Field>
                <FieldLabel>Password</FieldLabel>
                <Input type="password" placeholder="Password" {...register("password")} />
              </Field>

              <Field>
                <Button type="submit" disabled={isSubmitting || isLoggingIn}>
                  {isSubmitting || isLoggingIn ? "Logging in..." : "Login"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
