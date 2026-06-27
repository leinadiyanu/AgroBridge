export interface PredictInput {
  commodity: string;
  state: string;
  month: number;
  year: number;
  lag1: number;
  lag3: number;
  rolling_mean3: number;
  min_dist_s: number;
  mean_dist_s: number;
}

export interface PredictOutput {
  commodity: string;
  state: string;
  unit: string;
  current_price: number;
  previous_price: number;
  highest_price_recorded: number;
  lowest_price_recorded: number;
  direction: string;
  advice: string;
}

export interface BestTimeOutput {
  commodity: string;
  best_month_to_sell: string;
}

export interface PredictRequestInput {
  commodity: string;
  state: string;
}