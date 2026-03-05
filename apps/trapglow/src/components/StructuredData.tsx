export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    name: 'TrapGlow',
    url: 'https://trapglow.com',
    logo: 'https://trapglow.com/icon.svg',
    sameAs: [],
    parentOrganization: {
      '@type': 'Organization',
      name: 'The Young Empire',
      url: 'https://vincistudios.org',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
