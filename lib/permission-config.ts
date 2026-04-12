export const FEATURE_GROUPS = [
    {
        id: 'vehicle',
        label: 'Vehicle Registry Module',
        features: [
            { id: 'vehicle_view', label: 'View Fleet Inventory' },
            { id: 'vehicle_single_add', label: 'Single Vehicle Entry' },
            { id: 'vehicle_bulk_upload', label: 'Bulk CSV Upload' },
            { id: 'vehicle_edit', label: 'Edit Vehicle Details' },
            { id: 'vehicle_delete', label: 'Delete Vehicles' },
        ]
    },
    {
        id: 'crm',
        label: 'CRM & Query Registry',
        features: [
            { id: 'crm_view', label: 'View All Queries' },
            { id: 'crm_create', label: 'Create New Query' },
            { id: 'crm_edit', label: 'Edit Query Details' },
            { id: 'crm_delete', label: 'Delete Queries' },
        ]
    },
    {
        id: 'qmake',
        label: 'Itinerary Builder (Query Maker)',
        features: [
            { id: 'qmake_access', label: 'Access Plan Builder' },
            { id: 'qmake_versions', label: 'Create Option Versions' },
            { id: 'qmake_edit_plan', label: 'Edit Daily Itinerary' },
            { id: 'qmake_export', label: 'Download PDF/Excel' },
        ]
    },
    {
        id: 'sightseeing',
        label: 'Sightseeing Database',
        features: [
            { id: 'sightsee_view', label: 'View Sightseeing List' },
            { id: 'sightsee_add', label: 'Add Single Entry' },
            { id: 'sightsee_bulk', label: 'Bulk Database Upload' },
            { id: 'sightsee_edit_delete', label: 'Modify/Delete Records' },
        ]
    },
    {
        id: 'admin',
        label: 'System Administration',
        features: [
            { id: 'admin_dashboard', label: 'View Admin Dashboard' },
            { id: 'admin_users', label: 'Manage System Users' },
            { id: 'admin_permissions', label: 'Edit Permission Matrix' },
        ]
    }
];

export const ALL_ROLES = ['ADMIN', 'MANAGER', 'EXECUTIVE', 'VIEWER', 'EVERYONE'];
