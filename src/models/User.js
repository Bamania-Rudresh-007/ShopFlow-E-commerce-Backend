const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false        // won't come in queries by default
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  avatar: {
    url: { type: String, default: "" },
    public_id: { type: String, default: "" }   // needed to delete from Cloudinary
  },
  phone: {
    type: String,
    default: ""
  },
  addresses: [
    {
      label: { type: String },                 // "Home", "Office" etc.
      street: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
      isDefault: { type: Boolean, default: false }
    }
  ],
  refreshToken: {
    type: String,
    select: false                              // sensitive, always hidden
  },
  passwordResetToken: {
    type: String,
    select: false
  },
  passwordResetExpiry: {
    type: Date,
    select: false
  },
  isActive: {
    type: Boolean,
    default: true                              // for soft delete
  }
}, { timestamps: true })

const User = mongoose.model("ShopFlow-user", userSchema);

export default User;