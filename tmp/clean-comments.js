const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    try {
        const files = fs.readdirSync(dir);
        files.forEach(f => {
            let dirPath = path.join(dir, f);
            try {
                let stat = fs.statSync(dirPath);
                if (stat.isDirectory()) {
                    walkDir(dirPath, callback);
                } else {
                    callback(dirPath);
                }
            } catch (e) {
                console.error(`Error statting: ${dirPath}`, e.message);
            }
        });
    } catch (e) {
        console.error(`Error reading dir: ${dir}`, e.message);
    }
}

function stripComments(content, ext) {
    if (ext === '.css') {
        return content.replace(/\/\*[\s\S]*?\*\//g, '');
    }
    
    // Simpler and safer regex for JS/JSX
    // Group 1: strings and regex (to preserve)
    // Group 2: comments (to remove)
    return content.replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|\/(?![*\/])(?:[^\/\\]|\\.)*\/)|(\/\*[\s\S]*?\*\/|\/\/.*)/g, (match, p1) => {
        if (p1) return p1;
        return "";
    });
}

const targetDir = path.join(__dirname, '..', 'src');

walkDir(targetDir, (filePath) => {
    const ext = path.extname(filePath);
    if (['.js', '.jsx', '.css'].includes(ext)) {
        try {
            console.log(`Processing: ${filePath}`);
            const content = fs.readFileSync(filePath, 'utf8');
            const cleaned = stripComments(content, ext);
            fs.writeFileSync(filePath, cleaned, 'utf8');
        } catch (e) {
            console.error(`Error processing file: ${filePath}`, e.message);
        }
    }
});

console.log('Cleanup complete.');
