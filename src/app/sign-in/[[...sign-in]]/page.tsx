import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <SignIn
        appearance={{
          elements: {
            rootBox: 'mx-auto',
            card: 'glass-strong !bg-dark-900/90 border border-white/10',
          },
        }}
      />
    </div>
  );
}
