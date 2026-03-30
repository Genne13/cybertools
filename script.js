/* ============================================================
   MATRIX RAIN
============================================================ */
(function(){
  const canvas = document.getElementById('matrix');
  const ctx = canvas.getContext('2d');
  const chars = '0123456789!@#$%^&*()_+-={}[]<>:",.?/|ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const fontSize = 13;
  let cols, drops;

  function resize(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cols = Math.floor(canvas.width / fontSize);
    drops = Array(cols).fill(0).map(() => Math.random() * -80);
  }

  resize();
  window.addEventListener('resize', resize);

  function draw(){
    ctx.fillStyle = 'rgba(1,15,10,0.15)';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    for(let i=0;i<cols;i++){
      const y = drops[i]*fontSize;
      ctx.fillStyle='#afffdf';
      ctx.font=`bold ${fontSize}px 'Share Tech Mono',monospace`;
      ctx.fillText(chars[Math.floor(Math.random()*chars.length)],i*fontSize,y);
      ctx.fillStyle='#00c98a';
      ctx.font=`${fontSize}px 'Share Tech Mono',monospace`;
      ctx.fillText(chars[Math.floor(Math.random()*chars.length)],i*fontSize,y-fontSize);
      ctx.fillStyle='#005c3f';
      ctx.fillText(chars[Math.floor(Math.random()*chars.length)],i*fontSize,y-fontSize*2);
      if(y>canvas.height && Math.random()>0.975) drops[i]=0;
      drops[i]+=0.5;
    }
  }

  setInterval(draw,40);
})();

/* ============================================================
   PAGE ROUTER
============================================================ */
function showPage(id){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById('page-'+id).classList.add('active');
  window.scrollTo(0,0);
  if(id==='modules') buildModulesGrid();
}

/* ============================================================
   PRICING POPUP
============================================================ */
function openPricingPopup(){
  document.getElementById('pricingPopup').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closePricingPopup(){
  document.getElementById('pricingPopup').classList.remove('open');
  document.body.style.overflow = '';
}
document.getElementById('pricingPopup').addEventListener('click', function(e){
  if(e.target === this) closePricingPopup();
});

/* ============================================================
   LAUNCH ANIMATION  — NEW SECTION ONLY
============================================================ */
(function(){
  // ── helpers ────────────────────────────────────────────────
  const overlay   = document.getElementById('launchAnimOverlay');
  const vaultDoor = document.getElementById('vaultDoor');
  const irisCore  = document.getElementById('irisCore');
  const textWrap  = document.getElementById('launchTextWrap');
  const mainText  = document.getElementById('launchMainText');
  const subText   = document.getElementById('launchSubText');
  const rings     = [
    document.getElementById('ring1'),
    document.getElementById('ring2'),
    document.getElementById('ring3'),
    document.getElementById('ring4'),
  ];

  // size rings as % of container
  const ringPct = [0.98, 0.84, 0.70, 0.56];
  function sizeRings(){
    const size = document.getElementById('irisWrap').offsetWidth;
    rings.forEach((r,i)=>{
      const s = size * ringPct[i];
      r.style.width  = s + 'px';
      r.style.height = s + 'px';
    });
  }
  window.addEventListener('resize', sizeRings);

  // ── hex grid canvas ─────────────────────────────────────────
  const hexC   = document.getElementById('hexCanvas');
  const hexCtx = hexC.getContext('2d');
  let hexPhase = 0;

  function resizeHex(){
    hexC.width  = window.innerWidth;
    hexC.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeHex);
  resizeHex();

  function drawHexGrid(alpha){
    hexCtx.clearRect(0,0,hexC.width,hexC.height);
    hexCtx.globalAlpha = alpha;
    const R = 38, h = R * Math.sqrt(3);
    const cols = Math.ceil(hexC.width  / (R*3)) + 2;
    const rows = Math.ceil(hexC.height / h) + 2;
    hexCtx.strokeStyle = '#00ffb3';
    hexCtx.lineWidth   = 0.6;

    for(let row=-1; row<rows; row++){
      for(let col=-1; col<cols; col++){
        const x = col * R * 3 + (row%2) * R * 1.5;
        const y = row * h;
        hexCtx.beginPath();
        for(let k=0;k<6;k++){
          const angle = Math.PI/180 * (60*k - 30);
          const px = x + R * Math.cos(angle);
          const py = y + R * Math.sin(angle);
          k===0 ? hexCtx.moveTo(px,py) : hexCtx.lineTo(px,py);
        }
        hexCtx.closePath();
        hexCtx.stroke();
      }
    }
    hexCtx.globalAlpha = 1;
  }

  // ── particle burst canvas ───────────────────────────────────
  const lc  = document.getElementById('launchCanvas');
  const lct = lc.getContext('2d');
  let particles = [];

  function resizeLaunch(){
    lc.width  = window.innerWidth;
    lc.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeLaunch);
  resizeLaunch();

  function spawnParticles(){
    const cx = lc.width/2, cy = lc.height/2;
    for(let i=0; i<180; i++){
      const angle = Math.random()*Math.PI*2;
      const speed = 1.5 + Math.random()*4.5;
      particles.push({
        x: cx, y: cy,
        vx: Math.cos(angle)*speed,
        vy: Math.sin(angle)*speed,
        life: 1,
        decay: 0.008 + Math.random()*0.012,
        size: 1.2 + Math.random()*2.5,
        trail: []
      });
    }
  }

  function updateParticles(){
    lct.clearRect(0,0,lc.width,lc.height);
    particles = particles.filter(p => p.life > 0);
    particles.forEach(p => {
      p.trail.push({x:p.x, y:p.y});
      if(p.trail.length > 8) p.trail.shift();
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.985;
      p.vy *= 0.985;
      p.life -= p.decay;

      // trail
      if(p.trail.length > 1){
        lct.beginPath();
        lct.moveTo(p.trail[0].x, p.trail[0].y);
        p.trail.forEach(pt => lct.lineTo(pt.x, pt.y));
        lct.strokeStyle = `rgba(0,255,179,${p.life*0.35})`;
        lct.lineWidth = p.size * 0.5;
        lct.stroke();
      }

      lct.beginPath();
      lct.arc(p.x, p.y, p.size*p.life, 0, Math.PI*2);
      lct.fillStyle = `rgba(0,255,179,${p.life*0.9})`;
      lct.fill();
    });
  }

  // ── Web Audio mechanized sound ───────────────────────────────
  let audioCtx = null;

  function buildSound(){
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.7, 0);
    masterGain.connect(audioCtx.destination);

    const totalDur = 4.8; // seconds — matches animation

    /* 1. Deep mechanical hum */
    function addHum(freq, start, dur, vol){
      const osc  = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime + start);
      gain.gain.setValueAtTime(0, audioCtx.currentTime + start);
      gain.gain.linearRampToValueAtTime(vol,   audioCtx.currentTime + start + 0.15);
      gain.gain.linearRampToValueAtTime(vol,   audioCtx.currentTime + start + dur - 0.15);
      gain.gain.linearRampToValueAtTime(0,     audioCtx.currentTime + start + dur);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(audioCtx.currentTime + start);
      osc.stop(audioCtx.currentTime + start + dur);
    }

    addHum(55,  0.0, 4.8, 0.15);   // bass foundation
    addHum(110, 0.0, 4.8, 0.08);   // octave above

    /* 2. Servo / ratchet clicks — vault opening */
    const clickTimes = [0.15,0.35,0.55,0.72,0.88,1.02,1.18,1.32,1.48,1.62,1.76,1.88];
    clickTimes.forEach(t => {
      const buf = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.04, audioCtx.sampleRate);
      const data = buf.getChannelData(0);
      for(let i=0;i<data.length;i++){
        data[i] = (Math.random()*2-1) * Math.pow(1 - i/data.length, 3) * 0.9;
      }
      const src  = audioCtx.createBufferSource();
      const filt = audioCtx.createBiquadFilter();
      const g    = audioCtx.createGain();
      src.buffer = buf;
      filt.type  = 'bandpass';
      filt.frequency.value = 1800 + Math.random()*600;
      filt.Q.value = 2;
      g.gain.value = 0.6;
      src.connect(filt);
      filt.connect(g);
      g.connect(masterGain);
      src.start(audioCtx.currentTime + t);
    });

    /* 3. Rising power-up sweep */
    const sweep = audioCtx.createOscillator();
    const sweepGain = audioCtx.createGain();
    sweep.type = 'triangle';
    sweep.frequency.setValueAtTime(80,   audioCtx.currentTime + 0.5);
    sweep.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 2.8);
    sweepGain.gain.setValueAtTime(0,     audioCtx.currentTime + 0.5);
    sweepGain.gain.linearRampToValueAtTime(0.18, audioCtx.currentTime + 1.4);
    sweepGain.gain.linearRampToValueAtTime(0.22, audioCtx.currentTime + 2.4);
    sweepGain.gain.linearRampToValueAtTime(0,    audioCtx.currentTime + 2.8);
    sweep.connect(sweepGain);
    sweepGain.connect(masterGain);
    sweep.start(audioCtx.currentTime + 0.5);
    sweep.stop(audioCtx.currentTime + 2.8);

    /* 4. Electric buzz layer */
    const buzzBuf  = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.5, audioCtx.sampleRate);
    const buzzData = buzzBuf.getChannelData(0);
    for(let i=0;i<buzzData.length;i++) buzzData[i] = Math.random()*2-1;
    const buzzSrc  = audioCtx.createBufferSource();
    const buzzFilt = audioCtx.createBiquadFilter();
    const buzzGain = audioCtx.createGain();
    buzzSrc.buffer = buzzBuf;
    buzzSrc.loop   = true;
    buzzFilt.type  = 'bandpass';
    buzzFilt.frequency.value = 220;
    buzzFilt.Q.value = 8;
    buzzGain.gain.setValueAtTime(0,    audioCtx.currentTime + 1.6);
    buzzGain.gain.linearRampToValueAtTime(0.09, audioCtx.currentTime + 2.0);
    buzzGain.gain.linearRampToValueAtTime(0.09, audioCtx.currentTime + 3.4);
    buzzGain.gain.linearRampToValueAtTime(0,    audioCtx.currentTime + 3.9);
    buzzSrc.connect(buzzFilt);
    buzzFilt.connect(buzzGain);
    buzzGain.connect(masterGain);
    buzzSrc.start(audioCtx.currentTime + 1.6);
    buzzSrc.stop(audioCtx.currentTime + 4.0);

    /* 5. Final confirmation chime */
    function addChime(freq, start){
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = 'sine';
      o.frequency.value = freq;
      g.gain.setValueAtTime(0, audioCtx.currentTime + start);
      g.gain.linearRampToValueAtTime(0.25, audioCtx.currentTime + start + 0.04);
      g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + start + 0.8);
      o.connect(g);
      g.connect(masterGain);
      o.start(audioCtx.currentTime + start);
      o.stop(audioCtx.currentTime + start + 0.85);
    }
    addChime(880, 3.1);
    addChime(1108, 3.25);
    addChime(1320, 3.38);

    /* master fade-out at end */
    masterGain.gain.setValueAtTime(0.7, audioCtx.currentTime + 4.3);
    masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + totalDur);
  }

  // ── main animation sequence ─────────────────────────────────
  let animRunning = false;
  let rafId = null;
  let hexAlpha = 0;
  let hexTarget = 0;
  let coreScale = 0;
  let coreAlpha = 0;
  let burstActive = false;

  function animLoop(){
    // hex fade
    hexAlpha += (hexTarget - hexAlpha) * 0.06;
    if(hexAlpha > 0.002) drawHexGrid(hexAlpha);
    if(burstActive) updateParticles();
    if(animRunning) rafId = requestAnimationFrame(animLoop);
  }

  function t(ms){ return new Promise(res => setTimeout(res, ms)); }

  async function runSequence(){
    sizeRings();

    // phase 0: hex grid fades in
    hexTarget = 1;
    await t(400);

    // phase 1: outer rings burst in one by one
    for(let i=0; i<rings.length; i++){
      const r = rings[i];
      r.style.transition = 'opacity 0.35s ease, transform 0.55s cubic-bezier(0.22,1,0.36,1)';
      r.style.opacity    = '1';
      r.style.transform  = 'scale(1)';

      // spinning tick marks on ring 1
      if(i===0){
        r.style.animation = 'none';
        r.style.borderStyle = 'dashed';
        setTimeout(()=>{
          r.style.transition = '';
          r.style.animation  = 'spin 7s linear infinite';
        }, 600);
      }
      await t(220);
    }

    // phase 2: vault petals open (simulate gear clicking sound)
    await t(300);
    document.querySelectorAll('.vault-petal').forEach(p => p.classList.add('open'));

    // phase 3: inner core glow grows
    await t(700);
    irisCore.style.transition = 'opacity 0.6s ease, width 0.8s cubic-bezier(0.22,1,0.36,1), height 0.8s cubic-bezier(0.22,1,0.36,1)';
    irisCore.style.opacity    = '1';
    irisCore.style.width      = '55%';
    irisCore.style.height     = '55%';

    // phase 4: particle burst
    await t(500);
    burstActive = true;
    spawnParticles();

    // phase 5: text appears
    await t(400);
    textWrap.style.transition = 'opacity 0.4s ease';
    textWrap.style.opacity    = '1';
    mainText.style.animation  = 'typewriter 2s steps(38,end) forwards, blinkCaret 0.6s step-end infinite';
    mainText.style.width      = '0';

    await t(2100);
    subText.style.animation = 'fadeInSub 0.6s ease forwards';

    // phase 6: hold, then fade out overlay
    await t(1800);
    overlay.style.transition = 'opacity 0.9s ease';
    overlay.style.opacity    = '0';

    await t(950);
    closeLaunchAnim();
    showPage('launch');
  }

  function closeLaunchAnim(){
    animRunning = false;
    cancelAnimationFrame(rafId);
    overlay.classList.remove('open');
    overlay.style.opacity   = '';
    overlay.style.transition= '';
    document.body.style.overflow = '';

    // reset rings
    rings.forEach(r=>{
      r.style.transition = '';
      r.style.opacity    = '0';
      r.style.transform  = 'scale(2.2)';
      r.style.animation  = '';
      r.style.borderStyle= '';
    });

    // reset petals
    document.querySelectorAll('.vault-petal').forEach(p => p.classList.remove('open'));

    // reset core
    irisCore.style.transition = '';
    irisCore.style.opacity    = '0';
    irisCore.style.width      = '20%';
    irisCore.style.height     = '20%';

    // reset text
    textWrap.style.opacity   = '0';
    textWrap.style.transition= '';
    mainText.style.animation = 'none';
    mainText.style.width     = '0';
    subText.style.animation  = 'none';

    hexAlpha = 0;
    hexTarget = 0;
    hexCtx.clearRect(0,0,hexC.width,hexC.height);
    lct.clearRect(0,0,lc.width,lc.height);
    particles = [];
    burstActive = false;
  }

  // spin keyframe (can't put dynamic in CSS, add via style tag)
  const spinStyle = document.createElement('style');
  spinStyle.textContent = `@keyframes spin { from{transform:rotate(0deg) scale(1)} to{transform:rotate(360deg) scale(1)} }`;
  document.head.appendChild(spinStyle);

  // expose globally
  window.triggerLaunchAnim = function(){
    if(animRunning) return;
    animRunning = true;
    overlay.style.opacity = '1';
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    buildSound();
    rafId = requestAnimationFrame(animLoop);
    runSequence();
  };
})();

/* ============================================================
   TOOLS DATA
============================================================ */
const tools = [
  {
    name: 'NMAP',
    full: 'Network Mapper (NMAP)',
    category: 'NETWORK RECONNAISSANCE',
    badge: 'active',
    desc: 'Nmap is a free, open-source network scanner used to discover hosts and services on a computer network. It sends crafted packets and analyzes responses to map open ports, detect OS fingerprints, and identify running services.',
    img: 'https://www.devopsschool.com/blog/wp-content/uploads/2023/09/image-462.png',
    imgLabel: 'NMAP — PORT SCAN OUTPUT',
    tags: ['Port Scanning','OS Detection','Service Version','Scripting Engine'],
    specs: { Platform:'Cross-platform', License:'GPLv2', Language:'C / Lua', Type:'Network Scanner' }
  },
  {
    name: 'METASPLOIT',
    full: 'Metasploit Framework',
    category: 'EXPLOIT DEVELOPMENT',
    badge: 'active',
    desc: 'Metasploit is a penetration testing framework used to develop and execute security testing modules. It helps simulate attacks to verify vulnerabilities and improve defenses.',
    img: 'https://img-c.udemycdn.com/course/480x270/4308347_93c7_3.jpg',
    imgLabel: 'METASPLOIT FRAMEWORK',
    tags: ['Payloads','Post-Exploitation','Meterpreter','Modules'],
    specs: { Platform:'Cross-platform', License:'BSD', Language:'Ruby', Type:'Security Framework' }
  },
  {
    name: 'WIRESHARK',
    full: 'Wireshark Packet Analyzer',
    category: 'TRAFFIC ANALYSIS',
    badge: 'active',
    desc: 'Wireshark is a network protocol analyzer that captures and inspects packets in real-time. It is widely used for troubleshooting, security auditing, and deep packet inspection.',
    img: 'https://i.pinimg.com/736x/08/b1/42/08b1427e15f0bbda5f3c4c2868bb6a5e.jpg',
    imgLabel: 'WIRESHARK — LIVE CAPTURE',
    tags: ['Packet Capture','Protocol Decode','PCAP Export'],
    specs: { Platform:'Cross-platform', License:'GPLv2', Language:'C', Type:'Packet Analyzer' }
  },
  {
    name: 'BURP SUITE',
    full: 'Burp Suite',
    category: 'WEB APP SECURITY',
    badge: 'active',
    desc: 'Burp Suite is a platform for testing web application security. It includes tools like proxy interception, scanner, intruder, repeater, and spider for vulnerability analysis.',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9ikw1Ufd930Im8-HT1f7PfssGEX-_-rp1Xg&s',
    imgLabel: 'BURP SUITE — INTERCEPTOR',
    tags: ['Proxy','Scanner','Intruder','Repeater'],
    specs: { Platform:'Cross-platform', License:'Commercial', Language:'Java', Type:'Web Security' }
  },
  {
    name: 'JOHN THE RIPPER',
    full: 'John the Ripper', 
    category: 'PASSWORD CRACKING', 
    badge: 'active', 
    desc: 'John the Ripper is a fast password security auditing and recovery tool available for many operating systems. It is designed to detect weak Unix passwords, and supports hundreds of hash and cipher types including traditional DES-based, MD5, Blowfish, and NTLM hashes. It auto-detects hash types and supports wordlists, rules-based mutations, and brute-force attacks.', 
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJ3ftNINv0UZOag-3e7TxXDdOp_Y2UubeeBA&s', 
    imgLabel: 'JTR — HASH CRACKING', 
    tags: ['Hash Cracking','Wordlist Attack','Brute Force','NTLM','MD5','SHA Hashes'], 
    specs: { Platform:'Cross-platform', 
    License:'GPLv2', 
    Language:'C', 
    Type:'Password Cracker' }
  },
  {
    name: 'AIRCRACK-NG', full: 'Aircrack-NG Suite', category: 'WIRELESS AUDITING', badge: 'active', desc: 'Aircrack-ng is a complete suite of tools for assessing Wi-Fi network security. It focuses on key areas of network security: monitoring (packet capture), attacking (replay attacks, deauthentication), testing (checking Wi-Fi cards and driver capabilities), and cracking (WEP and WPA/WPA2-PSK). It works with any wireless network interface that supports raw monitoring mode.', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0P5lA6M3g8PTqQjgB8Hvux6MA_NfdKKl07w&s', imgLabel: 'AIRCRACK-NG — WPA CRACK', tags: ['WEP Crack','WPA2 Crack','Packet Capture','Deauth Attack','Monitor Mode'], specs: { Platform:'Linux / macOS', License:'GPLv2', Language:'C', Type:'Wireless Auditor' }
  },
  {
    name: 'SQLMAP', full: 'SQLMap — SQL Injection Tool', category: 'DATABASE EXPLOITATION', badge: 'active', desc: 'SQLMap is an open-source penetration testing tool that automates the detection and exploitation of SQL injection flaws and the taking over of database servers. It comes with a powerful detection engine, many niche features for the ultimate penetration tester, and a broad range of switches lasting from database fingerprinting, over data fetching to accessing underlying file systems.', img: 'https://www.tevora.com/wp-content/uploads/2021/08/Threat_Logo_skull_Final01-002.png', imgLabel: 'SQLMAP — DB EXTRACTION', tags: ['SQL Injection','DB Fingerprint','Data Extraction','Shell Upload','Blind SQLi','Union Attack'], specs: { Platform:'Cross-platform', License:'GPLv2', Language:'Python', Type:'Injection Tool' }
  },
  {
    name: 'HYDRA', full: 'THC Hydra', category: 'BRUTE FORCE ATTACK', badge: 'active', desc: 'Hydra is a parallelized network login cracker which supports numerous protocols for remote authentication. It is very fast and flexible, and new modules are easy to add. This tool makes it possible for researchers and security consultants to show how easy it would be to gain unauthorized access to a system remotely. Supports SSH, FTP, HTTP, SMB, databases, and dozens more.', img: 'https://media.licdn.com/dms/image/v2/D4D12AQGNtliq-sLp9A/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1702533539636?e=2147483647&v=beta&t=ozfFoo8yyaMl_QPSlfeosHkGugtx-gT8oPlQZgguKNc', imgLabel: 'HYDRA — LOGIN BRUTE FORCE', tags: ['SSH Brute Force','HTTP Auth','FTP Crack','SMB Attack','Parallel Threads'], specs: { Platform:'Linux / macOS / Win', License:'AGPLv3', Language:'C', Type:'Login Cracker' }
  },
  {
    name: 'NIKTO', full: 'Nikto Web Scanner', category: 'WEB VULNERABILITY SCAN', badge: 'active', desc: 'Nikto is an open-source web server scanner which performs comprehensive tests against web servers for multiple items, including over 6700 potentially dangerous files/programs. It checks for outdated versions of web server software, server configuration issues, and installed web software such as CMS platforms. It supports SSL, proxies, host authentication, and report generation.', img: 'https://laboratoriolinux.es/images/stories/2024/05/KaliLinux.jpg', imgLabel: 'NIKTO — WEB SCAN', tags: ['Web Server Scan','Outdated Software','Config Errors','SSL Testing','6700+ Checks'], specs: { Platform:'Cross-platform', License:'GPLv2', Language:'Perl', Type:'Web Scanner' }
  },
  {
    name: 'HASHCAT', full: 'Hashcat — Password Recovery', category: 'HASH CRACKING', badge: 'active', desc: 'Hashcat is the world\'s fastest and most advanced password recovery utility, supporting five unique modes of attack for over 300 highly optimized hashing algorithms. It uses GPU acceleration for unprecedented cracking speeds and supports distributed cracking across multiple devices and nodes. Ideal for cracking MD5, SHA, bcrypt, WPA2, and complex combined hash types.', img: 'https://www.hackthebox.com/storage/blog/s1PNBB3zHFFtvCS3XAxKYHbUDSIbsBG0.jpghttps://www.hackthebox.com/storage/blog/s1PNBB3zHFFtvCS3XAxKYHbUDSIbsBG0.jpg', imgLabel: 'HASHCAT — GPU CRACKING', tags: ['GPU Acceleration','300+ Hash Types','Dictionary Attack','Rule Engine','WPA2 Crack'], specs: { Platform:'Cross-platform', License:'MIT', Language:'C / OpenCL', Type:'Hash Cracker' }
  },
  {
    name: 'GOBUSTER', full: 'Gobuster — Directory Bruteforcer', category: 'ENUMERATION', badge: 'beta', desc: 'Gobuster is a tool used to brute-force URIs (directories and files) in web sites, DNS subdomains, virtual host names on target web servers, Open Amazon S3 buckets, and Google Cloud buckets. It is particularly fast due to its concurrent execution model and is used in CTFs and real-world pentests to discover hidden endpoints and subdomains not linked from the main application.', img: 'https://media.licdn.com/dms/image/v2/D5612AQE0klAZIxa4oQ/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1723386061745?e=2147483647&v=beta&t=pFexdu6IFngRGbBUrQAVaLJDTi4nPk4GBecBFWpBnck', imgLabel: 'GOBUSTER — DIR SCAN', tags: ['Directory Brute','DNS Enumeration','Vhost Discovery','S3 Buckets','High Speed'], specs: { Platform:'Cross-platform', License:'Apache 2.0', Language:'Go', Type:'Enumerator' }
  },
  {
    name: 'SHODAN', full: 'Shodan Intelligence Engine', category: 'OSINT / RECON', badge: 'beta', desc: 'Shodan is a search engine for Internet-connected devices. Unlike traditional web search engines, Shodan crawls for banners from servers, routers, webcams, IoT devices, industrial control systems, and more. Security researchers use it to find exposed systems, analyze internet-wide exposure, and discover vulnerable services before attackers do. Often called "the Google of hackers."', img: 'https://upload.wikimedia.org/wikipedia/en/c/cb/SystemShock2-Shodan.png', imgLabel: 'SHODAN — DEVICE SEARCH', tags: ['IoT Discovery','Exposed Services','Banner Grabbing','CVE Search','Global Scan Data'], specs: { Platform:'Web / API', License:'Commercial', Language:'Python API', Type:'OSINT Engine' }
  },
  {
    name: 'MALTEGO', full: 'Maltego — Link Analysis', category: 'OSINT / LINK ANALYSIS', badge: 'beta', desc: 'Maltego is an open-source intelligence and graphical link analysis tool for gathering and connecting information for investigative tasks. It uses "Transforms" — automated queries — to pull data from public sources and visualize relationships between entities like domains, IP addresses, people, organizations, and social profiles. Widely used in digital forensics and threat intelligence.', img: 'https://networkwalks.com/wp-content/uploads/2021/05/Maltego-lab.png', imgLabel: 'MALTEGO — LINK MAP', tags: ['OSINT Gathering','Link Analysis','DNS Mapping','Social Profiling','Threat Intel'], specs: { Platform:'Cross-platform', License:'Freemium', Language:'Java', Type:'OSINT / Forensics' }
  },
  {
    name: 'OPENVAS', full: 'OpenVAS Vulnerability Scanner', category: 'VULNERABILITY SCANNING', badge: 'beta', desc: 'OpenVAS (Open Vulnerability Assessment System) is a full-featured vulnerability scanner with thousands of Network Vulnerability Tests (NVTs) updated daily. It identifies security issues across network services, operating systems, and applications. Part of the Greenbone Vulnerability Management solution, it is the gold standard for open-source comprehensive vulnerability assessments.', img: 'https://www.openvas.org/img/inmenulogo.svg', imgLabel: 'OPENVAS — VULN REPORT', tags: ['CVE Detection','NVT Database','Risk Scoring','CVSS Rating','Network Scan'], specs: { Platform:'Linux', License:'GPLv2', Language:'C / Python', Type:'Vuln Scanner' }
  }
];

/* TOOL ICONS */
const toolIcons = [
  `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>`,
  `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,
  `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
  `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`
];

let gridBuilt = false;

function buildModulesGrid(){
  if(gridBuilt) return;
  gridBuilt = true;
  const grid = document.getElementById('modulesGrid');
  tools.forEach((t, i) => {
    const card = document.createElement('div');
    card.className = 'module-card';
    card.innerHTML = `
      <span class="module-card-num">0${String(i+1).padStart(2,'0')}</span>
      <div class="module-card-icon">${toolIcons[i % toolIcons.length]}</div>
      <div class="module-card-info">
        <div class="module-card-name">${t.name}</div>
        <div class="module-card-desc">${t.category}</div>
      </div>
      <span class="module-card-badge ${t.badge === 'active' ? 'badge-active' : 'badge-beta'}">${t.badge.toUpperCase()}</span>
    `;
    card.addEventListener('click', () => openToolPopup(i));
    grid.appendChild(card);
  });
}

function openToolPopup(i){
  const t = tools[i];
  document.getElementById('popupImg').src = t.img;
  document.getElementById('popupImg').alt = t.full;
  document.getElementById('popupImgLabel').textContent = t.imgLabel;
  document.getElementById('popupCategory').textContent = '// ' + t.category;
  document.getElementById('popupName').textContent = t.full;
  document.getElementById('popupDesc').textContent = t.desc;
  document.getElementById('popupTags').innerHTML =
    t.tags.map(tag => `<span class="tool-tag">${tag}</span>`).join('');
  document.getElementById('popupSpecs').innerHTML =
    Object.entries(t.specs).map(([k,v]) =>
      `<div><div class="spec-label">${k.toUpperCase()}</div><div class="spec-val">${v}</div></div>`
    ).join('');
  document.getElementById('toolPopup').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeToolPopup(){
  document.getElementById('toolPopup').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('toolPopup').addEventListener('click', function(e){
  if(e.target === this) closeToolPopup();
});

document.addEventListener('keydown', e => {
  if(e.key === 'Escape') {
    closeToolPopup();
    closePricingPopup();
  }
});