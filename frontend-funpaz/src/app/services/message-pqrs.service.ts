import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class MessagePqrsService {
  private apiUrl = 'http://localhost:3000/formulario-pqrs';
  constructor(private _http: HttpClient) {}

  sendMessage(formData: FormData): Observable<any> {
    return this._http.post<any>(this.apiUrl, formData);
  }
}
