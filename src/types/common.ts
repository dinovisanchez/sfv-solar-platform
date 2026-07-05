export type Id = string;

export type Timestamps = {
  createdAt: string;
  updatedAt: string;
};

export type Paginated<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
};

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export type SortDirection = "asc" | "desc";

export type SelectOption<T extends string = string> = {
  label: string;
  value: T;
};
