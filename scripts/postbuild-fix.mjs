import fs from 'fs';
import path from 'path';

const root = path.resolve('dist');

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full);
    else if (name.endsWith('.js')) fixFile(full);
  }
}

function hasExt(p) {
  return /\.[a-zA-Z0-9]+$/.test(p);
}

function fixFile(file) {
  let s = fs.readFileSync(file, 'utf8');
  const orig = s;
  // add .js to relative imports/exports without extension
  s = s.replace(/(from|import|export)\s+(['"])(\.\.?(?:\/[^"']*)+)(['"])/g, (m,p1,q1,rel,q2)=>{
    if (hasExt(rel)) return m;
    if (rel.endsWith('/')) return m;
    return `${p1} ${q1}${rel}.js${q2}`;
  });
  // fix directory imports to /index.js
  s = s.replace(/(['"])(\.\.?(?:\/[^"']*)+?)\.js\1/g,(m,q,rel)=>{
    const abs = path.resolve(path.dirname(file), rel);
    if (fs.existsSync(abs) && fs.statSync(abs).isDirectory() && fs.existsSync(path.join(abs,'index.js'))) {
      return `${q}${rel}/index.js${q}`;
    }
    return m;
  });

  if (s !== orig) {
    fs.writeFileSync(file, s, 'utf8');
    console.log('patched', file);
  }
}

walk(root);
console.log('done');
