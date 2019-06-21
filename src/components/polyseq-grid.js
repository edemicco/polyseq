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
            },
            localTracks: {
                type: Array,
                computed: 'createLocalTrackArray(tracks, activeSubdiv, playing)'
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
              
              .sample-name {
                display: inline-block;
                width: 4rem;
                text-align: right;
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
            
            <template is='dom-repeat' items="{{localTracks}}" index-as="tracksIdx">
                <div>
                    <span class="sample-name">{{item.sample}}</span>
                    <template is='dom-repeat' items="{{item.pattern}}" as="subdiv">
                        <span class$="subdivision-box [[getCssClass(subdiv)]]">
                            <mwc-checkbox checked="{{subdiv.play}}" value='{{tracksIdx}}:{{index}}' on-click="selectSubdivision"></mwc-checkbox>
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

    createLocalTrackArray(tracks, activeSubdiv, playing) {
        // create copy of tracks array with
        return tracks.map(function(track) {
            return {
                sample: track.sample,
                pattern: track.pattern.map((subdiv, index) => ({play: subdiv, active: playing && activeSubdiv === index}))
            }
        });

    }

    getCssClass(subdiv) {
        return (subdiv.play ? 'selected' : '') + (this.playing && subdiv.active ? ' active' : '');
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