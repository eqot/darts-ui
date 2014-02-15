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

  this.rows = [
    '2', '1-o', '3', '1-i'
  ];

  this.cellsMap = {
    144 : '1-1-o', 148 : '1-1-i', 149 : '1-3', 150 : '1-2',
    65 : '2-1-o', 66 : '2-1-i', 67 : '2-3', 81 : '2-2',
    85 : '3-2', 33 : '3-1-o', 34 : '3-1-i', 35 : '3-3',
    176 : '4-1-o', 178 : '4-1-i', 180 : '4-3', 182 : '4-2',
    97 : '5-3', 98 : '5-1-i', 101 : '5-1-o', 118 : '5-2',
    162 : '6-3', 163 : '6-1-i', 164 : '6-1-o', 117 : '6-2',
    1 : '7-3', 2 : '7-1-i', 5 : '7-1-o', 86 : '7-2',
    16 : '8-1-o', 17 : '8-1-i', 21 : '8-3', 22 : '8-2',
    64 : '9-1-o', 68 : '9-1-i', 69 : '9-3', 70 : '9-2',
    145 : '10-1-o', 146 : '10-3', 147 : '10-1-i', 116 : '10-2',
    32 : '11-1-o', 36 : '11-1-i', 37 : '11-3', 38 : '11-2',
    96 : '12-1-o', 99 : '12-1-i', 100 : '12-3', 102 : '12-2',
    112 : '13-2', 177 : '13-3', 179 : '13-1-i', 181 : '13-1-o',
    48 : '14-1-o', 52 : '14-1-i', 53 : '14-3', 54 : '14-2',
    129 : '15-1-o', 130 : '15-3', 131 : '15-1-i', 113 : '15-2',
    0 : '16-1-o', 3 : '16-1-i', 4 : '16-3', 6 : '16-2',
    49 : '17-1-o', 50 : '17-1-i', 51 : '17-3', 84 : '17-2',
    160 : '18-1-o', 161 : '18-1-i', 165 : '18-3', 166 : '18-2',
    18 : '19-1-i', 19 : '19-3', 20 : '19-1-o', 80 : '19-2',
    128 : '20-1-o', 132 : '20-1-i', 133 : '20-3', 134 : '20-2',
    83 : 'bull-o', 115 : 'bull-i'
  };

  this.focusClass = 'darts-focus';
  this.focusedCell = null;
  this.selectedClass = 'darts-selected';
  this.selectedCell = null;

  this.cells = {};
  this.draw();

  this.dartsAddon = new DartsAddon();

  this.calibrate();
};

DartsUi.prototype.draw = function() {
  // this.dartsUi = this.s.g().attr({class: 'darts-ui'});
  this.dartsUi = this.s.g();

  var base = this.drawCircle('darts-base', 'base', this.radius);
  this.dartsUi.append(base);

  var doubleRings  = this.drawRings('darts-cell darts-high-ring', '2',   this.radius * 0.75, this.radius * 0.04);
  var singleRingsO = this.drawRings('darts-cell darts-single',    '1-o', this.radius * 0.60, this.radius * 0.25);
  var tripleRings  = this.drawRings('darts-cell darts-high-ring', '3',   this.radius * 0.45, this.radius * 0.04);
  var singleRingsI = this.drawRings('darts-cell darts-single',    '1-i', this.radius * 0.25, this.radius * 0.35);
  this.dartsUi.append(doubleRings);
  this.dartsUi.append(singleRingsO);
  this.dartsUi.append(tripleRings);
  this.dartsUi.append(singleRingsI);

  var OuterBull = this.drawCircle('darts-cell darts-bull darts-bull-outer', 'bull-o', this.radius * 0.1);
  var BullsEye  = this.drawCircle('darts-cell darts-bull darts-bull-inner', 'bull-i', this.radius * 0.05);
  this.dartsUi.append(OuterBull);
  this.dartsUi.append(BullsEye);

  var points = this.drawPoints('darts-point', this.radius * 0.9, this.radius * 0.1, '#fff');
  this.dartsUi.append(points);

  var that = this;
  this.dartsUi.click(function (event) {
    var id = event.target.id;
    if (that.checkClass(that.cells[id].attr(), that.selectedClass)) {
      that.removeClass(that.cells[id].attr(), that.selectedClass);
      that.selectedCell = null;
    } else {
      that.addClass(that.cells[id].attr(), that.selectedClass);
      that.selectedCell = id;
    }
  });
};

DartsUi.prototype.drawRings = function(className, key, radius, strokeWidth) {
  // var rings = this.s.g().attr({class: className});
  var rings = this.s.g();

  for (var i = 0; i < 20; i++) {
    var angle0 = (i * 18 - 9) * Math.PI / 180;
    var angle1 = (i * 18 + 9) * Math.PI / 180;
    var x0 = this.centerX + radius * Math.sin(angle0);
    var y0 = this.centerY - radius * Math.cos(angle0);
    var x1 = this.centerX + radius * Math.sin(angle1);
    var y1 = this.centerY - radius * Math.cos(angle1);
    var ring = this.s.path('M' + x0 + ' ' + y0 + ' A' + radius + ' ' + radius + ' 0 0 1 ' + x1 + ' ' + y1);
    ring.attr({
      // class: 'darts-cell darts-ring',
      class: className,
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
    class: className,
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
  var cellId = row ? column + '-' + row : column;
  if (cellId) {
    var cell = this.cells[cellId];
    this.addClass(cell, this.focusClass);
    this.focusedCell = cellId;
  }
};

DartsUi.prototype.blur = function(column, row) {
  var cellId = !column ? this.focusedCell : row ? column + '-' + row : column;
  if (cellId) {
    var cell = this.cells[cellId];
    this.removeClass(cell, this.focusClass);
  }
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

DartsUi.prototype.calibrate = function() {
  if (!this.dartsAddon.isEnable) {
    return;
  }

  var that = this;
  this.dartsAddon.setListener(function (data) {
    // console.log(data);

    var cellId = that.cellsMap[data];
    if (cellId !== undefined) {
      that.blur();
      that.focus(cellId);
    } else {
      if (that.selectedCell !== null) {
        that.cellsMap[data] = that.selectedCell;
        that.showCalibrationData();
      }
    }
  });
};

DartsUi.prototype.showCalibrationData = function() {
  var maps = [];
  for (var key in this.cellsMap) {
    maps.push(key + ' : \'' + this.cellsMap[key] + '\'');
  }
  console.log(maps.join(', '));
};

var DartsAddon = function () {
  DartsAddon.addon = document.dartsduino;
  if (DartsAddon.addon) {
    // console.log('dartsAddon has been enabled.');

    DartsAddon.addon.open('/dev/cu.usbserial-A90ZF59T');
    DartsAddon.start();

    this.isEnable = true;
  } else {
    // console.log('dartsAddon is not detected.');

    this.isEnable = false;
  }
};

DartsAddon.prototype.read = function (timeout) {
  return DartsAddon.addon.readSerial(null, timeout);
};

DartsAddon.start = function() {
  DartsAddon.addon.readSerial(function (data) {
    if (data !== -1) {
      if (DartsAddon.listener) {
        DartsAddon.listener(data);
      }
    }
  }, 10);

  setTimeout(DartsAddon.start, 100);
};

DartsAddon.prototype.setListener = function(listener) {
  DartsAddon.listener = listener;
};
