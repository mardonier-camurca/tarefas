import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/database';

let firebaseConfig = {
    apiKey: "******",
    authDomain: "tarefas-70b37.firebaseapp.com",
    projectId: "tarefas-70b37",
    storageBucket: "tarefas-70b37.appspot.com",
    messagingSenderId: "377633130057",
    appId: "1:377633130057:web:247b807accab8f43d06198"
  };

  if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig)
  }

  export default firebase;