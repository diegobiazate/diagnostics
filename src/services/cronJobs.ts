import cron from 'node-cron';
import { Target } from '../models/Target';
import { DiagnosticResult } from '../models/DiagnosticsResult';
import { performPing } from './ping';
import { performTraceroute } from './traceroute';
import { performNslookupWithCustomDns } from './nslookup';
import { performHttpCheck } from './http-check';

const cronJobs: Record<string, cron.ScheduledTask> = {};

export const scheduleDiagnostics = async () => {
  const targets = await Target.find();

  targets.forEach((target) => {
    const jobKey = `${target._id}-${target.type}`;
    if (cronJobs[jobKey]) {
      cronJobs[jobKey].stop();
    }

    const cronExpression = `*/${target.periodicity} * * * *`;
    cronJobs[jobKey] = cron.schedule(cronExpression, async () => {
      let result;
      try {
        switch (target.type) {
          case 'url':
            result = await performHttpCheck(target.value);
            break;
          case 'ip':
            result = await performPing(target.value);
            break;
          default:
            return;
        }

        // Salvar o resultado no banco
        const diagnostic = new DiagnosticResult({
          target: target._id,
          type: target.type === 'url' ? 'http-check' : 'ping',
          result,
        });
        await diagnostic.save();

        // Limitar a 15 registros
        const results = await DiagnosticResult.find({ target: target._id })
          .sort({ timestamp: -1 })
          .skip(15);
        if (results.length > 0) {
          const idsToDelete = results.map((r) => r._id);
          await DiagnosticResult.deleteMany({ _id: { $in: idsToDelete } });
        }
      } catch (error) {
        console.error(`Error running diagnostic for target ${target.value}:`, error);
      }
    });
  });
};
