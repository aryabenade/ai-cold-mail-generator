const User = require('../models/User');
const sendEmail = require('../utils/sendEmail.js');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Please provide a valid email address' });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

        // First create the user
        const newUser = await User.create({ username, email, password, otp, otpExpiry });

        // Then query it back with select
        const user = await User.findById(newUser._id).select('-password -otp -otpExpiry');
        res.status(201).json({ message: 'User registered successfully', user });

        //OTP sending logic
        try {
            await sendEmail({
                to: email,
                subject: 'Your OTP for AI Cold Email Generator',
                text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
            })
        } catch (error) {
            console.log({ message: 'Error sending OTP email', error: error.message });
        }

    } catch (error) {
        res.status(500).json({ message: 'Error registering User', error: error.message });
    }
}

exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: 'Please provide both email and OTP' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'User is already verified' });
        }

        if (user.otp !== otp || user.otpExpiry < new Date()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        user.isVerified = true;
        await user.save();
        const token = generateToken(user._id); // Assuming you have a function to generate JWT tokens
        res.status(200).json({ token, message: 'OTP verified successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error verifying OTP', error: error.message });
    }
}

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide both email and password' });
        }
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.isVerified) {
            return res.status(400).json({ message: 'User is not verified. Please verify your email first.' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user._id);
        res.status(200).json({message: 'Login successful', token, user: { email: user.email, username: user.username } });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in User', error: error.message });
    }
}