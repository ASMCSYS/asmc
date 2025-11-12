import { format } from "date-fns";

// Parse documentation list response
export const parseDocumentationList = (data) => {
    if (!data || !data.result) return [];

    const { result } = data;
    const components = [];

    Object.keys(result).forEach((key) => {
        const component = result[key];
        components.push({
            key,
            name: component.name,
            description: component.description,
            path: component.path,
            files: component.files || [],
            icon: getComponentIcon(key),
            color: getComponentColor(key),
        });
    });

    return components;
};

// Parse documentation component response
export const parseDocumentationComponent = (data) => {
    if (!data || !data.result) return null;

    const { result } = data;
    return {
        component: result.component,
        name: result.name,
        description: result.description,
        techStack: result.techStack || [],
        files: (result.files || []).map((file) => ({
            ...file,
            formattedSize: formatFileSize(file.size),
            formattedCreated: format(new Date(file.created), "dd-MM-yyyy HH:mm"),
            formattedModified: format(new Date(file.modified), "dd-MM-yyyy HH:mm"),
        })),
        totalFiles: result.totalFiles || 0,
    };
};

// Parse documentation file response
export const parseDocumentationFile = (data) => {
    if (!data || !data.result) return null;

    const { result } = data;
    return {
        component: result.component,
        filename: result.filename,
        content: result.content,
        metadata: {
            ...result.metadata,
            formattedSize: formatFileSize(result.metadata.size),
            formattedCreated: format(new Date(result.metadata.created), "dd-MM-yyyy HH:mm"),
            formattedModified: format(new Date(result.metadata.modified), "dd-MM-yyyy HH:mm"),
        },
    };
};

// Parse search results
export const parseSearchResults = (data) => {
    if (!data || !data.result) return [];

    const { result } = data;
    return {
        query: result.query,
        component: result.component,
        totalResults: result.totalResults,
        results: (result.results || []).map((item) => ({
            ...item,
            componentIcon: getComponentIcon(item.component),
            componentColor: getComponentColor(item.component),
            componentName: getComponentName(item.component),
        })),
    };
};

// Helper functions
export const getComponentIcon = (componentKey) => {
    const icons = {
        "asmc-api": "🔧",
        "asmc-admin": "👨‍💼",
        "asmcdae-mobile": "📱",
        "asmc-next": "🌐",
        "system-deployment": "🚀",
    };
    return icons[componentKey] || "📄";
};

export const getComponentColor = (componentKey) => {
    const colors = {
        "asmc-api": "#28a745",
        "asmc-admin": "#007bff",
        "asmcdae-mobile": "#6f42c1",
        "asmc-next": "#fd7e14",
        "system-deployment": "#dc3545",
    };
    return colors[componentKey] || "#6c757d";
};

export const getComponentName = (componentKey) => {
    const names = {
        "asmc-api": "ASMC API (Backend)",
        "asmc-admin": "ASMC Admin (Admin Panel)",
        "asmcdae-mobile": "ASMCDAE Mobile (Mobile App)",
        "asmc-next": "ASMC Next (Frontend)",
        "system-deployment": "System Deployment",
    };
    return names[componentKey] || componentKey;
};

export const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const extractMarkdownTitle = (content) => {
    if (!content) return "";
    const match = content.match(/^#\s+(.+)$/m);
    return match ? match[1].trim() : "";
};

export const extractMarkdownDescription = (content) => {
    if (!content) return "";
    const match = content.match(/^#\s+.+$\n\n(.+)$/m);
    return match ? match[1].trim() : "";
};

export const highlightSearchTerm = (text, searchTerm) => {
    if (!searchTerm || !text) return text;
    const regex = new RegExp(`(${searchTerm})`, "gi");
    return text.replace(regex, "<mark>$1</mark>");
};
