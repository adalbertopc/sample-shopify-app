require('isomorphic-fetch');
const Koa = require('koa');
const next = require('next');
const { default: createShopifyAuth } = require('@shopify/koa-shopify-auth');
const dotenv = require('dotenv');
const { verifyRequest } = require('@shopify/koa-shopify-auth');
const session = require('koa-session');
const axios = require('axios');
dotenv.config();
const { default: graphQLProxy } = require('@shopify/koa-shopify-graphql-proxy');
const { ApiVersion } = require('@shopify/koa-shopify-graphql-proxy');

const koaBody = require('koa-body');

//Fetchs
const Router = require('koa-router');
const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const { SHOPIFY_API_SECRET_KEY, SHOPIFY_API_KEY } = process.env;

app.prepare().then(() => {
	const server = new Koa();
	const router = new Router();
	server.use(session({ sameSite: 'none', secure: true }, server));
	server.keys = [SHOPIFY_API_SECRET_KEY];

	server.use(
		createShopifyAuth({
			apiKey: SHOPIFY_API_KEY,
			secret: SHOPIFY_API_SECRET_KEY,
			scopes: [
				'read_products',
				'write_products',
				'read_script_tags',
				'write_script_tags',
			],
			afterAuth(ctx) {
				const { shop, accessToken } = ctx.session;
				ctx.cookies.set('shopOrigin', shop, {
					httpOnly: false,
					secure: true,
					sameSite: 'none',
				});
				ctx.redirect('/');
			},
		})
	);
	router.get('/api/getMetafields', async (ctx, next) => {
		try {
			const shopRequestUrl = `https://${ctx.session.shop}/admin/api/2021-01/metafields.json`;
			const shopRequestHeaders = {
				'X-Shopify-Access-Token': await ctx.session.accessToken,
				'Content-Type': 'application/json',
			};
			console.log('TOKEEEEEEEN --------', shopRequestHeaders);
			if (shopRequestHeaders['X-Shopify-Access-Token'] !== undefined) {
				const superData = await axios.get(shopRequestUrl, {
					headers: { ...shopRequestHeaders },
				});
				ctx.body = {
					status: 'success',
					data: superData.data,
				};
				console.log(shopRequestUrl);
				console.log(superData.data);
			}
		} catch (error) {
			console.log('llego a la ruta ', error);
		}
	});

	router.post('/api/metafield', koaBody(), async (ctx, next) => {
		try {
			const body = ctx.request.body;
			console.log(body);
			const shopRequestUrl = `https://${ctx.session.shop}/admin/api/2021-01/metafields.json`;
			const shopRequestHeaders = {
				'X-Shopify-Access-Token': await ctx.session.accessToken,
				'Content-Type': 'application/json',
			};
			console.log('TOKEEEEEEEN --------', shopRequestHeaders);
			if (shopRequestHeaders['X-Shopify-Access-Token'] !== undefined) {
				const superData = await axios.post(shopRequestUrl, body, {
					headers: { ...shopRequestHeaders },
				});

				console.log(superData);
			}
		} catch (error) {
			console.log('llego a la ruta post ', error);
		}
	});

	server.use(graphQLProxy({ version: ApiVersion.October20 }));

	server.use(router.routes());
	server.use(router.allowedMethods());
	server.use(verifyRequest());
	server.use(async (ctx) => {
		await handle(ctx.req, ctx.res);
		ctx.respond = false;
		ctx.res.statusCode = 200;
	});

	server.listen(port, () => {
		console.log(`> Ready on hhttps://calandoapp.loca.lt:${port}`);
	});
});
