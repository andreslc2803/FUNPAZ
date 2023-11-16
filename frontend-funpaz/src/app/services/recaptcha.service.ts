import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Import the necessary RxJS operators
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RecaptchaService {
  constructor(private http: HttpClient) {}

  sendToken(token: any) {
    console.log('Enviando token:', token);
    return this.http.post('http://localhost:3000/token_validate', {
      recaptcha: token,
    });
  }
}
