import { json } from '@sveltejs/kit';
import { prisma } from '$lib/database.js';

export async function GET() {
  try {
    // Celkové návštevy
    const totalViews = await prisma.pageView.count();
    
    // Celkové prehrávania
    const totalPlays = await prisma.songPlay.count();
    
    // Top skladby s počtom prehratí a dokončení
    const topSongs = await prisma.song.findMany({
      include: {
        album: true,
        plays: true
      },
      orderBy: {
        playCount: 'desc'
      },
      take: 10
    });

    // Spracuj top skladby
    const processedTopSongs = topSongs.map(song => ({
      ...song,
      playCount: song.plays.length,
      completed70Count: song.plays.filter(play => play.completed70).length
    })).filter(song => song.playCount > 0);

    // Posledné návštevy stránok
    const pageViews = await prisma.pageView.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: 20
    });

    // Posledné prehrávania
    const songPlays = await prisma.songPlay.findMany({
      include: {
        song: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20
    });

    return json({
      totalViews,
      totalPlays,
      topSongs: processedTopSongs,
      pageViews,
      songPlays
    });
  } catch (error) {
    console.error('Error fetching analytics stats:', error);
    return json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}