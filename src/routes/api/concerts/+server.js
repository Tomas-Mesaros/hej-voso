import { json } from '@sveltejs/kit';
import { db } from '$lib/database.js';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
  try {
    const concerts = await db.concerts.findMany();
    return json(concerts);
  } catch (error) {
    console.error('Error fetching concerts:', error);
    return json({ error: 'Failed to fetch concerts' }, { status: 500 });
  }
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  try {
    const data = await request.formData();
    
    let imageFilename = null;
    
    // Handle image upload
    const imageFile = data.get('image');
    if (imageFile && imageFile.size > 0) {
      // Create uploads directory if it doesn't exist
      const uploadsDir = join(process.cwd(), 'static', 'uploads', 'concerts');
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }
      
      // Generate unique filename
      const timestamp = Date.now();
      const originalName = imageFile.name;
      const extension = originalName.split('.').pop();
      imageFilename = `${timestamp}-${originalName}`;
      
      // Save file
      const filePath = join(uploadsDir, imageFilename);
      const arrayBuffer = await imageFile.arrayBuffer();
      await writeFile(filePath, new Uint8Array(arrayBuffer));
    }
    
    const concertData = {
      title: data.get('title'),
      description: data.get('description') || null,
      image: imageFilename,
      eventDate: new Date(data.get('event_date')),
      eventTime: data.get('event_time') || null,
      city: data.get('city'),
      venue: data.get('venue'),
      address: data.get('address'),
      latitude: data.get('latitude') ? parseFloat(data.get('latitude')) : null,
      longitude: data.get('longitude') ? parseFloat(data.get('longitude')) : null,
      ticketUrl: data.get('ticket_url') || null,
      ticketPrice: data.get('ticket_price') ? parseFloat(data.get('ticket_price')) : null,
      isPublished: data.get('is_published') !== 'false',
      isFeatured: data.get('is_featured') === 'true',
      sortOrder: parseInt(data.get('sort_order')) || 0
    };

    const concert = await db.concerts.create(concertData);
    return json(concert, { status: 201 });
  } catch (error) {
    console.error('Error creating concert:', error);
    return json({ error: 'Failed to create concert' }, { status: 500 });
  }
}
