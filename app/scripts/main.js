/* global DartsUi */

'use strict';

function main () {
  var dartsUi = new DartsUi('#darts-ui');

  // dartsUi.focus(13, '1-o');
  // dartsUi.blur(13, '1-o');
  // dartsUi.focus(13, '1-i');
  // dartsUi.focus(13, '2');
  // dartsUi.focus(13, '3');

  // dartsUi.calibrate();

  dartsUi.onHit(function (cellId, point, ratio) {
    console.log(cellId + ' : ' + point + ' x ' + ratio + ' = ' + point * ratio);
  });
}
