import { getAlbums } from '$lib/utils/media.js';
import { error } from '@sveltejs/kit';

export function load(){
    try {
        const albums = getAlbums();
        console.log('Načítané albumy v +page.server.js:', albums);
        return { albums };
    } catch (e) {
        console.error('Chyba v load():', e);
        throw error(500, 'Nepodarilo sa načítať albumy.');
    }
};

