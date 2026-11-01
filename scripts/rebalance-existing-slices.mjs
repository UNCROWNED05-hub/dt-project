/**
 * scripts/rebalance-existing-slices.mjs
 *
 * Rebalances existing 3 vertical slice chapters:
 * 1. Sets 4 mustHave: true (instead of 8) in objectives.json
 * 2. Fixes chapterId to sec-01 in cybersecurity
 * 3. Authors extension notes & questions for lo09
 * 4. Shuffles single-choice options so a, b, c, d are evenly distributed (~25% each, none > 35%)
 * 5. Adds numeric questions with runnable verify blocks
 */

import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();

// 1. AI & ML (what-ai-ml-really-are)
console.log('Rebalancing AI & ML...');
const aimlObjPath = path.join(ROOT_DIR, 'content', 'ai-ml', 'what-ai-ml-really-are', 'objectives.json');
const aimlObj = JSON.parse(fs.readFileSync(aimlObjPath, 'utf-8'));
// Set exactly 4 mustHave
aimlObj.objectives.forEach((lo) => {
  if (['aiml-01-lo01', 'aiml-01-lo02', 'aiml-01-lo04', 'aiml-01-lo05'].includes(lo.id)) {
    lo.mustHave = true;
  } else {
    lo.mustHave = false;
  }
});
fs.writeFileSync(aimlObjPath, JSON.stringify(aimlObj, null, 2), 'utf-8');

// Note for aiml-01-lo09
const aimlLo9Note = `---
loId: "aiml-01-lo09"
title: "Stochastic & Mini-Batch Gradient Descent"
reviewed: false
sources:
  - title: "Dive into Deep Learning (D2L.ai)"
    url: "https://d2l.ai/"
---

### Core Idea
Full-batch gradient descent computes gradients across the entire dataset before making a single parameter update. When datasets scale to gigabytes, this becomes computationally prohibitive. Stochastic Gradient Descent (SGD) updates parameters using a single randomly chosen training sample at each step, introducing high variance that can escape shallow local minima. Mini-batch Gradient Descent strikes an optimal balance by computing vector gradients over small slices (typically 32 to 512 examples), leveraging modern GPU tensor parallelization while maintaining steady convergence.

### Worked Example
Consider training on a dataset of 1,024 samples with batch size 64:
\`\`\`python
# Dataset size N = 1024, Batch size B = 64
# Steps per epoch = 1024 / 64 = 16 updates per epoch
import numpy as np

def train_epoch(X, y, weights, batch_size=64, lr=0.01):
    indices = np.random.permutation(len(X))
    for start_idx in range(0, len(X), batch_size):
        batch_idx = indices[start_idx:start_idx + batch_size]
        X_batch, y_batch = X[batch_idx], y[batch_idx]
        grad = (2.0 / len(X_batch)) * X_batch.T @ (X_batch @ weights - y_batch)
        weights -= lr * grad
    return weights
\`\`\`

### Common Mistake
Confusing iterations with epochs. An iteration is a single weight update over one mini-batch, whereas an epoch is one complete traversal across the entire training dataset.

### Check Yourself
If a dataset contains 6,400 examples and you train with a mini-batch size of 32, how many parameter updates occur per epoch? (6,400 / 32 = 200 updates per epoch).
`;
fs.writeFileSync(path.join(ROOT_DIR, 'content', 'ai-ml', 'what-ai-ml-really-are', 'notes', 'aiml-01-lo09.mdx'), aimlLo9Note, 'utf-8');

// 2. Cybersecurity (security-foundations-and-attack-lifecycle)
console.log('Rebalancing Cybersecurity...');
const secObjPath = path.join(ROOT_DIR, 'content', 'cybersecurity', 'security-foundations-and-attack-lifecycle', 'objectives.json');
const secObj = JSON.parse(fs.readFileSync(secObjPath, 'utf-8'));
secObj.chapterId = 'sec-01';
secObj.objectives.forEach((lo) => {
  if (['cyber-01-lo01', 'cyber-01-lo02', 'cyber-01-lo04', 'cyber-01-lo06'].includes(lo.id)) {
    lo.mustHave = true;
  } else {
    lo.mustHave = false;
  }
});
fs.writeFileSync(secObjPath, JSON.stringify(secObj, null, 2), 'utf-8');

// Note for cyber-01-lo09
const secLo9Note = `---
loId: "cyber-01-lo09"
title: "Forensic Evidence Triage & Chain of Custody"
reviewed: false
sources:
  - title: "NIST SP 800-61 Rev. 2: Computer Security Incident Handling Guide"
    url: "https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final"
---

### Core Idea
When security incidents escalate, defenders must preserve digital evidence so that findings withstand internal audits and legal proceedings. Chain of custody is the chronological documentation recording every individual who collected, accessed, analyzed, and transferred a piece of physical or digital evidence. Volatile evidence—such as running processes, network connections, and unencrypted memory—must be captured first using order of volatility principles before powered systems are isolated or powered off.

### Worked Example
Capturing cryptographic hashes to verify forensic integrity:
\`\`\`bash
# Calculate SHA-256 hash immediately upon disk image capture
sha256sum /mnt/evidence/compromised_host.raw > /secure/custody/host_initial.sha256

# Before starting forensic examination on a copy, verify bit-for-bit authenticity
sha256sum -c /secure/custody/host_initial.sha256
# Returns: /mnt/evidence/compromised_host.raw: OK
\`\`\`

### Common Mistake
Rebooting a compromised system to "cleanse" it before collecting RAM. Rebooting permanently destroys volatile memory containing active malware payloads, decrypted API keys, and established command-and-control sockets.

### Check Yourself
Why should digital forensics investigators never execute analysis software directly on the original evidentiary drive? (Direct execution alters file access timestamps, registry keys, and temporary memory blocks, corrupting evidence authenticity).
`;
fs.writeFileSync(path.join(ROOT_DIR, 'content', 'cybersecurity', 'security-foundations-and-attack-lifecycle', 'notes', 'cyber-01-lo09.mdx'), secLo9Note, 'utf-8');

// 3. IoT (iot-architecture-and-physical-computing)
console.log('Rebalancing IoT...');
const iotObjPath = path.join(ROOT_DIR, 'content', 'iot', 'iot-architecture-and-physical-computing', 'objectives.json');
const iotObj = JSON.parse(fs.readFileSync(iotObjPath, 'utf-8'));
iotObj.objectives.forEach((lo) => {
  if (['iot-01-lo01', 'iot-01-lo02', 'iot-01-lo04', 'iot-01-lo05'].includes(lo.id)) {
    lo.mustHave = true;
  } else {
    lo.mustHave = false;
  }
});
fs.writeFileSync(iotObjPath, JSON.stringify(iotObj, null, 2), 'utf-8');

// Note for iot-01-lo09
const iotLo9Note = `---
loId: "iot-01-lo09"
title: "Microcontroller Sleep Modes & Power Budgets"
reviewed: false
sources:
  - title: "Arduino Reference & ESP32 Technical Documentation"
    url: "https://www.arduino.cc/reference/en/"
---

### Core Idea
Battery-operated IoT edge devices cannot continuously run at full 160MHz or 240MHz CPU frequencies without depleting standard lithium batteries within days. Embedded microcontrollers support tiered low-power modes: Active mode (CPU, radio, peripherals active: ~80-150mA), Light Sleep (CPU clock gated, RAM retained: ~0.8-2mA), and Deep Sleep (CPU and radios off, only Ultra-Low-Power coprocessor and RTC timer running: ~5-15µA). Devices sleep for predetermined intervals, wake to take a sensor reading, transmit data, and return to deep sleep immediately.

### Worked Example
Calculating average current and battery longevity:
\`\`\`python
# Active: 120mA for 2 seconds (sensor read + Wi-Fi publish)
# Deep sleep: 0.015mA (15µA) for 58 seconds
t_active = 2.0; i_active = 120.0
t_sleep = 58.0; i_sleep = 0.015
t_cycle = t_active + t_sleep

i_avg = (i_active * t_active + i_sleep * t_sleep) / t_cycle
# i_avg ≈ 4.014 mA

battery_capacity_mah = 2000.0 # Standard 18650 cell
operating_hours = battery_capacity_mah / i_avg # ≈ 498 hours (~20.7 days)
\`\`\`

### Common Mistake
Leaving unused GPIO pins floating during deep sleep. Floating pins can float at intermediate voltages, causing excessive CMOS leakage currents that quickly drain the battery.

### Check Yourself
Which subsystem remains powered during ESP32 Deep Sleep to trigger scheduled timer wakeups? (The Real-Time Clock / RTC domain and ULP coprocessor).
`;
fs.writeFileSync(path.join(ROOT_DIR, 'content', 'iot', 'iot-architecture-and-physical-computing', 'notes', 'iot-01-lo09.mdx'), iotLo9Note, 'utf-8');

// Function to rebalance quiz bank
function rebalanceBank(bankPath, extQuestions, numericQuestions) {
  let bank = JSON.parse(fs.readFileSync(bankPath, 'utf-8'));
  
  // Add extension questions
  bank.push(...extQuestions);
  // Add numeric questions
  bank.push(...numericQuestions);

  // Rebalance single and scenario questions so that answers rotate evenly: a, b, c, d
  const targetKeys = ['a', 'b', 'c', 'd'];
  let keyIdx = 0;

  for (const q of bank) {
    if ((q.type === 'single' || q.type === 'scenario') && q.options && q.options.length === 4) {
      const desiredAnswerKey = targetKeys[keyIdx % 4];
      keyIdx++;

      const currentAnswerKey = q.answer[0];
      if (currentAnswerKey !== desiredAnswerKey) {
        // Swap text of currentAnswerKey option and desiredAnswerKey option
        const currentOpt = q.options.find((o) => o.id === currentAnswerKey);
        const desiredOpt = q.options.find((o) => o.id === desiredAnswerKey);
        if (currentOpt && desiredOpt) {
          const tempText = currentOpt.text;
          currentOpt.text = desiredOpt.text;
          desiredOpt.text = tempText;
          q.answer = [desiredAnswerKey];
        }
      }
    }
  }

  fs.writeFileSync(bankPath, JSON.stringify(bank, null, 2), 'utf-8');
}

// AI Questions for LO9 and Numeric
const aimlExtQuestions = [
  {
    id: "aiml-01-q33",
    loId: "aiml-01-lo09",
    type: "single",
    difficulty: 2,
    stem: "Why does mini-batch gradient descent achieve superior training throughput on modern GPUs compared to single-sample stochastic gradient descent?",
    options: [
      { id: "a", text: "Because mini-batch execution utilizes parallel SIMD tensor hardware to process multiple observations simultaneously." },
      { id: "b", text: "Because mini-batches eliminate the need to compute partial derivatives." },
      { id: "c", text: "Because mini-batching converts non-convex loss surfaces into convex planes." },
      { id: "d", text: "Because GPUs cannot execute single-sample arithmetic." }
    ],
    answer: ["a"],
    explanation: "Modern GPUs feature wide vector ALUs and tensor cores that parallelize matrix multiplications across mini-batch matrices.",
    noteRef: "aiml-01-lo09",
    reviewed: false
  },
  {
    id: "aiml-01-q34",
    loId: "aiml-01-lo09",
    type: "single",
    difficulty: 3,
    stem: "In machine learning optimization, what distinguishes an 'epoch' from an 'iteration'?",
    options: [
      { id: "a", text: "An epoch refers to saving weights to disk, while an iteration refers to model deployment." },
      { id: "b", text: "An iteration is a single parameter update step over one mini-batch, whereas an epoch is one full pass through the entire training dataset." },
      { id: "c", text: "An epoch only occurs during test evaluation, whereas iterations occur during training." },
      { id: "d", text: "An iteration processes all data, while an epoch processes one sample." }
    ],
    answer: ["b"],
    explanation: "An epoch completes when all training examples have been seen once. If a dataset has 1,000 samples and batch size is 100, an epoch takes 10 iterations.",
    noteRef: "aiml-01-lo09",
    reviewed: false
  }
];

const aimlNumericQuestions = [
  {
    id: "aiml-01-q35",
    loId: "aiml-01-lo04",
    type: "numeric",
    difficulty: 2,
    stem: "A linear model predicts outputs [3.0, 5.0, 8.0] for three targets [2.0, 5.0, 10.0]. What is the Mean Squared Error (MSE)?",
    options: [
      { id: "a", text: "1.00" },
      { id: "b", text: "1.67" },
      { id: "c", text: "2.33" },
      { id: "d", text: "5.00" }
    ],
    answer: ["b"],
    explanation: "Residuals are (3-2)=1, (5-5)=0, (8-10)=-2. Squared residuals are 1, 0, 4. MSE = (1 + 0 + 4) / 3 = 5/3 ≈ 1.67.",
    noteRef: "aiml-01-lo04",
    verify: "Math.abs(((Math.pow(3 - 2, 2) + Math.pow(5 - 5, 2) + Math.pow(8 - 10, 2)) / 3) - 1.6666666666666667) < 0.01",
    reviewed: false
  }
];

rebalanceBank(path.join(ROOT_DIR, 'content', 'ai-ml', 'what-ai-ml-really-are', 'quiz', 'bank.json'), aimlExtQuestions, aimlNumericQuestions);

// Cyber Questions for LO9 and Numeric
const cyberExtQuestions = [
  {
    id: "cyber-01-q33",
    loId: "cyber-01-lo09",
    type: "single",
    difficulty: 2,
    stem: "Why must digital forensics examiners preserve volatile memory (RAM) before shutting down an actively compromised workstation?",
    options: [
      { id: "a", text: "Because volatile RAM contains running process state, injected in-memory DLLs, and active network connections that disappear upon power loss." },
      { id: "b", text: "Because solid-state drives physically erase themselves when power is cut." },
      { id: "c", text: "Because operating system kernels cannot boot without RAM logs." },
      { id: "d", text: "Because BIOS firmware requires RAM hashes to authenticate users." }
    ],
    answer: ["a"],
    explanation: "Volatile memory holds active artifacts—such as unencrypted payload code and C2 sockets—that are erased when power is severed.",
    noteRef: "cyber-01-lo09",
    reviewed: false
  },
  {
    id: "cyber-01-q34",
    loId: "cyber-01-lo09",
    type: "single",
    difficulty: 3,
    stem: "What is the primary objective of establishing a documented chain of custody during a cyber incident investigation?",
    options: [
      { id: "a", text: "To encrypt all captured network packets with asymmetric keys." },
      { id: "b", text: "To prove the unbroken, verified handling of evidence so its authenticity and integrity are legally indisputable." },
      { id: "c", text: "To notify threat actors that their intrusion has been identified." },
      { id: "d", text: "To benchmark forensic hard drive transfer speeds." }
    ],
    answer: ["b"],
    explanation: "Chain of custody tracks every transfer and custody holder with timestamps and hashes, proving evidence was never tampered with.",
    noteRef: "cyber-01-lo09",
    reviewed: false
  }
];

const cyberNumericQuestions = [
  {
    id: "cyber-01-q35",
    loId: "cyber-01-lo05",
    type: "numeric",
    difficulty: 2,
    stem: "An organization models Single Loss Expectancy (SLE) as $40,000 for a server failure, with an Annualized Rate of Occurrence (ARO) of 0.25 (once every 4 years). What is the Annualized Loss Expectancy (ALE)?",
    options: [
      { id: "a", text: "$5,000" },
      { id: "b", text: "$10,000" },
      { id: "c", text: "$20,000" },
      { id: "d", text: "$160,000" }
    ],
    answer: ["b"],
    explanation: "Annualized Loss Expectancy (ALE) = SLE * ARO = $40,000 * 0.25 = $10,000.",
    noteRef: "cyber-01-lo05",
    verify: "(40000 * 0.25) === 10000",
    reviewed: false
  }
];

rebalanceBank(path.join(ROOT_DIR, 'content', 'cybersecurity', 'security-foundations-and-attack-lifecycle', 'quiz', 'bank.json'), cyberExtQuestions, cyberNumericQuestions);

// IoT Questions for LO9 and Numeric
const iotExtQuestions = [
  {
    id: "iot-01-q33",
    loId: "iot-01-lo09",
    type: "single",
    difficulty: 2,
    stem: "Which ESP32 subsystem remains powered during Deep Sleep mode to awaken the device after a programmed delay?",
    options: [
      { id: "a", text: "The primary dual-core Xtensa CPU." },
      { id: "b", text: "The RTC controller, timer, and Ultra-Low-Power (ULP) coprocessor." },
      { id: "c", text: "The 2.4 GHz Wi-Fi baseband radio." },
      { id: "d", text: "The high-speed SPI flash interface." }
    ],
    answer: ["b"],
    explanation: "Deep sleep powers down the main CPU and Wi-Fi radio, maintaining only the RTC domain (~10-15µA) to monitor timers or external wake pins.",
    noteRef: "iot-01-lo09",
    reviewed: false
  },
  {
    id: "iot-01-q34",
    loId: "iot-01-lo09",
    type: "single",
    difficulty: 3,
    stem: "An environmental monitor requires 100mA when transmitting and 20µA in deep sleep. Why would leaving an unused GPIO pin floating during sleep degrade battery longevity?",
    options: [
      { id: "a", text: "Floating input pins hover near threshold voltages, inducing parasitic shoot-through currents in the input buffer." },
      { id: "b", text: "Floating pins cause flash memory wear-leveling corruption." },
      { id: "c", text: "Floating pins automatically trigger Wi-Fi re-association handshakes." },
      { id: "d", text: "Floating pins increase antenna impedance." }
    ],
    answer: ["a"],
    explanation: "Floating digital CMOS inputs float between VDD and GND, causing both NMOS and PMOS transistors in the input buffer to partially conduct.",
    noteRef: "iot-01-lo09",
    reviewed: false
  }
];

const iotNumericQuestions = [
  {
    id: "iot-01-q35",
    loId: "iot-01-lo02",
    type: "numeric",
    difficulty: 2,
    stem: "A 3.3V microcontroller ADC reads a sensor output across an equal 10kΩ-to-10kΩ voltage divider connected to a 5.0V input signal. What voltage is presented at the ADC pin?",
    options: [
      { id: "a", text: "1.25V" },
      { id: "b", text: "2.50V" },
      { id: "c", text: "3.30V" },
      { id: "d", text: "5.00V" }
    ],
    answer: ["b"],
    explanation: "V_out = V_in * (R2 / (R1 + R2)) = 5.0V * (10000 / 20000) = 2.50V, which is safely within the 3.3V ADC range.",
    noteRef: "iot-01-lo02",
    verify: "(5.0 * (10000 / (10000 + 10000))) === 2.5",
    reviewed: false
  }
];

rebalanceBank(path.join(ROOT_DIR, 'content', 'iot', 'iot-architecture-and-physical-computing', 'quiz', 'bank.json'), iotExtQuestions, iotNumericQuestions);

console.log('✅ Rebalancing completed successfully!');
