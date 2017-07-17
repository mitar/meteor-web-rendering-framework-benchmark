let measurementCallback = null;
let measurementStart = null;

export default {
  startMeasurement(callback) {
    if (measurementCallback || measurementStart) {
      throw new Error("Measurement already in progress.");
    }

    measurementCallback = callback;
    measurementStart = new Date().valueOf();
  },

  logTime() {
    const end = new Date().valueOf();
    const callback = measurementCallback;
    const start = measurementStart;

    if (!measurementCallback || !measurementStart) {
      throw new Error("Measurement not in progress.");
    }

    measurementCallback = null;
    measurementStart = null;
    callback(end - start);
  }
}