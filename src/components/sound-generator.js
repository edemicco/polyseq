import {PolymerElement, html} from '@polymer/polymer/polymer-element';
import {store} from '../store'
import {connect} from 'pwa-helpers/connect-mixin'
import {reduxActions} from '../redux-actions';

class SoundGenerator extends connect(store)(PolymerElement) {
    static get properties() {
        return {};
    }

    constructor() {
        super();
        this.audioElement = document.querySelector('audio');

        this.audioContext = new AudioContext();
        const track = this.audioContext.createMediaElementSource(this.audioElement);
        track.connect(this.audioContext.destination);
    }

    static get template() {
        return html``;
    }

    _stateChanged(state) {
        if (state.playing) {
            if (this.audioContext.state === "suspended")
                this.audioContext.resume();

            this.audioElement.play();
        }
    }
}


window.customElements.define('sound-generator', SoundGenerator);

export { SoundGenerator }