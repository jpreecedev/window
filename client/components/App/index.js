import React from 'react'

import { auth, authenticateUser, database } from '../../firebase'
import Chart from '../Chart'

const data = [{ name: 'Page A', pv: 2400 }, { name: 'Page B', pv: 1398 }]

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      username: null,
      accessToken: null,
      refreshToken: null,
      uid: null,
      isAuthenticating: false,
      entries: []
    }
  }

  wait = () => {
    const { uid } = this.state

    if (!uid) {
      return
    }

    database.ref(`entries/${uid}/`).on('value', snapshot => {
      const val = snapshot.val()
      if (val) {
        const entries = Object.entries(val).map(entry => {
          return entry[1].date
        })
        this.setState({
          entries: [...entries]
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
    const { isAuthenticating, refreshToken, accessToken, entries } = this.state

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
            {<Chart data={data} />}
          </React.Fragment>
        )}
      </div>
    )
  }
}

export default App
