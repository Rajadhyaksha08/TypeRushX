import TestResult from '../models/TestResult.js';
import User from '../models/User.js';

import {
  getLevelFromXP,
  getCurrentLevelThreshold,
  getNextLevelThreshold
} from '../utils/levelCalculator.js';

// ---------------------------------------
// MISSION DEFINITIONS
// ---------------------------------------

const missions = [
  {
    id: 'first_rush',
    title: 'First Rush',
    xp: 100
  },
  {
    id: 'speed_runner',
    title: 'Speed Runner',
    xp: 200
  },
  {
    id: 'speed_demon',
    title: 'Speed Demon',
    xp: 300
  },
  {
    id: 'accuracy_protocol',
    title: 'Accuracy Protocol',
    xp: 300
  },
  {
    id: 'zero_error',
    title: 'Zero Error',
    xp: 600
  }
];


// @desc    Save a completed test result
// @route   POST /api/results
// @access  Private
export const saveResult = async (req, res) => {
  try {
    const {
      wpm,
      accuracy,
      errors,
      score,
      duration,
      totalCharacters,
      keyErrors
    } = req.body;

    // ---------------------------------------
    // BASIC VALIDATION
    // ---------------------------------------

    if (
      wpm === undefined ||
      accuracy === undefined ||
      errors === undefined ||
      score === undefined ||
      duration === undefined ||
      totalCharacters === undefined
    ) {
      return res.status(400).json({
        message: 'All fields are required'
      });
    }

    if (![15, 30, 60].includes(Number(duration))) {
      return res.status(400).json({
        message: 'Duration must be 15, 30, or 60 seconds'
      });
    }

    // ---------------------------------------
    // SAVE TYPING RESULT
    // ---------------------------------------

    const result = await TestResult.create({
      userId: req.user._id,
      wpm: Number(wpm),
      accuracy: Number(accuracy),
      errors: Number(errors),
      score: Number(score),
      duration: Number(duration),
      totalCharacters: Number(totalCharacters),
      keyErrors: keyErrors || {}
    });

    // ---------------------------------------
    // FIND USER
    // ---------------------------------------

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // Make sure completedMissions exists
    if (!Array.isArray(user.completedMissions)) {
      user.completedMissions = [];
    }

    // ---------------------------------------
    // NORMAL TEST XP
    // ---------------------------------------

    const earnedXP = Math.max(
      1,
      Math.round(
        Number(score) +
        Number(wpm) * (Number(accuracy) / 100)
      )
    );

    // ---------------------------------------
    // CHECK MISSIONS
    // ---------------------------------------

    const newlyCompletedMissions = [];
    let missionXP = 0;

    // Count user's completed tests
    const totalTests = await TestResult.countDocuments({
      userId: req.user._id
    });

    // First Rush
    if (
      totalTests >= 1 &&
      !user.completedMissions.includes('first_rush')
    ) {
      const mission = missions.find(
        (item) => item.id === 'first_rush'
      );

      user.completedMissions.push(mission.id);

      missionXP += mission.xp;

      newlyCompletedMissions.push({
        id: mission.id,
        title: mission.title,
        xp: mission.xp
      });
    }

    // Speed Runner
    if (
      Number(wpm) >= 50 &&
      !user.completedMissions.includes('speed_runner')
    ) {
      const mission = missions.find(
        (item) => item.id === 'speed_runner'
      );

      user.completedMissions.push(mission.id);

      missionXP += mission.xp;

      newlyCompletedMissions.push({
        id: mission.id,
        title: mission.title,
        xp: mission.xp
      });
    }

    // Speed Demon
    if (
      Number(wpm) >= 70 &&
      !user.completedMissions.includes('speed_demon')
    ) {
      const mission = missions.find(
        (item) => item.id === 'speed_demon'
      );

      user.completedMissions.push(mission.id);

      missionXP += mission.xp;

      newlyCompletedMissions.push({
        id: mission.id,
        title: mission.title,
        xp: mission.xp
      });
    }

 // Accuracy Protocol
if (
  Number(accuracy) >= 95 &&
  !user.completedMissions.includes('accuracy_protocol')
) {
  const mission = missions.find(
    (item) => item.id === 'accuracy_protocol'
  );

  if (mission) {
    user.completedMissions.push(mission.id);

    missionXP += mission.xp;

    newlyCompletedMissions.push({
      id: mission.id,
      title: mission.title,
      xp: mission.xp
    });
  }
}
   // Zero Error
if (
  Number(errors) === 0 &&
  !user.completedMissions.includes('zero_error')
) {
  const mission = missions.find(
    (item) => item.id === 'zero_error'
  );

  if (mission) {
    user.completedMissions.push(mission.id);

    missionXP += mission.xp;

    newlyCompletedMissions.push({
      id: mission.id,
      title: mission.title,
      xp: mission.xp
    });
  }
}
    // ---------------------------------------
    // TOTAL XP
    // ---------------------------------------

    const totalEarnedXP = earnedXP + missionXP;

    const oldXP = user.xp || 0;
    const newXP = oldXP + totalEarnedXP;

    // ---------------------------------------
    // CALCULATE LEVEL
    // ---------------------------------------

    const newLevel = getLevelFromXP(newXP);

    user.xp = newXP;
    user.level = newLevel;

    await user.save();

    // ---------------------------------------
    // XP PROGRESS
    // ---------------------------------------

    const currentLevelThreshold =
      getCurrentLevelThreshold(newLevel);

    const nextLevelThreshold =
      getNextLevelThreshold(newLevel);

    const progressRange =
      nextLevelThreshold - currentLevelThreshold;

    const progressXP =
      newXP - currentLevelThreshold;

    const progressPercent =
      progressRange > 0
        ? Math.min(
            100,
            Math.round(
              (progressXP / progressRange) * 100
            )
          )
        : 100;

    // ---------------------------------------
    // RESPONSE
    // ---------------------------------------

    return res.status(201).json({
      message: 'Result saved successfully',

      result,

      // Normal test XP
      earnedXP,

      // Mission XP
      missionXP,

      // Missions completed during this test
      newlyCompletedMissions,

      // User XP
      xp: user.xp,

      // Level
      level: user.level,

      // Progress
      xpNeeded: Math.max(
        0,
        nextLevelThreshold - newXP
      ),

      nextLevelThreshold,

      progressPercent
    });

  } catch (error) {
    console.error('saveResult error:', error);

    return res.status(500).json({
      message: 'Server error saving test result'
    });
  }
};


// @desc    Get the logged-in user's test history
// @route   GET /api/results/my
// @access  Private
export const getMyResults = async (req, res) => {
  try {
    const results = await TestResult.find({
      userId: req.user._id
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .select('-userId -__v');

    return res.status(200).json({
      results
    });

  } catch (error) {
    console.error('getMyResults error:', error);

    return res.status(500).json({
      message: 'Server error fetching test history'
    });
  }
};