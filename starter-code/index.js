const express    = require("express");
const morgan     = require("morgan");
const bodyParser = require("body-parser");
const mongoose   = require("mongoose");
const cors       = require("cors");
const path       = require("path");

const app        = express();
const config     = require("./config/config");
const webRouter  = require("./config/webRoutes");
const apiRouter  = require("./config/apiRoutes");

mongoose.connect(config.db);

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(cors());
app.use(express.static(path.join(__dirname, "./public")));
app.use("/", webRouter);
app.use("/api", apiRouter);

app.listen(config.port, () => console.log(`Express started on port: ${config.port}`));
