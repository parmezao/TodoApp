import { Component, OnInit, NgZone, Injectable } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from 'src/app/data.service';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { NotificationService } from 'src/app/notification.service';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MessagingService } from 'src/app/messaging.service';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
export class NewComponent implements OnInit, CanActivate {
  public form: FormGroup;
  protected ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private service: DataService,
    private router: Router,
    private afAuth: AngularFireAuth,
    private ngZone: NgZone,
    private notifiyService: NotificationService,
  ) {
    this.form = this.fb.group({
      title: ['', Validators.compose([
        Validators.minLength(3),
        Validators.maxLength(60),
        Validators.required,
      ])],      
      date: [`${new Date().toJSON().substring(0, 10)}T${new Date().toLocaleTimeString().substring(0, 5)}`, Validators.required]      
    });
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if(!this.isLoggedIn()) {
      this.notifiyService.showWarning('Sessão expirada! Reconectando...', 'ToDo');
      this.afAuth.currentUser.then(user => user.getIdToken(true));
      this.router.navigateByUrl("/");
    }
    return true;
  }  

  // Returns true when user is looged in and token not expired (time passed < 60 minutes)
  isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    let validToken = false;
    if (user) {
      validToken = new Date().getTime() <= user.stsTokenManager.expirationTime;
    }
    return (user !== null && validToken) ? true : false;
  } 

  keytab(event) {
    let element = event.srcElement.nextElementSibling;

    if (element == null)
      return;
    else
      element.focus();  
  }

  ngOnInit(): void {
  }

  public ngOnDestroy(): void {
    // This aborts all HTTP requests.
    this.ngUnsubscribe.next();
    // This completes the subject properlly.
    this.ngUnsubscribe.complete();
  }  

  submit() {
    this.afAuth.idToken.subscribe(token => {
      this.service.postTodo(this.form.value, token)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data: any) => {
          this.ngZone.run(() => {
            this.notifiyService.showSuccess('Tarefa criada com sucesso!', 'ToDo');     
            this.form.reset();
            this.router.navigateByUrl("/")
          });
        }, (error) => {
          if (error) {
            this.ngZone.run(() => {
              this.notifiyService.showWarning('Sessão expirada! Reconectando...', 'ToDo');
              this.afAuth.currentUser.then(user => user.getIdToken(true));
              this.router.navigateByUrl("/");              
            });
          }
        });
    });
  }
}

