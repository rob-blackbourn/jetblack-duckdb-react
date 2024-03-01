import { createContext } from 'react'

import { AsyncDuckDB, InstantiationProgress } from '@duckdb/duckdb-wasm'

export type DuckDBContextProps = {
  /** The DuckDB database if the database instantiation succeed. */
  db?: AsyncDuckDB
  /** A boolean to indicate whether the database is being loaded. */
  loading: boolean
  /** The error if the database instantiation failed. */
  error?: Error | string
  /** The progress; updated during instantiation. */
  progress?: InstantiationProgress
}

const DuckDBContext = createContext<DuckDBContextProps>({
  loading: true
})

export default DuckDBContext
