"use client";

import { useEffect } from "react";

const SERVICE_WORKER_SCRIPT_URL = "/sw.js";
const SERVICE_WORKER_SCOPE = "/";

function clearExistingServiceWorkersAndCaches() {
  void navigator.serviceWorker
    .getRegistrations()
    .then((registrations) =>
      Promise.all(registrations.map((registration) => registration.unregister())),
    );

  if ("caches" in window) {
    void caches
      .keys()
      .then((keys) => Promise.all(keys.map((key) => caches.delete(key))));
  }
}

function registerServiceWorker() {
  if (!window.isSecureContext && window.location.hostname !== "localhost") return;

  void navigator.serviceWorker
    .register(SERVICE_WORKER_SCRIPT_URL, { scope: SERVICE_WORKER_SCOPE })
    .then((registration) => registration.update())
    .catch((error) => {
      console.error("[PWA] Service worker registration failed:", error);
    });
}

export function useServiceWorkerRegistration() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    if (process.env.NODE_ENV !== "production" || window.location.hostname === "localhost") {
      clearExistingServiceWorkersAndCaches();
      return;
    }

    registerServiceWorker();
  }, []);
}

export function ServiceWorkerRegister() {
  useServiceWorkerRegistration();
  return null;
}
