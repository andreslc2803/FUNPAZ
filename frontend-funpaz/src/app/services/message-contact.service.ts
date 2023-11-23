import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Servicio para interactuar con la API relacionada con el formulario de contacto en la clínica médica.
 * Proporciona métodos para enviar mensajes y realizar operaciones relacionadas con los formularios de contacto.
 *
 * @export
 * @class MessageContactService
 */
@Injectable()
export class MessageContactService {
  // URL de la API para el formulario de contacto
  private apiUrl = 'http://localhost:3000/api/formulario-contacto';

  /**
   * Crea una instancia del servicio `MessageContactService`.
   * @param {HttpClient} _http - Instancia de HttpClient para realizar solicitudes HTTP.
   */
  constructor(private _http: HttpClient) {}

  /**
   * Envía un mensaje, que en este contexto representa el formulario de contacto,
   * a la API de la clínica médica.
   *
   * @param {FormData} formData - Objeto FormData que contiene los datos del formulario.
   * @param {string} token - Token de autenticación para autorizar la solicitud.
   * @returns {Observable<any>} - Observable que emite la respuesta de la API.
   */
  sendMessage(formData: FormData, token: string): Observable<any> {
    // Crear encabezados con el token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Enviar la solicitud POST con los datos del formulario y los encabezados
    return this._http.post<any>(this.apiUrl, formData, { headers });
  }
}
