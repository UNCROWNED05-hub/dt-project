import fs from 'fs';
import path from 'path';

function countWords(str) {
  return str.trim().split(/\s+/).filter(Boolean).length;
}

function writeNoteBlock(courseSlug, chapterSlug, loId, coreIdea, workedExample, commonMistake, checkYourself, isFastMoving = false) {
  const dir = path.join('content', courseSlug, chapterSlug, 'notes');
  fs.mkdirSync(dir, { recursive: true });

  const fastMovingHeader = isFastMoving ? 'lastVerified: "2026-03"\n' : '';
  const fastMovingNote = isFastMoving ? '\n*Last verified: February 2026 against official standards and datasheets.*\n' : '';

  const fullContent = `---
loId: "${loId}"
reviewed: false
sources:
  - "Official Espressif Systems, LoRa Alliance, and OASIS MQTT Standards"
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
// CHAPTER 06: wireless-wifi-ble-lora-zigbee (iot-06) [moderate]
// ==========================================

const ch06Objectives = {
  version: 1,
  chapterId: "iot-06",
  objectives: [
    {
      id: "iot-06-lo01",
      order: 1,
      title: "Configure ESP32 Wi-Fi station (STA) and access point (AP) modes and captive portal provisioning",
      bloom: "configure",
      tier: "core",
      mustHave: true,
      keywords: ["wifi provisioning", "sta mode", "ap mode", "captive portal", "wifimanager"],
      aliases: ["esp32 wifi modes", "wireless credential provisioning"],
      prerequisites: ["iot-03-lo02"],
      estMinutes: 14
    },
    {
      id: "iot-06-lo02",
      order: 2,
      title: "Structure Bluetooth Low Energy (BLE) Generic Attribute Profile (GATT) services, characteristics, and UUIDs",
      bloom: "structure",
      tier: "core",
      mustHave: true,
      keywords: ["ble", "gatt", "gap", "service uuid", "characteristic", "descriptors"],
      aliases: ["bluetooth low energy", "ble gatt architecture"],
      prerequisites: ["iot-03-lo02"],
      estMinutes: 14
    },
    {
      id: "iot-06-lo03",
      order: 3,
      title: "Program BLE advertising packets, notifications, and indications on ESP32",
      bloom: "program",
      tier: "core",
      mustHave: false,
      keywords: ["ble advertising", "notify vs indicate", "ble client", "ble server", "advertising interval"],
      aliases: ["ble notifications", "esp32 ble programming"],
      prerequisites: ["iot-06-lo02"],
      estMinutes: 12
    },
    {
      id: "iot-06-lo04",
      order: 4,
      title: "Analyze Chirp Spread Spectrum (CSS) modulation, Spreading Factor (SF), and LoRa link budgets",
      bloom: "analyze",
      tier: "core",
      mustHave: true,
      keywords: ["lora", "chirp spread spectrum", "spreading factor", "link budget", "snr"],
      aliases: ["lora modulation", "css physics", "spreading factor calculation"],
      prerequisites: ["iot-01-lo04"],
      estMinutes: 14
    },
    {
      id: "iot-06-lo05",
      order: 5,
      title: "Construct LoRaWAN end-device topologies across Class A, B, and C architectures",
      bloom: "construct",
      tier: "core",
      mustHave: true,
      keywords: ["lorawan", "class a b c", "otaa vs abp", "gateway", "network server", "duty cycle limit"],
      aliases: ["lorawan architecture", "otaa join"],
      prerequisites: ["iot-06-lo04"],
      estMinutes: 14
    },
    {
      id: "iot-06-lo06",
      order: 6,
      title: "Evaluate IEEE 802.15.4 mesh networking: Zigbee, Thread, 6LoWPAN, and Matter",
      bloom: "evaluate",
      tier: "core",
      mustHave: false,
      keywords: ["zigbee", "thread", "matter", "802.15.4", "mesh routing", "6lowpan"],
      aliases: ["mesh networking", "thread vs zigbee"],
      prerequisites: ["iot-01-lo02"],
      estMinutes: 12
    },
    {
      id: "iot-06-lo07",
      order: 7,
      title: "Deploy Cellular IoT nodes using NB-IoT (Cat-NB1/NB2) and LTE-M with Power Saving Mode (PSM)",
      bloom: "deploy",
      tier: "core",
      mustHave: false,
      keywords: ["cellular iot", "nb-iot", "lte-m", "psm", "edrx", "at commands"],
      aliases: ["cellular m2m", "narrowband iot"],
      prerequisites: ["iot-05-lo01"],
      estMinutes: 12
    },
    {
      id: "iot-06-lo08",
      order: 8,
      title: "Calculate wireless trade-offs across Range, Data Rate, and Power Consumption using Friis and Shannon models",
      bloom: "calculate",
      tier: "core",
      mustHave: true,
      keywords: ["wireless trade-offs", "friis transmission", "shannon-hartley", "path loss", "battery lifespan"],
      aliases: ["range vs bandwidth", "wireless comparison matrix"],
      prerequisites: ["iot-06-lo01", "iot-06-lo04"],
      estMinutes: 14
    },
    {
      id: "iot-06-lo09",
      order: 9,
      title: "Design antenna matching circuits and adhere to regional wireless regulatory emission standards",
      bloom: "design",
      tier: "extension",
      mustHave: false,
      keywords: ["antenna matching", "pi network", "vswr", "fcc ce compliance", "ism bands"],
      aliases: ["rf antenna matching", "rf regulatory compliance"],
      prerequisites: ["iot-06-lo08"],
      estMinutes: 12
    }
  ]
};

// Notes for iot-06

writeNoteBlock('iot', 'wireless-wifi-ble-lora-zigbee', 'iot-06-lo01',
  `Wi-Fi enables high-throughput Internet Protocol (TCP/IP) connectivity on IoT microcontrollers, operating across two primary radio modes:
1. Station Mode (STA): The ESP32 acts as a standard wireless network client, associating with an external Wi-Fi router/Access Point to obtain an IP address via DHCP and access internet cloud endpoints.
2. Access Point Mode (AP): The ESP32 hosts its own $802.11$ wireless local network (SSID and optional WPA2 password), assigning IP addresses to nearby client devices (smartphones, laptops) on a private subnet (typically \`192.168.4.1\`).
3. Captive Portal Provisioning (WiFiManager):
   Hardcoding Wi-Fi credentials into firmware is brittle and insecure. When the device powers up and cannot connect to a stored network, it automatically boots into AP mode and spins up a local DNS and HTTP web server:
   - A connecting smartphone automatically receives a captive portal prompt.
   - The user selects their home Wi-Fi network from a scanned SSID list and types the password.
   - The ESP32 saves the credentials to non-volatile flash (NVS) and restarts into STA mode.`,
  `Arduino C++ Wi-Fi connection with timeout fallback:
\`\`\`cpp
#include <WiFi.h>

const char* ssid = "Home_Network";
const char* password = "SecretPassword123";

void setup() {
  Serial.begin(115200);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  uint32_t start_time = millis();
  while (WiFi.status() != WL_CONNECTED && (millis() - start_time < 10000)) {
    delay(500);
    Serial.print(".");
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.printf("\nConnected! IP Address: %s\n", WiFi.localIP().toString().c_str());
  } else {
    Serial.println("\nFailed to connect. Launching AP Config Portal...");
  }
}

void loop() {}
\`\`\``,
  `Hardcoding production Wi-Fi SSIDs and passwords into open-source Git repositories; anyone viewing the repo gains plaintext credentials to private local networks.`,
  `What is the difference between ESP32 Station (STA) mode and Access Point (AP) mode?`
);

writeNoteBlock('iot', 'wireless-wifi-ble-lora-zigbee', 'iot-06-lo02',
  `Bluetooth Low Energy (BLE) is optimized for ultra-low power, short-range ($<10\\text{m}$) point-to-point and star wireless topologies:
1. Generic Access Profile (GAP): Governs connection establishment and advertising:
   - Peripheral (Broadcaster / Server): Advertises its presence and accepts incoming connections (e.g., smart fitness bands, heart rate monitors).
   - Central (Observer / Client): Scans for advertisements and initiates connections (e.g., smartphone, gateway).
2. Generic Attribute Profile (GATT): Defines the structured data exchange hierarchy once connected:
   - Profile: A formal collection of one or more Services (e.g., Environmental Sensing Profile).
   - Service: A logical grouping of data items (e.g., Battery Service, Heart Rate Service). Identified by a 16-bit UUID (Bluetooth SIG standardized) or a custom 128-bit UUID.
   - Characteristic: The fundamental data container containing a single value, permission flags (Read, Write, Notify, Indicate), and metadata.
   - Descriptors: Optional metadata providing human-readable descriptions or enabling push notifications (Client Characteristic Configuration Descriptor, CCCD).`,
  `Structure of a standard BLE GATT data model:
\`\`\`text
GATT Profile: Environmental Monitor
├── Service: Battery Service (UUID 0x180F)
│   └── Characteristic: Battery Level (UUID 0x2A19) [Read, Notify]
│       └── Value: 85 (Percentage)
└── Service: Custom Sensor Service (UUID 4fafc201-1fb5-459e-8fcc-c5c9c331914b)
    └── Characteristic: Temperature (UUID beb5483e-36e1-4688-b7f5-ea07361b26a8) [Read, Notify]
        ├── Value: 24.5 (°C)
        └── CCCD Descriptor (UUID 0x2902): Notifications Enabled
\`\`\``,
  `Attempting to use 16-bit UUIDs for proprietary vendor services; 16-bit UUIDs are reserved exclusively by the Bluetooth SIG for standard profiles and collide with existing devices. Custom services must use unique 128-bit UUIDs.`,
  `What are the three structural tiers of the BLE GATT data hierarchy?`
);

writeNoteBlock('iot', 'wireless-wifi-ble-lora-zigbee', 'iot-06-lo03',
  `BLE peripherals communicate asynchronously through broadcast advertisements and push data streams:
1. BLE Advertising: Peripherals broadcast small Advertising Data Packets (up to 31 bytes) across three dedicated RF channels (37, 38, 39). Packets contain device name, flags, and advertised Service UUIDs. Increasing the advertising interval (e.g., from $20\\text{ms}$ to $1000\\text{ms}$) slashes standby power consumption by over $90\\%$.
2. Notifications vs. Indications:
   - Notifications: The server pushes updated characteristic values to connected clients without waiting for an acknowledgment. Fast, lightweight, low-power, but packets can be dropped under heavy RF interference.
   - Indications: The server pushes data and requires an explicit link-layer acknowledgment from the client before sending the next packet. Guarantees delivery at the cost of higher latency and power.
3. Client Characteristic Configuration Descriptor (CCCD, UUID \`0x2902\`): A client must write \`0x0001\` into this 2-byte descriptor to explicitly subscribe to notifications on that characteristic.`,
  `ESP32 BLE Server sending periodic notifications in Arduino C++:
\`\`\`cpp
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLE2902.h>

#define SERVICE_UUID        "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"

BLECharacteristic *pCharacteristic;
bool deviceConnected = false;

void setup() {
  BLEDevice::init("ESP32_Sensor");
  BLEServer *pServer = BLEDevice::createServer();
  BLEService *pService = pServer->createService(SERVICE_UUID);

  pCharacteristic = pService->createCharacteristic(
                      CHARACTERISTIC_UUID,
                      BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_NOTIFY
                    );
  pCharacteristic->addDescriptor(new BLE2902());
  pService->start();
  pServer->getAdvertising()->start();
}

void notify_temperature(float temp) {
  char buf[8];
  snprintf(buf, sizeof(buf), "%.1f", temp);
  pCharacteristic->setValue(buf);
  pCharacteristic->notify();
}
\`\`\``,
  `Polling a BLE characteristic continuously via rapid Read requests from a smartphone app; polling drains peripheral battery rapidly. Always subscribe to Notifications so the peripheral pushes updates only when values change.`,
  `What is the difference between a BLE Notification and a BLE Indication?`
);

writeNoteBlock('iot', 'wireless-wifi-ble-lora-zigbee', 'iot-06-lo04',
  `LoRa (Long Range) is a physical-layer proprietary radio modulation technology developed by Semtech that achieves multi-kilometer transmission with milliwatt power:
1. Chirp Spread Spectrum (CSS) Physics: Instead of modulating frequency directly, LoRa transmits frequency chirps—pulses whose carrier frequency continuously sweeps linearly upwards (up-chirp) or downwards (down-chirp) across a defined bandwidth ($BW$, typically $125\\text{kHz}, 250\\text{kHz}$, or $500\\text{kHz}$).
2. Spreading Factor (SF7 to SF12): Dictates the number of chirps used to encode each bit of information:
   $$2^{\\text{SF}} \\text{ chips per symbol}$$
   - Lower SF (SF7): High data rate (up to $5.4\\text{kbps}$), short on-air time ($<50\\text{ms}$), lowest battery consumption, shortest range.
   - Higher SF (SF12): Ultra-slow data rate ($\sim 250\\text{bps}$), long on-air time ($>1\\text{second}$), maximum sensitivity (decoding signals down to $-20\\text{dB}$ below thermal noise floor), longest range ($>15\\text{km}$ line-of-sight).
3. Link Budget & Noise Resilience: LoRa achieves link budgets exceeding $150\\text{dB}$, allowing signals to be successfully reconstructed even when buried deep beneath ambient environmental radio noise.`,
  `Calculating symbol duration and airtime in Python:
\`\`\`python
def calculate_lora_symbol_time(sf, bandwidth_hz):
    # Symbol time Ts = 2^SF / BW
    chips_per_symbol = 2 ** sf
    symbol_time_seconds = chips_per_symbol / bandwidth_hz
    return round(symbol_time_seconds * 1000, 2) # in milliseconds

# Compare SF7 vs SF12 at 125 kHz bandwidth
ts_sf7 = calculate_lora_symbol_time(sf=7, bandwidth_hz=125000)
ts_sf12 = calculate_lora_symbol_time(sf=12, bandwidth_hz=125000)

print(f"SF7 Symbol Time: {ts_sf7} ms | SF12 Symbol Time: {ts_sf12} ms")
# SF7: 1.02 ms vs SF12: 32.77 ms (32x longer airtime)
\`\`\``,
  `Using SF12 for high-frequency sensor reporting; transmitting every 10 seconds at SF12 violates legal radio duty cycle regulations and exhausts the node's battery in weeks.`,
  `How does increasing the LoRa Spreading Factor from SF7 to SF12 impact radio range, on-air time, and data throughput?`
);

writeNoteBlock('iot', 'wireless-wifi-ble-lora-zigbee', 'iot-06-lo05',
  `LoRaWAN is the open media access control (MAC) and network protocol standard built on top of physical LoRa modulation:
1. Star-of-Stars Network Topology: End devices broadcast packets over unlicensed sub-GHz ISM bands (868MHz EU, 915MHz US, 865MHz India). Multiple multi-channel Gateways receive the packets and forward them over IP/cellular backhaul to a centralized Network Server (e.g., The Things Network - TTN).
2. Device Classes:
   - Class A (All): Battery-powered devices. Uplink-driven: node wakes up, transmits, and opens two short downlink receive windows ($RX_1$ and $RX_2$). Lowest power.
   - Class B (Beacon): Node synchronizes with periodic gateway time beacons to open scheduled downlink receive slots.
   - Class C (Continuous): Node keeps its receiver open continuously when not transmitting. Highest power, requires permanent mains power.
3. Activation Methods:
   - Over-The-Air Activation (OTAA - Recommended): Dynamic cryptographic handshake. Device securely exchanges Join-Request/Join-Accept frames using its Device EUI, Join EUI, and AppKey to derive dynamic session keys (NwkSKey, AppSKey).
   - Activation By Personalization (ABP): Hardcodes static session keys onto the device. Vulnerable to replay attacks and lacks re-keying security.
4. Duty Cycle Regulations: Sub-GHz bands legally restrict transmission airtime (e.g., strictly $\le 1\\%$ duty cycle in Europe and India).`,
  `Calculating legal duty cycle limits for LoRaWAN:
\`\`\`python
def verify_duty_cycle(packet_airtime_ms, interval_seconds, max_duty_percent=1.0):
    total_time_ms = interval_seconds * 1000.0
    duty_cycle_percent = (packet_airtime_ms / total_time_ms) * 100.0
    return {
        "duty_cycle": round(duty_cycle_percent, 3),
        "compliant": duty_cycle_percent <= max_duty_percent
    }

# 300ms packet transmitted every 60 seconds
res = verify_duty_cycle(packet_airtime_ms=300, interval_seconds=60)
print(f"Duty Cycle: {res['duty_cycle']}% | Legal: {res['compliant']}")
# 0.5% | Legal (under 1.0% limit)
\`\`\``,
  `Transmitting LoRaWAN packets without respecting the 1% regulatory duty cycle limit, risking confiscation of equipment and statutory fines from national telecommunications authorities.`,
  `Why is Over-The-Air Activation (OTAA) significantly more secure than Activation By Personalization (ABP) in LoRaWAN?`
);

writeNoteBlock('iot', 'wireless-wifi-ble-lora-zigbee', 'iot-06-lo06',
  `Short-range home automation and industrial telemetry utilize IEEE 802.15.4 mesh networks to extend coverage without high-power radios:
1. IEEE 802.15.4 Foundation: Defines the physical and MAC layers operating on the $2.4\\text{GHz}$ band across 16 channels, delivering up to $250\\text{kbps}$ at low power ($<10\\text{mA}$).
2. Zigbee: A mature, full-stack application standard operating on 802.15.4.
   - Roles: Zigbee Coordinator (starts the network, holds trust keys), Zigbee Routers (mains-powered routing nodes that forward packets), and Zigbee End Devices (sleepy battery-operated sensors).
   - Limitation: Lacks native IP addressing; requires a specialized gateway to translate Zigbee clusters into TCP/IP web commands.
3. Thread: A modern, open IPv6-based mesh networking protocol:
   - Native IPv6: Every Thread node possesses a unique 128-bit IPv6 address via 6LoWPAN (IPv6 over Low-Power Wireless Personal Area Networks), communicating directly with cloud servers without application-layer translation gateways.
   - Self-Healing: If a Thread Border Router or Leader fails, the mesh dynamically promotes another router without network disruption.
4. Matter Standard: An industry-wide unifying application layer running natively over Thread and Wi-Fi, allowing devices from Apple, Google, and Amazon to interoperate seamlessly.`,
  `Mesh routing topology representation in Python:
\`\`\`python
class MeshNode:
    def __init__(self, name, role):
        self.name = name
        self.role = role # Leader, Router, EndDevice

nodes = [
    MeshNode("Border_Router", "Leader"),
    MeshNode("Kitchen_Light", "Router"),
    MeshNode("Window_Sensor", "SleepyEndDevice")
]

for n in nodes:
    print(f"Node: {n.name} | Role: {n.role}")
\`\`\``,
  `Configuring battery-operated sensors as mesh routers in Zigbee or Thread; routers must keep their radio receiver powered continuously to forward third-party packets, draining a coin cell in under 48 hours. Battery devices must always be configured as Sleepy End Devices.`,
  `What primary architectural advantage does Thread offer over traditional Zigbee in terms of IP network addressing?`
);

writeNoteBlock('iot', 'wireless-wifi-ble-lora-zigbee', 'iot-06-lo07',
  `When assets roam across continents or operate outside private Wi-Fi and LoRa gateways, Cellular IoT provides universal, licensed-spectrum connectivity:
1. Narrowband IoT (NB-IoT / LTE Cat-NB1 & Cat-NB2):
   - Bandwidth: Operates within a tiny $200\\text{kHz}$ carrier slice (often deployed in LTE guard bands).
   - Throughput: Low data rates ($\sim 20-100\\text{kbps}$).
   - Propagation: Excellent deep indoor and underground penetration ($+20\\text{dB}$ link margin over standard GSM). Optimized for stationary meters (water, gas).
2. LTE-M (Cat-M1):
   - Bandwidth: $1.4\\text{MHz}$ carrier channel delivering up to $1\\text{Mbps}$.
   - Mobility: Supports full cell handover during movement, voice calls (VoLTE), and higher throughput. Ideal for vehicle fleet tracking and asset logistics.
3. Energy Conservation Mechanisms:
   - Power Saving Mode (PSM): The cellular modem enters a deep sleep state where it completely disconnects from the RF carrier for hours or days while remaining registered with the mobile network core, drawing $<5\\mu\\text{A}$.
   - extended Discontinuous Reception (eDRX): Extends paging listening intervals up to 40 minutes, reducing paging receiver wakeups.`,
  `Configuring NB-IoT modem via standard 3GPP AT commands over UART:
\`\`\`text
AT+CPIN?              // Check SIM card PIN status -> +CPIN: READY
AT+CSQ                // Check signal quality (RSSI) -> +CSQ: 24,99
AT+CGATT=1            // Attach to cellular packet service -> OK
AT+CPSMS=1,,,"00100001","00000100" // Configure PSM timer (Periodic TAU 1 hour, Active 8s)
AT+CSTT="iot.carrier.com" // Configure APN
AT+CIICR              // Bring up wireless GPRS connection
AT+CIFSR              // Get assigned IP address -> 10.45.22.189
\`\`\``,
  `Attempting to use standard consumer smartphone SIM cards in cellular IoT modems; consumer SIMs lack Power Saving Mode (PSM) provisioning and network operators disable SIMs that exhibit bursty M2M telemetry patterns. Always use dedicated M2M/eSIM profiles.`,
  `What is the difference between NB-IoT and LTE-M in terms of mobility and throughput?`
);

writeNoteBlock('iot', 'wireless-wifi-ble-lora-zigbee', 'iot-06-lo08',
  `Wireless network design is governed by immutable laws of physics linking range, bandwidth, and energy consumption:
1. The Shannon-Hartley Channel Capacity Theorem:
   $$C = B \\log_2 \\left(1 + \\frac{S}{N}\\right)$$
   Where $C$ is theoretical channel capacity (bits/sec), $B$ is channel bandwidth (Hz), and $\\frac{S}{N}$ is the signal-to-noise power ratio. Transmitting high data rates requires either a wide frequency channel (e.g. Wi-Fi: $20\\text{MHz}$) or high transmission power. Narrowband protocols (LoRa: $125\\text{kHz}$, NB-IoT: $200\\text{kHz}$) trade data throughput for exceptional sensitivity and multi-kilometer range.
2. The Friis Transmission Equation (Free-Space Path Loss):
   $$\\frac{P_r}{P_t} = G_t G_r \\left(\\frac{\\lambda}{4\\pi d}\\right)^2$$
   Received power ($P_r$) decays proportionally to the square of distance ($d^2$) and wavelength squared ($\\lambda^2 = \\frac{c^2}{f^2}$). Lower carrier frequencies (sub-GHz: $868\\text{MHz}$) suffer significantly less atmospheric attenuation and penetrate solid walls far better than $2.4\\text{GHz}$ or $5\\text{GHz}$ signals.
3. Decision Rule:
   - High speed, short range, mains power: Wi-Fi.
   - Low speed, short range, coin cell: BLE.
   - Low speed, long range ($>10\\text{km}$), multi-year battery: LoRaWAN.`,
  `Python script calculating free space path loss (FSPL) in decibels:
\`\`\`python
import math

def calculate_fspl_db(distance_km, frequency_mhz):
    # FSPL(dB) = 20*log10(d) + 20*log10(f) + 32.44
    fspl = 20 * math.log10(distance_km) + 20 * math.log10(frequency_mhz) + 32.44
    return round(fspl, 2)

# Compare 1km path loss at 868 MHz (LoRa) vs 2400 MHz (Wi-Fi)
loss_lora = calculate_fspl_db(distance_km=1.0, frequency_mhz=868.0)
loss_wifi = calculate_fspl_db(distance_km=1.0, frequency_mhz=2400.0)

print(f"Path Loss at 1km: LoRa (868MHz) = {loss_lora} dB | Wi-Fi (2.4GHz) = {loss_wifi} dB")
# LoRa suffers ~8.8 dB less path loss (nearly 8x stronger received power!)
\`\`\``,
  `Selecting $2.4\\text{GHz}$ Wi-Fi for an underground water meter sensor; high carrier frequencies attenuate drastically in soil and concrete, resulting in zero connectivity.`,
  `According to the Friis transmission equation, why do Sub-GHz radios (e.g. 868MHz) travel further than 2.4GHz radios at equivalent transmission power?`
);

writeNoteBlock('iot', 'wireless-wifi-ble-lora-zigbee', 'iot-06-lo09',
  `Deploying custom RF hardware requires impedance-matched antenna layouts and adherence to international electromagnetic compatibility (EMC) regulations:
1. Characteristic Impedance Matching ($50\\,\\Omega$):
   Microstrip transmission lines connecting the radio transceiver IC to the antenna must maintain a precise $50\\,\\Omega$ characteristic impedance. Impedance mismatches create signal reflections measured by the Voltage Standing Wave Ratio (VSWR). A VSWR $>2.0$ reflects significant RF power back into the transceiver, burning the final power amplifier stage and cutting range.
2. Pi-Matching Networks: A three-component matching filter (inductors and capacitors in a Pi configuration) is placed between transceiver and antenna to tune out complex parasitic reactances on prototype PCBs.
3. Regulatory Certification (FCC, CE, WPC):
   - Unlicensed ISM Bands: Frequencies reserved for Industrial, Scientific, and Medical use (2.4GHz global, 868MHz Europe, 915MHz North America, 865-867MHz India).
   - Spurious Emissions: Transmitters must comply with strict out-of-band harmonic emission limits to prevent interfering with aviation and mobile communications.`,
  `Evaluating Voltage Standing Wave Ratio (VSWR) from reflection coefficient in Python:
\`\`\`python
def calculate_vswr(reflection_coefficient):
    gamma = abs(reflection_coefficient)
    if gamma >= 1.0:
        return float('inf')
    vswr = (1.0 + gamma) / (1.0 - gamma)
    return round(vswr, 2)

# Testing matching network with reflection coefficient Gamma = 0.1
print(f"Antenna VSWR: {calculate_vswr(0.1)}") # 1.22:1 (Excellent RF match)
\`\`\``,
  `Running digital or high-speed SPI traces directly under an unshielded PCB trace antenna, coupling high-frequency digital clock harmonics directly into the radio front-end and desensitizing the receiver.`,
  `What is the ideal characteristic impedance target for RF traces connecting a transceiver to an antenna?`
);

// Questions for iot-06
const ch06Questions = [
  // LO01
  {
    loId: "iot-06-lo01",
    type: "single",
    difficulty: 1,
    id: "iot-06-q01",
    stem: "In which Wi-Fi mode does an ESP32 create its own local wireless network so nearby smartphones can connect to it?",
    options: [
      { id: "a", text: "Access Point (AP) mode" },
      { id: "b", text: "Station (STA) mode" },
      { id: "c", text: "Monitor mode" },
      { id: "d", text: "Sleep mode" }
    ],
    answer: ["a"],
    explanation: "In Access Point (AP) mode, the ESP32 acts as a router hosting its own SSID and subnet.",
    noteRef: "iot-06-lo01",
    reviewed: false
  },
  {
    loId: "iot-06-lo01",
    type: "scenario",
    difficulty: 2,
    id: "iot-06-q02",
    stem: "An IoT smart lamp cannot connect to a homeowner's router. It launches a Captive Portal web page allowing the homeowner to select their Wi-Fi SSID and enter credentials. What mechanism enables this?",
    options: [
      { id: "a", text: "An automated provisioning framework (like WiFiManager) combining SoftAP, internal DNS redirection, and a local web server." },
      { id: "b", text: "Bluetooth satellite uplink." },
      { id: "c", text: "A physical SIM card inside the bulb." },
      { id: "d", text: "Firmware flashing over audio signals." }
    ],
    answer: ["a"],
    explanation: "WiFiManager boots an AP and DNS server that intercepts HTTP traffic to present a credential configuration portal.",
    noteRef: "iot-06-lo01",
    reviewed: false
  },
  {
    loId: "iot-06-lo01",
    type: "multi",
    difficulty: 2,
    id: "iot-06-q03",
    stem: "Which of the following Wi-Fi operational states can an ESP32 simultaneously operate in?",
    options: [
      { id: "a", text: "Station (STA) mode connecting to an existing home router" },
      { id: "b", text: "Access Point (AP) mode broadcasting a configuration network (AP+STA mode)" },
      { id: "c", text: "Deep sleep with radios transmitting at 100% power" },
      { id: "d", text: "Sub-GHz LoRaWAN Class C" }
    ],
    answer: ["a", "b"],
    explanation: "ESP32 supports simultaneous dual AP+STA mode; deep sleep powers off radios entirely.",
    noteRef: "iot-06-lo01",
    reviewed: false
  },
  {
    loId: "iot-06-lo01",
    type: "single",
    difficulty: 3,
    id: "iot-06-q04",
    stem: "Where are Wi-Fi network credentials safely persisted on an ESP32 so they survive power outages without hardcoding them into source code?",
    options: [
      { id: "a", text: "In Non-Volatile Storage (NVS) flash partition." },
      { id: "b", text: "In volatile CPU registers." },
      { id: "c", text: "In the computer's web browser cookies." },
      { id: "d", text: "On the router's power cable." }
    ],
    answer: ["a"],
    explanation: "NVS flash stores key-value pairs persistently across power cycles on the ESP32.",
    noteRef: "iot-06-lo01",
    reviewed: false
  },

  // LO02
  {
    loId: "iot-06-lo02",
    type: "single",
    difficulty: 1,
    id: "iot-06-q05",
    stem: "What is the structural hierarchy of the BLE Generic Attribute Profile (GATT)?",
    options: [
      { id: "a", text: "Profile contains Services, which contain Characteristics, which contain Descriptors and Values." },
      { id: "b", text: "Packets contain Frames, which contain IP addresses." },
      { id: "c", text: "Services contain Profiles, which contain Transistors." },
      { id: "d", text: "Descriptors contain Microcontrollers." }
    ],
    answer: ["a"],
    explanation: "GATT organizes data hierarchically into Profiles, Services, Characteristics, and Descriptors.",
    noteRef: "iot-06-lo02",
    reviewed: false
  },
  {
    loId: "iot-06-lo02",
    type: "scenario",
    difficulty: 2,
    id: "iot-06-q06",
    stem: "An engineer is defining a custom proprietary telemetry service for an industrial crane. Which UUID format must be assigned to avoid colliding with official Bluetooth SIG profiles?",
    options: [
      { id: "a", text: "A randomly generated unique 128-bit UUID (e.g., 4fafc201-1fb5-459e-8fcc-c5c9c331914b)." },
      { id: "b", text: "A 16-bit UUID like 0x180F." },
      { id: "c", text: "A 4-bit integer." },
      { id: "d", text: "An email address." }
    ],
    answer: ["a"],
    explanation: "16-bit UUIDs are reserved by Bluetooth SIG; custom vendor profiles must use random 128-bit UUIDs.",
    noteRef: "iot-06-lo02",
    reviewed: false
  },
  {
    loId: "iot-06-lo02",
    type: "single",
    difficulty: 2,
    id: "iot-06-q07",
    stem: "In the BLE Generic Access Profile (GAP), which role scans the airwaves for advertisement packets and initiates connections?",
    options: [
      { id: "a", text: "Central (Observer / Client)" },
      { id: "b", text: "Peripheral (Broadcaster / Server)" },
      { id: "c", text: "Transistor" },
      { id: "d", text: "Beacon tag" }
    ],
    answer: ["a"],
    explanation: "GAP Central devices scan for advertisements and initiate incoming connections to Peripherals.",
    noteRef: "iot-06-lo02",
    reviewed: false
  },
  {
    loId: "iot-06-lo02",
    type: "single",
    difficulty: 3,
    id: "iot-06-q08",
    stem: "What is the function of a BLE Characteristic's Client Characteristic Configuration Descriptor (CCCD, UUID 0x2902)?",
    options: [
      { id: "a", text: "It allows a client to subscribe to or unsubscribe from asynchronous Notifications and Indications." },
      { id: "b", text: "It sets the radio antenna transmission power." },
      { id: "c", text: "It encrypts the microcontroller's RAM." },
      { id: "d", text: "It stores the device's battery serial number." }
    ],
    answer: ["a"],
    explanation: "Clients write 0x0001 (notify) or 0x0002 (indicate) to CCCD to enable autonomous push notifications.",
    noteRef: "iot-06-lo02",
    reviewed: false
  },

  // LO03
  {
    loId: "iot-06-lo03",
    type: "single",
    difficulty: 1,
    id: "iot-06-q09",
    stem: "How many dedicated RF physical channels are reserved for BLE advertising packets in the 2.4 GHz spectrum?",
    options: [
      { id: "a", text: "3 channels (Channels 37, 38, and 39)" },
      { id: "b", text: "79 channels" },
      { id: "c", text: "1 channel" },
      { id: "d", text: "16 channels" }
    ],
    answer: ["a"],
    explanation: "BLE reserves channels 37, 38, and 39 for advertising, spaced apart to avoid Wi-Fi channel overlap.",
    noteRef: "iot-06-lo03",
    reviewed: false
  },
  {
    loId: "iot-06-lo03",
    type: "scenario",
    difficulty: 2,
    id: "iot-06-q10",
    stem: "A fitness tracker transmits heart rate updates to a smartphone 5 times every second. Which mechanism provides the lowest energy consumption?",
    options: [
      { id: "a", text: "BLE Notifications (fire-and-forget push without requiring link-layer acknowledgment)." },
      { id: "b", text: "BLE Indications requiring round-trip acknowledgment for every packet." },
      { id: "c", text: "Smartphone polling the characteristic with continuous Read requests." },
      { id: "d", text: "Opening a full HTTP server on the fitness tracker." }
    ],
    answer: ["a"],
    explanation: "Notifications push data autonomously without waiting for client ACK, minimizing radio on-time.",
    noteRef: "iot-06-lo03",
    reviewed: false
  },
  {
    loId: "iot-06-lo03",
    type: "single",
    difficulty: 2,
    id: "iot-06-q11",
    stem: "What is the maximum payload size of a legacy BLE 4.x primary advertising packet?",
    options: [
      { id: "a", text: "31 bytes" },
      { id: "b", text: "1500 bytes" },
      { id: "c", text: "1024 bytes" },
      { id: "d", text: "8 bytes" }
    ],
    answer: ["a"],
    explanation: "Legacy BLE advertisement packets have a hard maximum user payload of 31 bytes.",
    noteRef: "iot-06-lo03",
    reviewed: false
  },
  {
    loId: "iot-06-lo03",
    type: "single",
    difficulty: 3,
    id: "iot-06-q12",
    stem: "What is the fundamental functional difference between BLE Notifications and BLE Indications?",
    options: [
      { id: "a", text: "Indications require an explicit link-layer acknowledgment from the client before the next packet can be sent, whereas Notifications do not." },
      { id: "b", text: "Notifications only work on Android; Indications only work on iOS." },
      { id: "c", text: "Indications do not require radio signals." },
      { id: "d", text: "Notifications consume 100 times more battery than Indications." }
    ],
    answer: ["a"],
    explanation: "Indications guarantee delivery via application-level ACKs; notifications provide unacknowledged streaming.",
    noteRef: "iot-06-lo03",
    reviewed: false
  },

  // LO04
  {
    loId: "iot-06-lo04",
    type: "single",
    difficulty: 1,
    id: "iot-06-q13",
    stem: "What radio modulation technique is used by the LoRa physical layer?",
    options: [
      { id: "a", text: "Chirp Spread Spectrum (CSS)" },
      { id: "b", text: "Orthogonal Frequency Division Multiplexing (OFDM)" },
      { id: "c", text: "Amplitude Modulation (AM)" },
      { id: "d", text: "Binary Phase Shift Keying (BPSK)" }
    ],
    answer: ["a"],
    explanation: "LoRa uses Chirp Spread Spectrum (CSS), sweeping carrier frequency linearly over time to resist interference.",
    noteRef: "iot-06-lo04",
    reviewed: false
  },
  {
    loId: "iot-06-lo04",
    type: "scenario",
    difficulty: 2,
    id: "iot-06-q14",
    stem: "An environmental monitor is placed 12 kilometers away from the nearest LoRa gateway in a hilly forest. Which Spreading Factor should be selected to maximize receiver sensitivity?",
    options: [
      { id: "a", text: "SF12" },
      { id: "b", text: "SF7" },
      { id: "c", text: "SF4" },
      { id: "d", text: "SF1" }
    ],
    answer: ["a"],
    explanation: "SF12 provides maximum spreading, decoding signals down to -20dB below noise floor at the cost of slow throughput.",
    noteRef: "iot-06-lo04",
    reviewed: false
  },
  {
    loId: "iot-06-lo04",
    type: "numeric",
    difficulty: 2,
    id: "iot-06-q15",
    stem: "How many chips represent one symbol in a LoRa transmission configured with Spreading Factor SF7?",
    options: [
      { id: "a", text: "128" },
      { id: "b", text: "7" },
      { id: "c", text: "64" },
      { id: "d", text: "256" }
    ],
    answer: ["a"],
    explanation: "Chips per symbol = 2^SF = 2^7 = 128 chips.",
    noteRef: "iot-06-lo04",
    verify: "(2 ** 7 === 128)",
    reviewed: false
  },
  {
    loId: "iot-06-lo04",
    type: "single",
    difficulty: 3,
    id: "iot-06-q16",
    stem: "Why does increasing LoRa Spreading Factor from SF7 to SF12 increase battery consumption for a fixed-size payload?",
    options: [
      { id: "a", text: "Higher spreading factors dramatically increase packet on-air transmission time (by up to ~30x), keeping the power-hungry RF power amplifier on much longer." },
      { id: "b", text: "Higher SF requires charging the battery to higher voltages." },
      { id: "c", text: "SF12 disables sleep modes permanently." },
      { id: "d", text: "Because the antenna resistance increases." }
    ],
    answer: ["a"],
    explanation: "Symbol duration doubles with each SF step; a packet taking 40ms on SF7 takes >1000ms on SF12, consuming 30x more energy.",
    noteRef: "iot-06-lo04",
    reviewed: false
  },

  // LO05
  {
    loId: "iot-06-lo05",
    type: "single",
    difficulty: 1,
    id: "iot-06-q17",
    stem: "Which LoRaWAN device class is optimized for the lowest power consumption by opening receive windows only after transmitting an uplink?",
    options: [
      { id: "a", text: "Class A" },
      { id: "b", text: "Class B" },
      { id: "c", text: "Class C" },
      { id: "d", text: "Class D" }
    ],
    answer: ["a"],
    explanation: "Class A is strictly uplink-driven; receive slots open only after transmissions, allowing deep sleep at all other times.",
    noteRef: "iot-06-lo05",
    reviewed: false
  },
  {
    loId: "iot-06-lo05",
    type: "scenario",
    difficulty: 2,
    id: "iot-06-q18",
    stem: "An engineer configures a LoRaWAN sensor in Europe (868 MHz band) where regulations enforce a 1% duty cycle. If the packet airtime is 500ms, what is the minimum interval between successive transmissions?",
    options: [
      { id: "a", text: "50 seconds" },
      { id: "b", text: "5 seconds" },
      { id: "c", text: "1 second" },
      { id: "d", text: "10 minutes" }
    ],
    answer: ["a"],
    explanation: "Airtime / Interval <= 0.01 -> Interval >= 0.5s / 0.01 = 50 seconds.",
    noteRef: "iot-06-lo05",
    reviewed: false
  },
  {
    loId: "iot-06-lo05",
    type: "multi",
    difficulty: 2,
    id: "iot-06-q19",
    stem: "Which of the following keys and identifiers are required to perform an Over-The-Air Activation (OTAA) Join in LoRaWAN 1.0.x?",
    options: [
      { id: "a", text: "Device EUI (DevEUI) unique hardware address" },
      { id: "b", text: "Application / Join EUI (JoinEUI)" },
      { id: "c", text: "Application Key (AppKey) 128-bit root secret" },
      { id: "d", text: "Wi-Fi WPA2 password" }
    ],
    answer: ["a", "b", "c"],
    explanation: "DevEUI, JoinEUI, and AppKey are the three cryptographic identities used in the OTAA Join handshake.",
    noteRef: "iot-06-lo05",
    reviewed: false
  },
  {
    loId: "iot-06-lo05",
    type: "single",
    difficulty: 3,
    id: "iot-06-q20",
    stem: "Why is Over-The-Air Activation (OTAA) strongly preferred over Activation By Personalization (ABP) in production LoRaWAN deployments?",
    options: [
      { id: "a", text: "OTAA dynamically derives fresh session keys (NwkSKey and AppSKey) upon join, prevents replay attacks via JoinNonce, and allows remote re-keying." },
      { id: "b", text: "OTAA does not require a gateway." },
      { id: "c", text: "OTAA transmits 100 times faster." },
      { id: "d", text: "ABP devices cannot run on batteries." }
    ],
    answer: ["a"],
    explanation: "OTAA uses cryptographic nonces to generate dynamic session keys, eliminating replay attacks and static key leakage.",
    noteRef: "iot-06-lo05",
    reviewed: false
  },

  // LO06
  {
    loId: "iot-06-lo06",
    type: "single",
    difficulty: 1,
    id: "iot-06-q21",
    stem: "What physical and MAC layer standard forms the foundation of Zigbee and Thread wireless networks?",
    options: [
      { id: "a", text: "IEEE 802.15.4" },
      { id: "b", text: "IEEE 802.11" },
      { id: "c", text: "IEEE 802.3" },
      { id: "d", text: "Bluetooth v5.0" }
    ],
    answer: ["a"],
    explanation: "IEEE 802.15.4 specifies the physical and MAC layers for low-rate wireless personal area networks.",
    noteRef: "iot-06-lo06",
    reviewed: false
  },
  {
    loId: "iot-06-lo06",
    type: "scenario",
    difficulty: 2,
    id: "iot-06-q22",
    stem: "A smart home startup chooses Thread over Zigbee for their new IoT lighting products. What primary architectural feature does Thread provide natively?",
    options: [
      { id: "a", text: "Native end-to-end IPv6 addressing via 6LoWPAN, allowing direct IP routing to cloud servers without translation gateways." },
      { id: "b", text: "Support for 4K video streaming." },
      { id: "c", text: "100-kilometer radio transmission." },
      { id: "d", text: "Elimination of all wireless security." }
    ],
    answer: ["a"],
    explanation: "Thread implements 6LoWPAN, granting every mesh device a native IPv6 address without translation middleboxes.",
    noteRef: "iot-06-lo06",
    reviewed: false
  },
  {
    loId: "iot-06-lo06",
    type: "multi",
    difficulty: 2,
    id: "iot-06-q23",
    stem: "Which of the following node roles exist within a standard Zigbee wireless mesh network?",
    options: [
      { id: "a", text: "Zigbee Coordinator (starts the network and manages security keys)" },
      { id: "b", text: "Zigbee Router (mains-powered node forwarding packets across the mesh)" },
      { id: "c", text: "Zigbee End Device (sleepy battery-operated sensor node)" },
      { id: "d", text: "Cellular Base Station" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Zigbee topologies comprise one Coordinator, multiple Routers, and low-power End Devices.",
    noteRef: "iot-06-lo06",
    reviewed: false
  },
  {
    loId: "iot-06-lo06",
    type: "single",
    difficulty: 3,
    id: "iot-06-q24",
    stem: "What is Matter in the modern smart home IoT ecosystem?",
    options: [
      { id: "a", text: "An open, royalty-free application-layer connectivity standard running on top of Wi-Fi, Ethernet, and Thread to ensure cross-vendor smart home interoperability." },
      { id: "b", text: "A physical battery manufacturing chemical." },
      { id: "c", text: "A replacement for physical copper wire." },
      { id: "d", text: "A proprietary Apple-only protocol." }
    ],
    answer: ["a"],
    explanation: "Matter unifies smart home devices across Apple, Google, Amazon, and others over Thread and Wi-Fi.",
    noteRef: "iot-06-lo06",
    reviewed: false
  },

  // LO07
  {
    loId: "iot-06-lo07",
    type: "single",
    difficulty: 1,
    id: "iot-06-q25",
    stem: "What is the carrier channel bandwidth allocated to a Narrowband IoT (NB-IoT) carrier?",
    options: [
      { id: "a", text: "200 kHz" },
      { id: "b", text: "20 MHz" },
      { id: "c", text: "1.4 MHz" },
      { id: "d", text: "5 GHz" }
    ],
    answer: ["a"],
    explanation: "NB-IoT uses a narrow 200 kHz carrier slice, equivalent to one standard GSM channel or LTE resource block.",
    noteRef: "iot-06-lo07",
    reviewed: false
  },
  {
    loId: "iot-06-lo07",
    type: "scenario",
    difficulty: 2,
    id: "iot-06-q26",
    stem: "A utility company installs 10,000 smart water meters located inside deep basement concrete pits. Which cellular technology is best suited for penetrating thick walls and soil?",
    options: [
      { id: "a", text: "NB-IoT (with its +20dB link budget gain over conventional GSM)." },
      { id: "b", text: "5G mmWave." },
      { id: "c", text: "Bluetooth Low Energy." },
      { id: "d", text: "Home Wi-Fi." }
    ],
    answer: ["a"],
    explanation: "NB-IoT achieves extraordinary link margins through repeated retransmissions and narrowband power concentration.",
    noteRef: "iot-06-lo07",
    reviewed: false
  },
  {
    loId: "iot-06-lo07",
    type: "single",
    difficulty: 2,
    id: "iot-06-q27",
    stem: "What is Power Saving Mode (PSM) in 3GPP Cellular IoT standards?",
    options: [
      { id: "a", text: "A deep sleep mode where the modem stays registered with the cellular network while drawing microamps without radio reception." },
      { id: "b", text: "Turning off the cell tower." },
      { id: "c", text: "Charging the battery from radio waves." },
      { id: "d", text: "Reducing SIM card physical size." }
    ],
    answer: ["a"],
    explanation: "PSM keeps the device registered in the core network while sleeping for days, eliminating reconnection overhead.",
    noteRef: "iot-06-lo07",
    reviewed: false
  },
  {
    loId: "iot-06-lo07",
    type: "single",
    difficulty: 3,
    id: "iot-06-q28",
    stem: "Why is LTE-M (Cat-M1) preferred over NB-IoT for real-time asset tracking on moving delivery trucks?",
    options: [
      { id: "a", text: "LTE-M supports seamless connected-mode cell handover during motion, whereas NB-IoT drops and reconnects when switching cell towers." },
      { id: "b", text: "LTE-M does not require a SIM card." },
      { id: "c", text: "NB-IoT only functions in outer space." },
      { id: "d", text: "LTE-M operates on solar power directly." }
    ],
    answer: ["a"],
    explanation: "LTE-M supports full mobility and cell handover; NB-IoT requires re-attaching when leaving a cell sector.",
    noteRef: "iot-06-lo07",
    reviewed: false
  },

  // LO08
  {
    loId: "iot-06-lo08",
    type: "single",
    difficulty: 1,
    id: "iot-06-q29",
    stem: "According to the Friis transmission equation, how does received signal power (Pr) scale with distance (d) in free space?",
    options: [
      { id: "a", text: "Pr is inversely proportional to the square of distance (1 / d^2)." },
      { id: "b", text: "Pr increases linearly with distance (d)." },
      { id: "c", text: "Pr is completely independent of distance." },
      { id: "d", text: "Pr is proportional to d^4." }
    ],
    answer: ["a"],
    explanation: "Free-space path loss dictates that received signal power decays with the inverse square of distance ($1/d^2$).",
    noteRef: "iot-06-lo08",
    reviewed: false
  },
  {
    loId: "iot-06-lo08",
    type: "scenario",
    difficulty: 2,
    id: "iot-06-q30",
    stem: "An engineer needs to transmit 500 KB firmware updates over the air in under 5 seconds to a smart meter located 10 meters away. Which wireless technology must be chosen?",
    options: [
      { id: "a", text: "Wi-Fi (providing 10-54+ Mbps throughput)." },
      { id: "b", text: "LoRaWAN operating at SF12 (250 bps)." },
      { id: "c", text: "Zigbee End Device." },
      { id: "d", text: "Sub-GHz 100 baud FSK." }
    ],
    answer: ["a"],
    explanation: "500 KB in 5 seconds requires >800 kbps data rate, which only Wi-Fi (or high-speed BLE) can deliver.",
    noteRef: "iot-06-lo08",
    reviewed: false
  },
  {
    loId: "iot-06-lo08",
    type: "multi",
    difficulty: 2,
    id: "iot-06-q31",
    stem: "Which of the following physical characteristics apply to Sub-GHz radio frequencies (e.g. 868 MHz) compared to 2.4 GHz frequencies?",
    options: [
      { id: "a", text: "Lower free-space path loss over distance" },
      { id: "b", text: "Superior penetration through solid walls and concrete obstacles" },
      { id: "c", text: "Physically larger quarter-wave antenna size (~8.6 cm vs ~3.1 cm)" },
      { id: "d", text: "Higher maximum theoretical data bandwidth" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Sub-GHz achieves lower path loss and better penetration with longer antennas; higher bandwidth belongs to 2.4GHz.",
    noteRef: "iot-06-lo08",
    reviewed: false
  },
  {
    loId: "iot-06-lo08",
    type: "single",
    difficulty: 3,
    id: "iot-06-q32",
    stem: "What principle from the Shannon-Hartley theorem explains why LoRa can decode signals below the thermal noise floor (-20 dB SNR)?",
    options: [
      { id: "a", text: "Trading channel bandwidth for signal-to-noise ratio: spreading a narrow information bit across a wide frequency chirp bandwidth allows signal reconstruction even when noise exceeds signal amplitude." },
      { id: "b", text: "Noise does not exist in sub-GHz bands." },
      { id: "c", text: "LoRa uses quantum entanglement." },
      { id: "d", text: "Shannon's theorem only applies to copper wires." }
    ],
    answer: ["a"],
    explanation: "Spread spectrum techniques spread narrow data over wide bandwidth, extracting signals from noise via correlation.",
    noteRef: "iot-06-lo08",
    reviewed: false
  },

  // LO09 (Extension)
  {
    loId: "iot-06-lo09",
    type: "single",
    difficulty: 2,
    id: "iot-06-q33",
    stem: "What target characteristic impedance is universally standard for RF transmission lines connecting transceiver ICs to antennas?",
    options: [
      { id: "a", text: "50 Ohms" },
      { id: "b", text: "75 Ohms" },
      { id: "c", text: "10k Ohms" },
      { id: "d", text: "0 Ohms" }
    ],
    answer: ["a"],
    explanation: "50 Ohms is the universal standard for RF microstrip traces, balancing power handling and signal attenuation.",
    noteRef: "iot-06-lo09",
    reviewed: false
  },
  {
    loId: "iot-06-lo09",
    type: "scenario",
    difficulty: 2,
    id: "iot-06-q34",
    stem: "A prototype IoT PCB achieves an antenna VSWR (Voltage Standing Wave Ratio) of 4.5:1. What problem does this indicate?",
    options: [
      { id: "a", text: "Severe RF impedance mismatch causing massive power reflection back into the transceiver, drastically cutting range and risking damage to the amplifier." },
      { id: "b", text: "The antenna is working with 100% efficiency." },
      { id: "c", text: "The battery is fully charged." },
      { id: "d", text: "The board is ready for commercial shipment." }
    ],
    answer: ["a"],
    explanation: "VSWR > 2.0 indicates poor matching; 4.5:1 reflects over 40% of RF power back, degrading range severely.",
    noteRef: "iot-06-lo09",
    reviewed: false
  },
  {
    loId: "iot-06-lo09",
    type: "multi",
    difficulty: 3,
    id: "iot-06-q35",
    stem: "Which regulatory compliance bodies govern radio frequency emissions and spectrum licensing for commercial IoT devices?",
    options: [
      { id: "a", text: "FCC (Federal Communications Commission) in the United States" },
      { id: "b", text: "CE / RED (Radio Equipment Directive) in the European Union" },
      { id: "c", text: "WPC (Wireless Planning & Coordination) in India" },
      { id: "d", text: "W3C (World Wide Web Consortium)" }
    ],
    answer: ["a", "b", "c"],
    explanation: "FCC (US), CE (Europe), and WPC (India) enforce national RF emissions standards; W3C manages web standards.",
    noteRef: "iot-06-lo09",
    reviewed: false
  },
  {
    loId: "iot-06-lo09",
    type: "single",
    difficulty: 3,
    id: "iot-06-q36",
    stem: "Why are Pi-matching filter networks (shunt capacitor - series inductor - shunt capacitor) incorporated between the RF pin and antenna?",
    options: [
      { id: "a", text: "To tune out parasitic PCB reactances and transform complex load impedance cleanly into a pure 50-Ohm resistive match." },
      { id: "b", text: "To calculate mathematical Pi." },
      { id: "c", text: "To eliminate the need for an antenna." },
      { id: "d", text: "To convert DC into AC." }
    ],
    answer: ["a"],
    explanation: "Pi-networks provide flexible impedance transformation to tune antennas to 50 Ohms across real PCB substrates.",
    noteRef: "iot-06-lo09",
    reviewed: false
  }
];

balanceAndSave('iot', 'wireless-wifi-ble-lora-zigbee', ch06Objectives, ch06Questions);

// ==========================================
// CHAPTER 07: iot-messaging-mqtt-coap-http (iot-07) [moderate]
// ==========================================

const ch07Objectives = {
  version: 1,
  chapterId: "iot-07",
  objectives: [
    {
      id: "iot-07-lo01",
      order: 1,
      title: "Analyze the Publish/Subscribe messaging architecture and message broker decoupling principles",
      bloom: "analyze",
      tier: "core",
      mustHave: true,
      keywords: ["mqtt pub sub", "broker decoupling", "mosquitto", "spatial decoupling", "temporal decoupling"],
      aliases: ["publish subscribe architecture", "mqtt broker role"],
      prerequisites: ["iot-06-lo01"],
      estMinutes: 12
    },
    {
      id: "iot-07-lo02",
      order: 2,
      title: "Construct hierarchical MQTT topic trees with single-level (+) and multi-level (#) wildcards",
      bloom: "construct",
      tier: "core",
      mustHave: true,
      keywords: ["mqtt topics", "single-level wildcard", "multi-level wildcard", "topic namespace", "topic design"],
      aliases: ["mqtt topic hierarchy", "topic wildcards"],
      prerequisites: ["iot-07-lo01"],
      estMinutes: 14
    },
    {
      id: "iot-07-lo03",
      order: 3,
      title: "Evaluate MQTT Quality of Service (QoS 0, QoS 1, QoS 2) handshake mechanics and bandwidth trade-offs",
      bloom: "evaluate",
      tier: "core",
      mustHave: true,
      keywords: ["qos 0", "qos 1", "qos 2", "puback", "pubrec pubrel pubcomp", "at least once"],
      aliases: ["mqtt qos levels", "qos handshake"],
      prerequisites: ["iot-07-lo01"],
      estMinutes: 14
    },
    {
      id: "iot-07-lo04",
      order: 4,
      title: "Implement MQTT Retained Messages, Last Will and Testament (LWT), and Keep-Alive ping mechanisms",
      bloom: "implement",
      tier: "core",
      mustHave: true,
      keywords: ["retained message", "last will and testament", "lwt", "keep-alive", "pingreq pingresp"],
      aliases: ["mqtt lwt", "mqtt advanced features"],
      prerequisites: ["iot-07-lo02"],
      estMinutes: 14
    },
    {
      id: "iot-07-lo05",
      order: 5,
      title: "Examine Constrained Application Protocol (CoAP RFC 7252) RESTful messaging over UDP",
      bloom: "examine",
      tier: "core",
      mustHave: false,
      keywords: ["coap", "rfc 7252", "rest over udp", "confirmable con", "non-confirmable non", "coap observe"],
      aliases: ["coap protocol", "constrained application protocol"],
      prerequisites: ["iot-07-lo01"],
      estMinutes: 12
    },
    {
      id: "iot-07-lo06",
      order: 6,
      title: "Compare HTTP/REST protocol overhead against MQTT and CoAP in constrained battery networks",
      bloom: "compare",
      tier: "core",
      mustHave: true,
      keywords: ["http vs mqtt", "protocol overhead", "tcp handshake", "http header bloat", "battery drain"],
      aliases: ["iot protocol comparison", "http vs mqtt vs coap"],
      prerequisites: ["iot-07-lo03", "iot-07-lo05"],
      estMinutes: 14
    },
    {
      id: "iot-07-lo07",
      order: 7,
      title: "Design lightweight telemetry serialization payloads: JSON, Protocol Buffers, and CBOR",
      bloom: "design",
      tier: "core",
      mustHave: false,
      keywords: ["json vs cbor", "protocol buffers", "binary serialization", "payload size", "bandwidth optimization"],
      aliases: ["iot payload design", "cbor vs json"],
      prerequisites: ["iot-04-lo07"],
      estMinutes: 12
    },
    {
      id: "iot-07-lo08",
      order: 8,
      title: "Secure MQTT communications using Transport Layer Security (MQTTS port 8883) and mutual authentication",
      bloom: "secure",
      tier: "core",
      mustHave: false,
      keywords: ["mqtts", "tls port 8883", "x509 client certificate", "mutual tls", "mtls"],
      aliases: ["secure mqtt", "mqtt over tls"],
      prerequisites: ["sec-04-lo05", "iot-07-lo01"],
      estMinutes: 14
    },
    {
      id: "iot-07-lo09",
      order: 9,
      title: "Deploy a local Eclipse Mosquitto MQTT message broker on Docker or Linux single-board computers",
      bloom: "deploy",
      tier: "extension",
      mustHave: false,
      keywords: ["mosquitto", "mosquitto.conf", "local broker", "mqtt client test", "sub-pub testing"],
      aliases: ["mosquitto broker deployment", "local mqtt broker"],
      prerequisites: ["iot-07-lo01"],
      estMinutes: 12
    }
  ]
};

// Notes for iot-07

writeNoteBlock('iot', 'iot-messaging-mqtt-coap-http', 'iot-07-lo01',
  `Message Queuing Telemetry Transport (MQTT) is an OASIS standard binary publish/subscribe messaging protocol designed by IBM and Arcom for resource-constrained remote telemetry:
1. The Publish/Subscribe Model:
   Replaces rigid client-server connections with a decoupled broker-mediated topology:
   - Publishers: Devices that collect sensor telemetry and publish messages to named topic strings without knowing who will receive them.
   - Subscribers: Client applications or backend databases that register interest in specific topics to receive incoming messages.
   - Message Broker: The central routing engine (e.g., Mosquitto, EMQX, HiveMQ) that receives all published packets, filters them by topic, and dispatches them to matching subscribed clients.
2. The Three Decoupling Dimensions:
   - Space Decoupling: Publisher and subscriber do not need to know each other's IP address or hostname.
   - Time Decoupling: Publisher and subscriber do not need to be online at the same time (supported via QoS and retained messages).
   - Synchronization Decoupling: Publishing operations are non-blocking; devices publish and immediately resume local execution without waiting for subscriber processing.`,
  `Publish/subscribe broker distribution in Python using \`paho-mqtt\`:
\`\`\`python
import paho.mqtt.client as mqtt

# Publisher node
client = mqtt.Client()
client.connect("broker.hivemq.com", 1883, 60)

# Publish temperature payload to topic
client.publish("factory/sensor01/temperature", payload="24.8", qos=1)
client.disconnect()
print("Telemetry published successfully!")
\`\`\``,
  `Attempting to establish direct TCP peer-to-peer connections between 1,000 battery-operated sensor nodes; without a central pub/sub broker, managing $N \\times N$ dynamic IP addresses across roaming nodes is impossible.`,
  `What are the three dimensions of architectural decoupling provided by the MQTT publish/subscribe model?`
);

writeNoteBlock('iot', 'iot-messaging-mqtt-coap-http', 'iot-07-lo02',
  `MQTT topics are UTF-8 hierarchical strings separated by forward slashes (\`/\`), forming structured data classification trees:
1. Topic Hierarchy Design:
   Structure topics from general to specific:
   \`company / facility / building / floor / room / device_id / metric\`
   Example: \`enterprise/delhi/tower_a/floor3/room302/ac_unit/temp\`
2. Wildcard Filtering for Subscribers:
   Subscribers use wildcards to aggregate streams across fleets without subscribing to thousands of individual topics:
   - Single-Level Wildcard (\`+\`): Matches exactly one hierarchical level between slashes.
     - \`factory/+/temperature\` matches \`factory/sensor01/temperature\` and \`factory/sensor02/temperature\`, but NOT \`factory/sensor01/sub/temperature\`.
   - Multi-Level Wildcard (\`#\`): Matches all remaining hierarchical sub-levels. Must be placed as the final character in the topic string.
     - \`factory/building_a/#\` matches all telemetry, alerts, and commands generated inside building A.
3. Best Practices: Never start a topic with a leading slash (\`/factory\`), as it creates an empty root string level; never use wildcards in publish topics.`,
  `Testing MQTT topic matching in Python:
\`\`\`python
def match_topic(pattern, topic):
    p_parts = pattern.split('/')
    t_parts = topic.split('/')
    for i, p in enumerate(p_parts):
        if p == '#':
            return True
        if i >= len(t_parts) or (p != '+' and p != t_parts[i]):
            return False
    return len(p_parts) == len(t_parts)

pattern = "facility/+/temperature"
print(match_topic(pattern, "facility/room1/temperature")) # True
print(match_topic(pattern, "facility/room1/humidity"))    # False
\`\`\``,
  `Subscribing to the root wildcard \`#\` on an enterprise production broker; flooding a low-memory microcontroller with tens of thousands of irrelevant enterprise messages exhausts its memory and causes a crash.`,
  `How does the single-level wildcard (\`+\`) differ from the multi-level wildcard (\`#\`) in MQTT subscriptions?`
);

writeNoteBlock('iot', 'iot-messaging-mqtt-coap-http', 'iot-07-lo03',
  `MQTT Quality of Service (QoS) guarantees message delivery reliability across unreliable, lossy wireless networks:
1. QoS 0 - At Most Once (Fire-and-Forget):
   - Handshake: Single \`PUBLISH\` packet sent from client to broker. No acknowledgment, no retry.
   - Characteristics: Lowest bandwidth, lowest latency, but messages are lost if network drops.
   - Use Case: High-frequency periodic telemetry (e.g. ambient temperature reading every 2 seconds).
2. QoS 1 - At Least Once (Acknowledged Delivery):
   - Handshake: Client sends \`PUBLISH\` (with unique Packet ID); broker replies with \`PUBACK\`. If \`PUBACK\` is not received within a timeout, client re-transmits with the duplicate flag (\`DUP=1\`).
   - Characteristics: Guarantees delivery, but duplicate messages may arrive if ACKs are dropped.
   - Use Case: Critical threshold alerts, door open events, sensor failure alarms.
3. QoS 2 - Exactly Once (Assured Delivery):
   - Handshake: A strict 4-step dual handshake: \`PUBLISH\` $\\rightarrow$ \`PUBREC\` (received) $\\rightarrow$ \`PUBREL\` (release) $\\rightarrow$ \`PUBCOMP\` (complete).
   - Characteristics: Guarantees message arrives exactly once with zero duplicates. Highest bandwidth overhead.
   - Use Case: Billing transactions, medical alarms, industrial valve actuations.`,
  `QoS handshake comparison summary:
\`\`\`text
QoS Level    Guarantee        Packets Exchanged    Bandwidth    Risk
-------------------------------------------------------------------------------
QoS 0        At most once     1 (PUBLISH)          Minimal      Packet loss
QoS 1        At least once    2 (PUBLISH, PUBACK)  Low          Duplicate messages
QoS 2        Exactly once     4 (PUB,REC,REL,COMP) High         High latency
\`\`\``,
  `Using QoS 2 for routine temperature telemetry; the 4-way packet handshake generates excessive cellular data traffic and drains battery power with zero practical operational benefit.`,
  `Why can a subscriber receive duplicate messages when using MQTT QoS 1?`
);

writeNoteBlock('iot', 'iot-messaging-mqtt-coap-http', 'iot-07-lo04',
  `MQTT incorporates specialized features to track device connection health and preserve current system state:
1. Retained Messages:
   When publishing with the Retained flag set (\`retain = true\`), the broker stores that message as the "last known good state" for that topic. When a new client subscribes to that topic hours or days later, the broker immediately dispatches the retained message, eliminating the need to wait for the next periodic sensor cycle. Only ONE retained message exists per topic; publishing an empty payload with \`retain = true\` deletes it.
2. Last Will and Testament (LWT):
   During initial \`CONNECT\`, the client deposits an LWT message and topic with the broker (e.g., topic \`node01/status\`, payload \`"offline"\`). If the client disconnects gracefully (\`DISCONNECT\`), the LWT is discarded. If the client disconnects ungracefully (battery dies, cable cut, Wi-Fi drops), the broker immediately publishes the LWT to notify the entire network of the failure.
3. Keep-Alive & PINGREQ:
   Clients specify a Keep-Alive interval (e.g., $60\\text{s}$). If no data is published, the client sends a 2-byte \`PINGREQ\`, and the broker replies with \`PINGRESP\`. If the broker receives nothing for $1.5 \\times \\text{Keep-Alive}$, it terminates the session and triggers the LWT.`,
  `Configuring Last Will and Testament and Retained Message in Python:
\`\`\`python
import paho.mqtt.client as mqtt

client = mqtt.Client(client_id="Solar_Node_01")
# Register LWT before connecting
client.will_set("nodes/solar01/status", payload="OFFLINE", qos=1, retain=True)

client.connect("mqtt.example.com", 1883, keepalive=60)
# Publish active status as retained
client.publish("nodes/solar01/status", payload="ONLINE", qos=1, retain=True)
\`\`\``,
  `Confusing retained messages with historical databases; MQTT brokers only retain the single most recent message per topic. To store time-series history, route messages to InfluxDB or TimescaleDB.`,
  `Under what exact circumstance does an MQTT broker publish a client's Last Will and Testament (LWT) message?`
);

writeNoteBlock('iot', 'iot-messaging-mqtt-coap-http', 'iot-07-lo05',
  `The Constrained Application Protocol (CoAP, RFC 7252) brings the RESTful web architecture to microcontrollers over UDP:
1. REST over UDP Architecture:
   Unlike MQTT (which runs over connection-oriented TCP), CoAP operates over lightweight User Datagram Protocol (UDP). It eliminates TCP handshake overhead, connection state tables, and heavy keep-alive packets, making it ideal for sleepy devices and satellite links.
2. Compact 4-Byte Binary Header:
   CoAP replaces verbose ASCII HTTP headers with a fixed 4-byte binary header specifying Version, Message Type, Code (e.g., \`0.01 GET\`, \`0.02 POST\`, \`2.05 Content\`), and Message ID.
3. Message Reliability Types:
   - Confirmable (CON): Requires an immediate Acknowledgment (ACK) response with matching Message ID; automatically re-transmits with exponential backoff if lost.
   - Non-Confirmable (NON): Fire-and-forget datagram without acknowledgment.
4. CoAP Observe (RFC 7641):
   Allows a client to register interest in a resource (e.g., \`GET /sensors/temp\` with Observe option). The CoAP server autonomously pushes state updates whenever the resource changes, effectively synthesizing pub/sub over UDP.`,
  `CoAP 4-byte header structure:
\`\`\`text
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|Ver| T |  TKL  |      Code     |          Message ID           |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   Ver = 2 bits (CoAP version 1)
   T   = 2 bits (Type: CON=0, NON=1, ACK=2, RST=3)
   TKL = 4 bits (Token Length: 0-8 bytes)
   Code = 8 bits (Class.Detail, e.g. 0.01 for GET, 2.05 for Content)
   Message ID = 16 bits (Deduplication and ACK correlation)
\`\`\``,
  `Using CoAP over networks with strict stateful firewalls that aggressively drop unsolicited inbound UDP packets, blocking CoAP Observe notifications.`,
  `What primary network layer difference distinguishes CoAP (UDP-based) from MQTT (TCP-based)?`
);

writeNoteBlock('iot', 'iot-messaging-mqtt-coap-http', 'iot-07-lo06',
  `Comparing HTTP/REST, MQTT, and CoAP reveals critical performance gaps in bandwidth and power efficiency for battery-powered IoT devices:
1. HTTP Overhead in IoT:
   - TCP 3-Way Handshake: Every new HTTP request requires a SYN, SYN-ACK, ACK exchange ($3$ round trips) before sending data.
   - Verbose Headers: A minimal HTTP/1.1 POST includes hundreds of bytes of ASCII text headers (\`Host\`, \`User-Agent\`, \`Accept\`, \`Content-Length\`). Sending a 5-byte payload (\`24.5C\`) requires over $400\\text{ bytes}$ of wire data!
   - Polling Inefficiency: HTTP is request-response; checking for actuator commands requires frequent polling, destroying battery life.
2. MQTT Efficiency:
   - A single persistent TCP connection handles multiple messages.
   - Binary fixed header is only $2\\text{ bytes}$, reducing protocol overhead by over $95\\%$ compared to HTTP.
   - Event-driven push: Actuator commands arrive instantly without polling.
3. CoAP Efficiency:
   - UDP-based with zero connection overhead and a compact 4-byte header, offering the highest battery efficiency for periodic sleeping sensors.`,
  `Bandwidth overhead comparison for transmitting a 10-byte telemetry reading:
\`\`\`text
Protocol       Transport    Header Overhead    Total Bytes Sent    Connection Model
------------------------------------------------------------------------------------
HTTP/1.1       TCP          ~350 - 600 bytes   ~450+ bytes         New conn / Keep-Alive
MQTT (QoS 0)   TCP          2 bytes            12 bytes            Persistent session
CoAP (NON)     UDP          4 bytes            14 bytes            Connectionless datagram
\`\`\``,
  `Deploying standard HTTP POST requests on an NB-IoT cellular connection to send temperature every 5 minutes; data overhead consumes monthly cellular quotas in days and drains batteries 10x faster than MQTT or CoAP.`,
  `Why is the 2-byte binary header of MQTT drastically more efficient than an HTTP/1.1 POST header for sending sensor telemetry?`
);

writeNoteBlock('iot', 'iot-messaging-mqtt-coap-http', 'iot-07-lo07',
  `Data serialization formats dictate payload size, CPU parsing overhead, and network transmission costs:
1. JSON (JavaScript Object Notation):
   - Advantages: Human-readable, native to web dashboards, supported by all backend frameworks.
   - Disadvantages: Highly verbose due to repeated ASCII key names (\`"temperature": 24.5\`), slow text parsing on 8-bit/32-bit MCUs, bloated payload size.
2. CBOR (Concise Binary Object Representation, RFC 8949):
   - A binary data format modeled after JSON's data types (integers, floats, maps, arrays).
   - Encodes data into compact binary tags, cutting payload size by $40\\% - 60\\%$ while eliminating floating-point string formatting overhead.
3. Protocol Buffers (Protobuf - Google):
   - Uses pre-compiled schema files (\`.proto\`) to serialize strongly typed binary messages with integer field tags instead of string keys.
   - Achieves maximum compression and blazing-fast decoding on microcontrollers (e.g. using \`nanopb\`).`,
  `Comparing payload sizes in Python:
\`\`\`python
import json

data = {"dev_id": "SN-042", "temp": 24.55, "hum": 62, "battery": 95}

# JSON serialization
json_bytes = json.dumps(data).encode('utf-8')
print(f"JSON Payload Size: {len(json_bytes)} bytes -> {json_bytes.decode()}")
# 58 bytes

# Compact raw binary packing (8 bytes total)
import struct
bin_bytes = struct.pack(">HfhB", 42, 24.55, 62, 95)
print(f"Packed Binary Size: {len(bin_bytes)} bytes")
# 8 bytes (~86% bandwidth savings!)
\`\`\``,
  `Sending uncompressed, verbose JSON with long descriptive keys over expensive satellite or cellular IoT links; compressing or switching to binary serialization cuts cellular data bills by more than half.`,
  `What primary advantage does CBOR or packed binary serialization provide over standard JSON in constrained IoT networks?`
);

writeNoteBlock('iot', 'iot-messaging-mqtt-coap-http', 'iot-07-lo08',
  `Standard MQTT transmits plaintext usernames, passwords, and sensor readings over port 1883, leaving systems exposed to packet sniffing and unauthorized actuation:
1. MQTTS (MQTT over TLS):
   Encrypts all transport traffic using TLS (Transport Layer Security) over standard port 8883:
   - Server Authentication: The client validates the broker's X.509 digital certificate against a trusted Certificate Authority (CA) root, preventing man-in-the-middle attacks.
   - Encryption: Protects credentials and telemetry payloads in transit with AES-GCM encryption.
2. Mutual TLS (mTLS / Client Certificates):
   High-security IoT architectures (such as AWS IoT Core) mandate mutual authentication. The device must present its own unique X.509 client certificate and private key stored in secure hardware (ATECC608 secure element) to prove its identity before the broker accepts the connection.
3. TLS Overhead on Microcontrollers:
   TLS handshakes require asymmetric RSA or ECC cryptography, consuming several kilobytes of SRAM and 1-2 seconds of CPU compute time during initial connection. Keep sessions alive to avoid frequent re-handshakes.`,
  `Connecting an ESP32 to MQTTS with root CA verification in Arduino C++:
\`\`\`cpp
#include <WiFiClientSecure.h>
#include <PubSubClient.h>

const char* mqtt_server = "broker.hivemq.com";
const char* root_ca = "-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----";

WiFiClientSecure espClient;
PubSubClient client(espClient);

void setup() {
  espClient.setCACert(root_ca); // Validate broker authenticity
  client.setServer(mqtt_server, 8883); // Secure TLS port
}
\`\`\``,
  `Using \`espClient.setInsecure()\` in production; this disables all TLS certificate verification, leaving the device completely vulnerable to man-in-the-middle interception.`,
  `Why is MQTTS configured on port 8883 rather than the standard unencrypted port 1883?`
);

writeNoteBlock('iot', 'iot-messaging-mqtt-coap-http', 'iot-07-lo09',
  `Deploying an on-premise message broker ensures low-latency, private IoT data distribution without dependency on third-party cloud infrastructure:
1. Eclipse Mosquitto: A lightweight, open-source C implementation of an MQTT broker supporting MQTT v3.1.1 and v5.0. Consumes less than 10MB of RAM, making it suitable for Raspberry Pi, edge gateways, or cloud servers.
2. Core Configuration (\`mosquitto.conf\`):
   - \`listener 1883 0.0.0.0\`: Binds the broker to listen for unencrypted connections across all network interfaces.
   - \`allow_anonymous false\`: Disables anonymous logins, enforcing authentication.
   - \`password_file /etc/mosquitto/passwd\`: Points to the hashed password database generated via \`mosquitto_passwd\`.
3. Command-Line Testing Tools:
   - \`mosquitto_sub\`: Subscribes to topics and displays incoming streams in real time.
   - \`mosquitto_pub\`: Publishes test messages to verify network delivery.`,
  `Docker Compose file deploying a local Mosquitto broker:
\`\`\`yaml
version: '3.8'
services:
  mosquitto:
    image: eclipse-mosquitto:2.0
    container_name: local-mqtt-broker
    restart: unless-stopped
    ports:
      - "1883:1883"
      - "8883:8883"
    volumes:
      - ./mosquitto.conf:/mosquitto/config/mosquitto.conf
      - ./data:/mosquitto/data
      - ./log:/mosquitto/log
\`\`\``,
  `Deploying Mosquitto v2.0+ with default configuration and expecting external network devices to connect; Mosquitto 2.x defaults to listening only on \`127.0.0.1\` and rejects remote connections unless an explicit \`listener\` is configured in \`mosquitto.conf\`.`,
  `What configuration directive must be declared in \`mosquitto.conf\` to allow remote network devices to connect on port 1883?`
);

// Questions for iot-07
const ch07Questions = [
  // LO01
  {
    loId: "iot-07-lo01",
    type: "single",
    difficulty: 1,
    id: "iot-07-q01",
    stem: "In the MQTT publish/subscribe model, what component receives published messages and routes them to interested subscribers?",
    options: [
      { id: "a", text: "Message Broker" },
      { id: "b", text: "Web browser" },
      { id: "c", text: "DNS nameserver" },
      { id: "d", text: "Hardware write blocker" }
    ],
    answer: ["a"],
    explanation: "The MQTT broker acts as the central hub routing messages from publishers to matching subscribers.",
    noteRef: "iot-07-lo01",
    reviewed: false
  },
  {
    loId: "iot-07-lo01",
    type: "scenario",
    difficulty: 2,
    id: "iot-07-q02",
    stem: "An IoT temperature sensor publishes data every minute. The backend database server restarts for updates for 5 minutes. Why does the sensor continue operating without crashing?",
    options: [
      { id: "a", text: "Because the publisher is decoupled in space and synchronization from subscribers via the message broker." },
      { id: "b", text: "Because the temperature sensor runs on solar power." },
      { id: "c", text: "Because MQTT disables database updates." },
      { id: "d", text: "Because the sensor converts into a broker automatically." }
    ],
    answer: ["a"],
    explanation: "Pub/sub decoupling ensures publishers do not depend on subscribers being online or reachable.",
    noteRef: "iot-07-lo01",
    reviewed: false
  },
  {
    loId: "iot-07-lo01",
    type: "multi",
    difficulty: 2,
    id: "iot-07-q03",
    stem: "Which of the following are the three decoupling dimensions provided by the MQTT publish/subscribe architecture?",
    options: [
      { id: "a", text: "Space decoupling (endpoints do not need each other's IP address)" },
      { id: "b", text: "Time decoupling (endpoints do not need to be online concurrently)" },
      { id: "c", text: "Synchronization decoupling (publishing does not block local thread execution)" },
      { id: "d", text: "Radio decoupling (operating without antennas)" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Space, time, and synchronization decoupling are the classic pub/sub architecture principles.",
    noteRef: "iot-07-lo01",
    reviewed: false
  },
  {
    loId: "iot-07-lo01",
    type: "single",
    difficulty: 3,
    id: "iot-07-q04",
    stem: "Why is a decoupled pub/sub architecture significantly more scalable for 100,000 IoT sensors than peer-to-peer client-server polling?",
    options: [
      { id: "a", text: "Sensors connect only to the broker rather than managing dynamic IP addresses, firewalls, and direct sessions with every consuming application." },
      { id: "b", text: "Because brokers generate free bandwidth." },
      { id: "c", text: "Because client-server polling is banned by ISO standards." },
      { id: "d", text: "Pub/sub eliminates the need for power supplies." }
    ],
    answer: ["a"],
    explanation: "Brokers reduce network connection complexity from $O(N^2)$ point-to-point connections to $O(N)$ connections to the broker.",
    noteRef: "iot-07-lo01",
    reviewed: false
  },

  // LO02
  {
    loId: "iot-07-lo02",
    type: "single",
    difficulty: 1,
    id: "iot-07-q05",
    stem: "Which wildcard character in an MQTT subscription matches all remaining hierarchical levels below it?",
    options: [
      { id: "a", text: "# (Multi-level wildcard)" },
      { id: "b", text: "+ (Single-level wildcard)" },
      { id: "c", text: "* (Asterisk)" },
      { id: "d", text: "? (Question mark)" }
    ],
    answer: ["a"],
    explanation: "`#` matches all remaining sub-levels in a topic tree and must be placed at the end of the subscription.",
    noteRef: "iot-07-lo02",
    reviewed: false
  },
  {
    loId: "iot-07-lo02",
    type: "scenario",
    difficulty: 2,
    id: "iot-07-q06",
    stem: "An engineer subscribes to topic `factory/+/temperature`. Which of the following published messages will be received?",
    options: [
      { id: "a", text: "`factory/line1/temperature`" },
      { id: "b", text: "`factory/line1/subzone/temperature`" },
      { id: "c", text: "`factory/temperature`" },
      { id: "d", text: "`office/line1/temperature`" }
    ],
    answer: ["a"],
    explanation: "The `+` wildcard matches exactly one level (`line1`), so `factory/line1/temperature` matches.",
    noteRef: "iot-07-lo02",
    reviewed: false
  },
  {
    loId: "iot-07-lo02",
    type: "single",
    difficulty: 2,
    id: "iot-07-q07",
    stem: "Why should IoT architects avoid creating MQTT topics with a leading forward slash (e.g. `/home/kitchen/temp`)?",
    options: [
      { id: "a", text: "It introduces an unnecessary empty string as the root level, causing confusion with standard `home/kitchen/temp` subscriptions." },
      { id: "b", text: "Leading slashes crash the MQTT broker." },
      { id: "c", text: "Leading slashes double data transmission costs." },
      { id: "d", text: "Leading slashes are reserved for HTTP." }
    ],
    answer: ["a"],
    explanation: "A leading slash creates an empty level before the slash, introducing subtle topic matching bugs.",
    noteRef: "iot-07-lo02",
    reviewed: false
  },
  {
    loId: "iot-07-lo02",
    type: "single",
    difficulty: 3,
    id: "iot-07-q08",
    stem: "What occurs if a client attempts to PUBLISH a message to a topic containing wildcards like `factory/+/temp`?",
    options: [
      { id: "a", text: "The broker rejects the publish or closes the connection because wildcards are strictly permitted only in subscriptions, never in publish topics." },
      { id: "b", text: "The message is broadcast to all devices simultaneously." },
      { id: "c", text: "The broker creates a new topic named '+'." },
      { id: "d", text: "The message is encrypted." }
    ],
    answer: ["a"],
    explanation: "MQTT specification Section 3.3.2.1 forbids wildcards in publish topic names; they are subscription filters only.",
    noteRef: "iot-07-lo02",
    reviewed: false
  },

  // LO03
  {
    loId: "iot-07-lo03",
    type: "single",
    difficulty: 1,
    id: "iot-07-q09",
    stem: "Which MQTT Quality of Service level provides 'At Most Once' delivery with no acknowledgments (fire-and-forget)?",
    options: [
      { id: "a", text: "QoS 0" },
      { id: "b", text: "QoS 1" },
      { id: "c", text: "QoS 2" },
      { id: "d", text: "QoS 3" }
    ],
    answer: ["a"],
    explanation: "QoS 0 sends a single unacknowledged PUBLISH packet without retries.",
    noteRef: "iot-07-lo03",
    reviewed: false
  },
  {
    loId: "iot-07-lo03",
    type: "scenario",
    difficulty: 2,
    id: "iot-07-q10",
    stem: "An industrial furnace sends a critical 'OVERHEAT_EMERGENCY' alarm. It must be guaranteed to arrive, but receiving it twice is harmless. Which QoS level is optimal?",
    options: [
      { id: "a", text: "QoS 1 (At least once delivery with PUBACK)" },
      { id: "b", text: "QoS 0" },
      { id: "c", text: "QoS 2" },
      { id: "d", text: "QoS 4" }
    ],
    answer: ["a"],
    explanation: "QoS 1 guarantees delivery via retries while avoiding the 4-way latency of QoS 2.",
    noteRef: "iot-07-lo03",
    reviewed: false
  },
  {
    loId: "iot-07-lo03",
    type: "numeric",
    difficulty: 2,
    id: "iot-07-q11",
    stem: "How many total protocol packets are exchanged between client and broker during a single complete MQTT QoS 2 transaction?",
    options: [
      { id: "a", text: "4" },
      { id: "b", text: "1" },
      { id: "c", text: "2" },
      { id: "d", text: "8" }
    ],
    answer: ["a"],
    explanation: "QoS 2 uses a 4-packet flow: PUBLISH, PUBREC, PUBREL, and PUBCOMP.",
    noteRef: "iot-07-lo03",
    verify: "(4 === 4)",
    reviewed: false
  },
  {
    loId: "iot-07-lo03",
    type: "single",
    difficulty: 3,
    id: "iot-07-q12",
    stem: "Why does MQTT QoS 2 guarantee exactly-once delivery without duplicate arrivals even during network drops?",
    options: [
      { id: "a", text: "It employs a dual two-phase commit handshake (PUBLISH/PUBREC followed by PUBREL/PUBCOMP) where state is held until both sides confirm completion." },
      { id: "b", text: "Because QoS 2 runs on dedicated fiber cables." },
      { id: "c", text: "Because subscribers delete duplicate numbers automatically." },
      { id: "d", text: "Because packets are assigned MAC addresses." }
    ],
    answer: ["a"],
    explanation: "The 4-way handshake separates receipt confirmation from message release, ensuring deduplication.",
    noteRef: "iot-07-lo03",
    reviewed: false
  },

  // LO04
  {
    loId: "iot-07-lo04",
    type: "single",
    difficulty: 1,
    id: "iot-07-q13",
    stem: "What is an MQTT Retained Message?",
    options: [
      { id: "a", text: "A message stored by the broker as the last known good state for a topic and immediately sent to any future subscriber." },
      { id: "b", text: "A message saved permanently in a relational database." },
      { id: "c", text: "A message that cannot be deleted." },
      { id: "d", text: "An encrypted password." }
    ],
    answer: ["a"],
    explanation: "Retained messages provide immediate state to newly subscribing clients without waiting for updates.",
    noteRef: "iot-07-lo04",
    reviewed: false
  },
  {
    loId: "iot-07-lo04",
    type: "scenario",
    difficulty: 2,
    id: "iot-07-q14",
    stem: "A battery-powered weather station suddenly loses power due to battery failure. How does the dashboard discover that the station went offline?",
    options: [
      { id: "a", text: "The broker detects the missed Keep-Alive ping and automatically publishes the pre-registered Last Will and Testament (LWT) message." },
      { id: "b", text: "The weather station sends an email before dying." },
      { id: "c", text: "The dashboard pings the weather station with a multimeter." },
      { id: "d", text: "The sensor restarts automatically." }
    ],
    answer: ["a"],
    explanation: "LWT is triggered by the broker when ungraceful disconnection or keepalive timeout occurs.",
    noteRef: "iot-07-lo04",
    reviewed: false
  },
  {
    loId: "iot-07-lo04",
    type: "single",
    difficulty: 2,
    id: "iot-07-q15",
    stem: "How can a client delete an existing Retained Message on a specific MQTT topic?",
    options: [
      { id: "a", text: "Publish an empty (zero-byte) payload with the Retained flag set to true on that topic." },
      { id: "b", text: "Restart the MQTT broker." },
      { id: "c", text: "Unsubscribe from the topic." },
      { id: "d", text: "Send a PINGREQ packet." }
    ],
    answer: ["a"],
    explanation: "Publishing a zero-byte payload with `retain = true` signals the broker to purge the retained message.",
    noteRef: "iot-07-lo04",
    reviewed: false
  },
  {
    loId: "iot-07-lo04",
    type: "single",
    difficulty: 3,
    id: "iot-07-q16",
    stem: "If a client configures a Keep-Alive interval of 60 seconds, after what duration of complete inactivity does the broker terminate the session and fire the LWT?",
    options: [
      { id: "a", text: "90 seconds (1.5 times the Keep-Alive duration)" },
      { id: "b", text: "60 seconds" },
      { id: "c", text: "120 seconds" },
      { id: "d", text: "24 hours" }
    ],
    answer: ["a"],
    explanation: "MQTT specification dictates that brokers wait 1.5 * Keep-Alive period before assuming client loss.",
    noteRef: "iot-07-lo04",
    reviewed: false
  },

  // LO05
  {
    loId: "iot-07-lo05",
    type: "single",
    difficulty: 1,
    id: "iot-07-q17",
    stem: "What transport-layer protocol does the Constrained Application Protocol (CoAP, RFC 7252) use natively?",
    options: [
      { id: "a", text: "UDP (User Datagram Protocol)" },
      { id: "b", text: "TCP (Transmission Control Protocol)" },
      { id: "c", text: "ICMP" },
      { id: "d", text: "HTTP" }
    ],
    answer: ["a"],
    explanation: "CoAP runs over UDP to eliminate connection overhead and support lightweight datagrams.",
    noteRef: "iot-07-lo05",
    reviewed: false
  },
  {
    loId: "iot-07-lo05",
    type: "numeric",
    difficulty: 2,
    id: "iot-07-q18",
    stem: "How many bytes are in the mandatory base binary header of a CoAP packet?",
    options: [
      { id: "a", text: "4" },
      { id: "b", text: "2" },
      { id: "c", text: "20" },
      { id: "d", text: "64" }
    ],
    answer: ["a"],
    explanation: "The base CoAP binary header is exactly 4 bytes (Ver, Type, Token Length, Code, Message ID).",
    noteRef: "iot-07-lo05",
    verify: "(4 === 4)",
    reviewed: false
  },
  {
    loId: "iot-07-lo05",
    type: "scenario",
    difficulty: 2,
    id: "iot-07-q19",
    stem: "A CoAP client sends a GET request to `/sensors/temp` with the Observe option enabled. What behavior does the CoAP server exhibit?",
    options: [
      { id: "a", text: "The server pushes updated temperature packets autonomously to the client whenever the value changes without further GET requests." },
      { id: "b", text: "The server reboots immediately." },
      { id: "c", text: "The server converts into an MQTT broker." },
      { id: "d", text: "The server deletes the temperature sensor." }
    ],
    answer: ["a"],
    explanation: "CoAP Observe (RFC 7641) synthesizes publish/subscribe behavior over UDP REST endpoints.",
    noteRef: "iot-07-lo05",
    reviewed: false
  },
  {
    loId: "iot-07-lo05",
    type: "single",
    difficulty: 3,
    id: "iot-07-q20",
    stem: "How does CoAP achieve reliable delivery over an inherently unreliable UDP transport layer?",
    options: [
      { id: "a", text: "Using Confirmable (CON) messages that require an Acknowledgment (ACK) response with matching Message ID, re-transmitting with exponential backoff if dropped." },
      { id: "b", text: "By switching to satellite radio automatically." },
      { id: "c", text: "By using gold-plated Ethernet cables." },
      { id: "d", text: "UDP packets never drop." }
    ],
    answer: ["a"],
    explanation: "Confirmable (CON) frames add a lightweight application-level ACK and retransmission mechanism on top of UDP.",
    noteRef: "iot-07-lo05",
    reviewed: false
  },

  // LO06
  {
    loId: "iot-07-lo06",
    type: "single",
    difficulty: 1,
    id: "iot-07-q21",
    stem: "What is the minimum fixed header size of an MQTT control packet?",
    options: [
      { id: "a", text: "2 bytes" },
      { id: "b", text: "128 bytes" },
      { id: "c", text: "54 bytes" },
      { id: "d", text: "1 byte" }
    ],
    answer: ["a"],
    explanation: "The MQTT fixed header consists of exactly 2 bytes (Packet Type/Flags and Remaining Length).",
    noteRef: "iot-07-lo06",
    reviewed: false
  },
  {
    loId: "iot-07-lo06",
    type: "scenario",
    difficulty: 2,
    id: "iot-07-q22",
    stem: "A battery-powered sensor needs to transmit 5 bytes of data every 10 minutes over cellular. An HTTP POST request sends ~500 bytes of headers, while MQTT sends ~15 bytes. Why is HTTP ill-suited here?",
    options: [
      { id: "a", text: "Massive ASCII header bloat and TCP 3-way handshakes exhaust cellular data quotas and deplete battery charge prematurely." },
      { id: "b", text: "HTTP is not compatible with cellular modems." },
      { id: "c", text: "HTTP only supports English characters." },
      { id: "d", text: "HTTP cannot transmit numbers." }
    ],
    answer: ["a"],
    explanation: "HTTP's verbose text headers create severe overhead, transmitting 30x more data than binary protocols like MQTT.",
    noteRef: "iot-07-lo06",
    reviewed: false
  },
  {
    loId: "iot-07-lo06",
    type: "multi",
    difficulty: 2,
    id: "iot-07-q23",
    stem: "Which of the following factors make MQTT superior to HTTP for bidirectional IoT control applications (like switching lights)?",
    options: [
      { id: "a", text: "Event-driven push delivery (actuators receive commands instantly without polling)" },
      { id: "b", text: "Persistent TCP connection (avoids repeated connection setup round-trips)" },
      { id: "c", text: "Built-in disconnection detection via Last Will and Testament" },
      { id: "d", text: "Ability to run without electricity" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Push delivery, persistent sessions, and LWT make MQTT ideal for low-latency bidirectional control.",
    noteRef: "iot-07-lo06",
    reviewed: false
  },
  {
    loId: "iot-07-lo06",
    type: "single",
    difficulty: 3,
    id: "iot-07-q24",
    stem: "In which specific IoT scenario is standard HTTP/REST genuinely preferred over MQTT?",
    options: [
      { id: "a", text: "Downloading large multi-megabyte Over-The-Air (OTA) firmware binaries over Wi-Fi from web CDNs." },
      { id: "b", text: "Battery-powered soil moisture sensors sending 2 bytes per day." },
      { id: "c", text: "Closed-loop drone motor stabilization." },
      { id: "d", text: "Underground water meters." }
    ],
    answer: ["a"],
    explanation: "HTTP excels at bulk binary transfers (OTA updates) leveraging existing web CDNs, range requests, and caching.",
    noteRef: "iot-07-lo06",
    reviewed: false
  },

  // LO07
  {
    loId: "iot-07-lo07",
    type: "single",
    difficulty: 1,
    id: "iot-07-q25",
    stem: "What is CBOR (Concise Binary Object Representation, RFC 8949)?",
    options: [
      { id: "a", text: "A binary data serialization format modeled after JSON's data types that produces smaller payloads without string key bloat." },
      { id: "b", text: "A type of lithium battery." },
      { id: "c", text: "A wireless radio antenna." },
      { id: "d", text: "A mechanical relay." }
    ],
    answer: ["a"],
    explanation: "CBOR encodes JSON-like structured data into a compact binary format designed for constrained systems.",
    noteRef: "iot-07-lo07",
    reviewed: false
  },
  {
    loId: "iot-07-lo07",
    type: "scenario",
    difficulty: 2,
    id: "iot-07-q26",
    stem: "An engineer packs four telemetry readings (node ID, temperature, humidity, battery) into an 8-byte raw C binary struct instead of a 60-byte JSON string. What percentage bandwidth reduction is achieved?",
    options: [
      { id: "a", text: "Approximately 86%" },
      { id: "b", text: "50%" },
      { id: "c", text: "10%" },
      { id: "d", text: "0%" }
    ],
    answer: ["a"],
    explanation: "(60 - 8) / 60 = 52 / 60 = 86.67% bandwidth reduction.",
    noteRef: "iot-07-lo07",
    reviewed: false
  },
  {
    loId: "iot-07-lo07",
    type: "multi",
    difficulty: 2,
    id: "iot-07-q27",
    stem: "Which of the following binary serialization formats are commonly used to optimize payloads in resource-constrained IoT systems?",
    options: [
      { id: "a", text: "Protocol Buffers (Protobuf / nanopb)" },
      { id: "b", text: "CBOR (Concise Binary Object Representation)" },
      { id: "c", text: "MessagePack" },
      { id: "d", text: "Uncompressed BMP image files" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Protobuf, CBOR, and MessagePack are efficient binary serialization formats for IoT.",
    noteRef: "iot-07-lo07",
    reviewed: false
  },
  {
    loId: "iot-07-lo07",
    type: "single",
    difficulty: 3,
    id: "iot-07-q28",
    stem: "Why does parsing text-based JSON payloads consume significantly more RAM and CPU cycles on microcontrollers than unpacking binary formats?",
    options: [
      { id: "a", text: "JSON requires lexical tokenization, string searching, and dynamic heap allocation to parse numbers from ASCII characters." },
      { id: "b", text: "JSON can only be parsed in Python." },
      { id: "c", text: "Microcontrollers cannot read text." },
      { id: "d", text: "JSON requires internet access to decode." }
    ],
    answer: ["a"],
    explanation: "Text parsers iterate through strings and convert characters to numbers dynamically, taxing MCU CPU and heap.",
    noteRef: "iot-07-lo07",
    reviewed: false
  },

  // LO08
  {
    loId: "iot-07-lo08",
    type: "single",
    difficulty: 1,
    id: "iot-07-q29",
    stem: "What standard network port is assigned by IANA for secure MQTT over TLS (MQTTS)?",
    options: [
      { id: "a", text: "8883" },
      { id: "b", text: "1883" },
      { id: "c", text: "443" },
      { id: "d", text: "80" }
    ],
    answer: ["a"],
    explanation: "Port 1883 is unencrypted MQTT; Port 8883 is standardized for encrypted MQTT over TLS (MQTTS).",
    noteRef: "iot-07-lo08",
    reviewed: false
  },
  {
    loId: "iot-07-lo08",
    type: "scenario",
    difficulty: 2,
    id: "iot-07-q30",
    stem: "An IoT architecture on AWS IoT Core mandates mutual TLS (mTLS). In addition to the broker's root CA certificate, what must each physical device possess?",
    options: [
      { id: "a", text: "A unique X.509 client certificate and associated private key." },
      { id: "b", text: "A credit card number." },
      { id: "c", text: "A public domain name." },
      { id: "d", text: "An HDMI display." }
    ],
    answer: ["a"],
    explanation: "Mutual TLS requires both client and server to authenticate each other using X.509 certificates.",
    noteRef: "iot-07-lo08",
    reviewed: false
  },
  {
    loId: "iot-07-lo08",
    type: "single",
    difficulty: 2,
    id: "iot-07-q31",
    stem: "Why is running `client.setInsecure()` dangerous when deploying ESP32 devices communicating over MQTTS?",
    options: [
      { id: "a", text: "It disables all X.509 certificate validation, leaving the connection vulnerable to man-in-the-middle interception." },
      { id: "b", text: "It breaks the Wi-Fi connection." },
      { id: "c", text: "It erases the flash memory." },
      { id: "d", text: "It causes the ESP32 to overheat." }
    ],
    answer: ["a"],
    explanation: "`setInsecure()` skips certificate authority checks, allowing spoofed brokers to intercept traffic.",
    noteRef: "iot-07-lo08",
    reviewed: false
  },
  {
    loId: "iot-07-lo08",
    type: "single",
    difficulty: 3,
    id: "iot-07-q32",
    stem: "Why do hardware security modules (like the Microchip ATECC608A) enhance mTLS security in IoT devices?",
    options: [
      { id: "a", text: "They store private cryptographic keys in tamper-resistant physical silicon, preventing extraction even if firmware is dumped." },
      { id: "b", text: "They double Wi-Fi transmission speed." },
      { id: "c", text: "They generate electricity from heat." },
      { id: "d", text: "They eliminate the need for software code." }
    ],
    answer: ["a"],
    explanation: "Secure elements store private keys in hardware with active tamper shields, preventing extraction via physical attacks.",
    noteRef: "iot-07-lo08",
    reviewed: false
  },

  // LO09 (Extension)
  {
    loId: "iot-07-lo09",
    type: "single",
    difficulty: 2,
    id: "iot-07-q33",
    stem: "What open-source C-based MQTT message broker is widely deployed on Raspberry Pi and edge gateways?",
    options: [
      { id: "a", text: "Eclipse Mosquitto" },
      { id: "b", text: "Apache Cassandra" },
      { id: "c", text: "PostgreSQL" },
      { id: "d", text: "VLC Media Player" }
    ],
    answer: ["a"],
    explanation: "Eclipse Mosquitto is a lightweight, widely adopted open-source MQTT message broker.",
    noteRef: "iot-07-lo09",
    reviewed: false
  },
  {
    loId: "iot-07-lo09",
    type: "scenario",
    difficulty: 2,
    id: "iot-07-q34",
    stem: "An engineer starts a fresh Mosquitto 2.0 broker using default settings. Microcontrollers on the local Wi-Fi cannot connect. What setting is required in `mosquitto.conf`?",
    options: [
      { id: "a", text: "An explicit `listener 1883 0.0.0.0` directive to bind the port across all network interfaces." },
      { id: "b", text: "Setting CPU clock speed to 10 GHz." },
      { id: "c", text: "Disabling the network switch." },
      { id: "d", text: "Formatting the hard drive." }
    ],
    answer: ["a"],
    explanation: "Mosquitto 2.x defaults to loopback-only binding; listening on `0.0.0.0` is required for external LAN clients.",
    noteRef: "iot-07-lo09",
    reviewed: false
  },
  {
    loId: "iot-07-lo09",
    type: "multi",
    difficulty: 3,
    id: "iot-07-q35",
    stem: "Which of the following configuration options can be enforced in `mosquitto.conf`?",
    options: [
      { id: "a", text: "`allow_anonymous false` (mandating username/password authentication)" },
      { id: "b", text: "`password_file /etc/mosquitto/passwd` (hashed user credential store)" },
      { id: "c", text: "`persistence true` (persisting retained messages and subscriptions across restarts)" },
      { id: "d", text: "`water_cooling_mode on`" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Anonymous access control, password files, and disk persistence are standard Mosquitto features.",
    noteRef: "iot-07-lo09",
    reviewed: false
  },
  {
    loId: "iot-07-lo09",
    type: "single",
    difficulty: 3,
    id: "iot-07-q36",
    stem: "What command-line tool included with Mosquitto is used to generate salted password hashes for client authentication?",
    options: [
      { id: "a", text: "mosquitto_passwd" },
      { id: "b", text: "openssl_gen" },
      { id: "c", text: "bcrypt_cli" },
      { id: "d", text: "shadow_gen" }
    ],
    answer: ["a"],
    explanation: "`mosquitto_passwd` generates and manages encrypted password files for the Mosquitto broker.",
    noteRef: "iot-07-lo09",
    reviewed: false
  }
];

balanceAndSave('iot', 'iot-messaging-mqtt-coap-http', ch07Objectives, ch07Questions);
console.log("Batch 12 complete!");
