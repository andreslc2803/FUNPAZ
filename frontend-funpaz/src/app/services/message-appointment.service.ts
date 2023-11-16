import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class MessageAppointmentService {
  constructor(private _http: HttpClient) {}

  sendMessage(formData: FormData) {
    return this._http.post(
      'http://localhost:3000/formulario-cita',
      formData
    );
  }
}
