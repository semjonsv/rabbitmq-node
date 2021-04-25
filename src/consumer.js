const amqp = require('amqplib')
const { MongoClient } = require('mongodb')
require('dotenv').config()

const connectRabbitMq = async () => {
    const client = new MongoClient(process.env.DB_CONN, { useUnifiedTopology: true })

    try {
        const conn = await amqp.connect(process.env.RABBITMQ)
        const ch = await conn.createChannel()

        try {
            await client.connect()
        } catch (err) {
            await conn.close()
            throw Error(err)
        }

        const database = client.db(process.env.DB_NAME)
        const collection = database.collection(process.env.DB_COLLECTION)
        
        const queue = process.env.QUEUE

        console.log('[AMQP]: Waiting for messages in', queue)

        ch.consume(queue, async (msg) => {
            const data = JSON.parse(msg.content.toString())

            try {
                await collection.insertOne(data)
                console.log('[MSG]:', data)
            } catch (err) {
                console.error('[INSERT ERROR]: %s, [DATA]: %s', err.message, data)
                
                try {
                    await conn.close()
                } catch (err) {
                    console.log('[AMQP]: closing error:', err.message)
                }
            }
        }, {
            noAck: true
        })

        conn.on('error', (err) => {
            console.log('[AMQP]: conn error:', err.message)
        })

        conn.on('close', async () => {
            await client.close()
            console.log('[AMQP]: conn closed, reconnecting in 1s')
            setTimeout(connectRabbitMq, 1000)
        })
    } catch (err) {
        console.error('[CONNECTION ERROR]:', err.message)
        console.log('Reconnecting in 1s')
        setTimeout(connectRabbitMq, 1000)
    }
}

connectRabbitMq()