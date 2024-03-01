import { ReactNode, useEffect, useState } from 'react'

import { AsyncDuckDB, DuckDBBundles, Logger } from '@duckdb/duckdb-wasm'

import DuckDBContext from './DuckDBContext'

import {
  instantiateWithBundles,
  instantiateWithJsDelivr
} from './instantiateDB'

export type DuckDBProps = {
  /** Optional DuckDB bundles. If undefined the JsDelivr CDN will be used */
  bundles?: DuckDBBundles
  /** Optional logger. If undefined ConsoleLogger will be used. */
  logger?: Logger
  /** Child elements will have access to the DuckDB context with useContext */
  children: ReactNode | ReactNode[]
}

/**
 * Provides a context provider for DuckDB.
 *
 * @param props The provider properties
 * @returns A context provider for DuckDB
 */
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
