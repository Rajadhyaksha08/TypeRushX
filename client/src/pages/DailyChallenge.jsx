import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

function DailyChallenge() {
  const { token } = useAuth();

  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [completedToday, setCompletedToday] = useState(false);
  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const response = await fetch('/api/daily-challenge', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to load challenge');
        }

        setChallenge(data.challenge);
        setCompletedToday(data.completedToday);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchChallenge();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05070d] text-white p-8">
        <p className="text-cyan-400 font-mono">
          LOADING DAILY CHALLENGE...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#05070d] text-white p-8">
        <p className="text-red-400">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070d] text-white px-6 py-8">
      <div className="mx-auto max-w-5xl">

        <div className="mb-10">
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-cyan-400">
            DAILY // CHALLENGE
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Daily Typing Challenge
          </h1>

          <p className="mt-2 text-slate-400">
            Complete today's challenge and earn bonus XP.
          </p>
        </div>

        <div className="rounded-2xl border border-cyan-500/20 bg-[#0a0f18] p-6">

        {completedToday ? (
  <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5">
    <p className="text-xs font-mono tracking-widest text-emerald-400">
      DAILY // COMPLETE
    </p>

    <p className="mt-1 text-lg font-bold text-white">
      Challenge Completed Today ✓
    </p>

    <p className="mt-1 text-sm text-slate-500">
      You have already earned today's Daily Challenge reward.
    </p>
  </div>
) : (
  <div className="mb-6 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5">
    <p className="text-xs font-mono tracking-widest text-cyan-400">
      DAILY // AVAILABLE
    </p>

    <p className="mt-1 text-lg font-bold text-white">
      Today's challenge is ready.
    </p>

    <p className="mt-1 text-sm text-slate-500">
      Complete the target to earn bonus XP.
    </p>
  </div>
)}

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-8">

            <div className="rounded-xl border border-slate-800 bg-black/20 p-4">
              <p className="text-xs text-slate-500">TIME</p>
              <p className="mt-1 text-2xl font-bold text-cyan-400">
                {challenge.duration}s
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-black/20 p-4">
              <p className="text-xs text-slate-500">TARGET WPM</p>
              <p className="mt-1 text-2xl font-bold text-purple-400">
                {challenge.targetWPM}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-black/20 p-4">
              <p className="text-xs text-slate-500">TARGET ACCURACY</p>
              <p className="mt-1 text-2xl font-bold text-emerald-400">
                {challenge.targetAccuracy}%
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-black/20 p-4">
              <p className="text-xs text-slate-500">REWARD</p>
              <p className="mt-1 text-2xl font-bold text-yellow-400">
                +{challenge.xpReward} XP
              </p>
            </div>

          </div>

          <div className="rounded-xl border border-slate-800 bg-[#05070d] p-6">

            <p className="mb-4 text-xs font-mono uppercase tracking-widest text-slate-500">
              TODAY'S PASSAGE
            </p>

            <p className="text-lg leading-8 text-slate-300">
              {challenge.passage}
            </p>

          </div>

        {completedToday ? (
  <div className="mt-6 w-full rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-6 py-5 text-center">
    <p className="font-semibold text-emerald-400">
      ✓ DAILY CHALLENGE COMPLETED
    </p>

    <p className="mt-1 text-xs text-slate-500">
      Come back tomorrow for a new challenge.
    </p>
  </div>
) : (
  <button
    onClick={() => {
      window.location.href = '/test?mode=daily';
    }}
    className="mt-6 w-full rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-6 py-4 font-semibold text-cyan-300 transition hover:bg-cyan-400/20"
  >
    START DAILY CHALLENGE →
  </button>
)}

        </div>

      </div>
    </div>
  );
}

export default DailyChallenge;