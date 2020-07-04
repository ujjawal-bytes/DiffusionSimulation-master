var physics = (function() {
	// Ideal Gas Constant
	var R = 8.314; // kg*m2/s2*mol*K

	// Calculate velocity using Graham's Law (urms = square root of ((3 * R * T * 1000) / M) )
	// T temperature in kelvin
	// M mass in amu
	// urms is root mean sqaure speed in m / s
	function getVelocity(T, M) {
		return Math.sqrt((3 * R * T * 1000) / M);
	}
	return {
		getVelocity: getVelocity
	};
})();