import { doc, getDoc, collection, getDocs, query, where, setDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { ProjectItem, EquipmentItem, EventItem, DistributionTitle, NewsArticle } from '../types';

export interface MediaDocument {
  id: string;
  name: string;
  originalFileName: string;
  storagePath: string;
  downloadUrl: string;
  mimeType: string;
  fileSize: number;
  width?: number;
  height?: number;
  category: 'brand' | 'hero' | 'work' | 'events' | 'equipment' | 'team' | 'partners' | 'newsroom' | 'general';
  tags: string[];
  altText: string;
  title?: string;
  description?: string;
  focalPoint?: { x: number; y: number };
  status: 'active' | 'archived';
  uploadedBy: string;
  uploadedAt: any;
  updatedAt: any;
}

export interface MediaAssignment {
  slot: string;
  mediaId: string;
  enabled: boolean;
  updatedAt: any;
  updatedBy: string;
}

export interface ResolvedMedia {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  focalPoint?: { x: number; y: number };
  mediaId?: string;
}

// In-memory cache for fast resolution
const mediaCache: { [mediaId: string]: MediaDocument } = {};
const assignmentCache: { [slot: string]: MediaAssignment } = {};

export async function fetchAllMedia(): Promise<MediaDocument[]> {
  try {
    const q = collection(db, 'media');
    const snapshot = await getDocs(q);
    const list: MediaDocument[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as MediaDocument;
      const item = { ...data, id: docSnap.id };
      mediaCache[item.id] = item;
      list.push(item);
    });
    return list;
  } catch (err) {
    console.error('Error fetching media:', err);
    return [];
  }
}

export async function fetchAllAssignments(): Promise<MediaAssignment[]> {
  try {
    const q = collection(db, 'mediaAssignments');
    const snapshot = await getDocs(q);
    const list: MediaAssignment[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as MediaAssignment;
      assignmentCache[data.slot] = data;
      list.push(data);
    });
    return list;
  } catch (err) {
    console.error('Error fetching media assignments:', err);
    return [];
  }
}

export async function getMediaForSlot(
  slot: string,
  fallbackUrl: string = '',
  fallbackAlt: string = 'Stargaze Media'
): Promise<ResolvedMedia> {
  try {
    // Check assignment cache or fetch
    let assignment = assignmentCache[slot];
    if (!assignment) {
      const docRef = doc(db, 'mediaAssignments', slot);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        assignment = docSnap.data() as MediaAssignment;
        assignmentCache[slot] = assignment;
      }
    }

    if (assignment && assignment.enabled && assignment.mediaId) {
      let mediaDoc = mediaCache[assignment.mediaId];
      if (!mediaDoc) {
        const mediaRef = doc(db, 'media', assignment.mediaId);
        const mediaSnap = await getDoc(mediaRef);
        if (mediaSnap.exists()) {
          mediaDoc = mediaSnap.data() as MediaDocument;
          mediaCache[mediaDoc.id] = mediaDoc;
        }
      }

      if (mediaDoc && mediaDoc.downloadUrl) {
        return {
          url: mediaDoc.downloadUrl,
          alt: mediaDoc.altText || fallbackAlt,
          width: mediaDoc.width,
          height: mediaDoc.height,
          focalPoint: mediaDoc.focalPoint,
          mediaId: mediaDoc.id,
        };
      }
    }
  } catch (err) {
    console.error(`Error resolving media for slot ${slot}:`, err);
  }

  return {
    url: fallbackUrl,
    alt: fallbackAlt,
  };
}

export async function assignMediaToSlot(slot: string, mediaId: string, userEmail: string = 'admin'): Promise<void> {
  const assignmentRef = doc(db, 'mediaAssignments', slot);
  const data: MediaAssignment = {
    slot,
    mediaId,
    enabled: true,
    updatedAt: serverTimestamp(),
    updatedBy: userEmail,
  };
  await setDoc(assignmentRef, data);
  assignmentCache[slot] = data;
}

export async function removeSlotAssignment(slot: string): Promise<void> {
  const assignmentRef = doc(db, 'mediaAssignments', slot);
  await deleteDoc(assignmentRef);
  delete assignmentCache[slot];
}

export async function resolveProjectMedia(project: ProjectItem): Promise<ProjectItem> {
  const key = (project.id + ' ' + project.title).toLowerCase();
  let slot = '';
  let fallbackSlot = '';

  if (key.includes('saheb') || key.includes('vikas')) {
    slot = 'work.sahebVikaskari';
    fallbackSlot = 'hero.sahebVikaskari.desktop';
  } else if (key.includes('nayi') || key.includes('soch') || key.includes('112')) {
    slot = 'work.nayiSoch';
    fallbackSlot = 'hero.nayiSoch.desktop';
  } else if (key.includes('psycho')) {
    slot = 'work.psycho';
    fallbackSlot = 'hero.psycho.desktop';
  } else if (key.includes('father') || key.includes('duo') || key.includes('son')) {
    slot = 'work.fatherSon';
    fallbackSlot = 'hero.fatherSon.desktop';
  }

  if (slot) {
    const res = await getMediaForSlot(slot);
    if (res.url) {
      return { ...project, posterUrl: res.url, focalPoint: res.focalPoint };
    }
    if (fallbackSlot) {
      const fbRes = await getMediaForSlot(fallbackSlot);
      if (fbRes.url) {
        return { ...project, posterUrl: fbRes.url, focalPoint: fbRes.focalPoint };
      }
    }
  }
  return project;
}

export async function resolveEquipmentMedia(equipment: EquipmentItem): Promise<EquipmentItem> {
  const key = (equipment.id + ' ' + equipment.name).toLowerCase();
  let slot = '';
  if (key.includes('alexa')) slot = 'equipment.arriAlexa';
  else if (key.includes('red') || key.includes('raptor')) slot = 'equipment.redVraptor';
  else if (key.includes('cooke') || key.includes('anamorphic')) slot = 'equipment.cookeAnamorphic';
  else if (key.includes('ronin') || key.includes('dji')) slot = 'equipment.ronin2';

  if (slot) {
    const res = await getMediaForSlot(slot);
    if (res.url) {
      return { ...equipment, imageUrl: res.url, focalPoint: res.focalPoint };
    }
  }
  return equipment;
}

export async function resolveEventMedia(event: EventItem): Promise<EventItem> {
  const key = (event.id + ' ' + event.title).toLowerCase();
  let slot = '';
  if (key.includes('father') || key.includes('duo') || key.includes('concert') || key.includes('narayan')) {
    slot = 'events.fatherSon';
  } else if (key.includes('cannes')) {
    slot = 'events.cannes';
  } else if (key.includes('imax')) {
    slot = 'events.imaxPremiere';
  }

  if (slot) {
    const res = await getMediaForSlot(slot);
    if (res.url) {
      return { ...event, imageUrl: res.url, focalPoint: res.focalPoint };
    }
  }
  return event;
}

export async function resolveDistributionMedia(title: DistributionTitle): Promise<DistributionTitle> {
  const key = (title.id + ' ' + title.title).toLowerCase();
  let slot = '';
  let fallbackSlot = '';

  if (key.includes('saheb') || key.includes('vikas')) {
    slot = 'work.sahebVikaskari';
    fallbackSlot = 'hero.sahebVikaskari.desktop';
  } else if (key.includes('nayi') || key.includes('soch') || key.includes('112')) {
    slot = 'work.nayiSoch';
    fallbackSlot = 'hero.nayiSoch.desktop';
  } else if (key.includes('psycho')) {
    slot = 'work.psycho';
    fallbackSlot = 'hero.psycho.desktop';
  } else if (key.includes('father') || key.includes('duo') || key.includes('son')) {
    slot = 'work.fatherSon';
    fallbackSlot = 'hero.fatherSon.desktop';
  }

  if (slot) {
    const res = await getMediaForSlot(slot);
    if (res.url) {
      return { ...title, posterUrl: res.url, focalPoint: res.focalPoint };
    }
    if (fallbackSlot) {
      const fbRes = await getMediaForSlot(fallbackSlot);
      if (fbRes.url) {
        return { ...title, posterUrl: fbRes.url, focalPoint: fbRes.focalPoint };
      }
    }
  }
  return title;
}

export async function resolveNewsMedia(news: NewsArticle): Promise<NewsArticle> {
  const key = (news.id + ' ' + news.title + ' ' + news.summary).toLowerCase();
  let slot = '';
  let fallbackSlot = '';

  if (key.includes('saheb') || key.includes('vikas') || key.includes('pune') || key.includes('mumbai')) {
    slot = 'news.infrastructure';
    fallbackSlot = 'hero.sahebVikaskari.desktop';
  } else if (key.includes('nayi') || key.includes('soch') || key.includes('police') || key.includes('112')) {
    slot = 'news.nayiSoch';
    fallbackSlot = 'hero.nayiSoch.desktop';
  }

  if (slot) {
    const res = await getMediaForSlot(slot);
    if (res.url) {
      return { ...news, imageUrl: res.url, focalPoint: res.focalPoint };
    }
    if (fallbackSlot) {
      const fbRes = await getMediaForSlot(fallbackSlot);
      if (fbRes.url) {
        return { ...news, imageUrl: fbRes.url, focalPoint: fbRes.focalPoint };
      }
    }
  }
  return news;
}
