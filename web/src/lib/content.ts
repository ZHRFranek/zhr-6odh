import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

export interface GalleryItem {
  title: string;
  image: string;
  zastep?: '' | '1' | '2' | '3' | '4';
  activityType: 'oboz' | 'biwak' | 'akcja' | 'zbiorka';
  year: string;
}

export function loadSite() {
  const file = join(process.cwd(), 'src/data/site.json');
  return JSON.parse(readFileSync(file, 'utf-8'));
}

/** Wczytuje galerię z dysku przy każdym renderze (dev) i przy buildzie (prod). */
export function loadGallery(): GalleryItem[] {
  const dir = join(process.cwd(), 'src/content/gallery');
  return readdirSync(dir)
    .filter((name) => name.endsWith('.json'))
    .map((name) => {
      const item = JSON.parse(readFileSync(join(dir, name), 'utf-8')) as GalleryItem;
      if (!item.zastep) item.zastep = '';
      return item;
    });
}
