import { json } from '@sveltejs/kit';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST({ request }) {
  try {
    const data = await request.formData();
    const file = data.get('audio');
    
    console.log('Upload attempt:', {
      hasFile: !!file,
      fileSize: file?.size,
      fileName: file?.name,
      fileType: file?.type
    });
    
    if (!file || file.size === 0) {
      console.error('No file or empty file');
      return json({ error: 'No audio file uploaded' }, { status: 400 });
    }
    
    // Validácia typu súboru
    if (!file.type.startsWith('audio/')) {
      console.error('Invalid file type:', file.type);
      return json({ error: 'File must be an audio file' }, { status: 400 });
    }
    
    // Validácia veľkosti (max 50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      console.error('File too large:', file.size);
      return json({ error: 'File too large. Maximum size is 50MB' }, { status: 400 });
    }
    
    // Vytvor priečinok ak neexistuje
    const uploadDir = join(process.cwd(), 'static', 'uploads', 'audio');
    console.log('Upload directory:', uploadDir);
    
    if (!existsSync(uploadDir)) {
      console.log('Creating upload directory');
      await mkdir(uploadDir, { recursive: true });
    }
    
    // Generuj jedinečný názov súboru
    const timestamp = Date.now();
    const originalName = file.name;
    const extension = originalName.split('.').pop();
    const filename = `${timestamp}-${originalName}`;
    
    console.log('Saving file as:', filename);
    
    // Ulož súbor
    const filePath = join(uploadDir, filename);
    const arrayBuffer = await file.arrayBuffer();
    await writeFile(filePath, new Uint8Array(arrayBuffer));
    
    console.log('File saved successfully:', filePath);
    
    return json({ 
      success: true, 
      filename,
      originalName,
      path: `/uploads/audio/${filename}`
    });
  } catch (error) {
    console.error('Audio upload error:', error);
    return json({ error: `Upload failed: ${error.message}` }, { status: 500 });
  }
}