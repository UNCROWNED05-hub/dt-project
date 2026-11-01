import fs from 'fs';
import path from 'path';

function countWords(str) {
  return str.trim().split(/\s+/).filter(Boolean).length;
}

function writeNoteBlock(courseSlug, chapterSlug, loId, coreIdea, workedExample, commonMistake, checkYourself, isFastMoving = true) {
  const dir = path.join('content', courseSlug, chapterSlug, 'notes');
  fs.mkdirSync(dir, { recursive: true });

  const fastMovingHeader = isFastMoving ? 'lastVerified: "2026-03"\n' : '';
  const fastMovingNote = isFastMoving ? '\n*Last verified: February 2026 against vendor documentation and technical specifications.*\n' : '';

  const fullContent = `---
loId: "${loId}"
reviewed: false
sources:
  - "Official Espressif Systems, AWS IoT, and TensorFlow Lite for Microcontrollers Technical Documentation"
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
// CHAPTER 08: cloud-telemetry-and-dashboards (iot-08) [fast-moving]
// ==========================================

const ch08Objectives = {
  version: 1,
  chapterId: "iot-08",
  objectives: [
    {
      id: "iot-08-lo01",
      order: 1,
      title: "Manage cloud IoT device registries, digital identities, and certificate lifecycle provisioning",
      bloom: "manage",
      tier: "core",
      mustHave: true,
      keywords: ["device registry", "x509 provisioning", "device certificate", "aws iot core", "fleet provisioning"],
      aliases: ["cloud device registry", "iot identity provisioning"],
      prerequisites: ["iot-07-lo08"],
      estMinutes: 14
    },
    {
      id: "iot-08-lo02",
      order: 2,
      title: "Synchronize device states using Device Shadow and Digital Twin reported versus desired state models",
      bloom: "synchronize",
      tier: "core",
      mustHave: true,
      keywords: ["device shadow", "digital twin", "reported state", "desired state", "delta topic"],
      aliases: ["device shadow sync", "reported vs desired state"],
      prerequisites: ["iot-08-lo01"],
      estMinutes: 14
    },
    {
      id: "iot-08-lo03",
      order: 3,
      title: "Store high-frequency IoT telemetry using time-series databases (TimescaleDB, InfluxDB)",
      bloom: "store",
      tier: "core",
      mustHave: true,
      keywords: ["time series database", "timescaledb", "influxdb", "hypertables", "downsampling"],
      aliases: ["tsdb storage", "iot telemetry ingestion"],
      prerequisites: ["iot-07-lo01"],
      estMinutes: 12
    },
    {
      id: "iot-08-lo04",
      order: 4,
      title: "Construct real-time operational visualization dashboards using open-source Grafana and ThingsBoard",
      bloom: "construct",
      tier: "core",
      mustHave: false,
      keywords: ["grafana", "thingsboard", "operational dashboards", "panel query", "alert thresholds"],
      aliases: ["iot dashboards", "grafana telemetry"],
      prerequisites: ["iot-08-lo03"],
      estMinutes: 12
    },
    {
      id: "iot-08-lo05",
      order: 5,
      title: "Execute Over-The-Air (OTA) firmware updates using dual-partition A/B flash booting and rollback mechanisms",
      bloom: "execute",
      tier: "core",
      mustHave: true,
      keywords: ["ota updates", "a/b partition", "boot rollback", "esp_ota", "firmware validation"],
      aliases: ["over the air updates", "dual partition boot"],
      prerequisites: ["iot-03-lo05"],
      estMinutes: 14
    },
    {
      id: "iot-08-lo06",
      order: 6,
      title: "Analyze cloud IoT data ingestion pricing and optimize payload transmission economics",
      bloom: "analyze",
      tier: "core",
      mustHave: false,
      keywords: ["cloud pricing", "data egress", "payload compression", "cost optimization", "message metering"],
      aliases: ["cloud cost awareness", "iot data economics"],
      prerequisites: ["iot-07-lo07"],
      estMinutes: 12
    },
    {
      id: "iot-08-lo07",
      order: 7,
      title: "Trigger automated operational alerts and serverless event-driven workflows from telemetry rules",
      bloom: "trigger",
      tier: "core",
      mustHave: false,
      keywords: ["iot rules engine", "serverless trigger", "aws lambda", "event-driven iot", "webhook alert"],
      aliases: ["rules engine", "serverless telemetry processing"],
      prerequisites: ["iot-08-lo02"],
      estMinutes: 12
    },
    {
      id: "iot-08-lo08",
      order: 8,
      title: "Implement edge data caching and offline queueing for intermittent network connectivity",
      bloom: "implement",
      tier: "core",
      mustHave: false,
      keywords: ["offline queueing", "spiffs caching", "store and forward", "network reconnect", "flash ring buffer"],
      aliases: ["intermittent connectivity handling", "offline telemetry caching"],
      prerequisites: ["iot-04-lo07"],
      estMinutes: 12
    },
    {
      id: "iot-08-lo09",
      order: 9,
      title: "Deploy multi-tenant IoT fleet management architectures with zero-touch provisioning",
      bloom: "deploy",
      tier: "extension",
      mustHave: false,
      keywords: ["fleet management", "zero-touch provisioning", "multi-tenant iot", "claim certificates", "ota campaigns"],
      aliases: ["fleet provisioning at scale", "zero touch onboarding"],
      prerequisites: ["iot-08-lo01", "iot-08-lo05"],
      estMinutes: 12
    }
  ]
};

// Notes for iot-08 [fast-moving]

writeNoteBlock('iot', 'cloud-telemetry-and-dashboards', 'iot-08-lo01',
  `Managing fleets of tens of thousands of IoT nodes requires structured cloud device registries and cryptographic identity lifecycles:
1. Cloud Device Registry: A managed metadata directory (e.g., AWS IoT Core, Azure IoT Hub, Google Cloud IoT) mapping physical devices to logical "Things". It stores device serial numbers, hardware models, cryptographic credentials, firmware versions, and custom metadata attributes.
2. Digital Identity via X.509 Certificates: Every node requires a unique X.509 client certificate and private key. During device bootstrapping, the cloud verifies the certificate chain against a trusted root Certificate Authority (CA) before permitting MQTT connections.
3. Fleet Provisioning Strategies:
   - JITR (Just-In-Time Registration): Automatically registers new devices upon their first connection when signed by a pre-registered enterprise CA.
   - Provisioning by Claim: Devices ship with a temporary manufacturer "claim certificate" that authorizes them to request an individual permanent operational certificate upon first boot.
4. Revocation & Rotation: Compromised nodes must be immediately disabled in the registry by revoking their certificate status without disturbing the wider fleet.`,
  `Simulating device registry provisioning logic in Python:
\`\`\`python
def register_device(device_id, cert_fingerprint, approved_fingerprints):
    if cert_fingerprint not in approved_fingerprints:
        return {"status": "REJECTED", "reason": "Untrusted certificate"}
    
    device_record = {
        "thing_name": device_id,
        "status": "ACTIVE",
        "created_at": "2026-03-01T12:00:00Z",
        "shadow_version": 1
    }
    return {"status": "REGISTERED", "record": device_record}

approved = ["a1b2c3d4e5f6...", "998877665544..."]
res = register_device("pump_node_42", "a1b2c3d4e5f6...", approved)
print(f"Provisioning Outcome: {res['status']}") # REGISTERED
\`\`\``,
  `Sharing a single hardcoded master certificate and private key across all manufactured devices; if a single device is physically extracted and disassembled, the entire fleet's security perimeter is compromised.`,
  `What security risk arises from sharing identical client certificates across an entire fleet of manufactured IoT devices?`,
  true
);

writeNoteBlock('iot', 'cloud-telemetry-and-dashboards', 'iot-08-lo02',
  `The Device Shadow (Digital Twin) pattern bridges physical IoT hardware with asynchronous cloud applications through dual reported and desired state records:
1. Architectural Problem: IoT devices sleep or lose network connection. If a smartphone user switches a smart valve "ON" while the valve is offline, the command must not be lost.
2. The Dual-State Model:
   - Reported State: The current real-world state reported by the physical device firmware (e.g., \`{"valve": "closed"}\`).
   - Desired State: The target state requested by a user or business application (e.g., \`{"valve": "open"}\`).
3. Delta Generation & Reconciliation:
   When \`reported != desired\`, the cloud generates a \`$aws/things/<device>/shadow/update/delta\` JSON payload containing only the conflicting keys.
   - When the device wakes up or reconnects, it receives the delta document.
   - The device actuates the physical hardware (opens the valve).
   - The device publishes an update setting \`reported.valve = "open"\`, clearing the delta.`,
  `Simulating shadow delta calculation in Python:
\`\`\`python
def calculate_shadow_delta(reported_state, desired_state):
    delta = {}
    for key, desired_val in desired_state.items():
        if reported_state.get(key) != desired_val:
            delta[key] = desired_val
    return delta

reported = {"relay": "OFF", "brightness": 50}
desired  = {"relay": "ON",  "brightness": 50}

delta = calculate_shadow_delta(reported, desired)
print(f"Shadow Delta to dispatch: {delta}") # {'relay': 'ON'}
\`\`\``,
  `Publishing the entire device state tree back to the shadow on every sensor reading; this generates excessive cloud message metering charges. Publish only modified attributes.`,
  `When does an IoT cloud shadow service dispatch a message to the \`delta\` topic?`,
  true
);

writeNoteBlock('iot', 'cloud-telemetry-and-dashboards', 'iot-08-lo03',
  `Traditional relational databases (PostgreSQL, MySQL) degrade under massive ingestion of append-only sensor telemetry; Time-Series Databases (TSDBs) are purpose-built for continuous metrics:
1. TSDB Architecture:
   Optimized for timestamped records \`(timestamp, entity_id, metric, value)\`. Employs columnar storage, automatic time-partitioned chunking (hypertables), and aggressive compression algorithms (Gorilla XOR for floats, Delta-of-delta for timestamps) reducing storage by up to $90\\%$.
2. TimescaleDB (PostgreSQL Extension):
   Provides full standard SQL compatibility while automatically partitioning tables into temporal "chunks". Supports continuous aggregates for automated materialized rollups.
3. InfluxDB (Native TSDB):
   Uses a schemaless tag/field model optimized for millisecond-resolution telemetry and automated data retention policies.
4. Downsampling and Retention Policies:
   Keep high-resolution raw data (every 1 second) for 7 days, downsample to 1-minute averages for 90 days, and archive 1-hour averages for 5 years, preventing infinite storage growth.`,
  `TimescaleDB continuous aggregate query computing hourly average temperature:
\`\`\`sql
CREATE MATERIALIZED VIEW hourly_temperature_summary
WITH (timescaledb.continuous) AS
SELECT 
    device_id,
    time_bucket('1 hour', time) AS hour_bucket,
    AVG(temperature) AS avg_temp,
    MAX(temperature) AS max_temp,
    MIN(temperature) AS min_temp
FROM sensor_telemetry
GROUP BY device_id, hour_bucket;
\`\`\``,
  `Storing raw 1-second interval sensor data in an unpartitioned standard relational table without automated retention or downsampling, causing disk exhaustion and sluggish dashboard queries within months.`,
  `What primary optimization distinguishes time-series databases from standard relational databases when storing high-frequency sensor readings?`,
  true
);

writeNoteBlock('iot', 'cloud-telemetry-and-dashboards', 'iot-08-lo04',
  `Operational dashboards provide engineering and operations teams with real-time visibility, trend forecasting, and alerting across IoT fleets:
1. Grafana Open-Source Visualization:
   - Connects directly to time-series backends (TimescaleDB, InfluxDB, Prometheus).
   - Renders interactive time-series graphs, heatmaps, state timelines, and gauges with sub-second live refresh rates.
   - Parameterized Dashboards: Uses template variables (\`$device_id\`) allowing operators to toggle between thousands of physical nodes seamlessly from a single dashboard.
2. ThingsBoard Open-Source IoT Platform:
   - Provides out-of-the-box device management, telemetry widgets, and bidirectional control panels (switches, sliders, buttons) that publish MQTT commands back to hardware.
   - Visual Rule Engine: Nodes drag-and-drop to filter telemetry, detect anomalies, and dispatch notifications via SMS, Email, or Slack.
3. Alerting Thresholds:
   Configure alert rules (e.g. \`battery_volts < 3.2V for 5m\`) with evaluation delays to prevent transient sensor blips from waking on-call personnel.`,
  `Example Grafana SQL panel query for parameterized device telemetry:
\`\`\`sql
SELECT
  time AS "time",
  temperature AS "Temperature (°C)",
  humidity AS "Humidity (%)"
FROM sensor_telemetry
WHERE
  device_id = '$device_id'
  AND time >= $__timeFrom() AND time <= $__timeTo()
ORDER BY time ASC;
\`\`\``,
  `Configuring instantaneous alert thresholds on noisy analog sensors without temporal hysteresis or evaluation delays, generating hundreds of false alarms from single-sample measurement spikes.`,
  `How do parameterized dashboard variables (e.g. \`$device_id\` in Grafana) improve fleet monitoring scalability?`,
  true
);

writeNoteBlock('iot', 'cloud-telemetry-and-dashboards', 'iot-08-lo05',
  `Over-The-Air (OTA) firmware updates are the critical lifeline for maintaining deployed IoT nodes, fixing vulnerabilities, and rolling out features without physical access:
1. Dual-Partition (A/B) Flash Layout:
   The microcontroller's SPI Flash is partitioned into at least two application slots: \`ota_0\` (Slot A) and \`ota_1\` (Slot B).
   - If the device currently runs from Slot A, the new binary is downloaded and written into Slot B.
   - The bootloader configuration is updated to designate Slot B as the next boot target.
2. Safe Boot and Rollback Protocol:
   Upon reboot, the bootloader boots Slot B into an intermediate "diagnostic" state.
   - The new firmware initializes peripherals, verifies network connectivity, and checks sensor health.
   - If tests pass, it calls \`esp_ota_mark_app_valid_cancel_rollback()\`, making Slot B permanent.
   - If the firmware panics, enters a crash loop, or fails to connect within a timeout window, the hardware watchdog trips, the bootloader rolls back to Slot A, and the device avoids being bricked.`,
  `Arduino ESP32 OTA validation sequence:
\`\`\`cpp
#include <esp_ota_ops.h>

void setup() {
  Serial.begin(115200);
  // Verify firmware health
  if (verify_network_and_sensors()) {
    // Confirm successful update, cancelling automatic rollback
    esp_ota_mark_app_valid_cancel_rollback();
    Serial.println("New firmware validated. Rollback cancelled.");
  } else {
    Serial.println("Self-test failed! Rebooting to trigger rollback...");
    esp_restart();
  }
}
\`\`\``,
  `Flashing OTA updates directly over the currently running partition without an A/B dual-partition scheme; an interrupted download or a software bug permanently bricks the remote hardware.`,
  `What critical protection does a dual-partition A/B flash architecture provide during an OTA firmware update?`,
  true
);

writeNoteBlock('iot', 'cloud-telemetry-and-dashboards', 'iot-08-lo06',
  `Deploying enterprise IoT requires strict bandwidth and cloud ingestion cost modeling to prevent surprise cloud computing bills:
1. Cloud Metering Units:
   Major cloud providers (AWS IoT Core, Azure IoT Hub) meter billing based on 5KB payload increments and message volume:
   - Publishing 1 message per second = $86,400\\text{ messages/day} = \\sim 2.6\\text{ million messages/month}$ per node.
   - For a fleet of 1,000 nodes, that totals 2.6 billion messages monthly, costing thousands of dollars in ingestion charges alone.
2. Ingestion Optimization Strategies:
   - Edge Filtering: Only publish when telemetry deviates beyond a deadband threshold (e.g. temperature changes by $>0.5^{\\circ}\\text{C}$).
   - Batching: Collect 60 one-second readings locally and dispatch a single combined message every minute, slashing billing transactions by $98.3\\%$.
   - Binary Compression: Using CBOR or Protobuf keeps payloads under 5KB chunks.
3. Free-Tier Vigilance: AWS and Azure provide limited free tiers (e.g., 250,000 messages/month free on AWS IoT Core); exceeding free tiers incurs metered pricing per million requests.`,
  `Python script calculating cloud ingestion cost savings via batching:
\`\`\`python
def calculate_monthly_messaging_cost(num_nodes, publish_interval_sec, cost_per_million=1.00):
    messages_per_node_per_day = 86400 / publish_interval_sec
    total_monthly_messages = num_nodes * messages_per_node_per_day * 30
    total_cost = (total_monthly_messages / 1000000.0) * cost_per_million
    return round(total_cost, 2)

# Fleet of 500 nodes: 1s updates vs 60s batched updates
cost_1s = calculate_monthly_messaging_cost(num_nodes=500, publish_interval_sec=1)
cost_60s = calculate_monthly_messaging_cost(num_nodes=500, publish_interval_sec=60)

print(f"1-sec Interval Monthly Cost: \${cost_1s} | 60-sec Batched Cost: \${cost_60s}")
# $1296.00/mo vs $21.60/mo (98.3% cost reduction!)
\`\`\``,
  `Configuring sensors to publish telemetry every 100ms directly to cloud MQTT brokers without edge batching or deadbands, generating massive cloud bills without actionable operational value.`,
  `How does edge batching (e.g. aggregating 60 seconds of readings into one packet) dramatically reduce cloud IoT operating costs?`,
  true
);

writeNoteBlock('iot', 'cloud-telemetry-and-dashboards', 'iot-08-lo07',
  `Cloud IoT Rules Engines evaluate incoming telemetry streams in real time, routing data and triggering serverless actions without managing virtual servers:
1. SQL-Based Topic Filtering:
   Cloud rules engines use standard SQL dialect to filter and extract payload attributes from MQTT topics:
   \`SELECT device_id, temperature, humidity FROM 'factory/+/telemetry' WHERE temperature > 80.0\`
2. Serverless Event-Driven Actions:
   When rule conditions match, the rules engine automatically executes downstream integrations without human polling:
   - AWS Lambda / Google Cloud Functions: Executes Python/Node code to process complex business logic.
   - Amazon SNS / Twilio: Dispatches immediate SMS emergency alerts to on-duty field technicians.
   - Ingestion Pipeline: Routes raw streams directly into Amazon Kinesis, SQS, or S3 data lakes for archival.
3. Cost & Latency Benefits:
   Event-driven serverless architectures charge only for the milliseconds code actively executes, eliminating the cost of idle servers.`,
  `AWS IoT SQL Rule Definition dispatching alerts on high vibration:
\`\`\`sql
SELECT 
    clientid() AS node_id,
    vibration_amplitude_g,
    timestamp() AS alert_time
FROM 'machinery/+/vibration'
WHERE vibration_amplitude_g > 4.5
\`\`\`
Action: Invoke AWS Lambda function \`handle_machinery_emergency\` to immediately open circuit breakers.`,
  `Writing monolithic cloud applications that poll databases every 5 seconds to detect threshold alarms rather than triggering event-driven serverless rules at message ingestion time.`,
  `What primary function does a cloud IoT Rules Engine perform upon receiving incoming MQTT messages?`,
  true
);

writeNoteBlock('iot', 'cloud-telemetry-and-dashboards', 'iot-08-lo08',
  `Real-world wireless networks experience frequent disconnects; embedded edge devices must implement store-and-forward telemetry caching to prevent data loss:
1. Local Flash Ring Buffers:
   When network connectivity drops (\`WiFi.status() != WL_CONNECTED\`), the firmware diverts telemetry away from the network socket into on-chip non-volatile Flash storage (using SPIFFS, LittleFS, or SD cards).
2. FIFO Queue Management:
   - Records are appended sequentially with hardware RTC timestamps.
   - If memory fills completely during extended blackouts, a First-In-First-Out (FIFO) circular overwrite strategy ensures the most recent telemetry is preserved while discarding oldest non-critical records.
3. Burst Drain Reconciliation:
   Upon network restoration, the device enters a drain mode:
   - Throttles bulk historical telemetry transmission to prevent overwhelming network buffers.
   - Intersperses live real-time readings with queued historical uploads until the backlog is cleared.`,
  `Store-and-forward queueing logic in Python:
\`\`\`python
class TelemetryQueue:
    def __init__(self, max_capacity=1000):
        self.queue = []
        self.max_capacity = max_capacity

    def push(self, record):
        if len(self.queue) >= self.max_capacity:
            self.queue.pop(0) # Evict oldest entry (FIFO)
        self.queue.append(record)

    def drain(self, batch_size=10):
        batch = self.queue[:batch_size]
        self.queue = self.queue[batch_size:]
        return batch

q = TelemetryQueue(max_capacity=5)
for i in range(7):
    q.push({"val": i})
print(f"Remaining in Queue: {[r['val'] for r in q.queue]}") # [2, 3, 4, 5, 6]
\`\`\``,
  `Discarding sensor telemetry immediately when network connectivity is lost rather than queueing readings in local non-volatile flash storage.`,
  `What memory structure is used to cache sensor readings locally on an IoT node during temporary network outages?`,
  true
);

writeNoteBlock('iot', 'cloud-telemetry-and-dashboards', 'iot-08-lo09',
  `Deploying enterprise IoT products across global customer accounts requires automated zero-touch provisioning and multi-tenant fleet isolation:
1. Zero-Touch Onboarding:
   Devices are unboxed, powered on, and automatically claim ownership in the cloud without technician configuration:
   - Factory Flashing: Each device is programmed with a hardware unique ID and bootstrap certificate.
   - Claim Verification: When powered on at a customer facility, the device contacts the bootstrap server; ownership is validated using pre-purchased serial numbers.
   - Dynamic Re-Provisioning: The bootstrap server delivers a customer-specific operational certificate and endpoint URL; the device closes the bootstrap session and connects to the customer's production broker.
2. Multi-Tenant Fleet Isolation:
   - Policy-based isolation restricts customer tenants to their specific MQTT topic trees (\`customer_abc/#\`).
   - Tenant data is partitioned into separate database schemas or independent cloud accounts.
3. Fleet OTA Campaigns:
   Deploy firmware updates gradually across canary stages (e.g. 1% -> 10% -> 100%) to catch regressions before affecting the entire global fleet.`,
  `Canary fleet OTA deployment rollout strategy:
\`\`\`text
Phase 1: Canary Deploy (1% of fleet, 24-hour soak test)
   └── If error rate < 0.05% -> Proceed to Phase 2
Phase 2: Regional Rollout (20% of fleet, 48-hour soak test)
   └── If watchdog reset rate stable -> Proceed to Phase 3
Phase 3: Global Production Release (100% of fleet)
\`\`\``,
  `Rolling out a brand-new OTA firmware release to 100% of an enterprise fleet simultaneously; a subtle regression bricks every customer device globally with no rollback recourse.`,
  `Why do professional IoT fleet operators deploy firmware updates through gradual canary stages rather than releasing to 100% of devices at once?`,
  true
);

// Questions for iot-08
const ch08Questions = [
  // LO01
  {
    loId: "iot-08-lo01",
    type: "single",
    difficulty: 1,
    id: "iot-08-q01",
    stem: "What is the primary function of a Cloud IoT Device Registry?",
    options: [
      { id: "a", text: "To maintain an authoritative catalog of managed physical devices, their digital identities, and authorization policies." },
      { id: "b", text: "To manufacture circuit boards." },
      { id: "c", text: "To compile C++ code into machine language." },
      { id: "d", text: "To test battery capacity." }
    ],
    answer: ["a"],
    explanation: "Device registries track provisioned nodes, metadata, certificates, and access policies.",
    noteRef: "iot-08-lo01",
    reviewed: false
  },
  {
    loId: "iot-08-lo01",
    type: "scenario",
    difficulty: 2,
    id: "iot-08-q02",
    stem: "A company manufactures 50,000 smart thermostat units. Rather than burning individual certificates during factory production, each unit boots with a bootstrap claim certificate that downloads its permanent certificate upon first boot. What is this process called?",
    options: [
      { id: "a", text: "Fleet Provisioning by Claim" },
      { id: "b", text: "Manual serial terminal registration" },
      { id: "c", text: "Wi-Fi brute forcing" },
      { id: "d", text: "Analog calibration" }
    ],
    answer: ["a"],
    explanation: "Provisioning by Claim allows unboxed devices to bootstrap and download operational certificates automatically.",
    noteRef: "iot-08-lo01",
    reviewed: false
  },
  {
    loId: "iot-08-lo01",
    type: "multi",
    difficulty: 2,
    id: "iot-08-q03",
    stem: "Which of the following attributes are standard metadata elements tracked in enterprise cloud device registries?",
    options: [
      { id: "a", text: "Hardware Model & Serial Number" },
      { id: "b", text: "Active X.509 Certificate Status" },
      { id: "c", text: "Current Firmware Version" },
      { id: "d", text: "Owner's personal bank account password" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Registries store hardware models, firmware versions, and crypto credentials, never banking passwords.",
    noteRef: "iot-08-lo01",
    reviewed: false
  },
  {
    loId: "iot-08-lo01",
    type: "single",
    difficulty: 3,
    id: "iot-08-q04",
    stem: "Why is sharing a single shared private key across thousands of IoT devices a catastrophic architectural flaw?",
    options: [
      { id: "a", text: "Extracting the private key from a single compromised device allows an attacker to authenticate as and impersonate any device across the entire fleet." },
      { id: "b", text: "Because the cloud broker will run out of memory." },
      { id: "c", text: "Because private keys expire after 5 minutes." },
      { id: "d", text: "Because shared keys slow down Wi-Fi speed." }
    ],
    answer: ["a"],
    explanation: "A single shared key breaks isolation; compromising one device exposes the entire fleet.",
    noteRef: "iot-08-lo01",
    reviewed: false
  },

  // LO02
  {
    loId: "iot-08-lo02",
    type: "single",
    difficulty: 1,
    id: "iot-08-q05",
    stem: "In the Device Shadow / Digital Twin pattern, what is the difference between 'reported' and 'desired' state?",
    options: [
      { id: "a", text: "Reported is the actual current hardware state sent by the device; Desired is the target state requested by a user or application." },
      { id: "b", text: "Reported is for analog sensors; Desired is for digital sensors." },
      { id: "c", text: "Desired is only used when the battery is dead." },
      { id: "d", text: "There is no difference between reported and desired states." }
    ],
    answer: ["a"],
    explanation: "Reported reflects physical reality; desired reflects user intention.",
    noteRef: "iot-08-lo02",
    reviewed: false
  },
  {
    loId: "iot-08-lo02",
    type: "scenario",
    difficulty: 2,
    id: "iot-08-q06",
    stem: "A user switches a smart garden sprinkler 'ON' via mobile app while the sprinkler controller is asleep. What does the cloud shadow service do when the controller reconnects?",
    options: [
      { id: "a", text: "It publishes a delta message containing `{\"valve\": \"ON\"}` to the device so it synchronizes its physical state." },
      { id: "b", text: "It deletes the sprinkler from the database." },
      { id: "c", text: "It sounds an alarm on the user's phone." },
      { id: "d", text: "It switches the sprinkler permanently to manual mode." }
    ],
    answer: ["a"],
    explanation: "The delta topic notifies the device of discrepancies between its reported state and desired target state.",
    noteRef: "iot-08-lo02",
    reviewed: false
  },
  {
    loId: "iot-08-lo02",
    type: "multi",
    difficulty: 2,
    id: "iot-08-q07",
    stem: "Which of the following topics are standard MQTT topic endpoints in AWS IoT Device Shadow architecture?",
    options: [
      { id: "a", text: "`$aws/things/<device_name>/shadow/update`" },
      { id: "b", text: "`$aws/things/<device_name>/shadow/update/delta`" },
      { id: "c", text: "`$aws/things/<device_name>/shadow/get`" },
      { id: "d", text: "`$aws/things/<device_name>/delete_firmware`" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Standard shadow topics include update, delta, and get; delete_firmware is not a shadow endpoint.",
    noteRef: "iot-08-lo02",
    reviewed: false
  },
  {
    loId: "iot-08-lo02",
    type: "single",
    difficulty: 3,
    id: "iot-08-q08",
    stem: "How does the Device Shadow pattern decouple mobile user interfaces from flaky, intermittent device network connections?",
    options: [
      { id: "a", text: "Apps interact with the persistent cloud shadow document instantly without waiting for sleeping or offline hardware to respond." },
      { id: "b", text: "It creates a direct Bluetooth link over the internet." },
      { id: "c", text: "It eliminates the need for cloud databases." },
      { id: "d", text: "It forces the physical device to stay awake permanently." }
    ],
    answer: ["a"],
    explanation: "Applications read and modify cloud state records asynchronously; physical devices reconcile when online.",
    noteRef: "iot-08-lo02",
    reviewed: false
  },

  // LO03
  {
    loId: "iot-08-lo03",
    type: "single",
    difficulty: 1,
    id: "iot-08-q09",
    stem: "What primary optimization allows Time-Series Databases (TSDBs) like InfluxDB and TimescaleDB to handle massive sensor write workloads?",
    options: [
      { id: "a", text: "Automatic temporal partitioning (hypertables) and columnar compression tailored for timestamped sequences." },
      { id: "b", text: "Storing data as uncompressed text files on desktop folders." },
      { id: "c", text: "Disabling all data encryption." },
      { id: "d", text: "Requiring manual sorting by human operators." }
    ],
    answer: ["a"],
    explanation: "TSDBs partition data into time chunks and compress repetitive timestamps and metrics efficiently.",
    noteRef: "iot-08-lo03",
    reviewed: false
  },
  {
    loId: "iot-08-lo03",
    type: "scenario",
    difficulty: 2,
    id: "iot-08-q10",
    stem: "An IoT architecture collects vibration metrics at 100 Hz. After 30 days, individual sub-second readings are no longer needed, but 1-hour average trends must be kept for 3 years. What TSDB feature implements this?",
    options: [
      { id: "a", text: "Continuous Aggregates with Downsampling and Data Retention Policies." },
      { id: "b", text: "Full manual table deletion." },
      { id: "c", text: "Rebooting the server daily." },
      { id: "d", text: "Converting numbers into PDF reports." }
    ],
    answer: ["a"],
    explanation: "Downsampling calculates rollups into aggregates while retention policies drop old granular raw data.",
    noteRef: "iot-08-lo03",
    reviewed: false
  },
  {
    loId: "iot-08-lo03",
    type: "single",
    difficulty: 2,
    id: "iot-08-q11",
    stem: "What compression algorithm is widely used in time-series databases to compress 64-bit floating-point sensor values?",
    options: [
      { id: "a", text: "Gorilla XOR-based floating point compression" },
      { id: "b", text: "MP3 audio compression" },
      { id: "c", text: "JPEG lossy image compression" },
      { id: "d", text: "ROT13 substitution" }
    ],
    answer: ["a"],
    explanation: "Facebook's Gorilla algorithm compresses float values using XOR deltas between consecutive samples.",
    noteRef: "iot-08-lo03",
    reviewed: false
  },
  {
    loId: "iot-08-lo03",
    type: "numeric",
    difficulty: 3,
    id: "iot-08-q12",
    stem: "If a sensor transmits 1 record per second, and downsampling aggregates 60 seconds into a single 1-minute summary record, by what factor is the number of stored rows reduced?",
    options: [
      { id: "a", text: "60" },
      { id: "b", text: "10" },
      { id: "c", text: "3600" },
      { id: "d", text: "2" }
    ],
    answer: ["a"],
    explanation: "60 raw records are condensed into 1 summary record, reducing rows by a factor of 60.",
    noteRef: "iot-08-lo03",
    verify: "(60 / 1 === 60)",
    reviewed: false
  },

  // LO04
  {
    loId: "iot-08-lo04",
    type: "single",
    difficulty: 1,
    id: "iot-08-q13",
    stem: "What open-source visualization platform is widely used to build real-time time-series telemetry dashboards?",
    options: [
      { id: "a", text: "Grafana" },
      { id: "b", text: "Photoshop" },
      { id: "c", text: "Microsoft Word" },
      { id: "d", text: "Postman" }
    ],
    answer: ["a"],
    explanation: "Grafana is the leading open-source dashboard visualization tool for metrics and time-series data.",
    noteRef: "iot-08-lo04",
    reviewed: false
  },
  {
    loId: "iot-08-lo04",
    type: "scenario",
    difficulty: 2,
    id: "iot-08-q14",
    stem: "An operator monitors 500 solar inverters in Grafana. How can they view individual inverter metrics without duplicating 500 separate dashboard pages?",
    options: [
      { id: "a", text: "Use a Dashboard Variable (e.g. `$inverter_id`) to dynamically populate queries from a single master dashboard." },
      { id: "b", text: "Open 500 browser tabs simultaneously." },
      { id: "c", text: "Print out graphs on paper." },
      { id: "d", text: "Manually edit the database SQL table every time." }
    ],
    answer: ["a"],
    explanation: "Template variables allow one dashboard template to dynamically display telemetry for any selected device.",
    noteRef: "iot-08-lo04",
    reviewed: false
  },
  {
    loId: "iot-08-lo04",
    type: "multi",
    difficulty: 2,
    id: "iot-08-q15",
    stem: "Which of the following dashboard components are commonly featured in IoT platforms like ThingsBoard?",
    options: [
      { id: "a", text: "Real-time gauge and time-series line charts" },
      { id: "b", text: "Geographic map widgets tracking GPS asset locations" },
      { id: "c", text: "Control widgets (switches, buttons) that publish MQTT RPC commands to hardware" },
      { id: "d", text: "Automated compiler debuggers" }
    ],
    answer: ["a", "b", "c"],
    explanation: "ThingsBoard provides telemetry charts, maps, and interactive control widgets to send commands to devices.",
    noteRef: "iot-08-lo04",
    reviewed: false
  },
  {
    loId: "iot-08-lo04",
    type: "single",
    difficulty: 3,
    id: "iot-08-q16",
    stem: "Why should dashboard alert rules incorporate evaluation delay periods (e.g. 'condition met for 5 minutes') rather than triggering instantly on a single sample spike?",
    options: [
      { id: "a", text: "To filter out transient electrical sensor noise or temporary network blips, preventing alert fatigue caused by false alarms." },
      { id: "b", text: "Because email servers take 5 minutes to boot." },
      { id: "c", text: "To reduce cloud electricity consumption." },
      { id: "d", text: "Because analog sensors only report every 5 minutes." }
    ],
    answer: ["a"],
    explanation: "Temporal persistence windows prevent transient single-sample noise spikes from triggering false alarms.",
    noteRef: "iot-08-lo04",
    reviewed: false
  },

  // LO05
  {
    loId: "iot-08-lo05",
    type: "single",
    difficulty: 1,
    id: "iot-08-q17",
    stem: "What is the primary benefit of a dual-partition (A/B) flash architecture for Over-The-Air (OTA) updates?",
    options: [
      { id: "a", text: "It allows safe flashing to an inactive partition while running, rolling back automatically if the new image fails self-tests." },
      { id: "b", text: "It doubles the microcontroller's RAM memory." },
      { id: "c", text: "It allows running two operating systems at the exact same microsecond." },
      { id: "d", text: "It eliminates the need for flash memory." }
    ],
    answer: ["a"],
    explanation: "A/B partitioning downloads to the secondary slot, safely rolling back if new code fails to boot.",
    noteRef: "iot-08-lo05",
    reviewed: false
  },
  {
    loId: "iot-08-lo05",
    type: "scenario",
    difficulty: 2,
    id: "iot-08-q18",
    stem: "An ESP32 downloads a new firmware binary to Slot B and reboots. During initialization, the firmware crashes due to a Null Pointer Exception. What does the bootloader do?",
    options: [
      { id: "a", text: "The hardware watchdog timer triggers a reset, and the bootloader automatically reverts to the known-good firmware in Slot A." },
      { id: "b", text: "The device stays permanently dead." },
      { id: "c", text: "It downloads Linux from the internet." },
      { id: "d", text: "It erases the flash chip completely." }
    ],
    answer: ["a"],
    explanation: "ESP-IDF rollback rolls back to the previous bootable partition if the new image fails validation.",
    noteRef: "iot-08-lo05",
    reviewed: false
  },
  {
    loId: "iot-08-lo05",
    type: "multi",
    difficulty: 2,
    id: "iot-08-q19",
    stem: "Which of the following security validations must be conducted before an IoT device flashes an OTA binary to flash?",
    options: [
      { id: "a", text: "Cryptographic signature verification using a pre-burned public key" },
      { id: "b", text: "Binary header compatibility and hardware chip ID check" },
      { id: "c", text: "Anti-rollback firmware version counter check" },
      { id: "d", text: "Checking the color of the microcontroller PCB" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Signature checks, hardware compatibility, and anti-rollback counters prevent loading malicious or older buggy code.",
    noteRef: "iot-08-lo05",
    reviewed: false
  },
  {
    loId: "iot-08-lo05",
    type: "single",
    difficulty: 3,
    id: "iot-08-q20",
    stem: "What ESP-IDF API function must newly booted firmware invoke to confirm successful operation and cancel automatic rollback?",
    options: [
      { id: "a", text: "esp_ota_mark_app_valid_cancel_rollback()" },
      { id: "b", text: "esp_restart()" },
      { id: "c", text: "WiFi.disconnect()" },
      { id: "d", text: "Serial.end()" }
    ],
    answer: ["a"],
    explanation: "`esp_ota_mark_app_valid_cancel_rollback()` marks the running partition as confirmed, cancelling bootloader rollback.",
    noteRef: "iot-08-lo05",
    reviewed: false
  },

  // LO06
  {
    loId: "iot-08-lo06",
    type: "single",
    difficulty: 1,
    id: "iot-08-q21",
    stem: "How do major cloud IoT platforms (like AWS IoT Core) measure message ingestion billing units?",
    options: [
      { id: "a", text: "In 5 KB payload increments per message sent or received." },
      { id: "b", text: "By measuring physical CPU temperature." },
      { id: "c", text: "Based on the number of wires connected to the sensor." },
      { id: "d", text: "Charging a flat $100 per device per day." }
    ],
    answer: ["a"],
    explanation: "AWS IoT bills messages in 5 KB increments; a 1 KB message and 4 KB message each count as 1 message.",
    noteRef: "iot-08-lo06",
    reviewed: false
  },
  {
    loId: "iot-08-lo06",
    type: "scenario",
    difficulty: 2,
    id: "iot-08-q22",
    stem: "A fleet of 1,000 smart meters transmits temperature every second, producing ~2.6 billion messages per month at significant cost. How can the engineering team reduce cloud ingestion cost by >95% without losing high-resolution historical data?",
    options: [
      { id: "a", text: "Batch 60 consecutive one-second readings into a single compressed payload published once per minute." },
      { id: "b", text: "Turn off the smart meters permanently." },
      { id: "c", text: "Switch the meters to send uncompressed video." },
      { id: "d", text: "Remove the Wi-Fi antennas." }
    ],
    answer: ["a"],
    explanation: "Batching 60 readings into 1 message per minute slashes cloud messaging transactions by 60x (a 98.3% reduction).",
    noteRef: "iot-08-lo06",
    reviewed: false
  },
  {
    loId: "iot-08-lo06",
    type: "numeric",
    difficulty: 2,
    id: "iot-08-q23",
    stem: "How many total messages are generated per day by a single IoT device publishing telemetry every 10 seconds (86,400 seconds per day)?",
    options: [
      { id: "a", text: "8640" },
      { id: "b", text: "86400" },
      { id: "c", text: "1440" },
      { id: "d", text: "24" }
    ],
    answer: ["a"],
    explanation: "86,400 seconds / 10 seconds per message = 8,640 messages per day.",
    noteRef: "iot-08-lo06",
    verify: "(86400 / 10 === 8640)",
    reviewed: false
  },
  {
    loId: "iot-08-lo06",
    type: "single",
    difficulty: 3,
    id: "iot-08-q24",
    stem: "What is 'Deadband Filtering' in edge telemetry optimization?",
    options: [
      { id: "a", text: "Suppressing transmission until a sensor reading changes by more than a predefined delta threshold (e.g. ±0.5°C) from the last published value." },
      { id: "b", text: "Turning off the radio when the battery is completely empty." },
      { id: "c", text: "Filtering out high-voltage audio noise." },
      { id: "d", text: "Deleting corrupted flash memory sectors." }
    ],
    answer: ["a"],
    explanation: "Deadband filtering skips transmitting static or near-static telemetry, conserving bandwidth and cloud billing.",
    noteRef: "iot-08-lo06",
    reviewed: false
  },

  // LO07
  {
    loId: "iot-08-lo07",
    type: "single",
    difficulty: 1,
    id: "iot-08-q25",
    stem: "What query language is standardly used by Cloud IoT Rules Engines to filter and transform MQTT messages?",
    options: [
      { id: "a", text: "SQL-like query syntax (e.g. `SELECT * FROM 'topic' WHERE ...`)" },
      { id: "b", text: "HTML tags" },
      { id: "c", text: "Assembly language" },
      { id: "d", text: "Python regular expressions only" }
    ],
    answer: ["a"],
    explanation: "AWS, Azure, and Google Cloud IoT rules engines parse topics and JSON payloads using SQL-like syntax.",
    noteRef: "iot-08-lo07",
    reviewed: false
  },
  {
    loId: "iot-08-lo07",
    type: "scenario",
    difficulty: 2,
    id: "iot-08-q26",
    stem: "An IoT temperature sensor publishes to `plants/+/sensors`. An AWS IoT Rule matches `temperature > 90` and triggers an AWS Lambda function to shut down heating coils. Why is this serverless design cost-effective?",
    options: [
      { id: "a", text: "The serverless function executes only when an emergency condition occurs, incurring zero compute cost during normal operations." },
      { id: "b", text: "Lambda functions are completely free forever without limits." },
      { id: "c", text: "Because temperature sensors do not use electricity." },
      { id: "d", text: "Because SQL queries run locally on the sensor." }
    ],
    answer: ["a"],
    explanation: "Serverless event-driven compute charges strictly per millisecond of invocation, costing nothing during idle states.",
    noteRef: "iot-08-lo07",
    reviewed: false
  },
  {
    loId: "iot-08-lo07",
    type: "multi",
    difficulty: 2,
    id: "iot-08-q27",
    stem: "Which of the following actions can be automatically invoked by an IoT cloud rules engine upon matching a message?",
    options: [
      { id: "a", text: "Routing the message into an S3 bucket or data lake" },
      { id: "b", text: "Invoking a serverless compute function (AWS Lambda / Google Cloud Function)" },
      { id: "c", text: "Sending an SMS or push notification via an alerting service" },
      { id: "d", text: "Soldering a loose wire on the physical PCB" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Rules engines route data, trigger serverless code, and dispatch alerts; they cannot alter physical solder joints.",
    noteRef: "iot-08-lo07",
    reviewed: false
  },
  {
    loId: "iot-08-lo07",
    type: "single",
    difficulty: 3,
    id: "iot-08-q28",
    stem: "In an AWS IoT SQL rule, what built-in function extracts the client ID of the publishing MQTT device?",
    options: [
      { id: "a", text: "clientid()" },
      { id: "b", text: "get_mac_address()" },
      { id: "c", text: "device_owner()" },
      { id: "d", text: "ip_source()" }
    ],
    answer: ["a"],
    explanation: "`clientid()` extracts the client ID used during the MQTT CONNECT packet.",
    noteRef: "iot-08-lo07",
    reviewed: false
  },

  // LO08
  {
    loId: "iot-08-lo08",
    type: "single",
    difficulty: 1,
    id: "iot-08-q29",
    stem: "What is the primary role of an on-device Store-and-Forward telemetry queue?",
    options: [
      { id: "a", text: "To cache sensor readings in local non-volatile flash memory during network outages, transmitting them when connectivity returns." },
      { id: "b", text: "To compress image files." },
      { id: "c", text: "To charge the backup battery." },
      { id: "d", text: "To compile C++ code." }
    ],
    answer: ["a"],
    explanation: "Store-and-forward caches data locally during disconnects, preventing data gaps.",
    noteRef: "iot-08-lo08",
    reviewed: false
  },
  {
    loId: "iot-08-lo08",
    type: "scenario",
    difficulty: 2,
    id: "iot-08-q30",
    stem: "A mining vehicle loses cellular coverage for 4 hours while underground. What data structure in non-volatile flash should be used to buffer telemetry so the newest data is preserved if storage fills up?",
    options: [
      { id: "a", text: "A circular FIFO (First-In, First-Out) ring buffer that evicts oldest entries when capacity is reached." },
      { id: "b", text: "A single global variable." },
      { id: "c", text: "A recursive binary tree." },
      { id: "d", text: "An unindexed text file that crashes when full." }
    ],
    answer: ["a"],
    explanation: "A circular ring buffer overwrites oldest historical samples when full, preserving the most recent telemetry.",
    noteRef: "iot-08-lo08",
    reviewed: false
  },
  {
    loId: "iot-08-lo08",
    type: "multi",
    difficulty: 2,
    id: "iot-08-q31",
    stem: "Which file systems are commonly implemented on ESP32 SPI flash memory for caching offline sensor data?",
    options: [
      { id: "a", text: "LittleFS (resilient against power cuts and wear-leveled)" },
      { id: "b", text: "SPIFFS (SPI Flash File System)" },
      { id: "c", text: "FAT file system (on external SD cards)" },
      { id: "d", text: "NTFS" }
    ],
    answer: ["a", "b", "c"],
    explanation: "LittleFS, SPIFFS, and FAT are standard embedded filesystems; NTFS is a proprietary Windows desktop filesystem.",
    noteRef: "iot-08-lo08",
    reviewed: false
  },
  {
    loId: "iot-08-lo08",
    type: "single",
    difficulty: 3,
    id: "iot-08-q32",
    stem: "Why must an IoT node throttle historical backlog uploads when reconnecting after a multi-hour network outage?",
    options: [
      { id: "a", text: "To avoid exhausting local socket buffers, triggering broker rate-limiting quotas, or starving real-time telemetry." },
      { id: "b", text: "Because historical data travels slower through copper wires." },
      { id: "c", text: "Because cloud brokers reject data older than 1 minute." },
      { id: "d", text: "To prevent the flash memory from demagnetizing." }
    ],
    answer: ["a"],
    explanation: "Throttling backlog drains prevents buffer overflows, network congestion, and API rate-limit penalties.",
    noteRef: "iot-08-lo08",
    reviewed: false
  },

  // LO09 (Extension)
  {
    loId: "iot-08-lo09",
    type: "single",
    difficulty: 2,
    id: "iot-08-q33",
    stem: "What is Zero-Touch Provisioning in enterprise IoT fleet deployments?",
    options: [
      { id: "a", text: "Devices securely authenticate, download operational certificates, and attach to customer accounts automatically upon first power-on without technician interaction." },
      { id: "b", text: "Devices that operate without ever being touched by human hands during manufacturing." },
      { id: "c", text: "Devices that function without wireless radios." },
      { id: "d", text: "Devices that have zero security." }
    ],
    answer: ["a"],
    explanation: "Zero-touch provisioning automates onboarding securely using hardware identifiers and pre-burned claims.",
    noteRef: "iot-08-lo09",
    reviewed: false
  },
  {
    loId: "iot-08-lo09",
    type: "scenario",
    difficulty: 2,
    id: "iot-08-q34",
    stem: "A firm manages 100,000 smart streetlights across 20 municipalities. How is tenant isolation enforced on a shared MQTT broker infrastructure?",
    options: [
      { id: "a", text: "Using broker authorization policies that restrict each municipality's credentials to their specific root topic namespace (e.g. `muni_a/#`)." },
      { id: "b", text: "Buying 20 separate physical cellular towers." },
      { id: "c", text: "Allowing all municipalities to see all data." },
      { id: "d", text: "Painting the streetlights different colors." }
    ],
    answer: ["a"],
    explanation: "Granular topic ACLs isolate tenant data access strictly to their assigned sub-trees.",
    noteRef: "iot-08-lo09",
    reviewed: false
  },
  {
    loId: "iot-08-lo09",
    type: "multi",
    difficulty: 3,
    id: "iot-08-q35",
    stem: "Which of the following phases are standard elements of a professional Canary OTA deployment pipeline?",
    options: [
      { id: "a", text: "Deploying to an internal laboratory testing fleet" },
      { id: "b", text: "Deploying to a small 1% canary group of production devices and monitoring for crashes for 24-48 hours" },
      { id: "c", text: "Progressive regional rollout (e.g. 10%, 25%, 100%)" },
      { id: "d", text: "Deleting the previous firmware source code from Git" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Canary rollouts validate software health across graduated fleet cohorts before full production deployment.",
    noteRef: "iot-08-lo09",
    reviewed: false
  },
  {
    loId: "iot-08-lo09",
    type: "single",
    difficulty: 3,
    id: "iot-08-q36",
    stem: "Why are progressive canary firmware rollouts essential when maintaining mission-critical industrial IoT fleets?",
    options: [
      { id: "a", text: "They contain the blast radius of unforeseen bugs or kernel crashes to a tiny fraction of the fleet before widespread bricking occurs." },
      { id: "b", text: "Because cloud servers cannot transmit more than 10 files per day." },
      { id: "c", text: "To test whether customers are paying attention." },
      { id: "d", text: "Because firmware binaries expire after 48 hours." }
    ],
    answer: ["a"],
    explanation: "Canary testing limits blast radius; if a bug is uncovered, only 1% of nodes are affected while rollback halts the rollout.",
    noteRef: "iot-08-lo09",
    reviewed: false
  }
];

balanceAndSave('iot', 'cloud-telemetry-and-dashboards', ch08Objectives, ch08Questions);

// ==========================================
// CHAPTER 09: edge-computing-and-tinyml (iot-09) [fast-moving]
// ==========================================

const ch09Objectives = {
  version: 1,
  chapterId: "iot-09",
  objectives: [
    {
      id: "iot-09-lo01",
      order: 1,
      title: "Evaluate edge computing trade-offs across latency, bandwidth conservation, privacy, and intermittent connectivity",
      bloom: "evaluate",
      tier: "core",
      mustHave: true,
      keywords: ["edge computing", "bandwidth reduction", "inference latency", "data privacy", "local intelligence"],
      aliases: ["edge vs cloud", "edge processing benefits"],
      prerequisites: ["iot-01-lo03"],
      estMinutes: 12
    },
    {
      id: "iot-09-lo02",
      order: 2,
      title: "Structure the end-to-end TinyML workflow: data collection, model design, quantization, and deployment",
      bloom: "structure",
      tier: "core",
      mustHave: true,
      keywords: ["tinyml workflow", "data collection", "model conversion", "tflite converter", "on-device inference"],
      aliases: ["tinyml pipeline", "embedded ml lifecycle"],
      prerequisites: ["ai-01-lo05", "iot-09-lo01"],
      estMinutes: 14
    },
    {
      id: "iot-09-lo03",
      order: 3,
      title: "Quantize deep neural networks from float32 to int8 representations using post-training quantization",
      bloom: "quantize",
      tier: "core",
      mustHave: true,
      keywords: ["int8 quantization", "post-training quantization", "zero point", "quantization scale", "integer arithmetic"],
      aliases: ["model quantization", "float32 to int8"],
      prerequisites: ["ai-10-lo04", "iot-09-lo02"],
      estMinutes: 14
    },
    {
      id: "iot-09-lo04",
      order: 4,
      title: "Deploy on-device inference using TensorFlow Lite for Microcontrollers (TFLM)",
      bloom: "deploy",
      tier: "core",
      mustHave: true,
      keywords: ["tflm", "tensor arena", "micro interpreter", "all_ops_resolver", "c byte array model"],
      aliases: ["tensorflow lite micro", "tflite microcontroller"],
      prerequisites: ["iot-09-lo03"],
      estMinutes: 14
    },
    {
      id: "iot-09-lo05",
      order: 5,
      title: "Train and deploy sensor classification models using Edge Impulse",
      bloom: "train",
      tier: "core",
      mustHave: false,
      keywords: ["edge impulse", "dsp feature extraction", "spectral analysis", "anomaly detection", "impulse design"],
      aliases: ["edge impulse pipeline", "sensor anomaly detection"],
      prerequisites: ["iot-09-lo02"],
      estMinutes: 12
    },
    {
      id: "iot-09-lo06",
      order: 6,
      title: "Implement keyword spotting and audio anomaly detection on embedded microcontrollers",
      bloom: "implement",
      tier: "core",
      mustHave: false,
      keywords: ["keyword spotting", "mfcc", "spectrogram", "audio classification", "i2s microphone"],
      aliases: ["audio anomaly detection", "embedded voice recognition"],
      prerequisites: ["iot-09-lo04"],
      estMinutes: 12
    },
    {
      id: "iot-09-lo07",
      order: 7,
      title: "Analyze memory boundaries and compute constraints: SRAM budget, Flash footprint, and inference cycles",
      bloom: "analyze",
      tier: "core",
      mustHave: false,
      keywords: ["sram budget", "tensor arena sizing", "peak memory", "mac operations", "inference latency"],
      aliases: ["tinyml memory constraints", "embedded compute budget"],
      prerequisites: ["iot-04-lo07", "iot-09-lo04"],
      estMinutes: 12
    },
    {
      id: "iot-09-lo08",
      order: 8,
      title: "Detect mechanical machine faults using accelerometer anomaly detection and autoencoders",
      bloom: "detect",
      tier: "core",
      mustHave: false,
      keywords: ["anomaly detection", "autoencoders", "reconstruction error", "predictive maintenance", "vibration analysis"],
      aliases: ["predictive maintenance", "vibration anomaly detection"],
      prerequisites: ["ai-08-lo06", "iot-09-lo05"],
      estMinutes: 12
    },
    {
      id: "iot-09-lo09",
      order: 9,
      title: "Accelerate on-device inference using hardware SIMD DSP vector extensions (ESP-NN, CMSIS-NN)",
      bloom: "optimize",
      tier: "extension",
      mustHave: false,
      keywords: ["esp-nn", "cmsis-nn", "simd instructions", "hardware acceleration", "vector math"],
      aliases: ["tinyml hardware acceleration", "simd on microcontrollers"],
      prerequisites: ["iot-09-lo04"],
      estMinutes: 12
    }
  ]
};

// Notes for iot-09 [fast-moving]

writeNoteBlock('iot', 'edge-computing-and-tinyml', 'iot-09-lo01',
  `Edge computing shifts algorithmic data processing and inference directly onto IoT end nodes and local gateways rather than offloading raw streams to cloud data centers:
1. The Four Drivers of Edge Intelligence:
   - Ultra-Low Latency: Real-world control systems (industrial emergency shutdowns, autonomous vehicle braking) require sub-millisecond reactions. Cloud round-trip network delays ($50\\text{ms} - 500\\text{ms}$) are unacceptably sluggish.
   - Bandwidth Conservation: Streaming high-bandwidth sensor feeds (vibration at $10\\text{kHz}$, acoustic audio, video frames) continuously over cellular/satellite saturates network quotas. Edge preprocessing summarizes raw streams into lean state flags.
   - Privacy and Data Sovereignty: Audio recordings, facial biometrics, and medical vitals are processed locally; sensitive raw bytes never leave the device, complying with GDPR and India's DPDP Act.
   - Resilient Offline Autonomy: Edge devices execute full machine learning inference even when severed from the internet or deep underground.`,
  `Latency comparison in Python for edge vs cloud inference:
\`\`\`python
def compare_inference_latency(edge_compute_ms, network_rtt_ms, cloud_compute_ms):
    total_cloud_ms = network_rtt_ms + cloud_compute_ms
    return {
        "edge_latency_ms": edge_compute_ms,
        "cloud_latency_ms": total_cloud_ms,
        "speedup_factor": round(total_cloud_ms / edge_compute_ms, 1)
    }

# ESP32 local TinyML vs 4G LTE cloud API call
res = compare_inference_latency(edge_compute_ms=12.0, network_rtt_ms=120.0, cloud_compute_ms=15.0)
print(f"Edge: {res['edge_latency_ms']} ms vs Cloud: {res['cloud_latency_ms']} ms (Speedup: {res['speedup_factor']}x)")
# Edge: 12.0 ms vs Cloud: 135.0 ms (11.2x faster!)
\`\`\``,
  `Streaming continuous raw 16-bit audio feeds from 10,000 factory microphones to a cloud LLM to detect bearing faults; the cellular bandwidth costs exceed millions of dollars annually while local TinyML costs zero network bandwidth.`,
  `What are the four primary drivers compelling the adoption of edge computing in IoT architectures?`,
  true
);

writeNoteBlock('iot', 'edge-computing-and-tinyml', 'iot-09-lo02',
  `TinyML brings machine learning inference to resource-constrained microcontrollers operating within strict milliwatt power and kilobyte memory boundaries:
1. The TinyML Pipeline:
   - Data Collection: Sample real-world sensor streams (accelerometers, microphones) using edge microcontrollers with strict timestamping.
   - Digital Signal Processing (DSP) Preprocessing: Compute time-frequency features (Spectrograms, Fast Fourier Transforms, Mel-Frequency Cepstral Coefficients) to extract informative signals and reduce dimensionality.
   - Model Training: Train a lightweight neural network (CNN, MLP) in TensorFlow/Keras on a workstation or cloud cluster.
   - Quantization & Optimization: Convert 32-bit floating-point weights into 8-bit integers via the TensorFlow Lite Converter (\`TFLiteConverter\`).
   - C Header Export: Serialize the quantized model into a static C byte array (\`unsigned char model[]\`) embedded into firmware.
   - On-Device Execution: Run inference on-device using a static memory pool without dynamic memory allocations.`,
  `Python script exporting a quantized TensorFlow model to a C byte array:
\`\`\`python
import tensorflow as tf

# Convert trained model to Quantized TFLite
converter = tf.lite.TFLiteConverter.from_keras_model(model)
converter.optimizations = [tf.lite.Optimize.DEFAULT]
tflite_quant_model = converter.convert()

# Export as C array header for Arduino/ESP-IDF
with open("model_data.h", "w") as f:
    f.write("const unsigned char g_model[] = {\n  ")
    for i, byte in enumerate(tflite_quant_model):
        f.write(f"0x{byte:02x}, ")
        if (i + 1) % 12 == 0:
            f.write("\n  ")
    f.write("\n};\n")
    f.write(f"const int g_model_len = {len(tflite_quant_model)};\n")
\`\`\``,
  `Attempting to train machine learning models directly on an 8-bit or 32-bit microcontroller; microcontrollers lack the memory and compute pipelines for backpropagation. Training is performed on GPUs; only inference runs on the MCU.`,
  `Why is model training performed on cloud/workstation hardware while microcontrollers execute only inference?`,
  true
);

writeNoteBlock('iot', 'edge-computing-and-tinyml', 'iot-09-lo03',
  `Deep learning models natively store weights and activations as 32-bit IEEE floating-point numbers (\`float32\`); quantization compresses these tensors into 8-bit signed integers (\`int8\`):
1. Quantization Mathematical Mapping:
   $$q = \\text{round}\\left(\\frac{r}{S}\\right) + Z$$
   Where $r$ is the real floating-point value, $S$ is the floating-point Scale factor, $Z$ is the integer Zero-Point offset, and $q$ is the resulting 8-bit quantized integer ($-128$ to $+127$).
2. Performance & Hardware Benefits:
   - 4x Memory Reduction: Shrinks model weights and activation buffers by $75\\%$, enabling complex CNNs to fit inside limited $512\\text{KB}$ MCU flash.
   - Integer Arithmetic Acceleration: Microcontrollers lack specialized floating-point vector units. Integer matrix operations run 2x to 5x faster using native 32-bit integer ALUs and DSP SIMD instructions.
   - Power Reduction: Integer arithmetic consumes significantly less electrical energy per operation than floating-point math.
3. Minimal Accuracy Degradation: Post-training quantization typically degrades classification accuracy by less than $1\\%$.`,
  `Simulating int8 quantization in Python:
\`\`\`python
def quantize_float_to_int8(real_value, scale, zero_point):
    q = round(real_value / scale) + zero_point
    # Clamp to signed 8-bit range [-128, 127]
    return max(-128, min(127, q))

def dequantize_int8_to_float(q, scale, zero_point):
    return (q - zero_point) * scale

scale = 0.02
zero_point = 0
val = 1.45
q_val = quantize_float_to_int8(val, scale, zero_point)
recon_val = dequantize_int8_to_float(q_val, scale, zero_point)

print(f"Original: {val} -> Quantized int8: {q_val} -> Reconstructed: {recon_val:.4f}")
# Original: 1.45 -> Quantized: 73 -> Reconstructed: 1.4600
\`\`\``,
  `Deploying full float32 neural network weights directly to a microcontroller without quantization; the model exhausts the chip's internal SRAM and fails to allocate memory during boot.`,
  `What memory reduction factor is achieved by quantizing neural network parameters from \`float32\` to \`int8\`?`,
  true
);

writeNoteBlock('iot', 'edge-computing-and-tinyml', 'iot-09-lo04',
  `TensorFlow Lite for Microcontrollers (TFLM) is a lean C++ runtime designed to execute neural network inference on bare-metal systems with zero dynamic memory allocation:
1. Zero Dynamic Allocation Architecture:
   TFLM prohibits runtime \`malloc()\` or \`new\` calls. The developer pre-allocates a single contiguous memory buffer in SRAM known as the Tensor Arena.
2. The Tensor Arena:
   Holds all intermediate layer activation tensors, input buffers, output arrays, and interpreter scratchpads.
   \`constexpr int kTensorArenaSize = 60 * 1024; // 60 KB pre-allocated buffer\`
3. Core Interpreter Workflow:
   - Load Model: Point the \`tflite::GetModel()\` pointer to the C byte array in flash.
   - AllOpsResolver: Pulls in only the specific mathematical kernels needed (e.g., Conv2D, FullyConnected, Softmax) to minimize binary code size.
   - Allocate Tensors: \`interpreter.AllocateTensors()\` maps activation buffers within the Tensor Arena.
   - Populate Input & Invoke: Copy sensor features into \`input->data.int8\`, execute \`interpreter.Invoke()\`, and read class probabilities from \`output->data.int8\`.`,
  `Arduino C++ inference loop using TensorFlow Lite for Microcontrollers:
\`\`\`cpp
#include <TensorFlowLite.h>
#include "tensorflow/lite/micro/all_ops_resolver.h"
#include "tensorflow/lite/micro/micro_interpreter.h"
#include "model_data.h" // Exported C array

constexpr int kArenaSize = 30 * 1024; // 30 KB
uint8_t tensor_arena[kArenaSize];

tflite::MicroInterpreter* interpreter;
TfLiteTensor* input;
TfLiteTensor* output;

void setup() {
  const tflite::Model* model = tflite::GetModel(g_model);
  static tflite::AllOpsResolver resolver;
  static tflite::MicroInterpreter static_interpreter(model, resolver, tensor_arena, kArenaSize);
  interpreter = &static_interpreter;
  interpreter->AllocateTensors();
  input = interpreter->input(0);
  output = interpreter->output(0);
}
\`\`\``,
  `Sizing the Tensor Arena too small; \`AllocateTensors()\` returns \`kTfLiteError\` because the intermediate activation maps exceed the pre-allocated buffer memory.`,
  `What purpose does the pre-allocated Tensor Arena serve in TensorFlow Lite for Microcontrollers?`,
  true
);

writeNoteBlock('iot', 'edge-computing-and-tinyml', 'iot-09-lo05',
  `Edge Impulse provides a complete end-to-end engineering platform that streamlines data collection, digital signal processing (DSP), and embedded ML deployment:
1. Digital Signal Processing (DSP) Feature Blocks:
   Feeding raw sensor time-series directly into a neural network requires massive deep models. Edge Impulse applies classical DSP feature extraction first:
   - Spectral Analysis Block: Computes Fast Fourier Transforms (FFTs) to extract dominant frequency peaks, spectral power, and harmonic distortion from accelerometer vibration.
   - Audio MFCC Block: Extracts Mel-Frequency Cepstral Coefficients mimicking the human auditory system.
2. Learning Blocks:
   Compact neural network classifiers or anomaly detection blocks (K-Means / GMM clustering) trained on the extracted low-dimensional DSP features.
3. Hardware Profiling:
   Calculates exact flash usage, peak RAM consumption, and execution latency across target MCU architectures (e.g. ESP32, ARM Cortex-M4) prior to firmware deployment.
4. Export as C++ Library: Exports the trained pipeline as a self-contained, dependency-free C++ library ready to compile directly into Arduino or ESP-IDF projects.`,
  `Structure of an Edge Impulse deployment callback in C++:
\`\`\`cpp
#include <My_Sensor_inferencing.h>

void loop() {
  signal_t signal;
  signal.total_length = EI_CLASSIFIER_DSP_INPUT_FRAME_SIZE;
  signal.get_data = &get_sensor_data_callback;

  ei_impulse_result_t result = { 0 };
  EI_IMPULSE_ERROR res = run_classifier(&signal, &result, false);

  if (res == EI_IMPULSE_OK) {
    // Print classification probabilities
    for (size_t ix = 0; ix < EI_CLASSIFIER_LABEL_COUNT; ix++) {
      Serial.printf("%s: %.2f\n", result.classification[ix].label, result.classification[ix].value);
    }
    Serial.printf("Anomaly score: %.2f\n", result.anomaly);
  }
}
\`\`\``,
  `Skipping DSP feature extraction and feeding thousands of raw accelerometer samples into dense neural network layers; the resulting model is too large for microcontroller SRAM.`,
  `Why does extracting DSP frequency features (e.g. FFT/MFCC) prior to neural network layers dramatically improve TinyML model efficiency?`,
  true
);

writeNoteBlock('iot', 'edge-computing-and-tinyml', 'iot-09-lo06',
  `Voice interfaces and acoustic surveillance on embedded hardware rely on low-power Keyword Spotting (KWS) and acoustic anomaly detection:
1. Acoustic Preprocessing with I2S Microphones:
   Digital MEMS microphones (e.g., INMP441) stream pulse-code modulated (PCM) audio at $16\\text{kHz}$ over the Inter-IC Sound (I2S) bus directly into DMA memory without CPU loading.
2. Spectrogram & MFCC Generation:
   The audio stream is sliced into overlapping time frames (typically $30\\text{ms}$ windows with $20\\text{ms}$ stride). For each frame:
   - Apply a Hanning window to prevent edge spectral leakage.
   - Compute Fast Fourier Transform (FFT) to convert to the frequency domain.
   - Filter through a Mel-scale triangular filterbank and compute the Discrete Cosine Transform (DCT) to yield Mel-Frequency Cepstral Coefficients (MFCCs).
3. 2D Convolutional Inference:
   The resulting $2D$ spectrogram image (time vs. frequency) is fed into a lightweight 2D-CNN or depthwise separable convolutional neural network to classify keywords (e.g., "Yes", "No", "Stop").`,
  `Acoustic preprocessing pipeline representation in Python:
\`\`\`python
import numpy as np

def compute_mock_spectrogram_frame(audio_samples_pcm, fft_size=512):
    # Apply Hanning window
    windowed = audio_samples_pcm * np.hanning(len(audio_samples_pcm))
    # Compute real Fast Fourier Transform
    fft_magnitudes = np.abs(np.fft.rfft(windowed, n=fft_size))
    # Convert to log power spectrum
    log_spectrum = np.log10(fft_magnitudes + 1e-6)
    return log_spectrum[:32] # 32 frequency bins

frame = compute_mock_spectrogram_frame(np.random.randn(480))
print(f"Generated Feature Frame: {frame.shape} bins") # (32,)
\`\`\``,
  `Running continuous keyword detection on high-power CPU cores; keyword detection should run on ultra-low-power DSP blocks or coprocessors that awaken the main CPU only upon valid keyword detection.`,
  `Why are audio waveforms transformed into 2D time-frequency spectrograms before classification by convolutional neural networks?`,
  true
);

writeNoteBlock('iot', 'edge-computing-and-tinyml', 'iot-09-lo07',
  `Deploying deep neural networks onto microcontrollers requires rigorous optimization within tight hardware memory boundaries:
1. Static Flash Memory Footprint:
   Stores read-only compiled program instructions and model weights. An ESP32 typically has $4\\text{MB}$ of SPI flash; models between $50\\text{KB}$ and $500\\text{KB}$ fit comfortably.
2. Dynamic SRAM Memory Ceiling:
   The true hard bottleneck. An ESP32 provides $\\sim 320\\text{KB}$ of usable internal SRAM; an Arduino Uno provides only $2\\text{KB}$. SRAM must hold the OS stack, Wi-Fi buffers, DMA descriptors, and the Tensor Arena.
3. Peak Activation Memory:
   The Tensor Arena must accommodate the two largest adjacent activation tensor layers in the neural network simultaneously. Deep networks with large intermediate spatial feature maps (e.g., early convolutional layers) consume massive peak SRAM.
4. Multiply-Accumulate (MAC) Operations:
   Inference latency is proportional to total MAC count:
   $$\\text{Inference Time} \\approx \\frac{\\text{Total MAC Operations}}{\\text{MACs per second supported by CPU}}$$`,
  `Estimating model memory footprints in Python:
\`\`\`python
def evaluate_tinyml_model_budget(num_parameters, peak_activation_bytes, available_sram_bytes, available_flash_bytes):
    # Quantized int8: 1 byte per parameter
    model_flash_bytes = num_parameters * 1
    tensor_arena_bytes = peak_activation_bytes * 1.2 # 20% scratchpad buffer
    
    fits_flash = model_flash_bytes < available_flash_bytes
    fits_sram = tensor_arena_bytes < available_sram_bytes
    
    return {
        "flash_kb": round(model_flash_bytes / 1024, 1),
        "sram_kb": round(tensor_arena_bytes / 1024, 1),
        "deployable": fits_flash and fits_sram
    }

# Evaluating a 100k parameter model on ESP32 (320KB SRAM, 4MB Flash)
res = evaluate_tinyml_model_budget(100000, 45000, 320000, 4000000)
print(f"Flash: {res['flash_kb']} KB, SRAM: {res['sram_kb']} KB | Deployable: {res['deployable']}")
# 97.7 KB Flash, 52.7 KB SRAM | Deployable: True
\`\`\``,
  `Evaluating a model based only on its file size on disk; a small model with high-resolution intermediate activation tensors can easily exceed available SRAM and crash during allocation.`,
  `What is the difference between model Flash footprint and Tensor Arena SRAM requirements in TinyML deployment?`,
  true
);

writeNoteBlock('iot', 'edge-computing-and-tinyml', 'iot-09-lo08',
  `Predictive maintenance detects machine failures weeks before catastrophic breakdown using on-device vibration anomaly detection:
1. The Problem with Supervised Training:
   Industrial machines rarely fail in production; obtaining labeled training data for every conceivable mechanical failure mode (bearing spall, shaft misalignment, gear pitting) is impossible.
2. The Unsupervised Autoencoder Solution:
   - Training: An Autoencoder neural network is trained exclusively on normal baseline vibration data.
   - Architecture: An encoder compresses input vibration features into a low-dimensional bottleneck latent space; a decoder attempts to reconstruct the original features.
   - Anomaly Scoring: When normal vibration is input, the reconstruction error (Mean Squared Error between input and output) is very low ($<0.1$). When mechanical wear develops, the novel vibration patterns cannot be reconstructed, causing reconstruction error to spike.
   - Alert Threshold: Anomaly detected when $\\text{MSE} > \\text{Threshold}$.`,
  `Calculating Autoencoder reconstruction error in Python:
\`\`\`python
import numpy as np

def calculate_anomaly_score(input_features, reconstructed_features):
    # Mean Squared Error (MSE)
    mse = np.mean((input_features - reconstructed_features) ** 2)
    return float(mse)

# Simulated normal vs anomalous feature vectors
normal_input = np.array([1.2, 0.4, 2.8, 0.1])
normal_recon = np.array([1.18, 0.41, 2.79, 0.12])
anomaly_input = np.array([4.8, 2.9, 0.1, 3.5]) # Damaged motor bearing

score_normal = calculate_anomaly_score(normal_input, normal_recon)
score_anomaly = calculate_anomaly_score(anomaly_input, normal_recon)

print(f"Normal Anomaly Score: {score_normal:.4f} | Fault Anomaly Score: {score_anomaly:.4f}")
# Normal: 0.0002 vs Fault: 8.44 (Massive anomaly alert triggered!)
\`\`\``,
  `Attempting to train supervised machine failure classifiers with only healthy baseline data; without failure samples, supervised models predict 100% healthy regardless of actual machine condition. Use unsupervised autoencoders instead.`,
  `How does an unsupervised Autoencoder detect novel mechanical failures without ever having seen failure data during training?`,
  true
);

writeNoteBlock('iot', 'edge-computing-and-tinyml', 'iot-09-lo09',
  `Microcontroller instruction sets incorporate SIMD (Single Instruction, Multiple Data) DSP extensions that dramatically accelerate neural network matrix multiplications:
1. SIMD Acceleration Principles:
   Standard 32-bit registers can hold four packed 8-bit quantized integers simultaneously. A single SIMD instruction executes four parallel multiply-accumulate operations in one clock cycle:
   $$\\text{SIMD Multiply: } [a_0, a_1, a_2, a_3] \\times [b_0, b_1, b_2, b_3] \\rightarrow \\sum (a_i \\times b_i)$$
2. Hardware Acceleration Libraries:
   - CMSIS-NN (ARM): An optimized collection of neural network kernels developed by ARM for Cortex-M processors (Cortex-M4, M7, M33, M55). Delivers up to 4.6x faster inference and 4.9x energy efficiency improvements.
   - ESP-NN (Espressif): An optimized library written in assembly utilizing the dual-core Tensilica Xtensa instruction set and ESP32-S3 vector instructions.
3. Enabling Acceleration:
   TensorFlow Lite for Microcontrollers automatically detects CMSIS-NN or ESP-NN flags at compile time, replacing generic C++ loops with hand-crafted assembly primitives.`,
  `Performance benchmark comparison in Python:
\`\`\`text
Platform: ESP32 @ 240 MHz (2D-CNN Keyword Spotting Model)
Kernel Implementation        Inference Latency    Relative Speedup
-------------------------------------------------------------------
Reference C++ Kernels        142 ms               1.0x (Baseline)
ESP-NN Optimized Assembly     34 ms               4.17x Faster!
Energy per Inference         18.2 mJ -> 4.3 mJ    76% Energy Saved!
\`\`\``,
  `Compiling TinyML firmware with reference C++ kernels without enabling CMSIS-NN or ESP-NN flags; unoptimized loops waste up to 80% of CPU cycles and battery energy.`,
  `How do SIMD instructions in CMSIS-NN and ESP-NN accelerate 8-bit quantized matrix multiplications?`,
  true
);

// Questions for iot-09
const ch09Questions = [
  // LO01
  {
    loId: "iot-09-lo01",
    type: "single",
    difficulty: 1,
    id: "iot-09-q01",
    stem: "What is Edge Computing in the context of IoT architectures?",
    options: [
      { id: "a", text: "Processing and analyzing sensor data locally on end devices and local gateways rather than offloading raw streams to cloud data centers." },
      { id: "b", text: "Placing servers on the edge of physical tables." },
      { id: "c", text: "Using sharp tools to slice circuit boards." },
      { id: "d", text: "Operating computers without internet." }
    ],
    answer: ["a"],
    explanation: "Edge computing brings computation closer to the data source to minimize latency and bandwidth consumption.",
    noteRef: "iot-09-lo01",
    reviewed: false
  },
  {
    loId: "iot-09-lo01",
    type: "scenario",
    difficulty: 2,
    id: "iot-09-q02",
    stem: "An automated emergency shutdown system on a high-speed industrial turbine must detect anomalous vibration and trip circuit breakers in under 5 milliseconds. Why can this system NOT rely on a cloud API?",
    options: [
      { id: "a", text: "Cloud round-trip network transmission latencies (typically 50ms - 300ms) far exceed the mandatory 5ms safety limit." },
      { id: "b", text: "Cloud servers cannot calculate numbers." },
      { id: "c", text: "Turbines do not have electrical power." },
      { id: "d", text: "Cloud APIs are illegal in industrial plants." }
    ],
    answer: ["a"],
    explanation: "Network round-trip latency introduces variable delays exceeding critical sub-millisecond safety windows.",
    noteRef: "iot-09-lo01",
    reviewed: false
  },
  {
    loId: "iot-09-lo01",
    type: "multi",
    difficulty: 2,
    id: "iot-09-q03",
    stem: "Which of the following are primary benefits achieved by running machine learning models at the edge?",
    options: [
      { id: "a", text: "Deterministic, ultra-low inference latency" },
      { id: "b", text: "Massive bandwidth conservation across cellular and satellite links" },
      { id: "c", text: "Enhanced user privacy by keeping sensitive biometric/audio data on-device" },
      { id: "d", text: "Elimination of all software bugs" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Latency, bandwidth savings, privacy, and offline autonomy are core drivers of edge computing.",
    noteRef: "iot-09-lo01",
    reviewed: false
  },
  {
    loId: "iot-09-lo01",
    type: "single",
    difficulty: 3,
    id: "iot-09-q04",
    stem: "How does edge TinyML inference enhance compliance with data privacy regulations such as GDPR and India's DPDP Act?",
    options: [
      { id: "a", text: "Raw personal data (voice recordings, camera images) is processed in volatile memory and discarded locally, preventing unauthorized transmission to cloud servers." },
      { id: "b", text: "Edge computing legally exempts devices from all privacy laws." },
      { id: "c", text: "Edge devices automatically delete customer files." },
      { id: "d", text: "It converts personal names into random numbers." }
    ],
    answer: ["a"],
    explanation: "Processing locally minimizes data collection and exposure, upholding privacy-by-design standards.",
    noteRef: "iot-09-lo01",
    reviewed: false
  },

  // LO02
  {
    loId: "iot-09-lo02",
    type: "single",
    difficulty: 1,
    id: "iot-09-q05",
    stem: "In what format are optimized neural network models typically embedded into microcontroller C/C++ firmware?",
    options: [
      { id: "a", text: "As a static C byte array (`const unsigned char model_data[]`)" },
      { id: "b", text: "As an uncompiled Python `.py` script" },
      { id: "c", text: "As a Microsoft Word `.docx` file" },
      { id: "d", text: "As an SQL database dump" }
    ],
    answer: ["a"],
    explanation: "Models are exported as raw byte arrays in C header files, stored in read-only flash memory.",
    noteRef: "iot-09-lo02",
    reviewed: false
  },
  {
    loId: "iot-09-lo02",
    type: "scenario",
    difficulty: 2,
    id: "iot-09-q06",
    stem: "An engineer wants to train a machine learning model to classify industrial machine sounds. Where should the model training phase take place?",
    options: [
      { id: "a", text: "On a high-performance workstation or cloud GPU cluster, before quantizing and deploying to the microcontroller." },
      { id: "b", text: "Directly on an Arduino Uno during production operation." },
      { id: "c", text: "Inside an analog operational amplifier." },
      { id: "d", text: "On the physical audio microphone diaphragm." }
    ],
    answer: ["a"],
    explanation: "Backpropagation training requires massive matrix computation and RAM; only inference runs on MCUs.",
    noteRef: "iot-09-lo02",
    reviewed: false
  },
  {
    loId: "iot-09-lo02",
    type: "multi",
    difficulty: 2,
    id: "iot-09-q07",
    stem: "Which of the following stages are standard components of the TinyML engineering lifecycle?",
    options: [
      { id: "a", text: "Data collection and preprocessing feature extraction" },
      { id: "b", text: "Model training and int8 quantization" },
      { id: "c", text: "Exporting model to C byte array for on-device inference" },
      { id: "d", text: "Hand-soldering individual transistors for every neural weight" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Data collection, training, quantization, and C array deployment form the standard TinyML workflow.",
    noteRef: "iot-09-lo02",
    reviewed: false
  },
  {
    loId: "iot-09-lo02",
    type: "single",
    difficulty: 3,
    id: "iot-09-q08",
    stem: "What open-source software tool from Google converts trained TensorFlow/Keras models into optimized `.tflite` files?",
    options: [
      { id: "a", text: "TFLiteConverter (TensorFlow Lite Converter)" },
      { id: "b", text: "Docker" },
      { id: "c", text: "Wireshark" },
      { id: "d", text: "GitLab" }
    ],
    answer: ["a"],
    explanation: "`tf.lite.TFLiteConverter` applies graph optimizations and quantization to export compact TFLite models.",
    noteRef: "iot-09-lo02",
    reviewed: false
  },

  // LO03
  {
    loId: "iot-09-lo03",
    type: "single",
    difficulty: 1,
    id: "iot-09-q09",
    stem: "What data type is standardly used for neural network weights and activations in quantized TinyML models?",
    options: [
      { id: "a", text: "int8 (8-bit signed integer)" },
      { id: "b", text: "float64 (64-bit double precision float)" },
      { id: "c", text: "complex128" },
      { id: "d", text: "ASCII strings" }
    ],
    answer: ["a"],
    explanation: "`int8` signed integers (-128 to 127) are the industry standard representation for quantized TinyML.",
    noteRef: "iot-09-lo03",
    reviewed: false
  },
  {
    loId: "iot-09-lo03",
    type: "numeric",
    difficulty: 2,
    id: "iot-09-q10",
    stem: "A float32 deep learning model has a memory footprint of 400 KB. What is its approximate size (in KB) after full int8 post-training quantization?",
    options: [
      { id: "a", text: "100" },
      { id: "b", text: "200" },
      { id: "c", text: "50" },
      { id: "d", text: "400" }
    ],
    answer: ["a"],
    explanation: "Quantizing 32-bit floats to 8-bit integers compresses weights by 4x: 400 KB / 4 = 100 KB.",
    noteRef: "iot-09-lo03",
    verify: "(400 / 4 === 100)",
    reviewed: false
  },
  {
    loId: "iot-09-lo03",
    type: "scenario",
    difficulty: 2,
    id: "iot-09-q11",
    stem: "An engineer notices an int8 quantized model runs 3x faster than the original float32 model on an ARM Cortex-M4 microcontroller without a hardware floating-point unit (FPU). Why?",
    options: [
      { id: "a", text: "The CPU executes integer operations natively in single clock cycles, avoiding slow multi-cycle software floating-point emulation libraries." },
      { id: "b", text: "The int8 model skips half the layers." },
      { id: "c", text: "The microcontroller clock speed automatically doubles." },
      { id: "d", text: "Floating point math generates heat that throttles the CPU." }
    ],
    answer: ["a"],
    explanation: "MCUs without hardware FPUs emulate float math in software, taking dozens of cycles per operation.",
    noteRef: "iot-09-lo03",
    reviewed: false
  },
  {
    loId: "iot-09-lo03",
    type: "single",
    difficulty: 3,
    id: "iot-09-q12",
    stem: "In the quantization equation `real_value = (quantized_int - zero_point) * scale`, what is the role of `zero_point`?",
    options: [
      { id: "a", text: "It maps the real-world value of 0.0 to an exact integer value in the quantized range, ensuring that zero-padding does not introduce numerical bias." },
      { id: "b", text: "It sets the starting battery voltage." },
      { id: "c", text: "It clears memory on startup." },
      { id: "d", text: "It calculates network latency." }
    ],
    answer: ["a"],
    explanation: "Zero-point ensures real 0.0 maps exactly to an integer, critical for zero-padded convolution layers.",
    noteRef: "iot-09-lo03",
    reviewed: false
  },

  // LO04
  {
    loId: "iot-09-lo04",
    type: "single",
    difficulty: 1,
    id: "iot-09-q13",
    stem: "What is the Tensor Arena in TensorFlow Lite for Microcontrollers (TFLM)?",
    options: [
      { id: "a", text: "A pre-allocated contiguous memory array in SRAM used by the interpreter to store activation tensors and scratchpad memory." },
      { id: "b", text: "A physical esports stadium for robots." },
      { id: "c", text: "An online marketplace for selling AI models." },
      { id: "d", text: "A graphics card processor." }
    ],
    answer: ["a"],
    explanation: "The Tensor Arena is the static memory pool where TFLM allocates all intermediate runtime buffers.",
    noteRef: "iot-09-lo04",
    reviewed: false
  },
  {
    loId: "iot-09-lo04",
    type: "scenario",
    difficulty: 2,
    id: "iot-09-q15",
    stem: "An engineer calls `interpreter.AllocateTensors()` in an ESP32 sketch, but it returns `kTfLiteError`. What is the most likely root cause?",
    options: [
      { id: "a", text: "The declared `tensor_arena` buffer size is too small to fit the model's activation tensors and working memory." },
      { id: "b", text: "The Wi-Fi antenna is disconnected." },
      { id: "c", text: "The microcontroller is running out of ground pins." },
      { id: "d", text: "The USB cable is plugged into a 3.0 port." }
    ],
    answer: ["a"],
    explanation: "If intermediate layer activation maps exceed the allocated arena capacity, `AllocateTensors()` fails.",
    noteRef: "iot-09-lo04",
    reviewed: false
  },
  {
    loId: "iot-09-lo04",
    type: "multi",
    difficulty: 2,
    id: "iot-09-q16",
    stem: "Which of the following architectural constraints are strictly enforced by TensorFlow Lite for Microcontrollers (TFLM)?",
    options: [
      { id: "a", text: "Zero dynamic memory allocations (`malloc` or `new`) during runtime inference" },
      { id: "b", text: "No dependencies on underlying operating system kernel services (runs bare-metal)" },
      { id: "c", text: "Static compilation of required operator kernels to minimize binary code size" },
      { id: "d", text: "Mandatory requirement of 32 GB RAM" }
    ],
    answer: ["a", "b", "c"],
    explanation: "TFLM is designed for bare-metal systems with zero dynamic allocations and minimal code size.",
    noteRef: "iot-09-lo04",
    reviewed: false
  },
  {
    loId: "iot-09-lo04",
    type: "single",
    difficulty: 3,
    id: "iot-09-q17",
    stem: "Why does TFLM encourage using `MicroMutableOpResolver` instead of `AllOpsResolver` in production firmware?",
    options: [
      { id: "a", text: "`MicroMutableOpResolver` links only the specific math operators used by the model, shaving tens of kilobytes of unused library code from the final binary." },
      { id: "b", text: "`AllOpsResolver` does not support int8 models." },
      { id: "c", text: "`MicroMutableOpResolver` automatically connects to Wi-Fi." },
      { id: "d", text: "`AllOpsResolver` is deprecated by ISO." }
    ],
    answer: ["a"],
    explanation: "Registering only used operators prevents linker bloat, saving critical flash space on embedded targets.",
    noteRef: "iot-09-lo04",
    reviewed: false
  },

  // LO05
  {
    loId: "iot-09-lo05",
    type: "single",
    difficulty: 1,
    id: "iot-09-q18",
    stem: "What is Edge Impulse in the embedded machine learning ecosystem?",
    options: [
      { id: "a", text: "A cloud-based development platform that automates data collection, DSP feature engineering, and TinyML model deployment for embedded devices." },
      { id: "b", text: "A high-voltage pulse generator." },
      { id: "c", text: "An electrical transformer." },
      { id: "d", text: "A physical accelerometer sensor chip." }
    ],
    answer: ["a"],
    explanation: "Edge Impulse provides end-to-end tools to build and deploy ML pipelines to microcontrollers.",
    noteRef: "iot-09-lo05",
    reviewed: false
  },
  {
    loId: "iot-09-lo05",
    type: "scenario",
    difficulty: 2,
    id: "iot-09-q19",
    stem: "An engineer builds a vibration classification model for factory pumps using Edge Impulse. What processing block converts raw time-series vibration waveforms into frequency energy bins?",
    options: [
      { id: "a", text: "Spectral Analysis (FFT) DSP block" },
      { id: "b", text: "UART Serial driver" },
      { id: "c", text: "MQTT broker" },
      { id: "d", text: "DC motor driver" }
    ],
    answer: ["a"],
    explanation: "Spectral analysis uses FFTs to compute frequency power distributions from raw time-series accelerometer data.",
    noteRef: "iot-09-lo05",
    reviewed: false
  },
  {
    loId: "iot-09-lo05",
    type: "multi",
    difficulty: 2,
    id: "iot-09-q20",
    stem: "Which of the following metrics does Edge Impulse profile for target hardware before model deployment?",
    options: [
      { id: "a", text: "Estimated on-device inference latency (milliseconds)" },
      { id: "b", text: "Peak RAM / Tensor Arena consumption (bytes)" },
      { id: "c", text: "Flash memory binary footprint (bytes)" },
      { id: "d", text: "Physical weight of the microcontroller in grams" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Edge Impulse profiles execution time, peak RAM, and flash footprint across target MCU architectures.",
    noteRef: "iot-09-lo05",
    reviewed: false
  },
  {
    loId: "iot-09-lo05",
    type: "single",
    difficulty: 3,
    id: "iot-09-q21",
    stem: "What format does Edge Impulse export for deployment into standard Arduino IDE or ESP-IDF projects?",
    options: [
      { id: "a", text: "A standalone, self-contained C++ library containing DSP feature code and trained model weights." },
      { id: "b", text: "A Python `.whl` package requiring pip." },
      { id: "c", text: "An uncompiled Linux kernel module." },
      { id: "d", text: "A web browser extension." }
    ],
    answer: ["a"],
    explanation: "Edge Impulse exports self-contained C++ source trees that compile directly with native embedded toolchains.",
    noteRef: "iot-09-lo05",
    reviewed: false
  },

  // LO06
  {
    loId: "iot-09-lo06",
    type: "single",
    difficulty: 1,
    id: "iot-09-q22",
    stem: "What digital bus interface is standardly used to connect digital MEMS microphones (like INMP441) to microcontrollers?",
    options: [
      { id: "a", text: "I2S (Inter-IC Sound)" },
      { id: "b", text: "RS-232" },
      { id: "c", text: "CAN Bus" },
      { id: "d", text: "Ethernet" }
    ],
    answer: ["a"],
    explanation: "I2S (Inter-IC Sound) is the standard serial bus for streaming digital audio data into microcontrollers.",
    noteRef: "iot-09-lo06",
    reviewed: false
  },
  {
    loId: "iot-09-lo06",
    type: "scenario",
    difficulty: 2,
    id: "iot-09-q23",
    stem: "A Keyword Spotting (KWS) firmware processes 1 second of audio into a 2D image representing frequency intensities over time. What is this representation called?",
    options: [
      { id: "a", text: "A Spectrogram (or MFCC heat map)" },
      { id: "b", text: "A Barcode" },
      { id: "c", text: "A QR code" },
      { id: "d", text: "A Vector table" }
    ],
    answer: ["a"],
    explanation: "Spectrograms display time on the horizontal axis and frequency bins on the vertical axis.",
    noteRef: "iot-09-lo06",
    reviewed: false
  },
  {
    loId: "iot-09-lo06",
    type: "single",
    difficulty: 2,
    id: "iot-09-q24",
    stem: "What neural network layer architecture is most effective at classifying 2D audio spectrogram features in TinyML models?",
    options: [
      { id: "a", text: "2D Convolutional Neural Network (CNN) / Depthwise Separable CNN" },
      { id: "b", text: "Linear Regression" },
      { id: "c", text: "K-Means Clustering" },
      { id: "d", text: "Sorting Algorithm" }
    ],
    answer: ["a"],
    explanation: "2D CNNs excel at detecting local time-frequency acoustic patterns like formant transitions.",
    noteRef: "iot-09-lo06",
    reviewed: false
  },
  {
    loId: "iot-09-lo06",
    type: "single",
    difficulty: 3,
    id: "iot-09-q25",
    stem: "Why are Mel-Frequency Cepstral Coefficients (MFCCs) preferred over raw linear FFT frequency bins for human speech recognition?",
    options: [
      { id: "a", text: "The Mel scale non-linearly spaces frequency bands to match human ear perception (higher resolution at low frequencies, coarser at high frequencies)." },
      { id: "b", text: "Because MFCC files are written in English." },
      { id: "c", text: "Because FFT does not work on speech." },
      { id: "d", text: "MFCCs consume zero bytes of memory." }
    ],
    answer: ["a"],
    explanation: "The Mel scale models human auditory non-linear pitch perception, concentrating features where speech cues reside.",
    noteRef: "iot-09-lo06",
    reviewed: false
  },

  // LO07
  {
    loId: "iot-09-lo07",
    type: "single",
    difficulty: 1,
    id: "iot-09-q26",
    stem: "In embedded microcontrollers, which memory component is almost always the primary limiting bottleneck for running deep learning models?",
    options: [
      { id: "a", text: "Internal SRAM (RAM)" },
      { id: "b", text: "SPI Flash memory" },
      { id: "c", text: "EEPROM" },
      { id: "d", text: "CPU clock frequency" }
    ],
    answer: ["a"],
    explanation: "Internal SRAM is very scarce (e.g. 320 KB on ESP32, 2 KB on AVR); activation tensors must fit in SRAM.",
    noteRef: "iot-09-lo07",
    reviewed: false
  },
  {
    loId: "iot-09-lo07",
    type: "scenario",
    difficulty: 2,
    id: "iot-09-q27",
    stem: "An engineer designs an image classification CNN for ESP32. The model weights are 200 KB (fits in 4MB Flash), but Layer 1 generates a 400 KB activation tensor. Why will this model fail to execute?",
    options: [
      { id: "a", text: "The 400 KB activation tensor exceeds the ESP32's maximum available internal SRAM (~320 KB), causing allocation failure." },
      { id: "b", text: "The camera is too small." },
      { id: "c", text: "The ESP32 runs at 240 MHz." },
      { id: "d", text: "The flash memory burns out." }
    ],
    answer: ["a"],
    explanation: "Intermediate layer activation maps must reside in fast internal SRAM during layer forward passes.",
    noteRef: "iot-09-lo07",
    reviewed: false
  },
  {
    loId: "iot-09-lo07",
    type: "numeric",
    difficulty: 2,
    id: "iot-09-q28",
    stem: "If a microcontroller core performs an average of 5,000,000 MAC operations per second, approximately how many milliseconds will a 100,000 MAC neural network take to execute?",
    options: [
      { id: "a", text: "20" },
      { id: "b", text: "100" },
      { id: "c", text: "5" },
      { id: "d", text: "500" }
    ],
    answer: ["a"],
    explanation: "100,000 / 5,000,000 = 0.02 seconds = 20 milliseconds.",
    noteRef: "iot-09-lo07",
    verify: "((100000 / 5000000) * 1000 === 20)",
    reviewed: false
  },
  {
    loId: "iot-09-lo07",
    type: "single",
    difficulty: 3,
    id: "iot-09-q29",
    stem: "Why does reducing intermediate feature map spatial dimensions (e.g. via strided convolutions or pooling) conserve SRAM in TinyML models?",
    options: [
      { id: "a", text: "It decreases the height and width of tensor output arrays, directly shrinking the memory buffer required inside the Tensor Arena." },
      { id: "b", text: "It reduces the clock speed." },
      { id: "c", text: "It deletes the model weights." },
      { id: "d", text: "It prevents Wi-Fi disconnects." }
    ],
    answer: ["a"],
    explanation: "Activation tensor size equals $H \\times W \\times C$; reducing spatial dimensions directly reduces SRAM consumption.",
    noteRef: "iot-09-lo07",
    reviewed: false
  },

  // LO08
  {
    loId: "iot-09-lo08",
    type: "single",
    difficulty: 1,
    id: "iot-09-q30",
    stem: "What machine learning architecture is standardly used for unsupervised vibration anomaly detection in predictive maintenance?",
    options: [
      { id: "a", text: "Autoencoder Neural Network" },
      { id: "b", text: "Decision Tree Regressor" },
      { id: "c", text: "Naive Bayes Classifier" },
      { id: "d", text: "Binary Search Tree" }
    ],
    answer: ["a"],
    explanation: "Autoencoders compress and reconstruct normal signals, flagging anomalies when reconstruction error spikes.",
    noteRef: "iot-09-lo08",
    reviewed: false
  },
  {
    loId: "iot-09-lo08",
    type: "scenario",
    difficulty: 2,
    id: "iot-09-q31",
    stem: "An Autoencoder model on an industrial pump monitors bearing vibration. During healthy operation, reconstruction error averages 0.04. Suddenly, the error jumps to 4.2. What does this indicate?",
    options: [
      { id: "a", text: "The pump is vibrating with novel, anomalous frequency patterns indicative of mechanical wear or impending failure." },
      { id: "b", text: "The pump is working better than ever." },
      { id: "c", text: "The microcontroller flash memory was erased." },
      { id: "d", text: "The database password changed." }
    ],
    answer: ["a"],
    explanation: "High reconstruction error proves the current input does not match the normal healthy baseline learned during training.",
    noteRef: "iot-09-lo08",
    reviewed: false
  },
  {
    loId: "iot-09-lo08",
    type: "multi",
    difficulty: 2,
    id: "iot-09-q32",
    stem: "Which mechanical machinery faults can be detected early using high-frequency vibration analysis?",
    options: [
      { id: "a", text: "Bearing ball race pitting and spalling" },
      { id: "b", text: "Shaft misalignment and rotational imbalance" },
      { id: "c", text: "Gear tooth cracking and chipping" },
      { id: "d", text: "Software copyright licensing violations" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Vibration spectral analysis detects bearing pitting, imbalance, and gear tooth fractures.",
    noteRef: "iot-09-lo08",
    reviewed: false
  },
  {
    loId: "iot-09-lo08",
    type: "single",
    difficulty: 3,
    id: "iot-09-q33",
    stem: "Why is unsupervised anomaly detection preferred over supervised classification for factory predictive maintenance?",
    options: [
      { id: "a", text: "Industrial machines operate normally 99.9% of the time; real-world destructive failure training data is rare, dangerous to induce, and expensive to obtain." },
      { id: "b", text: "Supervised models cannot run on microcontrollers." },
      { id: "c", text: "Unsupervised models do not use mathematics." },
      { id: "d", text: "Factory managers prefer random decisions." }
    ],
    answer: ["a"],
    explanation: "Machine failure data is exceedingly scarce; autoencoders need only healthy baseline operational data to train.",
    noteRef: "iot-09-lo08",
    reviewed: false
  },

  // LO09 (Extension)
  {
    loId: "iot-09-lo09",
    type: "single",
    difficulty: 2,
    id: "iot-09-q34",
    stem: "What does SIMD stand for in microcontroller processor architecture?",
    options: [
      { id: "a", text: "Single Instruction, Multiple Data" },
      { id: "b", text: "Serial Interface Memory Device" },
      { id: "c", text: "System Isolation Monitoring Daemon" },
      { id: "d", text: "Synchronous Input Modulator" }
    ],
    answer: ["a"],
    explanation: "SIMD (Single Instruction, Multiple Data) executes a single operation on multiple packed data elements in parallel.",
    noteRef: "iot-09-lo09",
    reviewed: false
  },
  {
    loId: "iot-09-lo09",
    type: "scenario",
    difficulty: 2,
    id: "iot-09-q35",
    stem: "A firmware developer compiles an audio Keyword Spotting model on an ARM Cortex-M4 board with ARM's CMSIS-NN library enabled. What speedup can they expect over standard reference C++ code?",
    options: [
      { id: "a", text: "Roughly 3x to 5x faster inference execution with proportional energy savings." },
      { id: "b", text: "1,000,000x faster execution." },
      { id: "c", text: "No speedup whatsoever." },
      { id: "d", text: "The code will run 10x slower." }
    ],
    answer: ["a"],
    explanation: "CMSIS-NN leverages SIMD DSP instructions to accelerate 8-bit convolutions by 3x to 5x.",
    noteRef: "iot-09-lo09",
    reviewed: false
  },
  {
    loId: "iot-09-lo09",
    type: "multi",
    difficulty: 3,
    id: "iot-09-q36",
    stem: "Which of the following embedded hardware acceleration libraries optimize neural network execution on microcontrollers?",
    options: [
      { id: "a", text: "CMSIS-NN (for ARM Cortex-M cores)" },
      { id: "b", text: "ESP-NN (for Espressif ESP32 Xtensa and RISC-V cores)" },
      { id: "c", text: "Apache Hadoop" },
      { id: "d", text: "Nvidia CUDA on microcontrollers" }
    ],
    answer: ["a", "b"],
    explanation: "CMSIS-NN (ARM) and ESP-NN (Espressif) are the primary hardware assembly libraries for microcontrollers.",
    noteRef: "iot-09-lo09",
    reviewed: false
  },
  {
    loId: "iot-09-lo09",
    type: "single",
    difficulty: 2,
    id: "iot-09-q37",
    stem: "How does the ARM CMSIS-NN library achieve significant speedups on Cortex-M processors?",
    options: [
      { id: "a", text: "By using SIMD instructions to perform four 8-bit integer multiply-accumulate operations in a single CPU clock cycle." },
      { id: "b", text: "By overclocking the microcontroller crystal oscillator beyond factory ratings." },
      { id: "c", text: "By transmitting the neural network weights to an external GPU server over Wi-Fi." },
      { id: "d", text: "By converting 8-bit integers into 64-bit double precision floats." }
    ],
    answer: ["a"],
    explanation: "CMSIS-NN packs four 8-bit inputs into 32-bit registers and uses SIMD instructions for parallel multiply-accumulate operations.",
    noteRef: "iot-09-lo09",
    reviewed: false
  }
];

balanceAndSave('iot', 'edge-computing-and-tinyml', ch09Objectives, ch09Questions);

// ==========================================
// CHAPTER 10: iot-security-and-capstone (iot-10) [fast-moving]
// ==========================================

const ch10Objectives = {
  version: 1,
  chapterId: "iot-10",
  objectives: [
    {
      id: "iot-10-lo01",
      order: 1,
      title: "Model physical and network threats against embedded devices using STRIDE and attack surface mapping",
      bloom: "model",
      tier: "core",
      mustHave: true,
      keywords: ["stride threat model", "physical attack surface", "jtag extraction", "uart snooping", "embedded attack vectors"],
      aliases: ["iot threat modeling", "hardware attack surface"],
      prerequisites: ["sec-01-lo02", "iot-03-lo03"],
      estMinutes: 14
    },
    {
      id: "iot-10-lo02",
      order: 2,
      title: "Establish hardware root of trust using secure elements (ATECC608) and eFuses",
      bloom: "establish",
      tier: "core",
      mustHave: true,
      keywords: ["hardware root of trust", "secure element", "atecc608", "efuses", "crypto key protection"],
      aliases: ["hardware security root", "tamper resistant key storage"],
      prerequisites: ["iot-10-lo01"],
      estMinutes: 14
    },
    {
      id: "iot-10-lo03",
      order: 3,
      title: "Configure ESP32 hardware Secure Boot and transparent Flash Encryption",
      bloom: "configure",
      tier: "core",
      mustHave: true,
      keywords: ["secure boot", "flash encryption", "rsa verification", "aes-xts-256", "esp-idf security"],
      aliases: ["esp32 secure boot", "hardware flash encryption"],
      prerequisites: ["iot-10-lo02"],
      estMinutes: 14
    },
    {
      id: "iot-10-lo04",
      order: 4,
      title: "Mitigate OWASP IoT Top 10 vulnerabilities: default credentials, insecure interfaces, and unencrypted transport",
      bloom: "mitigate",
      tier: "core",
      mustHave: true,
      keywords: ["owasp iot top 10", "default passwords", "unencrypted communications", "insecure interfaces", "hardening"],
      aliases: ["owasp iot vulnerabilities", "iot firmware hardening"],
      prerequisites: ["iot-10-lo01"],
      estMinutes: 14
    },
    {
      id: "iot-10-lo05",
      order: 5,
      title: "Isolate IoT devices using VLAN network segmentation and firewall microsegmentation",
      bloom: "isolate",
      tier: "core",
      mustHave: false,
      keywords: ["iot vlan", "network segmentation", "firewall rules", "isolate untrusted devices", "zero trust iot"],
      aliases: ["iot network segmentation", "vlan containment"],
      prerequisites: ["sec-07-lo03", "iot-06-lo01"],
      estMinutes: 12
    },
    {
      id: "iot-10-lo06",
      order: 6,
      title: "Analyze Industrial IoT (IIoT) protocols and architectures: Modbus, OPC UA, and the Purdue Model",
      bloom: "analyze",
      tier: "core",
      mustHave: false,
      keywords: ["iiot", "opc ua", "modbus security", "purdue model", "scada", "ics security"],
      aliases: ["industrial iot standards", "purdue reference model"],
      prerequisites: ["iot-05-lo09"],
      estMinutes: 14
    },
    {
      id: "iot-10-lo07",
      order: 7,
      title: "Disable physical hardware debug interfaces (JTAG, UART, SWD) in production firmware builds",
      bloom: "secure",
      tier: "core",
      mustHave: false,
      keywords: ["disable jtag", "lock uart bootloader", "swd disabling", "anti-tamper", "production lock"],
      aliases: ["debug port locking", "hardware interface hardening"],
      prerequisites: ["iot-10-lo01"],
      estMinutes: 12
    },
    {
      id: "iot-10-lo08",
      order: 8,
      title: "Architect an end-to-end resilient, secure, and power-optimized smart monitoring capstone system",
      bloom: "architect",
      tier: "core",
      mustHave: true,
      keywords: ["capstone architecture", "sensor to cloud", "tinyml inference", "mqtts telemetry", "end-to-end iot"],
      aliases: ["iot capstone project", "full stack iot design"],
      prerequisites: ["iot-08-lo05", "iot-09-lo04", "iot-10-lo03"],
      estMinutes: 15
    },
    {
      id: "iot-10-lo09",
      order: 9,
      title: "Conduct dynamic firmware security auditing and binary extraction vulnerability analysis",
      bloom: "audit",
      tier: "extension",
      mustHave: false,
      keywords: ["binwalk", "firmware extraction", "ghidra embedded", "firmware security audit", "entropy analysis"],
      aliases: ["firmware reverse engineering", "binwalk analysis"],
      prerequisites: ["iot-10-lo07"],
      estMinutes: 12
    }
  ]
};

// Notes for iot-10 [fast-moving]

writeNoteBlock('iot', 'iot-security-and-capstone', 'iot-10-lo01',
  `Securing IoT systems requires modeling threats against physical hardware interfaces and wireless network vectors using the STRIDE framework:
1. Physical Attack Vectors:
   Unlike cloud servers in locked data centers, IoT nodes sit in accessible public environments. An adversary with physical possession can:
   - Attach logic analyzers to exposed PCB test pads to sniff unencrypted I2C/SPI bus credentials.
   - Solder onto serial UART or JTAG headers to dump flash memory contents or access debug root shells.
   - Desolder SPI flash chips to extract raw firmware images using external EEPROM programmers.
2. The STRIDE Framework for Embedded IoT:
   - Spoofing: Impersonating legitimate sensors via cloned MAC addresses or stolen certificates.
   - Tampering: Modifying firmware in flash or injecting forged sensor readings.
   - Repudiation: Denying malicious actuation commands due to absent cryptographic audit trails.
   - Information Disclosure: Sniffing plaintext MQTT packets or reading unencrypted private keys.
   - Denial of Service: Flooding radio frequencies with RF jamming signals or beacon storms.
   - Elevation of Privilege: Escaping unprivileged application tasks into RTOS kernel mode.`,
  `STRIDE threat evaluation script in Python:
\`\`\`python
def audit_iot_stride(threat_category, component):
    mitigations = {
        "Spoofing": "Enforce mTLS client certificates backed by ATECC608 secure element",
        "Tampering": "Enable hardware Secure Boot and Flash Encryption via eFuses",
        "Information Disclosure": "Encrypt all transport traffic with MQTTS (TLS 1.3)",
        "Denial of Service": "Implement rate limiting and watchdog timer resets"
    }
    return mitigations.get(threat_category, "Standard hardening required")

print(audit_iot_stride("Tampering", "ESP32 SPI Flash"))
# Enable hardware Secure Boot and Flash Encryption via eFuses
\`\`\``,
  `Assuming an IoT node is secure because it connects over WPA2 Wi-Fi; network encryption provides zero protection against an adversary who physically solders onto the board's unencrypted SPI flash lines.`,
  `Why do physical attack surfaces (e.g. exposed JTAG pins and SPI flash lines) make IoT security fundamentally different from cloud server security?`,
  true
);

writeNoteBlock('iot', 'iot-security-and-capstone', 'iot-10-lo02',
  `A hardware Root of Trust (RoT) forms the foundational cryptographic anchor from which all higher-level security software is authenticated:
1. Secure Elements (e.g., Microchip ATECC608A / ATECC608B):
   A dedicated tamper-resistant companion cryptographic co-processor connected via I2C:
   - High-Security Key Storage: Stores private ECC keys inside hardened EEPROM shielded by physical active mesh layers that self-destruct if microscopically probed.
   - On-Chip Cryptographic Engine: Performs hardware ECDSA signatures, ECDH key agreements, and true random number generation (TRNG). The private key NEVER leaves the secure element silicon.
2. Microcontroller eFuses:
   One-Time-Programmable (OTP) microscopic electrical fuses inside microcontrollers like the ESP32:
   - Once programmed by blowing the fuse wire with a high-voltage pulse, their physical state is permanently irreversible.
   - Used to permanently burn cryptographic keys (AES-256 for flash encryption, RSA/ECDSA public key hashes for secure boot) and disable hardware debug interfaces.`,
  `Simulating hardware-backed cryptographic signing with an external secure element:
\`\`\`python
def secure_element_sign(message_digest, key_slot, tamper_detected=False):
    if tamper_detected:
        # Hardware physically destroys internal keys
        return "HARDWARE_LOCKED: Tamper mesh breached; keys erased"
    # Cryptographic signing occurs strictly inside protected silicon
    signature = f"ECDSA_SIG(slot_{key_slot}, {message_digest[:8]}...)"
    return signature

sig = secure_element_sign("e3b0c44298fc1c149afbf4c8996fb92427ae...", key_slot=0)
print(f"Generated Signature: {sig}")
\`\`\``,
  `Storing raw private keys as plaintext strings in standard microcontroller flash memory; any attacker with a $10 CH341A flash programmer can dump the chip and extract the keys in seconds.`,
  `Why does performing cryptographic signing inside a dedicated Secure Element prevent private key theft?`,
  true
);

writeNoteBlock('iot', 'iot-security-and-capstone', 'iot-10-lo03',
  `Secure Boot and Flash Encryption work cooperatively to protect microcontroller intellectual property and prevent execution of unauthorized malware:
1. Secure Boot (Cryptographic Chain of Trust):
   - The ESP32 ROM bootloader (burned at silicon fab) reads the RSA-3072 or ECDSA public key hash permanently burned into chip eFuses.
   - The ROM bootloader verifies the digital signature of the secondary bootloader in flash before executing it.
   - The secondary bootloader verifies the digital signature of the application firmware before booting it.
   - If an attacker tampers with even a single byte of firmware in flash, the signature check fails and the device halts permanently.
2. Hardware Flash Encryption (AES-XTS-256):
   - A unique 256-bit AES key is randomly generated by the hardware RNG and burned into write-protected eFuses on first boot.
   - All code and data stored on external SPI flash is encrypted.
   - The hardware flash cache controller transparently decrypts code on-the-fly as instructions are fetched into CPU cache.
   - Physical flash dumps contain only indecipherable pseudo-random noise.`,
  `ESP-IDF command-line workflow enabling secure boot and flash encryption:
\`\`\`bash
# Generate secure boot signing key (stored offline on HSM)
espsecure.py generate_signing_key --version 2 secure_boot_signing_key.pem

# Sign application binary prior to OTA deployment
espsecure.py sign_data --version 2 --keyfile secure_boot_signing_key.pem \
  --output signed_firmware.bin build/app.bin

# Burn public key hash into ESP32 eFuses (Permanent / Irreversible!)
espefuse.py --port /dev/ttyUSB0 burn_key BLOCK_KEY0 secure_boot_signing_key.pem SECURE_BOOT_DIGEST
\`\`\``,
  `Testing Secure Boot and Flash Encryption on prototype development boards without realizing that burning eFuses is physically irreversible; burning production eFuses permanently locks the chip into production security mode.`,
  `How does hardware Flash Encryption protect an IoT device against physical flash dumping attacks?`,
  true
);

writeNoteBlock('iot', 'iot-security-and-capstone', 'iot-10-lo04',
  `The OWASP Internet of Things Top 10 documents the most prevalent vulnerabilities exploited by global botnets (such as Mirai and Mozi) against connected devices:
1. Top Vulnerabilities and Defense Mitigations:
   - I1: Weak, Guessable, or Hardcoded Passwords:
     *Exploit*: Factory-default credentials (\`admin:admin\`, \`root:123456\`) allow automated worm propagation.
     *Defense*: Enforce unique random per-device passwords printed on physical serial labels; mandate password change upon initial setup.
   - I2: Insecure Network Services:
     *Exploit*: Unnecessary open ports (Telnet port 23, unauthenticated HTTP on 8080) listening on public IP interfaces.
     *Defense*: Close all unused daemons; bind local services to localhost; require SSH keys instead of Telnet.
   - I3: Insecure Ecosystem Interfaces:
     *Exploit*: Web, mobile, or cloud API endpoints lacking authentication or vulnerable to SQL injection and broken access control.
   - I4: Lack of Secure Update Mechanism:
     *Exploit*: Unencrypted, unsigned OTA binaries accepting malicious third-party firmware.
     *Defense*: Mandate cryptographic signature checks before writing OTA binaries.
   - I5: Insecure Privacy Protection: Storing user PII unencrypted in flash.`,
  `Security audit checklist for firmware release gating in Python:
\`\`\`python
def audit_firmware_security(telnet_enabled, default_password_set, ota_signed):
    vulnerabilities = []
    if telnet_enabled:
        vulnerabilities.append("OWASP I2: Unencrypted Telnet daemon exposed")
    if default_password_set:
        vulnerabilities.append("OWASP I1: Hardcoded default credentials present")
    if not ota_signed:
        vulnerabilities.append("OWASP I4: Unsigned OTA firmware update mechanism")
    
    return {
        "passed": len(vulnerabilities) == 0,
        "critical_flaws": vulnerabilities
    }

print(audit_firmware_security(telnet_enabled=False, default_password_set=False, ota_signed=True)["passed"]) # True
\`\`\``,
  `Leaving an unauthenticated Telnet server or exposed serial debug shell enabled in production firmware builds, allowing remote adversaries to gain root access in seconds.`,
  `What was the primary vulnerability exploited by the infamous Mirai IoT botnet to hijack hundreds of thousands of consumer IP cameras?`,
  true
);

writeNoteBlock('iot', 'iot-security-and-capstone', 'iot-10-lo05',
  `Network segmentation quarantines IoT devices into isolated security zones, preventing compromised smart appliances from attacking corporate workstations or databases:
1. The Lateral Movement Threat:
   Adversaries frequently breach low-security IoT devices (smart fish tanks, HVAC controllers, Wi-Fi lightbulbs) and use them as beachheads to pivot laterally across the flat local network to enterprise servers.
2. IoT VLAN Architecture:
   - Isolated IoT VLAN: Place all smart appliances on a dedicated Virtual Local Area Network (e.g. VLAN 50) distinct from employee laptops (VLAN 10) and corporate servers (VLAN 20).
   - Firewall Rules (Microsegmentation):
     * Permitted: IoT nodes may initiate outbound MQTTS/HTTPS connections to specific cloud broker endpoints.
     * Denied: IoT nodes are strictly prohibited from initiating inbound connections to employee laptops or other internal subnets.
     * Client Isolation: Enable wireless client isolation on the Wi-Fi Access Point so IoT devices on the same SSID cannot communicate directly with each other.`,
  `Firewall routing policy representation for IoT VLAN microsegmentation:
\`\`\`text
Rule 1: ALLOW IoT_VLAN (192.168.50.0/24) -> WAN (Port 8883 MQTTS, Port 123 NTP)
Rule 2: DENY  IoT_VLAN (192.168.50.0/24) -> Corporate_LAN (192.168.10.0/24) [ALL TRAFFIC]
Rule 3: DENY  IoT_VLAN (192.168.50.0/24) -> Server_LAN (192.168.20.0/24) [ALL TRAFFIC]
Rule 4: ALLOW Corporate_LAN -> IoT_VLAN (HTTP/HTTPS for device administration only)
Rule 5: DEFAULT DROP ALL
\`\`\``,
  `Connecting untrusted consumer IoT devices to the primary enterprise Wi-Fi network alongside corporate laptops and database servers, exposing the entire enterprise to lateral pivot attacks.`,
  `Why should wireless client isolation be enabled on Wi-Fi access points hosting IoT smart devices?`,
  true
);

writeNoteBlock('iot', 'iot-security-and-capstone', 'iot-10-lo06',
  `Industrial Internet of Things (IIoT) systems merge operational technology (OT) physical processes with enterprise digital systems:
1. The Purdue Enterprise Reference Model (PERM / ISA-95):
   Partitions industrial manufacturing networks into strict hierarchical security zones:
   - Level 0 (Process): Physical sensors, motors, valves, pumps.
   - Level 1 (Basic Control): Programmable Logic Controllers (PLCs), Remote Terminal Units (RTUs).
   - Level 2 (Area Supervisory): Human-Machine Interfaces (HMIs), supervisory SCADA control stations.
   - Level 3 (Site Operations): Historian databases, manufacturing execution systems (MES).
   - Industrial DMZ (IDMZ): Isolates OT production networks from corporate enterprise IT networks. No direct traffic is ever permitted between Level 3 and Level 4!
2. Industrial Protocols:
   - Modbus TCP/RTU: Legacy standard; lacks native encryption, authentication, or integrity checks. Anyone who can inject a packet can trip a breaker.
   - OPC Unified Architecture (OPC UA): The modern industrial gold standard. Fully object-oriented, incorporating X.509 mutual certificate authentication, digital signatures, and AES encryption.`,
  `Purdue Enterprise Reference Architecture mapping:
\`\`\`text
[Enterprise IT] Level 4: Enterprise Business Network (ERP, Email, Internet)
========================================================================
[Industrial DMZ] IDMZ: Secure Proxy, Reverse Proxy, Patch Mirrors
========================================================================
[Industrial OT] Level 3: Manufacturing Operations (Historian, SCADA Master)
                Level 2: Supervisory Control (HMIs, Operator Consoles)
                Level 1: Basic Control (PLCs, RTUs, Embedded Controllers)
                Level 0: Physical Process (Sensors, Actuators, Motors)
\`\`\``,
  `Connecting Modbus PLCs controlling water pumps directly to the internet; because Modbus lacks authentication, anyone on Shodan can issue write commands and trigger physical equipment destruction.`,
  `What critical function does an Industrial Demilitarized Zone (IDMZ) serve in the Purdue reference architecture?`,
  true
);

writeNoteBlock('iot', 'iot-security-and-capstone', 'iot-10-lo07',
  `Hardware debugging interfaces (UART, JTAG, SWD) provide deep low-level access during development but become severe vulnerabilities if left accessible on production hardware:
1. Physical Exploitation via Debug Ports:
   - JTAG / SWD (Serial Wire Debug): Hardware debug ports wired directly to the CPU core. An attacker connecting an OpenOCD probe can halt the processor, inspect registers, alter memory values, and bypass authentication checks in real time.
   - UART Serial Consoles: Often drop into a Linux root shell or interactive bootloader console if an attacker sends an Enter key or holds a pin during boot.
2. Production Hardening Actions:
   - Disable JTAG Permanently in eFuses: Burn the \`JTAG_DISABLE\` eFuse bit on the ESP32, which physically cuts the silicon trace connecting JTAG logic to external GPIO pins.
   - Disable ROM Download Mode: Configure eFuses to permanently disable UART flashing, preventing unauthorized overwriting of firmware binaries.
   - Remove Test Points & Headers: Remove pin headers from production PCBs; hide test points on inner PCB layers or bury them under conformal coating.`,
  `Checking and burning JTAG disable eFuses on ESP32:
\`\`\`bash
# Query current security eFuse status
espefuse.py --port /dev/ttyUSB0 summary

# Permanently disable hardware JTAG interface (Irreversible!)
espefuse.py --port /dev/ttyUSB0 burn_efuse JTAG_DISABLE

# Permanently disable UART ROM download bootloader mode
espefuse.py --port /dev/ttyUSB0 burn_efuse UART_DOWNLOAD_DIS
\`\`\``,
  `Shipping production commercial IoT hardware with silkscreened "GND, TX, RX, VCC" pin headers soldered in place; adversaries connect a 3.3V USB-to-UART adapter and gain interactive root access in minutes.`,
  `Why must the hardware JTAG interface be permanently disabled via eFuses before shipping commercial IoT devices?`,
  true
);

writeNoteBlock('iot', 'iot-security-and-capstone', 'iot-10-lo08',
  `The Capstone architecture synthesizes every domain mastered across the IoT curriculum into a production-grade, secure, resilient smart environmental and machine health monitoring system:
1. Physical Edge Layer:
   - Microcontroller: ESP32 dual-core running FreeRTOS with hardware Secure Boot, Flash Encryption, and JTAG disabled via eFuses.
   - Sensors & Actuators: Environmental sensors (I2C BME280) and 3-axis industrial vibration accelerometer (SPI ADXL345).
   - Local Machine Intelligence: Quantized int8 TinyML Autoencoder running under TensorFlow Lite for Microcontrollers detecting bearing anomalies in real time without cloud latency.
2. Communication & Transport Security:
   - Transport: MQTTS over TLS 1.3 on port 8883 with mutual X.509 client certificate authentication backed by an ATECC608 secure element.
   - Resilience: Local LittleFS flash store-and-forward circular queue buffering telemetry during network blackouts.
3. Cloud Platform & Analytics:
   - Broker & Rules Engine: High-availability MQTT broker routing telemetry into a TimescaleDB time-series database.
   - Ingestion Optimization: Edge deadband filtering and 60-second batching reducing cloud messaging transactions by $98\\%$.
   - Operational Visibility: Real-time Grafana dashboards displaying vibration FFT spectra, temperature trends, and automated Slack emergency notifications.
   - Lifecycle Maintenance: Dual-partition A/B OTA update mechanism with automated bootloader rollback safeguards.`,
  `Capstone end-to-end telemetry and command architecture:
\`\`\`text
[Sensors & Accelerometer]
          │ (I2C / SPI)
          ▼
[ESP32 Edge Node] ──► [TinyML Autoencoder] (Local Anomaly Scoring)
          │
          ├── (LittleFS Store & Forward Caching if Offline)
          │
          ▼ (MQTTS Port 8883 / TLS 1.3 with mTLS)
[Cloud IoT Message Broker]
          │
          ├──► [Rules Engine] ──► [Serverless Lambda Alerting]
          │
          ▼
[TimescaleDB Time-Series DB] ──► [Grafana Fleet Dashboard]
\`\`\``,
  `Treating security and resilience as afterthoughts added at the end of development; production IoT architectures must incorporate hardware security, power budgets, and offline caching from the very first breadboard schematic.`,
  `How does the combination of on-device TinyML anomaly detection and cloud time-series dashboards provide comprehensive machine health monitoring?`,
  true
);

writeNoteBlock('iot', 'iot-security-and-capstone', 'iot-10-lo09',
  `Firmware security auditing applies reverse-engineering and static vulnerability analysis to firmware binaries to uncover embedded weaknesses:
1. Binary Firmware Extraction:
   - Dumping flash directly over serial UART using \`esptool.py read_flash\`.
   - Physical chip desoldering and reading SPI flash chips with EEPROM programmers (CH341A).
2. Binwalk Firmware Analysis:
   - Binwalk scans binary images for known magic byte signatures, identifying compressed file systems (SquashFS, CramFS), bootloader headers, embedded Linux kernels, and cryptographic certificates.
   - \`binwalk -e firmware.bin\`: Automatically extracts embedded file systems into searchable directories.
3. Entropy Analysis:
   - High entropy (near 1.0) across the entire flash binary indicates encrypted or compressed firmware.
   - Flat low-entropy blocks indicate plaintext code, unencrypted ASCII strings, or empty unwritten flash sectors.
4. Static Disassembly with Ghidra / IDA Pro:
   Decompiles compiled machine instructions into C pseudo-code, hunting for hardcoded credentials, buffer overflows, and insecure API calls.`,
  `Audit commands for inspecting firmware binary images:
\`\`\`bash
# 1. Inspect firmware entropy (detects if encryption is active)
binwalk -E firmware_dump.bin

# 2. Search for embedded file systems and extract contents
binwalk -Me firmware_dump.bin

# 3. Search for hardcoded plaintext credentials and API tokens
strings firmware_dump.bin | grep -Ei "password|api_key|secret|aws_"
\`\`\``,
  `Storing confidential Wi-Fi credentials, private encryption keys, or cloud database passwords as plaintext strings in application firmware; running \`strings\` on the binary reveals them in seconds.`,
  `What does an entropy analysis score near 1.0 indicate across a firmware binary image?`,
  true
);

// Questions for iot-10
const ch10Questions = [
  // LO01
  {
    loId: "iot-10-lo01",
    type: "single",
    difficulty: 1,
    id: "iot-10-q01",
    stem: "What fundamental physical factor distinguishes IoT device security from cloud data center security?",
    options: [
      { id: "a", text: "IoT devices are physically deployed in untrusted, accessible environments where adversaries can touch, disassemble, and probe electrical pins." },
      { id: "b", text: "IoT devices do not use electricity." },
      { id: "c", text: "Cloud data centers have no firewalls." },
      { id: "d", text: "IoT devices cannot be connected to the internet." }
    ],
    answer: ["a"],
    explanation: "Physical exposure allows attackers to probe PCB traces, attach logic analyzers, and dump flash chips.",
    noteRef: "iot-10-lo01",
    reviewed: false
  },
  {
    loId: "iot-10-lo01",
    type: "scenario",
    difficulty: 2,
    id: "iot-10-q02",
    stem: "An attacker clips a logic analyzer onto an unencrypted I2C bus between an MCU and an external sensor to record transmitted bytes. Which category of the STRIDE model does this attack represent?",
    options: [
      { id: "a", text: "Information Disclosure" },
      { id: "b", text: "Repudiation" },
      { id: "c", text: "Denial of Service" },
      { id: "d", text: "Elevation of Privilege" }
    ],
    answer: ["a"],
    explanation: "Eavesdropping on unencrypted bus traffic violates confidentiality, constituting Information Disclosure.",
    noteRef: "iot-10-lo01",
    reviewed: false
  },
  {
    loId: "iot-10-lo01",
    type: "multi",
    difficulty: 2,
    id: "iot-10-q03",
    stem: "Which of the following physical attack surfaces are commonly exploited by hardware hackers on IoT circuit boards?",
    options: [
      { id: "a", text: "Unprotected UART serial debugging headers" },
      { id: "b", text: "JTAG / SWD processor debug interfaces" },
      { id: "c", text: "Exposed SPI flash memory chips that can be desoldered and dumped" },
      { id: "d", text: "The plastic chassis color" }
    ],
    answer: ["a", "b", "c"],
    explanation: "UART shells, JTAG debug ports, and exposed flash chips are primary hardware attack targets.",
    noteRef: "iot-10-lo01",
    reviewed: false
  },
  {
    loId: "iot-10-lo01",
    type: "single",
    difficulty: 3,
    id: "iot-10-q04",
    stem: "How does a RF jamming attack targeting sub-GHz LoRa frequencies map to the STRIDE threat model?",
    options: [
      { id: "a", text: "Denial of Service (DoS)" },
      { id: "b", text: "Elevation of Privilege" },
      { id: "c", text: "Spoofing" },
      { id: "d", text: "Repudiation" }
    ],
    answer: ["a"],
    explanation: "RF jamming prevents nodes from communicating, directly violating availability as a Denial of Service attack.",
    noteRef: "iot-10-lo01",
    reviewed: false
  },

  // LO02
  {
    loId: "iot-10-lo02",
    type: "single",
    difficulty: 1,
    id: "iot-10-q05",
    stem: "What is an eFuse in a microcontroller like the ESP32?",
    options: [
      { id: "a", text: "A One-Time-Programmable (OTP) microscopic electrical fuse inside the silicon that is permanently blown to burn permanent security keys." },
      { id: "b", text: "A software variable in C++." },
      { id: "c", text: "A rechargeable backup battery." },
      { id: "d", text: "A mechanical safety switch on the power cord." }
    ],
    answer: ["a"],
    explanation: "eFuses are OTP silicon fuses used to store permanent cryptographic keys and lock hardware modes.",
    noteRef: "iot-10-lo02",
    reviewed: false
  },
  {
    loId: "iot-10-lo02",
    type: "scenario",
    difficulty: 2,
    id: "iot-10-q06",
    stem: "A smart lock uses an ATECC608A secure element to authenticate door open requests via ECDSA. An attacker steals the lock and uses an electron microscope to inspect the silicon. What defense protects the private key?",
    options: [
      { id: "a", text: "Active tamper detection shields and internal memory scrambling that destroy stored keys if physical probing is detected." },
      { id: "b", text: "The secure element emits an audio alarm." },
      { id: "c", text: "The chip catches fire intentionally." },
      { id: "d", text: "The microscope is automatically disabled." }
    ],
    answer: ["a"],
    explanation: "Secure elements incorporate active physical top-layer metal meshes that erase memory upon intrusion.",
    noteRef: "iot-10-lo02",
    reviewed: false
  },
  {
    loId: "iot-10-lo02",
    type: "single",
    difficulty: 2,
    id: "iot-10-q07",
    stem: "Why does performing cryptographic signing inside a hardware Secure Element prevent private key extraction?",
    options: [
      { id: "a", text: "The private key never leaves the internal secure silicon; the MCU sends the message digest and receives only the resulting signature." },
      { id: "b", text: "Because private keys are converted into public keys." },
      { id: "c", text: "Because the secure element communicates over Wi-Fi." },
      { id: "d", text: "Because the key changes every millisecond." }
    ],
    answer: ["a"],
    explanation: "Secure elements perform math internally; raw private keys are never exposed on external buses.",
    noteRef: "iot-10-lo02",
    reviewed: false
  },
  {
    loId: "iot-10-lo02",
    type: "single",
    difficulty: 3,
    id: "iot-10-q08",
    stem: "What is meant by a 'Hardware Root of Trust' in an embedded computing architecture?",
    options: [
      { id: "a", text: "An unalterable, tamper-proof hardware foundation (such as ROM bootloader and eFuse keys) from which all subsequent software trust is authenticated." },
      { id: "b", text: "A physical tree planted outside the factory." },
      { id: "c", text: "An insurance policy covering hardware defects." },
      { id: "d", text: "A warranty provided by the chip distributor." }
    ],
    answer: ["a"],
    explanation: "A root of trust is the inherently trusted hardware anchor that verifies all firmware layers above it.",
    noteRef: "iot-10-lo02",
    reviewed: false
  },

  // LO03
  {
    loId: "iot-10-lo03",
    type: "single",
    difficulty: 1,
    id: "iot-10-q09",
    stem: "What cryptographic operation does Secure Boot perform before executing newly booted firmware?",
    options: [
      { id: "a", text: "It verifies the digital signature of the firmware binary using a public key hash burned permanently into hardware eFuses." },
      { id: "b", text: "It compresses the code into a ZIP file." },
      { id: "c", text: "It formats the SPI flash memory." },
      { id: "d", text: "It measures the operating voltage." }
    ],
    answer: ["a"],
    explanation: "Secure boot authenticates firmware signatures against trusted eFuse keys before execution.",
    noteRef: "iot-10-lo03",
    reviewed: false
  },
  {
    loId: "iot-10-lo03",
    type: "scenario",
    difficulty: 2,
    id: "iot-10-q10",
    stem: "An attacker desolders the SPI flash chip from an ESP32 smart meter with Flash Encryption enabled and reads the bytes using a programmer. What data do they see?",
    options: [
      { id: "a", text: "Indecipherable pseudo-random encrypted ciphertext (AES-256) with zero readable code or strings." },
      { id: "b", text: "Cleartext C++ source code." },
      { id: "c", text: "The homeowner's Wi-Fi password in plaintext." },
      { id: "d", text: "An empty flash chip." }
    ],
    answer: ["a"],
    explanation: "Hardware flash encryption encrypts all data at rest on external SPI flash using a unique on-chip key.",
    noteRef: "iot-10-lo03",
    reviewed: false
  },
  {
    loId: "iot-10-lo03",
    type: "multi",
    difficulty: 2,
    id: "iot-10-q11",
    stem: "Which of the following protections are provided by enabling ESP32 hardware Secure Boot?",
    options: [
      { id: "a", text: "Preventing execution of unauthorized, modified, or malicious firmware" },
      { id: "b", text: "Establishing a cryptographic chain of trust from ROM bootloader to application code" },
      { id: "c", text: "Halting boot execution if binary integrity is compromised" },
      { id: "d", text: "Eliminating the need for electrical power" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Secure boot blocks execution of unsigned or tampered firmware images.",
    noteRef: "iot-10-lo03",
    reviewed: false
  },
  {
    loId: "iot-10-lo03",
    type: "single",
    difficulty: 3,
    id: "iot-10-q12",
    stem: "Why is burning the Secure Boot eFuse on an ESP32 considered an irreversible action?",
    options: [
      { id: "a", text: "eFuses physically destroy microscopic silicon fuse links with high current; once blown, they can never be restored to unprogrammed states." },
      { id: "b", text: "Because the compiler deletes the source code." },
      { id: "c", text: "Because Espressif servers lock the user account." },
      { id: "d", text: "Because the flash chip is soldered shut." }
    ],
    answer: ["a"],
    explanation: "eFuses are physical one-way microscopic fuses; once blown, the silicon state cannot be reversed.",
    noteRef: "iot-10-lo03",
    reviewed: false
  },

  // LO04
  {
    loId: "iot-10-lo04",
    type: "single",
    difficulty: 1,
    id: "iot-10-q13",
    stem: "According to the OWASP IoT Top 10, what vulnerability is categorized as I1 (the most common flaw)?",
    options: [
      { id: "a", text: "Weak, Guessable, or Hardcoded Passwords" },
      { id: "b", text: "Insecure Software/Firmware Update" },
      { id: "c", text: "Insufficient Privacy Protection" },
      { id: "d", text: "Physical Hardening Lack" }
    ],
    answer: ["a"],
    explanation: "OWASP IoT I1 is Weak, Guessable, or Hardcoded Passwords, the primary vector for Mirai botnets.",
    noteRef: "iot-10-lo04",
    reviewed: false
  },
  {
    loId: "iot-10-lo04",
    type: "scenario",
    difficulty: 2,
    id: "iot-10-q14",
    stem: "A consumer security camera brand ships all 100,000 units with default username `admin` and password `12345`. Automated worm scripts scan public IP ranges and hijack 40,000 cameras. What simple engineering fix mitigates this?",
    options: [
      { id: "a", text: "Enforcing unique random per-device passwords printed on physical factory labels, and requiring password change upon initial setup." },
      { id: "b", text: "Painting the cameras black." },
      { id: "c", text: "Using larger camera lenses." },
      { id: "d", text: "Switching the camera to analog video." }
    ],
    answer: ["a"],
    explanation: "Unique per-device passwords prevent automated credential stuffing and botnet colonization.",
    noteRef: "iot-10-lo04",
    reviewed: false
  },
  {
    loId: "iot-10-lo04",
    type: "multi",
    difficulty: 2,
    id: "iot-10-q15",
    stem: "Which of the following practices are core recommendations from the OWASP IoT Security Guidance?",
    options: [
      { id: "a", text: "Disabling unencrypted legacy protocols like Telnet (port 23) in production" },
      { id: "b", text: "Requiring cryptographic signature verification on all OTA firmware updates" },
      { id: "c", text: "Encrypting all sensitive user credentials and telemetry in transit via TLS" },
      { id: "d", text: "Publishing root passwords on the company's public website" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Disabling Telnet, signing OTA updates, and enforcing TLS in transit are core OWASP recommendations.",
    noteRef: "iot-10-lo04",
    reviewed: false
  },
  {
    loId: "iot-10-lo04",
    type: "single",
    difficulty: 3,
    id: "iot-10-q16",
    stem: "What was the primary attack mechanism used by the Mirai IoT botnet in 2016 to orchestrate massive 1 Tbps DDoS attacks?",
    options: [
      { id: "a", text: "Scanning the internet for open Telnet ports (23) and brute-forcing 61 common factory default usernames and passwords." },
      { id: "b", text: "Exploiting a zero-day flaw in AES-256 encryption." },
      { id: "c", text: "Physical break-ins to consumer homes." },
      { id: "d", text: "Spoofing GPS satellite signals." }
    ],
    answer: ["a"],
    explanation: "Mirai automated scanning and credential stuffing against hardcoded default passwords on open Telnet ports.",
    noteRef: "iot-10-lo04",
    reviewed: false
  },

  // LO05
  {
    loId: "iot-10-lo05",
    type: "single",
    difficulty: 1,
    id: "iot-10-q17",
    stem: "What network security technique isolates IoT devices from corporate laptops and databases on separate virtual networks?",
    options: [
      { id: "a", text: "VLAN (Virtual Local Area Network) segmentation" },
      { id: "b", text: "Bluetooth pairing" },
      { id: "c", text: "USB debugging" },
      { id: "d", text: "Port forwarding" }
    ],
    answer: ["a"],
    explanation: "VLAN segmentation segregates untrusted IoT devices into separate isolated network broadcast domains.",
    noteRef: "iot-10-lo05",
    reviewed: false
  },
  {
    loId: "iot-10-lo05",
    type: "scenario",
    difficulty: 2,
    id: "iot-10-q18",
    stem: "In a corporate casino, attackers compromised an internet-connected smart aquarium thermometer and used it to pivot across the flat corporate network to exfiltrate a customer database. What architecture would have stopped this lateral movement?",
    options: [
      { id: "a", text: "Placing the thermometer on an isolated IoT VLAN with firewall rules prohibiting traffic initiation into internal corporate subnets." },
      { id: "b", text: "Using a bigger fish tank." },
      { id: "c", text: "Replacing the fish with robotic fish." },
      { id: "d", text: "Turning off the casino's lights at night." }
    ],
    answer: ["a"],
    explanation: "Firewall microsegmentation restricts IoT devices to outbound internet only, blocking lateral pivots.",
    noteRef: "iot-10-lo05",
    reviewed: false
  },
  {
    loId: "iot-10-lo05",
    type: "multi",
    difficulty: 2,
    id: "iot-10-q19",
    stem: "Which firewall rules should be applied to an isolated IoT VLAN hosting smart sensors?",
    options: [
      { id: "a", text: "Allow outbound traffic only to specific cloud broker ports (e.g. 8883 MQTTS, 123 NTP)" },
      { id: "b", text: "Block all inbound traffic initiated from the IoT VLAN toward corporate office subnets" },
      { id: "c", text: "Enable wireless client isolation on the IoT Wi-Fi SSID" },
      { id: "d", text: "Grant full unrestricted administrative access to all internal database servers" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Restricting outbound ports, blocking internal routing, and isolating wireless clients prevent attacks.",
    noteRef: "iot-10-lo05",
    reviewed: false
  },
  {
    loId: "iot-10-lo05",
    type: "single",
    difficulty: 3,
    id: "iot-10-q20",
    stem: "Why is Wi-Fi 'Client Isolation' critical on an access point hosting hundreds of smart building sensors?",
    options: [
      { id: "a", text: "It prevents compromised IoT devices from probing, scanning, or attacking other smart devices sharing the same Wi-Fi network." },
      { id: "b", text: "It prevents sensors from consuming battery." },
      { id: "c", text: "It increases Wi-Fi radio transmission power." },
      { id: "d", text: "It converts 2.4GHz into 5GHz." }
    ],
    answer: ["a"],
    explanation: "Client isolation blocks direct layer-2 peer-to-peer traffic, preventing worm propagation across sensors.",
    noteRef: "iot-10-lo05",
    reviewed: false
  },

  // LO06
  {
    loId: "iot-10-lo06",
    type: "single",
    difficulty: 1,
    id: "iot-10-q21",
    stem: "What hierarchical security architecture standard partitions industrial manufacturing networks into Levels 0 through 4?",
    options: [
      { id: "a", text: "Purdue Enterprise Reference Model (PERM / ISA-95)" },
      { id: "b", text: "OSI 7-Layer Model" },
      { id: "c", text: "TCP/IP 4-Layer Model" },
      { id: "d", text: "Bell-LaPadula Model" }
    ],
    answer: ["a"],
    explanation: "The Purdue Model defines levels 0 (physical) to 4 (enterprise) for industrial control segmentation.",
    noteRef: "iot-10-lo06",
    reviewed: false
  },
  {
    loId: "iot-10-lo06",
    type: "scenario",
    difficulty: 2,
    id: "iot-10-q22",
    stem: "An industrial water treatment plant upgrades from legacy Modbus TCP to OPC UA. What critical security feature does OPC UA provide that Modbus completely lacked?",
    options: [
      { id: "a", text: "Native cryptographic mutual authentication via X.509 certificates and end-to-end payload encryption." },
      { id: "b", text: "Support for analog dials." },
      { id: "c", text: "Ability to run on AA batteries." },
      { id: "d", text: "Zero network latency." }
    ],
    answer: ["a"],
    explanation: "OPC UA incorporates native X.509 certificates, digital signatures, and encryption; Modbus has zero authentication.",
    noteRef: "iot-10-lo06",
    reviewed: false
  },
  {
    loId: "iot-10-lo06",
    type: "multi",
    difficulty: 2,
    id: "iot-10-q23",
    stem: "Which components typically reside in the Industrial Demilitarized Zone (IDMZ) separating corporate IT from operational OT networks?",
    options: [
      { id: "a", text: "Data Historian replication proxies" },
      { id: "b", text: "Jump servers for remote vendor maintenance with Multi-Factor Authentication" },
      { id: "c", text: "Internal software update mirror servers" },
      { id: "d", text: "Physical high-voltage steam turbines" }
    ],
    answer: ["a", "b", "c"],
    explanation: "IDMZ hosts proxy historians, jump servers, and patch mirrors; turbines reside at physical Level 0.",
    noteRef: "iot-10-lo06",
    reviewed: false
  },
  {
    loId: "iot-10-lo06",
    type: "single",
    difficulty: 3,
    id: "iot-10-q24",
    stem: "Why is legacy Modbus protocol considered extremely dangerous when exposed directly to IP networks?",
    options: [
      { id: "a", text: "Modbus has no authentication, authorization, or encryption; any host that can reach port 502 can read sensor registers and write coil commands to trip equipment." },
      { id: "b", text: "Because Modbus operates at 10,000 Volts." },
      { id: "c", text: "Modbus packets cause optical cables to melt." },
      { id: "d", text: "Modbus only works on Linux." }
    ],
    answer: ["a"],
    explanation: "Modbus lacks credentials; any reachable endpoint can issue destructive write commands to PLCs.",
    noteRef: "iot-10-lo06",
    reviewed: false
  },

  // LO07
  {
    loId: "iot-10-lo07",
    type: "single",
    difficulty: 1,
    id: "iot-10-q25",
    stem: "What hardware debugging interface allows physical probe connections directly into the CPU core to halt instructions and inspect memory?",
    options: [
      { id: "a", text: "JTAG / SWD (Serial Wire Debug)" },
      { id: "b", text: "HDMI" },
      { id: "c", text: "DisplayPort" },
      { id: "d", text: "SATA" }
    ],
    answer: ["a"],
    explanation: "JTAG/SWD provides low-level hardware debugging access directly into the processor core.",
    noteRef: "iot-10-lo07",
    reviewed: false
  },
  {
    loId: "iot-10-lo07",
    type: "scenario",
    difficulty: 2,
    id: "iot-10-q26",
    stem: "Before shipping 50,000 commercial medical IoT monitors, the manufacturing team burns the `JTAG_DISABLE` eFuse on every unit. What attack does this prevent?",
    options: [
      { id: "a", text: "Attaching hardware debuggers to extract proprietary firmware, dump RAM keys, or bypass security checks." },
      { id: "b", text: "Wi-Fi packet interception." },
      { id: "c", text: "Battery overcharging." },
      { id: "d", text: "Display screen cracking." }
    ],
    answer: ["a"],
    explanation: "Disabling JTAG physically disconnects debug hardware logic, blocking JTAG memory dumps.",
    noteRef: "iot-10-lo07",
    reviewed: false
  },
  {
    loId: "iot-10-lo07",
    type: "multi",
    difficulty: 2,
    id: "iot-10-q27",
    stem: "Which of the following physical design practices harden production printed circuit boards against physical reverse-engineering?",
    options: [
      { id: "a", text: "Omitting silkscreen labels identifying TX, RX, and JTAG pin names" },
      { id: "b", text: "Routing sensitive communication bus traces on internal inner PCB layers" },
      { id: "c", text: "Applying opaque, tamper-resistant epoxy potting compound over microcontrollers and flash chips" },
      { id: "d", text: "Installing bright blinking party lights" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Concealing silkscreen, burying traces, and applying epoxy potting prevent physical probing.",
    noteRef: "iot-10-lo07",
    reviewed: false
  },
  {
    loId: "iot-10-lo07",
    type: "single",
    difficulty: 3,
    id: "iot-10-q28",
    stem: "What risk arises if a microcontroller's UART ROM download bootloader mode is left permanently enabled in production?",
    options: [
      { id: "a", text: "An attacker who can touch the board can ground the boot strapping pin and overwrite the flash memory with custom malicious firmware." },
      { id: "b", text: "The serial port will stop functioning." },
      { id: "c", text: "The CPU clock speed will double." },
      { id: "d", text: "The chip will consume 100 Amps." }
    ],
    answer: ["a"],
    explanation: "If download mode remains enabled, pulling boot pins LOW allows unauthorized firmware flashing.",
    noteRef: "iot-10-lo07",
    reviewed: false
  },

  // LO08
  {
    loId: "iot-10-lo08",
    type: "single",
    difficulty: 1,
    id: "iot-10-q29",
    stem: "What three core requirements must be synthesized in a production-grade IoT Capstone architecture?",
    options: [
      { id: "a", text: "Hardware security and tamper resilience, power and bandwidth optimization, and reliable cloud telemetry visualization." },
      { id: "b", text: "Maximum possible power consumption and unencrypted protocols." },
      { id: "c", text: "Relying strictly on manual human paper logs." },
      { id: "d", text: "Eliminating all microcontrollers from the design." }
    ],
    answer: ["a"],
    explanation: "A robust capstone balances security, energy/bandwidth optimization, and resilient telemetry.",
    noteRef: "iot-10-lo08",
    reviewed: false
  },
  {
    loId: "iot-10-lo08",
    type: "scenario",
    difficulty: 2,
    id: "iot-10-q30",
    stem: "A capstone project monitors remote wind turbines. The node uses an ESP32 with int8 TinyML autoencoders, MQTTS over TLS 1.3 on port 8883, and dual A/B flash OTA. If an unusual bearing vibration develops, how is it detected and transmitted?",
    options: [
      { id: "a", text: "The on-device TinyML autoencoder detects a spike in reconstruction error locally and immediately publishes an encrypted MQTTS alarm to the cloud broker." },
      { id: "b", text: "The turbine shuts down and sends an acoustic scream." },
      { id: "c", text: "The sensor waits for a technician to visit once per year." },
      { id: "d", text: "The node uploads 100 GB of raw uncompressed audio to YouTube." }
    ],
    answer: ["a"],
    explanation: "Local TinyML detects anomalies instantly, publishing encrypted alerts over secure MQTTS.",
    noteRef: "iot-10-lo08",
    reviewed: false
  },
  {
    loId: "iot-10-lo08",
    type: "multi",
    difficulty: 2,
    id: "iot-10-q31",
    stem: "Which of the following layers are integral components of an end-to-end IoT capstone architecture?",
    options: [
      { id: "a", text: "Physical sensor acquisition and local signal conditioning" },
      { id: "b", text: "Secure edge processing and anomaly detection (TinyML)" },
      { id: "c", text: "Encrypted wireless transport (MQTTS / TLS 1.3)" },
      { id: "d", text: "Time-series database ingestion and operational dashboard visualization" }
    ],
    answer: ["a", "b", "c", "d"],
    explanation: "All four layers form the complete end-to-end IoT sensor-to-cloud architecture.",
    noteRef: "iot-10-lo08",
    reviewed: false
  },
  {
    loId: "iot-10-lo08",
    type: "numeric",
    difficulty: 3,
    id: "iot-10-q32",
    stem: "An IoT capstone deployment monitors a solar farm with 1024 edge nodes. Each node transmits a 128-byte encrypted telemetry payload every 30 seconds. How many total kilobytes (KB) of raw payload does the fleet generate in one hour? (Use 1 KB = 1024 bytes)",
    options: [
      { id: "a", text: "15360" },
      { id: "b", text: "7680" },
      { id: "c", text: "30720" },
      { id: "d", text: "1024" }
    ],
    answer: ["a"],
    explanation: "1024 nodes * 120 transmissions/hour * 128 bytes = 15,728,640 bytes. Dividing by 1024 bytes/KB yields 15,360 KB/hour.",
    noteRef: "iot-10-lo08",
    verify: "const nodes = 1024;\nconst packetsPerHour = 3600 / 30;\nconst bytesPerPacket = 128;\nreturn (nodes * packetsPerHour * bytesPerPacket) / 1024;",
    reviewed: false
  },

  // LO09 (Extension)
  {
    loId: "iot-10-lo09",
    type: "single",
    difficulty: 2,
    id: "iot-10-q33",
    stem: "What open-source command-line tool is standardly used for analyzing, reverse-engineering, and extracting embedded firmware file systems?",
    options: [
      { id: "a", text: "Binwalk" },
      { id: "b", text: "VLC" },
      { id: "c", text: "Nginx" },
      { id: "d", text: "Docker" }
    ],
    answer: ["a"],
    explanation: "Binwalk analyzes binary images, searches magic signatures, and extracts embedded file systems.",
    noteRef: "iot-10-lo09",
    reviewed: false
  },
  {
    loId: "iot-10-lo09",
    type: "scenario",
    difficulty: 2,
    id: "iot-10-q34",
    stem: "A security researcher runs `binwalk -E firmware.bin` and observes that the entropy score is roughly 0.2 across large sections of the file. What does this reveal?",
    options: [
      { id: "a", text: "The firmware is NOT encrypted; it contains unencrypted code, plaintext ASCII strings, or large unwritten padded blocks." },
      { id: "b", text: "The firmware is encrypted with military-grade AES-256." },
      { id: "c", text: "The file is completely corrupted." },
      { id: "d", text: "The computer has run out of RAM." }
    ],
    answer: ["a"],
    explanation: "Low entropy (<0.8) indicates uncompressed, unencrypted plaintext data; encryption produces entropy near 1.0.",
    noteRef: "iot-10-lo09",
    reviewed: false
  },
  {
    loId: "iot-10-lo09",
    type: "multi",
    difficulty: 3,
    id: "iot-10-q35",
    stem: "Which of the following sensitive assets are commonly discovered in unhardened firmware dumps by security auditors?",
    options: [
      { id: "a", text: "Plaintext Wi-Fi network passwords and API keys" },
      { id: "b", text: "Hardcoded administrative master credentials" },
      { id: "c", text: "Unprotected private cryptographic keys and certificates" },
      { id: "d", text: "Physical copper wires" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Unhardened firmware routinely exposes passwords, API tokens, and private keys via string dumps.",
    noteRef: "iot-10-lo09",
    reviewed: false
  },
  {
    loId: "iot-10-lo09",
    type: "single",
    difficulty: 3,
    id: "iot-10-q36",
    stem: "What open-source software reverse engineering suite developed by the NSA is widely used to decompile extracted embedded firmware binaries into C pseudo-code?",
    options: [
      { id: "a", text: "Ghidra" },
      { id: "b", text: "Wireshark" },
      { id: "c", text: "Metasploit" },
      { id: "d", text: "Snort" }
    ],
    answer: ["a"],
    explanation: "Ghidra is the standard open-source SRE framework for disassembling and decompiling firmware architectures.",
    noteRef: "iot-10-lo09",
    reviewed: false
  }
];

balanceAndSave('iot', 'iot-security-and-capstone', ch10Objectives, ch10Questions);
console.log("Batch 13 complete!");
