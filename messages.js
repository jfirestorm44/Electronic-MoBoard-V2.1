let body = document.body;
let cr = document.createElement("input");
cr.setAttribute("type", "text");
cr.setAttribute("value", "Contact Required");
cr.classList.add("message");
body.appendChild(cr);
let nrt = document.createElement("input");
nrt.setAttribute("type", "text");
nrt.setAttribute("value", "Invalid Time");
nrt.classList.add("message");
body.appendChild(nrt);
let ibrg = document.createElement("input");
ibrg.setAttribute("type", "text");
ibrg.setAttribute("value", "Invalid Brg");
ibrg.classList.add("message");
body.appendChild(ibrg);
let irng = document.createElement("input");
irng.setAttribute("type", "text");
irng.setAttribute("value", "Invalid Rng");
irng.classList.add("message");
body.appendChild(irng);
let icrs = document.createElement("input");
icrs.setAttribute("type", "text");
icrs.setAttribute("value", "Invalid Crs");
icrs.classList.add("message");
body.appendChild(icrs);
let ispd = document.createElement("input");
ispd.setAttribute("type", "text");
ispd.setAttribute("value", "Invalid Spd");
ispd.classList.add("message");
body.appendChild(ispd);
let brgRng = document.createElement("input");
brgRng.setAttribute("type", "text");
brgRng.setAttribute("value", "Brg and Rng Required");
brgRng.classList.add("message");
body.appendChild(brgRng);

//contact required
function contactRequired() {
    let crPos = ctcSelect.getBoundingClientRect();
    style(cr)
    cr.style.left = crPos.left + scrollX + "px";
    cr.style.top = crPos.top + 30 + scrollY + "px";
}

//Invalid Time
function invalidTime() {
    let nrtPos = timeLate.getBoundingClientRect();
    style(nrt)
    nrt.style.left = nrtPos.left + scrollX + "px";
    nrt.style.top = nrtPos.top + 30 + scrollY + "px";
}

//Invalid Brg
function invalidBrg() {
    let brgPos = cpaTgtBrgReadout.getBoundingClientRect();
    style(ibrg)
    ibrg.style.left = brgPos.left + scrollX + "px";
    ibrg.style.top = brgPos.top + 30 + scrollY + "px";
}

//Invalid Rng
function invalidRng() {
    let rngPos = cpaRngReadout.getBoundingClientRect();
    style(irng)
    irng.style.left = rngPos.left + scrollX + "px";
    irng.style.top = rngPos.top + 30 + scrollY + "px";
}

//Invalid Crs
function invalidCrs() {
    let crsPos = cpaCrsReadout.getBoundingClientRect();
    style(icrs)
    icrs.style.left = crsPos.left + scrollX + "px";
    icrs.style.top = crsPos.top + 30 + scrollY + "px";
}

function invalidSpd() {
    let spdPos = cpaSpdReadout.getBoundingClientRect();
    style(ispd)
    ispd.style.left = spdPos.left + scrollX + "px";
    ispd.style.top = spdPos.top + 30 + scrollY + "px";
}

function brgRngReq() {
    let reqPos = cpaTgtBrgReadout.getBoundingClientRect();
    style(brgRng);
    brgRng.style.left = reqPos.left - 8 + scrollX + "px";
    brgRng.style.top = reqPos.top - 35 + scrollY + "px";
}

function style(el) {
    el.style.display = 'block';
    el.style.position = "absolute";
    el.style.border = "2px solid red";
    el.style.borderRadius = "5px";
    el.style.backgroundColor = "#2b2a2b";
    el.style.color = "white";
    el.style.textAlign = 'center';
}

function callTimer() {
    setTimeout(() => {
        cr.style.display = "none";
    }, 3000)
}

function callTimer2() {
    setTimeout(() => {
        nrt.style.display = "none";
    }, 3000)
}

function callTimer3() {
    setTimeout(() => {
        ibrg.style.display = "none";
    }, 3000)
}

function callTimer4() {
    setTimeout(() => {
        irng.style.display = "none";
    }, 3000)
}

function callTimer5() {
    setTimeout(() => {
        icrs.style.display = "none";
    }, 3000)
}

function callTimer6() {
    setTimeout(() => {
        ispd.style.display = "none";
    }, 3000)
}

function callTimer7() {
    setTimeout(() => {
        brgRng.style.display = "none";
    }, 3000)
}