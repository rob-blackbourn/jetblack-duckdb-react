import { createContext } from 'react'

import { AsyncDuckDB } from '@duckdb/duckdb-wasm'

export type DuckDBContextProps = {
  db?: AsyncDuckDB
  loading: boolean
  error?: Error | string
}

const DuckDBContext = createContext<DuckDBContextProps>({
  loading: true
})

export default DuckDBContext
