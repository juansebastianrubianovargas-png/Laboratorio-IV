// Todas las peticiones del CRUD pasan por este helper.
export function helpFetch() {
  async function request(url, options = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(url, {
        method: options.method || 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: options.body === undefined ? undefined : JSON.stringify(options.body),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`La API respondió con el código ${response.status}.`);
      }

      return response.status === 204 ? null : await response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('La API tardó demasiado en responder. Revisa que esté encendida.');
      }
      if (error instanceof TypeError) {
        throw new Error('No se pudo conectar con la API. Revisa que esté encendida.');
      }
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  return {
    get: (url) => request(url),
    post: (url, body) => request(url, { method: 'POST', body }),
    put: (url, body) => request(url, { method: 'PUT', body }),
    del: (url) => request(url, { method: 'DELETE' }),
  };
}
