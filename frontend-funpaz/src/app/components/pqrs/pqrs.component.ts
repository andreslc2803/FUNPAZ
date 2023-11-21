import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { RecaptchaErrorParameters } from 'ng-recaptcha';
import Swal from 'sweetalert2';

import { AppConfig } from 'src/config/config';
import { MessagePqrsService } from 'src/app/services/message-pqrs.service';


@Component({
  selector: 'app-pqrs',
  templateUrl: './pqrs.component.html',
  styleUrls: ['./pqrs.component.css'],
})
export class PqrsComponent {
  protected siteKey = AppConfig.reCaptchaSiteKey;
  form!: FormGroup;
  archivosSeleccionados: File[] = [];
  tokenCaptcha: string | null = null;

  constructor(
    public _MessageService: MessagePqrsService,
    private fb: FormBuilder
  ) {
    this.crearFormulario();
  }

  async enviar() {
    if (!this.isCaptchaValid()) {
      this.mostrarErrorCaptcha();
      return;
    }

    if (this.form.invalid) {
      this.marcarCamposInvalidos();
      return;
    }

    if (this.archivosSeleccionados.length > 0) {
      for (const archivo of this.archivosSeleccionados) {
        const fileExtension = this.obtenerExtensionArchivo(archivo);
        if (!this.esExtensionPermitida(fileExtension)) {
          this.mostrarErrorExtensionArchivo();
          return;
        }

        if (this.tamanoArchivoExcedeLimite(archivo)) {
          this.mostrarErrorTamanoArchivo();
          return;
        }
      }
    }

    await this.enviarMensaje(this.tokenCaptcha);
  }

  marcarCamposInvalidos() {
    Object.values(this.form.controls).forEach((control) => {
      control.markAllAsTouched();
    });
  }

  mostrarErrorCaptcha() {
    Swal.fire('Error', 'Por favor, resuelve el reCAPTCHA', 'error');
  }

  obtenerExtensionArchivo(archivo: File) {
    return (archivo.name.split('.').pop() || '').toLowerCase();
  }

  esExtensionPermitida(extension: string) {
    const extensionesPermitidas = ['pdf', 'jpg', 'jpeg', 'png'];
    return extensionesPermitidas.includes(extension);
  }

  tamanoArchivoExcedeLimite(archivo: File) {
    const fileSizeInBytes = archivo.size;
    const fileSizeInMB = fileSizeInBytes / 1024 / 1024;
    return fileSizeInMB > 8;
  }

  mostrarErrorExtensionArchivo() {
    Swal.fire(
      'Error',
      'Al menos uno de los archivos seleccionados no tiene una extensión permitida. Por favor, elija archivos con una de las siguientes extensiones: .pdf, .jpg, .jpeg, .png',
      'error'
    );
  }

  mostrarErrorTamanoArchivo() {
    Swal.fire(
      'Advertencia',
      'Los archivos adjuntos superan el tamaño de 8MB. Recuerda que no deben superar esa cantidad.',
      'warning'
    );
  }

  async enviarMensaje(token: any) {
    const formData = new FormData();
    formData.append('tipo_pqrs', this.form.get('tipo_pqrs')?.value);
    formData.append('tipo_documento', this.form.get('tipo_documento')?.value);
    formData.append('numero', this.form.get('numero')?.value);
    formData.append('nombre', this.form.get('nombre')?.value);
    formData.append('apellido', this.form.get('apellido')?.value);
    formData.append('correo', this.form.get('correo')?.value);
    formData.append('telefono', this.form.get('telefono')?.value);
    formData.append('descripcion', this.form.get('descripcion')?.value);

    for (const archivo of this.archivosSeleccionados) {
      formData.append('archivos', archivo, archivo.name);
    }

    this._MessageService
    .sendMessage(formData, token)
    .subscribe(
      () => {
        this.mostrarMensajeExito();
        this.limpiar();
      },
      (error) => {
        console.error('Error al enviar el mensaje:', error);
      }
    );
  }

  mostrarMensajeExito() {
    Swal.fire(
      'Formulario de contacto',
      'Mensaje enviado correctamente',
      'success'
    );
  }

  resolved(token: any) {
    this.tokenCaptcha = token;
  }

  public onError(errorDetails: RecaptchaErrorParameters): void {
    console.log(`reCAPTCHA error encountered`);
  }

  isCaptchaValid() {
    return this.tokenCaptcha !== null;
  }

  crearFormulario() {
    this.form = this.fb.group({
      tipo_pqrs: ['', Validators.required],
      tipo_documento: [''],
      numero: ['', Validators.minLength(8)],
      nombre: ['', Validators.minLength(2)],
      apellido: ['', Validators.minLength(2)],
      correo: [
        '',
        [
          Validators.pattern(
            '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'
          ),
        ],
      ],
      telefono: [
        '',
        [Validators.pattern('^[0-9]{10}$'), Validators.maxLength(10)],
      ],
      descripcion: ['', Validators.required],
      archivos: [null],
      recaptchaReactive: ['', Validators.required],
    });
  }

  onFileSelected(event: any) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files) {
      this.archivosSeleccionados = Array.from(inputElement.files);
    } else {
      this.archivosSeleccionados = [];
    }
  }

  get tipoPqrsNoValido() {
    return (
      this.form.get('tipo_pqrs')?.invalid && this.form.get('tipo_pqrs')?.touched
    );
  }

  get tipoDocumentoNoValido() {
    return (
      this.form.get('tipo_documento')?.invalid &&
      this.form.get('tipo_documento')?.touched
    );
  }

  get numeroNoValido() {
    return this.form.get('numero')?.invalid && this.form.get('numero')?.touched;
  }

  get nombreNoValido() {
    return this.form.get('nombre')?.invalid && this.form.get('nombre')?.touched;
  }

  get apellidoNoValido() {
    return (
      this.form.get('apellido')?.invalid && this.form.get('apellido')?.touched
    );
  }

  get correoNoValido() {
    return this.form.get('correo')?.invalid && this.form.get('correo')?.touched;
  }

  get telefonoNoValido() {
    return (
      this.form.get('telefono')?.invalid && this.form.get('telefono')?.touched
    );
  }

  get descripcionNoValido() {
    return (
      this.form.get('descripcion')?.invalid &&
      this.form.get('descripcion')?.touched
    );
  }

  async limpiar() {
    await this.form.reset();
    this.archivosSeleccionados = [];
  }
}
