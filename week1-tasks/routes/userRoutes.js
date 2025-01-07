import express from 'express'
import {registerUser, loginUser, getUserProfile, updateUserProfile, deleteUserProfile} from '../controllers/userController.js'
import {protect} from '../middlewares/authMiddleware.js'

const router = express.Router()

// Registeration route
router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/getProfile', protect, getUserProfile);
router.put('/updateProfile', protect, updateUserProfile);
router.delete('/deleteProfile', protect, deleteUserProfile)

export default router