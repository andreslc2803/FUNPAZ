import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class RecaptchaService {
  constructor(private http: HttpClient) {}

  sendToken(token: any) {
    return this.http.post('http://localhost:3000/token_validate', {
      recaptcha: token,
    });
  }
}
