import mergeOptions from '../../../src/js/utils/merge-options.js';

q.module('merge-options');

test('should merge options objects', function(){
  var ob1, ob2, ob3;

  ob1 = {
    a: true,
    b: { b1: true, b2: true, b3: true },
    c: true
  };

  ob2 = {
    // override value
    a: false,
    // merge sub-option values
    b: { b1: true, b2: false, b4: true },
    // add new option
    d: true
  };

  ob3 = mergeOptions(ob1, ob2);

  deepEqual(ob3, {
    a: false,
    b: { b1: true, b2: false, b3: true, b4: true },
    c: true,
    d: true
  }, 'options objects merged correctly');
});
