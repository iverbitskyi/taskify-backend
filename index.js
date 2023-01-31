import express from "express";
import fs from "fs";
import multer from "multer";
import cors from "cors";
import mongoose from "mongoose";

import {
	registerValidation,
	loginValidation,
	postCreateValidation,
} from "./validations.js";

import { handleValidationErrors, checkAuth } from "./utils/index.js";

import {
	getAll,
	getOne,
	create,
	remove,
	update,
	getLastTags,
} from "./controllers/PostController.js";
import { register, login, getMe } from "./controllers/UserController.js";

// ------- DB CONNECT ------------------------------------------------------
mongoose.set("strictQuery", false);
mongoose
	.connect(process.env.MONGODB_URL)
	.then(() => console.log("DB ok"))
	.catch((err) => console.log("DB error", err));

const app = express();

// ------- MULTER -------------------
const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		if (!fs.existsSync("uploads")) {
			fs.mkdirSync("uploads");
		}
		cb(null, "uploads");
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname);
	},
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

// ------- ROUTES ---------------------------------------------------------
// ------- USERS -------------------
app.post("/auth/login", loginValidation, handleValidationErrors, login);
app.post(
	"/auth/register",
	registerValidation,
	handleValidationErrors,
	register
);
app.get("/auth/me", checkAuth, getMe);

// ------- IMAGE -------------------
app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`,
	});
});

// ------- POSTS -------------------
app.get("/tags", getLastTags);
app.get("/posts", getAll);
app.get("/posts/tags", getLastTags);
app.get("/posts/:id", getOne);
app.post(
	"/posts",
	checkAuth,
	postCreateValidation,
	handleValidationErrors,
	create
);
app.delete("/posts/:id", checkAuth, remove);
app.patch(
	"/posts/:id",
	checkAuth,
	postCreateValidation,
	handleValidationErrors,
	update
);

// -------- SERVER CONNECT -----------------------------------------------
app.listen(process.env.PORT || 4444, (err) => {
	if (err) {
		return console.log(err);
	}

	console.log("Server OK");
});
