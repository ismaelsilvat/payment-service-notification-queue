import { connectRabbitMQ } from './connection';

export const sendToQueue = async (queue: string, message: any) => {
  const connection = await connectRabbitMQ();
  const channel = await connection.createChannel();

  await channel.assertQueue(queue);
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));

  console.log(`Message sent to queue ${queue}`);
};
