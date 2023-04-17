import { NextResponse } from 'next/server';
import { WordService } from '@/packages/ryoikarashi/application/Word/WordService';
import { WordRepository } from '@/packages/ryoikarashi/infrastructure/repositories/WordRepository/WordRepository';
import { FirebaseService } from '@/packages/ryoikarashi/application/Firebase/FirebaseService';
import { Word } from '@/packages/ryoikarashi/domain/models';

const db = new FirebaseService({
  databaseURL: process.env.FIRESTORE_DB_URL ?? '',
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY ?? '',
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL ?? '',
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID ?? '',
}).init();

export async function GET(): Promise<NextResponse> {
  try {
    const wordService = new WordService(
      new WordRepository(db, 'pali_dictionary', 'dictionary')
    );
    const randomWord = await wordService.getARandomWord();
    return NextResponse.json(randomWord.toPlainObj());
  } catch (err) {
    return NextResponse.json(Word.DEFAULT_PLAIN_OBJ);
  }
}

export const dynamic = 'force-dynamic';
