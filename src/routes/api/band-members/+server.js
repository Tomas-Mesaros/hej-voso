import { json } from '@sveltejs/kit';
import { db } from '$lib/database.js';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
  try {
    const members = await db.bandMembers.findMany();
    console.log('Fetched members:', members);
    return json(members);
  } catch (error) {
    console.error('Error fetching band members:', error);
    return json({ error: 'Failed to fetch band members' }, { status: 500 });
  }
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  try {
    const data = await request.formData();
    console.log('POST request received, form data keys:', Array.from(data.keys()));

    let photoFilename = null;

    // Handle photo upload
    const photoFile = data.get('photo');
    console.log('Photo file:', photoFile ? `${photoFile.name} (${photoFile.size} bytes)` : 'No photo file');
    if (photoFile && photoFile.size > 0) {
      // Create uploads directory if it doesn't exist
      const uploadsDir = join(process.cwd(), 'static', 'uploads', 'band-members');
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }
      
      // Generate unique filename
      const timestamp = Date.now();
      const originalName = photoFile.name;
      const extension = originalName.split('.').pop();
      photoFilename = `${timestamp}-${originalName}`;
      
      // Save file
      const filePath = join(uploadsDir, photoFilename);
      const arrayBuffer = await photoFile.arrayBuffer();
      await writeFile(filePath, new Uint8Array(arrayBuffer));
      console.log('Photo saved successfully:', filePath);
    }
    
    const memberData = {
      firstName: data.get('firstName') || data.get('first_name'),
      lastName: data.get('lastName') || data.get('last_name'),
      stageName: data.get('stageName') || data.get('stage_name') || null,
      role: data.get('role') || null,
      bio: data.get('bio') || null,
      photo: photoFilename,
      email: data.get('email') || null,
      phone: data.get('phone') || null,
      facebookUrl: data.get('facebookUrl') || data.get('facebook_url') || null,
      instagramUrl: data.get('instagramUrl') || data.get('instagram_url') || null,
      youtubeUrl: data.get('youtubeUrl') || data.get('youtube_url') || null,
      isActive: data.get('isActive') === 'true' || data.get('is_active') !== 'false',
      sortOrder: parseInt(data.get('sortOrder') || data.get('sort_order')) || 0
    };

    const member = await db.bandMembers.create(memberData);
    return json(member, { status: 201 });
  } catch (error) {
    console.error('Error creating band member:', error);
    return json({ error: 'Failed to create band member' }, { status: 500 });
  }
}
