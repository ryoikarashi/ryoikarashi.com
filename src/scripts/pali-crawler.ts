import { FirebaseService } from '../functions-src/Services/Firebase/FirebaseService';
import { ElementHandle } from 'puppeteer';
import { config } from 'dotenv';
import puppeteer from 'puppeteer';
import { resolve } from 'path';
import { getRootCollectionName } from '../utils';
import _groupBy from 'lodash.groupby';

// load env variables
config({ path: resolve(__dirname, '..', '..', '.env') });

// initialize firebase
const db = new FirebaseService({
    databaseURL: process.env.FIRESTORE_DB_URL || '',
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY || '',
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL || '',
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || '',
}).init();

interface WordItem {
    name: string;
    explanation: string;
    chapter: string;
}
type Dictionary = Array<WordItem>;
type GroupedDictionary = {
    [initialLetter: string]: Dictionary;
};

const COLLECTION_NAME = getRootCollectionName('pali_dictionary');
const batch = db.batch();

(async () => {
    const getTextBySelector = async (element: ElementHandle, paramSelector: string): Promise<string> => {
        const el = await element.$(paramSelector);
        if (!el) return '';
        return (await el.evaluate((item) => item.textContent, el)) || '';
    };

    const dictionary: Dictionary = [];

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.accesstoinsight.org/glossary.html');
    const $chapters = await page.$$('#COPYRIGHTED_TEXT_CHUNK > .chapter');

    for (const $chapterItem of $chapters) {
        const chapter = (await getTextBySelector($chapterItem, 'h1 > a:first-child')).toLowerCase();
        const $namesInChapter = await $chapterItem.$$('dl > dt');

        let nameInChapterIndex = 0;
        for (const $nameInChapter of $namesInChapter) {
            const name = await getTextBySelector($nameInChapter, 'a');
            const explanation = await getTextBySelector($chapterItem, `dl > dd:nth-of-type(${nameInChapterIndex + 1})`);
            dictionary.push({ name, chapter, explanation });
            nameInChapterIndex++;
        }
    }

    const processedDictionary = dictionary
        .filter((item) => item.name.length)
        .map((item) =>
            Object.assign({}, item, {
                explanation: item.explanation.replace('[MORE]', ''),
            }),
        );

    const groupedDictionary: GroupedDictionary = _groupBy(processedDictionary, (item) => item.chapter);

    Object.entries(groupedDictionary).map(([key, value]) => {
        value.map((item) => {
            const ref = db
                .collection(COLLECTION_NAME)
                .doc(key)
                .collection('pali_word_list_by_initial_letter')
                .doc(item.name.replace('/', '-'));
            batch.set(ref, item);
        });
    });

    // batch insert data
    await batch.commit();

    await browser.close();
})();
