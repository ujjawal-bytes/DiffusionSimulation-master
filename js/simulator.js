var simulator = (function(enums, particleController, eventController, physics, units) {
	var ctx, ML, RL, KL, MR, RR, KR;
	var pq;
	var t;
	var leftParticles, rightParticles;
	var timer = null, iteratorCallback = function() {};
	var divided = true, initialized = false;
	var paused = false;
	function predict(particle, particles, otherParticles) {
		if (particle == null) {
			return;
		}
		for (var i = 0 ; i < particles.length ; i++) {
			var dt = particle.timeToHit(particles[i]);
			if (dt < enums.Number.MAX_SAFE_INTEGER && dt > 0) {
				var e = new eventController.Event(t + dt, particle, particles[i]);
				pq.add(e);
			}
		}
		if (!divided) {
			for (var i = 0 ; i < otherParticles.length ; i++) {
				var dt = particle.timeToHit(otherParticles[i]);
				if (dt < enums.Number.MAX_SAFE_INTEGER && dt > 0) {
					var e = new eventController.Event(t + dt, particle, otherParticles[i]);
					pq.add(e);
				}
			}
		}
		
		dt = particle.timeToHitVerticalWall();
		if (dt < enums.Number.MAX_SAFE_INTEGER && dt > 0) {
			var e = new eventController.Event(t + dt, particle, null);
			pq.add(e);
		}
		dt = particle.timeToHitHorizontalWall();
		if (dt < enums.Number.MAX_SAFE_INTEGER && dt > 0) {
			var e = new eventController.Event(t + dt, null, particle);
			pq.add(e);
		}
	}

	function sleep(t) {
		return new Promise(function(resolve, reject) {
			timer = setTimeout(function() {
				resolve();
			}, t);
		});
	}

	function redraw() {
		return new Promise(async function(resolve, reject) {
			try {
				ctx.clearRect(0, 0, enums.canvas.width, enums.canvas.height);
				if (divided) {
					ctx.beginPath();
					ctx.moveTo(enums.canvas.width / 2, 0);
					ctx.lineTo(enums.canvas.width / 2, enums.canvas.height);
					ctx.lineWidth = enums.canvas.wallWidth;
					ctx.strokeStyle = "green";
					ctx.stroke();
				} else {
					ctx.beginPath();
					ctx.moveTo(enums.canvas.width / 2, 0);
					ctx.lineTo(enums.canvas.width / 2, enums.canvas.height);
					ctx.lineWidth = 0.5;
					ctx.strokeStyle = "rgba(59, 255, 0, 0.7)";
					ctx.stroke();
				}
				for (var i = 0 ; i < leftParticles.length ; i++) {
			 		leftParticles[i].draw();
				}
				for (var i = 0 ; i < rightParticles.length ; i++) {
			 		rightParticles[i].draw();
				}
				await sleep(enums.timeouts.redrawInterval);
				pq.add(new eventController.Event(t + 1, null, null));
				resolve();
			} catch (err) {
				console.error(err);
			}
		});
	}




	async function simulate() {
		if (!initialized) {
			throw new Error("Simulator should be initialized first");
			return;
		}
		t = 0;
		pq = new HeapOfEvents();
		var tempLeftData = {
			totalX: 0,
			totalLeftFlow: 0,
			totalRightFlow: 0,
			leftMovingLen: 0,
			rightMovingLen: 0,
			leftLen: 0,
			rightLen: 0
		};
		var tempRightData = {
			totalX: 0,
			totalLeftFlow: 0,
			totalRightFlow: 0,
			leftMovingLen: 0,
			rightMovingLen: 0,
			leftLen: 0,
			rightLen: 0
		};
		for (var i = 0 ; i < leftParticles.length ; i++) {
			predict(leftParticles[i], leftParticles, rightParticles);
			tempLeftData.totalX += leftParticles[i].x;
			if (leftParticles[i].vx < 0) {
				tempLeftData.totalLeftFlow -= leftParticles[i].vx;
				tempLeftData.leftMovingLen++;
			} else if (leftParticles[i].vx > 0) {
				tempLeftData.totalRightFlow += leftParticles[i].vx;
				tempLeftData.rightMovingLen++;
			}

			if (leftParticles[i].x < enums.canvas.width / 2) {
				tempLeftData.leftLen++;
			} else {
				tempLeftData.rightLen++;
			}
		}
		for (var i = 0 ; i < rightParticles.length ; i++) {
			predict(rightParticles[i], rightParticles, leftParticles);
			tempRightData.totalX += rightParticles[i].x;
			if (rightParticles[i].vx < 0) {
				tempRightData.totalLeftFlow -= rightParticles[i].vx;
				tempRightData.leftMovingLen++;
			} else if (rightParticles[i].vx > 0) {
				tempRightData.totalRightFlow += rightParticles[i].vx;
				tempRightData.rightMovingLen++;
			}

			if (rightParticles[i].x < enums.canvas.width / 2) {
				tempRightData.leftLen++;
			} else {
				tempRightData.rightLen++;
			}
		}
		iteratorCallback({
			centerOfMass: tempLeftData.totalX / leftParticles.length,
			leftFlowRate: (tempLeftData.totalLeftFlow / tempLeftData.leftMovingLen) * units.framesInOneSecond(),
			rightFlowRate: (tempLeftData.totalRightFlow / tempLeftData.rightMovingLen) * units.framesInOneSecond(),
			leftLen: tempLeftData.leftLen,
			rightLen: tempLeftData.rightLen
		}, {
			centerOfMass: tempRightData.totalX / rightParticles.length,
			leftFlowRate: (tempRightData.totalLeftFlow / tempRightData.leftMovingLen) * units.framesInOneSecond(),
			rightFlowRate: (tempRightData.totalRightFlow / tempRightData.rightMovingLen) * units.framesInOneSecond(),
			leftLen: tempRightData.leftLen,
			rightLen: tempRightData.rightLen
		});
		pq.add(new eventController.Event(0, null, null));
		while (!pq.isEmpty()) {
			if (paused) {
				await sleep(enums.timeouts.redrawInterval * 2);
				continue;
			}

			var e = pq.peek();
			pq.remove();
			if (!e.isValid()) continue;

			tempLeftData = {
				totalX: 0,
				totalLeftFlow: 0,
				totalRightFlow: 0,
				leftMovingLen: 0,
				rightMovingLen: 0,
				leftLen: 0,
				rightLen: 0
			};
			tempRightData = {
				totalX: 0,
				totalLeftFlow: 0,
				totalRightFlow: 0,
				leftMovingLen: 0,
				rightMovingLen: 0,
				leftLen: 0,
				rightLen: 0
			};

			var p1 = e.particle1;
			var p2 = e.particle2;
			totalLength = leftLen = rightLen = totalLeftFlow = totalRightFlow = 0;
			for (var i = 0 ; i < leftParticles.length ; i++) {
				leftParticles[i].move(e.t - t);
				tempLeftData.totalX += leftParticles[i].x;
				if (leftParticles[i].vx < 0) {
					tempLeftData.totalLeftFlow -= leftParticles[i].vx;
					tempLeftData.leftMovingLen++;
				} else if (leftParticles[i].vx > 0) {
					tempLeftData.totalRightFlow += leftParticles[i].vx;
					tempLeftData.rightMovingLen++;
				}

				if (leftParticles[i].x < enums.canvas.width / 2) {
					tempLeftData.leftLen++;
				} else {
					tempLeftData.rightLen++;
				}
			}
			for (var i = 0 ; i < rightParticles.length ; i++) {
				rightParticles[i].move(e.t - t);
				tempRightData.totalX += rightParticles[i].x;
				if (rightParticles[i].vx < 0) {
					tempRightData.totalLeftFlow -= rightParticles[i].vx;
					tempRightData.leftMovingLen++;
				} else if (rightParticles[i].vx > 0) {
					tempRightData.totalRightFlow += rightParticles[i].vx;
					tempRightData.rightMovingLen++;
				}

				if (rightParticles[i].x < enums.canvas.width / 2) {
					tempRightData.leftLen++;
				} else {
					tempRightData.rightLen++;
				}
			}

			t = e.t;

			if      (p1 != null && p2 != null) p1.bounceOff(p2);              
            else if (p1 != null && p2 == null) p1.bounceOffVerticalWall();   
            else if (p1 == null && p2 != null) p2.bounceOffHorizontalWall();
            else if (p1 == null && p2 == null) await redraw();
            

            if (p1 != null && p1.metaData.isLeft) predict(p1, leftParticles, rightParticles);
            else if (p1 != null && !p1.metaData.isLeft) predict(p1, rightParticles, leftParticles);

            if (p2 != null && p2.metaData.isLeft) predict(p2, leftParticles, rightParticles);
            else if (p2 != null && !p2.metaData.isLeft) predict(p2, rightParticles, leftParticles);

            iteratorCallback({
				centerOfMass: tempLeftData.totalX / leftParticles.length,
				leftFlowRate: (tempLeftData.totalLeftFlow / tempLeftData.leftMovingLen) * units.framesInOneSecond(),
				rightFlowRate: (tempLeftData.totalRightFlow / tempLeftData.rightMovingLen) * units.framesInOneSecond(),
				leftLen: tempLeftData.leftLen,
				rightLen: tempLeftData.rightLen
			}, {
				centerOfMass: tempRightData.totalX / rightParticles.length,
				leftFlowRate: (tempRightData.totalLeftFlow / tempRightData.leftMovingLen) * units.framesInOneSecond(),
				rightFlowRate: (tempRightData.totalRightFlow / tempRightData.rightMovingLen) * units.framesInOneSecond(),
				leftLen: tempRightData.leftLen,
				rightLen: tempRightData.rightLen
			});
		}
	}

	

	function getLeftParticle(vrms) {
		var r = units.picoToPx(RL);
		var m = ML;
		var x = Math.floor(Math.random() * ((enums.canvas.width / 2 - enums.canvas.wallWidth / 2) - 2 * r) + r);
		var y = Math.floor(Math.random() * (enums.canvas.height - 2 * r) + r);
		var angle = units.degreeToPi(Math.random() * 360);
		var vx = vrms * Math.cos(angle), vy = vrms * Math.sin(angle);
		
		return new particleController.Particle(x, y, r, vx, vy, m, enums.particle.LEFT_PARTICLE_COLOR, 0, (enums.canvas.width / 2 - enums.canvas.wallWidth / 2), 0, enums.canvas.height, {
			isLeft: true
		});
	}

	function getRightParticle(vrms) {
		var r = units.picoToPx(RR);
		var m = MR;
		var x = (enums.canvas.width / 2 + enums.canvas.wallWidth / 2) + Math.floor(Math.random() * ((enums.canvas.width / 2 - enums.canvas.wallWidth / 2) - 2 * r) + r);
		var y = Math.floor(Math.random() * (enums.canvas.height - 2 * r) + r);
		var angle = units.degreeToPi(Math.random() * 360);
		var vx = vrms * Math.cos(angle), vy = vrms * Math.sin(angle);
		
		return new particleController.Particle(x, y, r, vx, vy, m, enums.particle.RIGHT_PARTICLE_COLOR, (enums.canvas.width / 2 + enums.canvas.wallWidth / 2), enums.canvas.width, 0, enums.canvas.height, {
			isLeft: false
		});
	}

	function init(canvas, callback) {
		initialized = true;
		ctx = canvas.getContext("2d");
		particleController.init(ctx);
		ML = enums.particle.DEFAULTS.M;
		RL = enums.particle.DEFAULTS.R;
		KL = enums.particle.DEFAULTS.K;
		MR = enums.particle.DEFAULTS.M;
		RR = enums.particle.DEFAULTS.R;
		KR = enums.particle.DEFAULTS.K;
		iteratorCallback = callback || iteratorCallback;
		leftParticles = [], rightParticles = [];

		// var vrms = units.getVelocityInPxPerFrame(physics.getVelocity(KL, ML));
		// for (var i = 0 ; i < enums.particle.DEFAULTS.N ; i++) {
		// 	leftParticles.push(getLeftParticle(vrms));
		// }

		_addItemsToLeft(enums.particle.DEFAULTS.N);
		_addItemsToRight(enums.particle.DEFAULTS.N);

		// vrms = units.getVelocityInPxPerFrame(physics.getVelocity(KR, MR));
		// for (var i = 0 ; i < enums.particle.DEFAULTS.N ; i++) {
		// 	rightParticles.push(getRightParticle(vrms));
		// }
	}
	function clearTimer(timer) {
		if (!timer) return;
		clearTimeout(timer);
		timer = null;
	}

	function clear() {
		pq.destroy();
	}


	async function restart() {
		clear();
		await sleep(enums.timeouts.redrawInterval * 2);
		simulate();
	}

	function _addItemsToLeft(n) {
		if (!divided) {
			return;
		}
		if (typeof(n) != 'number') {
			throw new Error("Number of Particles should be a natural number.");
			return;
		}
		if (leftParticles.length + n > enums.particle.DEFAULTS.MAX.N) {
			throw new Error("Number of particles is not in range");
			return;
		}
		var vrms = units.getVelocityInPxPerFrame(physics.getVelocity(KL, ML));
		for (var i = 0 ; i < n ; i++) {
			leftParticles.push(getLeftParticle(vrms));
		}
	}


	function addItemsToLeft(n) {
		_addItemsToLeft(n);
		restart();
	}

	function _removeItemsFromLeft(n) {
		if (!divided) {
			return;
		}
		if (typeof(n) != 'number') {
			throw new Error("Number of Particles should be a natural number.");
			return;
		}
		if (leftParticles.length - n < enums.particle.DEFAULTS.MIN.N) {
			throw new Error("Number of particles is not in range");
			return;
		}
		for (var i = 0 ; i < n ; i++) {
			leftParticles.pop();
		}
	}

	function removeItemsFromLeft(n) {
		_removeItemsFromLeft(n);
		restart();
	}


	function _updateLeftMass(m) {
		if (!divided) {
			return;
		}
		if (typeof(m) != 'number') {
			throw new Error("Mass should be a natural number.");
			return;
		}
		if (m < enums.particle.DEFAULTS.MIN.M || m > enums.particle.DEFAULTS.MAX.M) {
			throw new Error("Invalid value of mass.");
			return;
		}
		ML = m;
		var vrms = units.getVelocityInPxPerFrame(physics.getVelocity(KL, ML));
		for (var i = 0 ; i < leftParticles.length ; i++) {
			leftParticles[i].updateMass(m);
			leftParticles[i].updateVelocity(vrms);
		}
	}

	function updateLeftMass(m) {
		_updateLeftMass(m);
		restart();
	}


	function _updateLeftTemperature(k) {
		if (!divided) {
			return;
		}
		if (typeof(k) != 'number') {
			throw new Error("Temperature should be a natural number.");
			return;
		}
		if (k < enums.particle.DEFAULTS.MIN.K || k > enums.particle.DEFAULTS.MAX.K) {
			throw new Error("Invalid value of Temperature.");
			return;
		}
		KL = k;
		var vrms = units.getVelocityInPxPerFrame(physics.getVelocity(KL, ML));
		for (var i = 0 ; i < leftParticles.length ; i++) {
			leftParticles[i].updateVelocity(vrms);
		}
	}

	function updateLeftTemperature(k) {
		_updateLeftTemperature(k);
		restart();
	}


	function _updateLeftRadius(r) {
		if (!divided) {
			return;
		}
		if (typeof(r) != 'number') {
			throw new Error("Radius should be a natural number.");
			return;
		}
		if (r < enums.particle.DEFAULTS.MIN.R || r > enums.particle.DEFAULTS.MAX.R) {
			throw new Error("Invalid value of Radius.");
			return;
		}
		RL = r;
		for (var i = 0 ; i < leftParticles.length ; i++) {
			leftParticles[i].updateRadius(units.picoToPx(RL));
		}
	}
	function updateLeftRadius(r) {
		_updateLeftRadius(r);
		restart();
	}


	function _addItemsToRight(n) {
		if (!divided) {
			return;
		}
		if (typeof(n) != 'number') {
			throw new Error("Number of Particles should be a natural number.");
			return;
		}
		if (rightParticles.length + n > enums.particle.DEFAULTS.MAX.N) {
			throw new Error("Number of particles is not in range");
			return;
		}
		var vrms = units.getVelocityInPxPerFrame(physics.getVelocity(KR, MR));
		for (var i = 0 ; i < n ; i++) {
			rightParticles.push(getRightParticle(vrms));
		}
	}

	function addItemsToRight(n) {
		_addItemsToRight(n);
		restart();
	}

	function _removeItemsFromRight(n) {
		if (!divided) {
			return;
		}
		if (typeof(n) != 'number') {
			throw new Error("Number of Particles should be a natural number.");
			return;
		}
		if (rightParticles.length - n < enums.particle.DEFAULTS.MIN.N) {
			throw new Error("Number of particles is not in range");
			return;
		}
		for (var i = 0 ; i < n ; i++) {
			rightParticles.pop();
		}
	}

	function removeItemsFromRight(n) {
		_removeItemsFromRight(n);
		restart();
	}


	function _updateRightMass(m) {
		if (!divided) {
			return;
		}
		if (typeof(m) != 'number') {
			throw new Error("Mass should be a natural number.");
			return;
		}
		if (m < enums.particle.DEFAULTS.MIN.M || m > enums.particle.DEFAULTS.MAX.M) {
			throw new Error("Invalid value of mass.");
			return;
		}
		MR = m;
		var vrms = units.getVelocityInPxPerFrame(physics.getVelocity(KR, MR));
		for (var i = 0 ; i < rightParticles.length ; i++) {
			rightParticles[i].updateMass(m);
			rightParticles[i].updateVelocity(vrms);
		}
	}

	function updateRightMass(m) {
		_updateRightMass(m);
		restart();
	}


	function _updateRightTemperature(k) {
		if (!divided) {
			return;
		}
		if (typeof(k) != 'number') {
			throw new Error("Temperature should be a natural number.");
			return;
		}
		if (k < enums.particle.DEFAULTS.MIN.K || k > enums.particle.DEFAULTS.MAX.K) {
			throw new Error("Invalid value of Temperature.");
			return;
		}
		KR = k;
		var vrms = units.getVelocityInPxPerFrame(physics.getVelocity(KR, MR));
		for (var i = 0 ; i < rightParticles.length ; i++) {
			rightParticles[i].updateVelocity(vrms);
		}
	}

	function updateRightTemperature(k) {
		_updateRightTemperature(k);
		restart();
	}

	function _updateRightRadius(r) {
		if (!divided) {
			return;
		}
		if (typeof(r) != 'number') {
			throw new Error("Radius should be a natural number.");
			return;
		}
		if (r < enums.particle.DEFAULTS.MIN.R || r > enums.particle.DEFAULTS.MAX.R) {
			throw new Error("Invalid value of Radius.");
			return;
		}
		RR = r;
		for (var i = 0 ; i < rightParticles.length ; i++) {
			rightParticles[i].updateRadius(units.picoToPx(RR));
		}
	}

	function updateRightRadius(r) {
		_updateRightRadius(r);
		restart();
	}


	function _removeDivider() {
		if (!divided) {
			return;
		}
		divided = false;
		for (var i = 0 ; i < leftParticles.length ; i++) {
			leftParticles[i].updateRightWall(enums.canvas.width);
		}

		for (var i = 0 ; i < rightParticles.length ; i++) {
			rightParticles[i].updateLeftWall(0);
		}
	}

	function removeDivider() {
		_removeDivider();
		restart();
	}

	function _resetDivider() {
		if (divided) {
			return;
		}
		divided = true;
		var nl = leftParticles.length;
		var nr = rightParticles.length;
		leftParticles = [];
		rightParticles = [];
		_addItemsToLeft(nl);
		_addItemsToRight(nr);
	}

	function resetDivider() {
		_resetDivider();
		restart();
	}


	function resumeForShortTime(callback) {
		if (!paused) {
			return;
		}
		callback = callback || function() {};
		paused = false;

		setTimeout(function() {
			paused = true;
			callback();
		}, enums.timeouts.redrawInterval * 5);
	}

	function pause() {
		paused = true;
	}

	function resume() {
		paused = false;
	}

	return {
		init: init,
		simulate: simulate,
		restart: restart,
		pause: pause,
		addItemsToLeft: addItemsToLeft,
		removeItemsFromLeft: removeItemsFromLeft,
		updateLeftMass: updateLeftMass,
		updateLeftRadius: updateLeftRadius,
		updateLeftTemperature: updateLeftTemperature,
		addItemsToRight: addItemsToRight,
		removeItemsFromRight: removeItemsFromRight,
		updateRightMass: updateRightMass,
		updateRightRadius: updateRightRadius,
		updateRightTemperature: updateRightTemperature,
		removeDivider: removeDivider,
		resetDivider: resetDivider,
		resumeForShortTime: resumeForShortTime,
		pause: pause,
		resume: resume
	}
})(enums, particleController, eventController, physics, units);