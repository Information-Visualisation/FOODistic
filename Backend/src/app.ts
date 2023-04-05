import * as bodyParser from "body-parser";
import * as express from "express";
import { Logger } from "./logger";
import Routes from "./routes/routes";
import { selectIngredients } from "./database";
var cors = require('cors')

class App {

  public express: express.Application;
  public logger: Logger;

  // array to hold users
  public users: any[];

  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
    this.users = [];
    this.logger = new Logger();
    this.express.use(cors())
  }

  // Configure Express middleware.
  private middleware(): void {
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
  }

  private routes(): void {

    this.express.get("/", async (req, res, next) => {
      res.set('Access-Control-Allow-Origin', 'http://localhost:5173');
      await res.send(JSON.stringify(await selectIngredients()));
      this.logger.info("some webpage loaded");
    });

    // user route
    this.express.use("/api", Routes);

    // handle undefined routes
    this.express.use("*", (req, res, next) => {
      res.send("Make sure url is correct!!!");
    });
  }
}

export default new App().express;