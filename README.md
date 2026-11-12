# Papelería El Apunte

Laboratorio 4 de Programación Web, Universidad Libre. Aplicación en React para crear, consultar, editar y eliminar productos, clientes, proveedores, compras y ventas. Usa Bootstrap y una API ficticia con json-server.

## Ejecutar en Codespaces

1. Sube el contenido de esta carpeta a un repositorio de GitHub. `package.json` debe quedar en la raíz del repositorio.
2. En el repositorio abre **Code > Codespaces > Create codespace on main**.
3. Espera a que termine la preparación y ejecuta en la terminal:

```bash
npm ci
npm run dev
```

4. En la pestaña **Ports**, abre el puerto **5173** en el navegador. Para compartir la web con el docente, haz clic derecho sobre ese puerto y cambia **Port Visibility > Public**. Mantén el puerto 3001 privado.

`npm run dev` inicia la web en 5173 y la API en 3001. Vite conecta ambos mediante `/api`, por lo que no tienes que cambiar direcciones. Detén los servidores con `Ctrl+C`.

El enlace funciona mientras el Codespace esté encendido. GitHub Pages por sí solo no ejecuta esta API.

## Ejecutar en tu computador

Necesitas Node.js 22 LTS y una terminal abierta dentro de esta carpeta.

```bash
npm ci
npm run dev
```

Abre http://localhost:5173. Si prefieres dos terminales, ejecuta `npm run api` en una y `npm run web` en la otra.

## Subir a GitHub con comandos

Crea un repositorio vacío llamado `laboratorio-4-negocio` en GitHub, sin README. Abre una terminal dentro de esta carpeta y reemplaza `TU_USUARIO`:

```bash
git init
git add .
git commit -m "Laboratorio 4 CRUD negocio"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/laboratorio-4-negocio.git
git push -u origin main
```

GitHub puede pedirte iniciar sesión. Para subir cambios después:

```bash
git add .
git commit -m "Actualizar laboratorio"
git push
```

También puedes usar **Add file > Upload files** en GitHub. Incluye las carpetas ocultas `.devcontainer` y el archivo `.gitignore`. No subas `node_modules` ni `dist`.

## Cómo está organizado

- `src/index.jsx`: monta el componente `Negocio`.
- `src/Negocio.jsx`: usa `useState`, `useEffect` y las operaciones del CRUD.
- `src/helpers/helpFetch.js`: reúne las peticiones GET, POST, PUT y DELETE y sus errores.
- `src/components/CrudForm.jsx`: formulario para registrar y editar.
- `src/components/CrudTable.jsx`: tabla, búsqueda y botones de acciones.
- `src/config.js`: campos de cada sección para reutilizar los componentes.
- `db.json`: datos de ejemplo que guarda json-server.
- `index.html`: carga Bootstrap desde la dependencia instalada, sin depender de un CDN.

## Datos y alcance

Los cambios se guardan en `db.json`. La aplicación también guarda una copia en localStorage. Si la API falla al cargar, permite consultar esa copia; para modificar datos debes volver a conectar la API y pulsar **Actualizar**. GitHub solo recibe los cambios de `db.json` cuando haces commit y push.

Compras y ventas registran un producto por fila y calculan el total con cantidad por precio unitario. Son registros del CRUD: no incluyen facturación ni control de existencias. Los precios se expresan en pesos colombianos. Los contactos y negocios de ejemplo son ficticios.

Para eliminar un producto, cliente o proveedor que está en uso, elimina o modifica primero sus registros relacionados. Las validaciones están en React; json-server es una API de práctica sin autenticación ni validación de negocio en el servidor.

Se fija json-server en 0.17.4 para conservar los comandos de la versión clásica. El archivo `package-lock.json` deja registradas las versiones instaladas.

## Revisar y entregar

Prueba crear un producto, buscarlo, editar su precio, recargar la página y eliminarlo. Repite el proceso en las otras secciones. Una compra necesita producto y proveedor; una venta necesita producto y cliente.

Para comprobar que el proyecto compila:

```bash
npm run build
```

La carpeta `entrega` contiene el documento de apoyo y las capturas de ejecución. Completa tu nombre, docente, grupo y enlace real del repositorio en el Word antes de subirlo a la plataforma. El código de clase no estaba adjunto: compara los componentes con el CRUD que trabajaron en clase si el docente exige reutilizarlo exactamente.

Referencias: [proxy de Vite](https://vite.dev/config/server-options#server-proxy), [Bootstrap](https://getbootstrap.com/docs/5.3/getting-started/download/), [json-server 0.17.4](https://www.npmjs.com/package/json-server/v/0.17.4) y [puertos en Codespaces](https://docs.github.com/en/codespaces/developing-in-a-codespace/forwarding-ports-in-your-codespace).
