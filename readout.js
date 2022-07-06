let ctcInput = document.getElementById('ctcInput');
let ctcSelect = document.getElementById('ctcSelect');
let removeButton = document.getElementById('removeButton');
let losReadout = document.getElementById('los');
let tboReadout = document.getElementById('tbo');
let osCrsReadout = document.getElementById('CRSo');
let spdoReadout = document.getElementById('SPDo');
let soiReadout = document.getElementById('soi');
let soaReadout = document.getElementById('soa');
let llaReadout = document.getElementById('lla');
let aobReadout = document.getElementById('aob');
let tgtCrsReadout = document.getElementById('CRSt');
let spdtReadout = document.getElementById('SPDt');
let stiReadout = document.getElementById('sti');
let staReadout = document.getElementById('sta');
let sriReadout = document.getElementById('sri');
let sraReadout = document.getElementById('sra');
let ssReadout = document.getElementById('ss');
let frqoReadout = document.getElementById('FRQo');
let frqrReadout = document.getElementById('FRQr');
let frqcReadout = document.getElementById('FRQc');
let cpaTgtBrgReadout = document.getElementById('brg');
let cpaRngReadout = document.getElementById('rng');
let cpaCrsReadout = document.getElementById('crs');
let cpaSpdReadout = document.getElementById('spd');
let cpaReadout = document.getElementById('cpaBrg');
let rngAtCpaReadout = document.getElementById('cpaRng');
let timeUntilCpaReadout = document.getElementById('cpaTime');
let exBrgReadout = document.getElementById('exbrg');
let expRngReadout0 = document.getElementById('rng1');
let expRngReadout1 = document.getElementById('rng2');
let expRngReadout2 = document.getElementById('rng3');
let expBrgRateReadout = [document.getElementById('brgRate1'), document.getElementById('brgRate2'), document.getElementById('brgRate3')];
let expBrgXingReadout = [document.getElementById('brgXing1'), document.getElementById('brgXing2'), document.getElementById('brgXing3')];
let currentBrg = document.getElementById('currentBrg');
let currentRng = document.getElementById('currentRng');
let timeLate = document.getElementById('timeLate');
let ctcOptionWrap = document.getElementById("ctcSelectWrapper")
let options = ctcOptionWrap.getElementsByTagName('option');
let legOptionWrap = document.getElementById("legWrapper")
let legOptions = legOptionWrap.getElementsByTagName('option');
let colors = ['red', 'orange', 'yellow', 'green', 'lightblue', 'lightgreen'];
let legReadout = document.getElementById("legReadout");
let addLeg = document.getElementById("aButton");
let overide = document.getElementById("overide");
let deleteLeg = document.getElementById("dButton");
overide.checked = false;

ctcInput.addEventListener("keydown", e => {
    if (isNaN(ctcInput.value) || ctcInput.value.length != 4) return
    if (e.code == 'Enter' || e.code === 'Tab') {
        addCtc(Number(ctcInput.value));
    }
})

removeButton.addEventListener('click', () => {
    let i = ctcSelect.selectedIndex;
    let o = ctcSelect.options[i];
    o.remove();
    target.splice(i, 1);
    tgtVector.splice(i, 1);
    vectorSelect = 0;
    target.forEach((el, j) => el.num = j);
    updateReadout();
    drawCPA();
    updateReadout();
})

ctcSelect.addEventListener('change', e => {
    let i = ctcSelect.selectedIndex;
    let o = ctcSelect[i].value;
    vectorSelect = i;
    if (target[vectorSelect].legs.length == 0 && overide.checked) {
        overide.checked = false;
    }
    setLegVisibility(o);
    target[vectorSelect].updateExpecteds();
    updateReadout()
    drawCPA();
    updateReadout()
})

function setLegVisibility(o) {
    let vis = legReadout.getElementsByClassName(o);
    let selectedOpts = Array.from(vis);
    let allOpts = Array.from(legReadout);
    allOpts.forEach(o => {
        o.style.display = "none"
    })
    selectedOpts.forEach(o => {
        o.style.display = "contents"
    })
    //let t = selectedOpts[0].classList.value;
    legReadout.selectedIndex = -1;
}

function addCtc(ctcNum) {
    if (ctcSelect.length >= 6) return
    for (let i = 0; i < options.length; i++) {
        if (ctcNum == options[i].value) {
            return
        }
    }
    let num = options.length;
    let option = new Option(ctcNum + '', ctcNum);
    ctcSelect.add(option, undefined);
    let c = target.length === 0 ? [
        ['red']
    ] : colors.filter(c => target.every(t => c != t.c));
    tgtVector.push(new Vector(c[0], 0));
    target.push(new Target(0, c[0], num, ctcNum));
    target[num].setPosition();
    sortCtcNum()
    drawCPA();
    updateReadout();
}

function setReadout() {
    losReadout.value = 0;
    brg = 0;
    if (overide.checked) {
        cpaRngReadout.setAttribute('readonly', 'readonly');
        cpaTgtBrgReadout.setAttribute('readonly', 'readonly');
        cpaRngReadout.style.color = "#e0e0e0";
        cpaTgtBrgReadout.style.color = "#e0e0e0";
    }
    drawCPA();
    updateReadout()
}

function updateReadout() {
    vector.setSpeed();
    osCrsReadout.value = vector.crs.toFixed(1);
    llaReadout.value = vector.lla.toFixed(1);
    spdoReadout.value = vector.spd.toFixed(2);
    soiReadout.value = vector.si.toFixed(3);
    soaReadout.value = Math.abs(vector.sa.toFixed(3));
    if (target.length > 0) {
        losReadout.value = target[vectorSelect].currentBrg;
        tgtVector[vectorSelect].setSpeed();
        aobReadout.value = tgtVector[vectorSelect].lla.toFixed(1);
        tboReadout.value = Number(target[vectorSelect].tbo).toFixed(1);
        tgtCrsReadout.value = tgtVector[vectorSelect].crs.toFixed(1);
        cpaTgtBrgReadout.value = Number(target[vectorSelect].currentBrg).toFixed(1);
        cpaRngReadout.value = Number(target[vectorSelect].currentRng).toFixed(2);
        currentBrg.value = target[vectorSelect].currentBrg;
        currentRng.value = target[vectorSelect].currentRng;
        spdtReadout.value = tgtVector[vectorSelect].spd.toFixed(2);
        stiReadout.value = tgtVector[vectorSelect].si.toFixed(3);
        staReadout.value = Math.abs(tgtVector[vectorSelect].sa.toFixed(3));
        sriReadout.value = calcSri().toFixed(2);
        sraReadout.value = calcSra().toFixed(2);
        ssReadout.value = target[vectorSelect].ss;
        frqrReadout.value = target[vectorSelect].frqr;
        frqcReadout.value = target[vectorSelect].frqc;
        frqoReadout.value = target[vectorSelect].frqo;
    }
    if (overide.checked) {
        cpaRngReadout.setAttribute('readonly', 'readonly');
        cpaTgtBrgReadout.setAttribute('readonly', 'readonly');
        cpaRngReadout.style.color = "black";
        cpaTgtBrgReadout.style.color = "black";
    } else {
        cpaRngReadout.removeAttribute('readonly');
        cpaTgtBrgReadout.removeAttribute('readonly');
        cpaRngReadout.style.color = "white";
        cpaTgtBrgReadout.style.color = "white";
    }
}

spdoReadout.addEventListener('keydown', e => {
    if (e.code == 'Enter' || e.code === 'Tab') {
        if (spdoReadout.value > 30) spdoReadout.value = 30;
        setOsSPD();
        drawCPA();
        updateReadout();
    }
})

osCrsReadout.addEventListener('keydown', e => {
    if (e.code == 'Enter' || e.code === 'Tab') {
        if (osCrsReadout.value > 359.9) osCrsReadout.value = 359.9;
        setOsCRS();
        drawCPA();
        updateReadout();
    }
})

ssReadout.addEventListener('keydown', e => {
    if (e.code == 'Enter' || e.code === 'Tab') {
        target[vectorSelect].ss = Number(ssReadout.value);
        updateReadout();
    }
})

frqrReadout.addEventListener('keydown', e => {
    if (e.code == 'Enter' || e.code === 'Tab') {
        target[vectorSelect].frqr = Number(frqrReadout.value);
        target[vectorSelect].frqc = calcFRQc(Number(target[vectorSelect].frqr), target[vectorSelect].ss, vector);
        target[vectorSelect].frqo = calcFRQo(Number(target[vectorSelect].frqc), target[vectorSelect].ss, tgtVector[vectorSelect]);
        updateReadout();
    }
})

addLeg.addEventListener('click', e => {
    if (target.length === 0) {
        contactRequired();
        callTimer();
        return
    }
    if (!validate()) return
    if (target[vectorSelect].legs.length === 0 && overide.checked) {
        brgRngReq();
        callTimer7();
        return
    }
    let lock = overide.checked ? 0 : 1;
    overide.checked = true;
    let t = checkTime(timeLate.value);
    for (let i = 0; i < target[vectorSelect].legs.length; i++) {
        if (compareTimes(target[vectorSelect].legs[i][0], t)) {
            return
        }
    }
    target[vectorSelect].legs.push([t, Number(cpaTgtBrgReadout.value), Number(cpaRngReadout.value), Number(cpaCrsReadout.value), Number(cpaSpdReadout.value), lock]);
    target[vectorSelect].sortZigs();
    let index = [];
    for (let i = 0; i < target[vectorSelect].legs.length; i++) {
        if (target[vectorSelect].legs[i][5] === 1) {
            index.push(i)
        }
    }
    target[vectorSelect].setTimelinePosition(...index.slice(-1));
    let display = legReadout.length === 0 ? "\u00a0\u00a0\u00a0" + timeLate.value + "Z\u00a0\u00a0 |\u00a0\u00a0 " + "" + cpaTgtBrgReadout.value + "T\u00a0\u00a0 |\u00a0\u00a0 " + cpaRngReadout.value + "NM\u00a0\u00a0 |\u00a0\u00a0 " + cpaCrsReadout.value + "T\u00a0\u00a0 |\u00a0\u00a0 " + cpaSpdReadout.value + "KTS" :
        "\u00a0\u00a0\u00a0" + timeLate.value + "Z\u00a0\u00a0 |\u00a0\u00a0 " + "" + target[vectorSelect].brg + "T\u00a0\u00a0 |\u00a0\u00a0 " + target[vectorSelect].rng + "NM\u00a0\u00a0 |\u00a0\u00a0 " + cpaCrsReadout.value + "T\u00a0\u00a0 |\u00a0\u00a0 " + cpaSpdReadout.value + "KTS";
    let option = new Option(display, t);
    option.classList.add(ctcSelect.value);
    legReadout.add(option, undefined);
    updateReadout();
    sortOptionZigs();
    drawCPA();
})

deleteLeg.addEventListener('click', e => {
    if (legReadout.length === 0) return;
    let i = legReadout.selectedIndex;
    let o = legReadout[i];
    o.remove();
    target[vectorSelect].legs.splice(i, 1);
    target[vectorSelect].setTimelinePosition(0);
    target[vectorSelect].updateCurrentInfo();
    drawCPA();
    updateReadout();
})

overide.addEventListener('change', e => {
    updateReadout();
})

exBrgReadout.addEventListener('keydown', e => {
    if (e.code == 'Enter' || e.code === 'Tab') {
        if (exBrgReadout.value > 359.9) exBrgReadout.value = 0;
    }
})

expRngReadout0.addEventListener('keydown', e => {
    if (e.code == 'Enter' || e.code === 'Tab') {
        target[vectorSelect].exRng[0] = Number(expRngReadout0.value);
        expBrgRateReadout[0].value = calcExpectedBrgRate(target[vectorSelect].exRng[0], 0, vector, target[vectorSelect], Number(exBrgReadout.value));
        expBrgXingReadout[0].value = calcExpectedBrgXing(0, vector, target[vectorSelect], Number(exBrgReadout.value))
    }
})

expRngReadout1.addEventListener('keydown', e => {
    if (e.code == 'Enter' || e.code === 'Tab') {
        target[vectorSelect].exRng[1] = Number(expRngReadout1.value);
        expBrgRateReadout[1].value = calcExpectedBrgRate(target[vectorSelect].exRng[1], 1, vector, target[vectorSelect], Number(exBrgReadout.value));
        expBrgXingReadout[1].value = calcExpectedBrgXing(1, vector, target[vectorSelect], Number(exBrgReadout.value))
    }
})

expRngReadout2.addEventListener('keydown', e => {
    if (e.code == 'Enter' || e.code === 'Tab') {
        target[vectorSelect].exRng[2] = Number(expRngReadout2.value);
        expBrgRateReadout[2].value = calcExpectedBrgRate(target[vectorSelect].exRng[2], 2, vector, target[vectorSelect], Number(exBrgReadout.value));
        expBrgXingReadout[2].value = calcExpectedBrgXing(2, vector, target[vectorSelect], Number(exBrgReadout.value))
    }
})

function validate() {
    //Time check
    let tArr = timeLate.value.split('')
    let hrs = tArr.slice(0, 2).join('')
    if (hrs < 0 || hrs > 23) {
        invalidTime()
        callTimer2()
        return false
    }
    let min = tArr.slice(2, 4).join('')
    if (min < 0 || min > 59) {
        invalidTime()
        callTimer2()
        return false
    }
    //brg check
    if (isNaN(cpaTgtBrgReadout.value)) {
        invalidBrg()
        callTimer3()
        return false
    }
    cpaTgtBrgReadout.value %= 360;
    cpaTgtBrgReadout.value = Number(cpaTgtBrgReadout.value).toFixed(1);
    //rng check

    if (isNaN(cpaRngReadout.value)) {
        invalidRng()
        callTimer4()
        return false
    }
    cpaRngReadout.value = Number(cpaRngReadout.value).toFixed(1);

    if (isNaN(cpaCrsReadout.value)) {
        invalidCrs()
        callTimer5()
        return false
    }
    cpaCrsReadout.value = Number(cpaCrsReadout.value).toFixed(1);

    if (isNaN(cpaSpdReadout.value)) {
        invalidSpd()
        callTimer6()
        return false
    }
    cpaSpdReadout.value = Number(cpaSpdReadout.value).toFixed(1);

    return true
}

function compareTimes(targetTime, t) {
    let day1 = targetTime.getDate();
    let hour1 = targetTime.getHours();
    let min1 = targetTime.getMinutes();
    let day2 = t.getDate();
    let hour2 = t.getHours();
    let min2 = t.getMinutes();
    console.log(day1, day2)
    console.log(hour1, hour2)
    console.log(min1, min2)
    if ((day1 === day2) && (hour1 === hour2) && (min1 === min2)) {
        return true
    }
    return false
}

function setOsCRS() {
    vector.crs = Number(osCrsReadout.value);
    let l = vector.spd * 10;
    let a = degreesToRadians(Number(osCrsReadout.value));
    let aOffset = degreesToRadians(90 + brg);
    vector.pt2.x = vector.pt1.x + l * Math.cos(a - aOffset);
    vector.pt2.y = vector.pt1.y + l * Math.sin(a - aOffset);
}

function setOsSPD() {
    vector.spd = Number(spdoReadout.value);
    let l = vector.spd * 10;
    let a = calcVectorAngle(vector.pt1, vector.pt2, vector);
    let aOffset = degreesToRadians(90);
    vector.pt2.x = vector.pt1.x + l * Math.cos(a + aOffset);
    vector.pt2.y = vector.pt1.y + l * Math.sin(a + aOffset);
}
/*
function setTgtCRS() {
    tgtVector[vectorSelect].crs = Number(tgtCrsReadout.value);
    let l = tgtVector[vectorSelect].spd * 10;
    let a = degreesToRadians(Number(tgtCrsReadout.value));
    let aOffset = degreesToRadians(90 + brg);
    tgtVector[vectorSelect].pt2.x = tgtVector[vectorSelect].pt1.x + l * Math.cos(a - aOffset);
    tgtVector[vectorSelect].pt2.y = tgtVector[vectorSelect].pt1.y + l * Math.sin(a - aOffset);
}

function setTgtSPD(legSpd) {
    tgtVector[vectorSelect].spd = legSpd;
    let l = tgtVector[vectorSelect].spd * 10;
    let a = calcVectorAngle(tgtVector[vectorSelect].pt1, tgtVector[vectorSelect].pt2, tgtVector[vectorSelect]);
    let aOffset = degreesToRadians(90);
    tgtVector[vectorSelect].pt2.x = tgtVector[vectorSelect].pt1.x + l * Math.cos(a - aOffset);
    tgtVector[vectorSelect].pt2.y = tgtVector[vectorSelect].pt1.y + l * Math.sin(a - aOffset);
}
*/
window.onload = load()