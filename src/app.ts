import express from 'express';
import diagnosticRoutes from './routes/diagnostics.routes';

const app = express();

app.use(express.json());
app.use('/api', diagnosticRoutes);

export default app;
