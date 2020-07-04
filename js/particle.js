var particleController = (function(enums) {
	var ctx;
	function Particle(x, y, r, vx, vy, mass, color, leftWall, rightWall, upperWall, lowerWall, metaData) {
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;
		this.r = r;
		this.mass = mass;
		this.count = 0;
		this.color = color;
		this.leftWall = leftWall;
		this.rightWall = rightWall;
		this.upperWall = upperWall;
		this.lowerWall = lowerWall;
		this.metaData = metaData;
	}
	Particle.prototype.move = function(dt) {
		this.x += this.vx * dt;
		this.y += this.vy * dt;
	}
	Particle.prototype.draw = function() {
		ctx.beginPath();
		// ctx.arc(this.x, this.y, this.r, 0 , 2 * Math.PI);
		ctx.arc(this.x, this.y, this.r, 0 , 2 * Math.PI);
		ctx.fillStyle = this.color;
		ctx.fill();
	}
	Particle.prototype.timeToHit = function(thatParticle) {
		if (this == thatParticle) return enums.Number.MAX_SAFE_INTEGER;
		var dx = thatParticle.x - this.x, dy = thatParticle.y - this.y;
		var dvx = thatParticle.vx - this.vx, dvy = thatParticle.vy - this.vy;
		var dvdr = dx * dvx + dy * dvy;
		if (dvdr > 0) return enums.Number.MAX_SAFE_INTEGER;
		var dvdv = dvx * dvx + dvy * dvy;
		var drdr = dx * dx + dy * dy;
		var sigma = this.r + thatParticle.r;
		var d = (dvdr * dvdr) - dvdv * (drdr - sigma * sigma);
		if (d < 0) return enums.Number.MAX_SAFE_INTEGER;
		var ans = -(dvdr + Math.sqrt(d)) / dvdv;
		if (ans < 0) {
			return Number.MAX_SAFE_INTEGER;
		}
		// return Math.max(ans, 1);
		return ans;
	}

	Particle.prototype.timeToHitVerticalWall = function() {
		if (this.vx == 0) 		return enums.Number.MAX_SAFE_INTEGER;
		else if (this.vx < 0) 	return (this.leftWall - this.x + this.r) / this.vx;
		else 					return (this.rightWall - this.x - this.r) / this.vx;
	}
	Particle.prototype.timeToHitHorizontalWall = function() {
		if (this.vy == 0) 		return enums.Number.MAX_SAFE_INTEGER;
		else if (this.vy < 0) 	return (this.upperWall - this.y + this.r) / this.vy;
		else 				return (this.lowerWall - this.y - this.r) / this.vy;
	}
	Particle.prototype.bounceOff = function(thatParticle) {
		var dx = thatParticle.x - this.x, dy = thatParticle.y - this.y;
		var dvx = thatParticle.vx - this.vx, dvy = thatParticle.vy - this.vy;
		var dvdr = dx * dvx + dy * dvy;
		var dist = this.r + thatParticle.r;
		var J = 2 * this.mass * thatParticle.mass * dvdr / ((this.mass + thatParticle.mass) * dist);
		var Jx = J * dx / dist;
		var Jy = J * dy / dist;
		this.vx += Jx / this.mass;
		this.vy += Jy / this.mass;
		thatParticle.vx -= Jx / thatParticle.mass;
		thatParticle.vy -= Jy / thatParticle.mass;
		// this.vx = Math.max(-10, Math.min(10, this.vx));
		// this.vy = Math.max(-10, Math.min(10, this.vy));
		// thatParticle.vx = Math.max(-10, Math.min(10, thatParticle.vx));
		// thatParticle.vy = Math.max(-10, Math.min(10, thatParticle.vy));
		this.count++;
		thatParticle.count++;
	}
	Particle.prototype.bounceOffVerticalWall = function() {
		this.vx = -this.vx;
		this.count++;
	}
	Particle.prototype.updateMass = function(mass) {
		this.mass = mass;
	}
	Particle.prototype.updateRadius = function(r) {
		this.r = r;
		if (this.x - this.r <= this.leftWall) this.x = this.leftWall + this.r + 1;
		if (this.x + this.r >= this.rightWall) this.x = this.rightWall - this.r - 1;
		if (this.y - this.r <= this.upperWall) this.y = this.upperWall + this.r + 1;
		if (this.y + this.r >= this.lowerWall) this.y = this.lowerWall - this.r - 1;
	}
	Particle.prototype.updateVelocity = function(vrms) {
		var currVrms = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
		this.vx = (this.vx / currVrms) * vrms;
		this.vy = (this.vy / currVrms) * vrms;
	}
	Particle.prototype.updateRightWall = function(w) {
		this.rightWall = w;
	}
	Particle.prototype.updateLeftWall = function(w) {
		this.leftWall = w;
	}
	Particle.prototype.updateUpperWall = function(w) {
		this.upperWall = w;
	}
	Particle.prototype.updateLowerWall = function(w) {
		this.lowerWall = w;
	}

	Particle.prototype.bounceOffHorizontalWall = function() {
		this.vy = -this.vy;
		this.count++;
	}
	Particle.prototype.getCount = function() {
		return this.count;
	}
	function init(canvasContext) {
		ctx = canvasContext;
	}

	return {
		Particle: Particle,
		init: init
	}
})(enums);