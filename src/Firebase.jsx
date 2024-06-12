import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import "firebase/compat/firestore"
import "firebase/compat/database"

const firebaseConfig = {
  apiKey: "AIzaSyBrQ-Zq73u30CnmcvFEIpBfWbqtqwDNP4A",
  authDomain: "record-mannager.firebaseapp.com",
  projectId: "record-mannager",
  storageBucket: "record-mannager.appspot.com",
  messagingSenderId: "951032866095",
  appId: "1:951032866095:web:662160c19e2f5174e42dda"
};

// Initialize Firebase
const fire = firebase.initializeApp(firebaseConfig);
export default fire.database().ref()