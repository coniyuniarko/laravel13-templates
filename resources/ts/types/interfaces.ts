export interface BarData {
  month: string;
  value: number;
}

export interface Order {
  customer: string;
  product: string;
  amount: string;
  date: string;
  status: "Paid" | "Pending" | "Processing";
}

export interface StatCard {
  label: string;
  value: string;
  change: string;
  up: boolean;
}

export interface ActivityItem {
  text: string;
  time: string;
  color: string;
}

export interface Order {
  customer: string;
  product: string;
  amount: string;
  date: string;
  status: "Paid" | "Pending" | "Processing";
}

export interface BarData {
  month: string;
  value: number;
}