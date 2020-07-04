var appController = (function(enums, viewController, simulator) {
	function sleep(t) {
		return new Promise(function(resolve, reject) {
			timer = setTimeout(function() {
				resolve();
			}, t);
		});
	}
	function setupListeners() {
		viewController.domElements.LEFT_INCREMENTER('number').addEventListener('click', function() {
			try {
				var e = viewController.domElements.LEFT_INPUT('number');
				simulator.addItemsToLeft(enums.particle.DEFAULTS.STEP.N);
				e.value = (+e.value) + enums.particle.DEFAULTS.STEP.N;
			} catch (err) {
				console.log(err);
			}
		});
		viewController.domElements.LEFT_DECREMENTER('number').addEventListener('click', function() {
			try {
				var e = viewController.domElements.LEFT_INPUT('number');
				simulator.removeItemsFromLeft(enums.particle.DEFAULTS.STEP.N);
				e.value = (+e.value) - enums.particle.DEFAULTS.STEP.N;
			} catch (err) {
				console.log(err);
			}
		});

		viewController.domElements.RIGHT_INCREMENTER('number').addEventListener('click', function() {
			try {
				var e = viewController.domElements.RIGHT_INPUT('number');
				simulator.addItemsToRight(enums.particle.DEFAULTS.STEP.N);
				e.value = (+e.value) + enums.particle.DEFAULTS.STEP.N;
			} catch(err) {
				console.log(err);
			}
		});
		viewController.domElements.RIGHT_DECREMENTER('number').addEventListener('click', function() {
			try {
				var e = viewController.domElements.RIGHT_INPUT('number');
				simulator.removeItemsFromRight(enums.particle.DEFAULTS.STEP.N);
				e.value = (+e.value) - enums.particle.DEFAULTS.STEP.N;
			} catch(err) {
				console.log(err);
			}
		});



		

		viewController.domElements.LEFT_INCREMENTER('mass').addEventListener('click', function() {
			try {
				var e = viewController.domElements.LEFT_INPUT('mass');
				simulator.updateLeftMass((+e.value) + enums.particle.DEFAULTS.STEP.M);
				e.value = (+e.value) + enums.particle.DEFAULTS.STEP.M;
			} catch (err) {
				console.log(err);
			}
		});
		viewController.domElements.LEFT_DECREMENTER('mass').addEventListener('click', function() {
			try {
				var e = viewController.domElements.LEFT_INPUT('mass');
				simulator.updateLeftMass((+e.value) - enums.particle.DEFAULTS.STEP.M);
				e.value = (+e.value) - enums.particle.DEFAULTS.STEP.M;
			} catch (err) {
				console.log(err);
			}
		});

		viewController.domElements.RIGHT_INCREMENTER('mass').addEventListener('click', function() {
			try {
				var e = viewController.domElements.RIGHT_INPUT('mass');
				simulator.updateRightMass((+e.value) + enums.particle.DEFAULTS.STEP.M);
				e.value = (+e.value) + enums.particle.DEFAULTS.STEP.M;
			} catch(err) {
				console.log(err);
			}
		});
		viewController.domElements.RIGHT_DECREMENTER('mass').addEventListener('click', function() {
			try {
				var e = viewController.domElements.RIGHT_INPUT('mass');
				simulator.updateRightMass((+e.value) - enums.particle.DEFAULTS.STEP.M);
				e.value = (+e.value) - enums.particle.DEFAULTS.STEP.M;
			} catch(err) {
				console.log(err);
			}
		});





		viewController.domElements.LEFT_INCREMENTER('radius').addEventListener('click', function() {
			try {
				var e = viewController.domElements.LEFT_INPUT('radius');
				simulator.updateLeftRadius((+e.value) + enums.particle.DEFAULTS.STEP.R);
				e.value = (+e.value) + enums.particle.DEFAULTS.STEP.R;
			} catch(err) {
				console.log(err);
			}
		});
		viewController.domElements.LEFT_DECREMENTER('radius').addEventListener('click', function() {
			try {
				var e = viewController.domElements.LEFT_INPUT('radius');
				simulator.updateLeftRadius((+e.value) - enums.particle.DEFAULTS.STEP.R);
				e.value = (+e.value) - enums.particle.DEFAULTS.STEP.R;
			} catch(err) {
				console.log(err);
			}
		});

		viewController.domElements.RIGHT_INCREMENTER('radius').addEventListener('click', function() {
			try {
				var e = viewController.domElements.RIGHT_INPUT('radius');
				simulator.updateRightRadius((+e.value) + enums.particle.DEFAULTS.STEP.R);
				e.value = (+e.value) + enums.particle.DEFAULTS.STEP.R;
			} catch(err) {

			}
		});
		viewController.domElements.RIGHT_DECREMENTER('radius').addEventListener('click', function() {
			try {
				var e = viewController.domElements.RIGHT_INPUT('radius');
				simulator.updateRightRadius((+e.value) - enums.particle.DEFAULTS.STEP.R);
				e.value = (+e.value) - enums.particle.DEFAULTS.STEP.R;
			} catch(err) {
				console.log(err);
			}
		});




		viewController.domElements.LEFT_INCREMENTER('temp').addEventListener('click', function() {
			try {
				var e = viewController.domElements.LEFT_INPUT('temp');
				simulator.updateLeftTemperature((+e.value) + enums.particle.DEFAULTS.STEP.K);
				e.value = (+e.value) + enums.particle.DEFAULTS.STEP.K;
			} catch (err) {
				console.log(err);
			}
		});
		viewController.domElements.LEFT_DECREMENTER('temp').addEventListener('click', function() {
			try {
				var e = viewController.domElements.LEFT_INPUT('temp');
				simulator.updateLeftTemperature((+e.value) - enums.particle.DEFAULTS.STEP.K);
				e.value = (+e.value) - enums.particle.DEFAULTS.STEP.K;
			} catch(err) {
				console.log(err);
			}
		});

		viewController.domElements.RIGHT_INCREMENTER('temp').addEventListener('click', function() {
			try {
				var e = viewController.domElements.RIGHT_INPUT('temp');
				simulator.updateRightTemperature((+e.value) + enums.particle.DEFAULTS.STEP.K);
				e.value = (+e.value) + enums.particle.DEFAULTS.STEP.K;
			} catch(err) {
				console.log(err);
			}
		});
		viewController.domElements.RIGHT_DECREMENTER('temp').addEventListener('click', function() {
			try {
				var e = viewController.domElements.RIGHT_INPUT('temp');
				simulator.updateRightTemperature((+e.value) - enums.particle.DEFAULTS.STEP.K);
				e.value = (+e.value) - enums.particle.DEFAULTS.STEP.K;
			} catch(err) {
				console.log(err);
			}
		});








		viewController.domElements.REMOVE_DIVIDER.addEventListener('click', function() {
			try {
				simulator.removeDivider();
				viewController.removeDivider();
			} catch(err) {
				console.log(err);
			}
		});

		viewController.domElements.RESET_DIVIDER.addEventListener('click', function() {
			try {
				simulator.resetDivider();
				viewController.resetDivider();
			} catch(err) {
				console.log(err);
			}
		});



		viewController.domElements.PAUSER.addEventListener('click', function() {
			try {
				simulator.pause();
				viewController.pause();
			} catch(err) {
				console.log(err);
			}
		});

		viewController.domElements.RESUMER.addEventListener('click', function() {
			try {
				simulator.resume();
				viewController.resume();
			} catch(err) {
				console.log(err);
			}
		});


		viewController.domElements.ITERATOR.addEventListener('click', function() {
			try {
				simulator.resumeForShortTime();
			} catch(err) {
				console.log(err);
			}
		})
	}




	async function init() {
		viewController.init();
		setTimeout(function() {
			// simulator.init(viewController.domElements.CANVAS(), enums.particle.DEFAULTS.N, enums.particle.DEFAULTS.M, enums.particle.DEFAULTS.R, enums.particle.DEFAULTS.K, function(centreOfMass, leftFlow, rightFlow) {
			// 	viewController.update(centreOfMass, leftFlow, rightFlow);
			// });

			setupListeners();


			simulator.init(viewController.domElements.CANVAS(), function(leftData, rightData) {
				viewController.update(leftData, rightData);
			});

			simulator.simulate();
		}, 100);
	}
	return {
		init: init
	}
})(enums, viewController, simulator);