import amqplib from 'amqplib';

export const connectRabbitMQ = async () => {
  const connection = await amqplib.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
  console.log("Connected to RabbitMQ");
  return connection;
};
