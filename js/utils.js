window.swap = function(arr, i, j) {
	var t = arr[i];
	arr[i] = arr[j];
	arr[j] = t;
}