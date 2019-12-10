import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// THIS IS USED TO INITIALIZE THE firebase OBJECT
// PUT YOUR FIREBASE PROJECT CONFIG STUFF HERE
var firebaseConfig = {
  apiKey: "AIzaSyAZDdostUlOaff3O0ptoHnoLL0vqdg6irE",
  authDomain: "wireframer-316-dcf52.firebaseapp.com",
  databaseURL: "https://wireframer-316-dcf52.firebaseio.com",
  projectId: "wireframer-316-dcf52",
  storageBucket: "wireframer-316-dcf52.appspot.com",
  messagingSenderId: "966154242250",
  appId: "1:966154242250:web:db3345d17d276902c94c33",
  measurementId: "G-8LFCVJ1MR8"
};
firebase.initializeApp(firebaseConfig);

// NOW THE firebase OBJECT CAN BE CONNECTED TO THE STORE
export default firebase;