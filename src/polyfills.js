// src/polyfills.js
// Polyfill más agresivo para Supabase
(function() {
    // Asegurar que global existe y apunta a globalThis
    if (typeof global === 'undefined') {
      globalThis.global = globalThis;
    }
    
    // Asegurar que global.global también existe (algunos casos edge)
    if (typeof globalThis.global === 'undefined') {
      globalThis.global = globalThis;
    }
    
    // Polyfill específico para headers
    if (!globalThis.headers) {
      globalThis.headers = globalThis.Headers || {};
    }
    
    if (!globalThis.global.headers) {
      globalThis.global.headers = globalThis.Headers || {};
    }
  
    // Polyfill para process si no existe
    if (!globalThis.process) {
      globalThis.process = { env: {} };
    }
  })();