export class AppError extends Error {
	constructor(message, code) {
		super(message);
		this.name = this.constructor.name;
		this.code = code;
	}
}

export class ValidationError extends AppError {
	constructor(message) {
		super(message, 'VALIDATION_ERROR');
	}
}

export class CityNotFoundError extends AppError {
	constructor(city) {
		super(`Город «${city}» не найден`, 'CITY_NOT_FOUND');
		this.city = city;
	}
}

export class ApiError extends AppError {
	constructor(message, status) {
		super(message, 'API_ERROR');
		this.status = status;
	}
}

export class NetworkError extends AppError {
	constructor(message = 'Нет соединения с сетью') {
		super(message, 'NETWORK_ERROR');
	}
}

export class TimeoutError extends AppError {
	constructor(message = 'Превышено время ожидания ответа от сервера') {
		super(message, 'TIMEOUT_ERROR');
	}
}

export class InvalidJsonError extends AppError {
	constructor(message = 'Сервер вернул некорректный JSON') {
		super(message, 'INVALID_JSON');
	}
}
