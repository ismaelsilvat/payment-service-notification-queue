import { getRepository } from 'typeorm';
import { Payment } from '../entities/payment.entity';
import { sendToQueue } from '../queues/notification.queue';

export class PaymentService {
  static async createPayment({ amount, userId }: { amount: number; userId: number }) {
    const paymentRepository = getRepository(Payment);

    const payment = paymentRepository.create({
      amount,
      userId,
      status: 'PENDING'
    });

    await paymentRepository.save(payment);

    await sendToQueue('payment_created', {
      paymentId: payment.id,
      userId,
      amount
    });

    return payment;
  }

  static async approvePayment({ id }: { id: number }) {
    const paymentRepository = getRepository(Payment);

    const payment = await paymentRepository.findOne(id);

    if (!payment) {
      throw new Error(`Payment with id ${id} not found`);
    }

    payment.status = 'SUCCEEDED';
    const updatedPayment = await paymentRepository.save(payment);

    await sendToQueue('payment_approved', {
      paymentId: updatedPayment.id,
      userId: updatedPayment.userId,
      amount: updatedPayment.amount
    });

    return updatedPayment;
  }
}
