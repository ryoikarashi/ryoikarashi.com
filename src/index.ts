import './index.html';
import './404.html';
import './index.css';

import Pusher from 'pusher-js';
import isEqual from 'lodash.isequal';
import TopPage from './clients/pages/top';
import Photo from './clients/photo';
import ClickSound from './clients/click-sound';
import Track from './clients/track';
import { TrackPlainObj } from './functions-src/Entities/Track/Track';

const pusherSettings = {
    appKey: 'f3f5751318b2c7958521',
    options: {
        cluster: 'ap3',
    },
    channelName: 'spotify',
    eventName: 'fetch-currently-listening-track',
};

document.addEventListener('DOMContentLoaded', async () => {
    // composition root
    const topPage = new TopPage(
        new Photo('bg'),
        new Track(),
        new ClickSound('clickSound'),
        'spotify',
        'bg',
        'loading',
        'content',
    );

    // initialize top page
    await topPage.exec();

    // initialize pusher and dynamically reflect a currently playing track
    new Pusher(pusherSettings.appKey, pusherSettings.options)
        .subscribe(pusherSettings.channelName)
        .bind(pusherSettings.eventName, function (trackData: TrackPlainObj) {
            if (!isEqual(topPage.currentlyListeningTrack, trackData)) {
                topPage.updateDOM(trackData);
            }
        });
});
