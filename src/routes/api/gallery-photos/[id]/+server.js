import { json } from '@sveltejs/kit';
import { db } from '$lib/database.js';

export async function PUT({ params, request }) {
  try {
    const photoId = parseInt(params.id);
    const data = await request.json();
    
    const photoData = {
      title: data.title || null,
      description: data.description || null,
      altText: data.alt_text || null,
      sortOrder: parseInt(data.sort_order) || 0
    };

    const photo = await db.galleryPhotos.update(photoId, photoData);
    return json(photo);
  } catch (error) {
    console.error('Error updating gallery photo:', error);
    return json({ error: 'Failed to update gallery photo' }, { status: 500 });
  }
}

export async function DELETE({ params }) {
  try {
    const photoId = parseInt(params.id);
    
    // Najprv získaj foto info
    const photo = await db.galleryPhotos.findById(photoId);
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
    await db.galleryPhotos.delete(photoId);
    return json({ success: true });
  } catch (error) {
    console.error('Error deleting gallery photo:', error);
    return json({ error: 'Failed to delete gallery photo' }, { status: 500 });
  }
}