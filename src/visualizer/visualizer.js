import Eleven from '../core';

Eleven.fn.extend({
  visualize(){
    this.visualizer = new Visualizer(this);
  },
  /**
   * Returns the visualizer DOM Element and the instance
   * @param  {String} String containing either 'DOM' or 'instance'
   * @return {Array}  containing the container DOM element and instance
   */
  getVisualizer(property){
    if(this.visualizer[property]){
      return this.visualizer[property]
    }

    return this.visualizer;
  }
});

/*------------------------------------
 * Visualization
 ------------------------------------*/

function Curve(opt){
  opt = opt || {};
  this.controller = opt.controller;
  this.color = opt.color;
  this.tick = 0;
  this.respawn();
}

Eleven.apply(Curve.prototype, {
  respawn(){
    this.amplitude = .3 + Math.random() * .7;
    this.seed = Math.random();
    this.openClass = 2 + (Math.random()*3)|0;
  },

  equation(i){
    var p = this.tick,
        y = -1 * Math.abs(Math.sin(p)) * this.controller.amplitude * this.amplitude * this.controller.MAX * Math.pow(1 / (1 + Math.pow(this.openClass * i, 2)), 2);

    if(Math.abs(y) < 0.001){
      this.respawn();
    }

    return y;
  },

  paint(m){
    const context = this.controller.context;
    const width = this.controller.width;
    const xBase = width / 2 + (-width / 4 + this.seed * (width / 2) );
    const yBase = this.controller.height / 2;
    var x, y, xInitial, i = -3;

    this.tick += this.controller.speed * (1 - .5 * Math.sin(this.seed * Math.PI));

    context.beginPath();

    while(i <= 3){
      x = xBase + i * width / 4;
      y = yBase + (m * this.equation(i));
      xInitial = xInitial || x;

      context.lineTo(x, y);

      i += .01;
    }

    const h = Math.abs(this.equation(0));
    const gradient = context.createRadialGradient(xBase, yBase, h * 1.15, xBase, yBase, h * .3);
    const color = this.color.join(',');

    gradient.addColorStop(0, `rgba(${color}, .4)`);
    gradient.addColorStop(1, `rgba(${color}, .2)`);
    // set gradient
    context.fillStyle = gradient;
    // add glow
    context.shadowColor = `rgba(${color}, .8)`;
    context.shadowBlur = 50;

    context.lineTo(xInitial, yBase);
    context.closePath();
    context.fill();
  },

  draw(){
    this.paint(-1);
    this.paint(1);
  }
});

function Visualizer(config){
  const options = {
    height: 140,
    ratio: 2,
    wavesContainer: '.waves',
    width: 280
  };

  this.container = config.container;
  this.curves = [];
  this.tick = 0;
  this.run = false;
  this.cover = options.cover || true;
  this.ratio = options.ratio || window.devicePixelRatio || 1.2;
  this.width = this.ratio * (options.width || 320);
  this.height = this.ratio * (options.height || 100);
  this.MAX = this.height / 2;
  this.speed = .08;
  this.amplitude = .7;

  this.speedInterpolationSpeed = 0.005;
  this.amplitudeInterpolationSpeed = 0.05;

  this.interpolation = {
    speed: this.speed,
    amplitude: this.amplitude
  };

  this.canvas = document.createElement('canvas');
  this.canvas.width = this.width;
  this.canvas.height = this.height;

  if(options.cover){
    this.canvas.style.width = this.canvas.style.height = '100%';
  }else{
    this.canvas.style.width = (this.width / this.ratio) + 'px';
    this.canvas.style.height = (this.height / this.ratio) + 'px';
  };

  this.wavesContainer = this.container.querySelector(options.wavesContainer);

  this.wavesContainer.appendChild(this.canvas);

  this.context = this.canvas.getContext('2d');

  for(var i = 0; i < this.colors.length; i++){
    var color = this.colors[i];

    for(var j = 0; j < (3 * Math.random())|0; j++){
      this.curves.push(new Curve({
        controller: this,
        color: color
      }));
    }
  }
}

Eleven.apply(Visualizer.prototype, {
  colors: [
    [32, 133, 252],
    [94, 252, 169],
    [253, 71, 103]
  ],

  clear(){
    this.context.globalCompositeOperation = 'destination-out';
    this.context.fillRect(0, 0, this.width, this.height);
    this.context.globalCompositeOperation = 'lighter';
  },

  interpolate(propertyStr){
    var increment = this[ propertyStr + 'InterpolationSpeed' ];

    if(Math.abs(this.interpolation[propertyStr] - this[propertyStr]) <= increment){
      this[propertyStr] = this.interpolation[propertyStr];
    }else{
      if(this.interpolation[propertyStr] > this[propertyStr]){
        this[propertyStr] += increment;
      }else{
        this[propertyStr] -= increment;
      }
    }
  },

  paint(){
    for(var i = 0, k = this.curves.length; i < k; i++){
      this.curves[i].draw();
    }
  },

  startDrawCycle(){
    if(this.run === false){
      return;
    }

    this.clear();

    this.interpolate('amplitude');
    this.interpolate('speed');

    this.paint();
    this.phase = (this.phase + Math.PI * this.speed) % (2 * Math.PI);

    if(window.requestAnimationFrame){
      window.requestAnimationFrame(this.startDrawCycle.bind(this));
    }else{
      setTimeout(this.startDrawCycle.bind(this), 20);
    }
  },

  setAmplitude(value){
    this.interpolation.amplitude = Math.max(Math.min(value, 1), 0);
  },

  setSpeed(value){
    this.interpolation.speed = value;
  },

  start(){
    this.tick = 0;
    this.run = true;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.container.classList.add('ready');
    this.wavesContainer.parentNode.classList.add('speaking');
    this.canvas.classList.add('fadein');

    this.startDrawCycle();
  },

  stop(){
    this.tick = 0;
    this.run = false;
    this.container.classList.remove('ready');
    this.wavesContainer.parentNode.classList.remove('speaking');
    this.canvas.classList.remove('fadein')
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
});

export default Eleven;
