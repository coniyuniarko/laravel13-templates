export interface User {
  id: number
  name: string
  email: string
  avatar?: string
  roles?: Role[]
}

export interface Auth {
  user: User
  roles: string[]
  permissions: string[]
}

export interface PageProps {
  auth: Auth
  [key: string]: unknown
}

export interface Role {
  id: number;
  name: string;
  guard_name: string;
  permissions?: Permission[];
}

export interface Permission {
  id: number;
  name: string;
}

export interface PaginationProps<T> {
  data: T[];
  links: { url: string | null; label: string; active: boolean }[];
  current_page: number;
  last_page: number;
  total: number;
}

export interface SelectedItem {
    id: number
    name: string
}

export interface NavItem {
  key: string;
  icon: React.ReactNode;
  url: string;
  active?: boolean;
  badge?: number;
  shown?: boolean;
}

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