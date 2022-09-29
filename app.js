const express = require("express");
const bodyParser = require("body-parser");
const musicController = require("./express/routes/music");
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const { BASE_URL } = require("./config.js");
const app = express();

app.use(cors('*'));
app.use(
    bodyParser.json({
        limit: "15360mb",
        type: "application/json",
    })
);

app.use(
    bodyParser.urlencoded({
        limit: "15360mb",
        extended: true,
        parameterLimit: 5000000,
        type: "application/json",
    })
);

app.use(express.static(path.join(BASE_URL, "uploads")));

// We provide a root route just as an example
app.get("/", (req, res) => {
	res.send(`Hello`);
});

app.post(
	`/api/music`,
	multer({ dest: `${BASE_URL}/uploads/musics/` }).any(),
	musicController.create
);

module.exports = app;
