# Trabajo práctico 04

## Descripción
Aplicación web para consultar mascotas en adopción y registrar nuevos ingresos de forma temporal. Utiliza Express y EJS para renderizar HTML en el servidor.

## Instalación
1. Clonar el repositorio.
2. Ejecutar **npm install** para instalar dependencias (express, ejs, express-ejs-layouts).

## Ejecución
Ejecutar **npm start**. El servidor levantará en http://localhost:3000.

## Páginas y rutas
- `GET /`: Muestra la página de inicio.
- `GET /mascotas`: Muestra el catálogo completo.
- `GET /mascotas/nueva`: Renderiza el formulario para añadir registros.
- `GET /mascotas/:id`: Renderiza el detalle de una mascota.
- `POST /mascotas`: Procesa el formulario, realiza validaciones y redirige.

## Estructura de vistas
- **Layout:** Mantiene la estructura HTML general compartida de la aplicación, como la cabecera del documento y los enlaces globales (CSS y JS).
- **Vista:** Contiene el HTML específico de una ruta particular (ej. el formulario de altas o la grilla). El servidor pasa datos a las vistas utilizando `res.render`, que toma las variables y las combina con la plantilla para producir HTML final.
- **Parcial:** Un fragmento reutilizable que se incluye dentro del layout o vistas, ideal para la navegación (`encabezado.ejs`) y el `pie.ejs`.

## Recursos estáticos
El middleware `express.static` toma un directorio (como `public/`) y lo establece como raíz pública. De esta forma, archivos físicos como `public/css/estilos.css` son accesibles en el navegador directamente mediante la URL `/css/estilos.css`, ocultando el directorio "public".

## Formulario
Para interpretar el cuerpo del formulario HTML enviado mediante POST, se utiliza `express.urlencoded`. Esto permite convertir los pares nombre-valor que envía el navegador en un objeto accesible en `req.body`.
Cuando los datos enviados en `POST /mascotas` son válidos, se registran y la ruta responde con una redirección HTTP 302 hacia `/mascotas`. El navegador entonces ejecuta una nueva petición `GET /mascotas`. Esto evita que al recargar la página el usuario reenvíe accidentalmente el mismo formulario.

## Persistencia de los datos
La aplicación lee inicialmente de un archivo JSON, pero guarda los nuevos ingresos en un arreglo en memoria. El motivo por el cual un nuevo registro desaparece al reiniciar la aplicación es porque no se está escribiendo de vuelta el archivo JSON, perdiéndose el estado actual del arreglo local al finalizar el proceso de Node.js.