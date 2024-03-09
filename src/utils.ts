import { Table, DataType, TypeMap } from '@apache-arrow/ts'
import { AsyncDuckDB, AsyncDuckDBConnection } from '@duckdb/duckdb-wasm'

export function* arrowRowGenerator<
  TValue extends object = Record<string, unknown>,
  TRawValue extends object = Record<string, unknown>,
  TTable extends Record<string, DataType> = TypeMap
>(
  table: Table<TTable>,
  reviver: (value: TRawValue) => TValue
): Generator<TValue, void, unknown> {
  for (let i = 0; i < table.numRows; ++i) {
    // Get the row as JSON.
    const row = table.get(i)?.toJSON() as Record<string, unknown> | null

    if (row === null) {
      // I'm not sure if rows can be null, or if this is an artifact of the
      // implementation.
      continue
    }

    yield reviver(row as TRawValue)
  }
}

export async function sqlJson<
  TValue extends object = Record<string, unknown>,
  TRawValue extends object = Record<string, unknown>,
  TTable extends Record<string, DataType> = TypeMap
>(
  connection: AsyncDuckDBConnection,
  sql: string,
  reviver: (value: TRawValue) => TValue
): Promise<TValue[]> {
  const table = await connection.query<TTable>(sql)
  const rows = Array.from(await arrowRowGenerator(table, reviver))
  return rows
}

export async function sqlJsonDB<
  TValue extends object = Record<string, unknown>,
  TRawValue extends object = Record<string, unknown>,
  TTable extends Record<string, DataType> = TypeMap
>(
  db: AsyncDuckDB,
  sql: string,
  reviver: (value: TRawValue) => TValue
): Promise<TValue[]> {
  const connection = await db.connect()
  const rows = await sqlJson<TValue, TRawValue, TTable>(
    connection,
    sql,
    reviver
  )
  return rows
}
