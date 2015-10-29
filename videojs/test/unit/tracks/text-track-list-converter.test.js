import c from '../../../src/js/tracks/text-track-list-converter.js';
import TextTrack from '../../../src/js/tracks/text-track.js';
import TextTrackList from '../../../src/js/tracks/text-track-list.js';
import Html5 from '../../../src/js/tech/html5.js';
import document from 'global/document';
import window from 'global/window';

q.module('Text Track List Converter', {});

let clean = (item) => {
  delete item.id;
  delete item.inBandMetadataTrackDispatchType;
  delete item.cues;
};

let cleanup = (item) => {
  if (Array.isArray(item)) {
    item.forEach(clean);
  } else {
    clean(item);
  }

  return item;
};

if (Html5.supportsNativeTextTracks()) {
  q.test('trackToJson_ produces correct representation for native track object', function(a) {
    let track = document.createElement('track');
    track.src = 'example.com/english.vtt';
    track.kind = 'captions';
    track.srclang = 'en';
    track.label = 'English';

    a.deepEqual(cleanup(c.trackToJson_(track.track)), {
      kind: 'captions',
      label: 'English',
      language: 'en',
      mode: 'disabled'
    }, 'the json output is same');
  });

  q.test('textTracksToJson produces good json output', function(a) {
    let emulatedTrack = new TextTrack({
      kind: 'captions',
      label: 'English',
      language: 'en',
      tech: {}
    });

    let nativeTrack = document.createElement('track');
    nativeTrack.kind = 'captions';
    nativeTrack.srclang = 'es';
    nativeTrack.label = 'Spanish';

    let tt = new TextTrackList();
    tt.addTrack_(nativeTrack.track);
    tt.addTrack_(emulatedTrack);

    let tech = {
      el() {
        return {
          querySelectorAll() {
            return [nativeTrack];
          }
        };
      },
      textTracks() {
        return tt;
      }
    };

    a.deepEqual(cleanup(c.textTracksToJson(tech)), [{
      kind: 'captions',
      label: 'Spanish',
      language: 'es',
      mode: 'disabled'
    }, {
      kind: 'captions',
      label: 'English',
      language: 'en',
      mode: 'disabled'
    }], 'the output is correct');
  });

  q.test('jsonToTextTracks calls addRemoteTextTrack on the tech with mixed tracks', function(a) {
    let emulatedTrack = new TextTrack({
      kind: 'captions',
      label: 'English',
      language: 'en',
      src: 'example.com/english.vtt',
      tech: {}
    });

    let nativeTrack = document.createElement('track');
    nativeTrack.src = 'example.com/spanish.vtt';
    nativeTrack.kind = 'captions';
    nativeTrack.srclang = 'es';
    nativeTrack.label = 'Spanish';

    let tt = new TextTrackList();
    tt.addTrack_(nativeTrack.track);
    tt.addTrack_(emulatedTrack);

    let addRemotes = 0;
    let tech = {
      el() {
        return {
          querySelectorAll() {
            return [nativeTrack];
          }
        };
      },
      textTracks() {
        return tt;
      },
      addRemoteTextTrack() {
        addRemotes++;
        return {
          track: {}
        };
      }
    };

    c.jsonToTextTracks(cleanup(c.textTracksToJson(tech)), tech);

    a.equal(addRemotes, 2, 'we added two text tracks');
  });
}

q.test('trackToJson_ produces correct representation for emulated track object', function(a) {
  let track = new TextTrack({
    kind: 'captions',
    label: 'English',
    language: 'en',
    src: 'example.com/english.vtt',
    tech: {}
  });

  a.deepEqual(cleanup(c.trackToJson_(track)), {
    src: 'example.com/english.vtt',
    kind: 'captions',
    label: 'English',
    language: 'en',
    mode: 'disabled'
  }, 'the json output is same');
});

q.test('textTracksToJson produces good json output for emulated only', function(a) {
  let emulatedTrack = new TextTrack({
    kind: 'captions',
    label: 'English',
    language: 'en',
    src: 'example.com/english.vtt',
    tech: {}
  });

  let anotherTrack = new TextTrack({
    src: 'example.com/spanish.vtt',
    kind: 'captions',
    srclang: 'es',
    label: 'Spanish',
    tech: {}
  });

  let tt = new TextTrackList();
  tt.addTrack_(anotherTrack);
  tt.addTrack_(emulatedTrack);

  let tech = {
    el() {
      return {
        querySelectorAll() {
          return [];
        }
      };
    },
    textTracks() {
      return tt;
    }
  };

  a.deepEqual(cleanup(c.textTracksToJson(tech)), [{
    src: 'example.com/spanish.vtt',
    kind: 'captions',
    label: 'Spanish',
    language: 'es',
    mode: 'disabled'
  }, {
    src: 'example.com/english.vtt',
    kind: 'captions',
    label: 'English',
    language: 'en',
    mode: 'disabled'
  }], 'the output is correct');
});

q.test('jsonToTextTracks calls addRemoteTextTrack on the tech with emulated tracks only', function(a) {
  let emulatedTrack = new TextTrack({
    kind: 'captions',
    label: 'English',
    language: 'en',
    src: 'example.com/english.vtt',
    tech: {}
  });

  let anotherTrack = new TextTrack({
    src: 'example.com/spanish.vtt',
    kind: 'captions',
    srclang: 'es',
    label: 'Spanish',
    tech: {}
  });

  let tt = new TextTrackList();
  tt.addTrack_(anotherTrack);
  tt.addTrack_(emulatedTrack);

  let addRemotes = 0;
  let tech = {
    el() {
      return {
        querySelectorAll() {
          return [];
        }
      };
    },
    textTracks() {
      return tt;
    },
    addRemoteTextTrack() {
      addRemotes++;
      return {
        track: {}
      };
    }
  };

  c.jsonToTextTracks(cleanup(c.textTracksToJson(tech)), tech);

  a.equal(addRemotes, 2, 'we added two text tracks');
});
