import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const addressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
      match: [
        /^[a-zA-Z0-9_]+$/,
        'Username can only contain letters, numbers, and underscores',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    address: [addressSchema],
    emailData: {
      emailAddress: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
      },
      isEmailVerified: {
        type: Boolean,
        default: false,
      },
      verificationToken: String,
    },
    phone: String,
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.comparePassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

userSchema.methods.createAuthToken = function () {
  const token = jwt.sign({ id: this._id , role:this.role }, process.env.JWT_SEC_KEY, {
    expiresIn: process.env.JWT_EXPIRATION,
  });

  return token;
};

async function hashPassword(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
}
userSchema.pre('save', hashPassword);

async function hashPasswordForQuery(next) {
  const update = this.getUpdate();
  if (update && update.password) {
    update.password = await bcrypt.hash(update.password, 10);
  }
  next();
}
userSchema.pre('updateOne', hashPasswordForQuery);
userSchema.pre('findOneAndUpdate', hashPasswordForQuery);
userSchema.pre('updateMany', hashPasswordForQuery);

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    return {
      username: ret.username,
      firstName: ret.firstName,
      lastName: ret.lastName,
      email: ret.emailData.emailAddress,
      role: ret.role,
    };
  },
});

const User = mongoose.model('User', userSchema);

export default User;
