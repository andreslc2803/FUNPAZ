import { Component, ViewChild } from '@angular/core';
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
  // Accede a la siteKey desde la configuración de Angular
  protected siteKey = AppConfig.reCaptchaSiteKey;

  // Usa @ViewChild para obtener una referencia al componente reCAPTCHA
  @ViewChild('reCaptcha') reCaptcha: any;

  title = 'AppComponent';

  // Variable para crear y gestionar el formulario (comunica el HTML con el TS)
  form!: FormGroup;

  // Variable que almacena el archivo adjunto
  archivoSeleccionado: File | null = null;

  // Variable para almacenar la respuesta del reCAPTCHA resuelto por el usuario
  captchaResponse: string | null = null;

  constructor(
    public _MessageService: MessagePqrsService,
    private fb: FormBuilder
  ) {
    this.crearFormulario();
  }

  // Método principal para enviar el formulario
  enviar = async () => {
    if (this.form.invalid) {
      // Si el formulario es inválido, marca los campos como tocados y detiene el envío
      this.marcarCamposInvalidos();
      return;
    }

    if (!this.isCaptchaValid()) {
      // Verifica si el reCAPTCHA no se ha resuelto y muestra un mensaje de error
      this.mostrarErrorCaptcha();
      return;
    }

    if (this.archivoSeleccionado) {
      // Si se ha seleccionado un archivo, verifica la extensión y el tamaño
      const fileExtension = this.obtenerExtensionArchivo();
      if (!this.esExtensionPermitida(fileExtension)) {
        // Muestra un mensaje de error si la extensión del archivo no es válida
        this.mostrarErrorExtensionArchivo();
        return;
      }

      if (this.tamanoArchivoExcedeLimite()) {
        // Muestra un mensaje de advertencia si el tamaño del archivo excede el límite
        this.mostrarErrorTamanoArchivo();
        return;
      }
    }
    // Envía el mensaje si todo es válido
    await this.enviarMensaje();
  };

  // Marca todos los campos del formulario como tocados
  marcarCamposInvalidos() {
    Object.values(this.form.controls).forEach((control) => {
      control.markAllAsTouched();
    });
  }

  // Muestra un mensaje de error para indicar que se debe resolver el reCAPTCHA
  mostrarErrorCaptcha() {
    Swal.fire('Error', 'Por favor, resuelve el reCAPTCHA', 'error');
  }

  // Obtiene y normaliza la extensión del archivo seleccionado
  obtenerExtensionArchivo() {
    return (
      this.archivoSeleccionado?.name.split('.').pop() || ''
    ).toLowerCase();
  }

  // Verifica si la extensión del archivo es válida
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

  // Verifica si el tamaño del archivo excede el límite
  tamanoArchivoExcedeLimite() {
    if (this.archivoSeleccionado) {
      const fileSizeInBytes = this.archivoSeleccionado.size;
      const fileSizeInMB = fileSizeInBytes / 1024 / 1024;
      return fileSizeInMB > 8;
    }
    return false; // Si archivoSeleccionado es nulo, se asume que el tamaño no excede el límite
  }

  // Muestra un mensaje de error para archivos con extensiones no permitidas
  mostrarErrorExtensionArchivo() {
    Swal.fire(
      'Error',
      'El archivo seleccionado no tiene una extensión permitida. Por favor, elija un archivo con una de las siguientes extensiones: .pdf, .doc, .jpg, .jpeg, .png, .zip, .rar',
      'error'
    );
  }

  // Muestra un mensaje de advertencia para archivos que exceden el límite de tamaño
  mostrarErrorTamanoArchivo() {
    Swal.fire(
      'Advertencia',
      'El archivo es mayor a 8 MB, comprímelo para ser enviado correctamente',
      'warning'
    );
  }

  // Envía el mensaje con los datos del formulario y muestra un mensaje de éxito
  async enviarMensaje() {
    const formData = new FormData();
    formData.append('tipo_pqrs', this.form.get('tipo_pqrs')?.value);
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
      await this._MessageService.sendMessage(formData).toPromise();
      this.mostrarMensajeExito();
      this.limpiar();
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    }
  }

  // Muestra un mensaje de éxito después de enviar el formulario
  mostrarMensajeExito() {
    Swal.fire(
      'Formulario de contacto',
      'Mensaje enviado correctamente',
      'success'
    );
  }

  //Verifica si se cumplio con exito la validacion del reCaptcha
  public resolved(captchaResponse: string): void {
    this.captchaResponse = captchaResponse;
  }

  //Verificar si NO se cumplio con exito la validacion del reCaptcha
  public onError(errorDetails: RecaptchaErrorParameters): void {
    console.log(`reCAPTCHA error encountered`);
  }

  isCaptchaValid() {
    return this.captchaResponse !== null;
  }

  /**
   * Crea un formulario que tiene varios campos y define las reglas de validación para cada uno de estos campos
   */
  crearFormulario() {
    this.form = this.fb.group({
      tipo_pqrs: ['', Validators.required],
      tipo_documento: [''],
      numero: ['',  Validators.minLength(8)],
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
        [
          Validators.pattern('^[0-9]{10}$'), // Asegura que sean 10 dígitos numéricos
          Validators.maxLength(10), // Limita la longitud a 10 caracteres
        ],
      ],
      descripcion: ['', Validators.required],
      archivo: [null],
    });
  }

  onFileSelected(event: any) {
    this.archivoSeleccionado = event.target.files[0];
  }

  /**
   * Metodos que se utilizan para verificar si los campos del formulario son válidos o no y si han sido "touched".
   */
  get tipoPqrsNoValido() {
    return (
      this.form.get('tipo_pqrs')?.invalid &&
      this.form.get('tipo_pqrs')?.touched
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

  /**
   * Reiniciar el contenido del form, consola y el reCAPTCHA después de enviar el formulario
   */
  limpiar() {
    this.form.reset();
    // Comprobar si this.reCaptcha está definido antes de intentar resetearlo
    if (this.reCaptcha) {
      this.reCaptcha.reset();
    }
  }
}
