import fs from 'fs';
import path from 'path';

function countWords(str) {
  return str.trim().split(/\s+/).filter(Boolean).length;
}

function writeNoteBlock(courseSlug, chapterSlug, loId, coreIdea, workedExample, commonMistake, checkYourself, isFastMoving = false) {
  const dir = path.join('content', courseSlug, chapterSlug, 'notes');
  fs.mkdirSync(dir, { recursive: true });

  const fastMovingHeader = isFastMoving ? 'lastVerified: "2026-03"\n' : '';
  const fastMovingNote = isFastMoving ? '\n*Last verified: February 2026 against official hardware datasheets.*\n' : '';

  const fullContent = `---
loId: "${loId}"
reviewed: false
sources:
  - "Official Espressif Systems and Arduino Technical Reference Manuals"
${fastMovingHeader}---

### Core Idea
${coreIdea.trim()}
${fastMovingNote}
### Worked Example
${workedExample.trim()}

### Common Mistake
${commonMistake.trim()}

### Check Yourself
${checkYourself.trim()}
`;

  const wordCount = countWords(fullContent);
  if (wordCount < 150 || wordCount > 350) {
    console.warn(`⚠️ Warning: Note ${loId} has ${wordCount} words (should be 150-350)`);
  }

  const filePath = path.join(dir, `${loId}.mdx`);
  fs.writeFileSync(filePath, fullContent, 'utf8');
}

function balanceAndSave(courseSlug, chapterSlug, objectivesObj, rawQuestions) {
  const objPath = path.join('content', courseSlug, chapterSlug, 'objectives.json');
  fs.writeFileSync(objPath, JSON.stringify(objectivesObj, null, 2), 'utf8');

  const targets = ['a', 'b', 'c', 'd'];
  let singleCount = 0;

  const balancedQuestions = rawQuestions.map(q => {
    if (q.type === 'single' || q.type === 'scenario' || q.type === 'numeric') {
      const correctText = q.options.find(o => o.id === q.answer[0])?.text || q.options[0].text;
      const distractors = q.options.filter(o => o.id !== q.answer[0]).map(o => o.text);

      const targetLetter = targets[singleCount % 4];
      singleCount++;

      const targetIndex = ['a', 'b', 'c', 'd'].indexOf(targetLetter);
      const newOptionsTexts = [...distractors];
      newOptionsTexts.splice(targetIndex, 0, correctText);

      const newOptions = newOptionsTexts.slice(0, 4).map((text, idx) => ({
        id: ['a', 'b', 'c', 'd'][idx],
        text
      }));

      return {
        ...q,
        options: newOptions,
        answer: [targetLetter]
      };
    }
    return q;
  });

  const quizDir = path.join('content', courseSlug, chapterSlug, 'quiz');
  fs.mkdirSync(quizDir, { recursive: true });
  fs.writeFileSync(path.join(quizDir, 'bank.json'), JSON.stringify(balancedQuestions, null, 2), 'utf8');
  console.log(`✅ Saved ${chapterSlug} with ${balancedQuestions.length} questions`);
}

// ==========================================
// CHAPTER 02: electronics-sensors-and-actuators (iot-02) [evergreen]
// ==========================================

const ch02Objectives = {
  version: 1,
  chapterId: "iot-02",
  objectives: [
    {
      id: "iot-02-lo01",
      order: 1,
      title: "Calculate voltage, current, resistance, and electrical power using Ohm's Law and Joule's Law",
      bloom: "calculate",
      tier: "core",
      mustHave: true,
      keywords: ["ohm's law", "voltage", "current", "resistance", "power", "joule's law"],
      aliases: ["v=ir", "electrical calculations", "resistor power rating"],
      prerequisites: ["iot-01-lo05"],
      estMinutes: 12
    },
    {
      id: "iot-02-lo02",
      order: 2,
      title: "Prototype solderless breadboard circuits and measure signals using digital multimeters",
      bloom: "implement",
      tier: "core",
      mustHave: false,
      keywords: ["breadboard", "multimeter", "continuity test", "voltage measurement", "short circuit prevention"],
      aliases: ["circuit prototyping", "dmm measurement"],
      prerequisites: ["iot-02-lo01"],
      estMinutes: 12
    },
    {
      id: "iot-02-lo03",
      order: 3,
      title: "Construct resistive voltage dividers to level-shift sensor outputs into safe MCU voltages",
      bloom: "construct",
      tier: "core",
      mustHave: true,
      keywords: ["voltage divider", "resistor ratio", "level shifting", "analog sensor scaling"],
      aliases: ["potential divider", "5v to 3.3v scaling"],
      prerequisites: ["iot-02-lo01"],
      estMinutes: 14
    },
    {
      id: "iot-02-lo04",
      order: 4,
      title: "Analyze passive electronic components: capacitors, diodes, and pull-up/pull-down resistors",
      bloom: "analyze",
      tier: "core",
      mustHave: false,
      keywords: ["capacitors", "diodes", "decoupling", "pull-up resistor", "floating pin"],
      aliases: ["passive components", "filtering capacitors", "flyback diode"],
      prerequisites: ["iot-02-lo01"],
      estMinutes: 12
    },
    {
      id: "iot-02-lo05",
      order: 5,
      title: "Convert continuous analog voltages to discrete readings using Analog-to-Digital Converters (ADC)",
      bloom: "calculate",
      tier: "core",
      mustHave: true,
      keywords: ["adc", "bit depth", "quantization error", "reference voltage", "sampling resolution"],
      aliases: ["analog to digital conversion", "adc resolution"],
      prerequisites: ["iot-02-lo03"],
      estMinutes: 14
    },
    {
      id: "iot-02-lo06",
      order: 6,
      title: "Generate variable analog outputs and motor speeds using Pulse Width Modulation (PWM)",
      bloom: "generate",
      tier: "core",
      mustHave: true,
      keywords: ["pwm", "duty cycle", "pwm frequency", "analogwrite", "led dimming"],
      aliases: ["pulse width modulation", "duty cycle calculation"],
      prerequisites: ["iot-02-lo01"],
      estMinutes: 12
    },
    {
      id: "iot-02-lo07",
      order: 7,
      title: "Interface environmental and distance sensors (LDR, DHT22, HC-SR04 ultrasonic)",
      bloom: "interface",
      tier: "core",
      mustHave: false,
      keywords: ["ldr", "dht22", "hc-sr04", "ultrasonic sensor", "sensor calibration"],
      aliases: ["sensor interfacing", "environmental sensors"],
      prerequisites: ["iot-02-lo05"],
      estMinutes: 14
    },
    {
      id: "iot-02-lo08",
      order: 8,
      title: "Control high-power actuators safely using electromechanical relays, optocouplers, and MOSFETs",
      bloom: "control",
      tier: "core",
      mustHave: true,
      keywords: ["relay", "optocoupler", "n-channel mosfet", "flyback diode", "galvanic isolation"],
      aliases: ["actuator driving", "motor control circuit"],
      prerequisites: ["iot-02-lo04"],
      estMinutes: 14
    },
    {
      id: "iot-02-lo09",
      order: 9,
      title: "Apply electrical safety protocols for mains voltage isolation, LiPo batteries, and soldering",
      bloom: "apply",
      tier: "extension",
      mustHave: false,
      keywords: ["electrical safety", "mains isolation", "lipo battery safety", "soldering safety", "fume extraction"],
      aliases: ["workshop safety", "high voltage safety in iot"],
      prerequisites: ["iot-02-lo08"],
      estMinutes: 12
    }
  ]
};

// Notes for iot-02

writeNoteBlock('iot', 'electronics-sensors-and-actuators', 'iot-02-lo01',
  `Understanding fundamental electrical relationships is mandatory for designing reliable, unburnt embedded circuits:
1. Ohm's Law ($V = I \\times R$): Voltage ($V$, volts) equals Current ($I$, amperes) multiplied by Resistance ($R$, ohms). It dictates how much current flows through a path given an electrical potential difference.
2. Joule's Law of Electrical Power ($P = V \\times I = I^2 R = \\frac{V^2}{R}$): Power ($P$, watts) measures thermal energy dissipated per second. Standard through-hole resistors are rated at $0.25\\text{W}$; exceeding this thermal envelope burns the component.
3. Current-Limiting Resistor Calculation for LEDs:
   $$\\text{Resistor Value } R = \\frac{V_{\\text{supply}} - V_{\\text{forward}}}{I_{\\text{target}}}$$
   For a $3.3\\text{V}$ microcontroller driving a red LED with forward drop $V_f = 2.0\\text{V}$ at $10\\text{mA}$ ($0.01\\text{A}$):
   $$R = \\frac{3.3 - 2.0}{0.01} = 130\\,\\Omega$$
   Use the next standard E24 resistor value ($150\\,\\Omega$).`,
  `Python script calculating current-limiting resistance and power dissipation:
\`\`\`python
def calculate_led_resistor(v_supply, v_forward, i_target_amps):
    v_resistor = v_supply - v_forward
    resistance = v_resistor / i_target_amps
    power_watts = (v_resistor ** 2) / resistance
    return {
        "resistance_ohms": resistance,
        "power_dissipation_watts": power_watts,
        "is_safe_for_quarter_watt": power_watts < 0.25
    }

spec = calculate_led_resistor(v_supply=5.0, v_forward=2.0, i_target_amps=0.015)
print(f"Resistance: {spec['resistance_ohms']:.1f} Ohms, Power: {spec['power_dissipation_watts']:.3f} W")
# 200.0 Ohms, 0.045 W (Safe)
\`\`\``,
  `Connecting an LED directly between a GPIO pin and Ground without a current-limiting resistor. The LED presents near-zero dynamic resistance, drawing destructive excessive current (>50mA) that instantly destroys the microcontroller output driver.`,
  `How much current flows through a $220\\,\\Omega$ resistor connected across a $3.3\\text{V}$ power rail with negligible diode drop?`
);

writeNoteBlock('iot', 'electronics-sensors-and-actuators', 'iot-02-lo02',
  `Solderless breadboards and digital multimeters (DMMs) form the core prototyping workbench:
1. Breadboard Architecture: Terminal strips connect groups of 5 tie-points horizontally across central DIP channels. Long vertical power rails (busses) run along both edges for Ground (blue/black) and $V_{CC}$ (red).
2. Prototyping Cleanliness: Keep jumper wires flush against the breadboard, color-code connections systematically (Black=GND, Red=Power, Blue/Yellow=Signals), and always verify power rails before inserting expensive silicon.
3. Digital Multimeter Operations:
   - DC Voltage: Measured in parallel across two nodes without breaking the circuit.
   - DC Current: Measured in series; the circuit loop must be broken so that all current passes through the DMM meter shunt.
   - Continuity Test: Emits an audible tone when resistance is below $\\sim 30\\,\\Omega$, allowing rapid detection of solder bridges or shorted traces.
4. Pre-Power Continuity Check: Always test continuity between $V_{CC}$ and GND with power disconnected; an audible beep indicates an immediate dead short circuit.`,
  `DMM current measurement procedure:
1. Turn off external power supply.
2. Move DMM red lead to the 10A or mA current socket.
3. Disconnect the $V_{CC}$ lead going into the sensor.
4. Connect DMM red probe to the power source, and black probe to the sensor's power pin (placing the meter in series).
5. Apply power and observe current consumption under operating and sleep states.`,
  `Leaving the DMM red probe in the low-impedance Ammeter socket while attempting to measure voltage across power rails, creating a direct low-impedance short that blows the DMM internal protective fuse.`,
  `Why must DC current be measured in series with the load rather than in parallel across the load?`
);

writeNoteBlock('iot', 'electronics-sensors-and-actuators', 'iot-02-lo03',
  `A resistive voltage divider scales down a higher input voltage to a proportional lower output voltage, essential for feeding $5\\text{V}$ sensor signals into $3.3\\text{V}$ microcontrollers:
1. Voltage Divider Equation:
   $$V_{\\text{out}} = V_{\\text{in}} \\times \\frac{R_2}{R_1 + R_2}$$
   Where $R_1$ is connected between $V_{\\text{in}}$ and $V_{\\text{out}}$, and $R_2$ is connected between $V_{\\text{out}}$ and Ground.
2. Level-Shifting $5\\text{V}$ to $3.3\\text{V}$:
   To step $5.0\\text{V}$ down to $3.3\\text{V}$, the required resistor ratio is:
   $$\\frac{R_2}{R_1 + R_2} = \\frac{3.3}{5.0} = 0.66$$
   Using standard E24 resistor values: $R_1 = 1.0\\,\\text{k}\\Omega$ and $R_2 = 2.0\\,\\text{k}\\Omega$ yields:
   $$V_{\\text{out}} = 5.0\\text{V} \\times \\frac{2000}{1000 + 2000} = 3.33\\text{V}$$
3. Impedance Loading Caution: Voltage dividers work only into high-impedance inputs (like MCU ADC pins or CMOS GPIOs). Never use a passive voltage divider to supply power to motors or high-current sensors.`,
  `Python script calculating exact voltage divider outputs:
\`\`\`python
def calculate_divider_output(v_in, r1_ohms, r2_ohms):
    v_out = v_in * (r2_ohms / (r1_ohms + r2_ohms))
    current_drawn_ma = (v_in / (r1_ohms + r2_ohms)) * 1000
    return {"v_out": round(v_out, 3), "current_ma": round(current_drawn_ma, 2)}

# 5V stepped down using 1k and 2k resistors
result = calculate_divider_output(v_in=5.0, r1_ohms=1000, r2_ohms=2000)
print(f"Output Voltage: {result['v_out']} V, Quiescent Current: {result['current_ma']} mA")
# 3.333 V, 1.67 mA
\`\`\``,
  `Attempting to power a $3.3\\text{V}$ Wi-Fi module from a $5\\text{V}$ supply using a simple resistor divider; the module's fluctuating operating current alters the voltage drop, causing the voltage to collapse and brownout the device.`,
  `If $R_1 = 10\\,\\text{k}\\Omega$, $R_2 = 10\\,\\text{k}\\Omega$, and $V_{\\text{in}} = 10\\text{V}$, what is the output voltage $V_{\\text{out}}$?`
);

writeNoteBlock('iot', 'electronics-sensors-and-actuators', 'iot-02-lo04',
  `Passive components establish circuit stability, signal conditioning, and electrical protection:
1. Decoupling Capacitors: Microcontrollers draw instantaneous high-frequency current spikes during clock transitions. Placing a $0.1\\,\\mu\\text{F}$ ceramic capacitor physically adjacent to every MCU $V_{DD}$ pin shunts high-frequency noise to Ground, preventing sporadic resets. A larger electrolytic or tantalum capacitor ($10\\,\\mu\\text{F}$ to $100\\,\\mu\\text{F}$) on the main rail buffers bulk power fluctuations.
2. Diodes and Rectification: Diodes permit current flow in only one direction (anode to cathode). Flyback (snubber) diodes placed reverse-biased across inductive loads (relays, DC motors) absorb dangerous high-voltage inductive kickback spikes ($V = -L \\frac{di}{dt}$) generated when current is abruptly interrupted.
3. Pull-Up and Pull-Down Resistors: Floating digital input pins act like miniature radio antennas, picking up electromagnetic interference and randomly fluctuating between HIGH and LOW. A $10\\,\\text{k}\\Omega$ pull-up resistor ties the pin weakly to $V_{CC}$ until an external switch pulls it to Ground.`,
  `Arduino C++ example enabling internal weak pull-up resistors:
\`\`\`cpp
const int BUTTON_PIN = 4;

void setup() {
  // Configures input pin with internal ~40k pull-up to VCC
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  Serial.begin(115200);
}

void loop() {
  // Reading returns LOW when button is pressed to GND
  int state = digitalRead(BUTTON_PIN);
  if (state == LOW) {
    Serial.println("Switch pressed to Ground");
  }
}
\`\`\``,
  `Omitting a flyback diode across an electromagnetic relay coil driven by a transistor; the inductive voltage spike of several hundred volts punctures and permanently fries the switching transistor upon turn-off.`,
  `What erratic behavior occurs when a digital input pin is left floating without a pull-up or pull-down resistor?`
);

writeNoteBlock('iot', 'electronics-sensors-and-actuators', 'iot-02-lo05',
  `Analog-to-Digital Converters (ADCs) quantize continuous environmental physical voltages into discrete digital integer values:
1. Bit Depth and Resolution: An $N$-bit ADC partitions the analog reference voltage range ($V_{\\text{ref}}$) into $2^N$ discrete steps.
   $$\\text{Voltage Resolution per LSB} = \\frac{V_{\\text{ref}}}{2^N - 1}$$
   - Arduino Uno: 10-bit ADC $\\rightarrow 2^{10} = 1024$ levels ($0$ to $1023$). At $V_{\\text{ref}} = 5.0\\text{V}$, resolution is $\\frac{5.0}{1023} \\approx 4.88\\text{mV}$ per step.
   - ESP32: 12-bit ADC $\\rightarrow 2^{12} = 4096$ levels ($0$ to $4095$). At $V_{\\text{ref}} = 3.3\\text{V}$, resolution is $\\frac{3.3}{4095} \\approx 0.806\\text{mV}$ per step.
2. Conversion Formula:
   $$\\text{Measured Voltage } V = \\text{ADC Raw Reading} \\times \\frac{V_{\\text{ref}}}{2^N - 1}$$
3. ESP32 Non-Linearity: The native ESP32 ADC exhibits non-linear response curves below $\\sim 0.15\\text{V}$ and above $\\sim 3.1\\text{V}$, requiring multi-point calibration tables for precision measurement.`,
  `C++ function converting raw 12-bit ADC readings to voltage:
\`\`\`cpp
float convert_raw_adc_to_voltage(int raw_val, float v_ref = 3.3, int bit_depth = 12) {
    int max_steps = (1 << bit_depth) - 1; // 4095 for 12-bit
    return (raw_val * v_ref) / max_steps;
}

// Example: raw reading of 2048 on 12-bit ADC with 3.3V reference
// returns 2048 * 3.3 / 4095 = 1.651 Volts
\`\`\``,
  `Feeding an analog input voltage greater than the microcontroller supply rail ($3.3\\text{V}$ on ESP32 or $5.0\\text{V}$ on Arduino) directly into an ADC pin, forward-biasing internal ESD clamp diodes and permanently burning the pin.`,
  `What is the theoretical maximum raw integer value returned by a 10-bit ADC?`
);

writeNoteBlock('iot', 'electronics-sensors-and-actuators', 'iot-02-lo06',
  `Microcontrollers cannot directly output variable analog voltages from digital pins; Pulse Width Modulation (PWM) synthesizes analog-like power through high-speed digital switching:
1. Operating Principle: PWM rapidly switches a digital pin between HIGH ($V_{CC}$) and LOW ($0\\text{V}$) at a constant frequency. The human eye (LED dimming) or mechanical inertia (motor coils) averages the high and low states.
2. Duty Cycle ($D$): The percentage of time the signal remains HIGH during one full period ($T$):
   $$\\text{Duty Cycle } D = \\frac{T_{\\text{on}}}{T} \\times 100\\%$$
   $$\\text{Effective Average Voltage } V_{\\text{avg}} = V_{CC} \\times \\frac{\\text{Duty Cycle}}{100}$$
   At $V_{CC} = 3.3\\text{V}$ with a $50\\%$ duty cycle, the average effective voltage delivered is $1.65\\text{V}$.
3. Frequency Requirements:
   - LED Dimming: $>100\\text{Hz}$ to eliminate human-perceptible optical flicker.
   - DC Motor Speed: $1\\text{kHz} - 20\\text{kHz}$ to eliminate audible acoustic motor whine.
   - Hobby Servos: Exact $50\\text{Hz}$ pulse train ($20\\text{ms}$ period) where high pulses between $1.0\\text{ms}$ and $2.0\\text{ms}$ govern rotor angle ($0^{\\circ}$ to $180^{\\circ}$).`,
  `Configuring ESP32 hardware PWM via LEDC peripheral in Arduino framework:
\`\`\`cpp
const int LED_PIN = 18;
const int PWM_CHANNEL = 0;
const int PWM_FREQ = 5000;    // 5 kHz frequency
const int PWM_RESOLUTION = 8; // 8-bit resolution (0-255 steps)

void setup() {
  ledcAttachChannel(LED_PIN, PWM_FREQ, PWM_RESOLUTION, PWM_CHANNEL);
  // Set 50% duty cycle (128 / 255)
  ledcWrite(LED_PIN, 128);
}
\`\`\``,
  `Assuming PWM changes the actual output voltage amplitude; the instantaneous output voltage is always fully HIGH ($3.3\\text{V}$) or fully LOW ($0\\text{V}$), only the time average varies.`,
  `If an ESP32 outputting $3.3\\text{V}$ runs an 8-bit PWM channel at duty value 64 (out of 255), what is the approximate average effective voltage?`
);

writeNoteBlock('iot', 'electronics-sensors-and-actuators', 'iot-02-lo07',
  `Interfacing sensors requires converting external physical phenomena into electrical signals compatible with MCU inputs:
1. Light Dependent Resistors (LDRs): Photoresistors whose resistance drops from several mega-ohms in darkness to a few hundred ohms under bright light. Connected in a voltage divider with a fixed $10\\,\\text{k}\\Omega$ resistor to generate an analog voltage readable by an ADC pin.
2. DHT22 (AM2302) Temperature & Humidity: Uses a capacitive humidity sensor and NTC thermistor. Communicates over a custom single-wire digital protocol with a mandatory $4.7\\,\\text{k}\\Omega - 10\\,\\text{k}\\Omega$ pull-up resistor, providing $0.1^{\\circ}\\text{C}$ resolution.
3. HC-SR04 Ultrasonic Distance Sensor: Measures distance via sound time-of-flight:
   $$\\text{Distance (cm)} = \\frac{\\text{Echo High Duration (}\\mu\\text{s)} \\times 0.0343}{2}$$
   Requires sending a $10\\,\\mu\\text{s}$ HIGH pulse on the Trigger pin and timing the Echo pin pulse duration.
   *Critical Level Shifting*: HC-SR04 Echo pin outputs $5\\text{V}$; it must be stepped down to $3.3\\text{V}$ with a resistor divider before connecting to an ESP32 input pin.`,
  `Calculating distance from HC-SR04 echo duration in Python:
\`\`\`python
def calculate_distance_cm(duration_microseconds):
    # Speed of sound in air at 20°C is 343 m/s = 0.0343 cm/microsecond
    # Divided by 2 for out-and-back round trip
    distance_cm = (duration_microseconds * 0.0343) / 2
    return round(distance_cm, 2)

# Ultrasonic echo pulse returned after 1000 microseconds
dist = calculate_distance_cm(1000)
print(f"Object Distance: {dist} cm") # 17.15 cm
\`\`\``,
  `Connecting the HC-SR04 $5\\text{V}$ Echo output pin directly to an ESP32 $3.3\\text{V}$ GPIO pin without a voltage divider or logic level shifter, overstressing and damaging the MCU input buffer.`,
  `Why must the round-trip sound travel time be divided by 2 when computing target distance with an ultrasonic sensor?`
);

writeNoteBlock('iot', 'electronics-sensors-and-actuators', 'iot-02-lo08',
  `Microcontroller GPIO pins source only tiny currents ($12\\text{mA}-20\\text{mA}$ max), requiring driver stages to control motors, solenoids, and AC appliances:
1. Electromechanical Relays: A low-power coil activates mechanical switch contacts. Provides complete galvanic physical isolation between the low-voltage DC logic and high-voltage AC mains.
2. Optocouplers (Photocouplers): Transmit digital signals across an internal infrared LED and phototransistor barrier with no physical copper connection, providing up to $5000\\text{V}$ electrical isolation against ground loops and surges.
3. N-Channel Power MOSFETs (Logic-Level): Semiconductor switches for high-current DC loads (LED strips, DC motors). Must be logic-level rated ($V_{GS(\\text{th})} < 2.5\\text{V}$) so that $3.3\\text{V}$ GPIO signals saturate the gate fully.
4. Inductive Load Protection: When driving DC inductive loads (coils, motors) via MOSFET or BJT, always place a 1N4007 or Schottky flyback diode in reverse parallel across the load terminals to suppress back-EMF spikes.`,
  `Circuit wiring topology for a logic-level N-Channel MOSFET:
1. Microcontroller GPIO connected through a $220\\,\\Omega$ gate resistor to the MOSFET Gate pin.
2. A $10\\,\\text{k}\\Omega$ pull-down resistor tied from Gate to Ground (ensuring the MOSFET stays OFF during MCU reboot).
3. MOSFET Source pin connected directly to Common Ground.
4. MOSFET Drain connected to the negative terminal of the DC motor/load.
5. Positive load terminal connected to external $+12\\text{V}$ power supply.
6. Flyback diode connected across motor terminals (cathode to $+12\\text{V}$, anode to Drain).`,
  `Failing to connect the external motor power supply Ground to the microcontroller Ground; without a common reference ground, the gate-to-source voltage $V_{GS}$ cannot be established, causing erratic switching.`,
  `What critical function does an optocoupler perform in high-power embedded circuits?`
);

writeNoteBlock('iot', 'electronics-sensors-and-actuators', 'iot-02-lo09',
  `Physical electronics engineering involves real hazards requiring strict adherence to workshop and electrical safety protocols:
1. Mains Voltage AC Hazard ($110\\text{V} - 240\\text{V}$): AC mains voltage is lethal. Never touch live wiring; always test with non-contact voltage testers. Ensure minimum $5\\text{mm}$ physical creepage and clearance distances between mains AC PCB traces and low-voltage DC tracks. Always enclose mains relays in fire-retardant enclosures.
2. Lithium Polymer (LiPo) Battery Safety: LiPo batteries store tremendous chemical energy and can enter violent thermal runaway if short-circuited, punctured, or overcharged. Always use dedicated battery management ICs (like TP4056 with DW01A protection) enforcing overvoltage ($4.2\\text{V}$ max), undervoltage ($2.8\\text{V}$ min cutoff), and overcurrent limits.
3. Soldering Safety & Chemical Hygiene: Solder irons operate at $300^{\\circ}\\text{C} - 380^{\\circ}\\text{C}$. Always use active fume extraction or well-ventilated areas to avoid inhaling rosin flux fumes. Wash hands thoroughly after handling lead-bearing solder.`,
  `Safety checklist for battery-powered IoT prototypes:
\`\`\`python
def verify_lipo_safety(cell_voltage, charging_current_ma, cell_capacity_mah):
    # Rule: Max charge current is 1C (1x capacity), voltage must stay between 3.0V and 4.2V
    is_voltage_safe = 3.0 <= cell_voltage <= 4.2
    is_charge_rate_safe = charging_current_ma <= cell_capacity_mah
    return {
        "cell_safe": is_voltage_safe and is_charge_rate_safe,
        "hazard_detected": not (is_voltage_safe and is_charge_rate_safe)
    }

# Evaluating a 500mAh LiPo cell at 4.1V charged at 400mA
status = verify_lipo_safety(cell_voltage=4.1, charging_current_ma=400, cell_capacity_mah=500)
print(f"Safe Operating Condition: {status['cell_safe']}") # True
\`\`\``,
  `Charging a bare Lithium-ion cell without a protection circuit module (PCM), allowing an overcharge past $4.25\\text{V}$ that initiates irreversible electrolyte decomposition, swelling, and fire.`,
  `Why must dedicated battery management circuits enforce a low-voltage cutoff ($\sim 2.8\text{V}$) on LiPo cells?`
);

// Questions for iot-02
const ch02Questions = [
  // LO01
  {
    loId: "iot-02-lo01",
    type: "single",
    difficulty: 1,
    id: "iot-02-q01",
    stem: "According to Ohm's Law, what formula expresses the relationship between Voltage (V), Current (I), and Resistance (R)?",
    options: [
      { id: "a", text: "V = I * R" },
      { id: "b", text: "V = I / R" },
      { id: "c", text: "V = I + R" },
      { id: "d", text: "V = R / I" }
    ],
    answer: ["a"],
    explanation: "Ohm's Law states that Voltage equals Current multiplied by Resistance (V = I * R).",
    noteRef: "iot-02-lo01",
    reviewed: false
  },
  {
    loId: "iot-02-lo01",
    type: "numeric",
    difficulty: 2,
    id: "iot-02-q02",
    stem: "A 5V power source drives a circuit through a 250 Ohm resistor. What current (in milliamperes, mA) flows through the circuit?",
    options: [
      { id: "a", text: "20" },
      { id: "b", text: "50" },
      { id: "c", text: "1250" },
      { id: "d", text: "5" }
    ],
    answer: ["a"],
    explanation: "I = V / R = 5V / 250 Ohm = 0.02 A = 20 mA.",
    noteRef: "iot-02-lo01",
    verify: "((5 / 250) * 1000 === 20)",
    reviewed: false
  },
  {
    loId: "iot-02-lo01",
    type: "scenario",
    difficulty: 2,
    id: "iot-02-q03",
    stem: "An engineer needs to power a red LED with forward drop Vf = 1.8V from a 5V supply at target current 20mA (0.02A). What resistor value (in Ohms) is required?",
    options: [
      { id: "a", text: "160" },
      { id: "b", text: "250" },
      { id: "c", text: "100" },
      { id: "d", text: "340" }
    ],
    answer: ["a"],
    explanation: "R = (Vsupply - Vf) / I = (5.0 - 1.8) / 0.02 = 3.2 / 0.02 = 160 Ohms.",
    noteRef: "iot-02-lo01",
    reviewed: false
  },
  {
    loId: "iot-02-lo01",
    type: "single",
    difficulty: 3,
    id: "iot-02-q04",
    stem: "If a 100 Ohm resistor has a current of 0.1A passing through it, what power is dissipated as heat, and is a standard 0.25W resistor safe?",
    options: [
      { id: "a", text: "P = 1.0W; unsafe because it exceeds the 0.25W rating fourfold." },
      { id: "b", text: "P = 0.1W; safe because it is below 0.25W." },
      { id: "c", text: "P = 10W; safe because resistors cannot burn." },
      { id: "d", text: "P = 0.01W; safe because voltage is zero." }
    ],
    answer: ["a"],
    explanation: "P = I^2 * R = (0.1)^2 * 100 = 0.01 * 100 = 1.0W, drastically exceeding a 0.25W resistor rating.",
    noteRef: "iot-02-lo01",
    reviewed: false
  },

  // LO02
  {
    loId: "iot-02-lo02",
    type: "single",
    difficulty: 1,
    id: "iot-02-q05",
    stem: "How are tie-points interconnected along the long outer rails of a standard solderless breadboard?",
    options: [
      { id: "a", text: "Vertically connected as continuous common power/ground distribution buses." },
      { id: "b", text: "Horizontally connected in groups of 5 tie-points." },
      { id: "c", text: "Completely isolated from all other pins." },
      { id: "d", text: "Tied through internal 10k resistors." }
    ],
    answer: ["a"],
    explanation: "Outer breadboard bus strips run vertically down the board to distribute power rails.",
    noteRef: "iot-02-lo02",
    reviewed: false
  },
  {
    loId: "iot-02-lo02",
    type: "scenario",
    difficulty: 2,
    id: "iot-02-q06",
    stem: "An engineer wants to measure the operating current of an IoT temperature sensor using a digital multimeter. How must the DMM test leads be placed?",
    options: [
      { id: "a", text: "In series within the power line, breaking the circuit so all current flows through the meter." },
      { id: "b", text: "In parallel across the sensor's VCC and GND pins." },
      { id: "c", text: "Connected directly between the breadboard power rail and earth ground." },
      { id: "d", text: "Attached only to the plastic chassis." }
    ],
    answer: ["a"],
    explanation: "Current measurement requires inserting the low-impedance ammeter in series into the circuit loop.",
    noteRef: "iot-02-lo02",
    reviewed: false
  },
  {
    loId: "iot-02-lo02",
    type: "single",
    difficulty: 2,
    id: "iot-02-q07",
    stem: "What does an audible continuous beep indicate when using a DMM in Continuity Test mode across unpowered power rails?",
    options: [
      { id: "a", text: "A direct low-resistance short circuit exists between the power and ground rails." },
      { id: "b", text: "The circuit is completely open and safe to power on." },
      { id: "c", text: "The battery is fully charged." },
      { id: "d", text: "The Wi-Fi antenna is connected." }
    ],
    answer: ["a"],
    explanation: "Continuity beeps on low resistance (<30 Ohms); beeping across rails indicates a dangerous dead short.",
    noteRef: "iot-02-lo02",
    reviewed: false
  },
  {
    loId: "iot-02-lo02",
    type: "single",
    difficulty: 3,
    id: "iot-02-q08",
    stem: "What happens if a user leaves a DMM probe plugged into the 10A current jack and connects the probes in parallel across a 12V lead-acid battery?",
    options: [
      { id: "a", text: "The near-zero internal resistance of the ammeter creates a catastrophic short circuit, blowing the meter fuse or melting test leads." },
      { id: "b", text: "The multimeter accurately reads 12V." },
      { id: "c", text: "The battery becomes permanently uncharged." },
      { id: "d", text: "The multimeter displays digital frequency." }
    ],
    answer: ["a"],
    explanation: "Ammeter jacks have micro-ohm shunt resistance; placing them in parallel across a voltage source causes a direct short.",
    noteRef: "iot-02-lo02",
    reviewed: false
  },

  // LO03
  {
    loId: "iot-02-lo03",
    type: "single",
    difficulty: 1,
    id: "iot-02-q09",
    stem: "What is the formula for the output voltage (Vout) of a two-resistor voltage divider?",
    options: [
      { id: "a", text: "Vout = Vin * (R2 / (R1 + R2))" },
      { id: "b", text: "Vout = Vin * ((R1 + R2) / R2)" },
      { id: "c", text: "Vout = Vin * (R1 / R2)" },
      { id: "d", text: "Vout = Vin - (R1 * R2)" }
    ],
    answer: ["a"],
    explanation: "The voltage divider equation is Vout = Vin * (R2 / (R1 + R2)).",
    noteRef: "iot-02-lo03",
    reviewed: false
  },
  {
    loId: "iot-02-lo03",
    type: "numeric",
    difficulty: 2,
    id: "iot-02-q10",
    stem: "If Vin = 12V, R1 = 10k Ohms, and R2 = 10k Ohms, what is the output voltage Vout (in Volts)?",
    options: [
      { id: "a", text: "6" },
      { id: "b", text: "12" },
      { id: "c", text: "3" },
      { id: "d", text: "24" }
    ],
    answer: ["a"],
    explanation: "Equal resistors divide voltage in half: 12 * (10 / (10 + 10)) = 6V.",
    noteRef: "iot-02-lo03",
    verify: "(12 * (10 / 20) === 6)",
    reviewed: false
  },
  {
    loId: "iot-02-lo03",
    type: "scenario",
    difficulty: 2,
    id: "iot-02-q11",
    stem: "An engineer uses R1 = 1.0k Ohm and R2 = 2.0k Ohm to step down a 5V digital signal for an ESP32 3.3V input. What voltage is delivered to the ESP32?",
    options: [
      { id: "a", text: "3.33V" },
      { id: "b", text: "2.50V" },
      { id: "c", text: "1.67V" },
      { id: "d", text: "4.50V" }
    ],
    answer: ["a"],
    explanation: "Vout = 5 * (2000 / 3000) = 5 * (2/3) = 3.33V, safe for 3.3V CMOS inputs.",
    noteRef: "iot-02-lo03",
    reviewed: false
  },
  {
    loId: "iot-02-lo03",
    type: "single",
    difficulty: 3,
    id: "iot-02-q12",
    stem: "Why cannot a passive resistive voltage divider be used as a power supply regulator for a 3.3V motor or Wi-Fi radio?",
    options: [
      { id: "a", text: "Dynamic current drawn by the load alters the effective parallel resistance of R2, causing the output voltage to fluctuate wildly and collapse under load." },
      { id: "b", text: "Because resistors only work with alternating current (AC)." },
      { id: "c", text: "Because voltage dividers generate microwave radiation." },
      { id: "d", text: "Microcontrollers reject voltages produced by resistors." }
    ],
    answer: ["a"],
    explanation: "Load impedance in parallel with R2 shifts the division ratio, collapsing voltage when dynamic current is drawn.",
    noteRef: "iot-02-lo03",
    reviewed: false
  },

  // LO04
  {
    loId: "iot-02-lo04",
    type: "single",
    difficulty: 1,
    id: "iot-02-q13",
    stem: "What is the primary function of a 0.1 uF ceramic decoupling capacitor placed right next to an MCU power pin?",
    options: [
      { id: "a", text: "To supply high-frequency transient switching current and shunt electrical noise to Ground, preventing sporadic MCU resets." },
      { id: "b", text: "To store power for operating the device during multi-day blackouts." },
      { id: "c", text: "To amplify digital signals by 10x." },
      { id: "d", text: "To convert DC into 50Hz AC." }
    ],
    answer: ["a"],
    explanation: "Decoupling caps act as local charge reservoirs absorbing high-frequency transient current spikes during clock switching.",
    noteRef: "iot-02-lo04",
    reviewed: false
  },
  {
    loId: "iot-02-lo04",
    type: "scenario",
    difficulty: 2,
    id: "iot-02-q14",
    stem: "A push button connects a microcontroller GPIO pin to Ground. When unpressed, the pin reads erratic random 1s and 0s. What component is missing?",
    options: [
      { id: "a", text: "A pull-up resistor tying the pin weakly to VCC when the switch is open." },
      { id: "b", text: "A step-up transformer." },
      { id: "c", text: "A heatsink." },
      { id: "d", text: "A high-pass audio filter." }
    ],
    answer: ["a"],
    explanation: "A floating input pin acts as an antenna picking up EMI; a pull-up resistor establishes a defined HIGH state when open.",
    noteRef: "iot-02-lo04",
    reviewed: false
  },
  {
    loId: "iot-02-lo04",
    type: "single",
    difficulty: 2,
    id: "iot-02-q15",
    stem: "Why must a reverse-biased flyback (snubber) diode be placed across an electromechanical relay coil?",
    options: [
      { id: "a", text: "To dissipate the high-voltage inductive kickback spike generated when the coil magnetic field collapses upon turn-off." },
      { id: "b", text: "To make the relay switch twice as fast." },
      { id: "c", text: "To convert DC coil voltage into AC." },
      { id: "d", text: "To illuminate when the relay activates." }
    ],
    answer: ["a"],
    explanation: "Inductors resist abrupt current changes; the collapse generates a back-EMF spike of hundreds of volts without a flyback clamp.",
    noteRef: "iot-02-lo04",
    reviewed: false
  },
  {
    loId: "iot-02-lo04",
    type: "multi",
    difficulty: 3,
    id: "iot-02-q16",
    stem: "Which of the following problems can be resolved by integrating passive components into an embedded circuit?",
    options: [
      { id: "a", text: "Preventing floating input logic states via pull-up / pull-down resistors" },
      { id: "b", text: "Suppressing high-voltage inductive spikes across coils via flyback diodes" },
      { id: "c", text: "Smoothing supply rail voltage ripples via decoupling capacitors" },
      { id: "d", text: "Overclocking an 8-bit MCU to execute multi-billion parameter LLMs" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Passives manage pin states, voltage spikes, and power rail stability; they cannot add compute capacity.",
    noteRef: "iot-02-lo04",
    reviewed: false
  },

  // LO05
  {
    loId: "iot-02-lo05",
    type: "single",
    difficulty: 1,
    id: "iot-02-q17",
    stem: "How many discrete quantization levels does a 12-bit Analog-to-Digital Converter (ADC) provide?",
    options: [
      { id: "a", text: "4096 (0 to 4095)" },
      { id: "b", text: "1024 (0 to 1023)" },
      { id: "c", text: "256 (0 to 255)" },
      { id: "d", text: "65536 (0 to 65535)" }
    ],
    answer: ["a"],
    explanation: "A 12-bit ADC provides 2^12 = 4096 discrete quantization steps (ranging from 0 to 4095).",
    noteRef: "iot-02-lo05",
    reviewed: false
  },
  {
    loId: "iot-02-lo05",
    type: "scenario",
    difficulty: 2,
    id: "iot-02-q18",
    stem: "An Arduino Uno with a 10-bit ADC (1024 steps) and 5.0V reference reads an analog value of 512 from a temperature sensor. What voltage is present on the pin?",
    options: [
      { id: "a", text: "2.50V" },
      { id: "b", text: "1.25V" },
      { id: "c", text: "3.30V" },
      { id: "d", text: "5.00V" }
    ],
    answer: ["a"],
    explanation: "512 is exactly half of 1024; (512 / 1023) * 5.0V = 2.50V.",
    noteRef: "iot-02-lo05",
    reviewed: false
  },
  {
    loId: "iot-02-lo05",
    type: "numeric",
    difficulty: 2,
    id: "iot-02-q19",
    stem: "What is the theoretical maximum digital value returned by a standard 10-bit ADC?",
    options: [
      { id: "a", text: "1023" },
      { id: "b", text: "1024" },
      { id: "c", text: "4095" },
      { id: "d", text: "255" }
    ],
    answer: ["a"],
    explanation: "2^10 - 1 = 1024 - 1 = 1023.",
    noteRef: "iot-02-lo05",
    verify: "((2 ** 10) - 1 === 1023)",
    reviewed: false
  },
  {
    loId: "iot-02-lo05",
    type: "single",
    difficulty: 3,
    id: "iot-02-q20",
    stem: "What well-known hardware quirk affects raw ADC readings on native ESP32 chips near the rails (below 0.15V and above 3.1V)?",
    options: [
      { id: "a", text: "Severe non-linearity and dead bands near 0V and 3.3V, requiring calibration curves for accurate measurements." },
      { id: "b", text: "The ADC reverses its numerical sign." },
      { id: "c", text: "The ADC operates only on prime numbers." },
      { id: "d", text: "The ESP32 shuts down permanently." }
    ],
    answer: ["a"],
    explanation: "ESP32 SAR ADCs suffer from significant non-linearity near lower and upper voltage thresholds.",
    noteRef: "iot-02-lo05",
    reviewed: false
  },

  // LO06
  {
    loId: "iot-02-lo06",
    type: "single",
    difficulty: 1,
    id: "iot-02-q21",
    stem: "What is 'Duty Cycle' in Pulse Width Modulation (PWM)?",
    options: [
      { id: "a", text: "The percentage of time a digital pulse stays HIGH during one complete switching period." },
      { id: "b", text: "The total number of pulses generated per calendar day." },
      { id: "c", text: "The amount of electricity consumed by a resistor." },
      { id: "d", text: "The physical angle of a motor rotor." }
    ],
    answer: ["a"],
    explanation: "Duty cycle is the ratio of active pulse width (Ton) to total period (T), expressed as a percentage.",
    noteRef: "iot-02-lo06",
    reviewed: false
  },
  {
    loId: "iot-02-lo06",
    type: "scenario",
    difficulty: 2,
    id: "iot-02-q22",
    stem: "A 3.3V microcontroller controls an LED using an 8-bit PWM peripheral (values 0 to 255). If the code writes a duty value of 128 (approx 50%), what is the effective time-averaged voltage delivered?",
    options: [
      { id: "a", text: "1.65V" },
      { id: "b", text: "3.30V" },
      { id: "c", text: "0.825V" },
      { id: "d", text: "2.50V" }
    ],
    answer: ["a"],
    explanation: "50% duty cycle on a 3.3V supply yields an average effective voltage of 3.3 * 0.5 = 1.65V.",
    noteRef: "iot-02-lo06",
    reviewed: false
  },
  {
    loId: "iot-02-lo06",
    type: "single",
    difficulty: 2,
    id: "iot-02-q23",
    stem: "What specific PWM signal is required to position standard hobby servomotors (like SG90)?",
    options: [
      { id: "a", text: "A 50 Hz pulse train (20 ms period) with HIGH pulse width varying between 1.0 ms (0 deg) and 2.0 ms (180 deg)." },
      { id: "b", text: "A 100 kHz square wave at 90% duty." },
      { id: "c", text: "A continuous DC current of 5 Amps." },
      { id: "d", text: "An infrared beam flashing at 38 kHz." }
    ],
    answer: ["a"],
    explanation: "Hobby servos decode pulse duration (1.0ms - 2.0ms) within a 50Hz frame to dictate rotor angle.",
    noteRef: "iot-02-lo06",
    reviewed: false
  },
  {
    loId: "iot-02-lo06",
    type: "single",
    difficulty: 3,
    id: "iot-02-q24",
    stem: "Why does an oscilloscope show full 0V and 3.3V logic levels on a PWM pin regardless of whether the duty cycle is set to 10% or 90%?",
    options: [
      { id: "a", text: "Because PWM alternates digital switches between full HIGH and full LOW; only the time-averaged ratio changes, not the instantaneous voltage amplitude." },
      { id: "b", text: "Because the oscilloscope probe is broken." },
      { id: "c", text: "Because digital pins cannot carry current." },
      { id: "d", text: "Because the microcontroller is operating in sleep mode." }
    ],
    answer: ["a"],
    explanation: "Digital CMOS outputs switch rail-to-rail; PWM synthesizes intermediate power by modulating time duration.",
    noteRef: "iot-02-lo06",
    reviewed: false
  },

  // LO07
  {
    loId: "iot-02-lo07",
    type: "single",
    difficulty: 1,
    id: "iot-02-q25",
    stem: "How does the electrical resistance of a Light Dependent Resistor (LDR) respond when ambient light levels increase?",
    options: [
      { id: "a", text: "Its electrical resistance decreases significantly." },
      { id: "b", text: "Its electrical resistance increases towards infinity." },
      { id: "c", text: "Its resistance remains completely constant." },
      { id: "d", text: "It generates 240V AC electricity." }
    ],
    answer: ["a"],
    explanation: "Photons excite charge carriers in cadmium sulfide (CdS) photoresistors, dropping resistance under light.",
    noteRef: "iot-02-lo07",
    reviewed: false
  },
  {
    loId: "iot-02-lo07",
    type: "scenario",
    difficulty: 2,
    id: "iot-02-q26",
    stem: "An HC-SR04 ultrasonic distance sensor emits an ultrasonic burst, and the Echo pin stays HIGH for 1000 microseconds before receiving the reflection. Assuming sound speed is 0.0343 cm/us, what is the distance to the target?",
    options: [
      { id: "a", text: "17.15 cm" },
      { id: "b", text: "34.30 cm" },
      { id: "c", text: "8.57 cm" },
      { id: "d", text: "68.60 cm" }
    ],
    answer: ["a"],
    explanation: "Distance = (duration * 0.0343) / 2 = (1000 * 0.0343) / 2 = 34.3 / 2 = 17.15 cm.",
    noteRef: "iot-02-lo07",
    reviewed: false
  },
  {
    loId: "iot-02-lo07",
    type: "multi",
    difficulty: 2,
    id: "iot-02-q27",
    stem: "Which of the following precautions must be observed when connecting an HC-SR04 ultrasonic sensor to a 3.3V ESP32 microcontroller?",
    options: [
      { id: "a", text: "The HC-SR04 requires a 5V supply to power its ultrasonic transducers" },
      { id: "b", text: "The 5V Echo output signal must be level-shifted down to 3.3V before entering an ESP32 GPIO pin" },
      { id: "c", text: "A 10 microsecond HIGH trigger pulse must be generated to initiate a measurement ping" },
      { id: "d", text: "The sensor must be submerged in mineral oil" }
    ],
    answer: ["a", "b", "c"],
    explanation: "The sensor runs on 5V and outputs a 5V Echo pulse requiring voltage division; submerging it destroys transducers.",
    noteRef: "iot-02-lo07",
    reviewed: false
  },
  {
    loId: "iot-02-lo07",
    type: "single",
    difficulty: 3,
    id: "iot-02-q28",
    stem: "Why does the DHT22 temperature and humidity sensor require an external 4.7k to 10k Ohm pull-up resistor on its single-wire data bus?",
    options: [
      { id: "a", text: "The communication bus utilizes an open-drain/open-collector topology where devices only pull the line LOW, relying on the resistor to pull the line HIGH." },
      { id: "b", text: "To heat up the temperature sensor." },
      { id: "c", text: "To convert digital packets into audio pulses." },
      { id: "d", text: "To ground stray radio frequencies." }
    ],
    answer: ["a"],
    explanation: "Open-drain buses require pull-up resistors to restore default HIGH idle state without bus contention.",
    noteRef: "iot-02-lo07",
    reviewed: false
  },

  // LO08
  {
    loId: "iot-02-lo08",
    type: "single",
    difficulty: 1,
    id: "iot-02-q29",
    stem: "What primary advantage does an optocoupler provide when interfacing microcontrollers to high-voltage industrial circuits?",
    options: [
      { id: "a", text: "Galvanic electrical isolation using optical light transmission, completely preventing high-voltage surges from reaching the MCU." },
      { id: "b", text: "Doubling the microcontroller's RAM memory." },
      { id: "c", text: "Transmitting data over satellite frequencies." },
      { id: "d", text: "Generating 12V DC power from nothing." }
    ],
    answer: ["a"],
    explanation: "Optocouplers isolate circuits with thousands of volts of dielectric insulation by converting electrical signals to light.",
    noteRef: "iot-02-lo08",
    reviewed: false
  },
  {
    loId: "iot-02-lo08",
    type: "scenario",
    difficulty: 2,
    id: "iot-02-q30",
    stem: "An engineer drives a 12V 2A DC motor using an N-Channel MOSFET. When the ESP32 GPIO outputs 3.3V, the MOSFET gets scorching hot and the motor barely turns. What is the root cause?",
    options: [
      { id: "a", text: "The MOSFET is not logic-level rated; its threshold voltage VGS requires 10V to fully saturate, causing it to operate in the high-resistance linear region at 3.3V." },
      { id: "b", text: "The ESP32 is running out of flash memory." },
      { id: "c", text: "The motor requires an optical fiber connection." },
      { id: "d", text: "The resistor values are too accurate." }
    ],
    answer: ["a"],
    explanation: "Standard power MOSFETs need 10V gate voltage; driving them with 3.3V creates high channel resistance and severe heating.",
    noteRef: "iot-02-lo08",
    reviewed: false
  },
  {
    loId: "iot-02-lo08",
    type: "multi",
    difficulty: 2,
    id: "iot-02-q31",
    stem: "Which components are required in a safe, complete transistor circuit driving a 12V DC electromagnetic solenoid?",
    options: [
      { id: "a", text: "A logic-level N-Channel MOSFET or NPN transistor capable of handling the load current" },
      { id: "b", text: "A flyback diode placed in reverse-parallel across the solenoid coil" },
      { id: "c", text: "A 10k Ohm pull-down resistor from Gate/Base to Ground" },
      { id: "d", text: "A 240V AC step-up transformer" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Switching transistor, flyback diode, and gate pull-down form the robust DC inductive driver circuit.",
    noteRef: "iot-02-lo08",
    reviewed: false
  },
  {
    loId: "iot-02-lo08",
    type: "single",
    difficulty: 3,
    id: "iot-02-q32",
    stem: "Why must the Ground of an external 12V motor power supply be tied together with the Ground of a 3.3V microcontroller?",
    options: [
      { id: "a", text: "To provide a common electrical reference potential so that the gate-to-source voltage (VGS) can be established across the transistor." },
      { id: "b", text: "To allow 12V power to flow into the ESP32 chip." },
      { id: "c", text: "Because electrical codes forbid separate ground terminals." },
      { id: "d", text: "To prevent the breadboard from melting." }
    ],
    answer: ["a"],
    explanation: "Voltage is relative; establishing a shared common ground reference allows the MCU gate signal to be referenced to the source pin.",
    noteRef: "iot-02-lo08",
    reviewed: false
  },

  // LO09 (Extension)
  {
    loId: "iot-02-lo09",
    type: "single",
    difficulty: 2,
    id: "iot-02-q33",
    stem: "What critical risk occurs if a Lithium Polymer (LiPo) battery is discharged below its minimum safe threshold (~2.8V)?",
    options: [
      { id: "a", text: "Copper shunts form internally, causing permanent capacity loss and severe risks of short-circuit fire during subsequent recharge cycles." },
      { id: "b", text: "The battery becomes an alternating current generator." },
      { id: "c", text: "The battery weight increases by 50%." },
      { id: "d", text: "The battery automatically recharges itself." }
    ],
    answer: ["a"],
    explanation: "Over-discharging dissolves copper into the electrolyte; recharging then causes micro-shorts leading to thermal runaway.",
    noteRef: "iot-02-lo09",
    reviewed: false
  },
  {
    loId: "iot-02-lo09",
    type: "scenario",
    difficulty: 2,
    id: "iot-02-q34",
    stem: "An engineer designs an IoT smart plug PCB switching 230V AC mains electricity. What minimum physical clearance and creepage distance should be maintained between mains AC traces and low-voltage DC traces?",
    options: [
      { id: "a", text: "At least 5 to 6 mm of physical isolation distance or an air isolation slot milled into the PCB." },
      { id: "b", text: "0.1 mm" },
      { id: "c", text: "50 cm" },
      { id: "d", text: "No separation is required if solder mask is applied." }
    ],
    answer: ["a"],
    explanation: "IEC 60950/62368 standards mandate 5-6mm creepage/clearance to prevent lethal arcing across mains and DC rails.",
    noteRef: "iot-02-lo09",
    reviewed: false
  },
  {
    loId: "iot-02-lo09",
    type: "multi",
    difficulty: 3,
    id: "iot-02-q35",
    stem: "Which of the following safety measures are mandatory when soldering electronic prototypes?",
    options: [
      { id: "a", text: "Using active fume extraction or soldering in well-ventilated spaces to avoid inhaling rosin flux fumes" },
      { id: "b", text: "Washing hands thoroughly after handling lead-based solder alloys" },
      { id: "c", text: "Resting the hot soldering iron exclusively in a dedicated heat-resistant stand" },
      { id: "d", text: "Testing iron tip temperature by touching it with bare fingers" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Fume ventilation, hygiene, and safe iron stands are essential laboratory safety practices.",
    noteRef: "iot-02-lo09",
    reviewed: false
  },
  {
    loId: "iot-02-lo09",
    type: "single",
    difficulty: 3,
    id: "iot-02-q36",
    stem: "Why are battery management ICs (like the TP4056 paired with DW01A) mandatory for Lithium-ion powered IoT devices?",
    options: [
      { id: "a", text: "They enforce Constant-Current/Constant-Voltage (CC/CV) charging profiles and cut off power during overcharge (>4.2V), over-discharge (<2.8V), or short circuits." },
      { id: "b", text: "They allow charging from high-voltage AC mains without transformers." },
      { id: "c", text: "They eliminate the need for batteries." },
      { id: "d", text: "They convert lithium batteries into solar cells." }
    ],
    answer: ["a"],
    explanation: "Lithium cells lack self-balancing and violently fail if overcharged or shorted; protection ICs prevent disaster.",
    noteRef: "iot-02-lo09",
    reviewed: false
  }
];

balanceAndSave('iot', 'electronics-sensors-and-actuators', ch02Objectives, ch02Questions);

// ==========================================
// CHAPTER 03: microcontrollers-esp32-and-arduino (iot-03) [moderate]
// ==========================================

const ch03Objectives = {
  version: 1,
  chapterId: "iot-03",
  objectives: [
    {
      id: "iot-03-lo01",
      order: 1,
      title: "Compare microcontrollers (MCU) with microprocessors (MPU/SBC) across architecture, power, and real-time execution",
      bloom: "compare",
      tier: "core",
      mustHave: true,
      keywords: ["mcu vs mpu", "bare metal", "operating system overhead", "power consumption", "deterministic latency"],
      aliases: ["microcontroller vs microprocessor", "esp32 vs raspberry pi"],
      prerequisites: ["iot-01-lo02"],
      estMinutes: 12
    },
    {
      id: "iot-03-lo02",
      order: 2,
      title: "Benchmark specifications of Arduino Uno, ESP32, and Raspberry Pi Pico",
      bloom: "benchmark",
      tier: "core",
      mustHave: true,
      keywords: ["atmega328p", "esp32 xtensa", "rp2040", "clock speed", "ram capacity", "operating voltage"],
      aliases: ["microcontroller comparison", "esp32 specs", "arduino vs esp32"],
      prerequisites: ["iot-03-lo01"],
      estMinutes: 14
    },
    {
      id: "iot-03-lo03",
      order: 3,
      title: "Configure General Purpose Input/Output (GPIO) modes and manage pin multiplexing",
      bloom: "configure",
      tier: "core",
      mustHave: true,
      keywords: ["gpio", "pinmode", "digitalread", "digitalwrite", "input-only pins", "pin multiplexing"],
      aliases: ["gpio configuration", "esp32 pinout"],
      prerequisites: ["iot-02-lo02"],
      estMinutes: 14
    },
    {
      id: "iot-03-lo04",
      order: 4,
      title: "Design power distribution architectures and brownout protection using Low-Dropout (LDO) regulators",
      bloom: "design",
      tier: "core",
      mustHave: false,
      keywords: ["ldo regulator", "ams1117", "brownout detector", "decoupling", "3.3v power rail"],
      aliases: ["mcu power circuit", "esp32 brownout"],
      prerequisites: ["iot-02-lo01"],
      estMinutes: 12
    },
    {
      id: "iot-03-lo05",
      order: 5,
      title: "Execute firmware flashing workflows via UART bootloaders and auto-reset circuitry",
      bloom: "execute",
      tier: "core",
      mustHave: false,
      keywords: ["uart flashing", "bootloader", "dtr rts circuit", "esptool", "flashing sequence"],
      aliases: ["firmware flashing", "esp32 bootloader", "auto-reset circuit"],
      prerequisites: ["iot-03-lo03"],
      estMinutes: 12
    },
    {
      id: "iot-03-lo06",
      order: 6,
      title: "Develop embedded projects using Arduino IDE and VS Code with PlatformIO",
      bloom: "implement",
      tier: "core",
      mustHave: false,
      keywords: ["platformio", "arduino ide", "platformio.ini", "library dependency", "build systems"],
      aliases: ["embedded ide", "platformio workflow"],
      prerequisites: ["iot-03-lo05"],
      estMinutes: 12
    },
    {
      id: "iot-03-lo07",
      order: 7,
      title: "Simulate microcontroller circuits and firmware behaviors using Wokwi",
      bloom: "simulate",
      tier: "core",
      mustHave: false,
      keywords: ["wokwi", "simulation", "diagram.json", "virtual breadboard", "logic debugging"],
      aliases: ["mcu simulator", "wokwi simulation"],
      prerequisites: ["iot-03-lo06"],
      estMinutes: 12
    },
    {
      id: "iot-03-lo08",
      order: 8,
      title: "Interpret manufacturer datasheets and pinout diagrams for pin sink/source current limits",
      bloom: "interpret",
      tier: "core",
      mustHave: true,
      keywords: ["datasheet", "pinout diagram", "absolute maximum ratings", "sink current", "source current"],
      aliases: ["reading datasheets", "pin current limits"],
      prerequisites: ["iot-03-lo03"],
      estMinutes: 14
    },
    {
      id: "iot-03-lo09",
      order: 9,
      title: "Utilize ESP32 capacitive touch sensing and Low-Power (ULP) coprocessor capabilities",
      bloom: "implement",
      tier: "extension",
      mustHave: false,
      keywords: ["touch pins", "ulp coprocessor", "capacitive sensing", "deep sleep wakeup", "low power"],
      aliases: ["esp32 touch sensing", "ulp programming"],
      prerequisites: ["iot-03-lo03"],
      estMinutes: 12
    }
  ]
};

// Notes for iot-03

writeNoteBlock('iot', 'microcontrollers-esp32-and-arduino', 'iot-03-lo01',
  `Choosing between a microcontroller (MCU) and a microprocessor (MPU/SBC) determines an IoT device's cost, battery life, and software architecture:
1. Microcontroller (MCU - e.g., ESP32, STM32, ATmega328P): Integrates CPU, RAM, Flash memory, and I/O peripherals onto a single monolithic silicon die. Executes bare-metal C/C++ firmware or a lightweight Real-Time Operating System (FreeRTOS) with zero OS boot delays, microsecond response times, and milliwatt power consumption ($<15\\text{mA}$ active, $<10\\mu\\text{A}$ sleep).
2. Microprocessor / Single-Board Computer (MPU/SBC - e.g., Raspberry Pi 4/5): Houses a high-speed multi-core CPU requiring external DDR RAM, eMMC/microSD storage, and complex power management ICs (PMICs). Runs full desktop Linux, boots in tens of seconds, consumes several watts ($500\\text{mA} - 3000\\text{mA}$ at $5\\text{V}$), and cannot guarantee deterministic microsecond real-time I/O response due to OS kernel scheduling interrupts.
3. Summary Decision Rule: Use an MCU for dedicated, battery-powered sensor nodes, motor control, and hard real-time tasks. Use an MPU when heavy graphical displays, video processing, local databases, or complex networking stacks are required.`,
  `Python script comparing battery life for MCU vs MPU nodes:
\`\`\`python
def estimate_battery_life_days(capacity_mah, active_ma, sleep_ma, active_seconds_per_hour):
    duty_cycle = active_seconds_per_hour / 3600.0
    avg_current_ma = (active_ma * duty_cycle) + (sleep_ma * (1.0 - duty_cycle))
    battery_life_hours = capacity_mah / avg_current_ma
    return round(battery_life_hours / 24.0, 1)

# 2500mAh battery running 10s sensor check every hour
mcu_days = estimate_battery_life_days(2500, active_ma=30.0, sleep_ma=0.01, active_seconds_per_hour=10)
mpu_days = estimate_battery_life_days(2500, active_ma=600.0, sleep_ma=150.0, active_seconds_per_hour=10)

print(f"MCU Battery Life: {mcu_days} days | MPU Battery Life: {mpu_days} days")
# MCU: ~950+ days (years) vs MPU: ~0.7 days (hours)
\`\`\``,
  `Deploying a full Raspberry Pi 4 running Linux for a simple remote soil-moisture sensor, exhausting a rechargeable battery pack in less than 24 hours while an ESP32 would run for two years on AA batteries.`,
  `Why can a bare-metal microcontroller guarantee hard real-time timing that a standard Linux single-board computer cannot?`
);

writeNoteBlock('iot', 'microcontrollers-esp32-and-arduino', 'iot-03-lo02',
  `Modern embedded engineering requires selecting the exact microcontroller family suited to project requirements:
1. Arduino Uno (ATmega328P):
   - CPU Architecture: 8-bit AVR RISC @ $16\\text{MHz}$.
   - Memory: $32\\text{KB}$ Flash, $2\\text{KB}$ SRAM, $1\\text{KB}$ EEPROM.
   - Operating Logic: $5.0\\text{V}$. No native wireless connectivity.
   - Ideal For: Absolute beginners learning introductory digital I/O and electronics basics.
2. ESP32 (Espressif Systems):
   - CPU Architecture: 32-bit Dual-Core Tensilica Xtensa LX6 @ up to $240\\text{MHz}$.
   - Memory: $448\\text{KB}$ ROM, $520\\text{KB}$ internal SRAM, typically $4\\text{MB}-16\\text{MB}$ external SPI Flash.
   - Wireless: Integrated $2.4\\text{GHz}$ Wi-Fi ($802.11\\text{b/g/n}$) and Bluetooth 4.2 / BLE.
   - Operating Logic: $3.3\\text{V}$ strictly.
   - Ideal For: Connected IoT edge nodes, MQTT telemetry, sensor hubs.
3. Raspberry Pi Pico (RP2040):
   - CPU Architecture: 32-bit Dual-Core ARM Cortex-M0+ @ $133\\text{MHz}$.
   - Memory: $264\\text{KB}$ SRAM, external SPI Flash ($2\\text{MB}$).
   - Unique Feature: Programmable I/O (PIO) state machines for custom hardware protocol generation without CPU loading.`,
  `Comparing raw computing power across platforms:
\`\`\`python
platforms = [
    {"name": "Arduino Uno", "mhz": 16, "cores": 1, "ram_kb": 2, "wifi": False},
    {"name": "RP2040 (Pico)", "mhz": 133, "cores": 2, "ram_kb": 264, "wifi": False},
    {"name": "ESP32", "mhz": 240, "cores": 2, "ram_kb": 520, "wifi": True}
]

for p in platforms:
    print(f"{p['name']}: {p['cores']} core(s) @ {p['mhz']} MHz, {p['ram_kb']} KB RAM, Wi-Fi: {p['wifi']}")
\`\`\``,
  `Applying 5V logic signals directly to an ESP32 GPIO pin because you previously used an Arduino Uno; the ESP32 is strictly a 3.3V device and 5V inputs permanently damage internal input buffers.`,
  `What is the clock speed and internal SRAM capacity difference between an Arduino Uno and an ESP32?`
);

writeNoteBlock('iot', 'microcontrollers-esp32-and-arduino', 'iot-03-lo03',
  `General Purpose Input/Output (GPIO) pins connect the MCU processor core to external circuits through configurable hardware registers:
1. Operating Modes:
   - \`INPUT\`: Pin is configured in high-impedance state ($>100\\text{M}\\Omega$), drawing negligible current to sample external voltages without loading the signal source.
   - \`INPUT_PULLUP\`: Activates an internal weak resistor (typically $20\\text{k}\\Omega - 50\\text{k}\\Omega$) pulling the pin to $V_{CC}$ when unconnected.
   - \`OUTPUT\`: Drives the pin actively to $V_{CC}$ (HIGH) through a P-channel MOSFET or to Ground (LOW) through an N-channel MOSFET.
2. ESP32 Pin Limitations & Gotchas:
   - Input-Only Pins (GPIO 34, 35, 36, 39): These pins lack internal output drivers and pull-up/pull-down resistors. They can ONLY be used as analog or digital inputs.
   - Strapping Pins (GPIO 0, 2, 5, 12, 15): Sampled during boot to determine flashing and boot modes. Connecting external hardware pulling these pins LOW or HIGH during power-up prevents normal firmware execution.
   - SPI Flash Pins (GPIO 6-11): Connected directly to the integrated SPI flash memory die; never use them for general I/O.`,
  `Arduino C++ GPIO configuration demonstrating output and input-with-pullup:
\`\`\`cpp
const int LED_PIN = 2;       // Onboard blue LED on most ESP32 boards
const int BUTTON_PIN = 14;   // External push button

void setup() {
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
}

void loop() {
  int button_state = digitalRead(BUTTON_PIN);
  if (button_state == LOW) { // Button pressed to Ground
    digitalWrite(LED_PIN, HIGH);
  } else {
    digitalWrite(LED_PIN, LOW);
  }
}
\`\`\``,
  `Attempting to use ESP32 GPIO 34, 35, 36, or 39 as digital outputs; calling \`digitalWrite\` on these pins fails silently because they lack internal push-pull output driver transistors.`,
  `Why can GPIO pins 34, 35, 36, and 39 on an ESP32 never be used to drive an external LED?`
);

writeNoteBlock('iot', 'microcontrollers-esp32-and-arduino', 'iot-03-lo04',
  `Microcontrollers require clean, ripple-free power rails to prevent erratic execution, memory corruption, and spontaneous brownout resets:
1. Low-Dropout (LDO) Regulators: Linear regulators (such as the AMS1117-3.3) step down $5\\text{V}$ USB or battery inputs to a stable $3.3\\text{V}$. The "dropout voltage" ($V_{\\text{drop}} \\approx 1.0\\text{V}-1.2\\text{V}$) dictates that input voltage must exceed $3.3 + 1.2 = 4.5\\text{V}$ for regulation to hold.
2. ESP32 Wi-Fi Current Spikes: When the ESP32 Wi-Fi radio powers up and negotiates with an access point, it draws instantaneous RF transmission current spikes up to $500\\text{mA}$ for tens of microseconds. If power traces are thin or decoupling capacitors are absent, the $3.3\\text{V}$ rail dips below $\\sim 2.8\\text{V}$.
3. Brownout Detector (BOD): An internal hardware comparator continuously monitors $V_{DD}$. If supply voltage sags below threshold, the BOD immediately triggers a hardware reset to prevent executing corrupted instructions.
4. Mitigation Architecture: Place a $100\\mu\\text{F}$ electrolytic or tantalum capacitor in parallel with a $0.1\\mu\\text{F}$ ceramic capacitor right across the ESP32 $3.3\\text{V}$ and GND pins.`,
  `ESP32 brownout reboot signature in serial monitor logs:
\`\`\`text
rst:0x10 (RTCWDT_RTC_RESET),boot:0x13 (SPI_FAST_FLASH_BOOT)
configsip: 0, SPIWP:0xee
clk_drv:0x00,q_drv:0x00,d_drv:0x00,cs0_drv:0x00,hd_drv:0x00,wp_drv:0x00
mode:DIO, clock div:2
Brownout detector was triggered

ets Jun  8 2016 00:22:57
\`\`\`
Remediation: Upgrade the USB power supply/cable or add a $100\\mu\\text{F}$ capacitor across the $3.3\\text{V}$ rail.`,
  `Powering an ESP32 with Wi-Fi enabled directly from an Arduino Uno's onboard 3.3V pin, which is typically rated for only 50mA; the Wi-Fi current burst triggers an immediate perpetual brownout reset loop.`,
  `What specific hardware condition causes the ESP32 to output "Brownout detector was triggered" in serial logs?`
);

writeNoteBlock('iot', 'microcontrollers-esp32-and-arduino', 'iot-03-lo05',
  `Flashing firmware to modern microcontrollers relies on integrated hardware bootloaders and automated serial handshakes:
1. ROM Bootloader: Buried in read-only hardware memory at silicon fabrication. When reset occurs, the CPU jumps to address 0 and checks strapping pin voltages (notably GPIO 0 on ESP32).
   - If GPIO 0 is LOW at boot: The MCU enters UART Download Mode, waiting for new firmware images over serial (GPIO 1 TX, GPIO 3 RX).
   - If GPIO 0 is HIGH at boot: The MCU enters Normal SPI Flash Boot Mode, executing stored application code.
2. Auto-Reset Circuitry (DTR/RTS): Development boards incorporate two small NPN transistors (e.g., S8050) bridging the USB-to-UART bridge (CP2102, CH340) control lines:
   - DTR and RTS signals from the host computer automatically pull EN (reset) LOW, then pull GPIO 0 LOW, and release EN, placing the board into download mode without manual button pressing.
3. Command-Line Flashing with \`esptool.py\`: Compiles binary partitions (bootloader, partition-table, app.bin) and writes them over serial at speeds up to $921600\\text{ baud}$.`,
  `Flashing firmware manually from the command line using esptool:
\`\`\`bash
# Read chip MAC address and flash parameters
esptool.py --port /dev/ttyUSB0 flash_id

# Write compiled application binary at 460800 baud
esptool.py --chip esp32 --port /dev/ttyUSB0 --baud 460800 write_flash \
  0x1000 bootloader.bin \
  0x8000 partitions.bin \
  0x10000 firmware.bin
\`\`\``,
  `Holding a development board in download mode permanently by leaving a jumper connecting GPIO 0 directly to Ground; the board will flash successfully but will never boot and run the application code upon power cycle.`,
  `What logic state must ESP32 GPIO 0 be held at during power-on reset to enter UART firmware download mode?`
);

writeNoteBlock('iot', 'microcontrollers-esp32-and-arduino', 'iot-03-lo06',
  `Embedded development environments have evolved from simple scripting toys into professional, version-controlled engineering toolchains:
1. Arduino IDE: Provides a beginner-friendly monolithic interface with integrated library managers and serial monitors. Hides compiler flags, build directories, and linker scripts. Suitable for quick prototyping and educational experiments.
2. PlatformIO (VS Code Extension): A modern, professional embedded development ecosystem:
   - Project Configuration (\`platformio.ini\`): Declares the target platform (e.g., \`espressif32\`), framework (\`arduino\`, \`espidf\`), board model, and explicit library dependencies with semantic version pinning (\`lib_deps\`).
   - Cross-Platform Compilation: Automates toolchain downloads (GCC cross-compilers, flashing utilities, OpenOCD debuggers) without modifying system path variables.
   - Git Integration: Configuration files and code reside in standard source trees, making projects fully reproducible across development team members.`,
  `A production-grade \`platformio.ini\` configuration file:
\`\`\`ini
[env:esp32dev]
platform = espressif32 @ 6.5.0
board = esp32dev
framework = arduino
monitor_speed = 115200
upload_speed = 921600

lib_deps = 
    knolleary/PubSubClient @ ^2.8
    bblanchon/ArduinoJson @ ^7.0.0
    adafruit/DHT sensor library @ ^1.4.6

build_flags = 
    -D CORE_DEBUG_LEVEL=3
\`\`\``,
  `Sharing an Arduino IDE sketch folder without documenting which external library versions were installed from the web, causing compile failures on other machines due to breaking API differences.`,
  `What primary benefit does declaring explicit library versions in PlatformIO's \`platformio.ini\` file provide?`
);

writeNoteBlock('iot', 'microcontrollers-esp32-and-arduino', 'iot-03-lo07',
  `Circuit simulators accelerate embedded development by enabling rapid hardware-firmware prototyping in the browser without physical hardware risks:
1. Wokwi Simulator: An open-source, cycle-accurate browser simulator modeling microcontrollers (ESP32, RP2040, Arduino Uno) and dozens of sensors, OLED displays, relays, and actuators.
2. Architecture & Configuration (\`diagram.json\`): Defines components and virtual jumper wire routing using human-readable JSON. Simulates SPI, I2C, UART, and analog signals with high fidelity.
3. Virtual Wi-Fi Simulation: Wokwi models ESP32 Wi-Fi hardware, permitting virtual devices to connect to an emulated internet gateway (\`Wokwi-GUEST\`) and exchange live MQTT messages, HTTP GET/POST requests, and NTP time packets.
4. Fast Debugging Cycles: Test edge cases (such as sensor disconnects, invalid checksums, and power brownouts) instantly without risk of blowing fuses or frying expensive chips.`,
  `Wokwi \`diagram.json\` connecting an ESP32 to a DHT22 sensor:
\`\`\`json
{
  "version": 1,
  "author": "IoT Engineer",
  "parts": [
    { "type": "wokwi-esp32-devkit-v1", "id": "esp", "top": 0, "left": 0 },
    { "type": "wokwi-dht22", "id": "dht", "top": -50, "left": 150 }
  ],
  "connections": [
    [ "esp:GND.1", "dht:GND", "black", [ "v0" ] ],
    [ "esp:3V3", "dht:VCC", "red", [ "v0" ] ],
    [ "esp:D15", "dht:SDA", "green", [ "v0" ] ]
  ]
}
\`\`\``,
  `Assuming a browser simulation models physical parasitic capacitance, contact resistance, and real-world RF antenna attenuation perfectly; code verified in Wokwi must still undergo physical hardware verification.`,
  `How does virtual Wi-Fi emulation in Wokwi assist in testing networked IoT firmware before flashing physical hardware?`
);

writeNoteBlock('iot', 'microcontrollers-esp32-and-arduino', 'iot-03-lo08',
  `Reading manufacturer datasheets and pinout diagrams is the fundamental skill distinguishing professional hardware engineers from hobbyists:
1. Absolute Maximum Ratings: Operating limits (voltage, current, temperature) that must never be exceeded, even for a microsecond. Exceeding absolute maximums causes irreversible dielectric breakdown or thermal fusing inside the silicon die.
2. Pin Sink and Source Current Limits:
   - Sourcing Current: Current flowing *out* of an MCU GPIO pin into an external load tied to Ground.
   - Sinking Current: Current flowing *into* an MCU GPIO pin from an external load tied to $V_{CC}$.
   - ATmega328P: Maximum $40\\text{mA}$ per pin ($20\\text{mA}$ recommended), with total chip package limit of $200\\text{mA}$.
   - ESP32: Maximum $20\\text{mA}-40\\text{mA}$ per pin depending on drive strength, with recommended continuous operation below $12\\text{mA}$ to prevent rail voltage drop.
3. Pin Multiplexing & Alternate Functions: Modern MCU pins serve multiple internal peripherals (UART, I2C, SPI, PWM, ADC, capacitive touch). The datasheet pinout table identifies which pins support specific hardware blocks.`,
  `Calculating total package current budget for an ESP32:
\`\`\`python
def evaluate_gpio_current_budget(active_outputs, current_per_pin_ma, package_limit_ma=1200):
    total_gpio_current = sum(active_outputs)
    is_safe = total_gpio_current < package_limit_ma
    return {
        "total_current_ma": total_gpio_current,
        "within_safety_limits": is_safe,
        "remaining_budget_ma": package_limit_ma - total_gpio_current
    }

# 8 LEDs drawing 10mA each from GPIO pins
load = [10] * 8
report = evaluate_gpio_current_budget(load, current_per_pin_ma=10, package_limit_ma=250)
print(f"Total Current: {report['total_current_ma']} mA, Safe: {report['within_safety_limits']}")
\`\`\``,
  `Connecting 10 LEDs directly to MCU GPIO pins each drawing 20mA; while individual pins may stay within limits, the cumulative 200mA current burns the chip's internal Ground bonding wires.`,
  `What is the difference between a GPIO pin's "Absolute Maximum" rating and its "Recommended Operating" rating in a datasheet?`
);

writeNoteBlock('iot', 'microcontrollers-esp32-and-arduino', 'iot-03-lo09',
  `The ESP32 incorporates dedicated hardware subsystems for low-power operation and human interface sensing without external active components:
1. Capacitive Touch Sensing: Includes up to 10 capacitive touch pads (T0-T9, shared with GPIOs like GPIO 4, 15, 27). The internal hardware continuously charges and discharges a capacitive RC circuit. Touching a conductive pad or insulated wire introduces human body capacitance ($50\\text{pF}-100\\text{pF}$), increasing charge time and lowering the returned digital count.
2. Ultra-Low-Power (ULP) Coprocessor: A simple 32-bit RISC-V or FSM coprocessor that continues executing assembly or limited C instructions while the primary dual-core Xtensa CPUs are in deep sleep mode ($10\\mu\\text{A}$ power draw).
3. Wakeup Triggers: The ULP can poll I2C sensors, sample ADC voltages, or detect touch events. When a threshold condition is met (e.g., temperature exceeds $40^{\\circ}\\text{C}$ or touch detected), it asserts an interrupt that boots the primary CPU cores.`,
  `Reading capacitive touch pins in Arduino framework on ESP32:
\`\`\`cpp
const int TOUCH_PIN = 4; // Touch0 is on GPIO 4
const int THRESHOLD = 30; // Lower value indicates finger presence

void setup() {
  Serial.begin(115200);
}

void loop() {
  int touch_val = touchRead(TOUCH_PIN);
  if (touch_val < THRESHOLD) {
    Serial.println("Capacitive Touch Detected!");
  }
  delay(100);
}
\`\`\``,
  `Leaving touch pins connected with long, unshielded wires in environments with high electrical noise (near AC motors), causing false touch activations due to electromagnetic interference.`,
  `Why does an ESP32's \`touchRead()\` function return a lower numerical value when a user touches the pin?`
);

// Questions for iot-03
const ch03Questions = [
  // LO01
  {
    loId: "iot-03-lo01",
    type: "single",
    difficulty: 1,
    id: "iot-03-q01",
    stem: "What architectural feature primarily distinguishes a microcontroller (MCU) from a microprocessor (MPU/SBC)?",
    options: [
      { id: "a", text: "An MCU integrates CPU, RAM, ROM/Flash, and I/O peripherals onto a single monolithic silicon chip." },
      { id: "b", text: "An MCU requires a separate external motherboard and graphics card." },
      { id: "c", text: "An MCU only processes analog audio signals." },
      { id: "d", text: "An MCU always runs desktop Microsoft Windows." }
    ],
    answer: ["a"],
    explanation: "MCUs integrate processor, memory, and peripheral controllers on one die for dedicated embedded control.",
    noteRef: "iot-03-lo01",
    reviewed: false
  },
  {
    loId: "iot-03-lo01",
    type: "scenario",
    difficulty: 2,
    id: "iot-03-q02",
    stem: "An engineer is designing a battery-powered agricultural sensor node that must sleep for 59 minutes and wake up for 5 seconds to take readings over 3 years. Which compute platform is appropriate?",
    options: [
      { id: "a", text: "A low-power 32-bit microcontroller with deep-sleep modes drawing microamps." },
      { id: "b", text: "A Raspberry Pi 4 running Ubuntu Linux." },
      { id: "c", text: "An Intel Core i7 desktop computer." },
      { id: "d", text: "A high-end smartphone with display permanently on." }
    ],
    answer: ["a"],
    explanation: "MCUs draw microamps in deep sleep, enabling multi-year battery lifespans impossible for OS-based SBCs.",
    noteRef: "iot-03-lo01",
    reviewed: false
  },
  {
    loId: "iot-03-lo01",
    type: "single",
    difficulty: 2,
    id: "iot-03-q03",
    stem: "Why can a bare-metal microcontroller guarantee hard real-time execution that standard desktop Linux cannot?",
    options: [
      { id: "a", text: "Bare-metal firmware executes instructions directly on hardware without non-deterministic OS kernel scheduling or background preemptive thread context switches." },
      { id: "b", text: "Because microcontrollers operate at higher clock speeds than supercomputers." },
      { id: "c", text: "Because Linux does not have a CPU clock." },
      { id: "d", text: "Microcontrollers are physically smaller." }
    ],
    answer: ["a"],
    explanation: "Bare-metal or RTOS on an MCU executes deterministic code paths with predictable microsecond interrupt latencies.",
    noteRef: "iot-03-lo01",
    reviewed: false
  },
  {
    loId: "iot-03-lo01",
    type: "numeric",
    difficulty: 3,
    id: "iot-03-q04",
    stem: "If a low-power MCU draws an average current of 0.1 mA, how many continuous hours can it run on a 2000 mAh battery?",
    options: [
      { id: "a", text: "20000" },
      { id: "b", text: "200" },
      { id: "c", text: "2000" },
      { id: "d", text: "500" }
    ],
    answer: ["a"],
    explanation: "Battery life hours = Capacity / Average Current = 2000 mAh / 0.1 mA = 20,000 hours (~2.28 years).",
    noteRef: "iot-03-lo01",
    verify: "(2000 / 0.1 === 20000)",
    reviewed: false
  },

  // LO02
  {
    loId: "iot-03-lo02",
    type: "single",
    difficulty: 1,
    id: "iot-03-q05",
    stem: "What is the maximum operating CPU clock speed of a standard ESP32 dual-core microcontroller?",
    options: [
      { id: "a", text: "240 MHz" },
      { id: "b", text: "16 MHz" },
      { id: "c", text: "1.5 GHz" },
      { id: "d", text: "4 MHz" }
    ],
    answer: ["a"],
    explanation: "The ESP32 Xtensa dual-core processor operates at configurable frequencies up to 240 MHz.",
    noteRef: "iot-03-lo02",
    reviewed: false
  },
  {
    loId: "iot-03-lo02",
    type: "scenario",
    difficulty: 2,
    id: "iot-03-q06",
    stem: "A developer wants to upgrade an Arduino Uno project to an ESP32. What critical logic voltage difference must they accommodate to prevent frying the ESP32?",
    options: [
      { id: "a", text: "The Arduino Uno operates at 5.0V logic, whereas the ESP32 operates at 3.3V logic and is not 5V-tolerant." },
      { id: "b", text: "The ESP32 runs exclusively on 120V AC." },
      { id: "c", text: "The Arduino operates at 1.8V while ESP32 operates at 12V." },
      { id: "d", text: "There is no difference in logic voltages." }
    ],
    answer: ["a"],
    explanation: "Arduino Uno is a 5.0V system; ESP32 is strictly 3.3V and connecting 5.0V inputs permanently destroys pins.",
    noteRef: "iot-03-lo02",
    reviewed: false
  },
  {
    loId: "iot-03-lo02",
    type: "multi",
    difficulty: 2,
    id: "iot-03-q07",
    stem: "Which of the following built-in wireless capabilities are integrated directly onto standard ESP32 silicon?",
    options: [
      { id: "a", text: "2.4 GHz Wi-Fi (802.11 b/g/n)" },
      { id: "b", text: "Bluetooth v4.2 and Bluetooth Low Energy (BLE)" },
      { id: "c", text: "5G Cellular NR mmWave" },
      { id: "d", text: "Satellite GPS Receiver" }
    ],
    answer: ["a", "b"],
    explanation: "The ESP32 integrates 2.4 GHz Wi-Fi and Bluetooth/BLE radio hardware; cellular and GPS require external modules.",
    noteRef: "iot-03-lo02",
    reviewed: false
  },
  {
    loId: "iot-03-lo02",
    type: "single",
    difficulty: 3,
    id: "iot-03-q08",
    stem: "What unique hardware subsystem on the Raspberry Pi Pico (RP2040) allows generating custom high-speed digital protocols without CPU overhead?",
    options: [
      { id: "a", text: "Programmable I/O (PIO) state machines" },
      { id: "b", text: "Integrated GPU" },
      { id: "c", text: "Hardware thermal printer" },
      { id: "d", text: "Optical disc drive" }
    ],
    answer: ["a"],
    explanation: "RP2040 features 8 Programmable I/O (PIO) state machines to bit-bang protocols without loading CPU cores.",
    noteRef: "iot-03-lo02",
    reviewed: false
  },

  // LO03
  {
    loId: "iot-03-lo03",
    type: "single",
    difficulty: 1,
    id: "iot-03-q09",
    stem: "Which ESP32 GPIO pins are strictly INPUT-ONLY and lack internal output driver transistors?",
    options: [
      { id: "a", text: "GPIO 34, 35, 36, and 39" },
      { id: "b", text: "GPIO 2, 4, 12, and 14" },
      { id: "c", text: "GPIO 16 and 17" },
      { id: "d", text: "GPIO 21 and 22" }
    ],
    answer: ["a"],
    explanation: "GPIOs 34-39 on the ESP32 are input-only pins without output driver circuitry or internal pull resistors.",
    noteRef: "iot-03-lo03",
    reviewed: false
  },
  {
    loId: "iot-03-lo03",
    type: "scenario",
    difficulty: 2,
    id: "iot-03-q10",
    stem: "An engineer attaches an external circuit to ESP32 GPIO 0. When powered on, the ESP32 refuses to run firmware and gets stuck in download mode. What caused this?",
    options: [
      { id: "a", text: "GPIO 0 is a strapping pin; the external circuit pulled it LOW during boot, forcing the chip into UART flashing mode." },
      { id: "b", text: "GPIO 0 is reserved for AC mains power." },
      { id: "c", text: "The USB cable was too long." },
      { id: "d", text: "The microcontroller was in deep sleep." }
    ],
    answer: ["a"],
    explanation: "Strapping pins (like GPIO 0) configure boot behavior; pulling GPIO 0 LOW at boot forces flashing mode.",
    noteRef: "iot-03-lo03",
    reviewed: false
  },
  {
    loId: "iot-03-lo03",
    type: "single",
    difficulty: 2,
    id: "iot-03-q11",
    stem: "Why are GPIO pins 6 through 11 on standard ESP32 development modules unavailable for user circuits?",
    options: [
      { id: "a", text: "They are internally connected to the on-module SPI Flash memory chip." },
      { id: "b", text: "They are dedicated high-voltage AC terminals." },
      { id: "c", text: "They are reserved for audio microphones." },
      { id: "d", text: "They are dummy pins with no physical connection." }
    ],
    answer: ["a"],
    explanation: "Pins 6-11 route directly to the SPI flash die; connecting external circuits crashes program execution.",
    noteRef: "iot-03-lo03",
    reviewed: false
  },
  {
    loId: "iot-03-lo03",
    type: "single",
    difficulty: 3,
    id: "iot-03-q12",
    stem: "What electrical state is a GPIO pin configured in when initialized with `pinMode(pin, INPUT)`?",
    options: [
      { id: "a", text: "High-Impedance (Hi-Z) state with resistance over 100 Mega-Ohms, minimizing circuit loading." },
      { id: "b", text: "Direct connection to Ground with 0 Ohms resistance." },
      { id: "c", text: "Direct connection to 3.3V through a power transistor." },
      { id: "d", text: "Continuous 50Hz oscillation." }
    ],
    answer: ["a"],
    explanation: "Digital input mode disconnects drivers, presenting a high-impedance (Hi-Z) listening state to avoid loading signals.",
    noteRef: "iot-03-lo03",
    reviewed: false
  },

  // LO04
  {
    loId: "iot-03-lo04",
    type: "single",
    difficulty: 1,
    id: "iot-03-q13",
    stem: "What is the primary function of a Low-Dropout (LDO) voltage regulator like the AMS1117-3.3?",
    options: [
      { id: "a", text: "Stepping down a higher DC input voltage (e.g. 5V) to a stable, regulated 3.3V rail for the MCU." },
      { id: "b", text: "Converting DC battery power into 230V AC." },
      { id: "c", text: "Amplifying radio frequencies for long-range Wi-Fi." },
      { id: "d", text: "Flashing firmware over Bluetooth." }
    ],
    answer: ["a"],
    explanation: "LDO regulators maintain a stable, clean output voltage (such as 3.3V) from a higher input supply.",
    noteRef: "iot-03-lo04",
    reviewed: false
  },
  {
    loId: "iot-03-lo04",
    type: "scenario",
    difficulty: 2,
    id: "iot-03-q14",
    stem: "An ESP32 board repeatedly prints 'Brownout detector was triggered' in serial logs whenever `WiFi.begin()` is called. What is the root cause?",
    options: [
      { id: "a", text: "The 3.3V power supply cannot satisfy the transient 500mA RF calibration current surge, causing voltage to sag below the reset threshold." },
      { id: "b", text: "The Wi-Fi password contains special characters." },
      { id: "c", text: "The antenna is detecting too many radio stations." },
      { id: "d", text: "The ESP32 has run out of memory." }
    ],
    answer: ["a"],
    explanation: "Wi-Fi radio initialization draws sudden 500mA current bursts; inadequate supplies sag voltage, tripping the BOD.",
    noteRef: "iot-03-lo04",
    reviewed: false
  },
  {
    loId: "iot-03-lo04",
    type: "single",
    difficulty: 2,
    id: "iot-03-q15",
    stem: "If an LDO linear regulator has a dropout voltage of 1.1V, what is the absolute minimum input voltage required to maintain a regulated 3.3V output?",
    options: [
      { id: "a", text: "4.4V" },
      { id: "b", text: "3.3V" },
      { id: "c", text: "2.2V" },
      { id: "d", text: "5.5V" }
    ],
    answer: ["a"],
    explanation: "Vmin = Vout + Vdropout = 3.3V + 1.1V = 4.4V.",
    noteRef: "iot-03-lo04",
    reviewed: false
  },
  {
    loId: "iot-03-lo04",
    type: "single",
    difficulty: 3,
    id: "iot-03-q16",
    stem: "Why is placing a 100 uF electrolytic capacitor directly across the ESP32 3.3V and Ground pins an effective solution for Wi-Fi brownouts?",
    options: [
      { id: "a", text: "It serves as an immediate local charge reservoir that supplies transient peak current during RF transmission bursts, preventing rail sag." },
      { id: "b", text: "It doubles the radio transmission range." },
      { id: "c", text: "It speeds up the CPU clock." },
      { id: "d", text: "It encrypts network packets in hardware." }
    ],
    answer: ["a"],
    explanation: "Bulk capacitors deliver localized high-current spikes during RF transmission bursts, keeping the 3.3V rail stiff.",
    noteRef: "iot-03-lo04",
    reviewed: false
  },

  // LO05
  {
    loId: "iot-03-lo05",
    type: "single",
    difficulty: 1,
    id: "iot-03-q17",
    stem: "What open-source Python utility is used to communicate with the ESP32 ROM bootloader and flash firmware over serial?",
    options: [
      { id: "a", text: "esptool.py" },
      { id: "b", text: "pip install" },
      { id: "c", text: "docker run" },
      { id: "d", text: "npm start" }
    ],
    answer: ["a"],
    explanation: "esptool.py is the official Espressif Python utility for flashing firmware binaries over UART.",
    noteRef: "iot-03-lo05",
    reviewed: false
  },
  {
    loId: "iot-03-lo05",
    type: "scenario",
    difficulty: 2,
    id: "iot-03-q18",
    stem: "During firmware upload, the IDE asserts the USB-to-UART bridge DTR and RTS control lines. What action do these signals perform automatically?",
    options: [
      { id: "a", text: "They manipulate the EN (Reset) and GPIO 0 pins through two transistors to force the chip into UART download mode without button presses." },
      { id: "b", text: "They encrypt the computer's hard drive." },
      { id: "c", text: "They measure the ambient room temperature." },
      { id: "d", text: "They test Wi-Fi internet speeds." }
    ],
    answer: ["a"],
    explanation: "The standard auto-reset circuit sequences EN and GPIO 0 via DTR/RTS to automate entry into bootloader mode.",
    noteRef: "iot-03-lo05",
    reviewed: false
  },
  {
    loId: "iot-03-lo05",
    type: "single",
    difficulty: 2,
    id: "iot-03-q19",
    stem: "If an ESP32 development board lacks auto-reset transistors, how can an engineer manually place the board into flashing mode?",
    options: [
      { id: "a", text: "Hold down the BOOT (GPIO 0) button, press and release the EN (Reset) button, then release the BOOT button." },
      { id: "b", text: "Disconnect the USB cable and plug it into an AC wall socket." },
      { id: "c", text: "Hit the computer keyboard with a magnet." },
      { id: "d", text: "Submerge the board in cold water." }
    ],
    answer: ["a"],
    explanation: "Holding BOOT (GPIO 0 LOW) during reset release forces the ROM bootloader into UART download mode.",
    noteRef: "iot-03-lo05",
    reviewed: false
  },
  {
    loId: "iot-03-lo05",
    type: "single",
    difficulty: 3,
    id: "iot-03-q20",
    stem: "At what standard flash offset address does the application binary (app.bin) reside in the default ESP32 partition table?",
    options: [
      { id: "a", text: "0x10000" },
      { id: "b", text: "0x0000" },
      { id: "c", text: "0x1000" },
      { id: "d", text: "0x8000" }
    ],
    answer: ["a"],
    explanation: "0x1000 is bootloader, 0x8000 is partition table, and 0x10000 is the start of the default factory app binary.",
    noteRef: "iot-03-lo05",
    reviewed: false
  },

  // LO06
  {
    loId: "iot-03-lo06",
    type: "single",
    difficulty: 1,
    id: "iot-03-q21",
    stem: "What configuration file in a PlatformIO project defines target microcontrollers, frameworks, and library dependencies?",
    options: [
      { id: "a", text: "platformio.ini" },
      { id: "b", text: "package.json" },
      { id: "c", text: "Dockerfile" },
      { id: "d", text: "Makefile" }
    ],
    answer: ["a"],
    explanation: "PlatformIO projects are configured via the declarative `platformio.ini` project configuration file.",
    noteRef: "iot-03-lo06",
    reviewed: false
  },
  {
    loId: "iot-03-lo06",
    type: "scenario",
    difficulty: 2,
    id: "iot-03-q22",
    stem: "A team of three firmware engineers uses PlatformIO for an ESP32 project. How does declaring `lib_deps = bblanchon/ArduinoJson @ ^7.0.0` in `platformio.ini` guarantee reproducibility?",
    options: [
      { id: "a", text: "It automatically downloads the exact compatible version of the library across all team members' workstations during build time." },
      { id: "b", text: "It prevents other developers from editing source code." },
      { id: "c", text: "It makes the firmware open-source on GitHub." },
      { id: "d", text: "It increases internet upload speeds." }
    ],
    answer: ["a"],
    explanation: "Semantic version declarations in `lib_deps` ensure every machine builds against identical library APIs.",
    noteRef: "iot-03-lo06",
    reviewed: false
  },
  {
    loId: "iot-03-lo06",
    type: "multi",
    difficulty: 2,
    id: "iot-03-q23",
    stem: "Which of the following development advantages does PlatformIO offer over the standard Arduino IDE 1.x?",
    options: [
      { id: "a", text: "Advanced code autocompletion, refactoring, and navigation powered by VS Code" },
      { id: "b", text: "Automatic toolchain and cross-compiler management per environment" },
      { id: "c", text: "Integrated static code analysis and unit testing tools" },
      { id: "d", text: "Free unlimited cloud hardware manufacturing" }
    ],
    answer: ["a", "b", "c"],
    explanation: "PlatformIO integrates professional IDE tooling, dependency isolation, and testing into modern editor workflows.",
    noteRef: "iot-03-lo06",
    reviewed: false
  },
  {
    loId: "iot-03-lo06",
    type: "single",
    difficulty: 3,
    id: "iot-03-q24",
    stem: "What parameter in `platformio.ini` sets the serial monitor baud rate to match `Serial.begin(115200)` in firmware?",
    options: [
      { id: "a", text: "monitor_speed = 115200" },
      { id: "b", text: "upload_port = 115200" },
      { id: "c", text: "baud_rate_max = 115200" },
      { id: "d", text: "serial_frequency = 115200" }
    ],
    answer: ["a"],
    explanation: "`monitor_speed = 115200` configures PlatformIO's serial terminal baud rate.",
    noteRef: "iot-03-lo06",
    reviewed: false
  },

  // LO07
  {
    loId: "iot-03-lo07",
    type: "single",
    difficulty: 1,
    id: "iot-03-q25",
    stem: "What is Wokwi in modern embedded systems engineering?",
    options: [
      { id: "a", text: "An online cycle-accurate hardware simulator for microcontrollers like ESP32, RP2040, and Arduino." },
      { id: "b", text: "A physical soldering station." },
      { id: "c", text: "A high-voltage AC multimeter." },
      { id: "d", text: "A proprietary operating system for supercomputers." }
    ],
    answer: ["a"],
    explanation: "Wokwi is an advanced browser-based hardware and firmware simulator.",
    noteRef: "iot-03-lo07",
    reviewed: false
  },
  {
    loId: "iot-03-lo07",
    type: "scenario",
    difficulty: 2,
    id: "iot-03-q26",
    stem: "A student needs to test an ESP32 firmware sketch that connects to a public MQTT broker, but they do not have physical hardware on hand. How does Wokwi enable this test?",
    options: [
      { id: "a", text: "Wokwi simulates an emulated Wi-Fi access point ('Wokwi-GUEST') that bridges real internet network packets from the simulated firmware to live web servers." },
      { id: "b", text: "Wokwi mails a physical ESP32 to the student's house." },
      { id: "c", text: "Wokwi converts C++ code into an MP3 file." },
      { id: "d", text: "Wokwi disables all networking functions." }
    ],
    answer: ["a"],
    explanation: "Wokwi's virtual Wi-Fi gateway allows simulated ESP32 firmware to communicate with live internet servers.",
    noteRef: "iot-03-lo07",
    reviewed: false
  },
  {
    loId: "iot-03-lo07",
    type: "single",
    difficulty: 2,
    id: "iot-03-q27",
    stem: "In a Wokwi project, which JSON file defines the virtual components, display screens, and wiring connections?",
    options: [
      { id: "a", text: "diagram.json" },
      { id: "b", text: "circuit.xml" },
      { id: "c", text: "hardware.txt" },
      { id: "d", text: "schema.csv" }
    ],
    answer: ["a"],
    explanation: "`diagram.json` stores the visual parts list and point-to-point wiring coordinates in Wokwi.",
    noteRef: "iot-03-lo07",
    reviewed: false
  },
  {
    loId: "iot-03-lo07",
    type: "single",
    difficulty: 3,
    id: "iot-03-q28",
    stem: "Why is hardware simulation valuable during the firmware debugging process prior to manufacturing PCBs?",
    options: [
      { id: "a", text: "It allows testing logic edge cases (sensor failure, boundary inputs) and catch race conditions without risk of damaging physical silicon." },
      { id: "b", text: "It eliminates the need for software code." },
      { id: "c", text: "It generates printed circuit boards for free." },
      { id: "d", text: "Simulated code never contains bugs." }
    ],
    answer: ["a"],
    explanation: "Simulating circuits isolates firmware bugs from physical hardware wiring defects and avoids physical chip damage.",
    noteRef: "iot-03-lo07",
    reviewed: false
  },

  // LO08
  {
    loId: "iot-03-lo08",
    type: "single",
    difficulty: 1,
    id: "iot-03-q29",
    stem: "In a semiconductor datasheet, what section defines the stress limits beyond which permanent hardware destruction occurs?",
    options: [
      { id: "a", text: "Absolute Maximum Ratings" },
      { id: "b", text: "Recommended Operating Conditions" },
      { id: "c", text: "Ordering Information" },
      { id: "d", text: "Revision History" }
    ],
    answer: ["a"],
    explanation: "Absolute Maximum Ratings specify electrical and thermal boundaries that cause irreversible damage if exceeded.",
    noteRef: "iot-03-lo08",
    reviewed: false
  },
  {
    loId: "iot-03-lo08",
    type: "scenario",
    difficulty: 2,
    id: "iot-03-q30",
    stem: "A hobbyist connects an LED that draws 60mA directly to an ESP32 GPIO pin. The datasheet recommends maximum continuous current of 12mA per pin. What is the risk?",
    options: [
      { id: "a", text: "Severe voltage drop on the internal rail, overheating of the output driver MOSFET, and permanent burnout of the GPIO silicon cell." },
      { id: "b", text: "The LED will turn blue." },
      { id: "c", text: "The Wi-Fi password will be deleted." },
      { id: "d", text: "The computer monitor will flicker." }
    ],
    answer: ["a"],
    explanation: "Drawing 60mA through a 12mA-rated pin creates excessive local heating that destroys the internal driver.",
    noteRef: "iot-03-lo08",
    reviewed: false
  },
  {
    loId: "iot-03-lo08",
    type: "single",
    difficulty: 2,
    id: "iot-03-q31",
    stem: "What is the difference between a GPIO pin 'Sinking' current versus 'Sourcing' current?",
    options: [
      { id: "a", text: "Sourcing supplies current OUT of the pin from VCC to a load; Sinking draws current INTO the pin from a load to Ground." },
      { id: "b", text: "Sinking is for AC current; Sourcing is for DC current." },
      { id: "c", text: "Sourcing only works on odd-numbered pins." },
      { id: "d", text: "There is no physical difference." }
    ],
    answer: ["a"],
    explanation: "Sourcing outputs current from VCC; sinking absorbs incoming current through the low-side switch to Ground.",
    noteRef: "iot-03-lo08",
    reviewed: false
  },
  {
    loId: "iot-03-lo08",
    type: "numeric",
    difficulty: 3,
    id: "iot-03-q32",
    stem: "If a microcontroller chip has an absolute total VCC/GND package current limit of 150 mA, and each indicator LED consumes 15 mA, what is the maximum number of such LEDs that can be driven simultaneously?",
    options: [
      { id: "a", text: "10" },
      { id: "b", text: "5" },
      { id: "c", text: "20" },
      { id: "d", text: "15" }
    ],
    answer: ["a"],
    explanation: "150 mA / 15 mA = 10 LEDs maximum before exceeding the total package current budget.",
    noteRef: "iot-03-lo08",
    verify: "(150 / 15 === 10)",
    reviewed: false
  },

  // LO09 (Extension)
  {
    loId: "iot-03-lo09",
    type: "single",
    difficulty: 2,
    id: "iot-03-q33",
    stem: "What is the primary function of the Ultra-Low-Power (ULP) coprocessor built into the ESP32?",
    options: [
      { id: "a", text: "It executes small programs to monitor sensors, touch pads, and ADC thresholds while the main high-power CPU cores remain in deep sleep." },
      { id: "b", text: "It mines cryptocurrency in background threads." },
      { id: "c", text: "It plays 4K video streams." },
      { id: "d", text: "It encrypts Wi-Fi passwords." }
    ],
    answer: ["a"],
    explanation: "The ULP coprocessor monitors peripherals at 10-20 microamps of power while main CPUs sleep.",
    noteRef: "iot-03-lo09",
    reviewed: false
  },
  {
    loId: "iot-03-lo09",
    type: "scenario",
    difficulty: 2,
    id: "iot-03-q34",
    stem: "An engineer attaches a plain copper foil strip to ESP32 Touch0 (GPIO 4) and calls `touchRead(4)`. Why does the numerical reading drop from 80 down to 15 when a human finger touches the foil?",
    options: [
      { id: "a", text: "Human skin introduces additional capacitance to Ground, increasing the RC charge/discharge time measured by the hardware counter." },
      { id: "b", text: "The human finger generates 240V electricity." },
      { id: "c", text: "The foil becomes magnetic." },
      { id: "d", text: "The ESP32 reduces its clock speed." }
    ],
    answer: ["a"],
    explanation: "Capacitive touch pins measure RC oscillator frequency; finger capacitance slows oscillation, dropping the count.",
    noteRef: "iot-03-lo09",
    reviewed: false
  },
  {
    loId: "iot-03-lo09",
    type: "multi",
    difficulty: 3,
    id: "iot-03-q35",
    stem: "Which of the following events can be configured to wake up an ESP32 from deep sleep mode?",
    options: [
      { id: "a", text: "Timer alarm (RTC timer expiration)" },
      { id: "b", text: "External GPIO interrupt (ext0 / ext1 wakeup)" },
      { id: "c", text: "Capacitive touch pad activation" },
      { id: "d", text: "Changes in CPU serial number" }
    ],
    answer: ["a", "b", "c"],
    explanation: "The RTC controller can awaken the ESP32 via timers, GPIO pins, touch pads, or ULP interrupts.",
    noteRef: "iot-03-lo09",
    reviewed: false
  },
  {
    loId: "iot-03-lo09",
    type: "single",
    difficulty: 3,
    id: "iot-03-q36",
    stem: "Why are capacitive touch sensors advantageous over physical mechanical push-buttons in harsh outdoor IoT deployments?",
    options: [
      { id: "a", text: "They operate through sealed glass or plastic enclosures with no moving parts, preventing water ingress, dust contamination, and mechanical wear." },
      { id: "b", text: "They work when completely unpowered." },
      { id: "c", text: "They can be pressed from 10 miles away." },
      { id: "d", text: "They never require software debouncing." }
    ],
    answer: ["a"],
    explanation: "Touch pads sense through sealed bezels, eliminating moving parts and sealing enclosures against water and dust.",
    noteRef: "iot-03-lo09",
    reviewed: false
  }
];

balanceAndSave('iot', 'microcontrollers-esp32-and-arduino', ch03Objectives, ch03Questions);
console.log("Batch 10 complete!");
