const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');

const router = new express.Router();

router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.cookie('token', 'Bearer ' + token);
        res.send();
    } catch (error) {
        if(error.message === 'Email is not registered!')
            res.status(404).send({ 'Error': error.message });
        else
            res.status(400).send({ 'Error': error.message });
    }
});

router.post('/signup', async (req, res) => {

    const user = new User(req.body);

    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.cookie('token', 'Bearer ' + token);
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });

        await req.user.save();
        res.clearCookie('token');
        res.send();
    } catch (error) {
        res.status(500).send('Some Error!');
    }
});

router.post('/logoutall', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.clearCookie('token');
        res.send();
    } catch (error) {
        res.status(500).send('Some Error!');
    }
});

router.delete('/deletePro', auth, async (req, res) => {
    try {
        await req.user.remove();
        res.clearCookie('token');
        res.send();
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;