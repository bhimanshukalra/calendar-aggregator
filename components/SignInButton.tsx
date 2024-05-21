"use client";

import { BuiltInProviderType } from "next-auth/providers/index";
import {
  ClientSafeProvider,
  LiteralUnion,
  getProviders,
  signIn,
  signOut,
  useSession,
} from "next-auth/react";
import { useEffect, useState } from "react";

const SignInButton = () => {
  const { data: session } = useSession();

  const [providers, setProviders] = useState<Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null>(null);

  useEffect(() => {
    const setupProviders = async () => {
      const response = await getProviders();
      setProviders(response);
    };
    setupProviders();
  }, []);

  return (
    <div className="flex self-end flex-col justify-ends">
      {providers &&
        Object.values(providers).map((provider) => (
          <button
            type="button"
            key={provider.name}
            onClick={() => {
              if (session?.user?.email) {
                signOut();
              } else {
                signIn(provider.id);
              }
            }}
            className="rounded-full bg-blue-400 py-1 px-3 hover:text-red-700 mb-1"
          >
            {session?.user?.email ? "Sign Out" : "Sign In"}
          </button>
        ))}
      {session?.user?.email && <p>session: {session?.user?.email}</p>}
    </div>
  );
};

export default SignInButton;
