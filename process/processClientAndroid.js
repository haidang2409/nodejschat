/**
 * Created by nhdang on 7/26/2016.
 */
var connection = require('../configdb');
var mongo = require('mongodb');
var md5 = require('MD5');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'haidangdhct24@gmail.com',
        pass: '24091992'
    },
    tls: {
        rejectUnauthorized: false
    }
});
exports.addUser = function(req, callback){
    connection.getConnection(function(db){
        var collection = db.collection('user');
            var randomKey = parseInt(Math.random() * 100000).toString();
            var avatar = 'user-default-female.png';
        if(req.body.sex == 'Male')
        {
            avatar = 'user-default-male.png';
        }
        var user = {
            fullname: req.body.fullname,
            sex: req.body.sex,
            birthday: toIsoDate(req.body.birthday),
            email: req.body.email,
            password: md5(req.body.password),
            avatar: avatar,
            active: false,
            keyactive: md5(randomKey)
        };
        collection.insert(user, function (err, result) {
            if(err)
            {
                console.log(err);
                var data = {
                    status: false,
                    mess: 'Register failed!',
                    user_id: null
                }
                return callback(data);
            }
            else
            {
                //req.session.registered = 'Register account successfully!';
                var url = req.headers.host + '/active_account=' + md5(user.keyactive);
                var html = '<b>Hi, ' + user.fullname + '!</b>';
                html = html + '<br>You just have registed successfully an account.';
                html = html + '<br>Please, press link bellow to active an account: ';
                html = html + '<a href=\"' + url + '\">' + url + '</a>';
                html = html + '<br>Or copy the code: <b>' + randomKey + '</b> then paste into textbox on register form to active account';
                var mailOption = {
                    to: user.email,
                    subject: 'Confirm account!',
                    html: html
                };
                transporter.sendMail(mailOption, function(error, info){
                    if(error){
                        console.log(error);
                        var data = {
                            status: false,
                            mess: 'Register failed with email!',
                            user_id: null
                        }
                        return callback(data);
                    }else{
                        console.log('Message sent: ' + info.response);
                        var data = {
                            status: true,
                            mess: 'You just have registered an account successfully!',
                            user_id: result[0]._id
                        }
                        return callback(data);
                    }
                });
            }
        });
    })
};

exports.checkExistEmail = function(req, callback){
    var email = req.body.email;
    connection.getConnection(function(db){
        var collection = db.collection('user');
        collection.find({email: email}).toArray(function(err, result){
            if(err)
            {
                console.log(err);
                return callback(false);
            }
            else
            {
                if(result.length > 0)
                {
                    console.log(result[0]);
                    return callback(true);
                }
                else
                {
                    return callback(false);
                }
            }
        });
    });
};

exports.checkKeyActive = function(req, callback){
    connection.getConnection(function(db){
        db.collection('user', function(err, collection){
            if(err)
            {
                console.log(err);
                var data = {
                    status: false,
                    mess: 'Error system!'
                };
                return callback(data);
            }
            else
            {
                var BSON = mongo.BSONPure;
                var userId = new BSON.ObjectID(req.body.userId);
                var key = md5(req.body.key);
                collection.find({_id: userId, keyactive: key}).toArray(function(err, result){
                    if(err)
                    {
                        var data = {
                            status: false,
                            mess: 'Error system!'
                        };
                        return callback(data);
                    }
                    else
                    {
                        if(result.length > 0)
                        {
                            collection.update({_id: userId},{$set: {active: true, keyactive: ''}}, function(err, result2){
                                if(err)
                                {
                                    var data = {
                                        status: false,
                                        mess: 'Error system!'
                                    };
                                    return callback(data);
                                }
                                else
                                {
                                    var data = {
                                        status: true,
                                        mess: ''
                                    };
                                    return callback(data);
                                }
                            });
                        }
                        else
                        {
                            var data = {
                                status: false,
                                mess: 'Key is not math'
                            };
                            return callback(data);
                        }
                    }

                });
            }
        });
    })
};

exports.login = function(req, callback){
    var email = req.body.email;
    var password = req.body.password;
    connection.getConnection(function(db){
        db.collection('user', function(err, collection){
            if(!err)
            {
                collection.find({email: email, password: md5(password)}).toArray(function(err2, result){
                    if(!err)
                    {
                        if(result.length > 0)
                        {
                            if(result[0].active == false)
                            {
                                var data = {
                                    status: false,
                                    mess: 'notactive'
                                };
                                return callback(data);
                            }
                            else
                            {
                                var data = {
                                    status: true,
                                    mess: ''
                                };
                                req.session.userId = result[0]._id;
                                req.session.fullname = result[0].fullname;
                                req.session.avatar = result[0].avatar;
                                req.session.sex = result[0].sex;
                                return callback(data);
                            }
                        }
                        else
                        {
                            var data = {
                                status: false,
                                mess: 'Email or password is not correct!'
                            };
                            return callback(data);
                        }
                    }
                    else
                    {
                        var data = {
                            status: false,
                            mess: 'Error system!'
                        };
                        return callback(data);
                    }
                });
            }
        }) ;
    });
};
exports.loginAppAndorid = function(email, password, callback){
    connection.getConnection(function(db){
        db.collection('user', function(err, collection){
            if(!err)
            {
                collection.find({email: email, password: md5(password)}).toArray(function(err2, result){
                    if(!err)
                    {
                        if(result.length > 0)
                        {
                            if(result[0].active == false)
                            {
                                var data = {
                                    status: false,
                                    mess: 'notactive'
                                };
                                return callback(data);
                            }
                            else
                            {
                                var data = {
                                    status: true,
                                    mess: ''
                                };
                                return callback(data);
                            }
                        }
                        else
                        {
                            var data = {
                                status: false,
                                mess: 'Email or password is not correct!'
                            };
                            return callback(data);
                        }
                    }
                    else
                    {
                        var data = {
                            status: false,
                            mess: 'Error system!'
                        };
                        return callback(data);
                    }
                });
            }
        }) ;
    });
};
function randomKey(){
    var floatKey = Math.random() * 100000;
    return  parseInt(floatKey).toString();
}
function toIsoDate(date){//date format yyyy/mm/dd
    var initial = date.split(/\//);
    return new Date([ initial[0], initial[1], initial[2] ].join('-'));
}
