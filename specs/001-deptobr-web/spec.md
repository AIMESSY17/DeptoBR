# Spec 001 — Web DeptoBR · "Revista boutique" (v4)

**Estado:** Aprobada para construir · **Versión:** 2 · **Fecha:** 2026-11-05
**Equipo:** Javier (desarrollo) · Papadog (cliente/comercial)
**Clienta:** DeptoBR — beauty room (uñas, cejas, pedicura) + dbrjoyas (joyas, relojes) + lentes. IG @deptobr. Av. José Ingenieros 1205, Edificio Jerárquicos, Dpto 319.

> QUÉ hace el sitio y POR QUÉ. El CÓMO está en `plan.md`.
> **La referencia visual obligatoria es el boceto aprobado en `diseno/`** (`boceto-v4-pagina.dc.html` = toda la página; `boceto-v4-interacciones.dc.html` = ficha, carrito y efectos). Las imágenes del boceto se identifican con `diseno/mapa-imagenes.md`.
> `[A CONFIRMAR]` = dato pendiente de la clienta.

---

## 1. Problema
Hoy vende en Tiendanube con plantilla genérica. La dueña tiene un bebé y está con su tesis: no tiene tiempo de mantener nada. Necesita una web con identidad propia, que **venda sola** (pago online) y que el equipo actualice cada 2–3 meses.

## 2. Objetivos
- O1. Que se vea como una marca de lujo boutique y no como plantilla.
- O2. Comprar un producto en **2 toques** (tocar → "Agregar al carrito") o 1 toque con el "+" rápido.
- O3. Reservar un turno en menos de 1 minuto, con el mensaje de WhatsApp ya armado.
- O4. Nunca vender algo sin stock (Fase 2).
- O5. La dueña recibe aviso de cada venta sin entrar a ningún panel (Fase 2).

## 3. Fuera de alcance
Panel admin para la clienta · login de compradoras · calendario de turnos propio · blog.

## 4. Identidad (cerrada, no reinterpretar)
- **Logo:** el real de la marca: "depto" en serif bold dorado con **una llave arriba**, y "BEAUTY ROOM" debajo. Submarca de tienda: **dbrjoyas**.
- **Paleta:** marfil `#F7F2EA` (fondo) · chocolate `#22140E` (texto y botón principal) · dorado `#E0B04A` / `#C8972F` (logo, acentos, etiquetas) · dorado oscuro para textos chicos `#9A6E18` · blush `#F1DFD8` (Beauty Room) · blanco `#FFFFFF` (fichas, botones sobre foto).
- **Tipografía:** *Instrument Serif* (títulos, con itálica para la segunda parte de cada frase) · *Fraunces 700* (solo el wordmark "depto") · *Manrope* (UI, precios, textos).
- **Fotos:** las reales de la clienta, **nítidas**. PROHIBIDO grano, desenfoque, viñetas o filtros sobre las fotos.
- **Botones:** un solo sistema. Principal = chocolate lleno, texto blanco, pill (alto 52–56 px). Secundario = borde chocolate 1.5 px. Sobre foto/video: principal blanco, secundario borde blanco.
- **Títulos con onda** (son parte del diseño, no cambiar): ver sección 6.

### Descartado (no volver a proponer)
Fondo oscuro de noche y transición noche→día con scroll · grano de película · fotos borrosas · ventana/arco recortando el video · loader con puerta · scrapbook, sellos, cinta en movimiento · scroll horizontal fijado · páginas que se apilan · caligrafía que se dibuja · luz que sigue el cursor · manifiesto con fotos dentro del texto.

## 5. Efectos aprobados (y solo estos)
- **E1 Prender la luz:** al cargar, la pantalla arranca negra y "titila" como un tubo que se prende (≈1,5 s, una vez por sesión). Respeta `prefers-reduced-motion`.
- **E2 Destello:** un brillo de luz pasa cada tanto sobre las fotos de joyas.
- **E3 Llave que se balancea:** al agregar al carrito, el ícono-llave del carrito se balancea y sube el contador; aparece un aviso "Agregado a tu carrito".
- **E4 Scroll suave.**
- Pulso suave en los "+" de "Robale el look".

## 6. Secciones (en este orden, mobile first)
1. **Barra de aviso:** "Retiro en el Dpto 319 · Envíos a coordinar".
2. **Portada:** video a pantalla completa (manos con anillos al sol). Arriba "MENÚ" y carrito. Abajo: "BEAUTY ROOM · JOYAS · LENTES", título **"Tu ratito, tu estilo, *tu lugar.*"**, botones **Ver la tienda** y **Reservar turno**, y el wordmark "depto" gigante dorado con la llave.
3. **Sumario:** lista tipográfica gigante 01 Joyas · 02 Lentes · 03 Uñas · 04 Cejas · 05 Cursos, cada una con foto redonda; lleva a su sección.
4. **Tienda · "Brillá sin *pedir permiso.*"** (DBRJOYAS · LO NUEVO): Pieza de la semana a ancho completo con nombre, precio y "Agregar"; debajo carrusel horizontal de tarjetas grandes (foto 4:5, etiqueta NUEVO / ÚLTIMAS N, "+" rápido, nombre y precio).
5. **"Robale *el look.*"**: foto de modelo a pantalla completa con etiquetas "+ Aros", "+ Collar", "+ Reloj" sobre cada pieza; cada una abre la ficha del producto.
6. **Lentes · "Mirá la vida *con otro filtro.*"**: carrusel de tarjetas aún más grandes + botón "Ver toda la tienda".
7. **Beauty Room · "La *carta*"**: foto grande de uñas y encima una hoja tipo carta de restaurante: *Servicio ........ $precio*, duración, "Lo más pedido", "Reservar →". Debajo "Hecho en el depto" (3 fotos de trabajos) y botón "Reservar mi turno".
8. **El depto · "Pasá, *estás en tu casa.*"**: foto del bulldog frente al logo a pantalla completa, "Se permiten bebés, perros y charlas largas.", 2 fotos del espacio y la historia `[A CONFIRMAR]`.
9. **Capacitaciones · "Aprendé lo que *hacemos acá.*"**: video a pantalla completa (uñas violetas), etiqueta "CUPOS LIMITADOS", frase, y una tarjeta por curso con foto + fecha, "Presencial · En el Dpto 319", barra de cupos, botón "Quiero mi lugar" (WhatsApp con el curso).
10. **Encontranos · "Tocá timbre *en el 319.*"**: dirección, horarios `[A CONFIRMAR]`, retiros y envíos, botón "Cómo llegar".
11. **Pie chocolate:** links, legales (razón social, CUIT, Defensa del Consumidor, botón de arrepentimiento, cambios y devoluciones) y wordmark "depto" gigante dorado.

## 7. Historias y criterios de aceptación

### H1 — Comprar un producto
- CA1.1 Tocar la foto o el nombre de un producto abre una **ficha que sube desde abajo** con foto grande, categoría, nombre, precio, descripción, "Retiro en el Dpto 319 o envío a coordinar", selector de cantidad y **un botón principal "Agregar al carrito"**. Debajo, link "Consultar por WhatsApp". Se cierra con × o tocando afuera.
- CA1.2 El "+" blanco en la esquina de la foto agrega 1 unidad sin abrir la ficha.
- CA1.3 Al agregar: aviso "Agregado a tu carrito" (2 s), la llave del carrito se balancea, el contador sube.
- CA1.4 Con al menos un producto, aparece abajo fija la barra **"Ver carrito (N) · $total →"** (oculta mientras hay una ficha abierta).
- CA1.5 Precios en formato argentino (`$15.000`). Un producto sin stock muestra "Agotado" y no se puede agregar.

### H2 — Carrito y pago
- CA2.1 El carrito (panel desde abajo) lista productos con foto, cantidad (+/−), eliminar y total; persiste al recargar.
- CA2.2 Fase 1: "Pagar" muestra "Próximamente". Fase 2: Mercado Pago Checkout Pro, entrega (retiro / envío `[A CONFIRMAR]`) y datos de contacto; precio y stock validados en el servidor.

### H3 — Reservar un servicio
- CA3.1 Tocar un servicio de la carta abre su ficha: foto (en Cejas, **antes / después** lado a lado), nombre, duración, precio, qué incluye, elección **Mañana / Tarde / Sábado**, botón "Reservar por WhatsApp" y la vista previa del mensaje: "Hola! Quiero reservar *Servicio* (*duración*), me queda mejor *turno*."
- CA3.2 Mientras el usuario está en el Beauty Room, la barra fija inferior cambia a **"Reservar turno"**.

### H4 — Comprá el look
- CA4.1 Cada etiqueta "+ Pieza" sobre la foto abre la ficha de ese producto (mismo flujo que H1).

### H5 — Capacitaciones
- CA5.1 Cada curso muestra foto, fecha, modalidad, barra de cupos y "Quiero mi lugar" → WhatsApp con el nombre del curso.

### H6 — Stock y avisos (Fase 2)
- CA6.1 Pago aprobado → se descuenta stock; en 0 pasa a "Agotado" solo.
- CA6.2 La dueña recibe un mail con el pedido completo; la compradora, su confirmación.

### H7 — Carga de stock (Fase 3)
- CA7.1 Carpeta `Categoria/Nombre - $precio - Nu/` con fotos → se genera el catálogo sin escribir datos a mano.

## 8. No funcionales
- Mobile first (375, 390, 768, 1280 px), sin scroll horizontal de página.
- Rápida en 4G: imágenes WebP con lazy-load y medidas; videos sin audio, ≤ 2 MB, con `poster`, `muted playsinline loop autoplay`.
- Accesible: contraste, botones reales con etiqueta, teclado, `prefers-reduced-motion`.
- SEO y Open Graph.
- Credenciales solo en variables de entorno. Infraestructura gratuita.

## 9. Fases
| Fase | Alcance |
|---|---|
| **F1 · Visual + compra en pantalla** | Todo el sitio igual al boceto v4, con productos reales del boceto, ficha, carrito y reserva por WhatsApp funcionando. Pago = "Próximamente". |
| **F2 · Venta real** | Mercado Pago, stock automático (Supabase), mails. |
| **F3 · Contenido final** | Precios, horarios, cursos, historia, legales, carga completa del catálogo. |
| **F4 · Lanzamiento** | Dominio, pruebas con pago real, entrega. |

## 10. Pendientes de la clienta
Precios de productos y servicios · duraciones reales · horarios · fechas y cupos de cursos · historia · envíos · Mercado Pago · razón social y CUIT · políticas de cambio · dominio.
