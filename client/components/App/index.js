import React from 'react'

import { auth, authenticateUser, database } from '../../firebase'
import Table from '../Table'

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
          displayName: user.displayName,
          refreshToken: user.refreshToken,
          uid: user.uid,
          accessToken: null,
          isAuthenticating: false
        })

        this.wait()
      }
    })
  }

  addEntry = () => {
    const { uid } = this.state

    const ref = database.ref(`entries/${uid}/`)
    const newRef = ref.push()
    newRef.set({
      date: new Date().toISOString()
    })
  }

  authenticate = () => {
    this.setState({
      isAuthenticating: true
    })

    authenticateUser().then(result => {
      this.setState({
        displayName: result.user.displayName,
        accessToken: result.credential.accessToken,
        refreshToken: null,
        uid: null,
        isAuthenticating: false
      })

      this.wait()
    })
  }

  render() {
    const {
      isAuthenticating,
      displayName,
      refreshToken,
      accessToken,
      entries
    } = this.state

    return (
      <div>
        <header>
          <h1>Firebase Authentication</h1>
        </header>
        {!isAuthenticating && (
          <React.Fragment>
            {!(refreshToken || accessToken) && (
              <button onClick={this.authenticate}>Authenticate</button>
            )}
            {displayName && <p>{displayName}</p>}
            {entries && entries.length > 0 && <Table entries={entries} />}
            {(refreshToken || accessToken) && (
              <button onClick={this.addEntry}>Add entry</button>
            )}
          </React.Fragment>
        )}
      </div>
    )
  }
}

export default App
