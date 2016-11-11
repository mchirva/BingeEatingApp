var knex = require('knex')({
    client: 'mysql',
    connection: {
        host     : 'localhost',
        user     : 'root',
        password : 'bazzinga',
        database : 'BingeEatingDb',
        charset  : 'utf8'
  }
});

var express = require("express");
var Bookshelf = require('bookshelf')(knex);
var uuid = require('uuid');
var bodyParser = require('body-parser');
var jwt    = require('jsonwebtoken');

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

app.post('/login', function(req, res){
    var username = req.body.username;
    var password = req.body.password;
    User.forge({username: username, password: password})
        .fetch()
        .then(function (user){
            if (!user) {
                res.json({error: true, data: {message: "Invalid user credentials"}});
            }else {
                var token = jwt.sign(user, JWTKEY, {
                    expiresIn: 900 //The token expries in 15 minutes
                });
                req.session.userId = user.attributes.UserId;
                if(user.attributes.Role == 'Supporter') {
                    knex.from('users')
                        .where('Role', 'Participant')
                        .andWhere('SupporterId', user.attributes.UserId)
                        .then(function(participants) {
                            res.render('pages/participants',{error: false, data: {participants: participants, token: token}});
                        })
                        .catch(function (err){
                            res.status(500).json({error: true, data: {message: err.message}});
                        })
                }
                else {
                    res.json({error: false, data: {user: user.toJSON(), token: token}});
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
        DailySummary.forge({
            LogId: uuid.v1(),
            UserId: req.body.userid,
            Time: req.body.time,
            FoodOrDrinkConsumed: req.body.consumed,
            Binge: req.body.binge,
            VomitingOrLaxative: req.body.vl,
            ContextOrSetting: req.body.cs,
            Feelings: req.body.feelings
        })
            .save(null, {method: 'insert'})
            .then(function (dailySummary) {
                res.json({error: false, data: {id: dailySummary.get('LogId')}});
            })
            .catch(function (err) {
                res.status(500).json({error: true, data: {message: err.message}});
            });
    }else {
        res.json({error: true, data: {message: 'invalid token'}});
    }

});

app.post('/postPhysicalDailyLog', function (req, res) {
    var decoded = jwt.verify(req.body.token, JWTKEY);
    if(decoded){
        PhysicalDailySummary.forge({
            LogId: uuid.v1(),
            UserId: req.body.userid,
            Time: req.body.time,
            PhysicalActivity: req.body.workout,
            MinutesPerformed: req.body.minutes
        })
            .save(null, {method: 'insert'})
            .then(function (physicalDailySummary) {
                res.json({error: false, data: {id: physicalDailySummary.get('LogId')}});
            })
            .catch(function (err) {
                res.status(500).json({error: true, data: {message: err.message}});
            });
    }else {
        res.json({error: true, data: {message: 'invalid token'}});
    }
});

app.post('/getDailyLog', function (req, res) {
    var decoded = jwt.verify(req.body.token, JWTKEY);
    if(decoded){
        var startTime = req.body.date + ' 00:00:00';
        var endTime = req.body.date + ' 23:59:59';
        knex.from('dailysummarysheet')
            .whereBetween('Time', [startTime, endTime])
            .andWhere('UserId', req.body.userid)
            .then(function(dailyLogs) {
                res.render('pages/daily',{error: false, data: dailyLogs});
            })
            .catch(function (err){
                res.status(500).json({error: true, data: {message: err.message}});
            })
    }else {
        res.json({error: true, data: {message: 'invalid token'}});
    }
});

app.post('/getWeeklyLog', function (req, res) {
    var decoded = jwt.verify(req.body.token, JWTKEY);
    if(decoded){
        var lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        console.log(lastWeek);
        knex.from('dailysummarysheet')
            .where('Time', '>', lastWeek)
            .andWhere('UserId', req.body.userId)
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
                    .andWhere('UserId', req.body.userId)
                    .andWhere('Time','>', lastWeek)
                    .then(function(count) {
                        WeeklySummary.forge({
                            LogId: uuid.v1(),
                            UserId: req.body.userId,
                            Binges: binges,
                            VLD: vld,
                            PhysicalActivity: count
                        }).save(null, {method: 'insert'})
                            .then(function (weeklyLog) {
                                res.json({error: false, weeklyLog: weeklyLog});
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
        res.json({error: true, data: {message: 'invalid token'}});
    }
});

app.post('/postWeeklyLog', function (req, res) {
    var decoded = jwt.verify(req.body.token, JWTKEY);
    if(decoded){
        knex('weeklysummarysheet')
            .where('LogId', req.body.LogId)
            .andWhere('UserId', req.body.userId)
            .update({
                Binges: req.body.binges,
                VLD: req.body.vld,
                PhysicalActivity: req.body.physical,
                FruitVegetableServings: req.body.fv,
                Events: req.body.events
            })
            .then(function (weeklySummary) {
                res.json({error: false, data: {id: weeklySummary}});
            })
            .catch(function (err) {

                res.status(500).json({error: true, data: {message: err.message}});
            });
    }else {
        res.json({error: true, data: {message: 'invalid token'}});
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
                res.json({error: false, message: message});
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
            UserId: req.body.userid,
            SupporterId: req.body.supporterId,
            AppointmentTime: req.body.dateTime
            }).save(null, {method: 'insert'})
            .then(function (appointment) {
                res.json({error: false, data: {id: appointment.attributes.AppointmentId}});
            })
            .catch(function (err) {
                res.status(500).json({error: true, data: {message: err.message}});
            });
    }
});

app.post('/getOccupiedTimes', function (req, res) {
    var decoded = jwt.verify(req.body.token, JWTKEY);
    if(decoded){
        var startTime = req.body.date + ' 00:00:00';
        var endTime = req.body.date + ' 23:59:59';
        knex.from('appointments')
            .whereBetween('AppointmentTime', [startTime, endTime])
            .andWhere('SupporterId', req.body.supporterId)
            .then(function (appointments) {
                res.json({error: false, data: {appointments: appointments}});
            })
            .catch(function (err) {
                res.status(500).json({error: true, data: {message: err.message}});
            });
    }
});

app.post('/setProgress', function (req, res) {
    var decoded = jwt.verify(req.body.token, JWTKEY);
    if(decoded){
        knex('users')
            .where('Username', req.body.username)
            .andWhere('Role', 'Participant')
            .update({
                Level: req.body.level
            })
            .then(function (user) {
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
        knex('users')
            .where('UserID', req.body.userid)
            .then(function (users) {
                res.render('pages/progress',{error: false, progress: users[0].Level});
            })
            .catch(function (err) {
                res.status(500).json({error: true, data: {message: err.message}});
            });
    }
});

app.post('/getMyProgress', function (req, res) {
    var decoded = jwt.verify(req.body.token, JWTKEY);
    if(decoded){
        knex('users')
            .where('UserID', req.body.userid)
            .then(function (users) {
                res.json({error: false, data: {progress: users[0].Level}});
            })
            .catch(function (err) {
                res.status(500).json({error: true, data: {message: err.message}});
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

app.listen(8080,function(){
  console.log("Live at Port 8080");
});