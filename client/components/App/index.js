import React, { Fragment } from 'react'

import { auth, authenticateUser, database } from '../../firebase'
import Chart from '../Chart'

import { formatDatesFromData } from '../../utils/date'
import config from '../../../config.json'

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      accessToken: null,
      refreshToken: null,
      uid: null,
      isAuthenticating: false,
      data: []
    }
  }

  wait = () => {
    const { uid } = this.state

    if (!uid) {
      return
    }

    database.ref(`data/${config.YOUR_UNIQUE_GOOGLE_AUTH_ID}`).on('value', snapshot => {
      const val = snapshot.val()
      if (val) {
        const entries = Object.entries(val).map(entry => {
          return entry[1]
        })
        this.setState({
          data: [...entries]
        })
      }
    })
  }

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({
          refreshToken: user.refreshToken,
          uid: user.uid,
          accessToken: null,
          isAuthenticating: false
        })

        this.wait()
      }
    })
  }

  authenticate = () => {
    this.setState({
      isAuthenticating: true
    })

    authenticateUser().then(result => {
      this.setState({
        accessToken: result.credential.accessToken,
        refreshToken: result.user.refreshToken,
        uid: result.user.uid,
        isAuthenticating: false
      })

      this.wait()
    })
  }

  renderCharts() {
    const { data } = this.state

    const chartData = formatDatesFromData(data)

    if (chartData && chartData.length > 0) {
      return (
        <Chart
          data={chartData}
          width={1200}
          height={800}
          label="First Paint (ms)"
          dataKey="firstPaint"
          secondLabel="Load Time (ms)"
          secondDataKey="loadTime"
        />
      )
    }

    return null
  }

  render() {
    const { isAuthenticating, refreshToken, accessToken } = this.state

    return (
      <div>
        <header>
          <h1>AO.com Home Page Performance</h1>
        </header>
        {!isAuthenticating && (
          <Fragment>
            {!(refreshToken || accessToken) && (
              <button onClick={this.authenticate}>Authenticate</button>
            )}
          </Fragment>
        )}
        {this.renderCharts()}
      </div>
    )
  }
}

export default App
