var enums = {
	canvas: {
		width: 800,
		height: 400,
		wallWidth: 4
	},
	timeouts: {
		redrawInterval: 20 // ms
	},
	particle: {
		DEFAULTS: {
			M: 28,
			R: 150,
			K: 300,
			N: 30,
			MAX: {
				M: 32,
				R: 250,
				K: 500,
				N: 200
			},
			MIN: {
				M: 4,
				R: 50,
				K: 50,
				N: 10
			},
			STEP: {
				M: 1,
				R: 5,
				K: 50,
				N: 10
			}
		},
		LEFT_PARTICLE_COLOR: "#6eecfb",
		RIGHT_PARTICLE_COLOR: "#eb6441"
	},
	Number: {
		MAX_SAFE_INTEGER: 1000000000
	}
}