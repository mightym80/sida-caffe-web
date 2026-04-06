const { createCanvas, loadImage } = require('canvas');

const SUPABASE_URL = 'https://wyvcwibhcayassfqgofh.supabase.co';
const SUPABASE_KEY = 'sb_publishable_7rHj-FAXCRRI93wBhJSwfg_Zq2k568V';

async function compressAndUpdate() {
  // Get all products with images
  const res = await fetch(`${SUPABASE_URL}/rest/v1/products?select=id,name,image`, {
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
  });
  
  if (!res.ok) {
    console.log('Failed to fetch products:', res.status);
    return;
  }
  
  const products = await res.json();
  console.log(`Found ${products.length} products`);
  
  for (const product of products) {
    if (!product.image || product.image.length < 50000) {
      continue; // Skip small images (< 50KB)
    }
    
    const sizeKB = product.image.length / 1024;
    console.log(`\nProcessing: ${product.name} (${sizeKB.toFixed(0)} KB)`);
    
    try {
      // Extract base64 data
      const matches = product.image.match(/^data:image\/(\w+);base64,(.+)$/);
      if (!matches) {
        console.log('  Invalid image format, skipping');
        continue;
      }
      
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, 'base64');
      
      const img = await loadImage(buffer);
      
      // Calculate new dimensions (max 300px)
      const MAX_SIZE = 300;
      let width = img.width;
      let height = img.height;
      
      if (width > height && width > MAX_SIZE) {
        height = Math.round((height * MAX_SIZE) / width);
        width = MAX_SIZE;
      } else if (height > MAX_SIZE) {
        width = Math.round((width * MAX_SIZE) / height);
        height = MAX_SIZE;
      }
      
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      
      const compressedImage = canvas.toDataURL('image/jpeg', 0.6);
      const newSizeKB = compressedImage.length / 1024;
      
      console.log(`  Compressed: ${sizeKB.toFixed(0)} KB -> ${newSizeKB.toFixed(0)} KB (${Math.round((1 - newSizeKB/sizeKB) * 100)}% reduction)`);
      
      // Update in database
      const updateRes = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${product.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
        },
        body: JSON.stringify({ image: compressedImage })
      });
      
      if (updateRes.ok) {
        console.log(`  Updated in database`);
      } else {
        console.log(`  Update failed: ${updateRes.status}`);
      }
    } catch (err) {
      console.log(`  Error: ${err.message}`);
    }
  }
  
  console.log('\n=== DONE ===');
}

compressAndUpdate();
