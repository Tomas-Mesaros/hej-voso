import { json } from '@sveltejs/kit';
import { db } from '$lib/database.js';

export async function POST({ request }) {
  try {
    const data = await request.json();
    const { category_id, photos } = data;

    const createdPhotos = [];
    
    for (const photoData of photos) {
      const photo = await db.galleryPhotos.create({
        categoryId: parseInt(category_id),
        filename: photoData.filename,
        title: photoData.title,
        description: photoData.description,
        sortOrder: photoData.sort_order || 0
      });
      createdPhotos.push(photo);
    }

    return json(createdPhotos, { status: 201 });
  } catch (error) {
    console.error('Error creating gallery photos:', error);
    return json({ error: 'Failed to create gallery photos' }, { status: 500 });
  }
}

export async function DELETE({ url }) {
  try {
    const photoId = url.pathname.split('/').pop();
    
    // Najprv získaj foto info
    const photo = await db.galleryPhotos.findById(parseInt(photoId));
    if (!photo) {
      return json({ error: 'Photo not found' }, { status: 404 });
    }

    // Vymaž súbor z disku
    if (photo.filename) {
      try {
        const { unlink } = await import('fs/promises');
        const { join } = await import('path');
        const photoPath = join(process.cwd(), 'static', 'uploads', 'gallery', photo.filename);
        await unlink(photoPath);
        console.log('Deleted photo file:', photo.filename);
      } catch (fileError) {
        console.warn('Could not delete photo file:', photo.filename, fileError.message);
      }
    }

    // Vymaž z databázy
    await db.galleryPhotos.delete(parseInt(photoId));
    return json({ success: true });
  } catch (error) {
    console.error('Error deleting gallery photo:', error);
    return json({ error: 'Failed to delete gallery photo' }, { status: 500 });
  }
}