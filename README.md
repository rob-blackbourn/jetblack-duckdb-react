# @jetblack/duckdb-react

Utilities for using duckdb with react.

You can find an example app using vite [here](https://github.com/rob-blackbourn/demo-duckdb-react-vite).

## Installation

Install from [npmjs](https://www.npmjs.com/package/@jetblack/duckdb-react).

```bash
npm install @jetblack/duckdb-react
```

## Usage

The main component is the `DuckDB` context provider.

### DuckDB

Dependents of the `DuckDB` component will have access to the context.

```typescript
import DuckDB from '@jetblack/duckdb-react'

import SomeComponent from './SomeComponent'

import bundles from './bundles'

export default function App() {
  return (
    <DuckDB bundles={bundles}>

      <SomeComponent />

    </DuckDB>
  )
}
```

The `DuckDB` component takes the following properties:

* `bundles`: `DuckDBBundles` - see the section on bundles below,
* `logger`: `Logger | undefined` - defaults to the built in `ConsoleLogger`.

### useDuckDB

A descendent uses the `useDuckDB` hook to get the database.

```typescript
import { useDuckDB } from '@jetblack/duckdb-react'

export default function SomeComponent() {
  const { db, loading, error } = useDuckDB()

  useEffect(() => {
    if (loading || !db || error) {
      return
    }

    // Do something with the duckdb

  }, [loading, db, error])

  ...
}
```

The properties returned by `useDuckDB` are:

* `db`: `AsyncDuckDB | undefined`
* `loading`: `boolean`
* `error`: `string | Error | undefined`

The `loading` property is initially `true`, becoming `false` when either the `db` property is set, or the `error` property is set.

### Bundles

In order to create the context a wasm "bundle" must be provided. The
bundle is specific to the development environment. The following
gives the bundles defined by the [DuckDB documentation](https://duckdb.org/docs/api/wasm/instantiation).

#### vite

For vite, create the following `bundle.ts`.

```typescript bundle.ts
import { DuckDBBundles } from '@duckdb/duckdb-wasm'
import duckdbMvpWasm from '@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url'
import duckdbMvpWorker from '@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url'
import duckdbEHWasm from '@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url'
import duckdbEHWorker from '@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url'

const VITE_BUNDLES: DuckDBBundles = {
  mvp: {
    mainModule: duckdbMvpWasm,
    mainWorker: duckdbMvpWorker
  },
  eh: {
    mainModule: duckdbEHWasm,
    mainWorker: duckdbEHWorker
  }
}

export default VITE_BUNDLES
```

#### webpack

For webpack, create the following `bundle.ts`.

```typescript bundle.js
import { DuckDBBundles } from '@duckdb/duckdb-wasm'
import duckdbMvpWasm from '@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm'
import duckdbEHWasm from '@duckdb/duckdb-wasm/dist/duckdb-eh.wasm'

const WEBPACK_BUNDLES: DuckDBBundles = {
  mvp: {
    mainModule: duckdbMvpWasm,
    mainWorker: new URL('@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js', import.meta.url).toString(),
  },
  eh: {
    mainModule: duckdbEHWasm,
    mainWorker: new URL('@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js', import.meta.url).toString(),
  }
}

export default WEBPACK_BUNDLES
```
