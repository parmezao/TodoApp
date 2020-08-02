import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from './../../_modal/modal.service';
import { Component, OnInit, Input, NgZone } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  @Input() todos: any = null;
  public form: FormGroup;
  public todoUpdate: any;

  constructor(
    private fb: FormBuilder,
    private service: DataService,
    private afAuth: AngularFireAuth,
    private modalService: ModalService,
    private ngZone: NgZone,
    private router: Router,
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

  ngOnInit(): void {
  }

  markAsDone(todo) {
    this.afAuth.idToken.subscribe(token => {
      const data = { id: todo.id };
      this.service.markAsDone(data, token).subscribe(res => { todo.done = true });
    });
  }

  markAsUnDone(todo) {
    this.afAuth.idToken.subscribe(token => {
      const data = { id: todo.id };
      this.service.markAsUnDone(data, token).subscribe(res => { todo.done = false });
    });
  }

  Delete(todo) {
    this.afAuth.idToken.subscribe(token => {
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
      });
    });
  }

  Update() {
    this.afAuth.idToken.subscribe(token => {
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
      });
    });
  }

  openModal(id: string, todo) {
    this.modalService.open(id);
    this.form.controls['title'].setValue(todo.title);
    this.form.controls['date'].setValue(todo.date);

    this.todoUpdate = todo;
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }
}
