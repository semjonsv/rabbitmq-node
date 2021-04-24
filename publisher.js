const amqp = require('amqplib')
require('dotenv').config()

const connectRabbitMq = async () => {
    try {
        const conn = await amqp.connect(process.env.RABBITMQ)
        const ch = await conn.createChannel()
        const queue = process.env.QUEUE

        const msg = JSON.stringify({
            'title': 'Hello World!',
            'count': 1
        })

        ch.assertQueue(queue, {
            durable: true
        })
        ch.sendToQueue(queue, Buffer.from(msg))

        console.log('[MSG] sent:', msg);
        
        setTimeout(() => {
            conn.close();
            process.exit(0);
        }, 500);
    } catch (err) {
        console.log('[AMQP]: unknown error:', err)
        console.log('Reconnecting in 1s')
        setTimeout(connectRabbitMq, 1000)
    }
}

connectRabbitMq();