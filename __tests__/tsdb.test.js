import assert from 'node:assert';
import test from 'node:test';
import { TimeSeriesDB } from '../dist/tsdb.js';

test('TimeSeriesDB aggregates p95 and p99 statistics over time ranges', () => {
  const tsdb = new TimeSeriesDB();
  for (let i = 1; i <= 100; i++) {
    tsdb.insert('http_latency_ms', { service: 'api' }, { timestamp: 1000 + i, value: i });
  }

  const stats = tsdb.aggregate('http_latency_ms', { service: 'api' }, 1000, 2000);
  assert.ok(stats);
  assert.strictEqual(stats.count, 100);
  assert.strictEqual(stats.min, 1);
  assert.strictEqual(stats.max, 100);
  assert.strictEqual(stats.p99, 100);
});
