import moment from 'moment-timezone';
import { getIdleRunnerCount, ScalingDownConfig, ScalingDownConfigList } from './scale-down-config';

const DEFAULT_TIMEZONE = 'America/Los_Angeles';
const DEFAULT_IDLE_COUNT = 1;
const now = moment.tz(new Date(), 'America/Los_Angeles');

function getConfig(cronTabs: string[]): ScalingDownConfigList {
  const result: ScalingDownConfigList = [];
  for (const cron of cronTabs) {
    result.push({
      cron: cron,
      idleCount: DEFAULT_IDLE_COUNT,
      timeZone: DEFAULT_TIMEZONE,
    });
  }
  return result;
}

describe('scaleDownConfig', () => {
  beforeEach(() => {});

  describe('Check runners that should be kept idle based on config.', () => {
    it('One active cron configuration', async () => {
      const scaleDownConfig = getConfig([
        '* * ' + moment(now).subtract(1, 'hours').hour() + '-' + moment(now).add(1, 'hours').hour() + ' * * *',
      ]);
      console.log(scaleDownConfig);
      expect(getIdleRunnerCount(scaleDownConfig)).toEqual(DEFAULT_IDLE_COUNT);
    });

    it('No active cron configuration', async () => {
      const scaleDownConfig = getConfig([
        '* * ' + moment(now).add(4, 'hours').hour() + '-' + moment(now).add(5, 'hours').hour() + ' * * *',
      ]);
      expect(getIdleRunnerCount(scaleDownConfig)).toEqual(0);
    });

    it('1 of 2 cron configurations be active', async () => {
      const scaleDownConfig = getConfig([
        '* * ' + moment(now).add(4, 'hours').hour() + '-' + moment(now).add(5, 'hours').hour() + ' * * *',
        '* * ' + moment(now).subtract(1, 'hours').hour() + '-' + moment(now).add(1, 'hours').hour() + ' * * *',
      ]);

      expect(getIdleRunnerCount(scaleDownConfig)).toEqual(DEFAULT_IDLE_COUNT);
    });
  });
});
