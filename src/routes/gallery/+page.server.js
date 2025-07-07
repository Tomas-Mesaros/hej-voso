import { db } from '$lib/database.js';
import { error } from '@sveltejs/kit';

export async function load() {
	try {
		const categories = await db.galleryCategories.findMany();
		const totalImages = categories.reduce((sum, category) => sum + category.photos.length, 0);

		return {
			galleryData: categories,
			totalImages
		};
	} catch (e) {
		console.error('Chyba pri načítaní galérie z databázy:', e);
		throw error(500, 'Nepodarilo sa načítať galériu.');
	}
}
