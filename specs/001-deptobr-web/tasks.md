# Tareas — Spec 001 DeptoBR (v6)

Marcar `[x]` al terminar. Una fase se cierra con su checklist + commit.

## FASE 1 — Visual + compra en pantalla
### Base
- [x] T01 git init, `.gitignore` y `.vercelignore` (excluir `referencias/`, `diseno/`, `specs/`, `.specify/`), estructura del plan.
- [x] T02 Optimizar a WebP (máx. 1200 px) las imágenes de `diseno/mapa-imagenes.md` → `/img/` con nombres legibles; recortar y comprimir los 2 videos → `/video/` con posters.
- [x] T03 `styles.css`: variables de paleta, tipografías, botones (principal, secundario, sobre foto), etiquetas, keyframes del boceto.
- [x] T04 Datos: `productos.json`, `servicios.json`, `cursos.json`, `look.json`, `config.json` con el contenido del boceto (precios y fechas como placeholders visibles).

### Secciones (igual al boceto)
- [x] T05 Barra de aviso + portada con video, MENÚ, carrito-llave, título, botones y wordmark "depto".
- [x] T06 Sumario 01–05 con links a cada sección.
- [x] T07 "Brillá sin pedir permiso": Pieza de la semana + carrusel de lo nuevo.
- [x] T08 "Robale el look" con etiquetas que abren la ficha.
- [x] T09 "Mirá la vida con otro filtro" (lentes) + "Ver toda la tienda".
- [x] T10 "La carta" del Beauty Room + "Hecho en el depto" + botón.
- [x] T11 "Pasá, estás en tu casa" + fotos del espacio.
- [x] T12 Capacitaciones con video, tarjetas con foto, barra de cupos y WhatsApp.
- [x] T13 "Tocá timbre en el 319" + pie con legales y wordmark.

### Interacciones
- [x] T14 Ficha de producto (bottom sheet) con cantidad y "Agregar al carrito".
- [x] T15 "+" rápido, aviso "Agregado a tu carrito", llave que se balancea, contador.
- [x] T16 Carrito (panel) con cantidades, eliminar, total, persistencia; "Pagar" = Próximamente + `iniciarPago(carrito)` vacía.
- [x] T17 Barra fija inferior contextual (carrito / Reservar turno).
- [x] T18 Ficha de servicio con antes/después en Cejas, turno Mañana/Tarde/Sábado y mensaje de WhatsApp.
- [x] T19 Efectos: pantalla de carga "la llave del depto" (1 vez por sesión), destello en joyas, pulso, scroll suave, reduced-motion.

### Cierre F1
- [x] T20 Versión escritorio (≥ 1024 px) coherente con el boceto. Portada en grilla 50/50 (texto + wordmark a la izquierda, video a alto completo a la derecha).
- [x] T21 SEO + Open Graph.
- [ ] T22 Revisión 375/390/768/1280, celular real, Lighthouse, accesibilidad. _(Hecho: 375/390/768/1280 sin scroll horizontal, Lighthouse móvil 83–95 / acces. 96 / buenas prácticas 100 / SEO 100, teclado y reduced-motion. **Falta: prueba en celular real.**)_
- [x] T23 Commit "Fase 1: DeptoBR v4 visual + compra en pantalla" + resumen y pendientes.

### Cambio a v5 (identidad nueva, 2026-11-06)
- [x] T23b Logo real (SVG) en portada, pie, carga, tienda, carta, aviso, carrito y favicon; Poppins en todo; paleta crema/chocolate/dorado/maíz sin oliva; pantalla de carga v5; sección Gift card; foto nueva del espacio; WhatsApp real.

## FASE 2 — Venta real
- [ ] T24 Supabase (`stock`, `pedidos`) · T25 `/api/stock` y "Agotado" real · T26 Checkout (entrega + datos) · T27 `/api/crear-pago` · T28 `/api/webhook-mp` · T29 Mails · T30 Página de resultado del pago · T31 Pruebas con credenciales de prueba.

## FASE 3 — Contenido final
- [ ] T32 Script de carga desde carpeta · T33 Precios, horarios, cursos, historia · T34 Legales y políticas.

## FASE 4 — Lanzamiento
- [ ] T35 Dominio + MP producción + compra real · T36 Entrega.

### Cambio a v6 (estilo Posh, 2026-11-11)
- [x] T24 Rediseño completo según `boceto-v6`: fondo blanco, Poppins, botones rectos; barra de aviso, header fijo con menú, búsqueda y bolsa; hero con foto; banners de categorías; Destacados con COMPRAR y VER TODOS; Beauty Room; Capacitaciones; El depto; pie crema; WhatsApp flotante. Fotos nuevas de la clienta en WebP. Se quitan Sumario, Robale el look (`look.json`), carruseles, destello y pulso.
