import { createConnection } from "typeorm";

export const connectDatabase = async () => {
  await createConnection({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [__dirname + '/entities/*.ts'],
    synchronize: true,
  });
  console.log("Connected to the database");
};
