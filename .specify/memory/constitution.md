# Constitución del proyecto — DeptoBR Web

Principios que NO se negocian. Si algo los contradice, se frena y se consulta.

## I. El boceto v5 manda
La referencia visual es `diseno/boceto-v5-pagina.dc.html` y `diseno/boceto-v5-interacciones.dc.html` (la v4 quedó vieja). Se respetan textos, orden, colores, tipografías, medidas y efectos. Nada de "mejoras" de diseño por cuenta propia; si algo no se puede, se avisa.

## I bis. La identidad es la de la marca real
- **Logo:** siempre los SVG reales de `img/logos/` (copiados de `diseno/logos/`). Nunca redibujar el logo ni la llave, ni escribir "depto" con una tipografía.
- **Tipografía:** solo Poppins (300/400/500/600). Títulos en 300 con la parte destacada en 500, sin itálica.
- **Colores:** crema `#F3EBDD`, chocolate `#4A2A1E`, dorado del logo `#E0BD6C`, maíz `#E2C35A`, arena `#E9DFCF`, blush `#F1DFD8`, dorado texto `#8A6414`. Sin verde oliva.

## II. Fotos nítidas y protagonistas
Las fotos y videos reales de la clienta son lo más importante. Sin grano, desenfoque ni filtros encima. Grandes, nunca amontonadas.

## III. Comprar tiene que ser obvio
Un solo estilo de botón principal. Producto → ficha → "Agregar al carrito". Carrito siempre a un toque.

## IV. Mobile first y fluidez
Se diseña a 390 px y se escala. Si un efecto traba en un celular medio, se simplifica. Animaciones solo con transform/opacity. `prefers-reduced-motion` siempre.

## V. Contenido separado del código
Productos, precios, stock, servicios, cursos y contacto viven en `/data/*.json`. Sumar stock nunca requiere tocar HTML, CSS ni lógica.

## VI. La clienta no administra nada
Sin panel admin. El equipo carga el stock. Lo que pueda resolverse solo (stock, avisos de venta), se resuelve solo.

## VII. Secretos fuera del repo
Credenciales solo en variables de entorno del hosting. Nunca en el código ni en GitHub.

## VIII. Costo cero y fases cerradas
Infraestructura gratuita. Una fase por vez, cerrada con checklist, probada en celular y con commit propio.
