import * as functions from "firebase-functions";
import * as express from "express";
import { addScore, getAllScores } from "./scoreController";

const app = express();

const cors = require("cors");
const whitelist = ["http://localhost:3000", "http://localhost:3001"];
const corsOptions = {
  origin: (origin: any, callback: any) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else if (origin) {
      callback(new Error("Not allowed by CORS"));
    } else {
      callback(null, true);
    }
  },
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

app.get("/", (req, res) => res.status(200).send("Hey there!"));
exports.app = functions.https.onRequest(app);

app.post("/scores", addScore);
app.get("/scores", getAllScores);
