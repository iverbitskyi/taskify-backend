import PostModel from "../models/Post.js";

export const getLastTags = async (req, res) => {
	try {
		const posts = await PostModel.find().limit(5).exec();

		const tags = posts
			.map((obj) => obj.tags)
			.flat()
			.slice(0, 5);

		res.json(tags);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "теги не отримано",
		});
	}
};

export const getAll = async (req, res) => {
	try {
		const posts = await PostModel.find().populate("user").exec();
		res.json(posts);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "пост не отримано",
		});
	}
};

export const getOne = async (req, res) => {
	try {
		const postId = req.params.id;

		PostModel.findOneAndUpdate(
			{
				_id: postId,
			},
			{
				$inc: { viewsCount: 1 },
			},
			{
				returnDocument: "after",
			},
			(err, doc) => {
				if (err) {
					console.log(err);
					return res.status(500).json({
						message: "не повернуто пост",
					});
				}

				if (!doc) {
					return res.status(404).json({
						message: "пост не знайдено",
					});
				}

				res.json(doc);
			}
		).populate("user");
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "не вдалося отримати статтю",
		});
	}
};

export const remove = async (req, res) => {
	try {
		const postId = req.params.id;

		PostModel.findOneAndDelete(
			{
				_id: postId,
			},
			(err, doc) => {
				if (err) {
					console.log(err);
					return res.status(500).json({
						message: "пост не видалено",
					});
				}

				if (!doc) {
					return res.status(404).json({
						message: "пост не знайдено",
					});
				}

				res.json({
					success: true,
				});
			}
		);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "пост не отримано",
		});
	}
};

export const create = async (req, res) => {
	try {
		const doc = new PostModel({
			title: req.body.title,
			text: req.body.text,
			imageUrl: req.body.imageUrl,
			tags: req.body.tags.split(","),
			user: req.userId,
		});

		const post = await doc.save();

		res.json(post);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "пост не створено",
		});
	}
};

export const update = async (req, res) => {
	try {
		const postId = req.params.id;

		await PostModel.updateOne(
			{
				_id: postId,
			},
			{
				title: req.body.title,
				text: req.body.text,
				imageUrl: req.body.imageUrl,
				user: req.userId,
				tags: req.body.tags.split(","),
			}
		);

		res.json({
			success: true,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "пост не оновлено",
		});
	}
};
