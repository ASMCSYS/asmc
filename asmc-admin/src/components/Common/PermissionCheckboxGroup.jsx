import React from "react";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Checkbox,
    FormControlLabel,
    Typography,
    Box,
    FormControl,
    FormLabel,
    FormGroup,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Utility to generate human-readable labels from permission values
export function permissionLabel(permission) {
    if (!permission) return "";
    if (permission.endsWith(":all")) return `All ${capitalizeWords(permission.split(":")[0])}`;
    const [resource, action] = permission.split(":");
    if (!resource || !action) return permission;
    // Support multiple underscores in action or resource
    return `${capitalizeWords(action)} ${capitalizeWords(resource)}`;
}

// Capitalize first letter of each word, handle underscores and camelCase
function capitalizeWords(str) {
    return str
        .replace(/([a-z])([A-Z])/g, "$1 $2") // camelCase to space
        .replace(/_/g, " ") // underscores to space
        .split(" ")
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
}

// Utility: group permissions by prefix (e.g., banner_master, location_master, etc.)
function groupByPrefix(permissions) {
    const groups = {};
    permissions.forEach((perm) => {
        // Use everything before the first colon as the group key
        const match = perm.match(/^([a-zA-Z0-9_]+):/);
        const key = match ? match[1] : perm;
        if (!groups[key]) groups[key] = [];
        groups[key].push(perm);
    });
    return groups;
}

// Grouped, collapsible permission checkbox group
export default function PermissionCheckboxGroup({
    permissionGroups,
    permissions = [], // fallback for flat array
    values = [],
    setFieldValue,
    fieldName = "permissions",
    title = "Permissions",
}) {
    // If permissionGroups is provided, use grouped UI
    if (permissionGroups && Array.isArray(permissionGroups) && permissionGroups.length > 0) {
        return (
            <Box sx={{ mt: 2 }}>
                <FormLabel component="legend" sx={{ mb: 1 }}>
                    {title}
                </FormLabel>
                {permissionGroups.map((group) => {
                    const allChecked = group.permissions.every((p) => values.includes(p));
                    const someChecked = !allChecked && group.permissions.some((p) => values.includes(p));
                    // Detect if this group has mixed prefixes (e.g., Common Master)
                    const subgroups = groupByPrefix(group.permissions);
                    const isSubgrouped = Object.keys(subgroups).length > 1;
                    return (
                        <Accordion key={group.label} defaultExpanded sx={{ mb: 1 }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={allChecked}
                                            indeterminate={someChecked}
                                            onChange={(e) => {
                                                let newPerms = e.target.checked
                                                    ? Array.from(new Set([...values, ...group.permissions]))
                                                    : values.filter((p) => !group.permissions.includes(p));
                                                setFieldValue(fieldName, newPerms);
                                            }}
                                        />
                                    }
                                    label={
                                        <Typography fontWeight="bold">
                                            {group.label} ({group.permissions.filter((p) => values.includes(p)).length}/
                                            {group.permissions.length})
                                        </Typography>
                                    }
                                />
                            </AccordionSummary>
                            <AccordionDetails>
                                {isSubgrouped ? (
                                    Object.entries(subgroups).map(([subKey, perms]) => (
                                        <div key={subKey} style={{ marginBottom: 12 }}>
                                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                                {capitalizeWords(permissionLabel(subKey.replace(/_/g, " ")))}
                                            </Typography>
                                            <FormGroup row>
                                                {perms.map((perm) => (
                                                    <FormControlLabel
                                                        key={perm}
                                                        control={
                                                            <Checkbox
                                                                checked={values.includes(perm)}
                                                                onChange={(e) => {
                                                                    let newPerms = e.target.checked
                                                                        ? [...values, perm]
                                                                        : values.filter((p) => p !== perm);
                                                                    setFieldValue(fieldName, newPerms);
                                                                }}
                                                            />
                                                        }
                                                        label={permissionLabel(perm)}
                                                    />
                                                ))}
                                            </FormGroup>
                                        </div>
                                    ))
                                ) : (
                                    <FormGroup row>
                                        {group.permissions.map((perm) => (
                                            <FormControlLabel
                                                key={perm}
                                                control={
                                                    <Checkbox
                                                        checked={values.includes(perm)}
                                                        onChange={(e) => {
                                                            let newPerms = e.target.checked
                                                                ? [...values, perm]
                                                                : values.filter((p) => p !== perm);
                                                            setFieldValue(fieldName, newPerms);
                                                        }}
                                                    />
                                                }
                                                label={permissionLabel(perm)}
                                            />
                                        ))}
                                    </FormGroup>
                                )}
                            </AccordionDetails>
                        </Accordion>
                    );
                })}
            </Box>
        );
    }
    // Fallback: flat array (legacy usage)
    // Find all except 'all' for this resource
    const allPerm = permissions.find((p) => p.endsWith(":all"));
    const nonAllPerms = permissions.filter((p) => !p.endsWith(":all"));
    const isAllChecked = allPerm && values.includes(allPerm);
    const allChecked = nonAllPerms.every((p) => values.includes(p));

    const handleCheck = (permValue, checked) => {
        if (allPerm && permValue === allPerm) {
            if (checked) {
                setFieldValue(fieldName, [...nonAllPerms, allPerm]);
            } else {
                setFieldValue(fieldName, []);
            }
        } else {
            let newPerms = checked ? [...values, permValue] : values.filter((p) => p !== permValue && p !== allPerm);
            // If all individual are checked, add 'All'
            if (checked && nonAllPerms.every((p) => (permValue === p ? true : values.includes(p))) && allPerm) {
                newPerms = [...nonAllPerms, allPerm];
            }
            setFieldValue(fieldName, newPerms);
        }
    };

    return (
        <FormControl component="fieldset" variant="standard" sx={{ mt: 2 }}>
            <FormLabel component="legend">{title}</FormLabel>
            <FormGroup row>
                {permissions.map((perm) => (
                    <FormControlLabel
                        key={perm}
                        control={
                            <Checkbox
                                checked={values.includes(perm)}
                                onChange={(e) => handleCheck(perm, e.target.checked)}
                                name={perm}
                            />
                        }
                        label={permissionLabel(perm)}
                    />
                ))}
            </FormGroup>
        </FormControl>
    );
}
