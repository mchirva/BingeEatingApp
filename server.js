var knex = require('knex')({
    client: 'mysql',
    connection: {
        host     : 'localhost',
        user     : 'root',
        password : 'bazzinga',
        database : 'bingeeatingdb',
        charset  : 'utf8'
  }
});

var express = require("express");
var Bookshelf = require('bookshelf')(knex);
var uuid = require('uuid');
var bodyParser = require('body-parser');
var jwt    = require('jsonwebtoken');
//var push = require('./modelObject');
var crypto = require('crypto');

var options = {
    cert: 'keys/cert.pem',
    key: 'keys/key.pem',
    passphrase: 'bazzinga',
    production: false,
    connectionTimeout: 10000
};

//var apnConnection = new apn.Connection(options);

var app = express();

app.use(require('morgan')('dev'));

var session = require('express-session');

var FileStore = require('session-file-store')(session);

app.use(session({
    name: 'server-session-cookie-id',
    secret: 'binge secret',
    saveUninitialized: true,
    resave: true,
    store: new FileStore()
}));

var JWTKEY = 'BingeEating'; // Key for Json Web Token

// body-parser middleware for handling request variables
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//to render images
app.use(express.static(__dirname + '/images'))

app.set('view engine', 'ejs');

var User = Bookshelf.Model.extend({
    tableName: 'users'
});

var DailySummary = Bookshelf.Model.extend({
   tableName: 'dailysummarysheet'
});

var PhysicalDailySummary = Bookshelf.Model.extend({
    tableName: 'physicaldailysummary'
});

var WeeklySummary = Bookshelf.Model.extend({
    tableName: 'weeklysummarysheet'
});

var Appointments = Bookshelf.Model.extend({
    tableName: 'appointments'
});

app.get('/', function(req, res) {
   res.render('pages/login');
});

// function sendPushForDevice(withToken, pushMessage, callback){
//     //Sending push...
//     //var myDevice = new apn.Device(withToken);
//     var myDevice = "";
//     var note = new apn.Notification();
//
//     note.expiry = pushMessage.expiry;
//     note.badge = pushMessage.badge;
//     note.sound = pushMessage.sound;
//     note.alert = pushMessage.alert;
//     note.payload = pushMessage.payload;
//
//     apnConnection.pushNotification(note, myDevice);
//     callback();
//     //Push ends here ...
// }
//
// app.post('/push', function(req, res){
//     var token = req.body.dToken;
//     if(!token){
//         res.json({error: true, data: {message: 'Push failed!'}});
//     }else {
//         Discount.forge({region: placesByBeacons["15212:31506"]})
//             .fetch()
//             .then(function (discount) {
//                 var alertMessage = discount.get('discount') + ' % discount on ' + discount.get('product_name');
//                 var pushMessage = new push.PushMessage(alertMessage, discount.toJSON());
//                 sendPushForDevice(token, pushMessage, function() {
//                     res.json({error: false, data: {message: 'Push sent!'}});
//                 });
//             })
//             .catch(function (err){
//                 res.status(500).json({error: true, data: {message: err.message}});
//             })
//     }
// });

app.post('/login', function(req, res){
    var username = req.body.username;
    var password = req.body.password;
    User.forge({username: username, password: password})
        .fetch()
        .then(function (user){
            if (!user) {
                res.render('pages/participants',{error: true, data: {message: "Invalid user credentials"}});
            }else {
                var token = jwt.sign(user, JWTKEY, {
                    expiresIn: 900 //The token expries in 15 minutes
                });
                req.session.user = user.attributes;
                if(req.session.user.Role == 'Supporter' || req.session.user.Role == 'Admin') {
                    knex('activity').innerJoin('users', 'activity.UserId', 'users.UserId')
                        .where('users.SupporterId', req.session.user.UserId)
                        .andWhereBetween('activity.ActivityDateTime', [new Date() - 1, new Date()])
                        .then(function (activities) {
                            //res.render('pages/newsfeed', {error: false, token: token, data :{activities: activities}});
                            res.json({error: false, token: token, data :{activities: activities}});
                        })
                        .catch( function (err) {
                            res.render('pages/newsfeed', {error: true, data :{message: err.message}});
                        })
                }
                else {
                    res.render('pages/login', {error: true, data: {message: 'Oops! Only supporters can login using the web portal!'}});
                }
            }
        })
        .catch(function (err) {
            res.render('pages/participants', {error: true, data: {message: err.message}});
        });
});

var genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0,length);   /** return required number of characters */
};

var sha512 = function(password, salt){
    var hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};

function saltHashPassword(userpassword) {
    var salt = genRandomString(16);
    var passwordData = sha512(userpassword, salt);
}


app.post('/getNewsFeed', function (req, res) {
    if (req.session.user.Role == 'Supporter' || req.session.user.Role == 'Admin') {
        knex('activity').innerJoin('users', 'activity.UserId', 'users.UserId')
            .where('users.SupporterId', req.session.user.UserId)
            .andWhereBetween('activity.ActivityDateTime', [new Date() - 1, new Date()])
            .then(function (activities) {
                //res.render('pages/newsfeed', {error: false, data :{activities: activities}});
                res.json({error: false, data :{activities: activities}});
            })
            .catch( function (err) {
                //res.render('pages/newsfeed', {error: true, data :{message: err.message}});
                res.json({error: true, data :{message: err.message}});
            })
    } else {
        res.render('pages/login');
    }
});

app.post('/signin', function(req, res){
    var username = req.body.username;
    var password = req.body.password;
    User.forge({username: username, password: password})
        .fetch()
        .then(function (user){
            if (!user) {
                res.status(401).json({error: true, data: {message: "Invalid user credentials"}});
            }else {
                var token = jwt.sign(user, JWTKEY, {
                    expiresIn: 900 //The token expries in 15 minutes
                });
                if(user.attributes.Role == 'Participant') {
                    req.session.user = user.attributes;
                    res.status(200).json({error: false, data: {token: token}});
                }
                else {
                    res.json(401).json({error: true, data: {message: 'Oops! Only participants can login using the mobile application!'}});
                }
            }
        })
        .catch(function (err) {
            res.status(500).json({error: true, data: {message: err.message}});
        });
});

app.post('/postDailyLog', function (req, res) {
    var decoded = jwt.verify(req.body.token, JWTKEY);
    if(decoded){
        var dailyLogs = [];
        var data = JSON.parse(req.body.data);
        for (var i = 0; i < data.length; i++) {
            dailyLogs.push({
                LogId: uuid.v1(),
                UserId: req.session.user.UserId,
                Time: data[i].time,
                FoodOrDrinkConsumed: data[i].consumed,
                Binge: data[i].binge,
                VomitingOrLaxative: data[i].vl,
                ContextOrSetting: data[i].cs,
                Feelings: data[i].feelings
            });
        }
        knex('dailysummarysheet')
            .insert(dailyLogs)
            .then( function (count) {
                knex('activity')
                    .insert({
                        Id: uuid.v1(),
                        UserId: req.session.user.UserId,
                        Activity: 'Daily Log',
                        ActivityDateTime: new Date()
                    })
                    .then( function (count) {
                        res.status(200).json({error: false, data: {logs: dailyLogs}});
                    })
                    .catch( function (err) {
                        res.status(500).json({error: true, data: {message: err.message}});
                    });
            })
            .catch( function (err) {
                res.status(500).json({error: true, data: {message: err.message}});
            });
    }else {
        res.status(401).json({error: true, data: {message: 'invalid token'}});
    }
});

app.post('/postPhysicalDailyLog', function (req, res) {
    var decoded = jwt.verify(req.body.token, JWTKEY);
    if(decoded){
        var dailyLogs = [];
        var data = JSON.parse(req.body.data);
        for (var i = 0; i < data.length; i++) {
            dailyLogs.push({
                LogId: uuid.v1(),
                UserId: req.session.user.UserId,
                Time: data[i].time,
                PhysicalActivity: data[i].workout,
                MinutesPerformed: data[i].minutes
            });
        }
        knex('physicaldailysummary')
            .insert(dailyLogs)
            .then( function (count) {
                knex('activity')
                    .insert({
                        Id: uuid.v1(),
                        UserId: req.session.user.UserId,
                        Activity: 'Daily Physical Log',
                        ActivityDateTime: new Date()
                    })
                    .then( function (count) {
                        res.status(200).json({error: false, data: {logs: dailyLogs}});
                    })
                    .catch( function (err) {
                        res.status(500).json({error: true, data: {message: err.message}});
                    });
            })
            .catch( function (err) {
                res.status(500).json({error: true, data: {message: err.message}});
            });
    }else {
        res.status(401).json({error: true, data: {message: 'invalid token'}});
    }
});

app.post('/getDailyLog', function (req, res) {
    var decoded = jwt.verify(req.body.token, JWTKEY);
    if(decoded){
        var Id = '';
        if(req.session.user.Role == 'Supporter' || req.session.user.Role == 'Admin') {
            Id = req.body.userId;
        }
        else {
            Id = req.session.user.UserId;
        }
        var startTime = req.body.date + ' 00:00:00';
        var endTime = req.body.date + ' 23:59:59';
        knex.from('dailysummarysheet')
            .whereBetween('Time', [startTime, endTime])
            .andWhere('UserId', Id)
            .then(function(dailyLogs) {
                if(req.session.Role == 'Supporter' || req.session.Role == 'Admin') {
                    //res.render('pages/daily', {error: false, data: {dailyLogs: dailyLogs}});
                    res.json({error: false, data: {dailyLogs: dailyLogs}});
                }
                else {
                    res.status(200).json({error: false, data: {dailyLogs: dailyLogs}});
                }

            })
            .catch(function (err){
                res.status(500).json({error: true, data: {message: err.message}});
            })
    }else {
        res.status(401).json({error: true, data: {message: 'invalid token'}});
    }
});

app.post('/getNewWeeklyLog', function (req, res) {
    var decoded = jwt.verify(req.body.token, JWTKEY);
    if(decoded){
        var lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        knex.from('dailysummarysheet')
            .where('Time', '>', lastWeek)
            .andWhere('UserId', req.session.user.UserId)
            .then(function(dailyLogs) {
                var binges = 0;
                var vld = 0;
                for (var i = 0; i < dailyLogs.length; i++) {
                    if(dailyLogs[i].Binge == 1) {
                        binges++;
                    }
                    if(dailyLogs[i].VomitingOrLaxative == 1) {
                        vld++;
                    }
                }
                knex('physicaldailysummary').count('LogId')
                    .where('MinutesPerformed', '>', 30)
                    .andWhere('UserId', req.session.user.UserId)
                    .andWhere('Time','>', lastWeek)
                    .then(function(count) {
                        WeeklySummary.forge({
                            LogId: uuid.v1(),
                            UserId: req.session.user.UserId,
                            week: req.body.week,
                            Binges: binges,
                            VLD: vld,
                            PhysicalActivity: count,
                            CreatedDateTime: new Date()
                        }).save(null, {method: 'insert'})
                            .then(function (weeklyLog) {
                                res.status(200).json({error: false, data: {weeklyLog: weeklyLog}});
                            })
                            .catch(function (err) {
                                res.status(500).json({error: true, data: {message: err.message}});
                            });
                    })
                    .catch(function (err){
                        res.status(500).json({error: true, data: {message: err.message}});
                    })
            })
            .catch(function (err){
                res.status(500).json({error: true, data: {message: err.message}});
            })
    }else {
        res.status(401).json({error: true, data: {message: 'invalid token'}});
    }
});

app.post('/getWeeklyLog', function (req, res) {
    var decoded = jwt.verify(req.body.token, JWTKEY);
    if(decoded) {
        var Id = '';
        if(req.session.user.Role == 'Supporter' || req.session.user.Role == 'Admin') {
            Id = req.body.userId;
        } else {
            Id = req.session.user.UserId;
        }
        knex('weeklysummarysheet')
            .where('Week', req.body.week)
            .andWhere('UserId', Id)
            .then(function (weeklyLog) {
                if (req.session.Role == 'Supporter' || req.session.Role == 'Admin') {
                    //res.render('pages/weekly', {error: false, data: {weeklyLog: weeklyLog}});
                    res.json({error: false, data: {weeklyLog: weeklyLog}});
                }
                else {
                    res.status(200).json({error: false, data: {weeklyLog: weeklyLog}});
                }
            })
            .catch(function (err) {
                if (req.session.Role == 'Supporter' || req.session.Role == 'Admin') {
                    res.render('pages/weekly', {error: true, data: {message: err.message}});
                }
                else {
                    res.status(200).json({error: false, data: {message: err.message}});
                }
            })
    }else {
        if (req.session.Role == 'Participant') {
            res.status(401).json({error: true, data: {message: 'invalid token'}});
        }
        else {
            res.render('pages/weekly', {error: true, data: {message: 'invalid token'}});
        }
    }
});

app.post('/postWeeklyLog', function (req, res) {
    var decoded = jwt.verify(req.body.token, JWTKEY);
    if(decoded){
        knex('weeklysummarysheet')
            .where('LogId', req.body.LogId)
            .andWhere('UserId', req.session.user.UserId)
            .update({
                Binges: req.body.binges,
                VLD: req.body.vld,
                PhysicalActivity: req.body.physical,
                FruitVegetableServings: req.body.fv,
                Events: req.body.events,
                UpdatedDateTime: new Date()
            })
            .then(function (weeklySummary) {
                knex('activity')
                    .insert({
                        Id: uuid.v1(),
                        UserId: req.session.user.UserId,
                        Activity: 'Weekly Log',
                        ActivityDateTime: new Date()
                    })
                    .then( function (count) {
                        res.status(200).json({error: false, data: {weeklyLog: weeklySummary}});
                    })
                    .catch( function (err) {
                        res.status(500).json({error: true, data: {message: err.message}});
                    });
            })
            .catch(function (err) {
                res.status(500).json({error: true, data: {message: err.message}});
            });
    }else {
        res.status(401).json({error: true, data: {message: 'invalid token'}});
    }
});

app.post('/addNotes', function (req, res) {
    var decoded = jwt.verify(req.body.token, JWTKEY);
    if(decoded){
        knex('notes')
            .insert({
                Id: uuid.v1(),
                Notes: req.body.notes,
                UserId: req.session.user.UserId,
                IsVisible: req.body.isVisible
            })
            .then( function (notes) {
                res.status(200).json({error: false, data: {notes: notes}});
            })
            .catch( function (err) {
                res.status(500).json({error: true, data: {message: err.message}});
            });
    }
    else {
        res.status(401).json({error: true, data: {message: 'invalid token'}});
    }
});

app.post('/viewNotes', function (req, res) {
    var decoded = jwt.verify(req.body.token, JWTKEY);
    if(decoded){
        var userId = '';
        var supporter = '';
        var isVisible = [];
        if (req.session.user.Role == 'Supporter' || req.session.user.Role == 'Admin') {
            userId = req.body.userId;
            supporter = req.session.user.UserId;
        }
        else {
            userId = req.session.user.UserId;
            supporter = req.session.user.SupporterId;
            isVisible.push(0);
        }
        isVisible.push(1);
        knex('notes').innerJoin('users', 'notes.UserId', 'users.UserId')
            .whereIn('IsVisible', isVisible)
            .andWhere('users.UserId', userId)
            .andWhere('SupporterId', supporter)
            .then( function (notes) {
                if (req.session.user.Role == 'Supporter' || req.session.user.Role == 'Admin') {
                    //res.render('pages/notes', {error: false, data: {notes: notes}});
                    res.json({error: false, data: {notes: notes}});
                }
                else {
                    res.status(200).json({error: false, data: {notes: notes}});
                }
            })
            .catch( function (err) {
                if (req.session.user.Role == 'Supporter' || req.session.user.Role == 'Admin') {
                    res.render('pages/notes', {error: true, data: {message: err.message}});
                }
                else {
                    res.status(200).json({error: true, data: {message: err.message}});
                }
            });
    } else {
        res.status(401).json({error: true, data: {message: 'invalid token'}});
    }
});

app.post('/getMotivationalMessage', function (req, res) {
     var decoded = jwt.verify(req.body.token, JWTKEY);
     if(decoded){
         var offset = Math.floor(Math.random() * (10 - 1)) + 1;
        knex.from('messages')
            .where('Label', req.body.label)
            .limit(1)
            .offset(offset)
            .then(function(message) {
                    res.json({error: false, data: {message: message}});
            })
            .catch(function (err){
                    res.status(500).json({error: true, data: {message: err.message}});
            })
     }
});

app.post('/setAppointment', function (req, res) {
    var decoded = jwt.verify(req.body.token, JWTKEY);
    if(decoded){
        Appointments.forge({
            AppointmentId: uuid.v1(),
            UserId: req.body.userId,
            SupporterId: req.session.user.UserId,
            AppointmentTime: req.body.dateTime
            }).save(null, {method: 'insert'})
            .then(function (appointment) {
                //res.render('pages/appointment', {error: false, data: {id: appointment.attributes.AppointmentId}});
                res.json({error: false, data: {id: appointment.attributes.AppointmentId}});
            })
            .catch(function (err) {
                res.render('pages/appointment', {error: true, data: {message: err.message}});
            });
    }
    else {
        res.render('pages/appointment', {error: true, data: {message: 'invalid token'}});
    }
});

app.post('/getOccupiedTimes', function (req, res) {
    var decoded = jwt.verify(req.body.token, JWTKEY);
    if(decoded){
        var startTime = req.body.date + ' 00:00:00';
        var endTime = req.body.date + ' 23:59:59';
        knex.from('appointments')
            .whereBetween('AppointmentTime', [startTime, endTime])
            .andWhere('SupporterId', req.session.user.UserId)
            .then(function (appointments) {
                //res.render('pages/appointment', {error: false, data: {appointments: appointments}});
                res.json({error: false, data: {appointments: appointments}});
            })
            .catch(function (err) {
                //res.render('pages/appointment', {error: true, data: {message: err.message}});
                res.json({error: true, data: {message: err.message}});
            });
    }
    else {
        //res.render('pages/appointment', {error: true, data: {message: 'invalid token'}});
        res.json({error: true, data: {message: 'invalid token'}});
    }
});

app.post('/getMyAppointments', function (req, res) {
    var decoded = jwt.verify(req.body.token, JWTKEY);
    if(decoded){
        var id = '';
        if (req.session.user.Role == 'Supporter' || req.session.user.Role == 'Admin') {
            id = req.body.userId;
        }
        else {
            id = req.session.user.UserId;
        }
        knex.from('appointments')
            .where('UserId', id)
            .then (function (appointments) {
                res.status(200).json({error: false, data: {appointments: appointments}});
            })
            .catch( function (err) {
                res.status(500).json({error: true, data: {message: err.message}});
            })
    }
    else {
        res.status(401).json({error: true, data: {message: 'inavlid token'}});
    }
});

app.post('/setProgress', function (req, res) {
    var decoded = jwt.verify(req.body.token, JWTKEY);
    if(decoded){
        knex('users')
            .where('UserId', req.body.userId)
            .andWhere('Role', 'Participant')
            .update({
                Level: req.body.level
            })
            .then(function (user) {
                //res.render('pages/progress', {error: false, data: {user: user}});
                res.json({error: false, user: user});
            })
            .catch(function (err) {
                res.status(500).json({error: true, data: {message: err.message}});
            });
    }
});

app.post('/getProgress', function (req, res) {
    var decoded = jwt.verify(req.body.token, JWTKEY);
    if(decoded){
        var Id = '';
        if (req.session.user.Role == 'Supporter' || req.session.user.Role == 'Admin') {
            Id = req.body.userId;
        }
        else {
            Id = req.session.user.UserId;
        }
        knex('users')
            .where('UserID', Id)
            .then(function (users) {
                if (req.session.user.Role == 'Supporter' || req.session.user.Role == 'Admin') {
                    //res.render('pages/progress', {error: false, data: {progress: users[0].Level}});
                    res.json({error: false, data: {progress: users[0].Level}});
                }
                else {
                    res.json({error: false, data: {progress: users[0].Level}});
                }
            })
            .catch(function (err) {
                if (req.session.user.Role == 'Supporter' || req.session.user.Role == 'Admin') {
                    res.render('pages/progress', {error: false, data: {message: err.message}});
                }
                else {
                    res.status(500).json({error: true, data: {message: err.message}});
                }
            });
    }
});

app.post('/getChallenge', function (req, res) {
    var decoded = jwt.verify(req.body.token, JWTKEY);
    if(decoded) {
        var challengeId = Math.floor(Math.random() * (21 - 1)) + 1;
        knex('challenges')
            .where('ChallengeId', challengeId)
            .then(function (challenge) {
                res.json({error: false, data: {challenge: challenge}});
            })
            .catch(function (err) {
                res.status(500).json({error: true, data: {message: err.message}});
            });
    }
});

app.post('/createUser', function (req, res) {
    var decoded = jwt.verify(req.body.token, JWTKEY);
    if(decoded) {

    }
    else {

    }
});

app.listen(8080,function(){
  console.log("Live at Port 8080");
});