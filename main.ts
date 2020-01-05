radio.setGroup(1)
sendRadio(0)

let buttons: number = 0

basic.forever(function () {
    let v = 0

    if (input.buttonIsPressed(Button.A)) {
        v |= 0x01
    }
    if (input.buttonIsPressed(Button.B)) {
        v |= 0x02
    }

    // X
    if (gamePad.keyState(GamerBitPin.P1)) {
        v |= 0x04
    }
    // Y
    if (gamePad.keyState(GamerBitPin.P2)) {
        v |= 0x08
    }
    // D-PAD up
    if (gamePad.keyState(GamerBitPin.P8)) {
        v |= 0x10
    }
    // D-PAD down
    if (gamePad.keyState(GamerBitPin.P13)) {
        v |= 0x20
    }
    // D-PAD left
    if (gamePad.keyState(GamerBitPin.P14)) {
        v |= 0x40
    }
    // D-PAD right
    if (gamePad.keyState(GamerBitPin.P15)) {
        v |= 0x80
    }

    showPressed(v)
    if (v != buttons) {
        sendRadio(v)
    }
    buttons = v
})

let lastRadioTime: number = 0
basic.forever(function () {
    let now = input.runningTime()
    let delta = now - lastRadioTime
    if ((buttons > 0 && delta > 1000) || (delta > 5000)) {
        sendRadio(buttons)
    }
    basic.pause(1000)
})

function sendRadio(v: number) {
    lastRadioTime = input.runningTime()
    control.inBackground(function () {
        led.plot(2, 1)
        basic.pause(100)
        led.unplot(2, 1)
    })
    radio.sendNumber(v)
}

function showPressed(v: number) {
    if (v & 0x01) { led.plot(1, 0) } else { led.unplot(1, 0) }
    if (v & 0x02) { led.plot(3, 0) } else { led.unplot(3, 0) }

    if (v & 0x04) { led.plot(4, 3) } else { led.unplot(4, 3) }
    if (v & 0x08) { led.plot(4, 4) } else { led.unplot(4, 4) }

    if (v & 0x10) { led.plot(1, 2) } else { led.unplot(1, 2) }
    if (v & 0x20) { led.plot(1, 4) } else { led.unplot(1, 4) }
    if (v & 0x40) { led.plot(0, 3) } else { led.unplot(0, 3) }
    if (v & 0x80) { led.plot(2, 3) } else { led.unplot(2, 3) }
}
