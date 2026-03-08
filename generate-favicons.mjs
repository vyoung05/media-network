import sharp from 'sharp';
import { writeFileSync } from 'fs';
import { join } from 'path';

const brands = {
  saucewire: { bg: '#DC2626', text: 'SW', textColor: 'white', fontSize: 80 },
  saucecaviar: { bg: '#0A0B0F', text: 'SC', textColor: '#D4A843', fontSize: 80 },
  trapglow: { bg: '#FF1493', text: 'TG', textColor: 'white', fontSize: 80 },
  trapfrequency: { bg: '#39FF14', text: 'TF', textColor: '#0D0D0D', fontSize: 72 },
};

const basePath = 'D:\\Vector\\media-network\\apps';
const sizes = [16, 32, 48, 64, 128, 180, 192, 512];

async function generateForBrand(brand, config) {
  const publicDir = join(basePath, brand, 'public');
  
  // Create a high-res SVG with proper rendering
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <rect fill="${config.bg}" width="512" height="512" rx="64"/>
    <text x="256" y="350" font-family="Arial,Helvetica,sans-serif" font-weight="bold" 
          font-size="${config.fontSize * 3.5}" fill="${config.textColor}" text-anchor="middle">${config.text}</text>
  </svg>`;
  
  const svgBuffer = Buffer.from(svg);
  
  // Generate PNG at various sizes
  for (const size of sizes) {
    const png = await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toBuffer();
    
    if (size === 32) {
      writeFileSync(join(publicDir, 'favicon-32x32.png'), png);
      console.log(`  ✅ favicon-32x32.png`);
    }
    if (size === 16) {
      writeFileSync(join(publicDir, 'favicon-16x16.png'), png);
      console.log(`  ✅ favicon-16x16.png`);
    }
    if (size === 180) {
      writeFileSync(join(publicDir, 'apple-touch-icon.png'), png);
      console.log(`  ✅ apple-touch-icon.png`);
    }
    if (size === 192) {
      writeFileSync(join(publicDir, 'android-chrome-192x192.png'), png);
      console.log(`  ✅ android-chrome-192x192.png`);
    }
    if (size === 512) {
      writeFileSync(join(publicDir, 'android-chrome-512x512.png'), png);
      console.log(`  ✅ android-chrome-512x512.png`);
    }
  }
  
  // Generate favicon.ico (contains 16, 32, 48)
  // ICO format: we'll use the simplest approach — a single 32x32 PNG as .ico
  // Most browsers accept PNG-in-ICO
  const ico16 = await sharp(svgBuffer).resize(16, 16).png().toBuffer();
  const ico32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
  const ico48 = await sharp(svgBuffer).resize(48, 48).png().toBuffer();
  
  // Build ICO file with multiple sizes
  const icoBuffer = buildIco([ico16, ico32, ico48], [16, 32, 48]);
  writeFileSync(join(publicDir, 'favicon.ico'), icoBuffer);
  console.log(`  ✅ favicon.ico (16+32+48)`);
  
  // Write site.webmanifest
  const manifest = {
    name: brand === 'saucewire' ? 'SauceWire' : 
          brand === 'saucecaviar' ? 'Sauce Caviar' :
          brand === 'trapglow' ? 'Trap Glow' : 'Trap Frequency',
    short_name: config.text,
    icons: [
      { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    theme_color: config.bg,
    background_color: config.bg,
    display: 'standalone',
  };
  writeFileSync(join(publicDir, 'site.webmanifest'), JSON.stringify(manifest, null, 2));
  console.log(`  ✅ site.webmanifest`);
}

// Build a proper ICO file from PNG buffers
function buildIco(pngBuffers, sizes) {
  const numImages = pngBuffers.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  const dirSize = dirEntrySize * numImages;
  
  let offset = headerSize + dirSize;
  const entries = [];
  
  for (let i = 0; i < numImages; i++) {
    entries.push({
      size: sizes[i],
      data: pngBuffers[i],
      offset: offset,
    });
    offset += pngBuffers[i].length;
  }
  
  const totalSize = offset;
  const buf = Buffer.alloc(totalSize);
  
  // ICO header
  buf.writeUInt16LE(0, 0);      // Reserved
  buf.writeUInt16LE(1, 2);      // Type: ICO
  buf.writeUInt16LE(numImages, 4); // Number of images
  
  // Directory entries
  for (let i = 0; i < numImages; i++) {
    const e = entries[i];
    const pos = headerSize + i * dirEntrySize;
    buf.writeUInt8(e.size >= 256 ? 0 : e.size, pos);     // Width
    buf.writeUInt8(e.size >= 256 ? 0 : e.size, pos + 1);  // Height
    buf.writeUInt8(0, pos + 2);                            // Palette
    buf.writeUInt8(0, pos + 3);                            // Reserved
    buf.writeUInt16LE(1, pos + 4);                         // Color planes
    buf.writeUInt16LE(32, pos + 6);                        // Bits per pixel
    buf.writeUInt32LE(e.data.length, pos + 8);             // Size of data
    buf.writeUInt32LE(e.offset, pos + 12);                 // Offset
  }
  
  // Image data
  for (const e of entries) {
    e.data.copy(buf, e.offset);
  }
  
  return buf;
}

// Run
for (const [brand, config] of Object.entries(brands)) {
  console.log(`\n🎨 ${brand}:`);
  await generateForBrand(brand, config);
}

console.log('\n✅ All favicons generated!');
