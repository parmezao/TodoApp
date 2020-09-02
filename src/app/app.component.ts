import { Component, OnInit, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
  constructor(
    private ngZone: NgZone,
    private afAuth: AngularFireAuth,
    private router: Router,
  ) {    
  }

  ngOnInit(): void {
    this.afAuth.onAuthStateChanged(data => {
      if (data) {
        this.ngZone.run(() => {
          this.router.navigateByUrl('');
          this.afAuth.idToken.subscribe(token => {
            localStorage.setItem('user', JSON.stringify(data));
            JSON.parse(localStorage.getItem('user'));
          });
        });
      } else {
        this.ngZone.run(() => {
          localStorage.setItem('user', null);
          JSON.parse(localStorage.getItem('user')); 

          this.router.navigateByUrl('/login');
        })
      }
    });
  }
}
