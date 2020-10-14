import admin from "firebase-admin";
import {isProduction} from "../../../utils";

export interface FirebaseAdminAppConfig {
    databaseURL: string;
    privateKey: string;
    clientEmail: string;
    projectId: string;
}

export class FirebaseService {
    private readonly databaseURL: string;
    private readonly privateKey: string;
    private readonly clientEmail: string;
    private readonly projectId: string;

    constructor(params: FirebaseAdminAppConfig) {
        this.databaseURL = params.databaseURL;
        this.privateKey = params.privateKey;
        this.clientEmail = params.clientEmail;
        this.projectId = params.projectId;
    }

    init(): FirebaseFirestore.Firestore {
        // Initialise firebase admin with the credentials when there is no firebase app
        if (!admin.apps.length) {
            admin.initializeApp({
                databaseURL: this.databaseURL,
                credential: admin.credential.cert({
                    privateKey: this.privateKey.replace(/\\n/g, '\n'), // without this replacing leads to a malformed token
                    clientEmail: this.clientEmail,
                    projectId: this.projectId,
                }),
            });
        }

        // create a firestore db instance
        const db = admin.firestore();

        // tweak db settings for local development
        if (!isProduction && !admin.apps.length) {
            db.settings({
                host: this.databaseURL,
                ssl: false
            });
        }

        return db;
    }
}
