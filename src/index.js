import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// Initialize Firebase
  firebase.initializeApp({
   apiKey: "AIzaSyAnlF2Ko1eC7iKleZZC5S11ltLKuXAuvrA",
   authDomain: "ejemplogram.firebaseapp.com",
   databaseURL: "https://ejemplogram.firebaseio.com",
   projectId: "ejemplogram",
   storageBucket: "ejemplogram.appspot.com",
   messagingSenderId: "203967873873"
 });
 //firebase.initializeApp(config);
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
