import { useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import BrandLogo from './BrandLogo';

const storageKey = 'adultgen_age_gate';

type GateState = 'allowed' | 'prompt' | 'denied';

function readStoredGate(): GateState {
  try {
    const stored = window.localStorage.getItem(storageKey);
    if (stored === 'allowed') return 'allowed';
    if (stored === 'denied') return 'denied';
  } catch {
    return 'prompt';
  }

  return 'prompt';
}

function writeStoredGate(value: 'allowed' | 'denied') {
  try {
    window.localStorage.setItem(storageKey, value);
  } catch {
    /* localStorage can be unavailable in private browsing or strict modes */
  }
}

export default function AgeGate({ children }: { children: ReactNode }) {
  const [gateState, setGateState] = useState<GateState>(() => readStoredGate());
  const [age, setAge] = useState('');
  const [error, setError] = useState('');

  function submitAge(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsedAge = Number.parseInt(age, 10);

    if (!Number.isFinite(parsedAge) || parsedAge < 1 || parsedAge > 120) {
      setError('Enter a valid age.');
      return;
    }

    if (parsedAge < 18) {
      writeStoredGate('denied');
      setGateState('denied');
      return;
    }

    writeStoredGate('allowed');
    setGateState('allowed');
  }

  if (gateState === 'allowed') {
    return children;
  }

  return (
    <main className="min-h-screen bg-[#050505] px-6 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-[520px] items-center justify-center">
        <section className="glass-card w-full p-7 text-center md:p-9">
          <div className="mb-8 flex justify-center">
            <BrandLogo />
          </div>

          {gateState === 'denied' ? (
            <>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[2px] text-[#8338ec]">
                Age restricted
              </p>
              <h1 className="text-3xl font-semibold tracking-[-1px] text-white">
                Access unavailable
              </h1>
              <p className="mx-auto mt-4 max-w-[360px] text-sm leading-relaxed text-[#888888]">
                AdultGen AI is intended only for adults who are at least 18 years old
                or the age of legal majority in their jurisdiction, whichever is higher.
              </p>
              <a
                href="https://www.google.com"
                className="mt-7 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#111111] transition-all duration-300 hover:scale-[1.02]"
              >
                Exit site
              </a>
            </>
          ) : (
            <>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[2px] text-[#8338ec]">
                Adults only
              </p>
              <h1 className="text-3xl font-semibold tracking-[-1px] text-white">
                Enter your age to continue
              </h1>
              <p className="mx-auto mt-4 max-w-[380px] text-sm leading-relaxed text-[#888888]">
                AdultGen AI is an adult-oriented website for verified adults. You must
                be at least 18 years old, or the age of legal majority where you live,
                to enter.
              </p>
              <form onSubmit={submitAge} className="mt-7 grid gap-4">
                <label className="sr-only" htmlFor="age-gate-age">
                  Age
                </label>
                <input
                  id="age-gate-age"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={120}
                  value={age}
                  onChange={(event) => {
                    setAge(event.target.value);
                    setError('');
                  }}
                  placeholder="Your age"
                  className="min-h-[52px] rounded-2xl border border-white/10 bg-white/[0.07] px-4 text-center text-base font-medium text-white outline-none transition-colors placeholder:text-[#777777] focus:border-[#8338ec]/60"
                />
                {error && (
                  <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-[#b42318]">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#111111] transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                >
                  Enter AdultGen AI
                </button>
              </form>
              <p className="mx-auto mt-5 max-w-[360px] text-xs leading-relaxed text-[#aaaaaa]">
                By entering, you confirm that accessing adult-oriented websites is legal
                in your jurisdiction.
              </p>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
