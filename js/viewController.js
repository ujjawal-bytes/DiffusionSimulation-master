var viewController = (function(enums, units) {
	var domElements = (function() {
		return {
			CONTAINER: document.getElementById("container"),
			CANVAS_CONTAINER: document.getElementById("canvasContainer"),
			CANVAS: function() {
				return document.getElementById("canvas");
			},
			LEFT_INPUT: function(entity) {
				return document.getElementById("left_" + entity);
			},
			RIGHT_INPUT: function(entity) {
				return document.getElementById("right_" + entity);
			},
			LEFT_INCREMENTER: function(entity) {
				return document.getElementById("left_" + entity + "_incrementer");
			},
			LEFT_DECREMENTER: function(entity) {
				return document.getElementById("left_" + entity + "_decrementer");
			},
			RIGHT_INCREMENTER: function(entity) {
				return document.getElementById("right_" + entity + "_incrementer");
			},
			RIGHT_DECREMENTER: function(entity) {
				return document.getElementById("right_" + entity + "_decrementer");
			},
			SCALE: document.getElementById("scale"),
			LEFT_STRIP: document.getElementById("left_strip"),
			RIGHT_STRIP: document.getElementById("right_strip"),
			REMOVE_DIVIDER: document.getElementById("remove_divider"),
			RESET_DIVIDER: document.getElementById("reset_divider"),
			ENTITY_CONTAINER: document.getElementById("entity_container"),
			FUNCTIONALITY_CONTAINER: document.getElementById("functionality_container"),
			PAUSER: document.getElementById("pause"),
			RESUMER: document.getElementById("resume"),
			ITERATOR: document.getElementById("iterator")
		}
	})();
	function createCanvas(width, height) {
		var canvas = document.createElement("CANVAS");
		canvas.classList.add("canvas");
		canvas.setAttribute("width", "" + width);
		canvas.setAttribute("height", "" + height);
		canvas.setAttribute("id", "canvas");
		canvas.innerText = "Your browser does not support HTML5 Canvas tag";
		// canvas.innerHTML = 'Your browser does not support HTML5 Canvas tag<div id="strip" class="strip" ></div>';
		domElements.CANVAS_CONTAINER.appendChild(canvas);
	}

	function updateLeftRightColors() {
		
		var elems = document.getElementsByClassName("left-circle");
		for (var i = 0 ; i < elems.length ; i++) {
			elems[i].style.backgroundColor = enums.particle.LEFT_PARTICLE_COLOR;
		}
		elems = document.getElementsByClassName("right-circle");
		for (var i = 0 ; i < elems.length ; i++) {
			elems[i].style.backgroundColor = enums.particle.RIGHT_PARTICLE_COLOR;
		}
		var leftStrips = document.querySelectorAll(".left-strip");
		var rightStrips = document.querySelectorAll(".right-strip");
		for (var i = 0 ; i < leftStrips.length ; i++) {
			leftStrips[i].style.backgroundColor = enums.particle.LEFT_PARTICLE_COLOR;
		}
		for (var i = 0 ; i < rightStrips.length ; i++) {
			rightStrips[i].style.backgroundColor = enums.particle.RIGHT_PARTICLE_COLOR;
		}

		var left1 = document.querySelectorAll('.left-flow .left');
		var left2 = document.querySelectorAll('.left-flow .right');
		var right1 = document.querySelectorAll('.right-flow .left');
		var right2 = document.querySelectorAll('.right-flow .right');

		for (var i = 0 ; i < left1.length ; i++) {
			left1[i].style.backgroundColor = enums.particle.LEFT_PARTICLE_COLOR;
		}
		for (var i = 0 ; i < left2.length ; i++) {
			left2[i].style.backgroundColor = enums.particle.LEFT_PARTICLE_COLOR;
		}
		for (var i = 0 ; i < right1.length ; i++) {
			right1[i].style.backgroundColor = enums.particle.RIGHT_PARTICLE_COLOR;
		}
		for (var i = 0 ; i < right2.length ; i++) {
			right2[i].style.backgroundColor = enums.particle.RIGHT_PARTICLE_COLOR;
		}

		left1 = document.querySelectorAll('.left-flow .left .before');
		left2 = document.querySelectorAll('.left-flow .right .before');
		right1 = document.querySelectorAll('.right-flow .left .before');
		right2 = document.querySelectorAll('.right-flow .right .before');

		for (var i = 0 ; i < left1.length ; i++) {
			left1[i].style.borderRightColor = enums.particle.LEFT_PARTICLE_COLOR;
		}
		for (var i = 0 ; i < left2.length ; i++) {
			left2[i].style.borderLeftColor = enums.particle.LEFT_PARTICLE_COLOR;
		}
		for (var i = 0 ; i < right1.length ; i++) {
			right1[i].style.borderRightColor = enums.particle.RIGHT_PARTICLE_COLOR;
		}
		for (var i = 0 ; i < right2.length ; i++) {
			right2[i].style.borderLeftColor = enums.particle.RIGHT_PARTICLE_COLOR;
		}

		
	}

	function drawScale() {
		var n = units.pxToNano(enums.canvas.width);
		var unitWidth = enums.canvas.width / 16;
		var innerHTML = '';
		for (var i = 0 ; i < 16 ; i++) {
			innerHTML += '<div class="unit" style="width: ' + (unitWidth - 1) + 'px;" >'
			if (i == 0) {
				innerHTML += '<div class="mid-line" >&larr;1nm&rarr;</div>';
			}
			innerHTML += '</div>'
		}
		domElements.SCALE.innerHTML = innerHTML;
	}


	function updateEntitiesDefaults() {
		var e1 = domElements.LEFT_INPUT("number");
		var e2 = domElements.RIGHT_INPUT("number");
		e1.value = e2.value = enums.particle.DEFAULTS.N;
		e1.setAttribute("min", enums.particle.DEFAULTS.MIN.N);
		e1.setAttribute("max", enums.particle.DEFAULTS.MAX.N);
		e1.setAttribute("step", enums.particle.DEFAULTS.STEP.N);
		e2.setAttribute("min", enums.particle.DEFAULTS.MIN.N);
		e2.setAttribute("max", enums.particle.DEFAULTS.MAX.N);
		e2.setAttribute("max", enums.particle.DEFAULTS.STEP.N);

		e1 = domElements.LEFT_INPUT("mass");
		e2 = domElements.RIGHT_INPUT("mass");
		e1.value = e2.value = enums.particle.DEFAULTS.M;
		e1.setAttribute("min", enums.particle.DEFAULTS.MIN.M);
		e1.setAttribute("max", enums.particle.DEFAULTS.MAX.M);
		e1.setAttribute("step", enums.particle.DEFAULTS.STEP.M);
		e2.setAttribute("min", enums.particle.DEFAULTS.MIN.M);
		e2.setAttribute("max", enums.particle.DEFAULTS.MAX.M);
		e2.setAttribute("max", enums.particle.DEFAULTS.STEP.M);

		e1 = domElements.LEFT_INPUT("radius");
		e2 = domElements.RIGHT_INPUT("radius");
		e1.value = e2.value = enums.particle.DEFAULTS.R;
		e1.setAttribute("min", enums.particle.DEFAULTS.MIN.R);
		e1.setAttribute("max", enums.particle.DEFAULTS.MAX.R);
		e1.setAttribute("step", enums.particle.DEFAULTS.STEP.R);
		e2.setAttribute("min", enums.particle.DEFAULTS.MIN.R);
		e2.setAttribute("max", enums.particle.DEFAULTS.MAX.R);
		e2.setAttribute("max", enums.particle.DEFAULTS.STEP.R);


		e1 = domElements.LEFT_INPUT("temp");
		e2 = domElements.RIGHT_INPUT("temp");
		e1.value = e2.value = enums.particle.DEFAULTS.K;
		e1.setAttribute("min", enums.particle.DEFAULTS.MIN.K);
		e1.setAttribute("max", enums.particle.DEFAULTS.MAX.K);
		e1.setAttribute("step", enums.particle.DEFAULTS.STEP.K);
		e2.setAttribute("min", enums.particle.DEFAULTS.MIN.K);
		e2.setAttribute("max", enums.particle.DEFAULTS.MAX.K);
		e2.setAttribute("max", enums.particle.DEFAULTS.STEP.K);
	}

	function init() {
		createCanvas(enums.canvas.width, enums.canvas.height);
		updateLeftRightColors();
		updateEntitiesDefaults();
		drawScale();
	}
	function update(leftData, rightData) {
		domElements.LEFT_STRIP.style.left = leftData.centerOfMass;
		domElements.RIGHT_STRIP.style.left = rightData.centerOfMass;


		document.querySelector("#left-data .left-items .item-value").innerText = leftData.leftLen;
		document.querySelector("#left-data .right-items .item-value").innerText = rightData.leftLen;
		document.querySelector("#right-data .left-items .item-value").innerText = leftData.rightLen;
		document.querySelector("#right-data .right-items .item-value").innerText = rightData.rightLen;


		document.querySelector('#left_flow .left').style.width = leftData.leftFlowRate + "px";
		document.querySelector('#left_flow .right').style.width = leftData.rightFlowRate + "px";
		document.querySelector('#right_flow .left').style.width = rightData.leftFlowRate + "px";
		document.querySelector('#right_flow .right').style.width = rightData.rightFlowRate + "px";
	}
	function removeDivider() {
		domElements.CONTAINER.classList.remove('divided');
		domElements.CONTAINER.classList.add('reset');
	}
	function resetDivider() {
		domElements.CONTAINER.classList.add('divided');
		domElements.CONTAINER.classList.remove('reset');
	}

	function pause() {
		domElements.CONTAINER.classList.remove('resumed');
		domElements.CONTAINER.classList.add('paused');
	}
	function resume() {
		domElements.CONTAINER.classList.remove('paused');
		domElements.CONTAINER.classList.add('resumed');
	}
	return {
		init: init,
		domElements: domElements,
		update: update,
		removeDivider: removeDivider,
		resetDivider: resetDivider,
		pause: pause,
		resume: resume
	};
})(enums, units);