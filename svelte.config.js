import adapter from '@sveltejs/adapter-node';

const config = { 
	kit: { 
		adapter: adapter(),
		csrfProtection: {
			checkOrigin: false
		}
	} 
};

export default config;
