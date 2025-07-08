/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  // Zvýš upload limit pre audio súbory
  if (event.url.pathname.startsWith('/api/upload-audio')) {
    const response = await resolve(event, {
      transformPageChunk: ({ html }) => html
    });
    return response;
  }
  
  const response = await resolve(event);
  return response;
}
