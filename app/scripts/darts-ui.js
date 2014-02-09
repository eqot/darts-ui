/* global Snap */

'use strict';

var DartsUi = function (element) {
  this.element = element;
  this.s = new Snap(this.element);

  this.centerX = 301;
  this.centerY = 301;
  this.radius = 300;
};

DartsUi.prototype.draw = function() {
  var border = this.s.circle(this.centerX, this.centerY, this.radius);
  border.attr({
    fill: '#000',
    stroke: '#ccc',
    strokeWidth: 1
  });

  var doubleRings = this.drawRing(this.radius * 0.75, 20, '#f00', '#00f');
};

DartsUi.prototype.drawRing = function(radius, strokeWidth, color0, color1) {
  var rings = [];
  for (var i = 0; i < 20; i++) {
    var angle0 = (i * 18 - 9) * Math.PI / 180;
    var angle1 = (i * 18 + 9) * Math.PI / 180;
    var x0 = this.centerX + radius * Math.sin(angle0);
    var y0 = this.centerY - radius * Math.cos(angle0);
    var x1 = this.centerX + radius * Math.sin(angle1);
    var y1 = this.centerY - radius * Math.cos(angle1);
    var ring = this.s.path("M" + x0 + " " + y0 + " A" + radius + " " + radius + " 0 0 1 " + x1 + " " + y1);
    ring.attr({
      stroke: ((i & 1) === 0) ? color0 : color1,
      strokeWidth: strokeWidth
    });

    rings.push(ring);
  }

  return rings;
};
