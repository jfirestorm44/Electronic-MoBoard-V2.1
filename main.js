let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
canvas.width = 850;
canvas.height = 850;
let canvasBounds = canvas.getBoundingClientRect();

let mouse = {
    x: 100,
    y: 100,
    clicked: false
};
let los = {
    x: 0,
    y: 0
};
let tbo = {
    x: 0,
    y: 0
};
let showOS = document.getElementById('os');
let showTGT = document.getElementById('tgt');
let lockButton = document.getElementById('lock');
let soundSpeed = 0;
let frqr = 0;
let zeroReferenceOpp = {
    x: 425,
    y: 850
};
let vectorSelect = 0;
let interval = 1000 * 60;
let expected = Date.now() + interval;
var date = new Date();
var time = date.getUTCHours() + ':' + (date.getUTCMinutes() + 1) + ':' + date.getUTCSeconds() + 'Z';

class Moboard {
    constructor() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.speedCircles = 40;
    }
    draw() {
        ctx.strokeStyle = 'white';
        ctx.setLineDash([5, 15]);
        for (let i = 1; i <= 10; i++) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.speedCircles * i, 0, Math.PI * 2);
            ctx.closePath();
            ctx.stroke();
        }
        ctx.setLineDash([2, 20]);
        for (let i = 1; i <= 9; i++) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.speedCircles * i + 20, 0, Math.PI * 2);
            ctx.closePath();
            ctx.stroke();
        }
        ctx.setLineDash([10, 20]);
        for (let i = 0; i < 360; i += 10) {
            ctx.save();
            ctx.globalAlpha = 0.3;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + Math.cos((i - 90) * Math.PI / 180) * canvas.width / 2.05, this.y + Math.sin((i - 90) * Math.PI / 180) * canvas.height / 2.05);
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
        }
        ctx.fillStyle = 'white';
        ctx.font = '10pt serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        ctx.fillText('Electronic MoBoard v2.0', 5, canvas.height)
    }
    numbers() {
        ctx.fillStyle = 'white';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.font = '10pt serif';
        for (let i = 2; i <= 20; i += 2) {
            ctx.save();
            ctx.globalAlpha = 0.3;
            let y1 = (-i * 20) + canvas.height / 2;
            let y2 = (i * 20) + canvas.height / 2 - 15;
            ctx.fillText(i + '', this.x + 2, y1);
            ctx.fillText(i + '', this.x + 2, y2);
            ctx.restore();
        }
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        for (let i = 0; i < 360; i += 10) {
            let xCoord = (this.x + Math.cos((i - 90) * Math.PI / 180) * canvas.width / 2.05);
            let yCoord = (this.y + Math.sin((i - 90) * Math.PI / 180) * canvas.height / 2.05);
            zeroReferenceOpp.x = (this.x + Math.cos((180 - 90) * Math.PI / 180) * canvas.width / 2.05);
            zeroReferenceOpp.y = (this.y + Math.sin((180 - 90) * Math.PI / 180) * canvas.height / 2.05);
            let num = i;
            if (i.toString().length <= 2) {
                num = '0' + i;
            }
            if (i.toString().length <= 1) {
                num = '00' + i;
            }
            ctx.fillText(num, xCoord, yCoord);
        }
    }
}
let moboard = new Moboard()

class Vector {
    constructor(c, v) {
        this.pt1 = {
            x: canvas.width / 2,
            y: canvas.height / 2
        };
        this.pt2 = {
            x: 300,
            y: 300
        };
        this.color = c;
        this.crs = 0;
        this.spd = 5;
        this.lla = 0;
        this.si = 0;
        this.sa = 0;
        this.vNum = v;
        this.srm = 0;
    }
    draw() {
        ctx.setLineDash([]);
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.pt1.x, this.pt1.y);
        ctx.lineTo(this.pt2.x, this.pt2.y);
        ctx.closePath();
        ctx.stroke();
    }
    setSpeed() {
        let dx = this.pt1.x - this.pt2.x;
        let dy = this.pt1.y - this.pt2.y;
        let length = Math.hypot(dx, dy);
        this.spd = length / 10;
    }
    setCrs() {
        let distBA_x = this.pt1.x - this.pt2.x;
        let distBA_y = this.pt1.y - this.pt2.y;
        let distBC_x = this.pt1.x - zeroReferenceOpp.x;
        let distBC_y = this.pt1.y - zeroReferenceOpp.y;
        let a = Math.atan2(distBA_x * distBC_y - distBA_y * distBC_x, distBA_x * distBC_x + distBA_y * distBC_y);
        this.crs = 180 - a * (180 / Math.PI);
    }
    calcLlaCpa() {
        let distBA_x = this.pt1.x - this.pt2.x;
        let distBA_y = this.pt1.y - this.pt2.y;
        let distBC_x, distBC_y, tbo;
        tbo = Number(tboReadout.value);
        let oppX = canvas.width / 2 + 400 * Math.cos(degreesToRadians(tbo - 90));
        let oppY = canvas.height / 2 + 400 * Math.sin(degreesToRadians(tbo - 90));
        if (this.vNum === 1) {
            distBC_x = this.pt1.x - target[vectorSelect].x;
            distBC_y = this.pt1.y - target[vectorSelect].y;
        } else {
            distBC_x = this.pt1.x - oppX;
            distBC_y = this.pt1.y - oppY;
        }
        let a = Math.atan2(distBA_x * distBC_y - distBA_y * distBC_x, distBA_x * distBC_x + distBA_y * distBC_y);
        if (a < 0) {
            a = a * -1;
        }
        this.lla = a * (180 / Math.PI);
    }
    calcCrs(crs) {
        this.crs = crs;
        let l = this.spd * 10;
        let a = degreesToRadians(crs);
        let aOffset = degreesToRadians(90);
        this.pt2.x = this.pt1.x + l * Math.cos(a - aOffset);
        this.pt2.y = this.pt1.y + l * Math.sin(a - aOffset);
        this.SRM();
    }
    calcSpd(spd) {
        this.spd = spd;
        let l = this.spd * 10;
        let a = calcVectorAngle(this.pt1, this.pt2, this);
        let aOffset = degreesToRadians(90);
        this.pt2.x = this.pt1.x + l * Math.cos(a - aOffset);
        this.pt2.y = this.pt1.y + l * Math.sin(a - aOffset);
        this.SRM();
    }
    calcSiSa() {
        let a;
        if (target.length > 0) this.vNum === 1 ? a = degreesToRadians(target[vectorSelect].currentBrg - this.crs) : a = degreesToRadians(target[vectorSelect].tbo - this.crs);
        this.si = Math.cos(a) * this.spd;
        this.sa = Math.sin(a) * this.spd;
    }
    SRM() {
        if (this.vNum !== 1) {
                this.srm = calcSRM(this.pt2);
        }
    }
    update() {
        let dx = mouse.x - this.pt2.x;
        let dy = mouse.y - this.pt2.y;
        if (Math.hypot(dx, dy) < 15 && mouse.clicked) {
            this.pt2.x = mouse.x;
            this.pt2.y = mouse.y;
        }
        if (mouse.clicked) this.setCrs();
        if (!mouse.clicked) {
            if (Number(osCrsReadout.value) == 360) osCrsReadout.value = 0;
            if (Number(tgtCrsReadout.value) == 360) tgtCrsReadout.value = 0;
            if (this.vNum === 1) {
                this.crs = Number(osCrsReadout.value)
                this.calcCrs(this.crs)
            } else {
                this.crs = Number(tgtCrsReadout.value)
                this.calcSpd(this.spd)
            }
        }
        if (target.length > 0) this.calcLlaCpa();
        this.calcSiSa();
        this.SRM();
    }
}
let vector = new Vector('blue', 1);
let tgtVector = []

class Target {
    constructor(b, c, num, cNum) {
        this.x = 0;
        this.y = 0;
        this.c = c;
        this.num = num;
        this.cNum = cNum;
        this.rng = 50;
        this.brg = b;
        this.crs = tgtVector[vectorSelect].crs;
        this.spd = tgtVector[vectorSelect].spd;
        this.exRng = [0, 0, 0];
        this.exBrgR = [0, 0, 0];
        this.exBrgX = [0, 0, 0];
        this.currentBrg = 0;
        this.tbo = (this.currentBrg + 180) % 360;
        this.currentRng = 0;
        this.srm = 0;
        this.frqr = 0;
        this.frqc = 0;
        this.frqo = 0;
        this.ss = 0;
        this.timeLate = 0;
        this.legs = [];
    }
    draw() {
        ctx.setLineDash([]);
        ctx.strokeStyle = this.c;
        if (this.rng <= 80) {
            ctx.beginPath();
            ctx.moveTo(this.x - 12, this.y - 5)
            ctx.lineTo(this.x, this.y + 10)
            ctx.lineTo(this.x + 12, this.y - 5)
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(this.x, this.y)
            ctx.lineTo(this.x + 20 * Math.cos(degreesToRadians(this.crs - 90)), this.y + 20 * Math.sin(degreesToRadians(this.crs - 90)));
            ctx.stroke();
            ctx.fillStyle = this.c;
            ctx.textAlign = 'center';
            ctx.fillText(this.cNum, this.x, this.y + 30)
        } else {
            let a = degreesToRadians(this.currentBrg - 90);
            let x = canvas.width / 2 + 400 * Math.cos(a);
            let y = canvas.height / 2 + 400 * Math.sin(a);
            ctx.beginPath();
            ctx.moveTo(x - 12, y - 5)
            ctx.lineTo(x, y + 10)
            ctx.lineTo(x + 12, y - 5)
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y)
            ctx.lineTo(x + 20 * Math.cos(degreesToRadians(this.crs - 90)), y + 20 * Math.sin(degreesToRadians(this.crs - 90)));
            ctx.stroke();
        }
    }
    update() {
        this.crs = tgtVector[vectorSelect].crs;
        this.spd = tgtVector[vectorSelect].spd;
    }
    setPosition() {
        let l = this.rng * 5;
        let a = degreesToRadians(this.brg - 90);
        this.x = canvas.width / 2 + l * Math.cos(a);
        this.y = canvas.height / 2 + l * Math.sin(a);
    }
    setTimelinePosition(i) {
        if (i == 0) this.track = [];
        if (this.legs.length === 1) {
            console.log("happening 0")
            let d1 = new Date();
            let t = this.legs[0][0]
            d1.getTimezoneOffset() * 60 * 1000 < 0 ? d1.setTime(d1.getTime() - (Math.abs(d1.getTimezoneOffset() * 60 * 1000))) : d1.setTime(d1.getTime() + (d1.getTimezoneOffset() * 60 * 1000));
            let tl = (timeBetweenLegs(d1, t) / 60);
            this.brg = this.legs[0][1];
            this.rng = this.legs[0][2];
            tgtCrsReadout.value = cpaCrsReadout.value;
            spdtReadout.value = cpaSpdReadout.value;
            tgtVector[vectorSelect].calcCrs(this.legs[i][3]);
            tgtVector[vectorSelect].calcSpd(this.legs[i][4]);
            this.update();
            let l = this.rng * 5;
            let a = degreesToRadians(this.brg - 90);
            this.x = canvas.width / 2 + l * Math.cos(a);
            this.y = canvas.height / 2 + l * Math.sin(a);
            this.walkDRM(tl);
            this.updateCurrentInfo();
            this.track.push({
                x: this.x,
                y: this.y
            })
            return
        }
        if (this.legs.length > 1 && this.legs[i + 1]) {
            console.log('happening 1')
            let t1 = this.legs[i][0]
            let t2 = this.legs[i + 1][0]
            let tl = (timeBetweenLegs(t1, t2) / 60);
            if (this.legs[i][5] === 1) {
                this.brg = this.legs[i][1];
                this.rng = this.legs[i][2];
                this.setPosition();
            } else {
                this.brg = Number(this.currentBrg);
                this.rng = Number(this.currentRng);
            }
            tgtVector[vectorSelect].calcCrs(this.legs[i][3]);
            tgtVector[vectorSelect].calcSpd(this.legs[i][4]);
            this.update();
            tgtCrsReadout.value = this.crs;
            spdtReadout.value = this.spd;
            let l = this.rng * 5;
            let a = degreesToRadians(this.brg - 90);
            this.x = canvas.width / 2 + l * Math.cos(a);
            this.y = canvas.height / 2 + l * Math.sin(a);
            this.walkDRM(tl);
            this.updateCurrentInfo();
            this.track.push({
                x: this.x,
                y: this.y
            });
        } else {
            if (this.legs.length === 0) return;
            console.log('happening 2')
            let d1 = new Date();
            let t = this.legs[i][0]
            d1.getTimezoneOffset() * 60 * 1000 < 0 ? d1.setTime(d1.getTime() - (Math.abs(d1.getTimezoneOffset() * 60 * 1000))) : d1.setTime(d1.getTime() + (d1.getTimezoneOffset() * 60 * 1000));
            let tl = (timeBetweenLegs(d1, t) / 60)
            if (this.legs[i][5] === 1) {
                this.brg = this.legs[i][1];
                this.rng = this.legs[i][2];
                this.setPosition();
            } else {
                this.brg = Number(this.currentBrg);
                this.rng = Number(this.currentRng);
            }
            tgtVector[vectorSelect].calcCrs(this.legs[i][3]);
            tgtVector[vectorSelect].calcSpd(this.legs[i][4]);
            this.update();
            tgtCrsReadout.value = this.crs;
            spdtReadout.value = this.spd;
            let l = this.rng * 5;
            let a = degreesToRadians(this.brg - 90);
            this.x = canvas.width / 2 + l * Math.cos(a);
            this.y = canvas.height / 2 + l * Math.sin(a);
            this.walkDRM(tl);
            this.updateCurrentInfo();
            this.track.push({
                x: this.x,
                y: this.y
            })
        }
        if (i < this.legs.length - 1) this.setTimelinePosition(i + 1)
    }
    walkDRM(tl) {
        let relSpd = calcDist(vector.pt2, tgtVector[vectorSelect].pt2) / 10;
        let d = 5 * (relSpd * tl);
        let a;
        if (this.num === 0) {
            a = tgtVector[0].srm - degreesToRadians(90);
        } else if (this.num === 1) {
            a = tgtVector[1].srm - degreesToRadians(90);
        } else if (this.num === 2) {
            a = tgtVector[2].srm - degreesToRadians(90);
        } else if (this.num === 3) {
            a = tgtVector[3].srm - degreesToRadians(90);
        } else if (this.num === 4) {
            a = tgtVector[4].srm - degreesToRadians(90);
        } else if (this.num === 5) {
            a = tgtVector[5].srm - degreesToRadians(90);
        }
        let x = this.x;
        let y = this.y;
        this.x = x + d * Math.cos(a);
        this.y = y + d * Math.sin(a);
    }
    updatePosition() {
        let relSpd = calcDist(vector.pt2, tgtVector[vectorSelect].pt2) / 10;
        let distPerHour = relSpd * 5;
        let distPerMin = distPerHour / 60;
        let a;
        if (this.num === 0) {
            a = tgtVector[0].srm - degreesToRadians(90);
        } else if (this.num === 1) {
            a = tgtVector[1].srm - degreesToRadians(90);
        } else if (this.num === 2) {
            a = tgtVector[2].srm - degreesToRadians(90);
        } else if (this.num === 3) {
            a = tgtVector[3].srm - degreesToRadians(90);
        } else if (this.num === 4) {
            a = tgtVector[4].srm - degreesToRadians(90);
        } else if (this.num === 5) {
            a = tgtVector[5].srm - degreesToRadians(90);
        }
        let x = this.x;
        let y = this.y;
        this.x = x + distPerMin * Math.cos(a);
        this.y = y + distPerMin * Math.sin(a);
        this.updateCurrentInfo()
    }
    updateExpecteds() {
        expRngReadout0.value = this.exRng[0];
        expRngReadout1.value = this.exRng[1];
        expRngReadout2.value = this.exRng[2];
        expBrgRateReadout[0].value = this.exBrgR[0].toFixed(3);
        expBrgRateReadout[1].value = this.exBrgR[1].toFixed(3);
        expBrgRateReadout[2].value = this.exBrgR[2].toFixed(3);
        expBrgXingReadout[0].value = this.exBrgX[0].toFixed(1);
        expBrgXingReadout[1].value = this.exBrgX[1].toFixed(1);
        expBrgXingReadout[2].value = this.exBrgX[2].toFixed(1);
    }
    updateCurrentInfo() {
        let cb = calcAngleOfLine({
            x: canvas.width / 2,
            y: canvas.height / 2
        }, {
            x: this.x,
            y: this.y
        });
        this.currentBrg = cb.toFixed(1);
        this.tbo = Number(this.currentBrg) + 180;
        if (this.tbo >= 360) this.tbo -= 360;
        let dx = Math.abs(canvas.width / 2 - this.x);
        let dy = Math.abs(canvas.height / 2 - this.y);
        let dist = Math.hypot(dx, dy) / 5;
        this.currentRng = dist.toFixed(1);
    }
    sortZigs() {
        this.legs.sort(function (a, b) {
            return a[0] - b[0]
        })
    }
}

let target = []

function drawSRM() {
    ctx.setLineDash([5, 10]);
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(vector.pt2.x, vector.pt2.y);
    ctx.lineTo(tgtVector[vectorSelect].pt2.x, tgtVector[vectorSelect].pt2.y);
    ctx.closePath();
    ctx.stroke();
}

function drawDRM() {
    let a = tgtVector[vectorSelect].srm - degreesToRadians(90);
    let c = {
        x: canvas.width / 2,
        y: canvas.height / 2
    };
    let x2 = target[vectorSelect].x + 800 * Math.cos(a);
    let y2 = target[vectorSelect].y + 800 * Math.sin(a);
    let x3 = c.x + 100 * Math.cos(a);
    let y3 = c.y + 100 * Math.sin(a);
    ctx.setLineDash([5, 10]);
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(target[vectorSelect].x, target[vectorSelect].y);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.stroke();
    //position = sign((Bx - Ax) * (Y - Ay) - (By - Ay) * (X - Ax))
    let check = Math.sign((x3 - c.x) * (target[vectorSelect].y - c.y) - (y3 - c.y) * (target[vectorSelect].x - c.x));
    if (target.length > 0) calcCPA(check)
}

canvas.addEventListener("mousemove", e => {
    mouse.x = e.x - canvasBounds.x;
    mouse.y = e.y - canvasBounds.y;
})

canvas.addEventListener("mousedown", () => {
    canvasBounds = canvas.getBoundingClientRect();
    mouse.clicked = true;
    animate();
})

canvas.addEventListener("mouseup", () => {
    mouse.clicked = false;
    cancelAnimationFrame(draw);
    updateReadout()
})

showOS.addEventListener('change', () => {
    drawCPA();
})

showTGT.addEventListener('change', () => {
    drawCPA();
})

function degreesToRadians(deg) {
    return deg * Math.PI / 180;
}

function radiansToDegrees(rad) {
    return rad * 180 / Math.PI;
}

function drawCPA() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    moboard.numbers();
    moboard.draw();
    vector.update();
    if (target.length > 0) tgtVector[vectorSelect].update();
    if (target.length > 0) target[vectorSelect].update();
    for (let i = 0; i < target.length; i++) {
        target[i].draw();
    }
    if (target.length > 0 && (showOS.checked && showTGT.checked)) drawSRM();
    if (target.length > 0)
        if (target[vectorSelect].rng <= 80) drawDRM();
    if (showOS.checked) {
        vector.draw();
    }
    if (showTGT.checked) {
        if (target.length > 0) tgtVector[vectorSelect].draw()
    }
}

function step() {
    var dt = Date.now() - expected;
    if (dt > interval) {
        expected += dt;
    }
    for (let i = 0; i < target.length; i++) {
        target[i].updatePosition();
    }
    drawCPA();
    updateReadout();
    expected += interval;
    setTimeout(step, Math.max(0, interval - dt));
}
setTimeout(step, interval);

function load() {
    drawCPA();
    setReadout();
    updateReadout();
}

let draw;
function animate() {
    if (tgtVector.length > 0) updateReadout()
    drawCPA();
    draw = requestAnimationFrame(animate);
}