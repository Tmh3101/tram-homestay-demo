const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Room configurations
const rooms = [
  { id: 'deluxe-mountain', name: 'Deluxe View Núi', type: 'Deluxe', color: '#2D5A3D', view: 'MOUNTAIN' },
  { id: 'family-suite', name: 'Family Suite 2PN', type: 'Family', color: '#2D5A3D', view: 'MOUNTAIN' },
  { id: 'standard-garden', name: 'Standard Garden', type: 'Standard', color: '#4A7C4A', view: 'GARDEN' },
  { id: 'deluxe-balcony', name: 'Deluxe Balcony', type: 'Deluxe', color: '#2D5A3D', view: 'MOUNTAIN' },
  { id: 'premium-suite', name: 'Premium Suite', type: 'Deluxe', color: '#1A2D1A', view: 'MOUNTAIN' },
  { id: 'standard-twin', name: 'Standard Twin', type: 'Standard', color: '#4A7C4A', view: 'GARDEN' },
  { id: 'deluxe-garden', name: 'Deluxe Garden', type: 'Deluxe', color: '#2D5A3D', view: 'GARDEN' },
  { id: 'family-deluxe', name: 'Family Deluxe', type: 'Family', color: '#2D5A3D', view: 'GARDEN' },
  { id: 'standard-mountain', name: 'Standard Mountain', type: 'Standard', color: '#4A7C4A', view: 'MOUNTAIN' },
  { id: 'deluxe-twin', name: 'Deluxe Twin', type: 'Deluxe', color: '#2D5A3D', view: 'MOUNTAIN' },
  { id: 'honeymoon-suite', name: 'Honeymoon Suite', type: 'Deluxe', color: '#1A2D1A', view: 'MOUNTAIN' },
  { id: 'standard-budget', name: 'Standard Budget', type: 'Standard', color: '#6B7280', view: 'GARDEN' },
];

const publicDir = path.join(__dirname, '..', 'public', 'images');

// Helper: Run magick command
function runMagick(args) {
  try {
    execSync(`magick ${args.join(' ')}`, { stdio: 'ignore' });
    return true;
  } catch (e) {
    console.error('Magick error:', e.message);
    return false;
  }
}

// Generate a colored rectangle with text as WebP
function generateWebP(outputPath, width, height, bgColor, text, textColor = '#FFFFFF') {
  // Escape text for ImageMagick
  const escapedText = text.replace(/"/g, '\\"').replace(/'/g, "\\'");
  
  const args = [
    '-size', `${width}x${height}`,
    `xc:${bgColor}`,
    '-font', 'DejaVu-Sans-Bold',
    '-pointsize', '24',
    '-fill', textColor,
    '-gravity', 'center',
    '-annotate', '+0+0', escapedText,
    '-quality', '85',
    outputPath
  ];
  
  return runMagick(args);
}

// Generate hero image
function generateHero() {
  const outputPath = path.join(publicDir, 'hero.webp');
  console.log('Generating hero.webp...');
  
  // Create a gradient-like image with text
  const args = [
    '-size', '1920x1080',
    'gradient:#243D24-#1A2D1A',
    '-font', 'DejaVu-Sans-Bold',
    '-pointsize', '72',
    '-fill', '#F5F0E1',
    '-gravity', 'center',
    '-annotate', '+0-50', 'TRÀM HOMESTAY',
    '-pointsize', '36',
    '-fill', '#F5F0E1',
    '-annotate', '+0+50', 'Tam Đảo • Vĩnh Phúc',
    '-quality', '85',
    outputPath
  ];
  runMagick(args);
}

// Generate room images (1-5 per room)
function generateRoomImages() {
  rooms.forEach(room => {
    const roomDir = path.join(publicDir, 'rooms', room.id);
    
    // Image 1: Main hero - room type + view
    generateWebP(
      path.join(roomDir, '1.webp'),
      800, 600,
      room.color,
      `${room.name}\n${room.view} View\nMain`
    );
    
    // Image 2: Bedroom
    generateWebP(
      path.join(roomDir, '2.webp'),
      800, 600,
      room.color,
      `${room.name}\nBedroom`
    );
    
    // Image 3: Bathroom
    generateWebP(
      path.join(roomDir, '3.webp'),
      800, 600,
      room.color,
      `${room.name}\nBathroom`
    );
    
    // Image 4: Balcony/View
    generateWebP(
      path.join(roomDir, '4.webp'),
      800, 600,
      room.color,
      `${room.name}\nBalcony / View`
    );
    
    // Image 5: Amenities detail
    generateWebP(
      path.join(roomDir, '5.webp'),
      800, 600,
      room.color,
      `${room.name}\nAmenities`
    );
    
    console.log(`  ✓ ${room.id}: 5 images`);
  });
}

// Generate bank logos (SVG)
function generateBankLogos() {
  const banks = [
    { code: 'vcb', name: 'Vietcombank', color: '#E60012', short: 'VCB' },
    { code: 'tcb', name: 'Techcombank', color: '#003399', short: 'TCB' },
    { code: 'bidv', name: 'BIDV', color: '#0066CC', short: 'BIDV' },
    { code: 'mb', name: 'MB Bank', color: '#00A651', short: 'MB' },
    { code: 'vpb', name: 'VPBank', color: '#0066CC', short: 'VPB' },
    { code: 'acb', name: 'ACB', color: '#E60012', short: 'ACB' },
  ];
  
  banks.forEach(bank => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
  <rect width="120" height="120" rx="16" fill="${bank.color}"/>
  <text x="60" y="72" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="white" text-anchor="middle">${bank.short}</text>
  <text x="60" y="98" font-family="Arial, sans-serif" font-size="10" fill="white" text-anchor="middle" opacity="0.9">${bank.name}</text>
</svg>`;
    
    const outputPath = path.join(publicDir, 'banks', `${bank.code}.svg`);
    fs.writeFileSync(outputPath, svg);
    console.log(`  ✓ ${bank.code}.svg`);
  });
}

// Generate OG image
function generateOGImage() {
  const outputPath = path.join(publicDir, 'og-image.webp');
  console.log('Generating og-image.webp...');
  
  const args = [
    '-size', '1200x630',
    'gradient:#243D24-#1A2D1A',
    '-font', 'DejaVu-Sans-Bold',
    '-pointsize', '64',
    '-fill', '#F5F0E1',
    '-gravity', 'center',
    '-annotate', '+0-40', 'Tràm Homestay Tam Đảo',
    '-pointsize', '32',
    '-fill', '#F5F0E1',
    '-annotate', '+0+40', 'Đặt phòng online • Thanh toán VietQR',
    '-quality', '85',
    outputPath
  ];
  runMagick(args);
}

// Main
console.log('🎨 Generating placeholder images...\n');

generateHero();
generateRoomImages();
generateBankLogos();
generateOGImage();

console.log('\n✅ Done! Check public/images/');