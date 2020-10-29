import admin from 'firebase-admin';
import { isProduction } from '../../../utils';

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

    public init(): FirebaseFirestore.Firestore {
        // Initialise firebase admin with the credentials when there is no firebase app
        if (!admin.apps.length) {
            admin.initializeApp({
                databaseURL: this._databaseURL,
                credential: admin.credential.cert({
                    privateKey: this._privateKey.replace(/\\n/g, '\n'), // without this replacing leads to a malformed token
                    clientEmail: this._clientEmail,
                    projectId: this._projectId,
                }),
            });
        }

        // create a firestore db instance
        const db = admin.firestore();

        // tweak db settings for local development
        if (!isProduction && !admin.apps.length) {
            db.settings({
                host: this._databaseURL,
                ssl: false,
            });
        }

        return db;
    }
}
