import dns from 'dns/promises';

export interface NslookupResult {
  hostname: string;
  addresses: string[];
  dnsServer: string;
  resolutionTime: string;
}

export const performNslookupWithCustomDns = async (hostname: string, dnsServer: string): Promise<NslookupResult> => {
  const resolver = new dns.Resolver();
  resolver.setServers([dnsServer]);

  const startTime = Date.now();
  try {
    const addresses = await resolver.resolve4(hostname);
    const endTime = Date.now();
    return {
      hostname,
      addresses,
      dnsServer,
      resolutionTime: `${endTime - startTime}ms`,
    };
  } catch (error: any) {
    throw new Error(`Nslookup failed for ${dnsServer}: ${error.message}`);
  }
};
