import { LogIn } from 'lucide-react';

type GoogleSignInProps = {
  configured: boolean;
  error?: string;
};

export default function GoogleSignIn({ configured, error }: GoogleSignInProps) {
  return (
    <div className="mx-auto flex max-w-[420px] flex-col items-center text-center">
      <img
        src="/brand/adultgen-logo.png"
        alt="AdultGen AI"
        className="mb-5 h-14 w-14 object-contain"
      />
      <h1 className="text-2xl font-semibold text-white">Your private space is ready.</h1>
      <p className="mt-3 text-sm leading-relaxed text-[#999999]">
        Sign in to start a private conversation with AdultGen Companion. Chat history stays in this browser.
      </p>
      {error && (
        <p className="mt-4 w-full rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      )}
      {configured ? (
        <a
          href="/api/google-login"
          className="mt-6 inline-flex min-h-11 items-center justify-center gap-3 rounded-full bg-white px-5 text-sm font-semibold text-[#111111] transition-colors hover:bg-[#eeeeee]"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-black/10 text-xs font-bold">G</span>
          Continue with Google
        </a>
      ) : (
        <div className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-5 text-sm text-[#aaaaaa]">
          <LogIn size={16} />
          Google sign-in is being configured
        </div>
      )}
      <p className="mt-5 text-xs leading-relaxed text-[#666666]">
        Verified adults only. By continuing, you agree to the{' '}
        <a href="/terms" className="text-[#999999] hover:text-white">Terms</a> and{' '}
        <a href="/privacy" className="text-[#999999] hover:text-white">Privacy Policy</a>.
      </p>
    </div>
  );
}
