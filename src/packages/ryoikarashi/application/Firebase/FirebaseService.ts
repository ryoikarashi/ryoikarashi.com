import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { isProduction } from '@/libs/utils';

export interface FirebaseAdminAppConfig {
  databaseURL: string;
  privateKey: string;
  clientEmail: string;
  projectId: string;
}

export class FirebaseService {
  private readonly _databaseURL: string;
  private readonly _privateKey: string;
  private readonly _clientEmail: string;
  private readonly _projectId: string;

  constructor(params: FirebaseAdminAppConfig) {
    this._databaseURL = params.databaseURL;
    this._privateKey = params.privateKey;
    this._clientEmail = params.clientEmail;
    this._projectId = params.projectId;
  }

  public init(): Firestore {
    const hadNoApp = getApps().length === 0;

    if (hadNoApp) {
      initializeApp({
        databaseURL: this._databaseURL,
        credential: cert({
          privateKey: this._privateKey.replace(/\\n/g, '\n'),
          clientEmail: this._clientEmail,
          projectId: this._projectId,
        }),
      });
    }

    const db = getFirestore();

    if (!isProduction && hadNoApp) {
      db.settings({
        host: this._databaseURL,
        ssl: false,
      });
    }

    return db;
  }
}
