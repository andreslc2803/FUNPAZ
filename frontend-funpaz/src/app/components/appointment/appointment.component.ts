import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { RecaptchaErrorParameters } from 'ng-recaptcha';
import Swal from 'sweetalert2';

import { AppConfig } from 'src/config/config';
import { MessageAppointmentService } from 'src/app/services/message-appointment.service';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css'],
})
export class AppointmentComponent {
  protected siteKey = AppConfig.reCaptchaSiteKey;
  form!: FormGroup;
  archivosSeleccionados: File[] = [];
  tokenCaptcha: string | null = null;

  constructor(
    public _MessageService: MessageAppointmentService,
    private fb: FormBuilder
  ) {
    this.crearFormulario();
  }

  async enviar() {
    if (!this.isCaptchaValid()) {
      this.mostrarErrorCaptcha();
      return;
    }

    // Verificar si no se ha seleccionado un archivo
    if (this.archivosSeleccionados.length === 0) {
      console.log('Archivo no seleccionado');
      this.mostrarErrorArchivo();
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

    // Si todo está bien, enviar el mensaje
    await this.enviarMensaje(this.tokenCaptcha);
  }

  marcarCamposInvalidos() {
    Object.values(this.form.controls).forEach((control) => {
      control.markAllAsTouched();
    });
  }

  obtenerExtensionArchivo(archivo: File) {
    return (archivo.name.split('.').pop() || '').toLowerCase();
  }

  esExtensionPermitida(extension: string) {
    const extensionesPermitidas = ['pdf'];
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
      'Al menos uno de los archivos seleccionados no tiene una extensión permitida. Por favor, elija archivos con extensiones .pdf.',
      'error'
    );
  }

  mostrarMensajeExito() {
    Swal.fire(
      'Formulario de contacto',
      'Mensaje enviado correctamente',
      'success'
    );
  }

  mostrarErrorTamanoArchivo() {
    Swal.fire(
      'Advertencia',
      'Los archivos adjuntos superan el tamaño de 8MB. Recuerda que no deben superar esa cantidad.',
      'warning'
    );
  }

  mostrarErrorCaptcha() {
    Swal.fire('Error', 'Por favor, resuelve el reCAPTCHA', 'error');
  }

  mostrarErrorArchivo() {
    Swal.fire(
      'Advertencia',
      'Por favor, adjunte los documentos solicitados en el formulario',
      'warning'
    );
  }

  async enviarMensaje(token: any) {
    const formData = new FormData();
    formData.append('tipo_documento', this.form.get('tipo_documento')?.value);
    formData.append('numero', this.form.get('numero')?.value);
    formData.append('nombre', this.form.get('nombre')?.value);
    formData.append('apellido', this.form.get('apellido')?.value);
    formData.append('correo', this.form.get('correo')?.value);
    formData.append('telefono', this.form.get('telefono')?.value);
    formData.append('descripcion', this.form.get('descripcion')?.value);
    formData.append('tipo_eps', this.form.get('tipo_eps')?.value);

    for (const archivo of this.archivosSeleccionados) {
      formData.append('archivos', archivo, archivo.name);
    }

    this._MessageService.sendMessage(formData, token).subscribe(
      () => {
        this.mostrarMensajeExito();
        this.limpiar();
      },
      (error) => {
        console.error('Error al enviar el mensaje:', error);
      }
    );
  }

  resolved(token: any) {
    this.tokenCaptcha = token;
  }

  onError(errorDetails: RecaptchaErrorParameters): void {
    console.log(`reCAPTCHA error encountered`);
  }

  isCaptchaValid() {
    return this.tokenCaptcha !== null;
  }

  crearFormulario() {
    this.form = this.fb.group({
      tipo_documento: ['', Validators.required],
      numero: ['', [Validators.required, Validators.minLength(8)]],
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      correo: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'
          ),
        ],
      ],
      telefono: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{10}$'),
          Validators.maxLength(10),
        ],
      ],
      descripcion: ['', Validators.required],
      tipo_eps: ['', Validators.required],
      archivos: [null, Validators.required],
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

  get tipoEpsNoValido() {
    return (
      this.form.get('tipo_eps')?.invalid && this.form.get('tipo_eps')?.touched
    );
  }

  async limpiar() {
    await this.form.reset();
  }
}
