"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  // Initialize router
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center gap-4 p-24">
      Pragati Logistics Main Website (Planned)
      <Button onClick={() => router.push("/sign-in")}>Sign In</Button>
      <Button onClick={() => router.push("/sign-up")}>Sign Up</Button>
    </main>
  );
}
