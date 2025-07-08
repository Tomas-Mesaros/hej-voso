import { readFile } from 'fs/promises';
import { join } from 'path';
import { error } from '@sveltejs/kit';

export async function GET({ params }) {
  try {
    const filePath = join(process.cwd(), 'static', 'uploads', params.path);
    const file = await readFile(filePath);
    
    // Určenie MIME typu
    const extension = params.path.split('.').pop().toLowerCase();
    let contentType = 'application/octet-stream';
    
    switch (extension) {
      case 'mp3':
        contentType = 'audio/mpeg';
        break;
      case 'wav':
        contentType = 'audio/wav';
        break;
      case 'ogg':
        contentType = 'audio/ogg';
        break;
      case 'jpg':
      case 'jpeg':
        contentType = 'image/jpeg';
        break;
      case 'png':
        contentType = 'image/png';
        break;
      case 'webp':
        contentType = 'image/webp';
        break;
    }
    
    return new Response(file, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000'
      }
    });
  } catch (err) {
    console.error('File not found:', params.path, err.message);
    throw error(404, 'File not found');
  }
}