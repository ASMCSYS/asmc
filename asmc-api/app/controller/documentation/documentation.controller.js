import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { responseSend } from '../../helpers/responseSend.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Format file size in human readable format
 */
const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Get all available documentation
 */
export const getDocumentationList = async (req, res) => {
    try {
        const docsPath = path.join(__dirname, '../../../documentation');

        const documentation = {
            'asmc-api': {
                name: 'ASMC API (Backend)',
                description: 'Backend API documentation for Express.js server',
                path: '/documentation/asmc-api',
                files: [],
            },
            'asmc-admin': {
                name: 'ASMC Admin (Admin Panel)',
                description: 'Admin panel documentation for React.js application',
                path: '/documentation/asmc-admin',
                files: [],
            },
            'asmcdae-mobile': {
                name: 'ASMCDAE Mobile (Mobile App)',
                description: 'Mobile app documentation for React Native application',
                path: '/documentation/asmcdae-mobile',
                files: [],
            },
            'asmc-next': {
                name: 'ASMC Next (Frontend)',
                description: 'Frontend documentation for Next.js application',
                path: '/documentation/asmc-next',
                files: [],
            },
            'system-deployment': {
                name: 'System Deployment',
                description:
                    'Complete system deployment and infrastructure documentation',
                path: '/documentation/system-deployment',
                files: [],
            },
        };

        // Read each documentation folder
        for (const [key, doc] of Object.entries(documentation)) {
            const folderPath = path.join(docsPath, key);
            if (fs.existsSync(folderPath)) {
                const files = fs
                    .readdirSync(folderPath)
                    .filter((file) => file.endsWith('.pdf'))
                    .map((file) => ({
                        name: file.replace('.pdf', ''),
                        filename: file,
                        path: `/documentation/${key}/${file}`,
                    }));
                doc.files = files;
            }
        }

        return responseSend(
            res,
            200,
            'Documentation list retrieved successfully',
            documentation,
        );
    } catch (error) {
        console.error('Error getting documentation list:', error);
        return responseSend(res, 500, 'Failed to retrieve documentation list', {
            error: error.message,
        });
    }
};

/**
 * Get specific documentation file
 */
export const getDocumentationFile = async (req, res) => {
    try {
        const { component, filename } = req.params;

        // Validate component
        const validComponents = [
            'asmc-api',
            'asmc-admin',
            'asmcdae-mobile',
            'asmc-next',
            'system-deployment',
        ];
        if (!validComponents.includes(component)) {
            return responseSend(res, 400, 'Invalid documentation component', {
                validComponents,
            });
        }

        const filePath = path.join(
            __dirname,
            '../../../documentation',
            component,
            `${filename}.pdf`,
        );

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return responseSend(res, 404, 'Documentation file not found', {
                component,
                filename,
            });
        }

        // Get file stats
        const stats = fs.statSync(filePath);

        // Check if this is a request for PDF preview (no download parameter)
        const isPreview = !req.query.download;

        if (isPreview) {
            // Serve PDF for preview in browser
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Length', stats.size);
            res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour

            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);
        } else {
            // Return file metadata for API response
            const result = {
                component,
                filename,
                metadata: {
                    size: stats.size,
                    created: stats.birthtime,
                    modified: stats.mtime,
                    path: filePath,
                    formattedSize: formatFileSize(stats.size),
                    formattedCreated: stats.birthtime.toLocaleDateString(),
                    formattedModified: stats.mtime.toLocaleDateString(),
                },
            };

            return responseSend(
                res,
                200,
                'Documentation file retrieved successfully',
                result,
            );
        }
    } catch (error) {
        console.error('Error getting documentation file:', error);
        return responseSend(res, 500, 'Failed to retrieve documentation file', {
            error: error.message,
        });
    }
};

/**
 * Get documentation as downloadable file
 */
export const downloadDocumentation = async (req, res) => {
    try {
        const { component, filename } = req.params;
        const { format = 'pdf' } = req.query;

        // Validate component
        const validComponents = [
            'asmc-api',
            'asmc-admin',
            'asmcdae-mobile',
            'asmc-next',
            'system-deployment',
        ];
        if (!validComponents.includes(component)) {
            return responseSend(res, 400, 'Invalid documentation component');
        }

        const filePath = path.join(
            __dirname,
            '../../../documentation',
            component,
            `${filename}.pdf`,
        );

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return responseSend(res, 404, 'Documentation file not found');
        }

        // Get file stats
        const stats = fs.statSync(filePath);

        // Set appropriate headers for download
        const downloadFilename = `${component}_${filename}.${format}`;
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="${downloadFilename}"`,
        );

        // Set content type for PDF
        res.setHeader('Content-Type', 'application/pdf');

        res.setHeader('Content-Length', stats.size);

        // Stream the file
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
    } catch (error) {
        console.error('Error downloading documentation:', error);
        return responseSend(res, 500, 'Failed to download documentation file', {
            error: error.message,
        });
    }
};

/**
 * Get documentation component overview
 */
export const getDocumentationComponent = async (req, res) => {
    try {
        const { component } = req.params;

        // Validate component
        const validComponents = [
            'asmc-api',
            'asmc-admin',
            'asmcdae-mobile',
            'asmc-next',
            'system-deployment',
        ];
        if (!validComponents.includes(component)) {
            return responseSend(res, 400, 'Invalid documentation component', {
                validComponents,
            });
        }

        const docsPath = path.join(__dirname, '../../../documentation', component);

        if (!fs.existsSync(docsPath)) {
            return responseSend(res, 404, 'Documentation component not found');
        }

        // Get all markdown files in the component folder
        const files = fs
            .readdirSync(docsPath)
            .filter((file) => file.endsWith('.pdf'))
            .map((file) => {
                const filePath = path.join(docsPath, file);
                const stats = fs.statSync(filePath);
                return {
                    name: file.replace('.pdf', ''),
                    filename: file,
                    path: `/documentation/${component}/${file}`,
                    downloadPath: `/documentation/${component}/${file}/download`,
                    size: stats.size,
                    created: stats.birthtime,
                    modified: stats.mtime,
                };
            });

        // Get component description
        const componentDescriptions = {
            'asmc-api': {
                name: 'ASMC API (Backend)',
                description:
                    'Backend API documentation for Express.js server with MongoDB integration',
                techStack: ['Node.js', 'Express.js', 'MongoDB', 'JWT', 'Joi', 'PM2'],
            },
            'asmc-admin': {
                name: 'ASMC Admin (Admin Panel)',
                description: 'Admin panel documentation for React.js application',
                techStack: ['React.js', 'JavaScript', 'CSS', 'Bootstrap'],
            },
            'asmcdae-mobile': {
                name: 'ASMCDAE Mobile (Mobile App)',
                description: 'Mobile app documentation for React Native application',
                techStack: ['React Native', 'JavaScript', 'Android', 'iOS'],
            },
            'asmc-next': {
                name: 'ASMC Next (Frontend)',
                description: 'Frontend documentation for Next.js application',
                techStack: ['Next.js', 'React', 'Redux Toolkit', 'SCSS'],
            },
            'system-deployment': {
                name: 'System Deployment',
                description:
                    'Complete system deployment and infrastructure documentation',
                techStack: ['Ubuntu', 'Nginx', 'PM2', 'MongoDB', 'Docker', 'SSL'],
            },
        };

        const result = {
            component,
            ...componentDescriptions[component],
            files,
            totalFiles: files.length,
        };

        return responseSend(
            res,
            200,
            'Documentation component retrieved successfully',
            result,
        );
    } catch (error) {
        console.error('Error getting documentation component:', error);
        return responseSend(res, 500, 'Failed to retrieve documentation component', {
            error: error.message,
        });
    }
};

/**
 * Search documentation
 */
export const searchDocumentation = async (req, res) => {
    try {
        const { q: query, component } = req.query;

        if (!query || query.trim().length < 2) {
            return responseSend(
                res,
                400,
                'Search query must be at least 2 characters long',
            );
        }

        const docsPath = path.join(__dirname, '../../../documentation');
        const results = [];

        // Get components to search
        let componentsToSearch = [
            'asmc-api',
            'asmc-admin',
            'asmcdae-mobile',
            'asmc-next',
            'system-deployment',
        ];
        if (component && componentsToSearch.includes(component)) {
            componentsToSearch = [component];
        }

        // Search through each component
        for (const comp of componentsToSearch) {
            const componentPath = path.join(docsPath, comp);
            if (fs.existsSync(componentPath)) {
                const files = fs
                    .readdirSync(componentPath)
                    .filter((file) => file.endsWith('.pdf'));

                for (const file of files) {
                    const filePath = path.join(componentPath, file);
                    const content = fs.readFileSync(filePath, 'utf8');

                    // Simple text search (case-insensitive)
                    const searchRegex = new RegExp(query, 'gi');
                    const matches = content.match(searchRegex);

                    if (matches && matches.length > 0) {
                        // Get context around matches
                        const lines = content.split('\n');
                        const matchingLines = [];

                        lines.forEach((line, index) => {
                            if (searchRegex.test(line)) {
                                matchingLines.push({
                                    lineNumber: index + 1,
                                    content: line.trim(),
                                    context: lines.slice(
                                        Math.max(0, index - 2),
                                        index + 3,
                                    ),
                                });
                            }
                        });

                        results.push({
                            component: comp,
                            filename: file,
                            name: file.replace('.pdf', ''),
                            path: `/documentation/${comp}/${file}`,
                            matchCount: matches.length,
                            matchingLines: matchingLines.slice(0, 5), // Limit to 5 matches per file
                        });
                    }
                }
            }
        }

        // Sort by match count
        results.sort((a, b) => b.matchCount - a.matchCount);

        return responseSend(res, 200, 'Documentation search completed', {
            query,
            component: component || 'all',
            totalResults: results.length,
            results,
        });
    } catch (error) {
        console.error('Error searching documentation:', error);
        return responseSend(res, 500, 'Failed to search documentation', {
            error: error.message,
        });
    }
};
