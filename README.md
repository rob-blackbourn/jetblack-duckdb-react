# @jetblack/duckdb-react

Utilities for using [duckdb](https://duckdb.org/) with [react](https://react.dev/).

You can find an example app using [vite](https://vitejs.dev/) [here](https://github.com/rob-blackbourn/demo-duckdb-react-vite),
and an example using [webpack](https://webpack.js.org/) [here](https://github.com/rob-blackbourn/demo-duckdb-react-webpack).

## Development

If you are interested in the implementation, the library code is in [`lib`](./lib),
and an example application is in [`src`](./src). To use from source, clone the
project, install the packages, then run the example with `npm run dev`.

## Installation

Install from [npmjs](https://www.npmjs.com/package/@jetblack/duckdb-react).

```bash
npm install @jetblack/duckdb-react
```

## Usage

Use the `DuckDB` context provider to connect to the database and provide a
context.

Children of the `DuckDB` component will have access to the database context.

```typescript
import DuckDB, { useDuckDB } from '@jetblack/duckdb-react'

import bundles from './bundles'

export default function App() {
  const useBundles = true
  const optionalBundles = useBundles ? bundles : undefined

  return (
    <DuckDB bundles={optionalBundles}>
      <HelloWorld />
    </DuckDB>
  )
}

function HelloWorld() {
  // Get the DuckDB context from the hook.
  const { db, loading, error } = useDuckDB()

  useEffect(() => {
    if (loading || !db || error) {
      return
    }

    // Do something with duckdb.

  }, [loading, db, error])

  return <div>Hello, World!</div>
}

```

The `DuckDB` component takes the following properties:

* `bundles`: `DuckDBBundles | undefined` - see the section on bundles below,
* `config`: `DuckDBConfig | undefined` - Optional configuration to apply to the database.
* `logger`: `Logger | undefined` - defaults to the built in `ConsoleLogger`.
* `progress`: `InstantiationProgress | undefined` - This is updated during the database instantiation.

The properties returned by `useDuckDB` are:

* `db`: `AsyncDuckDB | undefined`
* `loading`: `boolean`
* `error`: `string | Error | undefined`

The `loading` property is initially `true`, becoming `false` when either
the `db` property is set, or the `error` property is set.

### Bundles

In order to create the context a wasm "bundle" may be provided. If a bundle is
not specified it will be downloaded from the JsDelivr CDN.

If specified the bundle is specific to the development environment. The following
gives the bundles defined by the [DuckDB documentation](https://duckdb.org/docs/api/wasm/instantiation).

#### No bundle

If no bundle is provided the bundle will be discovered from the JsDelivr CDN.

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
