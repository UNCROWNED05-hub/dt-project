import fs from 'fs';
import path from 'path';

function countWords(str) {
  return str.trim().split(/\s+/).filter(Boolean).length;
}

function writeNoteBlock(courseSlug, chapterSlug, loId, coreIdea, workedExample, commonMistake, checkYourself, isFastMoving = false) {
  const dir = path.join('content', courseSlug, chapterSlug, 'notes');
  fs.mkdirSync(dir, { recursive: true });

  const fastMovingHeader = isFastMoving ? 'lastVerified: "2026-03"\n' : '';
  const fastMovingNote = isFastMoving ? '\n*Last verified: February 2026 against vendor documentation.*\n' : '';

  const fullContent = `---
loId: "${loId}"
reviewed: false
sources:
  - "NIST Special Publications and Cloud Security Alliance (CSA)"
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
// CHAPTER 10: soc-incident-response-and-forensics (sec-10) [moderate]
// ==========================================

const ch10Objectives = {
  version: 1,
  chapterId: "sec-10",
  objectives: [
    {
      id: "sec-10-lo01",
      order: 1,
      title: "Define Security Operations Center (SOC) organizational tiers and alert triage workflows",
      bloom: "define",
      tier: "core",
      mustHave: true,
      keywords: ["soc tiers", "tier 1 triage", "alert fatigue", "escalation matrix", "mean time to detect"],
      aliases: ["soc workflow", "incident triage hierarchy"],
      prerequisites: ["sec-01-lo05"],
      estMinutes: 12
    },
    {
      id: "sec-10-lo02",
      order: 2,
      title: "Aggregate and correlate event logs using Security Information and Event Management (SIEM)",
      bloom: "aggregate",
      tier: "core",
      mustHave: true,
      keywords: ["siem", "log normalization", "event correlation", "syslog", "windows event logs"],
      aliases: ["security log aggregation", "siem correlation"],
      prerequisites: ["sec-03-lo05"],
      estMinutes: 14
    },
    {
      id: "sec-10-lo03",
      order: 3,
      title: "Construct detection logic and correlation rules using Sigma and YARA",
      bloom: "construct",
      tier: "core",
      mustHave: false,
      keywords: ["sigma rules", "yara signatures", "detection engineering", "false positives"],
      aliases: ["detection rules", "sigma syntax"],
      prerequisites: ["sec-10-lo02"],
      estMinutes: 12
    },
    {
      id: "sec-10-lo04",
      order: 4,
      title: "Execute the NIST SP 800-61 Incident Handling Lifecycle",
      bloom: "execute",
      tier: "core",
      mustHave: true,
      keywords: ["nist sp 800-61", "incident response lifecycle", "containment", "eradication", "recovery", "lessons learned"],
      aliases: ["incident handling phases", "nist incident lifecycle"],
      prerequisites: ["sec-01-lo04"],
      estMinutes: 14
    },
    {
      id: "sec-10-lo05",
      order: 5,
      title: "Execute incident containment, eradication, and system recovery playbooks",
      bloom: "execute",
      tier: "core",
      mustHave: false,
      keywords: ["incident playbooks", "network isolation", "eradication", "account disablement", "recovery"],
      aliases: ["containment playbooks", "incident remediation"],
      prerequisites: ["sec-10-lo04"],
      estMinutes: 12
    },
    {
      id: "sec-10-lo06",
      order: 6,
      title: "Preserve forensic artifacts adhering to RFC 3227 Order of Volatility",
      bloom: "preserve",
      tier: "core",
      mustHave: true,
      keywords: ["order of volatility", "rfc 3227", "volatile memory", "live forensics", "ram capture"],
      aliases: ["evidence volatility", "rfc 3227 evidence preservation"],
      prerequisites: ["sec-03-lo02"],
      estMinutes: 12
    },
    {
      id: "sec-10-lo07",
      order: 7,
      title: "Maintain digital forensics chain of custody and forensic disk/memory imaging",
      bloom: "maintain",
      tier: "core",
      mustHave: false,
      keywords: ["chain of custody", "forensic imaging", "cryptographic hash verification", "write blocker"],
      aliases: ["evidence integrity", "digital forensics acquisition"],
      prerequisites: ["sec-10-lo06"],
      estMinutes: 12
    },
    {
      id: "sec-10-lo08",
      order: 8,
      title: "Design resilient backup retention policies (3-2-1 rule) and disaster recovery procedures",
      bloom: "design",
      tier: "core",
      mustHave: false,
      keywords: ["3-2-1 backup rule", "immutable backups", "rto", "rpo", "disaster recovery"],
      aliases: ["backup resilience", "ransomware recovery"],
      prerequisites: ["sec-08-lo03"],
      estMinutes: 12
    },
    {
      id: "sec-10-lo09",
      order: 9,
      title: "Automate incident response using Security Orchestration, Automation, and Response (SOAR)",
      bloom: "automate",
      tier: "extension",
      mustHave: false,
      keywords: ["soar", "automated response", "security orchestration", "webhook trigger", "playbook automation"],
      aliases: ["soar workflows", "automated containment"],
      prerequisites: ["sec-10-lo05"],
      estMinutes: 12
    }
  ]
};

// Notes for sec-10

writeNoteBlock('cybersecurity', 'soc-incident-response-and-forensics', 'sec-10-lo01',
  `A Security Operations Center (SOC) operates as the nerve center for organizational cyber defense, organized into structured operational tiers to counter alert fatigue and ensure rapid escalation:
1. Tier 1 (Triage Analyst): Continuously monitors SIEM and EDR alerts. Reviews incoming detections, eliminates false positives, gathers initial contextual host and user data, and escalates confirmed true positives.
2. Tier 2 (Incident Responder): Conducts deep-dive investigations into escalated incidents, determines attack scope, establishes root causes, and executes containment and remediation playbooks.
3. Tier 3 (Threat Hunter & Forensic Specialist): Proactively hunts for persistent adversaries bypassing automated rules, reverses malware artifacts, and conducts deep endpoint forensics.
4. SOC Lead / Manager: Oversees operational metrics including Mean Time to Detect (MTTD) and Mean Time to Respond (MTTR), manages compliance reporting, and liaises with executive leadership.`,
  `Simulating an automated alert triage severity scoring function:
\`\`\`python
def triage_alert(asset_criticality, indicator_confidence, severity_base):
    # Calculate triage priority score (1 to 10 scale)
    priority_score = (asset_criticality * 0.4) + (indicator_confidence * 0.3) + (severity_base * 0.3)
    if priority_score >= 8.0:
        return "TIER_2_ESCALATION_IMMEDIATE"
    elif priority_score >= 5.0:
        return "TIER_1_INVESTIGATE"
    return "SUPPRESS_OR_AUTO_CLOSE"

# High-value domain controller alert with verified beacon
status = triage_alert(asset_criticality=10, indicator_confidence=9, severity_base=8)
print(f"Triage Decision: {status}") # TIER_2_ESCALATION_IMMEDIATE
\`\`\``,
  `Assuming Tier 1 analysts must resolve all advanced malware infections without escalating. Attempting complex containment without alerting Tier 2 incident responders leads to missed persistence mechanisms and uncontained lateral movement.`,
  `What are the distinct primary responsibilities of a Tier 1 triage analyst compared to a Tier 2 incident responder?`
);

writeNoteBlock('cybersecurity', 'soc-incident-response-and-forensics', 'sec-10-lo02',
  `Security Information and Event Management (SIEM) systems centralize telemetry across servers, endpoints, firewalls, and cloud environments to uncover coordinated attacker activities:
1. Log Collection & Forwarding: Syslog agents, Windows Event Forwarding (WEF), and cloud API integrations feed structured event data into central ingestion queues.
2. Normalization & Parsing: Converts vendor-specific formats (Cisco ASA, Windows XML, Linux Auditd) into standard schemas like the Elastic Common Schema (ECS) or Open Cybersecurity Schema Framework (OCSF).
3. Correlation Engine: Applies temporal and cross-source rules across millions of events. For example, detecting five failed SSH attempts from a single external IP followed immediately by an administrative command execution on the target server.
4. Alert Generation: Triggers actionable notifications for SOC analysts with mapped contextual metadata and asset tags.`,
  `Log aggregation and parsing simulation in Python:
\`\`\`python
import json

raw_log = '{"src_ip": "198.51.100.22", "event_id": 4625, "user": "admin", "status": "FAIL"}'
event = json.loads(raw_log)

def evaluate_correlation(event, fail_count):
    # Rule: Trigger alert if repeated failed logins followed by escalation
    if event["event_id"] == 4625:
        fail_count += 1
    return fail_count >= 5

triggered = evaluate_correlation(event, fail_count=4)
print(f"SIEM Alert Generated: {triggered}") # True
\`\`\``,
  `Treating a SIEM as a passive archival storage system rather than an active correlation platform. Unindexed, unparsed raw log lakes provide zero proactive alerting value during real-time intrusions.`,
  `Why is data normalization (e.g., ECS or OCSF) essential before executing cross-platform SIEM correlation rules?`
);

writeNoteBlock('cybersecurity', 'soc-incident-response-and-forensics', 'sec-10-lo03',
  `Detection engineering codifies adversarial techniques into shared, testable detection rules independent of specific vendor log platforms:
1. Sigma Rules: An open, vendor-agnostic YAML specification for describing log signatures. Sigma rules translate seamlessly into Splunk SPL, Elastic Lucene, Microsoft Sentinel KQL, or SumoLogic queries.
2. Rule Components: A standard Sigma rule defines metadata (title, status, author, description), log sources (category, product, service), detection patterns (selection conditions and Boolean logic), and MITRE ATT&CK technique tags.
3. YARA Signatures: Pattern matching rules designed to identify and classify malware samples, strings, and byte sequences across memory dumps and file storage.
4. False Positive Tuning: Rules must be baselined against benign enterprise noise (such as administrative automation scripts) to maintain low false alarm rates.`,
  `Structure of a vendor-agnostic Sigma detection rule:
\`\`\`yaml
title: Suspicious PowerShell Download Cradle
status: stable
description: Detects command-line invocations downloading remote payloads
logsource:
    category: process_creation
    product: windows
detection:
    selection:
        Image|endswith: '\\powershell.exe'
        CommandLine|contains:
            - 'DownloadString'
            - 'Net.WebClient'
            - 'Invoke-WebRequest'
    condition: selection
level: high
tags:
    - attack.execution
    - attack.t1059.001
\`\`\``,
  `Deploying unbaselined detection rules directly into production blocking modes without testing against historical enterprise logs, causing massive alert floods or breaking legitimate administrative workflows.`,
  `How does writing detection signatures in Sigma syntax enable platform interoperability across different enterprise SIEM engines?`
);

writeNoteBlock('cybersecurity', 'soc-incident-response-and-forensics', 'sec-10-lo04',
  `The NIST SP 800-61 Computer Security Incident Handling Guide standardizes the incident response lifecycle into five structured operational phases:
1. Preparation: Establishing incident response policies, assembling and training the CSIRT, securing communication channels, and provisioning forensic toolkits before an incident occurs.
2. Detection & Analysis: Identifying precursor indicators (threat warnings, vulnerability announcements) and incident indicators (SIEM alerts, anomalous network egress). Determining the attack vector, scope, and severity.
3. Containment: Limiting incident impact through short-term containment (isolating infected subnets) and long-term containment (patching vulnerabilities and isolating compromised service accounts).
4. Eradication & Recovery: Removing all adversarial artifacts (malware binaries, persistence mechanisms) and restoring clean systems from validated backups into production.
5. Post-Incident Activity (Lessons Learned): Conducting post-mortem debriefs to document root causes, calculate financial impact, and upgrade preventative controls within two weeks of closure.`,
  `Simulating an incident response severity triage matrix:
\`\`\`python
def determine_nist_phase_action(phase, alert_confirmed):
    if phase == "Detection" and alert_confirmed:
        return "Declare Incident & Escalate to Containment"
    elif phase == "Containment":
        return "Isolate Network Segment and Revoke Tokens"
    elif phase == "Recovery":
        return "Restore Clean Backups and Monitor Telemetry"
    return "Continue Standard Operations"

action = determine_nist_phase_action("Detection", alert_confirmed=True)
print(f"Operational Directive: {action}")
\`\`\``,
  `Jumping straight from detection to system wipe/reinstallation without completing forensic analysis and containment, allowing the attacker to re-enter through unresolved root causes.`,
  `What critical operational activities must occur during the Post-Incident Activity (Lessons Learned) phase?`
);

writeNoteBlock('cybersecurity', 'soc-incident-response-and-forensics', 'sec-10-lo05',
  `Incident playbooks provide step-by-step technical procedures to guide responders through containment, eradication, and safe restoration during high-stress breaches:
1. Network Isolation: Severing an infected host's network connectivity via EDR agent commands or switch port disabling while keeping the machine powered on to preserve volatile memory.
2. Identity Containment: Immediately invalidating Kerberos tickets (TGT reset), resetting active directory passwords, revoking OAuth session tokens, and disabling compromised service accounts.
3. Eradication: Identifying and removing scheduled tasks, registry Run keys, WMI subscriptions, web shells, and malicious shadow administrator accounts established by the adversary.
4. Validation & Recovery: Restoring systems from verified, pre-infection immutable backups. Rebuilding compromised operating systems from known-good golden images rather than attempting manual sanitization.
5. Enhanced Post-Recovery Telemetry: Applying high-fidelity logging and active hunting rules to the restored environment for at least 30 to 90 days.`,
  `Automating host containment verification via Python:
\`\`\`python
def execute_containment_checks(host_id, is_isolated, tokens_revoked):
    playbook_status = {
        "host": host_id,
        "network_isolated": is_isolated,
        "identity_contained": tokens_revoked,
        "ready_for_eradication": is_isolated and tokens_revoked
    }
    return playbook_status

result = execute_containment_checks("SRV-DB-01", is_isolated=True, tokens_revoked=True)
print(f"Safe to Begin Eradication: {result['ready_for_eradication']}") # True
\`\`\``,
  `Rebooting or pulling the power cord on an infected machine during initial response, permanently destroying active RAM evidence, unencrypted malware payloads, and active network connection state.`,
  `Why must network isolation keep the infected machine powered on rather than performing an immediate hard power shutoff?`
);

writeNoteBlock('cybersecurity', 'soc-incident-response-and-forensics', 'sec-10-lo06',
  `Digital forensic evidence degrades rapidly if not preserved systematically. RFC 3227 establishes the mandatory Order of Volatility, dictating that the most ephemeral data must be collected first:
1. CPU Registers and Cache: The most volatile data; lost in microseconds if system state alters.
2. Routing Tables, ARP Cache, Process Tables, Kernel Statistics, and RAM: Volatile physical memory containing active process listings, unencrypted passwords, network sockets, and injected code.
3. Temporary File Systems and Swap Space: Ephemeral storage on local drives.
4. Non-Volatile Disks (SATA/NVMe/SSD): Hard drive sectors, persistent file systems, and operating system event logs.
5. Remote Logging and Monitoring Data: Centralized SIEM logs, firewall flows, and syslog archives stored off-host.
6. Physical Topologies and Cable Configurations.
7. Archival Media: Backup tapes, optical discs, and offline snapshots.`,
  `Evaluating evidence collection priority according to RFC 3227:
\`\`\`python
volatility_order = [
    (1, "CPU registers and cache"),
    (2, "RAM and live process memory"),
    (3, "Network state and routing tables"),
    (4, "Local disk file systems"),
    (5, "Archival backups and remote logs")
]

# When arriving at a compromised live server:
first_target = min(volatility_order, key=lambda x: x[0])
print(f"First Evidence Collection Target: {first_target[1]}")
\`\`\``,
  `Starting forensic collection by imaging the mechanical hard drive before dumping live physical RAM, completely losing decrypted keys, running process injection artifacts, and live C2 connections.`,
  `According to RFC 3227, why must physical RAM be acquired before taking an offline disk image of an endpoint?`
);

writeNoteBlock('cybersecurity', 'soc-incident-response-and-forensics', 'sec-10-lo07',
  `Forensic evidence must be legally defensible in court proceedings and organizational compliance hearings through strict chain of custody and cryptographic integrity controls:
1. Hardware Write Blockers: Physical bridge devices connecting the suspect drive to the forensic workstation, preventing any write signals or timestamp alterations from reaching original media.
2. Bit-Stream Imaging: Creating sector-by-sector disk clones (using raw DD or E01 Expert Witness formats) that duplicate every allocated and unallocated sector, slack space, and deleted file fragments.
3. Cryptographic Verification: Hashing the source drive with SHA-256 immediately before acquisition, and hashing the resulting forensic image immediately after. The two hashes must match identically.
4. Chain of Custody Documentation: A continuous, immutable ledger recording the exact date, time, evidence tag, collector identity, purpose of transfer, and physical storage location. Any undocumented gap invalidates evidence admissibility.`,
  `Cryptographic hash verification of acquired forensic disk images:
\`\`\`python
import hashlib

def verify_evidence_integrity(source_hash, image_hash):
    if source_hash == image_hash:
        return "INTEGRITY_VERIFIED: Evidence is authentic and unaltered"
    return "INTEGRITY_FAIL: Hashes do not match; evidence compromised"

# Comparing SHA-256 checksums
original_drive_sha256 = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
disk_image_sha256     = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"

print(verify_evidence_integrity(original_drive_sha256, disk_image_sha256))
\`\`\``,
  `Performing analysis directly on the primary suspect media rather than working on verified forensic clones, corrupting metadata access timestamps and compromising legal admissibility.`,
  `What purpose does a hardware write blocker serve during the bit-stream disk acquisition process?`
);

writeNoteBlock('cybersecurity', 'soc-incident-response-and-forensics', 'sec-10-lo08',
  `Data backup and disaster recovery architecture determines whether an enterprise can withstand ransomware extortion and catastrophic data destruction:
1. The 3-2-1 Backup Rule: Maintain at least 3 total copies of data, across 2 different media types (e.g., local NVMe SAN and cloud object store), with 1 copy stored completely off-site or in an air-gapped immutable repository.
2. Immutable Backups: Implementing Write-Once-Read-Many (WORM) storage or S3 Object Lock policies preventing backup deletion or encryption, even if an attacker gains domain administrator credentials.
3. Recovery Point Objective (RPO): The maximum acceptable age of files that must be recovered from backup storage for normal operations to resume (determines backup frequency).
4. Recovery Time Objective (RTO): The maximum acceptable duration of system downtime permitted before business operations are restored.
5. Periodic Restoration Testing: Backups are untrusted until recovery is actively executed and verified in isolated sandbox environments.`,
  `Calculating RPO and RTO compliance in disaster recovery planning:
\`\`\`python
def evaluate_dr_targets(last_backup_age_hours, actual_recovery_hours, rpo_target, rto_target):
    rpo_met = last_backup_age_hours <= rpo_target
    rto_met = actual_recovery_hours <= rto_target
    return {
        "rpo_compliant": rpo_met,
        "rto_compliant": rto_met,
        "dr_ready": rpo_met and rto_met
    }

# Evaluating 4-hour RPO and 2-hour RTO
status = evaluate_dr_targets(last_backup_age_hours=2, actual_recovery_hours=1.5, rpo_target=4, rto_target=2)
print(f"Disaster Recovery SLA Met: {status['dr_ready']}") # True
\`\`\``,
  `Storing online backup shares on domain-joined servers accessible via default administrative credentials, allowing ransomware operators to erase all shadow copies and network backups prior to encryption.`,
  `What is the difference between Recovery Point Objective (RPO) and Recovery Time Objective (RTO)?`
);

writeNoteBlock('cybersecurity', 'soc-incident-response-and-forensics', 'sec-10-lo09',
  `Security Orchestration, Automation, and Response (SOAR) platforms integrate disparate security tools into automated playbooks to eliminate repetitive manual analyst tasks:
1. Orchestration: Connecting disparate APIs across firewalls, EDR platforms, email gateways, identity providers, and ticketing systems into a single programmatic interface.
2. Automation: Executing pre-programmed workflows without human delay, such as submitting suspicious email attachments to sandboxes or checking IP reputations against VirusTotal.
3. Rapid Containment: Automatically isolating compromised endpoints or revoking session tokens when an alert confidence reaches 100%, slashing MTTR from hours to seconds.
4. Human-in-the-Loop Oversight: Requiring explicit analyst approval via interactive Slack, Teams, or ticketing prompts before executing disruptive actions (like shutting down an enterprise domain controller).
5. Continuous Optimization: Tracking playbook success rates and workflow bottlenecks to streamline enterprise response mechanics.`,
  `SOAR automated triage workflow simulation in Python:
\`\`\`python
def soar_phishing_playbook(email_sender, attachment_hash, reputation_score):
    # Step 1: Query threat intelligence
    if reputation_score >= 80:
        # Step 2: Automated containment
        action = f"Block Sender {email_sender} and Purge Email Across Inboxes"
        status = "RESOLVED_AUTOMATED"
    else:
        action = "Forward to Tier 1 SOC Queue for Manual Inspection"
        status = "PENDING_ANALYST"
    return {"status": status, "directive": action}

res = soar_phishing_playbook("phish@evil-domain.com", "e3b0c44...", reputation_score=95)
print(f"SOAR Execution: {res['directive']}")
\`\`\``,
  `Automating high-impact destructive containment actions (such as disabling core routing switches or formatting drives) without human verification safeguards.`,
  `Why do enterprise SOAR playbooks maintain human-in-the-loop checkpoints before executing critical operational containment steps?`
);

// Questions for sec-10
const ch10Questions = [
  // LO01
  {
    loId: "sec-10-lo01",
    type: "single",
    difficulty: 1,
    id: "sec-10-q01",
    stem: "What is the primary responsibility of a Tier 1 SOC Analyst?",
    options: [
      { id: "a", text: "Monitoring incoming SIEM alerts, validating true positives, filtering false alarms, and performing initial alert triage." },
      { id: "b", text: "Conducting multi-day kernel memory forensics." },
      { id: "c", text: "Designing organizational corporate budgets." },
      { id: "d", text: "Writing enterprise security policies." }
    ],
    answer: ["a"],
    explanation: "Tier 1 analysts handle front-line alert triage, verification, and escalation to Tier 2 responders.",
    noteRef: "sec-10-lo01",
    reviewed: false
  },
  {
    loId: "sec-10-lo01",
    type: "scenario",
    difficulty: 2,
    id: "sec-10-q02",
    stem: "A SOC analyst observes 10,000 low-fidelity alerts firing per hour, causing legitimate high-severity alerts to be overlooked. What operational problem does this represent?",
    options: [
      { id: "a", text: "Alert Fatigue" },
      { id: "b", text: "Ransomware detonation" },
      { id: "c", text: "Cryptographic failure" },
      { id: "d", text: "DNS Cache Poisoning" }
    ],
    answer: ["a"],
    explanation: "Alert fatigue occurs when excessive false alarms overwhelm analysts, creating severe risks of missed intrusions.",
    noteRef: "sec-10-lo01",
    reviewed: false
  },
  {
    loId: "sec-10-lo01",
    type: "multi",
    difficulty: 2,
    id: "sec-10-q03",
    stem: "Which of the following metrics are standard operational key performance indicators (KPIs) tracked by SOC leadership?",
    options: [
      { id: "a", text: "Mean Time to Detect (MTTD)" },
      { id: "b", text: "Mean Time to Respond / Remediate (MTTR)" },
      { id: "c", text: "False Positive Ratio" },
      { id: "d", text: "Physical monitor refresh rate" }
    ],
    answer: ["a", "b", "c"],
    explanation: "MTTD, MTTR, and false positive rates quantify detection efficiency and response agility in a SOC.",
    noteRef: "sec-10-lo01",
    reviewed: false
  },
  {
    loId: "sec-10-lo01",
    type: "single",
    difficulty: 3,
    id: "sec-10-q04",
    stem: "How does proactive threat hunting performed by Tier 3 specialists differ fundamentally from traditional alert triage?",
    options: [
      { id: "a", text: "Threat hunting actively hypothesizes and searches for stealthy adversaries that have already bypassed existing automated SIEM detection rules." },
      { id: "b", text: "Threat hunting only runs once per calendar year." },
      { id: "c", text: "Threat hunting relies entirely on off-the-shelf antivirus popup notifications." },
      { id: "d", text: "Threat hunting does not require access to host event logs." }
    ],
    answer: ["a"],
    explanation: "Hunting is hypothesis-driven and manual, uncovering persistent threats invisible to automated signature rules.",
    noteRef: "sec-10-lo01",
    reviewed: false
  },

  // LO02
  {
    loId: "sec-10-lo02",
    type: "single",
    difficulty: 1,
    id: "sec-10-q05",
    stem: "What does SIEM stand for in enterprise cybersecurity operations?",
    options: [
      { id: "a", text: "Security Information and Event Management" },
      { id: "b", text: "Secure Internet Encryption Mechanism" },
      { id: "c", text: "System Isolation and Endpoint Maintenance" },
      { id: "d", text: "Standard Input Environment Module" }
    ],
    answer: ["a"],
    explanation: "SIEM combines security information management (SIM) and security event management (SEM).",
    noteRef: "sec-10-lo02",
    reviewed: false
  },
  {
    loId: "sec-10-lo02",
    type: "scenario",
    difficulty: 2,
    id: "sec-10-q06",
    stem: "A SIEM correlation rule flags an alert because a workstation logged 50 failed Kerberos authentication attempts within 30 seconds followed by a successful admin logon from a new IP. What correlation technique was used?",
    options: [
      { id: "a", text: "Temporal cross-event behavioral correlation" },
      { id: "b", text: "Static dictionary search" },
      { id: "c", text: "Hardware write blocking" },
      { id: "d", text: "Symmetric key generation" }
    ],
    answer: ["a"],
    explanation: "Temporal correlation links multiple discrete events across a time window to detect attack patterns like brute force.",
    noteRef: "sec-10-lo02",
    reviewed: false
  },
  {
    loId: "sec-10-lo02",
    type: "single",
    difficulty: 2,
    id: "sec-10-q07",
    stem: "Why is log normalization to a standard schema (such as ECS or OCSF) essential in enterprise SIEM architectures?",
    options: [
      { id: "a", text: "It maps heterogeneous event logs from diverse vendors into standardized field names, allowing unified queries and correlation rules across the entire fleet." },
      { id: "b", text: "It compresses logs into encrypted ZIP archives." },
      { id: "c", text: "It prevents Windows workstations from rebooting." },
      { id: "d", text: "It encrypts hard drives automatically." }
    ],
    answer: ["a"],
    explanation: "Standard schemas ensure that field names like `source_ip` match across Windows, Linux, and firewall logs.",
    noteRef: "sec-10-lo02",
    reviewed: false
  },
  {
    loId: "sec-10-lo02",
    type: "numeric",
    difficulty: 3,
    id: "sec-10-q08",
    stem: "If a busy enterprise network generates an average of 5,000 events per second (EPS), how many total events must the SIEM ingest across a 60-second window?",
    options: [
      { id: "a", text: "300000" },
      { id: "b", text: "50000" },
      { id: "c", text: "120000" },
      { id: "d", text: "600000" }
    ],
    answer: ["a"],
    explanation: "5,000 EPS * 60 seconds = 300,000 total events.",
    noteRef: "sec-10-lo02",
    verify: "(5000 * 60 === 300000)",
    reviewed: false
  },

  // LO03
  {
    loId: "sec-10-lo03",
    type: "single",
    difficulty: 1,
    id: "sec-10-q09",
    stem: "What is Sigma in modern detection engineering?",
    options: [
      { id: "a", text: "An open, vendor-agnostic signature format for writing log detection rules that translate into various SIEM query languages." },
      { id: "b", text: "A proprietary hardware firewall manufactured by Cisco." },
      { id: "c", text: "A Linux kernel compile-time flag." },
      { id: "d", text: "A type of fiber-optic network cable." }
    ],
    answer: ["a"],
    explanation: "Sigma provides an open YAML specification describing detection rules independent of target SIEM backends.",
    noteRef: "sec-10-lo03",
    reviewed: false
  },
  {
    loId: "sec-10-lo03",
    type: "scenario",
    difficulty: 2,
    id: "sec-10-q10",
    stem: "A detection engineer needs to scan memory dumps and local binaries on disk for specific malware strings and compiled byte patterns. Which tool is purpose-built for this task?",
    options: [
      { id: "a", text: "YARA" },
      { id: "b", text: "Nmap" },
      { id: "c", text: "Wireshark" },
      { id: "d", text: "Burp Suite" }
    ],
    answer: ["a"],
    explanation: "YARA is the standard tool for identifying and classifying malware based on textual or binary patterns.",
    noteRef: "sec-10-lo03",
    reviewed: false
  },
  {
    loId: "sec-10-lo03",
    type: "multi",
    difficulty: 2,
    id: "sec-10-q11",
    stem: "Which of the following sections are standard elements of a valid Sigma detection rule file?",
    options: [
      { id: "a", text: "logsource (e.g., category: process_creation)" },
      { id: "b", text: "detection (selection criteria and condition logic)" },
      { id: "c", text: "tags (e.g., attack.execution)" },
      { id: "d", text: "root_password_hash" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Sigma files structure rules using logsource, detection selections, and tags; passwords are never included.",
    noteRef: "sec-10-lo03",
    reviewed: false
  },
  {
    loId: "sec-10-lo03",
    type: "single",
    difficulty: 3,
    id: "sec-10-q12",
    stem: "Why must newly authored detection rules undergo baselining against historical telemetry before being assigned high alerting priority in production?",
    options: [
      { id: "a", text: "To identify whether legitimate enterprise administrative tools match the rule patterns, preventing massive false positive alert storms." },
      { id: "b", text: "Because SIEM rules expire after 24 hours." },
      { id: "c", text: "To allow attackers time to alter their scripts." },
      { id: "d", text: "To encrypt the SIEM query engine." }
    ],
    answer: ["a"],
    explanation: "Baselining identifies false alarms triggered by benign sysadmin scripts before waking up on-call responders.",
    noteRef: "sec-10-lo03",
    reviewed: false
  },

  // LO04
  {
    loId: "sec-10-lo04",
    type: "single",
    difficulty: 1,
    id: "sec-10-q13",
    stem: "What is the correct sequential order of the Incident Handling Lifecycle according to NIST SP 800-61?",
    options: [
      { id: "a", text: "Preparation -> Detection & Analysis -> Containment, Eradication & Recovery -> Post-Incident Activity" },
      { id: "b", text: "Containment -> Eradication -> Preparation -> Post-Incident Activity" },
      { id: "c", text: "Post-Incident Activity -> Detection -> Eradication -> Preparation" },
      { id: "d", text: "Eradication -> Detection -> Containment -> Preparation" }
    ],
    answer: ["a"],
    explanation: "NIST SP 800-61 defines Preparation, Detection & Analysis, Containment/Eradication/Recovery, and Post-Incident Activity.",
    noteRef: "sec-10-lo04",
    reviewed: false
  },
  {
    loId: "sec-10-lo04",
    type: "scenario",
    difficulty: 2,
    id: "sec-10-q14",
    stem: "Two weeks after recovering from a ransomware breach, the security team convenes with executives to document root causes, review time-to-containment, and update defense playbooks. Which NIST phase is being executed?",
    options: [
      { id: "a", text: "Post-Incident Activity (Lessons Learned)" },
      { id: "b", text: "Preparation" },
      { id: "c", text: "Short-term Containment" },
      { id: "d", text: "Eradication" }
    ],
    answer: ["a"],
    explanation: "Lessons learned debriefs identify preventative gaps and update response procedures after an incident is closed.",
    noteRef: "sec-10-lo04",
    reviewed: false
  },
  {
    loId: "sec-10-lo04",
    type: "multi",
    difficulty: 2,
    id: "sec-10-q15",
    stem: "Which of the following activities belong to the Preparation phase of the NIST incident response lifecycle?",
    options: [
      { id: "a", text: "Establishing secure out-of-band communication channels for responders" },
      { id: "b", text: "Training the CSIRT team through simulated tabletop exercises" },
      { id: "c", text: "Procuring and testing forensic hardware write blockers and acquisition toolkits" },
      { id: "d", text: "Deleting server log files to prevent clutter" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Preparation equips the organization with policies, tools, communication channels, and training before breaches occur.",
    noteRef: "sec-10-lo04",
    reviewed: false
  },
  {
    loId: "sec-10-lo04",
    type: "single",
    difficulty: 3,
    id: "sec-10-q16",
    stem: "Why does NIST SP 800-61 emphasize separating Short-Term Containment from Long-Term Containment?",
    options: [
      { id: "a", text: "Short-term containment limits immediate damage (e.g. isolating subnets) while long-term containment patches systems and establishes clean infrastructure without disrupting operations permanently." },
      { id: "b", text: "Short-term containment requires calling law enforcement, while long-term does not." },
      { id: "c", text: "Long-term containment is only performed if data is unencrypted." },
      { id: "d", text: "Short-term containment can only last 10 seconds." }
    ],
    answer: ["a"],
    explanation: "Short-term containment stops the bleeding (isolation), while long-term prepares the environment for sustainable eradication.",
    noteRef: "sec-10-lo04",
    reviewed: false
  },

  // LO05
  {
    loId: "sec-10-lo05",
    type: "single",
    difficulty: 1,
    id: "sec-10-q17",
    stem: "What is the primary objective of the Containment phase in incident response?",
    options: [
      { id: "a", text: "Preventing the attacker or malware from spreading laterally or exfiltrating data, while preserving volatile evidence." },
      { id: "b", text: "Formatting all hard drives in the enterprise immediately." },
      { id: "c", text: "Negotiating ransom payments." },
      { id: "d", text: "Upgrading office furniture." }
    ],
    answer: ["a"],
    explanation: "Containment halts attack progression and limits operational impact while safeguarding evidence.",
    noteRef: "sec-10-lo05",
    reviewed: false
  },
  {
    loId: "sec-10-lo05",
    type: "scenario",
    difficulty: 2,
    id: "sec-10-q18",
    stem: "An active command-and-control beacon is detected on a critical domain controller. The responder executes an EDR network isolation command rather than pulling the power plug. Why is this preferred?",
    options: [
      { id: "a", text: "Network isolation cuts attacker communication while preserving volatile RAM, process state, and network socket evidence for forensic analysis." },
      { id: "b", text: "Because power plugs cannot be removed on domain controllers." },
      { id: "c", text: "Pulling the plug automatically encrypts the file system." },
      { id: "d", text: "EDR commands speed up hard drive spin rates." }
    ],
    answer: ["a"],
    explanation: "Host isolation severs external connectivity while keeping RAM intact for forensic acquisition.",
    noteRef: "sec-10-lo05",
    reviewed: false
  },
  {
    loId: "sec-10-lo05",
    type: "multi",
    difficulty: 2,
    id: "sec-10-q19",
    stem: "Which actions are standard components of the Eradication phase during incident response?",
    options: [
      { id: "a", text: "Removing malware persistence mechanisms (scheduled tasks, registry run keys, services)" },
      { id: "b", text: "Closing exploited vulnerabilities and applying security patches" },
      { id: "c", text: "Revoking compromised credentials and resetting Kerberos tickets" },
      { id: "d", text: "Publishing unredacted customer data to GitHub" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Eradication eliminates all adversary footprints, backdoors, and root vulnerabilities from the network.",
    noteRef: "sec-10-lo05",
    reviewed: false
  },
  {
    loId: "sec-10-lo05",
    type: "single",
    difficulty: 3,
    id: "sec-10-q20",
    stem: "Why do enterprise incident response teams rebuild compromised operating systems from known-good golden images rather than manually deleting malware files?",
    options: [
      { id: "a", text: "Advanced adversaries frequently install hidden rootkits, WMI subscriptions, and deep persistence hooks that evade manual file-by-file cleaning." },
      { id: "b", text: "Golden images are free while manual deletion costs money." },
      { id: "c", text: "Manual deletion is banned by copyright law." },
      { id: "d", text: "Operating systems cannot run after one virus detection." }
    ],
    answer: ["a"],
    explanation: "Manual cleaning rarely eliminates stealthy rootkits; deploying validated golden images guarantees integrity.",
    noteRef: "sec-10-lo05",
    reviewed: false
  },

  // LO06
  {
    loId: "sec-10-lo06",
    type: "single",
    difficulty: 1,
    id: "sec-10-q21",
    stem: "What internet standard establishes the Order of Volatility for digital evidence preservation?",
    options: [
      { id: "a", text: "RFC 3227" },
      { id: "b", text: "RFC 1918" },
      { id: "c", text: "RFC 791" },
      { id: "d", text: "RFC 2616" }
    ],
    answer: ["a"],
    explanation: "RFC 3227: Guidelines for Evidence Collection and Archiving defines the Order of Volatility.",
    noteRef: "sec-10-lo06",
    reviewed: false
  },
  {
    loId: "sec-10-lo06",
    type: "scenario",
    difficulty: 2,
    id: "sec-10-q22",
    stem: "A forensic responder arrives at a live, running workstation suspected of being involved in a cyber heist. Which artifact must be acquired FIRST under the Order of Volatility?",
    options: [
      { id: "a", text: "CPU registers and Physical RAM" },
      { id: "b", text: "SATA Hard Drive disk image" },
      { id: "c", text: "Offline backup tapes" },
      { id: "d", text: "Printed printer spools" }
    ],
    answer: ["a"],
    explanation: "RAM and CPU state are highly volatile and vanish upon reboot or power loss; they must be acquired first.",
    noteRef: "sec-10-lo06",
    reviewed: false
  },
  {
    loId: "sec-10-lo06",
    type: "single",
    difficulty: 2,
    id: "sec-10-q23",
    stem: "What valuable forensic evidence is preserved exclusively in volatile memory (RAM) and absent from unpowered hard drives?",
    options: [
      { id: "a", text: "Injected fileless malware code, unencrypted memory passwords, and active TCP socket connections." },
      { id: "b", text: "The BIOS manufacturer serial number." },
      { id: "c", text: "The physical dimensions of the computer chassis." },
      { id: "d", text: "The monitor resolution settings." }
    ],
    answer: ["a"],
    explanation: "Fileless malware, in-memory crypto keys, and live network connections exist solely in RAM.",
    noteRef: "sec-10-lo06",
    reviewed: false
  },
  {
    loId: "sec-10-lo06",
    type: "single",
    difficulty: 3,
    id: "sec-10-q24",
    stem: "Why does executing commands directly on a live suspect system modify the evidence state during incident investigation?",
    options: [
      { id: "a", text: "Every launched binary alters memory allocations, updates file access timestamps, and modifies active process IDs in RAM." },
      { id: "b", text: "Because keyboards emit destructive electromagnetic pulses." },
      { id: "c", text: "Operating systems automatically reformat upon analyst login." },
      { id: "d", text: "It causes the power supply to overheat." }
    ],
    answer: ["a"],
    explanation: "Interacting with a live host inevitably overwrites memory pages and changes filesystem access timestamps.",
    noteRef: "sec-10-lo06",
    reviewed: false
  },

  // LO07
  {
    loId: "sec-10-lo07",
    type: "single",
    difficulty: 1,
    id: "sec-10-q25",
    stem: "What is a Chain of Custody document in digital forensics?",
    options: [
      { id: "a", text: "A chronological paper or digital log tracking the receipt, custody, transfer, analysis, and disposition of physical and electronic evidence." },
      { id: "b", text: "A certificate verifying an employee's university degree." },
      { id: "c", text: "A software license for antivirus products." },
      { id: "d", text: "A purchase order for network switches." }
    ],
    answer: ["a"],
    explanation: "Chain of custody proves an unbroken trail of possession to ensure evidence is admissible in court.",
    noteRef: "sec-10-lo07",
    reviewed: false
  },
  {
    loId: "sec-10-lo07",
    type: "scenario",
    difficulty: 2,
    id: "sec-10-q26",
    stem: "An investigator clones a suspect NVMe drive. Before acquisition, the source drive SHA-256 hash is computed as `h1`. After creating the bit-stream disk image, the image SHA-256 hash is computed as `h2`. If `h1 === h2`, what does this prove?",
    options: [
      { id: "a", text: "Cryptographic proof that the disk image is an exact, unaltered bit-for-bit duplicate of the suspect drive." },
      { id: "b", text: "The drive contains no viruses." },
      { id: "c", text: "The hard drive has been securely wiped." },
      { id: "d", text: "The investigator's computer is connected to the internet." }
    ],
    answer: ["a"],
    explanation: "Matching cryptographic hashes verify bit-stream integrity, proving no bytes were added or changed.",
    noteRef: "sec-10-lo07",
    reviewed: false
  },
  {
    loId: "sec-10-lo07",
    type: "single",
    difficulty: 2,
    id: "sec-10-q27",
    stem: "What hardware tool must be placed between a suspect hard drive and the forensic forensic workstation during bit-stream cloning?",
    options: [
      { id: "a", text: "Hardware Write Blocker" },
      { id: "b", text: "Ethernet Hub" },
      { id: "c", text: "HDMI Splitter" },
      { id: "d", text: "Bluetooth Dongle" }
    ],
    answer: ["a"],
    explanation: "Hardware write blockers physically prevent the host operating system from writing any data or altering timestamps on the original media.",
    noteRef: "sec-10-lo07",
    reviewed: false
  },
  {
    loId: "sec-10-lo07",
    type: "single",
    difficulty: 3,
    id: "sec-10-q28",
    stem: "Why are digital forensic analyses performed on forensic clones or disk images rather than on the primary original physical media?",
    options: [
      { id: "a", text: "To protect the original evidence from accidental modification, corruption, or hardware failure during rigorous deep-dive carving and indexing." },
      { id: "b", text: "Because disk images run 500 times faster than original drives." },
      { id: "c", text: "Original drives cannot be connected to forensic workstations." },
      { id: "d", text: "Legal statutes require original drives to be destroyed immediately after imaging." }
    ],
    answer: ["a"],
    explanation: "Working on clones guarantees the pristine preservation of the original source media for courtroom presentation.",
    noteRef: "sec-10-lo07",
    reviewed: false
  },

  // LO08
  {
    loId: "sec-10-lo08",
    type: "single",
    difficulty: 1,
    id: "sec-10-q29",
    stem: "What does the industry-standard 3-2-1 backup strategy dictate?",
    options: [
      { id: "a", text: "At least 3 copies of data, on 2 different media types, with 1 copy stored off-site or in an immutable repository." },
      { id: "b", text: "3 administrators, 2 passwords, 1 server." },
      { id: "c", text: "3 backups per day, lasting 2 hours, using 1 thumb drive." },
      { id: "d", text: "3 cloud providers, 2 firewalls, 1 router." }
    ],
    answer: ["a"],
    explanation: "The 3-2-1 rule ensures redundancy across independent storage media and physical locations.",
    noteRef: "sec-10-lo08",
    reviewed: false
  },
  {
    loId: "sec-10-lo08",
    type: "scenario",
    difficulty: 2,
    id: "sec-10-q30",
    stem: "An enterprise is hit with ransomware at 4:00 PM. Their last successful backup completed at 12:00 PM noon. The business policy states that no more than 6 hours of data loss is tolerable. Is this scenario compliant with the Recovery Point Objective (RPO)?",
    options: [
      { id: "a", text: "Yes, because the 4 hours of data loss is within the 6-hour RPO threshold." },
      { id: "b", text: "No, because any data loss violates RPO." },
      { id: "c", text: "No, because RPO measures recovery speed, not data age." },
      { id: "d", text: "Yes, because backups run once per year." }
    ],
    answer: ["a"],
    explanation: "Data loss span is 4 hours (12 PM to 4 PM), which meets the RPO limit of 6 hours.",
    noteRef: "sec-10-lo08",
    reviewed: false
  },
  {
    loId: "sec-10-lo08",
    type: "numeric",
    difficulty: 2,
    id: "sec-10-q31",
    stem: "If a company's Recovery Time Objective (RTO) is 4 hours, and full system restoration from immutable cloud snapshots completes in 150 minutes, by how many minutes was the RTO satisfied?",
    options: [
      { id: "a", text: "90" },
      { id: "b", text: "30" },
      { id: "c", text: "60" },
      { id: "d", text: "120" }
    ],
    answer: ["a"],
    explanation: "4 hours = 240 minutes. 240 - 150 = 90 minutes ahead of the SLA deadline.",
    noteRef: "sec-10-lo08",
    verify: "(240 - 150 === 90)",
    reviewed: false
  },
  {
    loId: "sec-10-lo08",
    type: "single",
    difficulty: 3,
    id: "sec-10-q32",
    stem: "Why are Write-Once-Read-Many (WORM) immutable backups critical for surviving modern targeted ransomware attacks?",
    options: [
      { id: "a", text: "Even if adversaries compromise enterprise domain administrator credentials, storage lock policies prevent modification or deletion of backup snapshots." },
      { id: "b", text: "Immutable backups eliminate the need for disaster recovery drills." },
      { id: "c", text: "WORM backups make files immune to packet loss." },
      { id: "d", text: "They convert data into uncompressed text files." }
    ],
    answer: ["a"],
    explanation: "WORM/Object Lock locks snapshots cryptographically, preventing compromised admin accounts from wiping backups.",
    noteRef: "sec-10-lo08",
    reviewed: false
  },

  // LO09 (Extension)
  {
    loId: "sec-10-lo09",
    type: "single",
    difficulty: 2,
    id: "sec-10-q33",
    stem: "What primary benefit does a Security Orchestration, Automation, and Response (SOAR) platform provide over standalone SIEM?",
    options: [
      { id: "a", text: "It coordinates disparate security tools via APIs to automate incident response playbooks and accelerate containment." },
      { id: "b", text: "It replaces all human network engineers." },
      { id: "c", text: "It eliminates the need for computer firewalls." },
      { id: "d", text: "It generates hardware passwords." }
    ],
    answer: ["a"],
    explanation: "SOAR links multi-vendor tools and executes automated response actions (e.g. host isolation) programmatically.",
    noteRef: "sec-10-lo09",
    reviewed: false
  },
  {
    loId: "sec-10-lo09",
    type: "scenario",
    difficulty: 2,
    id: "sec-10-q34",
    stem: "A phishing report arrives from an employee. The SOAR playbook extracts the attached hash, queries VirusTotal, identifies it as known trojan malware, purges the email across all user inboxes, and blocks the sender IP on the perimeter firewall. How did SOAR assist the SOC?",
    options: [
      { id: "a", text: "It completed end-to-end enrichment and containment automatically in seconds, eliminating manual analyst toil." },
      { id: "b", text: "It installed the trojan onto the domain controller." },
      { id: "c", text: "It sent an email to the attacker." },
      { id: "d", text: "It turned off the company's electricity." }
    ],
    answer: ["a"],
    explanation: "Automated triage, lookup, mailbox purging, and firewall blocking dramatically lower MTTR.",
    noteRef: "sec-10-lo09",
    reviewed: false
  },
  {
    loId: "sec-10-lo09",
    type: "multi",
    difficulty: 3,
    id: "sec-10-q35",
    stem: "Which of the following actions are commonly automated within enterprise SOAR playbooks?",
    options: [
      { id: "a", text: "Enriching IP and URL reputation using threat intelligence feeds" },
      { id: "b", text: "Triggering endpoint network isolation via EDR APIs" },
      { id: "c", text: "Revoking active session tokens in cloud identity providers" },
      { id: "d", text: "Negotiating payment terms with ransomware syndicates" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Threat enrichment, endpoint isolation, and token revocation are prime SOAR automation targets; ransom negotiations are never automated.",
    noteRef: "sec-10-lo09",
    reviewed: false
  },
  {
    loId: "sec-10-lo09",
    type: "single",
    difficulty: 3,
    id: "sec-10-q36",
    stem: "Why do mature SOC teams incorporate Human-in-the-Loop approval gates in SOAR containment playbooks for tier-1 critical infrastructure?",
    options: [
      { id: "a", text: "To prevent accidental disruption of mission-critical production servers if false positive detections occur." },
      { id: "b", text: "Because SOAR platforms cannot execute code without human typing." },
      { id: "c", text: "To satisfy copyright licensing agreements." },
      { id: "d", text: "Because cloud APIs do not support automation." }
    ],
    answer: ["a"],
    explanation: "Human approval guards against disastrous automated shutdowns of core business services caused by false alerts.",
    noteRef: "sec-10-lo09",
    reviewed: false
  }
];

balanceAndSave('cybersecurity', 'soc-incident-response-and-forensics', ch10Objectives, ch10Questions);

// ==========================================
// CHAPTER 11: cloud-security-devsecops-and-governance (sec-11) [fast-moving]
// ==========================================

const ch11Objectives = {
  version: 1,
  chapterId: "sec-11",
  objectives: [
    {
      id: "sec-11-lo01",
      order: 1,
      title: "Analyze the Cloud Shared Responsibility Model across IaaS, PaaS, and SaaS",
      bloom: "analyze",
      tier: "core",
      mustHave: true,
      keywords: ["shared responsibility", "iaas", "paas", "saas", "csp boundaries"],
      aliases: ["cloud responsibility boundaries", "csp vs customer responsibility"],
      prerequisites: ["sec-01-lo01"],
      estMinutes: 12
    },
    {
      id: "sec-11-lo02",
      order: 2,
      title: "Enforce Cloud Identity & Access Management (IAM) and least privilege policies",
      bloom: "enforce",
      tier: "core",
      mustHave: true,
      keywords: ["cloud iam", "iam roles", "least privilege", "policy evaluation", "temporary credentials"],
      aliases: ["aws iam", "cloud access control"],
      prerequisites: ["sec-05-lo05"],
      estMinutes: 14
    },
    {
      id: "sec-11-lo03",
      order: 3,
      title: "Implement Cloud Security Posture Management (CSPM) and prevent misconfigurations",
      bloom: "implement",
      tier: "core",
      mustHave: false,
      keywords: ["cspm", "s3 bucket security", "cloud misconfiguration", "security hub", "compliance drift"],
      aliases: ["cloud posture management", "s3 bucket exposure"],
      prerequisites: ["sec-11-lo01"],
      estMinutes: 12
    },
    {
      id: "sec-11-lo04",
      order: 4,
      title: "Harden containerized environments (Docker, minimal base images, non-root users)",
      bloom: "harden",
      tier: "core",
      mustHave: true,
      keywords: ["container security", "docker hardening", "distroless images", "non-root user", "cgroups"],
      aliases: ["dockerfile security", "container hardening"],
      prerequisites: ["sec-03-lo01"],
      estMinutes: 14
    },
    {
      id: "sec-11-lo05",
      order: 5,
      title: "Integrate DevSecOps automated security scanning (SAST, DAST, SCA, Secret Scanning)",
      bloom: "integrate",
      tier: "core",
      mustHave: true,
      keywords: ["devsecops", "sast", "dast", "sca", "secret scanning", "shift left"],
      aliases: ["ci/cd pipeline security", "shift-left security"],
      prerequisites: ["sec-06-lo01"],
      estMinutes: 14
    },
    {
      id: "sec-11-lo06",
      order: 6,
      title: "Conduct quantitative and qualitative cybersecurity risk assessments",
      bloom: "conduct",
      tier: "core",
      mustHave: false,
      keywords: ["risk assessment", "ale", "sle", "aro", "risk matrix", "qualitative risk"],
      aliases: ["cyber risk analysis", "ale calculation"],
      prerequisites: ["sec-01-lo02"],
      estMinutes: 12
    },
    {
      id: "sec-11-lo07",
      order: 7,
      title: "Map compliance controls across NIST CSF 2.0 and ISO/IEC 27001",
      bloom: "map",
      tier: "core",
      mustHave: false,
      keywords: ["nist csf 2.0", "iso 27001", "compliance frameworks", "isms", "governance"],
      aliases: ["security governance", "nist csf functions"],
      prerequisites: ["sec-11-lo06"],
      estMinutes: 12
    },
    {
      id: "sec-11-lo08",
      order: 8,
      title: "Implement privacy regulations including GDPR and India's DPDP Act 2023",
      bloom: "implement",
      tier: "core",
      mustHave: false,
      keywords: ["gdpr", "dpdp act 2023", "data fiduciary", "privacy by design", "data principal rights"],
      aliases: ["privacy compliance", "digital personal data protection"],
      prerequisites: ["sec-01-lo06"],
      estMinutes: 12
    },
    {
      id: "sec-11-lo09",
      order: 9,
      title: "Automate Infrastructure as Code (IaC) security linting and policy enforcement",
      bloom: "automate",
      tier: "extension",
      mustHave: false,
      keywords: ["iac security", "terraform scanning", "checkov", "tflint", "policy-as-code"],
      aliases: ["infrastructure as code security", "policy as code"],
      prerequisites: ["sec-11-lo05"],
      estMinutes: 12
    }
  ]
};

// Notes for sec-11 [fast-moving]

writeNoteBlock('cybersecurity', 'cloud-security-devsecops-and-governance', 'sec-11-lo01',
  `The Cloud Shared Responsibility Model establishes the precise legal and operational boundary separating customer duties from Cloud Service Provider (CSP) responsibilities:
1. Security OF the Cloud (Provider Duty): The CSP (AWS, Google Cloud, Azure) owns physical data centers, host hardware, power, physical networking, hypervisor isolation, and facility security.
2. Security IN the Cloud (Customer Duty): The customer retains full ownership and accountability for data classification, customer IAM permissions, network firewall configurations, operating systems, and application security.
3. Service Model Variations:
   - Infrastructure as a Service (IaaS): Customer manages OS patching, firewalls, runtimes, and applications.
   - Platform as a Service (PaaS): Provider manages the underlying OS and runtime; customer secures application code, databases, and configuration.
   - Software as a Service (SaaS): Provider manages the entire stack; customer is solely responsible for user identity, data access policies, and endpoint security.`,
  `Simulating shared responsibility division across service tiers in Python:
\`\`\`python
def determine_security_responsibility(service_model, component):
    csp_duties = {
        "IaaS": ["physical_hardware", "hypervisor", "datacenter_security"],
        "PaaS": ["physical_hardware", "hypervisor", "operating_system", "runtime_patching"],
        "SaaS": ["physical_hardware", "hypervisor", "operating_system", "runtime", "application_code"]
    }
    if component in csp_duties.get(service_model, []):
        return "CLOUD_PROVIDER"
    return "CUSTOMER"

# Customer is always responsible for customer data across all models
print(determine_security_responsibility("IaaS", "operating_system")) # CUSTOMER
print(determine_security_responsibility("SaaS", "operating_system")) # CLOUD_PROVIDER
\`\`\``,
  `Assuming moving workloads to AWS or Azure relieves the customer from configuring firewalls, securing API access keys, or encrypting stored customer data. Customers retain 100% responsibility for their data in all models.`,
  `Who is responsible for applying operating system security patches in an IaaS environment compared to a PaaS environment?`,
  true
);

writeNoteBlock('cybersecurity', 'cloud-security-devsecops-and-governance', 'sec-11-lo02',
  `Cloud Identity and Access Management (IAM) serves as the primary security perimeter in cloud architectures, enforcing strict authentication, authorization, and least privilege:
1. Principles of Cloud IAM: Every request evaluates principal identity, actions, target resources, and conditional context. No access is granted unless an explicit Allow statement exists without any matching Deny statements.
2. Roles vs. Long-Lived Access Keys: Never hardcode permanent AWS secret access keys or service account credentials in code. Applications must assume temporary IAM Roles via metadata services (STS, instance profiles, or workload identity).
3. Least Privilege Policy Design: Avoid wildcard permissions (\`Action: "*"\`). Restrict actions to specific API calls on named Amazon Resource Names (ARNs) or GCP resource URIs.
4. Condition Blocks: Mandate Multi-Factor Authentication (\`aws:MultiFactorAuthPresent\`), restrict source IP CIDRs, and require TLS encryption (\`aws:SecureTransport\`).`,
  `A secure, least-privilege AWS IAM JSON policy granting read-only access to a specific bucket:
\`\`\`json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowSpecificBucketRead",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::corporate-finance-prod",
        "arn:aws:s3:::corporate-finance-prod/*"
      ],
      "Condition": {
        "Bool": {
          "aws:SecureTransport": "true"
        }
      }
    }
  ]
}
\`\`\``,
  `Attaching full administrator privileges (\`AdministratorAccess\`) to EC2 instances or Lambda functions to resolve permission errors during development, exposing entire cloud accounts to takeover if the application is breached.`,
  `Why are short-lived IAM roles and temporary session tokens significantly more secure than static access keys?`,
  true
);

writeNoteBlock('cybersecurity', 'cloud-security-devsecops-and-governance', 'sec-11-lo03',
  `Cloud Security Posture Management (CSPM) continuously audits cloud infrastructure against security baselines to detect and automatically remediate dangerous misconfigurations:
1. Common Cloud Misconfigurations: Publicly readable S3 buckets, unrestricted security groups (0.0.0.0/0 on port 22/3389), disabled multi-region audit trails (CloudTrail), and unencrypted data volumes.
2. Continuous Compliance Monitoring: Tools like AWS Security Hub, GCP Security Command Center, and open-source scanners (Prowler, ScoutSuite) ingest resource states and score posture against CIS Cloud Benchmarks.
3. Drift Detection: Identifies manual, out-of-band changes applied in the cloud web console that bypass approved Infrastructure as Code (Terraform) pipelines.
4. Automated Remediation: Triggers serverless functions (AWS Lambda) upon detection events to immediately revoke public access or terminate non-compliant instances within seconds.`,
  `Simulating CSPM S3 public access audit in Python:
\`\`\`python
def audit_s3_bucket(bucket_policy):
    # Rule: Detect public wildcard read permissions
    is_public = False
    for statement in bucket_policy.get("Statement", []):
        if statement.get("Principal") == "*" and statement.get("Effect") == "Allow":
            is_public = True
            break
    if is_public:
        return {"compliant": False, "finding": "CRITICAL: Publicly accessible S3 bucket detected"}
    return {"compliant": True, "finding": "PASS"}

policy = {"Statement": [{"Effect": "Allow", "Principal": "*", "Action": "s3:GetObject"}]}
print(audit_s3_bucket(policy)["finding"])
\`\`\``,
  `Relying on periodic manual audits rather than continuous automated CSPM monitoring; manual checks miss transient misconfigurations introduced during continuous deployment cycles.`,
  `What risk does an unrestricted 0.0.0.0/0 security group rule on port 22 pose to cloud compute instances?`,
  true
);

writeNoteBlock('cybersecurity', 'cloud-security-devsecops-and-governance', 'sec-11-lo04',
  `Container security protects microservice workloads by enforcing defense-in-depth across image build, runtime execution, and host kernel boundaries:
1. Minimal Base Images: Standard OS images (Ubuntu, Debian) contain hundreds of unnecessary utilities (curl, bash, apt) that expand the attack surface. Use Distroless, Alpine, or scratch images containing only the compiled binary and runtime.
2. Non-Root Execution: By default, Docker runs containers as UID 0 (root). If a container escape occurs, the attacker gains host root access. Always declare an unprivileged user (\`USER 10001:10001\`).
3. Read-Only Root Filesystems: Mounting container filesystems with \`read_only: true\` prevents malware from dropping persistence scripts or downloading secondary stages into \`/tmp\` or \`/bin\`.
4. Kernel Capabilities & cgroups: Drop all Linux capabilities (\`cap_drop: ["ALL"]\`) and add back only strictly necessary capabilities. Restrict CPU and memory limits to prevent host denial of service.`,
  `A hardened, multi-stage Dockerfile adhering to container security best practices:
\`\`\`dockerfile
# Stage 1: Build environment
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

# Stage 2: Hardened, unprivileged runtime
FROM gcr.io/distroless/nodejs20-debian12
WORKDIR /app
COPY --from=builder /app /app
# Run as non-root user
USER 65532:65532
EXPOSE 8080
CMD ["server.js"]
\`\`\``,
  `Running production containers in privileged mode (\`--privileged\`) or running as the default root user, enabling trivial container breakout to the host operating system kernel.`,
  `Why does building containers with Distroless base images drastically reduce reported CVE vulnerabilities?`,
  true
);

writeNoteBlock('cybersecurity', 'cloud-security-devsecops-and-governance', 'sec-11-lo05',
  `DevSecOps integrates automated security controls into every stage of the modern CI/CD software delivery pipeline (Shifting Left):
1. Pre-Commit / Secret Scanning: Tools like Gitleaks and TruffleHog scan local commits and pull requests for exposed API keys, private certificates, and AWS tokens before code reaches public repositories.
2. Static Application Security Testing (SAST): Scans uncompiled source code for programmatic security flaws (SQL injection, XSS, insecure deserialization) using tools like Semgrep, SonarQube, or CodeQL.
3. Software Composition Analysis (SCA): Analyzes open-source third-party dependencies (npm, pip, Maven) for known CVEs and license violations using tools like Snyk or OWASP Dependency-Check.
4. Dynamic Application Security Testing (DAST): Probes running staging applications from an external perspective using automated scanners (OWASP ZAP) to uncover runtime misconfigurations.
5. Pipeline Quality Gates: Automated breaking rules that halt deployment if critical vulnerabilities or hardcoded secrets are detected.`,
  `Simulating automated CI/CD pipeline security gating in Python:
\`\`\`python
def evaluate_pipeline_gate(secret_scan_clean, critical_cves_count, sast_clean):
    if not secret_scan_clean:
        return "BUILD_BLOCKED: Hardcoded secrets detected in commit"
    if critical_cves_count > 0:
        return f"BUILD_BLOCKED: {critical_cves_count} Critical CVEs found in dependencies"
    if not sast_clean:
        return "BUILD_BLOCKED: High-severity SAST security vulnerabilities found"
    return "BUILD_PASSED: Deploying to staging environment"

gate_status = evaluate_pipeline_gate(secret_scan_clean=True, critical_cves_count=0, sast_clean=True)
print(gate_status) # BUILD_PASSED
\`\`\``,
  `Treating security as a final gatekeeper audit immediately before production release rather than integrating automated scanner feedback into developer IDEs and PR workflows.`,
  `How does Static Application Security Testing (SAST) differ from Dynamic Application Security Testing (DAST) in a CI/CD pipeline?`,
  true
);

writeNoteBlock('cybersecurity', 'cloud-security-devsecops-and-governance', 'sec-11-lo06',
  `Cybersecurity risk management enables organizations to quantify threats and prioritize security investments using structured methodologies:
1. Quantitative Risk Assessment: Calculates precise monetary values to estimate expected financial losses:
   - Asset Value (AV): The total business value of the affected asset.
   - Exposure Factor (EF): The percentage of asset value lost if an incident occurs.
   - Single Loss Expectancy (SLE): \`SLE = AV * EF\`.
   - Annualized Rate of Occurrence (ARO): Estimated frequency of the incident per year.
   - Annualized Loss Expectancy (ALE): \`ALE = SLE * ARO\`.
2. Qualitative Risk Assessment: Uses subjective ratings (Likelihood vs. Impact matrix: Low, Medium, High, Critical) to categorize operational risks when exact monetary values cannot be calculated.
3. Risk Treatment Strategies:
   - Mitigation: Implementing defense controls to reduce probability or impact.
   - Transference: Offloading risk via cyber insurance or vendor SLAs.
   - Avoidance: Discontinuing risky business activities entirely.
   - Acceptance: Formally acknowledging residual risk within defined risk appetite thresholds.`,
  `Calculating quantitative Annualized Loss Expectancy (ALE) in Python:
\`\`\`python
def calculate_ale(asset_value, exposure_factor, aro):
    sle = asset_value * exposure_factor
    ale = sle * aro
    return {"sle": sle, "ale": ale}

# Example: E-commerce database worth $500,000, 40% loss per breach, expected once every 2 years (ARO = 0.5)
res = calculate_ale(asset_value=500000, exposure_factor=0.40, aro=0.5)
print(f"Single Loss Expectancy (SLE): \${res['sle']}") # $200,000
print(f"Annualized Loss Expectancy (ALE): \${res['ale']}") # $100,000
\`\`\``,
  `Spending \$200,000 annually on a security control to protect an asset with an Annualized Loss Expectancy (ALE) of only \$20,000, failing basic cost-benefit risk economics.`,
  `How is Annualized Loss Expectancy (ALE) calculated from Single Loss Expectancy (SLE) and Annualized Rate of Occurrence (ARO)?`,
  true
);

writeNoteBlock('cybersecurity', 'cloud-security-devsecops-and-governance', 'sec-11-lo07',
  `Security frameworks establish standardized governance controls, policies, and operational structures to guide enterprise cybersecurity maturity:
1. NIST Cybersecurity Framework (CSF 2.0): Organizes enterprise security activities into six core functions:
   - Govern: Establish organizational cybersecurity risk management strategy, expectations, and policy.
   - Identify: Understand cybersecurity risks to assets, individuals, and supply chains.
   - Protect: Implement safeguards to ensure delivery of critical services (access control, training, data security).
   - Detect: Identify the occurrence of a cybersecurity event in real time.
   - Respond: Take action regarding a detected cybersecurity incident.
   - Recover: Restore capabilities and services impaired due to an incident.
2. ISO/IEC 27001: The international gold standard for implementing an Information Security Management System (ISMS). Requires formal leadership commitment, risk treatment plans, and continuous audit controls outlined in Annex A.
3. SOC 2 Type II: An independent third-party audit evaluating a service organization's controls over time against the AICPA Trust Services Criteria (Security, Availability, Confidentiality).`,
  `Mapping operational tasks to NIST CSF 2.0 Core Functions in Python:
\`\`\`python
nist_csf_functions = {
    "IAM_RBAC": "Protect",
    "SIEM_Alerting": "Detect",
    "Post_Incident_Playbook": "Respond",
    "WORM_Backup_Restoration": "Recover",
    "Asset_Inventory_Discovery": "Identify",
    "Risk_Management_Policy": "Govern"
}

task = "SIEM_Alerting"
print(f"Operational Task '{task}' maps to NIST CSF Function: {nist_csf_functions[task]}")
\`\`\``,
  `Treating compliance frameworks as a check-the-box paper exercise rather than continuously operationalized engineering controls, creating a false sense of security.`,
  `What new core function was introduced in NIST CSF 2.0 to oversee enterprise risk strategy and policy?`,
  true
);

writeNoteBlock('cybersecurity', 'cloud-security-devsecops-and-governance', 'sec-11-lo08',
  `Modern data privacy legislation mandates that engineering systems enforce privacy-by-design and respect individual data rights under severe penalty:
1. General Data Protection Regulation (GDPR - EU): Establishes extraterritorial rights for individuals (Data Subjects). Enforces strict consent rules, 72-hour mandatory breach notification deadlines, and fines up to 4% of global annual turnover or €20 million.
2. India's Digital Personal Data Protection (DPDP) Act 2023:
   - Data Principal: The individual to whom the personal data relates.
   - Data Fiduciary: Any entity determining the purpose and means of processing personal data.
   - Lawful Processing: Data must be processed solely for lawful purposes for which explicit, verifiable consent is obtained, or for certain legitimate uses.
   - Severe Penalties: Financial penalties up to ₹250 crore (₹2.5 billion) for failure to take reasonable security safeguards to prevent personal data breaches.
3. Core Technical Principles:
   - Purpose Limitation: Data collected for one reason cannot be used for unrelated secondary purposes without new consent.
   - Data Minimization: Store only the minimum data strictly necessary to fulfill the business function.
   - Right to Erasure / Right to be Forgotten: Cryptographically shredding or deleting records upon user request.`,
  `Simulating a privacy data minimization check in Python:
\`\`\`python
def audit_data_minimization(required_fields, collected_fields):
    unnecessary_data = [f for f in collected_fields if f not in required_fields]
    if unnecessary_data:
        return {"compliant": False, "violation": f"Excess data collected: {unnecessary_data}"}
    return {"compliant": True, "violation": "None"}

req = ["user_id", "email", "hashed_password"]
collected = ["user_id", "email", "hashed_password", "gps_coordinates", "blood_group"]
res = audit_data_minimization(req, collected)
print(f"Privacy Audit: {res['violation']}")
\`\`\``,
  `Failing to notify regulatory authorities within the mandatory 72-hour window after discovering a confirmed personal data breach, triggering maximum statutory fines.`,
  `Under India's DPDP Act 2023, what is the term used for the individual whose personal data is being processed?`,
  true
);

writeNoteBlock('cybersecurity', 'cloud-security-devsecops-and-governance', 'sec-11-lo09',
  `Infrastructure as Code (IaC) security applies automated static analysis and policy-as-code to cloud declarative templates (Terraform, CloudFormation, Kubernetes YAML) before provisioning:
1. Policy-as-Code: Tools like Open Policy Agent (OPA) and Rego evaluate cloud infrastructure definitions against organizational security policies at pull-request time.
2. Static IaC Scanners: Scanners like Checkov, tfsec, and KICS parse Terraform plans and detect insecure defaults (unencrypted EBS volumes, public security groups, missing logging configurations).
3. Shift-Left Cost Savings: Remediating a cloud misconfiguration in a Terraform file takes minutes and costs pennies; remediating the same flaw after deployment or breach costs thousands of dollars.
4. GitOps Security: Storing all infrastructure state in cryptographically signed Git repositories, enforcing automated pipeline verification and rejecting any direct web console changes.`,
  `Example of a Checkov rule detecting unencrypted AWS S3 bucket resources in Terraform:
\`\`\`hcl
# Insecure: Lacks server-side encryption configuration
resource "aws_s3_bucket" "insecure_bucket" {
  bucket = "company-data-insecure"
}

# Secure: Hardened with AES-256 server-side encryption
resource "aws_s3_bucket" "secure_bucket" {
  bucket = "company-data-secure"
}

resource "aws_s3_bucket_server_side_encryption_configuration" "secure_sse" {
  bucket = aws_s3_bucket.secure_bucket.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}
\`\`\``,
  `Allowing developers to manually provision production cloud resources via the web console without passing through IaC scanning pipelines, creating unmonitored security blind spots.`,
  `What primary advantage does scanning Terraform templates with Checkov or tfsec provide over post-deployment scanning?`,
  true
);

// Questions for sec-11
const ch11Questions = [
  // LO01
  {
    loId: "sec-11-lo01",
    type: "single",
    difficulty: 1,
    id: "sec-11-q01",
    stem: "Under the Cloud Shared Responsibility Model, what is the customer ALWAYS responsible for across all cloud models (IaaS, PaaS, SaaS)?",
    options: [
      { id: "a", text: "Customer data, identity access management, and endpoint configurations." },
      { id: "b", text: "Physical data center power and air conditioning." },
      { id: "c", text: "Hypervisor hardware maintenance." },
      { id: "d", text: "Undersea fiber optic cabling." }
    ],
    answer: ["a"],
    explanation: "Customers retain full responsibility for their data classification, user access, and identity across every service model.",
    noteRef: "sec-11-lo01",
    reviewed: false
  },
  {
    loId: "sec-11-lo01",
    type: "scenario",
    difficulty: 2,
    id: "sec-11-q02",
    stem: "A company deploys an Ubuntu Linux virtual machine on AWS EC2 (IaaS). Six months later, the server is compromised through an unpatched OpenSSH vulnerability. Who failed their security responsibility?",
    options: [
      { id: "a", text: "The customer, because in IaaS the customer owns guest operating system patching and maintenance." },
      { id: "b", text: "AWS, because AWS guarantees that all EC2 instances are patched automatically." },
      { id: "c", text: "The hardware manufacturer of the Intel CPU." },
      { id: "d", text: "The internet service provider." }
    ],
    answer: ["a"],
    explanation: "In IaaS, the cloud provider manages host hardware while the customer is responsible for guest OS patching.",
    noteRef: "sec-11-lo01",
    reviewed: false
  },
  {
    loId: "sec-11-lo01",
    type: "multi",
    difficulty: 2,
    id: "sec-11-q03",
    stem: "Which of the following responsibilities belong to the Cloud Service Provider (CSP) in an Infrastructure as a Service (IaaS) deployment?",
    options: [
      { id: "a", text: "Physical datacenter perimeter security and biometric facility access" },
      { id: "b", text: "Physical server hardware replacement and hypervisor virtualization layer" },
      { id: "c", text: "Core physical network infrastructure" },
      { id: "d", text: "Customer IAM role definitions and user passwords" }
    ],
    answer: ["a", "b", "c"],
    explanation: "The CSP secures physical facilities, hardware, and hypervisors; customers configure IAM and access.",
    noteRef: "sec-11-lo01",
    reviewed: false
  },
  {
    loId: "sec-11-lo01",
    type: "single",
    difficulty: 3,
    id: "sec-11-q04",
    stem: "How does the security boundary shift between IaaS and PaaS (such as AWS Elastic Beanstalk or GCP App Engine)?",
    options: [
      { id: "a", text: "In PaaS, the cloud provider assumes responsibility for the underlying operating system and language runtime, leaving only the application code and data to the customer." },
      { id: "b", text: "In PaaS, the customer must manufacture their own server motherboards." },
      { id: "c", text: "In PaaS, the provider takes ownership of all customer intellectual property." },
      { id: "d", text: "There is no operational difference between IaaS and PaaS." }
    ],
    answer: ["a"],
    explanation: "PaaS abstracts the underlying OS and middleware patching, transferring those operational duties to the provider.",
    noteRef: "sec-11-lo01",
    reviewed: false
  },

  // LO02
  {
    loId: "sec-11-lo02",
    type: "single",
    difficulty: 1,
    id: "sec-11-q05",
    stem: "What is the primary danger of using long-lived static AWS access keys in application source code?",
    options: [
      { id: "a", text: "They can be accidentally committed to public repositories, enabling unauthorized adversaries to gain permanent account access." },
      { id: "b", text: "They slow down web server execution speed." },
      { id: "c", text: "They expire automatically every 10 seconds." },
      { id: "d", text: "They cause DNS servers to crash." }
    ],
    answer: ["a"],
    explanation: "Hardcoded static credentials in git repos are routinely scraped by automated botnets within minutes of exposure.",
    noteRef: "sec-11-lo02",
    reviewed: false
  },
  {
    loId: "sec-11-lo02",
    type: "scenario",
    difficulty: 2,
    id: "sec-11-q06",
    stem: "A microservice running on AWS EC2 needs to read files from a private S3 bucket. What is the most secure architectural mechanism to authorize the application?",
    options: [
      { id: "a", text: "Attach an IAM Role via an EC2 Instance Profile that issues short-lived temporary credentials automatically." },
      { id: "b", text: "Save the root AWS account password in an unencrypted text file on the server desktop." },
      { id: "c", text: "Make the entire S3 bucket publicly readable to the world." },
      { id: "d", text: "Hardcode the admin access key into the frontend HTML code." }
    ],
    answer: ["a"],
    explanation: "Instance profiles assign IAM roles with automatic rotating temporary tokens, eliminating credential leaks.",
    noteRef: "sec-11-lo02",
    reviewed: false
  },
  {
    loId: "sec-11-lo02",
    type: "multi",
    difficulty: 2,
    id: "sec-11-q07",
    stem: "Which conditions can be enforced in an enterprise cloud IAM policy statement to harden access controls?",
    options: [
      { id: "a", text: "Requiring Multi-Factor Authentication (`aws:MultiFactorAuthPresent`)" },
      { id: "b", text: "Enforcing encrypted HTTPS transport (`aws:SecureTransport: true`)" },
      { id: "c", text: "Restricting access to approved corporate IP CIDR blocks (`aws:SourceIp`)" },
      { id: "d", text: "Mandating that developers use specific keyboard models" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Cloud IAM condition blocks enforce MFA, encryption in transit, and corporate IP boundaries.",
    noteRef: "sec-11-lo02",
    reviewed: false
  },
  {
    loId: "sec-11-lo02",
    type: "single",
    difficulty: 3,
    id: "sec-11-q08",
    stem: "In AWS IAM policy evaluation logic, how does an explicit Deny statement interact with an explicit Allow statement targeting the same action?",
    options: [
      { id: "a", text: "An explicit Deny ALWAYS overrides any explicit Allow, resulting in access denial." },
      { id: "b", text: "An explicit Allow overrides an explicit Deny." },
      { id: "c", text: "The two statements cancel out and generate a random decision." },
      { id: "d", text: "The policy with the shortest name takes precedence." }
    ],
    answer: ["a"],
    explanation: "AWS policy evaluation enforces the principle of ultimate authority: an explicit Deny always wins.",
    noteRef: "sec-11-lo02",
    reviewed: false
  },

  // LO03
  {
    loId: "sec-11-lo03",
    type: "single",
    difficulty: 1,
    id: "sec-11-q09",
    stem: "What does CSPM stand for in modern cloud security architecture?",
    options: [
      { id: "a", text: "Cloud Security Posture Management" },
      { id: "b", text: "Certified Software Protection Mechanism" },
      { id: "c", text: "Centralized System Password Manager" },
      { id: "d", text: "Compute Server Performance Monitor" }
    ],
    answer: ["a"],
    explanation: "CSPM tools continuously audit cloud configurations against security standards and compliance benchmarks.",
    noteRef: "sec-11-lo03",
    reviewed: false
  },
  {
    loId: "sec-11-lo03",
    type: "scenario",
    difficulty: 2,
    id: "sec-11-q10",
    stem: "A developer modifies an AWS Security Group in the console to allow inbound TCP port 22 from 0.0.0.0/0 to troubleshoot a connection. Why does a CSPM flag this as a critical finding?",
    options: [
      { id: "a", text: "Exposing SSH management ports to the public internet leaves the host vulnerable to automated brute-force attacks and zero-day exploits." },
      { id: "b", text: "Port 22 is reserved exclusively for web browser traffic." },
      { id: "c", text: "SSH connections consume 100% of network bandwidth." },
      { id: "d", text: "AWS charges \$10,000 per hour for port 22." }
    ],
    answer: ["a"],
    explanation: "Exposing SSH (22) or RDP (3389) publicly to 0.0.0.0/0 creates severe exposure to brute force and credential stuffing.",
    noteRef: "sec-11-lo03",
    reviewed: false
  },
  {
    loId: "sec-11-lo03",
    type: "single",
    difficulty: 2,
    id: "sec-11-q11",
    stem: "What is 'configuration drift' in cloud infrastructure environments?",
    options: [
      { id: "a", text: "Discrepancies that occur when cloud resources are manually modified in the web console, deviating from the declared Infrastructure-as-Code (Terraform) state." },
      { id: "b", text: "Physical movement of servers between data centers." },
      { id: "c", text: "A gradual decrease in network bandwidth over time." },
      { id: "d", text: "Changes in local room temperature around cloud servers." }
    ],
    answer: ["a"],
    explanation: "Drift happens when ad-hoc manual changes cause live cloud states to diverge from baseline code templates.",
    noteRef: "sec-11-lo03",
    reviewed: false
  },
  {
    loId: "sec-11-lo03",
    type: "single",
    difficulty: 3,
    id: "sec-11-q12",
    stem: "How does automated CSPM remediation (such as invoking an AWS Lambda function upon a CloudWatch alert) enhance defense?",
    options: [
      { id: "a", text: "It reduces the Mean Time to Remediate (MTTR) by automatically revoking dangerous misconfigurations (e.g. closing a public S3 bucket) within seconds of creation." },
      { id: "b", text: "It prevents users from using strong passwords." },
      { id: "c", text: "It replaces all cloud storage with local floppy disks." },
      { id: "d", text: "It encrypts the internet gateway permanently." }
    ],
    answer: ["a"],
    explanation: "Event-driven automated remediation closes exposure windows immediately without waiting for human intervention.",
    noteRef: "sec-11-lo03",
    reviewed: false
  },

  // LO04
  {
    loId: "sec-11-lo04",
    type: "single",
    difficulty: 1,
    id: "sec-11-q13",
    stem: "Why is running production containers as the default root user (UID 0) considered dangerous?",
    options: [
      { id: "a", text: "If an adversary achieves a container breakout via a kernel vulnerability, they immediately obtain full root privileges on the host operating system." },
      { id: "b", text: "Root containers cannot connect to the internet." },
      { id: "c", text: "Docker requires payment for root user execution." },
      { id: "d", text: "Root containers consume 100% of RAM on launch." }
    ],
    answer: ["a"],
    explanation: "Container root shares UID 0 with host root; breaking isolation yields immediate host compromise.",
    noteRef: "sec-11-lo04",
    reviewed: false
  },
  {
    loId: "sec-11-lo04",
    type: "scenario",
    difficulty: 2,
    id: "sec-11-q14",
    stem: "A software team switches their production container base image from `ubuntu:latest` to a Google `distroless` image. What security benefit is achieved?",
    options: [
      { id: "a", text: "The attack surface is drastically reduced because distroless images contain only the application binary, eliminating shells (bash), package managers (apt), and system utilities." },
      { id: "b", text: "Distroless images allow containers to run without electricity." },
      { id: "c", text: "Distroless images automatically generate unit tests." },
      { id: "d", text: "It increases the Docker image size by 500%." }
    ],
    answer: ["a"],
    explanation: "Distroless images omit shells and package managers, denying attackers post-exploitation utilities.",
    noteRef: "sec-11-lo04",
    reviewed: false
  },
  {
    loId: "sec-11-lo04",
    type: "multi",
    difficulty: 2,
    id: "sec-11-q15",
    stem: "Which of the following practices are recommended container hardening techniques?",
    options: [
      { id: "a", text: "Setting the root filesystem to read-only (`read_only: true`)" },
      { id: "b", text: "Dropping all unnecessary Linux kernel capabilities (`cap_drop: ['ALL']`)" },
      { id: "c", text: "Enforcing an explicit unprivileged non-root user (`USER 10001`)" },
      { id: "d", text: "Launching all containers with `--privileged` flag" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Read-only filesystems, dropped capabilities, and non-root users are core hardening standards; `--privileged` disables all isolation.",
    noteRef: "sec-11-lo04",
    reviewed: false
  },
  {
    loId: "sec-11-lo04",
    type: "single",
    difficulty: 3,
    id: "sec-11-q16",
    stem: "What Linux kernel mechanism is used by container engines to restrict the maximum memory and CPU consumption of a container?",
    options: [
      { id: "a", text: "Control Groups (cgroups)" },
      { id: "b", text: "Namespaces" },
      { id: "c", text: "Chroot" },
      { id: "d", text: "SELinux" }
    ],
    answer: ["a"],
    explanation: "Cgroups throttle and allocate hardware resources (CPU, RAM), preventing a single container from starving the host.",
    noteRef: "sec-11-lo04",
    reviewed: false
  },

  // LO05
  {
    loId: "sec-11-lo05",
    type: "single",
    difficulty: 1,
    id: "sec-11-q17",
    stem: "What does 'Shift-Left' mean in DevSecOps pipeline engineering?",
    options: [
      { id: "a", text: "Integrating security testing and vulnerability scanning earlier in the software development lifecycle, rather than waiting for post-production audits." },
      { id: "b", text: "Moving the software development team to another country." },
      { id: "c", text: "Pressing the left arrow key during deployment." },
      { id: "d", text: "Writing code in backwards order." }
    ],
    answer: ["a"],
    explanation: "Shifting left catches vulnerabilities during code commit and CI builds when fixes are cheapest and easiest.",
    noteRef: "sec-11-lo05",
    reviewed: false
  },
  {
    loId: "sec-11-lo05",
    type: "scenario",
    difficulty: 2,
    id: "sec-11-q18",
    stem: "A developer opens a pull request. An automated GitHub Action analyzes the raw TypeScript code and flags a potential SQL injection vulnerability on line 42 without running the application. What tool type performed this scan?",
    options: [
      { id: "a", text: "Static Application Security Testing (SAST)" },
      { id: "b", text: "Dynamic Application Security Testing (DAST)" },
      { id: "c", text: "Cloud Posture Manager (CSPM)" },
      { id: "d", text: "Network Sniffer" }
    ],
    answer: ["a"],
    explanation: "SAST inspects non-compiled source code statically to identify syntax-level vulnerability patterns.",
    noteRef: "sec-11-lo05",
    reviewed: false
  },
  {
    loId: "sec-11-lo05",
    type: "multi",
    difficulty: 2,
    id: "sec-11-q19",
    stem: "Which security scanning tools are standard automated components of modern DevSecOps CI/CD pipelines?",
    options: [
      { id: "a", text: "Secret Scanners (e.g., Gitleaks, TruffleHog) detecting committed API tokens" },
      { id: "b", text: "Software Composition Analysis (SCA) detecting known CVEs in third-party libraries" },
      { id: "c", text: "Static Application Security Testing (SAST) analyzing source code flaws" },
      { id: "d", text: "Cryptocurrency miners running on test servers" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Pipelines routinely automate secret scanning, dependency CVE checks (SCA), and code analysis (SAST).",
    noteRef: "sec-11-lo05",
    reviewed: false
  },
  {
    loId: "sec-11-lo05",
    type: "single",
    difficulty: 3,
    id: "sec-11-q20",
    stem: "What fundamental operational difference distinguishes Dynamic Application Security Testing (DAST) from Static Testing (SAST)?",
    options: [
      { id: "a", text: "DAST requires a running application in a staging environment to simulate external attacks, whereas SAST analyzes unexecuted source code." },
      { id: "b", text: "DAST can only scan hardware circuits." },
      { id: "c", text: "SAST can only run on production databases." },
      { id: "d", text: "There is no difference between SAST and DAST." }
    ],
    answer: ["a"],
    explanation: "DAST exercises running systems as a black-box tester; SAST evaluates codebase files white-box.",
    noteRef: "sec-11-lo05",
    reviewed: false
  },

  // LO06
  {
    loId: "sec-11-lo06",
    type: "single",
    difficulty: 1,
    id: "sec-11-q21",
    stem: "In quantitative risk management, what formula calculates the Annualized Loss Expectancy (ALE)?",
    options: [
      { id: "a", text: "ALE = Single Loss Expectancy (SLE) * Annualized Rate of Occurrence (ARO)" },
      { id: "b", text: "ALE = Asset Value (AV) / Exposure Factor (EF)" },
      { id: "c", text: "ALE = Return on Investment (ROI) * 365" },
      { id: "d", text: "ALE = Total Revenue - Operational Cost" }
    ],
    answer: ["a"],
    explanation: "Annualized Loss Expectancy (ALE) = Single Loss Expectancy (SLE) multiplied by Annualized Rate of Occurrence (ARO).",
    noteRef: "sec-11-lo06",
    reviewed: false
  },
  {
    loId: "sec-11-lo06",
    type: "numeric",
    difficulty: 2,
    id: "sec-11-q22",
    stem: "An enterprise server asset is valued at $200,000. If a power surge occurs, the Exposure Factor (EF) is estimated at 25%. What is the Single Loss Expectancy (SLE) in dollars?",
    options: [
      { id: "a", text: "50000" },
      { id: "b", text: "25000" },
      { id: "c", text: "100000" },
      { id: "d", text: "150000" }
    ],
    answer: ["a"],
    explanation: "SLE = Asset Value * Exposure Factor = $200,000 * 0.25 = $50,000.",
    noteRef: "sec-11-lo06",
    verify: "(200000 * 0.25 === 50000)",
    reviewed: false
  },
  {
    loId: "sec-11-lo06",
    type: "scenario",
    difficulty: 2,
    id: "sec-11-q23",
    stem: "An enterprise purchases a $10,000,000 cyber insurance policy to cover customer liability damages in the event of a major data breach. Which risk treatment strategy is being implemented?",
    options: [
      { id: "a", text: "Risk Transference" },
      { id: "b", text: "Risk Avoidance" },
      { id: "c", text: "Risk Mitigation" },
      { id: "d", text: "Risk Acceptance" }
    ],
    answer: ["a"],
    explanation: "Purchasing insurance or outsourcing operational liability transfers the financial impact to a third party.",
    noteRef: "sec-11-lo06",
    reviewed: false
  },
  {
    loId: "sec-11-lo06",
    type: "single",
    difficulty: 3,
    id: "sec-11-q24",
    stem: "Why would an executive risk committee choose 'Risk Acceptance' rather than implementing an expensive technical safeguard?",
    options: [
      { id: "a", text: "When the annualized cost of the proposed security control exceeds the total Annualized Loss Expectancy (ALE) of the risk." },
      { id: "b", text: "When the company is closing down operations next week." },
      { id: "c", text: "Because compliance regulations forbid spending money on firewalls." },
      { id: "d", text: "When the risk is completely unknown." }
    ],
    answer: ["a"],
    explanation: "If a safeguard costs more than the expected annualized loss, accepting the risk is the rational economic choice.",
    noteRef: "sec-11-lo06",
    reviewed: false
  },

  // LO07
  {
    loId: "sec-11-lo07",
    type: "single",
    difficulty: 1,
    id: "sec-11-q25",
    stem: "What core function was newly introduced in the NIST Cybersecurity Framework (CSF) Version 2.0?",
    options: [
      { id: "a", text: "Govern" },
      { id: "b", text: "Isolate" },
      { id: "c", text: "Punish" },
      { id: "d", text: "Encrypt" }
    ],
    answer: ["a"],
    explanation: "NIST CSF 2.0 added 'Govern' to encompass enterprise risk governance, policy, and executive oversight.",
    noteRef: "sec-11-lo07",
    reviewed: false
  },
  {
    loId: "sec-11-lo07",
    type: "scenario",
    difficulty: 2,
    id: "sec-11-q26",
    stem: "A software vendor seeks an independent audit to prove to prospective enterprise customers that their cloud security, confidentiality, and availability controls have operated effectively over a six-month period. What report is standard for this?",
    options: [
      { id: "a", text: "SOC 2 Type II Report" },
      { id: "b", text: "RFC 1918 Address Allocation" },
      { id: "c", text: "W3C HTML Validation" },
      { id: "d", text: "DNS Zone Transfer Record" }
    ],
    answer: ["a"],
    explanation: "A SOC 2 Type II report audits the operational effectiveness of security controls over an extended time window (3 to 12 months).",
    noteRef: "sec-11-lo07",
    reviewed: false
  },
  {
    loId: "sec-11-lo07",
    type: "multi",
    difficulty: 2,
    id: "sec-11-q27",
    stem: "Which of the following are the six Core Functions of the NIST Cybersecurity Framework 2.0?",
    options: [
      { id: "a", text: "Govern, Identify, Protect" },
      { id: "b", text: "Detect, Respond, Recover" },
      { id: "c", text: "Attack, Exploit, Exfiltrate" },
      { id: "d", text: "Purchase, Install, Reboot" }
    ],
    answer: ["a", "b"],
    explanation: "The six NIST CSF 2.0 core functions are Govern, Identify, Protect, Detect, Respond, and Recover.",
    noteRef: "sec-11-lo07",
    reviewed: false
  },
  {
    loId: "sec-11-lo07",
    type: "single",
    difficulty: 3,
    id: "sec-11-q28",
    stem: "What is an Information Security Management System (ISMS) according to the ISO/IEC 27001 standard?",
    options: [
      { id: "a", text: "A systematic approach to managing sensitive company information through a continuous framework of policies, procedures, and technical risk controls." },
      { id: "b", text: "A specific proprietary antivirus software package." },
      { id: "c", text: "A network routing protocol." },
      { id: "d", text: "A hardware server rack cooling system." }
    ],
    answer: ["a"],
    explanation: "ISO 27001 defines an ISMS as an ongoing, management-led risk framework for protecting institutional data.",
    noteRef: "sec-11-lo07",
    reviewed: false
  },

  // LO08
  {
    loId: "sec-11-lo08",
    type: "single",
    difficulty: 1,
    id: "sec-11-q29",
    stem: "Under India's Digital Personal Data Protection (DPDP) Act 2023, what is the entity that determines the purpose and means of processing personal data called?",
    options: [
      { id: "a", text: "Data Fiduciary" },
      { id: "b", text: "Data Principal" },
      { id: "c", text: "Data Miner" },
      { id: "d", text: "Data Broker" }
    ],
    answer: ["a"],
    explanation: "The DPDP Act 2023 defines the data controller entity as the 'Data Fiduciary'.",
    noteRef: "sec-11-lo08",
    reviewed: false
  },
  {
    loId: "sec-11-lo08",
    type: "scenario",
    difficulty: 2,
    id: "sec-11-q30",
    stem: "An e-commerce mobile app asks users for access to their smartphone contact list, microphone, and location when they only signed up to buy books. Which privacy principle does this violate?",
    options: [
      { id: "a", text: "Data Minimization and Purpose Limitation" },
      { id: "b", text: "Symmetric Encryption" },
      { id: "c", text: "Least Cost Routing" },
      { id: "d", text: "High Availability" }
    ],
    answer: ["a"],
    explanation: "Data minimization requires collecting only data strictly necessary for the declared service purpose.",
    noteRef: "sec-11-lo08",
    reviewed: false
  },
  {
    loId: "sec-11-lo08",
    type: "numeric",
    difficulty: 2,
    id: "sec-11-q31",
    stem: "Under the European Union General Data Protection Regulation (GDPR), within how many hours must a data controller report a confirmed personal data breach to the supervisory authority?",
    options: [
      { id: "a", text: "72" },
      { id: "b", text: "24" },
      { id: "c", text: "48" },
      { id: "d", text: "168" }
    ],
    answer: ["a"],
    explanation: "GDPR Article 33 mandates reporting personal data breaches to regulators within 72 hours of becoming aware.",
    noteRef: "sec-11-lo08",
    verify: "(72 === 72)",
    reviewed: false
  },
  {
    loId: "sec-11-lo08",
    type: "single",
    difficulty: 3,
    id: "sec-11-q32",
    stem: "What maximum financial penalty can be imposed under India's DPDP Act 2023 for failure to observe reasonable security safeguards to prevent a personal data breach?",
    options: [
      { id: "a", text: "Up to ₹250 crore (₹2.5 billion)" },
      { id: "b", text: "Up to ₹50,000" },
      { id: "c", text: "Up to ₹5 lakh" },
      { id: "d", text: "Up to ₹10 crore" }
    ],
    answer: ["a"],
    explanation: "The Schedule to the DPDP Act 2023 specifies penalties up to ₹250 crore for failure to prevent breaches.",
    noteRef: "sec-11-lo08",
    reviewed: false
  },

  // LO09 (Extension)
  {
    loId: "sec-11-lo09",
    type: "single",
    difficulty: 2,
    id: "sec-11-q33",
    stem: "What is the primary advantage of scanning Terraform and CloudFormation templates with static IaC analyzers like Checkov or tfsec before deployment?",
    options: [
      { id: "a", text: "It intercepts cloud security misconfigurations in pull requests before infrastructure is ever provisioned, preventing production exposure." },
      { id: "b", text: "It compiles Terraform code into C++ binaries." },
      { id: "c", text: "It grants unlimited free AWS compute credits." },
      { id: "d", text: "It replaces the need for cloud networking." }
    ],
    answer: ["a"],
    explanation: "Static IaC scanning shifts cloud security left, detecting dangerous templates before cloud deployment.",
    noteRef: "sec-11-lo09",
    reviewed: false
  },
  {
    loId: "sec-11-lo09",
    type: "scenario",
    difficulty: 2,
    id: "sec-11-q34",
    stem: "A developer commits a Terraform script defining an `aws_s3_bucket` without a server-side encryption block. A CI check halts the pull request with error `CKV_AWS_19: Ensure all data stored in the S3 bucket is securely encrypted at rest`. What paradigm is enforced?",
    options: [
      { id: "a", text: "Policy-as-Code automated pre-deployment gating" },
      { id: "b", text: "Runtime application self-protection" },
      { id: "c", text: "Forensic disk acquisition" },
      { id: "d", text: "Distributed denial of service" }
    ],
    answer: ["a"],
    explanation: "Policy-as-code codifies compliance rules into automated pre-commit / CI gates.",
    noteRef: "sec-11-lo09",
    reviewed: false
  },
  {
    loId: "sec-11-lo09",
    type: "multi",
    difficulty: 3,
    id: "sec-11-q35",
    stem: "Which of the following cloud infrastructure misconfigurations can be detected by static Infrastructure-as-Code (IaC) security linters?",
    options: [
      { id: "a", text: "Security groups permitting unrestricted public inbound access (0.0.0.0/0 on port 22)" },
      { id: "b", text: "Storage volumes (EBS) created without encryption enabled" },
      { id: "c", text: "S3 buckets lacking public access block configurations" },
      { id: "d", text: "Physical server fan speed failures in the data center" }
    ],
    answer: ["a", "b", "c"],
    explanation: "IaC templates declare security groups, encryption flags, and public access blocks; fan speeds are hardware.",
    noteRef: "sec-11-lo09",
    reviewed: false
  },
  {
    loId: "sec-11-lo09",
    type: "single",
    difficulty: 3,
    id: "sec-11-q36",
    stem: "Why does enforcing GitOps for infrastructure deployment enhance organizational auditability and security governance?",
    options: [
      { id: "a", text: "Every infrastructure change is recorded as a version-controlled, cryptographically signed git commit with peer reviews and automated scanner sign-offs." },
      { id: "b", text: "GitOps eliminates the need for software testing." },
      { id: "c", text: "Git repositories are legally exempt from privacy regulations." },
      { id: "d", text: "GitOps automatically generates cloud provider invoices." }
    ],
    answer: ["a"],
    explanation: "GitOps provides an immutable, auditable log of who approved and deployed every infrastructure modification.",
    noteRef: "sec-11-lo09",
    reviewed: false
  }
];

balanceAndSave('cybersecurity', 'cloud-security-devsecops-and-governance', ch11Objectives, ch11Questions);
console.log("Batch 9 complete!");
