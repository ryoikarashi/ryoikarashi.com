import { IDomain } from '../IDomain';
import { Name, Chapter, Explanation } from './ValueObjects';

export interface WordPlainObject {
    chapter: string;
    name: string;
    explanation: string;
}

export class Word implements IDomain<WordPlainObject> {
    private readonly _name: Name;
    private readonly _chapter: Chapter;
    private readonly _explanation: Explanation;

    constructor(name: Name, chapter: Chapter, explanation: Explanation) {
        this._name = name;
        this._chapter = chapter;
        this._explanation = explanation;
    }

    isValid(): boolean {
        return this._name.isValid() && this._chapter.isValid() && this._explanation.isValid();
    }

    toPlainObj(): WordPlainObject {
        return {
            chapter: this._chapter.value(),
            name: this._name.value(),
            explanation: this._explanation.value(),
        };
    }

    toJson(): string {
        return JSON.stringify(this.toPlainObj());
    }
}
