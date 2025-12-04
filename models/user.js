const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const { isEmail } = require('validator');

const userSchema = new Schema({
    email: { 
        type: String, 
        required: [true, 'Please enter an email'], 
        unique: true, 
        lowercase: true, 
        validate: [isEmail, 'Please enter a valid email address']
    },
    password: { 
        type: String, 
        required: [true, 'Please enter a password'], 
        minlength: [6, 'Minimum password length is 6 characters'] 
    },
    // ✅ CRITICAL: This allows Mongoose to see the "role" in the database
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);