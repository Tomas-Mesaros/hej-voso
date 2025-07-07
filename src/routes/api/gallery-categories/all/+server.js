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