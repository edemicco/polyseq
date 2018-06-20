import {PolymerElement, html} from '@polymer/polymer/polymer-element';
import {DomRepeat} from '@polymer/polymer/lib/elements/dom-repeat';
import {Checkbox} from '@material/mwc-checkbox';
import {store} from '../store'
import {connect} from 'pwa-helpers/connect-mixin'
import {reduxActions} from '../redux-actions';

class PolyseqGrid extends connect(store)(PolymerElement) {
    static get properties() {
        return {
            tracks: {
                type: Array
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
                display: block;
              }
            </style>
            
            <template is='dom-repeat' items="{{tracks}}" index-as="tracksIdx">
                <div>
                    <span>{{item.sound}}</span>
                    <template is='dom-repeat' items="{{item.pattern}}">
                        <mwc-checkbox checked="{{item}}" value='{{tracksIdx}}:{{index}}' on-click="selectSubdivision"></mwc-checkbox>
                    </template>
                </div>
            </template>
            
            <button on-click='addTrack'>Add</button>
        `;
    }

    _stateChanged(state) {
        this.tracks = state.tracks;
    }

    selectSubdivision(event) {
        event.preventDefault();
        var splitValue = event.currentTarget.value.split(':');
        var track = splitValue[0];
        var subdivision = splitValue[1];

        store.dispatch({
            type: reduxActions.TOGGLE_SUBDIVISION,
            track: track,
            subdivision: subdivision
        })
    }

    addTrack() {
        store.dispatch({
            type: reduxActions.ADD_TRACK
        });
    }
}

window.customElements.define('polyseq-grid', PolyseqGrid);

export { PolyseqGrid }