"use client";
import { useState } from "react";
import { z } from "zod";
import { signUpSchema } from "@/dto/signUp.dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useDebounceCallback } from "usehooks-ts";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { CircleCheck, CircleX, LoaderCircle } from "lucide-react";
import { checkUsernameUnique, submitSignUpData } from "@/app/sign-up/actions";
import { useMutation, useQuery } from "@tanstack/react-query";
import { usernameValidation } from "@/dto/common.dto";

export default function SignUpPage() {
  // Initialize the toast and router
  const { toast } = useToast();
  const router = useRouter();

  // Define the form using "react-hook-form"
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      fullName: "",
      email: ""
    }
  });

  // Maintain the state of the "username" field to throw to "check-username-unique" route
  const [username, setUsername] = useState("");

  // Delay 500ms before changing calling setUsername
  const debounced = useDebounceCallback(setUsername, 500);

  // Define the Query to check if the username is unique
  const {
    data: checkUsernameData,
    error: checkUsernameError,
    isLoading: isCheckingUsername,
    isError: checkUsernameIsError
  } = useQuery({
    queryKey: ["check-username-unique", username],
    queryFn: () => checkUsernameUnique(username),
    enabled: usernameValidation.safeParse(username).success
  });

  // Define the Query to submit the sign up data
  const onSubmit = (data: z.infer<typeof signUpSchema>) => {
    submitSignUp.mutate(data);
  };

  const submitSignUp = useMutation({
    mutationFn: (data: z.infer<typeof signUpSchema>) => submitSignUpData(data),
    onSuccess: (response) => {
      toast({
        title: response.data.showMessage.header,
        description: response.data.showMessage.message,
        variant: response.success ? "default" : "destructive"
      });
      if (response.success) {
        router.push(`/verify-email?username=${response.data.username}`);
      }
    },
    onError: (error: AxiosError<ApiResponse>) => {
      toast({
        title: "Error",
        description:
          error.response?.data.message ||
          "Error in registering user. Please contact support.",
        variant: "destructive"
      });
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Sign Up
          </CardTitle>
          <CardDescription>
            Register here to create your account. Then, verify your email to set
            a password.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          debounced(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormDescription
                      className={`flex gap-2 ${checkUsernameData && (checkUsernameData.success ? "text-green-600" : "text-red-600")}`}
                    >
                      {isCheckingUsername ? (
                        <LoaderCircle size={20} className="animate-spin" />
                      ) : checkUsernameData ? (
                        checkUsernameData.message
                      ) : (
                        "Username must be unique."
                      )}
                      {checkUsernameData &&
                        (checkUsernameData.success ? (
                          <CircleCheck size={20} />
                        ) : (
                          <CircleX size={20} />
                        ))}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    {/* <FormDescription>
                  This is your username.
                </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    {/* <FormDescription>
                  This is your password.
                </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <Button
                  disabled={
                    submitSignUp.isPending ||
                    isCheckingUsername ||
                    checkUsernameData?.message === "Username already exists."
                  }
                  className="w-full mt-4"
                  type="submit"
                >
                  {submitSignUp.isPending ? (
                    <LoaderCircle size={20} className="animate-spin" />
                  ) : (
                    "Register"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
