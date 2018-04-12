import * as firebase from 'firebase'
import 'firebase/auth'
import 'firebase/database'

const config = {
  apiKey: 'AIzaSyAMrkKwyy8r77YC--_tF1wfi0cXcYBg2rI',
  authDomain: 'window-75f56.firebaseapp.com',
  databaseURL: 'https://window-75f56.firebaseio.com',
  projectId: 'window-75f56',
  storageBucket: 'window-75f56.appspot.com',
  messagingSenderId: '674621249793'
}

firebase.initializeApp(config)

export const provider = new firebase.auth.GoogleAuthProvider()
export const auth = firebase.auth()
export const database = firebase.database()

export function authenticateUser() {
  return auth.signInWithPopup(provider)
}

export default firebase
