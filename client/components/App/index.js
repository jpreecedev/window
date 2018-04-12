import React from 'react'

import { auth, authenticateUser, database } from '../../firebase'
import Chart from '../Chart'

import styles from './styles'

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      username: null,
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

    database.ref(`data`).on('value', snapshot => {
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
        refreshToken: null,
        uid: null,
        isAuthenticating: false
      })

      this.wait()
    })
  }

  render() {
    const { isAuthenticating, refreshToken, accessToken, data } = this.state

    return (
      <div>
        <header>
          <h1>AO.com Basket Page Performance</h1>
        </header>
        {!isAuthenticating && (
          <React.Fragment>
            {!(refreshToken || accessToken) && (
              <button onClick={this.authenticate}>Authenticate</button>
            )}

            <div className={styles.wrapper}>
              <Chart
                data={data}
                width={800}
                height={500}
                label="First Paint (ms)"
                dataKey="firstPaint"
                secondLabel="Load Time (ms)"
                secondDataKey="loadTime"
              />
              <Chart
                data={data}
                width={800}
                height={500}
                label="Unused JavaScript (%)"
                dataKey="unusedJs"
              />
            </div>
          </React.Fragment>
        )}
      </div>
    )
  }
}

export default App
