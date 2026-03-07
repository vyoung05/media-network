export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    name: 'SauceWire',
    url: 'https://saucewire.com',
    logo: 'https://saucewire.com/icon-512.png',
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
