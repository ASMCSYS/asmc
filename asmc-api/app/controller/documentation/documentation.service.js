import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Get documentation directory path
 */
export const getDocumentationPath = () => {
    return path.join(__dirname, '../../../tech-documents');
};

/**
 * Get component directory path
 */
export const getComponentPath = (component) => {
    const docsPath = getDocumentationPath();
    return path.join(docsPath, component);
};

/**
 * Validate component name
 */
export const isValidComponent = (component) => {
    const validComponents = [
        'asmc-api',
        'asmc-admin',
        'asmcdae-mobile',
        'asmc-next',
        'system-deployment',
    ];
    return validComponents.includes(component);
};

/**
 * Get component information
 */
export const getComponentInfo = (component) => {
    const componentInfo = {
        'asmc-api': {
            name: 'ASMC API (Backend)',
            description:
                'Backend API documentation for Express.js server with MongoDB integration',
            techStack: ['Node.js', 'Express.js', 'MongoDB', 'JWT', 'Joi', 'PM2'],
            icon: '🔧',
            color: '#28a745',
        },
        'asmc-admin': {
            name: 'ASMC Admin (Admin Panel)',
            description: 'Admin panel documentation for React.js application',
            techStack: ['React.js', 'JavaScript', 'CSS', 'Bootstrap'],
            icon: '👨‍💼',
            color: '#007bff',
        },
        'asmcdae-mobile': {
            name: 'ASMCDAE Mobile (Mobile App)',
            description: 'Mobile app documentation for React Native application',
            techStack: ['React Native', 'JavaScript', 'Android', 'iOS'],
            icon: '📱',
            color: '#6f42c1',
        },
        'asmc-next': {
            name: 'ASMC Next (Frontend)',
            description: 'Frontend documentation for Next.js application',
            techStack: ['Next.js', 'React', 'Redux Toolkit', 'SCSS'],
            icon: '🌐',
            color: '#fd7e14',
        },
        'system-deployment': {
            name: 'System Deployment',
            description: 'Complete system deployment and infrastructure documentation',
            techStack: ['Ubuntu', 'Nginx', 'PM2', 'MongoDB', 'Docker', 'SSL'],
            icon: '🚀',
            color: '#dc3545',
        },
    };

    return componentInfo[component] || null;
};

/**
 * Get all markdown files in a directory
 */
export const getMarkdownFiles = (directoryPath) => {
    try {
        if (!fs.existsSync(directoryPath)) {
            return [];
        }

        return fs
            .readdirSync(directoryPath)
            .filter((file) => file.endsWith('.md'))
            .map((file) => {
                const filePath = path.join(directoryPath, file);
                const stats = fs.statSync(filePath);

                return {
                    name: file.replace('.md', ''),
                    filename: file,
                    size: stats.size,
                    created: stats.birthtime,
                    modified: stats.mtime,
                };
            })
            .sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
        console.error('Error reading markdown files:', error);
        return [];
    }
};

/**
 * Read file content safely
 */
export const readFileContent = (filePath) => {
    try {
        if (!fs.existsSync(filePath)) {
            return null;
        }

        return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        console.error('Error reading file:', error);
        return null;
    }
};

/**
 * Search text in content
 */
export const searchInContent = (content, query) => {
    try {
        const searchRegex = new RegExp(query, 'gi');
        const matches = content.match(searchRegex);

        if (!matches || matches.length === 0) {
            return { matchCount: 0, matchingLines: [] };
        }

        // Get context around matches
        const lines = content.split('\n');
        const matchingLines = [];

        lines.forEach((line, index) => {
            if (searchRegex.test(line)) {
                matchingLines.push({
                    lineNumber: index + 1,
                    content: line.trim(),
                    context: lines
                        .slice(Math.max(0, index - 2), index + 3)
                        .map((contextLine, contextIndex) => ({
                            lineNumber: Math.max(0, index - 2) + contextIndex + 1,
                            content: contextLine.trim(),
                        })),
                });
            }
        });

        return {
            matchCount: matches.length,
            matchingLines: matchingLines.slice(0, 10), // Limit to 10 matches per file
        };
    } catch (error) {
        console.error('Error searching in content:', error);
        return { matchCount: 0, matchingLines: [] };
    }
};

/**
 * Generate file statistics
 */
export const getFileStatistics = (component) => {
    try {
        const componentPath = getComponentPath(component);
        if (!fs.existsSync(componentPath)) {
            return null;
        }

        const files = getMarkdownFiles(componentPath);
        const totalSize = files.reduce((sum, file) => sum + file.size, 0);
        const totalLines = files.reduce((sum, file) => {
            const filePath = path.join(componentPath, file.filename);
            const content = readFileContent(filePath);
            if (content) {
                return sum + content.split('\n').length;
            }
            return sum;
        }, 0);

        return {
            totalFiles: files.length,
            totalSize,
            totalLines,
            averageFileSize: files.length > 0 ? Math.round(totalSize / files.length) : 0,
            averageLinesPerFile:
                files.length > 0 ? Math.round(totalLines / files.length) : 0,
        };
    } catch (error) {
        console.error('Error getting file statistics:', error);
        return null;
    }
};

/**
 * Get documentation overview
 */
export const getDocumentationOverview = () => {
    try {
        const docsPath = getDocumentationPath();
        const overview = {
            totalComponents: 0,
            totalFiles: 0,
            totalSize: 0,
            components: [],
        };

        const validComponents = [
            'asmc-api',
            'asmc-admin',
            'asmcdae-mobile',
            'asmc-next',
            'system-deployment',
        ];

        for (const component of validComponents) {
            const componentPath = path.join(docsPath, component);
            if (fs.existsSync(componentPath)) {
                const files = getMarkdownFiles(componentPath);
                const stats = getFileStatistics(component);
                const componentInfo = getComponentInfo(component);

                overview.totalComponents++;
                overview.totalFiles += files.length;
                overview.totalSize += stats ? stats.totalSize : 0;

                overview.components.push({
                    component,
                    ...componentInfo,
                    files: files.length,
                    size: stats ? stats.totalSize : 0,
                    lastModified:
                        files.length > 0
                            ? Math.max(...files.map((f) => f.modified.getTime()))
                            : new Date().getTime(),
                });
            }
        }

        return overview;
    } catch (error) {
        console.error('Error getting documentation overview:', error);
        return null;
    }
};

/**
 * Validate file name
 */
export const isValidFileName = (filename) => {
    // Allow alphanumeric characters, hyphens, underscores, and dots
    const validFileNameRegex = /^[a-zA-Z0-9._-]+$/;
    return validFileNameRegex.test(filename);
};

/**
 * Get file metadata
 */
export const getFileMetadata = (component, filename) => {
    try {
        const filePath = path.join(getComponentPath(component), `${filename}.md`);

        if (!fs.existsSync(filePath)) {
            return null;
        }

        const stats = fs.statSync(filePath);
        const content = readFileContent(filePath);

        // Extract title from markdown content
        const titleMatch = content ? content.match(/^#\s+(.+)$/m) : null;
        const title = titleMatch ? titleMatch[1].trim() : filename;

        // Extract description from markdown content
        const descriptionMatch = content ? content.match(/^#\s+.+$\n\n(.+)$/m) : null;
        const description = descriptionMatch ? descriptionMatch[1].trim() : '';

        return {
            name: filename,
            filename: `${filename}.md`,
            title,
            description,
            size: stats.size,
            created: stats.birthtime,
            modified: stats.mtime,
            path: filePath,
        };
    } catch (error) {
        console.error('Error getting file metadata:', error);
        return null;
    }
};
