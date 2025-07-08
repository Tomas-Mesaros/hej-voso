import { json } from '@sveltejs/kit';
import { prisma } from '$lib/database.js';

export async function POST({ request, getClientAddress }) {
  try {
    const { songId, duration, playedTime } = await request.json();
    const userAgent = request.headers.get('user-agent');
    const ipAddress = getClientAddress();
    
    const completed70 = duration > 0 && (playedTime / duration) >= 0.7;

    await prisma.songPlay.create({
      data: {
        songId: parseInt(songId),
        duration: parseInt(duration),
        playedTime: parseInt(playedTime),
        completed70,
        userAgent,
        ipAddress
      }
    });

    // Aktualizuj playCount v skladbe
    await prisma.song.update({
      where: { id: parseInt(songId) },
      data: {
        playCount: {
          increment: 1
        }
      }
    });

    return json({ success: true });
  } catch (error) {
    console.error('Error tracking song play:', error);
    return json({ error: 'Failed to track song play' }, { status: 500 });
  }
}