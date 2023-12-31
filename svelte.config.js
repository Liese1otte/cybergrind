import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';

const dev = process.argv.includes("dev");

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter({
            pages: "docs",
            assets: "docs"
        }),
		paths: {
            base: dev ? "" : "/cybergrind",
        },
		alias: {
			"$src": "src/",
			"$routes": "src/routes",
			"$scripts": "src/scripts",
			"$styles": "src/styles",
			"$stores": "src/stores/stores.ts",
			"$utils": "src/scripts/utils.ts",
			"$consts": "src/consts/consts.ts",
			"$userTypes": "src/types/types.ts"
		}	
	}
};

export default config;
