# CEMATIZ Web

Sitio corporativo estatico de CEMATIZ creado con HTML, CSS y JavaScript puro.

## Como verlo con Live Server

1. Abre esta carpeta en VS Code.
2. Haz clic derecho sobre `index.html`.
3. Selecciona **Open with Live Server**.

Tambien puedes abrir `index.html` directamente en el navegador. Las fuentes Montserrat y Poppins se cargan desde Google Fonts; si no hay conexion, el navegador usara el fallback `sans-serif`.

## Estructura

```text
.
|-- index.html
|-- assets/
|   |-- css/
|   |   `-- styles.css
|   |-- img/
|   |   `-- imagenes y logotipos del proyecto
|   `-- js/
|       `-- main.js
`-- README.md
```

## Edicion rapida

- Colores: variables `--color-orange`, `--color-gray`, `--color-black`, `--color-white`, `--color-light`, `--color-muted` y `--color-dark` en `assets/css/styles.css`.
- Tipografias: variables `--font-primary` y `--font-secondary` en `assets/css/styles.css`, y enlaces de Google Fonts en `index.html`.
- Logo: enlaces dentro de `.brand img` y `.footer-brand img` en `index.html`.
- Imagen hero: `.hero-media img` en `index.html`.
- Imagenes de proyectos: cada `.project-card img` en `index.html`.
- Filtros de proyectos: botones `data-filter` y tarjetas `data-category`.
- Textos principales: secciones `#inicio`, `#acerca`, `#servicios`, `#proyectos`, `#seguridad`, `#crm` y `#contacto` en `index.html`.

## Funcionalidad

- Menu responsive.
- Animaciones suaves con IntersectionObserver.
- Filtros funcionales en proyectos.
- Formulario de contacto con validacion local.
- Formulario anonimo para Linea de Seguridad con validacion local.
- Fallback visual si alguna imagen no carga.

## Notas

- No usa React, Bootstrap, Tailwind ni frameworks.
- No contiene datos fiscales ni documentos administrativos reales.
- Los botones de WhatsApp, correo, redes y aviso de privacidad son placeholders editables.
