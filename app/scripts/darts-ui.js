/* global Snap */

'use strict';

var DartsUi = function (element) {
  this.element = element;
  this.s = new Snap(this.element);

  this.centerX = 320;
  this.centerY = 320;
  this.radius  = 300;

  this.points = [
    20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5
  ];

  this.focusClass = 'darts-focus';
  this.selectedClass = 'darts-selected';

  this.cells = {};
  this.draw();

  this.dartsAddon = new DartsAddon();
};

DartsUi.prototype.draw = function() {
  this.dartsUi = this.s.g().attr({class: 'darts-ui'});

  var base         = this.drawCircle('darts-base',                     'base', this.radius);
  this.dartsUi.append(base);

  var doubleRings  = this.drawRings('darts-double darts-high-ring',    '2',   this.radius * 0.75, this.radius * 0.04);
  var singleRingsO = this.drawRings('darts-single darts-single-outer', '1-o', this.radius * 0.60, this.radius * 0.25);
  var tripleRings  = this.drawRings('darts-triple darts-high-ring',    '3',   this.radius * 0.45, this.radius * 0.04);
  var singleRingsI = this.drawRings('darts-single darts-single-inner', '1-i', this.radius * 0.25, this.radius * 0.35);
  this.dartsUi.append(doubleRings);
  this.dartsUi.append(singleRingsO);
  this.dartsUi.append(tripleRings);
  this.dartsUi.append(singleRingsI);

  var OuterBull    = this.drawCircle('darts-bull darts-bull-outer',    'bull-o', this.radius * 0.1);
  var BullsEye     = this.drawCircle('darts-bull darts-bull-inner',    'bull-i', this.radius * 0.05);
  this.dartsUi.append(OuterBull);
  this.dartsUi.append(BullsEye);

  var points = this.drawPoints('darts-point', this.radius * 0.9, this.radius * 0.1, '#fff');

  var that = this;
  this.dartsUi.click(function (event) {
    var id = event.target.id;
    if (that.checkClass(that.cells[id].attr(), that.selectedClass)) {
      that.removeClass(that.cells[id].attr(), that.selectedClass);
    } else {
      that.addClass(that.cells[id].attr(), that.selectedClass);
    }
  });
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
      class: 'darts-cell darts-ring',
      strokeWidth: strokeWidth,
      id: this.points[i] + '-' + key
    });

    rings.append(ring);

    this.cells[this.points[i] + '-' + key] = ring;
  }

  return rings;
};

DartsUi.prototype.drawCircle = function(className, key, radius) {
  var bull = this.s.circle(this.centerX, this.centerY, radius);
  bull.attr({
    class: className + ' darts-cell',
    id: key
  });

  this.cells[key] = bull;

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
  this.addClass(cell, this.focusClass);
};

DartsUi.prototype.blur = function(column, row) {
  var cell = this.cells[column + '-' + row];
  this.removeClass(cell, this.focusClass);
};

DartsUi.prototype.addClass = function(cell, klass) {
  var classNames = cell.attr('class').split(' ');
  if (classNames.indexOf(klass) === -1) {
    classNames.push(klass);
    cell.attr({
      class: classNames.join(' ')
    });
  }
};

DartsUi.prototype.removeClass = function(cell, klass) {
  var classNames = cell.attr('class').split(' ');
  var index = classNames.indexOf(klass);
  if (index !== -1) {
    classNames.splice(index, 1);
    cell.attr({
      class: classNames.join(' ')
    });
  }
};

DartsUi.prototype.checkClass = function(cell, klass) {
  var classNames = cell.attr('class').split(' ');
  if (classNames.indexOf(klass) === -1) {
    return false;
  } else {
    return true;
  }
};

var DartsAddon = function () {
  this.dartsduinoAddon = document.dartsduino;
  if (this.dartsduinoAddon) {
    // console.log('dartsAddon has been enabled.');
  } else {
    // console.log('dartsAddon is not detected.');
  }
};
