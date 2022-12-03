const express = require("express");
const bodyParser = require("body-parser");
const musicController = require("./express/routes/music");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const { ROOT_PATH } = require("./config.js");
const app = express();

app.use(cors("*"));
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

app.use(express.static(path.join(ROOT_PATH, "uploads")));

// We provide a root route just as an example
app.get("/", (req, res) => {
	res.send(`Hello`);
});

app.post(
	`/api/music`,
	multer({ dest: `${ROOT_PATH}/uploads/musics/` }).any(),
	musicController.create
);

app.get(`/api/music`, musicController.getAll);

app.delete(`/api/music/:id`, musicController.remove);

module.exports = app;
