import { json } from '@sveltejs/kit';
import { db } from '$lib/database.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {
  try {
    const album = await db.albums.findById(params.id);
    if (!album) {
      return json({ error: 'Album not found' }, { status: 404 });
    }
    return json(album);
  } catch (error) {
    console.error('Error fetching album:', error);
    return json({ error: 'Failed to fetch album' }, { status: 500 });
  }
}

/** @type {import('./$types').RequestHandler} */
export async function PUT({ params, request }) {
  try {
    const data = await request.formData();
    
    const albumData = {
      title: data.get('title'),
      description: data.get('description') || null,
      genre: data.get('genre') || null,
      releaseDate: data.get('release_date') ? new Date(data.get('release_date')) : null,
      coverImage: data.get('cover_image') || null,
      isPublished: data.get('is_published') === 'true',
      sortOrder: parseInt(data.get('sort_order')) || 0
    };

    const album = await db.albums.update(params.id, albumData);
    return json(album);
  } catch (error) {
    console.error('Error updating album:', error);
    return json({ error: 'Failed to update album' }, { status: 500 });
  }
}

/** @type {import('./$types').RequestHandler} */
export async function DELETE({ params }) {
  try {
    // Najprv získaj album so skladbami
    const album = await db.albums.findById(params.id);
    if (!album) {
      return json({ error: 'Album not found' }, { status: 404 });
    }

    // Vymaž audio súbory skladieb
    if (album.songs && album.songs.length > 0) {
      const { unlink } = await import('fs/promises');
      const { join } = await import('path');
      
      for (const song of album.songs) {
        if (song.filename) {
          try {
            const audioPath = join(process.cwd(), 'static', 'uploads', 'audio', song.filename);
            await unlink(audioPath);
            console.log('Deleted audio file:', song.filename);
          } catch (fileError) {
            console.warn('Could not delete audio file:', song.filename, fileError.message);
          }
        }
      }
    }

    // Vymaž cover image ak existuje
    if (album.coverImage) {
      try {
        const { unlink } = await import('fs/promises');
        const { join } = await import('path');
        const coverPath = join(process.cwd(), 'static', 'uploads', 'albums', album.coverImage);
        await unlink(coverPath);
        console.log('Deleted cover image:', album.coverImage);
      } catch (fileError) {
        console.warn('Could not delete cover image:', album.coverImage, fileError.message);
      }
    }

    // Vymaž album z databázy (Prisma automaticky vymaže skladby vaka Cascade)
    await db.albums.delete(params.id);
    
    return json({ success: true });
  } catch (error) {
    console.error('Error deleting album:', error);
    return json({ error: 'Failed to delete album' }, { status: 500 });
  }
}
