const fs = require('fs');
const path = 'src/lib/data.ts';
let code = fs.readFileSync(path, 'utf8');

// Use regex to find locationName and replace the subsequent locationUrl with the reliable search URL.
const updatedCode = code.replace(/locationName:\s*"([^"]+)",\s*locationUrl:\s*"([^"]+)"/g, (match, locName) => {
    // Generate valid google maps search URL
    const encoded = encodeURIComponent(locName + " Mauritius");
    const validUrl = `https://www.google.com/maps/search/?api=1&query=${encoded}`;
    return `locationName: "${locName}",
    locationUrl: "${validUrl}"`;
});

fs.writeFileSync(path, updatedCode);
