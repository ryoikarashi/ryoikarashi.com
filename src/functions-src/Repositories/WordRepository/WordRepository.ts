import { IWordRepository } from './IWordRepository';
import { Word } from '../../Entities/Word/Word';
import { GetRandomWords } from './ParamterObjects/GetRandomWords';
import { Name } from '../../Entities/Word/Name';
import { Chapter } from '../../Entities/Word/Chapter';
import { Explanation } from '../../Entities/Word/Explanation';

export class WordRepository implements IWordRepository {
    private readonly _db: FirebaseFirestore.Firestore;
    private readonly _collectionGroupName: string;

    constructor(db: FirebaseFirestore.Firestore, collectionGroupName: string) {
        this._db = db;
        this._collectionGroupName = collectionGroupName;
    }

    public async getRandomWords(getRandomWords: GetRandomWords): Promise<Array<Word>> {
        const snapshot = await this._db.collectionGroup(this._collectionGroupName).get();
        const shuffledDocs = snapshot.docs.sort(() => 0.5 - Math.random());
        const randomWords = shuffledDocs.slice(0, getRandomWords.numOfWords);
        return randomWords.map(
            (item) =>
                new Word(
                    Name.of(item.exists ? item?.data()?.name || null : null),
                    Chapter.of(item.exists ? item?.data()?.chapter || null : null),
                    Explanation.of(item.exists ? item?.data()?.explanation || null : null),
                ),
        );
    }
}
