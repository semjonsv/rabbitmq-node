const amqp = require('amqplib')

const connectRabbitMq = async () => {
    try {
        const conn = await amqp.connect('amqp://localhost:5672')
        const ch = await conn.createChannel()
        const queue = 'hello'

        console.log("[AMQP]: Waiting for messages in", queue)

        ch.consume(queue, function(msg) {
            console.log("[MSG]", msg.content.toJSON())
        }, {
            noAck: false
        });

        conn.on('error', function (err) {
            console.log('[AMQP]: conn error:', err)
        });
        conn.on('close', () => {
            console.log("[AMQP]: conn closed, reconnecting in 1s")
            setTimeout(connectRabbitMq, 1000)
        });
    } catch (err) {
        console.log('[AMQP]: unknown error: ', err)
        console.log('Reconnecting in 1s')
        setTimeout(connectRabbitMq, 1000)
    }
};

connectRabbitMq();