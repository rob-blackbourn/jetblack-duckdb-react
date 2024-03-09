export interface Column {
  key: string
  title: string
  textAlign?: 'center' | 'left' | 'right'
  formatValue?: (value: unknown) => string
}

export interface SimpleTableProps<TRow> {
  columns: Column[]
  rows: TRow[]
}

export interface Row {
  [key: string]: unknown
}

export default function SimpleTable<TRow extends Row>({
  columns,
  rows
}: SimpleTableProps<TRow>) {
  return (
    <table>
      <thead>
        <tr>
          {columns.map(({ key, title, textAlign }) => (
            <th key={key} style={{ textAlign }}>
              {title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={index}>
            {columns.map(
              ({ key, textAlign, formatValue = value => String(value) }) => (
                <td key={String(row[key])} style={{ textAlign }}>
                  {formatValue(row[key])}
                </td>
              )
            )}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
