import { json } from '@sveltejs/kit';
import { db } from '$lib/database.js';

export async function PUT({ params, request }) {
  try {
    const songId = parseInt(params.id);
    const data = await request.json();
    
    const songData = {
      title: data.title,
      filename: data.filename || null,
      duration: data.duration || null,
      trackNumber: parseInt(data.track_number) || 1,
      lyrics: data.lyrics || null,
      youtubeUrl: data.youtube_url || null,
      spotifyUrl: data.spotify_url || null,
      isPublished: data.is_published === true
    };

    const song = await db.songs.update(songId, songData);
    return json(song);
  } catch (error) {
    console.error('Error updating song:', error);
    return json({ error: 'Failed to update song' }, { status: 500 });
  }
}

export async function DELETE({ params }) {
  try {
    const songId = parseInt(params.id);
    
    // Najprv získaj skladbu
    const song = await db.songs.findById(songId);
    if (!song) {
      return json({ error: 'Song not found' }, { status: 404 });
    }

    // Vymaž audio súbor z disku
    if (song.filename) {
      try {
        const { unlink } = await import('fs/promises');
        const { join } = await import('path');
        const audioPath = join(process.cwd(), 'static', 'uploads', 'audio', song.filename);
        await unlink(audioPath);
        console.log('Deleted audio file:', song.filename);
      } catch (fileError) {
        console.warn('Could not delete audio file:', song.filename, fileError.message);
      }
    }

    // Vymaž skladbu z databázy
    await db.songs.delete(songId);
    return json({ success: true });
  } catch (error) {
    console.error('Error deleting song:', error);
    return json({ error: 'Failed to delete song' }, { status: 500 });
  }
}