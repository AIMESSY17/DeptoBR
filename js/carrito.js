/* =========================================================
   Carrito: estado + localStorage.
   Guarda { id, qty, mat } (mat = material elegido en joyas mixtas;
   misma joya en otro material = otra línea, el stock es compartido). Si localStorage falla (modo privado,
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
      return Array.isArray(datos) ? datos.filter(function (i) { return i && typeof i.id === 'string' && i.qty > 0; }).map(function (i) { return { id: i.id, qty: i.qty, mat: typeof i.mat === 'string' ? i.mat : '' }; }) : [];
    } catch (e) { return []; }
  }

  function guardar() {
    try { localStorage.setItem(CLAVE, JSON.stringify(items)); } catch (e) { /* queda en memoria */ }
  }

  function avisar() {
    guardar();
    oyentes.forEach(function (fn) { fn(items.slice()); });
  }

  function buscar(id, mat) {
    mat = mat || '';
    for (var i = 0; i < items.length; i++) if (items[i].id === id && items[i].mat === mat) return items[i];
    return null;
  }
  /* Unidades de un producto sumando todos sus materiales (para el stock) */
  function deProducto(id) {
    return items.reduce(function (s, i) { return s + (i.id === id ? i.qty : 0); }, 0);
  }

  items = leer();

  window.Carrito = {
    items: function () { return items.slice(); },
    cantidad: function (id) { return deProducto(id); },
    total: function () { return items.reduce(function (s, i) { return s + i.qty; }, 0); },

    /* Suma n unidades; max = stock total del producto (opcional, compartido
       entre materiales). Devuelve lo que sumó. */
    agregar: function (id, n, max, mat) {
      var it = buscar(id, mat);
      var sumado = n;
      if (typeof max === 'number') sumado = Math.min(n, max - deProducto(id));
      if (sumado <= 0) return 0;
      if (it) it.qty += sumado; else items.push({ id: id, qty: sumado, mat: mat || '' });
      avisar();
      return sumado;
    },
    fijar: function (id, qty, mat) {
      var it = buscar(id, mat);
      if (!it) return;
      if (qty <= 0) items = items.filter(function (i) { return i !== it; });
      else it.qty = qty;
      avisar();
    },
    quitar: function (id, mat) {
      var it = buscar(id, mat);
      items = items.filter(function (i) { return i !== it; });
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
