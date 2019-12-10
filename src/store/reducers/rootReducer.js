import { combineReducers } from 'redux';
import { firestoreReducer } from 'redux-firestore'; // syncing firestore
import { firebaseReducer } from 'react-redux-firebase';
import authReducer from './authReducer';
import wireframeReducer from './wireframeReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  wireframe: wireframeReducer,
  firestore: firestoreReducer,
  firebase: firebaseReducer,
});

export default rootReducer;