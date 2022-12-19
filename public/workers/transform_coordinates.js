const convertCoordinates = ({ baseSize, currentSize, xyCoordinates, xyOffset }) => {
  const ratio = baseSize / currentSize;
  if (Array.isArray(xyCoordinates)) {
    const result = [];
    for (let i = 0; i < xyCoordinates.length; i++) {
      result.push({
        x: (xyCoordinates[i].x * parseFloat(ratio)) + xyOffset.x,
        y: (xyCoordinates[i].y * parseFloat(ratio)) + xyOffset.y,
      });
    }
    return result;
  } else {
    return {
      x: (xyCoordinates.x * parseFloat(ratio)) + xyOffset.x,
      y: (xyCoordinates.y * parseFloat(ratio)) + xyOffset.y,
    };
  }
};

onmessage = (msg) => {
  const workerResult = convertCoordinates(msg.data);
  postMessage({ returnVal: msg.data.returnVal, result: workerResult });
};
