import { Request, Response } from 'express';
import { performPing } from '../services/ping';
import { performTraceroute } from '../services/traceroute';
import { performNslookupWithCustomDns } from '../services/nslookup';
import { performHttpCheck } from '../services/http-check';

export const ping = async (req: Request, res: Response): Promise<void> => {
  const { target } = req.body;
  try {
    const result = await performPing(target);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const traceroute = async (req: Request, res: Response): Promise<void> => {
  const { target } = req.body;
  try {
    const result = await performTraceroute(target);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

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
    res.json(results);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const httpCheck = async (req: Request, res: Response): Promise<void> => {
  const { target } = req.body;
  try {
    const result = await performHttpCheck(target);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
