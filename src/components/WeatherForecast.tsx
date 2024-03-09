import { useEffect, useState } from 'react'

import { useDuckDB } from '../../lib/main'

import { sqlJsonDB } from '../utils'
import weatherData from '../assets/data.json'
import SimpleTable, { Column, Row } from './SimpleTable'

interface Observation extends Row {
  time: Date
  temperature: number
}

export default function WeatherForecast() {
  const { db } = useDuckDB()
  const [isTableLoaded, setIsTableLoaded] = useState(false)
  const [observations, setObservations] = useState<Observation[]>([])

  useEffect(() => {
    if (!db) {
      return
    }
    const asyncFunc = async () => {
      const text = JSON.stringify(weatherData)
      await db.registerFileText('observations.json', text)
      const con = await db.connect()
      await con.insertJSONFromPath('observations.json', {
        name: 'observations'
      })

      return true
    }

    asyncFunc().then(setIsTableLoaded).catch(console.error)
  }, [db])

  useEffect(() => {
    if (!(isTableLoaded && db)) {
      return
    }

    const asyncFunc = async () => {
      const rows = await sqlJsonDB(
        db,
        'SELECT * FROM observations LIMIT 10;',
        (value: { time: string; temperature: number }) =>
          ({
            time: new Date(value.time),
            temperature: value.temperature
          } as Observation)
      )
      return rows
    }

    asyncFunc().then(setObservations).catch(console.error)
  }, [isTableLoaded, db])

  const columns: Column[] = [
    {
      key: 'time',
      title: 'Time',
      formatValue: (value: unknown) => (value as Date).toISOString()
    },
    {
      key: 'temperature',
      title: 'Temperature',
      formatValue: (value: unknown) => (value as number).toFixed(2),
      textAlign: 'right'
    }
  ]

  return <SimpleTable<Observation> columns={columns} rows={observations} />
}
