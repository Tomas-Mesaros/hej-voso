import fs from 'fs';
import path from 'path';

export function load() {
	const folderPath = path.resolve('static/gallery');
	const files = fs.readdirSync(folderPath);

	const images = files
		.filter((file) => file.match(/\.(jpg|jpeg|png|gif|webp)$/))
		.map((file) => `/gallery/${file}`);
	return { images };
    
}
