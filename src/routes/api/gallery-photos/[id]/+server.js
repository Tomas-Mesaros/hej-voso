import { json } from '@sveltejs/kit';
import { db } from '$lib/database.js';

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