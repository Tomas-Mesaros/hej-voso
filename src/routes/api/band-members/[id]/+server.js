import { json } from '@sveltejs/kit';
import { db } from '$lib/database.js';
import { unlink, mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {
  try {
    const member = await db.bandMembers.findById(params.id);
    if (!member) {
      return json({ error: 'Member not found' }, { status: 404 });
    }
    return json(member);
  } catch (error) {
    console.error('Error fetching member:', error);
    return json({ error: 'Failed to fetch member' }, { status: 500 });
  }
}

/** @type {import('./$types').RequestHandler} */
export async function PUT({ params, request }) {
  try {
    const data = await request.formData();
    console.log('PUT request received for member:', params.id, 'form data keys:', Array.from(data.keys()));

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
    }
    
    const memberData = {
      firstName: data.get('firstName') || data.get('first_name'),
      lastName: data.get('lastName') || data.get('last_name'),
      stageName: data.get('stageName') || data.get('stage_name') || null,
      role: data.get('role') || null,
      bio: data.get('bio') || null,
      email: data.get('email') || null,
      phone: data.get('phone') || null,
      facebookUrl: data.get('facebookUrl') || data.get('facebook_url') || null,
      instagramUrl: data.get('instagramUrl') || data.get('instagram_url') || null,
      youtubeUrl: data.get('youtubeUrl') || data.get('youtube_url') || null,
      isActive: data.get('isActive') === 'true' || data.get('is_active') === 'true',
      sortOrder: parseInt(data.get('sortOrder') || data.get('sort_order')) || 0
    };
    
    // Only update photo if new one was uploaded
    if (photoFilename) {
      memberData.photo = photoFilename;
    }
    
    const updatedMember = await db.bandMembers.update(params.id, memberData);
    return json(updatedMember);
  } catch (error) {
    console.error('Error updating member:', error);
    return json({ error: 'Failed to update member' }, { status: 500 });
  }
}

/** @type {import('./$types').RequestHandler} */
export async function DELETE({ params }) {
  try {
    // Get member to delete photo file
    const member = await db.bandMembers.findById(params.id);
    
    if (member && member.photo) {
      // Delete photo file
      const photoPath = join(process.cwd(), 'static', 'uploads', 'band-members', member.photo);
      if (existsSync(photoPath)) {
        try {
          await unlink(photoPath);
        } catch (error) {
          console.warn('Failed to delete photo file:', error);
        }
      }
    }
    
    await db.bandMembers.delete(params.id);
    return json({ success: true });
  } catch (error) {
    console.error('Error deleting member:', error);
    return json({ error: 'Failed to delete member' }, { status: 500 });
  }
}
