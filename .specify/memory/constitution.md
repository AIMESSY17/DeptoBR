# Constitución del proyecto — DeptoBR Web

Principios que NO se negocian. Si algo los contradice, se frena y se consulta.

## I. El boceto v6 manda
La referencia visual es `diseno/boceto-v6-pagina.dc.html` (toda la página) y `diseno/boceto-v6-interacciones.dc.html` (header, ficha, carrito, reserva y pantalla de carga). La v4 y la v5 quedan descartadas. Se respetan textos, orden, colores, tipografía y medidas. Nada de "mejoras" de diseño por cuenta propia; si algo no se puede, se avisa.

## I bis. Estilo Posh: simple, blanco, fotos grandes
- Inspiración pedida por la clienta: poshjoyas.com.ar. Fondo blanco, fotos muy grandes, textos chicos.
- **Logo:** siempre los SVG reales de `img/logos/` (copiados de `diseno/logos/`). Nunca redibujar el logo ni la llave, ni escribir "depto" con una tipografía.
- **Tipografía:** solo Poppins (300/400/500/600). Títulos de sección chicos (16 px, 400) y centrados. Etiquetas en mayúsculas espaciadas.
- **Colores:** blanco `#FFFFFF` (fondo), chocolate `#4A2A1E` (texto y botones), líneas `#E9DFCF`, crema `#F3EBDD` solo en la barra de aviso, el pie y la pantalla de carga. Dorado del logo `#E0BD6C` solo en el logo.
- **Botones rectos, sin redondeo:** principal chocolate con texto blanco; secundario con borde chocolate.
- **Sin efectos decorativos:** nada de destellos, degradés, grano ni títulos gigantes. El único efecto de marca es la pantalla de carga con la llave del logo.

## II. Fotos nítidas y protagonistas
Las fotos reales de la clienta son lo más importante. Sin filtros encima. Grandes, nunca amontonadas. Nunca fotos con marca de agua de otras tiendas.

## III. Comprar tiene que ser obvio
Un solo estilo de botón principal. COMPRAR suma al carrito en un toque; la foto abre la ficha. Carrito siempre a un toque (bolsa del header).

## IV. Mobile first y fluidez
Se diseña a 390 px y se escala. Animaciones solo con transform/opacity. `prefers-reduced-motion` siempre.

## V. Contenido separado del código
Productos, precios, stock, servicios, cursos, banners y contacto viven en `/data/*.json`. Sumar stock nunca requiere tocar HTML, CSS ni lógica.

## VI. La clienta no administra nada
Sin panel admin. El equipo carga el stock. Lo que pueda resolverse solo (stock, avisos de venta), se resuelve solo.

## VII. Secretos fuera del repo
Credenciales solo en variables de entorno del hosting. Nunca en el código ni en GitHub.

## VIII. Costo cero y fases cerradas
Infraestructura gratuita. Una fase por vez, cerrada con checklist, probada en celular y con commit propio.
