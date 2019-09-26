var i2c = require('i2c-bus');
var MPU6050 = require('i2c-mpu6050');

var address = 0x68;
var i2c1 = i2c.openSync(1);
var sensor = new MPU6050(i2c1, address);

const gyroReading = () => {
    var data = sensor.readSync();
    return data.rotation.z
};

let timer = false;
let units = 0;
let stoveState = 0;
let waitTime = [0, 0];


setInterval(_ => {
    let temp = gyroReading() / 10;
    stoveState = Math.round(temp / 2) + 4;
    console.log(stoveState);

    let oldWaitTime = [...waitTime];
    waitTime.shift();
    waitTime.push(stoveState);
    if (!oldWaitTime[0] && !oldWaitTime[1]) {
        if (waitTime[0] || waitTime[1]) {
            timer = true;
        }
    } else if (!waitTime[0] && !waitTime[1]) {
        timer = false;
        console.log("units= " + units);
        units = 0;
    }

    if (timer)
        units += stoveState

}, 1000);

