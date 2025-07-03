import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Link, useLoaderData, type MetaFunction} from 'react-router';
import {type Shop} from '@shopify/hydrogen/storefront-api-types';

type SelectedPolicies = keyof Pick<
  Shop,
  'privacyPolicy' | 'shippingPolicy' | 'termsOfService' | 'refundPolicy'
>;

const SHOPIFY_PAGE_HANDLES = [
  'terms-conditions',
  'privacy-policy',
  'refund-cancellation-policy',
];

const PAGE_QUERY = `#graphql
  query Page(
    $language: LanguageCode,
    $country: CountryCode,
    $handle: String!
  )
  @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      handle
      id
      title
      body
      seo {
        description
        title
      }
    }
  }
` as const;

export const meta: MetaFunction<typeof loader> = ({data}) => {
  const title = data?.page?.title || data?.policy?.title || '';
  return [{title: `Hydrogen | ${title}`}];
};

export async function loader({params, context}: LoaderFunctionArgs) {
  if (!params.handle) {
    throw new Response('No handle was passed in', {status: 404});
  }

  // If the handle matches a Shopify Online Store Page, fetch the page
  if (SHOPIFY_PAGE_HANDLES.includes(params.handle)) {
    const {page} = await context.storefront.query(PAGE_QUERY, {
      variables: {
        handle: params.handle,
        language: context.storefront.i18n?.language,
        country: context.storefront.i18n?.country,
      },
    });
    if (!page) {
      throw new Response('Page not found', {status: 404});
    }
    return {page};
  }

  // Otherwise, fallback to policy logic
  const policyName = params.handle.replace(
    /-([a-z])/g,
    (_: unknown, m1: string) => m1.toUpperCase(),
  ) as SelectedPolicies;

  const data = await context.storefront.query(POLICY_CONTENT_QUERY, {
    variables: {
      privacyPolicy: false,
      shippingPolicy: false,
      termsOfService: false,
      refundPolicy: false,
      [policyName]: true,
      language: context.storefront.i18n?.language,
    },
  });

  const policy = data.shop?.[policyName];

  if (!policy) {
    throw new Response('Could not find the policy', {status: 404});
  }

  return {policy};
}

export default function Policy() {
  const data = useLoaderData<typeof loader>();

  // Render Shopify Page if present
  if ('page' in data && data.page) {
    return (
      <div className="policy">
        <br />
        <br />
        <div>
          <Link to="/">← Back</Link>
        </div>
        <br />
        <h1>{data.page.title}</h1>
        <div dangerouslySetInnerHTML={{__html: data.page.body}} />
      </div>
    );
  }

  // Otherwise, render Policy if present
  if ('policy' in data && data.policy) {
    return (
      <div className="policy">
        <br />
        <br />
        <div>
          <Link to="/">← Back</Link>
        </div>
        <br />
        <h1>{data.policy.title}</h1>
        <div dangerouslySetInnerHTML={{__html: data.policy.body}} />
      </div>
    );
  }

  // Fallback if neither page nor policy is found
  return <div>Policy not found.</div>;
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/Shop
const POLICY_CONTENT_QUERY = `#graphql
  fragment Policy on ShopPolicy {
    body
    handle
    id
    title
    url
  }
  query Policy(
    $country: CountryCode
    $language: LanguageCode
    $privacyPolicy: Boolean!
    $refundPolicy: Boolean!
    $shippingPolicy: Boolean!
    $termsOfService: Boolean!
  ) @inContext(language: $language, country: $country) {
    shop {
      privacyPolicy @include(if: $privacyPolicy) {
        ...Policy
      }
      shippingPolicy @include(if: $shippingPolicy) {
        ...Policy
      }
      termsOfService @include(if: $termsOfService) {
        ...Policy
      }
      refundPolicy @include(if: $refundPolicy) {
        ...Policy
      }
    }
  }
` as const;
