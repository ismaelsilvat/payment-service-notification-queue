import { connectRabbitMQ } from './connection';

export const receiveMessages = async () => {
  const connection = await connectRabbitMQ();
  const channel = await connection.createChannel();

  await channel.assertQueue('payment_created');
  channel.consume('payment_created', (message) => {
    if (message) {
      const content = JSON.parse(message.content.toString());
      console.log(`Received payment created notification:`, content);

      console.log(`Sending notification to user ${content.userId}`);

      channel.ack(message);
    }
  });
};
