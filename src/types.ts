export interface MetricPoint {
  timestamp: number;
  value: number;
}

export interface MetricSeries {
  name: string;
  labels: Record<string, string>;
  points: MetricPoint[];
}

export interface MetricStats {
  count: number;
  min: number;
  max: number;
  avg: number;
  p95: number;
  p99: number;
}
