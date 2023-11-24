# Funpaz: Plataforma de Salud Mental

¡Bienvenido al frontend de Funpaz! Funpaz es una plataforma de salud mental desarrollada en Angular, que utiliza reCAPTCHA para garantizar la seguridad. Sigue las instrucciones a continuación para ejecutar el proyecto y obtener las claves de reCAPTCHA necesarias para el frontend.

## Requisitos

Nodejs
Angular v.16.0.0
Cuenta de google

## Ejecutar el Proyecto

Para ejecutar Funpaz localmente, sigue estos pasos:

1. Clona este repositorio:

   ```bash
   git clone https://github.com/andreslc2803/FUNPAZ.git
   ```

2. Ingresa al directorio del proyecto:

   ```bash
   cd frontend-funpaz
   ```

3. Instala las dependencias:

   ```bash
   npm install --force
   ```

4. Inicia la aplicación:

   ```bash
   npm start
   ```

5. Abre tu navegador y visita [http://localhost:4200/](http://localhost:4200/).

¡Ahora deberías tener acceso a la plataforma de salud mental Funpaz localmente!

## Obtener Claves de reCAPTCHA

Para utilizar la funcionalidad de reCAPTCHA en el frontend, necesitarás obtener las claves de API de reCAPTCHA. Sigue estos pasos:

1. Visita el sitio web de [reCAPTCHA](https://www.google.com/recaptcha) de Google.

2. Haz clic en "Administrar reCAPTCHA" y selecciona "Añadir un nuevo sitio".

3. Completa el formulario con la información de Funpaz.

4. Selecciona el tipo de reCAPTCHA que deseas utilizar (por ejemplo, "reCAPTCHA v2").

5. Añade los dominios autorizados para Funpaz (puedes utilizar `localhost:4200` para desarrollo).

6. Acepta los términos de servicio y haz clic en "Enviar".

7. Copia la clave del sitio (Site Key) proporcionadas.

## Configuración de Claves de reCAPTCHA en el Proyecto

1. Abre el archivo de configuración de reCAPTCHA en el proyecto `src/config/config.ts`.

2. Agrega las claves que obtuviste anteriormente:

   ```typescript
   export const AppConfig = {
   reCaptchaSiteKey: '';
   };
   ```

3. Guarda el archivo y reinicia la aplicación si es necesario.

¡Ahora, Funpaz está configurado para utilizar reCAPTCHA en el frontend para garantizar la seguridad!

## Contribución

¡Agradecemos tus contribuciones! Por favor, crea una rama con tus cambios y envía una solicitud de extracción (pull request) para su revisión.