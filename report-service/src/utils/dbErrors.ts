export enum PgError {
  InvalidTextRepresentation = '22P02', 
  ForeignKeyViolation = '23503', 
  UniqueViolation = '23505',
  NotNullViolation = '23502',
}