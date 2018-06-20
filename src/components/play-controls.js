import {PolymerElement, html} from '@polymer/polymer/polymer-element';
import {store} from '../store'
import {connect} from 'pwa-helpers/connect-mixin'
import {reduxActions} from '../redux-actions';

class PlayControls extends connect(store)(PolymerElement){
    static get properties() {
        return {
            playing: {
                type: Boolean
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
            
            <button on-click="togglePlayback">{{getPlayStopButtonLabel()}}</button>
        `;
    }

    _stateChanged(state) {
        this.playing = state.playing;
    }

    getPlayStopButtonLabel() {
        return this.playing ? 'Stop' : 'Play';
    }

    togglePlayback() {
        store.dispatch({
            type: reduxActions.TOGGLE_PLAYBACK,
        })
    }
}

window.customElements.define('play-controls', PlayControls);

export { PlayControls }