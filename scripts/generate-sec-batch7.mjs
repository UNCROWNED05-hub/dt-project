/**
 * scripts/generate-sec-batch7.mjs
 *
 * Generates Batch 7 for Course 2 (Cybersecurity):
 * - Chapter 6: web-application-security-owasp-top-10 (sec-06)
 * - Chapter 7: network-defense-firewalls-and-ids-ips (sec-07)
 */

import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();

function writeNoteBlock(courseSlug, chapterSlug, loId, coreIdea, workedExample, commonMistake, checkYourself, sources = ["lic-05"]) {
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
// CHAPTER 6: web-application-security-owasp-top-10 (sec-06)
// ============================================================================
const ch06Objectives = {
  version: 1,
  chapterId: "sec-06",
  objectives: [
    {
      id: "sec-06-lo01",
      order: 1,
      title: "Explain the OWASP Top 10 web application risk classification",
      bloom: "understand",
      tier: "core",
      mustHave: true,
      keywords: ["owasp top 10", "broken access control", "cryptographic failures", "injection"],
      aliases: ["owasp classification", "web vulnerabilities taxonomy"],
      prerequisites: ["sec-01-lo01"],
      estMinutes: 10
    },
    {
      id: "sec-06-lo02",
      order: 2,
      title: "Mitigate SQL Injection using parameterized queries and prepared statements",
      bloom: "mitigate",
      tier: "core",
      mustHave: true,
      keywords: ["sqli", "prepared statements", "parameterized queries", "input validation"],
      aliases: ["sql injection defense", "sql parameterization"],
      prerequisites: ["sec-06-lo01"],
      estMinutes: 14
    },
    {
      id: "sec-06-lo03",
      order: 3,
      title: "Differentiate Cross-Site Scripting (XSS) variants: Stored, Reflected, and DOM-based",
      bloom: "differentiate",
      tier: "core",
      mustHave: true,
      keywords: ["xss", "stored xss", "reflected xss", "dom xss", "contextual encoding"],
      aliases: ["cross-site scripting", "xss taxonomy"],
      prerequisites: ["sec-06-lo01"],
      estMinutes: 12
    },
    {
      id: "sec-06-lo04",
      order: 4,
      title: "Apply defensive browser protections including Content Security Policy (CSP)",
      bloom: "apply",
      tier: "core",
      mustHave: false,
      keywords: ["csp", "content security policy", "http headers", "x-content-type-options"],
      aliases: ["browser security headers", "csp policy"],
      prerequisites: ["sec-06-lo03"],
      estMinutes: 12
    },
    {
      id: "sec-06-lo05",
      order: 5,
      title: "Prevent Cross-Site Request Forgery (CSRF) using anti-CSRF tokens and SameSite cookies",
      bloom: "prevent",
      tier: "core",
      mustHave: true,
      keywords: ["csrf", "anti-csrf token", "samesite cookie", "synchronizer token"],
      aliases: ["cross-site request forgery", "csrf defense"],
      prerequisites: ["sec-05-lo08"],
      estMinutes: 12
    },
    {
      id: "sec-06-lo06",
      order: 6,
      title: "Analyze Server-Side Request Forgery (SSRF) and cloud metadata exfiltration",
      bloom: "analyze",
      tier: "core",
      mustHave: false,
      keywords: ["ssrf", "cloud metadata", "169.254.169.254", "internal network pivoting"],
      aliases: ["server-side request forgery", "metadata service attack"],
      prerequisites: ["sec-02-lo01"],
      estMinutes: 12
    },
    {
      id: "sec-06-lo07",
      order: 7,
      title: "Mitigate Insecure Direct Object References (IDOR) through server-side access control",
      bloom: "mitigate",
      tier: "core",
      mustHave: false,
      keywords: ["idor", "broken object level authorization", "bola", "access control"],
      aliases: ["object level authorization", "parameter tampering defense"],
      prerequisites: ["sec-05-lo07"],
      estMinutes: 10
    },
    {
      id: "sec-06-lo08",
      order: 8,
      title: "Identify security misconfigurations, default credentials, and verbose error traces",
      bloom: "identify",
      tier: "core",
      mustHave: false,
      keywords: ["security misconfiguration", "default credentials", "stack traces", "directory listing"],
      aliases: ["hardening web servers", "information disclosure"],
      prerequisites: ["sec-06-lo01"],
      estMinutes: 10
    },
    {
      id: "sec-06-lo09",
      order: 9,
      title: "Assess software supply chain risks and vulnerable third-party components (SCA)",
      bloom: "assess",
      tier: "extension",
      mustHave: false,
      keywords: ["supply chain security", "sbom", "sca", "vulnerable components", "cve"],
      aliases: ["software composition analysis", "dependency auditing"],
      prerequisites: ["sec-06-lo01"],
      estMinutes: 12
    }
  ]
};

// Notes for sec-06
writeNoteBlock('cybersecurity', 'web-application-security-owasp-top-10', 'sec-06-lo01',
  `The Open Web Application Security Project (OWASP) Top 10 documents the most critical security risks facing web applications. In the modern standard, Broken Access Control ranks as the number-one threat category, reflecting widespread failures to enforce object and functional authorization. Other premier categories include Cryptographic Failures (protecting data in transit and at rest), Injection (SQL, NoSQL, and command injection), Insecure Design, and Security Misconfiguration. Defenders use the framework to prioritize defensive engineering and code audits.`,
  `Auditing application vulnerabilities against OWASP categories:
\`\`\`python
findings = [
    {"endpoint": "/api/user", "issue": "Missing user ID validation", "category": "A01:Broken Access Control"},
    {"endpoint": "/search", "issue": "Unsanitized user string in raw SQL", "category": "A03:Injection"},
    {"endpoint": "/login", "issue": "Passes password over plaintext HTTP", "category": "A02:Cryptographic Failures"}
]

for f in findings:
    print(f"Risk Tier: {f['category']} -> Endpoint: {f['endpoint']}")
\`\`\``,
  `Treating the OWASP Top 10 as an exhaustive checklist. Web security extends far beyond ten categories; specialized architectures (APIs, microservices, cloud lambdas) have dedicated risk taxonomies (like the OWASP API Security Top 10).`,
  `Which vulnerability category holds the #1 ranking in the contemporary OWASP Top 10? Broken Access Control.`
);

writeNoteBlock('cybersecurity', 'web-application-security-owasp-top-10', 'sec-06-lo02',
  `SQL Injection occurs when untrusted user input is directly concatenated or formatted into a database query string, allowing an attacker to manipulate query syntax and structure. The definitive architectural defense is Parameterized Queries (Prepared Statements). Parameterization sends query structure and user data over distinct channels to the database engine. The database treats input parameters strictly as literal data values, making it syntactically impossible for input to alter query logic regardless of quote characters.`,
  `Contrasting vulnerable string concatenation with parameterized prepared statements:
\`\`\`python
import sqlite3

conn = sqlite3.connect(":memory:")
cursor = conn.cursor()
cursor.execute("CREATE TABLE users (id INT, username TEXT, role TEXT)")
cursor.execute("INSERT INTO users VALUES (1, 'admin', 'administrator')")

# INSECURE VULNERABLE APPROACH:
# user_input = "' OR '1'='1"
# query = f"SELECT * FROM users WHERE username = '{user_input}'"

# DEFENSIVE PARAMETERIZED QUERY:
safe_query = "SELECT * FROM users WHERE username = ?"
user_input = "analyst"
cursor.execute(safe_query, (user_input,))
rows = cursor.fetchall()
print("Parameterized query execution successful, results count:", len(rows))
\`\`\``,
  `Relying on blocklists or regex stripping of quotes (' or --). Attackers routinely bypass simple blacklist filters using alternative encodings, double quotes, null bytes, or alternate SQL keywords. Parameterization is the only complete defense.`,
  `Why do prepared statements neutralize SQL injection? Because the database compiles the SQL query structure before binding user inputs as literal data values.`
);

writeNoteBlock('cybersecurity', 'web-application-security-owasp-top-10', 'sec-06-lo03',
  `Cross-Site Scripting (XSS) occurs when an application includes untrusted user data in an HTTP response without proper context-aware sanitization or encoding:
1. Stored XSS: Malicious script is permanently saved into the database (e.g., in a comment field) and executed whenever other users view the page.
2. Reflected XSS: Payload is embedded in an HTTP request (e.g. search query parameter) and immediately reflected back in the server response.
3. DOM-based XSS: Vulnerability exists entirely client-side, where client JavaScript reads from an untrusted source (location.search) and passes it to an unsafe sink (innerHTML, eval).`,
  `Demonstrating safe context-aware HTML entity encoding in Python:
\`\`\`python
import html

untrusted_input = "<script>alert('xss')</script>"

# Insecure reflection:
# html_page = f"<div>Welcome, {untrusted_input}!</div>"

# Defensive Contextual HTML Encoding:
safe_encoded = html.escape(untrusted_input)
print("Escaped HTML output:", safe_encoded)
# Output: &lt;script&gt;alert(&#x27;xss&#x27;)&lt;/script&gt;
# The browser displays text safely without executing script tags
\`\`\``,
  `Using HTML body encoding inside JavaScript contexts or HTML attributes. Different contexts require distinct escaping rules: HTML body escaping does not prevent script injection inside an inline <script> block or event handler attribute.`,
  `Which XSS variant stores the malicious script payload permanently in the application backend database? Stored (Persistent) XSS.`
);

writeNoteBlock('cybersecurity', 'web-application-security-owasp-top-10', 'sec-06-lo04',
  `Content Security Policy (CSP) is an HTTP response header that restricts the resources (scripts, images, stylesheets, frames) a browser is permitted to load and execute for a given origin. A robust CSP restricts script execution strictly to verified sources or scripts bearing a unique cryptographic nonce (script-src 'self' 'nonce-random123'), while disallowing unsafe inline scripts ('unsafe-inline') and eval() ('unsafe-eval'). Additional headers include X-Content-Type-Options: nosniff to stop MIME-sniffing attacks.`,
  `Constructing a hardened Content Security Policy header:
\`\`\`python
# Defensive CSP Header configuration
csp_directives = [
    "default-src 'self'",
    "script-src 'self' 'nonce-rAnd0mN0nc3Str1ng'",
    "style-src 'self'",
    "object-src 'none'",        # Blocks legacy Flash/Java applets
    "frame-ancestors 'none'",   # Prevents Clickjacking / iframe embedding
    "base-uri 'self'"
]

csp_header = "; ".join(csp_directives)
print("Configured CSP Header:\nContent-Security-Policy:", csp_header)
\`\`\``,
  `Using 'unsafe-inline' in script-src directives. Allowing unsafe inline scripts invalidates the primary defense of CSP against Cross-Site Scripting, enabling injected script tags to execute freely.`,
  `What CSP directive specifies allowed origins for JavaScript code execution? script-src.`
);

writeNoteBlock('cybersecurity', 'web-application-security-owasp-top-10', 'sec-06-lo05',
  `Cross-Site Request Forgery (CSRF) tricks an authenticated victim's browser into submitting unauthorized HTTP state-changing requests to a vulnerable application (e.g., transferring funds or changing an email address). Browsers automatically attach ambient session cookies to cross-site requests. Defenses include:
1. Anti-CSRF Tokens: Cryptographically random, unique tokens embedded in forms that must match server-side session tokens upon submission (Synchronizer Token Pattern).
2. SameSite Cookie Attribute: Setting SameSite=Strict or SameSite=Lax prevents browsers from attaching session cookies to cross-origin requests.`,
  `Evaluating SameSite cookie attributes during session creation:
\`\`\`python
def set_secure_session_cookie(token):
    # Hardened session cookie attributes:
    cookie = (
        f"session_id={token}; "
        "Secure; "        # Only transmit over HTTPS
        "HttpOnly; "      # Prevent JavaScript document.cookie access
        "SameSite=Strict" # Block cross-site request cookie attachment
    )
    return cookie

print("Set-Cookie header:", set_secure_session_cookie("sess_9823412ab"))
\`\`\``,
  `Relying on HTTP GET requests for state-changing actions (e.g. /transfer?amount=1000&to=bob). GET requests can be triggered trivially via simple <img> or <link> tags on external malicious web pages, bypassing many CSRF defenses. State modifications must use POST/PUT with CSRF tokens.`,
  `What cookie attribute instructs the browser not to attach the cookie to cross-site requests, mitigating CSRF? SameSite (Strict or Lax).`
);

writeNoteBlock('cybersecurity', 'web-application-security-owasp-top-10', 'sec-06-lo06',
  `Server-Side Request Forgery (SSRF) occurs when a web application accepts a user-supplied URL and fetches data from it without adequate validation. Adversaries exploit SSRF to coerce the backend server into initiating HTTP requests against internal, loopback (127.0.0.1), or private cloud metadata services. In cloud environments (AWS, GCP, Azure), querying http://169.254.169.254 allows attackers to steal temporary IAM cloud instance credentials. Defenses include strictly whitelisting allowed destination hostnames and enforcing IMDSv2.`,
  `Simulating an SSRF destination URL validation filter:
\`\`\`python
from urllib.parse import urlparse
import ipaddress

def is_safe_url(target_url):
    parsed = urlparse(target_url)
    hostname = parsed.hostname
    if not hostname:
        return False, "Invalid URL"
    
    # Block loopback, link-local metadata (169.254.x.x), and private RFC1918 IPs
    try:
        ip = ipaddress.ip_address(hostname)
        if ip.is_loopback or ip.is_private or ip.is_link_local:
            return False, f"BLOCKED: Target IP {ip} is internal or cloud metadata!"
    except ValueError:
        pass # Domain name resolution check required
        
    return True, "URL allowed for fetching"

print(is_safe_url("http://169.254.169.254/latest/meta-data/")) # BLOCKED
print(is_safe_url("https://api.external-vendor.com/data"))       # Allowed
\`\`\``,
  `Attempting to block internal addresses using basic regex strings like 'localhost'. Adversaries bypass simple keyword checks using alternate encodings such as 127.0.0.1, 0177.0.0.1, 2130706433, or DNS rebinding techniques.`,
  `What standard IPv4 link-local IP address is used by major cloud providers to host instance metadata services? 169.254.169.254.`
);

writeNoteBlock('cybersecurity', 'web-application-security-owasp-top-10', 'sec-06-lo07',
  `Insecure Direct Object References (IDOR), classified under Broken Access Control, occur when applications expose internal database identifiers directly in URL parameters or API bodies (e.g., /api/order/5402) without verifying that the authenticated user possesses authorization to interact with that specific object. Mitigation requires server-side access control checks binding requested records to the user's verified session identity, or using cryptographically random GUIDs/UUIDs paired with authorization checks.`,
  `Implementing server-side object ownership verification:
\`\`\`python
# Mock database order records
orders_db = {
    5401: {"user_id": "usr_alice", "total": "$120.00"},
    5402: {"user_id": "usr_bob", "total": "$350.00"}
}

def retrieve_order(authenticated_user_id, order_id):
    order = orders_db.get(order_id)
    if not order:
        return "404 Not Found"
    
    # Server-side authorization verification
    if order["user_id"] != authenticated_user_id:
        return "403 Forbidden: You do not own this order record"
        
    return f"200 OK: Order details {order['total']}"

print("Alice accessing Alice's order:", retrieve_order("usr_alice", 5401))
print("Alice accessing Bob's order:", retrieve_order("usr_alice", 5402))
\`\`\``,
  `Relying on unguessable UUIDs alone without access control checks. While UUIDs make guessing IDs harder, if an attacker discovers an ID via a leak or network log, the absence of server-side authorization still permits unauthorized access.`,
  `True or False: Replacing sequential integer IDs with UUIDs completely eliminates the need for server-side object authorization checks? False.`
);

writeNoteBlock('cybersecurity', 'web-application-security-owasp-top-10', 'sec-06-lo08',
  `Security Misconfigurations occur when systems are deployed with default accounts, unneeded enabled features, missing security headers, or overly permissive error handling. In production environments, detailed application stack traces (debug mode) leak internal file paths, framework versions, database schemas, and source code excerpts to external users. Hardening requires disabling debug mode, removing sample files, disabling directory listing, and changing vendor default passwords.`,
  `Auditing HTTP security headers for missing configurations:
\`\`\`python
response_headers = {
    "Server": "Apache/2.4.41 (Ubuntu)",
    "Content-Type": "text/html; charset=UTF-8"
}

required_security_headers = [
    "Content-Security-Policy",
    "X-Content-Type-Options",
    "Strict-Transport-Security",
    "X-Frame-Options"
]

missing_headers = [h for h in required_security_headers if h not in response_headers]
print("Misconfiguration alert: Missing security headers:", missing_headers)
\`\`\``,
  `Leaving DEBUG = True in production frameworks (like Django or Flask). When an unexpected exception occurs, the framework outputs an interactive debugger or detailed traceback revealing database connection strings and environment secrets.`,
  `What HTTP security header instructs browsers to strictly communicate with a domain exclusively over HTTPS for a specified duration? Strict-Transport-Security (HSTS).`
);

writeNoteBlock('cybersecurity', 'web-application-security-owasp-top-10', 'sec-06-lo09',
  `Modern web applications incorporate hundreds of open-source third-party dependencies (npm, PyPI, Maven). Vulnerabilities in third-party libraries (such as the Log4j vulnerability) expose applications to remote compromise even if proprietary in-house code is secure. Software Composition Analysis (SCA) tools generate a Software Bill of Materials (SBOM) and continuously audit dependency trees against public Common Vulnerabilities and Exposures (CVE) databases.`,
  `Simulating automated dependency audit logic:
\`\`\`python
# Dependency manifest audit
installed_packages = [
    {"name": "requests", "version": "2.31.0", "known_cves": []},
    {"name": "vulnerable-xml-parser", "version": "1.0.2", "known_cves": ["CVE-2024-9912"]}
]

for pkg in installed_packages:
    if pkg["known_cves"]:
        print(f"SUPPLY CHAIN ALERT: Package {pkg['name']} has critical CVEs: {pkg['known_cves']}")
\`\`\``,
  `Assuming vendor libraries are secure because they were downloaded from official package managers. Package registries routinely suffer from dependency confusion attacks, typo-squatting, and malicious account takeovers.`,
  `What automated tooling analyzes application dependencies to detect known security vulnerabilities and license non-compliance? Software Composition Analysis (SCA).`
);

// Questions for sec-06
const ch06Questions = [
  // LO01
  {
    loId: "sec-06-lo01",
    type: "numeric",
    difficulty: 1,
    id: "sec-06-q01",
    stem: "How many critical risk categories are formally prioritized in the foundational OWASP Top 10 framework?",
    options: [
      { id: "a", text: "10" },
      { id: "b", text: "5" },
      { id: "c", text: "20" },
      { id: "d", text: "100" }
    ],
    answer: ["a"],
    explanation: "The OWASP Top 10 framework specifically curates and ranks the ten most critical web application security risks.",
    noteRef: "sec-06-lo01",
    verify: "(10 === 10)",
    reviewed: false
  },
  {
    loId: "sec-06-lo01",
    type: "scenario",
    difficulty: 2,
    id: "sec-06-q02",
    stem: "An attacker modifies their HTTP request parameter from role=user to role=admin and gains full administrative privileges. Under which OWASP Top 10 category is this classified?",
    options: [
      { id: "a", text: "Broken Access Control" },
      { id: "b", text: "Cryptographic Failures" },
      { id: "c", text: "Security Logging Failures" },
      { id: "d", text: "Server-Side Request Forgery" }
    ],
    answer: ["a"],
    explanation: "Failing to restrict user role elevation is a direct violation of access control policies.",
    noteRef: "sec-06-lo01",
    reviewed: false
  },
  {
    loId: "sec-06-lo01",
    type: "multi",
    difficulty: 2,
    id: "sec-06-q03",
    stem: "Which of the following are primary categories included in the OWASP Top 10?",
    options: [
      { id: "a", text: "Injection" },
      { id: "b", text: "Cryptographic Failures" },
      { id: "c", text: "Security Misconfiguration" },
      { id: "d", text: "Wireless Frequency Jamming" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Injection, Cryptographic Failures, and Security Misconfiguration are standard OWASP Top 10 categories.",
    noteRef: "sec-06-lo01",
    reviewed: false
  },
  {
    loId: "sec-06-lo01",
    type: "single",
    difficulty: 3,
    id: "sec-06-q04",
    stem: "Why does the OWASP Top 10 emphasize 'Insecure Design' as a distinct category separate from implementation flaws?",
    options: [
      { id: "a", text: "Flawed architectural design (e.g. missing threat modeling or business logic controls) cannot be fixed by perfect code implementation alone." },
      { id: "b", text: "Insecure design only applies to graphical UI mockups." },
      { id: "c", text: "It prevents developers from using Python." },
      { id: "d", text: "Design flaws only occur in hardware microchips." }
    ],
    answer: ["a"],
    explanation: "Insecure design represents fundamental architecture omissions that bug fixes cannot remediate without redesign.",
    noteRef: "sec-06-lo01",
    reviewed: false
  },

  // LO02
  {
    loId: "sec-06-lo02",
    type: "single",
    difficulty: 1,
    id: "sec-06-q05",
    stem: "What is the primary architectural defense against SQL Injection vulnerabilities?",
    options: [
      { id: "a", text: "Parameterized queries (prepared statements)" },
      { id: "b", text: "Client-side JavaScript input trimming" },
      { id: "c", text: "Converting SQL databases to CSV files" },
      { id: "d", text: "Disabling database indexing" }
    ],
    answer: ["a"],
    explanation: "Parameterized queries separate SQL code structure from user data, making SQL injection impossible.",
    noteRef: "sec-06-lo02",
    reviewed: false
  },
  {
    loId: "sec-06-lo02",
    type: "scenario",
    difficulty: 2,
    id: "sec-06-q06",
    stem: "A developer filters user inputs by stripping single quotes: input.replace(\"'\", \"\"). Why is this defense insufficient against SQL injection?",
    options: [
      { id: "a", text: "Numeric SQL injection queries do not require quotes (e.g., WHERE id = 1 OR 1=1), and alternate encodings can bypass string stripping." },
      { id: "b", text: "Single quotes are mandatory in all HTTP packets." },
      { id: "c", text: "Databases refuse to process strings without quotes." },
      { id: "d", text: "It causes memory corruption in the SQL parser." }
    ],
    answer: ["a"],
    explanation: "Blocklist sanitization fails because SQL injection can occur without single quotes in numeric contexts.",
    noteRef: "sec-06-lo02",
    reviewed: false
  },
  {
    loId: "sec-06-lo02",
    type: "single",
    difficulty: 2,
    id: "sec-06-q07",
    stem: "What type of SQL injection occurs when an application exhibits no returned data on the screen but shows different response times based on injected SLEEP() commands?",
    options: [
      { id: "a", text: "Time-based Blind SQL Injection" },
      { id: "b", text: "Error-based SQL Injection" },
      { id: "c", text: "UNION-based SQL Injection" },
      { id: "d", text: "Second-order Stored Injection" }
    ],
    answer: ["a"],
    explanation: "Time-based blind SQLi infers truth by measuring delayed database execution pauses.",
    noteRef: "sec-06-lo02",
    reviewed: false
  },
  {
    loId: "sec-06-lo02",
    type: "single",
    difficulty: 3,
    id: "sec-06-q08",
    stem: "Why are Object-Relational Mappers (ORMs) generally effective at preventing SQL injection?",
    options: [
      { id: "a", text: "They generate parameterized prepared statements by default for standard database queries." },
      { id: "b", text: "They compile Python code directly into C++ binaries." },
      { id: "c", text: "They run databases entirely in memory." },
      { id: "d", text: "They convert all input values to uppercase." }
    ],
    answer: ["a"],
    explanation: "Modern ORMs use prepared statements under the hood, protecting developers from manual concatenation errors.",
    noteRef: "sec-06-lo02",
    reviewed: false
  },

  // LO03
  {
    loId: "sec-06-lo03",
    type: "single",
    difficulty: 1,
    id: "sec-06-q09",
    stem: "Which type of Cross-Site Scripting (XSS) permanently saves the malicious payload into the application database?",
    options: [
      { id: "a", text: "Stored (Persistent) XSS" },
      { id: "b", text: "Reflected XSS" },
      { id: "c", text: "DOM-based XSS" },
      { id: "d", text: "Blind SQL Injection" }
    ],
    answer: ["a"],
    explanation: "Stored XSS stores the payload on the server (e.g. in a comment or profile field) to execute against future visitors.",
    noteRef: "sec-06-lo03",
    reviewed: false
  },
  {
    loId: "sec-06-lo03",
    type: "scenario",
    difficulty: 2,
    id: "sec-06-q10",
    stem: "A web app reads parameters from window.location.hash and passes them directly to document.getElementById('output').innerHTML without server involvement. What vulnerability exists?",
    options: [
      { id: "a", text: "DOM-based Cross-Site Scripting (DOM XSS)" },
      { id: "b", text: "Reflected XSS" },
      { id: "c", text: "SQL Injection" },
      { id: "d", text: "Server-Side Request Forgery" }
    ],
    answer: ["a"],
    explanation: "DOM XSS occurs completely within client-side JavaScript when an untrusted source flows into an unsafe execution sink.",
    noteRef: "sec-06-lo03",
    reviewed: false
  },
  {
    loId: "sec-06-lo03",
    type: "single",
    difficulty: 2,
    id: "sec-06-q11",
    stem: "What primary defense prevents Cross-Site Scripting when rendering untrusted user data into an HTML document body?",
    options: [
      { id: "a", text: "Context-aware HTML entity encoding (e.g. converting '<' to '&lt;')" },
      { id: "b", text: "Installing an SSL certificate on the web server" },
      { id: "c", text: "Hashing user input with SHA-256" },
      { id: "d", text: "Encrypting the database disk with BitLocker" }
    ],
    answer: ["a"],
    explanation: "Context-aware encoding ensures characters like < and > are treated as literal printable characters, not executable tags.",
    noteRef: "sec-06-lo03",
    reviewed: false
  },
  {
    loId: "sec-06-lo03",
    type: "single",
    difficulty: 3,
    id: "sec-06-q12",
    stem: "What high-severity impact can an attacker achieve by successfully executing XSS in a victim's authenticated browser session?",
    options: [
      { id: "a", text: "Stealing non-HttpOnly session tokens, capturing keystrokes, and executing unauthorized API actions on the victim's behalf." },
      { id: "b", text: "Formatting the victim's local hard drive." },
      { id: "c", text: "Overwriting BIOS firmware on the web server." },
      { id: "d", text: "Shutting down the cloud provider's data center." }
    ],
    answer: ["a"],
    explanation: "XSS executes arbitrary JavaScript in the victim's browser context, enabling session hijacking and credential theft.",
    noteRef: "sec-06-lo03",
    reviewed: false
  },

  // LO04
  {
    loId: "sec-06-lo04",
    type: "single",
    difficulty: 1,
    id: "sec-06-q13",
    stem: "What HTTP response header restricts which external domains and scripts a browser is allowed to execute?",
    options: [
      { id: "a", text: "Content-Security-Policy (CSP)" },
      { id: "b", text: "Server" },
      { id: "c", text: "Content-Type" },
      { id: "d", text: "Cache-Control" }
    ],
    answer: ["a"],
    explanation: "Content-Security-Policy defines trusted script sources and execution boundaries to mitigate XSS.",
    noteRef: "sec-06-lo04",
    reviewed: false
  },
  {
    loId: "sec-06-lo04",
    type: "scenario",
    difficulty: 2,
    id: "sec-06-q14",
    stem: "An attacker injects `<script>evil()</script>` into a web page, but the browser refuses to execute it because the script tag lacks a cryptographically random nonce. What header blocked this attack?",
    options: [
      { id: "a", text: "Content-Security-Policy with script-src 'nonce-...'" },
      { id: "b", text: "Access-Control-Allow-Origin" },
      { id: "c", text: "Strict-Transport-Security" },
      { id: "d", text: "X-XSS-Protection: 0" }
    ],
    answer: ["a"],
    explanation: "A nonce-based CSP blocks any inline script that does not match the server's per-request cryptographic nonce.",
    noteRef: "sec-06-lo04",
    reviewed: false
  },
  {
    loId: "sec-06-lo04",
    type: "single",
    difficulty: 2,
    id: "sec-06-q15",
    stem: "What HTTP header prevents browsers from MIME-sniffing a response away from the declared content-type (e.g. treating an uploaded image as HTML)?",
    options: [
      { id: "a", text: "X-Content-Type-Options: nosniff" },
      { id: "b", text: "X-Frame-Options: DENY" },
      { id: "c", text: "Allow: GET, POST" },
      { id: "d", text: "Connection: keep-alive" }
    ],
    answer: ["a"],
    explanation: "The `nosniff` header instructs browsers to strictly respect the server's declared MIME type.",
    noteRef: "sec-06-lo04",
    reviewed: false
  },
  {
    loId: "sec-06-lo04",
    type: "single",
    difficulty: 3,
    id: "sec-06-q16",
    stem: "Why does including 'unsafe-inline' in a CSP script-src directive severely weaken its defensive value?",
    options: [
      { id: "a", text: "It allows all inline `<script>` tags and event handlers to execute, enabling classic injected XSS payloads." },
      { id: "b", text: "It disables HTTPS encryption." },
      { id: "c", text: "It forces the browser to download Flash plugins." },
      { id: "d", text: "It causes the CSS styling to fail." }
    ],
    answer: ["a"],
    explanation: "'unsafe-inline' permits inline script tags, dismantling CSP's protection against injected script attacks.",
    noteRef: "sec-06-lo04",
    reviewed: false
  },

  // LO05
  {
    loId: "sec-06-lo05",
    type: "single",
    difficulty: 1,
    id: "sec-06-q17",
    stem: "What is Cross-Site Request Forgery (CSRF)?",
    options: [
      { id: "a", text: "Tricking a victim's authenticated browser into executing unwanted state-changing actions on a trusted web application." },
      { id: "b", text: "Stealing an SSL certificate from a web server." },
      { id: "c", text: "Flooding a network switch with ARP broadcast packets." },
      { id: "d", text: "Injecting SQL commands into a database query." }
    ],
    answer: ["a"],
    explanation: "CSRF exploits ambient session cookies to submit unauthorized transactions from external malicious sites.",
    noteRef: "sec-06-lo05",
    reviewed: false
  },
  {
    loId: "sec-06-lo05",
    type: "scenario",
    difficulty: 2,
    id: "sec-06-q18",
    stem: "A malicious site contains `<img src='https://bank.com/transfer?amount=5000&to=attacker'>`. When a logged-in bank user visits, money is transferred. What defense stops this?",
    options: [
      { id: "a", text: "Requiring anti-CSRF tokens for state-changing requests and setting SameSite=Strict on session cookies." },
      { id: "b", text: "Increasing the web server RAM." },
      { id: "c", text: "Using SHA-256 to hash the user's password." },
      { id: "d", text: "Shortening the domain name." }
    ],
    answer: ["a"],
    explanation: "Anti-CSRF tokens and SameSite cookies block unauthorized cross-site requests from executing actions.",
    noteRef: "sec-06-lo05",
    reviewed: false
  },
  {
    loId: "sec-06-lo05",
    type: "single",
    difficulty: 2,
    id: "sec-06-q19",
    stem: "How does setting the cookie attribute SameSite=Strict defend against CSRF attacks?",
    options: [
      { id: "a", text: "The browser will not send the cookie on any cross-site request originating from an external site." },
      { id: "b", text: "It prevents users from logging in on mobile devices." },
      { id: "c", text: "It encrypts the cookie using RSA-4096." },
      { id: "d", text: "It deletes the cookie after 5 seconds." }
    ],
    answer: ["a"],
    explanation: "SameSite=Strict ensures cookies are only transmitted when the origin in the browser URL matches the cookie domain.",
    noteRef: "sec-06-lo05",
    reviewed: false
  },
  {
    loId: "sec-06-lo05",
    type: "single",
    difficulty: 3,
    id: "sec-06-q20",
    stem: "Why does the Synchronizer Token Pattern successfully block cross-site request forgery?",
    options: [
      { id: "a", text: "The Same-Origin Policy prevents an external malicious website from reading the authentic token embedded in the legitimate application form." },
      { id: "b", text: "Tokens expire after 1 millisecond." },
      { id: "c", text: "Tokens can only be generated by the client's GPU." },
      { id: "d", text: "It requires all web requests to use DNSSEC." }
    ],
    answer: ["a"],
    explanation: "Because attackers cannot read the token from cross-origin origins, they cannot forge requests containing the valid token.",
    noteRef: "sec-06-lo05",
    reviewed: false
  },

  // LO06
  {
    loId: "sec-06-lo06",
    type: "single",
    difficulty: 1,
    id: "sec-06-q21",
    stem: "What is Server-Side Request Forgery (SSRF)?",
    options: [
      { id: "a", text: "A flaw where a vulnerable web server is coerced into making unintended network requests to internal or external systems." },
      { id: "b", text: "An attacker stealing DNS records from a root nameserver." },
      { id: "c", text: "A brute-force dictionary attack against SSH." },
      { id: "d", text: "A corrupted Ethernet cable dropping frames." }
    ],
    answer: ["a"],
    explanation: "SSRF exploits the server's network location and trust to fetch unauthorized resources from internal networks or services.",
    noteRef: "sec-06-lo06",
    reviewed: false
  },
  {
    loId: "sec-06-lo06",
    type: "scenario",
    difficulty: 2,
    id: "sec-06-q22",
    stem: "An attacker exploits an SSRF vulnerability on an AWS-hosted web app to query `http://169.254.169.254/latest/meta-data/`. What high-value data is targeted?",
    options: [
      { id: "a", text: "Temporary IAM cloud role credentials and API secret access keys." },
      { id: "b", text: "The physical serial number of the data center rack." },
      { id: "c", text: "The client's credit card CVV number." },
      { id: "d", text: "The Linux kernel source code." }
    ],
    answer: ["a"],
    explanation: "The cloud metadata IP (169.254.169.254) issues temporary IAM role credentials that can grant access to cloud infrastructure.",
    noteRef: "sec-06-lo06",
    reviewed: false
  },
  {
    loId: "sec-06-lo06",
    type: "single",
    difficulty: 2,
    id: "sec-06-q23",
    stem: "What AWS feature mitigates SSRF attacks against instance metadata by requiring a session token obtained via HTTP PUT (session-oriented)?",
    options: [
      { id: "a", text: "IMDSv2 (Instance Metadata Service Version 2)" },
      { id: "b", text: "AWS CloudTrail" },
      { id: "c", text: "Amazon GuardDuty" },
      { id: "d", text: "Amazon Route 53" }
    ],
    answer: ["a"],
    explanation: "IMDSv2 requires an HTTP PUT request with a custom header to fetch a session token, defeating typical GET-only SSRF flaws.",
    noteRef: "sec-06-lo06",
    reviewed: false
  },
  {
    loId: "sec-06-lo06",
    type: "single",
    difficulty: 3,
    id: "sec-06-q24",
    stem: "How can developers defend web servers against SSRF when the application must fetch remote user-provided URLs?",
    options: [
      { id: "a", text: "Enforce strict destination hostname whitelists and block resolution to loopback, link-local, and private RFC 1918 IP addresses." },
      { id: "b", text: "Disable TLS encryption." },
      { id: "c", text: "Run the web server as root." },
      { id: "d", text: "Compress all URL strings using Gzip." }
    ],
    answer: ["a"],
    explanation: "Validating resolved IPs to ensure they do not point to internal, private, or metadata addresses stops SSRF attacks.",
    noteRef: "sec-06-lo06",
    reviewed: false
  },

  // LO07
  {
    loId: "sec-06-lo07",
    type: "single",
    difficulty: 1,
    id: "sec-06-q25",
    stem: "What vulnerability occurs when an application exposes a database record ID directly in a URL parameter without checking authorization?",
    options: [
      { id: "a", text: "Insecure Direct Object Reference (IDOR)" },
      { id: "b", text: "Cross-Site Scripting (XSS)" },
      { id: "c", text: "SQL Injection" },
      { id: "d", text: "Buffer Overflow" }
    ],
    answer: ["a"],
    explanation: "IDOR exposes internal record keys without validating that the authenticated requester owns or is authorized to view that record.",
    noteRef: "sec-06-lo07",
    reviewed: false
  },
  {
    loId: "sec-06-lo07",
    type: "scenario",
    difficulty: 2,
    id: "sec-06-q26",
    stem: "An API endpoint `/api/documents/8901` allows any authenticated user to view document 8901 simply by incrementing the ID number. How should developers fix this?",
    options: [
      { id: "a", text: "Implement server-side authorization checks verifying that the requested document belongs to the authenticated user's organization." },
      { id: "b", text: "Encrypt the URL path using rot13." },
      { id: "c", text: "Disable the HTTP GET method across the entire internet." },
      { id: "d", text: "Delete all documents older than 24 hours." }
    ],
    answer: ["a"],
    explanation: "Server-side ownership verification must ensure the authenticated user has explicit rights to the requested object ID.",
    noteRef: "sec-06-lo07",
    reviewed: false
  },
  {
    loId: "sec-06-lo07",
    type: "single",
    difficulty: 2,
    id: "sec-06-q27",
    stem: "In the context of modern REST APIs, what does the acronym BOLA stand for?",
    options: [
      { id: "a", text: "Broken Object Level Authorization" },
      { id: "b", text: "Binary Object Link Architecture" },
      { id: "c", text: "Basic Online Login Authentication" },
      { id: "d", text: "Broadcast Overhead Limitation Algorithm" }
    ],
    answer: ["a"],
    explanation: "BOLA (Broken Object Level Authorization) is the modern industry term for IDOR, holding the #1 spot in the OWASP API Top 10.",
    noteRef: "sec-06-lo07",
    reviewed: false
  },
  {
    loId: "sec-06-lo07",
    type: "single",
    difficulty: 3,
    id: "sec-06-q28",
    stem: "Why does replacing predictable integer IDs (e.g. 101) with random UUIDs fail to provide complete security on its own against IDOR?",
    options: [
      { id: "a", text: "Obscurity is not authorization: if an attacker obtains a UUID (via logs, referrer headers, or APIs), the server still lacks permission validation." },
      { id: "b", text: "UUIDs can only be generated on Windows servers." },
      { id: "c", text: "Databases cannot index UUID strings." },
      { id: "d", text: "UUIDs are automatically decrypted by web browsers." }
    ],
    answer: ["a"],
    explanation: "UUIDs prevent sequential guessing but do not enforce access control; server-side permission checks are still mandatory.",
    noteRef: "sec-06-lo07",
    reviewed: false
  },

  // LO08
  {
    loId: "sec-06-lo08",
    type: "single",
    difficulty: 1,
    id: "sec-06-q29",
    stem: "What security risk occurs when a production web framework runs with debug mode enabled?",
    options: [
      { id: "a", text: "Detailed stack traces and internal environment variables (such as database credentials) are exposed to external users upon errors." },
      { id: "b", text: "The web server hardware overclocks automatically." },
      { id: "c", text: "HTTP requests are converted to UDP." },
      { id: "d", text: "Operating system patches are automatically uninstalled." }
    ],
    answer: ["a"],
    explanation: "Debug mode discloses internal file paths, framework versions, and sensitive configuration variables in error tracebacks.",
    noteRef: "sec-06-lo08",
    reviewed: false
  },
  {
    loId: "sec-06-lo08",
    type: "scenario",
    difficulty: 2,
    id: "sec-06-q30",
    stem: "A pentester browses to https://target.com/static/ and discovers an open directory listing showing all backup zip files. What vulnerability is this?",
    options: [
      { id: "a", text: "Security Misconfiguration (Directory Listing Enabled)" },
      { id: "b", text: "Cross-Site Scripting" },
      { id: "c", text: "SQL Injection" },
      { id: "d", text: "Buffer Overflow" }
    ],
    answer: ["a"],
    explanation: "Leaving web server directory browsing enabled is a classic security misconfiguration exposing sensitive files.",
    noteRef: "sec-06-lo08",
    reviewed: false
  },
  {
    loId: "sec-06-lo08",
    type: "single",
    difficulty: 2,
    id: "sec-06-q31",
    stem: "What HTTP header instructs web browsers to only connect to a site over secure HTTPS connections for a specified duration?",
    options: [
      { id: "a", text: "Strict-Transport-Security (HSTS)" },
      { id: "b", text: "X-Powered-By" },
      { id: "c", text: "Server" },
      { id: "d", text: "ETag" }
    ],
    answer: ["a"],
    explanation: "HTTP Strict Transport Security (HSTS) enforces HTTPS and protects against SSL-stripping man-in-the-middle attacks.",
    noteRef: "sec-06-lo08",
    reviewed: false
  },
  {
    loId: "sec-06-lo08",
    type: "single",
    difficulty: 3,
    id: "sec-06-q32",
    stem: "Why should informative server banners (such as 'Server: Apache/2.4.41 (Ubuntu)') be suppressed or obfuscated in production environments?",
    options: [
      { id: "a", text: "They leak exact software versions to attackers, enabling rapid identification of unpatched CVE vulnerabilities." },
      { id: "b", text: "They consume excessive HTTP packet bandwidth." },
      { id: "c", text: "They cause DNS queries to fail." },
      { id: "d", text: "Web browsers reject HTTP responses containing server names." }
    ],
    answer: ["a"],
    explanation: "Detailed version banners assist adversaries in matching known CVE exploits to running services.",
    noteRef: "sec-06-lo08",
    reviewed: false
  },

  // LO09 (Extension)
  {
    loId: "sec-06-lo09",
    type: "single",
    difficulty: 2,
    id: "sec-06-q33",
    stem: "What is a Software Bill of Materials (SBOM)?",
    options: [
      { id: "a", text: "A formal, structured inventory of all third-party components, open-source libraries, and dependencies included in an application." },
      { id: "b", text: "A financial invoice sent to cloud hosting providers." },
      { id: "c", text: "A list of employee login passwords." },
      { id: "d", text: "A compiled binary file that runs on Linux." }
    ],
    answer: ["a"],
    explanation: "An SBOM provides transparency into software supply chain components and dependency trees.",
    noteRef: "sec-06-lo09",
    reviewed: false
  },
  {
    loId: "sec-06-lo09",
    type: "scenario",
    difficulty: 3,
    id: "sec-06-q34",
    stem: "A critical zero-day vulnerability (like Log4Shell) is disclosed in a common Java logging library. How does a company with an automated Software Composition Analysis (SCA) tool respond quickly?",
    options: [
      { id: "a", text: "The SCA database instantly searches all project SBOMs to pinpoint exactly which microservices run the affected library version." },
      { id: "b", text: "It restarts all physical servers in the data center." },
      { id: "c", text: "It converts all Java applications into Python." },
      { id: "d", text: "It blocks all network traffic on port 443." }
    ],
    answer: ["a"],
    explanation: "SCA tooling tracks dependency inventories across code repositories, allowing immediate identification of vulnerable library versions.",
    noteRef: "sec-06-lo09",
    reviewed: false
  }
];

balanceAndSave('cybersecurity', 'web-application-security-owasp-top-10', ch06Objectives, ch06Questions);

// ============================================================================
// CHAPTER 7: network-defense-firewalls-and-ids-ips (sec-07)
// ============================================================================
const ch07Objectives = {
  version: 1,
  chapterId: "sec-07",
  objectives: [
    {
      id: "sec-07-lo01",
      order: 1,
      title: "Distinguish stateless packet filtering from stateful firewall inspection",
      bloom: "distinguish",
      tier: "core",
      mustHave: true,
      keywords: ["stateless firewall", "stateful inspection", "connection state table", "packet filtering"],
      aliases: ["stateful packet filtering", "firewall state table"],
      prerequisites: ["sec-02-lo03"],
      estMinutes: 10
    },
    {
      id: "sec-07-lo02",
      order: 2,
      title: "Evaluate Next-Generation Firewalls (NGFW) and deep packet inspection",
      bloom: "evaluate",
      tier: "core",
      mustHave: true,
      keywords: ["ngfw", "deep packet inspection", "application awareness", "layer 7 firewall"],
      aliases: ["next gen firewall", "dpi inspection"],
      prerequisites: ["sec-07-lo01"],
      estMinutes: 12
    },
    {
      id: "sec-07-lo03",
      order: 3,
      title: "Compare Intrusion Detection Systems (IDS) with Intrusion Prevention Systems (IPS)",
      bloom: "compare",
      tier: "core",
      mustHave: true,
      keywords: ["ids", "ips", "inline inspection", "span port", "passive monitoring"],
      aliases: ["intrusion detection vs prevention", "nids vs nips"],
      prerequisites: ["sec-07-lo01"],
      estMinutes: 12
    },
    {
      id: "sec-07-lo04",
      order: 4,
      title: "Formulate signature-based detection rules using Snort and Suricata syntax",
      bloom: "formulate",
      tier: "core",
      mustHave: false,
      keywords: ["snort rule", "suricata", "rule syntax", "content matching", "sid"],
      aliases: ["ids rule authoring", "snort signature"],
      prerequisites: ["sec-07-lo03"],
      estMinutes: 14
    },
    {
      id: "sec-07-lo05",
      order: 5,
      title: "Design network segmentation using Virtual LANs (VLANs) and 802.1Q tagging",
      bloom: "design",
      tier: "core",
      mustHave: true,
      keywords: ["vlan", "802.1q", "trunk port", "access port", "network segmentation"],
      aliases: ["virtual lan", "vlan tagging"],
      prerequisites: ["sec-02-lo01"],
      estMinutes: 12
    },
    {
      id: "sec-07-lo06",
      order: 6,
      title: "Architect Demilitarized Zones (DMZ) for public-facing edge services",
      bloom: "architect",
      tier: "core",
      mustHave: false,
      keywords: ["dmz", "perimeter security", "bastion host", "dual-homed firewall"],
      aliases: ["demilitarized zone", "perimeter architecture"],
      prerequisites: ["sec-07-lo05"],
      estMinutes: 10
    },
    {
      id: "sec-07-lo07",
      order: 7,
      title: "Implement Zero Trust Network Access (ZTNA) and microsegmentation",
      bloom: "implement",
      tier: "core",
      mustHave: false,
      keywords: ["zero trust", "ztna", "microsegmentation", "never trust always verify"],
      aliases: ["zero trust architecture", "software defined perimeter"],
      prerequisites: ["sec-07-lo05"],
      estMinutes: 12
    },
    {
      id: "sec-07-lo08",
      order: 8,
      title: "Compare Virtual Private Network (VPN) tunneling protocols: IPsec, OpenVPN, and WireGuard",
      bloom: "compare",
      tier: "core",
      mustHave: false,
      keywords: ["vpn", "ipsec", "wireguard", "openvpn", "tunneling", "esp"],
      aliases: ["vpn protocols", "secure tunneling"],
      prerequisites: ["sec-04-lo05"],
      estMinutes: 12
    },
    {
      id: "sec-07-lo09",
      order: 9,
      title: "Analyze Network Address Translation (NAT) and stateful port exhaustion",
      bloom: "analyze",
      tier: "extension",
      mustHave: false,
      keywords: ["nat", "pat", "port exhaustion", "rfc 1918", "source nat"],
      aliases: ["network address translation", "ip masquerading"],
      prerequisites: ["sec-02-lo07"],
      estMinutes: 10
    }
  ]
};

// Notes for sec-07
writeNoteBlock('cybersecurity', 'network-defense-firewalls-and-ids-ips', 'sec-07-lo01',
  `Firewalls inspect and control network traffic passing across security boundaries:
1. Stateless Packet Filtering: Evaluates each packet in total isolation based on static Layer 3/4 header fields (Source IP, Dest IP, Port, Protocol). It cannot determine if an incoming packet is part of an ongoing legitimate session.
2. Stateful Inspection: Maintains a dynamic Connection State Table tracking active bidirectional sessions (e.g. TCP handshakes, sequence numbers, timer windows). When an internal host initiates an outbound connection, the stateful firewall automatically permits the corresponding inbound reply traffic without requiring open incoming ports.`,
  `Simulating stateful firewall connection table evaluation:
\`\`\`python
# Firewall dynamic state table
state_table = {
    ("10.0.1.50", 54102, "93.184.216.34", 443, "TCP"): "ESTABLISHED"
}

def inspect_inbound_packet(src_ip, src_port, dst_ip, dst_port, proto):
    # Inbound return traffic has reversed source and destination tuples
    session_key = (dst_ip, dst_port, src_ip, src_port, proto)
    if session_key in state_table:
        return "PERMIT: Established session return traffic"
    return "DROP: Unsolicited inbound packet"

print(inspect_inbound_packet("93.184.216.34", 443, "10.0.1.50", 54102, "TCP")) # PERMIT
print(inspect_inbound_packet("198.51.100.9", 80, "10.0.1.50", 80, "TCP"))       # DROP
\`\`\``,
  `Configuring stateless ACLs for bidirectional communication without accounting for return traffic. In stateless filtering, administrators must manually open all high ephemeral ports (>1024) inbound, creating significant security exposure.`,
  `What dynamic internal data structure allows stateful firewalls to recognize and allow return traffic for established connections? The Connection State Table.`
);

writeNoteBlock('cybersecurity', 'network-defense-firewalls-and-ids-ips', 'sec-07-lo02',
  `Traditional firewalls operate strictly at Layers 3 and 4, inspecting IP addresses and port numbers. Next-Generation Firewalls (NGFW) integrate Deep Packet Inspection (DPI) capable of analyzing Layer 7 application protocols regardless of port numbers. An NGFW can differentiate legitimate HTTPS web traffic from encrypted malware command-and-control, Tor tunneling, or unauthorized file uploads executing over port 443. NGFWs typically integrate inline IPS, TLS decryption/inspection, and threat intelligence feeds.`,
  `Simulating Layer 7 application recognition:
\`\`\`python
# Telemetry: Inbound connection on port 443
packet = {
    "src_ip": "10.0.1.20",
    "dst_port": 443,
    "l7_payload_magic": b"TOR_CIRCUIT_ESTABLISH"
}

def ngfw_evaluate(pkt):
    # Layer 4 check: Port 443 appears legitimate (HTTPS)
    # Layer 7 Deep Packet Inspection: Payload analysis reveals unauthorized protocol
    if b"TOR" in pkt["l7_payload_magic"]:
        return "BLOCK: Unauthorized Tor protocol detected over port 443"
    return "ALLOW: Legitimate HTTPS application traffic"

print("NGFW Decision:", ngfw_evaluate(packet))
\`\`\``,
  `Assuming port-based rules provide complete control. Adversaries and peer-to-peer applications frequently tunnel traffic over ports 80 or 443 to bypass legacy Layer 4 firewalls; Layer 7 application inspection is necessary to identify true protocols.`,
  `At which OSI layer does a Next-Generation Firewall (NGFW) inspect application payloads to detect tunneled protocols? Layer 7 (Application Layer).`
);

writeNoteBlock('cybersecurity', 'network-defense-firewalls-and-ids-ips', 'sec-07-lo03',
  `Intrusion Detection Systems (IDS) and Intrusion Prevention Systems (IPS) monitor network telemetry for malicious activity:
1. NIDS (Network IDS): Deployed passively out-of-band via a network TAP or switch SPAN (mirror) port. It inspects duplicate packet copies and generates security alerts, but cannot actively drop malicious packets inline.
2. NIPS (Network IPS): Deployed inline directly along the primary network path. Every packet traverses the sensor. Upon detecting an exploit signature or malicious threshold, the IPS can drop packets in real time and reset TCP connections before they reach the target.`,
  `Comparing passive IDS alert vs inline IPS drop actions:
\`\`\`python
# Detection engine finding
detection = {"signature": "EXPLOIT_APACHE_STRUTS_CMD", "target": "10.0.1.10"}

def handle_ids(event):
    # Passive TAP monitoring
    return f"NIDS ACTION: Logged alert to SIEM for {event['signature']} (Packet passed through)"

def handle_ips(event):
    # Inline sensor enforcement
    return f"NIPS ACTION: Dropped packet inline for {event['signature']} (Target protected)"

print(handle_ids(detection))
print(handle_ips(detection))
\`\`\``,
  `Deploying an IPS with unvalidated or overly aggressive heuristic signatures in blocking mode. A high false-positive rate on an inline IPS can drop legitimate corporate traffic, creating self-inflicted denial-of-service outages.`,
  `Which network monitoring system is deployed inline along the primary traffic path to actively drop malicious packets in real time? Intrusion Prevention System (IPS).`
);

writeNoteBlock('cybersecurity', 'network-defense-firewalls-and-ids-ips', 'sec-07-lo04',
  `Open-source network sensors like Snort and Suricata use structured signature rules to detect malicious traffic. A standard rule consists of a Rule Header (Action, Protocol, Source IP/Port, Direction, Dest IP/Port) and Rule Options enclosed in parentheses (msg, content, nocase, sid, rev). For example:
alert tcp any any -> 10.0.1.0/24 80 (msg:"ATTACK SQLi OR pattern detected"; content:"OR 1=1"; nocase; sid:1000001; rev:1;)
Suricata extends Snort rules with multi-threading and native HTTP/TLS protocol keyword parsing.`,
  `Parsing a Snort detection rule syntax:
\`\`\`python
rule = 'alert tcp $EXTERNAL_NET any -> $HTTP_SERVERS 80 (msg:"WEB-ATTACK /etc/passwd access attempt"; content:"/etc/passwd"; sid:1000002; rev:1;)'

header, options = rule.split("(", 1)
options = options.rstrip(")")

print("Rule Header:", header.strip())
print("Detection Message:", [opt for opt in options.split(";") if "msg:" in opt][0].strip())
print("Signature ID (SID):", [opt for opt in options.split(";") if "sid:" in opt][0].strip())
\`\`\``,
  `Writing short, generic content rules (e.g. content:"admin") without anchor keywords or protocol constraints. Generic content matches trigger massive volumes of false-positive alerts on benign web pages, overwhelming SOC analysts.`,
  `What keyword in a Snort or Suricata rule uniquely identifies the signature in the detection database? sid (Signature ID).`
);

writeNoteBlock('cybersecurity', 'network-defense-firewalls-and-ids-ips', 'sec-07-lo05',
  `Network segmentation confines traffic into isolated broadcast domains, containing malware lateral movement. Virtual Local Area Networks (VLANs) divide physical switches into logical Layer 2 broadcast domains. The IEEE 802.1Q standard inserts a 4-byte VLAN tag into the Ethernet frame header (containing a 12-bit VLAN ID, supporting up to 4094 VLANs). Switch ports are configured as:
1. Access Ports: Connect to endpoints (laptops, servers) and handle untagged frames for a single VLAN.
2. Trunk Ports: Carry multiplexed tagged frames across switches and routers.`,
  `Inspecting IEEE 802.1Q Ethernet frame tag fields:
\`\`\`python
def parse_8021q_tag(vlan_id, priority=0):
    # 802.1Q header: 16-bit TPID (0x8100) + 3-bit PCP + 1-bit DEI + 12-bit VID
    tpid = "0x8100"
    return f"Ethernet II -> 802.1Q Tag [TPID: {tpid}, VLAN_ID: {vlan_id}, Priority: {priority}]"

print(parse_8021q_tag(vlan_id=10)) # Finance VLAN
print(parse_8021q_tag(vlan_id=20)) # Engineering VLAN
\`\`\``,
  `Leaving unassigned switch ports in the default native VLAN (VLAN 1). If untagged ports share the default VLAN, attackers can exploit double-tagging attacks or hop across default management domains.`,
  `What IEEE standard specifies the 4-byte tagging encapsulation format used for VLAN trunking? IEEE 802.1Q.`
);

writeNoteBlock('cybersecurity', 'network-defense-firewalls-and-ids-ips', 'sec-07-lo06',
  `A Demilitarized Zone (DMZ) is a perimeter network segment that separates public-facing services (web servers, mail relays, DNS resolvers) from the trusted internal corporate network. In a classic dual-firewall architecture:
- External Firewall allows internet users to access only specific ports on DMZ hosts.
- Internal Firewall strictly blocks unsolicited connections originating from the DMZ into the internal corporate network.
If an external web server in the DMZ is compromised, the attacker cannot pivot directly into internal Active Directory domain controllers.`,
  `Evaluating traffic routing policies across DMZ boundaries:
\`\`\`python
def evaluate_perimeter_firewall(source_zone, dest_zone, port):
    # Rule 1: Internet -> DMZ: Allow Web traffic
    if source_zone == "INTERNET" and dest_zone == "DMZ" and port in [80, 443]:
        return "PERMIT"
    # Rule 2: DMZ -> Internal: Strictly Block unsolicited connections
    if source_zone == "DMZ" and dest_zone == "INTERNAL":
        return "DENY: DMZ host blocked from initiating connections to internal LAN"
    # Rule 3: Internal -> DMZ: Allow administration
    if source_zone == "INTERNAL" and dest_zone == "DMZ":
        return "PERMIT"
    return "DENY"

print("Internet accessing DMZ Web Server:", evaluate_perimeter_firewall("INTERNET", "DMZ", 443))
print("Compromised DMZ server pivoting to Internal LAN:", evaluate_perimeter_firewall("DMZ", "INTERNAL", 445))
\`\`\``,
  `Allowing DMZ servers to initiate direct connections to internal database servers. If the DMZ server is compromised, attackers can query the database directly. Database queries should be handled via a secure API broker or pull model.`,
  `In a secure DMZ architecture, what traffic direction is strictly blocked by the internal firewall? Unsolicited connections initiated from the DMZ into the internal network.`
);

writeNoteBlock('cybersecurity', 'network-defense-firewalls-and-ids-ips', 'sec-07-lo07',
  `Traditional perimeter security relies on a 'castle-and-moat' model where internal traffic is implicitly trusted. Zero Trust Architecture (ZTA, NIST SP 800-207) operates on the core principle: 'Never trust, always verify'. Zero Trust Network Access (ZTNA) replaces broad network-level VPN access with fine-grained application-level access. Microsegmentation isolates workloads down to individual virtual machines or containers using software-defined firewalls, preventing lateral movement even inside the same data center subnet.`,
  `Contrasting legacy VPN vs Zero Trust Network Access (ZTNA):
\`\`\`python
user = {"identity": "analyst", "mfa_verified": True, "device_health": "compliant"}

def evaluate_ztna(user_context, target_app):
    # Evaluates identity, device health, and specific application permissions
    if user_context["mfa_verified"] and user_context["device_health"] == "compliant":
        if target_app == "jira_ticketing":
            return "PERMIT: Authorized for specific application only"
    return "DENY: No lateral network access granted"

print("ZTNA Access Decision:", evaluate_ztna(user, "jira_ticketing"))
\`\`\``,
  `Assuming Zero Trust is a single software product that can be purchased and installed. Zero Trust is an architectural framework requiring identity verification, device health auditing, microsegmentation, and continuous monitoring across all layers.`,
  `What foundational principle defines the Zero Trust security philosophy? 'Never trust, always verify.'`
);

writeNoteBlock('cybersecurity', 'network-defense-firewalls-and-ids-ips', 'sec-07-lo08',
  `Virtual Private Networks (VPNs) create encrypted tunnels across public networks:
1. IPsec (Internet Protocol Security): Operates at Layer 3 using Encapsulating Security Payload (ESP) and Internet Key Exchange (IKEv2). Highly robust, hardware-accelerated, standard for site-to-site office links.
2. OpenVPN: Operates in user space over SSL/TLS (Layer 4/5), versatile and capable of tunneling over UDP or TCP port 443 to bypass restrictive firewalls.
3. WireGuard: A modern, minimalist VPN protocol built directly into the Linux kernel. It utilizes state-of-the-art cryptography (Noise protocol, ChaCha20, Curve25519) with vastly smaller codebase (~4,000 lines vs 100,000+ for OpenVPN/IPsec), delivering high speed and low latency.`,
  `Comparing VPN protocol implementations:
\`\`\`python
vpn_protocols = {
    "IPsec": {"layer": "Layer 3 (Network)", "common_use": "Site-to-site gateway tunnels", "crypto": "AES-CBC/GCM, IKEv2"},
    "OpenVPN": {"layer": "Layer 4/5 (Transport/App)", "common_use": "Client remote access", "crypto": "OpenSSL TLS"},
    "WireGuard": {"layer": "Layer 3 (Kernel)", "common_use": "High-speed modern tunnels", "crypto": "ChaCha20, Curve25519"}
}

for name, details in vpn_protocols.items():
    print(f"VPN {name} -> {details['common_use']} ({details['crypto']})")
\`\`\``,
  `Routing all remote employee internet traffic (including video calls and streaming) through the corporate VPN tunnel when split-tunneling is not properly planned, saturating office bandwidth.`,
  `What modern, high-speed VPN protocol is built directly into the Linux kernel with a minimalist codebase utilizing ChaCha20 and Curve25519? WireGuard.`
);

writeNoteBlock('cybersecurity', 'network-defense-firewalls-and-ids-ips', 'sec-07-lo09',
  `Network Address Translation (NAT), specifically Port Address Translation (PAT / Source NAT), maps thousands of private RFC 1918 IP addresses (e.g., 10.0.0.0/8, 192.168.0.0/16) onto a single public IP address by rewriting Layer 3 IP headers and Layer 4 source ports. Stateful NAT gateways track mappings in translation tables. Under heavy concurrent outbound connection volume, NAT gateways risk Source Port Exhaustion (running out of the ~65,000 available ephemeral ports), resulting in dropped outbound sessions.`,
  `Simulating NAT port translation table tracking:
\`\`\`python
# NAT translation table: (Private IP, Private Port) -> (Public IP, Translated Port)
nat_table = {
    ("10.0.1.15", 48102): ("203.0.113.5", 10001),
    ("10.0.1.22", 48102): ("203.0.113.5", 10002)
}

def translate_outbound(src_ip, src_port):
    mapping = nat_table.get((src_ip, src_port))
    if mapping:
        public_ip, translated_port = mapping
        return f"Rewritten Packet: Source {public_ip}:{translated_port}"
    return "Port allocation required"

print(translate_outbound("10.0.1.15", 48102))
print(translate_outbound("10.0.1.22", 48102))
\`\`\``,
  `Assuming NAT acts as a complete replacement for a firewall. While NAT hides internal IP addresses from unsolicited inbound packets, it does not inspect packet payloads, block malware, or enforce application-layer security policies.`,
  `What condition occurs when a busy NAT gateway runs out of available ephemeral source ports to map outbound connections? Source Port Exhaustion.`
);

// Questions for sec-07
const ch07Questions = [
  // LO01
  {
    loId: "sec-07-lo01",
    type: "single",
    difficulty: 1,
    id: "sec-07-q01",
    stem: "What capability distinguishes a stateful firewall from a basic stateless packet filter?",
    options: [
      { id: "a", text: "It maintains a dynamic state table tracking active connections to automatically permit legitimate return traffic." },
      { id: "b", text: "It converts IPv4 packets into IPv6." },
      { id: "c", text: "It encrypts all passing network packets with AES-256." },
      { id: "d", text: "It operates exclusively on physical fiber optic cables." }
    ],
    answer: ["a"],
    explanation: "Stateful firewalls track session states, allowing reply packets matching active connections without opening static inbound ports.",
    noteRef: "sec-07-lo01",
    reviewed: false
  },
  {
    loId: "sec-07-lo01",
    type: "scenario",
    difficulty: 2,
    id: "sec-07-q02",
    stem: "An administrator deploys a stateless firewall rule allowing outbound TCP port 80 traffic. Users report websites never load. What configuration was omitted?",
    options: [
      { id: "a", text: "A stateless inbound rule allowing return traffic from port 80 to high ephemeral client ports (>1024)." },
      { id: "b", text: "Enabling DNSSEC on the client laptops." },
      { id: "c", text: "Assigning static public IP addresses to every user." },
      { id: "d", text: "Configuring a BGP routing protocol." }
    ],
    answer: ["a"],
    explanation: "Stateless firewalls do not track sessions; return traffic is dropped unless explicitly permitted by an inbound rule.",
    noteRef: "sec-07-lo01",
    reviewed: false
  },
  {
    loId: "sec-07-lo01",
    type: "single",
    difficulty: 2,
    id: "sec-07-q03",
    stem: "What fields typically define a connection state entry (the '5-tuple') in a stateful firewall table?",
    options: [
      { id: "a", text: "Source IP, Destination IP, Source Port, Destination Port, and Protocol" },
      { id: "b", text: "MAC Address, Subnet Mask, Default Gateway, DNS Server, and DHCP Lease" },
      { id: "c", text: "Username, Password, Domain, Workstation, and Session Token" },
      { id: "d", text: "HTTP Method, URL Path, Status Code, User Agent, and Cookie" }
    ],
    answer: ["a"],
    explanation: "The 5-tuple (src IP, dst IP, src port, dst port, transport protocol) uniquely identifies a network session.",
    noteRef: "sec-07-lo01",
    reviewed: false
  },
  {
    loId: "sec-07-lo01",
    type: "single",
    difficulty: 3,
    id: "sec-07-q04",
    stem: "Why are stateless Access Control Lists (ACLs) still utilized on core backbone routers despite the advantages of stateful firewalls?",
    options: [
      { id: "a", text: "Stateless packet filtering executes at wire speed in router hardware (ASICs) without memory overhead for millions of state table entries." },
      { id: "b", text: "Routers cannot process TCP packets." },
      { id: "c", text: "Stateful firewalls cannot filter UDP packets." },
      { id: "d", text: "Stateless ACLs provide built-in malware sandboxing." }
    ],
    answer: ["a"],
    explanation: "Stateless ACLs require zero state memory tracking, making them extremely fast for line-rate backbone routing.",
    noteRef: "sec-07-lo01",
    reviewed: false
  },

  // LO02
  {
    loId: "sec-07-lo02",
    type: "single",
    difficulty: 1,
    id: "sec-07-q05",
    stem: "What core feature sets Next-Generation Firewalls (NGFW) apart from traditional Layer 3/4 stateful firewalls?",
    options: [
      { id: "a", text: "Deep Packet Inspection capable of identifying Layer 7 applications regardless of port numbers." },
      { id: "b", text: "The ability to route packets between subnets." },
      { id: "c", text: "Hardware cooling fans." },
      { id: "d", text: "Support for Ethernet cables." }
    ],
    answer: ["a"],
    explanation: "NGFWs inspect application payloads (Layer 7), identifying protocols and blocking threats even on non-standard ports.",
    noteRef: "sec-07-lo02",
    reviewed: false
  },
  {
    loId: "sec-07-lo02",
    type: "scenario",
    difficulty: 2,
    id: "sec-07-q06",
    stem: "An employee uses an SSH proxy tunneled over port 443 to bypass corporate filtering. A legacy firewall allows the traffic. Why does an NGFW block it?",
    options: [
      { id: "a", text: "The NGFW inspects the Layer 7 protocol signature, recognizes SSH traffic instead of TLS, and enforces application blocking policies." },
      { id: "b", text: "Port 443 is blocked by default on all NGFWs." },
      { id: "c", text: "The NGFW deletes the employee's Active Directory account." },
      { id: "d", text: "SSH cannot execute over port 443." }
    ],
    answer: ["a"],
    explanation: "Application-aware NGFWs classify traffic by actual payload signatures, detecting protocol tunneling on mismatched ports.",
    noteRef: "sec-07-lo02",
    reviewed: false
  },
  {
    loId: "sec-07-lo02",
    type: "multi",
    difficulty: 2,
    id: "sec-07-q07",
    stem: "Which of the following security capabilities are commonly integrated into modern Next-Generation Firewalls?",
    options: [
      { id: "a", text: "Intrusion Prevention System (IPS)" },
      { id: "b", text: "SSL/TLS Decryption and Inspection" },
      { id: "c", text: "Threat Intelligence Feed Integration" },
      { id: "d", text: "Automated Hard Drive BitLocker Encryption" }
    ],
    answer: ["a", "b", "c"],
    explanation: "NGFWs integrate IPS, TLS inspection, and threat intelligence; endpoint disk encryption is handled on the host.",
    noteRef: "sec-07-lo02",
    reviewed: false
  },
  {
    loId: "sec-07-lo02",
    type: "single",
    difficulty: 3,
    id: "sec-07-q08",
    stem: "How does an NGFW perform SSL/TLS decryption (TLS Inspection) on outbound traffic without triggering browser certificate warnings?",
    options: [
      { id: "a", text: "An enterprise Root CA certificate is installed on client workstations, allowing the NGFW to dynamically re-sign inspected certificates." },
      { id: "b", text: "It cracks the server's private RSA key using rainbow tables." },
      { id: "c", text: "It forces the website to send plaintext HTTP." },
      { id: "d", text: "It resets the workstation's system clock." }
    ],
    answer: ["a"],
    explanation: "By trusting the enterprise proxy CA, endpoints accept certificates dynamically generated by the NGFW during outbound TLS inspection.",
    noteRef: "sec-07-lo02",
    reviewed: false
  },

  // LO03
  {
    loId: "sec-07-lo03",
    type: "single",
    difficulty: 1,
    id: "sec-07-q09",
    stem: "What is the primary operational difference between an IDS and an IPS?",
    options: [
      { id: "a", text: "An IDS passively monitors traffic copies and generates alerts; an IPS sits inline and actively drops malicious packets." },
      { id: "b", text: "An IDS only inspects wireless networks while an IPS only inspects fiber." },
      { id: "c", text: "An IPS cannot generate log records." },
      { id: "d", text: "An IDS requires an internet connection to function." }
    ],
    answer: ["a"],
    explanation: "IDS is passive out-of-band monitoring (alerting); IPS is active inline enforcement (blocking).",
    noteRef: "sec-07-lo03",
    reviewed: false
  },
  {
    loId: "sec-07-lo03",
    type: "scenario",
    difficulty: 2,
    id: "sec-07-q10",
    stem: "A network engineer configures a switch SPAN (port mirroring) port to copy all server traffic to a monitoring appliance. What type of sensor is this?",
    options: [
      { id: "a", text: "Passive Network Intrusion Detection System (NIDS)" },
      { id: "b", text: "Inline Network Intrusion Prevention System (NIPS)" },
      { id: "c", text: "Proxy Server" },
      { id: "d", text: "Stateful NAT Gateway" }
    ],
    answer: ["a"],
    explanation: "Receiving mirrored traffic copies via a SPAN port is the hallmark of a passive out-of-band NIDS.",
    noteRef: "sec-07-lo03",
    reviewed: false
  },
  {
    loId: "sec-07-lo03",
    type: "single",
    difficulty: 2,
    id: "sec-07-q11",
    stem: "What risk arises when deploying an Intrusion Prevention System (IPS) inline with overly aggressive or unvetted rules?",
    options: [
      { id: "a", text: "False positives can block critical legitimate business traffic, causing unintended service outages." },
      { id: "b", text: "The IPS hardware will catch fire." },
      { id: "c", text: "The network switch will revert to hub mode." },
      { id: "d", text: "All network cables must be replaced with shielded pairs." }
    ],
    answer: ["a"],
    explanation: "False positives on inline blocking devices directly interrupt business operations.",
    noteRef: "sec-07-lo03",
    reviewed: false
  },
  {
    loId: "sec-07-lo03",
    type: "single",
    difficulty: 3,
    id: "sec-07-q12",
    stem: "How can a passive NIDS attempt to terminate a detected malicious TCP connection despite being deployed out-of-band?",
    options: [
      { id: "a", text: "By injecting spoofed TCP RST (Reset) packets to both endpoints to tear down the socket." },
      { id: "b", text: "By disabling the target server's NIC remotely." },
      { id: "c", text: "By corrupting the switch firmware." },
      { id: "d", text: "By deleting the client's DNS cache." }
    ],
    answer: ["a"],
    explanation: "TCP reset injection transmits forged RST segments to both client and server, terminating the connection asynchronously.",
    noteRef: "sec-07-lo03",
    reviewed: false
  },

  // LO04
  {
    loId: "sec-07-lo04",
    type: "single",
    difficulty: 1,
    id: "sec-07-q13",
    stem: "In Snort and Suricata rule syntax, what field uniquely identifies the signature in the rule database?",
    options: [
      { id: "a", text: "sid (Signature ID)" },
      { id: "b", text: "rev (Revision)" },
      { id: "c", text: "classtype" },
      { id: "d", text: "msg" }
    ],
    answer: ["a"],
    explanation: "The `sid` option assigns a unique numeric identifier to the rule (custom rules typically start at 1,000,000).",
    noteRef: "sec-07-lo04",
    reviewed: false
  },
  {
    loId: "sec-07-lo04",
    type: "scenario",
    difficulty: 2,
    id: "sec-07-q14",
    stem: "An analyst writes a Snort rule: `alert tcp any any -> any 80 (msg:\"SQLi\"; content:\"union select\"; sid:1000005;)`. An attacker sends `UNION SELECT` and bypasses detection. What modifier was missing?",
    options: [
      { id: "a", text: "nocase (to enable case-insensitive content matching)" },
      { id: "b", text: "hex (to convert to binary)" },
      { id: "c", text: "fast_pattern" },
      { id: "d", text: "depth:10" }
    ],
    answer: ["a"],
    explanation: "Without the `nocase` modifier, Snort content matching is strictly case-sensitive.",
    noteRef: "sec-07-lo04",
    reviewed: false
  },
  {
    loId: "sec-07-lo04",
    type: "numeric",
    difficulty: 2,
    id: "sec-07-q15",
    stem: "In standard Snort convention, custom locally-authored rule SIDs should begin at what minimum numeric value to avoid conflicts with official rulesets?",
    options: [
      { id: "a", text: "1000000" },
      { id: "b", text: "100" },
      { id: "c", text: "1000" },
      { id: "d", text: "500" }
    ],
    answer: ["a"],
    explanation: "Snort reserves SIDs below 1,000,000 for official Sourcefire/Talos rules; local custom rules start at 1,000,000.",
    noteRef: "sec-07-lo04",
    verify: "(1000000 === 1000000)",
    reviewed: false
  },
  {
    loId: "sec-07-lo04",
    type: "single",
    difficulty: 3,
    id: "sec-07-q16",
    stem: "What major architectural advantage does Suricata offer over classic single-threaded Snort engines?",
    options: [
      { id: "a", text: "Native multi-threaded packet processing capable of scaling across multi-core server CPUs." },
      { id: "b", text: "It runs without a network card." },
      { id: "c", text: "It automatically rewrites SQL queries." },
      { id: "d", text: "It eliminates the need for signature rules." }
    ],
    answer: ["a"],
    explanation: "Suricata was architected natively for multi-threading, processing high-throughput 10Gbps+ links across multiple CPU cores.",
    noteRef: "sec-07-lo04",
    reviewed: false
  },

  // LO05
  {
    loId: "sec-07-lo05",
    type: "single",
    difficulty: 1,
    id: "sec-07-q17",
    stem: "What is the primary function of a Virtual Local Area Network (VLAN)?",
    options: [
      { id: "a", text: "To logically partition a physical switch into isolated Layer 2 broadcast domains." },
      { id: "b", text: "To encrypt wireless passwords." },
      { id: "c", text: "To assign public IP addresses automatically." },
      { id: "d", text: "To boost Ethernet cable speeds from 1Gbps to 10Gbps." }
    ],
    answer: ["a"],
    explanation: "VLANs segment physical switches into separate logical broadcast domains, isolating network traffic.",
    noteRef: "sec-07-lo05",
    reviewed: false
  },
  {
    loId: "sec-07-lo05",
    type: "scenario",
    difficulty: 2,
    id: "sec-07-q18",
    stem: "An enterprise network switch connects to a server carrying traffic for both the Sales VLAN (ID 10) and Finance VLAN (ID 20) over a single cable. How must this switch port be configured?",
    options: [
      { id: "a", text: "As an 802.1Q Trunk Port" },
      { id: "b", text: "As an Access Port" },
      { id: "c", text: "As a Half-Duplex Port" },
      { id: "d", text: "As a Loopback Port" }
    ],
    answer: ["a"],
    explanation: "Trunk ports multiplex multiple VLANs over a single link by appending 802.1Q tags to Ethernet frames.",
    noteRef: "sec-07-lo05",
    reviewed: false
  },
  {
    loId: "sec-07-lo05",
    type: "numeric",
    difficulty: 2,
    id: "sec-07-q19",
    stem: "How many bits are allocated for the VLAN Identifier (VID) field in an IEEE 802.1Q header?",
    options: [
      { id: "a", text: "12" },
      { id: "b", text: "8" },
      { id: "c", text: "16" },
      { id: "d", text: "4" }
    ],
    answer: ["a"],
    explanation: "The 802.1Q tag uses 12 bits for the VLAN ID, supporting up to 4094 unique VLANs (2^12 - 2).",
    noteRef: "sec-07-lo05",
    verify: "(12 === 12)",
    reviewed: false
  },
  {
    loId: "sec-07-lo05",
    type: "single",
    difficulty: 3,
    id: "sec-07-q20",
    stem: "Why should network engineers disable DTP (Dynamic Trunking Protocol) and change the default native VLAN away from VLAN 1?",
    options: [
      { id: "a", text: "To prevent unauthorized VLAN Hopping attacks where an attacker tricks the switch into establishing an unapproved trunk." },
      { id: "b", text: "Because VLAN 1 cannot carry IP traffic." },
      { id: "c", text: "To prevent switches from overheating." },
      { id: "d", text: "Because 802.1Q does not support numbers lower than 2." }
    ],
    answer: ["a"],
    explanation: "Disabling DTP and modifying the native VLAN mitigates switch spoofing and double-tagging VLAN hopping attacks.",
    noteRef: "sec-07-lo05",
    reviewed: false
  },

  // LO06
  {
    loId: "sec-07-lo06",
    type: "single",
    difficulty: 1,
    id: "sec-07-q21",
    stem: "What is the primary security objective of a Demilitarized Zone (DMZ)?",
    options: [
      { id: "a", text: "Isolating public-facing edge servers so that a compromise does not grant direct access to the internal trusted network." },
      { id: "b", text: "Encrypting all internal employee email." },
      { id: "c", text: "Accelerating web server DNS caching." },
      { id: "d", text: "Providing public Wi-Fi without passwords." }
    ],
    answer: ["a"],
    explanation: "A DMZ creates a buffer subnetwork; if a public-facing server is breached, the attacker remains isolated from the internal LAN.",
    noteRef: "sec-07-lo06",
    reviewed: false
  },
  {
    loId: "sec-07-lo06",
    type: "scenario",
    difficulty: 2,
    id: "sec-07-q22",
    stem: "An attacker compromises a DMZ web server via a web vulnerability. When they attempt to scan internal subnet 10.0.0.0/24, all packets are dropped. What component enforced this?",
    options: [
      { id: "a", text: "The internal firewall separating the DMZ from the internal corporate network." },
      { id: "b", text: "The external internet gateway." },
      { id: "c", text: "The web server's SSL certificate." },
      { id: "d", text: "The client browser's CSP policy." }
    ],
    answer: ["a"],
    explanation: "The internal firewall blocks unsolicited traffic initiated from DMZ hosts into internal corporate subnets.",
    noteRef: "sec-07-lo06",
    reviewed: false
  },
  {
    loId: "sec-07-lo06",
    type: "multi",
    difficulty: 2,
    id: "sec-07-q23",
    stem: "Which of the following services are typically deployed inside a DMZ network segment?",
    options: [
      { id: "a", text: "Public Web Servers (HTTP/HTTPS)" },
      { id: "b", text: "External Mail Relays (SMTP)" },
      { id: "c", text: "Public DNS Servers" },
      { id: "d", text: "Active Directory Domain Controllers" }
    ],
    answer: ["a", "b", "c"],
    explanation: "Web, mail, and public DNS are external-facing DMZ services. Domain Controllers hold master identities and belong on the internal LAN.",
    noteRef: "sec-07-lo06",
    reviewed: false
  },
  {
    loId: "sec-07-lo06",
    type: "single",
    difficulty: 3,
    id: "sec-07-q24",
    stem: "Why is a two-firewall (dual-homed perimeter) DMZ architecture considered superior to a single 3-legged firewall architecture?",
    options: [
      { id: "a", text: "Using firewalls from two different vendors ensures that a single vendor zero-day flaw does not compromise both perimeter and internal networks." },
      { id: "b", text: "Two firewalls double the network bandwidth." },
      { id: "c", text: "It allows web traffic to bypass encryption." },
      { id: "d", text: "It eliminates the need for routing tables." }
    ],
    answer: ["a"],
    explanation: "Defense-in-depth: deploying dual firewalls from different vendors prevents a single software exploit from breaching both boundaries.",
    noteRef: "sec-07-lo06",
    reviewed: false
  },

  // LO07
  {
    loId: "sec-07-lo07",
    type: "single",
    difficulty: 1,
    id: "sec-07-q25",
    stem: "What principle summarizes the Zero Trust security architecture (NIST SP 800-207)?",
    options: [
      { id: "a", text: "Never trust, always verify" },
      { id: "b", text: "Trust but verify" },
      { id: "c", text: "Security through obscurity" },
      { id: "d", text: "Default permit all internal traffic" }
    ],
    answer: ["a"],
    explanation: "Zero Trust removes implicit trust from network location, requiring continuous authentication and validation.",
    noteRef: "sec-07-lo07",
    reviewed: false
  },
  {
    loId: "sec-07-lo07",
    type: "scenario",
    difficulty: 2,
    id: "sec-07-q26",
    stem: "A company replaces full-network VPN tunnels with a system that grants authenticated employees access strictly to specific authorized applications. What is this technology?",
    options: [
      { id: "a", text: "Zero Trust Network Access (ZTNA)" },
      { id: "b", text: "Hub-and-spoke Telnet" },
      { id: "c", text: "Dynamic ARP Inspection" },
      { id: "d", text: "Stateless Packet ACL" }
    ],
    answer: ["a"],
    explanation: "ZTNA provisions application-specific micro-tunnels rather than placing remote users onto the broader corporate subnet.",
    noteRef: "sec-07-lo07",
    reviewed: false
  },
  {
    loId: "sec-07-lo07",
    type: "single",
    difficulty: 2,
    id: "sec-07-q27",
    stem: "What is 'microsegmentation' in modern virtualized data centers and cloud environments?",
    options: [
      { id: "a", text: "Isolating individual workloads or virtual machines using software-defined firewalls, preventing lateral movement within the same subnet." },
      { id: "b", text: "Splitting optical fibers into microscopic strands." },
      { id: "c", text: "Dividing passwords into 2-character pieces." },
      { id: "d", text: "Limiting packet sizes to under 64 bytes." }
    ],
    answer: ["a"],
    explanation: "Microsegmentation applies granular security policies to individual workloads, stopping lateral spread inside shared data centers.",
    noteRef: "sec-07-lo07",
    reviewed: false
  },
  {
    loId: "sec-07-lo07",
    type: "single",
    difficulty: 3,
    id: "sec-07-q28",
    stem: "In a Zero Trust evaluation, which of the following criteria are verified before granting access to a corporate resource?",
    options: [
      { id: "a", text: "User identity, MFA status, device security health posture, and contextual risk factors." },
      { id: "b", text: "Only the user's IP address." },
      { id: "c", text: "Only whether the device is connected via an Ethernet cable." },
      { id: "d", text: "The CPU model of the server." }
    ],
    answer: ["a"],
    explanation: "Zero Trust dynamically checks identity, MFA, endpoint compliance (patches, EDR status), and risk context.",
    noteRef: "sec-07-lo07",
    reviewed: false
  },

  // LO08
  {
    loId: "sec-07-lo08",
    type: "single",
    difficulty: 1,
    id: "sec-07-q29",
    stem: "Which modern VPN protocol is implemented directly inside the Linux kernel with a minimal ~4,000-line codebase utilizing modern cryptography (ChaCha20, Curve25519)?",
    options: [
      { id: "a", text: "WireGuard" },
      { id: "b", text: "OpenVPN" },
      { id: "c", text: "PPTP" },
      { id: "d", text: "L2TP" }
    ],
    answer: ["a"],
    explanation: "WireGuard is a modern, lightweight, high-performance in-kernel VPN protocol designed for simplicity and auditability.",
    noteRef: "sec-07-lo08",
    reviewed: false
  },
  {
    loId: "sec-07-lo08",
    type: "scenario",
    difficulty: 2,
    id: "sec-07-q30",
    stem: "An enterprise needs a reliable site-to-site VPN connecting two regional office routers across the internet. Which Layer 3 protocol suite is the industry standard for this link?",
    options: [
      { id: "a", text: "IPsec (with IKEv2 and ESP)" },
      { id: "b", text: "Telnet" },
      { id: "c", text: "WEP" },
      { id: "d", text: "SNMPv1" }
    ],
    answer: ["a"],
    explanation: "IPsec with IKEv2 is the proven, hardware-accelerated standard for router-to-router site-to-site tunnels.",
    noteRef: "sec-07-lo08",
    reviewed: false
  },
  {
    loId: "sec-07-lo08",
    type: "single",
    difficulty: 2,
    id: "sec-07-q31",
    stem: "What IPsec protocol provides data confidentiality (encryption), integrity, and authentication for tunneled packet payloads?",
    options: [
      { id: "a", text: "Encapsulating Security Payload (ESP)" },
      { id: "b", text: "Authentication Header (AH) alone" },
      { id: "c", text: "Internet Control Message Protocol (ICMP)" },
      { id: "d", text: "Address Resolution Protocol (ARP)" }
    ],
    answer: ["a"],
    explanation: "ESP (IP protocol 50) provides encryption and authentication; AH (protocol 51) provides integrity only without encryption.",
    noteRef: "sec-07-lo08",
    reviewed: false
  },
  {
    loId: "sec-07-lo08",
    type: "single",
    difficulty: 3,
    id: "sec-07-q32",
    stem: "Why can OpenVPN successfully connect through restrictive enterprise firewalls that block standard IPsec traffic?",
    options: [
      { id: "a", text: "OpenVPN can run over standard TCP port 443, making its packets appear identical to normal HTTPS web traffic." },
      { id: "b", text: "OpenVPN disables IP packet headers." },
      { id: "c", text: "OpenVPN uses satellite radio frequencies." },
      { id: "d", text: "OpenVPN is an approved Windows kernel service." }
    ],
    answer: ["a"],
    explanation: "By utilizing TCP port 443 with TLS, OpenVPN easily traverses firewalls that drop native IPsec protocols (IKE UDP 500, ESP 50).",
    noteRef: "sec-07-lo08",
    reviewed: false
  },

  // LO09 (Extension)
  {
    loId: "sec-07-lo09",
    type: "single",
    difficulty: 2,
    id: "sec-07-q33",
    stem: "What is the primary function of Port Address Translation (PAT / Source NAT) on an enterprise internet router?",
    options: [
      { id: "a", text: "Mapping thousands of internal private IP addresses to a single public IP address using unique source port numbers." },
      { id: "b", text: "Encrypting all outgoing corporate email." },
      { id: "c", text: "Preventing SQL injection attacks on web servers." },
      { id: "d", text: "Translating domain names into MAC addresses." }
    ],
    answer: ["a"],
    explanation: "PAT multiplexes multiple private IP devices onto one public IP by allocating distinct source ports.",
    noteRef: "sec-07-lo09",
    reviewed: false
  },
  {
    loId: "sec-07-lo09",
    type: "scenario",
    difficulty: 3,
    id: "sec-07-q34",
    stem: "A company's 10,000 workstations share a single public IP via PAT. At peak hours, new outbound web connections fail intermittently. What is the root cause?",
    options: [
      { id: "a", text: "Source Port Exhaustion: the NAT gateway has exhausted the ~65,000 available ephemeral port allocations for that single public IP." },
      { id: "b", text: "The internet backbone ran out of fiber optic bandwidth." },
      { id: "c", text: "The workstations' Ethernet cards entered sleep mode." },
      { id: "d", text: "DNS root servers blocked the corporate domain." }
    ],
    answer: ["a"],
    explanation: "A single IP has 65,535 ports; heavy outbound traffic exhausts available ports, causing connection drops.",
    noteRef: "sec-07-lo09",
    reviewed: false
  }
];

balanceAndSave('cybersecurity', 'network-defense-firewalls-and-ids-ips', ch07Objectives, ch07Questions);
console.log("Batch 7 complete!");
