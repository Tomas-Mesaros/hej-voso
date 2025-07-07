import { json } from '@sveltejs/kit';
import { db } from '$lib/database.js';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
  try {
    const albums = await db.albums.findMany();
    return json(albums);
  } catch (error) {
    console.error('Error fetching albums:', error);
    return json({ error: 'Failed to fetch albums' }, { status: 500 });
  }
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  try {
    const data = await request.json();
    
    const albumData = {
      title: data.title,
      description: data.description || null,
      genre: data.genre || null,
      releaseDate: data.release_date ? new Date(data.release_date) : null,
      coverImage: data.cover_image || null,
      isPublished: data.is_published !== false,
      sortOrder: parseInt(data.sort_order) || 0
    };

    const album = await db.albums.create(albumData);
    return json(album, { status: 201 });
  } catch (error) {
    console.error('Error creating album:', error);
    return json({ error: 'Failed to create album' }, { status: 500 });
  }
}
