import DailyChallenge from '../models/DailyChallenge.js';
import User from '../models/User.js';
import { getLevelFromXP } from '../utils/levelCalculator.js';
const challenges = [
  {
    passage:
      'Modern developers need strong technical skills, but consistency and attention to detail are equally important. Every typing session is an opportunity to improve speed, accuracy, and confidence. Focus on maintaining a steady rhythm instead of rushing through difficult words. Small improvements repeated every day can create significant progress over time.',
    targetWPM: 40,
    targetAccuracy: 90,
    xpReward: 150
  },
  {
    passage:
      'Practice creates consistency, and consistency creates confidence. When learning to type faster, focus on accuracy before trying to increase your speed. Keep your hands relaxed, maintain a comfortable posture, and watch the text carefully. With regular training, your fingers gradually become more familiar with common words, patterns, symbols, and keyboard movements.',
    targetWPM: 45,
    targetAccuracy: 92,
    xpReward: 175
  },
  {
    passage:
      'Fast typing is useful for programmers, students, writers, and professionals who spend significant time working with computers. However, speed without accuracy can create more problems than it solves. The goal of this challenge is to build a balance between speed and precision. Stay focused, avoid unnecessary mistakes, and maintain a consistent typing rhythm.',
    targetWPM: 50,
    targetAccuracy: 93,
    xpReward: 200
  },
  {
    passage:
      'Every training session is another opportunity to improve your performance. Instead of focusing only on your final WPM, pay attention to the mistakes you make during the session. Identify difficult letters, common word patterns, and moments where your typing rhythm breaks. Understanding your weaknesses allows you to practice smarter and improve more efficiently.',
    targetWPM: 45,
    targetAccuracy: 90,
    xpReward: 150
  },
  {
    passage:
      'Strong keyboard skills help developers write code faster, communicate efficiently, and stay focused on complex tasks. Professional typing is not only about reaching a high speed. It is also about producing accurate input while maintaining concentration for longer periods. Train regularly, learn from your mistakes, and gradually challenge yourself with more difficult passages.',
    targetWPM: 50,
    targetAccuracy: 94,
    xpReward: 200
  }
];

const getToday = () => {
  return new Date().toISOString().split('T')[0];
};

export const getDailyChallenge = async (req, res) => {
  try {
    const today = getToday();

    let challenge = await DailyChallenge.findOne({ date: today });

    if (!challenge) {
      const challengeData =
        challenges[Math.floor(Math.random() * challenges.length)];

      challenge = await DailyChallenge.create({
        date: today,
        passage: challengeData.passage,
        duration: 30,
        targetWPM: challengeData.targetWPM,
        targetAccuracy: challengeData.targetAccuracy,
        xpReward: challengeData.xpReward
      });
    }

   const user = await User.findById(req.user.id).select(
  'dailyChallengeCompletedDate'
);

const completedToday =
  user?.dailyChallengeCompletedDate === today;

return res.status(200).json({
  challenge,
  completedToday
});
  } catch (error) {
    console.error('getDailyChallenge error:', error);

    return res.status(500).json({
      message: 'Server error fetching daily challenge'
    });
  }
};
export const completeDailyChallenge = async (req, res) => {
  try {
    const today = getToday();

    const challenge = await DailyChallenge.findOne({
      date: today
    });

    if (!challenge) {
      return res.status(404).json({
        message: 'No daily challenge found for today.'
      });
    }

    const { wpm, accuracy } = req.body;

    if (
      typeof wpm !== 'number' ||
      typeof accuracy !== 'number'
    ) {
      return res.status(400).json({
        message: 'Invalid challenge result.'
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found.'
      });
    }

    // Prevent XP farming
    if (user.dailyChallengeCompletedDate === today) {
      return res.status(200).json({
        passed: true,
        alreadyCompleted: true,
        earnedXP: 0,
        message: 'Daily challenge already completed today.'
      });
    }

    const passed =
      wpm >= challenge.targetWPM &&
      accuracy >= challenge.targetAccuracy;

    if (!passed) {
      return res.status(200).json({
        passed: false,
        alreadyCompleted: false,
        earnedXP: 0,
        message:
          `Challenge not completed. Reach ${challenge.targetWPM} WPM and ${challenge.targetAccuracy}% accuracy.`
      });
    }

    const earnedXP = challenge.xpReward;

    user.xp += earnedXP;
    user.level = getLevelFromXP(user.xp);
    user.dailyChallengeCompletedDate = today;

    await user.save();

    return res.status(200).json({
      passed: true,
      alreadyCompleted: false,
      earnedXP,
      xp: user.xp,
      level: user.level,
      message: 'Daily challenge completed successfully!'
    });
  } catch (error) {
    console.error('completeDailyChallenge error:', error);

    return res.status(500).json({
      message: 'Server error completing daily challenge.'
    });
  }
};