import {PolymerElement, html} from '@polymer/polymer/polymer-element';
import {PolyseqGrid} from './polyseq-grid'
import {reduxActions} from '../redux-actions';
import {store} from '../store'

class PolyseqApp extends PolymerElement {
    static get properties() {
        return {};
    }

    static get template() {
        return html`
            <style>
              :host {
                display: block;
              }
            </style>
            
            <polyseq-grid></polyseq-grid>
        `;
    }
}

window.customElements.define('polyseq-app', PolyseqApp);