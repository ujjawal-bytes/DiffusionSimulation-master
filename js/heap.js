function HeapOfEvents() {
	this.heap = [null];
    this.destroyed = false;
}
HeapOfEvents.prototype.peek = function() {
	if (this.isEmpty()) {
		return null;
	}
	return this.heap[1];
}
HeapOfEvents.prototype.add = function(event) {
    if (this.destroyed) {
        return;
    }
	this.heap.push(event);
	this.swim(this.size());
}
HeapOfEvents.prototype.remove = function() {
	if (this.isEmpty()) {
		return null;
	}
    window.swap(this.heap, 1, this.size());
    this.heap.pop();
    this.sink(1);
}
HeapOfEvents.prototype.size = function() {
	return (this.heap.length - 1);
}
HeapOfEvents.prototype.isEmpty = function() {
	return (this.size() <= 0);
}
HeapOfEvents.prototype.sink = function(idx) {
	if (idx <= 0 || idx >= this.size()) {
        return;
    }
    var c1 = idx * 2, c2 = idx * 2 + 1;
    if (c2 <= this.size()) {
        if (this.heap[c1].compareTo(this.heap[idx]) < 0 && this.heap[c1].compareTo(this.heap[c2]) <= 0) {
        	window.swap(this.heap, idx, c1);
            this.sink(c1);
        } else if (this.heap[c2].compareTo(this.heap[idx]) < 0 && this.heap[c2].compareTo(this.heap[c1]) < 0) {
        	window.swap(this.heap, idx, c2);
            this.sink(c2);
        }
    } else if (c1 <= this.size()) {

        if (this.heap[c1].compareTo(this.heap[idx]) < 0) {
        	window.swap(this.heap, idx, c1);
            this.sink(c1);
        }
    }
}
HeapOfEvents.prototype.destroy = function() {
    this.destroyed = true;
    this.heap = [null];
}
HeapOfEvents.prototype.swim = function(idx) {
	if (idx <= 1 || idx > this.size()) {
        return;
    }
    var p = Math.floor(idx / 2);
    if (this.heap[idx].compareTo(this.heap[p]) < 0) {
        window.swap(this.heap, idx, p);
        this.swim(p);
    }
}