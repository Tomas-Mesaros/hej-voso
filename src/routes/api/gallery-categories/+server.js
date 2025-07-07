import { json } from '@sveltejs/kit';
import { db } from '$lib/database.js';

export async function GET() {
  try {
    const categories = await db.galleryCategories.findMany();
    return json(categories);
  } catch (error) {
    console.error('Error fetching gallery categories:', error);
    return json({ error: 'Failed to fetch gallery categories' }, { status: 500 });
  }
}

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