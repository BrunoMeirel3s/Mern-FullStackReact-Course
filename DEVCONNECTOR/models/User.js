/**
 * Models are used for especify the schema that we're going to use in our database
 * mongoose is used for build the schema, this way we can especify the
 * type of our attributes and if they're required, unique or things like that
 */
const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    email:{
       type: String,
       required:true,
       unique: true 
    },
    password:{
        type: String,
        required: true
    },
    avatar:{
        type:String
    },
    date:{
        type: Date,
        default: Date.now
    }
})

module.exports = User = mongoose.model('user', UserSchema)