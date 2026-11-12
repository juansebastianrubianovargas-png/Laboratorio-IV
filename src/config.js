// Cada módulo usa el mismo formulario y la misma tabla del CRUD.
export const modulos = {
  productos: {
    titulo: 'Productos', singular: 'producto', descripcion: 'Consulta los artículos y sus precios de venta.',
    campos: [
      { nombre: 'nombre', etiqueta: 'Nombre', tipo: 'text', max: 80 },
      { nombre: 'categoria', etiqueta: 'Categoría', tipo: 'text', max: 50 },
      { nombre: 'precio', etiqueta: 'Precio de venta', tipo: 'number', min: 0.01, moneda: true },
      { nombre: 'proveedorId', etiqueta: 'Proveedor', tipo: 'select', recurso: 'proveedores' },
    ],
  },
  clientes: {
    titulo: 'Clientes', singular: 'cliente', descripcion: 'Guarda los datos de contacto de tus clientes.',
    campos: [
      { nombre: 'nombre', etiqueta: 'Nombre', tipo: 'text', max: 80 },
      { nombre: 'correo', etiqueta: 'Correo', tipo: 'email', max: 100 },
      { nombre: 'telefono', etiqueta: 'Teléfono', tipo: 'tel', max: 20 },
    ],
  },
  proveedores: {
    titulo: 'Proveedores', singular: 'proveedor', descripcion: 'Registra las empresas que abastecen la papelería.',
    campos: [
      { nombre: 'nombre', etiqueta: 'Nombre', tipo: 'text', max: 80 },
      { nombre: 'correo', etiqueta: 'Correo', tipo: 'email', max: 100 },
      { nombre: 'telefono', etiqueta: 'Teléfono', tipo: 'tel', max: 20 },
    ],
  },
  compras: {
    titulo: 'Compras', singular: 'compra', descripcion: 'Registra una compra de un producto a un proveedor.',
    campos: [
      { nombre: 'productoId', etiqueta: 'Producto', tipo: 'select', recurso: 'productos' },
      { nombre: 'proveedorId', etiqueta: 'Proveedor', tipo: 'select', recurso: 'proveedores' },
      { nombre: 'fecha', etiqueta: 'Fecha', tipo: 'date' },
      { nombre: 'cantidad', etiqueta: 'Cantidad', tipo: 'number', min: 1, entero: true },
      { nombre: 'precioUnitario', etiqueta: 'Costo unitario', tipo: 'number', min: 0.01, moneda: true },
    ],
    total: true,
  },
  ventas: {
    titulo: 'Ventas', singular: 'venta', descripcion: 'Registra una venta de un producto a un cliente.',
    campos: [
      { nombre: 'productoId', etiqueta: 'Producto', tipo: 'select', recurso: 'productos' },
      { nombre: 'clienteId', etiqueta: 'Cliente', tipo: 'select', recurso: 'clientes' },
      { nombre: 'fecha', etiqueta: 'Fecha', tipo: 'date' },
      { nombre: 'cantidad', etiqueta: 'Cantidad', tipo: 'number', min: 1, entero: true },
      { nombre: 'precioUnitario', etiqueta: 'Precio unitario', tipo: 'number', min: 0.01, moneda: true },
    ],
    total: true,
  },
};

export const datosVacios = () => Object.fromEntries(Object.keys(modulos).map((key) => [key, []]));
export const dinero = (valor) => new Intl.NumberFormat('es-CO', {
  style: 'currency', currency: 'COP', maximumFractionDigits: 2,
}).format(valor);

export function mostrarValor(campo, valor, datos) {
  if (campo.tipo === 'select') {
    return datos[campo.recurso].find((item) => String(item.id) === String(valor))?.nombre || 'Registro no disponible';
  }
  if (campo.moneda) return dinero(valor);
  if (campo.tipo === 'date') return String(valor).split('-').reverse().join('/');
  return valor;
}
