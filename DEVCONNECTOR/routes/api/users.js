const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')//responsible for take the url for the users'photo
const bcrypt = require('bcryptjs')//responsible for encrypt the user password

//this require is used for validate the information that the user sent via frontEnd
const { check, validationResult } = require('express-validator/check')

//the instance from the model User that can be used for call de database methods such as save()
const User = require('../../models/User')


// @route  POST api/users
// @desc   Register user
// @access Public
/**
 * Here we're using the function check that was desctrutured from 'express-validator/check'
 * that is used for validate if the user sent the correct information, inside the function
 * we've the attribute 'name' for example and the message 'Name is required', it will be checked
 * using the functions not plus isEmpty
 */
router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
],
    async (req, res) => {
        //const erros receive the results of the validations above
        const erros = validationResult(req)
        //if the const erros is not empty it means that we've erros so we'll send a message for the user
        if (!erros.isEmpty()) {
            return res.status(400).json({ erros: erros.array() })
        }

        //here we're destructuring name, email and password from req.body
        const { name, email, password } = req.body

        try {
            //See if the user exists
            let user = await User.findOne({email})//search for the email in our database
            if(user){
                //if the email already exists in our db we're going to send the msg bellow for the user
                 return res.status(400).json({erros: [{ msg: 'User already exists'}]})
            }

            //Get users gravatar
            const avatar = gravatar.url(email, {
                s: '200',
                r:'pg',
                d: 'mm'
            })

            //create the instance of the model User, having all the attributes we want to send to our db
            user = new User({
                name,
                email,
                avatar,
                password
            })

            //Encrypt password
            //salt is used to determine the hardness of our encrypt method
            const salt = await bcrypt.genSalt(10)
            
            //user.password is encrypted using the method hash()
            user.password = await bcrypt.hash(password, salt)

            //save the instance user in our database using the method save() inherited from mongoose
            await user.save()

            //return jsonwebtoken
        } catch (err) {
            console.log(err.message)
            res.status(500).send('Server error')
        }



        res.send('User registered')
    })

module.exports = router