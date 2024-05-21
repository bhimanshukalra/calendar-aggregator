import { Schedule, SignInButton } from "@/components";
import React from "react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-5">
      <div className="flex flex-col w-full lg:w-4/5">
        <SignInButton />
        <div className="mt-10" />
        <Schedule />
      </div>
    </main>
  );
}
