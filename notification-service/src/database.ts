import { createConnection } from 'typeorm';
import { NotificationEntity } from './entities/notification.entity';

export const connectDatabase = async () => {
  await createConnection({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [NotificationEntity],
    synchronize: true,
  });
  console.log('Connected to the database');
};
