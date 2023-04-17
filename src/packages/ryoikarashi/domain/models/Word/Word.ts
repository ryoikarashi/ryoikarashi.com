import { type IDomain } from '../IDomain';
import { type Name, type Chapter, type Explanation } from './ValueObjects';

export interface WordPlainObject {
  chapter: string;
  name: string;
  explanation: string;
}

export class Word implements IDomain<WordPlainObject> {
  private readonly _name: Name;
  private readonly _chapter: Chapter;
  private readonly _explanation: Explanation;

  public static DEFAULT_PLAIN_OBJ: WordPlainObject = {
    name: 'anicca',
    chapter: 'a',
    explanation: 'Inconstant; unsteady; impermanent.',
  };

  constructor(name: Name, chapter: Chapter, explanation: Explanation) {
    this._name = name;
    this._chapter = chapter;
    this._explanation = explanation;
  }

  isValid(): boolean {
    return (
      this._name.isValid() &&
      this._chapter.isValid() &&
      this._explanation.isValid()
    );
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
