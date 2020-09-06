import { Injectable, NgZone } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { BehaviorSubject } from 'rxjs'
import { DataService } from './data.service';
 
@Injectable()
export class MessagingService {
  currentMessage = new BehaviorSubject(null);
  
  constructor(
    private angularFireMessaging: AngularFireMessaging,
    private service: DataService,
  ) { 
    this.angularFireMessaging.messages.subscribe(
      (_messaging: any) => {
        _messaging.onMessage = _messaging.onMessage.bind(_messaging);
        _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);        
      }
    )
  }
 
  requestPermission() {
    this.angularFireMessaging.requestToken.subscribe((token) => {
      localStorage.setItem('fcm-token', token);
    });
  }
 
  receiveMessage() {
    this.angularFireMessaging.messages.subscribe((msg) => {
      console.log("show message!", msg);
      this.currentMessage.next(msg);
    })
  }

  getAlert() {
    setInterval(() => {
      const token = this.getToken();
      if (token) {
        this.service.getAlert(token).subscribe((data) => {
          if (Object.keys(data).length > 0) {
            const body = { 
              token: this.getFCMToken(),
              name: this.getUserName(),
              count: Object.keys(data).length
            }
            this.service.postAlert(body).subscribe((res) => {
              //console.log('postAlert ' + res);
            });
          }
        });
      }
    }, 300000); // every 5 minutes
  }

  getFCMToken() {
    return localStorage.getItem('fcm-token');
  }

  private getToken() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user.stsTokenManager.accessToken;
  }

  private getUserName() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user.displayName;
  }  
}
