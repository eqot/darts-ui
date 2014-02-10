/* global Snap */

'use strict';

var DartsUi = function (element) {
  this.element = element;
  this.s = new Snap(this.element);

  this.centerX = 301;
  this.centerY = 301;
  this.radius  = 300;

  this.points = [
    20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5
  ];

  this.focusClass = 'focus';

  this.cells = {};
  this.draw();
};

DartsUi.prototype.draw = function() {
  var base         = this.drawCircle('base',               this.radius);

  var doubleRings  = this.drawRings('double high-ring',    '2',   this.radius * 0.75, this.radius * 0.04);
  var singleRingsO = this.drawRings('single single-outer', '1-o', this.radius * 0.60, this.radius * 0.25);
  var tripleRings  = this.drawRings('triple high-ring',    '3',   this.radius * 0.45, this.radius * 0.04);
  var singleRingsI = this.drawRings('single single-inner', '1-i', this.radius * 0.25, this.radius * 0.35);

  var OuterBull    = this.drawCircle('bull bull-outer',    this.radius * 0.1);
  var BullsEye     = this.drawCircle('bull bull-inner',    this.radius * 0.05);

  var points = this.drawPoints('point', this.radius * 0.9, this.radius * 0.1, '#fff');
};

DartsUi.prototype.drawRings = function(className, key, radius, strokeWidth) {
  var rings = this.s.g().attr({class: className});

  for (var i = 0; i < 20; i++) {
    var angle0 = (i * 18 - 9) * Math.PI / 180;
    var angle1 = (i * 18 + 9) * Math.PI / 180;
    var x0 = this.centerX + radius * Math.sin(angle0);
    var y0 = this.centerY - radius * Math.cos(angle0);
    var x1 = this.centerX + radius * Math.sin(angle1);
    var y1 = this.centerY - radius * Math.cos(angle1);
    var ring = this.s.path('M' + x0 + ' ' + y0 + ' A' + radius + ' ' + radius + ' 0 0 1 ' + x1 + ' ' + y1);
    ring.attr({
      class: 'cell ring',
      strokeWidth: strokeWidth
    });

    rings.append(ring);

    this.cells[this.points[i] + '-' + key] = ring;
  }

  return rings;
};

DartsUi.prototype.drawCircle = function(className, radius) {
  var bull = this.s.circle(this.centerX, this.centerY, radius);
  bull.attr({
    class: className + ' cell'
  });

  return bull;
};

DartsUi.prototype.drawPoints = function(className, radius) {
  var points = this.s.g().attr({class: 'points'});

  for (var i = 0; i < 20; i++) {
    var angle = (i * 18) * Math.PI / 180;
    var x = this.centerX + radius * Math.sin(angle);
    var y = this.centerY - radius * Math.cos(angle);
    var point = this.s.text(x, y, this.points[i]);
    point.attr({
      class: className
    });
    var height = point.getBBox().height;
    point.attr({
      dy: height / 2.8
    });

    points.append(point);
  }

  return points;
};

DartsUi.prototype.focus = function(column, row) {
  var cell = this.cells[column + '-' + row];
  var className = cell.attr('class');
  cell.attr({
    class: className + ' ' + this.focusClass
  });
};

DartsUi.prototype.blur = function(column, row) {
  var cell = this.cells[column + '-' + row];
  var classNames = cell.attr('class').split(' ');
  var newClass = [];
  for (var i = 0; i < classNames.length; i++) {
    if (classNames[i] !== this.focusClass) {
      newClass.push(classNames[i]);
    }
  }
  cell.attr({
    class: newClass.join(' ')
  });
};
