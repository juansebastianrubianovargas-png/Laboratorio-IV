import React, { useEffect, useState } from 'react';
import { helpFetch } from './helpers/helpFetch';
import { modulos, datosVacios } from './config';
import CrudForm from './components/CrudForm';
import CrudTable from './components/CrudTable';

const api = helpFetch();
const claveCopia = 'el-apunte-datos-v1';

function guardarCopia(datos) {
  try { localStorage.setItem(claveCopia, JSON.stringify(datos)); }
  catch { /* La API sigue funcionando aunque el navegador no permita guardar la copia. */ }
}

function leerCopia() {
  try {
    const copia = JSON.parse(localStorage.getItem(claveCopia));
    return copia && Object.keys(modulos).every((key) => Array.isArray(copia[key])) ? copia : datosVacios();
  } catch { return datosVacios(); }
}

export default function Negocio() {
  const [modulo, setModulo] = useState('productos');
  const [datos, setDatos] = useState(datosVacios);
  const [editar, setEditar] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [conectado, setConectado] = useState(false);
  const [aviso, setAviso] = useState(null);
  const [recarga, setRecarga] = useState(0);
  const config = modulos[modulo];

  // Al abrir la página o pulsar Actualizar, useEffect consulta las cinco listas.
  useEffect(() => {
    let activo = true;
    setCargando(true);
    async function cargar() {
      try {
        const listas = await Promise.all(Object.keys(modulos).map((key) => api.get(`/api/${key}`)));
        if (!listas.every(Array.isArray)) throw new Error('La API no devolvió las listas esperadas.');
        if (!activo) return;
        const nuevosDatos = Object.fromEntries(Object.keys(modulos).map((key, index) => [key, listas[index]]));
        setDatos(nuevosDatos);
        guardarCopia(nuevosDatos);
        setConectado(true);
        setAviso(null);
      } catch (error) {
        if (!activo) return;
        setDatos(leerCopia());
        setConectado(false);
        setAviso({ tipo: 'warning', texto: `${error.message} Solo puedes consultar la copia del navegador. Inicia la API y pulsa Actualizar.` });
      } finally {
        if (activo) setCargando(false);
      }
    }
    cargar();
    return () => { activo = false; };
  }, [recarga]);

  function cambiarModulo(key) {
    setModulo(key);
    setEditar(null);
    if (conectado) setAviso(null);
  }

  function actualizarLista(lista) {
    const nuevosDatos = { ...datos, [modulo]: lista };
    setDatos(nuevosDatos);
    guardarCopia(nuevosDatos);
  }

  async function guardar(registro) {
    setGuardando(true);
    setAviso(null);
    try {
      if (editar) {
        const actualizado = await api.put(`/api/${modulo}/${encodeURIComponent(registro.id)}`, registro);
        actualizarLista(datos[modulo].map((item) => item.id === registro.id ? actualizado : item));
      } else {
        const creado = await api.post(`/api/${modulo}`, registro);
        actualizarLista([...datos[modulo], creado]);
      }
      setAviso({ tipo: 'success', texto: editar ? 'Cambios guardados.' : 'Registro guardado.' });
      setEditar(null);
      return true;
    } catch (error) {
      setAviso({ tipo: 'danger', texto: `No se pudo guardar. ${error.message} Pulsa Actualizar para revisar los datos antes de volver a intentarlo.` });
      return false;
    } finally { setGuardando(false); }
  }

  async function eliminar(registro) {
    // Evita dejar compras, ventas o productos con referencias a registros borrados.
    const relacionado = Object.entries(modulos).some(([key, detalle]) => detalle.campos.some((campo) =>
      campo.recurso === modulo && datos[key].some((item) => String(item[campo.nombre]) === String(registro.id))
    ));
    if (relacionado) {
      setAviso({ tipo: 'warning', texto: 'Este registro está en uso. Elimina o modifica primero los registros que lo relacionan.' });
      return;
    }
    if (!window.confirm(`¿Eliminar el ${config.singular} con ID ${registro.id}? Esta acción no se puede deshacer.`)) return;
    setGuardando(true);
    setAviso(null);
    try {
      await api.del(`/api/${modulo}/${encodeURIComponent(registro.id)}`);
      actualizarLista(datos[modulo].filter((item) => item.id !== registro.id));
      if (editar?.id === registro.id) setEditar(null);
      setAviso({ tipo: 'success', texto: 'Registro eliminado.' });
    } catch (error) {
      setAviso({ tipo: 'danger', texto: `No se pudo eliminar. ${error.message} Pulsa Actualizar para revisar los datos.` });
    } finally { setGuardando(false); }
  }

  const bloqueado = cargando || guardando || !conectado;

  return (
    <>
      <header className="app-header">
        <div className="container-fluid app-container d-flex align-items-center gap-3">
          <span className="brand-mark" aria-hidden="true">A</span>
          <div><p className="brand-name mb-0">Papelería El Apunte</p><p className="brand-description mb-0">Administración del negocio</p></div>
        </div>
      </header>
      <main className="container-fluid app-container py-4">
        <nav className="module-nav" aria-label="Secciones del negocio">
          {Object.entries(modulos).map(([key, detalle]) => <button type="button" key={key} className={`module-button ${modulo === key ? 'active' : ''}`} onClick={() => cambiarModulo(key)} aria-current={modulo === key ? 'page' : undefined} disabled={guardando || cargando}>{detalle.titulo}</button>)}
        </nav>
        <div className="page-heading">
          <div><h1>{config.titulo}</h1><p className="text-secondary mb-0">{config.descripcion}</p></div>
          <div className="connection-area"><span className={`connection ${conectado ? 'online' : ''}`} role="status">{cargando ? 'Cargando datos…' : conectado ? 'API conectada' : 'Sin conexión'}</span><button className="btn btn-outline-secondary btn-sm" type="button" disabled={cargando || guardando} onClick={() => { setEditar(null); setRecarga(recarga + 1); }}>Actualizar</button></div>
        </div>
        {aviso && <div className={`alert alert-${aviso.tipo}`} role="alert">{aviso.texto}</div>}
        {guardando && <p role="status" className="text-secondary small">Guardando cambios…</p>}
        <div className="row g-4 align-items-start" aria-busy={cargando || guardando}>
          <div className="col-12 col-lg-4 col-xl-3"><CrudForm key={modulo} config={config} datos={datos} editar={editar} onGuardar={guardar} onCancelar={() => setEditar(null)} bloqueado={bloqueado} /></div>
          <div className="col-12 col-lg-8 col-xl-9"><CrudTable key={modulo} config={config} registros={datos[modulo]} datos={datos} bloqueado={bloqueado} onEditar={(registro) => { setEditar(registro); setAviso(null); document.getElementById('form-titulo')?.scrollIntoView({ block: 'nearest' }); }} onEliminar={eliminar} /></div>
        </div>
      </main>
      <footer className="container-fluid app-container app-footer">Laboratorio 4 · Programación web · Universidad Libre</footer>
    </>
  );
}
