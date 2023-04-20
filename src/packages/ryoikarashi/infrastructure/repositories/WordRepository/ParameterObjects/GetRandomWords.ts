export class GetRandomWords {
  private _numOfWords: number;

  constructor(numOfWords = 10) {
    this._numOfWords = numOfWords;
  }

  public get numOfWords(): number {
    return this._numOfWords;
  }

  public set numOfWords(numOfWords: number) {
    this._numOfWords = numOfWords;
  }
}
