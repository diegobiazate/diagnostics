import { Request, Response } from 'express';
import { Target } from '../models/Target';
import { scheduleDiagnostics } from '../services/cronJobs';

export const addTarget = async (req: Request, res: Response) => {
  const { type, value, periodicity } = req.body;

  try {
    const target = new Target({ type, value, periodicity });
    await target.save();

    await scheduleDiagnostics();
    res.status(201).json(target);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getTargets = async (req: Request, res: Response) => {
  try {
    const targets = await Target.find();
    res.json(targets);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
