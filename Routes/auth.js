const router = require('express').Router();
const userModel = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
    registerValidation,
    loginValidation
} = require('../valiadation');



router.post('/register', async (req, res) => {
    //validation
    const {
        error
    } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //check if user already exist
    const emailExist = await userModel.findOne({
        email: req.body.email
    });
    if (emailExist) return res.status(400).send('Email already exist');

    //Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    //create a new user
    const user = new userModel({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    });
    try {
        const saveUser = await user.save();
        res.send({
            user: user._id
        });
    } catch (err) {
        res.status(400).send(err);
    }

});

router.post('/login', async (req, res) => {
    const {
        error
    } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    //check if user already exist
    const user = await userModel.findOne({
        email: req.body.email
    });
    if (!user) return res.status(400).send('Email or password is wrong');
    //password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('Invalid password');

    //create and assign token    
    const token = jwt.sign({
        _id: user._id
    }, process.env.TOKEN_SECRET, {
        //Token expire in 1 minute 60 * 1
        expiresIn: 60 * 60
    });
    res.header('Authorization', token).send(token);

    //res.send('success');

});


module.exports = router;