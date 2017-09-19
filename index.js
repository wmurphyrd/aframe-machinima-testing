/* global test */
function testFunctionFactory (machinima, recordingFile, postReplay, preReplay) {
  return function (done) {
    var postCallback = done;
    if (typeof preReplay === 'function') { preReplay.call(this); }
    if (typeof postReplay === 'function') {
      postCallback = function () {
        postReplay.call(this);
        done();
      };
    }
    machinima.testEnd(postCallback.bind(this));
    machinima.testStart(this, recordingFile);
  };
}
const machinima = {
  setupScene: function (sceneFile) {
    const body = document.querySelector('body');
    if (!window.__html__[sceneFile]) {
      console.error('File ' + sceneFile + ' not found by html2js' +
          'loader. Check karma.conf.js settings for files and preprocessors');
    }
    body.innerHTML = window.__html__[sceneFile] + body.innerHTML;
  },
  test: function (description, recordingFile, postReplay, preReplay) {
    test(description,
        testFunctionFactory(this, recordingFile, postReplay, preReplay));
  },
  testStart: function (testContext, recordingFile) {
    testContext.timeout(0);
    document.querySelector('a-scene').setAttribute(
      'avatar-replayer', 'spectatorMode: true; src:' + recordingFile
    );
  },
  testEnd: function (callback) {
    document.querySelector('a-scene')
        .addEventListener('replayingstopped', callback, { once: true });
        // set event callback with 'once' flag due to multiple event emissions
  },
  teardownReplayer: function () {
    var replayer = document.querySelector('a-scene') &&
        document.querySelector('a-scene').components &&
        document.querySelector('a-scene').components['avatar-replayer'];
    if (replayer) { replayer.isReplaying = false; }
  }
};

machinima.test.only = function (description, recordingFile, postReplay, preReplay) {
  test.only(description,
      testFunctionFactory(machinima, recordingFile, postReplay, preReplay));
};
machinima.test.skip = function (description, recordingFile, postReplay, preReplay) {
  test.skip(description,
      testFunctionFactory(machinima, recordingFile, postReplay, preReplay));
};

module.exports = machinima;
