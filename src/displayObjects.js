// function intersects(bullet, enemy) {
//   return (bullet.x - bullet.w / 2 <= (enemy.x + enemy.w / 2) &&
//           enemy.x - enemy.w / 2 <= (bullet.x + bullet.w / 2) &&
//           bullet.y + bullet.h / 2 >= (enemy.y - enemy.h / 2) &&
//           enemy.y + enemy.h / 2 >= (bullet.y - bullet.h / 2));
// }
//
// class Emitter {
//
// }
//
// class Shooter {
//
// }
//
// class Enemy {
//
// }

// class Strand {
//   constructor(i) {
//     i = i || {};
//     this.x = i.x || 0;
//     this.y = i.y || 0;
//     this.z = i.z || 0;
//
//     this.amp = i.amp || 30;
//
//     this.numPoints = i.numPoints || 250;
//     this.spreadArray = new Float32Array(this.numPoints);
//     this.heightArray = new Uint8Array(this.numPoints);
//     this.heightOffsets = new Array(this.numPoints);
//
//     this.pipi = Math.PI * 2;
//     for (var j = 0; j < this.numPoints; j++) {
//       this.spreadArray[j] = 0.5 * Math.sin(j / this.pipi) * (j / this.numPoints * 2 - 1); // make clipspace positions (???)
//       this.heightOffsets[j] = 15 * Math.sin(j / this.pipi);
//       // this.heightArray[j] = 50 + (10 * Math.sin(j/this.pipi));
//     }
//
//     this.arrays = {
//       spread: {data: this.spreadArray, numComponents: 1},
//       height: {data: this.heightArray, numComponents: 1, drawType: gl.DYNAMIC_DRAW},
//     }
//
//     this.shiftAmt = i.shiftAmt || Math.PI / 45;
//     this.startingShift = i.startingShift || 0;
//     this.currentShift = this.pipi * this.startingShift;
//
//     this.bufferInfo = twgl.createBufferInfoFromArrays(gl, this.arrays);
//   }
//
//   update(dT) {
//     this.currentShift += this.shiftAmt;
//     if (Math.abs(this.currentShift) >= this.pipi) {
//       this.currentShift = 0;
//     }
//     for (var i = 0; i < this.numPoints; i++) {
//       this.heightArray[i] = this.y + (this.amp * Math.sin((i/this.pipi) + this.currentShift));
//       this.heightArray[i] += this.heightOffsets[i];
//     }
//   }
//
//   render(dT) {
//     gl.lineWidth(2);
//     twgl.setAttribInfoBufferFromArray(gl, this.bufferInfo.attribs.a_height, this.heightArray);
//     twgl.setBuffersAndAttributes(gl, programInfo, this.bufferInfo);
//     twgl.drawBufferInfo(gl, this.bufferInfo, gl.LINE_LOOP);
//   }
// }
