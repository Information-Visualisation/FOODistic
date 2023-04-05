"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bodyParser = require("body-parser");
var express = require("express");
var logger_1 = require("../logger");
var User = /** @class */ (function () {
    function User() {
        this.express = express();
        this.middleware();
        this.routes();
        this.foods = [];
        this.logger = new logger_1.Logger();
    }
    // Configure Express middleware.
    User.prototype.middleware = function () {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    };
    User.prototype.routes = function () {
        var _this = this;
        // request to get all the users
        this.express.get("/foods", function (req, res, next) {
            _this.logger.info("url:" + req.url);
            res.json(_this.foods);
        });
        // request to get all the users by userName
        this.express.get("/foods/:foodName", function (req, res, next) {
            _this.logger.info("url:::::" + req.url);
            var food = _this.foods.filter(function (food) {
                if (req.params.foodName === food.foodName) {
                    return food;
                }
            });
            res.json(food);
        });
        // request to post the user
        // req.body has object of type {firstName:"fnam1",lastName:"lnam1",userName:"username1"}
        this.express.post("/user", function (req, res, next) {
            _this.logger.info("url:::::::" + req.url);
            _this.foods.push(req.body.user);
            res.json(_this.foods);
        });
    };
    return User;
}());
exports.default = new User().express;
