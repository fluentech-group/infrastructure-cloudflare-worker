export interface Env {
	// Define your environment variables here if needed
	// BUCKET_NAME?: string;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);

		// URL complète vers ton S3 OVH
		const s3Url = `https://ft-website.s3.rbx.io.cloud.ovh.net${url.pathname}${url.search}`;

		try {
			// Fetch depuis S3
			const response = await fetch(s3Url, {
				cf: {
					cacheEverything: true,
					cacheTtl: 31536000, // 1 an
				},
			});

			// Si le fichier n'existe pas
			if (!response.ok) {
				return new Response('File not found', {
					status: response.status,
					statusText: response.statusText
				});
			}

			// Créer une nouvelle réponse avec headers optimisés
			const newResponse = new Response(response.body, {
				status: response.status,
				statusText: response.statusText,
				headers: new Headers(response.headers),
			});

			// Ajouter des headers personnalisés
			newResponse.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
			newResponse.headers.set('Access-Control-Allow-Origin', '*');
			newResponse.headers.set('X-Content-Type-Options', 'nosniff');

			return newResponse;

		} catch (error) {
			return new Response(
				`Error fetching from S3: ${error instanceof Error ? error.message : 'Unknown error'}`,
				{ status: 500 }
			);
		}
	},
} satisfies ExportedHandler<Env>;