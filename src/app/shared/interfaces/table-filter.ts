export interface TableFilter {
  id?: number;
  columnType?: TableFilterColumnType;
  type?: FilterType;
  object?: any;
}

export enum TableFilterColumnType {
  NUMBER,
  DATE,
  STRING,
  BOOLEAN,
}

export enum FilterType {
  EQUAL,
  NOT_EQUAL,
  GREATER,
  LOWER,
  CONTAINS,
  TERM,
  TERM_LIST,
  NULL,
  NOT_NULL,
}
