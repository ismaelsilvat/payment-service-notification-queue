import { connectRabbitMQ } from './connection';
import { NotificationService } from '../services/notification.service';

export const receiveMessages = async () => {
  const connection = await connectRabbitMQ();
  const channel = await connection.createChannel();

  await channel.assertQueue('payment_created');

  await channel.consume('payment_created', async (message) => {
    if (message) {
      const paymentData = JSON.parse(message.content.toString());
      console.log('Received payment message:', paymentData);

      await NotificationService.sendNotification({
        userId: paymentData.userId,
        paymentId: paymentData.paymentId,
        message: `Payment of ${paymentData.amount} has been processed.`,
      });

      channel.ack(message);
    }
  });

  await channel.consume('payment_approved', async (message) => {
    if (message) {
      const paymentData = JSON.parse(message.content.toString());
      console.log('Received payment message:', paymentData);

      await NotificationService.sendNotification({
        userId: paymentData.userId,
        paymentId: paymentData.paymentId,
        message: `Payment of ${paymentData.amount} has been approved.`,
      });

      channel.ack(message);
    }
  });

  console.log('Waiting for messages in payment_created queue...');
};
