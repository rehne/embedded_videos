import document from 'global/document';
import * as Dom from '../../../src/js/utils/dom.js';
import TestHelpers from '../test-helpers.js';

q.module('dom');

test('should return the element with the ID', function(){
  var el1 = document.createElement('div');
  var el2 = document.createElement('div');
  var fixture = document.getElementById('qunit-fixture');

  fixture.appendChild(el1);
  fixture.appendChild(el2);

  el1.id = 'test_id1';
  el2.id = 'test_id2';

  ok(Dom.getEl('test_id1') === el1, 'found element for ID');
  ok(Dom.getEl('#test_id2') === el2, 'found element for CSS ID');
});

test('should create an element', function(){
  let div = Dom.createEl();
  let span = Dom.createEl('span', {
    innerHTML: 'fdsa'
  }, {
    'data-test': 'asdf'
  });

  ok(div.nodeName === 'DIV');
  ok(span.nodeName === 'SPAN');
  ok(span.getAttribute('data-test') === 'asdf');
  ok(span.innerHTML === 'fdsa');
});

test('should insert an element first in another', function(){
  var el1 = document.createElement('div');
  var el2 = document.createElement('div');
  var parent = document.createElement('div');

  Dom.insertElFirst(el1, parent);
  ok(parent.firstChild === el1, 'inserts first into empty parent');

  Dom.insertElFirst(el2, parent);
  ok(parent.firstChild === el2, 'inserts first into parent with child');
});

test('should get and remove data from an element', function(){
  var el = document.createElement('div');
  var data = Dom.getElData(el);

  ok(typeof data === 'object', 'data object created');

  // Add data
  var testData = { asdf: 'fdsa' };
  data.test = testData;
  ok(Dom.getElData(el).test === testData, 'data added');

  // Remove all data
  Dom.removeElData(el);

  ok(!Dom.hasElData(el), 'cached item emptied');
});

test('should add and remove a class name on an element', function(){
  var el = document.createElement('div');
  Dom.addElClass(el, 'test-class');
  ok(el.className === 'test-class', 'class added');
  Dom.addElClass(el, 'test-class');
  ok(el.className === 'test-class', 'same class not duplicated');
  Dom.addElClass(el, 'test-class2');
  ok(el.className === 'test-class test-class2', 'added second class');
  Dom.removeElClass(el, 'test-class');
  ok(el.className === 'test-class2', 'removed first class');
});

test('should read class names on an element', function(){
  var el = document.createElement('div');
  Dom.addElClass(el, 'test-class1');
  ok(Dom.hasElClass(el, 'test-class1') === true, 'class detected');
  ok(Dom.hasElClass(el, 'test-class') === false, 'substring correctly not detected');
});

test('should set element attributes from object', function(){
  var el, vid1Vals;

  el = document.createElement('div');
  el.id = 'el1';

  Dom.setElAttributes(el, { controls: true, 'data-test': 'asdf' });

  equal(el.getAttribute('id'), 'el1');
  equal(el.getAttribute('controls'), '');
  equal(el.getAttribute('data-test'), 'asdf');
});

test('should read tag attributes from elements, including HTML5 in all browsers', function(){
  // Creating the source/track tags outside of the video tag prevents log errors
  let tags = `
  <video id="vid1" controls autoplay loop muted preload="none" src="http://google.com" poster="http://www2.videojs.com/img/video-js-html5-video-player.png" data-test="asdf" data-empty-string="">
    <source id="source" src="http://google.com" type="video/mp4" media="fdsa" title="test" >
  </video>
  <track id="track" default src="http://google.com" kind="captions" srclang="en" label="testlabel" title="test" >
  `;

  let fixture = document.getElementById('qunit-fixture');

  // Have to use innerHTML to append for IE8. AppendChild doesn't work.
  // Also it must be added to the page body, not just in memory.
  fixture.innerHTML += tags;

  let vid1Vals = Dom.getElAttributes(fixture.getElementsByTagName('video')[0]);
  let sourceVals = Dom.getElAttributes(fixture.getElementsByTagName('source')[0]);
  let trackVals = Dom.getElAttributes(fixture.getElementsByTagName('track')[0]);

  // vid1
  // was using deepEqual, but ie8 would send all properties as attributes
  equal(vid1Vals['autoplay'], true);
  equal(vid1Vals['controls'], true);
  equal(vid1Vals['data-test'], 'asdf');
  equal(vid1Vals['data-empty-string'], '');
  equal(vid1Vals['id'], 'vid1');
  equal(vid1Vals['loop'], true);
  equal(vid1Vals['muted'], true);
  equal(vid1Vals['poster'], 'http://www2.videojs.com/img/video-js-html5-video-player.png');
  equal(vid1Vals['preload'], 'none');
  equal(vid1Vals['src'], 'http://google.com');

  // sourceVals
  equal(sourceVals['title'], 'test');
  equal(sourceVals['media'], 'fdsa');
  equal(sourceVals['type'], 'video/mp4');
  equal(sourceVals['src'], 'http://google.com');
  equal(sourceVals['id'], 'source');

  // trackVals
  equal(trackVals['default'], true);
  equal(trackVals['id'], 'track');
  equal(trackVals['kind'], 'captions');
  equal(trackVals['label'], 'testlabel');
  equal(trackVals['src'], 'http://google.com');
  equal(trackVals['srclang'], 'en');
  equal(trackVals['title'], 'test');
});

test('Dom.findElPosition should find top and left position', function() {
  const d = document.createElement('div');
  let position = Dom.findElPosition(d);
  d.style.top = '10px';
  d.style.left = '20px';
  d.style.position = 'absolute';

  deepEqual(position, {left: 0, top: 0}, 'If element isn\'t in the DOM, we should get zeros');

  document.body.appendChild(d);
  position = Dom.findElPosition(d);
  deepEqual(position, {left: 20, top: 10}, 'The position was not correct');

  d.getBoundingClientRect = null;
  position = Dom.findElPosition(d);
  deepEqual(position, {left: 0, top: 0}, 'If there is no gBCR, we should get zeros');
});

test('Dom.isEl', function(assert) {
  assert.expect(7);
  assert.notOk(Dom.isEl(), 'undefined is not an element');
  assert.notOk(Dom.isEl(true), 'booleans are not elements');
  assert.notOk(Dom.isEl({}), 'objects are not elements');
  assert.notOk(Dom.isEl([]), 'arrays are not elements');
  assert.notOk(Dom.isEl('<h1></h1>'), 'strings are not elements');
  assert.ok(Dom.isEl(document.createElement('div')), 'elements are elements');
  assert.ok(Dom.isEl({nodeType: 1}), 'duck typing is imperfect');
});

test('Dom.isTextNode', function(assert) {
  assert.expect(7);
  assert.notOk(Dom.isTextNode(), 'undefined is not a text node');
  assert.notOk(Dom.isTextNode(true), 'booleans are not text nodes');
  assert.notOk(Dom.isTextNode({}), 'objects are not text nodes');
  assert.notOk(Dom.isTextNode([]), 'arrays are not text nodes');
  assert.notOk(Dom.isTextNode('hola mundo'), 'strings are not text nodes');
  assert.ok(Dom.isTextNode(document.createTextNode('hello, world!')), 'text nodes are text nodes');
  assert.ok(Dom.isTextNode({nodeType: 3}), 'duck typing is imperfect');
});

test('Dom.emptyEl', function(assert) {
  let el = Dom.createEl();

  el.appendChild(Dom.createEl('span'));
  el.appendChild(Dom.createEl('span'));
  el.appendChild(document.createTextNode('hola mundo'));
  el.appendChild(Dom.createEl('span'));

  Dom.emptyEl(el);

  assert.expect(1);
  assert.notOk(el.firstChild, 'the element was emptied');
});

test('Dom.normalizeContent: strings and elements/nodes', function(assert) {
  assert.expect(8);

  let str = Dom.normalizeContent('hello');
  assert.strictEqual(str[0].data, 'hello', 'single string becomes a text node');

  let elem = Dom.normalizeContent(Dom.createEl());
  assert.ok(Dom.isEl(elem[0]), 'an element is passed through');

  let node = Dom.normalizeContent(document.createTextNode('goodbye'));
  assert.strictEqual(node[0].data, 'goodbye', 'a text node is passed through');

  assert.strictEqual(Dom.normalizeContent(null).length, 0, 'falsy values are ignored');
  assert.strictEqual(Dom.normalizeContent(false).length, 0, 'falsy values are ignored');
  assert.strictEqual(Dom.normalizeContent().length, 0, 'falsy values are ignored');
  assert.strictEqual(Dom.normalizeContent(123).length, 0, 'numbers are ignored');
  assert.strictEqual(Dom.normalizeContent({}).length, 0, 'objects are ignored');
});

test('Dom.normalizeContent: functions returning strings and elements/nodes', function(assert) {
  assert.expect(9);

  let str = Dom.normalizeContent(() => 'hello');
  assert.strictEqual(str[0].data, 'hello', 'a function can return a string, which becomes a text node');

  let elem = Dom.normalizeContent(() => Dom.createEl());
  assert.ok(Dom.isEl(elem[0]), 'a function can return an element');

  let node = Dom.normalizeContent(() => document.createTextNode('goodbye'));
  assert.strictEqual(node[0].data, 'goodbye', 'a function can return a text node');

  assert.strictEqual(Dom.normalizeContent(() => null).length, 0, 'a function CANNOT return falsy values');
  assert.strictEqual(Dom.normalizeContent(() => false).length, 0, 'a function CANNOT return falsy values');
  assert.strictEqual(Dom.normalizeContent(() => undefined).length, 0, 'a function CANNOT return falsy values');
  assert.strictEqual(Dom.normalizeContent(() => 123).length, 0, 'a function CANNOT return numbers');
  assert.strictEqual(Dom.normalizeContent(() => {}).length, 0, 'a function CANNOT return objects');
  assert.strictEqual(Dom.normalizeContent(() => (() => null)).length, 0, 'a function CANNOT return a function');
});

test('Dom.normalizeContent: arrays of strings and objects', function(assert) {
  assert.expect(7);

  let source = [
    'hello',
    {},
    Dom.createEl(),
    ['oops'],
    null,
    document.createTextNode('goodbye'),
    () => 'it works'
  ];

  let result = Dom.normalizeContent(source);

  assert.strictEqual(result[0].data, 'hello', 'an array can include a string normalized to a text node');
  assert.ok(Dom.isEl(result[1]), 'an array can include an element');
  assert.strictEqual(result[2].data, 'goodbye', 'an array can include a text node');
  assert.strictEqual(result[3].data, 'it works', 'an array can include a function, which is invoked');
  assert.strictEqual(result.indexOf(source[1]), -1, 'an array CANNOT include an object');
  assert.strictEqual(result.indexOf(source[3]), -1, 'an array CANNOT include an array');
  assert.strictEqual(result.indexOf(source[4]), -1, 'an array CANNOT include falsy values');
});

test('Dom.normalizeContent: functions returning arrays', function(assert) {
  assert.expect(3);

  let arr = [];
  let result = Dom.normalizeContent(() => ['hello', Function.prototype, arr]);

  assert.strictEqual(result[0].data, 'hello', 'a function can return an array');
  assert.strictEqual(result.indexOf(Function.prototype), -1, 'a function can return an array, but it CANNOT include a function');
  assert.strictEqual(result.indexOf(arr), -1, 'a function can return an array, but it CANNOT include an array');
});

test('Dom.insertContent', function(assert) {
  let p = Dom.createEl('p');
  let text = document.createTextNode('hello');
  let el = Dom.insertContent(Dom.createEl(), [p, text]);

  assert.expect(2);
  assert.strictEqual(el.firstChild, p, 'the paragraph was inserted first');
  assert.strictEqual(el.firstChild.nextSibling, text, 'the text node was inserted last');
});

test('Dom.appendContent', function(assert) {
  let p1 = Dom.createEl('p');
  let p2 = Dom.createEl('p');
  let el = Dom.insertContent(Dom.createEl(), [p1]);

  Dom.appendContent(el, p2);

  assert.expect(2);
  assert.strictEqual(el.firstChild, p1, 'the first paragraph is the first child');
  assert.strictEqual(el.firstChild.nextSibling, p2, 'the second paragraph was appended');
});


