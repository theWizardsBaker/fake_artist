const convertCoordinates = ({ baseSize, currentSize, xyCoordinates }) => {
  const ratio = baseSize / currentSize;
  if (Array.isArray(xyCoordinates)) {
    const result = [];
    for (let i = 0; i < xyCoordinates.length; i++) {
      result.push({
        x: (xyCoordinates[i].x * parseFloat(ratio)),
        y: (xyCoordinates[i].y * parseFloat(ratio)),
      });
    }
    return result;
  } else {
    return {
      x: (xyCoordinates.x * parseFloat(ratio)),
      y: (xyCoordinates.y * parseFloat(ratio)),
    };
  }
};

onmessage = (msg) => {
  const workerResult = convertCoordinates(msg.data);
  postMessage({ returnVal: msg.data.returnVal, result: workerResult });
};
