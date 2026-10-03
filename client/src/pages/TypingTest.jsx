import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import passages from '../data/passages';
import { useAuth } from '../context/AuthContext';
const DURATIONS = [15, 30, 60];

const getRandomPassage = () => {
  return passages[Math.floor(Math.random() * passages.length)];
};

const TypingTest = () => {
  const { token } = useAuth();

const [savingResult, setSavingResult] = useState(false);
const [resultSaved, setResultSaved] = useState(false);
const [earnedXP, setEarnedXP] = useState(0);
const [saveError, setSaveError] = useState('');

  const [duration, setDuration] = useState(30);
  const [passage, setPassage] = useState(getRandomPassage);
  const [typed, setTyped] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [status, setStatus] = useState('idle'); // idle | running | finished
  const [correctChars, setCorrectChars] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [keyErrors, setKeyErrors] = useState({});
  const [searchParams] = useSearchParams();

const isDailyChallenge = searchParams.get('mode') === 'daily';

const [dailyChallenge, setDailyChallenge] = useState(null);
const [dailyCompleted, setDailyCompleted] = useState(false);
const [dailyReward, setDailyReward] = useState(0);
useEffect(() => {
  if (!isDailyChallenge || !token) return;

  const fetchDailyChallenge = async () => {
    try {
      const response = await fetch('/api/daily-challenge', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load daily challenge');
      }

      setDailyChallenge(data.challenge);

      // Use the exact challenge passage
      setPassage(data.challenge.passage);

      // Use the challenge duration
      setDuration(data.challenge.duration);
      setTimeLeft(data.challenge.duration);
    } catch (error) {
      console.error('Failed to load daily challenge:', error);
    }
  };

  fetchDailyChallenge();
}, [isDailyChallenge, token]);

  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const hasSavedRef = useRef(false);
  // Derived stats
  const totalTyped = typed.length;
  const elapsedSeconds = status === 'running'
    ? (duration - timeLeft)
    : status === 'finished'
      ? duration
      : 0;
  const elapsedMinutes = Math.max(elapsedSeconds / 60, 1 / 60);
  const wpm = Math.round((correctChars / 5) / elapsedMinutes);
  const accuracy = totalTyped > 0
    ? Math.round((correctChars / totalTyped) * 100)
    : 100;

    const score = Math.max(
  0,
  Math.round(
    correctChars * (accuracy / 100)
  )
);
const saveTestResult = useCallback(async () => {
  if (hasSavedRef.current || !token) {
    return;
  }

  hasSavedRef.current = true;
  setSavingResult(true);
  setSaveError('');

  try {
    const response = await fetch('/api/results', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
  wpm,
  accuracy,
  errors: errorCount,
  score,
  duration,
  totalCharacters: totalTyped,
  keyErrors,
}),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || 'Failed to save test result'
      );
    }

    setEarnedXP(data.earnedXP || 0);
    setResultSaved(true);

  } catch (error) {
    console.error('Failed to save test result:', error);

    setSaveError(
      error.message || 'Failed to save result'
    );

    // Allow retry if saving failed
    hasSavedRef.current = false;

  } finally {
    setSavingResult(false);
  }
}, [
  token,
  wpm,
  accuracy,
  errorCount,
  score,
  duration,
  totalTyped,
  keyErrors,
]);
const completeDailyChallenge = useCallback(async () => {
  if (!isDailyChallenge || !dailyChallenge || !token) {
    return;
  }

  try {
    const response = await fetch('/api/daily-challenge/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        wpm,
        accuracy,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || 'Failed to complete daily challenge'
      );
    }

    setDailyCompleted(data.passed);
    setDailyReward(data.earnedXP || 0);
  } catch (error) {
    console.error(
      'Failed to complete daily challenge:',
      error
    );
  }
}, [
  isDailyChallenge,
  dailyChallenge,
  token,
  wpm,
  accuracy,
]);
useEffect(() => {
  if (status === 'finished') {
    saveTestResult();

    if (isDailyChallenge) {
      completeDailyChallenge();
    }
  }
}, [
  status,
  saveTestResult,
  isDailyChallenge,
  completeDailyChallenge,
]);
  // Start the countdown timer
  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const remaining = duration - elapsed;

      if (remaining <= 0) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        setTimeLeft(0);
        setStatus('finished');
      } else {
        setTimeLeft(remaining);
      }
    }, 100);
  }, [duration]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Handle each keystroke
  const handleInput = (e) => {
    const value = e.target.value;

    if (status === 'finished') return;

    // Start on first keypress
    if (status === 'idle') {
      setStatus('running');
      startTimer();
    }

    setTyped(value);

   // Recalculate correct chars, errors and weak keys
let correct = 0;
let errors = 0;
const currentKeyErrors = {};

for (let i = 0; i < value.length; i++) {
  if (i < passage.length && value[i] === passage[i]) {
    correct++;
  } else {
    errors++;

    if (i < passage.length) {
      const expectedKey = passage[i].toLowerCase();

      currentKeyErrors[expectedKey] =
        (currentKeyErrors[expectedKey] || 0) + 1;
    }
  }
}

setCorrectChars(correct);
setErrorCount(errors);
setKeyErrors(currentKeyErrors);
  };

  // Restart test
  const restart = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (isDailyChallenge && dailyChallenge) {
  setPassage(dailyChallenge.passage);
} else {
  setPassage(getRandomPassage());
}

    setTyped('');
    setTimeLeft(duration);
    setStatus('idle');
    setCorrectChars(0);
    setErrorCount(0);
    setKeyErrors({});
    startTimeRef.current = null;

    // Focus the input after a short delay so React finishes re-render
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [duration, isDailyChallenge, dailyChallenge]);

  // Change duration mode
  const changeDuration = (newDuration) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setDuration(newDuration);
    setTimeLeft(newDuration);
    if (!isDailyChallenge) {
  setPassage(getRandomPassage());
}
    setTyped('');
    setStatus('idle');
    setCorrectChars(0);
    setErrorCount(0);
    setKeyErrors({});
    startTimeRef.current = null;

    setTimeout(() => inputRef.current?.focus(), 50);
  };

  // Render passage characters with color coding
  const renderPassage = () => {
    return passage.split('').map((char, i) => {
      let colorClass = 'text-slate-500'; // untyped
      if (i < typed.length) {
        colorClass = typed[i] === char ? 'text-emerald-400' : 'text-red-400 bg-red-900/30';
      }
      // Cursor position
      const isCursor = i === typed.length && status !== 'finished';

      return (
        <span
          key={i}
          className={`${colorClass} ${isCursor ? 'border-l-2 border-indigo-400 animate-pulse' : ''}`}
        >
          {char}
        </span>
      );
    });
  };

  {isDailyChallenge && dailyChallenge && (
  <div className="mb-5 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="text-xs font-mono tracking-widest text-cyan-400">
          DAILY // CHALLENGE ACTIVE
        </p>

        <p className="mt-1 text-sm text-slate-400">
          Target: {dailyChallenge.targetWPM} WPM
          {' • '}
          {dailyChallenge.targetAccuracy}% Accuracy
        </p>
      </div>

      <div className="text-right">
        <p className="text-xs text-slate-500">REWARD</p>
        <p className="text-xl font-bold text-yellow-400">
          +{dailyChallenge.xpReward} XP
        </p>
      </div>
    </div>
  </div>
)}

  // Timer display color based on time remaining
  const timerColor = timeLeft <= 5
    ? 'text-red-400'
    : timeLeft <= 10
      ? 'text-amber-400'
      : 'text-indigo-400';

return (
  <div className="min-h-screen bg-[#05070d] text-white px-6 py-8 md:px-10">

    <div className="max-w-7xl mx-auto">

      {/* HEADER */}
      <div className="mb-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">

        <div>
          <div className="text-xs tracking-[0.3em] text-cyan-400 font-semibold mb-2">
            PERFORMANCE // TYPING LAB
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Typing Test
          </h1>

          <p className="text-slate-400 mt-2">
            Execute a typing run and measure your speed, accuracy and precision.
          </p>
        </div>

        <div
          className={`px-4 py-2 rounded-lg border text-xs font-mono tracking-widest ${
            status === 'running'
              ? 'border-cyan-500/40 bg-cyan-500/5 text-cyan-400'
              : status === 'finished'
                ? 'border-emerald-500/40 bg-emerald-500/5 text-emerald-400'
                : 'border-slate-700 bg-[#0b1019] text-slate-400'
          }`}
        >
          {status === 'running'
            ? '● LIVE SESSION'
            : status === 'finished'
              ? '✓ SESSION COMPLETE'
              : '○ SYSTEM READY'}
        </div>

      </div>


      {/* CONTROL PANEL */}
      <div className="border border-slate-800 bg-[#0b1019] rounded-xl p-5 mb-5">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

          <div>
            <p className="text-xs text-cyan-400 tracking-widest mb-3">
              TEST DURATION
            </p>

            <div className="flex gap-2">
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => changeDuration(d)}
                  disabled={status === 'running' || isDailyChallenge}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    duration === d
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                      : 'bg-[#111827] text-slate-400 border border-slate-700 hover:border-cyan-500/40 hover:text-white'
                  } disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  {d}s
                </button>
              ))}
            </div>
          </div>


          {/* TIMER */}
          <div className="text-left md:text-right">

            <p className="text-xs text-slate-500 tracking-widest mb-1">
              TIME REMAINING
            </p>

            <div className={`text-4xl md:text-5xl font-bold font-mono tabular-nums ${timerColor}`}>
              {String(timeLeft).padStart(2, '0')}
              <span className="text-slate-600 text-2xl ml-1">
                SEC
              </span>
            </div>

          </div>

        </div>

      </div>


      {/* LIVE METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">

        <div className="border border-purple-500/30 bg-[#0b1019] rounded-xl p-5">

          <p className="text-xs text-slate-500 tracking-widest">
            SPEED
          </p>

          <div className="mt-2 flex items-end gap-2">
            <span className="text-4xl font-bold text-purple-400 tabular-nums">
              {status === 'idle' ? '—' : wpm}
            </span>

            <span className="text-slate-500 mb-1">
              WPM
            </span>
          </div>

          <p className="text-sm text-slate-500 mt-2">
            words per minute
          </p>

        </div>


        <div className="border border-emerald-500/30 bg-[#0b1019] rounded-xl p-5">

          <p className="text-xs text-slate-500 tracking-widest">
            PRECISION
          </p>

          <div className="mt-2 flex items-end gap-2">
            <span className="text-4xl font-bold text-emerald-400 tabular-nums">
              {status === 'idle' ? '—' : `${accuracy}%`}
            </span>
          </div>

          <p className="text-sm text-slate-500 mt-2">
            typing accuracy
          </p>

        </div>


        <div className="border border-red-500/30 bg-[#0b1019] rounded-xl p-5">

          <p className="text-xs text-slate-500 tracking-widest">
            ERROR COUNT
          </p>

          <div className="mt-2 flex items-end gap-2">

            <span className="text-4xl font-bold text-red-400 tabular-nums">
              {status === 'idle' ? '—' : errorCount}
            </span>

            <span className="text-slate-500 mb-1">
              errors
            </span>

          </div>

          <p className="text-sm text-slate-500 mt-2">
            mistakes in current run
          </p>

        </div>

      </div>


      {/* TYPING TERMINAL */}
      <div className="border border-slate-800 bg-[#0b1019] rounded-xl overflow-hidden mb-5">

        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
            </div>

            <span className="text-xs text-slate-500 font-mono tracking-widest">
              TYPERUSHX // INPUT TERMINAL
            </span>

          </div>

          <span className="text-xs text-slate-600 font-mono">
            SESSION_{duration}S
          </span>

        </div>


        <div className="p-6 md:p-8">

          <div className="mb-5 flex items-center justify-between">

            <div className="w-full">
  {isDailyChallenge && dailyChallenge ? (
    <div className="mb-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        
        <div>
          <p className="text-xs font-mono tracking-widest text-cyan-400">
            DAILY // CHALLENGE ACTIVE
          </p>

          <p className="mt-1 text-sm text-slate-400">
            Reach the target to earn bonus XP.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="rounded-lg border border-purple-500/20 bg-purple-500/5 px-4 py-2">
            <p className="text-[10px] tracking-widest text-slate-500">
              TARGET WPM
            </p>
            <p className="text-lg font-bold text-purple-400">
              {dailyChallenge.targetWPM}
            </p>
          </div>

          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-2">
            <p className="text-[10px] tracking-widest text-slate-500">
              TARGET ACCURACY
            </p>
            <p className="text-lg font-bold text-emerald-400">
              {dailyChallenge.targetAccuracy}%
            </p>
          </div>

          <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 px-4 py-2">
            <p className="text-[10px] tracking-widest text-slate-500">
              REWARD
            </p>
            <p className="text-lg font-bold text-yellow-400">
              +{dailyChallenge.xpReward} XP
            </p>
          </div>
        </div>

      </div>
    </div>
  ) : (
    <>
      <p className="text-xs text-cyan-400 tracking-widest">
        LIVE INPUT
      </p>

      <p className="text-sm text-slate-500 mt-1">
        Type the passage exactly as displayed.
      </p>
    </>
  )}
</div>

            <div className="hidden sm:block text-xs text-slate-600 font-mono">
              {typed.length}/{passage.length} CHARS
            </div>

          </div>


          {/* PROGRESS */}
          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mb-6">

            <div
              className="h-full bg-cyan-400 transition-all duration-200"
              style={{
                width: `${Math.min(
                  (typed.length / Math.max(passage.length, 1)) * 100,
                  100
                )}%`
              }}
            />

          </div>


          {/* PASSAGE */}
          <div
            onClick={() => inputRef.current?.focus()}
            className="min-h-[210px] md:min-h-[230px] border border-slate-700 bg-[#080c14] rounded-xl p-6 md:p-8 font-mono text-lg md:text-xl leading-[2] tracking-wide cursor-text select-none"
          >
            {renderPassage()}
          </div>


          {/* HIDDEN INPUT */}
          <textarea
            ref={inputRef}
            value={typed}
            onChange={handleInput}
            disabled={status === 'finished'}
            autoFocus
            className="sr-only"
            aria-label="Type here"
            onPaste={(e) => e.preventDefault()}
          />


          {status === 'idle' && (
            <div className="mt-5 text-center">
              <p className="text-xs text-slate-500 font-mono">
                &gt; SYSTEM READY — START TYPING TO INITIALIZE SESSION
              </p>
            </div>
          )}

          {status === 'running' && (
            <div className="mt-5 text-center">
              <p className="text-xs text-cyan-400 font-mono animate-pulse">
                &gt; SESSION ACTIVE — INPUT STREAM RECEIVING...
              </p>
            </div>
          )}

        </div>

      </div>


      {/* FINISHED RESULT */}
      {status === 'finished' && (

        <div className="border border-emerald-500/30 bg-[#0b1019] rounded-xl p-6 mb-5">

          <div className="flex items-center justify-between mb-6">

            <div>
              <p className="text-xs text-emerald-400 tracking-widest">
                SESSION // COMPLETE
              </p>

              <h2 className="text-2xl font-bold mt-1">
                Training Run Finished
              </h2>
            </div>

            <div className="hidden sm:block text-xs text-emerald-400 font-mono">
              RESULT LOGGED
            </div>

          </div>


          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            <div className="border border-purple-500/20 bg-[#080c14] rounded-lg p-4">
              <p className="text-xs text-slate-500 tracking-widest">WPM</p>
              <p className="text-3xl font-bold text-purple-400 mt-2">{wpm}</p>
            </div>

            <div className="border border-emerald-500/20 bg-[#080c14] rounded-lg p-4">
              <p className="text-xs text-slate-500 tracking-widest">ACCURACY</p>
              <p className="text-3xl font-bold text-emerald-400 mt-2">{accuracy}%</p>
            </div>

            <div className="border border-red-500/20 bg-[#080c14] rounded-lg p-4">
              <p className="text-xs text-slate-500 tracking-widest">ERRORS</p>
              <p className="text-3xl font-bold text-red-400 mt-2">{errorCount}</p>
            </div>

            <div className="border border-yellow-500/20 bg-[#080c14] rounded-lg p-4">
              <p className="text-xs text-slate-500 tracking-widest">CHARACTERS</p>
              <p className="text-3xl font-bold text-yellow-400 mt-2">{totalTyped}</p>
            </div>
            {isDailyChallenge && dailyChallenge && (
  <div className="mt-6 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5">
    <p className="text-xs font-mono tracking-widest text-cyan-400">
      DAILY // CHALLENGE RESULT
    </p>

    {dailyCompleted ? (
      <div className="mt-3">
        <p className="text-2xl font-bold text-emerald-400">
          ✓ CHALLENGE COMPLETED
        </p>

        <p className="mt-2 text-slate-400">
          Target achieved: {dailyChallenge.targetWPM} WPM
          {' • '}
          {dailyChallenge.targetAccuracy}% accuracy
        </p>

        <p className="mt-4 text-xl font-bold text-yellow-400">
          +{dailyReward} BONUS XP
        </p>
      </div>
    ) : (
      <div className="mt-3">
        <p className="text-xl font-bold text-red-400">
          ✕ TARGET NOT REACHED
        </p>

        <p className="mt-2 text-slate-400">
          Required: {dailyChallenge.targetWPM} WPM
          {' • '}
          {dailyChallenge.targetAccuracy}% accuracy
        </p>

        <p className="mt-2 text-sm text-slate-500">
          Keep training and try again tomorrow.
        </p>
      </div>
    )}
  </div>
)}

          </div>


          {/* SAVE STATUS */}
          <div className="mt-6 pt-5 border-t border-slate-800 text-center">

            {savingResult && (
              <p className="text-sm text-cyan-400 font-mono animate-pulse">
                &gt; SAVING RESULT TO TRAINING LOG...
              </p>
            )}

            {resultSaved && (
              <div className="space-y-2">
                <p className="text-xl font-bold text-[#00ff88]">
                  +{earnedXP} XP EARNED
                </p>

                <p className="text-xs text-slate-500 font-mono tracking-widest">
                  ✓ RESULT SAVED TO TRAINING LOG
                </p>
              </div>
            )}

            {saveError && (
              <div className="space-y-3">

                <p className="text-sm text-red-400">
                  {saveError}
                </p>

                <button
                  onClick={saveTestResult}
                  className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Retry saving →
                </button>

              </div>
            )}

          </div>

        </div>

      )}


      {/* ACTIONS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800 pt-6">

        <div className="text-xs text-slate-600 font-mono">
          TYPESRUSHX // TRAINING SYSTEM
        </div>

        <button
          onClick={restart}
          className="px-7 py-3 bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white font-semibold rounded-lg shadow-lg shadow-purple-500/20 transition-all"
        >
          {status === 'finished' ? 'Start New Run' : 'Restart Test'}
        </button>

      </div>

    </div>
  </div>
);
};

export default TypingTest;
