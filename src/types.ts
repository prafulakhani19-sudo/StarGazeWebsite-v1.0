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

export interface HeroSlideItem {
  id: string;
  title: string;
  category: string;
  projectRef?: string;
  eyebrow?: string;
  description?: string;
  highlightTitle?: string;
  primaryCtaText?: string;
  primaryCtaLink?: string;
  primaryCtaExternal?: boolean;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  trailerUrl?: string;
  desktopMediaId?: string;
  mobileMediaId?: string;
  desktopSrc?: string;
  mobileSrc?: string;
  desktopFocalPoint?: { x: number; y: number };
  mobileFocalPoint?: { x: number; y: number };
  caption?: string;
  ctaLabel?: string;
  ctaDestination?: string;
  status: ContentStatus;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  slug?: string;
  genre: string;
  director: string;
  synopsis: string;
  longDescription?: string;
  clientInfo?: string;
  location?: string;
  credits?: string;
  services?: string[];
  posterUrl: string;
  coverMediaId?: string;
  heroMediaId?: string;
  heroUrl?: string;
  galleryMediaIds?: string[];
  galleryUrls?: string[];
  trailerUrl?: string;
  videoUrl?: string;
  releaseYear: number;
  status: ContentStatus;
  featured: boolean;
  displayOrder?: number;
  focalPoint?: { x: number; y: number };
  seoTitle?: string;
  seoDescription?: string;
  socialImageMediaId?: string;
  updatedAt: string;
  createdAt: string;
}

export interface EquipmentItem {
  id: string;
  name: string;
  category: 'Camera' | 'Lens' | 'DOP Rig' | 'Lighting' | 'Audio' | 'Grip';
  specs: string;
  description?: string;
  dailyRate: number;
  availability: 'AVAILABLE' | 'RENTED' | 'MAINTENANCE';
  imageUrl: string;
  primaryMediaId?: string;
  imageMediaId?: string;
  galleryMediaIds?: string[];
  featured?: boolean;
  displayOrder?: number;
  status: ContentStatus;
  focalPoint?: { x: number; y: number };
  updatedAt: string;
}

export interface EventItem {
  id: string;
  title: string;
  category: 'Festival' | 'Launch' | 'Exhibition' | 'Premiere' | 'Workshop';
  location: string;
  eventDate: string;
  description: string;
  longDescription?: string;
  imageUrl: string;
  coverMediaId?: string;
  imageMediaId?: string;
  galleryMediaIds?: string[];
  featured?: boolean;
  ctaLabel?: string;
  ctaDestination?: string;
  displayOrder?: number;
  status: ContentStatus;
  focalPoint?: { x: number; y: number };
  seoTitle?: string;
  seoDescription?: string;
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
  coverMediaId?: string;
  featured?: boolean;
  displayOrder?: number;
  status: ContentStatus;
  focalPoint?: { x: number; y: number };
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  shortBio?: string;
  fullBio?: string;
  bio?: string;
  department?: string;
  portraitUrl?: string;
  portraitMediaId?: string;
  photoUrl?: string;
  photoMediaId?: string;
  socialLinks?: { twitter?: string; linkedin?: string; imdb?: string; instagram?: string };
  displayOrder: number;
  featured: boolean;
  status: ContentStatus;
  focalPoint?: { x: number; y: number };
  updatedAt: string;
}

export interface PartnerItem {
  id: string;
  name: string;
  logoUrl: string;
  logoMediaId?: string;
  website?: string;
  websiteUrl?: string;
  description?: string;
  category: 'MEDIA' | 'PRODUCTION' | 'DISTRIBUTION' | 'POLICE_DEPARTMENT' | 'TECHNOLOGY' | 'ACADEMIC';
  displayOrder: number;
  featured?: boolean;
  status: ContentStatus;
  focalPoint?: { x: number; y: number };
  updatedAt: string;
}

export interface MarketingProjectItem {
  id: string;
  title: string;
  category?: string;
  serviceCategory?: string;
  campaignGoal?: string;
  keyDeliverables?: string[];
  metrics?: string;
  description?: string;
  heroUrl?: string;
  heroMediaId?: string;
  mediaIds?: string[];
  mediaUrls?: string[];
  videoUrl?: string;
  client?: string;
  services?: string[];
  results?: string;
  featured?: boolean;
  displayOrder: number;
  status: ContentStatus;
  focalPoint?: { x: number; y: number };
  updatedAt: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug?: string;
  summary: string;
  content: string;
  author: string;
  publishDate: string;
  category: 'Announcement' | 'Press Release' | 'Insight' | 'Awards';
  imageUrl: string;
  featuredMediaId?: string;
  imageMediaId?: string;
  galleryMediaIds?: string[];
  tags?: string[];
  status: ContentStatus;
  featured?: boolean;
  displayOrder?: number;
  focalPoint?: { x: number; y: number };
  seoTitle?: string;
  seoDescription?: string;
  socialImageMediaId?: string;
  updatedAt: string;
}

export interface StargazeWorldItem {
  id: string;
  code: string;
  name: string;
  tagline: string;
  desc: string;
  imageUrl: string;
  imageMediaId?: string;
  iconName?: string;
  link: string;
  stats: string;
  displayOrder?: number;
  status?: ContentStatus;
  focalPoint?: { x: number; y: number };
}

export interface UniverseSectionConfig {
  eyebrow: string;
  heading: string;
  description: string;
  worlds: StargazeWorldItem[];
}

export interface HomepageSectionConfig {
  id: string;
  enabled: boolean;
  eyebrow: string;
  heading: string;
  description: string;
  ctaLabel?: string;
  ctaDestination?: string;
  displayOrder: number;
}

export interface SiteContentConfig {
  id?: string;
  homepageSections?: Record<string, HomepageSectionConfig>;
  universeSection?: UniverseSectionConfig;
  brandStatement?: {
    eyebrow: string;
    heading: string;
    description: string;
    highlightText: string;
  };
  contactCopy?: {
    introHeading: string;
    introDescription: string;
    officeAddress: string;
    email: string;
    phone: string;
    workingHours: string;
  };
  footerCopy?: {
    tagline: string;
    copyrightText: string;
  };
  stats?: Array<{ value: string; label: string; helper?: string }>;
  aboutStudioTitle?: string;
  aboutStudioText?: string;
  aboutStudioQuote?: string;
  aboutStudioQuoteAuthor?: string;
}

export interface BrandSettings {
  id?: string;
  brandName: string;
  legalEntityName?: string;
  contactEmail?: string;
  supportPhone?: string;
  tagline: string;
  primaryLogoMediaId?: string;
  primaryLogoUrl?: string;
  altLogoMediaId?: string;
  altLogoUrl?: string;
  faviconMediaId?: string;
  faviconUrl?: string;
  socialSharingMediaId?: string;
  socialSharingUrl?: string;
  updatedAt?: string;
}

export interface SEOSettings {
  id?: string;
  siteTitle: string;
  metaDescription: string;
  keywords?: string | string[];
  canonicalUrl?: string;
  defaultSocialImageMediaId?: string;
  defaultSocialImageUrl?: string;
  ogTitle: string;
  ogDescription: string;
  twitterHandle?: string;
  robotsIndex: boolean;
  updatedAt?: string;
}

export interface MediaUsageLocation {
  entityType: 'HERO' | 'PROJECT' | 'EVENT' | 'EQUIPMENT' | 'TEAM' | 'PARTNER' | 'MARKETING' | 'NEWS' | 'BRAND' | 'SLOT';
  entityId: string;
  entityTitle: string;
  field: string;
}

export interface MediaUsageInfo {
  mediaId: string;
  count: number;
  locations: MediaUsageLocation[];
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
