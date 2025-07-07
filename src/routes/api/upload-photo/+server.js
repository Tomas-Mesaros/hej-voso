import { json } from '@sveltejs/kit';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST({ request }) {
  try {
    const data = await request.formData();
    const file = data.get('photo');
    const type = data.get('type') || 'gallery';
    
    if (!file || file.size === 0) {
      return json({ error: 'No file uploaded' }, { status: 400 });
    }
    
    // Vytvor priečinok ak neexistuje
    const uploadDir = join(process.cwd(), 'static', 'uploads', type);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }
    
    // Generuj jedinečný názov súboru
    const timestamp = Date.now();
    const originalName = file.name;
    const extension = originalName.split('.').pop();
    const filename = `${timestamp}-${originalName}`;
    
    // Ulož súbor
    const filePath = join(uploadDir, filename);
    const arrayBuffer = await file.arrayBuffer();
    await writeFile(filePath, new Uint8Array(arrayBuffer));
    
    return json({ 
      success: true, 
      filename,
      originalName,
      path: `/uploads/${type}/${filename}`
    });
  } catch (error) {
    console.error('Upload error:', error);
    return json({ error: error.message }, { status: 500 });
  }
}