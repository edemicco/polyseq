import {
    createStore,
    compose as origCompose,
    applyMiddleware,
    combineReducers
} from 'redux';
import {reduxActions} from './redux-actions';

var initialState = {
    playing:      false,
    activeSubdiv: 0,
    bpm:          80,
    beats:        4,
    subdivisions: 2,
    tracks:       [
        {
            sound: 'hihat',
            pattern: [false, false, false, false, false, false, false, false]
        }
    ]
};

function appReducer (state = initialState, action) {
    switch (action.type) {

        case reduxActions.ADD_TRACK:
            return {
                ...state,
                tracks: [
                    ...state.tracks,
                    {
                        sound: 'snare',
                        pattern: (count => Array(count).fill(false))(state.beats * state.subdivisions)
                    }
                ]
            };

        case reduxActions.TOGGLE_SUBDIVISION:
            var trackNumber = action.trackNumber;
            var oldTrack = state.tracks[trackNumber];

            // clone tracks array
            var newTracks = state.tracks.slice(0);
            // clone track object
            newTracks[trackNumber] = Object.assign({}, oldTrack);
            // clone the track's pattern array
            newTracks[trackNumber].pattern = oldTrack.pattern.slice(0)
            // toggle the subdivision
            newTracks[trackNumber].pattern[action.subdivision] = !oldTrack.pattern[action.subdivision];

            return {
                ...state,
                tracks: newTracks
            };

        case reduxActions.TOGGLE_PLAYBACK:
            return {
                ...state,
                playing: !state.playing
            };
    }

    return state
}

export const store = createStore(appReducer);

window.store = store; // to assist debugging