import { HttpHandler, HttpInterceptor, HttpRequest, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class NoCacheHeadersInterceptor implements HttpInterceptor {

    constructor(
        private ngZone: NgZone,
        private afAuth: AngularFireAuth,
        private router: Router,
    ) {}

    handleError(error: HttpErrorResponse) {
        let errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        
        console.log(errorMessage);
        return throwError(errorMessage);
    }    

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authReq = req.clone({
            setHeaders: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'Expires': '0',
                'Set-Cookie': 'HttpOnly;Secure;SameSite=None'
            }            
        });

        return next.handle(authReq);               
    }  
}