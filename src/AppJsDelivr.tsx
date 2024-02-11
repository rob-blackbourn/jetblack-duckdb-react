import { DuckDBJsDelivr } from '../lib/main'
import WeatherForecast from './components/WeatherForecast'
import Shell from './components/Shell'

export default function App() {
  return (
    <DuckDBJsDelivr>
      <WeatherForecast />
      <Shell />
    </DuckDBJsDelivr>
  )
}
