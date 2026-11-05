# Plan técnico — Spec 001 DeptoBR (v4)

## Stack
- HTML + CSS + JS puro, sin frameworks ni build. Google Fonts: Instrument Serif (ital), Fraunces 700, Manrope 400–800.
- Hosting: Vercel (gratis), deploy desde GitHub.
- Fase 2: funciones serverless `/api/*` (Node) + Mercado Pago Checkout Pro + Supabase (stock y pedidos) + Resend (mails).

## Cómo usar el boceto
- `diseno/boceto-v4-pagina.dc.html` es la página completa: **copiar textos, orden, medidas, colores, radios y tipografías tal cual**. Está escrito en un formato de diseño (`<x-dc>`, `{{ }}`, `<sc-for>`): NO se publica ni se copia el formato; se traduce a HTML/CSS/JS normal.
- `diseno/boceto-v4-interacciones.dc.html` define ficha (bottom sheet), aviso, barra de carrito, efectos y sus `@keyframes` (salir, verse, irse, trazar, entraK, mueveK, giraK, textoK, brillo, pulso, colgar, sube, aparece): reutilizarlos.
- `diseno/mapa-imagenes.md` traduce cada `/_blob/<id>` al archivo real de `referencias/`.
- El boceto mide 390 px de ancho. En pantallas grandes: contenedor central y grillas que se abren (carruseles → grillas de 3–4 columnas, portada con texto a la izquierda), manteniendo la misma estética.

## Estructura
```
/index.html
/css/styles.css          variables (paleta), tipografías, componentes, secciones, keyframes
/js/app.js               carga de datos, render de secciones, ficha, carrito, barra fija, efectos
/js/carrito.js           estado del carrito + localStorage (try/catch, fallback en memoria)
/data/productos.json     { id, nombre, cat, precio, stock, desc, fotos[], badge, destacado }
/data/servicios.json     { id, nombre, dur, precio, img, incluye[], top, antesDespues? }
/data/cursos.json        { id, nombre, fecha, modalidad, cupos, cuposTotales, img }
/data/look.json          puntos de "Robale el look": { productoId, etiqueta, top, left }
/data/config.json        whatsapp, instagram, dirección, horarios, textos legales
/img/                    WebP optimizadas (máx. 1200 px)
/video/                  portada.mp4, cursos.mp4 (sin audio, ≤ 2 MB) + posters
/referencias/ y /diseno/ NO se publican (.vercelignore)
/api/                    (Fase 2)
```

## Componentes clave
- **Ficha (bottom sheet):** un único componente para producto y servicio; overlay oscuro 50 %; panel blanco con radio 22 px arriba; animación `sube`; foco atrapado dentro y Esc cierra.
- **Carrusel:** `overflow-x: auto` + `scroll-snap`, tarjetas de 250–300 px, sin barra visible.
- **Barra fija inferior:** visible si hay ítems o si el usuario está en Beauty Room (IntersectionObserver sobre la sección); oculta con ficha abierta.
- **WhatsApp:** `https://wa.me/{numero}?text={encodeURIComponent(mensaje)}`.
- **Precios:** `Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })`.
- **Pantalla de carga:** `#cargador` fijo sobre la página (`pointer-events: none`, la página se arma debajo), SVG de 390×844 centrado sin escalar. `sessionStorage` (`dbr-carga`, try/catch) pone `.ya-cargo` en `<html>` antes de pintar para verla una vez por sesión; `app.js` la saca del DOM al terminar `salir` (respaldo a los 4 s) o enseguida con reduced-motion.

## Fase 2 (sin cambios respecto de la versión anterior)
`/api/crear-pago` valida precios y stock en servidor y crea la preferencia; `/api/webhook-mp` es idempotente, descuenta stock y manda mails. Variables: `MP_ACCESS_TOKEN`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `RESEND_API_KEY`, `MAIL_DUENA`.

## Pruebas
375 / 390 / 768 / 1280 px, celular real, Lighthouse móvil ≥ 85, flujo completo: agregar desde "+", desde ficha y desde "Robale el look"; reservar cada servicio y ver el texto de WhatsApp.
