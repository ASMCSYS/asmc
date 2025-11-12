import fs from 'fs';
import path from 'path';
import { parse as parseComments } from 'comment-parser';

/**
 * Recursively collect all .js files under a directory (excluding node_modules)
 */
function getAllJsFiles(dir) {
    let files = [];
    for (const entry of fs.readdirSync(dir)) {
        const fullPath = path.join(dir, entry);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            if (entry === 'node_modules' || entry.startsWith('.')) continue;
            files = files.concat(getAllJsFiles(fullPath));
        } else if (entry.endsWith('.js')) {
            files.push(fullPath);
        }
    }
    return files;
}

/**
 * Extracts mapping between router variables, their mount paths, and source files by
 * parsing app/routes/index.js (root router)
 */
function parseRootRouter() {
    const routerIndexPath = path.resolve('app/routes/index.js');
    if (!fs.existsSync(routerIndexPath)) {
        throw new Error('app/routes/index.js not found - cannot build API documentation');
    }
    const content = fs.readFileSync(routerIndexPath, 'utf8');

    // 1. Map import variable => relative file path
    const importRegex = /import\s+(\w+)\s+from\s+["'](.+?)["']/g;
    const importMap = new Map();
    let match;
    while ((match = importRegex.exec(content)) !== null) {
        const [_, varName, relPath] = match;
        importMap.set(varName, path.resolve(path.dirname(routerIndexPath), relPath));
    }

    // 2. Map mount path => router variable
    const useRegex = /router\.use\(\s*["'](.+?)["']\s*,\s*(\w+)/g;
    const routeMapping = [];
    while ((match = useRegex.exec(content)) !== null) {
        const [_, mountPath, varName] = match;
        const filePath = importMap.get(varName);
        if (!filePath) continue;
        routeMapping.push({ mountPath, filePath });
    }
    return routeMapping;
}

/**
 * Parse a route file to extract HTTP method & sub path values
 */
function parseRouteFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');

    // Map imported identifiers to their source files for later JSDoc lookup
    const importRegex = /import\s+\{?\s*([\w,\s]+)\s*\}?\s*from\s*["'](.+?)["']/g;
    const importMap = new Map();
    let m;
    while ((m = importRegex.exec(content)) !== null) {
        const names = m[1].split(',').map((s) => s.trim());
        const fileRel = m[2];
        const resolved = path.resolve(path.dirname(filePath), fileRel);
        names.forEach((n) => importMap.set(n, resolved));
    }

    const argBlock = "(?:[^()]+|\\((?:[^()]+|\\([^()]*\\))*\\))*"; // naive nested paren matching
    const routeRegex = new RegExp(
        `router\\.(get|post|put|delete|patch)\\(\\s*[\"']([^\"']+)[\"']\\s*,([\n\\r\\t ]*${argBlock})\\)`,
        'g'
    );

    const endpoints = [];
    let match;
    while ((match = routeRegex.exec(content)) !== null) {
        const method = match[1].toUpperCase();
        const subPath = match[2];
        const argsSection = match[3];

        // Attempt to get last argument token (handler)
        const args = argsSection
            .split(',')
            .map((a) => a.trim())
            .filter(Boolean);
        const handlerName = args[args.length - 1].replace(/\)/g, '').trim();

        let handlerPath = filePath;
        if (importMap.has(handlerName)) handlerPath = importMap.get(handlerName);

        endpoints.push({ method, subPath, handlerName, handlerPath });
    }
    return endpoints;
}

function generateApiDocs() {
    const mapping = parseRootRouter();
    const lines = ['# API Documentation', 'Automatically generated from Express routes & JSDoc', ''];

    mapping.forEach(({ mountPath, filePath }) => {
        const tagName = mountPath.replace(/^\//, '').toUpperCase() || 'ROOT';
        lines.push(`## ${tagName}`, '');

        const endpoints = parseRouteFile(filePath);
        endpoints.forEach(({ method, subPath, handlerName, handlerPath }) => {
            const fullPath = path.posix.join(mountPath, subPath === '/' ? '' : subPath);
            lines.push(`### ${method} ${fullPath}`, '');

            let queryParams = [];
            let bodyParams = [];

            // JSDoc info
            const jsdoc = handlerName ? getJSDocForFunction(handlerPath, handlerName) : null;
            if (jsdoc) {
                if (jsdoc.description) lines.push(jsdoc.description.trim(), '');

                const params = jsdoc.tags.filter((t) => t.tag === 'param');
                queryParams = jsdoc.tags.filter((t) => t.tag === 'query');
                bodyParams = jsdoc.tags.filter((t) => t.tag === 'body');
                const responseTags = jsdoc.tags.filter((t) => t.tag === 'response');
                if (queryParams.length) {
                    lines.push('**Query Parameters**:', '');
                    queryParams.forEach((p) => {
                        const req = p.optional ? 'optional' : 'required';
                        lines.push(`- \`${p.name}\` (${p.type}) - ${p.description} _${req}_`);
                    });
                    lines.push('');
                }

                if (bodyParams.length) {
                    lines.push('**Request Body**:', '');
                    bodyParams.forEach((p) => {
                        const req = p.optional ? 'optional' : 'required';
                        lines.push(`- \`${p.name}\` (${p.type}) - ${p.description} _${req}_`);
                    });
                    lines.push('');
                }

                if (responseTags.length) {
                    lines.push('**Response**:', '');
                    responseTags.forEach((r) => {
                        lines.push(`- (${r.type}) ${r.description}`);
                    });
                    lines.push('');
                }

                if (params.length) {
                    lines.push('**Parameters**:', '');
                    params.forEach((p) => {
                        const req = p.optional ? 'optional' : 'required';
                        lines.push(`- \`${p.name}\` (${p.type}) - ${p.description} _${req}_`);
                    });
                    lines.push('');
                }

                const returns = jsdoc.tags.find((t) => t.tag === 'returns' || t.tag === 'return');
                if (returns) {
                    lines.push('**Returns**:', '', `- (${returns.type}) ${returns.description || ''}`, '');
                }

                let examples = jsdoc.tags.filter((t) => t.tag === 'example');
                if (examples.length === 0) {
                    // generate a stub example
                    examples = [
                        {
                            description: `// Example usage\n${handlerName}(/* args */);`,
                        },
                    ];
                }

                if (examples.length) {
                    lines.push('**Example**:', '');
                    examples.forEach((ex) => {
                        lines.push('```js', ex.source?.map((l) => l.source).join('\n') || ex.description, '```', '');
                    });
                }
            } else {
                lines.push('Description: _TBD_', '');
            }

            // curl example (auto generated)
            const curlLines = buildCurlExample(method, fullPath, queryParams, bodyParams);
            lines.push('```bash', ...curlLines, '```', '');
        });
    });

    const outputPath = path.resolve('docs/API_GENERATED.md');
    fs.writeFileSync(outputPath, lines.join('\n'));
    console.log(`API documentation written to ${outputPath}`);
}

function generateFunctionsDocs() {
    const jsFiles = getAllJsFiles(path.resolve('app'));
    const lines = [
        '# Functions & Components Documentation',
        'Automatically generated from exported symbols & JSDoc',
        '',
    ];

    jsFiles.forEach((file) => {
        const content = fs.readFileSync(file, 'utf8');
        const rel = path.relative(process.cwd(), file);
        const exportConstRegex = /export\s+const\s+(\w+)/g;
        const exportFunctionRegex = /export\s+function\s+(\w+)/g;
        const exportAsyncFuncRegex = /export\s+async\s+function\s+(\w+)/g;
        const exports = new Set();
        let match;
        while ((match = exportConstRegex.exec(content)) !== null) exports.add(match[1]);
        while ((match = exportFunctionRegex.exec(content)) !== null) exports.add(match[1]);
        while ((match = exportAsyncFuncRegex.exec(content)) !== null) exports.add(match[1]);

        if (exports.size === 0) return;

        lines.push(`## ${rel}`, '');

        exports.forEach((name) => {
            const doc = getJSDocForFunction(file, name);
            if (!doc) {
                lines.push(`### \`${name}\``, '', '_No JSDoc available_', '');
                return;
            }

            lines.push(`### \`${name}\``, '');
            if (doc.description) lines.push(doc.description.trim(), '');

            const params = doc.tags.filter((t) => t.tag === 'param');
            const bodyParams = doc.tags.filter((t) => t.tag === 'body');
            const responseTags = doc.tags.filter((t) => t.tag === 'response');
            if (params.length) {
                lines.push('**Parameters**:', '');
                params.forEach((p) => {
                    const req = p.optional ? 'optional' : 'required';
                    lines.push(`- \`${p.name}\` (${p.type}) - ${p.description} _${req}_`);
                });
                lines.push('');
            }
            if (bodyParams.length) {
                lines.push('**Body Fields**:', '');
                bodyParams.forEach((p) => {
                    const req = p.optional ? 'optional' : 'required';
                    lines.push(`- \`${p.name}\` (${p.type}) - ${p.description} _${req}_`);
                });
                lines.push('');
            }
            if (responseTags.length) {
                lines.push('**Response**:', '');
                responseTags.forEach((r) => {
                    lines.push(`- (${r.type}) ${r.description}`);
                });
                lines.push('');
            }

            const returns = doc.tags.find((t) => t.tag === 'returns' || t.tag === 'return');
            if (returns) {
                lines.push('**Returns**:', '', `- (${returns.type}) ${returns.description || ''}`, '');
            }

            let examples = doc.tags.filter((t) => t.tag === 'example');
            if (examples.length === 0) {
                examples = [
                    {
                        description: buildFunctionExample(name, params),
                    },
                ];
            }

            if (examples.length) {
                lines.push('**Example**:', '');
                examples.forEach((ex) => {
                    lines.push('```js', ex.source?.map((l) => l.source).join('\n') || ex.description, '```', '');
                });
            }
        });
        lines.push('');
    });

    const outputPath = path.resolve('docs/FUNCTIONS_GENERATED.md');
    fs.writeFileSync(outputPath, lines.join('\n'));
    console.log(`Functions documentation written to ${outputPath}`);
}

function getJSDocForFunction(filePath, fnName) {
    if (!fs.existsSync(filePath)) return null;
    const content = fs.readFileSync(filePath, 'utf8');

    // Build regex to capture JSDoc preceding the function definition
    const pattern = new RegExp(
        `/\*\*([\\s\\S]*?)\*/[\\s\\n\\r]*?(?:export\\s+)?(?:const|async\\s+function|function|let|var)\\s+${fnName}\\b`,
        'm'
    );
    const match = content.match(pattern);
    if (!match) return null;

    const rawComment = `/**${match[1]}*/`;
    try {
        const parsed = parseComments(rawComment, { spacing: 'preserve' });
        if (parsed && parsed.length) return parsed[0];
    } catch (e) {
        // ignore parse errors
    }
    return null;
}

function sampleForType(type) {
    if (!type) return 'null';
    const t = type.toLowerCase();
    if (t.includes('string')) return '"example"';
    if (t.includes('number') || t.includes('int') || t.includes('float')) return '123';
    if (t.includes('boolean') || t.includes('bool')) return 'true';
    if (t.includes('array')) return '[]';
    if (t.includes('object')) return '{}';
    return 'null';
}

function buildCurlExample(method, url, queryParams, bodyParams) {
    const qpObj = {};
    queryParams.forEach((p) => {
        qpObj[p.name] = sampleForType(p.type).replace(/"/g, '').replace(/'/g, '');
    });
    const queryStr = Object.keys(qpObj).length
        ?
              '?' +
              Object.entries(qpObj)
                  .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
                  .join('&')
        : '';

    const bodyObj = {};
    bodyParams.forEach((p) => {
        bodyObj[p.name] = JSON.parse(sampleForType(p.type));
    });

    const fullUrl = `http://localhost:7055${url}${queryStr}`;
    if (['GET', 'DELETE'].includes(method)) {
        return [`curl -X ${method} "${fullUrl}"`];
    }

    return [
        `curl -X ${method} \\`,
        `  "${fullUrl}" \\`,
        `  -H 'Content-Type: application/json' \\`,
        `  -d '${JSON.stringify(bodyObj, null, 2)}'`,
    ];
}

function buildFunctionExample(name, params) {
    const argsStr = params
        .map((p) => sampleForType(p.type))
        .join(', ');
    return [`// Example usage`, `${name}(${argsStr});`].join('\n');
}

function main() {
    generateApiDocs();
    generateFunctionsDocs();
}

main();