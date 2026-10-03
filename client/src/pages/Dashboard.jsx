import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [loadingResults, setLoadingResults] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch('/api/results/my', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setResults(data.results || []);
        }
      } catch (error) {
        console.error('Failed to fetch results:', error);
      } finally {
        setLoadingResults(false);
      }
    };

    fetchResults();
  }, []);

  const totalTests = results.length;

  const bestWpm =
    results.length > 0
      ? Math.max(...results.map((result) => result.wpm))
      : 0;

  const averageAccuracy =
    results.length > 0
      ? Math.round(
          results.reduce((sum, result) => sum + result.accuracy, 0) /
            results.length
        )
      : 0;

  const currentXP = user?.xp || 0;
  const currentLevel = user?.level || 1;

  const getLevelStart = (level) => {
    if (level <= 1) return 0;
    if (level === 2) return 500;
    if (level === 3) return 1200;
    if (level === 4) return 2200;
    if (level === 5) return 3500;

    let threshold = 3500;

    for (let i = 6; i <= level; i++) {
      threshold += 300;
    }

    return threshold;
  };

  const getNextLevel = (level) => {
    if (level === 1) return 500;
    if (level === 2) return 1200;
    if (level === 3) return 2200;
    if (level === 4) return 3500;

    return 3500 + (level - 5) * 300 + 300;
  };

  const levelStart = getLevelStart(currentLevel);
  const nextLevelXP = getNextLevel(currentLevel);

  const xpProgress =
    nextLevelXP > levelStart
      ? Math.min(
          100,
          Math.round(
            ((currentXP - levelStart) / (nextLevelXP - levelStart)) * 100
          )
        )
      : 0;

  const recentResults = results.slice(0, 5);

  return (
    <div className="min-h-full p-5 sm:p-8 lg:p-10">
      {/* Header */}
      <section className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <p className="font-mono text-xs tracking-[0.3em] text-[#00ff88] uppercase mb-2">
              SYSTEM // ONLINE
            </p>

            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              Welcome back,{' '}
              <span className="text-[#00ff88]">
                {user?.name || 'Operator'}
              </span>
            </h1>

            <p className="text-slate-400 mt-2">
              Ready for your next typing challenge?
            </p>
          </div>

          <button
            onClick={() => navigate('/test')}
            className="px-6 py-3 rounded-lg bg-[#00ff88] text-black font-bold hover:bg-[#38ffaa] transition-all shadow-[0_0_20px_rgba(0,255,136,0.2)]"
          >
            START TYPING RUSH →
          </button>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#10141c] border border-[#00ff88]/20 rounded-xl p-5">
          <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">
            Current Level
          </p>
          <div className="mt-2 flex items-end justify-between">
            <span className="text-3xl font-bold text-[#00ff88]">
              {currentLevel}
            </span>
            <span className="text-xs text-slate-500">LVL</span>
          </div>
        </div>

        <div className="bg-[#10141c] border border-cyan-400/20 rounded-xl p-5">
          <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">
            Total XP
          </p>
          <div className="mt-2 flex items-end justify-between">
            <span className="text-3xl font-bold text-cyan-400">
              {currentXP}
            </span>
            <span className="text-xs text-slate-500">XP</span>
          </div>
        </div>

        <div className="bg-[#10141c] border border-purple-400/20 rounded-xl p-5">
          <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">
            Best WPM
          </p>
          <div className="mt-2 flex items-end justify-between">
            <span className="text-3xl font-bold text-purple-400">
              {bestWpm}
            </span>
            <span className="text-xs text-slate-500">WPM</span>
          </div>
        </div>

        <div className="bg-[#10141c] border border-yellow-400/20 rounded-xl p-5">
          <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">
            Accuracy
          </p>
          <div className="mt-2 flex items-end justify-between">
            <span className="text-3xl font-bold text-yellow-400">
              {averageAccuracy}%
            </span>
            <span className="text-xs text-slate-500">AVG</span>
          </div>
        </div>
      </section>

      {/* XP Progress */}
      <section className="bg-[#10141c] border border-slate-800 rounded-xl p-6 mb-6">
        <div className="flex justify-between items-center mb-3">
          <div>
            <p className="font-mono text-xs text-slate-500 uppercase">
              Level Progress
            </p>
            <p className="text-white font-semibold mt-1">
              Level {currentLevel}
            </p>
          </div>

          <span className="font-mono text-sm text-[#00ff88]">
            {currentXP} / {nextLevelXP} XP
          </span>
        </div>

        <div className="h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-[#00ff88] rounded-full transition-all duration-700"
            style={{ width: `${xpProgress}%` }}
          />
        </div>

        <p className="text-xs text-slate-500 mt-2">
          {Math.max(0, nextLevelXP - currentXP)} XP until next level
        </p>
      </section>

      {/* Main Grid */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="xl:col-span-2 bg-[#10141c] border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="font-mono text-xs text-[#00ff88] uppercase tracking-wider">
                Quick Access
              </p>
              <h2 className="text-xl font-bold text-white mt-1">
                Training Console
              </h2>
            </div>

            <span className="text-xs font-mono text-slate-600">
              T-RX // 01
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/test')}
              className="text-left p-5 rounded-xl border border-[#00ff88]/20 bg-[#0b0f14] hover:border-[#00ff88]/50 hover:bg-[#00ff88]/5 transition-all"
            >
              <div className="text-2xl mb-3">⌨</div>
              <h3 className="text-white font-bold">Typing Test</h3>
              <p className="text-sm text-slate-500 mt-1">
                Test speed, accuracy and reaction.
              </p>
              <span className="inline-block mt-4 text-xs font-mono text-[#00ff88]">
                BEGIN RUSH →
              </span>
            </button>

            <button
              onClick={() => navigate('/missions')}
              className="text-left p-5 rounded-xl border border-cyan-400/20 bg-[#0b0f14] hover:border-cyan-400/50 hover:bg-cyan-400/5 transition-all"
            >
              <div className="text-2xl mb-3">🎯</div>
              <h3 className="text-white font-bold">Missions</h3>
              <p className="text-sm text-slate-500 mt-1">
                Complete objectives and earn XP.
              </p>
              <span className="inline-block mt-4 text-xs font-mono text-cyan-400">
                VIEW MISSIONS →
              </span>
            </button>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-[#10141c] border border-slate-800 rounded-xl p-6">
          <p className="font-mono text-xs text-[#00ff88] uppercase tracking-wider">
            System Status
          </p>

          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Authentication</span>
              <span className="text-[#00ff88] text-xs font-mono">
                ● ACTIVE
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Database</span>
              <span className="text-[#00ff88] text-xs font-mono">
                ● ONLINE
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Training Engine</span>
              <span className="text-[#00ff88] text-xs font-mono">
                ● READY
              </span>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <p className="text-xs text-slate-600 font-mono">
                USER // {user?.email}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Results */}
      <section className="bg-[#10141c] border border-slate-800 rounded-xl p-6 mt-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="font-mono text-xs text-cyan-400 uppercase tracking-wider">
              Performance Log
            </p>
            <h2 className="text-xl font-bold text-white mt-1">
              Recent Runs
            </h2>
          </div>

          <span className="text-xs text-slate-600 font-mono">
            {totalTests} TESTS
          </span>
        </div>

        {loadingResults ? (
          <div className="text-sm text-slate-500 font-mono">
            Loading performance data...
          </div>
        ) : recentResults.length === 0 ? (
          <div className="border border-dashed border-slate-800 rounded-lg p-8 text-center">
            <p className="text-slate-500">
              No typing runs recorded yet.
            </p>
            <button
              onClick={() => navigate('/test')}
              className="mt-4 text-[#00ff88] text-sm font-mono hover:underline"
            >
              Start your first run →
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {recentResults.map((result) => (
              <div
                key={result._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0b0f14] border border-slate-800 rounded-lg p-4"
              >
                <div>
                  <p className="text-white font-semibold">
                    {result.wpm} WPM
                  </p>
                  <p className="text-xs text-slate-600 font-mono">
                    {new Date(result.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex gap-5 text-sm">
                  <span className="text-emerald-400">
                    {result.accuracy}% ACC
                  </span>

                  <span className="text-red-400">
                    {result.errors} ERR
                  </span>

                  <span className="text-yellow-400">
                    {result.score} SCORE
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;