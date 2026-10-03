import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required']
    },
    xp: {
      type: Number,
      default: 0
    },
    level: {
      type: Number,
      default: 1
    },
    streak: {
      type: Number,
      default: 0
    },
    dailyChallengeCompletedDate: {
  type: String,
  default: ''
},
    completedMissions: {
  type: [String],
  default: []
}
  },
  {
    timestamps: true
  }
);

const User = mongoose.model('User', userSchema);

export default User;
