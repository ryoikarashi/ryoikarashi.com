import { Track, TrackPlainObj } from './Track';
import { Name } from './Name';
import { Artist } from './Artist';
import { IsPlaying } from './IsPlaying';
import { Link } from './Link';

describe('Test Track Entity', () => {
    const track = new Track(
        Name.of('track_name'),
        [Artist.of('track_artist')],
        IsPlaying.of(true),
        Link.of('https://example.com'),
    );

    const expectedPlainObj: TrackPlainObj = {
        name: 'track_name',
        artists: ['track_artist'],
        isPlaying: true,
        link: 'https://example.com',
    };

    it('returns a correct plainObj', () => {
        expect(track.toPlainObj()).toStrictEqual(expectedPlainObj);
    });

    it('returns a correct JSON stringified plainObj', () => {
        expect(track.toJson()).toStrictEqual(JSON.stringify(expectedPlainObj));
    });

    it('is a valid track', () => {
        expect(track.isValid()).toStrictEqual(true);
    });

    it('returns a corresponding value object', () => {
        expect(track.name).toStrictEqual(Name.of('track_name'));
        expect(track.artists).toStrictEqual([Artist.of('track_artist')]);
        expect(track.isPlaying).toStrictEqual(IsPlaying.of(true));
        expect(track.link).toStrictEqual(Link.of('https://example.com'));
    });

    const invalidTrack = new Track(Name.of(''), [Artist.of('track_artist')], IsPlaying.of(false), Link.of(''));

    it('is an invalid track', () => {
        expect(invalidTrack.isValid()).toStrictEqual(false);
    });
});
