import express from 'express';
import mongoose from 'mongoose';
import diagnosticsRoutes from './routes/diagnostics.routes';
import scheduleRoutes from './routes/schedule.routes';
import { scheduleDiagnostics } from './services/cronJobs';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const mongoURI = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=${process.env.AUTH_SOURCE}`;

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(mongoURI)
  .then(() => console.log('Conectado ao MongoDB com autenticação!'))
  .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));


app.use('/api/diagnostics', diagnosticsRoutes);
app.use('/api/schedule', scheduleRoutes);

mongoose.connection.once('open', async () => {
  console.log('Connected to MongoDB');
  await scheduleDiagnostics(); // Inicializa os cron jobs
});

export default app;
