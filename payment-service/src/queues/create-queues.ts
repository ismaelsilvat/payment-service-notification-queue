import amqp from 'amqplib';

export default async function createQueues() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');

    const channel = await connection.createChannel();

    const queues = ['payment_created', 'payment_approved'];

    for (const queue of queues) {
      await channel.assertQueue(queue, {
        durable: true,
      });
      console.log(`Queue ${queue} created or already exists.`);
    }

    await channel.close();
    await connection.close();
  } catch (error) {
    console.error('Error creating queues:', error);
  }
}
