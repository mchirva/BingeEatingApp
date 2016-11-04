var knex = require('knex')({
    client: 'mysql',
    connection: {
        host     : 'localhost',
        user     : 'root',
        password : '',
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

var JWTKEY = 'BingeEating'; // Key for Json Web Token

// body-parser middleware for handling request variables
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

var User = Bookshelf.Model.extend({
    tableName: 'users'
});

var DailySummary = Bookshelf.Model.extend({
   tableName: 'dailySummarySheet'
});

var PhysicalDailySummary = Bookshelf.Model.extend({
    tableName: 'physicalDailySummary'
});

var WeeklySummary = Bookshelf.Model.extend({
    tableName: 'weeklysummarysheet'
});

// var CategoryItem = Bookshelf.Model.extend({
//   tableName: 'itemCategory',
//     category: function() {
//         return this.belongsTo(Category, "CategoryId");
//     },
//     item: function() {
//         return this.belongsTo(Item, "ItemId");
//     }
// });
//
// var Items = Bookshelf.Collection.extend({
//   model: Item
// });
//
// var Categories = Bookshelf.Collection.extend({
//   model: Category
// });

var selectedCategoryId = "";
var categories = {};

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
                res.json({error: false, data: {user: user.toJSON(), token: token}});
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
            PhysicalActivity: req.body.consumed,
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

app.post('/getWeeklyLog', function (req, res) {
    var decoded = jwt.verify(req.body.token, JWTKEY);
    if(decoded){
        var lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        console.log(lastWeek);
        knex.from('dailySummarySheet')
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

// app.post('/getMotivationaMessage', function (req, res)) {
//     var decoded = jwt.verify(req.body.token, JWTKEY);
//     if(decoded){
//
//     }
// }

app.listen(3000,function(){
  console.log("Live at Port 3000");
});