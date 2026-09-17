import { SignUp as ClerkSignUp } from "@clerk/react";

function SignUp() {
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
            Create your medical workspace
          </p>
        </div>

        <div className="flex justify-center">
          <ClerkSignUp
            routing="path"
            path="/sign-up"
            signInUrl="/sign-in"
            fallbackRedirectUrl="/dashboard"
          />
        </div>
      </div>
    </main>
  );
}

export default SignUp;