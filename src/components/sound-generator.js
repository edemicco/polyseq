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

        var context = window.AudioContext || window.webkitAudioContext;

        this.audioContext = new context;

        this.playing = false;
        this.bpm = 0;
        this.nextSubdivToPlay = 0;

        this.lastNotesScheduledAt = 0; // The time, based on the audioContext's currentTime, the last note was played.
        this.lastSubdivScheduledAt = 0; // The last subdivision we scheduled to play, so we can update the UI when it's time comes.
        this.playNextNotesAt = 0; // The time, based on the audioContext's currentTime, to play the next note.
        this.uiNeedsUpdate = false;

        this.sampleBuffers = {};
        this.loadSamples();
    }

    static get template() {
        return html``;
    }

    _stateChanged(state) {
        if (state.playing && !this.playing) {
            if (this.audioContext.state === "suspended")
                this.audioContext.resume();

            this._runScheduler = window.requestAnimationFrame(this._scheduler.bind(this))
        } else if (!state.playing && this.playing) {
            window.cancelAnimationFrame(this._runScheduler);
            this.playNextNotesAt = null;
            this.nextSubdivToPlay = 0;
        }

        // TODO: Investigate subscribing to these things instead of always updating all of them locally.
        this.playing = state.playing;
        this.bpm = state.bpm;
        this.tracks = state.tracks; // TODO: Is this necessary? It's the same object, right? Or is it a copy?
        this.subdivisions = state.subdivisions;
        this.beats = state.beats;
        this.subdivisions = state.subdivisions;
    }

    loadSamples() {
        var activeSampleSet = store.getState().activeSampleSet;
        var sampleSet = store.getState().sampleSets[activeSampleSet].samples;

        Object.keys(sampleSet).forEach(function (sampleKey) {
            var samplePath = sampleSet[sampleKey].path;

            // Load the sound and decode it into the buffer
            fetch(samplePath)
                .then(response => response.arrayBuffer())
                .then(audioData => this.audioContext.decodeAudioData(audioData, decoded => this.sampleBuffers[sampleKey] = decoded));
        }.bind(this));
    }

    _scheduler() {
        if (!this.playNextNotesAt)
            this.playNextNotesAt = this.audioContext.currentTime;

        while (this.playNextNotesAt < (this.audioContext.currentTime + .1)) {
            for (var i = 0; i < this.tracks.length; i++) {
                if (this.tracks[i].pattern[this.nextSubdivToPlay])
                    this._playNote(this.sampleBuffers[this.tracks[i].sample], this.playNextNotesAt);
            }

            this.lastNotesScheduledAt = this.playNextNotesAt;
            this.lastSubdivScheduled = this.nextSubdivToPlay;
            this.uiNeedsUpdate = true;
            this._advanceInSequence();
        }

        // update the current subdivision in the UI, if the time is ready and we haven't done it yet.
        if (this.audioContext.currentTime >= this.lastNotesScheduledAt && this.uiNeedsUpdate) {
            store.dispatch({type: reduxActions.UPDATE_SUBDIVISION, subdivision: this.lastSubdivScheduled});
            this.uiNeedsUpdate = false;
        }

        this._runScheduler = requestAnimationFrame(this._scheduler.bind(this));
    }

    _playNote(buffer, time) {
        // Create a new source
        var source = this.audioContext.createBufferSource();

        source.buffer = buffer;
        source.connect(this.audioContext.destination);
        source.start(time);
    }

    _advanceInSequence() {
        var subDivisionTime = (60 / this.bpm) / this.subdivisions;
        this.playNextNotesAt = this.lastNotesScheduledAt + subDivisionTime;
        this.nextSubdivToPlay = this.nextSubdivToPlay < ((this.beats * this.subdivisions) - 1) ? this.nextSubdivToPlay + 1 : 0;
    }
}


window.customElements.define('sound-generator', SoundGenerator);

export { SoundGenerator }