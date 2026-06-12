const fs = require('fs');
const path = require('path');
const dir = 'src/components';

fs.readdirSync(dir).forEach(f => {
  if (f.endsWith('.js')) {
    const filePath = path.join(dir, f);
    let content = fs.readFileSync(filePath, 'utf8');
    // We want to replace \` with ` and \$ with $
    content = content.replace(/\\\`/g, '`').replace(/\\\$/g, '$');
    fs.writeFileSync(filePath, content);
    console.log('Fixed', f);
  }
});
