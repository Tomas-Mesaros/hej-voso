import { db } from '$lib/database.js';
import { error } from '@sveltejs/kit';

export async function load() {
    try {
        const albums = await db.albums.findMany({
            include: {
                songs: {
                    orderBy: {
                        trackNumber: 'asc'
                    }
                }
            },
            orderBy: {
                releaseDate: 'desc'
            }
        });
        console.log('Načítané albumy s skladbami z databázy:', albums);
        return { albums };
    } catch (e) {
        console.error('Chyba pri načítaní albumov z databázy:', e);
        throw error(500, 'Nepodarilo sa načítať albumy.');
    }
}

