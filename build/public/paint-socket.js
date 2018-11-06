const BRUSH_RADIUS = 5, DOODLE_DURATION = 30000,
CANVAS_COLORS = ['red', 'blue', 'green', 'purple', 'black'];

var boardEl, backgroundEl, canvasEl, ctx,
paintSocketEl, paintSocketDimensions = { width: undefined, height: undefined}, 
canvasBrushPoints, canvasColorIndex, isDrawing, isTitleDisplayed,
initialTitleDimensions = { width: undefined, height: undefined }, 
psTitleEl,
socket;

paintSocketEl = document.getElementById('paint_socket');
boardEl = document.getElementById('ps_board');
backgroundEl = document.getElementById('ps_background');
canvasEl = document.getElementById('ps_canvas');
ctx = canvasEl.getContext('2d');
psTitleEl = document.getElementById('ps_title');

function Doodle(doodleData) {
	this.color = doodleData.color;
	this.brushPoints = doodleData.brushPoints;
	this.currentBrushIndex = 0;
	this.brushes = [];
	this.boundAddBrush = AddBrush.bind(this);
	this.boundRemoveBrush = RemoveBrush.bind(this);
	
	window.requestAnimationFrame(this.boundAddBrush);
}

function AddBrush(dt) {
  this.brushes.push(new Brush(this.color, this.brushPoints[this.currentBrushIndex]));
  this.currentBrushIndex++;
  if (this.currentBrushIndex < this.brushPoints.length - 1) {
	window.requestAnimationFrame(this.boundAddBrush);
  } else {
	var _that = this;
	setTimeout(function() {
	   window.requestAnimationFrame(_that.boundRemoveBrush);
	}, DOODLE_DURATION);
  }
}

function RemoveBrush(dt) {
  this.currentBrushIndex--;	
  boardEl.removeChild(this.brushes[this.currentBrushIndex].domEl);
  if (this.currentBrushIndex > 0) {
	window.requestAnimationFrame(this.boundRemoveBrush);
  }
}

function Brush(color, brushPoint) {
	this.locX = brushPoint[0];
	this.locY = brushPoint[1];
	
	this.domEl = document.createElement("div");
	this.domEl.classList.add('ps_brush');
	this.domEl.dataset.locX = this.locX;
	this.domEl.dataset.locY = this.locY;
	this.domEl.style.backgroundColor = color;
	this.domEl.style.transform = BrushElTransformValue(this.locX, this.locY);
	
	boardEl.appendChild(this.domEl);
}

function BrushElTransformValue(locX, locY) {
	return "translate(" + ((locX - BRUSH_RADIUS) % paintSocketDimensions.width) + "px, " + ((locY - BRUSH_RADIUS) % paintSocketDimensions.height) + "px)";
}

/* Mouse Event Handlers */

function CanvasMouseDownHandler(event) {
	canvasEl.addEventListener('mousemove', CanvasMouseMoveHandler);
	document.addEventListener('mouseup', DocumentMouseUpHandler);
	
	backgroundEl.classList.add('visible');
	
	var newCanvasColorIndex;
	
	while(newCanvasColorIndex === undefined || newCanvasColorIndex === canvasColorIndex) {
		newCanvasColorIndex = Math.floor(Math.random() * CANVAS_COLORS.length);
	}
	
	canvasColorIndex = newCanvasColorIndex;
	
	canvasBrushPoints = [];
}

function CanvasMouseMoveHandler(event) {
	var matchingBrushPoints = canvasBrushPoints.filter(function(brushPoint) {
		return (brushPoint[0] === event.offsetX && brushPoint[1] ===  event.offsetY)
	});
	
	if (matchingBrushPoints.length === 0) {
		canvasBrushPoints.push([event.offsetX, event.offsetY]);
	
		ctx.fillStyle = CANVAS_COLORS[canvasColorIndex];
		ctx.beginPath();
		ctx.arc(event.offsetX, event.offsetY, BRUSH_RADIUS, 0, 2 * Math.PI);
		ctx.fill();
	}
}

function DocumentMouseUpHandler(event) {
	canvasEl.removeEventListener('mousemove', CanvasMouseMoveHandler);
	document.removeEventListener('mouseup', DocumentMouseUpHandler);
	
	SubmitCanvas();
}

/* Touch Event Handlers */

function CanvasTouchStartHandler(event) {
	event.preventDefault();
	
	if (!isDrawing) {
		isDrawing = true;
		
		var touches = event.changedTouches;
		
		canvasBrushPoints = [];
		
		canvasEl.addEventListener('touchmove', CanvasTouchMoveHandler);
		canvasEl.addEventListener('touchend', CanvasTouchEndHandler);
		canvasEl.addEventListener('touchcancel', CanvasTouchEndHandler);
		
		backgroundEl.classList.add('visible');
		
		var newCanvasColorIndex;
		
		while(newCanvasColorIndex === undefined || newCanvasColorIndex === canvasColorIndex) {
			newCanvasColorIndex = Math.floor(Math.random() * CANVAS_COLORS.length);
		}
		
		canvasColorIndex = newCanvasColorIndex;
	}
}

function CanvasTouchMoveHandler(event) {
	event.preventDefault();
	
	var canvasElRect = canvasEl.getBoundingClientRect();
	
	var offsetX = event.changedTouches[0].pageX - canvasElRect.left;
	var offsetY = event.changedTouches[0].pageY - canvasElRect.top;

	var matchingBrushPoints = canvasBrushPoints.filter(function(brushPoint) {
		return (brushPoint[0] === offsetX && brushPoint[1] === offsetY)
	});
	
	if (matchingBrushPoints.length === 0) {
		canvasBrushPoints.push([offsetX, offsetY]);
	
		ctx.fillStyle = CANVAS_COLORS[canvasColorIndex];
		ctx.beginPath();
		ctx.arc(offsetX, offsetY, BRUSH_RADIUS, 0, 2 * Math.PI);
		ctx.fill();
	}
}

function CanvasTouchEndHandler(event) {
	event.preventDefault();
	
	if (event.touches.length === 0) {
		canvasEl.removeEventListener('touchmove', CanvasTouchMoveHandler);
		canvasEl.removeEventListener('touchend', CanvasTouchEndHandler);
		canvasEl.removeEventListener('touchcancel', CanvasTouchEndHandler);
		
		SubmitCanvas();
	}
}

/* Functions used by Event Handlers */

function SubmitCanvas() {
	backgroundEl.classList.remove('visible');
	
	ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
	
	if (canvasBrushPoints.length) {
		socket.emit('submit', {color: CANVAS_COLORS[canvasColorIndex], brushPoints: canvasBrushPoints});
	}
	
	isDrawing = false;
}

function WindowResizeHandler() {
	
	// store updated container dimensions
	paintSocketDimensions = {
		width : paintSocketEl.clientWidth,
		height : paintSocketEl.clientHeight
	}
	
	// handle canvas size
	canvasEl.width = paintSocketDimensions.width;
	canvasEl.height = paintSocketDimensions.height;
	
	// handle brushes
	var brushesEls = boardEl.querySelectorAll('.ps_brush');
	if (brushesEls && brushesEls.length > 0) {
		brushesEls.forEach(function(brushEl) {
			brushEl.style.transform = BrushElTransformValue(parseInt(brushEl.dataset.locX), parseInt(brushEl.dataset.locY));
		});
	}

	// handle title
	if (isTitleDisplayed) {
		var scale;

		if ((paintSocketDimensions.height / paintSocketDimensions.width) > (initialTitleDimensions.height / initialTitleDimensions.width)) {
			scale = paintSocketDimensions.width / initialTitleDimensions.width;
		} else {
			scale = paintSocketDimensions.height  / initialTitleDimensions.height;
		}
		
		psTitleEl.style.transform = "scale(" + scale + ")";
		psTitleEl.style.top = (0 + (initialTitleDimensions.height * (scale - 1) / 2)) + 'px';
		psTitleEl.style.left = ((paintSocketDimensions.width - initialTitleDimensions.width) / 2) + 'px';
	}
}

function Init() {
	isTitleDisplayed = true;
	
	initialTitleDimensions.width = psTitleEl.clientWidth;
	initialTitleDimensions.height = psTitleEl.clientHeight;
}

function BindEventHandlers() {
	window.addEventListener('resize', WindowResizeHandler);
	
	canvasEl.addEventListener('mousedown', CanvasMouseDownHandler);
	canvasEl.addEventListener('touchstart', CanvasTouchStartHandler);
	
	socket.on('publish', function(doodleData) {
		var newDoodle = new Doodle(doodleData);
	});
}

window.onload = function() {
  socket = io('/paint-socket');
  socket.on('connect', function(data) {
		Init();
	  BindEventHandlers();
	  
	  WindowResizeHandler();
	  psTitleEl.classList.add('open'); 
	  
	  setTimeout(function() {
		   psTitleEl.classList.remove('open');
		   isTitleDisplayed = false;
		}, DOODLE_DURATION);
  });
}