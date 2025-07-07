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
    await db.galleryPhotos.delete(parseInt(photoId));
    return json({ success: true });
  } catch (error) {
    console.error('Error deleting gallery photo:', error);
    return json({ error: 'Failed to delete gallery photo' }, { status: 500 });
  }
}