const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const app = express();


app.post('/login', (req, res) => {
    const body = req.body;

    if (!body.email || !body.password) {
        return res.status(400).json({
            success: false,
            message: 'missing email or password',
            err: { message: 'missing email or password' }
        });
    }

    User.findOne({ email: body.email }, (err, foundUser) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'an error ocurred while attempting to find the user',
                err
            });
        }

        if (!foundUser) {
            return res.status(400).json({
                success: false,
                message: 'credentials are invalid',
                err: { message: 'credentials are invalid' }
            });
        }

        if (!bcrypt.compareSync(body.password, foundUser.password)) {
            return res.status(400).json({
                success: false,
                message: 'credentials are invalid',
                err: { message: 'credentials are invalid' }
            });
        }

        const token = jwt.sign({
            user: foundUser
        }, process.env.SEED, { expiresIn: process.env.EXP_TOKEN });

        res.json({
            success: true,
            message: 'you have successfully logged in',
            data: foundUser,
            token
        });
    });
});

module.exports = app;