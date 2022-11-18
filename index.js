import express from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
import UserModel from './models/User.js';
import { validationResult } from 'express-validator';
import { registerValidation } from './validation/auth.js';

mongoose
	.connect(
		'mongodb+srv://admin:coolpix__L820@cluster0.vghj2ic.mongodb.net/users-list?retryWrites=true&w=majority'
	)
	.then(() => {
		console.log('DB ok');
	})
	.catch((err) => {
		console.log('DB error', err);
	});
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
	res.send('2222Hello World!');
});

app.post('/auth/register', registerValidation, async (req, res) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty) {
			return res.status(400).json(errors.array());
		}

		const doc = new UserModel({
			email: req.body.email,
			name: req.body.name,
			password: req.body.password,
		});

		const user = await doc.save();
		res.json({ user });
	} catch (error) {}
});

app.listen(4444, (err) => {
	if (err) {
		return console.log(err);
	}
	console.log('Server OK');
});
