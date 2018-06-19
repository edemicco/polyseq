import {
    createStore,
    compose as origCompose,
    applyMiddleware,
    combineReducers
} from 'redux';
import {reduxActions} from './redux-actions';

var initialState = {
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
            // clone tracks array
            var newTracks = state.tracks.slice(0);

            newTracks[action.track].pattern[action.subdivision] = !newTracks[action.track].pattern[action.subdivision];

            return {
                ...state,
                tracks: newTracks
            }
    }

    return state
}

export const store = createStore(appReducer);

window.store = store; // to assist debugging