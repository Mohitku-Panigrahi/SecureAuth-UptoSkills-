import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      select: false // Exclude by default from public queries
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
      index: true
    },
    phone: {
      type: String,
      default: '',
      trim: true
    },
    bio: {
      type: String,
      default: '',
      maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    location: {
      type: String,
      default: '',
      trim: true
    },
    dateOfBirth: {
      type: Date,
      default: null
    },
    profilePicture: {
      type: String,
      default: ''
    },
    organizationUnit: {
      type: String,
      default: 'Engineering Cohort • Team Auth'
    },
    directoryBadgeId: {
      type: String,
      default: ''
    },
    passwordChangedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.passwordHash;
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Pre-save to auto-generate directory badge ID if empty
userSchema.pre('save', function (next) {
  if (!this.directoryBadgeId && this._id) {
    const idSuffix = this._id.toString().slice(-4).toUpperCase();
    const initials = (this.name || 'US')
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    this.directoryBadgeId = `SEC-${idSuffix}-${initials}`;
  }
  next();
});

export const User = mongoose.model('User', userSchema);
