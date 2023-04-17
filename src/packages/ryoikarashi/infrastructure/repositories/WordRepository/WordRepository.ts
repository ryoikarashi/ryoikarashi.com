import { IWordRepository } from './IWordRepository';
import {
  Word,
  WordPlainObject,
} from '@/packages/ryoikarashi/domain/models/Word/Word';
import { GetRandomWords } from './ParameterObjects/GetRandomWords';
import {
  Name,
  Chapter,
  Explanation,
} from '@/packages/ryoikarashi/domain/models/Word/ValueObjects';

export class WordRepository implements IWordRepository {
  private readonly _db: FirebaseFirestore.Firestore;
  private readonly _collectionName: string;
  private readonly _docPath: string;

  constructor(
    db: FirebaseFirestore.Firestore,
    collectionName: string,
    docPath: string
  ) {
    this._db = db;
    this._collectionName = collectionName;
    this._docPath = docPath;
  }

  public async getRandomWords(
    getRandomWords: GetRandomWords
  ): Promise<Array<Word>> {
    const snapshot = await this._db
      .collection(this._collectionName)
      .doc(this._docPath)
      .get();
    const dictionary = snapshot.data()?.list;

    if (!dictionary) {
      return [new Word(Name.of(null), Chapter.of(null), Explanation.of(null))];
    }

    return dictionary
      .sort(() => 0.5 - Math.random())
      .slice(0, getRandomWords.numOfWords)
      .map(
        (item: WordPlainObject) =>
          new Word(
            Name.of(item?.name || null),
            Chapter.of(item?.chapter || null),
            Explanation.of(item?.explanation || null)
          )
      );
  }
}
