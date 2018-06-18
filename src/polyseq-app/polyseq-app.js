import {LitElement, html} from '@polymer/lit-element';
import {PolyseqGrid} from './polyseq-grid'

class PolyseqApp extends LitElement {
    static get properties() {
        return {
            beats: Number,
            subdivisions: Number,
            bpm: Number
        };
    }

    constructor() {
        super();

        this.beats = 4;
        this.subdivisions = 2;
        this.bpm = 100;
    }

    _render({beats, subdivisions, bpm}) {
        return html`
            <style>
              :host {
                display: block;
              }
            </style>
            
            <polyseq-grid beats="${beats}" subdivisions="${subdivisions}"></polyseq-grid>
        `;
    }
}

window.customElements.define('polyseq-app', PolyseqApp);