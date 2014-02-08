/* global Snap */

'use strict';

var DartsUi = function (element) {
  this.element = element;
  this.s = new Snap(this.element);
};

DartsUi.prototype.draw = function() {
  var border = this.s.circle(101, 101, 100);
  border.attr({
    fill: '#000',
    stroke: '#ccc',
    strokeWidth: 1
  });
};
