import { SignIn as ClerkSignIn } from "@clerk/react";

function SignIn() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#09090b] px-4">
      <div className="w-full max-w-md">
        {/* Branding */}
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-teal-400">
            <span className="text-sm font-bold text-zinc-950">
              M
            </span>
          </div>

          <h1 className="mt-4 text-xl font-semibold">
            MEDORA
          </h1>

          <p className="mt-1 text-xs text-zinc-600">
            Medical intelligence
          </p>
        </div>

        <div className="flex justify-center">
          <ClerkSignIn
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
            fallbackRedirectUrl="/dashboard"
          />
        </div>
      </div>
    </main>
  );
}

export default SignIn;