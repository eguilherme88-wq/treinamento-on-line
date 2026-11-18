"use strict";

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", event => {
  if (event.request.mode !== "navigate" ||
      !event.request.url.startsWith(self.registration.scope)) return;
  event.respondWith(fetch(event.request).catch(() => new Response(
    '<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Partner Treinamentos</title><h1>Sem conexão</h1><p>Conecte-se à internet e recarregue para acessar os treinamentos.</p></html>',
    { status: 503, headers: { "Content-Type": "text/html; charset=utf-8" } }
  )));
});
