import { createContext } from 'react'

import { AsyncDuckDB, InstantiationProgress } from '@duckdb/duckdb-wasm'

export type DuckDBContextProps = {
  db?: AsyncDuckDB
  loading: boolean
  error?: Error | string
  progress?: InstantiationProgress
}

const DuckDBContext = createContext<DuckDBContextProps>({
  loading: true
})

export default DuckDBContext
