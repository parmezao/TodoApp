import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from './../../_modal/modal.service';
import { Component, OnInit, Input, NgZone } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { NotificationService } from 'src/app/notification.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit, CanActivate {
  @Input() todos: any = null;
  public form: FormGroup;
  public todoUpdate: any;
  public searchText;
  public cardAll: boolean;
  public currentPage;
  public itemsPerPage;
  protected ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private service: DataService,
    private afAuth: AngularFireAuth,
    private modalService: ModalService,
    private ngZone: NgZone,
    private router: Router,
    private notifiyService: NotificationService,
  ) {
    this.form = this.fb.group({
      title: ['', Validators.compose([
        Validators.minLength(3),
        Validators.maxLength(60),
        Validators.required,
      ])],
      date: ['', Validators.required]
    });

  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.isLoggedIn()) {      
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
    if (user !== null) {
      validToken = new Date().getTime() <= user.stsTokenManager.expirationTime;
    }

    return (user !== null && validToken) ? true : false;
  }   

  ngOnInit(): void {
    if (this.router.url === '/all')
      this.cardAll = true;
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }   

  keytab(event) {
    let element = event.srcElement.nextElementSibling;
    element = element.focus();
    let element2 = element.srcElement.nextElementSibling;

    if (element2 == null)
      return;
    else
      element2.focus();  
  }  

  markAsDone(todo) {
    if (this.isLoggedIn()) {
      this.afAuth.idToken
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(token => {
          const data = { id: todo.id };
          this.service.markAsDone(data, token).subscribe(res => { todo.done = true }, (error) => {
              if (error) {
                this.ngZone.run(() => {
                  this.notifiyService.showWarning('Sessão expirada! Reconectando...', 'ToDo');
                  this.afAuth.currentUser.then(user => user.getIdToken(true));
                  this.router.navigateByUrl("/");         
                });
              }
            });
        });
    } else {
      this.ngZone.run(() => {
        //window.location.reload();
        this.notifiyService.showWarning('Sessão expirada! Reconectando...', 'ToDo');
        this.afAuth.currentUser.then(user => user.getIdToken(true));
        this.router.navigateByUrl("/");  
      });       
    }
  }

  markAsUnDone(todo) {
    if (this.isLoggedIn()) {
      this.afAuth.idToken
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(token => {
          const data = { id: todo.id };
          this.service.markAsUnDone(data, token).subscribe(res => { todo.done = false }, (error) => {
            if (error) {
              this.ngZone.run(() => {
                this.notifiyService.showWarning('Sessão expirada! Reconectando...', 'ToDo');
                this.afAuth.currentUser.then(user => user.getIdToken(true));
                this.router.navigateByUrl("/");         
              });
            }            
          });
        });
    } else {
      this.ngZone.run(() => {
        this.notifiyService.showWarning('Sessão expirada! Reconectando...', 'ToDo');
        this.afAuth.currentUser.then(user => user.getIdToken(true));
        this.router.navigateByUrl("/");  
      });       
    }   
  }

  Delete(todo) {
    if (this.isLoggedIn()) {
      this.afAuth.idToken
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(token => {
          const data = { id: todo.id };
          this.service.deleteTodo(data, token).subscribe(res => {
            this.ngZone.run(() => {

              // Remove elemento "<li>" da lista de items
              const index = this.todos.indexOf(todo);
              if (index !== -1) {
                this.todos.splice(index, 1);
              };

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
    } else {
      this.ngZone.run(() => {
        this.notifiyService.showWarning('Sessão expirada! Reconectando...', 'ToDo');
        this.afAuth.currentUser.then(user => user.getIdToken(true));
        this.router.navigateByUrl("/");         
      });       
    }    
  }

  Update() {
    if (this.isLoggedIn()) {
      this.afAuth.idToken
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(token => {
          const data = {
            id: this.todoUpdate.id,
            title: this.form.controls['title'].value,
            date: this.form.controls['date'].value
          };
          this.service.updateTodo(data, token).subscribe(res => {

            // Altera elemento "<li>" da lista de items
            const index = this.todos.indexOf(this.todoUpdate);
            if (index !== -1) {
              this.todos[index]['title'] = this.form.controls['title'].value;
              this.todos[index]['date'] = this.form.controls['date'].value;
            };

            this.closeModal('custom-modal-1');
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
    } else {
      this.ngZone.run(() => {
        this.notifiyService.showWarning('Sessão expirada! Reconectando...', 'ToDo');
        this.afAuth.currentUser.then(user => user.getIdToken(true));
        this.router.navigateByUrl("/");           
      });       
    }
  }

  openModal(id: string, todo) {
    if (this.isLoggedIn()) {
      this.modalService.open(id);
      this.form.controls['title'].setValue(todo.title);
      this.form.controls['date'].setValue(todo.date);

      this.todoUpdate = todo;
    } else {
      this.ngZone.run(() => {
        this.notifiyService.showWarning('Sessão expirada! Reconectando...', 'ToDo');
        this.afAuth.currentUser.then(user => user.getIdToken(true));
        this.router.navigateByUrl("/");           
      });       
    }            
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }
}
