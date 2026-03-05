export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    name: 'TrapFrequency',
    url: 'https://trapfrequency.com',
    logo: 'https://trapfrequency.com/icon.svg',
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
