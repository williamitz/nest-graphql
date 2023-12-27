import * as Joi from 'joi';

export const envValidation = Joi.object({
    PORT: Joi.number().default(3000),
    APP_MODE: Joi.string(),
    DB_PASSWORD: Joi.string().default('loremIpsum'),
    DB_TYPE: Joi.string(),
    DB_HOST: Joi.string().default('localhost'),
    DB_NAME: Joi.string().default('default_db'),
    DB_USER: Joi.string().default('root'),
    DB_PORT: Joi.number().default(5432),

    JWT_EXP: Joi.string().default('1h'),
    JWT_SECRET: Joi.string().default('DEFAULT_SECRET_KEY'),

})