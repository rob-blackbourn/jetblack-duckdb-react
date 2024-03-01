import { ReactNode, useEffect, useState } from 'react'

import { AsyncDuckDB, DuckDBBundles, Logger } from '@duckdb/duckdb-wasm'

import DuckDBContext from './DuckDBContext'

import {
  instantiateWithBundles,
  instantiateWithJsDelivr
} from './instantiateDB'

export type DuckDBProps = {
  bundles?: DuckDBBundles
  logger?: Logger
  children: ReactNode | ReactNode[]
}

export default function DuckDB({ bundles, logger, children }: DuckDBProps) {
  const [db, setDb] = useState<AsyncDuckDB>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error>()

  useEffect(() => {
    const createDbAsync = bundles
      ? async () => instantiateWithBundles(bundles, logger)
      : async () => instantiateWithJsDelivr(logger)

    createDbAsync()
      .then(setDb)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [logger, bundles])

  return (
    <DuckDBContext.Provider value={{ db, loading, error }}>
      {children}
    </DuckDBContext.Provider>
  )
}
