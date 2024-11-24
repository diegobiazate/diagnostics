const Traceroute = require('nodejs-traceroute');

export interface TracerouteResult {
  target: string;
  hops: string[];
}

export const performTraceroute = async (target: string): Promise<TracerouteResult> => {
  const hops: string[] = [];

  try {
    const tracer = new Traceroute();
    tracer
        .on('hop', (hop: any) => {
            hops.push(JSON.stringify(hop));
        })

    tracer.trace(target);

    await new Promise((resolve, reject) => {
      tracer.on('close', resolve);
      tracer.on('error', reject);
    });

    return { target, hops };
  } catch (error: any) {
    throw new Error(`Traceroute failed: ${error.message}`);
  }
};
