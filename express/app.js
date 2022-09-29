const express = require("express");
const bodyParser = require("body-parser");
const musicController = require("./routes/music");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// We create a wrapper to workaround async errors not being transmitted correctly.
function makeHandlerAwareOfAsyncErrors(handler) {
	return async function (req, res, next) {
		try {
			await handler(req, res);
		} catch (error) {
			next(error);
		}
	};
}

// We provide a root route just as an example
app.get("/", (req, res) => {
	res.send(`Hello`);
});

app.post(
	`/api/music`,
	multer({ dest: `${__dirname}/uploads/musics/` }).any(),
	makeHandlerAwareOfAsyncErrors(musicController.create)
);

module.exports = app;
