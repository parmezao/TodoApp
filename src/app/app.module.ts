import { NoCacheHeadersInterceptor } from './interceptors/NoCacheHeadersInterceptor';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { CardComponent } from './components/card/card.component';
import { ButtonComponent } from './components/button/button.component';
import { LoginComponent } from './pages/login/login.component';
import { UserCardComponent } from './components/user-card/user-card.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { AllComponent } from './pages/all/all.component';
import { TodayComponent } from './pages/today/today.component';
import { TomorrowComponent } from './pages/tomorrow/tomorrow.component';
import { NewComponent } from './pages/new/new.component';
import { ModalModule } from './_modal/modal.module';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { MessagingService } from './messaging.service';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AsyncPipe } from '@angular/common';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AngularPaginatorModule } from 'angular-paginator';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CardComponent,
    ButtonComponent,
    LoginComponent,
    UserCardComponent,
    TabsComponent,
    TodoListComponent,
    AllComponent,
    TodayComponent,
    TomorrowComponent,
    NewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    ModalModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    AngularFireMessagingModule,
    Ng2SearchPipeModule,
    AngularPaginatorModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NoCacheHeadersInterceptor,
      multi: true,
    }, 
    MessagingService, 
    AsyncPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
