import mongoose from 'mongoose'
import bcrypt, { genSalt } from 'bcrypt'


const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true
    }, 
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password should be alteast of 6 characters']
    }
},
    {
        timestamps: true
    }
)


userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) {
        return next()
    }

    const salt = await bcrypt.genSalt(8)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})


userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model('user', userSchema)

export default User