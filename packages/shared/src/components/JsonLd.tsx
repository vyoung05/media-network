import React from 'react';

interface ArticleJsonLdProps {
  type: 'article';
  headline: string;
  description?: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author?: { name: string; url?: string };
  publisher: { name: string; logo?: string; url: string };
  url: string;
}

interface OrganizationJsonLdProps {
  type: 'organization';
  name: string;
  url: string;
  logo?: string;
  description?: string;
  sameAs?: string[];
}

interface BreadcrumbJsonLdProps {
  type: 'breadcrumb';
  items: Array<{ name: string; url: string }>;
}

type JsonLdProps = ArticleJsonLdProps | OrganizationJsonLdProps | BreadcrumbJsonLdProps;

export function JsonLd(props: JsonLdProps) {
  let structuredData: Record<string, any>;

  switch (props.type) {
    case 'article':
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: props.headline,
        description: props.description || '',
        image: props.image || undefined,
        datePublished: props.datePublished || undefined,
        dateModified: props.dateModified || props.datePublished || undefined,
        url: props.url,
        author: props.author ? {
          '@type': 'Person',
          name: props.author.name,
          url: props.author.url || undefined,
        } : undefined,
        publisher: {
          '@type': 'Organization',
          name: props.publisher.name,
          url: props.publisher.url,
          logo: props.publisher.logo ? {
            '@type': 'ImageObject',
            url: props.publisher.logo,
          } : undefined,
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': props.url,
        },
      };
      break;

    case 'organization':
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: props.name,
        url: props.url,
        logo: props.logo || undefined,
        description: props.description || undefined,
        sameAs: props.sameAs || [],
      };
      break;

    case 'breadcrumb':
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: props.items.map((item, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: item.name,
          item: item.url,
        })),
      };
      break;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
