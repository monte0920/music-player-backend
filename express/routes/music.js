const UploaderManager = require("../Filemanager");
const { models } = require("../../sequelize");
const { getIdParam } = require("../helpers");

async function getAll(req, res) {
	const musics = await models.music.findAll();
	res.status(200).json(musics);
}

async function getById(req, res) {
	const id = getIdParam(req);
	const user = await models.user.findByPk(id);
	if (user) {
		res.status(200).json(user);
	} else {
		res.status(404).send("404 - Not found");
	}
}

async function create(req, res) {
	const { type, instrument } = req.body;

	if (!type || !instrument) {
		res
			.status(400)
			.send(
				`Bad request: instrument should not be provided, since it is determined automatically by the database.`
			);
	} else {
		UploaderManager(req, "musics", async (data) => {
			try {
				await models.music.create({
					file_name: data[0].name,
					type,
					instrument,
				});

				const musics = await models.music.findAll();
				res.status(200).json(musics);
			} catch (error) {
				console.log(error);
				res.status(500).send(false);
			}
		});
	}
}

async function update(req, res) {
	const id = getIdParam(req);

	// We only accept an UPDATE request if the `:id` param matches the body `id`
	if (req.body.id === id) {
		await models.user.update(req.body, {
			where: {
				id: id,
			},
		});
		res.status(200).end();
	} else {
		res
			.status(400)
			.send(
				`Bad request: param ID (${id}) does not match body ID (${req.body.id}).`
			);
	}
}

async function remove(req, res) {
	const id = getIdParam(req);
	await models.user.destroy({
		where: {
			id: id,
		},
	});
	res.status(200).end();
}

module.exports = {
	getAll,
	getById,
	create,
	update,
	remove,
};
