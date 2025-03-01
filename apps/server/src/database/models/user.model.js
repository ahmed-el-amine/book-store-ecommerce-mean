import mongoose from 'mongoose';

const addressSchema = new Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true, default: 'United States' },
  isDefault: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema({
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
    select: false,
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
  roles: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
});

async function hashPassword(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
}

async function hashPasswordForQuery(next) {
  const update = this.getUpdate();
  if (update && update.password) {
    update.password = await bcrypt.hash(update.password, 10);
  }
  next();
}

userSchema.pre('save', hashPassword);

userSchema.pre('updateOne', hashPasswordForQuery);
userSchema.pre('findOneAndUpdate', hashPasswordForQuery);
userSchema.pre('updateMany', hashPasswordForQuery);

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    return {
      username: ret.username,
      firstname: ret.firstname,
      lastname: ret.lastname,
      email: ret.emailData.emailAddress,
      roles: ret.roles,
    };
  },
});

const User = mongoose.model('User', userSchema);

export default User;
