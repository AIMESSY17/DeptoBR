/* =========================================================
   Carrito: estado + localStorage.
   Guarda solo { id, qty }. Si localStorage falla (modo privado,
   bloqueado), sigue funcionando en memoria.
   ========================================================= */
(function () {
  var CLAVE = 'dbr-carrito';
  var items = [];
  var oyentes = [];

  function leer() {
    try {
      var crudo = localStorage.getItem(CLAVE);
      var datos = crudo ? JSON.parse(crudo) : [];
      return Array.isArray(datos) ? datos.filter(function (i) { return i && typeof i.id === 'string' && i.qty > 0; }) : [];
    } catch (e) { return []; }
  }

  function guardar() {
    try { localStorage.setItem(CLAVE, JSON.stringify(items)); } catch (e) { /* queda en memoria */ }
  }

  function avisar() {
    guardar();
    oyentes.forEach(function (fn) { fn(items.slice()); });
  }

  function buscar(id) {
    for (var i = 0; i < items.length; i++) if (items[i].id === id) return items[i];
    return null;
  }

  items = leer();

  window.Carrito = {
    items: function () { return items.slice(); },
    cantidad: function (id) { var it = buscar(id); return it ? it.qty : 0; },
    total: function () { return items.reduce(function (s, i) { return s + i.qty; }, 0); },

    /* Suma n unidades; max = stock disponible (opcional). Devuelve lo que sumó. */
    agregar: function (id, n, max) {
      var it = buscar(id);
      var actual = it ? it.qty : 0;
      var nuevo = actual + n;
      if (typeof max === 'number') nuevo = Math.min(nuevo, max);
      var sumado = nuevo - actual;
      if (sumado <= 0) return 0;
      if (it) it.qty = nuevo; else items.push({ id: id, qty: nuevo });
      avisar();
      return sumado;
    },
    fijar: function (id, qty) {
      var it = buscar(id);
      if (!it) return;
      if (qty <= 0) items = items.filter(function (i) { return i.id !== id; });
      else it.qty = qty;
      avisar();
    },
    quitar: function (id) {
      items = items.filter(function (i) { return i.id !== id; });
      avisar();
    },
    /* Saca productos que ya no existen en el catálogo */
    limpiar: function (idsValidos) {
      var antes = items.length;
      items = items.filter(function (i) { return idsValidos.indexOf(i.id) !== -1; });
      if (items.length !== antes) avisar();
    },
    alCambiar: function (fn) { oyentes.push(fn); }
  };
})();
