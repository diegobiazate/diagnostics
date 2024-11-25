import { Request, Response } from 'express';
import { performPing } from '../services/ping';
import { performTraceroute } from '../services/traceroute';
import { performNslookupWithCustomDns } from '../services/nslookup';
import { performHttpCheck } from '../services/http-check';
import DiagnosticsResult from '../models/DiagnosticsResult';

// Diagnóstico de Ping
export const ping = async (req: Request, res: Response): Promise<void> => {
  const { target } = req.body;
  try {
    const result = await performPing(target);

    // Salva no banco de dados
    const diagnostic = await DiagnosticsResult.create({ type: 'ping', target, result });
    res.status(201).json(diagnostic);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Diagnóstico de Traceroute
export const traceroute = async (req: Request, res: Response): Promise<void> => {
  const { target } = req.body;
  try {
    const result = await performTraceroute(target);

    // Salva no banco de dados
    const diagnostic = await DiagnosticsResult.create({ type: 'traceroute', target, result });
    res.status(201).json(diagnostic);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Diagnóstico de Nslookup
export const nslookup = async (req: Request, res: Response): Promise<void> => {
  const { target, dnsServers } = req.body;
  if (!dnsServers || !Array.isArray(dnsServers)) {
    res.status(400).json({ error: 'dnsServers must be an array' });
    return;
  }

  try {
    const results = await Promise.all(
      dnsServers.map((dnsServer) => performNslookupWithCustomDns(target, dnsServer))
    );

    // Salva no banco de dados
    const diagnostic = await DiagnosticsResult.create({ type: 'nslookup', target, result: results });
    res.status(201).json(diagnostic);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Diagnóstico de HTTP Check
export const httpCheck = async (req: Request, res: Response): Promise<void> => {
  const { target } = req.body;
  try {
    const result = await performHttpCheck(target);

    // Salva no banco de dados
    const diagnostic = await DiagnosticsResult.create({ type: 'http-check', target, result });
    res.status(201).json(diagnostic);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Retorna todos os diagnósticos salvos
export const getAllDiagnostics = async (req: Request, res: Response) => {
  try {
    const diagnostics = await DiagnosticsResult.find().sort({ createdAt: -1 }).limit(15); // Limita aos últimos 15 registros
    res.json(diagnostics);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Busca um diagnóstico pelo ID
export const getDiagnosticById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const diagnostic = await DiagnosticsResult.findById(id);
    if (!diagnostic) {
      return res.status(404).json({ error: 'Diagnostic not found' });
    }
    res.json(diagnostic);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
