import { Table } from '@apache-arrow/ts'

const reviveRow = (
  row: Record<string, unknown>,
  reviver: (key: string, value: unknown) => unknown
) =>
  Object.entries(row).reduce(
    (obj, [key, value]) => ({
      ...obj,
      [key]: reviver(key, value)
    }),
    {}
  )

export function* arrowRowGenerator(
  table: Table,
  reviver?: (key: string, value: unknown) => unknown
) {
  for (let i = 0; i < table.numRows; ++i) {
    // Get the row as JSON.
    const row = table.get(i)?.toJSON() as Record<string, unknown> | null

    if (row === null) {
      // I'm not sure if rows can be null, or if this is an artifact of the
      // implementation.
      continue
    }

    yield reviver ? reviveRow(row, reviver) : row
  }
}
