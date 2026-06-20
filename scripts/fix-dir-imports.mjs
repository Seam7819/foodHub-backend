import fs from 'fs';
import path from 'path';

const root = path.resolve('src');

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full);
    else if (name.endsWith('.ts') && !name.endsWith('.d.ts')) fixFile(full);
  }
}

function fixFile(file) {
  let s = fs.readFileSync(file, 'utf8');
  const orig = s;
  s = s.replace(/(['"])(\.\.?(?:\/[^"']*)+?)\.js\1/g, (m, q, rel) => {
    // rel is like ../../config or ./module/auth/auth.controller
    const abs = path.resolve(path.dirname(file), rel);
    // if abs is a directory and has index.ts, replace with rel + '/index.js'
    if (fs.existsSync(abs) && fs.statSync(abs).isDirectory() && fs.existsSync(path.join(abs, 'index.ts'))) {
      return `${q}${rel}/index.js${q}`;
    }
    return m;
  });

  if (s !== orig) {
    fs.writeFileSync(file, s, 'utf8');
    console.log('fixed dir import in', file);
  }
}

walk(root);
console.log('done');
