/* global assert, process, setup, suite, test */

const machinima = require('aframe-machinima-testing');

suite('machinima-testing example suite', function () {
  setup(function (done) {
    /* inject the scene html into the testing docoument */
    machinima.setupScene(this, 'scene.html');
    this.scene = document.querySelector('a-scene');
    this.scene.addEventListener('loaded', e => {
      done();
    });
  });
  // writing tests with the test wraper function:
  machinima.test(
    'machinima-testing example test', // test description
    'base/recordings/recording.json', // path to recording file
    function () {
      // code/assertions to run after recording has completed playing
      var boxPosition = this.boxEntity.getAttribute('position');
      assert.deepEqual(boxPosition, {x: -1, y: 0.5, z: -3});
    },
    function () {
      // optional code/assertions to run before recording starts
      // `this` object is shared between pre and post functions
      this.boxEntity = document.querySelector('a-box');
    }
  );
  // writing tests with the lower level functions
  test('using lower level machinima testing functions', function (done) {
    var sphere = document.querySelector('a-sphere');
    machinima.testStart(this, 'base/recordings/recording.json');
    machinima.testEnd(function () {
      assert.deepEqual(sphere.getAttribute('position'), {x: 0, y: 1.25, z: -5});
      done();
    });
  });
});
