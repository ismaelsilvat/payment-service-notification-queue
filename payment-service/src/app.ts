require("dotenv").config();
import express from 'express';
import { json } from 'body-parser';
import { connectDatabase } from './database';
import routes from "./routes"

const app = express();
const port = process.env.PORT || 3000;

app.use(json());

app.use(routes);

const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(port, () => {
      console.log(`Payment service running on port ${port}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
};

startServer();
