"use client";
import { useState } from "react";
import { z } from "zod";
import { signInSchema } from "@/dto/signIn.dto";
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
import { signIn } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

const formSchema = signInSchema;

export default function SignInPage() {
  const { toast } = useToast();
  const router = useRouter();

  // Make an "isSubmitting" state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Define the form using "react-hook-form"
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  });

  // Define the submit handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    // Call the signIn function from AuthJS
    const result = await signIn("credentials", {
      ...values,
      redirect: false
    });
    setIsSubmitting(false);
    console.log(result);

    // If error is returned, show toast
    if (result?.error) {
      toast({
        title: "Sign In Failed",
        description: "Incorrect Username or Password",
        variant: "destructive"
      });
    } else {
      // If no error is returned, show toast
      toast({
        title: "Sign In Successful"
      });

      // Redirect to dashboard
      router.replace("/dashboard");
    }

    // If the result object contains a non-null url, redirect to "/dashboard"
    if (result?.url) {
    }

    console.log(result);
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Sign In
          </CardTitle>
          <CardDescription>Login to access your Dashboard.</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  This is your username.
                </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
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
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full mt-4"
                >
                  {isSubmitting ? (
                    <LoaderCircle size={20} className="animate-spin" />
                  ) : (
                    "Sign In"
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
