import { useEffect, useRef } from 'react'

import * as duckdbWasmShell from '@duckdb/duckdb-wasm-shell'
import 'xterm/css/xterm.css'
import shellWasm from '@duckdb/duckdb-wasm-shell/dist/shell_bg.wasm?url'

import { useDuckDB } from '../../lib/helpers'

export default function Shell() {
  const ref = useRef<HTMLDivElement | null>(null)
  const { db } = useDuckDB()

  useEffect(() => {
    if (!(db && ref.current)) {
      return
    }

    duckdbWasmShell.embed({
      shellModule: shellWasm,
      container: ref.current,
      resolveDatabase: async () => db
    })
  }, [db])

  return (
    <div
      id="xterm_div"
      ref={ref}
      style={{ height: '1000px', overflowY: 'scroll', margin: '3px' }}
    />
  )
}
