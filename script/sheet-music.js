
import {LitElement, html, css} from '../library/lit.js';

// noinspection JSFileReferences
import('https://cdn.jsdelivr.net/npm/vexflow@4.2.5/build/cjs/vexflow.min.js').then((response) => {
    console.log('vexflow', response);
    class SheetMusic extends LitElement {

        static styles = css`
      #music-sheet {
        width: 500px;
        margin: 20px auto;
        border: 1px solid #ccc;
        padding: 10px;
      }
    `;

        static get properties() {
            return {
                song: { type: Object }
            };
        }

        constructor() {
            super();
        }

        render() {
            return html`
            <div id="music-sheet"></div>
            <slot @slotchange="${this.handleSlotChange}"></slot>
      `;
        }

        updated() {
            if (this.song) {
                this.renderSheetMusic();
            }
        }

        handleSlotChange(event) {
            console.log('SLOT CHANGED:', event);
            const slot = event.target;
            const nodes = slot.assignedNodes({ flatten: true });
            const xmlNode = nodes.find(node => node.nodeName === 'SONG');
            console.log('XML NODE:', xmlNode);
            if (xmlNode) {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xmlNode.innerHTML, 'text/xml');
                console.log('processXml:', xmlNode);
                this.song = this.processXml(xmlNode);
            }
        }

        processXml(songNode) {
            // const songNode = xmlDoc.querySelector('song')
            // console.log('XML SONG:', songNode);
            if (!songNode) return;

            const timeSignature = songNode.getAttribute('timeSignature') || '4/4';

            const voiceNodes = songNode.querySelectorAll('voice');

            console.log('VOICE NODEs', voiceNodes);
            const song =  {
                timeSignature: timeSignature,
                voices: Array.from(voiceNodes).map((voiceNode) => this._transformVoiceNode(voiceNode)),
            };

            console.log('SONG', song);
            return song;
            // this.song = {
            //     voice: {}
            // }
            // this.song.timeSignature = songNode.getAttribute('timeSignature') || '4/4';
            //
            // const voiceNode = songNode.querySelector('voice');
            // if (!voiceNode) return;
            //
            // // this.song.voice.num_beats = parseInt(voiceNode.getAttribute('num_beats')) || 4;
            // this.song.voice.beat_value = parseInt(voiceNode.getAttribute('beat_value')) || 4;
            //
            // this.song.voice.notes = [];
            // const noteNodes = voiceNode.querySelectorAll('note');
            // noteNodes.forEach(noteNode => {
            //     const keys = [noteNode.getAttribute('keys')];
            //     const duration = noteNode.getAttribute('duration');
            //     console.log(noteNode, keys, duration);
            //     if (keys && duration) {
            //         this.song.voice.notes.push({ keys, duration });
            //     }
            // });
            //
            // // for some reason at least one note needs a duration of 'h'
            // if (this.song.voice.notes.length > 0 && !this.song.voice.notes.map((note) => note.duration).includes('h')) {
            //     this.song.voice.notes[this.song.voice.notes.length - 1].duration = 'h';
            // }
            //
            // this.song.voice.num_beats = this.song.voice.notes.length + 1;
            //
            // console.log(this.song);
        }

        _transformVoiceNode(voiceNode) {
            const beat_value = parseInt(voiceNode.getAttribute('beat_value')) || 4;
            const noteNodes = voiceNode.querySelectorAll('note');

            const notes = [];
            let foundH = false;
            noteNodes.forEach(noteNode => {
                const keys = [noteNode.getAttribute('keys')];
                const duration = noteNode.getAttribute('duration');
                if (duration === 'h') {
                    foundH = true;
                }
                console.log(noteNode, keys, duration);
                if (keys && duration) {
                   notes.push({ keys, duration });
                }
            });

            // for some reason at least one note needs a duration of 'h'
            if (!foundH && notes.length > 0) {
                notes[notes.length - 1].duration = 'h';
            }

            return {
                num_beats: notes.length + 1,
                beat_value: beat_value,
                notes: notes,
            }
        }

        renderSheetMusic() {
            var VF = Vex.Flow;

            const div = this.shadowRoot.getElementById('music-sheet');
            if (!div) return;

            console.log('Voices', this.song.voices);
            this.song.voices.forEach((voice) => {
                const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
                renderer.resize(500, 150);

                const stave = new VF.Stave(10, 40, 480);
                stave.addClef('treble').addTimeSignature(this.song.timeSignature).setContext(renderer.getContext()).draw();

                const notes = voice.notes.map((note) => {
                    return new VF.StaveNote({ clef: 'treble', keys: note.keys, duration: note.duration });
                });

                const vfVoice = new VF.Voice(voice);
                vfVoice.addTickables(notes);

                new VF.Formatter().joinVoices([vfVoice]).format([vfVoice], 400);

                vfVoice.draw(renderer.getContext(), stave);
            });
        }
    }

    // Register the custom element
    customElements.define('wt-sheet-music', SheetMusic);
}).catch((error) => {
    console.error('Failed to load VexFlow:', error);
});
