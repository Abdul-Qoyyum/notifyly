import * as dotenv from 'dotenv';
dotenv.config();

export const RABBITMQ_URL = `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`;

export const NOTIFYLY_QUEUE = process.env.RABBITMQ_QUEUE ?? 'notifyly_queue';

export const ACCESS_TOKEN_EXPIRES =
  process.env.ACCESS_TOKEN_EXPIRES ?? 7 * 24 * 3600;

export const JWT_SECRET =
  process.env.JWT_SECRET ?? 'edhwjkdbnasnmwqdjhdqjwsqjkdjkqwdkj';

export const THROTTLER_TTL = process.env.THROTTLER_TTL ?? 60000;
export const THROTTLER_LIMIT = process.env.THROTTLER_LIMIT ?? 250;
