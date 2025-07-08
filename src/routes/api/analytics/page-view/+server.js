import { json } from '@sveltejs/kit';
import { prisma } from '$lib/database.js';

export async function POST({ request, getClientAddress }) {
  try {
    const { page } = await request.json();
    const userAgent = request.headers.get('user-agent');
    const ipAddress = getClientAddress();

    await prisma.pageView.create({
      data: {
        page,
        userAgent,
        ipAddress
      }
    });

    return json({ success: true });
  } catch (error) {
    console.error('Error tracking page view:', error);
    return json({ error: 'Failed to track page view' }, { status: 500 });
  }
}