import {PolymerElement, html} from '@polymer/polymer/polymer-element';
import {DomRepeat} from '@polymer/polymer/lib/elements/dom-repeat';
import {Checkbox} from '@material/mwc-checkbox';
import {store} from '../store'
import {connect} from 'pwa-helpers/connect-mixin'
import {reduxActions} from '../redux-actions';

class PolyseqGrid extends connect(store)(PolymerElement){
    static get properties() {
        return {
            tracks: {
                type: Array
            },
            activeSubdiv: {
                type: Number
            },
            playing: {
                type: Boolean
            }
        }
        ;
    }

    constructor() {
        super();
    }

    static get template() {
        return html`
            <style>
              :host {
                display: block;
                margin: 1rem;
              }
              
              .subdivision-box {
                background: lightblue;
                display: inline-block;
              }
              
              .subdivision-box.selected {
                background: darkblue;
              }
              
              .subdivision-box.active {
                background: greenyellow;
              }
            </style>
            
            <template is='dom-repeat' items="{{tracks}}" index-as="tracksIdx">
                <div>
                    <span>{{item.sound}}</span>
                    <template is='dom-repeat' items="{{item.pattern}}" as="playThisDiv">
                        <span class$="subdivision-box [[getCssClass(playThisDiv, index)]]">
                            <mwc-checkbox checked="{{playThisDiv}}" value='{{tracksIdx}}:{{index}}' on-click="selectSubdivision"></mwc-checkbox>
                        </span>
                    </template>
                </div>
            </template>
            
            <button on-click='addTrack'>Add</button>
        `;
    }

    _stateChanged(state) {
        this.tracks = state.tracks;
        this.activeSubdiv = state.activeSubdiv;
        this.playing = state.playing;
    }

    getCssClass(selected, subdiv) {
        return (selected ? 'selected' : '') + (this.playing && subdiv == this.activeSubdiv ? ' active' : '');
    }

    selectSubdivision(event) {
        var splitValue = event.currentTarget.value.split(':');
        var track = splitValue[0];
        var subdivision = splitValue[1];

        store.dispatch({
            type: reduxActions.TOGGLE_SUBDIVISION,
            trackNumber: track,
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