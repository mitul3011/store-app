const express = require('express');
const auth = require('../middleware/auth');

const router = new express.Router();

router.get('/Login', (req, res) => {
    if(req.cookies.token){
        return res.redirect('/home');
    }

    res.render('login');
});

router.get('/signup', (req, res) => {
    if(req.cookies.token){
        return res.redirect('/home');
    }

    res.render('signup');
});

router.get('/home', auth, (req, res) => {
    res.render('home', {
        home: true,
        name: req.user.name
    });
});

module.exports = router;