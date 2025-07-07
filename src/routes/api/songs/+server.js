import { json } from '@sveltejs/kit';
import { db } from '$lib/database.js';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
  try {
    const songs = await db.songs.findMany();
    return json(songs);
  } catch (error) {
    console.error('Error fetching songs:', error);
    return json({ error: 'Failed to fetch songs' }, { status: 500 });
  }
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  try {
    const data = await request.json();

    const songData = {
      albumId: parseInt(data.album_id),
      title: data.title,
      filename: data.filename || null,
      duration: data.duration ? parseInt(data.duration) : null,
      trackNumber: data.track_number ? parseInt(data.track_number) : null,
      lyrics: data.lyrics || null,
      youtubeUrl: data.youtube_url || null,
      spotifyUrl: data.spotify_url || null,
      isPublished: data.is_published !== false
    };

    const song = await db.songs.create(songData);
    return json(song, { status: 201 });
  } catch (error) {
    console.error('Error creating song:', error);
    return json({ error: 'Failed to create song' }, { status: 500 });
  }
}
