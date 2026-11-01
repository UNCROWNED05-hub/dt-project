/**
 * scripts/generate-sec-batch5.mjs
 *
 * Generates Batch 5 for Course 2 (Cybersecurity):
 * - Chapter 2: networking-essentials-for-defenders (sec-02)
 * - Chapter 3: linux-windows-and-the-defense-cli (sec-03)
 */

import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();

function writeNoteBlock(courseSlug, chapterSlug, loId, coreIdea, workedExample, commonMistake, checkYourself, sources = ["lic-09"]) {
  const dir = path.join(ROOT_DIR, 'content', courseSlug, chapterSlug, 'notes');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const content = `---
loId: "${loId}"
reviewed: false
sources: ${JSON.stringify(sources)}
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
// CHAPTER 2: networking-essentials-for-defenders (sec-02)
// ============================================================================
const ch02Objectives = {
  version: 1,
  chapterId: "sec-02",
  objectives: [
    {
      id: "sec-02-lo01",
      order: 1,
      title: "Explain the OSI and TCP/IP layered networking models",
      bloom: "understand",
      tier: "core",
      mustHave: true,
      keywords: ["osi model", "tcp/ip model", "encapsulation", "protocol stack"],
      aliases: ["7-layer model", "packet encapsulation"],
      prerequisites: ["sec-01-lo01"],
      estMinutes: 10
    },
    {
      id: "sec-02-lo02",
      order: 2,
      title: "Dissect IP, TCP, and UDP packet headers for defensive analysis",
      bloom: "dissect",
      tier: "core",
      mustHave: true,
      keywords: ["ip header", "tcp header", "udp header", "ttl", "flags"],
      aliases: ["packet header analysis", "header inspection"],
      prerequisites: ["sec-02-lo01"],
      estMinutes: 14
    },
    {
      id: "sec-02-lo03",
      order: 3,
      title: "Trace the TCP three-way handshake and connection teardown flags",
      bloom: "trace",
      tier: "core",
      mustHave: true,
      keywords: ["three-way handshake", "syn", "syn-ack", "ack", "fin", "rst"],
      aliases: ["tcp connection establishment", "tcp teardown"],
      prerequisites: ["sec-02-lo02"],
      estMinutes: 12
    },
    {
      id: "sec-02-lo04",
      order: 4,
      title: "Analyze DNS resolution flows and query transaction records",
      bloom: "analyze",
      tier: "core",
      mustHave: false,
      keywords: ["dns resolution", "a record", "cname", "authoritative nameserver"],
      aliases: ["recursive resolver", "dns query flow"],
      prerequisites: ["sec-02-lo01"],
      estMinutes: 12
    },
    {
      id: "sec-02-lo05",
      order: 5,
      title: "Examine ARP protocol mapping and ARP poisoning mitigation",
      bloom: "examine",
      tier: "core",
      mustHave: false,
      keywords: ["arp table", "mac address", "dynamic arp inspection", "spoofing"],
      aliases: ["address resolution protocol", "dai"],
      prerequisites: ["sec-02-lo01"],
      estMinutes: 10
    },
    {
      id: "sec-02-lo06",
      order: 6,
      title: "Audit standard network service ports and transport protocol assignments",
      bloom: "audit",
      tier: "core",
      mustHave: true,
      keywords: ["well-known ports", "ssh 22", "dns 53", "https 443", "smb 445"],
      aliases: ["port enumeration", "iana port assignments"],
      prerequisites: ["sec-02-lo02"],
      estMinutes: 10
    },
    {
      id: "sec-02-lo07",
      order: 7,
      title: "Calculate IPv4 subnet masks and CIDR network host capacities",
      bloom: "calculate",
      tier: "core",
      mustHave: false,
      keywords: ["cidr", "subnet mask", "broadcast address", "usable hosts"],
      aliases: ["ip subnetting", "network prefix"],
      prerequisites: ["sec-02-lo01"],
      estMinutes: 12
    },
    {
      id: "sec-02-lo08",
      order: 8,
      title: "Inspect ICMP control messages and diagnostic echo requests",
      bloom: "inspect",
      tier: "core",
      mustHave: false,
      keywords: ["icmp", "echo request", "time exceeded", "traceroute", "ping"],
      aliases: ["internet control message protocol", "network diagnostics"],
      prerequisites: ["sec-02-lo02"],
      estMinutes: 10
    },
    {
      id: "sec-02-lo09",
      order: 9,
      title: "Trace DHCP four-step lease allocation (DORA) and DHCP snooping",
      bloom: "trace",
      tier: "extension",
      mustHave: false,
      keywords: ["dhcp", "dora", "dhcp snooping", "rogue dhcp server"],
      aliases: ["dynamic host configuration", "dhcp lease flow"],
      prerequisites: ["sec-02-lo01"],
      estMinutes: 12
    }
  ]
};

// Notes for sec-02
writeNoteBlock('cybersecurity', 'networking-essentials-for-defenders', 'sec-02-lo01',
  `Defensive network analysis relies on layered abstraction models. The 7-layer OSI model provides a conceptual taxonomy: Physical (L1), Data Link (L2), Network (L3), Transport (L4), Session (L5), Presentation (L6), and Application (L7). The practical 4-layer TCP/IP model simplifies this into Network Access, Internet, Transport, and Application. During transmission, data undergoes encapsulation: each layer prepends its own header (e.g., L2 Ethernet frame wrapping L3 IP packet wrapping L4 TCP segment).`,
  `Tracing protocol encapsulation down the stack:
\`\`\`python
layers = {
    "L7_Application": "HTTP GET /index.html",
    "L4_Transport": "TCP Source Port: 52140 -> Dest Port: 443",
    "L3_Network": "IPv4 Source: 192.168.1.50 -> Dest: 93.184.216.34",
    "L2_DataLink": "Ethernet MAC: 00:1A:2B:3C:4D:5E -> Gate: 00:1A:2B:AA:BB:CC"
}
print("L3 destination IP:", layers["L3_Network"].split("-> Dest: ")[1])
print("L4 destination Port:", layers["L4_Transport"].split("-> Dest Port: ")[1])
\`\`\``,
  `Assuming IP addresses alone can deliver a frame across a local switch. Local area switches operate exclusively at Layer 2 using Media Access Control (MAC) addresses; IP addresses only facilitate logical routing across Layer 3 boundaries.`,
  `At which OSI layer does an IP router make forwarding decisions? Layer 3 (Network Layer).`
);

writeNoteBlock('cybersecurity', 'networking-essentials-for-defenders', 'sec-02-lo02',
  `IP headers (L3) encapsulate routing and addressing metadata, including Source/Destination IP, Version (IPv4/IPv6), and Time-to-Live (TTL), which decrements at every routing hop to prevent routing loops. At Layer 4, TCP provides connection-oriented, ordered delivery with sequence/acknowledgment numbers and control flags (SYN, ACK, FIN, RST). UDP provides minimal connectionless overhead without sequencing or guaranteed retransmissions, suited for streaming and DNS lookups.`,
  `Parsing basic IP and TCP header offsets in a defensive context:
\`\`\`python
packet_metadata = {
    "ip_version": 4,
    "ip_ttl": 64,
    "ip_proto": 6,       # Protocol 6 = TCP, 17 = UDP, 1 = ICMP
    "src_ip": "10.0.0.15",
    "dst_ip": "10.0.0.1",
    "tcp_flags": ["SYN"],
    "tcp_seq": 1000
}
is_low_ttl = packet_metadata["ip_ttl"] <= 1
print("Is packet near drop threshold?", is_low_ttl)
print("Protocol name:", "TCP" if packet_metadata["ip_proto"] == 6 else "Other")
\`\`\``,
  `Expecting UDP to guarantee in-order delivery. UDP packets can arrive out of order, be duplicated, or be dropped silently without notification at the transport layer; application-layer logic must handle recovery if needed.`,
  `What IP protocol number indicates that the encapsulated payload is a TCP segment? Protocol 6 (UDP is 17).`
);

writeNoteBlock('cybersecurity', 'networking-essentials-for-defenders', 'sec-02-lo03',
  `TCP establishes bidirectional reliable communication using a Three-Way Handshake:
1. Client sends a SYN segment with an Initial Sequence Number (ISN_c).
2. Server responds with a SYN-ACK segment, acknowledging ISN_c + 1 and providing its own ISN_s.
3. Client replies with an ACK acknowledging ISN_s + 1.
Connection teardown occurs gracefully using FIN and ACK exchanges from both sides, or abruptly via a Reset (RST) flag when an unauthorized or unexpected packet is received.`,
  `Tracking sequence number transitions during handshake:
\`\`\`python
client_isn = 2500
syn_packet = {"flags": "SYN", "seq": client_isn}

server_isn = 8000
syn_ack_packet = {
    "flags": "SYN-ACK",
    "seq": server_isn,
    "ack": client_isn + 1  # 2501
}

ack_packet = {
    "flags": "ACK",
    "seq": client_isn + 1,  # 2501
    "ack": server_isn + 1   # 8001
}
print("Final ACK number sent by client:", ack_packet["ack"])  # 8001
\`\`\``,
  `Interpreting a RST flag as normal termination. A RST flag signals an abnormal condition, such as a connection attempt to a closed port, an expired firewall state timeout, or deliberate session termination by an inline security appliance.`,
  `In a SYN flood attack, which step of the three-way handshake does the malicious sender deliberately omit? The final ACK step, leaving embryonic half-open sockets on the server.`
);

writeNoteBlock('cybersecurity', 'networking-essentials-for-defenders', 'sec-02-lo04',
  `The Domain Name System (DNS) maps human-readable domain names to numerical IP addresses. A client query proceeds from local cache to a recursive resolver, which queries authoritative root servers, Top-Level Domain (TLD) servers, and authoritative domain nameservers. Key record types include A (IPv4), AAAA (IPv6), CNAME (canonical alias), MX (mail exchange), and TXT (used for SPF and domain verification).`,
  `Inspecting DNS lookup responses programmatically:
\`\`\`python
dns_records = [
    {"name": "example.com", "type": "A", "ttl": 300, "data": "93.184.216.34"},
    {"name": "www.example.com", "type": "CNAME", "ttl": 3600, "data": "example.com"},
    {"name": "example.com", "type": "TXT", "ttl": 3600, "data": "v=spf1 -all"}
]
resolved_ips = [r["data"] for r in dns_records if r["type"] == "A"]
print("Resolved IPv4 addresses:", resolved_ips)
\`\`\``,
  `Overlooking DNS caching TTL values. If a defender updates an authoritative record during incident response, clients with unexpired cached responses will continue routing traffic to the old IP until their local TTL expires.`,
  `Which DNS record type is commonly queried to verify domain ownership and configure SPF email authentication? TXT record.`
);

writeNoteBlock('cybersecurity', 'networking-essentials-for-defenders', 'sec-02-lo05',
  `The Address Resolution Protocol (ARP) translates known Layer 3 IP addresses into local Layer 2 MAC addresses within a broadcast domain. Because ARP is stateless and lacks authentication, hosts trust gratuitous ARP replies unconditionally, creating vulnerability to ARP spoofing (cache poisoning) where an adversary impersonates the default gateway. Defenses include Dynamic ARP Inspection (DAI) on managed switches and static ARP table bindings.`,
  `Checking an ARP cache table for duplicated MAC addresses:
\`\`\`python
arp_table = {
    "192.168.1.1": "00:11:22:33:44:55",    # Default gateway
    "192.168.1.50": "aa:bb:cc:dd:ee:ff",   # Workstation
    "192.168.1.99": "00:11:22:33:44:55"    # Suspicious duplicate MAC
}
macs = list(arp_table.values())
duplicate_macs = set([m for m in macs if macs.count(m) > 1])
if duplicate_macs:
    print("ALERT: ARP spoofing detected for MAC:", duplicate_macs)
\`\`\``,
  `Assuming ARP requests cross routed subnets. ARP broadcast packets (FF:FF:FF:FF:FF:FF) are confined strictly to the local Layer 2 broadcast domain; routers do not forward ARP requests across network interfaces.`,
  `What enterprise switch security feature validates ARP packets against a trusted DHCP snooping binding database? Dynamic ARP Inspection (DAI).`
);

writeNoteBlock('cybersecurity', 'networking-essentials-for-defenders', 'sec-02-lo06',
  `Transport layer ports (0-65535) allow operating systems to multiplex network connections across distinct applications. Ports 0-1023 are Well-Known Ports reserved for privileged services. Defenders must recognize baseline standard services: SSH (22), DNS (53), HTTP (80), HTTPS (443), SMB (445), and RDP (3389). Unapproved listening ports indicate unauthorized services or backdoors.`,
  `Auditing listening network ports against an approved baseline:
\`\`\`python
approved_ports = {22: "SSH", 80: "HTTP", 443: "HTTPS"}
observed_listening_ports = [22, 80, 443, 3389, 445]
unapproved = [p for p in observed_listening_ports if p not in approved_ports]
for port in unapproved:
    print(f"DEFENSE WARNING: Unapproved listening port detected: {port}")
\`\`\``,
  `Assuming services always run on their standard ports. Threat actors frequently host command-and-control listeners on port 443 or 80 to blend in with legitimate outbound web traffic, requiring deep packet inspection (DPI) rather than simple port filtering.`,
  `What standard port is utilized by Microsoft Server Message Block (SMB) for file sharing and remote administration? Port 445.`
);

writeNoteBlock('cybersecurity', 'networking-essentials-for-defenders', 'sec-02-lo07',
  `Classless Inter-Domain Routing (CIDR) notation expresses IP subnets by appending a prefix length (e.g., /24) indicating the number of fixed network bits in a 32-bit IPv4 address. The remaining (32 - prefix) bits address individual hosts. The total address pool is 2^(32 - prefix), with two addresses reserved for the network identifier (all host bits 0) and the broadcast address (all host bits 1), yielding 2^(32 - prefix) - 2 usable host addresses.`,
  `Calculating host capacity for a /28 subnet:
\`\`\`python
prefix = 28
host_bits = 32 - prefix # 4 bits
total_addresses = 2 ** host_bits # 16 addresses
usable_hosts = total_addresses - 2 # 14 usable hosts
print("Subnet /28 total addresses:", total_addresses)
print("Subnet /28 usable host capacity:", usable_hosts)
\`\`\``,
  `Assigning the network address or broadcast address to an individual host interface. Network appliances drop or fail to route unicast traffic directed to reserved all-zeros or all-ones host suffixes.`,
  `How many usable host IP addresses are available in a /24 subnet? Exactly 254 usable hosts (2^8 - 2 = 256 - 2 = 254).`
);

writeNoteBlock('cybersecurity', 'networking-essentials-for-defenders', 'sec-02-lo08',
  `The Internet Control Message Protocol (ICMP) operates at Layer 3 to convey diagnostic feedback and routing error messages. Common message types include Echo Request (Type 8) and Echo Reply (Type 0) used by ping, and Time Exceeded (Type 11) generated by routers when an IP packet's TTL reaches zero. Utilities like traceroute exploit TTL expiration to map intermediate routing hops.`,
  `Parsing ICMP message type fields:
\`\`\`python
icmp_types = {
    (8, 0): "Echo Request (Ping)",
    (0, 0): "Echo Reply",
    (11, 0): "Time-to-Live Exceeded in Transit",
    (3, 3): "Destination Unreachable: Port Unreachable"
}
def analyze_icmp(type_code):
    return icmp_types.get(type_code, "Other ICMP Control Message")
print("ICMP 8/0:", analyze_icmp((8, 0)))   # Echo Request
print("ICMP 11/0:", analyze_icmp((11, 0))) # TTL Exceeded
\`\`\``,
  `Blocking all ICMP traffic blindly at network perimeters. Disabling ICMP completely breaks Path MTU Discovery (PMTUD, ICMP Type 3 Code 4), causing TCP sessions with large packet sizes to hang indefinitely.`,
  `What ICMP message type and code are returned by an intermediate router when an IP packet's TTL decrements to 0? Type 11, Code 0 (Time Exceeded).`
);

writeNoteBlock('cybersecurity', 'networking-essentials-for-defenders', 'sec-02-lo09',
  `The Dynamic Host Configuration Protocol (DHCP) automatically assigns IP addresses, subnet masks, default gateways, and DNS resolvers to hosts using a four-step DORA exchange:
1. Discover (Client broadcast)
2. Offer (Server unicast/broadcast)
3. Request (Client broadcast)
4. Acknowledge (Server unicast/broadcast)
Uncontrolled networks risk rogue DHCP servers delivering malicious gateway configurations. DHCP Snooping on switches mitigates this by classifying switch ports as trusted or untrusted.`,
  `Simulating DHCP Snooping port filtering logic:
\`\`\`python
port_config = {
    "FastEthernet0/1": {"trusted": True, "device": "Authorized DHCP Server"},
    "FastEthernet0/2": {"trusted": False, "device": "User Workstation"}
}
def handle_dhcp_offer(port):
    if not port_config[port]["trusted"]:
        return "DROP: Rogue DHCP Offer received on untrusted port!"
    return "FORWARD: Legitimate DHCP Offer from trusted uplink."
print(handle_dhcp_offer("FastEthernet0/2")) # DROP
\`\`\``,
  `Failing to enable DHCP Snooping before deploying Dynamic ARP Inspection (DAI). DAI relies directly on the DHCP Snooping database to validate IP-to-MAC bindings; enabling DAI without snooping drops legitimate network traffic.`,
  `What are the four sequential message phases of a standard DHCP lease exchange? Discover, Offer, Request, Acknowledge (DORA).`
);

// Questions for sec-02
const ch02Questions = [
  // LO01
  {
    loId: "sec-02-lo01",
    type: "single",
    difficulty: 1,
    id: "sec-02-q01",
    stem: "At which layer of the OSI model does an IP router make packet forwarding decisions?",
    options: [
      { id: "a", text: "Network Layer (Layer 3)" },
      { id: "b", text: "Data Link Layer (Layer 2)" },
      { id: "c", text: "Transport Layer (Layer 4)" },
      { id: "d", text: "Application Layer (Layer 7)" }
    ],
    answer: ["a"],
    explanation: "Routers operate at Layer 3 (Network Layer) evaluating logical IP destination addresses to make routing decisions.",
    noteRef: "sec-02-lo01",
    reviewed: false
  },
  {
    loId: "sec-02-lo01",
    type: "scenario",
    difficulty: 2,
    id: "sec-02-q02",
    stem: "A security analyst inspects an ethernet frame in Wireshark. Which order correctly describes the encapsulation from outermost header to payload?",
    options: [
      { id: "a", text: "Ethernet Header (L2) -> IP Header (L3) -> TCP Header (L4) -> HTTP Data (L7)" },
      { id: "b", text: "IP Header (L3) -> Ethernet Header (L2) -> TCP Header (L4) -> HTTP Data (L7)" },
      { id: "c", text: "HTTP Data (L7) -> TCP Header (L4) -> IP Header (L3) -> Ethernet Header (L2)" },
      { id: "d", text: "TCP Header (L4) -> IP Header (L3) -> Ethernet Header (L2) -> HTTP Data (L7)" }
    ],
    answer: ["a"],
    explanation: "Packets on an Ethernet cable wrap Layer 3 inside Layer 2 frames, which enclose Layer 4 segments containing application data.",
    noteRef: "sec-02-lo01",
    reviewed: false
  },
  {
    loId: "sec-02-lo01",
    type: "multi",
    difficulty: 2,
    id: "sec-02-q03",
    stem: "Which of the following layers are defined in the standard 4-layer TCP/IP model?",
    options: [
      { id: "a", text: "Network Access / Link Layer" },
      { id: "b", text: "Internet Layer" },
      { id: "c", text: "Transport Layer" },
      { id: "d", text: "Session Layer" }
    ],
    answer: ["a", "b", "c"],
    explanation: "The TCP/IP model consists of Network Access, Internet, Transport, and Application layers. Session is in OSI.",
    noteRef: "sec-02-lo01",
    reviewed: false
  },
  {
    loId: "sec-02-lo01",
    type: "single",
    difficulty: 3,
    id: "sec-02-q04",
    stem: "Why can't Layer 2 Ethernet switches forward frames across different IP subnets without a Layer 3 routing boundary?",
    options: [
      { id: "a", text: "Switches only inspect destination MAC addresses within the local broadcast domain and lack IP routing tables." },
      { id: "b", text: "Ethernet frames cannot carry IPv4 payloads." },
      { id: "c", text: "Layer 2 frames have no parity check bits." },
      { id: "d", text: "MAC addresses expire after 60 seconds." }
    ],
    answer: ["a"],
    explanation: "Standard Layer 2 switches switch frames based on MAC address tables; crossing logical IP networks requires L3 routing.",
    noteRef: "sec-02-lo01",
    reviewed: false
  },

  // LO02
  {
    loId: "sec-02-lo02",
    type: "single",
    difficulty: 1,
    id: "sec-02-q05",
    stem: "What is the primary function of the Time-to-Live (TTL) field in an IPv4 header?",
    options: [
      { id: "a", text: "To prevent packets from circulating endlessly in routing loops by decrementing at each hop." },
      { id: "b", text: "To encrypt the payload during transit." },
      { id: "c", text: "To measure round-trip ping latency in milliseconds." },
      { id: "d", text: "To synchronize sequence numbers between sender and receiver." }
    ],
    answer: ["a"],
    explanation: "Each router decrements TTL by 1. If TTL hits 0, the packet is discarded and an ICMP Time Exceeded message is sent.",
    noteRef: "sec-02-lo02",
    reviewed: false
  },
  {
    loId: "sec-02-lo02",
    type: "scenario",
    difficulty: 2,
    id: "sec-02-q06",
    stem: "A network engineer needs a transport protocol for live video streaming where occasional dropped frames are acceptable but low latency is critical. Which protocol should be chosen?",
    options: [
      { id: "a", text: "UDP, because it avoids the retransmission delays and connection overhead of TCP." },
      { id: "b", text: "TCP, because sequence numbers ensure uninterrupted playback." },
      { id: "c", text: "ICMP, because diagnostic packets have zero overhead." },
      { id: "d", text: "ARP, because it broadcasts directly to all local screens." }
    ],
    answer: ["a"],
    explanation: "UDP provides connectionless streaming without waiting for retransmissions of lost packets.",
    noteRef: "sec-02-lo02",
    reviewed: false
  },
  {
    loId: "sec-02-lo02",
    type: "numeric",
    difficulty: 2,
    id: "sec-02-q07",
    stem: "What is the standard minimum header size (in bytes) of an IPv4 packet without optional fields?",
    options: [
      { id: "a", text: "20" },
      { id: "b", text: "16" },
      { id: "c", text: "32" },
      { id: "d", text: "64" }
    ],
    answer: ["a"],
    explanation: "The base IPv4 header is 20 bytes long (5 32-bit words).",
    noteRef: "sec-02-lo02",
    verify: "(20 === 20)",
    reviewed: false
  },
  {
    loId: "sec-02-lo02",
    type: "single",
    difficulty: 3,
    id: "sec-02-q08",
    stem: "What protocol numbers in the IPv4 Protocol field identify TCP and UDP respectively?",
    options: [
      { id: "a", text: "Protocol 6 for TCP, Protocol 17 for UDP" },
      { id: "b", text: "Protocol 1 for TCP, Protocol 2 for UDP" },
      { id: "c", text: "Protocol 80 for TCP, Protocol 443 for UDP" },
      { id: "d", text: "Protocol 17 for TCP, Protocol 6 for UDP" }
    ],
    answer: ["a"],
    explanation: "IANA specifies Protocol 6 for TCP and Protocol 17 for UDP in the IP header protocol field.",
    noteRef: "sec-02-lo02",
    reviewed: false
  },

  // LO03
  {
    loId: "sec-02-lo03",
    type: "single",
    difficulty: 1,
    id: "sec-02-q09",
    stem: "What is the correct sequence of control flags exchanged during a standard TCP Three-Way Handshake?",
    options: [
      { id: "a", text: "SYN -> SYN-ACK -> ACK" },
      { id: "b", text: "ACK -> SYN -> SYN-ACK" },
      { id: "c", text: "SYN -> ACK -> FIN" },
      { id: "d", text: "RST -> SYN -> ACK" }
    ],
    answer: ["a"],
    explanation: "TCP connects via client SYN, server response SYN-ACK, and client confirmation ACK.",
    noteRef: "sec-02-lo03",
    reviewed: false
  },
  {
    loId: "sec-02-lo03",
    type: "numeric",
    difficulty: 2,
    id: "sec-02-q10",
    stem: "A client initiates a TCP connection with Initial Sequence Number (ISN) 5000. What acknowledgment number must the server send in its SYN-ACK response?",
    options: [
      { id: "a", text: "5001" },
      { id: "b", text: "5000" },
      { id: "c", text: "5002" },
      { id: "d", text: "0" }
    ],
    answer: ["a"],
    explanation: "The receiver acknowledges a SYN by incrementing the sequence number by 1: 5000 + 1 = 5001.",
    noteRef: "sec-02-lo03",
    verify: "(5000 + 1 === 5001)",
    reviewed: false
  },
  {
    loId: "sec-02-lo03",
    type: "scenario",
    difficulty: 2,
    id: "sec-02-q11",
    stem: "A server receives thousands of SYN packets from spoofed IP addresses without ever receiving subsequent ACK packets. What attack is taking place?",
    options: [
      { id: "a", text: "TCP SYN Flood Denial of Service" },
      { id: "b", text: "DNS Cache Poisoning" },
      { id: "c", text: "ARP Spoofing Man-in-the-Middle" },
      { id: "d", text: "SQL Injection Data Exfiltration" }
    ],
    answer: ["a"],
    explanation: "A SYN flood exhausts server connection tables (backlog queues) with half-open connections that never complete the handshake.",
    noteRef: "sec-02-lo03",
    reviewed: false
  },
  {
    loId: "sec-02-lo03",
    type: "single",
    difficulty: 3,
    id: "sec-02-q12",
    stem: "What TCP flag indicates an immediate, ungraceful termination of a connection without waiting for unfinished data transfers?",
    options: [
      { id: "a", text: "RST (Reset)" },
      { id: "b", text: "FIN (Finish)" },
      { id: "c", text: "URG (Urgent)" },
      { id: "d", text: "PSH (Push)" }
    ],
    answer: ["a"],
    explanation: "The RST flag aborts a connection abruptly; FIN gracefully closes a connection after pending packets are acknowledged.",
    noteRef: "sec-02-lo03",
    reviewed: false
  },

  // LO04
  {
    loId: "sec-02-lo04",
    type: "single",
    difficulty: 1,
    id: "sec-02-q13",
    stem: "Which DNS record type maps a domain hostname to an IPv4 address?",
    options: [
      { id: "a", text: "A Record" },
      { id: "b", text: "AAAA Record" },
      { id: "c", text: "MX Record" },
      { id: "d", text: "PTR Record" }
    ],
    answer: ["a"],
    explanation: "An 'A' record maps a hostname to an IPv4 address; 'AAAA' maps to an IPv6 address.",
    noteRef: "sec-02-lo04",
    reviewed: false
  },
  {
    loId: "sec-02-lo04",
    type: "scenario",
    difficulty: 2,
    id: "sec-02-q14",
    stem: "An enterprise deploys a mail server. Which DNS record must be published so external servers know where to route incoming SMTP emails?",
    options: [
      { id: "a", text: "MX (Mail Exchange) Record" },
      { id: "b", text: "CNAME Record" },
      { id: "c", text: "SOA Record" },
      { id: "d", text: "NS Record" }
    ],
    answer: ["a"],
    explanation: "MX records designate the mail servers responsible for accepting email on behalf of a domain.",
    noteRef: "sec-02-lo04",
    reviewed: false
  },
  {
    loId: "sec-02-lo04",
    type: "multi",
    difficulty: 2,
    id: "sec-02-q15",
    stem: "Which of the following components are part of the hierarchical DNS resolution chain for an uncached query?",
    options: [
      { id: "a", text: "Root Nameservers" },
      { id: "b", text: "Top-Level Domain (TLD) Nameservers" },
      { id: "c", text: "Authoritative Domain Nameservers" },
      { id: "d", text: "BGP Autonomous Systems" }
    ],
    answer: ["a", "b", "c"],
    explanation: "A recursive lookup queries Root servers, then TLD servers (.com, .org), and finally the authoritative nameserver.",
    noteRef: "sec-02-lo04",
    reviewed: false
  },
  {
    loId: "sec-02-lo04",
    type: "single",
    difficulty: 3,
    id: "sec-02-q16",
    stem: "How does DNSSEC protect recursive resolvers from DNS Cache Poisoning attacks?",
    options: [
      { id: "a", text: "It cryptographically signs DNS records using public-key cryptography to verify data integrity and origin authenticity." },
      { id: "b", text: "It encrypts all DNS traffic using AES-256." },
      { id: "c", text: "It blocks all queries originating from UDP port 53." },
      { id: "d", text: "It forces TTL values to be 0 for all records." }
    ],
    answer: ["a"],
    explanation: "DNSSEC uses digital signatures (RRSIG records) tied to a chain of trust to validate that DNS responses were not tampered with.",
    noteRef: "sec-02-lo04",
    reviewed: false
  },

  // LO05
  {
    loId: "sec-02-lo05",
    type: "single",
    difficulty: 1,
    id: "sec-02-q17",
    stem: "What is the primary role of the Address Resolution Protocol (ARP) in a local area network?",
    options: [
      { id: "a", text: "Resolving a known Layer 3 IP address to a physical Layer 2 MAC address." },
      { id: "b", text: "Routing packets across public internet backbones." },
      { id: "c", text: "Assigning dynamic IP addresses to new network clients." },
      { id: "d", text: "Translating private IP addresses to public IPs using NAT." }
    ],
    answer: ["a"],
    explanation: "ARP maps IP addresses to physical MAC hardware addresses within a local Layer 2 broadcast domain.",
    noteRef: "sec-02-lo05",
    reviewed: false
  },
  {
    loId: "sec-02-lo05",
    type: "scenario",
    difficulty: 2,
    id: "sec-02-q18",
    stem: "An attacker on the local subnet transmits unsolicited gratuitous ARP replies claiming the default gateway IP belongs to their MAC. What attack is this?",
    options: [
      { id: "a", text: "ARP Cache Poisoning / ARP Spoofing" },
      { id: "b", text: "Smurf ICMP Amplification" },
      { id: "c", text: "VLAN Hopping" },
      { id: "d", text: "SQL Injection" }
    ],
    answer: ["a"],
    explanation: "ARP spoofing tricks local hosts into associating the gateway's IP with the attacker's MAC address to intercept traffic.",
    noteRef: "sec-02-lo05",
    reviewed: false
  },
  {
    loId: "sec-02-lo05",
    type: "single",
    difficulty: 2,
    id: "sec-02-q19",
    stem: "What managed switch feature prevents ARP poisoning by validating ARP packets against the DHCP snooping database?",
    options: [
      { id: "a", text: "Dynamic ARP Inspection (DAI)" },
      { id: "b", text: "Spanning Tree Protocol (STP)" },
      { id: "c", text: "Port Mirroring (SPAN)" },
      { id: "d", text: "Link Aggregation (LACP)" }
    ],
    answer: ["a"],
    explanation: "Dynamic ARP Inspection (DAI) inspects ARP packets on untrusted switch ports and drops forged mappings.",
    noteRef: "sec-02-lo05",
    reviewed: false
  },
  {
    loId: "sec-02-lo05",
    type: "single",
    difficulty: 3,
    id: "sec-02-q20",
    stem: "Why do ARP requests use the broadcast MAC address FF:FF:FF:FF:FF:FF?",
    options: [
      { id: "a", text: "Because the requesting host does not yet know which physical device holds the target IP address." },
      { id: "b", text: "To encrypt the ARP frame payload." },
      { id: "c", text: "To force intermediate routers to forward the frame across subnets." },
      { id: "d", text: "Because switches discard unicast frames." }
    ],
    answer: ["a"],
    explanation: "Since the destination MAC is unknown, broadcasting ensures every station on the local segment receives the query.",
    noteRef: "sec-02-lo05",
    reviewed: false
  },

  // LO06
  {
    loId: "sec-02-lo06",
    type: "single",
    difficulty: 1,
    id: "sec-02-q21",
    stem: "Which well-known port is utilized by default for Secure Shell (SSH) remote administrative access?",
    options: [
      { id: "a", text: "Port 22" },
      { id: "b", text: "Port 23" },
      { id: "c", text: "Port 80" },
      { id: "d", text: "Port 443" }
    ],
    answer: ["a"],
    explanation: "SSH operates on TCP port 22; unencrypted Telnet uses port 23.",
    noteRef: "sec-02-lo06",
    reviewed: false
  },
  {
    loId: "sec-02-lo06",
    type: "scenario",
    difficulty: 2,
    id: "sec-02-q22",
    stem: "A firewall audit reveals unexpected inbound traffic allowed to port 3389. What service is exposed to the internet?",
    options: [
      { id: "a", text: "Microsoft Remote Desktop Protocol (RDP)" },
      { id: "b", text: "Server Message Block (SMB)" },
      { id: "c", text: "Domain Name System (DNS)" },
      { id: "d", text: "PostgreSQL Database" }
    ],
    answer: ["a"],
    explanation: "TCP port 3389 is the default listening port for Microsoft RDP.",
    noteRef: "sec-02-lo06",
    reviewed: false
  },
  {
    loId: "sec-02-lo06",
    type: "multi",
    difficulty: 2,
    id: "sec-02-q23",
    stem: "Which of the following ports are classified as 'Well-Known Ports' (ports 0 to 1023)?",
    options: [
      { id: "a", text: "Port 53 (DNS)" },
      { id: "b", text: "Port 443 (HTTPS)" },
      { id: "c", text: "Port 445 (SMB)" },
      { id: "d", text: "Port 8080 (HTTP Alternate)" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Ports 53, 443, and 445 are under 1024 (well-known). Port 8080 is a registered/ephemeral range port.",
    noteRef: "sec-02-lo06",
    reviewed: false
  },
  {
    loId: "sec-02-lo06",
    type: "single",
    difficulty: 3,
    id: "sec-02-q24",
    stem: "Under what transport protocols does the Domain Name System (DNS) operate for standard queries versus zone transfers?",
    options: [
      { id: "a", text: "UDP 53 for standard small queries, and TCP 53 for zone transfers or large responses exceeding 512 bytes." },
      { id: "b", text: "TCP 53 exclusively for all DNS operations." },
      { id: "c", text: "UDP 53 exclusively for all DNS operations." },
      { id: "d", text: "ICMP port 53 for queries and HTTP port 80 for transfers." }
    ],
    answer: ["a"],
    explanation: "Standard lookups use UDP 53 for speed; zone transfers (AXFR) and large responses fail over to TCP 53 for reliability.",
    noteRef: "sec-02-lo06",
    reviewed: false
  },

  // LO07
  {
    loId: "sec-02-lo07",
    type: "single",
    difficulty: 1,
    id: "sec-02-q25",
    stem: "In IPv4 CIDR notation, what does the suffix in 192.168.10.0/24 represent?",
    options: [
      { id: "a", text: "The number of bits dedicated to the network prefix." },
      { id: "b", text: "The maximum number of routers on the subnet." },
      { id: "c", text: "The total number of available host interfaces." },
      { id: "d", text: "The default TTL value for all packets." }
    ],
    answer: ["a"],
    explanation: "The /24 suffix indicates that 24 of the 32 IPv4 bits represent the network portion, leaving 8 bits for host addresses.",
    noteRef: "sec-02-lo07",
    reviewed: false
  },
  {
    loId: "sec-02-lo07",
    type: "numeric",
    difficulty: 2,
    id: "sec-02-q26",
    stem: "How many USABLE host IP addresses exist in a /26 IPv4 subnet?",
    options: [
      { id: "a", text: "62" },
      { id: "b", text: "64" },
      { id: "c", text: "30" },
      { id: "d", text: "126" }
    ],
    answer: ["a"],
    explanation: "Host bits = 32 - 26 = 6 bits. Total = 2^6 = 64. Usable hosts = 64 - 2 = 62.",
    noteRef: "sec-02-lo07",
    verify: "(Math.pow(2, 32 - 26) - 2 === 62)",
    reviewed: false
  },
  {
    loId: "sec-02-lo07",
    type: "scenario",
    difficulty: 2,
    id: "sec-02-q27",
    stem: "A network engineer wants to configure a point-to-point link between two routers without wasting IP address space. Which CIDR subnet prefix provides exactly 2 usable host addresses?",
    options: [
      { id: "a", text: "/30" },
      { id: "b", text: "/28" },
      { id: "c", text: "/29" },
      { id: "d", text: "/31" }
    ],
    answer: ["a"],
    explanation: "A /30 subnet has 4 total addresses: 1 network, 1 broadcast, and exactly 2 usable host IPs (2^(32-30) - 2 = 2).",
    noteRef: "sec-02-lo07",
    reviewed: false
  },
  {
    loId: "sec-02-lo07",
    type: "single",
    difficulty: 3,
    id: "sec-02-q28",
    stem: "What is the broadcast address for the subnet 192.168.1.128/25?",
    options: [
      { id: "a", text: "192.168.1.255" },
      { id: "b", text: "192.168.1.128" },
      { id: "c", text: "192.168.1.192" },
      { id: "d", text: "192.168.2.255" }
    ],
    answer: ["a"],
    explanation: "A /25 spans 128 addresses. Subnet starts at 192.168.1.128 and ends at the broadcast address 192.168.1.255.",
    noteRef: "sec-02-lo07",
    reviewed: false
  },

  // LO08
  {
    loId: "sec-02-lo08",
    type: "single",
    difficulty: 1,
    id: "sec-02-q29",
    stem: "Which utility sends ICMP Echo Request packets and listens for ICMP Echo Replies to test network connectivity?",
    options: [
      { id: "a", text: "ping" },
      { id: "b", text: "netstat" },
      { id: "c", text: "curl" },
      { id: "d", text: "nslookup" }
    ],
    answer: ["a"],
    explanation: "The ping utility generates ICMP Echo Requests (Type 8) and validates receiving Echo Replies (Type 0).",
    noteRef: "sec-02-lo08",
    reviewed: false
  },
  {
    loId: "sec-02-lo08",
    type: "scenario",
    difficulty: 2,
    id: "sec-02-q30",
    stem: "How does the traceroute utility map intermediate routers between a host and destination?",
    options: [
      { id: "a", text: "It sends packets with incrementally increasing TTL values starting at 1, capturing ICMP Time Exceeded replies from each hop." },
      { id: "b", text: "It asks the root DNS servers for the routing path." },
      { id: "c", text: "It injects BGP routing table updates into local switches." },
      { id: "d", text: "It queries the destination router's ARP cache directly." }
    ],
    answer: ["a"],
    explanation: "By setting TTL=1, the first router drops the packet and returns ICMP Time Exceeded; TTL=2 reveals the second, and so on.",
    noteRef: "sec-02-lo08",
    reviewed: false
  },
  {
    loId: "sec-02-lo08",
    type: "numeric",
    difficulty: 2,
    id: "sec-02-q31",
    stem: "What is the ICMP Type number for an Echo Reply packet?",
    options: [
      { id: "a", text: "0" },
      { id: "b", text: "8" },
      { id: "c", text: "11" },
      { id: "d", text: "3" }
    ],
    answer: ["a"],
    explanation: "Echo Reply is Type 0; Echo Request is Type 8.",
    noteRef: "sec-02-lo08",
    verify: "(0 === 0)",
    reviewed: false
  },
  {
    loId: "sec-02-lo08",
    type: "single",
    difficulty: 3,
    id: "sec-02-q32",
    stem: "Why does blocking all ICMP traffic at an enterprise firewall break Path MTU Discovery (PMTUD)?",
    options: [
      { id: "a", text: "Routers cannot return ICMP 'Destination Unreachable: Fragmentation Needed' messages, causing packets exceeding the MTU to be dropped silently." },
      { id: "b", text: "DNS resolution requires ICMP Echo messages." },
      { id: "c", text: "TCP handshakes cannot establish without ICMP ACK messages." },
      { id: "d", text: "Ethernet switches stop updating their MAC address tables." }
    ],
    answer: ["a"],
    explanation: "PMTUD depends on ICMP Type 3 Code 4 to signal when packets exceed the maximum transmission unit size.",
    noteRef: "sec-02-lo08",
    reviewed: false
  },

  // LO09 (Extension)
  {
    loId: "sec-02-lo09",
    type: "single",
    difficulty: 2,
    id: "sec-02-q33",
    stem: "What four message types comprise the complete DHCP lease exchange?",
    options: [
      { id: "a", text: "Discover, Offer, Request, Acknowledge (DORA)" },
      { id: "b", text: "SYN, SYN-ACK, ACK, FIN" },
      { id: "c", text: "Query, Response, Authorize, Bind" },
      { id: "d", text: "Hello, Challenge, Response, Permit" }
    ],
    answer: ["a"],
    explanation: "DHCP client and server exchange Discover, Offer, Request, and Acknowledge messages.",
    noteRef: "sec-02-lo09",
    reviewed: false
  },
  {
    loId: "sec-02-lo09",
    type: "scenario",
    difficulty: 3,
    id: "sec-02-q34",
    stem: "An attacker plugs an unauthorized wireless router into an office ethernet port, handing out incorrect gateway IPs to coworkers. What security control mitigates this?",
    options: [
      { id: "a", text: "DHCP Snooping on the switch, designating user ports as untrusted and dropping unauthorized DHCP Offer messages." },
      { id: "b", text: "Disabling ICMP on the default router." },
      { id: "c", text: "Installing an SSL certificate on all endpoints." },
      { id: "d", text: "Increasing DNS TTL values to 24 hours." }
    ],
    answer: ["a"],
    explanation: "DHCP Snooping drops DHCP server messages (Offers/ACKs) originating from untrusted client-facing switch ports.",
    noteRef: "sec-02-lo09",
    reviewed: false
  }
];

balanceAndSave('cybersecurity', 'networking-essentials-for-defenders', ch02Objectives, ch02Questions);

// ============================================================================
// CHAPTER 3: linux-windows-and-the-defense-cli (sec-03)
// ============================================================================
const ch03Objectives = {
  version: 1,
  chapterId: "sec-03",
  objectives: [
    {
      id: "sec-03-lo01",
      order: 1,
      title: "Explain Linux user, group, and other file permissions and octal modes",
      bloom: "understand",
      tier: "core",
      mustHave: true,
      keywords: ["linux permissions", "chmod", "octal notation", "rwx"],
      aliases: ["file mode bits", "ugo permissions"],
      prerequisites: ["sec-01-lo01"],
      estMinutes: 10
    },
    {
      id: "sec-03-lo02",
      order: 2,
      title: "Audit special Linux permission bits including SUID, SGID, and Sticky",
      bloom: "audit",
      tier: "core",
      mustHave: true,
      keywords: ["suid", "sgid", "sticky bit", "privilege escalation"],
      aliases: ["special permissions", "setuid binary"],
      prerequisites: ["sec-03-lo01"],
      estMinutes: 12
    },
    {
      id: "sec-03-lo03",
      order: 3,
      title: "Inspect Linux running processes, parent hierarchies, and system services",
      bloom: "inspect",
      tier: "core",
      mustHave: true,
      keywords: ["ps", "top", "systemctl", "pid", "ppid"],
      aliases: ["process tree", "systemd service management"],
      prerequisites: ["sec-03-lo01"],
      estMinutes: 12
    },
    {
      id: "sec-03-lo04",
      order: 4,
      title: "Analyze essential Linux security log files and authentication events",
      bloom: "analyze",
      tier: "core",
      mustHave: false,
      keywords: ["auth.log", "syslog", "journalctl", "failed login"],
      aliases: ["linux audit logs", "secure log"],
      prerequisites: ["sec-03-lo01"],
      estMinutes: 12
    },
    {
      id: "sec-03-lo05",
      order: 5,
      title: "Examine the Windows security model, Security Identifiers (SIDs), and Access Tokens",
      bloom: "examine",
      tier: "core",
      mustHave: true,
      keywords: ["sid", "access token", "uac", "security descriptor"],
      aliases: ["windows auth model", "security identifier"],
      prerequisites: ["sec-01-lo01"],
      estMinutes: 12
    },
    {
      id: "sec-03-lo06",
      order: 6,
      title: "Query Windows Event Logs for logon and process creation event IDs",
      bloom: "query",
      tier: "core",
      mustHave: false,
      keywords: ["event id 4624", "event id 4625", "event id 4688", "sysmon"],
      aliases: ["security log event ids", "windows telemetry"],
      prerequisites: ["sec-03-lo05"],
      estMinutes: 12
    },
    {
      id: "sec-03-lo07",
      order: 7,
      title: "Filter security log streams using defensive CLI utilities (grep, awk, cut)",
      bloom: "filter",
      tier: "core",
      mustHave: false,
      keywords: ["grep", "awk", "cut", "sort", "uniq", "cli text processing"],
      aliases: ["log triage cli", "bash log parsing"],
      prerequisites: ["sec-03-lo04"],
      estMinutes: 12
    },
    {
      id: "sec-03-lo08",
      order: 8,
      title: "Inspect active network socket connections and listening ports via netstat and ss",
      bloom: "inspect",
      tier: "core",
      mustHave: false,
      keywords: ["netstat", "ss", "listening ports", "established sockets"],
      aliases: ["socket inspection", "listening sockets cli"],
      prerequisites: ["sec-02-lo06"],
      estMinutes: 10
    },
    {
      id: "sec-03-lo09",
      order: 9,
      title: "Formulate defensive PowerShell queries with Get-WinEvent and Get-CimInstance",
      bloom: "formulate",
      tier: "extension",
      mustHave: false,
      keywords: ["powershell", "get-winevent", "get-ciminstance", "defense automation"],
      aliases: ["windows defense cli", "powershell security triage"],
      prerequisites: ["sec-03-lo06"],
      estMinutes: 14
    }
  ]
};

// Notes for sec-03
writeNoteBlock('cybersecurity', 'linux-windows-and-the-defense-cli', 'sec-03-lo01',
  `The Linux Discretionary Access Control (DAC) model evaluates permissions across three principal categories: User (owner), Group, and Others (world). Each tier possesses three permission bits: Read (r=4), Write (w=2), and Execute (x=1). Combining these values produces an octal mode between 0 and 7. For example, chmod 750 grants read-write-execute (4+2+1=7) to the owner, read-and-execute (4+1=5) to the group, and zero access (0) to others.`,
  `Calculating octal permission values:
\`\`\`python
def rwx_to_octal(perm_str):
    mapping = {'r': 4, 'w': 2, 'x': 1, '-': 0}
    val = 0
    for char in perm_str:
        val += mapping.get(char, 0)
    return val

user_bits = rwx_to_octal("rwx")   # 4 + 2 + 1 = 7
group_bits = rwx_to_octal("r-x")  # 4 + 0 + 1 = 5
other_bits = rwx_to_octal("---")  # 0 + 0 + 0 = 0

octal_mode = f"{user_bits}{group_bits}{other_bits}"
print("Octal mode string:", octal_mode)  # "750"
\`\`\``,
  `Granting global write permissions (chmod 777) to fix application permissions errors. Permitting universal write access allows any unprivileged user or compromised service account on the system to modify or overwrite sensitive executable files.`,
  `What octal permission mode corresponds to standard non-executable read-write file access for owner only (rw-------)? Mode 600 (4+2=6).`
);

writeNoteBlock('cybersecurity', 'linux-windows-and-the-defense-cli', 'sec-03-lo02',
  `Beyond standard rwx permissions, Linux provides three special permission bits:
1. SUID (Set User ID, octal 4000): causes a binary to execute with the privileges of the file owner (commonly root) rather than the launching user.
2. SGID (Set Group ID, octal 2000): executes with the group privileges of the file, or forces new files in a directory to inherit the parent directory's group.
3. Sticky Bit (octal 1000): prevents non-owners from deleting or renaming files in a shared directory (e.g., /tmp).`,
  `Auditing SUID binaries in a laboratory environment:
\`\`\`python
installed_binaries = [
    {"name": "/usr/bin/passwd", "mode": "4755", "owner": "root", "status": "Legitimate SUID"},
    {"name": "/usr/bin/ping", "mode": "0755", "owner": "root", "status": "Normal binary"},
    {"name": "/tmp/custom_bash", "mode": "4777", "owner": "root", "status": "CRITICAL: Backdoor SUID"}
]

for b in installed_binaries:
    if b["mode"].startswith("4") and b["status"].startswith("CRITICAL"):
        print("Privilege escalation threat flagged:", b["name"])
\`\`\``,
  `Setting the SUID bit on shell scripts or script interpreters. If an unprivileged user can control environment variables or arguments passed to a root SUID binary, it creates an immediate privilege escalation vector.`,
  `What character appears in place of the user execute bit ('x') in ls -l output when SUID is enabled on an executable file? A lowercase 's' (or 'S' if user execute was not set).`
);

writeNoteBlock('cybersecurity', 'linux-windows-and-the-defense-cli', 'sec-03-lo03',
  `Every Linux process has a Process ID (PID) and a Parent Process ID (PPID). The root process systemd (PID 1) initializes the user space and supervises system services. Defenders use ps, top, and systemctl to identify anomalous processes, orphan processes whose parents terminated unexpectedly, or unauthorized background daemons masquerading under legitimate system names.`,
  `Inspecting process parent-child relationships programmatically:
\`\`\`python
processes = [
    {"pid": 1, "ppid": 0, "cmd": "/sbin/init", "user": "root"},
    {"pid": 542, "ppid": 1, "cmd": "/usr/sbin/sshd", "user": "root"},
    {"pid": 1205, "ppid": 542, "cmd": "sshd: analyst", "user": "analyst"},
    {"pid": 1206, "ppid": 1205, "cmd": "-bash", "user": "analyst"},
    {"pid": 2840, "ppid": 1, "cmd": "/tmp/crypto_miner", "user": "nobody"}
]

for p in processes:
    if p["ppid"] == 1 and p["cmd"].startswith("/tmp/"):
        print(f"SUSPICIOUS ORPHAN PROCESS: PID {p['pid']} ({p['cmd']})")
\`\`\``,
  `Killing a malicious process without investigating its parent PID or persistence mechanisms (such as cron jobs or systemd service units). If the persistence mechanism is active, the process will respawn immediately upon termination.`,
  `What PID is assigned to the initial initialization system process (such as systemd) in Linux? PID 1.`
);

writeNoteBlock('cybersecurity', 'linux-windows-and-the-defense-cli', 'sec-03-lo04',
  `Linux hosts record security telemetry in centralized text logs under /var/log/ and binary systemd journals. Key log files include /var/log/auth.log (Debian/Ubuntu) or /var/log/secure (RHEL/CentOS) for authentication events, SSH logins, and sudo elevation attempts. Defenders review failed password entries, repeated root login attempts, and unexpected session openings using tools like journalctl -u ssh.`,
  `Parsing failed SSH authentication entries from log data:
\`\`\`python
log_lines = [
    "Oct 24 10:15:02 web01 sshd[4201]: Failed password for invalid user admin from 198.51.100.25 port 42102",
    "Oct 24 10:15:05 web01 sshd[4204]: Failed password for invalid user admin from 198.51.100.25 port 42104",
    "Oct 24 10:15:09 web01 sshd[4208]: Accepted publickey for analyst from 10.0.0.50 port 51230"
]

failed_attempts = [l for l in log_lines if "Failed password" in l]
print("Count of failed brute-force attempts:", len(failed_attempts))
\`\`\``,
  `Failing to forward logs to a remote SIEM or write-once storage. If an adversary gains root access, one of their initial actions is often truncating or altering local log files in /var/log/ to conceal activity.`,
  `In Debian and Ubuntu systems, what is the default log file path for SSH authentication and sudo command records? /var/log/auth.log.`
);

writeNoteBlock('cybersecurity', 'linux-windows-and-the-defense-cli', 'sec-03-lo05',
  `The Windows security architecture uses Security Identifiers (SIDs) to uniquely identify security principals (users, groups, machines) across a domain or local system. When a user authenticates, the Local Security Authority Subsystem Service (LSASS) issues an Access Token containing the user's SID, group SIDs, and granted privileges. The Security Reference Monitor (SRM) compares this token against the Discretionary Access Control List (DACL) on securable objects (files, registry keys) before granting access.`,
  `Inspecting a Windows SID structure:
\`\`\`python
def analyze_rid(sid_str):
    rid = int(sid_str.split("-")[-1])
    if rid == 500:
        return "Built-in Administrator"
    elif rid == 501:
        return "Built-in Guest"
    elif rid >= 1000:
        return "Custom User or Group"
    return "Well-Known Security Principal"

print("S-1-5-21-123456789-500:", analyze_rid("S-1-5-21-123456789-500"))
print("S-1-5-21-123456789-1004:", analyze_rid("S-1-5-21-123456789-1004"))
\`\`\``,
  `Assuming renaming the Administrator account changes its underlying SID. The Relative Identifier (RID) 500 remains permanently fixed regardless of username modifications, allowing defenders and security tools to track accounts reliably.`,
  `What Windows kernel subsystem enforces access validation by comparing a user's access token against an object's DACL? The Security Reference Monitor (SRM).`
);

writeNoteBlock('cybersecurity', 'linux-windows-and-the-defense-cli', 'sec-03-lo06',
  `Windows Security Event Logs record structured operational telemetry essential for incident response. Core event IDs include:
- Event ID 4624: Successful Account Logon (with Logon Types, e.g., Type 2 Interactive, Type 3 Network, Type 10 RemoteInteractive/RDP).
- Event ID 4625: Failed Account Logon.
- Event ID 4688: A new process has been created (recording process name, parent process, and command-line arguments when process auditing is enabled).`,
  `Analyzing logon events for suspicious Remote Desktop sessions:
\`\`\`python
events = [
    {"event_id": 4624, "user": "corp\\analyst", "logon_type": 2, "ip": "127.0.0.1"},
    {"event_id": 4624, "user": "corp\\admin", "logon_type": 10, "ip": "203.0.113.88"},
    {"event_id": 4625, "user": "corp\\admin", "logon_type": 3, "ip": "203.0.113.88"}
]

for ev in events:
    if ev["event_id"] == 4624 and ev["logon_type"] == 10:
        print(f"ALERT: Remote Interactive (RDP) logon detected for {ev['user']} from {ev['ip']}")
\`\`\``,
  `Relying solely on Event ID 4688 without enabling command-line process auditing via Group Policy. Without command-line argument logging, Event ID 4688 only captures binary filenames (e.g., powershell.exe) without revealing encoded malicious arguments.`,
  `Which Windows Logon Type designates an interactive Remote Desktop (RDP) session? Logon Type 10.`
);

writeNoteBlock('cybersecurity', 'linux-windows-and-the-defense-cli', 'sec-03-lo07',
  `Defensive command-line triage relies on streaming text pipelines:
- grep: filters lines matching regular expression patterns.
- awk: processes structured columnar fields and performs conditional arithmetic.
- cut: extracts delimited character or field slices.
- sort and uniq -c: aggregates and counts unique occurrences (e.g., tallying the top source IP addresses attempting brute-force logons).`,
  `Constructing a pipeline to extract top attacking IP addresses from web logs:
\`\`\`python
log_entries = [
    "192.168.1.50 - - [24/Oct] \\"GET /admin HTTP/1.1\\" 401 512",
    "198.51.100.22 - - [24/Oct] \\"POST /login HTTP/1.1\\" 401 512",
    "198.51.100.22 - - [24/Oct] \\"POST /login HTTP/1.1\\" 401 512",
    "198.51.100.22 - - [24/Oct] \\"POST /login HTTP/1.1\\" 401 512",
    "10.0.0.5 - - [24/Oct] \\"GET /index.html HTTP/1.1\\" 200 4096"
]

ip_counts = {}
for line in log_entries:
    if " 401 " in line:
        ip = line.split()[0]
        ip_counts[ip] = ip_counts.get(ip, 0) + 1

sorted_ips = sorted(ip_counts.items(), key=lambda x: x[1], reverse=True)
print("Top failed logon source IP:", sorted_ips[0]) # ('198.51.100.22', 3)
\`\`\``,
  `Using unquoted regular expressions in grep that get expanded or misinterpreted by the shell before execution, leading to silent syntax errors or missing search targets.`,
  `What flag is passed to uniq in a Unix pipeline to prefix lines with their occurrence count? -c (uniq -c).`
);

writeNoteBlock('cybersecurity', 'linux-windows-and-the-defense-cli', 'sec-03-lo08',
  `Investigating compromised systems requires live socket inspection. The modern ss utility (and legacy netstat) interrogates the Linux kernel's TCP/IP stack to list listening ports, active established connections, and associated Process IDs (ss -tulpn). Analyzing foreign IP addresses, uncommon port numbers, and unauthorized listening daemons identifies active command-and-control channels or unauthorized network listeners.`,
  `Filtering listening network sockets for unauthorized services:
\`\`\`python
open_sockets = [
    {"proto": "tcp", "state": "LISTEN", "local": "0.0.0.0:22", "pid": 542, "proc": "sshd"},
    {"proto": "tcp", "state": "LISTEN", "local": "0.0.0.0:443", "pid": 980, "proc": "nginx"},
    {"proto": "tcp", "state": "ESTAB", "local": "10.0.0.15:48201", "foreign": "198.51.100.99:4444", "pid": 3120, "proc": "nc"}
]

for sock in open_sockets:
    if sock["state"] == "ESTAB" and sock["proc"] == "nc":
        print(f"SUSPICIOUS REVERSE SHELL: Process {sock['proc']} connected to {sock['foreign']}")
\`\`\``,
  `Running netstat or ss without administrative privileges (sudo). Unprivileged users can observe socket states but will not be shown the underlying process names or PIDs associated with sockets owned by other system users.`,
  `What flag combination in ss displays listening TCP and UDP sockets with numeric addresses and process identifiers? ss -tulpn (TCP, UDP, Listening, Process, Numeric).`
);

writeNoteBlock('cybersecurity', 'linux-windows-and-the-defense-cli', 'sec-03-lo09',
  `PowerShell provides an object-oriented defensive administrative environment on Windows. Instead of parsing raw character streams, PowerShell passes structured objects along the pipeline. Defenders use Get-WinEvent with FilterHashtables to extract specific security event records efficiently without loading entire gigabyte logs into memory, and Get-CimInstance to inspect persistent services, auto-start registry keys, and running processes.`,
  `Formulating an efficient Get-WinEvent FilterHashtable query:
\`\`\`powershell
# Querying Windows Security log for failed logon events (Event ID 4625)
# in the past 24 hours using structured hashtable filtering:

$filter = @{
    LogName = 'Security'
    Id = 4625
    StartTime = (Get-Date).AddDays(-1)
}

# Pipeline streams structured .NET event objects:
# Get-WinEvent -FilterHashtable $filter | Select-Object TimeCreated, Message -First 10
\`\`\``,
  `Piping raw Get-WinEvent -LogName Security into Where-Object { $_.Id -eq 4625 }. This downloads hundreds of thousands of unrelated events into memory before filtering, causing immense disk and CPU thrashing compared to server-side -FilterHashtable.`,
  `Why is -FilterHashtable dramatically faster than piping Get-WinEvent into Where-Object? It pushes filtering down to the Windows Event Log API at the kernel level rather than loading all raw records into memory.`
);

// Questions for sec-03
const ch03Questions = [
  // LO01
  {
    loId: "sec-03-lo01",
    type: "single",
    difficulty: 1,
    id: "sec-03-q01",
    stem: "In Linux file permissions, what numeric octal value corresponds to read, write, and execute permissions (rwx)?",
    options: [
      { id: "a", text: "7 (4 + 2 + 1)" },
      { id: "b", text: "6 (4 + 2)" },
      { id: "c", text: "5 (4 + 1)" },
      { id: "d", text: "3 (2 + 1)" }
    ],
    answer: ["a"],
    explanation: "Read is 4, Write is 2, and Execute is 1. Sum = 4 + 2 + 1 = 7.",
    noteRef: "sec-03-lo01",
    reviewed: false
  },
  {
    loId: "sec-03-lo01",
    type: "numeric",
    difficulty: 2,
    id: "sec-03-q02",
    stem: "What is the three-digit octal permission mode for a file with permissions: User: read-write-execute (rwx), Group: read-execute (r-x), Others: none (---)?",
    options: [
      { id: "a", text: "750" },
      { id: "b", text: "755" },
      { id: "c", text: "640" },
      { id: "d", text: "700" }
    ],
    answer: ["a"],
    explanation: "User = 4+2+1=7. Group = 4+0+1=5. Others = 0+0+0=0. Mode = 750.",
    noteRef: "sec-03-lo01",
    verify: "((4+2+1)*100 + (4+1)*10 + 0 === 750)",
    reviewed: false
  },
  {
    loId: "sec-03-lo01",
    type: "scenario",
    difficulty: 2,
    id: "sec-03-q03",
    stem: "A developer executes chmod 777 on a production web configuration file containing database credentials. What security risk does this introduce?",
    options: [
      { id: "a", text: "Any local user or compromised service account on the server can read, modify, or delete the credentials." },
      { id: "b", text: "The file is automatically published to public GitHub repositories." },
      { id: "c", text: "The file can no longer be read by the root user." },
      { id: "d", text: "The kernel disables network routing." }
    ],
    answer: ["a"],
    explanation: "Mode 777 grants universal read, write, and execute rights to all users on the host.",
    noteRef: "sec-03-lo01",
    reviewed: false
  },
  {
    loId: "sec-03-lo01",
    type: "single",
    difficulty: 3,
    id: "sec-03-q04",
    stem: "How does the directory execute bit ('x') differ in functionality from the file execute bit in Linux?",
    options: [
      { id: "a", text: "On a directory, 'x' allows traversing (entering) the directory and accessing files within it." },
      { id: "b", text: "On a directory, 'x' enables running shell scripts stored inside it." },
      { id: "c", text: "On a directory, 'x' is ignored by the kernel." },
      { id: "d", text: "On a directory, 'x' grants ownership transfer rights." }
    ],
    answer: ["a"],
    explanation: "Read ('r') on a directory permits listing contents, while Execute ('x') permits cd and accessing metadata of files inside.",
    noteRef: "sec-03-lo01",
    reviewed: false
  },

  // LO02
  {
    loId: "sec-03-lo02",
    type: "single",
    difficulty: 1,
    id: "sec-03-q05",
    stem: "What does the Set User ID (SUID) permission bit enable on an executable binary?",
    options: [
      { id: "a", text: "It executes the binary with the privileges of the file owner rather than the launching user." },
      { id: "b", text: "It prevents non-owners from modifying the file." },
      { id: "c", text: "It forces the binary to run exclusively in background mode." },
      { id: "d", text: "It encrypts the binary file on disk." }
    ],
    answer: ["a"],
    explanation: "SUID executes a program with the permissions of the file owner (e.g. root for /usr/bin/passwd).",
    noteRef: "sec-03-lo02",
    reviewed: false
  },
  {
    loId: "sec-03-lo02",
    type: "scenario",
    difficulty: 2,
    id: "sec-03-q06",
    stem: "During a security audit, a defender finds /tmp/bash owned by root with permissions -rwsr-xr-x. What does this indicate?",
    options: [
      { id: "a", text: "A persistent SUID root backdoor that allows any user to spawn an interactive root shell." },
      { id: "b", text: "A standard Ubuntu system update file." },
      { id: "c", text: "A temporary file that will be deleted upon reboot by systemd." },
      { id: "d", text: "A damaged binary that cannot be executed." }
    ],
    answer: ["a"],
    explanation: "A root-owned shell with SUID in /tmp is a classic privilege escalation backdoor.",
    noteRef: "sec-03-lo02",
    reviewed: false
  },
  {
    loId: "sec-03-lo02",
    type: "single",
    difficulty: 2,
    id: "sec-03-q07",
    stem: "What is the purpose of the Sticky Bit (mode 1000) when applied to shared directories like /tmp?",
    options: [
      { id: "a", text: "It ensures that only the file owner or root can delete or rename files within the directory." },
      { id: "b", text: "It prevents files from being modified once written." },
      { id: "c", text: "It compresses files to save disk storage." },
      { id: "d", text: "It hides directory contents from unprivileged users." }
    ],
    answer: ["a"],
    explanation: "The sticky bit prevents users from deleting or renaming files owned by other users in world-writable directories.",
    noteRef: "sec-03-lo02",
    reviewed: false
  },
  {
    loId: "sec-03-lo02",
    type: "single",
    difficulty: 3,
    id: "sec-03-q08",
    stem: "What command finds all files on a Linux system with the SUID bit set while discarding permission denied errors?",
    options: [
      { id: "a", text: "find / -perm -4000 -type f 2>/dev/null" },
      { id: "b", text: "grep -r \"suid\" / 2>&1" },
      { id: "c", text: "chmod -R 4000 /tmp" },
      { id: "d", text: "ls -la /root > /dev/null" }
    ],
    answer: ["a"],
    explanation: "find / -perm -4000 -type f 2>/dev/null searches for files with the 4000 SUID bit and redirects stderr to /dev/null.",
    noteRef: "sec-03-lo02",
    reviewed: false
  },

  // LO03
  {
    loId: "sec-03-lo03",
    type: "single",
    difficulty: 1,
    id: "sec-03-q09",
    stem: "What command displays running processes in a hierarchical tree view showing parent-child relationships?",
    options: [
      { id: "a", text: "pstree (or ps auxf)" },
      { id: "b", text: "systemctl status" },
      { id: "c", text: "uname -a" },
      { id: "d", text: "cat /etc/passwd" }
    ],
    answer: ["a"],
    explanation: "pstree or ps auxf visualizes process hierarchies and parent-child execution lineages.",
    noteRef: "sec-03-lo03",
    reviewed: false
  },
  {
    loId: "sec-03-lo03",
    type: "scenario",
    difficulty: 2,
    id: "sec-03-q10",
    stem: "An analyst discovers a suspicious process kworker_fake consuming 100% CPU. Checking its PPID reveals parent process cron. What does this suggest?",
    options: [
      { id: "a", text: "The process was launched via a scheduled cron job to maintain automated persistence." },
      { id: "b", text: "The Linux kernel is running low on memory." },
      { id: "c", text: "The system is undergoing a normal kernel update." },
      { id: "d", text: "The process is an active SSH session." }
    ],
    answer: ["a"],
    explanation: "A process whose PPID points to cron was spawned from a crontab entry, indicating scheduled persistence.",
    noteRef: "sec-03-lo03",
    reviewed: false
  },
  {
    loId: "sec-03-lo03",
    type: "numeric",
    difficulty: 2,
    id: "sec-03-q11",
    stem: "What is the Process ID (PID) of the systemd initialization manager in modern Linux systems?",
    options: [
      { id: "a", text: "1" },
      { id: "b", text: "0" },
      { id: "c", text: "100" },
      { id: "d", text: "2" }
    ],
    answer: ["a"],
    explanation: "systemd is the first userspace process spawned by the kernel and always holds PID 1.",
    noteRef: "sec-03-lo03",
    verify: "(1 === 1)",
    reviewed: false
  },
  {
    loId: "sec-03-lo03",
    type: "multi",
    difficulty: 3,
    id: "sec-03-q12",
    stem: "Which of the following commands inspect system services managed by systemd?",
    options: [
      { id: "a", text: "systemctl status <service>" },
      { id: "b", text: "systemctl list-units --type=service" },
      { id: "c", text: "journalctl -u <service>" },
      { id: "d", text: "iptables -L -n" }
    ],
    answer: ["a", "b", "c"],
    explanation: "systemctl inspects and manages units; journalctl -u reads specific service unit logs. iptables manages firewall rules.",
    noteRef: "sec-03-lo03",
    reviewed: false
  },

  // LO04
  {
    loId: "sec-03-lo04",
    type: "single",
    difficulty: 1,
    id: "sec-03-q13",
    stem: "In Debian/Ubuntu distributions, which log file records SSH authentication attempts and sudo executions?",
    options: [
      { id: "a", text: "/var/log/auth.log" },
      { id: "b", text: "/var/log/messages" },
      { id: "c", text: "/var/log/dmesg" },
      { id: "d", text: "/var/log/boot.log" }
    ],
    answer: ["a"],
    explanation: "Authentication records in Debian/Ubuntu are stored in /var/log/auth.log (in Red Hat/CentOS it is /var/log/secure).",
    noteRef: "sec-03-lo04",
    reviewed: false
  },
  {
    loId: "sec-03-lo04",
    type: "scenario",
    difficulty: 2,
    id: "sec-03-q14",
    stem: "An attacker with root access executes cat /dev/null > /var/log/auth.log. What was the attacker attempting to achieve?",
    options: [
      { id: "a", text: "Log tampering: truncating the log file to zero bytes to delete evidence of their session and commands." },
      { id: "b", text: "Backing up the logs to an external disk." },
      { id: "c", text: "Compressing the log file to conserve disk space." },
      { id: "d", text: "Restarting the rsyslog daemon." }
    ],
    answer: ["a"],
    explanation: "Overwriting a log file with /dev/null truncates it to 0 bytes, destroying evidentiary records.",
    noteRef: "sec-03-lo04",
    reviewed: false
  },
  {
    loId: "sec-03-lo04",
    type: "single",
    difficulty: 2,
    id: "sec-03-q15",
    stem: "What command queries binary systemd journals specifically for logs generated by the sshd unit?",
    options: [
      { id: "a", text: "journalctl -u ssh" },
      { id: "b", text: "cat /var/log/sshd.bin" },
      { id: "c", text: "tail -f /etc/ssh/sshd_config" },
      { id: "d", text: "grep -r \"ssh\" /bin/" }
    ],
    answer: ["a"],
    explanation: "journalctl -u ssh or journalctl -u sshd filters systemd journals for entries from the SSH service unit.",
    noteRef: "sec-03-lo04",
    reviewed: false
  },
  {
    loId: "sec-03-lo04",
    type: "single",
    difficulty: 3,
    id: "sec-03-q16",
    stem: "Why should critical enterprise servers configure syslog forwarding to an external remote SIEM?",
    options: [
      { id: "a", text: "To preserve evidence even if an attacker compromises root privileges and clears local disk logs." },
      { id: "b", text: "Because local disks cannot store more than 10MB of text." },
      { id: "c", text: "To encrypt the Linux kernel image." },
      { id: "d", text: "To reduce network bandwidth consumption." }
    ],
    answer: ["a"],
    explanation: "Forwarding logs to a remote, write-protected repository ensures forensic data survives local root compromises.",
    noteRef: "sec-03-lo04",
    reviewed: false
  },

  // LO05
  {
    loId: "sec-03-lo05",
    type: "single",
    difficulty: 1,
    id: "sec-03-q17",
    stem: "What is a Security Identifier (SID) in the Windows security architecture?",
    options: [
      { id: "a", text: "A unique, immutable alphanumeric string used to identify a security principal (user, group, or computer)." },
      { id: "b", text: "A 32-bit hash of the user's plaintext password." },
      { id: "c", text: "The network IP address of the Domain Controller." },
      { id: "d", text: "The serial number of the Windows motherboard." }
    ],
    answer: ["a"],
    explanation: "Windows uses SIDs (e.g. S-1-5-21-...) to unambiguously identify accounts and groups in access control evaluations.",
    noteRef: "sec-03-lo05",
    reviewed: false
  },
  {
    loId: "sec-03-lo05",
    type: "numeric",
    difficulty: 2,
    id: "sec-03-q18",
    stem: "What is the Relative Identifier (RID) suffix for the built-in Windows local Administrator account?",
    options: [
      { id: "a", text: "500" },
      { id: "b", text: "501" },
      { id: "c", text: "1000" },
      { id: "d", text: "0" }
    ],
    answer: ["a"],
    explanation: "RID 500 always identifies the default built-in Administrator account (RID 501 is Guest).",
    noteRef: "sec-03-lo05",
    verify: "(500 === 500)",
    reviewed: false
  },
  {
    loId: "sec-03-lo05",
    type: "scenario",
    difficulty: 2,
    id: "sec-03-q19",
    stem: "A Windows administrator renames the local 'Administrator' account to 'HelpdeskAdmin'. What is the RID of this renamed account?",
    options: [
      { id: "a", text: "RID 500, because SIDs remain permanently fixed regardless of username modifications." },
      { id: "b", text: "RID 1001, because renaming generates a new user account." },
      { id: "c", text: "RID 0, because administrative privileges were reset." },
      { id: "d", text: "RID 501, because it converted to a guest account." }
    ],
    answer: ["a"],
    explanation: "Renaming a user changes its display name but leaves the unique SID and RID completely unchanged.",
    noteRef: "sec-03-lo05",
    reviewed: false
  },
  {
    loId: "sec-03-lo05",
    type: "single",
    difficulty: 3,
    id: "sec-03-q20",
    stem: "What Windows component generates the Access Token for a user upon successful authentication?",
    options: [
      { id: "a", text: "Local Security Authority Subsystem Service (LSASS)" },
      { id: "b", text: "Windows Defender SmartScreen" },
      { id: "c", text: "Event Viewer (eventvwr.exe)" },
      { id: "d", text: "Windows Update Service" }
    ],
    answer: ["a"],
    explanation: "LSASS authenticates credentials and creates the user's access token containing their SIDs and privilege tokens.",
    noteRef: "sec-03-lo05",
    reviewed: false
  },

  // LO06
  {
    loId: "sec-03-lo06",
    type: "single",
    difficulty: 1,
    id: "sec-03-q21",
    stem: "In the Windows Security Event Log, what Event ID represents a successful account logon?",
    options: [
      { id: "a", text: "Event ID 4624" },
      { id: "b", text: "Event ID 4625" },
      { id: "c", text: "Event ID 4688" },
      { id: "d", text: "Event ID 7045" }
    ],
    answer: ["a"],
    explanation: "Event ID 4624 denotes a successful logon; Event ID 4625 denotes a failed logon attempt.",
    noteRef: "sec-03-lo06",
    reviewed: false
  },
  {
    loId: "sec-03-lo06",
    type: "scenario",
    difficulty: 2,
    id: "sec-03-q22",
    stem: "A SOC alert triggers on Event ID 4624 with Logon Type 3 from a workstation IP address to a file server. What kind of logon is Logon Type 3?",
    options: [
      { id: "a", text: "Network Logon (e.g. accessing a shared folder via SMB or IIS)" },
      { id: "b", text: "Interactive Console Logon at the physical keyboard" },
      { id: "c", text: "Remote Desktop Protocol (RDP) session" },
      { id: "d", text: "System Unlock from a screensaver" }
    ],
    answer: ["a"],
    explanation: "Logon Type 3 corresponds to network-based access (such as accessing shared files or intranet resources).",
    noteRef: "sec-03-lo06",
    reviewed: false
  },
  {
    loId: "sec-03-lo06",
    type: "numeric",
    difficulty: 2,
    id: "sec-03-q23",
    stem: "What Windows Security Event ID records the creation of a new process (process execution auditing)?",
    options: [
      { id: "a", text: "4688" },
      { id: "b", text: "4624" },
      { id: "c", text: "4625" },
      { id: "d", text: "1102" }
    ],
    answer: ["a"],
    explanation: "Event ID 4688 logs process creation events in the Windows Security Log.",
    noteRef: "sec-03-lo06",
    verify: "(4688 === 4688)",
    reviewed: false
  },
  {
    loId: "sec-03-lo06",
    type: "single",
    difficulty: 3,
    id: "sec-03-q24",
    stem: "Why do incident responders frequently install Microsoft Sysmon alongside standard Windows Security Logs?",
    options: [
      { id: "a", text: "Sysmon logs detailed process lineages, network connections, file creation timestamps, and SHA-256 hashes." },
      { id: "b", text: "Sysmon replaces the Windows kernel with Linux eBPF." },
      { id: "c", text: "Sysmon automatically shuts down the system when an adversary logs in." },
      { id: "d", text: "Sysmon eliminates the need for antivirus software." }
    ],
    answer: ["a"],
    explanation: "Sysmon enriches telemetry with process hashes (Event 1), network connections (Event 3), and file creation times.",
    noteRef: "sec-03-lo06",
    reviewed: false
  },

  // LO07
  {
    loId: "sec-03-lo07",
    type: "single",
    difficulty: 1,
    id: "sec-03-q25",
    stem: "Which command-line utility filters text line-by-line using regular expressions?",
    options: [
      { id: "a", text: "grep" },
      { id: "b", text: "chmod" },
      { id: "c", text: "chown" },
      { id: "d", text: "touch" }
    ],
    answer: ["a"],
    explanation: "grep (Global Regular Expression Print) searches and filters text based on regex patterns.",
    noteRef: "sec-03-lo07",
    reviewed: false
  },
  {
    loId: "sec-03-lo07",
    type: "scenario",
    difficulty: 2,
    id: "sec-03-q26",
    stem: "An analyst executes: cat auth.log | grep \"Failed password\" | awk '{print $11}' | sort | uniq -c | sort -nr. What does this command pipeline produce?",
    options: [
      { id: "a", text: "A frequency-ranked list of IP addresses responsible for failed password attempts, highest count first." },
      { id: "b", text: "A list of users who successfully logged into the server." },
      { id: "c", text: "A deletion script that blocks all incoming SSH connections." },
      { id: "d", text: "A cryptographic hash of the auth.log file." }
    ],
    answer: ["a"],
    explanation: "Extracting column 11 (the source IP), counting duplicates via uniq -c, and sorting numerically descending ranks top brute-force IPs.",
    noteRef: "sec-03-lo07",
    reviewed: false
  },
  {
    loId: "sec-03-lo07",
    type: "single",
    difficulty: 2,
    id: "sec-03-q27",
    stem: "What does awk '{print $1}' access.log output?",
    options: [
      { id: "a", text: "The first whitespace-delimited field (column) of every line in access.log." },
      { id: "b", text: "Only the first line of access.log." },
      { id: "c", text: "All words containing the letter '1'." },
      { id: "d", text: "The total file size in kilobytes." }
    ],
    answer: ["a"],
    explanation: "In awk, $1 refers to the first field of each record according to the field separator.",
    noteRef: "sec-03-lo07",
    reviewed: false
  },
  {
    loId: "sec-03-lo07",
    type: "multi",
    difficulty: 3,
    id: "sec-03-q28",
    stem: "Which of the following flags modify grep behavior appropriately during log analysis?",
    options: [
      { id: "a", text: "'-i' to perform case-insensitive pattern matching" },
      { id: "b", text: "'-v' to invert match (select non-matching lines)" },
      { id: "c", text: "'-E' to enable extended regular expressions" },
      { id: "d", text: "'-delete' to purge matching files from disk" }
    ],
    answer: ["a", "b", "c"],
    explanation: "-i, -v, and -E are standard grep options. -delete belongs to find.",
    noteRef: "sec-03-lo07",
    reviewed: false
  },

  // LO08
  {
    loId: "sec-03-lo08",
    type: "single",
    difficulty: 1,
    id: "sec-03-q29",
    stem: "Which modern Linux command is the recommended faster replacement for the legacy netstat tool?",
    options: [
      { id: "a", text: "ss" },
      { id: "b", text: "cat" },
      { id: "c", text: "touch" },
      { id: "d", text: "echo" }
    ],
    answer: ["a"],
    explanation: "ss (socket statistics) queries the kernel directly via netlink and replaces the older netstat.",
    noteRef: "sec-03-lo08",
    reviewed: false
  },
  {
    loId: "sec-03-lo08",
    type: "scenario",
    difficulty: 2,
    id: "sec-03-q30",
    stem: "Running ss -tulpn on a compromised web host reveals a listening socket: tcp LISTEN 0.0.0.0:4444 users:((\"nc\",pid=4012,fd=3)). What does this indicate?",
    options: [
      { id: "a", text: "A netcat process is listening on port 4444, functioning as a bind shell or listener." },
      { id: "b", text: "Nginx is serving HTTPS web traffic normally." },
      { id: "c", text: "The network cable is disconnected." },
      { id: "d", text: "A DNS query was dropped by iptables." }
    ],
    answer: ["a"],
    explanation: "nc listening on port 4444 across all interfaces (0.0.0.0) is a common sign of an unauthorized listener or bind shell.",
    noteRef: "sec-03-lo08",
    reviewed: false
  },
  {
    loId: "sec-03-lo08",
    type: "single",
    difficulty: 2,
    id: "sec-03-q31",
    stem: "What does the '-p' flag in ss -tulpn display when run with administrative privileges?",
    options: [
      { id: "a", text: "The process name and PID owning each socket." },
      { id: "b", text: "The ping latency to the default gateway." },
      { id: "c", text: "The password of the logged-in user." },
      { id: "d", text: "The parity check status of the NIC." }
    ],
    answer: ["a"],
    explanation: "The -p flag instructs ss to resolve and display the process names and PIDs holding sockets.",
    noteRef: "sec-03-lo08",
    reviewed: false
  },
  {
    loId: "sec-03-lo08",
    type: "single",
    difficulty: 3,
    id: "sec-03-q32",
    stem: "What socket state indicates an active two-way established data connection between client and server?",
    options: [
      { id: "a", text: "ESTAB (ESTABLISHED)" },
      { id: "b", text: "LISTEN" },
      { id: "c", text: "TIME_WAIT" },
      { id: "d", text: "SYN_SENT" }
    ],
    answer: ["a"],
    explanation: "ESTABLISHED (or ESTAB) denotes an open, active bidirectional TCP communication session.",
    noteRef: "sec-03-lo08",
    reviewed: false
  },

  // LO09 (Extension)
  {
    loId: "sec-03-lo09",
    type: "single",
    difficulty: 2,
    id: "sec-03-q33",
    stem: "Why is Get-WinEvent -FilterHashtable preferred over Get-WinEvent | Where-Object for querying large Windows Event Logs?",
    options: [
      { id: "a", text: "FilterHashtable performs server-side filtering via the Windows Event API, downloading only matching records rather than streaming entire gigabyte logs." },
      { id: "b", text: "Where-Object causes Blue Screens on modern Windows kernels." },
      { id: "c", text: "FilterHashtable converts events into plaintext CSV files automatically." },
      { id: "d", text: "Where-Object cannot evaluate integers." }
    ],
    answer: ["a"],
    explanation: "FilterHashtable filters events at the log provider level, saving immense memory and I/O overhead.",
    noteRef: "sec-03-lo09",
    reviewed: false
  },
  {
    loId: "sec-03-lo09",
    type: "scenario",
    difficulty: 3,
    id: "sec-03-q34",
    stem: "A responder needs to inspect all running Windows services whose startup type is Automatic using modern WMI/CIM cmdlets. Which PowerShell command achieves this?",
    options: [
      { id: "a", text: "Get-CimInstance Win32_Service -Filter \"StartMode = 'Auto'\"" },
      { id: "b", text: "Get-Process -Name auto" },
      { id: "c", text: "cat C:\\Windows\\System32\\services.msc" },
      { id: "d", text: "Get-EventLog -List Auto" }
    ],
    answer: ["a"],
    explanation: "Get-CimInstance Win32_Service -Filter \"StartMode = 'Auto'\" queries the WMI repository for automatically starting services.",
    noteRef: "sec-03-lo09",
    reviewed: false
  }
];

balanceAndSave('cybersecurity', 'linux-windows-and-the-defense-cli', ch03Objectives, ch03Questions);
console.log("Batch 5 complete!");
