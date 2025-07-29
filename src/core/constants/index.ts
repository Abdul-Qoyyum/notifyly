import * as dotenv from 'dotenv';
dotenv.config();

export const RABBITMQ_URL = `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`;

export const NOTIFYLY_QUEUE = process.env.RABBITMQ_QUEUE || 'notifyly_queue';
