import { ILLMService } from './ILLMService';
import { ITrackRepository } from '../../Repositories/TrackRepository/ITtrackRepository';
import { ILLMRepository } from '../../Repositories/LLMRepository/ILLMRepository';
import { GetCompletion } from '../../Repositories/LLMRepository/ParameterObjects/GetCompletion';
import { LLM } from '../../Entities/LLM/LLM';
import { Completion } from '../../Entities/LLM/ValueObjects';

export class LLMService implements ILLMService {
    private readonly _llmRepo: ILLMRepository;
    private readonly _trackRepo: ITrackRepository;

    constructor(llmRepo: ILLMRepository, trackRepo: ITrackRepository) {
        this._llmRepo = llmRepo;
        this._trackRepo = trackRepo;
    }

    // get a track explanation
    public async getTrackExplanation(): Promise<LLM> {
        const lastPlayedTrack = await this._trackRepo.getLastPlayedTrack();
        if (lastPlayedTrack.explanation.isValid()) {
            return new LLM(new Completion(lastPlayedTrack.explanation.value()));
        }
        const prompt = `What does make the song great, ${lastPlayedTrack.name.value()} by ${lastPlayedTrack.artists
            .map((artist) => artist.value())
            .join(',')}?`;
        const getCompletionParameter = new GetCompletion(prompt);
        const completion = await this._llmRepo.getCompletion(getCompletionParameter);
        return new LLM(completion);
    }
}
