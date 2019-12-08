const express = require("express");
const { check, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../models/User");
const auth = require("../middleware/authorize");

const router = express.Router();


// @route GET api/auth
// @desc Get Logged-in User
// @access Private
router.get("/", auth, async(req, res) => {
    
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Internal Server Error");
    }
});



// @route POST api/auth
// @desc Authorize/log-in the user & give access token
// @access Public
router.post("/", [
    check("email", "Please enter a valid E-mail").isEmail(),
    check("password", "Please enter a Password").exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user){
            return res.status(400).json({ msg: "Invalid Credentials"});
        }

        const passwordMatches = await bcrypt.compare(password, user.password);

        if (!passwordMatches) {
            return res.status(400).json({ msg: "Invalid Credentials"});
        }

        // Assign JWT
        const payload = {
            user: {
                id: user.id
            }
        }

            jwt.sign(payload, config.get("jwtSecretKey"), { expiresIn: 360000 }, (err, token) => {
                if (err){
                    throw err;
                }

                res.json({ token });            
            });

            } catch (err) {
            console.error(err.message);
            res.status(500).send("Internal Server Error");
            }
            });


module.exports = router;