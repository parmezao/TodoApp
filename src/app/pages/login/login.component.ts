import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { Router, CanActivate } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private afAuth: AngularFireAuth,    
    private router: Router
  ) { 

    this.afAuth.authState.subscribe(auth => {
      if (auth) {
        this.router.navigateByUrl('');
      }
    })
  }

  ngOnInit(): void {
  }

  login() {
    this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
}
