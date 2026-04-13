const fs = require('fs');
const path = 'src/lib/data.ts';
let code = fs.readFileSync(path, 'utf8');

const locations = {
    1: { name: "Point d'Azur, Pereybere", url: "https://maps.app.goo.gl/B9U7jA8Ry9yH1uDq9" },
    2: { name: "Pereybere", url: "https://maps.app.goo.gl/V1JmS2G8QW4sWj9x5" },
    3: { name: "Chamarel Geopark", url: "https://maps.app.goo.gl/N8bY1L9GXYn4E3hV8" },
    4: { name: "Shrine of Père Laval", url: "https://maps.app.goo.gl/uXvE5K2Y6M9T9vHw9" },
    5: { name: "Ganga Talao (Grand Bassin)", url: "https://maps.app.goo.gl/7C1mZ8P8QxR8oFjL7" },
    6: { name: "Cap Malheureux", url: "https://maps.app.goo.gl/W5aM5uJ8zV6Yx4Jb8" },
    7: { name: "Coin de Mire Viewpoint", url: "https://maps.app.goo.gl/uN5WJ4bKw1M4yFhA7" },
    8: { name: "SSR Botanical Garden", url: "https://maps.app.goo.gl/fN9kX4H8xZ8n7Y5k9" },
    9: { name: "Port Louis Central Market", url: "https://maps.app.goo.gl/C7R5uV8zW9xY6T4L8" },
    10: { name: "Seven Coloured Earth Geopark", url: "https://maps.app.goo.gl/N8bY1L9GXYn4E3hV8" },
    11: { name: "Blue Bay Marine Park", url: "https://maps.app.goo.gl/V9T2K8F9QG4tF6Ea8" },
    12: { name: "Flacq Market", url: "https://maps.app.goo.gl/D7J4K5M4H3c6G9Eb7" },
    13: { name: "Le Morne Brabant", url: "https://maps.app.goo.gl/S4R6uN7vT9uQ6Xh8A" },
    14: { name: "Gunner's Quoin", url: "https://maps.app.goo.gl/uN5WJ4bKw1M4yFhA7" }
};

for (const [id, loc] of Object.entries(locations)) {
    const idRegex = new RegExp('(id:\\s*' + id + ',[\\s\\S]*?available:\\s*true),?', 'g');
    
    // Remove if already exists (partial apply)
    code = code.replace(new RegExp('(id:\\s*' + id + ',[\\s\\S]*?available:\\s*true),\\s*locationName:.*?,\\s*locationUrl:.*?,?', 'g'), '$1,');
    
    code = code.replace(idRegex, '$1,\n    locationName: "' + loc.name.replace(/"/g, '\\"') + '",\n    locationUrl: "' + loc.url + '",');
}

fs.writeFileSync(path, code);
