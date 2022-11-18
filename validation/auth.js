import { body } from 'express-validator';

export const registerValidation = [
	body('email', 'Неверный формат почты').isEmail(),
	body('password', 'Пароль минимум 1 символ').isLength({ min: 1 }),
	body('name', 'Укажите имя').isLength({ min: 2 }),
];
