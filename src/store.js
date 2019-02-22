import {
    createStore
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
            newTracks[trackNumber].pattern = oldTrack.pattern.slice(0);
            // toggle the subdivision
            newTracks[trackNumber].pattern[action.subdivision] = !oldTrack.pattern[action.subdivision];

            return {
                ...state,
                tracks: newTracks
            };

        case reduxActions.TOGGLE_PLAYBACK:
            return {
                ...state,
                playing: !state.playing,
                activeSubdiv: 0
            };

        case reduxActions.NEXT_TICK:
            if (state.playing) {
                return {
                    ...state,
                    activeSubdiv: (state.activeSubdiv < ((state.beats * state.subdivisions) - 1)) ? state.activeSubdiv + 1 : 0
                }
            } else {
                return state;
            }
    }

    return state
}

export const store = createStore(appReducer);

window.reduxStore = store; // to assist debugging