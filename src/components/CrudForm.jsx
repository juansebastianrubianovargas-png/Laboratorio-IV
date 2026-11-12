import React, { useEffect, useState } from 'react';
import { dinero } from '../config';

export default function CrudForm({ config, datos, editar, onGuardar, onCancelar, bloqueado }) {
  const [formulario, setFormulario] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    setFormulario(editar || {});
    setError('');
  }, [editar]);

  function cambiar(event) {
    setFormulario({ ...formulario, [event.target.name]: event.target.value });
    setError('');
  }

  async function enviar(event) {
    event.preventDefault();
    const registro = {};
    for (const campo of config.campos) {
      const valor = String(formulario[campo.nombre] ?? '').trim();
      if (!valor) {
        setError(`Completa el campo ${campo.etiqueta.toLowerCase()}.`);
        return;
      }
      if (campo.tipo === 'number') {
        const numero = Number(valor);
        if (!Number.isFinite(numero) || numero < campo.min || numero > 1000000000 || (campo.entero && !Number.isInteger(numero))) {
          setError(`Revisa el campo ${campo.etiqueta.toLowerCase()}.`);
          return;
        }
        registro[campo.nombre] = numero;
      } else if (campo.tipo === 'select') {
        const relacionado = datos[campo.recurso].find((item) => String(item.id) === valor);
        if (!relacionado) {
          setError(`Selecciona un ${campo.etiqueta.toLowerCase()} disponible.`);
          return;
        }
        registro[campo.nombre] = relacionado.id;
      } else {
        registro[campo.nombre] = valor;
      }
    }
    if (editar) registro.id = editar.id;
    const guardado = await onGuardar(registro);
    if (guardado) setFormulario({});
  }

  const faltanOpciones = config.campos.some((campo) => campo.recurso && datos[campo.recurso].length === 0);

  return (
    <section className="form-panel" aria-labelledby="form-titulo">
      <h2 id="form-titulo">{editar ? 'Editar' : 'Nuevo'} {config.singular}</h2>
      <p className="text-secondary small">Todos los campos son obligatorios.</p>
      {faltanOpciones && <p className="alert alert-warning small">Registra primero los datos de las listas desplegables.</p>}
      <form onSubmit={enviar}>
        <fieldset disabled={bloqueado}>
          {config.campos.map((campo) => (
            <div className="mb-3" key={campo.nombre}>
              <label className="form-label" htmlFor={campo.nombre}>{campo.etiqueta}{campo.moneda ? ' (COP)' : ''}</label>
              {campo.tipo === 'select' ? (
                <select className="form-select" id={campo.nombre} name={campo.nombre} value={formulario[campo.nombre] ?? ''} onChange={cambiar} required>
                  <option value="">Selecciona una opción</option>
                  {datos[campo.recurso].map((item) => <option key={item.id} value={item.id}>{item.nombre}</option>)}
                </select>
              ) : (
                <input className="form-control" id={campo.nombre} name={campo.nombre} type={campo.tipo}
                  value={formulario[campo.nombre] ?? ''} onChange={cambiar} required
                  min={campo.min} max={campo.tipo === 'number' ? 1000000000 : undefined}
                  maxLength={campo.max} step={campo.tipo === 'number' ? (campo.entero ? '1' : '0.01') : undefined} />
              )}
            </div>
          ))}
          {config.total && <p className="total-form">Total: <strong>{dinero((Number(formulario.cantidad) || 0) * (Number(formulario.precioUnitario) || 0))}</strong></p>}
          {error && <p className="text-danger small" role="alert">{error}</p>}
          <div className="d-flex flex-wrap gap-2">
            <button className="btn btn-primary" type="submit" disabled={faltanOpciones}>{editar ? 'Guardar cambios' : 'Guardar ' + config.singular}</button>
            {editar && <button className="btn btn-outline-secondary" type="button" onClick={onCancelar}>Cancelar</button>}
          </div>
        </fieldset>
      </form>
    </section>
  );
}
