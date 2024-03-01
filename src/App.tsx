import DuckDB from '../lib/main'
import VITE_BUNDLES from './bundles'
import WeatherForecast from './components/WeatherForecast'
import Shell from './components/Shell'

export default function App() {
  const useVite = true
  const bundles = useVite ? VITE_BUNDLES : undefined

  return (
    <DuckDB bundles={bundles}>
      <WeatherForecast />
      <Shell />
    </DuckDB>
  )
}
