"use client";
import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { verifyCodeSchema } from "@/dto/verifyCodeSchema.dto";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { sendVerificationData, submitPasswordChange } from "./actions";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot
} from "@/components/ui/input-otp";
import { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";

function VerifyCodePage() {
  // Initialize the OTP state to trigger the "verify-code" fetch
  const [otp, setOtp] = React.useState("");

  // Initialize the toast and router
  const { toast } = useToast();
  const router = useRouter();

  // Call useSearchParams to get the search params
  const searchParams = useSearchParams();

  // If searchParams doesn't have "username", redirect it to "/sign-up"
  if (!searchParams.has("username")) {
    router.push("/sign-up");
  }

  // Depending on what searchParams are available, design the input object
  const inputObject: z.infer<typeof verifyCodeSchema> = {
    username: searchParams.get("username") || "",
    // If the verifyCode is available in searchParams, take it,
    verifyCode:
      searchParams.get("verifyCode")?.length == 6
        ? searchParams.get("verifyCode")
        : otp.length == 6
          ? otp
          : null,
    password: null,
    repeatPassword: null
  };

  // Define the Query to check if the username needs to be verified
  const {
    data: data_0,
    error: error_0,
    isLoading: isLoading_0
  } = useQuery({
    queryKey: ["verify-code", searchParams.get("username"), inputObject],
    queryFn: () => sendVerificationData(inputObject),
    enabled: searchParams.has("username")
  });

  // Define the Query that runs when OTP needs to be checked
  const {
    data: data_1,
    error: error_1,
    isLoading: isLoading_1
  } = useQuery({
    queryKey: ["verify-code", searchParams.get("username"), otp, inputObject],
    queryFn: () => sendVerificationData(inputObject),
    enabled: otp.length === 6
  });

  // Define the form using "react-hook-form"
  const form = useForm<z.infer<typeof verifyCodeSchema>>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: {
      username: "",
      verifyCode: "",
      password: "",
      repeatPassword: ""
    }
  });

  useEffect(() => {
    if (data_0?.success) form.setValue("username", data_0.data.username);
  }, [data_0, form]);

  // Define the Query to submit the sign up data
  const onSubmit = (data: z.infer<typeof verifyCodeSchema>) => {
    submitForm.mutate(data);
  };

  const submitForm = useMutation({
    mutationFn: (data: z.infer<typeof verifyCodeSchema>) =>
      submitPasswordChange(data),
    onSuccess: (response) => {
      toast({
        title: response.data.showMessage.header,
        description: response.data.showMessage.message,
        variant: response.success ? "default" : "destructive"
      });
      if (response.success) {
        router.push(`/sign-in`);
      }
    },
    onError: (error: AxiosError<ApiResponse>) => {
      toast({
        title: "Error",
        description:
          error.response?.data.message ||
          "Error in verifying user. Please contact support.",
        variant: "destructive"
      });
      console.log(error);
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Verify Email
          </CardTitle>
          <CardDescription>
            Let&#39;s get you verified and set up your new password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading_0 && (
            <div className="flex items-center justify-center">
              <Loader2 className="animate-spin" size={40} />
            </div>
          )}
          {!isLoading_0 && !data_0?.success && (
            <div className="flex flex-col gap-4">
              <p>
                {data_0.data.showMessage.header}.{" "}
                {data_0.data.showMessage.message}
              </p>
              <Button
                onClick={() => {
                  router.push("/sign-in");
                }}
              >
                Sign In
              </Button>
              <Button
                onClick={() => {
                  router.push("/sign-up");
                }}
              >
                Sign Up
              </Button>
            </div>
          )}
          {!isLoading_0 && data_0?.success && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <p className="mb-2">
                  Hello, {data_0?.data.fullName}. Enter your OTP to verify your
                  email.
                </p>
                {false && (
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        {/* <FormDescription>
                      This is your public display name.
                    </FormDescription> */}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="verifyCode"
                  render={({ field }) => (
                    <FormItem>
                      {/* <FormLabel>Username</FormLabel> */}
                      <FormControl>
                        <InputOTP
                          maxLength={6}
                          disabled={
                            isLoading_1 ||
                            data_1?.message == "Verification code match"
                          }
                          {...field}
                          value={field.value || ""}
                          onChange={(value) => {
                            field.onChange(value);
                            setOtp(value);
                          }}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                          </InputOTPGroup>
                          <InputOTPSeparator />
                          <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      {/* <FormDescription>
                      This is your public display name.
                    </FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {isLoading_1 && (
                  <div className="flex items-center justify-center">
                    <Loader2 className="animate-spin" size={40} />
                  </div>
                )}
                {!isLoading_1 &&
                  data_1?.message == "Verification code match" && (
                    <section className="space-y-4">
                      <Separator className="my-4" />
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            {/* <FormDescription>
                      This is your public display name.
                    </FormDescription> */}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="repeatPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Repeat Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            {/* <FormDescription>
                      This is your public display name.
                    </FormDescription> */}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div>
                        <Button type="submit" className="w-full mt-4">
                          {submitForm.isPending ? (
                            <Loader2 className="animate-spin" size={20} />
                          ) : (
                            "Set New Password"
                          )}
                        </Button>
                      </div>
                    </section>
                  )}
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default VerifyCodePage;
