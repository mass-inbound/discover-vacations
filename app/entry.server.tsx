import type {AppLoadContext} from '@shopify/remix-oxygen';
import {ServerRouter} from 'react-router';
import {isbot} from 'isbot';
import {renderToReadableStream} from 'react-dom/server';
import {createContentSecurityPolicy} from '@shopify/hydrogen';
import type {EntryContext} from 'react-router';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
  context: AppLoadContext,
) {
  // Environment flags
  const isDev = process.env.NODE_ENV !== 'production';

  // If you use an HTTPS tunnel (ngrok/localtunnel) set it in env: PUBLIC_DEV_TUNNEL
  // Example: PUBLIC_DEV_TUNNEL="https://abcd-1234.ngrok.io"
  // const devTunnel =
  //   context.env?.PUBLIC_DEV_TUNNEL || process.env.PUBLIC_DEV_TUNNEL;

  // const devFormHosts = [
  //   ...(isDev ? ['http://localhost:3000', 'http://127.0.0.1:3000'] : []),
  //   // include ngrok/https tunnel in formAction if provided
  //   ...(devTunnel ? [devTunnel] : []),
  // ];

  // const devConnectHosts = [
  //   ...(isDev
  //     ? ['http://localhost:*', 'ws://localhost:*', 'ws://127.0.0.1:*']
  //     : []),
  //   ...(devTunnel ? [devTunnel] : []),
  // ];

  const {nonce, header, NonceProvider} = createContentSecurityPolicy({
    shop: {
      checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
      storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    },

    // allow sources commonly needed for Hydrogen + forms + hcaptcha + fonts etc.
    defaultSrc: [
      "'self'",
      'https://js.hcaptcha.com',
      'https://fonts.shopifycdn.com',
      'https://newassets.hcaptcha.com',
    ],
    scriptSrc: [
      "'self' 'unsafe-inline'", // Allow inline scripts for Shopify Forms if you need them
      'https://forms.shopifyapps.com',
      'https://js.hcaptcha.com',
      'https://newassets.hcaptcha.com',
      'https://cdn.shopify.com',
    ],
    styleSrc: [
      "'self' 'unsafe-inline'",
      'https://fonts.shopifycdn.com',
      'https://newassets.hcaptcha.com',
      'https://cdn.shopify.com',
    ],
    imgSrc: [
      "'self'",
      'data:',
      'https://cdn.shopify.com',
      'https://newassets.hcaptcha.com',
      'https://js.hcaptcha.com',
    ],
    fontSrc: ["'self'", 'https://fonts.shopifycdn.com'],
    formAction: [
      "'self'",
      'https://forms.shopifyapps.com',
      'https://discover-vacations.myshopify.com',
      'https://mydiscovervacations.com',
      // include any dev hosts conditionally
      // ...devFormHosts,
    ],
    connectSrc: [
      "'self'",
      'https://monorail-edge.shopifysvc.com',
      'https://discover-vacations.myshopify.com',
      'https://forms.shopifyapps.com',
      'https://otlp-http-production.shopifysvc.com',
      'https://notify.bugsnag.com',
      'https://rxmqy989nf.execute-api.us-east-2.amazonaws.com',
      // dev connect hosts (http/ws local or ngrok)
      // ...devConnectHosts,
      // allow any additional subdomain variants you need:
      'https://*.mydiscovervacations.com',
    ],
    frameSrc: [
      "'self'",
      'https://forms.shopifyapps.com',
      'https://forms.inboundrequest.com',
      'https://newassets.hcaptcha.com',
      'https://js.hcaptcha.com',
    ],
    mediaSrc: [
      "'self'",
      'https://newassets.hcaptcha.com',
      'https://js.hcaptcha.com',
    ],
  });

  // optional: DEBUG - print header to server logs when in dev
  if (isDev) {
    // eslint-disable-next-line no-console
    console.log('CSP header being set:', header);
  }

  const body = await renderToReadableStream(
    <NonceProvider>
      <ServerRouter
        context={reactRouterContext}
        url={request.url}
        nonce={nonce}
      />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('Content-Security-Policy', header);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
