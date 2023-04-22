import * as bodyParser from "body-parser";
import * as express from "express";
import { Logger } from "./logger";
// import Routes from "./routes/routes";
import { DBConnection } from "./database";
var cors = require('cors')

class App {

  public express: express.Application;
  public logger: Logger;
  public db: DBConnection;

  // array to hold users
  public users: any[];

  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
    this.users = [];
    this.logger = new Logger();
    this.db = new DBConnection(this.logger);
    this.express.use(cors())
  }

  // Configure Express middleware.
  private middleware(): void {
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
  }

  private routes(): void {

    this.express.get("/db", async (req, res, next) => {
      let query: string = req.query.query as string;
      if (query !== undefined) {
        res.set('Access-Control-Allow-Origin', 'http://localhost:5173');
        await res.send(JSON.stringify(await this.db.select(query)));
        this.logger.info(query);
      } else {
        this.logger.error("query is undefined");
      }
    });

    // // user route
    // this.express.use("/api", Routes);

    // handle undefined routes
    this.express.use("*", (req, res, next) => {
      res.send("URL is incorrect");
    });
  }
}

export default new App().express;