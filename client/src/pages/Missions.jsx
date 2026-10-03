import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {MISSIONS }from '../data/missions';

export default function Missions() {
  const { user } = useAuth();

const completedMissions = (user?.completedMissions || []).map((id) => {
  const idMap = {
    'first-rush': 'first_rush',
    'speed-runner': 'speed_runner',
    'speed-demon': 'speed_demon',
    'accuracy-protocol': 'accuracy_protocol',
    'zero-error': 'zero_error'
  };

  return idMap[id] || id;
});
const completedCount = MISSIONS.filter((mission) =>
  completedMissions.includes(mission.id)
).length;
  const completionPercent =
    MISSIONS.length > 0
      ? Math.round((completedCount / MISSIONS.length) * 100)
      : 0;

  const totalMissionXP = useMemo(() => {
    return MISSIONS.reduce((total, mission) => {
      return total + mission.xpReward;
    }, 0);
  }, []);

  const earnedMissionXP = useMemo(() => {
    return MISSIONS.reduce((total, mission) => {
      if (completedMissions.includes(mission.id)) {
        return total + mission.xpReward;
      }

      return total;
    }, 0);
  }, [completedMissions]);

  return (
    <div className="min-h-screen bg-[#05070d] text-white px-6 py-8 md:px-10">

      {/* HEADER */}
      <div className="mb-8">
        <div className="text-xs tracking-[0.3em] text-cyan-400 font-semibold mb-2">
          TRAINING // MISSIONS
        </div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">

          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Mission Control
            </h1>

            <p className="text-slate-400 mt-2">
              Complete objectives, improve your typing skills and earn XP.
            </p>
          </div>

          <Link
            to="/test"
            className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-cyan-400 text-black font-bold hover:bg-cyan-300 transition"
          >
            START TYPING RUSH →
          </Link>

        </div>
      </div>


      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

        <div className="border border-cyan-500/30 bg-[#0b1019] rounded-xl p-5">
          <p className="text-xs text-slate-500 tracking-widest">
            MISSIONS
          </p>

          <div className="mt-2 flex items-end gap-2">
            <span className="text-4xl font-bold text-cyan-400">
              {completedCount}
            </span>

            <span className="text-slate-500 mb-1">
              / {MISSIONS.length}
            </span>
          </div>

          <p className="text-sm text-slate-500 mt-2">
            objectives completed
          </p>
        </div>


        <div className="border border-purple-500/30 bg-[#0b1019] rounded-xl p-5">
          <p className="text-xs text-slate-500 tracking-widest">
            MISSION XP
          </p>

          <div className="mt-2">
            <span className="text-4xl font-bold text-purple-400">
              {earnedMissionXP}
            </span>

            <span className="text-slate-500 ml-2">
              / {totalMissionXP}
            </span>
          </div>

          <p className="text-sm text-slate-500 mt-2">
            XP earned from MISSIONS
          </p>
        </div>


        <div className="border border-emerald-500/30 bg-[#0b1019] rounded-xl p-5">
          <p className="text-xs text-slate-500 tracking-widest">
            COMPLETION
          </p>

          <div className="mt-2">
            <span className="text-4xl font-bold text-emerald-400">
              {completionPercent}%
            </span>
          </div>

          <p className="text-sm text-slate-500 mt-2">
            mission progress
          </p>
        </div>

      </div>


      {/* PROGRESS BAR */}
      <div className="border border-slate-800 bg-[#0b1019] rounded-xl p-5 mb-8">

        <div className="flex justify-between items-center mb-3">

          <div>
            <p className="text-xs text-cyan-400 tracking-widest">
              MISSION PROGRESS
            </p>

            <p className="text-sm text-slate-400 mt-1">
              {completedCount} of {MISSIONS.length} objectives completed
            </p>
          </div>

          <span className="text-cyan-400 font-bold">
            {completionPercent}%
          </span>

        </div>

        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">

          <div
            className="h-full bg-cyan-400 transition-all duration-700"
            style={{ width: `${completionPercent}%` }}
          />

        </div>

      </div>


      {/* MISSION LIST */}
      <div>

        <div className="flex items-center justify-between mb-5">

          <div>
            <p className="text-xs text-purple-400 tracking-widest">
              OBJECTIVES
            </p>

            <h2 className="text-2xl font-bold mt-1">
              Active Missions
            </h2>
          </div>

          <div className="text-xs text-slate-500">
            T-RX // MISSIONS
          </div>

        </div>


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {MISSIONS.map((mission) => {

            const completed =
              completedMissions.includes(mission.id);

            return (
              <div
                key={mission.id}
                className={`relative overflow-hidden rounded-xl border p-6 transition ${
                  completed
                    ? 'border-emerald-500/40 bg-emerald-500/[0.04]'
                    : 'border-slate-800 bg-[#0b1019] hover:border-cyan-500/40'
                }`}
              >

                {/* STATUS */}
                <div className="flex items-start justify-between gap-4">

                  <div className="flex items-center gap-4">

                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl ${
                        completed
                          ? 'bg-emerald-400/10 border border-emerald-400/30'
                          : 'bg-slate-800 border border-slate-700'
                      }`}
                    >
                      {completed ? '✓' : '◈'}
                    </div>

                    <div>

                      <h3 className="text-xl font-bold">
                        {mission.title}
                      </h3>

                      <p
                        className={`text-xs mt-1 font-semibold tracking-wider ${
                          completed
                            ? 'text-emerald-400'
                            : 'text-cyan-400'
                        }`}
                      >
                        {completed
                          ? 'MISSION COMPLETE'
                          : 'MISSION AVAILABLE'}
                      </p>

                    </div>

                  </div>


                  {/* XP */}
                  <div className="text-right shrink-0">

                    <div className="text-lg font-bold text-yellow-400">
                      +{mission.xpReward}
                    </div>

                    <div className="text-[10px] text-slate-500 tracking-widest">
                      XP
                    </div>

                  </div>

                </div>


                {/* DESCRIPTION */}
                <div className="mt-5">

                  <p className="text-slate-400 text-sm leading-relaxed">
                    {mission.description}
                  </p>

                </div>


                {/* REQUIREMENT */}
                <div className="mt-5 border border-slate-800 bg-black/20 rounded-lg px-4 py-3">

                  <p className="text-[10px] text-slate-500 tracking-widest mb-1">
                    REQUIREMENT
                  </p>

                  <p className="text-sm text-slate-200">
                    {mission.requirement}
                  </p>

                </div>


                {/* STATUS FOOTER */}
              <div className="mt-5 flex items-center justify-end">
  {completed ? (
    <span className="text-xs font-bold text-emerald-400">
      ✓ COMPLETED
    </span>
  ) : (
    <span className="text-xs font-bold text-cyan-400">
      MISSION AVAILABLE
    </span>
  )}
</div>

              </div>
            );
          })}

        </div>

      </div>


      {/* FOOTER MESSAGE */}
      <div className="mt-8 border border-cyan-500/20 bg-cyan-500/[0.03] rounded-xl p-5">

        <p className="text-xs text-cyan-400 tracking-widest mb-2">
          TRAINING SYSTEM
        </p>

        <p className="text-sm text-slate-400">
          Complete MISSIONS during your typing runs to increase your XP,
          level up and unlock your full TypeRushX training potential.
        </p>

      </div>

    </div>
  );
}

