import { MetricPoint, MetricSeries, MetricStats } from './types.js';

export class TimeSeriesDB {
  private seriesMap = new Map<string, MetricPoint[]>();

  private getSeriesKey(name: string, labels: Record<string, string> = {}): string {
    const sorted = Object.entries(labels).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => `${k}=${v}`).join(',');
    return `${name}{${sorted}}`;
  }

  insert(name: string, labels: Record<string, string>, point: MetricPoint): void {
    const key = this.getSeriesKey(name, labels);
    let list = this.seriesMap.get(key);
    if (!list) {
      list = [];
      this.seriesMap.set(key, list);
    }
    list.push(point);
  }

  query(name: string, labels: Record<string, string>, fromTs: number, toTs: number): MetricPoint[] {
    const key = this.getSeriesKey(name, labels);
    const list = this.seriesMap.get(key) || [];
    return list.filter(p => p.timestamp >= fromTs && p.timestamp <= toTs);
  }

  aggregate(name: string, labels: Record<string, string>, fromTs: number, toTs: number): MetricStats | null {
    const points = this.query(name, labels, fromTs, toTs);
    if (points.length === 0) return null;

    const values = points.map(p => p.value).sort((a, b) => a - b);
    const sum = values.reduce((a, b) => a + b, 0);
    const p95Idx = Math.floor(values.length * 0.95);
    const p99Idx = Math.floor(values.length * 0.99);

    return {
      count: values.length,
      min: values[0],
      max: values[values.length - 1],
      avg: sum / values.length,
      p95: values[p95Idx],
      p99: values[p99Idx]
    };
  }
}
