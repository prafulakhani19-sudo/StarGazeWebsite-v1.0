export type Role = 
  | 'SUPER_ADMIN'
  | 'CONTENT_ADMIN'
  | 'EDITOR'
  | 'EQUIPMENT_MANAGER'
  | 'EVENT_MANAGER'
  | 'MARKETING_MANAGER'
  | 'DISTRIBUTION_MANAGER'
  | 'VIEWER';

export type UserStatus = 'ACTIVE' | 'INACTIVE';

export type Permission =
  | 'dashboard.view'
  | 'users.view'
  | 'users.create'
  | 'users.edit'
  | 'users.deactivate'
  | 'users.roles'
  | 'homepage.view'
  | 'homepage.edit'
  | 'homepage.publish'
  | 'projects.view'
  | 'projects.create'
  | 'projects.edit'
  | 'projects.delete'
  | 'projects.publish'
  | 'services.view'
  | 'services.create'
  | 'services.edit'
  | 'services.delete'
  | 'equipment.view'
  | 'equipment.create'
  | 'equipment.edit'
  | 'equipment.delete'
  | 'equipment.publish'
  | 'distribution.view'
  | 'distribution.create'
  | 'distribution.edit'
  | 'distribution.delete'
  | 'distribution.publish'
  | 'events.view'
  | 'events.create'
  | 'events.edit'
  | 'events.delete'
  | 'events.publish'
  | 'news.view'
  | 'news.create'
  | 'news.edit'
  | 'news.delete'
  | 'news.publish'
  | 'media.view'
  | 'media.upload'
  | 'media.edit'
  | 'media.delete'
  | 'enquiries.view'
  | 'enquiries.edit'
  | 'enquiries.assign'
  | 'seo.view'
  | 'seo.edit'
  | 'appearance.view'
  | 'appearance.edit'
  | 'settings.view'
  | 'settings.edit'
  | 'activity_logs.view';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: Role;
  status: UserStatus;
  photoURL?: string;
  department?: string;
  phone?: string;
  notes?: string;
  requiresPasswordChange: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string | null;
  createdBy?: string;
}

export interface ActivityLog {
  id: string;
  actorId: string;
  actorName: string;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export type ContentStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface ProjectItem {
  id: string;
  title: string;
  genre: string;
  director: string;
  synopsis: string;
  posterUrl: string;
  trailerUrl?: string;
  releaseYear: number;
  status: ContentStatus;
  featured: boolean;
  updatedAt: string;
  createdAt: string;
}

export interface EquipmentItem {
  id: string;
  name: string;
  category: 'Camera' | 'Lens' | 'DOP Rig' | 'Lighting' | 'Audio' | 'Grip';
  specs: string;
  dailyRate: number;
  availability: 'AVAILABLE' | 'RENTED' | 'MAINTENANCE';
  imageUrl: string;
  status: ContentStatus;
  updatedAt: string;
}

export interface EventItem {
  id: string;
  title: string;
  category: 'Festival' | 'Launch' | 'Exhibition' | 'Premiere' | 'Workshop';
  location: string;
  eventDate: string;
  description: string;
  imageUrl: string;
  status: ContentStatus;
  updatedAt: string;
}

export interface DistributionTitle {
  id: string;
  title: string;
  type: 'Film' | 'Series' | 'Documentary' | 'Short';
  territories: string[];
  rightsAvailable: string[];
  synopsis: string;
  posterUrl: string;
  status: ContentStatus;
  updatedAt: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  publishDate: string;
  category: 'Announcement' | 'Press Release' | 'Insight' | 'Awards';
  imageUrl: string;
  status: ContentStatus;
  updatedAt: string;
}

export interface EnquiryItem {
  id: string;
  name: string;
  email: string;
  type: 'Rental' | 'Distribution' | 'General' | 'Event Booking';
  subject: string;
  message: string;
  status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt: string;
}

export interface MediaItem {
  id: string;
  name: string;
  originalFileName: string;
  storagePath: string;
  downloadUrl: string;
  category: 'HERO' | 'WORK' | 'FILMS' | 'EVENTS' | 'EQUIPMENT' | 'TEAM' | 'PARTNERS' | 'NEWSROOM' | 'GENERAL';
  project: 'NAYI SOCH' | 'PSYCHO' | 'SAHEB VIKAS KARI' | 'FATHER & SON DUO' | 'EVENTS' | 'STARGAZE' | 'OTHER';
  mimeType: string;
  fileSize: number;
  width?: number;
  height?: number;
  altText: string;
  desktopUrl?: string;
  mobileUrl?: string;
  wideUrl?: string;
  thumbnailUrl?: string;
  focalPoint?: { x: number; y: number };
  active: boolean;
  createdAt: string;
  updatedAt: string;
  uploadedBy?: string;
}
