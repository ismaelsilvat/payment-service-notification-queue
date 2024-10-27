import amqplib from 'amqplib';
import createQueues from "./create-queues";

export const connectRabbitMQ = async () => {
  const connection = await amqplib.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
  console.log("Connected to RabbitMQ");
  await createQueues();
  return connection;
};
