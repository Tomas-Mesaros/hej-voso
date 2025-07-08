import { json } from '@sveltejs/kit';
import { db } from '$lib/database.js';

export async function GET({ params }) {
  try {
    const categoryId = parseInt(params.id);
    const category = await db.galleryCategories.findById(categoryId);
    
    if (!category) {
      return json({ error: 'Category not found' }, { status: 404 });
    }
    
    return json(category);
  } catch (error) {
    console.error('Error fetching gallery category:', error);
    return json({ error: 'Failed to fetch gallery category' }, { status: 500 });
  }
}