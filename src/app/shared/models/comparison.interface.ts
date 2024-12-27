export interface ComparisonMetrics {
  date: string;

  [key: string]: number | string | string[];
}

export interface ComparisonRateAnalysis {
  metrics: ComparisonMetrics[];
  baseCode: string;
}
