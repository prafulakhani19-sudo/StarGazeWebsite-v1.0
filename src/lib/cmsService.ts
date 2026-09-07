import { 
  collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, 
  query, orderBy, where, onSnapshot, serverTimestamp, Unsubscribe 
} from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { 
  HeroSlideItem, ProjectItem, EquipmentItem, EventItem, 
  DistributionTitle, TeamMember, PartnerItem, MarketingProjectItem, 
  NewsArticle, SiteContentConfig, BrandSettings, SEOSettings, 
  ContentStatus, MediaUsageInfo, MediaUsageLocation, ActivityLog 
} from '../types';
import { 
  INITIAL_HERO_SLIDES, INITIAL_TEAM_MEMBERS, INITIAL_PARTNERS, 
  INITIAL_MARKETING_PROJECTS, INITIAL_SITE_CONTENT, 
  INITIAL_BRAND_SETTINGS, INITIAL_SEO_SETTINGS 
} from '../data/initialCmsData';
import { 
  INITIAL_PROJECTS, INITIAL_EQUIPMENT, INITIAL_EVENTS, 
  INITIAL_DISTRIBUTION, INITIAL_NEWS 
} from '../data/mockData';

// Operation Types for error handling
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Activity Logging Helper
export async function logCmsActivity(
  action: string, 
  entityType: string, 
  entityId: string, 
  metadata: Record<string, any> = {}
) {
  try {
    const user = auth.currentUser;
    const logRef = doc(collection(db, 'activity_logs'));
    const log: ActivityLog = {
      id: logRef.id,
      actorId: user?.uid || 'system',
      actorName: user?.displayName || user?.email || 'CMS Administrator',
      action,
      entityType,
      entityId,
      timestamp: new Date().toISOString(),
      metadata,
    };
    await setDoc(logRef, log);
  } catch (err) {
    console.warn('Could not record activity log:', err);
  }
}

// ==========================================
// GENERIC CRUD HELPERS WITH AUTO-SEEDING
// ==========================================

export async function fetchCollectionWithSeed<T extends { id: string; displayOrder?: number }>(
  collectionName: string,
  initialData: T[]
): Promise<T[]> {
  try {
    const colRef = collection(db, collectionName);
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as T));
      return items.sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));
    }

    // Auto-seed collection if completely empty
    if (initialData && initialData.length > 0) {
      for (const item of initialData) {
        await setDoc(doc(db, collectionName, item.id), item);
      }
      return initialData.sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));
    }
    return [];
  } catch (error) {
    console.warn(`Fetch ${collectionName} failed, using local cache:`, error);
    return initialData;
  }
}

export function subscribeToCollection<T extends { id: string; displayOrder?: number; status?: ContentStatus }>(
  collectionName: string,
  onUpdate: (items: T[]) => void,
  statusFilter?: ContentStatus,
  fallbackData: T[] = []
): Unsubscribe {
  const colRef = collection(db, collectionName);
  return onSnapshot(
    colRef,
    (snap) => {
      if (snap.empty && fallbackData.length > 0) {
        onUpdate(fallbackData);
        return;
      }
      let list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as T));
      if (statusFilter) {
        list = list.filter((item) => item.status === statusFilter);
      }
      list.sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));
      onUpdate(list);
    },
    (error) => {
      console.warn(`Snapshot on ${collectionName} failed:`, error);
      onUpdate(fallbackData);
    }
  );
}

// Save or Update Document
export async function saveCmsDocument<T extends Record<string, any> = any>(
  collectionName: string,
  docId: string,
  data: Partial<T>,
  actionName: string = 'UPDATE'
): Promise<void> {
  const path = `${collectionName}/${docId}`;
  try {
    const docRef = doc(db, collectionName, docId);
    const existing = await getDoc(docRef);
    const payload = {
      ...data,
      id: docId,
      updatedAt: new Date().toISOString(),
    };
    if (!existing.exists()) {
      (payload as any).createdAt = new Date().toISOString();
    }
    await setDoc(docRef, payload, { merge: true });
    await logCmsActivity(actionName, collectionName, docId, { docId });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Delete Document
export async function deleteCmsDocument(collectionName: string, docId: string): Promise<void> {
  const path = `${collectionName}/${docId}`;
  try {
    await deleteDoc(doc(db, collectionName, docId));
    await logCmsActivity('DELETE', collectionName, docId, { docId });
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Reorder Documents
export async function reorderCmsDocuments(
  collectionName: string,
  orderedIds: string[]
): Promise<void> {
  try {
    for (let i = 0; i < orderedIds.length; i++) {
      const docRef = doc(db, collectionName, orderedIds[i]);
      await updateDoc(docRef, { displayOrder: i + 1, updatedAt: new Date().toISOString() });
    }
    await logCmsActivity('REORDER', collectionName, 'multiple', { count: orderedIds.length });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, collectionName);
  }
}

// ==========================================
// SPECIFIC ENTITY ACCESSORS
// ==========================================

// 1. HERO SLIDES
export async function getHeroSlides(): Promise<HeroSlideItem[]> {
  return fetchCollectionWithSeed<HeroSlideItem>('heroSlides', INITIAL_HERO_SLIDES);
}

// 2. PROJECTS / WORK
export async function getProjects(): Promise<ProjectItem[]> {
  return fetchCollectionWithSeed<ProjectItem>('projects', INITIAL_PROJECTS);
}

// 3. EVENTS
export async function getEvents(): Promise<EventItem[]> {
  return fetchCollectionWithSeed<EventItem>('events', INITIAL_EVENTS);
}

// 4. EQUIPMENT
export async function getEquipment(): Promise<EquipmentItem[]> {
  return fetchCollectionWithSeed<EquipmentItem>('equipment', INITIAL_EQUIPMENT);
}

// 5. DISTRIBUTION
export async function getDistribution(): Promise<DistributionTitle[]> {
  return fetchCollectionWithSeed<DistributionTitle>('distribution', INITIAL_DISTRIBUTION);
}

// 6. TEAM
export async function getTeam(): Promise<TeamMember[]> {
  return fetchCollectionWithSeed<TeamMember>('team', INITIAL_TEAM_MEMBERS);
}
export const getTeamMembers = getTeam;

export async function saveTeamMember(id: string, data: Partial<TeamMember>): Promise<void> {
  return saveCmsDocument('team', id, data, 'UPDATE_TEAM_MEMBER');
}

export async function deleteTeamMember(id: string): Promise<void> {
  return deleteCmsDocument('team', id);
}

// 7. PARTNERS
export async function getPartners(): Promise<PartnerItem[]> {
  return fetchCollectionWithSeed<PartnerItem>('partners', INITIAL_PARTNERS);
}

// 8. MARKETING / PR
export async function getMarketingProjects(): Promise<MarketingProjectItem[]> {
  return fetchCollectionWithSeed<MarketingProjectItem>('marketingProjects', INITIAL_MARKETING_PROJECTS);
}

// 9. NEWSROOM
export async function getNewsArticles(): Promise<NewsArticle[]> {
  return fetchCollectionWithSeed<NewsArticle>('news', INITIAL_NEWS);
}

// 10. SITE CONTENT (Homepage Sections & Copy)
export async function getSiteContent(): Promise<SiteContentConfig> {
  const path = 'site_settings/content';
  try {
    const docRef = doc(db, 'site_settings', 'content');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as SiteContentConfig;
    }
    // Auto-seed
    await setDoc(docRef, INITIAL_SITE_CONTENT);
    return INITIAL_SITE_CONTENT;
  } catch (err) {
    console.warn('Fetch siteContent failed, using initial:', err);
    return INITIAL_SITE_CONTENT;
  }
}

export async function saveSiteContent(content: SiteContentConfig): Promise<void> {
  await saveCmsDocument('site_settings', 'content', content, 'UPDATE_SITE_CONTENT');
}

// 11. BRAND SETTINGS
export async function getBrandSettings(): Promise<BrandSettings> {
  const path = 'site_settings/brand';
  try {
    const docRef = doc(db, 'site_settings', 'brand');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as BrandSettings;
    }
    // Auto-seed
    await setDoc(docRef, INITIAL_BRAND_SETTINGS);
    return INITIAL_BRAND_SETTINGS;
  } catch (err) {
    console.warn('Fetch brand settings failed, using initial:', err);
    return INITIAL_BRAND_SETTINGS;
  }
}

export async function saveBrandSettings(settings: BrandSettings): Promise<void> {
  await saveCmsDocument('site_settings', 'brand', settings, 'UPDATE_BRAND_SETTINGS');
}

// 12. SEO SETTINGS
export async function getSEOSettings(): Promise<SEOSettings> {
  const path = 'site_settings/seo';
  try {
    const docRef = doc(db, 'site_settings', 'seo');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as SEOSettings;
    }
    // Auto-seed
    await setDoc(docRef, INITIAL_SEO_SETTINGS);
    return INITIAL_SEO_SETTINGS;
  } catch (err) {
    console.warn('Fetch SEO settings failed, using initial:', err);
    return INITIAL_SEO_SETTINGS;
  }
}

export async function saveSEOSettings(settings: SEOSettings): Promise<void> {
  await saveCmsDocument('site_settings', 'seo', settings, 'UPDATE_SEO_SETTINGS');
}

// ==========================================
// MEDIA USAGE TRACKING & DELETE PROTECTION
// ==========================================

export async function calculateMediaUsage(mediaId: string): Promise<MediaUsageInfo> {
  const locations: MediaUsageLocation[] = [];

  try {
    // 1. Check Hero Slides
    const heroSlides = await getHeroSlides();
    heroSlides.forEach((slide) => {
      if (slide.desktopMediaId === mediaId) {
        locations.push({
          entityType: 'HERO',
          entityId: slide.id,
          entityTitle: slide.title,
          field: 'Desktop Artwork',
        });
      }
      if (slide.mobileMediaId === mediaId) {
        locations.push({
          entityType: 'HERO',
          entityId: slide.id,
          entityTitle: slide.title,
          field: 'Mobile Artwork',
        });
      }
    });

    // 2. Check Projects
    const projects = await getProjects();
    projects.forEach((proj) => {
      if (proj.coverMediaId === mediaId) {
        locations.push({
          entityType: 'PROJECT',
          entityId: proj.id,
          entityTitle: proj.title,
          field: 'Cover Poster',
        });
      }
      if (proj.heroMediaId === mediaId) {
        locations.push({
          entityType: 'PROJECT',
          entityId: proj.id,
          entityTitle: proj.title,
          field: 'Hero Banner',
        });
      }
      if (proj.galleryMediaIds?.includes(mediaId)) {
        locations.push({
          entityType: 'PROJECT',
          entityId: proj.id,
          entityTitle: proj.title,
          field: 'Gallery Stills',
        });
      }
    });

    // 3. Check Events
    const events = await getEvents();
    events.forEach((evt) => {
      if (evt.coverMediaId === mediaId) {
        locations.push({
          entityType: 'EVENT',
          entityId: evt.id,
          entityTitle: evt.title,
          field: 'Cover Image',
        });
      }
      if (evt.galleryMediaIds?.includes(mediaId)) {
        locations.push({
          entityType: 'EVENT',
          entityId: evt.id,
          entityTitle: evt.title,
          field: 'Event Gallery',
        });
      }
    });

    // 4. Check Equipment
    const equipment = await getEquipment();
    equipment.forEach((eq) => {
      if (eq.primaryMediaId === mediaId) {
        locations.push({
          entityType: 'EQUIPMENT',
          entityId: eq.id,
          entityTitle: eq.name,
          field: 'Primary Image',
        });
      }
    });

    // 5. Check Team
    const team = await getTeam();
    team.forEach((m) => {
      if (m.portraitMediaId === mediaId) {
        locations.push({
          entityType: 'TEAM',
          entityId: m.id,
          entityTitle: m.name,
          field: 'Executive Portrait',
        });
      }
    });

    // 6. Check Partners
    const partners = await getPartners();
    partners.forEach((p) => {
      if (p.logoMediaId === mediaId) {
        locations.push({
          entityType: 'PARTNER',
          entityId: p.id,
          entityTitle: p.name,
          field: 'Partner Logo',
        });
      }
    });

    // 7. Check Marketing
    const marketing = await getMarketingProjects();
    marketing.forEach((m) => {
      if (m.mediaIds?.includes(mediaId)) {
        locations.push({
          entityType: 'MARKETING',
          entityId: m.id,
          entityTitle: m.title,
          field: 'Campaign Creative',
        });
      }
    });

    // 8. Check Newsroom
    const news = await getNewsArticles();
    news.forEach((n) => {
      if (n.featuredMediaId === mediaId) {
        locations.push({
          entityType: 'NEWS',
          entityId: n.id,
          entityTitle: n.title,
          field: 'Featured Image',
        });
      }
    });

    // 9. Check Brand Settings
    const brand = await getBrandSettings();
    if (brand.primaryLogoMediaId === mediaId) {
      locations.push({
        entityType: 'BRAND',
        entityId: 'brand',
        entityTitle: 'Brand Identity',
        field: 'Primary Logo',
      });
    }
    if (brand.altLogoMediaId === mediaId) {
      locations.push({
        entityType: 'BRAND',
        entityId: 'brand',
        entityTitle: 'Brand Identity',
        field: 'Alternative Logo',
      });
    }

    // 10. Check Media Assignments
    const assignmentsSnap = await getDocs(collection(db, 'mediaAssignments'));
    assignmentsSnap.forEach((d) => {
      const data = d.data();
      if (data.mediaId === mediaId) {
        locations.push({
          entityType: 'SLOT',
          entityId: d.id,
          entityTitle: `Slot: ${d.id}`,
          field: 'Static Media Slot',
        });
      }
    });

  } catch (err) {
    console.warn('Error calculating media usage:', err);
  }

  return {
    mediaId,
    count: locations.length,
    locations,
  };
}
