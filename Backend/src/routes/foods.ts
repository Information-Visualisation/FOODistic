import { selectIngredients } from "../database";
import * as bodyParser from "body-parser";
import * as express from "express";
import { Logger } from "../logger";

class Food {

    public express: express.Application;
    public logger: Logger;

    // array to hold users
    public foods: any[];

    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
        this.foods = [];
        this.logger = new Logger();
    }

    // Configure Express middleware.
    private middleware(): void {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    }

    private routes(): void {

        // request to get all the foods
        this.express.get("/foods", async (req, res, next) => {
            this.logger.info("url:" + req.url);
            res.set('Access-Control-Allow-Origin', 'http://localhost:5173');
            res.json(await selectIngredients());
        });

        // request to get all the foods by foodName
        this.express.get("/foods/:foodName", (req, res, next) => {
            this.logger.info("url:::::" + req.url);
            const food = this.foods.filter(function(food) {
                if (req.params.foodName === food.foodName) {
                    return food;
                }
            });
            res.json(food);
        });

        // request to post the user
        // req.body has object of type {firstName:"fnam1",lastName:"lnam1",userName:"username1"}
        this.express.post("/food", (req, res, next) => {
            this.logger.info("url:::::::" + req.url);
            this.foods.push(req.body.user);
            res.json(this.foods);
        });
    }
}

export default new Food().express;