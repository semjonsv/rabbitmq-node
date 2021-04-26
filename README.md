# RabbitMQ to MongoDB - NodeJS consumer

### Stringified JSON objects, will be taken from RabbitMQ queue and placed in MongoDB database
Configure MongoDB/RabbitMQ connection using .env file:
````
RABBITMQ=amqp://localhost:5672
QUEUE=queue_name
DB_CONN=mongodb://localhost:27017
DB_COLLECTION=collection_name
DB_NAME=db
````
\
🔥 To start consumer:
````
npm run consumer
````
\
⚡ Push example JSON to the queue:
````
npm run publisher
````

>  Docker container RabbitMQ with management: \
>  ```` docker run -d --hostname some-rabbit --name rabbitmq -p 15672:15672 -p 5672:5672 rabbitmq:3-management ````
