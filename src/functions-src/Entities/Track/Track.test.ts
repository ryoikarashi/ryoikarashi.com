import {Track} from "./Track";
import {Name} from "./Name";
import {Artist} from "./Artist";
import {IsPlaying} from "./IsPlaying";
import {Link} from "./Link";

describe('Test Track Entity', () => {
    const track = new Track(
        Name.of('track_name'),
        Artist.of('track_artist'),
        IsPlaying.of(true),
        Link.of('https://example.com'),
    );

    const expectedPlainObj = {
        name: 'track_name',
        artist: 'track_artist',
        isPlaying: true,
        link: 'https://example.com',
    };

    test('should return a correct plainObj', () => {
        expect(track.toPlainObj()).toStrictEqual(expectedPlainObj);
    });

    test('should return a correct JSON stringified plainObj', () => {
        expect(track.toJson()).toStrictEqual(JSON.stringify(expectedPlainObj));
    });

    test('should be a valid track', () => {
        expect(track.isValid()).toStrictEqual(true);
    });

    test('should return a corresponding value object', () => {
        expect(track.name).toStrictEqual(Name.of('track_name'));
        expect(track.artist).toStrictEqual(Artist.of('track_artist'));
        expect(track.isPlaying).toStrictEqual(IsPlaying.of(true));
        expect(track.link).toStrictEqual(Link.of('https://example.com'));
    });

    const invalidTrack = new Track(
        Name.of(''),
        Artist.of('track_artist'),
        IsPlaying.of(false),
        Link.of('')
    );

    test('should be an invalid track', () => {
        expect(invalidTrack.isValid()).toStrictEqual(false);
    });
});
