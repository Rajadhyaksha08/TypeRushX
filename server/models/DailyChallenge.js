import mongoose from 'mongoose';

const dailyChallengeSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
      unique: true
    },

    passage: {
      type: String,
      required: true
    },

    duration: {
      type: Number,
      enum: [15, 30, 60],
      default: 30
    },

    targetWPM: {
      type: Number,
      required: true
    },

    targetAccuracy: {
      type: Number,
      required: true
    },

    xpReward: {
      type: Number,
      default: 150
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('DailyChallenge', dailyChallengeSchema);