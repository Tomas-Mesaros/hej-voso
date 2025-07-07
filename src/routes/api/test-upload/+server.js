import { json } from '@sveltejs/kit';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  try {
    console.log('Test upload endpoint called');
    const data = await request.formData();
    console.log('Form data keys:', Array.from(data.keys()));
    
    const file = data.get('file');
    console.log('File:', file);
    
    if (!file || file.size === 0) {
      return json({ error: 'No file uploaded' }, { status: 400 });
    }
    
    console.log('File details:', {
      name: file.name,
      size: file.size,
      type: file.type
    });
    
    // Create test directory
    const testDir = join(process.cwd(), 'static', 'uploads', 'test');
    if (!existsSync(testDir)) {
      await mkdir(testDir, { recursive: true });
    }
    
    // Save file
    const filename = `test-${Date.now()}-${file.name}`;
    const filePath = join(testDir, filename);
    const arrayBuffer = await file.arrayBuffer();
    await writeFile(filePath, new Uint8Array(arrayBuffer));
    
    console.log('File saved successfully:', filePath);
    
    return json({ 
      success: true, 
      filename,
      size: file.size,
      path: `/uploads/test/${filename}`
    });
  } catch (error) {
    console.error('Test upload error:', error);
    return json({ error: error.message }, { status: 500 });
  }
}
