import mongoose from 'mongoose';

export const tokenTypes = Object.freeze({
  activeEmail: 'activeEmail',
  restPassword: 'restPassword',
});

const tokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    token: String,
    tokenType: {
      type: String,
      enum: Object.values(tokenTypes),
      required: true,
    },
    expires: Date,
  },
  {
    timestamps: true,
  }
);

const Token = mongoose.model('Token', tokenSchema);

export default Token;
