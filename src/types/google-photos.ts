export interface MediaItem {
    id: string;
    description: string;
    productUrl: string;
    baseUrl: string;
    mimeType: string;
    filename: string;
    mediaMetadata: MediaMetadata;
}

export type MediaItems = Array<MediaItem>;

export interface ResponseMediaItemsList {
    mediaItems: MediaItems;
    nextPageToken: string;
}

export interface MediaMetadata {
    creationTime: string;
    width: string;
    height: string;
    photo: MediaMetadataPhoto;
}

export interface MediaMetadataPhoto {
    cameraMake: string;
    cameraModel: string;
    focalLength: number;
    apertureFNumber: number;
    isoEquivalent: number;
    exposureTime: string;
}
