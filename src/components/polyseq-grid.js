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
            },
            sampleSet: {
                type: Array,
                computed: 'createLocalSampleSet(sampleSets, activeSampleSet)'
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
            
            <template is='dom-repeat' items="{{localTracks}}" index-as="tracksIdx">
                <div>
                    <select on-change="selectSample">
                        <template is='dom-repeat' items="{{sampleSet}}" as="sample">
                            <option value="{{sample.id}}" selected="{{getSelectedSample(sample.id, item.sample)}}">{{sample.name}}</option>
                        </template>                     
                    </select>
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
        this.sampleSets = state.sampleSets;
        this.activeSampleSet = state.activeSampleSet;
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

    createLocalSampleSet(sampleSets, activeSampleSet) {
        var sampleMap = sampleSets[activeSampleSet].samples;

        return Object.keys(sampleMap).map(key=>({id: key, name: sampleMap[key].name}));
    }

    getCssClass(subdiv) {
        return (subdiv.play ? 'selected' : '') + (this.playing && subdiv.active ? ' active' : '');
    }

    // TODO: Is there a generic way to check for equality in the template?
    getSelectedSample(sampleId, trackSampleId) {
        return sampleId === trackSampleId;
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

    selectSample(event) {
        store.dispatch({
            type: reduxActions.SELECT_SAMPLE,
            track: event.model.tracksIdx,
            sample: event.target.value
        });
    }

    addTrack() {
        store.dispatch({
            type: reduxActions.ADD_TRACK
        });
    }
}

window.customElements.define('polyseq-grid', PolyseqGrid);

export { PolyseqGrid }