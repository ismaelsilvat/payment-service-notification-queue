import { getRepository } from 'typeorm';
import { NotificationEntity } from '../entities/notification.entity';

interface NotificationData {
  userId: number;
  paymentId: number;
  message: string;
}

export class NotificationService {
  static async sendNotification({ userId, paymentId, message }: NotificationData) {
    const notificationRepository = getRepository(NotificationEntity);

    const notification = notificationRepository.create({
      userId,
      paymentId,
      message,
    });

    await notificationRepository.save(notification);

    console.log(`Notification sent to user ${userId}: ${message}`);
    return notification;
  }
}
