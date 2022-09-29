const fs = require("fs");
const UploaderManager = require("../Filemanager");
const { models } = require("../../sequelize");
const { getIdParam } = require("../helpers");
const { BASE_URL } = require("../../config");

async function getAll(req, res) {
	const musics = await find();
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
			const music = await models.music.findAll({
				where: {
					type,
					instrument,
				},
			});

			if (music.length) {
				try {
					await fs.unlinkSync(
						`${BASE_URL}/uploads/musics/${music[0].file_name}`
					);
					console.log(`successfully deleted ${music[0].file_name}`);

					await models.music.update(
						{ file_name: data[0].name },
						{
							where: {
								id: music[0].id,
							},
						}
					);
					
					const musics = await find();
					res.status(200).json(musics);
				} catch (error) {
					console.error("there was an error:", error.message);
				}
			} else {
				try {
					await models.music.create({
						file_name: data[0].name,
						type,
						instrument,
					});
					const musics = await find();
					res.status(200).json(musics);
				} catch (error) {
					console.log(error);
					res.status(500).send(false);
				}
			}
		});
	}
}

async function find() {
	const musics = await models.music.findAll({
		order: [["instrument", "ASC"]],
	});
	return musics;
}

async function findOne(id) {
	const musics = await models.music.findByPk(id);
	return musics;
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
	const id = req.params.id;
	if (!id) return res.status(401).end();

	const music = await findOne(id);
	try {
		await fs.unlinkSync(`${BASE_URL}/uploads/musics/${music.file_name}`);
		console.log(`successfully deleted ${music.file_name}`);

		await models.music.destroy({
			where: {
				id: id,
			},
		});
	} catch (error) {
		console.error("there was an error:", error.message);
	}

	const musics = await find();
	res.status(200).json(musics);
}

module.exports = {
	getAll,
	getById,
	create,
	update,
	remove,
};
