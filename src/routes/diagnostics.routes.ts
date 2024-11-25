import { Router } from 'express';
import { ping, traceroute, nslookup, httpCheck, getAllDiagnostics } from '../controllers/diagnostics.controller';

const router = Router();

// Rota para listar os diagnósticos
router.get('/', getAllDiagnostics);

// Rotas individuais para diagnósticos
router.post('/ping', ping);
router.post('/traceroute', traceroute);
router.post('/nslookup', nslookup);
router.post('/http-check', httpCheck);

export default router;
