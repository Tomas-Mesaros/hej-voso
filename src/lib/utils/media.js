import fs from 'fs';
import path from 'path';


export function getGalleryImages() { 
    const folderPath = path.resolve('static/gallery');
    const files = fs.readdirSync(folderPath);
        const images = files
        .filter((file) => file.match(/\.(jpg|jpeg|png|gif|webp)$/))
        .map((file) => `/gallery/${file}`);
    return { images };
}


export function getAlbums() { 
    try {
        const folderPath = path.resolve('static/albums');
        console.log('Cesta k albumom:', folderPath); // Pre debugovanie
        const files = fs.readdirSync(folderPath);
        console.log('Nájdené súbory:', files); // Pre debugovanie
        return { files };
    } catch (err) {
        console.error('Chyba pri načítaní albumov:', err);
        return { files: [] }; // Vrátime prázdne pole namiesto vyhodenia chyby
    }
}

export function getSongs(album) { 
    const folderPath = path.resolve(`static/albums/${album}`);
    const files = fs.readdirSync(folderPath);
    const songs = files
        .filter((file) => file.match(/\.(mp3)$/))
        .map((file) => `${file}`);
    return { songs };
}
