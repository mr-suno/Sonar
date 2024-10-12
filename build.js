// last update: October 10th, 2024

// build the .luau files into executable files
// converts "TS.import" into their equivalent source files,
// allowing direct execution inside of 1 file whilst also allowing multiple source files.

// any issues will be fixed in the near future.

// handles: table libraries & general functions

const fs = require('fs');
const path = require('path');

function process(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const regex = /local\s+(\w+)\s*=\s*TS\.import\(script,\s*[^,]+,\s*"TS",\s*"([^"]+)"\)(?:\.(\w+))?/g;

    let match;
    while ((match = regex.exec(content)) !== null) {
        const [full, varName, importPath, propName] = match;
        const replacement = findExport(importPath, propName, varName);
        if (replacement) {
            content = content.replace(full, replacement);
        }
    }

    fs.writeFileSync(filePath, content);
}

function findExport(importPath, propName, varName) {
    const sharedDir = path.join(__dirname, 'out', 'shared');
    const targetPath = path.join(sharedDir, ...importPath.split('/'));
    
    let fileContent;
    if (fs.existsSync(targetPath + '.lua')) {
        fileContent = fs.readFileSync(targetPath + '.lua', 'utf8');
    } else if (fs.existsSync(targetPath + '.luau')) {
        fileContent = fs.readFileSync(targetPath + '.luau', 'utf8');
    } else {
        return null;
    }

    fileContent = fileContent.replace(/\s*return\s*{[^}]*}\s*$/, '');
    fileContent = fileContent.split('\n').filter(line => !line.includes('local default =')).join('\n');

    if (propName === 'default') {
        const tableNameRegex = /local\s+(\w+)\s*=\s*{/;
        const tableNameMatch = fileContent.match(tableNameRegex);
        if (tableNameMatch) {
            const originalTableName = tableNameMatch[1];
            fileContent = fileContent.replace(
                new RegExp(`local\\s+${originalTableName}\\s*=`, 'g'), 
                `local ${varName} =`
            );
        }
    }

    return fileContent.trim();
}

function processDir(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            processDir(filePath);
        } else if (file.endsWith('.lua') || file.endsWith('.luau')) {
            process(filePath);
        }
    }
}

const outDir = path.join(__dirname, 'out');
processDir(outDir);

console.log('build finished');
