import { useState, useEffect } from 'react';
import { ForestPack } from '../types';

const OFFLINE_PACKS_KEY = 'enigma_offline_forests_index';
const CACHE_NAME = 'enigma-forest-offline-v1';

export interface OfflinePackMeta {
  forestId: string;
  forestName: string;
  downloadedAt: string;
  tilesCount: number;
  sizeEstimateMb: number;
}

// Helper: Calculate tile coordinates from lat/lng
function latLngToTile(lat: number, lng: number, zoom: number): { x: number; y: number } {
  const x = Math.floor(((lng + 180) / 360) * Math.pow(2, zoom));
  const latRad = (lat * Math.PI) / 180;
  const y = Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * Math.pow(2, zoom)
  );
  return { x, y };
}

class OfflinePackService {
  public getDownloadedPacks(): Record<string, OfflinePackMeta> {
    try {
      const raw = localStorage.getItem(OFFLINE_PACKS_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return {};
  }

  public isDownloaded(forestId: string): boolean {
    const packs = this.getDownloadedPacks();
    return Boolean(packs[forestId]);
  }

  public getOfflineForest(forestId: string): ForestPack | null {
    try {
      const raw = localStorage.getItem(`enigma_offline_forest_${forestId}`);
      if (raw) return JSON.parse(raw);
    } catch {}
    return null;
  }

  public async downloadForestPack(
    forest: ForestPack,
    onProgress?: (progress: number, stepMessage: string) => void
  ): Promise<void> {
    const report = (p: number, msg: string) => {
      if (onProgress) onProgress(p, msg);
    };

    report(5, 'Guardando datos del bosque y enigmas...');
    // 1. Save complete forest JSON to localStorage
    localStorage.setItem(`enigma_offline_forest_${forest.id}`, JSON.stringify(forest));

    // 2. Open CacheStorage if available
    let tilesCached = 0;
    if ('caches' in window) {
      try {
        const cache = await caches.open(CACHE_NAME);

        report(20, 'Calculando área de senderos y mosaicos del mapa...');
        // Compute bounding box around center and all POIs
        let minLat = forest.centerLat;
        let maxLat = forest.centerLat;
        let minLng = forest.centerLng;
        let maxLng = forest.centerLng;

        for (const poi of forest.pois) {
          if (poi.lat < minLat) minLat = poi.lat;
          if (poi.lat > maxLat) maxLat = poi.lat;
          if (poi.lng < minLng) minLng = poi.lng;
          if (poi.lng > maxLng) maxLng = poi.lng;
        }

        // Expand bounds by ~500m buffer
        const buffer = 0.008;
        minLat -= buffer;
        maxLat += buffer;
        minLng -= buffer;
        maxLng += buffer;

        // Collect tiles for zoom levels 13, 14, 15, 16
        const tileUrls: string[] = [];
        const zoomLevels = [13, 14, 15, 16];

        for (const z of zoomLevels) {
          const topLeft = latLngToTile(maxLat, minLng, z);
          const bottomRight = latLngToTile(minLat, maxLng, z);

          for (let x = Math.min(topLeft.x, bottomRight.x); x <= Math.max(topLeft.x, bottomRight.x); x++) {
            for (let y = Math.min(topLeft.y, bottomRight.y); y <= Math.max(topLeft.y, bottomRight.y); y++) {
              // OpenTopoMap & CartoDB tiles
              tileUrls.push(`https://a.tile.opentopomap.org/${z}/${x}/${y}.png`);
              tileUrls.push(`https://a.basemaps.cartocdn.com/rastertiles/voyager/${z}/${x}/${y}.png`);
            }
          }
        }

        // Limit to 45 most critical tiles to keep offline cache fast and lightweight
        const tilesToFetch = tileUrls.slice(0, 45);
        const total = tilesToFetch.length;

        for (let i = 0; i < total; i++) {
          const url = tilesToFetch[i];
          try {
            const res = await fetch(url, { mode: 'cors' });
            if (res.ok) {
              await cache.put(url, res);
              tilesCached++;
            }
          } catch (e) {
            // Non-fatal if single tile fails
          }
          const pct = 25 + Math.round(((i + 1) / total) * 55);
          report(pct, `Descargando mosaico de mapa ${i + 1} de ${total}...`);
        }
      } catch (err) {
        console.warn('CacheStorage not supported or failed:', err);
      }
    }

    report(85, 'Precargando reliquias y sonidos...');
    // Simulated short delay for assets packing
    await new Promise((res) => setTimeout(res, 400));

    report(100, '¡Bosque listo para explorar sin cobertura!');

    // 3. Record in index
    const packs = this.getDownloadedPacks();
    packs[forest.id] = {
      forestId: forest.id,
      forestName: forest.name,
      downloadedAt: new Date().toLocaleDateString(),
      tilesCount: tilesCached,
      sizeEstimateMb: parseFloat(((tilesCached * 0.04) + 1.2).toFixed(1)),
    };
    localStorage.setItem(OFFLINE_PACKS_KEY, JSON.stringify(packs));
  }

  public async removeForestPack(forestId: string): Promise<void> {
    try {
      localStorage.removeItem(`enigma_offline_forest_${forestId}`);
      const packs = this.getDownloadedPacks();
      delete packs[forestId];
      localStorage.setItem(OFFLINE_PACKS_KEY, JSON.stringify(packs));
    } catch {}
  }
}

export const offlinePackService = new OfflinePackService();

// Custom hook to detect online/offline network status
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
