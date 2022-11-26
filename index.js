import express from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
import UserModel from './models/User.js';
import checkAuth from './utils/checkAuth.js';
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

app.post('/auth/login', async (req, res) => {
	try {
		const user = await UserModel.findOne({ email: req.body.email });
		const isValidPass = await (req.body.password === user._doc.password);

		if (!user) {
			return res.status(404).json({
				message: 'Неверный логин или пароль',
			});
		}
		if (!isValidPass) {
			return res.status(400).json({
				message: 'Неверный логин или пароль',
			});
		}

		const token = jwt.sign(
			{
				_id: user._id,
			},
			'secret-user',
			{
				expiresIn: '30d',
			}
		);

		const { password, ...userData } = user._doc;

		res.json({ ...userData, token });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Неверный логин или пароль',
		});
	}
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

		const token = jwt.sign(
			{
				_id: user._id,
			},
			'secret-user',
			{
				expiresIn: '30d',
			}
		);

		const { password, ...userData } = user._doc;

		res.json({ ...userData, token });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Не удалось зарегестрироваться',
		});
	}
});

app.get('/auth/me', checkAuth, (req, res) => {
	try {
		res.json({
			succses: true,
		});
	} catch (error) {}
});

app.listen(4444, (err) => {
	if (err) {
		return console.log(err);
	}
	console.log('Server OK');
});
