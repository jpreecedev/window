import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts'

const Chart = ({ data }) => (
  <LineChart width={1200} height={600} data={data}>
    <XAxis dataKey="name" stroke="#6c757d" padding={{ left: 30, right: 30 }} />
    <YAxis stroke="#6c757d" />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey="pv" stroke="#6f42c1" activeDot={{ r: 8 }} />
  </LineChart>
)

export default Chart
