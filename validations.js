import { body } from "express-validator";

export const loginValidation = [
	body("email", "Incorrect email format").isEmail(),
	body("password", "Password must contain at least 5 characters").isLength({
		min: 5,
	}),
];

export const registerValidation = [
	body("email", "Incorrect email format").isEmail(),
	body("password", "Password must contain at least 5 characters").isLength({
		min: 5,
	}),
	body("fullName", "Enter a name").isLength({ min: 3 }),
	body("avatarUrl", "Incorrect profile photo link").optional().isURL(),
];

export const postCreateValidation = [
	body("title", "Enter a title").isLength({ min: 3 }).isString(),
	body("text", "Enter a text").isLength({ min: 3 }).isString(),
	body("tags", "Invalid tag format").optional().isString(),
	body("imageUrl", "Invalid image link").optional().isString(),
];
