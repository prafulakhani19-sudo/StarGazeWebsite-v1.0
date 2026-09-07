import { Permission, Role } from './types';

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  SUPER_ADMIN: [
    'dashboard.view',
    'users.view',
    'users.create',
    'users.edit',
    'users.deactivate',
    'users.roles',
    'homepage.view',
    'homepage.edit',
    'homepage.publish',
    'projects.view',
    'projects.create',
    'projects.edit',
    'projects.delete',
    'projects.publish',
    'services.view',
    'services.create',
    'services.edit',
    'services.delete',
    'equipment.view',
    'equipment.create',
    'equipment.edit',
    'equipment.delete',
    'equipment.publish',
    'distribution.view',
    'distribution.create',
    'distribution.edit',
    'distribution.delete',
    'distribution.publish',
    'events.view',
    'events.create',
    'events.edit',
    'events.delete',
    'events.publish',
    'news.view',
    'news.create',
    'news.edit',
    'news.delete',
    'news.publish',
    'media.view',
    'media.upload',
    'media.edit',
    'media.delete',
    'enquiries.view',
    'enquiries.edit',
    'enquiries.assign',
    'seo.view',
    'seo.edit',
    'appearance.view',
    'appearance.edit',
    'settings.view',
    'settings.edit',
    'activity_logs.view',
  ],

  CONTENT_ADMIN: [
    'dashboard.view',
    'homepage.view',
    'homepage.edit',
    'homepage.publish',
    'projects.view',
    'projects.create',
    'projects.edit',
    'projects.delete',
    'projects.publish',
    'services.view',
    'services.create',
    'services.edit',
    'services.delete',
    'news.view',
    'news.create',
    'news.edit',
    'news.delete',
    'news.publish',
    'media.view',
    'media.upload',
    'media.edit',
    'media.delete',
    'enquiries.view',
  ],

  EDITOR: [
    'dashboard.view',
    'projects.view',
    'projects.create',
    'projects.edit',
    'news.view',
    'news.create',
    'news.edit',
    'media.view',
    'media.upload',
  ],

  EQUIPMENT_MANAGER: [
    'dashboard.view',
    'equipment.view',
    'equipment.create',
    'equipment.edit',
    'equipment.delete',
    'equipment.publish',
    'media.view',
    'media.upload',
    'enquiries.view',
    'enquiries.edit',
  ],

  EVENT_MANAGER: [
    'dashboard.view',
    'events.view',
    'events.create',
    'events.edit',
    'events.delete',
    'events.publish',
    'media.view',
    'media.upload',
    'enquiries.view',
    'enquiries.edit',
  ],

  MARKETING_MANAGER: [
    'dashboard.view',
    'news.view',
    'news.create',
    'news.edit',
    'news.delete',
    'news.publish',
    'homepage.view',
    'homepage.edit',
    'seo.view',
    'seo.edit',
    'media.view',
    'media.upload',
  ],

  DISTRIBUTION_MANAGER: [
    'dashboard.view',
    'distribution.view',
    'distribution.create',
    'distribution.edit',
    'distribution.delete',
    'distribution.publish',
    'enquiries.view',
    'enquiries.edit',
    'media.view',
  ],

  VIEWER: [
    'dashboard.view',
    'projects.view',
    'equipment.view',
    'events.view',
    'distribution.view',
    'news.view',
    'media.view',
    'enquiries.view',
  ],
};

export interface RoleSummary {
  can: string[];
  cannot: string[];
}

export const ROLE_SUMMARIES: Record<Role, RoleSummary> = {
  SUPER_ADMIN: {
    can: [
      'Full administrative access & System Management',
      'Manage all users, roles, and status controls',
      'Publish & archive any CMS content across all divisions',
      'View system-wide activity logs and security settings',
    ],
    cannot: [],
  },
  CONTENT_ADMIN: {
    can: [
      'Manage & publish homepage content & visual features',
      'Create, edit, and publish film projects & pages',
      'Manage newsroom articles, about section, and services',
      'Upload and manage digital media assets',
    ],
    cannot: [
      'Manage user accounts or change roles',
      'Modify security settings or Firebase credentials',
      'Access sensitive system settings or security logs',
    ],
  },
  EDITOR: {
    can: [
      'Create and edit film projects and drafts',
      'Create and edit newsroom articles',
      'Upload and preview media library files',
    ],
    cannot: [
      'Manage users or change permissions',
      'Modify global site settings or appearance',
      'Publish directly without Content Admin approval (depending on config)',
    ],
  },
  EQUIPMENT_MANAGER: {
    can: [
      'Manage camera rigs, lenses, DOP equipment & specs',
      'Set equipment availability and rental rates',
      'Upload equipment product photography',
      'View & respond to equipment rental enquiries',
    ],
    cannot: [
      'Manage user accounts or security rules',
      'Edit homepage, main film catalog, or distribution',
      'Modify global site settings or appearance',
    ],
  },
  EVENT_MANAGER: {
    can: [
      'Manage film festivals, premiere launches, and exhibitions',
      'Create event galleries and video showreels',
      'Publish event-related announcements',
      'View & respond to event booking enquiries',
    ],
    cannot: [
      'Manage user accounts or system security',
      'Edit equipment catalog or distribution rights',
      'Modify site settings or core branding',
    ],
  },
  MARKETING_MANAGER: {
    can: [
      'Manage PR announcements, campaign content, & insights',
      'Configure SEO metadata, OpenGraph tags, & search indexing',
      'Select and curate promotional homepage feature slides',
      'Upload press kits and campaign media',
    ],
    cannot: [
      'Manage user accounts or authentication rules',
      'Modify technical Firebase settings or API routes',
      'Edit equipment availability or rental rates',
    ],
  },
  DISTRIBUTION_MANAGER: {
    can: [
      'Manage distribution titles, film rights, and series metadata',
      'Update territory availability and digital licenses',
      'View and respond to distribution & licensing enquiries',
    ],
    cannot: [
      'Manage users or system roles',
      'Modify global appearance or site settings',
      'Edit unrelated CMS modules (equipment, events)',
    ],
  },
  VIEWER: {
    can: [
      'Read-only access to admin dashboard summaries',
      'View catalog items, equipment specs, and news drafts',
      'View permitted incoming enquiries',
    ],
    cannot: [
      'Create, edit, or delete any content or media',
      'Publish content to the live website',
      'Manage user accounts or change settings',
    ],
  },
};

export function hasPermission(role: Role | undefined, permission: Permission): boolean {
  if (!role) return false;
  const permissions = ROLE_PERMISSIONS[role];
  return permissions ? permissions.includes(permission) : false;
}
