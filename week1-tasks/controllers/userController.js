import User from '../models/user.js'
import jwt from 'jsonwebtoken'


// @desc  Register a new user
// @route POST /api/users/register 
// @access public 
const registerUser = async (req, res)=>{

    try {

        const {name, email, password} = req.body

        // Valid input
        if(!name || !email || !password) {
            return res.status(400).json({message: 'All fields are required'})
        }

        // Check if the user already exists
        const userExists = await User.findOne({email})
        if(userExists) {
            return res.status(400).json({messsage: 'Email already in use!'})
        }

        // Create a new user
        const user =  new User({name, email, password})
        await user.save()

        res.status(201).json({
            message: 'User created'
        })

    } catch(error) {
        res.status(500).json({message: 'Server error', error: error.message})
    }
}


// @desc Login the user
// @route /api/users/login
// @access public
const loginUser = async (req,res) => {

    try {

        const {email, password} = req.body

        // Valid input
        if(!email || !password) {
            return res.status(400).json({message: 'Email and password are required'})
        }

        // Check for new user
        const user = await User.findOne({email})
        if(!user) {
            return res.status(400).json({message: 'User not found!'})
        }

        // Validate password
        const isPasswordValid = await user.comparePassword(password)
        if(!isPasswordValid) {
            return res.status(400).json({message: 'Invalid credentials!'})
        }

        // Generate token
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'})

        res.status(200).json({
            message: 'User logged in',
            token
        })

    } catch(error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}


// @desc Get user profile
// @route /api/users/profile
// @access Private
const getUserProfile = async (req, res) => {

    try {

        const user = req.user; // Fetched from the protect middleware
        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

  
// @desc Update user profile
// @route /api/users/profile
// @access Private
const updateUserProfile = async (req, res) => {

    try {

        const user = req.user; // Fetched from the protect middleware
    
        // Update fields
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
    
        // Hash the new password if provided
        if (req.body.password) {
            user.password = req.body.password;
        }
    
        const updatedUser = await user.save();
    
        res.status(200).json({
            id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            message: 'Profile updated successfully',
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
  };


// @desc    Delete user profile
// @route   DELETE /api/users/profile
// @access  Private
const deleteUserProfile = async (req, res) => {
    try {
        const user = req.user; // User attached by middleware
    
        // Delete the user
        await User.findByIdAndDelete(user._id);
    
        res.status(200).json({
            message: 'User profile deleted successfully',
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  

export {registerUser, loginUser, getUserProfile, updateUserProfile, deleteUserProfile}