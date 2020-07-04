var units = (function(enums) {
	var BASE_SPEED_IN_METER_SECOND = 500; // this speed in m/s is equivalent to 1 px / frame
	var PX_IN_ONE_NM = 50;
	function picoToPx(pm) {
		return (PX_IN_ONE_NM * pm) / 1000;
	}
	function nanoToPx(nm) {
		return PX_IN_ONE_NM * nm;
	}
	function pxToNano(px) {
		return (px / PX_IN_ONE_NM);
	}
	function pxToPico(px) {
		return (px / PX_IN_ONE_NM) * 1000;
	}
	function framesInOneSecond() {
		return 1000 / enums.timeouts.redrawInterval;
	}
	function meterToNano(m) {
		return m * Math.pow(10, 9);
	}
	function getVelocityInPxPerFrame(v) { // v in m/s
		return v / BASE_SPEED_IN_METER_SECOND;
	}

	function degreeToPi(d) {
		return (d / 180) * Math.PI;
	}

	function slowDown() {
		return meterToNano(500) / pxToNano(framesInOneSecond() * getVelocityInPxPerFrame(BASE_SPEED_IN_METER_SECOND));
	}
	return {
		picoToPx: picoToPx,
		nanoToPx: nanoToPx,
		pxToNano: pxToNano,
		pxToPico: pxToPico,
		meterToNano: meterToNano,
		getVelocityInPxPerFrame: getVelocityInPxPerFrame,
		slowDown: slowDown,
		degreeToPi: degreeToPi,
		framesInOneSecond: framesInOneSecond
	};
})(enums);