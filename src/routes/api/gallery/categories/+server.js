import { json } from '@sveltejs/kit';
import { db } from '$lib/database.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
  try {
    // Ak je v URL 'all', vráť všetky kategórie s fotkami
    if (url.pathname.includes('/all')) {
      const categories = await db.galleryCategories.findMany();
      return json(categories);
    }
    
    const categories = await db.galleryCategories.findMany();
    return json(categories);
  } catch (error) {
    console.error('Error fetching gallery categories:', error);
    return json({ error: 'Failed to fetch gallery categories' }, { status: 500 });
  }
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  try {
    const data = await request.json();
    
    const categoryData = {
      name: data.name,
      description: data.description || null,
      eventDate: data.event_date || null,
      coverPhoto: data.cover_photo || null,
      isActive: data.is_active !== false,
      sortOrder: parseInt(data.sort_order) || 0
    };

    const category = await db.galleryCategories.create(categoryData);
    return json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating gallery category:', error);
    return json({ error: 'Failed to create gallery category' }, { status: 500 });
  }
}

/** @type {import('./$types').RequestHandler} */
export async function DELETE({ params }) {
  try {
    const id = parseInt(params.id);
    await db.galleryCategories.delete(id);
    return json({ success: true });
  } catch (error) {
    console.error('Error deleting gallery category:', error);
    return json({ error: 'Failed to delete gallery category' }, { status: 500 });
  }
}
