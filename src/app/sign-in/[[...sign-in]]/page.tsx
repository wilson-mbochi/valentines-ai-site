import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#0c0a0f] flex items-center justify-center px-4">
      <SignIn
        appearance={{
          variables: {
            colorPrimary: "#e11d48",
            colorBackground: "#18181b",
            colorText: "#fafafa",
            colorInputBackground: "#27272a",
            colorInputText: "#fafafa",
            borderRadius: "0.75rem",
          },
        }}
        afterSignInUrl="/demo"
        signUpUrl="/sign-up"
      />
    </div>
  );
}
