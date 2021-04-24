const amqp = require('amqplib')
require('dotenv').config()

const connectRabbitMq = async () => {
    try {
        const conn = await amqp.connect(process.env.RABBITMQ)
        const ch = await conn.createChannel()
        const queue = process.env.QUEUE

        console.log('[AMQP]: Waiting for messages in', queue)

        ch.consume(queue, (msg) => {
            console.log('[MSG]:', msg.content.toString())
        }, {
            noAck: true
        });

        conn.on('error', function (err) {
            console.log('[AMQP]: conn error:', err)
        });

        conn.on('close', () => {
            console.log('[AMQP]: conn closed, reconnecting in 1s')
            setTimeout(connectRabbitMq, 1000)
        });
    } catch (err) {
        console.log('[AMQP]: unknown error:', err)
        console.log('Reconnecting in 1s')
        setTimeout(connectRabbitMq, 1000)
    }
};

connectRabbitMq();