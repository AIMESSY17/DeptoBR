/* =========================================================
   DeptoBR v4 · app
   Carga /data/*.json, arma las secciones, ficha (bottom sheet),
   carrito, barra fija inferior y efectos.
   ========================================================= */
(function () {
  'use strict';

  var $ = function (sel, el) { return (el || document).querySelector(sel); };
  var reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var datos = { productos: [], servicios: [], grupos: [], cursos: [], look: null, config: {} };
  var porId = {};

  /* ---------- Utilidades ---------- */
  function esc(t) {
    return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var numero = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 });
  /* $15.000 · si todavía no hay precio, muestra el placeholder del boceto */
  function precio(n) { return typeof n === 'number' ? '$' + numero.format(n) : '$ [precio]'; }

  /* img/foto.webp → img/foto-480.webp (versión chica) */
  function chica(src) { return src.replace(/\.webp$/, '-480.webp'); }
  function srcset(src) { return chica(src) + ' 480w, ' + src + ' 1200w'; }

  function wa(mensaje) {
    return 'https://wa.me/' + (datos.config.whatsapp || '') + '?text=' + encodeURIComponent(mensaje);
  }

  function agotado(p) { return typeof p.stock === 'number' && p.stock <= 0; }
  function etiquetaDe(p) {
    if (agotado(p)) return 'AGOTADO';
    if (typeof p.stock === 'number' && p.stock <= 3) return 'ÚLTIMAS ' + p.stock;
    return p.badge || '';
  }
  /* Cuántas unidades más se pueden sumar (según stock y lo que ya está en el carrito) */
  function disponible(p) {
    if (typeof p.stock !== 'number') return Infinity;
    return Math.max(0, p.stock - Carrito.cantidad(p.id));
  }

  /* Pide un JSON; si falla la red, reintenta una vez */
  function getJSON(url, reintento) {
    return fetch(url, { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error(url + ' ' + r.status);
      return r.json();
    }).catch(function (err) {
      if (reintento) throw err;
      return new Promise(function (ok) { setTimeout(ok, 400); }).then(function () { return getJSON(url, true); });
    });
  }

  /* =========================================================
     Render de secciones
     ========================================================= */
  function renderSumario() {
    var html = (datos.config.sumario || []).map(function (c) {
      return '<a class="sumario__item" href="' + esc(c.href) + '">' +
        '<span class="sumario__n">' + esc(c.n) + '</span>' +
        '<span class="sumario__nombre">' + esc(c.nombre) + '</span>' +
        '<img class="sumario__img" src="' + esc(chica(c.img)) + '" width="70" height="70" loading="lazy" alt="">' +
      '</a>';
    }).join('');
    $('#sumario-lista').innerHTML = html;
  }

  function tarjeta(p, sizes) {
    var et = etiquetaDe(p);
    var sin = agotado(p);
    return '<article class="tarjeta' + (sin ? ' tarjeta--agotada' : '') + '" role="listitem">' +
      '<div class="tarjeta__foto brillo">' +
        '<button class="foto-btn" type="button" data-abrir="' + esc(p.id) + '" aria-label="Ver ' + esc(p.nombre) + '">' +
          '<img class="foto" src="' + esc(chica(p.fotos[0])) + '" srcset="' + esc(srcset(p.fotos[0])) + '" sizes="' + sizes + '" width="480" height="600" loading="lazy" alt="' + esc(p.nombre) + '">' +
        '</button>' +
        (et ? '<span class="etiqueta' + (sin ? ' etiqueta--agotado' : '') + '">' + esc(et) + '</span>' : '') +
        (sin ? '' : '<button class="mas-rapido" type="button" data-sumar="' + esc(p.id) + '" aria-label="Agregar ' + esc(p.nombre) + ' al carrito">+</button>') +
      '</div>' +
      '<button class="tarjeta__pie" type="button" data-abrir="' + esc(p.id) + '">' +
        '<span class="tarjeta__nombre">' + esc(p.nombre) + '</span>' +
        '<span class="tarjeta__precio">' + (sin ? 'Agotado' : esc(precio(p.precio))) + '</span>' +
      '</button>' +
    '</article>';
  }

  function renderTienda() {
    var d = datos.productos.filter(function (p) { return p.destacado; })[0];
    if (d) {
      var sin = agotado(d);
      $('#semana').outerHTML =
        '<div class="semana brillo">' +
          '<button class="foto-btn" type="button" data-abrir="' + esc(d.id) + '" aria-label="Ver ' + esc(d.nombre) + '">' +
            '<img class="foto" src="' + esc(d.fotos[0]) + '" srcset="' + esc(srcset(d.fotos[0])) + '" sizes="(min-width: 1024px) 1200px, 100vw" width="960" height="1200" loading="lazy" alt="' + esc(d.nombre) + '">' +
          '</button>' +
          '<span class="etiqueta">PIEZA DE LA SEMANA</span>' +
        '</div>' +
        '<div class="semana__info">' +
          '<div class="semana__datos">' +
            '<span class="semana__nombre">' + esc(d.nombre) + '</span>' +
            '<span class="semana__precio">' + esc(precio(d.precio)) + '</span>' +
          '</div>' +
          '<button class="btn btn--principal semana__agregar" type="button" data-sumar="' + esc(d.id) + '"' + (sin ? ' disabled' : '') + '>' + (sin ? 'Agotado' : 'Agregar') + '</button>' +
        '</div>';
    }
    $('#nuevos').innerHTML = datos.productos
      .filter(function (p) { return p.lista === 'nuevo'; })
      .map(function (p) { return tarjeta(p, '(min-width: 1024px) 240px, 250px'); }).join('');
    $('#lista-lentes').innerHTML = datos.productos
      .filter(function (p) { return p.lista === 'lentes'; })
      .map(function (p) { return tarjeta(p, '(min-width: 1024px) 590px, 300px'); }).join('');
  }

  /* ---------- Robale el look ---------- */
  function renderLook() {
    var L = datos.look;
    if (!L) return;
    var marco = $('#look-marco');
    marco.innerHTML =
      '<img class="foto" id="look-img" src="' + esc(L.foto) + '" srcset="' + esc(srcset(L.foto)) + '" sizes="(min-width: 1024px) 615px, 100vw" width="900" height="1200" loading="lazy" alt="' + esc(L.alt) + '">' +
      L.puntos.map(function (s, i) {
        var p = porId[s.productoId];
        if (!p) return '';
        return '<button class="look__punto" type="button" data-abrir="' + esc(p.id) + '" data-punto="' + i + '" aria-label="Ver ' + esc(p.nombre) + '" style="top:' + esc(s.top) + ';left:' + esc(s.left) + '">' +
          '<span class="punto" aria-hidden="true">+</span>' + esc(s.etiqueta) + '</button>';
      }).join('');

    var img = $('#look-img');
    var ubicar = function () { ubicarPuntos(marco, img, L); };
    if (img.complete) ubicar(); else img.addEventListener('load', ubicar);
    if ('ResizeObserver' in window) new ResizeObserver(ubicar).observe(marco);
    else window.addEventListener('resize', ubicar);
  }

  /* Las posiciones del boceto están medidas sobre 390 x 620 con la foto
     recortada en "cover". Las paso a coordenadas de la foto y las vuelvo
     a proyectar sobre el tamaño real, así cada etiqueta queda sobre su pieza. */
  function cubrir(cw, ch, iw, ih, px, py) {
    var s = Math.max(cw / iw, ch / ih);
    var dw = iw * s, dh = ih * s;
    return { dw: dw, dh: dh, ox: (cw - dw) * px, oy: (ch - dh) * py };
  }
  function ubicarPuntos(marco, img, L) {
    var iw = img.naturalWidth || 900, ih = img.naturalHeight || 1200;
    var enc = (L.encuadre || '50% 50%').split(' ').map(function (v) { return parseFloat(v) / 100; });
    var ref = cubrir(390, 620, iw, ih, enc[0], enc[1]);
    var cw = marco.clientWidth, ch = marco.clientHeight;
    var act = cubrir(cw, ch, iw, ih, enc[0], enc[1]);
    var CENTRO = 18; /* del borde izquierdo del botón al centro del "+" */
    marco.querySelectorAll('[data-punto]').forEach(function (b) {
      var s = L.puntos[+b.getAttribute('data-punto')];
      var u = (parseFloat(s.left) / 100 * 390 + CENTRO - ref.ox) / ref.dw;
      var v = (parseFloat(s.top) / 100 * 620 - ref.oy) / ref.dh;
      var x = act.ox + u * act.dw - CENTRO;
      var y = act.oy + v * act.dh;
      x = Math.max(8, Math.min(x, cw - b.offsetWidth - 8));
      b.style.left = x + 'px';
      b.style.top = y + 'px';
    });
  }

  /* ---------- La carta ---------- */
  function servicioHTML(v) {
    return '<button class="servicio" type="button" data-servicio="' + esc(v.id) + '">' +
      '<span class="servicio__linea">' +
        '<span class="servicio__nombre">' + esc(v.nombre) + '</span>' +
        '<span class="servicio__puntos" aria-hidden="true"></span>' +
        '<span class="servicio__precio">' + esc(precio(v.precio)) + '</span>' +
      '</span>' +
      '<span class="servicio__sub">' +
        '<span>' + esc(v.dur) + (v.top ? ' · Lo más pedido' : '') + '</span>' +
        '<span class="servicio__reservar">Reservar →</span>' +
      '</span>' +
    '</button>';
  }
  /* Agrupa por "grupo" (Manos, Pies, Cejas) en el orden de "grupos";
     los servicios sin grupo conocido van al final, sin subtítulo. */
  function renderServicios() {
    var usados = {};
    var html = datos.grupos.map(function (g) {
      var lista = datos.servicios.filter(function (v) { return v.grupo === g.id; });
      if (!lista.length) return '';
      usados[g.id] = true;
      return '<div class="carta__grupo">' +
        '<h3 class="carta__subtitulo">' +
          (g.img ? '<img class="carta__subtitulo-img" src="' + esc(g.img) + '" alt="' + esc(g.alt || '') + '" width="28" height="28" loading="lazy">' : '') +
          '<span>' + esc(g.nombre) + '</span>' +
        '</h3>' +
        lista.map(servicioHTML).join('') +
      '</div>';
    }).join('');
    html += datos.servicios.filter(function (v) { return !usados[v.grupo]; }).map(servicioHTML).join('');
    $('#servicios').innerHTML = html;
  }

  /* ---------- Capacitaciones ---------- */
  var MESES = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
  function renderCursos() {
    $('#lista-cursos').innerHTML = datos.cursos.map(function (c) {
      var dia = '[dd]', mes = '[MES]';
      var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(c.fecha || '');
      if (m) { dia = String(+m[3]); mes = MESES[+m[2] - 1]; }

      var hayCupos = typeof c.cupos === 'number';
      var barra = (hayCupos && c.cuposTotales) ? Math.round((c.cuposTotales - c.cupos) / c.cuposTotales * 100) : (c.barraEjemplo || 0);
      var quedan = !hayCupos ? 'Quedan [n] lugares' : c.cupos <= 0 ? 'Cupo completo' : c.cupos === 1 ? 'Queda 1 lugar' : 'Quedan ' + c.cupos + ' lugares';
      var lleno = hayCupos && c.cupos <= 0;
      var blush = c.acento === 'blush';
      var msj = 'Hola! Quiero mi lugar en la capacitación "' + c.nombre + '".';

      return '<article class="curso' + (blush ? ' curso--blush' : '') + '">' +
        '<div class="curso__top">' +
          '<span class="curso__foto"><img class="foto" src="' + esc(chica(c.img)) + '" width="96" height="110" loading="lazy" alt="' + esc(c.alt || c.nombre) + '">' +
            '<span class="curso__fecha"><span class="curso__dia">' + esc(dia) + '</span><span class="curso__mes">' + esc(mes) + '</span></span></span>' +
          '<span class="curso__datos"><span class="curso__nombre">' + esc(c.nombre) + '</span><span class="curso__modalidad">' + esc(c.modalidad) + '</span></span>' +
        '</div>' +
        '<div class="curso__cupos">' +
          '<div class="curso__barra" role="presentation"><div class="curso__relleno" style="width:' + Math.max(0, Math.min(100, barra)) + '%"></div></div>' +
          '<span class="curso__quedan">' + esc(quedan) + '</span>' +
        '</div>' +
        (lleno
          ? '<button class="btn ' + (blush ? 'btn--curso-sec' : 'btn--curso') + '" type="button" disabled>Cupo completo</button>'
          : '<a class="btn ' + (blush ? 'btn--curso-sec' : 'btn--curso') + '" href="' + esc(wa(msj)) + '" target="_blank" rel="noopener">Quiero mi lugar</a>') +
      '</article>';
    }).join('');
  }

  /* ---------- Datos de contacto y legales ---------- */
  function renderConfig() {
    var c = datos.config;
    document.querySelectorAll('[data-cfg]').forEach(function (el) {
      var k = el.getAttribute('data-cfg');
      if (c[k]) el.textContent = c[k];
    });
    if (c.mapsUrl) $('#como-llegar').href = c.mapsUrl;
    if (c.instagram) $('#link-ig').href = 'https://www.instagram.com/' + c.instagram + '/';
    var l = c.legales || {};
    if (l.cambiosUrl) $('#link-cambios').href = l.cambiosUrl;
    if (l.arrepentimientoUrl) $('#link-arrepentimiento').href = l.arrepentimientoUrl;
    $('#legales').innerHTML = esc(l.razonSocial) + ' · CUIT ' + esc(l.cuit) + ' · <a href="' + esc(l.defensaConsumidorUrl || '#') + '" target="_blank" rel="noopener">Defensa del Consumidor</a>';
    document.querySelectorAll('[data-wa-turno]').forEach(function (a) {
      a.href = wa('Hola! Quiero reservar un turno.');
      a.target = '_blank'; a.rel = 'noopener';
    });
  }

  /* =========================================================
     Ficha (bottom sheet): producto, servicio y carrito
     ========================================================= */
  var hoja = $('#hoja'), velo = $('#velo'), contenido = $('#hoja-contenido');
  var abierta = null;         /* 'producto' | 'servicio' | 'carrito' | null */
  var origen = null;          /* elemento a devolver el foco */
  var fichaEstado = {};

  function abrirHoja(tipo, etiqueta) {
    abierta = tipo;
    hoja.setAttribute('aria-label', etiqueta);
    if (hoja.hidden) {
      origen = document.activeElement;
      velo.hidden = false;
      hoja.hidden = false;
      document.documentElement.classList.add('bloqueado');
    }
    hoja.scrollTop = 0;
    $('#hoja-cerrar').focus({ preventScroll: true });
    actualizarBarra();
  }

  function cerrarHoja() {
    if (hoja.hidden) return;
    hoja.hidden = true;
    velo.hidden = true;
    abierta = null;
    contenido.innerHTML = '';
    document.documentElement.classList.remove('bloqueado');
    if (origen && document.contains(origen)) origen.focus({ preventScroll: true });
    actualizarBarra();
  }

  /* ---------- Ficha de producto ---------- */
  function abrirProducto(id) {
    var p = porId[id];
    if (!p) return;
    fichaEstado = { id: id, qty: 1 };
    pintarProducto();
    abrirHoja('producto', p.nombre);
  }
  function pintarProducto() {
    var p = porId[fichaEstado.id];
    var sin = agotado(p);
    var resto = disponible(p);
    contenido.innerHTML =
      '<img class="hoja__img" src="' + esc(p.fotos[0]) + '" width="960" height="1200" alt="' + esc(p.nombre) + '">' +
      '<div class="hoja__cuerpo">' +
        '<span class="hoja__cat">' + esc((p.cat || '').toUpperCase()) + '</span>' +
        '<span class="hoja__nombre">' + esc(p.nombre) + '</span>' +
        '<span class="hoja__precio">' + (sin ? 'Agotado' : esc(precio(p.precio))) + '</span>' +
        '<span class="hoja__desc">' + esc(p.desc) + '</span>' +
        '<span class="hoja__nota">Retiro en el Dpto 319 o envío a coordinar.</span>' +
        '<div class="hoja__comprar">' +
          '<div class="cantidad">' +
            '<button type="button" data-ficha="menos" aria-label="Restar"' + (sin || fichaEstado.qty <= 1 ? ' disabled' : '') + '>−</button>' +
            '<span class="cantidad__n" aria-live="polite">' + fichaEstado.qty + '</span>' +
            '<button type="button" data-ficha="mas" aria-label="Sumar"' + (sin || fichaEstado.qty >= resto ? ' disabled' : '') + '>+</button>' +
          '</div>' +
          '<button class="btn btn--principal" type="button" data-ficha="agregar"' + (sin || resto <= 0 ? ' disabled' : '') + '>' +
            (sin ? 'Agotado' : resto <= 0 ? 'Ya tenés todo el stock' : 'Agregar al carrito') + '</button>' +
        '</div>' +
        '<a class="hoja__link" href="' + esc(wa('Hola! Quiero consultar por ' + p.nombre + '.')) + '" target="_blank" rel="noopener">Consultar por WhatsApp</a>' +
        similares(p) +
      '</div>';
  }

  /* También te puede gustar: 4 productos, primero de la misma categoría.
     Arranca después del producto abierto (así cada ficha sugiere otros).
     Los de "Robale el look" solo se venden desde la foto, no se sugieren. */
  function similares(p) {
    var todos = datos.productos, i = todos.indexOf(p);
    var lista = todos.slice(i + 1).concat(todos.slice(0, i))
      .filter(function (q) { return q.lista !== 'look'; });
    var misma = lista.filter(function (q) { return q.cat === p.cat; });
    var resto = lista.filter(function (q) { return q.cat !== p.cat; });
    var elegidos = misma.concat(resto).slice(0, 4);
    if (!elegidos.length) return '';
    return '<div class="similares">' +
      '<span class="similares__titulo">También te puede <span class="it">gustar</span></span>' +
      '<div class="similares__lista" role="list">' + elegidos.map(function (q) {
        return '<button class="similar" type="button" role="listitem" data-abrir="' + esc(q.id) + '">' +
          '<img src="' + esc(chica(q.fotos[0])) + '" width="132" height="164" loading="lazy" alt="' + esc(q.nombre) + '">' +
          '<span class="similar__nombre">' + esc(q.nombre) + '</span>' +
          '<span class="similar__precio">' + (agotado(q) ? 'Agotado' : esc(precio(q.precio))) + '</span>' +
        '</button>';
      }).join('') + '</div>' +
    '</div>';
  }

  /* ---------- Ficha de servicio ---------- */
  function abrirServicio(id) {
    var v = datos.servicios.filter(function (s) { return s.id === id; })[0];
    if (!v) return;
    fichaEstado = { servicio: v, turno: 'Tarde' };
    pintarServicio();
    abrirHoja('servicio', v.nombre);
  }
  function mensajeServicio() {
    var v = fichaEstado.servicio;
    return 'Hola! Quiero reservar ' + v.nombre + ' (' + v.dur + '), me queda mejor ' + fichaEstado.turno.toLowerCase() + '.';
  }
  function pintarServicio() {
    var v = fichaEstado.servicio;
    var foto = v.antesDespues
      ? '<div class="antes-despues">' +
          '<div><img class="foto" src="' + esc(v.antesDespues.antes) + '" alt="' + esc(v.nombre) + ': antes"><span>ANTES</span></div>' +
          '<div><img class="foto" src="' + esc(v.antesDespues.despues) + '" alt="' + esc(v.nombre) + ': después"><span class="despues">DESPUÉS</span></div>' +
        '</div>'
      : '<img class="hoja__img hoja__img--servicio" src="' + esc(v.img) + '" alt="' + esc(v.nombre) + '">';
    var tilde = '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="#9A6E18" stroke-width="2"><path d="M3 8.5l3 3 7-7"/></svg>';
    contenido.innerHTML = foto +
      '<div class="hoja__cuerpo hoja__cuerpo--servicio">' +
        '<span class="hoja__cat">BEAUTY ROOM</span>' +
        '<span class="hoja__nombre">' + esc(v.nombre) + '</span>' +
        '<span class="hoja__dur">' + esc(v.dur) + ' · <strong>' + esc(precio(v.precio)) + '</strong></span>' +
        '<ul class="incluye">' + v.incluye.map(function (i) { return '<li>' + tilde + esc(i) + '</li>'; }).join('') + '</ul>' +
        '<span class="hoja__pregunta" id="t-turno">¿Cuándo te queda mejor?</span>' +
        '<div class="turnos" role="group" aria-labelledby="t-turno">' +
          ['Mañana', 'Tarde', 'Sábado'].map(function (u) {
            return '<button class="turno" type="button" data-turno="' + u + '" aria-pressed="' + (u === fichaEstado.turno) + '">' + u + '</button>';
          }).join('') +
        '</div>' +
        '<a class="btn btn--principal hoja__reservar" id="reservar-wa" href="' + esc(wa(mensajeServicio())) + '" target="_blank" rel="noopener">Reservar por WhatsApp</a>' +
        '<span class="hoja__mensaje" id="mensaje-wa">Le llega a DeptoBR: “' + esc(mensajeServicio()) + '”</span>' +
      '</div>';
  }
  function elegirTurno(u) {
    fichaEstado.turno = u;
    contenido.querySelectorAll('[data-turno]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-turno') === u));
    });
    $('#reservar-wa').href = wa(mensajeServicio());
    $('#mensaje-wa').textContent = 'Le llega a DeptoBR: “' + mensajeServicio() + '”';
  }

  /* ---------- Carrito (mismo panel) ---------- */
  function lineas() {
    return Carrito.items().map(function (i) { return { p: porId[i.id], qty: i.qty }; })
      .filter(function (l) { return l.p; });
  }
  function totalPrecio(ls) {
    var faltan = ls.some(function (l) { return typeof l.p.precio !== 'number'; });
    if (faltan) return '$ [total]';
    return precio(ls.reduce(function (s, l) { return s + l.p.precio * l.qty; }, 0));
  }
  function abrirCarrito() {
    fichaEstado = { pronto: false };
    pintarCarrito();
    abrirHoja('carrito', 'Tu carrito');
  }
  function pintarCarrito() {
    var ls = lineas();
    var cuerpo;
    if (!ls.length) {
      cuerpo = '<p class="carrito__vacio">Tu carrito está vacío.</p>' +
        '<a class="btn btn--secundario" href="#tienda" data-cerrar>Ver la tienda</a>';
    } else {
      var pedido = 'Hola! Quiero hacer este pedido:\n' + ls.map(function (l) {
        return '· ' + l.qty + ' x ' + l.p.nombre;
      }).join('\n');
      cuerpo =
        '<ul class="carrito__items">' + ls.map(function (l) {
          var resto = typeof l.p.stock === 'number' ? l.p.stock - l.qty : Infinity;
          return '<li class="item">' +
            '<img src="' + esc(chica(l.p.fotos[0])) + '" width="72" height="90" alt="">' +
            '<div class="item__datos">' +
              '<div class="item__fila"><span class="item__nombre">' + esc(l.p.nombre) + '</span><span class="item__precio">' + esc(precio(l.p.precio)) + '</span></div>' +
              '<div class="item__acciones">' +
                '<div class="cantidad">' +
                  '<button type="button" data-item="menos" data-id="' + esc(l.p.id) + '" aria-label="Restar ' + esc(l.p.nombre) + '">−</button>' +
                  '<span class="cantidad__n">' + l.qty + '</span>' +
                  '<button type="button" data-item="mas" data-id="' + esc(l.p.id) + '" aria-label="Sumar ' + esc(l.p.nombre) + '"' + (resto <= 0 ? ' disabled' : '') + '>+</button>' +
                '</div>' +
                '<button class="item__quitar" type="button" data-item="quitar" data-id="' + esc(l.p.id) + '">Eliminar</button>' +
              '</div>' +
            '</div>' +
          '</li>';
        }).join('') + '</ul>' +
        '<div class="carrito__total"><span>Total</span><span>' + esc(totalPrecio(ls)) + '</span></div>' +
        '<button class="btn btn--principal" type="button" data-pagar>Pagar</button>' +
        '<p class="carrito__pronto" id="pronto" role="status"' + (fichaEstado.pronto ? '' : ' hidden') + '>Próximamente vas a poder pagar online acá. Mientras tanto, hacé tu pedido por WhatsApp.</p>' +
        '<span class="hoja__nota" style="text-align:center">Retiro en el Dpto 319 o envío a coordinar.</span>' +
        '<a class="hoja__link" href="' + esc(wa(pedido)) + '" target="_blank" rel="noopener">Pedir por WhatsApp</a>';
    }
    contenido.innerHTML =
      '<div class="hoja__cuerpo hoja__cuerpo--carrito">' +
        '<span class="hoja__cat">DBRJOYAS</span>' +
        '<span class="hoja__nombre">Tu carrito</span>' +
        cuerpo +
      '</div>';
  }

  /* Fase 2: acá se crea la preferencia de Mercado Pago (/api/crear-pago). */
  function iniciarPago(carrito) { /* eslint-disable-line no-unused-vars */ }
  window.iniciarPago = iniciarPago;

  /* =========================================================
     Agregar: aviso, llave que se balancea, contador
     ========================================================= */
  var toast = $('#toast'), llave = $('#carrito-llave'), tToast = null, vaivenes = 0;

  function sumar(id, n) {
    var p = porId[id];
    if (!p || agotado(p)) return;
    var sumado = Carrito.agregar(id, n, typeof p.stock === 'number' ? p.stock : undefined);
    if (sumado > 0) avisar('Agregado a tu carrito');
    else avisar('No hay más stock de este producto');
  }

  function avisar(texto) {
    clearTimeout(tToast);
    toast.textContent = texto;
    toast.hidden = false;
    tToast = setTimeout(function () { toast.hidden = true; }, 2000);
    vaivenes++;
    llave.classList.remove('colgar-a', 'colgar-b');
    llave.classList.add(vaivenes % 2 ? 'colgar-a' : 'colgar-b');
  }

  function actualizarContador() {
    var n = Carrito.total();
    var c = $('#carrito-contador');
    c.textContent = n;
    c.hidden = n === 0;
    $('#carrito-btn').setAttribute('aria-label', 'Carrito, ' + n + (n === 1 ? ' producto' : ' productos'));
  }

  /* =========================================================
     Barra fija inferior: carrito o "Reservar turno"
     ========================================================= */
  var barra = $('#barra'), enBeauty = false;
  function actualizarBarra() {
    var n = Carrito.total();
    var modo = abierta ? null : enBeauty ? 'turno' : n > 0 ? 'carrito' : null;
    if (!modo) { barra.hidden = true; barra.removeAttribute('data-modo'); return; }
    if (barra.getAttribute('data-modo') !== modo) barra.hidden = true; /* reinicia "aparece" */
    barra.setAttribute('data-modo', modo);
    if (modo === 'turno') {
      $('#barra-izq').textContent = 'Reservar turno';
      $('#barra-der').textContent = '→';
      barra.setAttribute('aria-label', 'Reservar turno por WhatsApp');
    } else {
      $('#barra-izq').textContent = 'Ver carrito (' + n + ')';
      $('#barra-der').textContent = totalPrecio(lineas()) + ' →';
      barra.removeAttribute('aria-label');
    }
    barra.hidden = false;
  }

  /* =========================================================
     Eventos
     ========================================================= */
  function eventos() {
    document.addEventListener('click', function (e) {
      var t = e.target.closest('button, a');
      if (!t) return;

      if (t.hasAttribute('data-abrir')) { abrirProducto(t.getAttribute('data-abrir')); return; }
      if (t.hasAttribute('data-sumar')) { sumar(t.getAttribute('data-sumar'), 1); return; }
      if (t.hasAttribute('data-servicio')) { abrirServicio(t.getAttribute('data-servicio')); return; }
      if (t.hasAttribute('data-turno')) { elegirTurno(t.getAttribute('data-turno')); return; }
      if (t.hasAttribute('data-cerrar')) {
        e.preventDefault();
        var destino = document.querySelector(t.getAttribute('href'));
        cerrarHoja();
        if (destino) destino.scrollIntoView({ behavior: reducido ? 'auto' : 'smooth' });
        return;
      }

      var f = t.getAttribute('data-ficha');
      if (f) {
        var p = porId[fichaEstado.id];
        if (f === 'menos') fichaEstado.qty = Math.max(1, fichaEstado.qty - 1);
        if (f === 'mas') fichaEstado.qty = Math.min(disponible(p), fichaEstado.qty + 1);
        if (f === 'agregar') { var n = fichaEstado.qty; cerrarHoja(); sumar(p.id, n); return; }
        pintarProducto();
        var foco = contenido.querySelector('[data-ficha="' + f + '"]:not([disabled])') || contenido.querySelector('[data-ficha="agregar"]');
        if (foco) foco.focus();
        return;
      }

      var it = t.getAttribute('data-item');
      if (it) {
        var id = t.getAttribute('data-id');
        if (it === 'menos') Carrito.fijar(id, Carrito.cantidad(id) - 1);
        if (it === 'mas') { var pr = porId[id]; Carrito.agregar(id, 1, typeof pr.stock === 'number' ? pr.stock : undefined); }
        if (it === 'quitar') Carrito.quitar(id);
        var otro = contenido.querySelector('[data-item="' + it + '"][data-id="' + id + '"]:not([disabled])') || contenido.querySelector('[data-pagar]') || contenido.querySelector('a, button');
        if (otro) otro.focus();
        return;
      }

      if (t.hasAttribute('data-pagar')) {
        fichaEstado.pronto = true;
        iniciarPago(Carrito.items());
        $('#pronto').hidden = false;
        return;
      }
    });

    $('#carrito-btn').addEventListener('click', abrirCarrito);
    $('#hoja-cerrar').addEventListener('click', cerrarHoja);
    velo.addEventListener('click', cerrarHoja);
    barra.addEventListener('click', function () {
      if (barra.getAttribute('data-modo') === 'turno') window.open(wa('Hola! Quiero reservar un turno.'), '_blank', 'noopener');
      else abrirCarrito();
    });

    /* Esc cierra · Tab queda atrapado dentro de la ficha */
    document.addEventListener('keydown', function (e) {
      if (hoja.hidden) return;
      if (e.key === 'Escape') { cerrarHoja(); return; }
      if (e.key !== 'Tab') return;
      var f = Array.prototype.filter.call(
        hoja.querySelectorAll('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'),
        function (el) { return el.offsetParent !== null; });
      if (!f.length) return;
      var primero = f[0], ultimo = f[f.length - 1];
      if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
    });

    Carrito.alCambiar(function () {
      actualizarContador();
      actualizarBarra();
      if (abierta === 'carrito') pintarCarrito();
    });

    /* ¿Está el usuario en el Beauty Room? */
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) {
        enBeauty = en[0].isIntersecting;
        actualizarBarra();
      }, { rootMargin: '-45% 0px -45% 0px' }).observe($('#beauty'));
    }
  }

  /* =========================================================
     Videos y efectos
     ========================================================= */
  function videos() {
    var vids = document.querySelectorAll('[data-video]');
    if (reducido) { vids.forEach(function (v) { v.removeAttribute('autoplay'); v.pause(); }); return; }
    if (!('IntersectionObserver' in window)) return;
    /* Solo reproduce lo que está en pantalla (ahorra datos y batería) */
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) {
        var v = x.target;
        if (x.isIntersecting) { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); }
        else v.pause();
      });
    }, { rootMargin: '200px 0px' });
    vids.forEach(function (v) { io.observe(v); });
  }

  /* Pantalla de carga: se saca del DOM cuando termina "salir" (o enseguida
     si ya se vio en esta sesión o hay reduced-motion). No frena la carga:
     la página se arma por debajo. */
  function cargador() {
    var c = $('#cargador');
    if (!c) return;
    var quitar = function () { if (c.parentNode) c.remove(); };
    if (reducido || document.documentElement.classList.contains('ya-cargo')) { quitar(); return; }
    c.addEventListener('animationend', function (e) { if (e.target === c) quitar(); });
    setTimeout(quitar, 4000); /* por si la animación no llega a terminar */
  }

  /* =========================================================
     Inicio
     ========================================================= */
  cargador();
  videos();
  actualizarContador();

  Promise.all([
    getJSON('data/productos.json'),
    getJSON('data/servicios.json'),
    getJSON('data/cursos.json'),
    getJSON('data/look.json'),
    getJSON('data/config.json')
  ]).then(function (r) {
    datos.productos = r[0].productos || [];
    datos.servicios = r[1].servicios || [];
    datos.grupos = r[1].grupos || [];
    datos.cursos = r[2].cursos || [];
    datos.look = r[3];
    datos.config = r[4];
    datos.productos.forEach(function (p) { porId[p.id] = p; });

    Carrito.limpiar(Object.keys(porId));
    renderConfig();
    renderSumario();
    renderTienda();
    renderLook();
    renderServicios();
    renderCursos();
    eventos();
    actualizarContador();
    actualizarBarra();
  }).catch(function (err) {
    console.error('No se pudieron cargar los datos. Abrí el sitio con un servidor local (ej. Live Server o "npx serve").', err);
  });
})();
