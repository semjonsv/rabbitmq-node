const amqp = require('amqplib')

const connectRabbitMq = async () => {
    try {
        const conn = await amqp.connect('amqp://localhost:5672')
        const ch = await conn.createChannel()
        const queue = 'hello'

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