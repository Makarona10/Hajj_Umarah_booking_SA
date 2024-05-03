const User = require('../models/user-model')

//login user
checkUserAuth = async (req, res) => {
    const {username, password} = req.body;
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'username and password are required!',
        })
    }

    User.findOne({ username: username, password: password }, (err, user) => {
        if (err || !user) {
            return res.status(401).json({
                err,
                message: 'User is Unauthorized!',
            })
        } else {
            return res.status(200).json({
                success: true,
                id: user._id,
                message: 'User is authorized!',
            })
        }
    })
}
//register user
const registerUser = async (req, res) => {
    const { username, password, email, phone } = req.body;

    try {
        // Check if the username or email already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }, { phone }] });

        if (existingUser) {
            return res.status(400).json({ success: false, error: 'Username, email, or phone number already exists' });
        }

        // Create a new user
        const newUser = new User({ username, password, email, phone });
        await newUser.save();

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: { id: newUser._id, username: newUser.username, email: newUser.email, phone: newUser.phone }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'User registration failed' });
    }
};


checkServiceRunning = (req, res) => {
    res.send('Hello World! - from users service');
}

module.exports = {
    checkUserAuth,
    checkServiceRunning,
    registerUser
}