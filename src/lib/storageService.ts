import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage, auth } from '../firebase/config';

export interface UploadProgressCallback {
  (percentage: number, bytesTransferred: number, totalBytes: number): void;
}

export interface UploadResult {
  downloadUrl: string;
  storagePath: string;
  provider: 'firebase-storage' | 'server-storage';
}

/**
 * Upload a media file with automatic fallback:
 * 1. Tries Firebase Storage with a 4-second connectivity check.
 * 2. If Firebase Storage fails or is unavailable (e.g. bucket not provisioned),
 *    smoothly uploads via the authenticated server-side storage endpoint.
 */
export async function uploadMediaFile(
  file: File,
  storagePath: string,
  onProgress?: UploadProgressCallback,
  onStatusChange?: (status: string) => void
): Promise<UploadResult> {
  // Try Firebase Storage first with a short timeout
  let firebaseFailed = false;

  try {
    onStatusChange?.('Connecting to Firebase Storage...');
    const storageRef = ref(storage, storagePath);
    const uploadTask = uploadBytesResumable(storageRef, file, {
      contentType: file.type,
    });

    const firebaseResult = await new Promise<UploadResult>((resolve, reject) => {
      // 4-second timeout for Firebase Storage preflight / handshake
      const timer = setTimeout(() => {
        try {
          uploadTask.cancel();
        } catch {
          // ignore
        }
        reject(new Error('Firebase Storage handshake timeout (bucket unreachable)'));
      }, 4000);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          if (snapshot.bytesTransferred > 0) {
            // Once bytes are actually moving, clear the short timer
            clearTimeout(timer);
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress?.(Math.round(progress), snapshot.bytesTransferred, snapshot.totalBytes);
            onStatusChange?.(`Uploading to Firebase Storage: ${Math.round(progress)}%`);
          }
        },
        (error) => {
          clearTimeout(timer);
          reject(error);
        },
        async () => {
          clearTimeout(timer);
          try {
            onStatusChange?.('Generating Firebase download URL...');
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            resolve({
              downloadUrl,
              storagePath,
              provider: 'firebase-storage',
            });
          } catch (e) {
            reject(e);
          }
        }
      );
    });

    return firebaseResult;
  } catch (fbErr: any) {
    console.warn('Firebase Storage direct upload unavailable, utilizing secure application storage:', fbErr?.message || fbErr);
    firebaseFailed = true;
  }

  // Fallback: Upload via server-side storage endpoint
  if (firebaseFailed) {
    onStatusChange?.('Uploading to application media storage...');
    return await uploadViaServerStorage(file, onProgress, onStatusChange);
  }

  throw new Error('Upload could not be processed.');
}

async function uploadViaServerStorage(
  file: File,
  onProgress?: UploadProgressCallback,
  onStatusChange?: (status: string) => void
): Promise<UploadResult> {
  let token = localStorage.getItem('admin_token') || '';
  if (auth.currentUser) {
    try {
      token = await auth.currentUser.getIdToken();
    } catch {
      // use local admin token
    }
  }

  return new Promise<UploadResult>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('file', file);

    xhr.open('POST', '/api/storage/upload', true);
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress?.(percent, event.loaded, event.total);
        onStatusChange?.(`Uploading: ${percent}% (${event.loaded}/${event.total} bytes)`);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText);
          if (res.success && res.downloadUrl) {
            onProgress?.(100, file.size, file.size);
            onStatusChange?.('Upload completed successfully');
            resolve({
              downloadUrl: res.downloadUrl,
              storagePath: res.storagePath,
              provider: 'server-storage',
            });
          } else {
            reject(new Error(res.error || 'Server storage upload failed'));
          }
        } catch (e: any) {
          reject(new Error('Invalid response from storage server'));
        }
      } else {
        try {
          const errRes = JSON.parse(xhr.responseText);
          reject(new Error(errRes.error || `Upload failed with HTTP ${xhr.status}`));
        } catch {
          reject(new Error(`Upload failed with HTTP ${xhr.status}`));
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error during media storage upload'));
    };

    xhr.send(formData);
  });
}

/**
 * Delete a media storage object from either Firebase Storage or server storage.
 */
export async function deleteStorageFile(storagePath: string): Promise<void> {
  if (!storagePath) return;

  if (storagePath.startsWith('uploads/')) {
    let token = localStorage.getItem('admin_token') || '';
    if (auth.currentUser) {
      try {
        token = await auth.currentUser.getIdToken();
      } catch {
        // use local admin token
      }
    }

    await fetch('/api/storage/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ storagePath }),
    });
  } else {
    try {
      const storageRef = ref(storage, storagePath);
      await deleteObject(storageRef);
    } catch (e) {
      console.warn('Firebase Storage delete warning:', e);
    }
  }
}
