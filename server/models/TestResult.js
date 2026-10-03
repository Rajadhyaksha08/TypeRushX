import mongoose from 'mongoose';

const testResultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    wpm: {
      type: Number,
      required: true,
      min: 0
    },
    accuracy: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    errors: {
      type: Number,
      required: true,
      min: 0
    },
    score: {
      type: Number,
      required: true,
      min: 0
    },
    duration: {
      type: Number,
      required: true,
      enum: [15, 30, 60]
    },
    keyErrors: {
  type: Map,
  of: Number,
  default: {}
},
    totalCharacters: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    timestamps: true,
    suppressReservedKeysWarning: true
  }
);

const TestResult = mongoose.model('TestResult', testResultSchema);

export default TestResult;
