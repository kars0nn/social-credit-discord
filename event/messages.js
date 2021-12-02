const Discord = require('discord.js')
const config = require('../config.json')
const User = require('../models/user')
var randomstring = require("randomstring")

module.exports.start = (client) => {

    // setInterval(async () => {
    //     let u = await User.find()
    
    //     for (let i = 0; i < u.length; i++) {
    //         User.findOneAndUpdate({userID: u[i].userID}, {
    //             $inc:{
    //                 socialCredit: 50
    //             }
    //         }).catch(err => {
    //             console.log(err)
    //         })
    //     }
    // }, 86400000) // adds 50 credits to each user every day 

    client.on("message", async message => {
        let wordz = config.ultrabad
        for (var x = 0; x < wordz.length; x++) {
            if (message.content.toLowerCase().includes(wordz[x])) {
                let g = wordz[x]
                User.findOne({ userID: message.author.id }).then(user => {
                    if(!user){
                        const newUser = new User({
                            userID: message.author.id,
                            username: message.author.tag,
                            url: message.author.avatarURL(),
                            socialCredit: 0,
                            strikes: {
                                reason: "禁止字(Forbidden Word!)",
                                message: message.content,
                                keyWord: g,
                                amount: 500,
                                id: randomstring.generate(30)
                            }
                        })
                        newUser.save().catch(err => console.log(err))
                    } else {
                        User.findOneAndUpdate({ userID: message.author.id }, {
                            $inc: {
                                socialCredit: -500
                            },
                            $push: {
                                strikes: {
                                    reason:"禁止字(Forbidden Word!)",
                                    message: message.content,
                                    keyWord: g,
                                    amount: 500,
                                    id: randomstring.generate(30)
                                }
                            }
                        }, (err, doc) => { 
                            if(err) {
                                console.log(err)
                            }
                        })
                    }
                })
            }
        }
        let phrase = config.good
        for (var x = 0; x < phrase.length; x++) {
            if (message.content.toLowerCase().includes(phrase[x])) {
                let g = phrase[x]
                User.findOne({ userID: message.author.id }).then(user => {
                    if(!user){
                        const newUser = new User({
                            userID: message.author.id,
                            username: message.author.tag,
                            url: message.author.avatarURL(),
                            socialCredit: 100
                        })
                        newUser.save().catch(err => console.log(err))
                    } else {
                        User.findOneAndUpdate({ userID: message.author.id }, {
                            $inc: {
                                socialCredit: 100
                            }
                        }, (err, doc) => { 
                            if(err) {
                                console.log(err)
                            }
                        })
                    }
                })
            }
        }
    })

}