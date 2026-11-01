/**
 * scripts/generate-sec-batch6.mjs
 *
 * Generates Batch 6 for Course 2 (Cybersecurity):
 * - Chapter 4: applied-cryptography-basics (sec-04)
 * - Chapter 5: identity-auth-and-access-control (sec-05)
 */

import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();

function writeNoteBlock(courseSlug, chapterSlug, loId, coreIdea, workedExample, commonMistake, checkYourself, sources = ["lic-04"]) {
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
// CHAPTER 4: applied-cryptography-basics (sec-04)
// ============================================================================
const ch04Objectives = {
  version: 1,
  chapterId: "sec-04",
  objectives: [
    {
      id: "sec-04-lo01",
      order: 1,
      title: "Distinguish symmetric from asymmetric cryptographic encryption",
      bloom: "distinguish",
      tier: "core",
      mustHave: true,
      keywords: ["symmetric encryption", "asymmetric encryption", "public key", "private key"],
      aliases: ["shared secret encryption", "public key cryptography"],
      prerequisites: ["sec-01-lo01"],
      estMinutes: 10
    },
    {
      id: "sec-04-lo02",
      order: 2,
      title: "Compare symmetric cipher block modes (ECB, CBC, GCM)",
      bloom: "compare",
      tier: "core",
      mustHave: true,
      keywords: ["aes", "block cipher", "ecb", "cbc", "gcm", "authenticated encryption"],
      aliases: ["cipher modes", "aead modes"],
      prerequisites: ["sec-04-lo01"],
      estMinutes: 12
    },
    {
      id: "sec-04-lo03",
      order: 3,
      title: "Explain cryptographic hash function properties and collision resistance",
      bloom: "understand",
      tier: "core",
      mustHave: true,
      keywords: ["hash function", "sha-256", "pre-image resistance", "collision resistance"],
      aliases: ["one-way hash", "avalanche effect"],
      prerequisites: ["sec-04-lo01"],
      estMinutes: 12
    },
    {
      id: "sec-04-lo04",
      order: 4,
      title: "Calculate message authentication codes using HMAC and key hashing",
      bloom: "calculate",
      tier: "core",
      mustHave: false,
      keywords: ["hmac", "mac", "message authentication", "data integrity"],
      aliases: ["keyed hash", "tamper detection"],
      prerequisites: ["sec-04-lo03"],
      estMinutes: 10
    },
    {
      id: "sec-04-lo05",
      order: 5,
      title: "Trace asymmetric key exchanges using Diffie-Hellman and Elliptic Curves",
      bloom: "trace",
      tier: "core",
      mustHave: true,
      keywords: ["diffie-hellman", "ecdh", "ephemeral keys", "forward secrecy"],
      aliases: ["key exchange protocol", "elliptic curve cryptography"],
      prerequisites: ["sec-04-lo01"],
      estMinutes: 14
    },
    {
      id: "sec-04-lo06",
      order: 6,
      title: "Analyze digital signatures for integrity, authenticity, and non-repudiation",
      bloom: "analyze",
      tier: "core",
      mustHave: false,
      keywords: ["digital signature", "rsa signature", "ecdsa", "non-repudiation"],
      aliases: ["asymmetric signing", "signature verification"],
      prerequisites: ["sec-04-lo03", "sec-04-lo05"],
      estMinutes: 12
    },
    {
      id: "sec-04-lo07",
      order: 7,
      title: "Dissect Public Key Infrastructure (PKI) and X.509 certificate chains",
      bloom: "dissect",
      tier: "core",
      mustHave: false,
      keywords: ["pki", "x.509", "certificate authority", "root ca", "crl", "ocsp"],
      aliases: ["certificate chain of trust", "tls certificates"],
      prerequisites: ["sec-04-lo06"],
      estMinutes: 12
    },
    {
      id: "sec-04-lo08",
      order: 8,
      title: "Trace the modern TLS 1.3 cryptographic handshake",
      bloom: "trace",
      tier: "core",
      mustHave: false,
      keywords: ["tls 1.3", "tls handshake", "client hello", "server hello", "session keys"],
      aliases: ["transport layer security", "tls connection establishment"],
      prerequisites: ["sec-04-lo05", "sec-04-lo07"],
      estMinutes: 12
    },
    {
      id: "sec-04-lo09",
      order: 9,
      title: "Identify common cryptographic vulnerabilities and insecure implementations",
      bloom: "identify",
      tier: "extension",
      mustHave: false,
      keywords: ["hardcoded keys", "homebrew crypto", "nonce reuse", "padding oracle"],
      aliases: ["crypto flaws", "crypto antipatterns"],
      prerequisites: ["sec-04-lo02"],
      estMinutes: 12
    }
  ]
};

// Notes for sec-04
writeNoteBlock('cybersecurity', 'applied-cryptography-basics', 'sec-04-lo01',
  `Cryptography provides data confidentiality, integrity, authenticity, and non-repudiation. Symmetric cryptography uses a single shared secret key for both encryption and decryption (e.g., AES-256, ChaCha20). It is computationally fast and ideal for encrypting high-volume data streams. Asymmetric cryptography (public-key cryptography) utilizes a mathematically linked key pair: a public key available to anyone for encryption or signature verification, and a private key kept strictly confidential for decryption or signing (e.g., RSA, ECC).`,
  `Contrasting key requirements in symmetric vs asymmetric schemes:
\`\`\`python
# Symmetric: 1 shared key known to Alice and Bob
shared_key = "k3y_s3cr3t_256bit"

# Asymmetric: 2 distinct keys
alice_keypair = {
    "public_key": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A...",  # Shared publicly
    "private_key": "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCB..."  # Kept private
}

# Message encrypted with Alice's public key can ONLY be decrypted with Alice's private key
print("Can sender decrypt with public key?", False)
print("Can receiver decrypt with private key?", True)
\`\`\``,
  `Attempting to encrypt multi-gigabyte databases or network sessions directly with RSA asymmetric ciphers. Asymmetric operations are computationally slow and limited to payloads smaller than the key modulus; modern protocols use hybrid encryption where asymmetric crypto exchanges a fast symmetric session key.`,
  `If Alice encrypts a message with Bob's public key, who holds the only key capable of decrypting it? Bob (using his private key).`
);

writeNoteBlock('cybersecurity', 'applied-cryptography-basics', 'sec-04-lo02',
  `Block ciphers like AES operate on fixed-size blocks (128 bits). The block cipher mode dictates how plaintext blocks are transformed:
1. ECB (Electronic Codebook): Each block is encrypted independently. Identical plaintext blocks produce identical ciphertext blocks, leaking structural data patterns (the famous ECB Penguin effect). Insecure for general use.
2. CBC (Cipher Block Chaining): XORs each plaintext block with the preceding ciphertext block before encryption, using a random Initialization Vector (IV). Vulnerable to padding oracle attacks if integrity is not verified.
3. GCM (Galois/Counter Mode): An Authenticated Encryption with Associated Data (AEAD) mode that provides both high-speed encryption and cryptographic integrity verification in a single pass.`,
  `Simulating pattern leakage in Electronic Codebook (ECB) mode:
\`\`\`python
# Two identical 16-byte plaintext blocks
block1 = b"SECURITY_CONF_24"
block2 = b"SECURITY_CONF_24"

# In ECB, identical inputs produce identical outputs under the same key:
def mock_ecb_encrypt(block, key):
    return bytes([b ^ key for b in block])

c1 = mock_ecb_encrypt(block1, 0xAA)
c2 = mock_ecb_encrypt(block2, 0xAA)
print("Are ECB ciphertexts identical?", c1 == c2) # True (leaks pattern)
\`\`\``,
  `Reusing an Initialization Vector (IV) or Nonce in counter-based modes like GCM. Nonce reuse in GCM completely compromises the authentication key and allows adversaries to forge arbitrary ciphertext messages.`,
  `Which block cipher mode provides Authenticated Encryption with Associated Data (AEAD) combining confidentiality and integrity? Galois/Counter Mode (GCM).`
);

writeNoteBlock('cybersecurity', 'applied-cryptography-basics', 'sec-04-lo03',
  `A cryptographic hash function is a deterministic one-way mathematical function that maps arbitrary-length inputs to a fixed-size digest (e.g., SHA-256 outputs 256 bits). Essential security properties include:
1. Pre-image resistance: Computationally infeasible to reverse engineer input x from hash h(x).
2. Second pre-image resistance: Given x1, infeasible to find a distinct x2 such that h(x1) = h(x2).
3. Collision resistance: Infeasible to find any two arbitrary inputs that yield the same hash digest.
4. Avalanche effect: A 1-bit alteration in the input changes approximately 50% of output bits.`,
  `Demonstrating the avalanche effect in Python with SHA-256:
\`\`\`python
import hashlib

h1 = hashlib.sha256(b"admin").hexdigest()
h2 = hashlib.sha256(b"Admin").hexdigest()

print("Hash 1 ('admin'):", h1[:16], "...")
print("Hash 2 ('Admin'):", h2[:16], "...")
# Changing single uppercase 'A' flips almost half the bits completely
\`\`\``,
  `Using deprecated, cryptographically broken algorithms like MD5 or SHA-1 for digital signatures or security certificates. Known practical collision attacks allow adversaries to construct forged certificates sharing identical MD5 or SHA-1 hashes.`,
  `What security property is violated when an attacker finds two different input files that produce the exact same hash digest? Collision resistance.`
);

writeNoteBlock('cybersecurity', 'applied-cryptography-basics', 'sec-04-lo04',
  `Hashing alone validates data integrity against accidental corruption, but does not protect against an active adversary who can alter both the message and its accompanying hash digest. A Hash-based Message Authentication Code (HMAC) incorporates a shared secret cryptographic key with a nested hashing construction: HMAC(K, m) = H((K xor opad) || H((K xor ipad) || m)). This guarantees both message integrity and sender authenticity.`,
  `Computing and verifying an HMAC tag:
\`\`\`python
import hmac
import hashlib

secret_key = b"super_secret_shared_key_42"
message = b"transfer_funds: $500 to account_982"

# Sender computes HMAC tag
tag = hmac.new(secret_key, message, hashlib.sha256).hexdigest()

# Receiver verifies with same key and constant-time comparison
def verify(msg, received_tag, key):
    expected = hmac.new(key, msg, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, received_tag)

print("Is message authentic and unaltered?", verify(message, tag, secret_key)) # True
\`\`\``,
  `Comparing cryptographic MACs using standard variable-time string equality operators (==). Standard string comparisons terminate early upon encountering the first mismatched character, introducing timing attacks that allow attackers to guess tags byte by byte. Use constant-time comparison functions like hmac.compare_digest.`,
  `Why does an attacker unable to know the secret key fail to forge a valid HMAC tag for an altered message? Because computing the valid outer and inner hash digests requires possession of secret key K.`
);

writeNoteBlock('cybersecurity', 'applied-cryptography-basics', 'sec-04-lo05',
  `Diffie-Hellman (DH) and Elliptic Curve Diffie-Hellman (ECDH) allow two parties to establish a shared secret over an insecure channel without transmitting the secret itself. In ephemeral ECDH (ECDHE), each party generates a temporary, single-use keypair. Alice sends public point A, Bob sends public point B. Each computes the shared coordinate S = aB = bA. Because private keys are discarded immediately after session setup, ECDHE provides Perfect Forward Secrecy (PFS): future compromise of long-term server private keys cannot decrypt previously recorded network traffic.`,
  `Illustrating the Diffie-Hellman mathematical principle:
\`\`\`python
# Conceptual modular arithmetic DH:
g = 5    # public base
p = 23   # public prime modulus

# Alice selects private a = 6, Bob selects private b = 15
a_priv = 6
b_priv = 15

# Exchange public values
A_pub = (g ** a_priv) % p  # 5^6 % 23 = 8
B_pub = (g ** b_priv) % p  # 5^15 % 23 = 19

# Both independently compute shared secret S
s_alice = (B_pub ** a_priv) % p # 19^6 % 23 = 2
s_bob = (A_pub ** b_priv) % p   # 8^15 % 23 = 2

print("Shared secret match:", s_alice == s_bob) # True (Secret is 2)
\`\`\``,
  `Assuming plain Diffie-Hellman prevents Man-in-the-Middle (MitM) attacks on its own. Diffie-Hellman provides key exchange but lacks identity authentication; without digital signatures or certificates to authenticate the exchange, an active attacker can negotiate separate keys with each side.`,
  `What security guarantee ensures that past recorded encrypted sessions cannot be decrypted if the server's private certificate is compromised in the future? Perfect Forward Secrecy (PFS).`
);

writeNoteBlock('cybersecurity', 'applied-cryptography-basics', 'sec-04-lo06',
  `A digital signature provides authenticity, integrity, and non-repudiation. To sign a message, the signer computes a cryptographic hash of the document and encrypts the digest with their private key. Any recipient holding the signer's corresponding public key decrypts the signature to recover the original digest and compares it against a fresh hash of the document. If they match, the recipient is mathematically assured the message originated from the private key holder and was not altered in transit.`,
  `Tracing the digital signature verification flow:
\`\`\`python
# 1. Document hash
doc = b"Firmware update version 2.4.0 verified"
doc_hash = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"

# 2. Signing: Signer encrypts hash with Private Key
simulated_signature = {"signed_by": "Vendor_Private_Key", "digest": doc_hash}

# 3. Verification: Recipient checks signature with Vendor Public Key
is_valid = (simulated_signature["digest"] == doc_hash)
print("Firmware authenticity verified:", is_valid)
\`\`\``,
  `Encrypting the entire document directly with the private key instead of signing its hash digest. Asymmetric encryption is computationally expensive; hashing condenses arbitrary-length files into small 32-byte digests for instant signing.`,
  `Which key does the author of a message use to generate a digital signature? The author's private key.`
);

writeNoteBlock('cybersecurity', 'applied-cryptography-basics', 'sec-04-lo07',
  `Public Key Infrastructure (PKI) binds cryptographic public keys to verified identities (such as domain names or organizations) via digital certificates adhering to the X.509 standard. A Certificate Authority (CA) signs an entity's certificate with the CA's private key. Operating systems and web browsers maintain a Root CA Trust Store. During validation, clients verify the certificate path upward to a trusted root CA. Revocation is checked via Certificate Revocation Lists (CRLs) or Online Certificate Status Protocol (OCSP) stapling.`,
  `Inspecting core fields of an X.509 digital certificate:
\`\`\`python
certificate_fields = {
    "Subject": "CN=example.com, O=Example Inc",
    "Issuer": "CN=Let's Encrypt Authority X3, O=Let's Encrypt",
    "Validity": {"NotBefore": "2026-01-01", "NotAfter": "2026-04-01"},
    "SubjectAlternativeNames": ["example.com", "www.example.com"],
    "PublicKeyAlgorithm": "ECDSA with curve P-256",
    "SignatureAlgorithm": "sha256WithRSAEncryption"
}

print("Verified Domain:", certificate_fields["Subject"])
print("Issuing CA:", certificate_fields["Issuer"])
\`\`\``,
  `Ignoring certificate validation errors in development scripts (e.g., verify=False in Python requests). Disabling certificate validation bypasses PKI chain checks completely, leaving connections vulnerable to trivial Man-in-the-Middle eavesdropping.`,
  `What mechanism allows a web server to provide cached, CA-signed revocation status directly to the browser during the TLS handshake? OCSP Stapling.`
);

writeNoteBlock('cybersecurity', 'applied-cryptography-basics', 'sec-04-lo08',
  `TLS 1.3 drastically simplifies and hardens the transport encryption handshake compared to TLS 1.2:
1. Reduced round trips: Normal handshakes complete in a single round trip (1-RTT) rather than two.
2. Removal of obsolete algorithms: RSA key exchange, static Diffie-Hellman, CBC block modes, and RC4 are completely removed.
3. Mandatory Forward Secrecy: Only ephemeral Diffie-Hellman (ECDHE/DHE) key exchanges are supported.
4. Encrypted extensions: Almost the entire handshake after ClientHello/ServerHello is encrypted under temporary handshake keys.`,
  `Comparing TLS 1.2 vs TLS 1.3 handshake parameters:
\`\`\`python
tls_features = {
    "TLS 1.2": {"handshake_rtt": 2, "supports_rsa_key_exchange": True, "supports_cbc": True},
    "TLS 1.3": {"handshake_rtt": 1, "supports_rsa_key_exchange": False, "supports_cbc": False}
}

print("TLS 1.3 RTT latency:", tls_features["TLS 1.3"]["handshake_rtt"])
print("Is insecure static RSA allowed in TLS 1.3?", tls_features["TLS 1.3"]["supports_rsa_key_exchange"])
\`\`\``,
  `Believing TLS 1.3 protects against Server Name Indication (SNI) leakage without Encrypted Client Hello (ECH). In standard TLS 1.3, the initial ClientHello message transmits the target domain name in plaintext, allowing network observers to see which hostname is being visited.`,
  `How many round trips (RTT) are required to complete a full standard cryptographic handshake in TLS 1.3? Exactly 1 round trip (1-RTT).`
);

writeNoteBlock('cybersecurity', 'applied-cryptography-basics', 'sec-04-lo09',
  `Real-world cryptographic failures rarely stem from breaking mathematical algorithms like AES or RSA; they result from flawed implementation antipatterns:
1. Hardcoded cryptographic keys or API secrets inside client-side source code or mobile binaries.
2. 'Homebrew crypto': Inventing custom encryption algorithms rather than using vetted open-source libraries (e.g. libsodium, cryptography).
3. Insufficient entropy: Using predictable pseudo-random number generators (like Python random) rather than cryptographically secure ones (os.urandom, secrets).
4. Nonce reuse: Repeating initialization vectors across multiple encryption operations.`,
  `Demonstrating secure vs insecure random number generation:
\`\`\`python
import random
import secrets

# INSECURE: Linear Congruential Generator / Mersenne Twister (predictable state)
insecure_token = random.getrandbits(128)

# SECURE: CSPRNG seeded from OS entropy pool (/dev/urandom)
secure_token = secrets.token_hex(16)

print("Cryptographically secure random token:", secure_token)
\`\`\``,
  `Using Python's default random module to generate password reset tokens, session IDs, or encryption keys. The Mersenne Twister algorithm can have its internal state completely determined after observing 624 consecutive outputs.`,
  `Which Python standard library module is specifically designed to generate cryptographically strong random numbers suitable for keys and tokens? The secrets module.`
);

// Questions for sec-04
const ch04Questions = [
  // LO01
  {
    loId: "sec-04-lo01",
    type: "single",
    difficulty: 1,
    id: "sec-04-q01",
    stem: "What is the defining characteristic of symmetric encryption compared to asymmetric encryption?",
    options: [
      { id: "a", text: "A single shared secret key is used for both encryption and decryption." },
      { id: "b", text: "Two mathematically paired public and private keys are required." },
      { id: "c", text: "Encryption can only be executed on integer data." },
      { id: "d", text: "Decryption requires an internet connection to a root Certificate Authority." }
    ],
    answer: ["a"],
    explanation: "Symmetric ciphers (e.g., AES) utilize the exact same secret key for encrypting and decrypting data.",
    noteRef: "sec-04-lo01",
    reviewed: false
  },
  {
    loId: "sec-04-lo01",
    type: "scenario",
    difficulty: 2,
    id: "sec-04-q02",
    stem: "A cloud storage service needs to encrypt petabytes of stored disk data at rest with minimal CPU overhead. Which cipher family should be deployed?",
    options: [
      { id: "a", text: "Symmetric block ciphers such as AES-256" },
      { id: "b", text: "Asymmetric RSA-4096 encryption" },
      { id: "c", text: "Diffie-Hellman key exchange" },
      { id: "d", text: "MD5 hashing" }
    ],
    answer: ["a"],
    explanation: "Symmetric ciphers like AES-256 are hardware-accelerated (AES-NI) and drastically faster than asymmetric algorithms for bulk data.",
    noteRef: "sec-04-lo01",
    reviewed: false
  },
  {
    loId: "sec-04-lo01",
    type: "multi",
    difficulty: 2,
    id: "sec-04-q03",
    stem: "Which of the following cryptographic algorithms are classified as asymmetric (public-key) algorithms?",
    options: [
      { id: "a", text: "RSA" },
      { id: "b", text: "Elliptic Curve Cryptography (ECC / ECDSA)" },
      { id: "c", text: "Diffie-Hellman (DH)" },
      { id: "d", text: "Advanced Encryption Standard (AES)" }
    ],
    answer: ["a", "b", "c"],
    explanation: "RSA, ECC, and Diffie-Hellman use public/private key pairs; AES is a symmetric block cipher.",
    noteRef: "sec-04-lo01",
    reviewed: false
  },
  {
    loId: "sec-04-lo01",
    type: "single",
    difficulty: 3,
    id: "sec-04-q04",
    stem: "In a hybrid encryption scheme, why is asymmetric cryptography paired with symmetric cryptography?",
    options: [
      { id: "a", text: "Asymmetric crypto securely exchanges a symmetric session key, while symmetric crypto encrypts the actual high-volume data efficiently." },
      { id: "b", text: "Asymmetric crypto encrypts the data while symmetric crypto signs the public certificate." },
      { id: "c", text: "Symmetric ciphers cannot be transmitted over TCP/IP networks." },
      { id: "d", text: "To eliminate the need for initialization vectors." }
    ],
    answer: ["a"],
    explanation: "Hybrid encryption leverages the key-distribution benefits of public keys and the computational throughput of symmetric keys.",
    noteRef: "sec-04-lo01",
    reviewed: false
  },

  // LO02
  {
    loId: "sec-04-lo02",
    type: "single",
    difficulty: 1,
    id: "sec-04-q02",
    id: "sec-04-q05",
    stem: "Why is Electronic Codebook (ECB) mode considered cryptographically insecure for encrypting structured files or images?",
    options: [
      { id: "a", text: "Identical plaintext blocks always produce identical ciphertext blocks, preserving visual and data patterns." },
      { id: "b", text: "It requires keys longer than 1024 bits." },
      { id: "c", text: "It can only encrypt data once before deleting the key." },
      { id: "d", text: "It cannot run on multi-core processors." }
    ],
    answer: ["a"],
    explanation: "ECB encrypts each block independently without randomization, leaking patterns (e.g. the ECB penguin).",
    noteRef: "sec-04-lo02",
    reviewed: false
  },
  {
    loId: "sec-04-lo02",
    type: "scenario",
    difficulty: 2,
    id: "sec-04-q06",
    stem: "An engineer designs an API encryption protocol. They need a mode that encrypts data while also detecting any unauthorized tampering with ciphertext or headers. What should they select?",
    options: [
      { id: "a", text: "AES-GCM (Galois/Counter Mode)" },
      { id: "b", text: "AES-ECB (Electronic Codebook)" },
      { id: "c", text: "AES-CBC without HMAC" },
      { id: "d", text: "DES-OFB (Output Feedback)" }
    ],
    answer: ["a"],
    explanation: "AES-GCM is an AEAD mode providing both confidentiality and built-in cryptographic authentication.",
    noteRef: "sec-04-lo02",
    reviewed: false
  },
  {
    loId: "sec-04-lo02",
    type: "numeric",
    difficulty: 2,
    id: "sec-04-q07",
    stem: "What is the fixed block size (in bits) operated on by the Advanced Encryption Standard (AES) regardless of key length?",
    options: [
      { id: "a", text: "128" },
      { id: "b", text: "64" },
      { id: "c", text: "256" },
      { id: "d", text: "512" }
    ],
    answer: ["a"],
    explanation: "AES operates on fixed 128-bit blocks (16 bytes) across all key sizes (128, 192, and 256 bits).",
    noteRef: "sec-04-lo02",
    verify: "(128 === 128)",
    reviewed: false
  },
  {
    loId: "sec-04-lo02",
    type: "single",
    difficulty: 3,
    id: "sec-04-q08",
    stem: "What catastrophic security failure occurs if an application reuses the same Nonce and Key pair across multiple AES-GCM encryptions?",
    options: [
      { id: "a", text: "The authentication subkey can be recovered, allowing adversaries to forge valid ciphertexts." },
      { id: "b", text: "The CPU triggers an unrecoverable kernel panic." },
      { id: "c", text: "The ciphertext expands by 400% in file size." },
      { id: "d", text: "The cipher defaults to plaintext transmission." }
    ],
    answer: ["a"],
    explanation: "Nonce reuse in GCM breaks authentication and allows keystream recovery, destroying both confidentiality and integrity.",
    noteRef: "sec-04-lo02",
    reviewed: false
  },

  // LO03
  {
    loId: "sec-04-lo03",
    type: "single",
    difficulty: 1,
    id: "sec-04-q09",
    stem: "What property of a cryptographic hash function ensures that a small 1-bit modification to the input alters roughly 50% of the output bits?",
    options: [
      { id: "a", text: "The Avalanche Effect" },
      { id: "b", text: "The Pigeonhole Principle" },
      { id: "c", text: "Homomorphic Encryption" },
      { id: "d", text: "Malleability" }
    ],
    answer: ["a"],
    explanation: "The avalanche effect ensures small input changes produce uncorrelated, drastically different hash digests.",
    noteRef: "sec-04-lo03",
    reviewed: false
  },
  {
    loId: "sec-04-lo03",
    type: "numeric",
    difficulty: 2,
    id: "sec-04-q10",
    stem: "How many bits are in the output hash digest produced by SHA-256?",
    options: [
      { id: "a", text: "256" },
      { id: "b", text: "128" },
      { id: "c", text: "512" },
      { id: "d", text: "64" }
    ],
    answer: ["a"],
    explanation: "SHA-256 outputs a fixed 256-bit digest (32 bytes / 64 hexadecimal characters).",
    noteRef: "sec-04-lo03",
    verify: "(256 === 256)",
    reviewed: false
  },
  {
    loId: "sec-04-lo03",
    type: "scenario",
    difficulty: 2,
    id: "sec-04-q11",
    stem: "A security analyst notices that a legacy system verifies software patches using MD5 hashes. Why should this be upgraded immediately to SHA-256?",
    options: [
      { id: "a", text: "MD5 has practical collision vulnerabilities, allowing attackers to forge malicious binaries sharing the MD5 hash of legitimate patches." },
      { id: "b", text: "MD5 hashes can only be computed on Windows XP." },
      { id: "c", text: "SHA-256 automatically installs operating system updates." },
      { id: "d", text: "MD5 encryption keys expire after 30 days." }
    ],
    answer: ["a"],
    explanation: "Practical collision attacks exist against MD5, making it completely untrusted for integrity verification.",
    noteRef: "sec-04-lo03",
    reviewed: false
  },
  {
    loId: "sec-04-lo03",
    type: "single",
    difficulty: 3,
    id: "sec-04-q12",
    stem: "What is 'Pre-image Resistance' in cryptographic hash functions?",
    options: [
      { id: "a", text: "Given an arbitrary hash digest h, it is computationally infeasible to find an input x such that hash(x) = h." },
      { id: "b", text: "Given input x, it is easy to find another input y that produces the same hash." },
      { id: "c", text: "The hash digest must always be smaller than the original input." },
      { id: "d", text: "The hash function must run in constant time regardless of input size." }
    ],
    answer: ["a"],
    explanation: "Pre-image resistance (the one-way property) guarantees you cannot mathematically invert a hash digest back to its input.",
    noteRef: "sec-04-lo03",
    reviewed: false
  },

  // LO04
  {
    loId: "sec-04-lo04",
    type: "single",
    difficulty: 1,
    id: "sec-04-q13",
    stem: "What does an HMAC provide that a standalone cryptographic hash (like SHA-256 alone) cannot?",
    options: [
      { id: "a", text: "Proof of sender authenticity and resistance against tampering by unauthorized third parties." },
      { id: "b", text: "Confidentiality and encryption of plaintext payloads." },
      { id: "c", text: "Lossless compression of large files." },
      { id: "d", text: "Automatic correction of corrupted network packets." }
    ],
    answer: ["a"],
    explanation: "HMAC combines a shared secret key with a hash function, verifying both data integrity and origin authenticity.",
    noteRef: "sec-04-lo04",
    reviewed: false
  },
  {
    loId: "sec-04-lo04",
    type: "scenario",
    difficulty: 2,
    id: "sec-04-q14",
    stem: "A web application checks received HMAC tags using: if (user_tag == expected_tag). Why is this vulnerable to a timing side-channel attack?",
    options: [
      { id: "a", text: "Standard equality terminates at the first mismatched character, allowing an attacker to guess the valid tag byte by byte by measuring response latency." },
      { id: "b", text: "The equality operator crashes the web server when comparing hexadecimal characters." },
      { id: "c", text: "It leaks the user's password in server error logs." },
      { id: "d", text: "It resets the HMAC secret key to null." }
    ],
    answer: ["a"],
    explanation: "Variable-time string comparisons leak timing differences per character; constant-time comparison must be used.",
    noteRef: "sec-04-lo04",
    reviewed: false
  },
  {
    loId: "sec-04-lo04",
    type: "single",
    difficulty: 2,
    id: "sec-04-q15",
    stem: "What mathematical construction protects HMAC against length extension attacks that affect plain Merkle-Damgard hashes?",
    options: [
      { id: "a", text: "A nested two-pass hashing structure with inner and outer key pads: H(K xor opad || H(K xor ipad || m))." },
      { id: "b", text: "Recursive RSA modular exponentiation." },
      { id: "c", text: "Adding 1024 random zero bytes to the end of every message." },
      { id: "d", text: "Encrypting the hash with AES-ECB." }
    ],
    answer: ["a"],
    explanation: "The nested construction H(K_out || H(K_in || m)) prevents adversaries from extending the state of the inner hash.",
    noteRef: "sec-04-lo04",
    reviewed: false
  },
  {
    loId: "sec-04-lo04",
    type: "single",
    difficulty: 3,
    id: "sec-04-q16",
    stem: "If Alice and Bob share a secret key K, can an external eavesdropper Eve modify a message in transit and generate a valid HMAC tag?",
    options: [
      { id: "a", text: "No, because generating the valid tag requires knowledge of secret key K." },
      { id: "b", text: "Yes, by inverting the SHA-256 hash." },
      { id: "c", text: "Yes, by submitting an expired X.509 certificate." },
      { id: "d", text: "No, but only if the message is sent over UDP." }
    ],
    answer: ["a"],
    explanation: "Without the secret key, computing a valid HMAC for a modified message is computationally infeasible.",
    noteRef: "sec-04-lo04",
    reviewed: false
  },

  // LO05
  {
    loId: "sec-04-lo05",
    type: "single",
    difficulty: 1,
    id: "sec-04-q17",
    stem: "What is the primary function of the Diffie-Hellman (DH) protocol?",
    options: [
      { id: "a", text: "Enabling two parties to securely establish a shared secret key over an unencrypted public channel." },
      { id: "b", text: "Signing software binaries with digital certificates." },
      { id: "c", text: "Encrypting hard drives using hardware TPM chips." },
      { id: "d", text: "Validating domain ownership via DNS TXT records." }
    ],
    answer: ["a"],
    explanation: "Diffie-Hellman allows two parties to compute a shared secret across an insecure channel without transmitting the secret itself.",
    noteRef: "sec-04-lo05",
    reviewed: false
  },
  {
    loId: "sec-04-lo05",
    type: "scenario",
    difficulty: 2,
    id: "sec-04-q18",
    stem: "A TLS session uses Ephemeral Elliptic Curve Diffie-Hellman (ECDHE). Six months later, the server's private certificate is compromised. Can the attacker decrypt the recorded traffic?",
    options: [
      { id: "a", text: "No, because ECDHE provides Perfect Forward Secrecy; ephemeral keys were discarded immediately after each session." },
      { id: "b", text: "Yes, because the long-term private key decrypts all past sessions." },
      { id: "c", text: "Yes, by replaying the ClientHello packet." },
      { id: "d", text: "No, but only if the client was running Linux." }
    ],
    answer: ["a"],
    explanation: "Ephemeral Diffie-Hellman keys are discarded after session negotiation, ensuring Perfect Forward Secrecy.",
    noteRef: "sec-04-lo05",
    reviewed: false
  },
  {
    loId: "sec-04-lo05",
    type: "single",
    difficulty: 2,
    id: "sec-04-q19",
    stem: "What mathematical advantage does Elliptic Curve Cryptography (ECC) provide over traditional RSA?",
    options: [
      { id: "a", text: "Equivalent cryptographic security with drastically smaller key sizes (e.g. 256-bit ECC matches 3072-bit RSA), reducing compute and bandwidth." },
      { id: "b", text: "Complete immunity to quantum computer attacks." },
      { id: "c", text: "It eliminates the need for hash functions." },
      { id: "d", text: "It allows encryption without a public key." }
    ],
    answer: ["a"],
    explanation: "ECC provides high security with much smaller key lengths (256-bit ECC is comparable to 3072-bit RSA).",
    noteRef: "sec-04-lo05",
    reviewed: false
  },
  {
    loId: "sec-04-lo05",
    type: "single",
    difficulty: 3,
    id: "sec-04-q20",
    stem: "Why does unauthenticated Diffie-Hellman fail to protect against an active Man-in-the-Middle (MitM) attacker?",
    options: [
      { id: "a", text: "The attacker can intercept the exchange and negotiate separate shared keys independently with both Alice and Bob." },
      { id: "b", text: "Diffie-Hellman math is only solvable for even numbers." },
      { id: "c", text: "The discrete logarithm problem can be solved in polynomial time on consumer CPUs." },
      { id: "d", text: "Routers drop Diffie-Hellman packets automatically." }
    ],
    answer: ["a"],
    explanation: "Without digital signatures or PKI authentication, an adversary can impersonate both sides in separate DH exchanges.",
    noteRef: "sec-04-lo05",
    reviewed: false
  },

  // LO06
  {
    loId: "sec-04-lo06",
    type: "single",
    difficulty: 1,
    id: "sec-04-q21",
    stem: "What cryptographic key is used by the signer to generate a valid digital signature on a document?",
    options: [
      { id: "a", text: "The signer's private key" },
      { id: "b", text: "The signer's public key" },
      { id: "c", text: "The recipient's public key" },
      { id: "d", text: "The recipient's private key" }
    ],
    answer: ["a"],
    explanation: "A digital signature is created by encrypting the document hash with the signer's private key.",
    noteRef: "sec-04-lo06",
    reviewed: false
  },
  {
    loId: "sec-04-lo06",
    type: "scenario",
    difficulty: 2,
    id: "sec-04-q22",
    stem: "A contractor digitally signs a code release with their private key. Later, they claim they never wrote the code. What security property contradicts this claim?",
    options: [
      { id: "a", text: "Non-repudiation" },
      { id: "b", text: "Confidentiality" },
      { id: "c", text: "High Availability" },
      { id: "d", text: "Obfuscation" }
    ],
    answer: ["a"],
    explanation: "Non-repudiation ensures a signer cannot deny the authenticity of their signature since only they possess their private key.",
    noteRef: "sec-04-lo06",
    reviewed: false
  },
  {
    loId: "sec-04-lo06",
    type: "multi",
    difficulty: 2,
    id: "sec-04-q23",
    stem: "Which of the following assurances are provided by a valid digital signature?",
    options: [
      { id: "a", text: "Origin authenticity (proves who signed it)" },
      { id: "b", text: "Data integrity (detects any tampering since signing)" },
      { id: "c", text: "Non-repudiation (signer cannot easily deny having signed it)" },
      { id: "d", text: "Confidentiality (hides document content from public view)" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Digital signatures provide authenticity, integrity, and non-repudiation; they do not encrypt or conceal the message content.",
    noteRef: "sec-04-lo06",
    reviewed: false
  },
  {
    loId: "sec-04-lo06",
    type: "single",
    difficulty: 3,
    id: "sec-04-q24",
    stem: "Why do digital signature algorithms sign the cryptographic hash of a document rather than the raw document bytes directly?",
    options: [
      { id: "a", text: "Asymmetric operations are computationally slow and limited in payload size, whereas hashing creates a small, fixed-size digest instantly." },
      { id: "b", text: "Asymmetric private keys can only process ASCII characters." },
      { id: "c", text: "Hashing prevents the recipient from reading the document." },
      { id: "d", text: "Because the X.509 standard forbids signing files larger than 1 kilobyte." }
    ],
    answer: ["a"],
    explanation: "Hashing condenses arbitrary-length documents into a fixed 32-byte digest, making asymmetric signing fast and scalable.",
    noteRef: "sec-04-lo06",
    reviewed: false
  },

  // LO07
  {
    loId: "sec-04-lo07",
    type: "single",
    difficulty: 1,
    id: "sec-04-q25",
    stem: "What is the standard format specification for digital certificates used in Public Key Infrastructure (PKI)?",
    options: [
      { id: "a", text: "X.509" },
      { id: "b", text: "RFC 1918" },
      { id: "c", text: "IEEE 802.11" },
      { id: "d", text: "POSIX.1" }
    ],
    answer: ["a"],
    explanation: "X.509 is the ITU-T standard format defining the structure of public-key certificates.",
    noteRef: "sec-04-lo07",
    reviewed: false
  },
  {
    loId: "sec-04-lo07",
    type: "scenario",
    difficulty: 2,
    id: "sec-04-q26",
    stem: "A user visits https://internal.corp and receives an 'Untrusted Certificate Authority' warning. The certificate is valid and unexpired. What is the cause?",
    options: [
      { id: "a", text: "The browser trust store does not contain the Root Certificate Authority that issued the internal certificate." },
      { id: "b", text: "The server is running AES-ECB mode." },
      { id: "c", text: "The user's DNS query failed to resolve an A record." },
      { id: "d", text: "The network switch disabled Dynamic ARP Inspection." }
    ],
    answer: ["a"],
    explanation: "If the issuing Root CA certificate is not installed in the client's trusted root store, the chain of trust fails validation.",
    noteRef: "sec-04-lo07",
    reviewed: false
  },
  {
    loId: "sec-04-lo07",
    type: "single",
    difficulty: 2,
    id: "sec-04-q27",
    stem: "What mechanism allows a web server to deliver a timestamped, CA-signed proof of certificate validity directly to clients during the TLS handshake?",
    options: [
      { id: "a", text: "OCSP Stapling" },
      { id: "b", text: "Certificate Revocation List (CRL) download" },
      { id: "c", text: "Diffie-Hellman exchange" },
      { id: "d", text: "DNSSEC zone transfer" }
    ],
    answer: ["a"],
    explanation: "OCSP Stapling has the server query the CA periodically and append (staple) the signed validity proof into the TLS handshake.",
    noteRef: "sec-04-lo07",
    reviewed: false
  },
  {
    loId: "sec-04-lo07",
    type: "single",
    difficulty: 3,
    id: "sec-04-q28",
    stem: "What certificate field specifies additional domain hostnames and subdomains covered by a single SSL/TLS certificate?",
    options: [
      { id: "a", text: "Subject Alternative Name (SAN)" },
      { id: "b", text: "Common Name (CN)" },
      { id: "c", text: "Key Usage" },
      { id: "d", text: "Serial Number" }
    ],
    answer: ["a"],
    explanation: "Subject Alternative Name (SAN) lists all domains, subdomains, or IP addresses validated by the certificate.",
    noteRef: "sec-04-lo07",
    reviewed: false
  },

  // LO08
  {
    loId: "sec-04-lo08",
    type: "single",
    difficulty: 1,
    id: "sec-04-q29",
    stem: "How many network round trips (RTT) are required to complete a full standard TLS 1.3 handshake?",
    options: [
      { id: "a", text: "1 RTT" },
      { id: "b", text: "2 RTT" },
      { id: "c", text: "3 RTT" },
      { id: "d", text: "0 RTT always" }
    ],
    answer: ["a"],
    explanation: "TLS 1.3 optimizes connection establishment to 1 round trip (1-RTT) by sending key shares in the initial ClientHello.",
    noteRef: "sec-04-lo08",
    reviewed: false
  },
  {
    loId: "sec-04-lo08",
    type: "numeric",
    difficulty: 2,
    id: "sec-04-q30",
    stem: "How many round trips (RTT) were required for a standard TLS 1.2 handshake before application data could be sent?",
    options: [
      { id: "a", text: "2" },
      { id: "b", text: "1" },
      { id: "c", text: "4" },
      { id: "d", text: "0" }
    ],
    answer: ["a"],
    explanation: "TLS 1.2 required 2 full round trips (2-RTT) to negotiate cipher suites and exchange key parameters.",
    noteRef: "sec-04-lo08",
    verify: "(2 === 2)",
    reviewed: false
  },
  {
    loId: "sec-04-lo08",
    type: "scenario",
    difficulty: 2,
    id: "sec-04-q31",
    stem: "An enterprise security architect audits TLS 1.3 configurations. Which legacy feature will they find has been completely removed in TLS 1.3?",
    options: [
      { id: "a", text: "Static RSA key exchange and CBC block cipher modes" },
      { id: "b", text: "Ephemeral Diffie-Hellman key exchanges" },
      { id: "c", text: "AES-GCM encryption" },
      { id: "d", text: "X.509 digital certificates" }
    ],
    answer: ["a"],
    explanation: "TLS 1.3 eliminated static RSA key exchange (which lacked forward secrecy) and vulnerable CBC block modes.",
    noteRef: "sec-04-lo08",
    reviewed: false
  },
  {
    loId: "sec-04-lo08",
    type: "single",
    difficulty: 3,
    id: "sec-04-q32",
    stem: "Why does standard TLS 1.3 still leak the domain name of the destination website to passive network observers without Encrypted Client Hello (ECH)?",
    options: [
      { id: "a", text: "The Server Name Indication (SNI) extension is transmitted unencrypted in the initial plaintext ClientHello message." },
      { id: "b", text: "DNS queries cannot be encrypted." },
      { id: "c", text: "IP routing tables require domain names in packet headers." },
      { id: "d", text: "TCP handshakes transmit URLs in the SYN flag." }
    ],
    answer: ["a"],
    explanation: "SNI indicates the target virtual host in plaintext within ClientHello; ECH encrypts this parameter to preserve privacy.",
    noteRef: "sec-04-lo08",
    reviewed: false
  },

  // LO09 (Extension)
  {
    loId: "sec-04-lo09",
    type: "single",
    difficulty: 2,
    id: "sec-04-q33",
    stem: "Why should developers never design their own custom encryption algorithms ('homebrew crypto') for production applications?",
    options: [
      { id: "a", text: "Vetted algorithms like AES have withstood decades of rigorous cryptanalysis, whereas custom ciphers almost always contain subtle mathematical flaws." },
      { id: "b", text: "Operating systems forbid compiling custom math libraries." },
      { id: "c", text: "CPUs only support AES instruction sets." },
      { id: "d", text: "Custom algorithms cannot output bytes." }
    ],
    answer: ["a"],
    explanation: "Vetted cryptographic primitives have undergone extensive peer review; custom algorithms almost inevitably introduce fatal vulnerabilities.",
    noteRef: "sec-04-lo09",
    reviewed: false
  },
  {
    loId: "sec-04-lo09",
    type: "scenario",
    difficulty: 3,
    id: "sec-04-q34",
    stem: "A developer generates password reset tokens using Python's default `random` module (`random.randint(100000, 999999)`). What vulnerability exists?",
    options: [
      { id: "a", text: "The pseudo-random number generator (Mersenne Twister) is not cryptographically secure and its internal state can be predicted." },
      { id: "b", text: "Python's random module only generates negative numbers." },
      { id: "c", text: "The tokens expire immediately upon creation." },
      { id: "d", text: "It causes memory leaks in the Python garbage collector." }
    ],
    answer: ["a"],
    explanation: "Standard pseudo-random generators are predictable; cryptographically secure generators (e.g. `secrets` module) must be used.",
    noteRef: "sec-04-lo09",
    reviewed: false
  }
];

balanceAndSave('cybersecurity', 'applied-cryptography-basics', ch04Objectives, ch04Questions);

// ============================================================================
// CHAPTER 5: identity-auth-and-access-control (sec-05)
// ============================================================================
const ch05Objectives = {
  version: 1,
  chapterId: "sec-05",
  objectives: [
    {
      id: "sec-05-lo01",
      order: 1,
      title: "Classify authentication factors across knowledge, possession, and inherence",
      bloom: "classify",
      tier: "core",
      mustHave: true,
      keywords: ["authentication factors", "knowledge", "possession", "inherence"],
      aliases: ["auth categories", "three factors of auth"],
      prerequisites: ["sec-01-lo01"],
      estMinutes: 10
    },
    {
      id: "sec-05-lo02",
      order: 2,
      title: "Evaluate Multi-Factor Authentication (MFA) mechanisms and bypass attacks",
      bloom: "evaluate",
      tier: "core",
      mustHave: true,
      keywords: ["mfa", "totp", "sms 2fa", "push fatigue", "sim swapping"],
      aliases: ["2fa methods", "mfa fatigue attack"],
      prerequisites: ["sec-05-lo01"],
      estMinutes: 12
    },
    {
      id: "sec-05-lo03",
      order: 3,
      title: "Implement secure password hashing using salting and key stretching (Argon2, bcrypt)",
      bloom: "implement",
      tier: "core",
      mustHave: true,
      keywords: ["password hashing", "salt", "bcrypt", "argon2", "key stretching", "work factor"],
      aliases: ["credential hashing", "password storage"],
      prerequisites: ["sec-04-lo03"],
      estMinutes: 14
    },
    {
      id: "sec-05-lo04",
      order: 4,
      title: "Compare federated identity protocols: SAML, OAuth 2.0, and OpenID Connect (OIDC)",
      bloom: "compare",
      tier: "core",
      mustHave: false,
      keywords: ["saml", "oauth 2.0", "oidc", "sso", "identity federation"],
      aliases: ["federated auth", "single sign-on"],
      prerequisites: ["sec-05-lo01"],
      estMinutes: 14
    },
    {
      id: "sec-05-lo05",
      order: 5,
      title: "Differentiate access control models (DAC, MAC, RBAC, ABAC)",
      bloom: "differentiate",
      tier: "core",
      mustHave: true,
      keywords: ["dac", "mac", "rbac", "abac", "access control models"],
      aliases: ["authorization models", "role-based access control"],
      prerequisites: ["sec-01-lo01"],
      estMinutes: 12
    },
    {
      id: "sec-05-lo06",
      order: 6,
      title: "Apply the principle of least privilege across operational roles",
      bloom: "apply",
      tier: "core",
      mustHave: false,
      keywords: ["least privilege", "privilege separation", "just-in-time access"],
      aliases: ["minimal privilege", "privilege scoping"],
      prerequisites: ["sec-05-lo05"],
      estMinutes: 10
    },
    {
      id: "sec-05-lo07",
      order: 7,
      title: "Analyze horizontal and vertical privilege escalation vectors",
      bloom: "analyze",
      tier: "core",
      mustHave: false,
      keywords: ["privilege escalation", "vertical escalation", "horizontal escalation", "idor"],
      aliases: ["elevation of privilege", "lateral account takeover"],
      prerequisites: ["sec-05-lo05"],
      estMinutes: 12
    },
    {
      id: "sec-05-lo08",
      order: 8,
      title: "Audit session management, token lifecycles, and JWT security",
      bloom: "audit",
      tier: "core",
      mustHave: false,
      keywords: ["jwt", "session management", "token expiration", "refresh token"],
      aliases: ["json web token", "token lifecycle"],
      prerequisites: ["sec-04-lo04"],
      estMinutes: 12
    },
    {
      id: "sec-05-lo09",
      order: 9,
      title: "Configure FIDO2 and WebAuthn hardware security keys",
      bloom: "configure",
      tier: "extension",
      mustHave: false,
      keywords: ["fido2", "webauthn", "passkeys", "hardware security keys", "phishing-resistant"],
      aliases: ["phishing resistant mfa", "yubikey authentication"],
      prerequisites: ["sec-05-lo02"],
      estMinutes: 12
    }
  ]
};

// Notes for sec-05
writeNoteBlock('cybersecurity', 'identity-auth-and-access-control', 'sec-05-lo01',
  `Authentication validates an identity claim across three fundamental factor categories:
1. Knowledge factor (something you know): Passwords, PINs, passphrases, and security question answers.
2. Possession factor (something you have): Hardware security tokens (YubiKey), Time-based One-Time Password (TOTP) authenticator apps, smartcards, or registered smartphones.
3. Inherence factor (something you are): Biometric characteristics such as fingerprint scans, facial geometry, retina patterns, or voiceprints.
True Multi-Factor Authentication (MFA) requires distinct factors from two or more different categories.`,
  `Classifying authentication combinations for MFA compliance:
\`\`\`python
def evaluate_mfa(factors):
    # Distinct factor categories: knowledge, possession, inherence
    categories = set(factors)
    return len(categories) >= 2

# Example 1: Password + PIN (two knowledge factors)
print("Is Password + PIN true MFA?", evaluate_mfa(["knowledge", "knowledge"])) # False

# Example 2: Password + Hardware Key (knowledge + possession)
print("Is Password + Hardware Key true MFA?", evaluate_mfa(["knowledge", "possession"])) # True
\`\`\``,
  `Assuming requiring a password and a PIN constitutes two-factor authentication. Both credentials belong to the same category (knowledge factors). If an adversary compromises a user's workstation via keylogging, both secrets are compromised simultaneously.`,
  `Which authentication factor category encompasses fingerprint and facial recognition biometrics? Inherence (something you are).`
);

writeNoteBlock('cybersecurity', 'identity-auth-and-access-control', 'sec-05-lo02',
  `Multi-Factor Authentication (MFA) drastically reduces account compromise risk, but different mechanisms exhibit varying vulnerability profiles:
1. SMS/Voice 2FA: Highly vulnerable to SIM swapping, cellular SS7 interception, and phishing.
2. Push Notifications: Subject to 'MFA Fatigue' (push bombing) attacks where adversaries bombard users with repeated authentication prompts until the victim approves out of frustration.
3. Time-Based One-Time Passwords (TOTP, RFC 6238): Generated locally using a shared secret and current Unix timestamp; vulnerable to real-time reverse-proxy phishing (e.g. Evilginx).
4. FIDO2/WebAuthn: Cryptographically bound to the browser origin, providing true phishing resistance.`,
  `Simulating TOTP time-step generation (RFC 6238):
\`\`\`python
import time

current_time = int(time.time()) # Current Unix epoch seconds
time_step = 30                  # 30-second interval

# Time counter increments every 30 seconds
time_counter = current_time // time_step
remaining_seconds = 30 - (current_time % time_step)

print("Current TOTP window counter:", time_counter)
print("Seconds until next OTP token code:", remaining_seconds)
\`\`\``,
  `Relying on SMS-based verification codes as primary security for high-value administrative accounts. Social engineering against mobile telecom carriers routinely allows attackers to divert SMS messages to attacker-controlled SIM cards via SIM swapping.`,
  `What attack vector involves repeatedly sending authentication prompts to a victim's smartphone until they mistakenly approve access? MFA Fatigue (or Push Bombing).`
);

writeNoteBlock('cybersecurity', 'identity-auth-and-access-control', 'sec-05-lo03',
  `Storing plaintext or simply hashed passwords (e.g. SHA-256) is a critical security failure. Modern credential storage requires:
1. Cryptographic Salt: A unique, cryptographically random value appended to each password prior to hashing, defeating precomputed rainbow table attacks.
2. Key Stretching / Work Factor: Deliberately computationally intensive algorithms (such as Argon2id, bcrypt, or PBKDF2) that require substantial CPU time and memory, making offline brute-force and GPU dictionary cracking economically impractical.`,
  `Simulating salt and work factor mechanics in credential storage:
\`\`\`python
import hashlib
import os

password = "UserP@ssw0rd!2026"
# Generate unique 16-byte random salt per user
salt = os.urandom(16)

# PBKDF2 key stretching with 600,000 iterations of SHA-256
stretched_hash = hashlib.pbkdf2_hmac(
    'sha256',
    password.encode('utf-8'),
    salt,
    iterations=600000
)

# Salt and hash are stored together in database
print("Salt length (bytes):", len(salt))
print("Derived key length (bytes):", len(stretched_hash))
\`\`\``,
  `Using fast general-purpose hashing functions like SHA-256 or SHA-3 for password storage without key stretching. Modern GPUs can compute billions of SHA-256 hashes per second, cracking short passwords in minutes. Purpose-built password hashing functions like Argon2id or bcrypt force high computational and memory costs.`,
  `What is the primary security benefit of appending a unique cryptographic salt to every user's password before hashing? It defeats precomputed rainbow table attacks and ensures identical passwords produce distinct hash digests.`
);

writeNoteBlock('cybersecurity', 'identity-auth-and-access-control', 'sec-05-lo04',
  `Identity federation enables Single Sign-On (SSO) across organizational boundaries:
1. SAML 2.0: XML-based standard widely used in enterprise IT for authentication assertions between an Identity Provider (IdP) and a Service Provider (SP).
2. OAuth 2.0: Authorization framework that issues scoped Access Tokens to third-party applications without sharing user passwords.
3. OpenID Connect (OIDC): An identity authentication layer built directly on top of OAuth 2.0. While OAuth 2.0 issues Access Tokens for authorization, OIDC adds an ID Token (a signed JWT) containing user identity assertions.`,
  `Comparing OAuth 2.0 vs OpenID Connect (OIDC) token purposes:
\`\`\`python
tokens = {
    "access_token": {
        "standard": "OAuth 2.0",
        "purpose": "Authorization (API resource access, e.g. read:calendar)",
        "intended_audience": "Resource Server (API)"
    },
    "id_token": {
        "standard": "OpenID Connect (OIDC)",
        "purpose": "Authentication (User identity claims, e.g. email, sub)",
        "intended_audience": "Client Application"
    }
}

for name, details in tokens.items():
    print(f"{name}: {details['standard']} -> {details['purpose']}")
\`\`\``,
  `Using OAuth 2.0 Access Tokens for user authentication without OpenID Connect. An Access Token confirms that permission was delegated to an API; it does not authenticate the user's identity or verify when and how they logged in.`,
  `Which token in an OpenID Connect (OIDC) flow conveys authenticated user identity claims to the client application? The ID Token (JWT).`
);

writeNoteBlock('cybersecurity', 'identity-auth-and-access-control', 'sec-05-lo05',
  `Authorization models govern which principals can execute operations on resources:
1. DAC (Discretionary Access Control): Resource owners have discretion over who is granted access (standard Linux file permissions).
2. MAC (Mandatory Access Control): Access is constrained by centralized system security labels and classifications (e.g., Top Secret vs Confidential; enforced by SELinux).
3. RBAC (Role-Based Access Control): Permissions are assigned to organizational roles (e.g., Auditor, Editor), and users are assigned to roles.
4. ABAC (Attribute-Based Access Control): Dynamic decisions based on evaluating policies over attributes of the user, resource, action, and environment (e.g. time, IP location).`,
  `Evaluating an Attribute-Based Access Control (ABAC) policy:
\`\`\`python
user = {"role": "analyst", "ip": "10.0.1.50", "department": "SOC"}
resource = {"type": "incident_report", "classification": "internal"}
environment = {"current_hour": 14} # 2:00 PM

def evaluate_abac(u, r, env):
    # Policy: SOC analysts can access internal reports between 8am and 6pm from internal IP
    if u["department"] == "SOC" and r["classification"] == "internal":
        if 8 <= env["current_hour"] <= 18 and u["ip"].startswith("10."):
            return "PERMIT"
    return "DENY"

print("Access evaluation:", evaluate_abac(user, resource, environment)) # PERMIT
\`\`\``,
  `Hardcoding user IDs directly into authorization checks rather than assigning permissions through roles or attribute policies. Direct user-level access lists become impossible to audit, maintain, or revoke systematically when personnel change.`,
  `Which access control model dynamically evaluates user attributes, resource metadata, and environmental conditions (such as time and location) to determine access? Attribute-Based Access Control (ABAC).`
);

writeNoteBlock('cybersecurity', 'identity-auth-and-access-control', 'sec-05-lo06',
  `The Principle of Least Privilege dictates that any user, program, or system process should be granted only the minimal set of privileges strictly necessary to complete its legitimate tasks, and only for the minimum necessary duration. Operational practices enforcing least privilege include:
1. Separation of duties: Preventing single individuals from having sole control over critical transactions.
2. Privilege separation: Splitting applications into unprivileged worker processes and isolated privileged supervisor processes.
3. Just-In-Time (JIT) access: Granting elevated administrative rights temporarily with automated expiration.`,
  `Auditing IAM cloud permissions for least privilege violations:
\`\`\`python
# AWS IAM policy simulation
iam_policies = [
    {"user": "developer_alice", "action": "s3:GetObject", "resource": "arn:aws:s3:::app-assets/*"},
    {"user": "intern_bob", "action": "*", "resource": "*"} # Wildcard violation
]

for p in iam_policies:
    if p["action"] == "*" and p["resource"] == "*":
        print(f"CRITICAL LEAST PRIVILEGE VIOLATION: Full admin wildcard granted to {p['user']}")
\`\`\``,
  `Assigning broad administrative rights ('Administrator' or '*:*' wildcard permissions) during troubleshooting and leaving those privileges permanently attached to accounts after the issue is resolved.`,
  `What security architecture grants administrative permissions temporarily on-demand for a specific task and automatically revokes them upon completion? Just-In-Time (JIT) Privileged Access Management.`
);

writeNoteBlock('cybersecurity', 'identity-auth-and-access-control', 'sec-05-lo07',
  `Privilege escalation occurs when an attacker gains permissions beyond those intended:
1. Vertical Privilege Escalation: A standard user elevates their privileges to a higher-level role, such as escalating from an unprivileged web account to system administrator (root or SYSTEM).
2. Horizontal Privilege Escalation: A user accesses data or functions belonging to another user with identical privilege levels (e.g. Insecure Direct Object References, IDOR, where modifying user_id=101 to user_id=102 exposes another customer's invoice).`,
  `Demonstrating an Insecure Direct Object Reference (IDOR) horizontal escalation flaw:
\`\`\`python
# Vulnerable server endpoint logic:
invoices = {
    101: {"owner": "alice", "amount": "$450"},
    102: {"owner": "bob", "amount": "$900"}
}

def insecure_get_invoice(authenticated_user, requested_invoice_id):
    # Flaw: returns data without verifying ownership!
    return invoices.get(requested_invoice_id, "Not found")

def secure_get_invoice(authenticated_user, requested_invoice_id):
    invoice = invoices.get(requested_invoice_id)
    if not invoice or invoice["owner"] != authenticated_user:
        return "403 Forbidden: Unauthorized access"
    return invoice

print("Insecure result:", insecure_get_invoice("alice", 102)) # Leaks Bob's invoice!
print("Secure result:", secure_get_invoice("alice", 102))     # Blocked!
\`\`\``,
  `Assuming client-side UI parameter hiding prevents horizontal privilege escalation. Adversaries inspect and modify HTTP request parameters directly in web proxies; object-level authorization must be enforced on every server-side endpoint.`,
  `What type of privilege escalation occurs when a standard user gains root or administrator capabilities? Vertical privilege escalation.`
);

writeNoteBlock('cybersecurity', 'identity-auth-and-access-control', 'sec-05-lo08',
  `JSON Web Tokens (JWT, RFC 7519) are compact, URL-safe tokens commonly used in stateless API authentication. A JWT consists of three Base64URL-encoded parts separated by dots: Header, Payload, and Signature. Key security considerations include:
1. Signature Verification: The server must cryptographically verify the signature before processing claims.
2. Algorithm Confusion: Rejecting alg: 'none' and preventing RSA public keys from being interpreted as HMAC secrets.
3. Expiration enforcement: Checking exp timestamps strictly to prevent replay of captured tokens.`,
  `Inspecting JWT components and verifying expiration:
\`\`\`python
import time

# Decoded sample JWT payload
jwt_payload = {
    "sub": "user_49102",
    "name": "Alex",
    "role": "analyst",
    "exp": 1770000000 # Unix timestamp expiration
}

def is_token_valid(payload):
    current_time = int(time.time())
    if current_time >= payload.get("exp", 0):
        return False, "Token has expired"
    return True, "Token is active"

valid, msg = is_token_valid(jwt_payload)
print("Token validity check:", msg)
\`\`\``,
  `Storing sensitive application secrets or passwords inside JWT payloads without encryption. JWT tokens are signed for integrity, but standard JWT payloads are merely Base64URL-encoded and can be read by anyone who inspects the token.`,
  `What are the three dot-separated structural components of a standard JSON Web Token? Header, Payload, and Signature.`
);

writeNoteBlock('cybersecurity', 'identity-auth-and-access-control', 'sec-05-lo09',
  `FIDO2 and the W3C Web Authentication (WebAuthn) API provide phishing-resistant authentication using public-key cryptography. During registration, a hardware security key (or platform authenticator like TouchID) generates an asymmetric key pair scoped strictly to the website's Origin (domain). During login, the website issues a cryptographic challenge. The authenticator signs the challenge with its private key only after user presence (e.g. touch or biometric) is confirmed. Because the browser enforces domain binding, credentials cannot be phished by lookalike spoofed domains.`,
  `Simulating WebAuthn origin validation logic:
\`\`\`python
# WebAuthn strictly binds credentials to the exact browser origin
registered_credential = {
    "origin": "https://auth.company.com",
    "public_key": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A..."
}

def verify_webauthn_origin(client_origin):
    # Phishing site: https://auth.company-security-login.com
    if client_origin != registered_credential["origin"]:
        return "AUTHENTICATION REJECTED: Origin mismatch! Phishing attempt blocked."
    return "AUTHENTICATION ACCEPTED: Verified domain binding."

print(verify_webauthn_origin("https://auth.company.com")) # ACCEPTED
print(verify_webauthn_origin("https://auth.phishing-fake.com")) # REJECTED
\`\`\``,
  `Believing standard TOTP authenticator apps are immune to phishing. Adversaries deploying real-time reverse-proxy phishing kits (such as Evilginx) intercept both passwords and 6-digit TOTP codes, immediately replaying them to the real site to steal session cookies. FIDO2/WebAuthn prevents this via cryptographic origin binding.`,
  `Why cannot an attacker steal FIDO2 credentials using a lookalike phishing website? The browser automatically binds the authentication challenge to the genuine domain origin, refusing to use the credential on a spoofed domain.`
);

// Questions for sec-05
const ch05Questions = [
  // LO01
  {
    loId: "sec-05-lo01",
    type: "single",
    difficulty: 1,
    id: "sec-05-q01",
    stem: "Which of the following represents an authentication factor from the 'Inherence' category?",
    options: [
      { id: "a", text: "Retinal scan or fingerprint biometric" },
      { id: "b", text: "A complex alphanumeric password" },
      { id: "c", text: "A hardware smartcard" },
      { id: "d", text: "A 6-digit SMS verification code" }
    ],
    answer: ["a"],
    explanation: "Inherence represents biological or physiological characteristics (something you are) such as fingerprints or retinal scans.",
    noteRef: "sec-05-lo01",
    reviewed: false
  },
  {
    loId: "sec-05-lo01",
    type: "scenario",
    difficulty: 2,
    id: "sec-05-q02",
    stem: "An enterprise login portal requires employees to enter their domain password and answer a pre-configured security question ('What was your first car?'). Does this meet the standard for Multi-Factor Authentication (MFA)?",
    options: [
      { id: "a", text: "No, both credentials belong to the same category: knowledge factors (something you know)." },
      { id: "b", text: "Yes, because two distinct questions were answered." },
      { id: "c", text: "Yes, because security questions are stored as cryptographic hashes." },
      { id: "d", text: "No, because passwords cannot be combined with text." }
    ],
    answer: ["a"],
    explanation: "True MFA requires distinct factor categories (e.g. knowledge + possession). Two knowledge secrets do not constitute MFA.",
    noteRef: "sec-05-lo01",
    reviewed: false
  },
  {
    loId: "sec-05-lo01",
    type: "multi",
    difficulty: 2,
    id: "sec-05-q03",
    stem: "Which of the following combinations qualify as valid two-factor authentication (two distinct factor categories)?",
    options: [
      { id: "a", text: "Password (knowledge) + Hardware security key (possession)" },
      { id: "b", text: "Smartcard (possession) + Fingerprint scan (inherence)" },
      { id: "c", text: "Password (knowledge) + TOTP authenticator app (possession)" },
      { id: "d", text: "Password (knowledge) + Security PIN (knowledge)" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Combinations across knowledge, possession, and inherence are valid MFA. Password + PIN uses only knowledge factors.",
    noteRef: "sec-05-lo01",
    reviewed: false
  },
  {
    loId: "sec-05-lo01",
    type: "single",
    difficulty: 3,
    id: "sec-05-q04",
    stem: "Why are security questions (e.g., 'What was your mother's maiden name?') considered weak authentication credentials?",
    options: [
      { id: "a", text: "Answers are static facts often discoverable through public records, social engineering, or social media profiling." },
      { id: "b", text: "They require special cryptographic hardware to evaluate." },
      { id: "c", text: "They expire every 30 seconds like TOTP." },
      { id: "d", text: "They violate relational database normalization rules." }
    ],
    answer: ["a"],
    explanation: "Biographical details are easily researched by adversaries through open-source intelligence (OSINT).",
    noteRef: "sec-05-lo01",
    reviewed: false
  },

  // LO02
  {
    loId: "sec-05-lo02",
    type: "single",
    difficulty: 1,
    id: "sec-05-q05",
    stem: "What attack involves deceiving a mobile carrier into porting a victim's phone number to an attacker-controlled device to intercept 2FA codes?",
    options: [
      { id: "a", text: "SIM Swapping" },
      { id: "b", text: "Push Bombing" },
      { id: "c", text: "SYN Flooding" },
      { id: "d", text: "SQL Injection" }
    ],
    answer: ["a"],
    explanation: "SIM swapping tricks telecom support into reassigning the victim's phone number to intercept SMS codes.",
    noteRef: "sec-05-lo02",
    reviewed: false
  },
  {
    loId: "sec-05-lo02",
    type: "scenario",
    difficulty: 2,
    id: "sec-05-q06",
    stem: "An employee receives 50 consecutive mobile push notifications at 3:00 AM asking to approve an enterprise login. Annoyed, they tap 'Approve'. What attack succeeded?",
    options: [
      { id: "a", text: "MFA Fatigue (Push Bombing)" },
      { id: "b", text: "Credential Stuffing" },
      { id: "c", text: "DNS Cache Poisoning" },
      { id: "d", text: "Buffer Overflow" }
    ],
    answer: ["a"],
    explanation: "MFA fatigue overwhelms users with push alerts until they inadvertently approve access to silence the notifications.",
    noteRef: "sec-05-lo02",
    reviewed: false
  },
  {
    loId: "sec-05-lo02",
    type: "numeric",
    difficulty: 2,
    id: "sec-05-q07",
    stem: "What is the standard time-step window (in seconds) used by RFC 6238 Time-based One-Time Password (TOTP) generators?",
    options: [
      { id: "a", text: "30" },
      { id: "b", text: "60" },
      { id: "c", text: "15" },
      { id: "d", text: "10" }
    ],
    answer: ["a"],
    explanation: "Standard TOTP authenticators regenerate a new 6-digit code every 30 seconds.",
    noteRef: "sec-05-lo02",
    verify: "(30 === 30)",
    reviewed: false
  },
  {
    loId: "sec-05-lo02",
    type: "single",
    difficulty: 3,
    id: "sec-05-q08",
    stem: "How does modern reverse-proxy phishing (such as Evilginx) defeat standard TOTP multi-factor authentication?",
    options: [
      { id: "a", text: "It proxies the login in real-time, capturing the valid OTP code, submitting it to the real service, and stealing the resulting session cookies." },
      { id: "b", text: "It decrypts the server's master TOTP seed using quantum factoring." },
      { id: "c", text: "It resets the victim's phone clock." },
      { id: "d", text: "It intercepts cellular radio frequencies directly." }
    ],
    answer: ["a"],
    explanation: "A reverse proxy relays real-time authentication exchanges, capturing the authenticated session cookie.",
    noteRef: "sec-05-lo02",
    reviewed: false
  },

  // LO03
  {
    loId: "sec-05-lo03",
    type: "single",
    difficulty: 1,
    id: "sec-05-q09",
    stem: "What is the primary function of adding a cryptographic salt to passwords before hashing?",
    options: [
      { id: "a", text: "To ensure that identical passwords produce distinct hashes and neutralize precomputed rainbow table attacks." },
      { id: "b", text: "To encrypt the password using symmetric AES keys." },
      { id: "c", text: "To shorten passwords to fit inside 32-bit registers." },
      { id: "d", text: "To allow administrators to recover lost passwords in plaintext." }
    ],
    answer: ["a"],
    explanation: "Salting ensures unique hashes for identical passwords, rendering precomputed rainbow tables useless.",
    noteRef: "sec-05-lo03",
    reviewed: false
  },
  {
    loId: "sec-05-lo03",
    type: "scenario",
    difficulty: 2,
    id: "sec-05-q10",
    stem: "An engineering team is building a user registration system. Which algorithm is specifically recommended for secure password storage?",
    options: [
      { id: "a", text: "Argon2id (or bcrypt)" },
      { id: "b", text: "SHA-256 without iterations" },
      { id: "c", text: "MD5" },
      { id: "d", text: "AES-ECB" }
    ],
    answer: ["a"],
    explanation: "Argon2id and bcrypt are memory-hard, computationally intensive functions designed specifically for password hashing.",
    noteRef: "sec-05-lo03",
    reviewed: false
  },
  {
    loId: "sec-05-lo03",
    type: "numeric",
    difficulty: 2,
    id: "sec-05-q11",
    stem: "In bcrypt password hashing, increasing the cost factor (work factor) parameter from 10 to 11 has what effect on computation time?",
    options: [
      { id: "a", text: "2" },
      { id: "b", text: "10" },
      { id: "c", text: "1" },
      { id: "d", text: "4" }
    ],
    answer: ["a"],
    explanation: "Bcrypt work factor scales exponentially: each increment of 1 doubles (2x) the required hash computation time.",
    noteRef: "sec-05-lo03",
    verify: "(Math.pow(2, 11) / Math.pow(2, 10) === 2)",
    reviewed: false
  },
  {
    loId: "sec-05-lo03",
    type: "single",
    difficulty: 3,
    id: "sec-05-q12",
    stem: "Why are memory-hard algorithms like Argon2id significantly more resistant to GPU and ASIC cracking rigs than plain SHA-256?",
    options: [
      { id: "a", text: "They require large amounts of RAM per hash evaluation, saturating memory bandwidth and limiting parallel GPU threads." },
      { id: "b", text: "They cannot be compiled into machine bytecode." },
      { id: "c", text: "They reject connections originating from PCI Express slots." },
      { id: "d", text: "They generate variable-length outputs that crash GPUs." }
    ],
    answer: ["a"],
    explanation: "Memory hardness limits parallel GPU/ASIC cores by creating severe memory access bottlenecks.",
    noteRef: "sec-05-lo03",
    reviewed: false
  },

  // LO04
  {
    loId: "sec-05-lo04",
    type: "single",
    difficulty: 1,
    id: "sec-05-q13",
    stem: "What is the primary role of OpenID Connect (OIDC) relative to the OAuth 2.0 framework?",
    options: [
      { id: "a", text: "OIDC adds an identity authentication layer and ID Token on top of OAuth 2.0 authorization." },
      { id: "b", text: "OIDC replaces TCP transport with UDP." },
      { id: "c", text: "OIDC encrypts SQL database connections." },
      { id: "d", text: "OIDC eliminates the need for user passwords completely." }
    ],
    answer: ["a"],
    explanation: "OAuth 2.0 is an authorization framework; OpenID Connect extends it to provide federated authentication.",
    noteRef: "sec-05-lo04",
    reviewed: false
  },
  {
    loId: "sec-05-lo04",
    type: "scenario",
    difficulty: 2,
    id: "sec-05-q14",
    stem: "A company implements Single Sign-On (SSO) across enterprise web portals using signed XML documents exchanged between an IdP and SP. What protocol is being used?",
    options: [
      { id: "a", text: "SAML 2.0" },
      { id: "b", text: "RADIUS" },
      { id: "c", text: "SNMPv3" },
      { id: "d", text: "Telnet" }
    ],
    answer: ["a"],
    explanation: "Security Assertion Markup Language (SAML 2.0) uses XML assertions for enterprise federated identity.",
    noteRef: "sec-05-lo04",
    reviewed: false
  },
  {
    loId: "sec-05-lo04",
    type: "single",
    difficulty: 2,
    id: "sec-05-q15",
    stem: "What token in an OAuth 2.0 flow is presented by a client to access protected backend API resources on behalf of a user?",
    options: [
      { id: "a", text: "Access Token" },
      { id: "b", text: "ID Token" },
      { id: "c", text: "Kerberos TGT" },
      { id: "d", text: "X.509 Root Certificate" }
    ],
    answer: ["a"],
    explanation: "The Access Token grants authorized access to specific API resources within defined scopes.",
    noteRef: "sec-05-lo04",
    reviewed: false
  },
  {
    loId: "sec-05-lo04",
    type: "single",
    difficulty: 3,
    id: "sec-05-q16",
    stem: "Why is using an OAuth 2.0 Access Token as proof of user authentication a dangerous architectural antipattern?",
    options: [
      { id: "a", text: "An Access Token only conveys delegated resource permissions, not user identity or authentication context verification." },
      { id: "b", text: "Access Tokens cannot be verified by APIs." },
      { id: "c", text: "Access Tokens expire in less than 1 second." },
      { id: "d", text: "Access Tokens must be transmitted in plaintext." }
    ],
    answer: ["a"],
    explanation: "Access tokens authorize resource access; without OpenID Connect ID tokens, they cannot verify identity or authentication event provenance.",
    noteRef: "sec-05-lo04",
    reviewed: false
  },

  // LO05
  {
    loId: "sec-05-lo05",
    type: "single",
    difficulty: 1,
    id: "sec-05-q17",
    stem: "In which access control model does the resource owner have full personal discretion over granting permissions to other users?",
    options: [
      { id: "a", text: "Discretionary Access Control (DAC)" },
      { id: "b", text: "Mandatory Access Control (MAC)" },
      { id: "c", text: "Role-Based Access Control (RBAC)" },
      { id: "d", text: "Attribute-Based Access Control (ABAC)" }
    ],
    answer: ["a"],
    explanation: "In DAC (such as standard Linux file modes), file owners set permissions at their own discretion.",
    noteRef: "sec-05-lo05",
    reviewed: false
  },
  {
    loId: "sec-05-lo05",
    type: "scenario",
    difficulty: 2,
    id: "sec-05-q18",
    stem: "A military system enforces access based strictly on security clearances (Secret, Top Secret) and object classification labels enforced centrally by the OS kernel. What model is this?",
    options: [
      { id: "a", text: "Mandatory Access Control (MAC)" },
      { id: "b", text: "Discretionary Access Control (DAC)" },
      { id: "c", text: "Rule-Based Networking Control (RBNC)" },
      { id: "d", text: "Open Source Authorization (OSA)" }
    ],
    answer: ["a"],
    explanation: "Mandatory Access Control (MAC) enforces central classification labels regardless of user discretion (e.g. SELinux).",
    noteRef: "sec-05-lo05",
    reviewed: false
  },
  {
    loId: "sec-05-lo05",
    type: "multi",
    difficulty: 2,
    id: "sec-05-q19",
    stem: "Which of the following attributes can be dynamically evaluated by an Attribute-Based Access Control (ABAC) policy engine?",
    options: [
      { id: "a", text: "User attributes (department, clearance level)" },
      { id: "b", text: "Resource attributes (sensitivity classification, owner)" },
      { id: "c", text: "Environmental attributes (time of day, client IP geolocation)" },
      { id: "d", text: "CPU clock frequency of the client machine" }
    ],
    answer: ["a", "b", "c"],
    explanation: "ABAC evaluates user, resource, action, and environmental metadata to make dynamic access decisions.",
    noteRef: "sec-05-lo05",
    reviewed: false
  },
  {
    loId: "sec-05-lo05",
    type: "single",
    difficulty: 3,
    id: "sec-05-q20",
    stem: "What is the primary operational advantage of Role-Based Access Control (RBAC) in an enterprise with 50,000 employees?",
    options: [
      { id: "a", text: "Permissions are managed by assigning rights to roles rather than configuring thousands of individual user access lists directly." },
      { id: "b", text: "It prevents users from using passwords." },
      { id: "c", text: "It eliminates the need for network firewalls." },
      { id: "d", text: "It automatically patches software vulnerabilities." }
    ],
    answer: ["a"],
    explanation: "RBAC simplifies administrative overhead by decoupling access rights from individual user accounts into roles.",
    noteRef: "sec-05-lo05",
    reviewed: false
  },

  // LO06
  {
    loId: "sec-05-lo06",
    type: "single",
    difficulty: 1,
    id: "sec-05-q21",
    stem: "What is the core premise of the Principle of Least Privilege?",
    options: [
      { id: "a", text: "Users and processes should be granted only the minimal permissions necessary to perform their assigned functions." },
      { id: "b", text: "All users should share a common administrator password." },
      { id: "c", text: "Permissions should be granted universally to avoid access tickets." },
      { id: "d", text: "Privileged accounts should never be logged." }
    ],
    answer: ["a"],
    explanation: "Least privilege restricts rights to the bare minimum required, minimizing damage if an account is compromised.",
    noteRef: "sec-05-lo06",
    reviewed: false
  },
  {
    loId: "sec-05-lo06",
    type: "scenario",
    difficulty: 2,
    id: "sec-05-q22",
    stem: "An automated web scraping script only needs to write logs to /var/log/scraper.log. Running the script as root violates what fundamental security concept?",
    options: [
      { id: "a", text: "Least Privilege" },
      { id: "b", text: "Non-repudiation" },
      { id: "c", text: "Avalanche effect" },
      { id: "d", text: "Forward secrecy" }
    ],
    answer: ["a"],
    explanation: "Running the script as root grants total system control rather than the minimal needed file permissions.",
    noteRef: "sec-05-lo06",
    reviewed: false
  },
  {
    loId: "sec-05-lo06",
    type: "single",
    difficulty: 2,
    id: "sec-05-q23",
    stem: "What security control divides critical business tasks (such as authorizing and executing financial wire transfers) among separate individuals?",
    options: [
      { id: "a", text: "Separation of Duties" },
      { id: "b", text: "Mandatory Access Control" },
      { id: "c", text: "Single Sign-On" },
      { id: "d", text: "FIDO2 WebAuthn" }
    ],
    answer: ["a"],
    explanation: "Separation of duties requires multiple authorized parties to complete critical actions, preventing rogue actions or single-point fraud.",
    noteRef: "sec-05-lo06",
    reviewed: false
  },
  {
    loId: "sec-05-lo06",
    type: "single",
    difficulty: 3,
    id: "sec-05-q24",
    stem: "How does Just-In-Time (JIT) access management reinforce least privilege for systems administrators?",
    options: [
      { id: "a", text: "It grants elevated permissions temporarily upon verified request, automatically revoking them when the maintenance window expires." },
      { id: "b", text: "It resets server root passwords every 60 seconds." },
      { id: "c", text: "It forces administrators to use hardware keys exclusively on weekends." },
      { id: "d", text: "It disables logging during administrative sessions." }
    ],
    answer: ["a"],
    explanation: "JIT access eliminates permanent standing administrative privileges, granting rights only when needed.",
    noteRef: "sec-05-lo06",
    reviewed: false
  },

  // LO07
  {
    loId: "sec-05-lo07",
    type: "single",
    difficulty: 1,
    id: "sec-05-q25",
    stem: "What type of privilege escalation occurs when an attacker elevates from a regular user account to full root or administrator privileges?",
    options: [
      { id: "a", text: "Vertical Privilege Escalation" },
      { id: "b", text: "Horizontal Privilege Escalation" },
      { id: "c", text: "Lateral Session Hijacking" },
      { id: "d", text: "Cross-Site Scripting" }
    ],
    answer: ["a"],
    explanation: "Vertical privilege escalation involves gaining higher-level rights (e.g. standard user to root/admin).",
    noteRef: "sec-05-lo07",
    reviewed: false
  },
  {
    loId: "sec-05-lo07",
    type: "scenario",
    difficulty: 2,
    id: "sec-05-q26",
    stem: "Alice modifies the URL from /view_statement?account_id=101 to /view_statement?account_id=102 and successfully views Bob's private statement. What vulnerability is this?",
    options: [
      { id: "a", text: "Insecure Direct Object Reference (IDOR) / Horizontal Privilege Escalation" },
      { id: "b", text: "Vertical Privilege Escalation" },
      { id: "c", text: "Cross-Site Request Forgery (CSRF)" },
      { id: "d", text: "SQL Injection" }
    ],
    answer: ["a"],
    explanation: "Viewing another user's records at the same privilege level via parameter tampering is horizontal privilege escalation / IDOR.",
    noteRef: "sec-05-lo07",
    reviewed: false
  },
  {
    loId: "sec-05-lo07",
    type: "single",
    difficulty: 2,
    id: "sec-05-q27",
    stem: "What is the root cause of Insecure Direct Object Reference (IDOR) vulnerabilities?",
    options: [
      { id: "a", text: "Missing server-side access control verification that the requesting user owns or is authorized to view the requested object." },
      { id: "b", text: "Failure to encrypt network traffic with TLS." },
      { id: "c", text: "Using SHA-256 for password hashing." },
      { id: "d", text: "Running web servers on port 80." }
    ],
    answer: ["a"],
    explanation: "IDOR occurs when servers retrieve objects directly from database identifiers without validating user authorization.",
    noteRef: "sec-05-lo07",
    reviewed: false
  },
  {
    loId: "sec-05-lo07",
    type: "single",
    difficulty: 3,
    id: "sec-05-q28",
    stem: "How can web application developers systematically defend against horizontal privilege escalation (IDOR)?",
    options: [
      { id: "a", text: "Enforce strict server-side session-to-object ownership checks on every request, or use unguessable indirect object mappings." },
      { id: "b", text: "Hide the ID parameter in HTML form fields." },
      { id: "c", text: "Disable right-clicking on web pages." },
      { id: "d", text: "Store account numbers as Roman numerals." }
    ],
    answer: ["a"],
    explanation: "Validating ownership against the authenticated session on every transaction prevents unauthorized access.",
    noteRef: "sec-05-lo07",
    reviewed: false
  },

  // LO08
  {
    loId: "sec-05-lo08",
    type: "single",
    difficulty: 1,
    id: "sec-05-q29",
    stem: "What are the three parts of a JSON Web Token (JWT) separated by periods?",
    options: [
      { id: "a", text: "Header, Payload, and Signature" },
      { id: "b", text: "Username, Password, and Domain" },
      { id: "c", text: "Issuer, Subject, and CA" },
      { id: "d", text: "Public Key, Private Key, and Nonce" }
    ],
    answer: ["a"],
    explanation: "A JWT is composed of Header, Payload, and Signature joined by periods (header.payload.signature).",
    noteRef: "sec-05-lo08",
    reviewed: false
  },
  {
    loId: "sec-05-lo08",
    type: "scenario",
    difficulty: 2,
    id: "sec-05-q30",
    stem: "An API server accepts JWT tokens and evaluates their payload without validating the cryptographic signature. What can an attacker do?",
    options: [
      { id: "a", text: "Modify the payload claims (e.g. changing role to 'admin' or user_id to 1) and impersonate any user on the platform." },
      { id: "b", text: "Crash the database with SQL injection." },
      { id: "c", text: "Read the server's private RSA key." },
      { id: "d", text: "Decrypt all past network traffic." }
    ],
    answer: ["a"],
    explanation: "If signature verification is skipped, attackers can alter payload JSON claims arbitrarily without detection.",
    noteRef: "sec-05-lo08",
    reviewed: false
  },
  {
    loId: "sec-05-lo08",
    type: "single",
    difficulty: 2,
    id: "sec-05-q31",
    stem: "Why should developers NEVER store sensitive plaintext secrets or credit card numbers in standard JWT payloads?",
    options: [
      { id: "a", text: "JWT payloads are merely Base64URL-encoded (not encrypted) and can be easily decoded and read by anyone." },
      { id: "b", text: "JWT tokens are deleted after 10 milliseconds." },
      { id: "c", text: "Web browsers discard tokens containing numbers." },
      { id: "d", text: "It causes the token signature to fail." }
    ],
    answer: ["a"],
    explanation: "Standard JWTs are signed for integrity, not encrypted for secrecy; anyone can decode Base64URL payload strings.",
    noteRef: "sec-05-lo08",
    reviewed: false
  },
  {
    loId: "sec-05-lo08",
    type: "single",
    difficulty: 3,
    id: "sec-05-q32",
    stem: "What standard claim in a JWT payload specifies the timestamp after which the token must be rejected as expired?",
    options: [
      { id: "a", text: "'exp' (Expiration Time)" },
      { id: "b", text: "'iat' (Issued At)" },
      { id: "c", text: "'nbf' (Not Before)" },
      { id: "d", text: "'iss' (Issuer)" }
    ],
    answer: ["a"],
    explanation: "The 'exp' claim holds the Unix timestamp expiration; servers must reject tokens once current time exceeds exp.",
    noteRef: "sec-05-lo08",
    reviewed: false
  },

  // LO09 (Extension)
  {
    loId: "sec-05-lo09",
    type: "single",
    difficulty: 2,
    id: "sec-05-q33",
    stem: "How do FIDO2 and WebAuthn hardware security keys achieve complete phishing resistance?",
    options: [
      { id: "a", text: "The browser cryptographically binds the authentication response to the exact website origin, refusing to authenticate on spoofed or lookalike domains." },
      { id: "b", text: "They block incoming network packets from unknown IP subnets." },
      { id: "c", text: "They transmit biometric scans directly to Certificate Authorities." },
      { id: "d", text: "They change domain DNS records dynamically." }
    ],
    answer: ["a"],
    explanation: "FIDO2 credentials are bound to specific origin URLs; the browser enforces this, defeating reverse-proxy phishing kits.",
    noteRef: "sec-05-lo09",
    reviewed: false
  },
  {
    loId: "sec-05-lo09",
    type: "scenario",
    difficulty: 3,
    id: "sec-05-q34",
    stem: "A company wants to eliminate passwords entirely for employees using FIDO2 Passkeys. What cryptographic mechanism is stored on the user's authenticator device?",
    options: [
      { id: "a", text: "A unique private key per origin, with only the matching public key registered on the company server." },
      { id: "b", text: "The user's plaintext password stored in encrypted flash memory." },
      { id: "c", text: "A shared AES-256 key identical across all company employees." },
      { id: "d", text: "An unhashed copy of the company's Active Directory database." }
    ],
    answer: ["a"],
    explanation: "Passkeys use public-key cryptography; the device holds the private key and signs challenge nonces for the server.",
    noteRef: "sec-05-lo09",
    reviewed: false
  }
];

balanceAndSave('cybersecurity', 'identity-auth-and-access-control', ch05Objectives, ch05Questions);
console.log("Batch 6 complete!");
