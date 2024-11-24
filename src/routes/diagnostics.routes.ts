import { Router } from 'express';
import { ping, traceroute, nslookup, httpCheck } from '../controllers/diagnostics.controller';

const router = Router();

router.post('/ping', ping);
router.post('/traceroute', traceroute);
router.post('/nslookup', nslookup);
router.post('/http-check', httpCheck);

export default router;
