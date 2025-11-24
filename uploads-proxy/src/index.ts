/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

/*export default {
	async fetch(request, env, ctx): Promise<Response> {
		return new Response('Hello World!');
	},
} satisfies ExportedHandler<Env>;*/

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Construire l'URL OVH complète
    const ovhUrl = `https://ft-website.s3.rbx.io.cloud.ovh.net${url.pathname}${url.search}`;
    
	try{
    // Fetch depuis OVH
    const response = await fetch(ovhUrl, {
      method: request.method,
      headers: {
        'Host': 'ft-website.s3.rbx.io.cloud.ovh.net'
      },
        cf: {
          cacheEverything: true,
          cacheTtl: 31536000
        }
    });
    
    // Cloner la réponse et ajouter des headers de cache
    const newResponse = new Response(response.body, response);
    
    // Headers optimisés
    newResponse.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    newResponse.headers.set('Access-Control-Allow-Origin', '*');
    
    return newResponse;
  }
} satisfies ExportedHandler<Env>;