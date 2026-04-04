const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    const files = fs.readdirSync(dir);
    files.forEach(f => {
        let dirPath = path.join(dir, f);
        if (dirPath.includes('assets')) return; // Skip assets
        let stat = fs.statSync(dirPath);
        if (stat.isDirectory()) {
            walkDir(dirPath, callback);
        } else {
            callback(dirPath);
        }
    });
}

function strip(content, ext) {
    if (ext === '.css') {
        return content.replace(/\/\*[\s\S]*?\*\//g, '');
    }
    // Safer matching for JS/JSX
    return content.replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\\\]|\\.)*`|\/(?![*\/])(?:[^\/\\]|\\.)*\/)|(\/\*[\s\S]*?\*\/|\/\/.*)/g, (m, p1) => {
        return p1 ? p1 : '';
    });
}

const target = path.resolve('src');
walkDir(target, (p) => {
    const ext = path.extname(p);
    if (!['.js', '.jsx', '.css'].includes(ext)) return;
    console.log('Cleaning:', p);
    const original = fs.readFileSync(p, 'utf8');
    const cleaned = strip(original, ext);
    fs.writeFileSync(p, cleaned, 'utf8');
});
console.log('Done.');
