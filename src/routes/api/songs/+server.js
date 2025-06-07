import {getSongs} from '$lib/utils/media.js';
import { json } from '@sveltejs/kit';

export async function GET({ url }) {
    try {
        let album = url.searchParams.get('album');
        console.log('API: Požiadavka na skladby pre album:', album);
        const { songs } = getSongs(album);
        console.log('API: Nájdené skladby:', songs);
        return json({ songs });
    } catch (err) {
        console.error('API: Chyba pri načítaní skladieb:', err);
        return json({ songs: [] }, { status: 500 });
    }
};
