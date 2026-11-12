import React, { useState } from 'react';
import { dinero, mostrarValor } from '../config';

export default function CrudTable({ config, registros, datos, onEditar, onEliminar, bloqueado }) {
  const [busqueda, setBusqueda] = useState('');
  const normalizar = (valor) => String(valor).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const visibles = registros.filter((registro) => config.campos.some((campo) =>
    normalizar(mostrarValor(campo, registro[campo.nombre], datos)).includes(normalizar(busqueda.trim()))
  ));

  return (
    <section className="table-panel" aria-labelledby="listado-titulo">
      <div className="list-heading">
        <div><h2 id="listado-titulo">Listado de {config.titulo.toLowerCase()}</h2><p className="text-secondary small mb-0">{registros.length} {registros.length === 1 ? 'registro' : 'registros'}</p></div>
        <div className="search-field"><label className="visually-hidden" htmlFor="buscar">Buscar en {config.titulo.toLowerCase()}</label><input id="buscar" type="search" className="form-control" placeholder="Buscar en el listado" value={busqueda} onChange={(event) => setBusqueda(event.target.value)} /></div>
      </div>
      <p className="d-md-none text-secondary small px-3">Desliza la tabla para ver todas las columnas.</p>
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <caption className="visually-hidden">{config.titulo} de la papelería</caption>
          <thead><tr><th scope="col">ID</th>{config.campos.map((campo) => <th scope="col" key={campo.nombre}>{campo.etiqueta}</th>)}{config.total && <th scope="col">Total</th>}<th scope="col">Acciones</th></tr></thead>
          <tbody>
            {visibles.map((registro) => (
              <tr key={registro.id}>
                <td className="text-secondary">{registro.id}</td>
                {config.campos.map((campo) => <td key={campo.nombre}>{mostrarValor(campo, registro[campo.nombre], datos)}</td>)}
                {config.total && <td className="text-nowrap">{dinero(registro.cantidad * registro.precioUnitario)}</td>}
                <td><div className="d-flex gap-2">
                  <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => onEditar(registro)} disabled={bloqueado} aria-label={`Editar ${config.singular} ${registro.id}`}>Editar</button>
                  <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => onEliminar(registro)} disabled={bloqueado} aria-label={`Eliminar ${config.singular} ${registro.id}`}>Eliminar</button>
                </div></td>
              </tr>
            ))}
            {!visibles.length && <tr><td className="empty-row" colSpan={config.campos.length + (config.total ? 3 : 2)}>{registros.length ? 'No hay resultados para esta búsqueda.' : 'Aún no hay registros. Agrega el primero con el formulario.'}</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}
