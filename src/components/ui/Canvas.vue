<template>
  <canvas
      :id="canvasId"
      :height="Number(height)"
      :width="Number(width)"
      :style="{'touch-action': 'none',...styles}"
      :class="classes"
      :onMousedown="startDraw"
      :onMousemove="draw"
      :onMouseup="stopDraw"
      :onMouseleave="stopDraw"
      :onTouchstart="startDraw"
      :onTouchmove="draw"
      :onTouchend="stopDraw"
      :onTouchleave="stopDraw"
      :onTouchcancel="stopDraw"
      :onPointerdown="startDraw"
      :onPointermove="draw"
      :onPointerup="stopDraw"
      :onPointerleave="stopDraw"
      :onPointercancel="stopDraw"
  >
  </canvas>
</template>

<script>
  
export default {

  name: 'VueCanvas',
  
  props: {

    width: {
      type: [String, Number],
      default: () => 600
    },
    height: {
      type: [String, Number],
      default: () => 400
    },
    image: {
      type: String,
      default: () => ''
    },
    eraser: {
      type: Boolean,
      default: () => false
    },
    color: {
      type: String,
      default: () => '#000000'
    },
    lineWidth: {
      type: Number,
      default: () => 5
    },
    lock: {
      type: Boolean,
      default: () => false
    },
    styles: {
      type: [Array, String, Object],
    },
    classes: {
      type: [Array, String, Object],
    },
    backgroundColor: {
      type: String,
      default: () => '#FFFFFF'
    },
    saveAs: {
      type: String,
      validator: (value) => {
        return ['jpeg', 'png'].indexOf(value) !== -1
      },
      default: () => 'png'
    },
    canvasId: {
      type: String,
      default: () => 'VueCanvas'
    },
    initialImage: {
      type: Array,
      default: () => []
    },
    additionalImages: {
      type: Array,
      default: () => []
    },
    outputWidth: {
      type: Number
    },
    outputHeight: {
      type: Number
    }
  },

  mounted() {
    this.setContext();
    this.$nextTick(() => {
      this.drawInitialImage()
      this.drawAdditionalImages()
    })
  },

  watch: {
    backgroundImage: function () {
      this.loadedImage = null
    }
  },

  data() {
    return {
      loadedImage: null,
      drawing: false,
      context: null,
      images: [],
      strokes: {
        type: '',
        from: { x: 0, y: 0 },
        coordinates: [],
        color: '',
        width: '',
        lineCap: 'round',
        lineJoin: 'round'
      },
      guides: [],
    };
  },

  methods: {

    getCanvas() {
      return document.querySelector(`#${this.canvasId}`)
    },

    async setContext() {
      let canvas = this.getCanvas();
      this.context = this.context ? this.context : canvas.getContext('2d');
      
      // await this.setBackground();
    },

    drawInitialImage() {
      if (this.initialImage && this.initialImage.length > 0) {
        this.images = [].concat(this.images, this.initialImage)
        this.redraw(true)
      }
    },

    drawAdditionalImages() {
      if (this.additionalImages && this.additionalImages.length > 0) {
        let canvas = this.getCanvas();
        this.additionalImages.forEach((watermarkObject) => {
          this.drawWatermark(canvas, this.context, watermarkObject)
        });
      }
    },

    clear() {
      this.context.clearRect(0, 0, Number(this.width), Number(this.height));
    },

    getCoordinates(event) {
      let x, y;
      if (event.touches && event.touches.length > 0) {
        let canvas = this.getCanvas();
        let rect = canvas.getBoundingClientRect();
        x = (event.touches[0].clientX - rect.left);
        y = (event.touches[0].clientY - rect.top);
      } else {
        x = event.offsetX;
        y = event.offsetY;
      }
      return {
        x: x,
        y: y
      }
    },

    startDraw(event) {
      if (!this.lock) {
        this.drawing = true;
        let coordinate = this.getCoordinates(event);
        this.strokes = {
          type: this.eraser ? 'eraser' : 'line',
          from: coordinate,
          coordinates: [],
          color: this.eraser ? this.backgroundColor : this.color,
          width: this.lineWidth,
          lineJoin: this.lineJoin
        };
        this.guides = [];
      }
    },

    draw(event) {
      if (this.drawing) {
        if (!this.context) {
          this.setContext();
        }
        let coordinate = this.getCoordinates(event);
        if (this.eraser) {
          this.strokes.coordinates.push(coordinate);
          this.drawShape(this.context, this.strokes);
        } else {
          this.guides = [
            { x: coordinate.x, y: coordinate.y }
          ];
          this.drawGuide(true);
        }
      }
    },

    drawGuide(closingPath) {
      this.redraw(true);
      this.$nextTick(() => {
        this.context.strokeStyle = this.color;
        this.context.lineWidth = 1;
        this.context.lineJoin = this.lineJoin;
        this.context.lineCap = this.lineCap;

        this.context.beginPath();
        this.context.setLineDash([15, 15]);

        this.context.moveTo(this.strokes.from.x, this.strokes.from.y);
        this.guides.forEach((coordinate) => {
          this.context.lineTo(coordinate.x, coordinate.y);
        });

        if (closingPath) {
          this.context.closePath();
        }

        this.context.stroke();
      })
    },

    drawShape(context, strokes, closingPath) {
      context.strokeStyle = strokes.color;
      context.lineWidth = strokes.width;
      context.lineJoin = this.lineJoin;
      context.lineCap = this.lineCap;
      context.beginPath();
      context.setLineDash([]);

      context.moveTo(strokes.from.x, strokes.from.y);
      strokes.coordinates.forEach((stroke) => {
        context.lineTo(stroke.x, stroke.y);
      });

      context.stroke();
    },

    stopDraw() {
      if (this.drawing) {
        this.strokes.coordinates = this.guides.length > 0 ? this.guides : this.strokes.coordinates;
        this.images.push(this.strokes);
        this.redraw(true);
        this.drawing = false;
      }
    },

    reset() {
      if (!this.lock) {
        this.images = [];
        this.strokes = {
          type: '',
          coordinates: [],
          color: '',
          width: '',
        };
        this.guides = [];
        this.redraw(true);
      }
    },

    undo() {
      if (!this.lock) {
        let strokes = this.images.pop();
        if (strokes) {
          this.redraw(true);
        }
      }
    },

    async redraw(output) {
      this.drawAdditionalImages()
      let baseCanvas = document.createElement('canvas')
      let baseCanvasContext = baseCanvas.getContext('2d')
      baseCanvas.width = Number(this.width)
      baseCanvas.height = Number(this.height)
      
      if (baseCanvasContext) {
        this.images.forEach((stroke) => {
          if (baseCanvasContext) {
            baseCanvasContext.globalCompositeOperation = stroke.type === 'eraser' ? 'destination-out' : 'source-over'
            this.drawShape(baseCanvasContext, stroke)
          }
        })
        this.context.drawImage(baseCanvas, 0, 0, Number(this.width), Number(this.height))
      }
    },

    isEmpty() {
      return this.images.length > 0 ? false : true;
    },

    getAllStrokes() {
      return this.images;
    }
  },
}
</script>