var eventController = (function(enums, particleController) {
	function Event(t, particle1, particle2, divided) {
		this.particle1 = particle1;
		this.particle2 = particle2;
		this.t = t;
		this.count1 = particle1 == null ? -1 : particle1.getCount();
		this.count2 = particle2 == null ? -1 : particle2.getCount();
	}

	Event.prototype.compareTo = function(thatEvent) {
		return this.t - thatEvent.t;
	}

	Event.prototype.isValid = function() {
		if (this.particle1 != null && this.particle1.getCount() != this.count1) return false;
        if (this.particle2 != null && this.particle2.getCount() != this.count2) return false;
        return true;
	}

	return {
		Event: Event
	}
})(enums, particleController);