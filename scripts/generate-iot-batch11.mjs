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
// CHAPTER 04: embedded-programming-c-and-micropython (iot-04) [moderate]
// ==========================================

const ch04Objectives = {
  version: 1,
  chapterId: "iot-04",
  objectives: [
    {
      id: "iot-04-lo01",
      order: 1,
      title: "Structure firmware execution using the Arduino setup/loop lifecycle and fixed-width integer types",
      bloom: "structure",
      tier: "core",
      mustHave: true,
      keywords: ["setup and loop", "fixed-width types", "uint8_t", "uint32_t", "embedded c"],
      aliases: ["embedded c basics", "fixed width integers"],
      prerequisites: ["iot-03-lo03"],
      estMinutes: 12
    },
    {
      id: "iot-04-lo02",
      order: 2,
      title: "Implement non-blocking cooperative multitasking using the millis() timestamp pattern",
      bloom: "implement",
      tier: "core",
      mustHave: true,
      keywords: ["millis", "non-blocking delay", "cooperative multitasking", "state timer", "blink without delay"],
      aliases: ["non blocking timing", "millis pattern"],
      prerequisites: ["iot-04-lo01"],
      estMinutes: 14
    },
    {
      id: "iot-04-lo03",
      order: 3,
      title: "Program hardware Interrupt Service Routines (ISRs) using volatile flags and critical sections",
      bloom: "program",
      tier: "core",
      mustHave: true,
      keywords: ["isr", "attachinterrupt", "volatile keyword", "critical section", "hardware interrupt"],
      aliases: ["interrupt handling", "volatile in embedded c"],
      prerequisites: ["iot-04-lo01"],
      estMinutes: 14
    },
    {
      id: "iot-04-lo04",
      order: 4,
      title: "Eliminate mechanical contact chatter using software switch debouncing algorithms",
      bloom: "mitigate",
      tier: "core",
      mustHave: false,
      keywords: ["switch debouncing", "contact bounce", "state machine debounce", "debounce delay"],
      aliases: ["button debouncing", "contact chatter elimination"],
      prerequisites: ["iot-04-lo02"],
      estMinutes: 12
    },
    {
      id: "iot-04-lo05",
      order: 5,
      title: "Configure ESP32 low-power sleep modes: Modem Sleep, Light Sleep, and Deep Sleep",
      bloom: "configure",
      tier: "core",
      mustHave: true,
      keywords: ["deep sleep", "light sleep", "modem sleep", "rtc memory", "esp_deep_sleep_start"],
      aliases: ["esp32 sleep modes", "power management in iot"],
      prerequisites: ["iot-03-lo04"],
      estMinutes: 14
    },
    {
      id: "iot-04-lo06",
      order: 6,
      title: "Debug firmware execution using serial logging and compile-time macro flags",
      bloom: "debug",
      tier: "core",
      mustHave: false,
      keywords: ["serial debugging", "baud rate", "printf", "debug macros", "core dump"],
      aliases: ["firmware debugging", "serial logging"],
      prerequisites: ["iot-04-lo01"],
      estMinutes: 12
    },
    {
      id: "iot-04-lo07",
      order: 7,
      title: "Manage dynamic heap fragmentation and stack sizing in memory-constrained microcontrollers",
      bloom: "analyze",
      tier: "core",
      mustHave: false,
      keywords: ["heap fragmentation", "stack overflow", "malloc", "free", "static allocation"],
      aliases: ["embedded memory management", "ram exhaustion"],
      prerequisites: ["iot-03-lo02"],
      estMinutes: 12
    },
    {
      id: "iot-04-lo08",
      order: 8,
      title: "Execute embedded scripts using MicroPython on ESP32 via the interactive REPL",
      bloom: "execute",
      tier: "core",
      mustHave: false,
      keywords: ["micropython", "repl", "machine module", "python on mcu", "thonny ide"],
      aliases: ["micropython esp32", "python embedded programming"],
      prerequisites: ["iot-03-lo02"],
      estMinutes: 12
    },
    {
      id: "iot-04-lo09",
      order: 9,
      title: "Compare performance, deterministic latency, and resource constraints of C/C++ versus MicroPython",
      bloom: "compare",
      tier: "extension",
      mustHave: false,
      keywords: ["c vs micropython", "garbage collection pauses", "execution overhead", "firmware selection"],
      aliases: ["micropython trade-offs", "embedded language selection"],
      prerequisites: ["iot-04-lo08"],
      estMinutes: 12
    }
  ]
};

// Notes for iot-04

writeNoteBlock('iot', 'embedded-programming-c-and-micropython', 'iot-04-lo01',
  `Embedded firmware executes in a bare-metal environment governed by the core setup/loop lifecycle and explicit memory sizing:
1. Lifecycle Architecture:
   - \`setup()\`: Invoked once immediately upon boot or reset. Initializes hardware peripherals, configures GPIO pin directions, opens communication ports (\`Serial.begin\`), and configures network credentials.
   - \`loop()\`: Executes continuously in an infinite background while-loop. Handles periodic sensor polling, network heartbeats, and actuation logic.
2. Fixed-Width Integer Types (\`<stdint.h>\`):
   Standard C types like \`int\` vary across architectures (16 bits on AVR, 32 bits on ESP32). Embedded developers mandate fixed-width types to guarantee predictable memory footprint and avoid overflow bugs:
   - \`uint8_t\`: 8-bit unsigned integer ($0$ to $255$). Consumes exactly 1 byte.
   - \`int16_t\`: 16-bit signed integer ($-32,768$ to $+32,767$).
   - \`uint32_t\`: 32-bit unsigned integer ($0$ to $4,294,967,295$), essential for millisecond timestamps.
3. Variable Scoping: Minimize global variable declarations; scope variables locally to preserve limited SRAM.`,
  `C++ example demonstrating fixed-width types and setup/loop architecture:
\`\`\`cpp
#include <Arduino.h>
#include <stdint.h>

const uint8_t STATUS_LED = 2; // Exact 1-byte storage

void setup() {
  pinMode(STATUS_LED, OUTPUT);
  Serial.begin(115200);
  Serial.println("System Initialized");
}

void loop() {
  uint32_t current_time = millis(); // 32-bit millisecond counter
  // Firmware operational loop continues here
}
\`\`\``,
  `Using a standard signed \`int\` (16 bits on Arduino Uno) to store millisecond timestamps from \`millis()\`; the 16-bit signed integer overflows after only $32.7$ seconds ($32,767\\text{ms}$), breaking all subsequent timing comparisons.`,
  `Why must millisecond timestamps returned by \`millis()\` always be stored in an unsigned 32-bit integer (\`uint32_t\`)?`
);

writeNoteBlock('iot', 'embedded-programming-c-and-micropython', 'iot-04-lo02',
  `Calling blocking \`delay()\` freezes the CPU in a dead spin loop, preventing microcontrollers from servicing button presses, processing serial packets, or maintaining network connections:
1. The \`millis()\` Pattern (Blink Without Delay):
   \`millis()\` tracks elapsed milliseconds since power-on via an internal hardware timer tick. Instead of stalling execution, the firmware checks elapsed time cooperatively:
   $$\\text{Elapsed Time} = \\text{current\\_time} - \\text{previous\\_time}$$
2. Non-Blocking Scheduling:
   Store the timestamp of the last executed action. On every \`loop()\` iteration, evaluate whether the interval has expired. If yes, update the timestamp and execute the task; if no, immediately yield execution to other tasks.
3. Rollover Safety:
   \`millis()\` rolls over from $2^{32}-1$ to $0$ every $\\sim 49.7$ days. By using unsigned subtraction (\`current_time - previous_time >= interval\`), standard binary two's-complement arithmetic guarantees correct operation even across rollover events.`,
  `Cooperative multitasking with non-blocking \`millis()\` in Arduino C++:
\`\`\`cpp
uint32_t last_sensor_read = 0;
uint32_t last_led_blink = 0;
const uint32_t SENSOR_INTERVAL = 2000; // 2 seconds
const uint32_t BLINK_INTERVAL = 500;   // 500 ms

void loop() {
  uint32_t now = millis();

  // Task 1: Blink status LED every 500 ms
  if (now - last_led_blink >= BLINK_INTERVAL) {
    last_led_blink = now;
    digitalWrite(2, !digitalRead(2));
  }

  // Task 2: Read temperature sensor every 2 seconds
  if (now - last_sensor_read >= SENSOR_INTERVAL) {
    last_sensor_read = now;
    read_temperature_sensor();
  }
}
\`\`\``,
  `Writing timing conditions as \`now >= last_time + interval\`; when \`last_time + interval\` overflows past $2^{32}-1$, the condition fails permanently until the next rollover, locking up the schedule for 49 days.`,
  `Why does the subtraction syntax \`(current_time - previous_time >= interval)\` remain safe against 49-day \`millis()\` rollovers?`
);

writeNoteBlock('iot', 'embedded-programming-c-and-micropython', 'iot-04-lo03',
  `Hardware Interrupt Service Routines (ISRs) provide immediate, microsecond response to asynchronous physical events without wasting CPU polling cycles:
1. Interrupt Mechanics: When a configured electrical transition occurs on a GPIO pin (RISING, FALLING, CHANGE), the CPU immediately suspends main execution, saves registers onto the stack, and jumps to the assigned ISR callback function.
2. The \`volatile\` Keyword: Informs the C/C++ compiler optimizer that a variable can be modified outside the normal code flow (by an ISR). Without \`volatile\`, the compiler caches the variable in a CPU register, preventing the main loop from detecting changes written by the interrupt.
3. ISR Golden Rules:
   - Keep It Ultra-Short: An ISR should only set a boolean flag, record a timestamp, or increment a counter.
   - Zero Blocking Calls: Never invoke \`delay()\`, \`Serial.print()\`, \`malloc()\`, or I2C/SPI transactions inside an ISR; these functions rely on other interrupts and cause deadlock crashes.
4. IRAM_ATTR: On the ESP32, mark ISR functions with \`IRAM_ATTR\` so the code resides in internal SRAM rather than slower external SPI Flash.`,
  `Robust ESP32 interrupt handler in Arduino C++:
\`\`\`cpp
#include <Arduino.h>

const int BUTTON_PIN = 14;
volatile bool button_pressed = false;
volatile uint32_t press_count = 0;

void IRAM_ATTR handle_button_isr() {
  button_pressed = true;
  press_count++;
}

void setup() {
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(BUTTON_PIN), handle_button_isr, FALLING);
  Serial.begin(115200);
}

void loop() {
  if (button_pressed) {
    button_pressed = false; // Clear flag in main thread
    Serial.printf("Interrupt Triggered! Total Presses: %u\n", press_count);
  }
}
\`\`\``,
  `Calling \`Serial.println()\` or \`delay(100)\` inside an ISR; \`Serial.println\` uses interrupts to empty its transmit buffer, causing an immediate hardware watchdog timeout or system freeze.`,
  `What critical function does the \`volatile\` type qualifier perform when declaring variables shared between an ISR and main loop?`
);

writeNoteBlock('iot', 'embedded-programming-c-and-micropython', 'iot-04-lo04',
  `Physical mechanical switches generate noisy electrical transients during actuation that must be eliminated in software:
1. Contact Bounce Physics: When metal switch contacts close, microscopic elastic collisions cause the contacts to physically bounce apart and re-connect dozens of times over a $5\\text{ms} - 20\\text{ms}$ duration. To a high-speed $240\\text{MHz}$ microcontroller, a single finger press appears as 10 to 50 distinct button pushes.
2. Software Debouncing Strategy:
   - When a state change is first detected on the pin, record the current \`millis()\` timestamp.
   - Ignore subsequent fluctuations until the signal remains stable continuously for a predefined debounce window (typically $30\\text{ms} - 50\\text{ms}$).
   - Once the signal holds steady beyond the window, accept the transition as a confirmed user action.
3. Hardware Alternative: Placing an RC low-pass filter ($10\\,\\text{k}\\Omega$ resistor and $0.1\\,\\mu\\text{F}$ capacitor) with a Schmitt-trigger inverter cleans bounce at the circuit level before reaching the GPIO pin.`,
  `State machine software debouncing implementation in C++:
\`\`\`cpp
const int BUTTON_PIN = 4;
int button_state = HIGH;
int last_reading = HIGH;
uint32_t last_debounce_time = 0;
const uint32_t DEBOUNCE_DELAY = 50; // 50 milliseconds

void loop() {
  int reading = digitalRead(BUTTON_PIN);
  if (reading != last_reading) {
    last_debounce_time = millis(); // Reset debounce timer on transition
  }

  if ((millis() - last_debounce_time) > DEBOUNCE_DELAY) {
    if (reading != button_state) {
      button_state = reading;
      if (button_state == LOW) {
        Serial.println("Confirmed Debounced Button Press!");
      }
    }
  }
  last_reading = reading;
}
\`\`\``,
  `Incrementing a counter directly inside a raw GPIO interrupt attached to a push-button without debouncing; pressing the button once increments the counter by 15 to 30 spurious counts.`,
  `Why does a single physical push-button press register as multiple rapid button events on an un-debounced digital pin?`
);

writeNoteBlock('iot', 'embedded-programming-c-and-micropython', 'iot-04-lo05',
  `Energy management is the defining requirement for battery-operated IoT edge devices; the ESP32 provides tiered power-saving sleep architectures:
1. Sleep Mode Hierarchy:
   - Active Mode: Dual CPUs running at $240\\text{MHz}$, Wi-Fi/BT transmitting: draws $80\\text{mA} - 240\\text{mA}$.
   - Modem Sleep: Wi-Fi/BT radios powered off, CPUs throttled: draws $15\\text{mA} - 30\\text{mA}$.
   - Light Sleep: High-speed clocks gated, CPU paused, digital peripherals suspended: draws $\\sim 0.8\\text{mA}$. Wakes up in $<1\\text{ms}$.
   - Deep Sleep: Main CPUs, RAM, and digital peripherals completely unpowered. Only the Real-Time Clock (RTC) domain, RTC slow memory, and ULP coprocessor remain active: draws only $10\\mu\\text{A} - 15\\mu\\text{A}$.
2. Deep Sleep Lifecycle:
   When waking from deep sleep, the ESP32 does NOT resume where it left off; it executes a fresh power-on boot from \`setup()\`.
3. RTC Memory Preservation:
   Standard SRAM contents are erased during deep sleep. Variables marked with the \`RTC_DATA_ATTR\` attribute reside in the $8\\text{KB}$ RTC slow SRAM and survive across deep sleep boot cycles.`,
  `Configuring periodic deep sleep with RTC memory tracking in ESP32 C++:
\`\`\`cpp
#include <esp_sleep.h>

#define uS_TO_S_FACTOR 1000000ULL /* Conversion factor micro to seconds */
#define TIME_TO_SLEEP  60        /* Sleep duration in seconds */

RTC_DATA_ATTR uint32_t boot_count = 0; // Preserved in RTC memory

void setup() {
  Serial.begin(115200);
  boot_count++;
  Serial.printf("Boot Count across Deep Sleep: %u\n", boot_count);

  // Configure timer wakeup source
  esp_sleep_enable_timer_wakeup(TIME_TO_SLEEP * uS_TO_S_FACTOR);
  Serial.println("Entering Deep Sleep for 60 seconds...");
  esp_deep_sleep_start();
}

void loop() {} // Never reached
\`\`\``,
  `Assuming normal global C++ variables retain their values across deep sleep cycles; all standard SRAM is powered off during deep sleep unless explicitly declared with \`RTC_DATA_ATTR\`.`,
  `How does an ESP32 resume execution upon waking up from Deep Sleep mode compared to Light Sleep mode?`
);

writeNoteBlock('iot', 'embedded-programming-c-and-micropython', 'iot-04-lo06',
  `Systematic serial logging and structured compile-time flags enable fast diagnosis of firmware bugs and kernel crashes:
1. Baud Rate Synchronization: Both the microcontroller firmware and the host serial terminal must agree on transmission baud rate (e.g., \`115200\`). Mismatched baud rates output unreadable garbage characters.
2. Formatted Printing (\`Serial.printf\`): The ESP32 supports standard C formatted output (\`printf\`), eliminating messy chains of \`Serial.print()\` calls:
   \`Serial.printf("Temp: %.2f C | Humidity: %d%%\\n", temp, hum);\`.
3. Compile-Time Debug Flags: In production firmware, continuous serial output wastes CPU cycles and leaks internal states. Use C preprocessor macros to conditionally compile debug prints:
   \`#ifdef DEBUG\` blocks are completely stripped from production release binaries, saving flash and execution time.
4. Core Dumps & Stack Traces: On an ESP32 hardware panic (Guru Meditation Error), the chip prints CPU registers and a hexadecimal backtrace that can be decoded using \`addr2line\` to pinpoint the exact crash line.`,
  `Configuring clean compile-time debug macros in C++:
\`\`\`cpp
#define DEBUG_ENABLED 1

#if DEBUG_ENABLED
  #define DEBUG_PRINTF(fmt, ...) Serial.printf("[DEBUG] " fmt, ##__VA_ARGS__)
#else
  #define DEBUG_PRINTF(fmt, ...) // Stripped out during compilation
#endif

void setup() {
  Serial.begin(115200);
  float battery_volts = 3.85;
  DEBUG_PRINTF("Battery initialized at %.2f Volts\n", battery_volts);
}
\`\`\``,
  `Leaving hundreds of verbose \`Serial.println\` statements inside high-speed sensor communication loops in production, drastically increasing execution latency and causing timing misses on serial buses.`,
  `Why do developers wrap serial logging statements inside \`#ifdef DEBUG\` preprocessor macro blocks?`
);

writeNoteBlock('iot', 'embedded-programming-c-and-micropython', 'iot-04-lo07',
  `Dynamic memory management in microcontrollers requires rigorous discipline to avoid silent crashes caused by heap exhaustion or stack corruption:
1. Heap vs. Stack Architecture:
   - Stack: Stores local function variables, parameter passing, and return addresses. Grows downward. If nested function calls or massive local arrays exceed allocated stack size, a fatal Stack Overflow occurs.
   - Heap: Stores dynamically allocated objects via \`malloc()\` / \`new\`. Grows upward.
2. Heap Fragmentation in Embedded Systems:
   Repeatedly allocating and freeing small, variable-sized memory buffers (e.g., using the Arduino \`String\` class for building JSON or HTTP payloads) punches holes into the heap. Over days of operation, available RAM becomes fragmented into tiny non-contiguous blocks, causing future allocations to fail even when total free RAM appears sufficient.
3. Embedded Best Practices:
   - Avoid \`String\`: Use fixed-size static character buffers (\`char buf[128]\`) with \`snprintf()\`.
   - Static Allocation: Allocate buffers globally or statically at boot time so memory usage is known at compile time.`,
  `C++ buffer formatting avoiding heap fragmentation:
\`\`\`cpp
void build_telemetry_payload(float temp, float humidity, char* output_buffer, size_t max_len) {
  // Uses fixed static stack memory with buffer boundary protection
  snprintf(output_buffer, max_len, "{\"temp\":%.1f,\"hum\":%.1f}", temp, humidity);
}

void loop() {
  char json_payload[64]; // Fixed static buffer on stack
  build_telemetry_payload(24.5, 60.2, json_payload, sizeof(json_payload));
  // Payload is sent without touching the dynamic heap
}
\`\`\``,
  `Using the Arduino \`String\` class with dynamic string concatenation (\`str += val\`) inside continuous sensor loops, fragmenting heap memory until the MCU crashes unexpectedly after several hours.`,
  `What is heap fragmentation in embedded microcontrollers, and why does extensive use of the Arduino \`String\` class cause it?`
);

writeNoteBlock('iot', 'embedded-programming-c-and-micropython', 'iot-04-lo08',
  `MicroPython brings the Python 3 programming language to microcontrollers, delivering interactive rapid prototyping and live hardware control:
1. MicroPython Architecture: A compact, highly optimized Python 3 interpreter and runtime that fits inside $256\\text{KB}$ of flash and runs within $16\\text{KB}$ of RAM.
2. The Read-Eval-Print Loop (REPL): Accessible over standard USB-to-UART serial at 115200 baud. Allows developers to execute Python code interactively on the physical chip line-by-line, instantly toggling GPIOs, reading sensors, and testing Wi-Fi connections without compilation cycles.
3. The \`machine\` Module: The core hardware abstraction API in MicroPython:
   - \`machine.Pin\`: Controls digital I/O modes and drive states.
   - \`machine.ADC\`: Configures analog reading and attenuation.
   - \`machine.PWM\`: Synthesizes pulse-width modulated outputs.
   - \`machine.I2C\` / \`machine.SPI\`: Communicates with bus peripherals.
4. File Storage: MicroPython implements a virtual Flash filesystem (LittleFS/FAT), storing scripts like \`boot.py\` (runs at power-on) and \`main.py\` (main application code).`,
  `Controlling ESP32 hardware via interactive MicroPython script:
\`\`\`python
import time
from machine import Pin, ADC

led = Pin(2, Pin.OUT)
sensor = ADC(Pin(34))
sensor.atten(ADC.ATTN_11DB) # 0 - 3.3V range

print("Starting MicroPython Sensor Loop...")
for _ in range(5):
    led.value(1) # LED ON
    raw_val = sensor.read()
    voltage = (raw_val / 4095) * 3.3
    print("ADC Reading: {} | Voltage: {:.2f}V".format(raw_val, voltage))
    led.value(0) # LED OFF
    time.sleep(1)
\`\`\``,
  `Attempting to run standard desktop Python packages (like NumPy, Pandas, or OpenCV) on MicroPython; MicroPython is a lean subset specifically written for microcontrollers and lacks full CPython library support.`,
  `What are the distinct roles of \`boot.py\` and \`main.py\` in the MicroPython filesystem?`
);

writeNoteBlock('iot', 'embedded-programming-c-and-micropython', 'iot-04-lo09',
  `Selecting between compiled C/C++ and interpreted MicroPython requires evaluating execution speed, memory limits, and project timelines:
1. Performance & Execution Speed:
   - C/C++: Compiles directly into native machine code (Tensilica/ARM). Executes 10x to 100x faster than MicroPython with predictable microsecond instruction timing.
   - MicroPython: Bytecode interpreter running on a virtual machine. Subject to periodic Garbage Collection (GC) pauses ($5\\text{ms} - 50\\text{ms}$) where execution freezes unexpectedly while recovering dead memory.
2. Memory Efficiency:
   - C/C++: Full control over memory footprint; operates smoothly within 2KB of RAM (ATmega328P).
   - MicroPython: Requires at least 256KB Flash and 16KB-64KB RAM just for the interpreter; prone to \`MemoryError\` when loading large network libraries or parsing heavy JSON.
3. Decision Framework:
   - Choose MicroPython for rapid prototyping, educational courses, and simple sensor hubs where development speed outweighs raw compute throughput.
   - Choose C/C++ for commercial products, hard real-time motor control, battery-optimized deep sleep nodes, and high-speed audio/DSP processing.`,
  `Comparison summary matrix between C/C++ and MicroPython:
\`\`\`text
Metric                  C / C++ (ESP-IDF/Arduino)    MicroPython
-------------------------------------------------------------------
Execution Speed         Native (Fastest, ~1x)        Interpreted (~10x-50x slower)
Memory Overhead         Minimal (~2KB RAM capable)   High (requires >64KB RAM)
Real-Time Latency       Microsecond deterministic    Subject to Garbage Collection pauses
Compilation Required    Yes (toolchain build)        No (interpreted live on REPL)
Debugging Workflow      Serial logs / JTAG           Interactive live REPL terminal
\`\`\``,
  `Attempting to use MicroPython for hard real-time closed-loop drone flight stabilization; unexpected garbage collection sweeps halt the control loop, causing motor desynchronization and crashes.`,
  `Why do periodic Garbage Collection (GC) sweeps make MicroPython unsuitable for hard real-time control applications?`
);

// Questions for iot-04
const ch04Questions = [
  // LO01
  {
    loId: "iot-04-lo01",
    type: "single",
    difficulty: 1,
    id: "iot-04-q01",
    stem: "In standard Arduino C++ firmware, how many times is the `setup()` function executed after power-on reset?",
    options: [
      { id: "a", text: "Exactly once" },
      { id: "b", text: "Continuously in an infinite loop" },
      { id: "c", text: "Once every 1000 milliseconds" },
      { id: "d", text: "Only when a button is pressed" }
    ],
    answer: ["a"],
    explanation: "`setup()` runs once upon power-on or hardware reset to initialize peripherals and pins.",
    noteRef: "iot-04-lo01",
    reviewed: false
  },
  {
    loId: "iot-04-lo01",
    type: "scenario",
    difficulty: 2,
    id: "iot-04-q02",
    stem: "An engineer needs to store an analog sensor value ranging from 0 to 255 in the smallest possible memory footprint. Which fixed-width C data type should be used?",
    options: [
      { id: "a", text: "uint8_t" },
      { id: "b", text: "uint32_t" },
      { id: "c", text: "int16_t" },
      { id: "d", text: "double" }
    ],
    answer: ["a"],
    explanation: "`uint8_t` stores unsigned integers from 0 to 255 consuming exactly 1 byte (8 bits) of SRAM.",
    noteRef: "iot-04-lo01",
    reviewed: false
  },
  {
    loId: "iot-04-lo01",
    type: "numeric",
    difficulty: 2,
    id: "iot-04-q03",
    stem: "How many bytes of memory are consumed by an array of 50 `uint16_t` integers in embedded C?",
    options: [
      { id: "a", text: "100" },
      { id: "b", text: "50" },
      { id: "c", text: "200" },
      { id: "d", text: "25" }
    ],
    answer: ["a"],
    explanation: "`uint16_t` is 2 bytes; 50 * 2 = 100 bytes of memory.",
    noteRef: "iot-04-lo01",
    verify: "(50 * 2 === 100)",
    reviewed: false
  },
  {
    loId: "iot-04-lo01",
    type: "single",
    difficulty: 3,
    id: "iot-04-q04",
    stem: "Why are fixed-width integer types (`uint8_t`, `int32_t`) strictly preferred over standard `int` in embedded firmware?",
    options: [
      { id: "a", text: "Because standard `int` size varies across architectures (16 bits on AVR, 32 bits on ESP32/ARM), causing subtle overflow and memory corruption bugs when porting code." },
      { id: "b", text: "Because `int` is not supported by C++ compilers." },
      { id: "c", text: "Because fixed-width types run at higher clock frequencies." },
      { id: "d", text: "Because standard `int` consumes 64 bytes of storage." }
    ],
    answer: ["a"],
    explanation: "Standard `int` size is architecture-dependent; fixed-width types ensure deterministic sizing across all MCUs.",
    noteRef: "iot-04-lo01",
    reviewed: false
  },

  // LO02
  {
    loId: "iot-04-lo02",
    type: "single",
    difficulty: 1,
    id: "iot-04-q05",
    stem: "Why is calling blocking `delay(1000)` bad practice in responsive embedded systems?",
    options: [
      { id: "a", text: "It halts CPU instruction execution in a dead spin loop, preventing the microcontroller from servicing buttons, sensors, or network packets." },
      { id: "b", text: "It doubles battery consumption permanently." },
      { id: "c", text: "It erases the microcontroller flash memory." },
      { id: "d", text: "It reduces the operating voltage to zero." }
    ],
    answer: ["a"],
    explanation: "Blocking `delay()` stops main thread execution, blinding the MCU to external inputs and network events.",
    noteRef: "iot-04-lo02",
    reviewed: false
  },
  {
    loId: "iot-04-lo02",
    type: "scenario",
    difficulty: 2,
    id: "iot-04-q06",
    stem: "A firmware engineer wants to blink an LED every 200ms while continuously reading temperature every 5000ms without freezing execution. What architectural pattern achieves this?",
    options: [
      { id: "a", text: "The cooperative non-blocking `millis()` timestamp pattern checking elapsed intervals." },
      { id: "b", text: "Chaining multiple `delay()` functions sequentially." },
      { id: "c", text: "Rebooting the microcontroller every 200 milliseconds." },
      { id: "d", text: "Using five separate physical Arduino boards." }
    ],
    answer: ["a"],
    explanation: "Non-blocking `millis()` polling allows independent tasks to run concurrently at distinct time intervals.",
    noteRef: "iot-04-lo02",
    reviewed: false
  },
  {
    loId: "iot-04-lo02",
    type: "single",
    difficulty: 2,
    id: "iot-04-q07",
    stem: "Approximately how many days of continuous operation elapse before the 32-bit unsigned millisecond counter `millis()` overflows and rolls over to 0?",
    options: [
      { id: "a", text: "49.7 days" },
      { id: "b", text: "24.0 hours" },
      { id: "c", text: "365 days" },
      { id: "d", text: "30 seconds" }
    ],
    answer: ["a"],
    explanation: "2^32 - 1 ms = 4,294,967,295 ms = ~49.71 days before unsigned 32-bit rollover.",
    noteRef: "iot-04-lo02",
    reviewed: false
  },
  {
    loId: "iot-04-lo02",
    type: "single",
    difficulty: 3,
    id: "iot-04-q08",
    stem: "Why does the expression `(current_millis - previous_millis >= interval)` work seamlessly even during the 49.7-day rollover event?",
    options: [
      { id: "a", text: "Binary two's complement unsigned integer subtraction naturally wraps around, yielding the exact positive difference between the two values." },
      { id: "b", text: "Because the compiler automatically pauses time during rollover." },
      { id: "c", text: "Because `millis()` is backed by an atomic clock." },
      { id: "d", text: "Because microcontrollers automatically reset on the 49th day." }
    ],
    answer: ["a"],
    explanation: "Unsigned modulo arithmetic under two's complement guarantees `now - prev` produces the correct delta across rollover.",
    noteRef: "iot-04-lo02",
    reviewed: false
  },

  // LO03
  {
    loId: "iot-04-lo03",
    type: "single",
    difficulty: 1,
    id: "iot-04-q09",
    stem: "What does ISR stand for in embedded systems programming?",
    options: [
      { id: "a", text: "Interrupt Service Routine" },
      { id: "b", text: "Internal Serial Register" },
      { id: "c", text: "Input Signal Rectifier" },
      { id: "d", text: "Instruction Set Reducer" }
    ],
    answer: ["a"],
    explanation: "An ISR (Interrupt Service Routine) is the callback function invoked when a hardware interrupt triggers.",
    noteRef: "iot-04-lo03",
    reviewed: false
  },
  {
    loId: "iot-04-lo03",
    type: "scenario",
    difficulty: 2,
    id: "iot-04-q10",
    stem: "A variable `flag` is modified inside an ISR, but the while loop in `main()` never detects the update and loops forever. What keyword is missing from the variable declaration?",
    options: [
      { id: "a", text: "volatile" },
      { id: "b", text: "static" },
      { id: "c", text: "const" },
      { id: "d", text: "register" }
    ],
    answer: ["a"],
    explanation: "`volatile` tells the compiler that the variable can change asynchronously, preventing aggressive register caching.",
    noteRef: "iot-04-lo03",
    reviewed: false
  },
  {
    loId: "iot-04-lo03",
    type: "multi",
    difficulty: 2,
    id: "iot-04-q11",
    stem: "Which of the following functions should NEVER be called inside an Interrupt Service Routine (ISR)?",
    options: [
      { id: "a", text: "delay(100)" },
      { id: "b", text: "Serial.println('Interrupt occurred')" },
      { id: "c", text: "Setting a boolean flag to true (`flag = true;`)" },
      { id: "d", text: "Dynamic memory allocation (`malloc(1024)`)" }
    ],
    answer: ["a", "b", "d"],
    explanation: "ISRs must be fast and non-blocking; `delay`, `Serial.print`, and `malloc` cause deadlocks or stack corruption.",
    noteRef: "iot-04-lo03",
    reviewed: false
  },
  {
    loId: "iot-04-lo03",
    type: "single",
    difficulty: 3,
    id: "iot-04-q12",
    stem: "On the ESP32, why must ISR functions be attributed with the `IRAM_ATTR` macro?",
    options: [
      { id: "a", text: "It instructs the linker to place the ISR code in internal SRAM rather than SPI Flash, preventing crashes when interrupts trigger while Flash cache is disabled." },
      { id: "b", text: "It doubles the microcontroller's RAM memory." },
      { id: "c", text: "It converts C++ code into Python." },
      { id: "d", text: "It prevents electrical short circuits on the pin." }
    ],
    answer: ["a"],
    explanation: "`IRAM_ATTR` keeps ISR code in internal SRAM so it executes immediately even if external SPI Flash access is stalled.",
    noteRef: "iot-04-lo03",
    reviewed: false
  },

  // LO04
  {
    loId: "iot-04-lo04",
    type: "single",
    difficulty: 1,
    id: "iot-04-q13",
    stem: "What physical phenomenon causes 'Contact Bounce' in mechanical switches?",
    options: [
      { id: "a", text: "Microscopic elastic collisions causing metal contacts to physically bounce open and closed dozens of times within a few milliseconds." },
      { id: "b", text: "Static electricity jumping from the user's hand." },
      { id: "c", text: "Thermal expansion of the copper pins." },
      { id: "d", text: "Radio frequency interference from local Wi-Fi routers." }
    ],
    answer: ["a"],
    explanation: "Mechanical spring contacts bounce upon physical impact, generating noisy electrical pulses over 5-20ms.",
    noteRef: "iot-04-lo04",
    reviewed: false
  },
  {
    loId: "iot-04-lo04",
    type: "scenario",
    difficulty: 2,
    id: "iot-04-q14",
    stem: "A user presses a pushbutton once, but the digital counter jumps from 0 to 14. What firmware mitigation is needed?",
    options: [
      { id: "a", text: "Software debouncing that ignores state changes until the signal remains stable beyond a 30-50ms window." },
      { id: "b", text: "Replacing the 3.3V battery with a 12V car battery." },
      { id: "c", text: "Increasing the CPU clock speed to 1 GHz." },
      { id: "d", text: "Formatting the micro SD card." }
    ],
    answer: ["a"],
    explanation: "Software debouncing filters out contact bounce oscillations by requiring signal stability over a debounce period.",
    noteRef: "iot-04-lo04",
    reviewed: false
  },
  {
    loId: "iot-04-lo04",
    type: "single",
    difficulty: 2,
    id: "iot-04-q15",
    stem: "What typical debounce delay interval is appropriate for standard tactile pushbuttons?",
    options: [
      { id: "a", text: "20 to 50 milliseconds" },
      { id: "b", text: "5000 milliseconds" },
      { id: "c", text: "1 microsecond" },
      { id: "d", text: "10 minutes" }
    ],
    answer: ["a"],
    explanation: "Mechanical bounce finishes within 10-20ms; a 20-50ms debounce window reliably filters chatter without perceptible lag.",
    noteRef: "iot-04-lo04",
    reviewed: false
  },
  {
    loId: "iot-04-lo04",
    type: "single",
    difficulty: 3,
    id: "iot-04-q16",
    stem: "How does a hardware RC low-pass filter eliminate contact bounce at the electrical level?",
    options: [
      { id: "a", text: "The capacitor smooths out high-frequency contact transitions, producing a clean monotonic voltage ramp fed into a Schmitt-trigger input." },
      { id: "b", text: "It converts digital signals into alternating current." },
      { id: "c", text: "It doubles the current flowing into the switch." },
      { id: "d", text: "It disconnects the switch physically from Ground." }
    ],
    answer: ["a"],
    explanation: "An RC filter dampens fast voltage transitions; a Schmitt trigger converts the smooth ramp into a crisp digital step.",
    noteRef: "iot-04-lo04",
    reviewed: false
  },

  // LO05
  {
    loId: "iot-04-lo05",
    type: "single",
    difficulty: 1,
    id: "iot-04-q17",
    stem: "What power consumption range does an ESP32 achieve when placed into Deep Sleep mode?",
    options: [
      { id: "a", text: "10 to 15 microamps (uA)" },
      { id: "b", text: "80 to 240 milliamps (mA)" },
      { id: "c", text: "5 Amperes (A)" },
      { id: "d", text: "0.5 Watts" }
    ],
    answer: ["a"],
    explanation: "Deep sleep powers down CPUs and main SRAM, reducing current draw to roughly 10-15 microamps.",
    noteRef: "iot-04-lo05",
    reviewed: false
  },
  {
    loId: "iot-04-lo05",
    type: "scenario",
    difficulty: 2,
    id: "iot-04-q18",
    stem: "An ESP32 battery sensor wakes from deep sleep every 10 minutes to record soil moisture. How does the ESP32 resume execution when the wakeup timer expires?",
    options: [
      { id: "a", text: "It performs a fresh reboot, executing `setup()` from the beginning with main SRAM reinitialized." },
      { id: "b", text: "It resumes precisely from the line immediately following `esp_deep_sleep_start()`." },
      { id: "c", text: "It waits for a USB flashing command from a PC." },
      { id: "d", text: "It operates without running any software." }
    ],
    answer: ["a"],
    explanation: "Waking from deep sleep is equivalent to a power-on reset: the processor re-boots and runs `setup()`.",
    noteRef: "iot-04-lo05",
    reviewed: false
  },
  {
    loId: "iot-04-lo05",
    type: "single",
    difficulty: 2,
    id: "iot-04-q19",
    stem: "Which attribute must be added to a variable declaration in C++ so that its value survives across ESP32 Deep Sleep cycles?",
    options: [
      { id: "a", text: "RTC_DATA_ATTR" },
      { id: "b", text: "PROGMEM" },
      { id: "c", text: "volatile" },
      { id: "d", text: "register" }
    ],
    answer: ["a"],
    explanation: "`RTC_DATA_ATTR` places variables in the 8KB RTC slow memory domain that remains powered during deep sleep.",
    noteRef: "iot-04-lo05",
    reviewed: false
  },
  {
    loId: "iot-04-lo05",
    type: "single",
    difficulty: 3,
    id: "iot-04-q20",
    stem: "What fundamental operational difference distinguishes Light Sleep from Deep Sleep on the ESP32?",
    options: [
      { id: "a", text: "Light sleep retains full CPU and SRAM state and resumes code execution immediately, whereas deep sleep powers down main RAM and restarts from boot." },
      { id: "b", text: "Light sleep consumes less power than deep sleep." },
      { id: "c", text: "Light sleep can only wake up from Wi-Fi signals." },
      { id: "d", text: "There is no difference between Light and Deep sleep." }
    ],
    answer: ["a"],
    explanation: "Light sleep pauses clocks while preserving full RAM state; deep sleep drops power to near-zero by unpowering main RAM.",
    noteRef: "iot-04-lo05",
    reviewed: false
  },

  // LO06
  {
    loId: "iot-04-lo06",
    type: "single",
    difficulty: 1,
    id: "iot-04-q21",
    stem: "What occurs if the baud rate set in `Serial.begin(115200)` does not match the baud rate selected in the host Serial Monitor terminal?",
    options: [
      { id: "a", text: "The terminal displays unreadable corrupted garbage symbols due to timing mismatch." },
      { id: "b", text: "The microcontroller permanently locks its flash memory." },
      { id: "c", text: "The computer's USB port blows a fuse." },
      { id: "d", text: "The text is automatically translated into French." }
    ],
    answer: ["a"],
    explanation: "UART is asynchronous and lacks a clock line; mismatched baud rates cause bit framing errors, outputting garbage characters.",
    noteRef: "iot-04-lo06",
    reviewed: false
  },
  {
    loId: "iot-04-lo06",
    type: "scenario",
    difficulty: 2,
    id: "iot-04-q22",
    stem: "An engineer wants to output structured debug telemetry containing integers and floating-point sensor values in a single statement on ESP32. Which method is most concise?",
    options: [
      { id: "a", text: "Serial.printf(\"Sensor %d: Temp=%.2f C\\n\", id, temp);" },
      { id: "b", text: "Chaining eight consecutive Serial.print() statements." },
      { id: "c", text: "Writing bytes directly to EEPROM." },
      { id: "d", text: "Using analogWrite() on the TX pin." }
    ],
    answer: ["a"],
    explanation: "ESP32 supports standard C `printf` formatting via `Serial.printf`, formatting multiple types cleanly.",
    noteRef: "iot-04-lo06",
    reviewed: false
  },
  {
    loId: "iot-04-lo06",
    type: "single",
    difficulty: 2,
    id: "iot-04-q23",
    stem: "Why are preprocessor macros (`#ifdef DEBUG ... #endif`) used around serial logging statements in production firmware?",
    options: [
      { id: "a", text: "To strip logging code and string literals completely out of release binaries, saving flash memory and preventing execution latency." },
      { id: "b", text: "To encrypt the serial output." },
      { id: "c", text: "Because serial ports stop working after 1 hour." },
      { id: "d", text: "To comply with Wi-Fi regulatory certifications." }
    ],
    answer: ["a"],
    explanation: "Conditional compilation removes debug strings from binary images, minimizing flash usage and eliminating serial latency.",
    noteRef: "iot-04-lo06",
    reviewed: false
  },
  {
    loId: "iot-04-lo06",
    type: "single",
    difficulty: 3,
    id: "iot-04-q24",
    stem: "What utility can decode a hexadecimal ESP32 backtrace dump printed during a Guru Meditation panic error into human-readable source code filenames and line numbers?",
    options: [
      { id: "a", text: "addr2line (ESP Exception Decoder)" },
      { id: "b", text: "Wireshark" },
      { id: "c", text: "Nmap" },
      { id: "d", text: "Fdisk" }
    ],
    answer: ["a"],
    explanation: "`addr2line` maps memory program counter addresses back to exact source file lines using compiler ELF debug symbols.",
    noteRef: "iot-04-lo06",
    reviewed: false
  },

  // LO07
  {
    loId: "iot-04-lo07",
    type: "single",
    difficulty: 1,
    id: "iot-04-q25",
    stem: "What is Heap Fragmentation in embedded microcontroller programming?",
    options: [
      { id: "a", text: "The breakdown of available free heap memory into small, non-contiguous gaps caused by frequent dynamic allocations and deallocations." },
      { id: "b", text: "Physical cracks on the microcontroller silicon die." },
      { id: "c", text: "A hardware failure of the crystal oscillator." },
      { id: "d", text: "Overheating of the USB connector." }
    ],
    answer: ["a"],
    explanation: "Dynamic allocations intersperse allocated and freed chunks; over time, no single large contiguous block remains.",
    noteRef: "iot-04-lo07",
    reviewed: false
  },
  {
    loId: "iot-04-lo07",
    type: "scenario",
    difficulty: 2,
    id: "iot-04-q26",
    stem: "An IoT gateway running on Arduino Uno crashes every 3 days. The code repeatedly concatenates sensor telemetry using the `String` class (`payload += String(temp)`). What is the root cause?",
    options: [
      { id: "a", text: "Heap fragmentation and memory exhaustion caused by thousands of dynamic reallocations in the tiny 2KB SRAM." },
      { id: "b", text: "The temperature sensor became too hot." },
      { id: "c", text: "The Arduino ran out of resistor resistance." },
      { id: "d", text: "The 5V power supply ran backwards." }
    ],
    answer: ["a"],
    explanation: "Arduino `String` objects reallocate heap buffers on every concatenation, rapidly fragmenting 2KB AVR SRAM.",
    noteRef: "iot-04-lo07",
    reviewed: false
  },
  {
    loId: "iot-04-lo07",
    type: "multi",
    difficulty: 2,
    id: "iot-04-q27",
    stem: "Which practices prevent dynamic heap fragmentation in production embedded firmware?",
    options: [
      { id: "a", text: "Using fixed-size static character buffers with `snprintf()` instead of dynamic `String` classes" },
      { id: "b", text: "Allocating long-lived buffers globally or statically at compile time" },
      { id: "c", text: "Avoiding frequent `malloc()` and `free()` inside continuous operational loops" },
      { id: "d", text: "Allocating 10MB arrays on 2KB microcontrollers" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Static allocation and `snprintf` with fixed buffers eliminate runtime heap churning and guarantee memory bounds.",
    noteRef: "iot-04-lo07",
    reviewed: false
  },
  {
    loId: "iot-04-lo07",
    type: "single",
    difficulty: 3,
    id: "iot-04-q28",
    stem: "What fatal hardware exception occurs when deeply nested function calls or massive local arrays exceed allocated task stack boundaries?",
    options: [
      { id: "a", text: "Stack Overflow (overwriting adjacent memory or triggering the memory protection unit)" },
      { id: "b", text: "Bus contention" },
      { id: "c", text: "Clock desynchronization" },
      { id: "d", text: "Floating gate erase" }
    ],
    answer: ["a"],
    explanation: "A stack overflow pushes return addresses and variables past allocated stack boundaries, corrupting data and crashing.",
    noteRef: "iot-04-lo07",
    reviewed: false
  },

  // LO08
  {
    loId: "iot-04-lo08",
    type: "single",
    difficulty: 1,
    id: "iot-04-q29",
    stem: "What is the primary interface used in MicroPython to interactively execute Python commands line-by-line over a serial cable?",
    options: [
      { id: "a", text: "REPL (Read-Eval-Print Loop)" },
      { id: "b", text: "SSH terminal" },
      { id: "c", text: "Web browser HTTP console" },
      { id: "d", text: "FTP command line" }
    ],
    answer: ["a"],
    explanation: "The REPL (Read-Eval-Print Loop) gives developers live interactive prompt access to Python on the MCU.",
    noteRef: "iot-04-lo08",
    reviewed: false
  },
  {
    loId: "iot-04-lo08",
    type: "scenario",
    difficulty: 2,
    id: "iot-04-q30",
    stem: "An engineer powers on an ESP32 running MicroPython. Which script file does the MicroPython runtime execute automatically on boot before launching `main.py`?",
    options: [
      { id: "a", text: "boot.py" },
      { id: "b", text: "init.sh" },
      { id: "c", text: "config.json" },
      { id: "d", text: "index.html" }
    ],
    answer: ["a"],
    explanation: "MicroPython boots by running `boot.py` (system setup), followed immediately by `main.py` (application logic).",
    noteRef: "iot-04-lo08",
    reviewed: false
  },
  {
    loId: "iot-04-lo08",
    type: "single",
    difficulty: 2,
    id: "iot-04-q31",
    stem: "Which built-in MicroPython module provides low-level hardware control classes such as `Pin`, `ADC`, and `PWM`?",
    options: [
      { id: "a", text: "machine" },
      { id: "b", text: "sys" },
      { id: "c", text: "hardware" },
      { id: "d", text: "arduino" }
    ],
    answer: ["a"],
    explanation: "The `machine` module contains all microcontroller-specific hardware abstraction classes in MicroPython.",
    noteRef: "iot-04-lo08",
    reviewed: false
  },
  {
    loId: "iot-04-lo08",
    type: "single",
    difficulty: 3,
    id: "iot-04-q32",
    stem: "Why does MicroPython require significantly more Flash and RAM than compiled C/C++ firmware?",
    options: [
      { id: "a", text: "It must host the complete Python bytecode compiler, virtual machine runtime, and dynamic object memory allocator directly in chip memory." },
      { id: "b", text: "Because Python files cannot be compressed." },
      { id: "c", text: "Because MicroPython includes desktop Linux." },
      { id: "d", text: "MicroPython requires 1000 times more copper traces." }
    ],
    answer: ["a"],
    explanation: "The entire interpreter engine and dynamic object allocator reside on the device, requiring >256KB flash and >64KB RAM.",
    noteRef: "iot-04-lo08",
    reviewed: false
  },

  // LO09 (Extension)
  {
    loId: "iot-04-lo09",
    type: "single",
    difficulty: 2,
    id: "iot-04-q33",
    stem: "What runtime event in MicroPython can cause unpredictable 10ms to 50ms pauses, making it problematic for hard real-time motor control?",
    options: [
      { id: "a", text: "Automatic Garbage Collection (GC) sweeps" },
      { id: "b", text: "Hardware brownout detection" },
      { id: "c", text: "Wi-Fi packet encryption" },
      { id: "d", text: "ADC sampling rate division" }
    ],
    answer: ["a"],
    explanation: "Automatic garbage collection suspends execution while traversing and recovering heap objects, introducing jitter.",
    noteRef: "iot-04-lo09",
    reviewed: false
  },
  {
    loId: "iot-04-lo09",
    type: "scenario",
    difficulty: 2,
    id: "iot-04-q34",
    stem: "A company is building a high-volume commercial smart thermostat powered by coin-cell batteries that must run for 5 years and handle digital audio processing. Which programming language should be selected?",
    options: [
      { id: "a", text: "C/C++ using the native ESP-IDF framework for minimal power and maximum DSP execution efficiency." },
      { id: "b", text: "MicroPython via the interactive REPL." },
      { id: "c", text: "Client-side JavaScript running in Node.js." },
      { id: "d", text: "PHP script." }
    ],
    answer: ["a"],
    explanation: "C/C++ provides optimal instruction density, native DSP execution, and microamp deep sleep capabilities.",
    noteRef: "iot-04-lo09",
    reviewed: false
  },
  {
    loId: "iot-04-lo09",
    type: "multi",
    difficulty: 3,
    id: "iot-04-q35",
    stem: "In which engineering scenarios is MicroPython superior to C/C++?",
    options: [
      { id: "a", text: "Rapid proof-of-concept prototyping and testing sensor APIs without compilation delays" },
      { id: "b", text: "Educational classrooms teaching beginners physical computing concepts" },
      { id: "c", text: "Interactive hardware troubleshooting via line-by-line REPL commands" },
      { id: "d", text: "Developing flight-stabilization loops for 30,000 RPM drone motors" }
    ],
    answer: ["a", "b", "c"],
    explanation: "MicroPython excels at prototyping, teaching, and interactive debugging; ultra-fast motor control requires C/C++.",
    noteRef: "iot-04-lo09",
    reviewed: false
  },
  {
    loId: "iot-04-lo09",
    type: "single",
    difficulty: 3,
    id: "iot-04-q36",
    stem: "Why does compiled C/C++ execute roughly 10x to 50x faster on microcontrollers than MicroPython?",
    options: [
      { id: "a", text: "C/C++ compiles directly into native CPU machine instructions, whereas MicroPython interprets bytecode instructions through virtual machine software loops." },
      { id: "b", text: "C++ runs on gold-plated wires." },
      { id: "c", text: "MicroPython limits CPU clock speed to 1 MHz." },
      { id: "d", text: "C++ programs do not consume electricity." }
    ],
    answer: ["a"],
    explanation: "Native machine code executes directly on CPU silicon pipelines without bytecode interpretation overhead.",
    noteRef: "iot-04-lo09",
    reviewed: false
  }
];

balanceAndSave('iot', 'embedded-programming-c-and-micropython', ch04Objectives, ch04Questions);

// ==========================================
// CHAPTER 05: wired-protocols-uart-i2c-spi (iot-05) [evergreen]
// ==========================================

const ch05Objectives = {
  version: 1,
  chapterId: "iot-05",
  objectives: [
    {
      id: "iot-05-lo01",
      order: 1,
      title: "Analyze Universal Asynchronous Receiver-Transmitter (UART) framing, baud rates, and point-to-point wiring",
      bloom: "analyze",
      tier: "core",
      mustHave: true,
      keywords: ["uart", "baud rate", "tx rx crossover", "start stop bits", "parity bit"],
      aliases: ["serial communication", "asynchronous uart"],
      prerequisites: ["iot-02-lo01"],
      estMinutes: 12
    },
    {
      id: "iot-05-lo02",
      order: 2,
      title: "Construct Inter-Integrated Circuit (I2C) multi-device buses with open-drain lines and pull-up resistors",
      bloom: "construct",
      tier: "core",
      mustHave: true,
      keywords: ["i2c", "sda", "scl", "open drain", "pull-up sizing", "bus capacitance"],
      aliases: ["two wire interface", "i2c bus topology"],
      prerequisites: ["iot-02-lo04"],
      estMinutes: 14
    },
    {
      id: "iot-05-lo03",
      order: 3,
      title: "Trace I2C packet transactions: 7-bit addressing, Read/Write bits, ACK/NACK, and clock stretching",
      bloom: "trace",
      tier: "core",
      mustHave: true,
      keywords: ["i2c transaction", "7-bit address", "ack nack", "start condition", "clock stretching"],
      aliases: ["i2c protocol timing", "i2c packet structure"],
      prerequisites: ["iot-05-lo02"],
      estMinutes: 14
    },
    {
      id: "iot-05-lo04",
      order: 4,
      title: "Implement Serial Peripheral Interface (SPI) high-speed 4-wire full-duplex communication",
      bloom: "implement",
      tier: "core",
      mustHave: true,
      keywords: ["spi", "mosi", "miso", "sclk", "chip select", "cpol cpha modes"],
      aliases: ["serial peripheral interface", "spi 4-wire bus"],
      prerequisites: ["iot-05-lo01"],
      estMinutes: 14
    },
    {
      id: "iot-05-lo05",
      order: 5,
      title: "Evaluate SPI clock polarity (CPOL) and clock phase (CPHA) modes against sensor datasheets",
      bloom: "evaluate",
      tier: "core",
      mustHave: false,
      keywords: ["cpol", "cpha", "spi mode 0", "spi mode 3", "clock phase", "clock polarity"],
      aliases: ["spi transmission modes", "cpol cpha settings"],
      prerequisites: ["iot-05-lo04"],
      estMinutes: 12
    },
    {
      id: "iot-05-lo06",
      order: 6,
      title: "Select optimal communication protocols (UART vs. I2C vs. SPI) based on pin count, speed, and bus distance",
      bloom: "select",
      tier: "core",
      mustHave: true,
      keywords: ["protocol selection", "throughput comparison", "bus distance", "pin economy", "wired protocols"],
      aliases: ["uart vs i2c vs spi", "bus protocol comparison"],
      prerequisites: ["iot-05-lo03", "iot-05-lo04"],
      estMinutes: 14
    },
    {
      id: "iot-05-lo07",
      order: 7,
      title: "Read multi-byte sensor registers over I2C and reconstruct values across endianness formats",
      bloom: "parse",
      tier: "core",
      mustHave: false,
      keywords: ["sensor registers", "big-endian", "little-endian", "bitwise shift", "wire library"],
      aliases: ["reading i2c registers", "sensor data parsing"],
      prerequisites: ["iot-05-lo03"],
      estMinutes: 14
    },
    {
      id: "iot-05-lo08",
      order: 8,
      title: "Diagnose wired bus faults using I2C bus scanner sketches and logic analyzers",
      bloom: "diagnose",
      tier: "core",
      mustHave: false,
      keywords: ["i2c scanner", "logic analyzer", "bus hanging", "sda stuck low", "i2c recovery"],
      aliases: ["bus troubleshooting", "i2c fault diagnosis"],
      prerequisites: ["iot-05-lo02"],
      estMinutes: 12
    },
    {
      id: "iot-05-lo09",
      order: 9,
      title: "Interface differential industrial serial buses using RS-485 transceivers and Modbus RTU",
      bloom: "interface",
      tier: "extension",
      mustHave: false,
      keywords: ["rs-485", "differential signaling", "max485", "modbus rtu", "industrial bus"],
      aliases: ["rs485 communication", "differential serial"],
      prerequisites: ["iot-05-lo01"],
      estMinutes: 12
    }
  ]
};

// Notes for iot-05

writeNoteBlock('iot', 'wired-protocols-uart-i2c-spi', 'iot-05-lo01',
  `Universal Asynchronous Receiver-Transmitter (UART) is the ubiquitous point-to-point serial communication hardware protocol:
1. Physical Wiring (TX/RX Crossover): UART requires two data lines plus a mandatory common Ground. The Transmitter (TX) of Device A connects to the Receiver (RX) of Device B, and RX of Device A connects to TX of Device B ($TX \\rightarrow RX, RX \\rightarrow TX$).
2. Asynchronous Framing: Lacking a shared clock line, transmitter and receiver must agree in advance on an exact Baud Rate (symbols per second, e.g., $9600, 115200$).
3. Packet Frame Structure (Standard 8-N-1):
   - Idle State: Signal remains HIGH ($V_{CC}$).
   - Start Bit: Transitions LOW for 1 bit period to synchronize the receiver's internal clock generator.
   - Data Payload: 8 data bits transmitted least significant bit (LSB) first.
   - Parity Bit (Optional, 'N'=None): Used for primitive error detection (Even/Odd).
   - Stop Bit(s): 1 or 2 bits driven HIGH to terminate the frame and reset for the next byte.
4. Total Frame Overhead: Sending 8 bits of data in 8-N-1 format takes 10 physical bit durations (1 start + 8 data + 1 stop). At 115200 baud, theoretical maximum data transfer is $\\frac{115200}{10} = 11,520\\text{ bytes/sec}$.`,
  `Configuring hardware UART on ESP32 in Arduino C++:
\`\`\`cpp
#include <HardwareSerial.h>

// Use ESP32 Hardware Serial Port 2
HardwareSerial GPS_Serial(2);

void setup() {
  Serial.begin(115200); // USB monitor
  // Baud, Config, RX pin, TX pin
  GPS_Serial.begin(9600, SERIAL_8N1, 16, 17);
}

void loop() {
  while (GPS_Serial.available()) {
    char c = GPS_Serial.read();
    Serial.write(c); // Forward GPS byte to PC
  }
}
\`\`\``,
  `Connecting TX to TX and RX to RX between two microcontrollers; UART is a directional crossover bus where each transmitter must drive the opposing receiver.`,
  `How many total bits are transmitted on the physical wire to send a single 8-bit byte using standard 8-N-1 UART framing?`
);

writeNoteBlock('iot', 'wired-protocols-uart-i2c-spi', 'iot-05-lo02',
  `Inter-Integrated Circuit (I2C) is a synchronous, multi-device, 2-wire serial bus designed by Philips/NXP for short-distance board-level communications:
1. Physical Bus Architecture:
   - Serial Data (SDA): Bidirectional data line.
   - Serial Clock (SCL): Clock line driven by the bus Master.
2. Open-Drain with Pull-Up Resistors:
   Neither the master nor slaves ever drive SDA or SCL HIGH with an active push-pull transistor. Instead, pins operate in open-drain mode: they can only pull the line LOW to Ground or release it into a high-impedance state.
3. Pull-Up Resistor Sizing:
   External pull-up resistors (typically $2.2\\,\\text{k}\\Omega - 10\\,\\text{k}\\Omega$) tie SDA and SCL to $V_{CC}$ (e.g., $3.3\\text{V}$). When no device is asserting the bus, the lines float HIGH.
   - Too Large (e.g. $100\\,\\text{k}\\Omega$): Bus capacitance causes slow, rounded RC rise times, corrupting data at high speeds.
   - Too Small (e.g. $470\\,\\Omega$): Devices cannot sink enough current to pull the line cleanly below $V_{IL}$ ($0.3 \\times V_{CC}$).
   - Golden Rule: For $3.3\\text{V}$ buses at $400\\text{kHz}$ (Fast Mode), $4.7\\,\\text{k}\\Omega$ resistors are standard.`,
  `Python script calculating minimum and maximum I2C pull-up resistance:
\`\`\`python
def calculate_i2c_pullups(vcc, bus_capacitance_pf, speed_mode="standard"):
    # Rise time max: 1000ns for standard (100kHz), 300ns for fast (400kHz)
    t_rise_max = 1000e-9 if speed_mode == "standard" else 300e-9
    r_max = t_rise_max / (0.8473 * (bus_capacitance_pf * 1e-12))
    # Sink current limit 3mA max
    r_min = (vcc - 0.4) / 0.003
    return {"r_min_ohms": round(r_min), "r_max_ohms": round(r_max)}

res = calculate_i2c_pullups(vcc=3.3, bus_capacitance_pf=100, speed_mode="fast")
print(f"I2C Pull-Up Window: {res['r_min_ohms']} to {res['r_max_ohms']} Ohms")
# ~967 to ~3540 Ohms -> Use standard 2.2k or 3.3k Ohms
\`\`\``,
  `Omitting external pull-up resistors on an I2C bus where connected breakout boards lack onboard pull-ups; the bus lines float around intermediate voltages and transactions fail with time-out errors.`,
  `Why do I2C bus lines require pull-up resistors to $V_{CC}$ instead of relying on push-pull drivers?`
);

writeNoteBlock('iot', 'wired-protocols-uart-i2c-spi', 'iot-05-lo03',
  `I2C transactions follow a strict frame protocol governed by clock edges, addressing, and explicit acknowledgments:
1. Start and Stop Conditions:
   - START: SDA transitions from HIGH to LOW while SCL is HIGH, signaling a new transmission.
   - STOP: SDA transitions from LOW to HIGH while SCL is HIGH, releasing the bus.
2. 7-Bit Device Addressing:
   The master transmits an 8-bit byte containing 7 address bits (identifying up to 127 devices) and 1 Read/Write bit (0 for Write, 1 for Read).
3. Acknowledgment (ACK / NACK):
   After every 8-bit byte, the transmitter releases SDA during the 9th clock pulse.
   - ACK: The receiver pulls SDA LOW during the 9th clock pulse to confirm receipt.
   - NACK: SDA remains HIGH, indicating address mismatch or transfer completion.
4. Clock Stretching: If a slave needs extra processing time, it holds SCL LOW, pausing the master until released.`,
  `Tracing an I2C write sequence to a sensor register:
1. Master generates START condition.
2. Master transmits address byte (\`0x68 << 1 | 0\`).
3. Slave ($0x68$) pulls SDA LOW on 9th clock $\\rightarrow$ ACK.
4. Master transmits register address (\`0x3B\`).
5. Slave pulls SDA LOW on 9th clock $\\rightarrow$ ACK.
6. Master transmits data byte (\`0x01\`).
7. Slave pulls SDA LOW on 9th clock $\\rightarrow$ ACK.
8. Master generates STOP condition to release bus.`,
  `Confusing a sensor's 7-bit I2C address ($0x68$) with its 8-bit shifted write address ($0xD0$); passing $0xD0$ to \`Wire.beginTransmission()\` targets the wrong address because the library performs the 1-bit shift automatically.`,
  `What electrical signal state on SDA during the 9th SCL clock pulse represents a successful ACK in I2C?`
);

writeNoteBlock('iot', 'wired-protocols-uart-i2c-spi', 'iot-05-lo04',
  `Serial Peripheral Interface (SPI) is a synchronous, 4-wire, full-duplex communication bus engineered for maximum throughput between a master and peripherals:
1. Physical 4-Wire Bus Lines:
   - SCLK (Serial Clock): Clock generated by the Master (up to $10\\text{MHz} - 80\\text{MHz}$).
   - MOSI (Master Out Slave In) / SDO: Data sent from Master to Slave.
   - MISO (Master In Slave Out) / SDI: Data sent from Slave to Master.
   - CS / SS (Chip Select / Slave Select): Active-LOW line dedicated to selecting a specific peripheral.
2. High-Speed Push-Pull Drivers:
   Unlike I2C's passive open-drain pull-ups, SPI pins use active CMOS push-pull drivers. This allows sharp clock edges and high speeds ($>40\\text{Mbps}$ on ESP32), making SPI the universal choice for SD cards, graphical TFT displays, and RF transceivers.
3. Slave Addressing via Dedicated CS Lines:
   SPI has no software address bytes. To communicate with Slave 1, the master pulls CS1 LOW while keeping CS2 and CS3 HIGH.
4. Full-Duplex Shift Registers:
   During every clock pulse, the master shifts 1 bit out on MOSI while simultaneously shifting 1 bit in from MISO. Every SPI write is inherently also an SPI read.`,
  `Arduino C++ example executing high-speed SPI transactions:
\`\`\`cpp
#include <SPI.h>

const int CS_PIN = 5;

void setup() {
  pinMode(CS_PIN, OUTPUT);
  digitalWrite(CS_PIN, HIGH); // Deselect slave
  SPI.begin();
}

void loop() {
  // Configure SPI at 10 MHz, MSB first, SPI Mode 0
  SPI.beginTransaction(SPISettings(10000000, MSBFIRST, SPI_MODE0));
  digitalWrite(CS_PIN, LOW); // Select slave

  uint8_t response = SPI.transfer(0x80 | 0x0F); // Read register 0x0F

  digitalWrite(CS_PIN, HIGH); // Release slave
  SPI.endTransaction();
  delay(1000);
}
\`\`\``,
  `Leaving the Chip Select (CS) pin floating or held LOW on multiple slaves simultaneously; multiple slaves drive the shared MISO line at the same time, causing electrical bus contention and garbled data.`,
  `Why does SPI achieve dramatically higher transmission speeds (e.g. 40MHz) compared to I2C (400kHz)?`
);

writeNoteBlock('iot', 'wired-protocols-uart-i2c-spi', 'iot-05-lo05',
  `SPI transmission modes define the clock idling level and edge sampling phases, partitioned into four distinct modes by CPOL and CPHA:
1. Clock Polarity (CPOL): Defines the idle state of the SCLK line when no data is being transferred:
   - $\\text{CPOL} = 0$: Clock idles at LOW ($0\\text{V}$).
   - $\\text{CPOL} = 1$: Clock idles at HIGH ($V_{CC}$).
2. Clock Phase (CPHA): Defines which clock edge samples the data:
   - $\\text{CPHA} = 0$: Data sampled on the first (leading) clock edge and shifted on the second (trailing) edge.
   - $\\text{CPHA} = 1$: Data shifted on the first (leading) clock edge and sampled on the second (trailing) edge.
3. The Four Standard SPI Modes:
   - Mode 0 ($\\text{CPOL}=0, \\text{CPHA}=0$): Idles LOW, samples on Rising edge. Most common (SD cards, BME280).
   - Mode 1 ($\\text{CPOL}=0, \\text{CPHA}=1$): Idles LOW, samples on Falling edge.
   - Mode 2 ($\\text{CPOL}=1, \\text{CPHA}=0$): Idles HIGH, samples on Falling edge.
   - Mode 3 ($\\text{CPOL}=1, \\text{CPHA}=1$): Idles HIGH, samples on Rising edge.
4. Setting Modes in Code: Microcontrollers must configure \`SPISettings(speed, bitOrder, SPI_MODE)\` to match the peripheral datasheet's exact timing diagram.`,
  `Python script checking SPI mode compatibility:
\`\`\`python
def determine_spi_mode(cpol, cpha):
    modes = {
        (0, 0): "SPI_MODE0 (Clock idles LOW, samples on RISING edge)",
        (0, 1): "SPI_MODE1 (Clock idles LOW, samples on FALLING edge)",
        (1, 0): "SPI_MODE2 (Clock idles HIGH, samples on FALLING edge)",
        (1, 1): "SPI_MODE3 (Clock idles HIGH, samples on RISING edge)"
    }
    return modes.get((cpol, cpha), "INVALID")

# Testing Mode 0 and Mode 3 configurations
print(determine_spi_mode(0, 0)) # SPI_MODE0
print(determine_spi_mode(1, 1)) # SPI_MODE3
\`\`\``,
  `Attempting to communicate with an SPI sensor expecting Mode 3 using default Mode 0; clock edge misalignments cause all received bytes to be shifted by 1 bit, corrupting register reads.`,
  `In SPI Mode 0 ($\text{CPOL}=0, \text{CPHA}=0$), what is the clock idle state and which clock edge samples data?`
);

writeNoteBlock('iot', 'wired-protocols-uart-i2c-spi', 'iot-05-lo06',
  `System architects select communication protocols by evaluating trade-offs between speed, pin efficiency, distance, and hardware complexity:
1. Protocol Trade-Off Matrix:
   - UART: Point-to-point (2 devices). Pin count: 2 (TX, RX). Speed: up to $1\\text{Mbps}$. Distance: up to $2\\text{m}-5\\text{m}$ at TTL ($>100\\text{m}$ with RS-485). Best for: GPS modules, GSM/cellular modems, PC debug consoles.
   - I2C: Multi-drop bus (up to 127 devices). Pin count: strictly 2 (SDA, SCL) regardless of device count. Speed: $100\\text{kHz}$ (Standard), $400\\text{kHz}$ (Fast), $1\\text{MHz}$ (Fast+). Distance: $<1\\text{m}$ (limited by $400\\text{pF}$ bus capacitance). Best for: Low-speed environmental sensors (temp, humidity, pressure, RTC, IMUs).
   - SPI: Multi-device star bus. Pin count: $3 + N$ (SCLK, MOSI, MISO + 1 CS pin per slave). Speed: $10\\text{MHz} - 80\\text{MHz}$. Distance: $<0.3\\text{m}$ (PCB trace lengths). Best for: High-bandwidth devices (Color TFT screens, SD card storage, camera feeds).
2. Selection Decision Rule:
   If high throughput is required, choose SPI. If pin economy across many sensors is paramount, choose I2C. If communicating off-board point-to-point, choose UART.`,
  `Decision logic in Python selecting the optimal embedded protocol:
\`\`\`python
def select_wired_protocol(data_rate_kbps, num_devices, max_distance_meters):
    if data_rate_kbps > 2000:
        return "SPI (High throughput push-pull bus, requires CS per device)"
    elif num_devices > 2 and max_distance_meters < 1.0:
        return "I2C (Pin-efficient shared 2-wire bus, 7-bit addressing)"
    elif max_distance_meters > 2.0:
        return "UART with RS-485 transceiver (Differential signaling for long distance)"
    return "UART (Simple point-to-point asynchronous connection)"

# Selecting protocol for 5 temperature sensors on a single PCB:
print(select_wired_protocol(data_rate_kbps=50, num_devices=5, max_distance_meters=0.2)) # I2C
\`\`\``,
  `Attempting to run a 320x240 Color TFT LCD display over an I2C bus; at 400kHz, refreshing the 153,600-byte frame takes several seconds, producing unacceptably sluggish frame rates (<1 FPS).`,
  `Why is I2C preferred over SPI when connecting eight environmental sensors to a pin-constrained microcontroller?`
);

writeNoteBlock('iot', 'wired-protocols-uart-i2c-spi', 'iot-05-lo07',
  `Reading multi-byte sensor data over I2C requires querying internal memory registers and assembling raw bytes according to datasheet endianness formats:
1. Register-Based Architecture:
   Sensors organize readings across memory-mapped 8-bit registers. For example, a 16-bit accelerometer axis is split into two separate registers: \`ACCEL_X_OUT_H\` (high byte) and \`ACCEL_X_OUT_L\` (low byte).
2. Endianness Assembly:
   - Big-Endian (Most Significant Byte first):
     $$\\text{Value} = (\\text{High Byte} \\ll 8) \\mid \\text{Low Byte}$$
   - Little-Endian (Least Significant Byte first):
     $$\\text{Value} = (\\text{Low Byte}) \\mid (\\text{High Byte} \\ll 8)$$
3. Signed Value Sign Extension:
   Accelerometers output two's complement signed data (e.g., $-32,768$ to $+32,767$). Casting the combined 16-bit unsigned integer to an \`int16_t\` correctly sign-extends negative acceleration values.
4. Scale Factor Conversion:
   Multiply raw integer readings by the sensitivity scale factor (e.g., $0.061\\text{mg/LSB}$) documented in the sensor datasheet to yield engineering units ($m/s^2$ or $g$).`,
  `Arduino C++ reading a 16-bit sensor axis over I2C:
\`\`\`cpp
#include <Wire.h>

int16_t read_mpu_axis(uint8_t reg_high) {
  Wire.beginTransmission(0x68);
  Wire.write(reg_high); // Request high byte register
  Wire.endTransmission(false); // Repeated start condition

  Wire.requestFrom((uint8_t)0x68, (uint8_t)2); // Request 2 bytes
  uint8_t msb = Wire.read();
  uint8_t lsb = Wire.read();

  // Combine into 16-bit signed integer (Big-Endian)
  int16_t raw_accel = (int16_t)((msb << 8) | lsb);
  return raw_accel;
}
\`\`\``,
  `Omitting the cast to \`int16_t\` when combining signed 16-bit sensor bytes; negative acceleration readings register as huge positive values around $+65,000$ due to unsigned interpretation.`,
  `How are a high byte (\`msb\`) and low byte (\`lsb\`) combined into a single 16-bit big-endian value in C++?`
);

writeNoteBlock('iot', 'wired-protocols-uart-i2c-spi', 'iot-05-lo08',
  `Wired serial buses can deadlock due to physical layer faults or clock timing bugs, requiring systematic diagnosis:
1. The I2C Bus Scanner: A firmware diagnostic tool that sweeps through all 127 7-bit addresses. For each address, it sends a START and address byte, checking if an ACK is received. If a device ACKs, its hexadecimal address is printed to the serial monitor.
2. The "SDA Stuck LOW" Bus Hang:
   If an MCU resets in the middle of reading a byte from an I2C slave, the slave may be waiting to output a '0' bit on SDA, holding SDA permanently LOW. Because SDA is held LOW, the master cannot generate a valid START condition, freezing the bus.
   - Recovery Sequence: The master reconfigures SCL as a GPIO output and manually clocks SCL 9 to 16 times until the slave releases SDA, then sends a STOP condition.
3. Logic Analyzer Debugging:
   Hardware logic analyzers (such as Saleae or open-source 24MHz USB analyzers with PulseView) decode bus waveforms in real time, inspecting address bytes, ACK/NACK bits, and setup/hold timing violations.`,
  `Standard I2C scanner diagnostic function in Arduino C++:
\`\`\`cpp
#include <Wire.h>

void scan_i2c_bus() {
  Serial.println("Scanning I2C Bus for responsive addresses...");
  byte count = 0;
  for (byte addr = 1; addr < 127; addr++) {
    Wire.beginTransmission(addr);
    byte error = Wire.endTransmission();
    if (error == 0) {
      Serial.printf("Device detected at address 0x%02X\n", addr);
      count++;
    }
  }
  Serial.printf("Scan complete. %d device(s) found.\n", count);
}
\`\`\``,
  `Assuming an unresponsive I2C sensor is broken without checking if multiple devices on the bus share identical hardwired I2C addresses (e.g. two display boards hardcoded to $0x3C$).`,
  `How does a microcontroller recover an I2C bus when a slave peripheral has locked SDA in a persistent LOW state?`
);

writeNoteBlock('iot', 'wired-protocols-uart-i2c-spi', 'iot-05-lo09',
  `Standard TTL serial signals ($0\\text{V} - 3.3\\text{V}$) degrade over a few meters; industrial automation relies on differential signaling over RS-485 for noisy, kilometer-long runs:
1. Differential Signaling Architecture (RS-485):
   Uses a twisted pair of balanced wires named 'A' and 'B'. Rather than measuring voltage relative to ground, the receiver measures the differential voltage between the lines:
   $$V_{\\text{diff}} = V_A - V_B$$
   Common-mode electromagnetic noise (from nearby factory motors or heavy relays) couples equally into both twisted wires, canceling out at the differential receiver.
2. Physical Specifications:
   - Transmission Distance: Up to $1200\\text{ meters}$ ($1.2\\text{km}$).
   - Data Rates: Up to $10\\text{Mbps}$ at short ranges ($100\\text{kbps}$ at $1200\\text{m}$).
   - Termination Resistors: A $120\\,\\Omega$ resistor must be placed across lines A and B at both physical ends of the bus to prevent transmission line signal reflections.
3. Modbus RTU Protocol:
   An industrial master-slave binary protocol operating over RS-485. Modbus packets contain Slave Address (1 byte), Function Code (e.g., Read Holding Registers $0x03$), Data, and a 16-bit CRC checksum.`,
  `Wiring and driving an RS-485 transceiver (MAX485) in Arduino:
\`\`\`cpp
const int DE_RE_PIN = 4; // Driver Enable / Receiver Enable pin

void send_modbus_packet(uint8_t* packet, size_t length) {
  digitalWrite(DE_RE_PIN, HIGH); // Enable TX driver mode
  Serial2.write(packet, length);
  Serial2.flush();               // Wait until all bytes transmitted
  digitalWrite(DE_RE_PIN, LOW);  // Return to RX listen mode
}
\`\`\``,
  `Omitting the $120\\,\\Omega$ termination resistors on long RS-485 cable runs; electrical reflections from unterminated wire ends bounce back and corrupt incoming serial packets.`,
  `Why is differential signaling on RS-485 immune to heavy electromagnetic noise in industrial environments?`
);

// Questions for iot-05
const ch05Questions = [
  // LO01
  {
    loId: "iot-05-lo01",
    type: "single",
    difficulty: 1,
    id: "iot-05-q01",
    stem: "How must the TX and RX pins be connected between two devices communicating over UART?",
    options: [
      { id: "a", text: "Device A TX connects to Device B RX, and Device A RX connects to Device B TX (Crossover connection)." },
      { id: "b", text: "TX connects to TX, and RX connects to RX directly." },
      { id: "c", text: "Both TX and RX connect to Ground." },
      { id: "d", text: "TX connects to the 5V power pin." }
    ],
    answer: ["a"],
    explanation: "UART transmitters must drive the opposing receivers in a TX-to-RX crossover arrangement.",
    noteRef: "iot-05-lo01",
    reviewed: false
  },
  {
    loId: "iot-05-lo01",
    type: "scenario",
    difficulty: 2,
    id: "iot-05-q02",
    stem: "A micro-GPS receiver transmits data using 9600 baud 8-N-1 UART. How many total physical bits are transmitted over the wire to deliver 100 bytes of NMEA data?",
    options: [
      { id: "a", text: "1000 bits" },
      { id: "b", text: "800 bits" },
      { id: "c", text: "100 bits" },
      { id: "d", text: "1600 bits" }
    ],
    answer: ["a"],
    explanation: "Standard 8-N-1 framing has 10 bits per byte (1 start + 8 data + 1 stop); 100 bytes * 10 = 1000 bits.",
    noteRef: "iot-05-lo01",
    reviewed: false
  },
  {
    loId: "iot-05-lo01",
    type: "numeric",
    difficulty: 2,
    id: "iot-05-q03",
    stem: "What is the theoretical maximum transmission rate in bytes per second for a UART connection operating at 115200 baud with 8-N-1 framing (10 bits/byte)?",
    options: [
      { id: "a", text: "11520" },
      { id: "b", text: "14400" },
      { id: "c", text: "9600" },
      { id: "d", text: "57600" }
    ],
    answer: ["a"],
    explanation: "115200 baud / 10 bits per byte = 11,520 bytes per second.",
    noteRef: "iot-05-lo01",
    verify: "(115200 / 10 === 11520)",
    reviewed: false
  },
  {
    loId: "iot-05-lo01",
    type: "single",
    difficulty: 3,
    id: "iot-05-q04",
    stem: "Why does UART communication fail completely if the transmitter and receiver clock generators deviate from each other by more than roughly 3%?",
    options: [
      { id: "a", text: "Because UART lacks a shared clock line; accumulated clock drift causes the receiver to sample data bits at the incorrect time within the 10-bit frame window." },
      { id: "b", text: "Because UART chips explode if clocks differ." },
      { id: "c", text: "Because UART requires microwave laser synchronization." },
      { id: "d", text: "Because the baud rate automatically switches to zero." }
    ],
    answer: ["a"],
    explanation: "Asynchronous sampling accumulates timing error across the frame; >3% drift misaligns bit center sampling.",
    noteRef: "iot-05-lo01",
    reviewed: false
  },

  // LO02
  {
    loId: "iot-05-lo02",
    type: "single",
    difficulty: 1,
    id: "iot-05-q05",
    stem: "What are the two physical signal lines used by the Inter-Integrated Circuit (I2C) bus?",
    options: [
      { id: "a", text: "SDA (Serial Data) and SCL (Serial Clock)" },
      { id: "b", text: "MOSI and MISO" },
      { id: "c", text: "TX and RX" },
      { id: "d", text: "CAN_H and CAN_L" }
    ],
    answer: ["a"],
    explanation: "I2C uses exactly two bidirectional bus lines: SDA (Serial Data) and SCL (Serial Clock).",
    noteRef: "iot-05-lo02",
    reviewed: false
  },
  {
    loId: "iot-05-lo02",
    type: "scenario",
    difficulty: 2,
    id: "iot-05-q06",
    stem: "An engineer designs an I2C sensor board but forgets to include pull-up resistors on SDA and SCL. When the MCU attempts to read the sensor, what happens?",
    options: [
      { id: "a", text: "The lines float in an undefined state and the bus hangs, failing to establish START conditions or transfer data." },
      { id: "b", text: "The bus operates at double speed." },
      { id: "c", text: "The sensor automatically switches to Bluetooth." },
      { id: "d", text: "The microcontroller GPIO pins short circuit." }
    ],
    answer: ["a"],
    explanation: "Open-drain buses cannot drive lines HIGH; without pull-ups, lines float and transactions fail.",
    noteRef: "iot-05-lo02",
    reviewed: false
  },
  {
    loId: "iot-05-lo02",
    type: "single",
    difficulty: 2,
    id: "iot-05-q07",
    stem: "What is the typical recommended pull-up resistor value for an I2C bus operating at 3.3V and 400 kHz (Fast Mode)?",
    options: [
      { id: "a", text: "2.2k to 4.7k Ohms" },
      { id: "b", text: "100k Ohms" },
      { id: "c", text: "10 Ohms" },
      { id: "d", text: "1 Mega-Ohm" }
    ],
    answer: ["a"],
    explanation: "At 400kHz, 2.2k to 4.7k Ohm resistors ensure fast RC rise times while respecting the 3mA driver sink limit.",
    noteRef: "iot-05-lo02",
    reviewed: false
  },
  {
    loId: "iot-05-lo02",
    type: "single",
    difficulty: 3,
    id: "iot-05-q08",
    stem: "Why does total bus capacitance (limited to 400 pF by the I2C specification) restrict the physical length of an I2C bus?",
    options: [
      { id: "a", text: "Higher cable capacitance slows the passive RC voltage rise time, rounding square wave clock pulses and causing bit decode errors at high frequencies." },
      { id: "b", text: "Capacitance consumes DC electrical power." },
      { id: "c", text: "Capacitance causes radio emissions that are banned." },
      { id: "d", text: "I2C cables become physically heavy." }
    ],
    answer: ["a"],
    explanation: "Cable capacitance creates a low-pass filter with pull-up resistors; exceeding 400pF degrades rise times.",
    noteRef: "iot-05-lo02",
    reviewed: false
  },

  // LO03
  {
    loId: "iot-05-lo03",
    type: "single",
    difficulty: 1,
    id: "iot-05-q09",
    stem: "How is an I2C START condition generated on the bus?",
    options: [
      { id: "a", text: "SDA transitions from HIGH to LOW while SCL remains HIGH." },
      { id: "b", text: "SDA transitions from LOW to HIGH while SCL remains LOW." },
      { id: "c", text: "Both SDA and SCL stay LOW for 1 hour." },
      { id: "d", text: "Sending an ASCII 'S' character over UART." }
    ],
    answer: ["a"],
    explanation: "A START condition is defined as a HIGH-to-LOW transition on SDA while SCL is held HIGH.",
    noteRef: "iot-05-lo03",
    reviewed: false
  },
  {
    loId: "iot-05-lo03",
    type: "scenario",
    difficulty: 2,
    id: "iot-05-q10",
    stem: "A microcontroller sends an address byte to an I2C temperature sensor. On the 9th clock pulse, the sensor pulls SDA LOW. What signal was delivered?",
    options: [
      { id: "a", text: "ACK (Acknowledge)" },
      { id: "b", text: "NACK (Not Acknowledge)" },
      { id: "c", text: "STOP condition" },
      { id: "d", text: "Clock Stretch" }
    ],
    answer: ["a"],
    explanation: "Pulling SDA LOW during the 9th clock pulse confirms acknowledgment (ACK) of the preceding byte.",
    noteRef: "iot-05-lo03",
    reviewed: false
  },
  {
    loId: "iot-05-lo03",
    type: "numeric",
    difficulty: 2,
    id: "iot-05-q11",
    stem: "What is the theoretical maximum number of distinct peripheral devices that can be addressed on an I2C bus using standard 7-bit addressing?",
    options: [
      { id: "a", text: "128" },
      { id: "b", text: "256" },
      { id: "c", text: "64" },
      { id: "d", text: "16" }
    ],
    answer: ["a"],
    explanation: "A 7-bit address space yields 2^7 = 128 possible addresses (addresses 0x00 and several others are reserved).",
    noteRef: "iot-05-lo03",
    verify: "(2 ** 7 === 128)",
    reviewed: false
  },
  {
    loId: "iot-05-lo03",
    type: "single",
    difficulty: 3,
    id: "iot-05-q12",
    stem: "What mechanism allows an I2C slave peripheral to pause the master if it needs extra time to process an internal conversion?",
    options: [
      { id: "a", text: "Clock Stretching (the slave pulls SCL LOW, forcing the master to wait before continuing the clock)." },
      { id: "b", text: "Turning off the power supply." },
      { id: "c", text: "Sending an interrupt over the MOSI pin." },
      { id: "d", text: "Flashing an onboard LED." }
    ],
    answer: ["a"],
    explanation: "Slaves hold SCL LOW to stretch the clock period, pausing the master until data is ready.",
    noteRef: "iot-05-lo03",
    reviewed: false
  },

  // LO04
  {
    loId: "iot-05-lo04",
    type: "single",
    difficulty: 1,
    id: "iot-05-q13",
    stem: "What are the four signal lines in a standard SPI communication bus?",
    options: [
      { id: "a", text: "MOSI, MISO, SCLK, and CS (Chip Select)" },
      { id: "b", text: "SDA, SCL, VCC, GND" },
      { id: "c", text: "TX, RX, RTS, CTS" },
      { id: "d", text: "CAN_H, CAN_L, 12V, GND" }
    ],
    answer: ["a"],
    explanation: "Standard 4-wire SPI uses Master Out Slave In (MOSI), Master In Slave Out (MISO), Serial Clock (SCLK), and Chip Select (CS).",
    noteRef: "iot-05-lo04",
    reviewed: false
  },
  {
    loId: "iot-05-lo04",
    type: "scenario",
    difficulty: 2,
    id: "iot-05-q14",
    stem: "An engineer attaches three separate SPI devices (an SD card, a display, and a sensor) to an ESP32. How does the master select which device to talk to?",
    options: [
      { id: "a", text: "By pulling the specific target device's dedicated Chip Select (CS) pin LOW while keeping all others HIGH." },
      { id: "b", text: "By broadcasting a 7-bit digital address over MOSI." },
      { id: "c", text: "By changing the SPI clock frequency." },
      { id: "d", text: "SPI only supports one device per microcontroller." }
    ],
    answer: ["a"],
    explanation: "SPI uses dedicated active-LOW hardware Chip Select (CS) lines to address individual slave devices.",
    noteRef: "iot-05-lo04",
    reviewed: false
  },
  {
    loId: "iot-05-lo04",
    type: "single",
    difficulty: 2,
    id: "iot-05-q15",
    stem: "Why does SPI achieve dramatically higher transmission data rates (e.g. 40MHz - 80MHz) than I2C (400kHz)?",
    options: [
      { id: "a", text: "SPI lines use active push-pull CMOS output transistors with sharp transition edges rather than passive high-resistance open-drain pull-ups." },
      { id: "b", text: "SPI cables are made of pure silver." },
      { id: "c", text: "SPI only transmits odd numbers." },
      { id: "d", text: "SPI does not require Ground." }
    ],
    answer: ["a"],
    explanation: "Push-pull drivers charge and discharge line capacitance actively, producing fast edges at high clock speeds.",
    noteRef: "iot-05-lo04",
    reviewed: false
  },
  {
    loId: "iot-05-lo04",
    type: "single",
    difficulty: 3,
    id: "iot-05-q16",
    stem: "What is meant by 'Full-Duplex' in SPI bus communication?",
    options: [
      { id: "a", text: "Data is transmitted simultaneously in both directions: master sends a bit on MOSI while reading a bit on MISO during the exact same clock pulse." },
      { id: "b", text: "Data can only travel in one direction at a time." },
      { id: "c", text: "The bus operates without any wires." },
      { id: "d", text: "Every packet is sent twice for safety." }
    ],
    answer: ["a"],
    explanation: "Full-duplex allows simultaneous bidirectional transmission via shared shift registers clocked together.",
    noteRef: "iot-05-lo04",
    reviewed: false
  },

  // LO05
  {
    loId: "iot-05-lo05",
    type: "single",
    difficulty: 1,
    id: "iot-05-q17",
    stem: "In SPI communication, what does Clock Polarity (CPOL) define?",
    options: [
      { id: "a", text: "The electrical logic level (LOW or HIGH) of the SCLK line when the bus is idle." },
      { id: "b", text: "The maximum operating temperature of the chip." },
      { id: "c", text: "The physical direction of electron flow." },
      { id: "d", text: "The baud rate of the serial monitor." }
    ],
    answer: ["a"],
    explanation: "CPOL defines whether the clock line idles LOW (CPOL=0) or idles HIGH (CPOL=1).",
    noteRef: "iot-05-lo05",
    reviewed: false
  },
  {
    loId: "iot-05-lo05",
    type: "scenario",
    difficulty: 2,
    id: "iot-05-q18",
    stem: "A datasheet states an SPI sensor requires Mode 0 (CPOL=0, CPHA=0). When does the receiver sample the incoming data on MOSI/MISO?",
    options: [
      { id: "a", text: "On the rising (leading) edge of SCLK." },
      { id: "b", text: "On the falling (trailing) edge of SCLK." },
      { id: "c", text: "Only when CS transitions HIGH." },
      { id: "d", text: "Continuous analog sampling." }
    ],
    answer: ["a"],
    explanation: "In Mode 0, the clock idles LOW and samples data on the first (rising) clock edge.",
    noteRef: "iot-05-lo05",
    reviewed: false
  },
  {
    loId: "iot-05-lo05",
    type: "multi",
    difficulty: 2,
    id: "iot-05-q19",
    stem: "Which of the following parameters are specified when configuring an SPI transaction using `SPISettings()`?",
    options: [
      { id: "a", text: "Maximum clock frequency (e.g. 10000000 for 10MHz)" },
      { id: "b", text: "Bit order (MSBFIRST or LSBFIRST)" },
      { id: "c", text: "SPI Mode (SPI_MODE0, SPI_MODE1, SPI_MODE2, or SPI_MODE3)" },
      { id: "d", text: "Wi-Fi SSID network name" }
    ],
    answer: ["a", "b", "c"],
    explanation: "`SPISettings` takes clock frequency, bit transmission order, and SPI mode (0-3).",
    noteRef: "iot-05-lo05",
    reviewed: false
  },
  {
    loId: "iot-05-lo05",
    type: "single",
    difficulty: 3,
    id: "iot-05-q20",
    stem: "What failure symptom typically occurs if an SPI master is configured for CPHA=0 when communicating with a peripheral that expects CPHA=1?",
    options: [
      { id: "a", text: "Every received byte is shifted by 1 bit, corrupting register numbers and data values." },
      { id: "b", text: "The microcontroller GPIO pins melt." },
      { id: "c", text: "The power supply voltage doubles." },
      { id: "d", text: "The SPI clock frequency drops to zero." }
    ],
    answer: ["a"],
    explanation: "Mismatched CPHA samples data during shift transitions, causing a 1-bit offset in all transmitted bytes.",
    noteRef: "iot-05-lo05",
    reviewed: false
  },

  // LO06
  {
    loId: "iot-05-lo06",
    type: "single",
    difficulty: 1,
    id: "iot-05-q21",
    stem: "Which wired protocol requires the FEWEST microcontroller GPIO pins when connecting 6 external environmental sensors to a single board?",
    options: [
      { id: "a", text: "I2C (strictly 2 pins for all 6 sensors)" },
      { id: "b", text: "SPI (requires 3 shared pins + 6 separate CS pins = 9 pins)" },
      { id: "c", text: "UART (requires 2 dedicated pins per device = 12 pins)" },
      { id: "d", text: "Parallel 8-bit bus" }
    ],
    answer: ["a"],
    explanation: "I2C uses a shared 2-wire bus where all 6 sensors share the same SDA and SCL lines via 7-bit addressing.",
    noteRef: "iot-05-lo06",
    reviewed: false
  },
  {
    loId: "iot-05-lo06",
    type: "scenario",
    difficulty: 2,
    id: "iot-05-q22",
    stem: "An engineer needs to drive a 320x240 pixel 16-bit color TFT display (requiring ~153 KB per screen refresh). Which protocol is required to achieve smooth 25 FPS frame rates?",
    options: [
      { id: "a", text: "SPI operating at 40MHz or higher." },
      { id: "b", text: "I2C operating at 100kHz." },
      { id: "c", text: "UART operating at 9600 baud." },
      { id: "d", text: "1-Wire bus." }
    ],
    answer: ["a"],
    explanation: "153 KB * 25 FPS = ~30 Mbps throughput, requiring high-speed push-pull SPI buses.",
    noteRef: "iot-05-lo06",
    reviewed: false
  },
  {
    loId: "iot-05-lo06",
    type: "multi",
    difficulty: 2,
    id: "iot-05-q23",
    stem: "Which of the following factors should guide the selection between UART, I2C, and SPI in an IoT hardware design?",
    options: [
      { id: "a", text: "Required bandwidth and data throughput" },
      { id: "b", text: "Number of available GPIO pins on the microcontroller" },
      { id: "c", text: "Physical distance between components" },
      { id: "d", text: "Color of the PCB solder mask" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Bandwidth, pin economy, and bus trace distance govern serial protocol selection.",
    noteRef: "iot-05-lo06",
    reviewed: false
  },
  {
    loId: "iot-05-lo06",
    type: "single",
    difficulty: 3,
    id: "iot-05-q24",
    stem: "Why is UART with an RS-485 transceiver preferred over I2C or SPI for communicating across a 100-meter factory floor?",
    options: [
      { id: "a", text: "I2C and SPI are high-impedance unbalanced board-level buses that cannot tolerate high cable capacitance and EMI; RS-485 uses balanced differential signaling over long distances." },
      { id: "b", text: "RS-485 does not require cables." },
      { id: "c", text: "I2C only works in cold weather." },
      { id: "d", text: "SPI cannot transmit numbers above 100." }
    ],
    answer: ["a"],
    explanation: "I2C/SPI are short-distance PCB buses (<1m); differential RS-485 cancels noise over kilometer distances.",
    noteRef: "iot-05-lo06",
    reviewed: false
  },

  // LO07
  {
    loId: "iot-05-lo07",
    type: "single",
    difficulty: 1,
    id: "iot-05-q25",
    stem: "What bitwise expression combines high byte `msb` and low byte `lsb` into a 16-bit big-endian integer?",
    options: [
      { id: "a", text: "(msb << 8) | lsb" },
      { id: "b", text: "(lsb << 8) | msb" },
      { id: "c", text: "msb + lsb" },
      { id: "d", text: "msb & lsb" }
    ],
    answer: ["a"],
    explanation: "Shifting the most significant byte left by 8 bits and bitwise ORing with the low byte yields a 16-bit big-endian value.",
    noteRef: "iot-05-lo07",
    reviewed: false
  },
  {
    loId: "iot-05-lo07",
    type: "numeric",
    difficulty: 2,
    id: "iot-05-q26",
    stem: "If a sensor returns MSB = 0x01 and LSB = 0x00 over I2C, what is the combined 16-bit integer value in decimal?",
    options: [
      { id: "a", text: "256" },
      { id: "b", text: "1" },
      { id: "c", text: "512" },
      { id: "d", text: "100" }
    ],
    answer: ["a"],
    explanation: "(0x01 << 8) | 0x00 = 0x0100 in hex = 256 in decimal.",
    noteRef: "iot-05-lo07",
    verify: "(((0x01 << 8) | 0x00) === 256)",
    reviewed: false
  },
  {
    loId: "iot-05-lo07",
    type: "scenario",
    difficulty: 2,
    id: "iot-05-q27",
    stem: "An accelerometer reads raw values around 65520 when tilted downwards instead of negative numbers like -16. What software mistake occurred?",
    options: [
      { id: "a", text: "The combined 16-bit integer was stored in an unsigned `uint16_t` instead of a signed two's-complement `int16_t`." },
      { id: "b", text: "The I2C bus was running backwards." },
      { id: "c", text: "The accelerometer was upside down." },
      { id: "d", text: "The pull-up resistor burned out." }
    ],
    answer: ["a"],
    explanation: "Two's complement signed 16-bit values (-16) interpret as 65520 if stored as unsigned `uint16_t`.",
    noteRef: "iot-05-lo07",
    reviewed: false
  },
  {
    loId: "iot-05-lo07",
    type: "single",
    difficulty: 3,
    id: "iot-05-q28",
    stem: "In Arduino's `Wire` library, why is `Wire.endTransmission(false)` used when writing a register address before reading data back?",
    options: [
      { id: "a", text: "Passing `false` generates a Repeated START condition, preventing other multi-master devices from interrupting or seizing the bus between write and read." },
      { id: "b", text: "It turns off the sensor power." },
      { id: "c", text: "It inverts the clock polarity." },
      { id: "d", text: "It causes the transmission to fail intentionally." }
    ],
    answer: ["a"],
    explanation: "`endTransmission(false)` sends a repeated start, holding the bus continuously between register select and reading.",
    noteRef: "iot-05-lo07",
    reviewed: false
  },

  // LO08
  {
    loId: "iot-05-lo08",
    type: "single",
    difficulty: 1,
    id: "iot-05-q29",
    stem: "What does an I2C bus scanner sketch do?",
    options: [
      { id: "a", text: "It iterates through all 127 7-bit addresses on the bus, checking for an ACK response to identify connected devices." },
      { id: "b", text: "It measures the physical length of the wires." },
      { id: "c", text: "It scans for local Wi-Fi networks." },
      { id: "d", text: "It updates the microcontroller's firmware." }
    ],
    answer: ["a"],
    explanation: "An I2C scanner sends address frames from 1 to 126, logging responsive ACK devices to the serial monitor.",
    noteRef: "iot-05-lo08",
    reviewed: false
  },
  {
    loId: "iot-05-lo08",
    type: "scenario",
    difficulty: 2,
    id: "iot-05-q30",
    stem: "During an I2C transaction, the microcontroller resets while an external sensor was sending a '0' bit. The sensor now holds SDA permanently LOW, freezing all future I2C transactions. How can the master recover the bus?",
    options: [
      { id: "a", text: "Reconfigure SCL as a GPIO output and toggle it 9 to 16 times manually to clock the slave out of its byte transfer, then assert a STOP condition." },
      { id: "b", text: "Increase the supply voltage to 24V to force the line HIGH." },
      { id: "c", text: "Cut the SDA wire with wire cutters." },
      { id: "d", text: "Wait 24 hours for the sensor to reset." }
    ],
    answer: ["a"],
    explanation: "Toggling SCL manually finishes the slave's pending byte transmission, causing it to release the open-drain SDA line.",
    noteRef: "iot-05-lo08",
    reviewed: false
  },
  {
    loId: "iot-05-lo08",
    type: "multi",
    difficulty: 2,
    id: "iot-05-q31",
    stem: "Which of the following physical layer problems can a USB logic analyzer identify when diagnosing serial buses?",
    options: [
      { id: "a", text: "Missing ACK/NACK responses on I2C" },
      { id: "b", text: "Mismatched baud rate framing errors on UART" },
      { id: "c", text: "Incorrect SPI clock mode (CPOL/CPHA) alignment" },
      { id: "d", text: "Wi-Fi router password authentication errors" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Logic analyzers decode hardware bit states, ACKs, and edge timings on wired physical buses.",
    noteRef: "iot-05-lo08",
    reviewed: false
  },
  {
    loId: "iot-05-lo08",
    type: "single",
    difficulty: 3,
    id: "iot-05-q32",
    stem: "Why can connecting two identical I2C sensor breakout boards with hardwired non-configurable addresses (e.g. both fixed at 0x68) cause bus collapse?",
    options: [
      { id: "a", text: "Both devices acknowledge simultaneously and drive SDA concurrently during reads, resulting in electrical bus contention and corrupted data." },
      { id: "b", text: "The power supply voltage cuts in half." },
      { id: "c", text: "It causes the microcontroller to overheat instantly." },
      { id: "d", text: "The I2C clock frequency doubles." }
    ],
    answer: ["a"],
    explanation: "Address collisions cause multiple slaves to drive SDA at once, garbling communication.",
    noteRef: "iot-05-lo08",
    reviewed: false
  },

  // LO09 (Extension)
  {
    loId: "iot-05-lo09",
    type: "single",
    difficulty: 2,
    id: "iot-05-q33",
    stem: "What physical transmission characteristic makes RS-485 highly resilient against industrial electrical noise?",
    options: [
      { id: "a", text: "Differential signaling over a twisted wire pair (measuring VA - VB), which causes common-mode noise to cancel out." },
      { id: "b", text: "Operating at 1000 Volts." },
      { id: "c", text: "Using fiber optic light." },
      { id: "d", text: "Transmitting data in Latin." }
    ],
    answer: ["a"],
    explanation: "Differential receivers subtract noise common to both twisted wires ($V_A - V_B$), rejecting heavy EMI.",
    noteRef: "iot-05-lo09",
    reviewed: false
  },
  {
    loId: "iot-05-lo09",
    type: "scenario",
    difficulty: 2,
    id: "iot-05-q34",
    stem: "An engineer builds a 500-meter RS-485 Modbus network connecting 10 solar inverters. Where must 120 Ohm termination resistors be placed?",
    options: [
      { id: "a", text: "Across lines A and B at the two extreme physical ends of the cable run." },
      { id: "b", text: "On every single inverter along the entire chain." },
      { id: "c", text: "Between each inverter and earth ground." },
      { id: "d", text: "Only on the microcontroller power supply." }
    ],
    answer: ["a"],
    explanation: "Termination resistors (120 Ohms) must be installed exclusively at the two physical ends of the bus to match cable impedance.",
    noteRef: "iot-05-lo09",
    reviewed: false
  },
  {
    loId: "iot-05-lo09",
    type: "multi",
    difficulty: 3,
    id: "iot-05-q35",
    stem: "Which of the following fields are standard components of a Modbus RTU serial frame?",
    options: [
      { id: "a", text: "1-byte Slave Device Address" },
      { id: "b", text: "1-byte Function Code (e.g. 0x03 Read Holding Registers)" },
      { id: "c", text: "16-bit CRC Error Checksum" },
      { id: "d", text: "HTTP Cookie Header" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Modbus RTU frames consist of Slave Address, Function Code, Data Payload, and CRC-16 Checksum.",
    noteRef: "iot-05-lo09",
    reviewed: false
  },
  {
    loId: "iot-05-lo09",
    type: "single",
    difficulty: 3,
    id: "iot-05-q36",
    stem: "Why must half-duplex RS-485 transceiver circuits toggle the Driver Enable (DE) pin to LOW immediately after sending a packet?",
    options: [
      { id: "a", text: "To release the differential line driver and switch the transceiver into listen mode so incoming slave response packets can be received." },
      { id: "b", text: "To save the microcontroller's RAM memory." },
      { id: "c", text: "To recharge the termination resistors." },
      { id: "d", text: "Because the transceiver shuts down after every transmission." }
    ],
    answer: ["a"],
    explanation: "Half-duplex transceivers share the line; holding DE HIGH blocks incoming responses by driving the bus.",
    noteRef: "iot-05-lo09",
    reviewed: false
  }
];

balanceAndSave('iot', 'wired-protocols-uart-i2c-spi', ch05Objectives, ch05Questions);
console.log("Batch 11 complete!");
