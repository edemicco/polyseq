import {
    createStore
} from 'redux';
import {reduxActions} from './redux-actions';

var initialState = {
    playing:      false,
    activeSubdiv: 0,
    bpm:          80,
    beats:        4,
    subdivisions: 4,
    tracks:       [
        {
            sample: 'closedHat',
            pattern: [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false]
        },
        {
            sample: 'snare',
            pattern: [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false]
        },
        {
            sample: 'kick',
            pattern: [true, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false]
        }
    ],
    activeSampleSet: "acousticKit",
    sampleSets: {
        acousticKit: {
            name: "Acoustic Kit",
            description: "Acoustic Drum Kit",
            copyright: "Unknown",
            url: "",
            samples: {
                closedHat: {
                    path: "assets/samples/cmm-kit/Closed Hat.wav",
                    name: "Closed Hat"
                },
                crashCymbal: {
                    path: "assets/samples/cmm-kit/Crash Cymbal.wav",
                    name: "Crash Cymbal"
                },
                floorTom: {
                    path: "assets/samples/cmm-kit/Floor Tom.wav",
                    name: "Floor Tom"
                },
                kick: {
                    path: "assets/samples/cmm-kit/Kick.wav",
                    name: "Kick"
                },
                midHat: {
                    path: "assets/samples/cmm-kit/Mid Hat.wav",
                    name: "Mid Hat"
                },
                midTom: {
                    path: "assets/samples/cmm-kit/Mid Tom.wav",
                    name: "Mid Tom"
                },
                openHat1: {
                    path: "assets/samples/cmm-kit/Open Hat 1.wav",
                    name: "Open Hat 1"
                },
                openHat2: {
                    path: "assets/samples/cmm-kit/Open Hat 2.wav",
                    name: "Open Hat 2"
                },
                rideCymbal: {
                    path: "assets/samples/cmm-kit/Ride Cymbal.wav",
                    name: "Ride Cymbal"
                },
                snare: {
                    path: "assets/samples/cmm-kit/Snare.wav",
                    name: "Snare"
                },
                lowTom: {
                    path: "assets/samples/cmm-kit/Low Tom.wav",
                    name: "Low Tom"
                }
            }
        }
    }
};

// TODO: Investigate splitting this up.
function appReducer (state = initialState, action) {
    switch (action.type) {

        case reduxActions.ADD_TRACK:
            return {
                ...state,
                tracks: [
                    ...state.tracks,
                    {
                        sample: 'midTom',
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
                playing: !state.playing
            };

        case reduxActions.UPDATE_SUBDIVISION:
            return {
                ...state,
                activeSubdiv: action.subdivision
            };

        case reduxActions.SELECT_SAMPLE:
            var newTracks = state.tracks.slice(0);

            newTracks[action.track].sample = action.sample;

            return {
                ...state,
                tracks: newTracks
            };

        case reduxActions.SET_BPM:
            return {
                ...state,
                bpm: action.bpm
            };
    }

    return state
}

export const store = createStore(appReducer);

window.reduxStore = store; // to assist debugging