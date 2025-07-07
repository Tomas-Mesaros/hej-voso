import { json } from '@sveltejs/kit';
import { db } from '$lib/database.js';

export async function GET({ params }) {
  try {
    const albumId = parseInt(params.id);
    const songs = await db.songs.findByAlbum(albumId);
    return json(songs);
  } catch (error) {
    console.error('Error fetching album songs:', error);
    return json({ error: 'Failed to fetch album songs' }, { status: 500 });
  }
}