import React from 'react'

const Table = ({ entries }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Entry</th>
        </tr>
      </thead>
      <tbody>
        {entries.map(entry => {
          return (
            <tr key={entry}>
              <td>{entry}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default Table
