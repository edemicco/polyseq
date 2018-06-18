import {LitElement, html} from '@polymer/lit-element';
import {Checkbox} from '@material/mwc-checkbox';

class PolyseqGrid extends LitElement {
    static get properties() {
        return {
            beats: Number,
            subdivisions: Number
        };
    }

    constructor() {
        super();
    }

    get timeGrid() {
        var grid = [];

        for (var i = 0; i < (this.beats * this.subdivisions); i++)
            grid.push({ play: Math.floor(Math.random() * 10) % 2})

        return grid
    }

    _render({beats, subdivisions, timeGrid}) {
        return html`
            <style>
              :host {
                display: block;
              }
            </style>
            
            ${this.timeGrid.map(subDiv => html`<mwc-checkbox checked='${subDiv.play}'>`)}
        `;
    }
}

window.customElements.define('polyseq-grid', PolyseqGrid);

export { PolyseqGrid }