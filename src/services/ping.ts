import * as ping from 'ping';

export interface PingResult {
  target: string;
  alive: boolean;
  time: string;
  output: string;
}

export const performPing = async (ip: string): Promise<PingResult> => {
  const response = await ping.promise.probe(ip);
  return {
    target: ip,
    alive: response.alive,
    time: response.time ? `${response.time}ms` : 'N/A',
    output: response.output,
  };
};
