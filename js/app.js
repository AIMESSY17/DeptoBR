/* =========================================================
   DeptoBR v6 · app
   Carga /data/*.json, arma banners, destacados, servicios y
   cursos; panel (ficha, carrito, menú, búsqueda), carrito y
   barra inferior.
   ========================================================= */
(function () {
  'use strict';

  var $ = function (sel, el) { return (el || document).querySelector(sel); };
  var reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var datos = { productos: [], servicios: [], grupos: [], cursos: [], config: {} };
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
  function chica(src) { return src.replace(/(-1600)?\.webp$/, '-480.webp'); }
  function srcset(src) { return chica(src) + ' 480w, ' + src + ' 1200w'; }

  function wa(mensaje) {
    return 'https://wa.me/' + (datos.config.whatsapp || '5492974058183') + (mensaje ? '?text=' + encodeURIComponent(mensaje) : '');
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
  function deTienda(p) { return p.lista !== 'gift'; }
  function gifts() { return datos.productos.filter(function (p) { return p.lista === 'gift'; }); }
  function montoDe(p, i) { return typeof p.precio === 'number' ? precio(p.precio) : '$ [monto ' + (i + 1) + ']'; }

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

  var FLECHA = '<svg width="16" height="10" viewBox="0 0 16 10" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M0 5h15M11 1l4 4-4 4"/></svg>';

  /* =========================================================
     Banners de categorías
     ========================================================= */
  function renderCategorias() {
    $('#categorias').innerHTML = (datos.config.categorias || []).map(function (c) {
      var extra = c.abrir ? ' data-abrir="' + esc(c.abrir) + '"' : c.filtro ? ' data-filtro="' + esc(c.filtro) + '"' : '';
      var set = c.img480 ? ' srcset="' + esc(c.img480) + ' 480w, ' + esc(c.img) + ' 1600w" sizes="(min-width: 1024px) 33vw, 100vw"' : '';
      return '<a class="cat" href="' + esc(c.href || '#') + '"' + extra + '>' +
        '<span class="cat__foto"><img src="' + esc(c.img) + '"' + set + ' loading="lazy" alt="' + esc(c.alt || c.nombre) + '" style="object-position:' + esc(c.pos || '50% 50%') + '"></span>' +
        '<span class="cat__fila">' + esc(c.nombre) + FLECHA + '</span>' +
      '</a>';
    }).join('');
  }

  /* =========================================================
     Destacados / todos / por categoría
     ========================================================= */
  var filtro = null; /* null = Destacados · 'todos' · 'Joyas' · 'Lentes' */

  function tarjeta(p) {
    var et = etiquetaDe(p);
    var sin = agotado(p);
    return '<article class="prod' + (sin ? ' prod--agotado' : '') + '" role="listitem">' +
      '<button class="prod__foto" type="button" data-abrir="' + esc(p.id) + '" aria-label="Ver ' + esc(p.nombre) + '">' +
        '<img src="' + esc(chica(p.fotos[0])) + '" srcset="' + esc(srcset(p.fotos[0])) + '" sizes="(min-width: 1024px) 25vw, (min-width: 600px) 33vw, 50vw" width="480" height="600" loading="lazy" alt="' + esc(p.nombre) + '">' +
        (et ? '<span class="etiqueta">' + esc(et) + '</span>' : '') +
      '</button>' +
      '<span class="prod__nombre">' + esc(p.nombre) + '</span>' +
      '<span class="prod__precio">' + (sin ? 'Agotado' : esc(precio(p.precio))) + '</span>' +
      '<span class="prod__nota">Retiro en el depto o envío a coordinar</span>' +
      '<button class="btn--chico" type="button" data-sumar="' + esc(p.id) + '"' + (sin ? ' disabled' : '') + ' aria-label="Comprar ' + esc(p.nombre) + '">' + (sin ? 'AGOTADO' : 'COMPRAR') + '</button>' +
    '</article>';
  }

  function renderTienda() {
    var lista, titulo;
    if (!filtro) {
      titulo = 'Destacados';
      lista = datos.productos.filter(function (p) { return p.destacado && deTienda(p); });
    } else if (filtro === 'todos') {
      titulo = 'Todos los productos';
      lista = datos.productos.filter(deTienda);
    } else {
      titulo = filtro;
      lista = datos.productos.filter(function (p) { return deTienda(p) && p.cat === filtro; });
    }
    $('#t-tienda').textContent = titulo;
    $('#grilla').innerHTML = lista.length ? lista.map(tarjeta).join('') : '<p class="grilla__vacia">Pronto vas a encontrar productos acá.</p>';
    $('#ver-todos').hidden = filtro === 'todos';
  }

  function filtrar(f) {
    filtro = f === 'destacados' ? null : f;
    renderTienda();
  }

  /* =========================================================
     Beauty Room
     ========================================================= */
  function renderServicios() {
    var orden = datos.grupos.map(function (g) { return g.id; });
    var nombreGrupo = {};
    datos.grupos.forEach(function (g) { nombreGrupo[g.id] = g.nombre; });
    var lista = datos.servicios.slice().sort(function (a, b) {
      var ia = orden.indexOf(a.grupo), ib = orden.indexOf(b.grupo);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
    });
    var cejasVistas = false;
    $('#servicios').innerHTML = lista.map(function (v) {
      var antes = '';
      if (v.grupo === 'cejas' && !cejasVistas) { cejasVistas = true; antes = bloqueCejas(); }
      return antes + '<button class="servicio" type="button" data-servicio="' + esc(v.id) + '">' +
        '<img src="' + esc(chica(v.img)) + '" width="64" height="64" loading="lazy" alt="">' +
        '<span class="servicio__datos">' +
          '<span class="servicio__nombre">' + esc(v.nombre) + '</span>' +
          '<span class="servicio__sub">' + esc(nombreGrupo[v.grupo] || '') + (nombreGrupo[v.grupo] ? ' · ' : '') + esc(v.dur) + '</span>' +
          '<span class="servicio__precio">' + esc(precio(v.precio)) + '</span>' +
        '</span>' +
        '<span class="btn--chico" aria-hidden="true">RESERVAR</span>' +
      '</button>';
    }).join('');
    videosCejas();
  }

  /* "Cejas en el depto": dos videos 4:5 arriba del grupo CEJAS */
  function bloqueCejas() {
    function video(n, etiqueta) {
      return '<video class="cejas-videos__video" muted loop playsinline preload="metadata"' + (reducido ? '' : ' autoplay') +
        ' poster="video/cejas-' + n + '-poster.webp" src="video/cejas-' + n + '.mp4" aria-label="' + etiqueta + '"></video>';
    }
    return '<div class="cejas-videos">' +
      '<span class="cejas-videos__titulo">Cejas en el depto</span>' +
      '<div class="cejas-videos__grid">' + video('mapeo', 'Diseño de cejas con hilo') + video('henna', 'Preparación de henna para cejas') + '</div>' +
      '<p class="cejas-videos__texto">Diseño con hilo y henna, a medida de tu rostro.</p>' +
    '</div>';
  }
  /* Solo se reproducen a la vista; con reduced-motion quedan los posters */
  function videosCejas() {
    var vids = document.querySelectorAll('.cejas-videos__video');
    if (!vids.length) return;
    vids.forEach(function (v) { v.muted = true; });
    if (reducido || !('IntersectionObserver' in window)) { vids.forEach(function (v) { v.removeAttribute('autoplay'); v.pause(); }); return; }
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) {
        var v = x.target;
        if (x.isIntersecting) { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); } else v.pause();
      });
    }, { threshold: 0.25 });
    vids.forEach(function (v) { io.observe(v); });
  }

  /* =========================================================
     Capacitaciones
     ========================================================= */
  var MESES = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
  function renderCursos() {
    $('#lista-cursos').innerHTML = datos.cursos.map(function (c) {
      var dia = '[dd]', mes = '[MES]';
      var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(c.fecha || '');
      if (m) { dia = String(+m[3]); mes = MESES[+m[2] - 1]; }
      var hayCupos = typeof c.cupos === 'number';
      var lleno = hayCupos && c.cupos <= 0;
      var quedan = !hayCupos ? 'Quedan [n] lugares' : lleno ? 'Cupo completo' : c.cupos === 1 ? 'Queda 1 lugar' : 'Quedan ' + c.cupos + ' lugares';
      var interior =
        '<span class="curso__fecha"><span class="curso__dia">' + esc(dia) + '</span><span class="curso__mes">' + esc(mes) + '</span></span>' +
        '<span class="curso__datos"><span class="curso__nombre">' + esc(c.nombre) + '</span><span class="curso__quedan">' + esc(quedan) + '</span></span>';
      if (lleno) return '<div class="curso curso--lleno">' + interior + '<span class="btn--chico btn--borde">COMPLETO</span></div>';
      return '<a class="curso" href="' + esc(wa('Hola! Quiero consultar por la capacitación "' + c.nombre + '".')) + '" target="_blank" rel="noopener">' +
        interior + '<span class="btn--chico btn--borde">CONSULTAR</span></a>';
    }).join('');
  }

  /* =========================================================
     Datos de contacto y legales
     ========================================================= */
  function renderConfig() {
    var c = datos.config;
    document.querySelectorAll('[data-cfg]').forEach(function (el) {
      var k = el.getAttribute('data-cfg');
      if (c[k]) el.textContent = c[k];
    });
    if (c.mapsUrl) $('#como-llegar').href = c.mapsUrl;
    if (c.instagram) $('#link-ig').href = 'https://www.instagram.com/' + c.instagram + '/';
    $('#wa').href = wa('Hola! Te escribo desde la web.');
    var l = c.legales || {};
    if (l.cambiosUrl) $('#link-cambios').href = l.cambiosUrl;
    if (l.preguntasUrl) $('#link-preguntas').href = l.preguntasUrl;
    if (l.arrepentimientoUrl) $('#link-arrepentimiento').href = l.arrepentimientoUrl;
    $('#legales').innerHTML = 'Copyright ' + esc(l.razonSocial || 'DeptoBR') + ' - ' + esc(l.cuit || '[CUIT]') + ' - ' + esc(l.anio || new Date().getFullYear()) + '. Todos los derechos reservados.<br>' +
      'Defensa de las y los consumidores. Para reclamos <a class="fuerte" href="' + esc(l.defensaConsumidorUrl || '#') + '" target="_blank" rel="noopener">ingresá acá</a>.';
  }

  /* =========================================================
     Panel (hoja): producto, servicio, carrito, menú, búsqueda
     ========================================================= */
  var hoja = $('#hoja'), velo = $('#velo'), contenido = $('#hoja-contenido');
  var abierta = null;         /* 'producto' | 'servicio' | 'carrito' | 'menu' | 'buscar' | null */
  var origen = null;          /* elemento a devolver el foco */
  var fichaEstado = {};

  function abrirHoja(tipo, etiqueta, foco) {
    var reabrir = !hoja.hidden && (tipo === 'menu') !== (abierta === 'menu');
    abierta = tipo;
    hoja.setAttribute('aria-label', etiqueta);
    hoja.classList.toggle('hoja--menu', tipo === 'menu');
    if (hoja.hidden || reabrir) {
      if (hoja.hidden) origen = document.activeElement;
      if (reabrir) { hoja.hidden = true; void hoja.offsetWidth; } /* reinicia la animación de entrada */
      velo.hidden = false;
      hoja.hidden = false;
      document.documentElement.classList.add('bloqueado');
    }
    hoja.scrollTop = 0;
    (foco || $('#hoja-cerrar')).focus({ preventScroll: true });
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
    var esGift = p.lista === 'gift';
    var montos = esGift
      ? '<span class="hoja__pregunta" id="t-monto">Elegí el monto</span>' +
        '<div class="montos" role="group" aria-labelledby="t-monto">' + gifts().map(function (g, i) {
          return '<button class="turno" type="button" data-monto="' + esc(g.id) + '" aria-pressed="' + (g.id === p.id) + '">' + esc(montoDe(g, i)) + '</button>';
        }).join('') + '</div>'
      : '';
    contenido.innerHTML =
      '<img class="hoja__img" src="' + esc(p.fotos[0]) + '" width="960" height="1200" alt="' + esc(p.nombre) + '">' +
      '<div class="hoja__cuerpo">' +
        '<span class="hoja__cat">' + esc((p.cat || '').toUpperCase()) + '</span>' +
        '<span class="hoja__nombre">' + esc(p.nombre) + '</span>' +
        '<span class="hoja__precio">' + (sin ? 'Agotado' : esc(esGift ? montoDe(p, gifts().indexOf(p)) : precio(p.precio))) + '</span>' +
        '<span class="hoja__desc">' + esc(p.desc) + '</span>' +
        montos +
        '<span class="hoja__nota">Retiro en el Dpto 319 o envío a coordinar.</span>' +
        '<div class="hoja__comprar">' +
          '<div class="cantidad">' +
            '<button type="button" data-ficha="menos" aria-label="Restar"' + (sin || fichaEstado.qty <= 1 ? ' disabled' : '') + '>−</button>' +
            '<span class="cantidad__n" aria-live="polite">' + fichaEstado.qty + '</span>' +
            '<button type="button" data-ficha="mas" aria-label="Sumar"' + (sin || fichaEstado.qty >= resto ? ' disabled' : '') + '>+</button>' +
          '</div>' +
          '<button class="btn--grande" type="button" data-ficha="agregar"' + (sin || resto <= 0 ? ' disabled' : '') + '>' +
            (sin ? 'Agotado' : resto <= 0 ? 'Ya tenés todo el stock' : 'Agregar al carrito') + '</button>' +
        '</div>' +
        '<a class="hoja__link" href="' + esc(wa('Hola! Quiero consultar por ' + p.nombre + '.')) + '" target="_blank" rel="noopener">Consultar por WhatsApp</a>' +
        (esGift ? '' : similares(p)) +
      '</div>';
  }

  /* También te puede gustar: 4 productos, primero de la misma categoría.
     Arranca después del producto abierto (así cada ficha sugiere otros).
     Las gift cards no se sugieren. */
  function similares(p) {
    var todos = datos.productos, i = todos.indexOf(p);
    var lista = todos.slice(i + 1).concat(todos.slice(0, i)).filter(deTienda);
    var misma = lista.filter(function (q) { return q.cat === p.cat; });
    var resto = lista.filter(function (q) { return q.cat !== p.cat; });
    var elegidos = misma.concat(resto).slice(0, 4);
    if (!elegidos.length) return '';
    return '<div class="similares">' +
      '<span class="similares__titulo">También te puede <span class="fuerte">gustar</span></span>' +
      '<div class="similares__lista" role="list">' + elegidos.map(function (q) {
        return '<button class="similar" type="button" role="listitem" data-abrir="' + esc(q.id) + '">' +
          '<img src="' + esc(chica(q.fotos[0])) + '" width="132" height="164" loading="lazy" alt="' + esc(q.nombre) + '">' +
          '<span class="similar__nombre">' + esc(q.nombre) + '</span>' +
          '<span class="similar__precio">' + (agotado(q) ? 'Agotado' : esc(precio(q.precio))) + '</span>' +
        '</button>';
      }).join('') + '</div>' +
    '</div>';
  }

  /* ---------- Ficha de servicio (reserva por WhatsApp) ---------- */
  function abrirServicio(id) {
    var v = datos.servicios.filter(function (s) { return s.id === id; })[0];
    if (!v) return;
    fichaEstado = { servicio: v, turno: 'Tarde' };
    pintarServicio();
    abrirHoja('servicio', v.nombre);
  }
  function mensajeServicio() {
    var v = fichaEstado.servicio;
    return 'Hola! Quiero reservar ' + v.nombre + ' (' + v.dur + ', ' + precio(v.precio) + '), me queda mejor ' + fichaEstado.turno.toLowerCase() + '.';
  }
  function pintarServicio() {
    var v = fichaEstado.servicio;
    var foto = v.antesDespues
      ? '<div class="antes-despues">' +
          '<div><img src="' + esc(v.antesDespues.antes) + '" alt="' + esc(v.nombre) + ': antes"><span>ANTES</span></div>' +
          '<div><img src="' + esc(v.antesDespues.despues) + '" alt="' + esc(v.nombre) + ': después"><span class="despues">DESPUÉS</span></div>' +
        '</div>'
      : '<img class="hoja__img hoja__img--servicio" src="' + esc(v.img) + '" alt="' + esc(v.nombre) + '">';
    contenido.innerHTML = foto +
      '<div class="hoja__cuerpo hoja__cuerpo--servicio">' +
        '<span class="hoja__cat">BEAUTY ROOM</span>' +
        '<span class="hoja__nombre">' + esc(v.nombre) + '</span>' +
        '<span class="hoja__dur">' + esc(v.dur) + ' · <strong>' + esc(precio(v.precio)) + '</strong></span>' +
        '<span class="hoja__pregunta" id="t-turno">¿Cuándo te queda mejor?</span>' +
        '<div class="turnos" role="group" aria-labelledby="t-turno">' +
          ['Mañana', 'Tarde', 'Sábado'].map(function (u) {
            return '<button class="turno" type="button" data-turno="' + u + '" aria-pressed="' + (u === fichaEstado.turno) + '">' + u + '</button>';
          }).join('') +
        '</div>' +
        '<a class="btn--grande" id="reservar-wa" href="' + esc(wa(mensajeServicio())) + '" target="_blank" rel="noopener" style="height:56px">Reservar por WhatsApp</a>' +
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

  /* ---------- Carrito ---------- */
  function lineas() {
    return Carrito.items().map(function (i) { return { p: porId[i.id], qty: i.qty }; })
      .filter(function (l) { return l.p; });
  }
  function totalPrecio(ls) {
    var faltan = ls.some(function (l) { return typeof l.p.precio !== 'number'; });
    if (faltan) return '$ [total]';
    return precio(ls.reduce(function (s, l) { return s + l.p.precio * l.qty; }, 0));
  }
  function nombreLinea(p) {
    return p.lista === 'gift' ? p.nombre + ' (' + montoDe(p, gifts().indexOf(p)) + ')' : p.nombre;
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
        '<a class="btn btn--sec" href="#tienda" data-cerrar>VER LOS PRODUCTOS</a>';
    } else {
      var pedido = 'Hola! Quiero hacer este pedido:\n' + ls.map(function (l) {
        return '· ' + l.qty + ' x ' + nombreLinea(l.p);
      }).join('\n');
      cuerpo =
        '<ul class="carrito__items">' + ls.map(function (l) {
          var resto = typeof l.p.stock === 'number' ? l.p.stock - l.qty : Infinity;
          return '<li class="item">' +
            '<img src="' + esc(chica(l.p.fotos[0])) + '" width="72" height="90" alt="">' +
            '<div class="item__datos">' +
              '<div class="item__fila"><span class="item__nombre">' + esc(nombreLinea(l.p)) + '</span><span class="item__precio">' + esc(precio(l.p.precio)) + '</span></div>' +
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
        '<button class="btn--grande" type="button" data-pagar>Pagar</button>' +
        '<p class="carrito__pronto" id="pronto" role="status"' + (fichaEstado.pronto ? '' : ' hidden') + '>Próximamente vas a poder pagar online acá. Mientras tanto, hacé tu pedido por WhatsApp.</p>' +
        '<span class="hoja__nota" style="text-align:center">Retiro en el Dpto 319 o envío a coordinar.</span>' +
        '<a class="hoja__link" href="' + esc(wa(pedido)) + '" target="_blank" rel="noopener">Pedir por WhatsApp</a>';
    }
    contenido.innerHTML =
      '<div class="hoja__cuerpo hoja__cuerpo--sin-foto">' +
        '<span class="hoja__cat">TU PEDIDO</span>' +
        '<span class="hoja__nombre">Tu carrito</span>' +
        cuerpo +
      '</div>';
  }

  /* Fase 2: acá se crea la preferencia de Mercado Pago (/api/crear-pago). */
  function iniciarPago(carrito) { /* eslint-disable-line no-unused-vars */ }
  window.iniciarPago = iniciarPago;

  /* ---------- Menú ---------- */
  function abrirMenu() {
    var links = [
      ['JOYAS', '#tienda', 'Joyas'], ['LENTES', '#tienda', 'Lentes'], ['TODOS LOS PRODUCTOS', '#tienda', 'todos'],
      ['BEAUTY ROOM', '#beauty'], ['GIFT CARD', '#', null, 'gift'], ['CAPACITACIONES', '#cursos'], ['EL DEPTO', '#depto']
    ];
    var c = datos.config;
    contenido.innerHTML =
      '<nav class="menu" aria-label="Menú">' +
        '<img class="menu__logo" src="img/logos/logo-completo.svg" alt="depto beauty room" width="250" height="106">' +
        '<ul class="menu__lista">' + links.map(function (l) {
          var g = l[3] === 'gift' ? gifts()[0] : null;
          var attr = g ? ' data-abrir="' + esc(g.id) + '"' : ' data-cerrar' + (l[2] ? ' data-filtro="' + esc(l[2]) + '"' : '');
          return '<li><a href="' + esc(l[1]) + '"' + attr + '>' + esc(l[0]) + FLECHA + '</a></li>';
        }).join('') + '</ul>' +
        '<div class="menu__pie">' +
          '<a href="' + esc(wa('Hola! Quiero reservar un turno.')) + '" target="_blank" rel="noopener">Turnos por WhatsApp</a>' +
          '<a href="https://www.instagram.com/' + esc(c.instagram || 'deptobr') + '/" target="_blank" rel="noopener">Instagram @' + esc(c.instagram || 'deptobr') + '</a>' +
          '<span>Retiro en el Dpto 319 · Envíos a coordinar</span>' +
        '</div>' +
      '</nav>';
    abrirHoja('menu', 'Menú');
  }

  /* ---------- Búsqueda ---------- */
  function sinTildes(t) { return String(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function abrirBuscar() {
    contenido.innerHTML =
      '<div class="hoja__cuerpo hoja__cuerpo--sin-foto">' +
        '<label class="hoja__cat" for="buscar-campo">BUSCAR</label>' +
        '<input class="buscar__campo" id="buscar-campo" type="search" placeholder="Aros, lentes, manicuría…" autocomplete="off" enterkeyhint="search">' +
        '<div id="buscar-res" aria-live="polite"></div>' +
      '</div>';
    abrirHoja('buscar', 'Buscar', $('#buscar-campo'));
    pintarBusqueda('');
    $('#buscar-campo').addEventListener('input', function (e) { pintarBusqueda(e.target.value); });
  }
  function pintarBusqueda(q) {
    var t = sinTildes(q.trim());
    var prods = datos.productos.filter(deTienda).filter(function (p) {
      return !t || sinTildes(p.nombre + ' ' + p.cat + ' ' + p.desc).indexOf(t) !== -1;
    });
    var servs = datos.servicios.filter(function (v) {
      return t && sinTildes(v.nombre + ' ' + v.grupo).indexOf(t) !== -1;
    });
    if (!t) prods = prods.filter(function (p) { return p.destacado; });
    var html = servs.map(function (v) {
      return '<li><button class="resultado" type="button" data-servicio="' + esc(v.id) + '">' +
        '<img src="' + esc(chica(v.img)) + '" width="56" height="64" alt="">' +
        '<span class="resultado__datos"><span>' + esc(v.nombre) + '</span><span class="servicio__sub">Beauty Room · ' + esc(v.dur) + '</span><span class="fuerte">' + esc(precio(v.precio)) + '</span></span>' +
      '</button></li>';
    }).concat(prods.map(function (p) {
      return '<li><button class="resultado" type="button" data-abrir="' + esc(p.id) + '">' +
        '<img src="' + esc(chica(p.fotos[0])) + '" width="56" height="64" alt="">' +
        '<span class="resultado__datos"><span>' + esc(p.nombre) + '</span><span class="servicio__sub">' + esc(p.cat) + '</span><span class="fuerte">' + (agotado(p) ? 'Agotado' : esc(precio(p.precio))) + '</span></span>' +
      '</button></li>';
    })).join('');
    $('#buscar-res').innerHTML = html
      ? (t ? '' : '<span class="servicio__sub">Destacados</span>') + '<ul class="buscar__lista">' + html + '</ul>'
      : '<p class="buscar__nada">No encontramos nada con “' + esc(q) + '”. Probá con otra palabra o escribinos por WhatsApp.</p>';
  }

  /* =========================================================
     Agregar: aviso, bolsa que se balancea, contador
     ========================================================= */
  var toast = $('#toast'), bolsa = $('#bolsa'), tToast = null, vaivenes = 0;

  function sumar(id, n) {
    var p = porId[id];
    if (!p || agotado(p)) return;
    var sumado = Carrito.agregar(id, n, typeof p.stock === 'number' ? p.stock : undefined);
    avisar(sumado > 0 ? 'Agregado a tu carrito' : 'No hay más stock de este producto');
  }

  function avisar(texto) {
    clearTimeout(tToast);
    toast.textContent = texto;
    toast.hidden = false;
    tToast = setTimeout(function () { toast.hidden = true; }, 2000);
    vaivenes++;
    bolsa.classList.remove('colgar-a', 'colgar-b');
    bolsa.classList.add(vaivenes % 2 ? 'colgar-a' : 'colgar-b');
  }

  function actualizarContador() {
    var n = Carrito.total();
    var c = $('#carrito-contador');
    c.textContent = n;
    c.hidden = n === 0;
    $('#carrito-btn').setAttribute('aria-label', 'Carrito, ' + n + (n === 1 ? ' producto' : ' productos'));
  }

  /* =========================================================
     Barra del carrito (y el WhatsApp sube cuando aparece)
     ========================================================= */
  var barra = $('#barra');
  function actualizarBarra() {
    var n = Carrito.total();
    var ver = n > 0 && !abierta;
    barra.hidden = !ver;
    document.body.classList.toggle('con-barra', ver);
    if (!ver) return;
    $('#barra-izq').textContent = 'Ver carrito (' + n + ')';
    $('#barra-der').textContent = totalPrecio(lineas()) + ' →';
  }

  /* =========================================================
     Eventos
     ========================================================= */
  function irA(sel) {
    var destino = sel && sel.length > 1 ? document.querySelector(sel) : null;
    if (destino) destino.scrollIntoView({ behavior: reducido ? 'auto' : 'smooth' });
    else if (sel === '#') window.scrollTo({ top: 0, behavior: reducido ? 'auto' : 'smooth' });
  }

  function eventos() {
    document.addEventListener('click', function (e) {
      var t = e.target.closest('button, a');
      if (!t) return;

      if (t.hasAttribute('data-abrir')) { e.preventDefault(); abrirProducto(t.getAttribute('data-abrir')); return; }
      if (t.hasAttribute('data-sumar')) { sumar(t.getAttribute('data-sumar'), 1); return; }
      if (t.hasAttribute('data-servicio')) { abrirServicio(t.getAttribute('data-servicio')); return; }
      if (t.hasAttribute('data-turno')) { elegirTurno(t.getAttribute('data-turno')); return; }
      if (t.hasAttribute('data-monto')) {
        fichaEstado.id = t.getAttribute('data-monto');
        fichaEstado.qty = 1;
        pintarProducto();
        var m = contenido.querySelector('[data-monto="' + fichaEstado.id + '"]');
        if (m) m.focus();
        return;
      }
      if (t.hasAttribute('data-filtro')) {
        filtrar(t.getAttribute('data-filtro'));
        if (t.hasAttribute('data-cerrar') || t.id === 'ver-todos') {
          e.preventDefault();
          cerrarHoja();
          irA('#tienda');
        }
        return; /* los banners siguen su href (#tienda) */
      }
      if (t.hasAttribute('data-cerrar')) {
        e.preventDefault();
        cerrarHoja();
        irA(t.getAttribute('href'));
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
    $('#menu-btn').addEventListener('click', abrirMenu);
    $('#buscar-btn').addEventListener('click', abrirBuscar);
    $('#hoja-cerrar').addEventListener('click', cerrarHoja);
    velo.addEventListener('click', cerrarHoja);
    barra.addEventListener('click', abrirCarrito);

    /* Esc cierra · Tab queda atrapado dentro del panel */
    document.addEventListener('keydown', function (e) {
      if (hoja.hidden) return;
      if (e.key === 'Escape') { cerrarHoja(); return; }
      if (e.key !== 'Tab') return;
      var f = Array.prototype.filter.call(
        hoja.querySelectorAll('button:not([disabled]), a[href], input, [tabindex]:not([tabindex="-1"])'),
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
  }

  /* =========================================================
     Video de cursos: solo se reproduce en pantalla
     ========================================================= */
  /* Video del hero: cada pantalla descarga solo su versión (horizontal / vertical) */
  function heroVideo() {
    var v = document.getElementById('hero-video');
    if (!v || reducido) { if (v) v.remove(); return; }
    var mq = window.matchMedia('(min-width: 768px)');
    var actual = '';
    function poner() {
      var src = mq.matches ? v.getAttribute('data-h') : v.getAttribute('data-v');
      if (src === actual) return;
      actual = src;
      v.src = src;
      v.load();
      var p = v.play(); if (p && p.catch) p.catch(function () {});
    }
    poner();
    if (mq.addEventListener) mq.addEventListener('change', poner); else mq.addListener(poner);
  }

  function videos() {
    var vids = document.querySelectorAll('[data-video]');
    if (reducido || !('IntersectionObserver' in window)) return; /* queda el poster */
    var mq = window.matchMedia('(min-width: 768px)');
    function fuente(v) { return mq.matches ? v.getAttribute('data-h') : v.getAttribute('data-v'); }
    function reproducir(v) {
      var src = fuente(v);
      if (src && v.getAttribute('src') !== src) { v.src = src; v.load(); }
      var pr = v.play(); if (pr && pr.catch) pr.catch(function () {});
    }
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) {
        var v = x.target;
        if (x.isIntersecting) reproducir(v); else v.pause();
      });
    }, { rootMargin: '200px 0px' });
    vids.forEach(function (v) { io.observe(v); });
    /* si se rota o redimensiona, cambia a la otra versión (solo si ya se cargó una) */
    var cambio = function () { vids.forEach(function (v) { if (v.getAttribute('src') && v.getAttribute('src') !== fuente(v)) reproducir(v); }); };
    if (mq.addEventListener) mq.addEventListener('change', cambio); else mq.addListener(cambio);
  }

  /* =========================================================
     Carrusel de El depto (fotos desde config.deptoCarrusel)
     ========================================================= */
  function carrusel() {
    var fotos = (datos.config && datos.config.deptoCarrusel) || [];
    var caja = $('#depto-carrusel'); if (!caja) return;
    var pista = $('#depto-pista'), puntos = $('#depto-puntos');
    if (!fotos.length) { caja.hidden = true; return; }
    pista.innerHTML = fotos.map(function (f, i) {
      var set = f.img480 ? ' srcset="' + esc(f.img480) + ' 480w, ' + esc(f.img) + ' 960w" sizes="(min-width: 1024px) 50vw, 100vw"' : '';
      return '<div class="carrusel__slide" role="group" aria-roledescription="foto" aria-label="' + (i + 1) + ' de ' + fotos.length + '">' +
        '<img src="' + esc(f.img) + '"' + set + (i ? ' loading="lazy"' : '') + ' alt="' + esc(f.alt || 'El depto') + '"></div>';
    }).join('');
    if (fotos.length < 2) return;
    puntos.innerHTML = fotos.map(function (f, i) {
      return '<button type="button" class="carrusel__punto" data-i="' + i + '" aria-label="Ir a la foto ' + (i + 1) + '"></button>';
    }).join('');
    var ant = caja.querySelector('.carrusel__flecha--ant'), sig = caja.querySelector('.carrusel__flecha--sig');
    ant.hidden = sig.hidden = false;
    var n = fotos.length, actual = 0;
    function ir(i) {
      i = (i + n) % n;
      pista.scrollTo({ left: i * pista.clientWidth, behavior: reducido ? 'auto' : 'smooth' });
    }
    function marcar() {
      actual = Math.round(pista.scrollLeft / Math.max(1, pista.clientWidth));
      Array.prototype.forEach.call(puntos.children, function (b, i) { b.setAttribute('aria-current', i === actual ? 'true' : 'false'); });
    }
    pista.addEventListener('scroll', function () { window.requestAnimationFrame(marcar); }, { passive: true });
    puntos.addEventListener('click', function (e) { var b = e.target.closest('[data-i]'); if (b) ir(+b.getAttribute('data-i')); });
    ant.addEventListener('click', function () { ir(actual - 1); });
    sig.addEventListener('click', function () { ir(actual + 1); });
    marcar();
    /* Autoplay lento (5 s): solo con la sección a la vista, se pausa al tocar o pasar el mouse
       y no corre con reduced-motion */
    if (reducido || !('IntersectionObserver' in window)) return;
    var timer = null, visible = false, quieto = false;
    function parar() { clearInterval(timer); timer = null; }
    function seguir() { if (!timer && visible && !quieto) timer = setInterval(function () { ir(actual + 1); }, 5000); }
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) seguir(); else parar(); }, { threshold: 0.5 }).observe(caja);
    caja.addEventListener('pointerdown', function () { quieto = true; parar(); }); /* al tocar, queda pausado */
    caja.addEventListener('mouseenter', function () { quieto = true; parar(); });
    caja.addEventListener('mouseleave', function () { quieto = false; seguir(); });
    caja.addEventListener('focusin', function () { quieto = true; parar(); });
  }

  /* =========================================================
     Inicio
     ========================================================= */
  heroVideo();
  videos();
  actualizarContador();

  Promise.all([
    getJSON('data/productos.json'),
    getJSON('data/servicios.json'),
    getJSON('data/cursos.json'),
    getJSON('data/config.json')
  ]).then(function (r) {
    datos.productos = r[0].productos || [];
    datos.servicios = r[1].servicios || [];
    datos.grupos = r[1].grupos || [];
    datos.cursos = r[2].cursos || [];
    datos.config = r[3];
    datos.productos.forEach(function (p) { porId[p.id] = p; });

    Carrito.limpiar(Object.keys(porId));
    renderConfig();
    renderCategorias();
    carrusel();
    renderTienda();
    renderServicios();
    renderCursos();
    eventos();
    actualizarContador();
    actualizarBarra();
  }).catch(function (err) {
    console.error('No se pudieron cargar los datos. Abrí el sitio con un servidor local (ej. Live Server o "npx serve").', err);
  });
})();
