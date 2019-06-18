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

        this.audioContext = new AudioContext();

        // Load the sound and decode it into the buffer
        fetch('assets/samples/cmm-kit/Closed Hat.wav')
            .then(response => response.arrayBuffer())
            .then(audioData => this.audioContext.decodeAudioData(audioData, decoded=>this.buffer1=decoded));
    }

    static get template() {
        return html``;
    }

    _stateChanged(state) {
        if (state.playing) {
            if (this.audioContext.state === "suspended")
                this.audioContext.resume();

            this._scheduleMeasure(this.buffer1, 0, state);
            var measureLength = (60/state.bpm) * state.beats;

            this._repeatMeasure = window.setInterval(this._scheduleMeasure.bind(this, this.buffer1, 0, state), measureLength * 1000)
        } else {
            // TODO: Figure out how to cancel scheduled sounds.
            window.clearInterval(this._repeatMeasure);
        }
    }

    // TODO: Figure out how to schedule more frequently than each measure so changes take place immediately
    // TODO: Don't use currentTime, schedule for a precise time ("event queue")?
    _scheduleMeasure(buffer, trackNumber, state) {
        console.log('scheduleMeasure');
        var subdivisionLength = (60/state.bpm) / state.subdivisions;

        state.tracks[trackNumber].pattern.forEach(function (subdiv, index) {
            if (subdiv)
                this._scheduleBuffer(buffer, this.audioContext.currentTime + (index * subdivisionLength));
        }.bind(this));

        this.measureNumber += 1;
    }

    _scheduleBuffer(buffer, time) {
        // Create a new source
        var source = this.audioContext.createBufferSource();

        source.buffer = buffer;
        source.connect(this.audioContext.destination);
        source.start(time);
    }
}


window.customElements.define('sound-generator', SoundGenerator);

export { SoundGenerator }