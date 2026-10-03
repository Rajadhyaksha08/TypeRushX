import { useEffect, useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { generateRecommendations } from '../utils/recommendationEngine';

function Results() {
  const { token } = useAuth();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const analytics = useMemo(() => {
  if (results.length === 0) {
    return {
      bestWPM: 0,
      averageWPM: 0,
      averageAccuracy: 0,
      totalRuns: 0,
      totalErrors: 0,
      totalCharacters: 0
    };
  }

  const totalWPM = results.reduce(
    (total, result) => total + Number(result.wpm || 0),
    0
  );

  const totalAccuracy = results.reduce(
    (total, result) => total + Number(result.accuracy || 0),
    0
  );

  const totalErrors = results.reduce(
    (total, result) => total + Number(result.errors || 0),
    0
  );

  const totalCharacters = results.reduce(
    (total, result) => total + Number(result.totalCharacters || 0),
    0
  );

  return {
    bestWPM: Math.max(
      ...results.map((result) => Number(result.wpm || 0))
    ),

    averageWPM: Math.round(totalWPM / results.length),

    averageAccuracy: Math.round(
      totalAccuracy / results.length
    ),

    totalRuns: results.length,

    totalErrors,

    totalCharacters
  };
}, [results]);
  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch('/api/results/my', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || 'Failed to fetch results'
          );
        }

        setResults(data.results || []);
      } catch (err) {
        console.error('Failed to fetch results:', err);
        setError(err.message || 'Failed to load results');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchResults();
    }
  }, [token]);
  const chartData = useMemo(() => {
  return [...results]
    .reverse()
    .map((result, index) => ({
      run: index + 1,
      wpm: Number(result.wpm || 0),
      accuracy: Number(result.accuracy || 0)
    }));
}, [results]);
const weakKeys = useMemo(() => {
  const keyTotals = {};

  results.forEach((result) => {
    if (!result.keyErrors) return;

    Object.entries(result.keyErrors).forEach(([key, count]) => {
      keyTotals[key] = (keyTotals[key] || 0) + Number(count || 0);
    });
  });

  return Object.entries(keyTotals)
    .map(([key, errors]) => ({
      key,
      errors
    }))
    .sort((a, b) => b.errors - a.errors)
    .slice(0, 8);
}, [results]);
const recommendations = useMemo(() => {
  return generateRecommendations(weakKeys);
}, [weakKeys]);
const insights = useMemo(() => {
  if (results.length === 0) {
    return [];
  }

  const bestWPM = Math.max(
    ...results.map((result) => Number(result.wpm || 0))
  );

  const averageWPM =
    results.reduce(
      (total, result) => total + Number(result.wpm || 0),
      0
    ) / results.length;

  const averageAccuracy =
    results.reduce(
      (total, result) => total + Number(result.accuracy || 0),
      0
    ) / results.length;

  const insightList = [];

  // Speed insight
  if (averageWPM >= 70) {
    insightList.push({
      icon: '⚡',
      title: 'High-Speed Operator',
      text: `Your average speed is ${Math.round(
        averageWPM
      )} WPM. You are operating at a high typing speed.`
    });
  } else if (averageWPM >= 50) {
    insightList.push({
      icon: '⚡',
      title: 'Strong Speed',
      text: `Your average speed is ${Math.round(
        averageWPM
      )} WPM. Keep training to push beyond 70 WPM.`
    });
  } else {
    insightList.push({
      icon: '⚡',
      title: 'Speed Development',
      text: `Your average speed is ${Math.round(
        averageWPM
      )} WPM. Focus on consistency and gradually push toward higher speed.`
    });
  }

  // Accuracy insight
  if (averageAccuracy >= 95) {
    insightList.push({
      icon: '🎯',
      title: 'Precision Protocol',
      text: `Your average accuracy is ${Math.round(
        averageAccuracy
      )}%. Your typing precision is excellent.`
    });
  } else if (averageAccuracy >= 90) {
    insightList.push({
      icon: '🎯',
      title: 'Good Accuracy',
      text: `Your average accuracy is ${Math.round(
        averageAccuracy
      )}%. Try reducing mistakes while increasing speed.`
    });
  } else {
    insightList.push({
      icon: '🎯',
      title: 'Accuracy Training',
      text: `Your average accuracy is ${Math.round(
        averageAccuracy
      )}%. Focus on accuracy before pushing your speed higher.`
    });
  }

  // Trend insight
  if (results.length < 5) {
    insightList.push({
      icon: '📊',
      title: 'Training Data',
      text: 'Complete a few more typing runs to unlock a meaningful performance trend.'
    });
  } else {
    const chronological = [...results].reverse();

    const midpoint = Math.floor(chronological.length / 2);

    const earlierRuns = chronological.slice(0, midpoint);
    const recentRuns = chronological.slice(midpoint);

    const earlierAverage =
      earlierRuns.reduce(
        (total, result) => total + Number(result.wpm || 0),
        0
      ) / earlierRuns.length;

    const recentAverage =
      recentRuns.reduce(
        (total, result) => total + Number(result.wpm || 0),
        0
      ) / recentRuns.length;

    const difference = recentAverage - earlierAverage;

    if (difference >= 3) {
      insightList.push({
        icon: '📈',
        title: 'Positive Trend',
        text: `Your recent average is about ${Math.round(
          difference
        )} WPM higher than your earlier runs.`
      });
    } else if (difference <= -3) {
      insightList.push({
        icon: '📉',
        title: 'Speed Fluctuation',
        text: `Your recent average is about ${Math.round(
          Math.abs(difference)
        )} WPM lower than your earlier runs. Focus on consistency.`
      });
    } else {
      insightList.push({
        icon: '📊',
        title: 'Stable Performance',
        text: 'Your typing speed has remained relatively stable across recent runs.'
      });
    }
  }

  // Next target
  const nextTarget = Math.max(
    50,
    Math.ceil((bestWPM + 5) / 5) * 5
  );

  insightList.push({
    icon: '🚀',
    title: 'Next Target',
    text: `Your best is ${bestWPM} WPM. Aim for ${nextTarget} WPM in your next training runs.`
  });

  return insightList;
}, [results]);

  return (

    <div className="min-h-screen bg-[#05070d] text-white px-4 py-8 sm:px-6 lg:px-8">
  <div className="mx-auto max-w-7xl">
      {/* HEADER */}
      <div className="mb-8">

        <div className="text-xs tracking-[0.3em] text-cyan-400 font-semibold mb-2">
          PERFORMANCE // RESULTS
        </div>

        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Training Results
        </h1>

        <p className="text-slate-400 mt-2">
          Review your typing performance and track your progress.
        </p>

      </div>

      {/* ANALYTICS OVERVIEW */}
{!loading && !error && results.length > 0 && (
<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 mb-10">
    {/* BEST WPM */}
    <div className="border border-slate-800/80 bg-[#0a0f18] rounded-2xl p-5
    transition-all duration-300 hover:-translate-y-1 hover:border-slate-700 hover:bg-[#0d131e]">
      <p className="text-xs text-slate-500 tracking-widest">
        BEST WPM
      </p>

      <div className="mt-2 flex items-end gap-2">
        <span className="text-4xl font-bold tracking-tight text-purple-400">
          {analytics.bestWPM}
        </span>

        <span className="text-slate-500 mb-1">
          WPM
        </span>
      </div>

      <p className="text-sm text-slate-500 mt-2">
        fastest recorded run
      </p>
    </div>


    {/* AVERAGE WPM */}
    <div className="className=border border-slate-800/80 bg-[#0a0f18] rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-slate-700 hover:bg-[#0d131e]">
      <p className="text-xs text-slate-500 tracking-widest">
        AVG WPM
      </p>

      <div className="mt-2 flex items-end gap-2">
        <span className="text-4xl font-bold text-cyan-400">
          {analytics.averageWPM}
        </span>

        <span className="text-slate-500 mb-1">
          WPM
        </span>
      </div>

      <p className="text-sm text-slate-500 mt-2">
        average typing speed
      </p>
    </div>


    {/* AVERAGE ACCURACY */}
    <div className="border border-emerald-500/30 bg-[#0b1019] rounded-xl p-5">
      <p className="text-xs text-slate-500 tracking-widest">
        AVG ACCURACY
      </p>

      <div className="mt-2 flex items-end gap-2">
        <span className="text-4xl font-bold text-emerald-400">
          {analytics.averageAccuracy}%
        </span>
      </div>

      <p className="text-sm text-slate-500 mt-2">
        average precision
      </p>
    </div>


    {/* TOTAL RUNS */}
    <div className="border border-yellow-500/30 bg-[#0b1019] rounded-xl p-5">
      <p className="text-xs text-slate-500 tracking-widest">
        TOTAL RUNS
      </p>

      <div className="mt-2">
        <span className="text-4xl font-bold text-yellow-400">
          {analytics.totalRuns}
        </span>
      </div>

      <p className="text-sm text-slate-500 mt-2">
        completed typing tests
      </p>
    </div>


    {/* TOTAL ERRORS */}
    <div className="border border-red-500/30 bg-[#0b1019] rounded-xl p-5">
      <p className="text-xs text-slate-500 tracking-widest">
        TOTAL ERRORS
      </p>

      <div className="mt-2">
        <span className="text-4xl font-bold text-red-400">
          {analytics.totalErrors}
        </span>
      </div>

      <p className="text-sm text-slate-500 mt-2">
        mistakes across all runs
      </p>
    </div>


    {/* TOTAL CHARACTERS */}
    <div className="border border-blue-500/30 bg-[#0b1019] rounded-xl p-5">
      <p className="text-xs text-slate-500 tracking-widest">
        CHARACTERS
      </p>

      <div className="mt-2">
        <span className="text-4xl font-bold text-blue-400">
          {analytics.totalCharacters.toLocaleString()}
        </span>
      </div>

      <p className="text-sm text-slate-500 mt-2">
        characters typed
      </p>
    </div>

  </div>
)}


      {/* LOADING */}
      {loading && (
        <div className="border border-slate-800 bg-[#0b1019] rounded-xl p-8 text-center">
          <p className="text-cyan-400 font-semibold">
            Loading training data...
          </p>
        </div>
      )}


      {/* ERROR */}
      {!loading && error && (
        <div className="border border-red-500/30 bg-red-500/5 rounded-xl p-6">
          <p className="text-red-400 font-semibold">
            Unable to load results
          </p>

          <p className="text-slate-500 text-sm mt-2">
            {error}
          </p>
        </div>
      )}
     {/* Performance Insights */}
<section className="mt-8 mb-10">
  <div className="mb-4">
    <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">
      Performance Analysis
    </p>

    <h2 className="mt-1 text-2xl font-bold text-white">
      Performance Insights
    </h2>

    <p className="mt-1 text-sm text-slate-400">
      Automated analysis based on your typing history.
    </p>
  </div>

  <div className="grid gap-6 lg:grid-cols-2">
    {insights.map((insight) => (
      <div
      className="group rounded-2xl border border-slate-800/80 bg-[#0a0f18] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/30 hover:bg-[#0d131e]"
        key={insight.title}
      >
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-cyan-500/20 bg-cyan-500/10 text-xl">
            {insight.icon}
          </div>

          <div>
            <h3 className="font-semibold text-white">
              {insight.title}
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              {insight.text}
            </p>
          </div>
        </div>
      </div>
    ))}
  </div>
</section>
{/* WEAK KEY ANALYSIS */}
<section className="mb-10">
<div className="rounded-2xl border border-slate-800/80 bg-[#0a0f18] p-6 shadow-[0_0_30px_rgba(239,68,68,0.03)]">
    <div className="mb-6">
        <p className="text-xs font-mono uppercase tracking-[0.25em] text-red-400">
        INPUT ANALYSIS // WEAK KEYS
      </p>

        <h2 className="mt-1 text-2xl font-bold tracking-tight text-white">
        Weak-Key Analysis
      </h2>

      <p className="text-sm text-slate-500 mt-1">
        Keys where you make the most typing mistakes across your training runs.
      </p>
    </div>

    {weakKeys.length === 0 ? (
      <div className="border border-slate-800 rounded-lg p-6 text-center">
        <div className="text-3xl mb-3">
          ⌨️
        </div>

        <p className="text-slate-300 font-semibold">
          No weak-key data yet
        </p>

        <p className="text-sm text-slate-500 mt-1">
          Complete a few typing runs with mistakes to generate key analysis.
        </p>
      </div>
    ) : (
      <div className="space-y-4">

        {weakKeys.map((item, index) => {
          const maxErrors = weakKeys[0].errors;

          const percentage =
            maxErrors > 0
              ? Math.round((item.errors / maxErrors) * 100)
              : 0;

          return (
            <div key={item.key}>

              <div className="rounded-xl border border-slate-800/70 bg-black/20 p-4 transition-all duration-300 hover:border-red-500/20 hover:bg-red-500/[0.02]">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center font-mono text-lg font-bold text-red-400">
                    {item.key === ' ' ? 'SPACE' : item.key.toUpperCase()}
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-200">
                      {index === 0
                        ? 'Highest Error Key'
                        : `Weak Key #${index + 1}`}
                    </p>

                    <p className="text-xs text-slate-500">
                      {item.errors} {item.errors === 1 ? 'error' : 'errors'}
                    </p>
                  </div>

                </div>

                <span className="text-sm font-bold text-red-400">
                  {item.errors}
                </span>

              </div>

              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">

                <div
                  className="h-full bg-red-400 transition-all duration-700"
                  style={{ width: `${percentage}%` }}
                />

              </div>

            </div>
          );
        })}

      </div>
    )}

  </div>
</section>

{/* Personalized Recommendations */}
<section className="mt-10 mb-10">
  <div className="mb-4">
    <p className="text-xs font-mono uppercase tracking-[0.25em] text-cyan-400">
      AI TRAINING MODULE // PERSONALIZED
    </p>

    <h2 className="mt-1 text-2xl font-bold text-white">
      Personalized Recommendations
    </h2>

    <p className="mt-1 text-sm text-slate-400">
      Training suggestions generated from your typing performance.
    </p>
  </div>

  <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
    {recommendations.map((recommendation, index) => (
      <div
        key={`${recommendation.type}-${index}`}
        className="group rounded-2xl border border-slate-800/80 bg-[#0a0f18] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/30 hover:bg-[#0d131e]"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-cyan-400">
              {recommendation.type.replace('-', ' ')}
            </p>

            <h3 className="mt-2 text-lg font-semibold text-white">
              {recommendation.title}
            </h3>
          </div>

          <span
            className={`rounded-md border px-2 py-1 text-[10px] font-mono font-bold ${
              recommendation.priority === 'HIGH'
                ? 'border-red-500/30 bg-red-500/10 text-red-400'
                : recommendation.priority === 'MEDIUM'
                ? 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400'
                : 'border-green-500/30 bg-green-500/10 text-green-400'
            }`}
          >
            {recommendation.priority}
          </span>
        </div>

        <p className="mt-4 text-sm leading-6 text-slate-400">
          {recommendation.message}
        </p>

        {recommendation.key && (
          <div className="mt-4 inline-flex rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-4 py-2">
            <span className="font-mono text-xl font-bold text-cyan-300">
              {recommendation.key}
            </span>
          </div>
        )}

        <div className="mt-4 rounded-lg border border-white/5 bg-black/20 p-3">
          <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
            Recommended Training
          </p>

          <p className="mt-1 text-sm text-slate-300">
            {recommendation.practice}
          </p>
        </div>
      </div>
    ))}
  </div>
</section>

      {/* PERFORMANCE CHARTS */}
{!loading && !error && results.length > 0 && (
<div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-10">
    {/* WPM CHART */}
    <div className="border border-slate-800/80 bg-[#0a0f18] rounded-2xl p-6">

      <div className="mb-5">
        <p className="text-xs text-purple-400 tracking-widest">
          SPEED ANALYSIS
        </p>

        <h2 className="text-xl font-bold mt-1">
          WPM Progression
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Your typing speed across recent training runs.
        </p>
      </div>

      <div className="w-full h-[300px]">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart data={chartData}>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e293b"
            />

            <XAxis
              dataKey="run"
              stroke="#64748b"
              tick={{ fill: '#64748b', fontSize: 12 }}
              label={{
                value: 'Run',
                position: 'insideBottom',
                offset: -5,
                fill: '#64748b'
              }}
            />

            <YAxis
              stroke="#64748b"
              tick={{ fill: '#64748b', fontSize: 12 }}
              label={{
                value: 'WPM',
                angle: -90,
                position: 'insideLeft',
                fill: '#64748b'
              }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: '#0b1019',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#fff'
              }}
              formatter={(value) => [`${value} WPM`, 'Speed']}
              labelFormatter={(label) => `Run ${label}`}
            />

            <Line
              type="monotone"
              dataKey="wpm"
              stroke="#a78bfa"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>


    {/* ACCURACY CHART */}
    <div className="border border-emerald-500/30 bg-[#0b1019] rounded-xl p-6">

      <div className="mb-5">
        <p className="text-xs text-emerald-400 tracking-widest">
          PRECISION ANALYSIS
        </p>

        <h2 className="text-xl font-bold mt-1">
          Accuracy Trend
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Track your typing accuracy over time.
        </p>
      </div>

      <div className="w-full h-[300px]">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart data={chartData}>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e293b"
            />

            <XAxis
              dataKey="run"
              stroke="#64748b"
              tick={{ fill: '#64748b', fontSize: 12 }}
              label={{
                value: 'Run',
                position: 'insideBottom',
                offset: -5,
                fill: '#64748b'
              }}
            />

            <YAxis
              domain={[0, 100]}
              stroke="#64748b"
              tick={{ fill: '#64748b', fontSize: 12 }}
              label={{
                value: 'Accuracy %',
                angle: -90,
                position: 'insideLeft',
                fill: '#64748b'
              }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: '#0b1019',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#fff'
              }}
              formatter={(value) => [`${value}%`, 'Accuracy']}
              labelFormatter={(label) => `Run ${label}`}
            />

            <Line
              type="monotone"
              dataKey="accuracy"
              stroke="#34d399"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>

  </div>
)}


      {/* NO RESULTS */}
      {!loading && !error && results.length === 0 && (
        <div className="border border-slate-800 bg-[#0b1019] rounded-xl p-10 text-center">

          <div className="text-4xl mb-4">
            📊
          </div>

          <h2 className="text-xl font-bold">
            No training runs yet
          </h2>

          <p className="text-slate-500 mt-2">
            Complete your first typing test to start building your performance history.
          </p>

        </div>
      )}


      {/* RESULTS */}
      {!loading && !error && results.length > 0 && (

<div className="border border-slate-800/80 bg-[#0a0f18] rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.15)]">
          {/* TABLE HEADER */}
          <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">

            <div>
              <p className="text-xs text-cyan-400 tracking-widest">
                TRAINING LOG
              </p>

              <h2 className="text-xl font-bold mt-1">
                Recent Runs
              </h2>
            </div>

            <div className="text-xs text-slate-500">
              {results.length} RUNS
            </div>

          </div>


          {/* DESKTOP TABLE */}
          <div className="hidden md:block overflow-x-auto">

            <table className="w-full">

              <thead>
                <tr className="border-b border-slate-800 text-left">

                  <th className="px-6 py-4 text-xs text-slate-500 tracking-widest">
                    DATE
                  </th>

                  <th className="px-6 py-4 text-xs text-slate-500 tracking-widest">
                    WPM
                  </th>

                  <th className="px-6 py-4 text-xs text-slate-500 tracking-widest">
                    ACCURACY
                  </th>

                  <th className="px-6 py-4 text-xs text-slate-500 tracking-widest">
                    ERRORS
                  </th>

                  <th className="px-6 py-4 text-xs text-slate-500 tracking-widest">
                    SCORE
                  </th>

                  <th className="px-6 py-4 text-xs text-slate-500 tracking-widest">
                    DURATION
                  </th>

                </tr>
              </thead>


              <tbody>

                {results.map((result) => (

                  <tr
                    key={result._id}
                    className="border-b border-slate-800/60 hover:bg-cyan-500/[0.02] transition-colors duration-200"
                  >

                    <td className="px-6 py-4 text-sm text-slate-400">
                      {new Date(result.createdAt).toLocaleString()}
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-bold text-purple-400">
                        {result.wpm}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-bold text-emerald-400">
                        {result.accuracy}%
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={
                          result.errors === 0
                            ? 'font-bold text-emerald-400'
                            : 'font-bold text-red-400'
                        }
                      >
                        {result.errors}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-yellow-400 font-semibold">
                      {result.score}
                    </td>

                    <td className="px-6 py-4 text-slate-400">
                      {result.duration}s
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>


          {/* MOBILE CARDS */}
          <div className="md:hidden divide-y divide-slate-800">

            {results.map((result) => (

              <div
                key={result._id}
                className="p-5"
              >

                <div className="flex justify-between items-start">

                  <div>
                    <p className="text-xs text-slate-500">
                      {new Date(result.createdAt).toLocaleString()}
                    </p>

                    <p className="text-2xl font-bold text-purple-400 mt-2">
                      {result.wpm} WPM
                    </p>
                  </div>

                  <span className="text-emerald-400 font-bold">
                    {result.accuracy}%
                  </span>

                </div>


                <div className="grid grid-cols-3 gap-3 mt-4">

                  <div>
                    <p className="text-[10px] text-slate-600">
                      ERRORS
                    </p>

                    <p className="text-sm font-semibold mt-1">
                      {result.errors}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-slate-600">
                      SCORE
                    </p>

                    <p className="text-sm font-semibold text-yellow-400 mt-1">
                      {result.score}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-slate-600">
                      TIME
                    </p>

                    <p className="text-sm font-semibold mt-1">
                      {result.duration}s
                    </p>
                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

      )}
    </div>
    </div>
  );
}

export default Results;