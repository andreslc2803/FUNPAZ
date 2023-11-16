import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { RecaptchaErrorParameters } from 'ng-recaptcha';
import Swal from 'sweetalert2';

import { AppConfig } from 'src/config/config';
import { MessageAppointmentService } from 'src/app/services/message-appointment.service';
import { RecaptchaService } from 'src/app/services/recaptcha.service';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css'],
})
export class AppointmentComponent {
  protected siteKey = AppConfig.reCaptchaSiteKey;
  form!: FormGroup;   //inicialmente puede tener un valor null o undefined el formulario
  archivoSeleccionado: File | null = null;
  tokenCaptcha: any | null = null;

  constructor(
    public _MessageService: MessageAppointmentService,
    public reCaptchaService: RecaptchaService,
    private fb: FormBuilder
  ) {
    this.crearFormulario();
  }

  enviar = async () => {
    if (!this.isCaptchaValid()) {
      this.mostrarErrorCaptcha();
      return;
    }

    if (this.form.invalid) {
      this.marcarCamposInvalidos();
      return;
    }

    if (this.archivoSeleccionado) {
      const fileExtension = this.obtenerExtensionArchivo();
      if (!this.esExtensionPermitida(fileExtension)) {
        this.mostrarErrorExtensionArchivo();
        return;
      }

      if (this.tamanoArchivoExcedeLimite()) {
        this.mostrarErrorTamanoArchivo();
        return;
      }
    }

    await this.enviarMensaje(this.tokenCaptcha);
  };

  marcarCamposInvalidos() {
    Object.values(this.form.controls).forEach((control) => {
      control.markAllAsTouched();
    });
  }

  obtenerExtensionArchivo() {
    return (
      this.archivoSeleccionado?.name.split('.').pop() || ''
    ).toLowerCase();
  }

  esExtensionPermitida(extension: string) {
    const extensionesPermitidas = [
      'pdf',
      'doc',
      'jpg',
      'jpeg',
      'png',
      'zip',
      'rar',
    ];
    return extensionesPermitidas.includes(extension);
  }

  tamanoArchivoExcedeLimite() {
    if (this.archivoSeleccionado) {
      const fileSizeInBytes = this.archivoSeleccionado.size;
      const fileSizeInMB = fileSizeInBytes / 1024 / 1024;
      return fileSizeInMB > 25;
    }
    return false;
  }

  mostrarErrorExtensionArchivo() {
    Swal.fire(
      'Error',
      'El archivo seleccionado no tiene una extensión permitida. Por favor, elija un archivo con una de las siguientes extensiones: .pdf, .doc, .jpg, .jpeg, .png, .zip, .rar',
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
      'El archivo es mayor a 25 MB, comprímelo para ser enviado correctamente',
      'warning'
    );
  }

  mostrarErrorCaptcha() {
    Swal.fire('Error', 'Por favor, resuelve el reCAPTCHA', 'error');
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
    if (this.archivoSeleccionado) {
      formData.append(
        'archivo',
        this.archivoSeleccionado,
        this.archivoSeleccionado.name
      );
    }

    try {
      const recaptchaResponse: any = await this.reCaptchaService
        .sendToken(token)
        .toPromise();

      if (recaptchaResponse && recaptchaResponse.success) {
        await this._MessageService.sendMessage(formData).toPromise();
        this.mostrarMensajeExito();
        this.limpiar();
      } else {
        this.mostrarErrorCaptcha();
      }
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    }
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
      archivo: [null],
      recaptchaReactive: ['', Validators.required],
    });
  }

  onFileSelected(event: any) {
    this.archivoSeleccionado = event.target.files[0];
  }

  get tipoDocumentoNoValido() {
    return this.form.get('tipo_documento')?.invalid && this.form.get('tipo_documento')?.touched;
  }

  get numeroNoValido() {
    return this.form.get('numero')?.invalid && this.form.get('numero')?.touched;
  }

  get nombreNoValido() {
    return this.form.get('nombre')?.invalid && this.form.get('nombre')?.touched;
  }

  get apellidoNoValido() {
    return this.form.get('apellido')?.invalid && this.form.get('apellido')?.touched;
  }

  get correoNoValido() {
    return this.form.get('correo')?.invalid && this.form.get('correo')?.touched;
  }

  get telefonoNoValido() {
    return this.form.get('telefono')?.invalid && this.form.get('telefono')?.touched;
  }

  get descripcionNoValido() {
    return  this.form.get('descripcion')?.invalid && this.form.get('descripcion')?.touched;
  }

  async limpiar() {
    await this.form.reset();
  }
}
