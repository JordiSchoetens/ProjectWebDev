import { EnvironmentInjector, Injectable, runInInjectionContext } from '@angular/core';
import { getDownloadURL, ref, uploadBytesResumable, Storage, deleteObject } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  
  constructor(private injector: EnvironmentInjector, private storage: Storage) {}

  async uploadImage(file: File, imagePath: string): Promise<string> {
    // makes sure the firebase code is run within the correct angular injection context
    return runInInjectionContext(this.injector, async () => {
      // creates ref to storage location
      const storageRef = ref(this.storage, imagePath);
      // uploads the file, waits for finish
      await uploadBytesResumable(storageRef, file);
      // run second injection context to get download URL
      return runInInjectionContext(this.injector, async () => {
        // gets and returns the download URL of the just uploaded img
        return await getDownloadURL(storageRef);
      });
    });
  }

  async deleteImage(imagePath: string): Promise<void> {
    // makes sure the firebase code is run within the correct angular injection context
    return runInInjectionContext(this.injector, async () => {
      // creates ref to storage location
      const storageRef = ref(this.storage, imagePath);
      // deletes the image at the given path, waits for finish
      await deleteObject(storageRef);
    });
  }
}