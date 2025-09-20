const fs = require('fs');
const path = require('path');
const https = require('https');

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`Downloaded: ${path.basename(filepath)}`);
          resolve();
        });
      } else {
        file.close();
        fs.unlink(filepath, () => {}); // Delete the file async
        reject(new Error(`Failed to download ${url}: Status ${response.statusCode}`));
      }
    }).on('error', (err) => {
      file.close();
      fs.unlink(filepath, () => {}); // Delete the file async
      reject(err);
    });
  });
};

const downloadBatch = async (pageNumbers, baseUrl, pagesDir) => {
  const downloadPromises = pageNumbers.map(async (pageNo) => {
    const url = `${baseUrl}${pageNo}.jpg`;
    const filename = `page-${pageNo.toString().padStart(3, '0')}.jpg`;
    const filepath = path.join(pagesDir, filename);
    
    // Skip if file already exists
    if (fs.existsSync(filepath)) {
      console.log(`Skipping ${filename} (already exists)`);
      return;
    }
    
    try {
      await downloadImage(url, filepath);
    } catch (error) {
      console.error(`Error downloading page ${pageNo}:`, error.message);
    }
  });
  
  await Promise.all(downloadPromises);
};

const getPageNumbers = () => {
  try {
    const jsonPath = path.join(__dirname, 'flgiht-logs.json');
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const pageKeys = Object.keys(jsonData.pageProps.pages);
    return pageKeys.map(key => parseInt(key)).sort((a, b) => a - b);
  } catch (error) {
    console.error('Error reading flight-logs.json:', error.message);
    throw error;
  }
};

const downloadAllPages = async () => {
  const baseUrl = 'https://epsteinsblackbook.com/flight-manifests-images/';
  const batchSize = 5; // Download 5 pages concurrently
  
  // Get page numbers from JSON file
  const pageNumbers = getPageNumbers();
  console.log(`Found ${pageNumbers.length} pages to download:`, pageNumbers);
  
  // Create pages directory if it doesn't exist
  const pagesDir = path.join(__dirname, 'pages');
  if (!fs.existsSync(pagesDir)) {
    fs.mkdirSync(pagesDir, { recursive: true });
  }
  
  console.log(`Starting download of ${pageNumbers.length} flight manifest pages with ${batchSize} concurrent downloads...`);
  
  // Create batches of page numbers
  const batches = [];
  for (let i = 0; i < pageNumbers.length; i += batchSize) {
    batches.push(pageNumbers.slice(i, i + batchSize));
  }
  
  // Download each batch sequentially (but pages within each batch concurrently)
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    console.log(`Downloading batch ${i + 1}/${batches.length}: pages ${batch[0]}-${batch[batch.length - 1]}`);
    
    await downloadBatch(batch, baseUrl, pagesDir);
    
    // Add a small delay between batches to be respectful to the server
    if (i < batches.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log('Download complete!');
};

// Run the download
downloadAllPages().catch(console.error);