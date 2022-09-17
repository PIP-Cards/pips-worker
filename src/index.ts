/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
        DECKS_BUCKET: R2Bucket;
        AUTH_KEY_SECRET: string;
}

const hasValidHeader = (request: Request, env: Env) => {
  return request.headers.get('X-Custom-Auth-Key') === env.AUTH_KEY_SECRET;
};

function authorizeRequest(request: Request, env: Env, key: string) {
  switch (request.method) {
    case 'GET':
      return true;
    default:
      return false;
  }
}

export default {
	async fetch(
		request: Request,
		env: Env,
		_ctx: ExecutionContext
	): Promise<Response> {
    const url = new URL(request.url);
    const key = url.pathname.slice(1);

    if (!authorizeRequest(request, env, key)) {
      return new Response('Forbidden', { status: 403 });
    }

    switch (request.method) {
      case 'GET':
        const object = await env.DECKS_BUCKET.get(key);

        if (object === null) return new Response('Object Not Found', { status: 404 });

        const headers = new Headers();
        object.writeHttpMetadata(headers);
        headers.set('etag', object.httpEtag);

        return new Response(object.body, {
          headers,
        });

      default:
        return new Response('Method Not Allowed', {
          status: 405,
          headers: {
            Allow: 'GET',
          },
        });
    }
  },
};


