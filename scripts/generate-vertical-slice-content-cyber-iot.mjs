/**
 * scripts/generate-vertical-slice-content-cyber-iot.mjs
 *
 * Generates modular notes and question banks for:
 * - Cybersecurity: security-foundations-and-attack-lifecycle
 * - IoT: iot-architecture-and-physical-computing
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

function writeNoteBlock(courseSlug, chapterSlug, loId, title, coreIdea, workedExample, commonMistake, checkYourself) {
  const dir = path.join(ROOT_DIR, 'content', courseSlug, chapterSlug, 'notes');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const content = `---
loId: "${loId}"
title: "${title}"
reviewed: false
sources:
  - title: "Vellum Academy Curriculum Standards"
    url: "https://vellum.academy/sources"
---

### Core Idea
${coreIdea.trim()}

### Worked Example
${workedExample.trim()}

### Common Mistake
${commonMistake.trim()}

### Check Yourself
${checkYourself.trim()}
`;

  fs.writeFileSync(path.join(dir, `${loId}.mdx`), content, 'utf-8');
}

// ====================================================
// 2. CYBERSECURITY: security-foundations-and-attack-lifecycle
// ====================================================
console.log('Generating Cybersecurity Vertical Slice Content...');

const cyberNotes = [
  {
    loId: 'cyber-01-lo01',
    title: 'The CIA Triad and Non-Repudiation',
    core: `Information security rests on three classical pillars:
1. **Confidentiality**: Ensuring data is accessible strictly to authorized entities (enforced via encryption, access control lists).
2. **Integrity**: Guaranteeing data has not been modified, tampered with, or corrupted in transit or storage (enforced via cryptographic hashes, digital signatures).
3. **Availability**: Ensuring systems and resources are reliably accessible to authorized users when needed (enforced via redundancy, DDoS mitigation, failover clusters).
**Non-repudiation** guarantees that an author or sender cannot deny having created or dispatched a message, proven mathematically via private key digital signatures.`,
    worked: `Evaluating security impacts on an automated ATM:
- Confidentiality violation: An adversary taps the network cable and intercepts customer PIN numbers in cleartext.
- Integrity violation: An attacker tampers with the transaction packet in transit to change a withdrawal amount from $20 to $2,000.
- Availability violation: A denial-of-service flood overwhelms the ATM authorization gateway, preventing all legitimate banking customers from withdrawing cash.`,
    mistake: `Treating confidentiality as the only goal of security. Encrypting a database does nothing to protect it if an attacker can wipe the hard drive (destroying Availability) or silently alter values (destroying Integrity).`,
    check: `If an adversary alters your website's database records without reading confidential data, which pillar of the CIA triad was violated? (Integrity).`
  },
  {
    loId: 'cyber-01-lo02',
    title: 'Threat Actor Taxonomy and Motivations',
    core: `Adversaries operate across distinct tiers of capability, motivation, and operational stealth:
- **Script Kiddies**: Low technical skill, rely on publicly available automated exploits, motivated by vanity or curiosity.
- **Cybercrime Syndicates**: Highly organized, motivated by financial profit via ransomware, identity theft, and wire fraud.
- **Nation-State APTs (Advanced Persistent Threats)**: Immense financial and technical resources, motivated by espionage, intellectual property theft, and geopolitical disruption. They maintain long-term covert persistence.
- **Insider Threats**: Current or former employees possessing legitimate system access, motivated by financial gain, revenge, or coercion.`,
    worked: `Contrasting attack profiles:
- A mass defacement of a public forum using an unpatched WordPress vulnerability -> Script kiddie running automated scanners.
- A stealthy 9-month campaign utilizing custom zero-day exploits to maintain undetected residency in a defense contractor's SCADA engineering network -> Nation-state APT.`,
    mistake: `Assuming all cyberattacks are targeted personal vendettas. Over 90% of web attacks are automated, opportunistic bots scanning the entire internet IPv4 address space for known unpatched CVEs.`,
    check: `Why are Insider Threats uniquely dangerous compared to external attackers? (Because insiders already hold authenticated network access, legitimate credentials, and know where sensitive assets reside).`
  },
  {
    loId: 'cyber-01-lo03',
    title: 'Attack Surface and Ingress Vectors',
    core: `An **Attack Surface** is the sum total of all reachable points where an unauthorized entity can attempt to enter or extract data. An **Attack Vector** is the specific pathway or mechanism used to exploit a weakness.
Key vectors include:
- Phishing and social engineering (human layer)
- Unpatched external-facing web applications (software layer)
- Exposed management ports like RDP/SSH to the public internet (network layer)
- Misconfigured cloud storage buckets and weak IAM permissions (cloud layer).`,
    worked: `Reducing attack surface for a production web server:
- Initial state: SSH (port 22) open to 0.0.0.0/0, database (port 5432) open to public, web app (port 80, 443).
- Hardened state: Close port 5432 to public, move port 22 behind a zero-trust bastion VPN with hardware MFA, enforce HTTPS on 443, close port 80. Attack surface reduced by 75%.`,
    mistake: `Believing an unused service or closed port has zero risk. If an orphaned daemon is listening on an internal interface without updates, an attacker who establishes a foothold can pivot to it immediately.`,
    check: `What is the difference between an attack surface and an attack vector? (The attack surface is the totality of exposed endpoints; the attack vector is the specific vehicle or exploit path used to breach it).`
  },
  {
    loId: 'cyber-01-lo04',
    title: 'Cyber Kill Chain and MITRE ATT&CK',
    core: `Modern intrusions progress through structured operational phases:
**Lockheed Martin Cyber Kill Chain**:
1. *Reconnaissance* (harvesting emails, scanning ports)
2. *Weaponization* (coupling exploit with payload)
3. *Delivery* (spear-phishing email, drive-by download)
4. *Exploitation* (triggering code execution on target)
5. *Installation* (establishing backdoor persistence)
6. *Command & Control (C2)* (remote communication channel)
7. *Actions on Objectives* (data exfiltration, ransomware encryption).
**MITRE ATT&CK** provides a matrix of real-world adversary tactics, techniques, and procedures (TTPs) mapping how attackers navigate enterprise environments.`,
    worked: `Breaking the Kill Chain early:
If defensive controls block an attacker at phase 3 (*Delivery* via an email sandbox filter), phases 4 through 7 can never execute. Defensive leverage is highest when detection occurs early in the chain.`,
    mistake: `Focusing all security spending on perimeter prevention. If an attacker breaches the perimeter (e.g. stolen employee VPN credentials), defenders must have detection capabilities for internal lateral movement and exfiltration.`,
    check: `At what stage of the Kill Chain does an adversary establish outbound communication to receive remote instructions from their server? (Command & Control / C2).`
  },
  {
    loId: 'cyber-01-lo05',
    title: 'Risk Calculation: Threat, Vulnerability, and Impact',
    core: `Cybersecurity risk is quantified as a function of three variables:
$$\\text{Risk} = \\text{Threat} \\times \\text{Vulnerability} \\times \\text{Impact}$$
- **Vulnerability**: A flaw or weakness in software, hardware, or process (e.g. CVE-2021-44228 Log4j).
- **Threat**: The likelihood of an adversary capability attempting to exploit that flaw.
- **Impact**: The tangible financial, legal, or operational loss if the breach succeeds.
If any single factor is zero (e.g. a vulnerability exists on an air-gapped machine with zero threat reachability), the risk is zero.`,
    worked: `Prioritizing patching across two servers:
- Server A: Critical RCE vulnerability (CVSS 9.8) on an air-gapped test VM with zero sensitive data. Impact = Low, Threat = Very Low $\\rightarrow$ Overall Risk = Moderate.
- Server B: Moderate Information Disclosure vulnerability (CVSS 5.3) on an internet-facing payment processing server storing PCI cardholder data. Impact = Catastrophic, Threat = High $\\rightarrow$ Overall Risk = Critical.`,
    mistake: `Prioritizing remediation purely by CVSS vulnerability score without factoring in asset criticality and threat accessibility.`,
    check: `If a software library has a known critical exploit, but the server is locked in a vault, disconnected from all networks, and has no users, why is operational risk low? (Because Threat accessibility is near zero).`
  },
  {
    loId: 'cyber-01-lo06',
    title: 'Symmetric vs Asymmetric Cryptography and PKI',
    core: `Cryptography secures data through two complementary paradigms:
1. **Symmetric Encryption (e.g. AES-256)**: Uses a single shared secret key for both encryption and decryption. Highly computational efficient, ideal for encrypting large payloads (disk images, video streams). Key distribution problem: both parties must securely agree on the secret key beforehand.
2. **Asymmetric Encryption (e.g. RSA, ECC)**: Uses mathematically linked key pairs: a public key (distributed openly) and a private key (kept strictly secret). Ideal for identity verification and digital signatures.
**TLS / HTTPS** combines both: asymmetric cryptography (RSA/ECDH) safely negotiates a session key, then switches to fast symmetric AES for all actual data transfer.`,
    worked: `Establishing a secure TLS connection:
1. Browser connects to \`https://bank.com\`.
2. Bank server responds with its X.509 Certificate containing its public key, signed by a trusted Root Certificate Authority (CA).
3. Browser validates the signature.
4. Both sides use asymmetric Diffie-Hellman key exchange to establish an ephemeral AES-256 session key.
5. All subsequent HTTP traffic is encrypted using AES-256.`,
    mistake: `Encrypting massive multi-gigabyte video streams directly with asymmetric RSA. RSA is thousands of times slower and computationally expensive; asymmetric crypto is designed only to secure keys and digital signatures.`,
    check: `In digital signatures, which key does the sender use to sign the message hash? (The sender's Private Key; anyone with the Public Key can verify it).`
  },
  {
    loId: 'cyber-01-lo07',
    title: 'Least Privilege and Zero Trust Architecture',
    core: `Traditional perimeter security operates on the "castle-and-moat" model: hard exterior, soft interior. **Zero Trust** replaces this with the core mandate: *"Never Trust, Always Verify"*.
Key principles:
1. **Principle of Least Privilege (PoLP)**: Users and services are granted only the minimum permissions necessary to execute their assigned duties for the shortest necessary duration.
2. **Explicit Verification**: Every access request is authenticated, authorized, and encrypted based on user identity, device health, and behavioral context.
3. **Assume Breach**: Architect networks assuming an attacker is already inside the internal subnet, using microsegmentation to prevent lateral movement.`,
    worked: `Configuring database access under Least Privilege:
- Bad practice: Application web server connects to PostgreSQL using \`postgres\` superuser credentials with full DDL/DROP table rights.
- Least Privilege: Application connects using \`app_user\` restricted strictly to \`SELECT, INSERT, UPDATE\` on 4 specific application tables with no permissions on schema or system tables.`,
    mistake: `Assuming internal VPN subnets can be implicitly trusted. Once an adversary compromises one workstation on a flat VPN, they can freely scan and pivot to domain controllers and database servers.`,
    check: `Under Zero Trust, when a corporate laptop connects from the internal office Wi-Fi, is its access automatically trusted? (No; all requests must still explicitly authenticate, verify device posture, and enforce least-privilege authorization).`
  },
  {
    loId: 'cyber-01-lo08',
    title: 'Defense-in-Depth Layered Security',
    core: `No single security tool or control is foolproof. **Defense-in-Depth** deploys redundant, defensive layers across the entire operational environment:
1. **Physical Controls**: Biometric datacenter locks, security guards, CCTV.
2. **Network Controls**: Next-generation firewalls, network microsegmentation, WAF, IDS/IPS.
3. **Host Controls**: Endpoint Detection & Response (EDR), disk encryption, OS patching.
4. **Application Controls**: Input validation, parameterized queries, CSRF tokens.
5. **Data Controls**: Column-level encryption, Data Loss Prevention (DLP), access logs.
If an adversary circumvents one layer (e.g. bypassing a firewall), the next layer (e.g. EDR or host encryption) blocks or alerts on the intrusion.`,
    worked: `Stopping an SQL injection attempt across layers:
- Layer 1 (WAF): Blocks obvious malformed SQL signatures at the edge.
- Layer 2 (Application Code): Uses parameterized prepared statements, preventing SQL injection even if the WAF fails.
- Layer 3 (Database Permissions): App user has no administrative rights, limiting damage even if code is flawed.
- Layer 4 (Audit Logging): SIEM flags anomalous query volume and alerts security analysts.`,
    mistake: `Relying entirely on an endpoint antivirus or firewall. Attackers easily bypass signature-based antivirus using simple runtime crypters or memory injection.`,
    check: `If an adversary bypasses your perimeter firewall, what prevents them from immediately reading sensitive database files on a compromised server? (Host-level controls, least privilege permissions, and data-at-rest encryption).`
  }
];

for (const n of cyberNotes) {
  writeNoteBlock('cybersecurity', 'security-foundations-and-attack-lifecycle', n.loId, n.title, n.core, n.worked, n.mistake, n.check);
}

// ----------------------------------------------------
// Cybersecurity Quiz Bank (32 questions: 4 per core LO)
// ----------------------------------------------------
const cyberQuizQuestions = [
  // LO 1 (4 questions)
  {
    id: 'cyber-01-q01',
    loId: 'cyber-01-lo01',
    type: 'single',
    difficulty: 1,
    stem: 'Which pillar of the CIA Triad is violated when an attacker secretly alters patient blood type records in an electronic hospital database?',
    options: [
      { id: 'a', text: 'Confidentiality' },
      { id: 'b', text: 'Integrity' },
      { id: 'c', text: 'Availability' },
      { id: 'd', text: 'Non-repudiation' }
    ],
    answer: ['b'],
    explanation: 'Integrity guarantees that information is authentic and has not been altered or tampered with by unauthorized actors.',
    noteRef: 'cyber-01-lo01',
    reviewed: false
  },
  {
    id: 'cyber-01-q02',
    loId: 'cyber-01-lo01',
    type: 'single',
    difficulty: 2,
    stem: 'How does digital signature cryptography establish the property of Non-Repudiation?',
    options: [
      { id: 'a', text: 'By encrypting the entire hard drive with BitLocker.' },
      { id: 'b', text: 'By signing the message hash with the sender\'s private key, proving mathematically that only the key holder could have generated the signature.' },
      { id: 'c', text: 'By requiring three independent human witnesses.' },
      { id: 'd', text: 'By generating a random password reset link.' }
    ],
    answer: ['b'],
    explanation: 'Because the private key is held exclusively by the sender, a valid signature provides mathematical proof that they dispatched the payload and cannot deny it.',
    noteRef: 'cyber-01-lo01',
    reviewed: false
  },
  {
    id: 'cyber-01-q03',
    loId: 'cyber-01-lo01',
    type: 'scenario',
    difficulty: 2,
    stem: 'A distributed denial of service (DDoS) volumetric flood takes down an online brokerage application during market hours. Which security requirement was primarily compromised?',
    options: [
      { id: 'a', text: 'Availability' },
      { id: 'b', text: 'Confidentiality' },
      { id: 'c', text: 'Non-repudiation' },
      { id: 'd', text: 'Authorization' }
    ],
    answer: ['a'],
    explanation: 'Availability ensures authorized users have timely, reliable access to critical assets and services when needed.',
    noteRef: 'cyber-01-lo01',
    reviewed: false
  },
  {
    id: 'cyber-01-q04',
    loId: 'cyber-01-lo01',
    type: 'multi',
    difficulty: 3,
    stem: 'Which security mechanisms directly protect Data Integrity? (Select all that apply)',
    options: [
      { id: 'a', text: 'Cryptographic hash functions (e.g. SHA-256 checksums)' },
      { id: 'b', text: 'Digital signatures on firmware updates' },
      { id: 'c', text: 'Uninterruptible power supplies (UPS)' },
      { id: 'd', text: 'Hash-based message authentication codes (HMAC)' }
    ],
    answer: ['a', 'b', 'd'],
    explanation: 'Hashes, digital signatures, and HMACs verify that data has not been modified in transit or storage. UPS ensures power availability.',
    noteRef: 'cyber-01-lo01',
    reviewed: false
  },

  // LO 2 (4 questions)
  {
    id: 'cyber-01-q05',
    loId: 'cyber-01-lo02',
    type: 'single',
    difficulty: 1,
    stem: 'What primary trait distinguishes Advanced Persistent Threat (APT) nation-state actors from script kiddies?',
    options: [
      { id: 'a', text: 'APTs only use Windows operating systems.' },
      { id: 'b', text: 'APTs possess substantial funding, specialized personnel, custom zero-day exploits, and pursue long-term stealthy objectives.' },
      { id: 'c', text: 'APTs always publicly announce their intrusions on social media.' },
      { id: 'd', text: 'APTs do not target government or defense infrastructure.' }
    ],
    answer: ['b'],
    explanation: 'APTs represent state-sponsored or elite teams with sustained campaigns, high discipline, advanced evasion techniques, and immense resources.',
    noteRef: 'cyber-01-lo02',
    reviewed: false
  },
  {
    id: 'cyber-01-q06',
    loId: 'cyber-01-lo02',
    type: 'scenario',
    difficulty: 2,
    stem: 'An automated vulnerability scanner finds 500 websites running an unpatched WordPress plugin and defaces their landing pages with political slogans. Which threat actor profile best fits this behavior?',
    options: [
      { id: 'a', text: 'Nation-state military intelligence unit' },
      { id: 'b', text: 'Opportunistic hacktivist or script kiddie using public exploit scripts' },
      { id: 'c', text: 'Corporate executive insider' },
      { id: 'd', text: 'Ransomware cartel targeting tier-1 banks' }
    ],
    answer: ['b'],
    explanation: 'Opportunistic scanning, low technical barrier, and broad defacement for attention/ideology fit the script kiddie / hacktivist archetype.',
    noteRef: 'cyber-01-lo02',
    reviewed: false
  },
  {
    id: 'cyber-01-q07',
    loId: 'cyber-01-lo02',
    type: 'single',
    difficulty: 2,
    stem: 'Why is an Insider Threat often considered more difficult to detect than external adversaries?',
    options: [
      { id: 'a', text: 'Because insiders never use electronic computers.' },
      { id: 'b', text: 'Because insiders operate with legitimate, authorized credentials and are already inside perimeter network firewalls.' },
      { id: 'c', text: 'Because insider actions are immune to logging.' },
      { id: 'd', text: 'Because law enforcement prohibits inspecting internal traffic.' }
    ],
    answer: ['b'],
    explanation: 'Insiders already possess trusted access, legitimate credentials, and familiarity with operational workflows, making malicious activity blend with normal business behavior.',
    noteRef: 'cyber-01-lo02',
    reviewed: false
  },
  {
    id: 'cyber-01-q08',
    loId: 'cyber-01-lo02',
    type: 'multi',
    difficulty: 3,
    stem: 'Which of the following are primary motivations for modern organized Cybercrime syndicates? (Select all that apply)',
    options: [
      { id: 'a', text: 'Direct monetary extortion via double-extortion ransomware' },
      { id: 'b', text: 'Selling compromised payment card numbers and personally identifiable information (PII) on darknet markets' },
      { id: 'c', text: 'Contributing free open-source software to charitable foundations' },
      { id: 'd', text: 'Conducting business email compromise (BEC) wire fraud schemes' }
    ],
    answer: ['a', 'b', 'd'],
    explanation: 'Cybercrime syndicates are financially motivated criminal organizations focusing on revenue generation through extortion, fraud, and data brokering.',
    noteRef: 'cyber-01-lo02',
    reviewed: false
  },

  // LO 3 (4 questions)
  {
    id: 'cyber-01-q09',
    loId: 'cyber-01-lo03',
    type: 'single',
    difficulty: 1,
    stem: 'What is an organization\'s "Attack Surface"?',
    options: [
      { id: 'a', text: 'The physical square footage of the server room.' },
      { id: 'b', text: 'The sum total of all reachable vulnerabilities and exposed entry points across software, hardware, networks, and humans.' },
      { id: 'c', text: 'The number of computer screens in the security operations center.' },
      { id: 'd', text: 'The speed of the core fiber internet connection.' }
    ],
    answer: ['b'],
    explanation: 'The attack surface encompasses all potential entryways that an adversary could target or probe for vulnerabilities.',
    noteRef: 'cyber-01-lo03',
    reviewed: false
  },
  {
    id: 'cyber-01-q10',
    loId: 'cyber-01-lo03',
    type: 'scenario',
    difficulty: 2,
    stem: 'A company employee receives an urgent email appearing to come from the CEO requesting an emergency gift card purchase. What attack vector is being employed?',
    options: [
      { id: 'a', text: 'SQL Injection' },
      { id: 'b', text: 'Spear Phishing / Social Engineering' },
      { id: 'c', text: 'Buffer Overflow' },
      { id: 'd', text: 'Man-in-the-Middle arp spoofing' }
    ],
    answer: ['b'],
    explanation: 'Spear phishing targets specific individuals with deceptive, context-tailored social engineering communications to manipulate human psychology.',
    noteRef: 'cyber-01-lo03',
    reviewed: false
  },
  {
    id: 'cyber-01-q11',
    loId: 'cyber-01-lo03',
    type: 'single',
    difficulty: 2,
    stem: 'Which administrative practice most effectively reduces an organization\'s external network attack surface?',
    options: [
      { id: 'a', text: 'Closing unnecessary listening ports and disabling exposed administrative interfaces (like RDP and SSH) to the public internet.' },
      { id: 'b', text: 'Setting all user passwords to never expire.' },
      { id: 'c', text: 'Increasing server RAM from 16GB to 64GB.' },
      { id: 'd', text: 'Allowing all outbound traffic on all UDP ports.' }
    ],
    answer: ['a'],
    explanation: 'Disabling unneeded services and moving administrative interfaces behind VPNs/Zero Trust proxies eliminates internet-reachable targets.',
    noteRef: 'cyber-01-lo03',
    reviewed: false
  },
  {
    id: 'cyber-01-q12',
    loId: 'cyber-01-lo03',
    type: 'multi',
    difficulty: 3,
    stem: 'Which of the following are common technical attack vectors? (Select all that apply)',
    options: [
      { id: 'a', text: 'Exploiting an unauthenticated remote code execution flaw in an edge VPN gateway' },
      { id: 'b', text: 'Credential stuffing using automated credential dumps from unrelated data breaches' },
      { id: 'c', text: 'Installing an official OS patch verified with cryptographic signatures' },
      { id: 'd', text: 'Compromised third-party open-source software dependencies (supply chain attack)' }
    ],
    answer: ['a', 'b', 'd'],
    explanation: 'Edge exploits, credential stuffing, and supply chain poisoning are common ingress attack vectors. Legitimate verified patching is a defensive remedy.',
    noteRef: 'cyber-01-lo03',
    reviewed: false
  },

  // LO 4 (4 questions)
  {
    id: 'cyber-01-q13',
    loId: 'cyber-01-lo04',
    type: 'single',
    difficulty: 1,
    stem: 'In the Cyber Kill Chain model, what occurs during the "Reconnaissance" phase?',
    options: [
      { id: 'a', text: 'The attacker encrypts all hard drives with ransomware.' },
      { id: 'b', text: 'The attacker gathers intelligence on the target (identifying IP ranges, email addresses, employee names, software versions).' },
      { id: 'c', text: 'The attacker extracts gigabytes of confidential IP to a foreign server.' },
      { id: 'd', text: 'The attacker reboots the domain controller.' }
    ],
    answer: ['b'],
    explanation: 'Reconnaissance is the initial information-gathering phase used to plan and optimize subsequent intrusion attempts.',
    noteRef: 'cyber-01-lo04',
    reviewed: false
  },
  {
    id: 'cyber-01-q14',
    loId: 'cyber-01-lo04',
    type: 'single',
    difficulty: 2,
    stem: 'How does the MITRE ATT&CK framework differ from the classic Cyber Kill Chain?',
    options: [
      { id: 'a', text: 'MITRE ATT&CK only covers attacks on mobile smartphones.' },
      { id: 'b', text: 'MITRE ATT&CK provides a granular, non-linear knowledge base of adversary Tactics, Techniques, and Procedures (TTPs) based on real-world observations.' },
      { id: 'c', text: 'MITRE ATT&CK is an automated antivirus program.' },
      { id: 'd', text: 'MITRE ATT&CK requires hardware dongles to operate.' }
    ],
    answer: ['b'],
    explanation: 'While the Kill Chain is a high-level sequential phase model, ATT&CK is a deep matrix detailing hundreds of specific adversary techniques and defensive mitigations.',
    noteRef: 'cyber-01-lo04',
    reviewed: false
  },
  {
    id: 'cyber-01-q15',
    loId: 'cyber-01-lo04',
    type: 'scenario',
    difficulty: 2,
    stem: 'An attacker uses stolen credentials to access a workstation in accounting, then uses PsExec and credential dumping (Mimikatz) to pivot to the domain controller. What phase of the intrusion is this?',
    options: [
      { id: 'a', text: 'Reconnaissance' },
      { id: 'b', text: 'Lateral Movement and Privilege Escalation' },
      { id: 'c', text: 'Weaponization' },
      { id: 'd', text: 'Weapon delivery' }
    ],
    answer: ['b'],
    explanation: 'Pivoting from an initial foothold through intermediate systems toward higher-value targets constitutes Lateral Movement and Privilege Escalation.',
    noteRef: 'cyber-01-lo04',
    reviewed: false
  },
  {
    id: 'cyber-01-q16',
    loId: 'cyber-01-lo04',
    type: 'single',
    difficulty: 3,
    stem: 'Why is the "Command and Control (C2)" phase critical for defenders seeking to disrupt an ongoing breach?',
    options: [
      { id: 'a', text: 'Because blocking C2 communication isolates the compromised implant, preventing the adversary from sending commands or receiving stolen data.' },
      { id: 'b', text: 'Because C2 only operates during daylight hours.' },
      { id: 'c', text: 'Because C2 is strictly prohibited by RFC 1918.' },
      { id: 'd', text: 'Because C2 requires physical hardware intervention.' }
    ],
    answer: ['a'],
    explanation: 'Breaking the C2 channel severs the adversary\'s control over the installed backdoor, stopping active operations.',
    noteRef: 'cyber-01-lo04',
    reviewed: false
  },

  // LO 5 (4 questions)
  {
    id: 'cyber-01-q17',
    loId: 'cyber-01-lo05',
    type: 'single',
    difficulty: 1,
    stem: 'In classical cybersecurity risk assessment, what is the standard qualitative relationship among Risk, Threat, Vulnerability, and Impact?',
    options: [
      { id: 'a', text: 'Risk = Threat + RAM / CPU' },
      { id: 'b', text: 'Risk = Threat x Vulnerability x Impact' },
      { id: 'c', text: 'Risk = Lines of Code x Number of Employees' },
      { id: 'd', text: 'Risk = Firewall Cost - Antivirus License' }
    ],
    answer: ['b'],
    explanation: 'Risk requires all three components: a flaw (vulnerability), an adversary capable of reaching and exploiting it (threat), and negative consequence (impact).',
    noteRef: 'cyber-01-lo05',
    reviewed: false
  },
  {
    id: 'cyber-01-q18',
    loId: 'cyber-01-lo05',
    type: 'scenario',
    difficulty: 2,
    stem: 'A legacy Linux server contains a critical CVSS 10.0 vulnerability. However, it is an isolated development VM with no internet access, no real data, and will be destroyed in 1 hour. Why is operational risk low?',
    options: [
      { id: 'a', text: 'Because CVSS scores are meaningless.' },
      { id: 'b', text: 'Because Threat exposure is near-zero and potential business Impact is negligible, mitigating the raw vulnerability severity.' },
      { id: 'c', text: 'Because Linux is immune to cyberattacks.' },
      { id: 'd', text: 'Because all vulnerabilities expire automatically.' }
    ],
    answer: ['b'],
    explanation: 'A critical vulnerability without threat accessibility or valuable assets represents minimal actual organizational risk.',
    noteRef: 'cyber-01-lo05',
    reviewed: false
  },
  {
    id: 'cyber-01-q19',
    loId: 'cyber-01-lo05',
    type: 'single',
    difficulty: 2,
    stem: 'What standard system provides a standardized numerical severity rating (from 0.0 to 10.0) for reported software vulnerabilities?',
    options: [
      { id: 'a', text: 'CVSS (Common Vulnerability Scoring System)' },
      { id: 'b', text: 'NIST SP 800-53' },
      { id: 'c', text: 'OWASP Top 10' },
      { id: 'd', text: 'DNSSEC' }
    ],
    answer: ['a'],
    explanation: 'CVSS evaluates vulnerability characteristics (attack vector, complexity, privileges required, confidentiality/integrity/availability impact) to generate a standardized score.',
    noteRef: 'cyber-01-lo05',
    reviewed: false
  },
  {
    id: 'cyber-01-q20',
    loId: 'cyber-01-lo05',
    type: 'multi',
    difficulty: 3,
    stem: 'Which of the following are valid risk treatment options in enterprise cybersecurity risk management? (Select all that apply)',
    options: [
      { id: 'a', text: 'Risk Mitigation (implementing technical security controls to reduce likelihood or impact)' },
      { id: 'b', text: 'Risk Transference (purchasing cyber insurance or outsourcing to a compliant SaaS provider)' },
      { id: 'c', text: 'Risk Avoidance (discontinuing a high-risk activity or decommissioning a legacy system)' },
      { id: 'd', text: 'Risk Denial (ignoring security audit findings and refusing to log incidents)' }
    ],
    answer: ['a', 'b', 'c'],
    explanation: 'Mitigation, transference, avoidance, and acceptance are the four recognized risk management options. Denying or hiding risk is negligence.',
    noteRef: 'cyber-01-lo05',
    reviewed: false
  },

  // LO 6 (4 questions)
  {
    id: 'cyber-01-q21',
    loId: 'cyber-01-lo06',
    type: 'single',
    difficulty: 1,
    stem: 'What is the fundamental difference between Symmetric and Asymmetric encryption?',
    options: [
      { id: 'a', text: 'Symmetric encryption uses numbers; asymmetric encryption uses letters.' },
      { id: 'b', text: 'Symmetric uses a single secret key for both encryption and decryption; asymmetric uses a public/private key pair.' },
      { id: 'c', text: 'Symmetric encryption is only legal in North America.' },
      { id: 'd', text: 'Asymmetric encryption is obsolete and unsecure.' }
    ],
    answer: ['b'],
    explanation: 'Symmetric relies on one shared secret key. Asymmetric uses paired keys where data encrypted with the public key can only be decrypted by the matching private key.',
    noteRef: 'cyber-01-lo06',
    reviewed: false
  },
  {
    id: 'cyber-01-q22',
    loId: 'cyber-01-lo06',
    type: 'single',
    difficulty: 2,
    stem: 'Why does the TLS/HTTPS protocol use asymmetric cryptography only during the initial handshake, switching to symmetric AES for actual payload data transfer?',
    options: [
      { id: 'a', text: 'Because symmetric encryption is mathematically impossible to break.' },
      { id: 'b', text: 'Because asymmetric encryption is computationally thousands of times slower than hardware-accelerated symmetric ciphers like AES.' },
      { id: 'c', text: 'Because browsers cannot parse RSA certificates after port 443 opens.' },
      { id: 'd', text: 'To prevent packets from exceeding MTU limits.' }
    ],
    answer: ['b'],
    explanation: 'Asymmetric math (modular exponentiation or elliptic curve points) is compute-heavy. TLS uses it to establish a shared session key, then uses fast AES-GCM for stream data.',
    noteRef: 'cyber-01-lo06',
    reviewed: false
  },
  {
    id: 'cyber-01-q23',
    loId: 'cyber-01-lo06',
    type: 'scenario',
    difficulty: 2,
    stem: 'Alice wants to send Bob an encrypted message that only Bob can read, and Bob wants cryptographic proof that Alice wrote it. How do their keys achieve this?',
    options: [
      { id: 'a', text: 'Alice encrypts with Bob\'s public key; Alice signs with Alice\'s private key.' },
      { id: 'b', text: 'Alice encrypts with Alice\'s public key; Bob signs with Bob\'s private key.' },
      { id: 'c', text: 'Alice encrypts with Bob\'s private key; Bob signs with Alice\'s public key.' },
      { id: 'd', text: 'Both parties share Alice\'s private key over unencrypted email.' }
    ],
    answer: ['a'],
    explanation: 'Encrypting with Bob\'s public key ensures only Bob can decrypt with his private key. Signing with Alice\'s private key allows anyone with her public key to verify her authorship.',
    noteRef: 'cyber-01-lo06',
    reviewed: false
  },
  {
    id: 'cyber-01-q24',
    loId: 'cyber-01-lo06',
    type: 'single',
    difficulty: 3,
    stem: 'What is the role of a Certificate Authority (CA) in Public Key Infrastructure (PKI)?',
    options: [
      { id: 'a', text: 'A CA stores copies of all private keys on internet servers.' },
      { id: 'b', text: 'A CA acts as a trusted third party that signs digital certificates, binding a verified organization identity to its public key.' },
      { id: 'c', text: 'A CA issues IP addresses to home routers.' },
      { id: 'd', text: 'A CA monitors user web browsing for advertising.' }
    ],
    answer: ['b'],
    explanation: 'Without CAs, attackers could impersonate any domain (Man-in-the-Middle) by presenting self-generated public keys. The CA\'s digital signature certifies identity authenticity.',
    noteRef: 'cyber-01-lo06',
    reviewed: false
  },

  // LO 7 (4 questions)
  {
    id: 'cyber-01-q25',
    loId: 'cyber-01-lo07',
    type: 'single',
    difficulty: 1,
    stem: 'What is the core mandate of the Principle of Least Privilege (PoLP)?',
    options: [
      { id: 'a', text: 'Users should have administrator rights so they are not blocked during work hours.' },
      { id: 'b', text: 'Every user, service, and process should be granted only the minimum permissions necessary to perform their legitimate duties.' },
      { id: 'c', text: 'All files must be publicly readable by default.' },
      { id: 'd', text: 'Passwords should be restricted to 4 digits.' }
    ],
    answer: ['b'],
    explanation: 'Restricting permissions to the absolute minimum necessary contains blast radius if an account or service is compromised.',
    noteRef: 'cyber-01-lo07',
    reviewed: false
  },
  {
    id: 'cyber-01-q26',
    loId: 'cyber-01-lo07',
    type: 'single',
    difficulty: 2,
    stem: 'What is the central philosophical shift of Zero Trust Architecture compared to legacy perimeter security?',
    options: [
      { id: 'a', text: 'Zero Trust replaces passwords with magnetic swipe cards.' },
      { id: 'b', text: 'Zero Trust assumes breach and never trusts requests based on network location, requiring continuous explicit authentication and authorization.' },
      { id: 'c', text: 'Zero Trust disables all network encryption.' },
      { id: 'd', text: 'Zero Trust eliminates firewalls.' }
    ],
    answer: ['b'],
    explanation: 'Legacy security assumed anything inside the corporate network perimeter was trustworthy. Zero Trust eliminates implicit trust regardless of network locality.',
    noteRef: 'cyber-01-lo07',
    reviewed: false
  },
  {
    id: 'cyber-01-q27',
    loId: 'cyber-01-lo07',
    type: 'scenario',
    difficulty: 2,
    stem: 'A web application server needs to insert user registration records into a database. Which configuration best adheres to the Principle of Least Privilege?',
    options: [
      { id: 'a', text: 'Connecting as the PostgreSQL superuser \'postgres\' with all privileges.' },
      { id: 'b', text: 'Creating an \'app_writer\' user with INSERT and SELECT rights on the users table only, with no DROP, ALTER, or access to other tables.' },
      { id: 'c', text: 'Disabling database authentication completely.' },
      { id: 'd', text: 'Granting DB administrator permissions to all developers.' }
    ],
    answer: ['b'],
    explanation: 'Limiting the application to strictly required tables and operations ensures an SQL injection vulnerability cannot be leveraged to DROP tables or read other schemas.',
    noteRef: 'cyber-01-lo07',
    reviewed: false
  },
  {
    id: 'cyber-01-q28',
    loId: 'cyber-01-lo07',
    type: 'multi',
    difficulty: 3,
    stem: 'Which of the following are foundational pillars of Zero Trust Architecture? (Select all that apply)',
    options: [
      { id: 'a', text: 'Explicit verification of identity, device health, and context for every transaction' },
      { id: 'b', text: 'Assuming the network is already hostile (Assume Breach)' },
      { id: 'c', text: 'Microsegmentation to prevent lateral movement between workloads' },
      { id: 'd', text: 'Treating all traffic inside the corporate office as automatically authenticated' }
    ],
    answer: ['a', 'b', 'c'],
    explanation: 'Continuous explicit verification, assuming breach, and microsegmentation define Zero Trust. Implicit trust for internal office traffic is the exact legacy anti-pattern it replaces.',
    noteRef: 'cyber-01-lo07',
    reviewed: false
  },

  // LO 8 (4 questions)
  {
    id: 'cyber-01-q29',
    loId: 'cyber-01-lo08',
    type: 'single',
    difficulty: 1,
    stem: 'What is the primary rationale behind the "Defense-in-Depth" architectural strategy?',
    options: [
      { id: 'a', text: 'To ensure servers are installed in deep underground basements.' },
      { id: 'b', text: 'To deploy layered, redundant defensive controls so that the failure of any single control does not result in total system compromise.' },
      { id: 'c', text: 'To reduce the total number of security vendors used by an IT department.' },
      { id: 'd', text: 'To replace software firewalls with physical locks.' }
    ],
    answer: ['b'],
    explanation: 'Defense-in-depth recognizes that any single defensive measure can fail; layered controls ensure backup protection and detection at every step.',
    noteRef: 'cyber-01-lo08',
    reviewed: false
  },
  {
    id: 'cyber-01-q30',
    loId: 'cyber-01-lo08',
    type: 'scenario',
    difficulty: 2,
    stem: 'An attacker bypasses an edge Web Application Firewall (WAF) using an obfuscated SQL injection payload. Which layered defense-in-depth control stops the exploit at the next tier?',
    options: [
      { id: 'a', text: 'Parameterized SQL queries (prepared statements) in application code' },
      { id: 'b', text: 'The office door badge reader' },
      { id: 'c', text: 'A faster network switch' },
      { id: 'd', text: 'A larger hard drive' }
    ],
    answer: ['a'],
    explanation: 'Parameterized queries separate code from data at the application layer, neutralizing SQL injection regardless of whether the WAF detected the payload.',
    noteRef: 'cyber-01-lo08',
    reviewed: false
  },
  {
    id: 'cyber-01-q31',
    loId: 'cyber-01-lo08',
    type: 'single',
    difficulty: 2,
    stem: 'Which category of security control is exemplified by a Security Information and Event Management (SIEM) system analyzing log streams?',
    options: [
      { id: 'a', text: 'Preventative control' },
      { id: 'b', text: 'Detective control' },
      { id: 'c', text: 'Physical control' },
      { id: 'd', text: 'Deterrent control' }
    ],
    answer: ['b'],
    explanation: 'SIEM systems aggregate and correlate telemetry to detect and alert on unauthorized activity that has bypassed preventative barriers.',
    noteRef: 'cyber-01-lo08',
    reviewed: false
  },
  {
    id: 'cyber-01-q32',
    loId: 'cyber-01-lo08',
    type: 'multi',
    difficulty: 3,
    stem: 'Which of the following demonstrate effective Defense-in-Depth for customer database records? (Select all that apply)',
    options: [
      { id: 'a', text: 'Enforcing TLS in transit and AES-256 encryption at rest' },
      { id: 'b', text: 'Placing the database in a private subnet with zero public internet routing' },
      { id: 'c', text: 'Requiring multi-factor authentication (MFA) and bastion jump-hosts for DBA administration' },
      { id: 'd', text: 'Disabling database access logging to improve query throughput' }
    ],
    answer: ['a', 'b', 'c'],
    explanation: 'Encryption, network isolation, and privileged access management provide layered defense. Disabling audit logging destroys detective and compliance capabilities.',
    noteRef: 'cyber-01-lo08',
    reviewed: false
  }
];

const cyberQuizDir = path.join(ROOT_DIR, 'content', 'cybersecurity', 'security-foundations-and-attack-lifecycle', 'quiz');
if (!fs.existsSync(cyberQuizDir)) fs.mkdirSync(cyberQuizDir, { recursive: true });
fs.writeFileSync(path.join(cyberQuizDir, 'bank.json'), JSON.stringify(cyberQuizQuestions, null, 2), 'utf-8');
console.log(`✓ Cybersecurity: 8 notes written, ${cyberQuizQuestions.length} bank questions created.`);

// ====================================================
// 3. IOT: iot-architecture-and-physical-computing
// ====================================================
console.log('Generating IoT Vertical Slice Content...');

const iotNotes = [
  {
    loId: 'iot-01-lo01',
    title: 'Four-Tier IoT Architecture',
    core: `Internet of Things systems operate across four distinct functional layers:
1. **Perception Layer (Physical)**: Physical transducers (sensors and actuators) that interact directly with the environment, sampling analog voltages or triggering physical motion.
2. **Edge Gateway Layer**: Local compute nodes (microcontrollers or industrial gateways) that aggregate sensor telemetry, filter high-frequency noise, and translate serial protocols (I2C/SPI) into network packets.
3. **Network Layer**: Wired or wireless transport infrastructure (Ethernet, Cellular IoT, Wi-Fi, LoRaWAN) routing packets across internet gateways.
4. **Cloud / Application Layer**: High-capacity servers and time-series databases executing business logic, anomaly detection, telemetry analytics, and user dashboards.`,
    worked: `Tracking cold-chain pharmaceutical shipping:
- Perception Layer: DS18B20 digital temperature probe inside shipping container.
- Edge Layer: ESP32 microcontroller reading temperature every 30 seconds and logging to flash memory.
- Network Layer: LTE-M cellular modem transmitting batch packets when network coverage is detected.
- Cloud Layer: InfluxDB time-series database triggering alert emails if temperature exceeds 4°C.`,
    mistake: `Attempting to stream raw uncompressed sensor readings (e.g. 10 kHz vibration data) directly from battery-powered sensors over cellular to the cloud. Edge filtering is essential to conserve bandwidth and battery life.`,
    check: `Which layer of the IoT architecture contains physical temperature sensors and motor relays? (The Perception Layer).`
  },
  {
    loId: 'iot-01-lo02',
    title: 'Sensors vs Actuators',
    core: `Physical computing relies on two complementary transducer categories:
- **Sensors (Inputs)**: Devices that measure a physical phenomenon (temperature, pressure, optical luminosity, magnetic field, acceleration) and convert it into a measurable electrical signal (analog voltage or digital word).
- **Actuators (Outputs)**: Devices that take an electrical control signal and convert it into a physical effect (closing a relay switch, turning a servo motor, firing a solenoid valve, illuminating an LED).
IoT systems create closed control loops: Sensors read state $\\rightarrow$ Compute decides action $\\rightarrow$ Actuators change physical reality.`,
    worked: `A smart greenhouse environmental loop:
1. Soil moisture sensor (transducer) measures capacitive resistance decreasing as soil dries out.
2. Microcontroller reads voltage and decides water is required.
3. Solenoid valve actuator receives 12V current to physically open a pressurized drip irrigation pipe for 45 seconds.`,
    mistake: `Assuming sensors and actuators operate on the same logic voltage as modern microcontrollers (3.3V). Actuators like motors and solenoids require external power supplies, flyback diodes, and relays or MOSFET drivers to isolate high currents from delicate silicon.`,
    check: `Is a stepper motor an IoT sensor or an actuator? (An actuator, because it converts electrical signals into physical mechanical motion).`
  },
  {
    loId: 'iot-01-lo03',
    title: 'Analog vs Digital Sensor Interfacing (ADC, I2C, SPI)',
    core: `Sensors interface with microcontrollers via two primary electrical regimes:
- **Analog Sensors**: Output a continuous voltage proportional to the physical measurement. The MCU uses an **Analog-to-Digital Converter (ADC)** to sample and quantize the voltage into discrete bit values (e.g. 10-bit ADC quantizes $0-3.3\\text{V}$ into $0-1023$ integer levels).
- **Digital Sensors**: Contain onboard micro-silicon with built-in ADCs and signal conditioning. They communicate structured numerical registers over standard digital serial buses:
  - **I2C (Inter-Integrated Circuit)**: 2 wires (SDA data, SCL clock), address-based, supports multiple sensors on one bus, moderate speed (~400 kHz).
  - **SPI (Serial Peripheral Interface)**: 4 wires (MOSI, MISO, SCK, CS), master-slave, very high speed (10-50 MHz), requires dedicated chip-select lines.`,
    worked: `Quantizing a 3.3V analog potentiometer with a 10-bit ADC:
$$\\text{Resolution} = 2^{10} = 1024\\text{ discrete steps}$$
$$\\text{Voltage per step} = \\frac{3.3\\text{ V}}{1023} \\approx 3.225\\text{ mV}$$
If the ADC returns a raw reading of $512$:
$$\\text{Voltage} = 512 \\times 3.225\\text{ mV} = 1.65\\text{ V (midpoint)}$$`,
    mistake: `Connecting multiple SPI devices together without separate Chip Select (CS) pins. Unlike I2C which uses software addresses, SPI devices must be selected individually by pulling their specific CS pin LOW.`,
    check: `How many signal wires does the I2C serial protocol require to communicate with multiple sensors? (Two: SDA data and SCL clock, plus shared ground).`
  },
  {
    loId: 'iot-01-lo04',
    title: 'Microcontrollers (MCUs) vs Microprocessors (MPUs)',
    core: `Choosing edge compute requires understanding the fundamental divide:
- **Microcontroller (MCU, e.g. ARM Cortex-M, ESP32, STM32)**: Single chip integrating CPU, RAM (kilobytes), flash ROM (megabytes), and hardware peripherals (ADC, PWM, timers). Executes bare-metal C or Real-Time Operating Systems (RTOS). Ultra-low power (microamps in sleep), sub-microsecond deterministic interrupt latency.
- **Single-Board Microprocessor (MPU, e.g. Raspberry Pi, ARM Cortex-A)**: High-speed multi-core CPU requiring external RAM (gigabytes) and operating system (Linux). High power consumption (watts), complex multitasking, non-deterministic latency due to OS process scheduling. Ideal for heavy edge video analytics and complex local gateways.`,
    worked: `Edge hardware selection:
- Case A: Battery-powered forest fire sensor sampling temperature and transmitting over LoRa once an hour -> STM32 ultra-low-power MCU (sleeps at $2\\mu\\text{A}$, lasts 5 years on AA batteries).
- Case B: Traffic intersection camera running real-time YOLO computer vision to count vehicle types -> Raspberry Pi 5 or NVIDIA Jetson MPU running Linux.`,
    mistake: `Using a full Linux single-board computer for simple sensor polling. Linux takes 30 seconds to boot, draws hundreds of milliamps continuously, and cannot easily sleep for battery conservation.`,
    check: `If an application requires microsecond-level deterministic motor timing and must run for 3 years on a coin cell battery, should you select an MCU or an MPU? (An MCU running bare-metal or RTOS).`
  },
  {
    loId: 'iot-01-lo05',
    title: 'Wireless Protocols: Range vs Power Trade-offs',
    core: `There is no single universal wireless protocol. IoT connectivity obeys immutable RF physics: **Range, Bandwidth, and Power Consumption form a trilemma**:
1. **Short Range, High Bandwidth (Wi-Fi 802.11)**: High throughput (megabits), high power draw (unsuitable for tiny batteries without aggressive sleep), indoor range (~30m).
2. **Short Range, Ultra-Low Power (BLE 802.15.1)**: Low throughput, tiny coin-cell operation for months, ideal for wearables and indoor beacons (~10-20m).
3. **Mesh Networking (Zigbee 802.15.4 / Thread)**: Self-healing mesh topologies for home automation and smart lighting.
4. **Long Range, Low Power (LPWAN / LoRaWAN)**: Extremely long range (5-15 km), battery life measured in years, but minimal bandwidth (bytes per minute).
5. **Cellular IoT (LTE-M, NB-IoT)**: Operates over national mobile towers, carrier subscription required, reliable outdoor infrastructure telemetry.`,
    worked: `Selecting connectivity for smart agriculture soil probes across a 500-acre farm:
- Wi-Fi: Range is too short; placing access points across 500 acres is cost-prohibitive.
- BLE: Range is strictly limited to 20 meters.
- LoRaWAN: Ideal; a single LoRa gateway mounted on a farm silo covers the entire 500-acre radius, and battery-powered probes send 10-byte moisture readings every 30 minutes for 3+ years.`,
    mistake: `Designing an off-grid battery sensor with Wi-Fi expecting continuous network availability. Wi-Fi radios draw 100-300 mA during transmission and reception, draining small batteries within days unless deep sleep is rigorously applied.`,
    check: `Which wireless protocol is best suited for transmitting small telemetry packets across 10 kilometers on small battery power? (LoRaWAN).`
  },
  {
    loId: 'iot-01-lo06',
    title: 'Constrained Messaging Protocols: MQTT vs CoAP vs HTTP',
    core: `Traditional web protocols like HTTP are poorly suited for constrained edge nodes due to heavy headers, TCP handshake overhead, and request-response polling.
- **MQTT (Message Queuing Telemetry Transport)**: Light publish/subscribe protocol over TCP. Clients connect to a central **Broker**. Publishers publish messages to hierarchical topics (e.g. \`sensors/building1/floor2/temp\`); subscribers receive matching topic updates instantly. Tiny 2-byte header overhead. Features three Quality of Service (QoS 0, 1, 2) levels and persistent KeepAlive.
- **CoAP (Constrained Application Protocol)**: RESTful protocol designed for ultra-constrained nodes operating over lightweight UDP. Supports GET, POST, PUT, DELETE with compact binary headers.
- **HTTP/REST**: Heavy ASCII text headers, requires opening and tearing down TCP connections or keeping persistent HTTP/2 streams open. Reserved for high-bandwidth edge gateways.`,
    worked: `MQTT topic hierarchy and subscription:
- Publishing node sends temperature $22.4$: \`factory/line3/oven/temp\`
- Central monitoring dashboard subscribes to wildcard: \`factory/+/+/temp\`
- Maintenance service subscribes to all oven events: \`factory/line3/oven/#\`
The broker handles all fan-out routing without sensors needing to know who is listening.`,
    mistake: `Using QoS 2 ("exactly once" delivery) for high-frequency continuous sensor readings. QoS 2 requires a 4-step handshake, dramatically increasing network latency and battery consumption. Continuous sensor telemetry is best suited for QoS 0 or QoS 1.`,
    check: `Does an MQTT sensor publish directly to other sensors, or to a central broker? (To a central broker, which routes messages to subscribers based on topics).`
  },
  {
    loId: 'iot-01-lo07',
    title: 'Edge Computing Trade-Offs',
    core: `Edge computing moves data processing and intelligence from centralized cloud datacenters directly onto local nodes or local network gateways.
**Advantages**:
1. **Ultra-Low Latency**: Decisions are made in milliseconds locally without waiting for round-trip WAN packet routing (critical for industrial safety shutoffs and autonomous vehicles).
2. **Bandwidth Conservation**: Local filtering reduces gigabytes of raw sensor noise to concise summary events before transmission.
3. **Offline Autonomy**: Systems remain operational even when WAN internet connectivity drops.
4. **Data Privacy**: Sensitive audio, video, or biometric telemetry is processed locally without leaving the premises.
**Trade-offs**: Constrained memory and compute on edge devices, complex firmware update deployments, and physical security risks.`,
    worked: `Industrial vibration monitoring on an offshore turbine:
- Cloud-centric model: Stream 20,000 accelerometer samples/sec over satellite uplink ($10,000/month in satellite bandwidth fees; fails if satellite link drops).
- Edge computing model: Microcontroller computes Fast Fourier Transform (FFT) locally every second, detects bearing wear harmonic peaks, and sends a 4-byte health status code once per hour over satellite. Bandwidth reduced by 99.99%.`,
    mistake: `Assuming edge computing means moving *all* compute out of the cloud. Modern architectures use a hybrid approach: edge handles sub-second real-time filtering and control; cloud handles multi-year longitudinal analytics, machine learning training, and cross-site optimization.`,
    check: `What is the primary operational advantage of edge computing for emergency shutdown systems in industrial factories? (Ultra-low deterministic latency and offline autonomy without depending on internet connectivity).`
  },
  {
    loId: 'iot-01-lo08',
    title: 'Hardware and Firmware Attack Surfaces',
    core: `Unlike cloud servers locked inside secure datacenters, IoT devices are deployed in physically accessible environments, exposing unique hardware attack vectors:
1. **Unprotected Debug Ports (UART / JTAG)**: Physical test pads left active on printed circuit boards (PCBs) allow attackers to attach logic analyzers, gain root root shells, or dump firmware.
2. **Cleartext External Flash**: SPI flash memory chips soldered onto PCBs can be desoldered or probed in-circuit with an EEPROM reader to extract firmware and hardcoded cryptographic keys.
3. **Lack of Secure Boot**: Without cryptographic signature verification on boot, an attacker can flash malicious modified firmware.
4. **Hardcoded Credentials & Default Passwords**: Millions of connected IP cameras and routers fall prey to botnets (like Mirai) scanning for default telnet/ssh credentials.`,
    worked: `Hardening a production IoT PCB:
- Development prototype: Exposed 4-pin header for UART root console (\`115200 baud\`), cleartext firmware in external flash.
- Production hardened: Physically remove debug header test pads, disable hardware JTAG/UART in MCU eFuses, enable Hardware Secure Boot with cryptographic signature keys burned into one-time-programmable silicon, and enable on-the-fly flash memory encryption (AES-XTS).`,
    mistake: `Relying on software obscurity (like hiding UART pinouts) instead of hardware disabling. Security researchers can identify ground, transmit, and receive pins on a PCB in minutes using a multimeter or logic analyzer.`,
    check: `How can an attacker extract firmware from an IoT device that has no network vulnerabilities? (By physically clipping an EEPROM reader onto the external SPI flash memory chip or accessing unprotected UART/JTAG debug pads).`
  }
];

for (const n of iotNotes) {
  writeNoteBlock('iot', 'iot-architecture-and-physical-computing', n.loId, n.title, n.core, n.worked, n.mistake, n.check);
}

// ----------------------------------------------------
// IoT Quiz Bank (32 questions: 4 per core LO)
// ----------------------------------------------------
const iotQuizQuestions = [
  // LO 1 (4 questions)
  {
    id: 'iot-01-q01',
    loId: 'iot-01-lo01',
    type: 'single',
    difficulty: 1,
    stem: 'In the four-tier IoT architecture, which layer is responsible for direct physical interaction with the environment through transducers?',
    options: [
      { id: 'a', text: 'Cloud Application Layer' },
      { id: 'b', text: 'Perception Layer' },
      { id: 'c', text: 'Network Routing Layer' },
      { id: 'd', text: 'Business Analytics Layer' }
    ],
    answer: ['b'],
    explanation: 'The Perception Layer contains physical sensors (converting physical inputs to electrical signals) and actuators (producing physical outputs).',
    noteRef: 'iot-01-lo01',
    reviewed: false
  },
  {
    id: 'iot-01-q02',
    loId: 'iot-01-lo01',
    type: 'scenario',
    difficulty: 2,
    stem: 'An industrial facility deploys vibration sensors that sample at 20 kHz. Streaming this raw data directly to cloud storage exhausts network bandwidth. Which IoT architecture layer should process this data locally before transmission?',
    options: [
      { id: 'a', text: 'The Edge Gateway Layer' },
      { id: 'b', text: 'The DNS Nameserver' },
      { id: 'c', text: 'The User Interface Presentation Layer' },
      { id: 'd', text: 'The Enterprise Billing Layer' }
    ],
    answer: ['a'],
    explanation: 'Edge Gateways aggregate, filter, and extract features from high-frequency sensor streams before sending summary metrics across the network.',
    noteRef: 'iot-01-lo01',
    reviewed: false
  },
  {
    id: 'iot-01-q03',
    loId: 'iot-01-lo01',
    type: 'single',
    difficulty: 2,
    stem: 'What is the primary function of the Network Layer in an IoT ecosystem?',
    options: [
      { id: 'a', text: 'To manufacture silicon semiconductors.' },
      { id: 'b', text: 'To transport telemetry packets between edge devices/gateways and central cloud platforms across protocols like Ethernet, Cellular, or LPWAN.' },
      { id: 'c', text: 'To convert analog voltage into mechanical rotation.' },
      { id: 'd', text: 'To render HTML graphs in a web browser.' }
    ],
    answer: ['b'],
    explanation: 'The Network Layer provides the connectivity and routing fabric transmitting data between edge nodes and cloud systems.',
    noteRef: 'iot-01-lo01',
    reviewed: false
  },
  {
    id: 'iot-01-q04',
    loId: 'iot-01-lo01',
    type: 'multi',
    difficulty: 3,
    stem: 'Which components typically reside in the Perception Layer of an IoT deployment? (Select all that apply)',
    options: [
      { id: 'a', text: 'Thermistor temperature sensors' },
      { id: 'b', text: 'Solenoid fluid control valves' },
      { id: 'c', text: 'Central PostgreSQL database cluster' },
      { id: 'd', text: 'Piezoelectric vibration transducers' }
    ],
    answer: ['a', 'b', 'd'],
    explanation: 'Sensors (thermistors, piezo sensors) and actuators (solenoid valves) are perception layer devices. Database clusters reside in the cloud layer.',
    noteRef: 'iot-01-lo01',
    reviewed: false
  },

  // LO 2 (4 questions)
  {
    id: 'iot-01-q05',
    loId: 'iot-01-lo02',
    type: 'single',
    difficulty: 1,
    stem: 'What fundamental operational difference distinguishes an IoT Sensor from an IoT Actuator?',
    options: [
      { id: 'a', text: 'Sensors run on AC power; actuators run on solar power.' },
      { id: 'b', text: 'Sensors measure physical phenomena and produce electrical signals; actuators accept electrical signals to create physical movement or action.' },
      { id: 'c', text: 'Sensors are purely software; actuators are purely hardware.' },
      { id: 'd', text: 'Sensors require internet connection; actuators do not.' }
    ],
    answer: ['b'],
    explanation: 'Sensors are inputs (measuring real-world states); actuators are outputs (modifying real-world states).',
    noteRef: 'iot-01-lo02',
    reviewed: false
  },
  {
    id: 'iot-01-q06',
    loId: 'iot-01-lo02',
    type: 'scenario',
    difficulty: 2,
    stem: 'In an automated smart heating system, a digital temperature probe reads 18°C and sends a signal to a heating element switch. Identify the sensor and actuator.',
    options: [
      { id: 'a', text: 'Sensor: heating element switch; Actuator: digital temperature probe.' },
      { id: 'b', text: 'Sensor: digital temperature probe; Actuator: heating element switch/relay.' },
      { id: 'c', text: 'Both are sensors.' },
      { id: 'd', text: 'Both are actuators.' }
    ],
    answer: ['b'],
    explanation: 'The temperature probe senses thermal energy (input); the switch/relay actuates the heater (output).',
    noteRef: 'iot-01-lo02',
    reviewed: false
  },
  {
    id: 'iot-01-q07',
    loId: 'iot-01-lo02',
    type: 'single',
    difficulty: 2,
    stem: 'Why should inductive actuators like DC motors and solenoids never be connected directly to a microcontroller GPIO pin?',
    options: [
      { id: 'a', text: 'Because microcontrollers cannot output direct current.' },
      { id: 'b', text: 'Because inductive coils produce high-voltage flyback spikes and draw currents exceeding the GPIO pin\'s maximum rating (~20mA), which destroys the silicon.' },
      { id: 'c', text: 'Because motors cause wireless interference that blocks Wi-Fi.' },
      { id: 'd', text: 'Because GPIO pins only accept audio inputs.' }
    ],
    answer: ['b'],
    explanation: 'Inductive loads draw high currents and generate massive inductive voltage spikes when switched off. Transistor/MOSFET drivers and flyback diodes are required.',
    noteRef: 'iot-01-lo02',
    reviewed: false
  },
  {
    id: 'iot-01-q08',
    loId: 'iot-01-lo02',
    type: 'multi',
    difficulty: 3,
    stem: 'Which of the following devices function as physical Actuators? (Select all that apply)',
    options: [
      { id: 'a', text: 'Servo motor' },
      { id: 'b', text: 'Piezoelectric buzzer' },
      { id: 'c', text: 'Photodiode light sensor' },
      { id: 'd', text: 'Solid-state electrical power relay' }
    ],
    answer: ['a', 'b', 'd'],
    explanation: 'Servos (mechanical motion), buzzers (acoustic waves), and relays (electrical switching) are actuators. Photodiodes are optical sensors.',
    noteRef: 'iot-01-lo02',
    reviewed: false
  },

  // LO 3 (4 questions)
  {
    id: 'iot-01-q09',
    loId: 'iot-01-lo03',
    type: 'single',
    difficulty: 1,
    stem: 'What is the role of an Analog-to-Digital Converter (ADC) in microcontroller physical computing?',
    options: [
      { id: 'a', text: 'To convert written C code into machine binary.' },
      { id: 'b', text: 'To sample a continuous analog input voltage and quantize it into a discrete digital numerical value.' },
      { id: 'c', text: 'To amplify audio signals.' },
      { id: 'd', text: 'To convert alternating current from wall outlets into direct current.' }
    ],
    answer: ['b'],
    explanation: 'An ADC measures continuous electrical voltage and converts it into a discrete integer value (e.g. 0 to 1023 for a 10-bit converter).',
    noteRef: 'iot-01-lo03',
    reviewed: false
  },
  {
    id: 'iot-01-q10',
    loId: 'iot-01-lo03',
    type: 'scenario',
    difficulty: 2,
    stem: 'A 10-bit ADC has a reference voltage of 3.3V. If an analog sensor outputs 1.65V, what raw digital integer will the microcontroller read?',
    options: [
      { id: 'a', text: '256' },
      { id: 'b', text: '512' },
      { id: 'c', text: '1024' },
      { id: 'd', text: '1650' }
    ],
    answer: ['b'],
    explanation: 'A 10-bit range spans 0 to 1023 (1024 steps). 1.65V is exactly half of 3.3V, so the ADC value is 1024 / 2 = 512.',
    noteRef: 'iot-01-lo03',
    reviewed: false
  },
  {
    id: 'iot-01-q11',
    loId: 'iot-01-lo03',
    type: 'single',
    difficulty: 2,
    stem: 'How does the I2C digital sensor communication bus differ from SPI?',
    options: [
      { id: 'a', text: 'I2C uses 2 shared wires (SDA/SCL) and 7-bit device addresses; SPI uses 4 wires (MOSI/MISO/SCK/CS) and requires dedicated Chip Select lines per device.' },
      { id: 'b', text: 'I2C is analog, while SPI is digital.' },
      { id: 'c', text: 'I2C is wireless, while SPI is wired.' },
      { id: 'd', text: 'I2C is only supported by Raspberry Pi.' }
    ],
    answer: ['a'],
    explanation: 'I2C minimizes pin count by addressing devices over a shared 2-wire bus. SPI provides faster throughput with 4 wires and individual Chip Select lines.',
    noteRef: 'iot-01-lo03',
    reviewed: false
  },
  {
    id: 'iot-01-q12',
    loId: 'iot-01-lo03',
    type: 'multi',
    difficulty: 3,
    stem: 'Which communication protocols are standard synchronous or asynchronous digital interfaces for embedded sensors? (Select all that apply)',
    options: [
      { id: 'a', text: 'I2C (Inter-Integrated Circuit)' },
      { id: 'b', text: 'SPI (Serial Peripheral Interface)' },
      { id: 'c', text: 'UART (Universal Asynchronous Receiver-Transmitter)' },
      { id: 'd', text: 'BGP (Border Gateway Protocol)' }
    ],
    answer: ['a', 'b', 'c'],
    explanation: 'I2C, SPI, and UART are the three universal hardware serial communication protocols for embedded sensors. BGP is an internet routing protocol.',
    noteRef: 'iot-01-lo03',
    reviewed: false
  },

  // LO 4 (4 questions)
  {
    id: 'iot-01-q13',
    loId: 'iot-01-lo04',
    type: 'single',
    difficulty: 1,
    stem: 'What is the primary architectural characteristic of a Microcontroller Unit (MCU) compared to a Microprocessor (MPU)?',
    options: [
      { id: 'a', text: 'An MCU requires external DDR RAM chips to execute code.' },
      { id: 'b', text: 'An MCU integrates the processor core, RAM, Flash memory, and hardware peripherals (ADC, timers) onto a single silicon die.' },
      { id: 'c', text: 'An MCU always runs a full desktop Linux operating system.' },
      { id: 'd', text: 'An MCU consumes more power than a desktop workstation.' }
    ],
    answer: ['b'],
    explanation: 'MCUs are self-contained single-chip systems containing compute, memory, and I/O peripherals, optimized for low power and bare-metal control.',
    noteRef: 'iot-01-lo04',
    reviewed: false
  },
  {
    id: 'iot-01-q14',
    loId: 'iot-01-lo04',
    type: 'scenario',
    difficulty: 2,
    stem: 'You are designing an emergency automotive airbag deployment module that must react within 5 milliseconds of an impact sensor trigger. Why is a bare-metal/RTOS Microcontroller preferred over a Linux Microprocessor?',
    options: [
      { id: 'a', text: 'Because Linux cannot read sensor data.' },
      { id: 'b', text: 'Because MCUs running bare-metal or RTOS provide hard real-time deterministic latency, whereas general-purpose OS schedulers can introduce unpredictable delays.' },
      { id: 'c', text: 'Because microcontrollers are physically heavier.' },
      { id: 'd', text: 'Because microprocessors do not support C programming.' }
    ],
    answer: ['b'],
    explanation: 'Safety-critical applications require hard real-time guarantees where interrupts and code execution deadlines are mathematically deterministic.',
    noteRef: 'iot-01-lo04',
    reviewed: false
  },
  {
    id: 'iot-01-q15',
    loId: 'iot-01-lo04',
    type: 'single',
    difficulty: 2,
    stem: 'What is typical sleep current consumption for an ultra-low-power modern microcontroller (such as an ARM Cortex-M0+ or ESP32 deep sleep)?',
    options: [
      { id: 'a', text: '1 to 5 Amperes' },
      { id: 'b', text: '100 to 500 Milliamps' },
      { id: 'c', text: '1 to 15 Microamps' },
      { id: 'd', text: 'Zero (perpetual motion)' }
    ],
    answer: ['c'],
    explanation: 'In deep sleep modes with clocks gated and core power removed, modern MCUs draw only a few microamps (running an RTC timer), enabling years of battery operation.',
    noteRef: 'iot-01-lo04',
    reviewed: false
  },
  {
    id: 'iot-01-q16',
    loId: 'iot-01-lo04',
    type: 'multi',
    difficulty: 3,
    stem: 'In which scenarios is a Linux Single-Board Microprocessor (MPU) preferred over a low-power Microcontroller (MCU)? (Select all that apply)',
    options: [
      { id: 'a', text: 'Running real-time object detection using a convolutional neural network on a 1080p video feed.' },
      { id: 'b', text: 'Hosting a local web application server with an embedded relational database and graphical desktop UI.' },
      { id: 'c', text: 'Reading a single analog soil moisture probe once every 24 hours on a coin cell battery.' },
      { id: 'd', text: 'Serving as an industrial multi-protocol edge gateway connecting 50 Zigbee and BLE sensor networks.' }
    ],
    answer: ['a', 'b', 'd'],
    explanation: 'Heavy computer vision, full web/database stacks, and complex gateway orchestration require the gigabytes of RAM and compute of MPUs. Daily soil polling is ideal for MCUs.',
    noteRef: 'iot-01-lo04',
    reviewed: false
  },

  // LO 5 (4 questions)
  {
    id: 'iot-01-q17',
    loId: 'iot-01-lo05',
    type: 'single',
    difficulty: 1,
    stem: 'What fundamental trade-off governs all wireless communications in battery-powered IoT devices?',
    options: [
      { id: 'a', text: 'Cost vs Color' },
      { id: 'b', text: 'Range, Bandwidth, and Power Consumption form a trilemma where maximizing two necessitates sacrificing the third.' },
      { id: 'c', text: 'Antenna length must equal the battery diameter.' },
      { id: 'd', text: 'All wireless signals travel at the speed of sound.' }
    ],
    answer: ['b'],
    explanation: 'Transmitting higher bandwidth across longer distances requires exponentially more radio frequency power.',
    noteRef: 'iot-01-lo05',
    reviewed: false
  },
  {
    id: 'iot-01-q18',
    loId: 'iot-01-lo05',
    type: 'scenario',
    difficulty: 2,
    stem: 'A smart agriculture company needs to deploy 50 soil probes across an isolated 2,000-acre vineyard with no cellular or Wi-Fi coverage. Probes transmit 12 bytes of data every hour. Which protocol is best suited?',
    options: [
      { id: 'a', text: 'Wi-Fi (802.11ac)' },
      { id: 'b', text: 'Bluetooth Low Energy (BLE)' },
      { id: 'c', text: 'LoRaWAN' },
      { id: 'd', text: 'NFC' }
    ],
    answer: ['c'],
    explanation: 'LoRaWAN provides sub-GHz long-range coverage (up to 15km line-of-sight) with minimal power draw, ideal for low-payload rural telemetry.',
    noteRef: 'iot-01-lo05',
    reviewed: false
  },
  {
    id: 'iot-01-q19',
    loId: 'iot-01-lo05',
    type: 'single',
    difficulty: 2,
    stem: 'What network topology allows Zigbee and Thread smart home devices to extend range across an entire building?',
    options: [
      { id: 'a', text: 'Mesh network topology where mains-powered nodes act as routers relaying packets for neighbors.' },
      { id: 'b', text: 'Direct point-to-point laser links.' },
      { id: 'c', text: 'Star network topology connecting directly to cell towers.' },
      { id: 'd', text: 'Token ring topology over coaxial cables.' }
    ],
    answer: ['a'],
    explanation: 'Mesh topologies allow nodes to route packets across multiple hops, extending effective network reach throughout buildings.',
    noteRef: 'iot-01-lo05',
    reviewed: false
  },
  {
    id: 'iot-01-q20',
    loId: 'iot-01-lo05',
    type: 'multi',
    difficulty: 3,
    stem: 'Which wireless protocols belong to the Low-Power Wide-Area Network (LPWAN) category designed for kilometers of range on batteries? (Select all that apply)',
    options: [
      { id: 'a', text: 'LoRaWAN' },
      { id: 'b', text: 'NB-IoT (Narrowband IoT)' },
      { id: 'c', text: 'Sigfox' },
      { id: 'd', text: 'Gigabit Wi-Fi 6' }
    ],
    answer: ['a', 'b', 'c'],
    explanation: 'LoRaWAN, NB-IoT, and Sigfox are classic LPWAN technologies prioritizing long distance and multi-year battery life over bandwidth.',
    noteRef: 'iot-01-lo05',
    reviewed: false
  },

  // LO 6 (4 questions)
  {
    id: 'iot-01-q21',
    loId: 'iot-01-lo06',
    type: 'single',
    difficulty: 1,
    stem: 'What architectural communication model does the MQTT IoT messaging protocol use?',
    options: [
      { id: 'a', text: 'Client-server synchronous polling (HTTP GET)' },
      { id: 'b', text: 'Publish / Subscribe pattern mediated by a central Broker' },
      { id: 'c', text: 'Peer-to-peer torrent exchange' },
      { id: 'd', text: 'Master-slave clock line switching' }
    ],
    answer: ['b'],
    explanation: 'MQTT decouples senders (publishers) from receivers (subscribers) through named topics routed by a central MQTT broker.',
    noteRef: 'iot-01-lo06',
    reviewed: false
  },
  {
    id: 'iot-01-q22',
    loId: 'iot-01-lo06',
    type: 'scenario',
    difficulty: 2,
    stem: 'An IoT temperature sensor publishes reading 24.5°C to the topic "building1/floor2/room104/temp". Which subscription topic filter will receive this update?',
    options: [
      { id: 'a', text: 'building1/floor2/+/temp' },
      { id: 'b', text: 'building1/floor3/#' },
      { id: 'c', text: 'building2/temp' },
      { id: 'd', text: 'sensors/all' }
    ],
    answer: ['a'],
    explanation: 'The \'+\' wildcard matches a single topic level, so \'building1/floor2/+/temp\' matches room104 (and any other room on floor 2).',
    noteRef: 'iot-01-lo06',
    reviewed: false
  },
  {
    id: 'iot-01-q23',
    loId: 'iot-01-lo06',
    type: 'single',
    difficulty: 2,
    stem: 'Why is CoAP (Constrained Application Protocol) implemented over UDP rather than TCP?',
    options: [
      { id: 'a', text: 'Because UDP eliminates connection handshake overhead and packet keepalive state, reducing radio-on time on energy-constrained nodes.' },
      { id: 'b', text: 'Because TCP packets cannot cross fiber optic cables.' },
      { id: 'c', text: 'Because UDP encrypts data automatically.' },
      { id: 'd', text: 'Because UDP supports larger file transfers than TCP.' }
    ],
    answer: ['a'],
    explanation: 'UDP avoids the 3-way handshake and continuous state of TCP, allowing low-power nodes to wake up, fire a quick packet, and immediately return to deep sleep.',
    noteRef: 'iot-01-lo06',
    reviewed: false
  },
  {
    id: 'iot-01-q24',
    loId: 'iot-01-lo06',
    type: 'multi',
    difficulty: 3,
    stem: 'What are the three Quality of Service (QoS) delivery tiers defined in the MQTT standard? (Select all that apply)',
    options: [
      { id: 'a', text: 'QoS 0: At most once (fire-and-forget without acknowledgement)' },
      { id: 'b', text: 'QoS 1: At least once (acknowledged delivery with potential duplicates)' },
      { id: 'c', text: 'QoS 2: Exactly once (four-step handshake ensuring no loss and no duplicates)' },
      { id: 'd', text: 'QoS 3: Instantaneous telepathic transfer' }
    ],
    answer: ['a', 'b', 'c'],
    explanation: 'MQTT defines QoS 0, 1, and 2, allowing developers to balance network reliability overhead against battery and bandwidth constraints.',
    noteRef: 'iot-01-lo06',
    reviewed: false
  },

  // LO 7 (4 questions)
  {
    id: 'iot-01-q25',
    loId: 'iot-01-lo07',
    type: 'single',
    difficulty: 1,
    stem: 'What is the primary definition of "Edge Computing" in an IoT system?',
    options: [
      { id: 'a', text: 'Moving compute and analytics close to where data is generated (on local gateways or devices) rather than exclusively in central cloud datacenters.' },
      { id: 'b', text: 'Placing servers on the geometric border of country boundaries.' },
      { id: 'c', text: 'Using sharpening filters on digital photos.' },
      { id: 'd', text: 'Running operating systems from USB flash drives.' }
    ],
    answer: ['a'],
    explanation: 'Edge computing decentralizes processing by analyzing data locally at the edge of the network where physical phenomena occur.',
    noteRef: 'iot-01-lo07',
    reviewed: false
  },
  {
    id: 'iot-01-q26',
    loId: 'iot-01-lo07',
    type: 'scenario',
    difficulty: 2,
    stem: 'An autonomous mining haul truck uses LIDAR to detect obstacles and apply emergency brakes. Why can this collision prevention system NOT be hosted in a remote cloud datacenter?',
    options: [
      { id: 'a', text: 'Because cloud databases do not support LIDAR point clouds.' },
      { id: 'b', text: 'Because network latency and variable wireless coverage could delay braking decisions by hundreds of milliseconds, resulting in a fatal collision.' },
      { id: 'c', text: 'Because autonomous vehicles are legally barred from using internet connections.' },
      { id: 'd', text: 'Because LIDAR signals cannot travel over copper cables.' }
    ],
    answer: ['b'],
    explanation: 'Safety-critical reflex actions require single-digit millisecond deterministic latency and immunity to WAN network dropouts.',
    noteRef: 'iot-01-lo07',
    reviewed: false
  },
  {
    id: 'iot-01-q27',
    loId: 'iot-01-lo07',
    type: 'single',
    difficulty: 2,
    stem: 'How does Edge Computing contribute to data privacy and regulatory compliance (like GDPR or HIPAA)?',
    options: [
      { id: 'a', text: 'It deletes all user data immediately upon collection.' },
      { id: 'b', text: 'Sensitive raw telemetry (audio, video, biometrics) can be processed locally to extract metadata, ensuring raw identifiable data never leaves the local perimeter.' },
      { id: 'c', text: 'It grants diplomatic immunity to IoT devices.' },
      { id: 'd', text: 'It converts private data into public blockchain transactions.' }
    ],
    answer: ['b'],
    explanation: 'By keeping raw data local and only transmitting aggregated or anonymized insights, edge computing satisfies strict data sovereignty and privacy mandates.',
    noteRef: 'iot-01-lo07',
    reviewed: false
  },
  {
    id: 'iot-01-q28',
    loId: 'iot-01-lo07',
    type: 'multi',
    difficulty: 3,
    stem: 'Which trade-offs and engineering challenges are associated with deploying Edge Computing architectures? (Select all that apply)',
    options: [
      { id: 'a', text: 'Edge devices have constrained memory, storage, and thermal dissipation budgets compared to cloud servers.' },
      { id: 'b', text: 'Deploying, managing, and securing remote firmware updates across thousands of distributed edge nodes is complex.' },
      { id: 'c', text: 'Edge devices are physically accessible to adversaries in uncontrolled environments.' },
      { id: 'd', text: 'Edge computing mathematically increases network bandwidth usage by 1000%.' }
    ],
    answer: ['a', 'b', 'c'],
    explanation: 'Hardware constraints, fleet management complexity, and physical vulnerability are primary edge challenges. Bandwidth usage is decreased, not increased.',
    noteRef: 'iot-01-lo07',
    reviewed: false
  },

  // LO 8 (4 questions)
  {
    id: 'iot-01-q29',
    loId: 'iot-01-lo08',
    type: 'single',
    difficulty: 1,
    stem: 'Why do hardware debug ports (UART and JTAG) left accessible on production IoT circuit boards pose a severe security risk?',
    options: [
      { id: 'a', text: 'Because they short-circuit the battery if touched.' },
      { id: 'b', text: 'Because an attacker with physical access can connect a serial adapter to gain an unauthenticated root shell or extract device firmware.' },
      { id: 'c', text: 'Because they transmit Wi-Fi passwords over radio frequencies.' },
      { id: 'd', text: 'Because they prevent the device from booting in warm climates.' }
    ],
    answer: ['b'],
    explanation: 'UART and JTAG test pads provide direct low-level serial access to processor registers and consoles, often bypassing all software login screens.',
    noteRef: 'iot-01-lo08',
    reviewed: false
  },
  {
    id: 'iot-01-q30',
    loId: 'iot-01-lo08',
    type: 'scenario',
    difficulty: 2,
    stem: 'An attacker uses an inexpensive SPI flash clip on a smart lock\'s PCB to read the 8-pin flash memory chip. If firmware is unencrypted, what can the attacker discover?',
    options: [
      { id: 'a', text: 'Only the manufacturer\'s phone number.' },
      { id: 'b', text: 'The complete executable binary, hardcoded Wi-Fi passwords, private API keys, and device cryptographic secrets.' },
      { id: 'c', text: 'Nothing, because SPI chips wipe themselves when unpowered.' },
      { id: 'd', text: 'The battery percentage only.' }
    ],
    answer: ['b'],
    explanation: 'External SPI flash chips hold persistent non-volatile data in cleartext unless on-the-fly hardware flash encryption is enabled.',
    noteRef: 'iot-01-lo08',
    reviewed: false
  },
  {
    id: 'iot-01-q31',
    loId: 'iot-01-lo08',
    type: 'single',
    difficulty: 2,
    stem: 'How does Hardware "Secure Boot" protect an embedded microcontroller from running compromised code?',
    options: [
      { id: 'a', text: 'By requiring the user to type a 16-character password on startup.' },
      { id: 'b', text: 'By using an immutable public key burned into silicon eFuses to cryptographically verify the digital signature of the bootloader and firmware before execution.' },
      { id: 'c', text: 'By checking that the power supply voltage is exactly 5.0V.' },
      { id: 'd', text: 'By connecting to cloud servers during boot.' }
    ],
    answer: ['b'],
    explanation: 'Secure Boot creates a root of trust in hardware: if the firmware signature does not match the immutable vendor key in eFuses, the processor refuses to execute.',
    noteRef: 'iot-01-lo08',
    reviewed: false
  },
  {
    id: 'iot-01-q32',
    loId: 'iot-01-lo08',
    type: 'multi',
    difficulty: 3,
    stem: 'Which security practices harden physical IoT hardware against local attack surfaces? (Select all that apply)',
    options: [
      { id: 'a', text: 'Disabling JTAG and UART interfaces in production silicon eFuses' },
      { id: 'b', text: 'Enabling hardware flash encryption (AES-XTS) so probed SPI memory yields only ciphertext' },
      { id: 'c', text: 'Generating unique, non-default random credentials per device during factory provisioning' },
      { id: 'd', text: 'Printing default admin credentials on the exterior casing of all devices' }
    ],
    answer: ['a', 'b', 'c'],
    explanation: 'Disabling debug ports, encrypting flash storage, and provisioning unique credentials neutralize common hardware and botnet attack vectors.',
    noteRef: 'iot-01-lo08',
    reviewed: false
  }
];

const iotQuizDir = path.join(ROOT_DIR, 'content', 'iot', 'iot-architecture-and-physical-computing', 'quiz');
if (!fs.existsSync(iotQuizDir)) fs.mkdirSync(iotQuizDir, { recursive: true });
fs.writeFileSync(path.join(iotQuizDir, 'bank.json'), JSON.stringify(iotQuizQuestions, null, 2), 'utf-8');
console.log(`✓ IoT: 8 notes written, ${iotQuizQuestions.length} bank questions created.`);
