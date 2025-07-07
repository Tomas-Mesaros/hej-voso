/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  // Set file upload limits
  if (event.request.method === 'POST' || event.request.method === 'PUT') {
    const contentType = event.request.headers.get('content-type');
    if (contentType && contentType.includes('multipart/form-data')) {
      // Allow larger file uploads (10MB)
      event.request.headers.set('content-length-limit', '10485760');
    }
  }

  const response = await resolve(event);
  return response;
}
