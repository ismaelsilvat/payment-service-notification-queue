import { connectDatabase } from './database';
import { receiveMessages } from './queues/payment.queue';

const startServer = async () => {
  try {
    await connectDatabase();
    await receiveMessages();
    console.log('NotificationEntity service is running...');
  } catch (error) {
    console.error('Error starting notification service:', error);
  }
};

startServer();
