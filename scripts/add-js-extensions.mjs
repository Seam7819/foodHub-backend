import fs from 'fs';
import path from 'path';

const root = path.resolve('src');
const excludeDirs = ['generated','types'];
const exts = ['.js','.json','.css','.svg','.png','.jpg','.jpeg','.d.ts','.ts'];

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (!excludeDirs.includes(name)) walk(full);
    } else if (name.endsWith('.ts') && !name.endsWith('.d.ts')) {
      fixFile(full);
    }
  }
}

function hasKnownExt(p) {
  return exts.some(e => p.endsWith(e));
}

function fixFile(file) {
  let s = fs.readFileSync(file, 'utf8');
  const orig = s;
  // replace import/export from './path' or '../path' occurrences
  s = s.replace(/(from|import)\s+(['"])(\.\.?(?:\/[^"']*)+)(['"])/g, (m, p1, q1, rel, q2) => {
    // rel is like ./foo or ../foo/bar
    if (hasKnownExt(rel)) return m; // already has extension
    // do not append .js to index-like directory imports (ends with '/'), skip
    if (rel.endsWith('/')) return m;
    return `${p1} ${q1}${rel}.js${q2}`;
  });
  // also handle export * from './x'
  s = s.replace(/export\s+\*\s+from\s+(['"])(\.\.?(?:\/[^"']*)+)(['"])/g, (m,q1,rel,q2)=>{
    if (hasKnownExt(rel)) return m;
    if (rel.endsWith('/')) return m;
    return `export * from ${q1}${rel}.js${q2}`;
  });

  if (s !== orig) {
    fs.writeFileSync(file, s, 'utf8');
    console.log('patched', file);
  }
}

walk(root);
console.log('done');
