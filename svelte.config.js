import adapter from '@sveltejs/adapter-node';

const config = { 
	kit: { 
		adapter: adapter({
			envPrefix: '',
			polyfill: false
		}),
		serviceWorker: {
			register: false
		}
	} 
};

export default config;
