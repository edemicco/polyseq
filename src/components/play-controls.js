import {PolymerElement, html} from '@polymer/polymer/polymer-element';
import {store} from '../store'
import {connect} from 'pwa-helpers/connect-mixin'
import {reduxActions} from '../redux-actions';

class PlayControls extends connect(store)(PolymerElement){
    static get properties() {
        return {
            playing: {
                type: Boolean
            },
            playStopButtonLabel: {
                type: String,
                computed: 'getPlayStopButtonLabel(playing)'
            }
        };
    }

    constructor() {
        super();
    }

    static get template() {
        return html`
            <style>
              :host {
                display: inline-block;
                margin: 1rem;
                padding: 0.5rem;
                border: 0.25rem solid darkgray;
                background: lightgray;
              }
            </style>
            
            <button on-click="togglePlayback">{{playStopButtonLabel}}</button>
            
            <label>
                BPM
                <input type="number" value="{{bpm}}" on-change="updateBpm">
            </label>
        `;
    }

    _stateChanged(state) {
        this.playing = state.playing;
        this.bpm = state.bpm;
    }

    getPlayStopButtonLabel(playing) {
        return playing ? 'Stop' : 'Play';
    }

    togglePlayback() {
        store.dispatch({
            type: reduxActions.TOGGLE_PLAYBACK,
        })
    }

    updateBpm(event) {
        store.dispatch({
            type: reduxActions.SET_BPM,
            bpm: parseInt(event.currentTarget.value)
        })
    }
}

window.customElements.define('play-controls', PlayControls);

export { PlayControls }