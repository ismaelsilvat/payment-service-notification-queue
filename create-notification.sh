#!/bin/bash

# Nome do diretório do projeto
PROJECT_NAME="notification-service"

# Criar diretórios do projeto
echo "Criando estrutura de diretórios..."
mkdir -p $PROJECT_NAME/src/{entities,services,queues}

# Navegar até o diretório do projeto
cd $PROJECT_NAME

# Criar o package.json
echo "Inicializando package.json..."
npm init -y

# Instalar dependências
echo "Instalando dependências..."
npm install typescript ts-node amqplib typeorm pg reflect-metadata dotenv --save
npm install @types/node @types/amqplib @types/pg --save-dev

# Gerar tsconfig.json
echo "Gerando tsconfig.json..."
npx tsc --init --rootDir src --outDir dist --esModuleInterop --resolveJsonModule --experimentalDecorators --emitDecoratorMetadata --strictPropertyInitialization false

# Criar arquivos do projeto

echo "Criando arquivos..."

# Criar .env
cat <<EOT >> .env
# Configurações do Postgres
DB_HOST=localhost
DB_PORT=5432
DB_USER=myuser
DB_PASS=mypassword
DB_NAME=notifications

# Configurações do RabbitMQ
RABBITMQ_URL=amqp://localhost

# Porta do serviço de notificação
PORT=3001
EOT

# Criar tsconfig.json
cat <<EOT >> tsconfig.json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "skipLibCheck": true,
    "strictPropertyInitialization": false,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "exclude": ["node_modules", "dist"]
}
EOT

# Criar NotificationEntity.ts
cat <<EOT >> src/entities/Notification.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @Column()
  paymentId!: number;

  @Column()
  message!: string;

  @CreateDateColumn()
  sentAt!: Date;
}
EOT

# Criar notification.service.ts
cat <<EOT >> src/services/notificationService.ts
import { getRepository } from 'typeorm';
import { Notification } from '../entities/Notification';

interface NotificationData {
  userId: number;
  paymentId: number;
  message: string;
}

export class NotificationService {
  static async sendNotification({ userId, paymentId, message }: NotificationData) {
    const notificationRepository = getRepository(Notification);

    const notification = notificationRepository.create({
      userId,
      paymentId,
      message,
    });

    await notificationRepository.save(notification);

    console.log(\`Notification sent to user \${userId}: \${message}\`);
    return notification;
  }
}
EOT

# Criar payment.queue.ts
cat <<EOT >> src/queues/paymentQueue.ts
import { connectRabbitMQ } from './connection';
import { NotificationService } from '../services/notificationService';

export const receiveMessages = async () => {
  const connection = await connectRabbitMQ();
  const channel = await connection.createChannel();

  // Assumimos que as mensagens de pagamento estarão na fila 'payment_created'
  await channel.assertQueue('payment_created');

  channel.consume('payment_created', async (message) => {
    if (message) {
      const paymentData = JSON.parse(message.content.toString());
      console.log('Received payment message:', paymentData);

      // Enviar notificação ao usuário
      await NotificationService.sendNotification({
        userId: paymentData.userId,
        paymentId: paymentData.paymentId,
        message: \`Payment of \${paymentData.amount} has been processed.\`,
      });

      // Confirmar que a mensagem foi processada
      channel.ack(message);
    }
  });

  console.log('Waiting for messages in payment_created queue...');
};
EOT

# Criar connection.ts
cat <<EOT >> src/queues/connection.ts
import amqplib from 'amqplib';

export const connectRabbitMQ = async () => {
  const connection = await amqplib.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
  console.log('Connected to RabbitMQ');
  return connection;
};
EOT

# Criar database.ts
cat <<EOT >> src/database.ts
import { createConnection } from 'typeorm';
import { Notification } from './entities/Notification';

export const connectDatabase = async () => {
  await createConnection({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [Notification],
    synchronize: true,
  });
  console.log('Connected to the database');
};
EOT

# Criar app.ts
cat <<EOT >> src/app.ts
import { connectDatabase } from './database';
import { receiveMessages } from './queues/paymentQueue';

const startServer = async () => {
  try {
    await connectDatabase();
    await receiveMessages();
    console.log('Notification service is running...');
  } catch (error) {
    console.error('Error starting notification service:', error);
  }
};

startServer();
EOT

# Criar docker-compose.yml
cat <<EOT >> docker-compose.yml
version: '3'
services:
  rabbitmq:
    image: 'rabbitmq:3-management'
    ports:
      - '5672:5672'
      - '15672:15672'

  postgres:
    image: 'postgres'
    environment:
      POSTGRES_USER: myuser
      POSTGRES_PASSWORD: mypassword
      POSTGRES_DB: notifications
    ports:
      - '5432:5432'
EOT

echo "Projeto $PROJECT_NAME criado com sucesso!"
