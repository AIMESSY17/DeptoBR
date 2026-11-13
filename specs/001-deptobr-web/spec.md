# Spec 001 — Web DeptoBR · "Estilo Posh" (v6)

**Estado:** Aprobada para construir · **Versión:** 4.1 · **Fecha:** 2026-11-12 (v6 aprobada: dorado solo en el logo y limpieza de imágenes de la v5; antes, 2026-11-11, rediseño completo estilo poshjoyas.com.ar)
**Equipo:** Javier (desarrollo) · Papadog (cliente/comercial)
**Clienta:** DeptoBR — beauty room (manicuría, cejas, pedicuría) + dbrjoyas (joyas, relojes) + lentes. IG @deptobr. Av. José Ingenieros 1205, Edificio Jerárquicos, Dpto 319.

> QUÉ hace el sitio y POR QUÉ. El CÓMO está en `plan.md`.
> **La referencia visual obligatoria es el boceto v6 en `diseno/`**: `boceto-v6-pagina.dc.html` = toda la página; `boceto-v6-interacciones.dc.html` = header, ficha, carrito, reserva y pantalla de carga. La v4 y la v5 quedan descartadas.
> `[A CONFIRMAR]` = dato pendiente de la clienta.

---

## 1. Problema
Hoy vende en Tiendanube con plantilla genérica. La dueña tiene un bebé y está con su tesis: no tiene tiempo de mantener nada. Necesita una web propia, simple y prolija, que **venda sola** (pago online) y que el equipo actualice cada 2–3 meses.

## 2. Objetivos
- O1. Que se vea simple y elegante como poshjoyas.com.ar: fondo blanco, fotos grandes, nada recargado.
- O2. Comprar un producto en **1 toque** (COMPRAR) o 2 desde la ficha (foto → "Agregar al carrito").
- O3. Reservar un turno en menos de 1 minuto, con el mensaje de WhatsApp ya armado.
- O4. Nunca vender algo sin stock (Fase 2).
- O5. La dueña recibe aviso de cada venta sin entrar a ningún panel (Fase 2).

## 3. Fuera de alcance
Panel admin para la clienta · login de compradoras · calendario de turnos propio · blog · páginas de categoría separadas (los banners filtran la grilla de la misma página).

## 4. Identidad (cerrada, no reinterpretar)
- **Estilo:** el de poshjoyas.com.ar. Fondo blanco, fotos muy grandes, títulos de sección chicos (16 px, 400) y centrados, textos chicos, etiquetas en mayúsculas espaciadas.
- **Logo:** el real de la marca, vectorizado en `diseno/logos/` y publicado en `img/logos/`. Se usa `logo-completo.svg` en el header (34 px de alto; 44 px en escritorio), el pie (150 px), el menú y la pantalla de carga; `llave-oro.svg` en la pantalla de carga y el favicon. Nunca se redibuja ni se escribe con una tipografía.
- **Paleta:** blanco `#FFFFFF` (fondo) · chocolate `#4A2A1E` (texto, botones, etiquetas sobre foto) · líneas `#E9DFCF` · crema `#F3EBDD` solo en la barra de aviso, el pie y la pantalla de carga · dorado del logo `#E0BD6C` **solo en el logo** (la etiqueta chica y los tildes de las fichas van en chocolate) · grises cálidos `#7A6355` / `#5E4A3E` para textos secundarios · verde WhatsApp `#25D366` solo en el botón flotante.
- **Tipografía:** solo *Poppins* (Google Fonts 300/400/500/600).
- **Botones:** rectangulares, **sin redondeo**. Principal = chocolate lleno con texto blanco ("COMPRAR", "RESERVAR", "Agregar al carrito", "Reservar por WhatsApp"). Secundario = borde chocolate 1 px ("VER TODOS LOS PRODUCTOS", "CONSULTAR", "CÓMO LLEGAR").
- **Fotos:** las reales de la clienta, nítidas, sin filtros. Nunca con marca de agua de otras tiendas. WebP (máx. 1600 px de ancho, calidad 80) con versión `-480` para celular; lazy-load salvo el hero. En `img/` y `video/` solo hay archivos que la página usa; los originales quedan en `referencias/` (no se versiona) y los logos fuente, en `diseno/logos/`.

### Descartado (no volver a proponer)
**(de la v5)** dorado `#8A6414` en textos · estética "revista boutique" · títulos gigantes con onda · sumario tipográfico · "Robale el look" · carruseles horizontales · Pieza de la semana · secciones con fondo de color (maíz, blush, arena, chocolate) · destello sobre las joyas · pulso de los "+" · "+" rápido sobre la foto · carrito-llave flotante · barra "Reservar turno" en el Beauty Room · botones pill · video en la portada.
**(anteriores)** fondo oscuro y transición noche→día · grano de película · fotos borrosas · ventana/arco recortando el video · loader con puerta · scrapbook, sellos, cinta · scroll horizontal fijado · páginas que se apilan · caligrafía que se dibuja · luz que sigue el cursor · verde oliva · filete de cromo · Instrument Serif, Fraunces, Manrope · wordmark "depto" escrito con tipografía.

## 5. Efectos (solo estos)
- **Sin pantalla de carga:** la página arranca directo en el hero.
- **Carrusel en El depto** (ver sección 8).
- **Respuesta al comprar:** la bolsa del header se balancea, sube el contador y aparece "Agregado a tu carrito" (2 s).
- Scroll suave y paneles que entran deslizando. Nada más.

## 6. Secciones (en este orden, mobile first)
1. **Barra de aviso crema** (30 px): "RETIRO EN EL DPTO 319 – ENVÍOS A COORDINAR – TURNOS POR WHATSAPP".
2. **Header fijo blanco** (57 px, línea abajo): menú + lupa a la izquierda, logo centrado, bolsa del carrito con contador a la derecha. El menú abre un panel desde la izquierda (Joyas, Lentes, Todos los productos, Beauty Room, Gift card, Capacitaciones, El depto, WhatsApp, Instagram). La lupa abre la búsqueda (productos y servicios, sin importar tildes).
3. **Hero** a ancho completo (560 px en celular; 85vh en escritorio) con la foto `joyas-manos-blazer` (manos con joyas y blazer). Velo negro al 12 %. Texto blanco chico al centro: "**TU RATITO,** TU ESTILO" (20 px, espaciado 0.18em) y "TU LUGAR" (10 px, 600). Abajo a la izquierda, con línea vertical blanca: "TURNOS POR WHATSAPP / RETIRO EN EL DPTO 319" y "**BEAUTY ROOM** · JOYAS / LENTES · CURSOS".
4. **Banners de categorías** a ancho completo: foto de 470 px de alto + fila "NOMBRE →" de 56 px con línea abajo. JOYAS (`aros-crochet`) y LENTES (`lentes-modelo`, encuadre centrado en los lentes) filtran la grilla de productos; MANICURÍA (`unas-french-amarillo`), PEDICURÍA (`pedicura-violeta`) y CEJAS (`cejas-diseno-calido`, ya con filtro cálido; WebP q82, versiones -480 y -1600) llevan al Beauty Room; GIFT CARD (`giftcard`) abre su ficha. Salen de `categorias` en `data/config.json`.
5. **Destacados:** grilla de 2 columnas (3 en tablet, 4 en escritorio): foto, etiqueta (NUEVO / ÚLTIMAS N / AGOTADO), nombre, precio en 600, "Retiro en el depto o envío a coordinar" y botón **COMPRAR** (suma 1 al carrito). Tocar la foto abre la ficha. Debajo, **VER TODOS LOS PRODUCTOS** (muestra el catálogo completo en la misma grilla). El título cambia a "Joyas", "Lentes" o "Todos los productos" según el filtro.
6. **Beauty Room:** foto grande fija (`unas-french-amarillo`, sin carrusel) + "Manicuría, cejas y pedicuría · Turnos por WhatsApp" + lista de servicios agrupada (miniatura de 64 px, nombre, grupo · duración, precio y botón **RESERVAR**) + frase "Aprovechá y armá tu combo" (Poppins 300, centrada). Precios con punto de miles ($39.000). Lista real, en este orden: MANICURÍA: Manicuría + Capping · 1h30' · $39.000; Extensión soft gel · 2h a 2h30' · $48.000. CEJAS: Perfilado de cejas · 30' · $22.000; Laminado · 1h · $38.000; Henna y perfilado · 1h · $35.000. PEDICURÍA: Pedicuría con semi · 1h 20' · $43.000; Pedicuría sin semi · 1h · $30.000. Fotos: manicuría `unas-french-amarillo`, cejas `cejas-diseno-calido`, pedicuría `pedicura-violeta`. Justo arriba del grupo CEJAS va el bloque **"Cejas en el depto"**: dos videos 4:5 (`cejas-mapeo`, `cejas-henna`, en `video/` con poster WebP) en grid de 2 columnas, gap 8 px, ancho máx. 720 px centrado, y el texto "Diseño con hilo y henna, a medida de tu rostro."; autoplay muted loop, play/pause con IntersectionObserver, solo posters con reduced-motion.
7. **Capacitaciones:** video de cursos a ancho completo (470 px; 70vh en escritorio) + "Cursos presenciales en el Dpto 319 · Cupos limitados" + lista: fecha (día y mes), nombre, "Quedan N lugares" y **CONSULTAR** → WhatsApp con el nombre del curso.
8. **El depto:** carrusel en lugar de la foto grande (mismo alto: 470 px en celular), con `beauty-room-trabajando` (primera), `camilla-cejas` y `espacio-sabado`; las fotos salen de `deptoCarrusel` en `data/config.json` (`[{ "img", "img480", "alt" }]`, sumar una foto = agregar un ítem). Deslizable con el dedo (scroll-snap), flechas finas en escritorio, puntitos abajo, autoplay cada 5 s que se pausa al tocar; WebP, lazy-load salvo el primer slide. "Un depto de verdad en Av. José Ingenieros 1205, Edificio Jerárquicos, Dpto 319. Baby & pet friendly.", horarios `[A CONFIRMAR]` · retiro · envíos y **CÓMO LLEGAR** (Google Maps).
9. **Pie crema:** logo, Instagram, Cambios y devoluciones, Preguntas frecuentes, **Botón de arrepentimiento**, "Copyright DeptoBR - [CUIT] - 2026. Todos los derechos reservados." y "Defensa de las y los consumidores. Para reclamos **ingresá acá**."
10. **Botón flotante de WhatsApp** verde (5492974058183), abajo a la derecha; sube cuando aparece la barra del carrito.

### Escritorio (≥ 1024 px)
Misma estética. Header de 72 px. Hero a ancho completo (85vh). Banners en grilla de 3 columnas × 2 filas (fotos cuadradas). Destacados en 4 columnas. Beauty Room y El depto en dos columnas: foto a la izquierda, contenido a la derecha. Los paneles (ficha, carrito, búsqueda) salen desde la derecha a alto completo; el menú, desde la izquierda.

## 7. Historias y criterios de aceptación

### H1 — Comprar un producto
- CA1.1 COMPRAR suma 1 unidad sin abrir nada.
- CA1.2 Tocar la foto abre la **ficha** (panel desde abajo en celular, desde la derecha en escritorio): foto grande, categoría, nombre, precio, descripción, "Retiro en el Dpto 319 o envío a coordinar", cantidad y **"Agregar al carrito"**. Debajo, "Consultar por WhatsApp" y **"También te puede gustar"** (4 productos, primero de la misma categoría). Se cierra con ×, Esc o tocando afuera.
- CA1.3 Al agregar: aviso "Agregado a tu carrito" (2 s), la bolsa se balancea y el contador sube.
- CA1.4 Con al menos un producto aparece abajo la barra **"Ver carrito (N) · $total →"** (oculta con un panel abierto) y el botón de WhatsApp sube.
- CA1.5 Precios en formato argentino (`$15.000`). Sin stock: "Agotado" y no se puede agregar.
- CA1.6 Gift card: la ficha deja elegir entre los 3 montos: $40.000, $50.000 y $80.000.

### H2 — Carrito y pago
- CA2.1 El carrito lista productos con foto, cantidad (+/−), eliminar y total; persiste al recargar.
- CA2.2 "Pedir por WhatsApp" manda el pedido armado.
- CA2.3 Fase 1: "Pagar" muestra "Próximamente". Fase 2: Mercado Pago Checkout Pro, entrega (retiro / envío `[A CONFIRMAR]`) y datos de contacto; precio y stock validados en el servidor.

### H3 — Reservar un servicio
- CA3.1 RESERVAR abre la ficha del servicio: foto, nombre, duración, precio, **Mañana / Tarde / Sábado**, botón "Reservar por WhatsApp" y la vista previa: "Hola! Quiero reservar *Servicio* (*duración*, *$precio*), me queda mejor *turno*."

### H4 — Capacitaciones
- CA4.1 Cada curso muestra fecha, nombre, cupos y CONSULTAR → WhatsApp con el nombre del curso.

### H5 — Encontrar
- CA5.1 El menú lleva a cada sección; JOYAS y LENTES filtran la grilla.
- CA5.2 La búsqueda encuentra productos y servicios por nombre, categoría o descripción.

### H6 — Stock y avisos (Fase 2)
- CA6.1 Pago aprobado → se descuenta stock; en 0 pasa a "Agotado" solo.
- CA6.2 La dueña recibe un mail con el pedido completo; la compradora, su confirmación.

### H7 — Carga de stock (Fase 3)
- CA7.1 Carpeta `Categoria/Nombre - $precio - Nu/` con fotos → se genera el catálogo sin escribir datos a mano.

## 8. No funcionales
- Mobile first (375, 390, 768, 1280 px), sin scroll horizontal de página.
- Rápida en 4G: WebP con `srcset` y lazy-load (salvo el hero, que se precarga); video sin audio, con `poster`, que solo se reproduce en pantalla.
- Accesible: contraste, botones reales con etiqueta, teclado (foco atrapado en los paneles, Esc cierra), `prefers-reduced-motion`.
- SEO y Open Graph.
- Credenciales solo en variables de entorno. Infraestructura gratuita.

## 9. Fases
| Fase | Alcance |
|---|---|
| **F1 · Visual + compra en pantalla** | Todo el sitio igual al boceto v6, con productos reales, ficha, carrito y reserva por WhatsApp funcionando. Pago = "Próximamente". |
| **F2 · Venta real** | Mercado Pago, stock automático (Supabase), mails. |
| **F3 · Contenido final** | Precios, horarios, cursos, legales, carga completa del catálogo. |
| **F4 · Lanzamiento** | Dominio, pruebas con pago real, entrega. |

## 10. Pendientes de la clienta
Precios de productos · horarios · fechas y cupos de cursos · envíos · Mercado Pago · CUIT · políticas de cambio y preguntas frecuentes · dominio · una foto de uñas más grande (la actual tiene 685 px y en escritorio se ve blanda).
