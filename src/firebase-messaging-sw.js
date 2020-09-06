importScripts('https://www.gstatic.com/firebasejs/7.19.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.19.1/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyCeLH4bJTZ8ujpbEQUtjvlnzFkw72C_Zws",
    authDomain: "todo-21537.firebaseapp.com",
    databaseURL: "https://todo-21537.firebaseio.com",
    projectId: "todo-21537",
    storageBucket: "todo-21537.appspot.com",
    messagingSenderId: "390337767210",
    appId: "1:390337767210:web:4ccd3231b84c6557c46053"      
  });

const messaging = firebase.messaging();