module.exports.start = (client) => {

    const Appeal = require("../models/appeal");
    const config = require("../config.json");
    const express = require('express');
    const app = express();
    const cookieParser = require('cookie-parser');
    const encryptor = require('simple-encryptor')('asdasklvmopqhqdviöojqisdmladm?_**92156454');
    const mongoose = require("mongoose");
    const User = require('../models/user');
    const fetch = require('node-fetch');
    const DiscordOauth2 = require("discord-oauth2");
    const oauth = new DiscordOauth2();
    const methodOverride = require("method-override");
    const favicon = require('serve-favicon');

    app.set('view engine', 'ejs');
    app.set('views', `${__dirname}/public`);
    app.use(express.static(`${__dirname}/public`));
    app.use(cookieParser())
    app.use(express.urlencoded({extended:false}));
    app.use(express.json());
    app.use(methodOverride("_method"));
    app.use(favicon(__dirname + '/public/static/icons/tyler.png'));

    app.get('/error', (req, res) => {
        res.render('./errors/whoops')
    })

    app.get('/', (req, res) => {
        return res.render('index', { url: config.discord });    
    })

    app.get('/all', (req, res) => {
        User.find().sort({
            socialCredit: "desc"
        }).then(users => {
            res.render('allusers', {users:users})
        })
    })

    app.get('/callback', async (req, res) => {
        const { code } = req.query;

        if (code) {
            try {
                const oauthResult = await fetch('https://discord.com/api/oauth2/token', {
                    method: 'POST',
                    body: new URLSearchParams({
                        client_id: config.clientid,
                        client_secret: config.clientsecret,
                        code,
                        grant_type: 'authorization_code',
                        redirect_uri: `${config.url}/callback`,
                        scope: 'identify',
                    }),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                });
    
                const oauthData = await oauthResult.json();
    
                const userResult = await fetch('https://discord.com/api/users/@me', {
                    headers: {
                        authorization: `${oauthData.token_type} ${oauthData.access_token}`,
                    },
                });

                const user = await oauth.getUser(oauthData.access_token).catch(err => {
                    if(err) return console.log(err);
                });
                res.cookie('_id', encryptor.encrypt(user.id));
            } catch (error) {
                console.error(error);
                res.redirect('/error')
            }
        }
        res.redirect('/appeal')
    })

    app.get('/appeal', async (req, res) => {
        if (!req.cookies || req.cookies._id === undefined || req.cookies._id === null) {
            res.cookie('code', req.query.code)
            return res.redirect('/');
        }

        const id = await encryptor.decrypt(req.cookies._id);

        User.findOne({ userID: id}).then(user => {
            if(!user){
                return res.redirect('/')
            } else {
                res.render('appeal', {user: user});
            }
        })
    })

    app.get('/resolve/:id', async (req, res) => {
        if (!req.cookies || req.cookies._id === undefined || req.cookies._id === null) {
            res.cookie('code', req.query.code)
            return res.redirect('/');
        }
        const id = await encryptor.decrypt(req.cookies._id);

        User.findOne({ userID: id}, { strikes: 
            { $elemMatch : 
               { 
                id: req.params.id
               } 
            } 
        }).then(async strike => {
            User.findOne({ userID: id}).then(async user => {
                res.render('resolve', { data: strike, user: user })
            }).catch(err => {console.log(err)})
        }).catch(err => {console.log(err)})
    })

    app.get('/admin', async (req, res) => {
        if (!req.cookies || req.cookies._id === undefined || req.cookies._id === null) {
            return res.redirect('/appeal');
        }

        const id = await encryptor.decrypt(req.cookies._id);

        User.findOne({ userID: id}).then(async user => {
            if(!user.isVIP){
                return res.redirect('/appeal')
            } else {
                const pp = await Appeal.find().sort({
                    createdAt:"desc"
                }).catch(err => {console.log(err)})
                const uu = await User.find().catch(err => {console.log(err)})
                res.render('admin', {user: user, users: uu, appeals: pp});
            }
        })
    })

    app.post('/send', async (req, res) => {
        User.findOne({ userID: req.body.user}).then(async user => {
            if(!user) {
                return res.redirect('error')
            } else {
                const app = await new Appeal({
                    userID: user.userID,
                    username: user.username,
                    url: user.url,
                    socialCredit: req.body.amount,
                    appeal: req.body.appeal,
                    isVIP: user.isVIP,
                    id: req.body.id
                })
                app.save().then(ts => {
                    res.redirect('verified')
                })
            }
        })
    })

    app.post('/res', (req, res) => {
        Appeal.findOne({ id: req.body.id }).then(appeal => {
            let { userID, socialCredit, id } = appeal

            User.findOneAndUpdate({ userID: userID }, {
                $inc: {
                    socialCredit: socialCredit
                },
                $pull: {
                    strikes: {
                        id: id
                    }
                }
            }, (err, doc) => { 
                if(err) {
                    console.log(err)
                } else {
                    Appeal.findOneAndRemove({ id: req.body.id}).catch(err => {
                        console.log(err)
                    })
                    res.redirect('/admin')
                }
            })
        })
    })

    app.get('/verified', (req, res) => {
        res.render('verified')
    })

    app.get('/users', (req, res) => {
        User.find().sort({
            socialCredit: "desc"
        }).limit(30).then(users => {
            res.render('users', {users:users})
        })
    })

    app.get('*', (req, res) => {
        res.render('errors/404');
    })

    app.listen(3555, () => { console.log(`Dashboard started at ${config.url}/`) });

}