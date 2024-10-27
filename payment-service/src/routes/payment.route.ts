const Router = require('express').Router();

import { Request, Response } from 'express';
import { PaymentService } from '../services/payment.service';

interface PostPaymentRequest extends Request {
  body: {
    amount: number;
    userId: number;
  };
}

Router.post("/payments", async (req: PostPaymentRequest, res: Response) => {
  const { amount, userId } = req.body;
  try {
    const payment = await PaymentService.createPayment({ amount, userId });
    res.status(201).json(payment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
})

Router.post("/payments/:id", async (req: PostPaymentRequest, res: Response) => {
  const { id } = req.params;
  try {
    const payment = await PaymentService.approvePayment({ id: parseInt(id) });
    res.status(201).json(payment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
})

export default Router