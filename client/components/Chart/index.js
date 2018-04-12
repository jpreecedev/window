import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts'

const Chart = ({ data, width, height, label, dataKey, secondLabel, secondDataKey }) => (
  <LineChart width={width} height={height} data={data}>
    <XAxis dataKey="date" stroke="#6c757d" padding={{ left: 30, right: 30 }} />
    <YAxis stroke="#6c757d" />
    <Tooltip />
    <Legend />
    <Line
      type="monotone"
      name={label}
      dataKey={dataKey}
      stroke="#6f42c1"
      activeDot={{ r: 8 }}
    />
    {secondLabel && (
      <Line
        type="monotone"
        name={secondLabel}
        dataKey={secondDataKey}
        stroke="#7fba23"
        activeDot={{ r: 8 }}
      />
    )}
  </LineChart>
)

export default Chart
