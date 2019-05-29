var LedMatrix = require("easybotics-rpi-rgb-led-matrix");
var gm = require('gm').subClass({ imageMagick: true });
var GifReader = require('omggif').GifReader
var ndarray       = require('ndarray')
var matrix;
var pixels;
var numFrame;
var gifReader;
var frameCount;
var updateGifLoop;
function LedDisplay(width, height) {
  this.setImage = function (path,cd) {
    console.log(path);

    gm(path)
    .coalesce()
    .resize(64, 64, '>')
    .background('black')
    .gravity('Center')
    .extent(64, 64)
    .toBuffer('GIF',function(err,buffer)
    {
      try {
        delete gifReader;
        gifReader = new GifReader(buffer);
        frameCount = 0;
        numFrame = 0;
        if(updateGifLoop!=null)clearTimeout(updateGifLoop);
        updateGif();
        cd();
      } catch(err) {
        console.log(err);
        return
      }
    });
    
  }
  function updateGif() {
    if (gifReader == null) return;
    let nshape = [gifReader.height, gifReader.width, 4]
    let ndata = new Uint8Array(nshape[0] * nshape[1] * nshape[2])
    let result = ndarray(ndata, nshape)
    let delay = gifReader.frameInfo(frameCount).delay * 10;
    numFrame = gifReader.numFrames();
    gifReader.decodeAndBlitFrameRGBA(frameCount, ndata);
    pixels = result.transpose(1,0);
    frameCount ++
    if(frameCount  >= numFrame) frameCount = 0;
    updateGifLoop = setTimeout(updateGif,delay);
  }
  matrix = new LedMatrix(width, width,1,1,50,'regular','RBG');
  setInterval(display, 30);
  function display() {
    if (pixels == null) return;
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < width; y++) {
        matrix.setPixel(x, y, pixels.get(x, y, 0), pixels.get(x, y, 1), pixels.get(x, y, 2));
      }
    }
    matrix.update();
  }
}
module.exports = LedDisplay;
