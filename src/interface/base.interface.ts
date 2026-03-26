export interface Pagination<I> extends DataRow<I> {
  page: number;
  limit: number;
}

export interface SearchParams {
  [key: string]: string | number | boolean;
  page: number;
  offset: number;
  limit: number;
}
export interface DataRow<T> {
  data: T[];
  totalRows: number;
}
