// last update: October 10th, 2024

// build the .luau files into executable files
// converts "TS.import" into their equivalent source files,
// allowing direct execution inside of 1 file whilst also allowing multiple source files.
// & minifies file automatically to minimize storage.

// handles: table libraries & general functions

const fs = require('fs');
const path = require('path');
const { minify } = require('luamin');

function replaceShortOps(content) {
    content = content.replace(/(\w+)\s*\+=\s*(\S+)/g, '$1 = $1 + $2');
    
    // content = content.replace(/(\w+)\s*-=\s*(\S+)/g, '$1 = $1 - $2');
    // content = content.replace(/(\w+)\s*\*=\s*(\S+)/g, '$1 = $1 * $2');
    // content = content.replace(/(\w+)\s*\/=\s*(\S+)/g, '$1 = $1 / $2');

    return content;
}

function process(filePath) {
    if (filePath.includes(path.join(__dirname, 'out', 'shared'))) {
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/local TS = require\(game:GetService\("ReplicatedStorage"\):WaitForChild\("rbxts_include"\):WaitForChild\("RuntimeLib"\)\)\n?/, '');

    content = replaceShortOps(content);

    const seenImports = new Set();
    const regex = /local\s+(\w+)\s*=\s*TS\.import\(script,\s*game:GetService\("ReplicatedStorage"\),\s*"TS",\s*"([^"]+)"\)(?:\.(\w+))?/g;
    
    content = content.replace(regex, (match, varName, importPath, propName) => {
        if (!seenImports.has(match) && !importPath.startsWith("shared/") && varName !== 'queue') {
            const replacement = findExport(importPath, propName, varName);
            seenImports.add(match);
    
            return replacement || match;
        }
    
        return match;
    });     

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

function cleanUpFinal(sourcePath) {
    let content = fs.readFileSync(sourcePath, 'utf8');

    content = content.replace(/local TS = require\(game:GetService\("ReplicatedStorage"\):WaitForChild\("rbxts_include"\):WaitForChild\("RuntimeLib"\)\)\n?/, '');
    content = content.replace(/local\s+\w+\s*=\s*TS\.import\(.*\)\s*(?:\.\w+)?\n?/g, '');

    content = replaceShortOps(content);

    fs.writeFileSync(sourcePath, content);
}

function safeMinify(sourceContent) {
    try {
        return minify(sourceContent);
    } catch (error) {
        console.error(' - Minification failed:', error);
        if (error instanceof SyntaxError) {
            console.error(' ! Syntax error:', error.message);
            console.error(`   At line ${error.line}, column ${error.column}`);
            
            const lines = sourceContent.split('\n');
            const start = Math.max(0, error.line - 3);
            const end = Math.min(lines.length, error.line + 2);

            console.error('\nProblematic code:');

            for (let i = start; i < end; i++) {
                console.error(`${i + 1}: ${lines[i]}${i + 1 === error.line ? ' <-- Error here' : ''}`);
            }
        }
        return null;
    }
}

const outDir = path.join(__dirname, 'out');
const build = path.join(__dirname, 'output.lua');
const source = path.join(outDir, 'client', 'main.client.luau');

processDir(outDir);
cleanUpFinal(source);

const minifyMessage = `-- File minified using Luamin

--[[

    We don't recommend tampering with this file, instead,
    set up your own Roblox-TS environment and build the TypeScript yourself.

    You can use our \`build.js\` file to convert any "TS.imports" into source-code,
    then navigate to \`./out/client/main.client.luau\` to find the unminified source file.

    Build manager written on : 10/12/2024 (October 12th, 2024).

    Message me (@mr.suno) on Discord for any questions, concerns or issues regarding Sonar.

    Much love,
         Suno

]]

-- Minified source-file below:
`;

try {
    const sourceContent = fs.readFileSync(source, 'utf8');
    console.log('\nSource read successfully\n');
    
    const minifiedContent = safeMinify(sourceContent);
    if (minifiedContent) {
        console.log(' - Finished minifying [1]');
        fs.writeFileSync(build, minifyMessage + '\n' + minifiedContent);
        console.log(' - Written to output  [2]');
    } else {
        console.error(' - Minification failed, writing original content');
        fs.writeFileSync(build, minifyMessage + '\n-- Minification failed, original content below:\n\n' + sourceContent);
    }
} catch (error) {
    console.error(' - Failed to read or write file:', error);
}

console.log('\nProcess finished <|:)\n');
