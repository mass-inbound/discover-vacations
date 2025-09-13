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
  const {nonce, header, NonceProvider} = createContentSecurityPolicy({
    shop: {
      checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
      storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    },
    defaultSrc: [
      "'self'",
      'https://js.hcaptcha.com',
      'https://fonts.shopifycdn.com',
      'https://newassets.hcaptcha.com',
    ],
    scriptSrc: [
      "'self' 'unsafe-inline'", // Allow inline scripts for Shopify Forms
      'https://forms.shopifyapps.com',
      'https://js.hcaptcha.com',
      'https://newassets.hcaptcha.com',
      'https://cdn.shopify.com',
    ],
    styleSrc: [
      "'self' 'unsafe-inline'", // Allow inline styles from formStyle
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
    ],
    connectSrc: [
      "'self'",
      'https://monorail-edge.shopifysvc.com',
      'https://discover-vacations.myshopify.com',
      'https://forms.shopifyapps.com',
      'https://otlp-http-production.shopifysvc.com',
      'https://notify.bugsnag.com',
      'http://localhost:*',
      'ws://localhost:*',
      'ws://127.0.0.1:*',
      'ws://*.tryhydrogen.dev:*',
      'https://rxmqy989nf.execute-api.us-east-2.amazonaws.com', // Allow external contact API
    ],
    frameSrc: [
      "'self'",
      'https://forms.shopifyapps.com',
      'https://forms.inboundrequest.com', // Allow iframes from Jotform
      'https://newassets.hcaptcha.com', // Added for hCaptcha iframe
      'https://js.hcaptcha.com', // Added for hCaptcha iframe
    ],
    mediaSrc: [
      "'self'",
      'https://newassets.hcaptcha.com',
      'https://js.hcaptcha.com',
    ],
  });

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
