/* ============================================================
   ปฏิกิริยาการเกิดพอลิเมอร์ — Polymerization Reaction Game
   Single Page Application engine
   ============================================================ */
(function () {
  'use strict';

  /* =========================================================
     0) EMBEDDED CSV FALLBACK
     ใช้เมื่อเปิดไฟล์แบบ file:// ซึ่ง fetch() จะถูกบล็อกโดย CORS
     ========================================================= */
  var EMBEDDED_CSV = {
    type1: String.raw`ข้อ,โชว์โจทย์: สารตั้งต้น (ซ้าย),หาใน Shuffle Pool: พอลิเมอร์ (ขวา),The Lock (บังคับเลือก)
1,n CH2=CH2,[-CH2-CH2-]n,💧 เติม (Addition)
2,n CH2=CH-R (แบบ Free-Radical),[-CH2-CH(R)-]n,💧 เติม (Addition)
3,n CH2=CH-R (แบบ Cationic),[-CH2-CH(R)-]n,💧 เติม (Addition)
4,n CH2=CH-R (แบบ Anionic),[-CH2-CH(R)-]n,💧 เติม (Addition)
5,n CH2=CH2 (แบบ Coordination),[-CH2-CH2-]n,💧 เติม (Addition)
6,วงแหวน Cyclic ester/ether (ROP),[-O-(CH2)4-CO-]n,💧 เติม (Addition)
7,n HO-R-OH + n HOOC-R'-COOH,[-O-R-OCO-R'-CO-]n,☁️ ควบแน่น (Condensation)
8,n H2N-R-NH2 + n HOOC-R'-COOH,[-NH-R-NH-CO-R'-CO-]n,☁️ ควบแน่น (Condensation)
9,n HO-R-OH + n HOOC-R'-COOH,[-O-R-OCO-R'-CO-]n,☁️ ควบแน่น (Condensation)
10,n HO-R-OH + n OCN-R'-NCO,[-O-R-O-CO-NH-R'-NH-CO-]n,☁️ ควบแน่น (Condensation)
11,n H2N-R-NH2 + n OCN-R'-NCO,[-NH-R-NH-CO-NH-R'-NH-CO-]n,☁️ ควบแน่น (Condensation)
12,n Phenol (วงเบนซีน-OH) + n HCHO,[-Phenol-CH2-]n,☁️ ควบแน่น (Condensation)
13,วงแหวนสามเหลี่ยม Epoxy (ROP),[-CH2-CH(OH)-O-]n,💧 เติม (Addition)
14,n HO-R-OH + n Cl-CO-R'-CO-Cl,[-O-R-O-CO-R'-CO-]n,☁️ ควบแน่น (Condensation)
15,n HO-R-OH + n Cl-SO2-R'-SO2-Cl,[-O-R-O-SO2-R'-SO2-]n,☁️ ควบแน่น (Condensation)
16,n (HO-SiR2-OH) + n (HO-SiR2-OH),[-Si(R2)-O-]n,☁️ ควบแน่น (Condensation)
17,n CH2=CH-CH=CH2,[-CH2-CH=CH-CH2-]n,💧 เติม (Addition)
18,n HO-CH2-CH2-OH + n HOOC-Ph-COOH,[-O-CH2-CH2-O-CO-Ph-CO-]n,☁️ ควบแน่น (Condensation)
19,n CH2=CH-Cl,[-CH2-CH(Cl)-]n,💧 เติม (Addition)
20,n CH2=C(CH3)-COOCH3,[-CH2-C(CH3)(COOCH3)-]n,💧 เติม (Addition)`,

    type2: String.raw`ข้อ,โชว์โจทย์: พอลิเมอร์ (ขวา),หาใน Shuffle Pool: สารตั้งต้น (ซ้าย),The Lock (บังคับเลือก)
1,[-CH2-CH2-]n,n CH2=CH2,💧 เติม (Addition)
2,[-CH2-CH(R)-]n,n CH2=CH-R,💧 เติม (Addition)
3,[-O-(CH2)4-CO-]n,วงแหวน Cyclic ester/ether,💧 เติม (Addition)
4,[-O-R-OCO-R'-CO-]n,n HO-R-OH + n HOOC-R'-COOH,☁️ ควบแน่น (Condensation)
5,[-NH-R-NH-CO-R'-CO-]n,n H2N-R-NH2 + n HOOC-R'-COOH,☁️ ควบแน่น (Condensation)
6,[-O-R-O-CO-NH-R'-NH-CO-]n,n HO-R-OH + n OCN-R'-NCO,☁️ ควบแน่น (Condensation)
7,[-NH-R-NH-CO-NH-R'-NH-CO-]n,n H2N-R-NH2 + n OCN-R'-NCO,☁️ ควบแน่น (Condensation)
8,[-Phenol-CH2-]n,n Phenol (วงเบนซีน-OH) + n HCHO,☁️ ควบแน่น (Condensation)
9,[-CH2-CH(OH)-O-]n,วงแหวนสามเหลี่ยม Epoxy (ROP),💧 เติม (Addition)
10,[-O-R-O-CO-R'-CO-]n,n HO-R-OH + n Cl-CO-R'-CO-Cl,☁️ ควบแน่น (Condensation)
11,[-O-R-O-SO2-R'-SO2-]n,n HO-R-OH + n Cl-SO2-R'-SO2-Cl,☁️ ควบแน่น (Condensation)
12,[-Si(R2)-O-]n,n (HO-SiR2-OH) + n (HO-SiR2-OH),☁️ ควบแน่น (Condensation)
13,[-CH2-CH=CH-CH2-]n,n CH2=CH-CH=CH2,💧 เติม (Addition)
14,[-O-CH2-CH2-O-CO-Ph-CO-]n,n HO-CH2-CH2-OH + n HOOC-Ph-COOH,☁️ ควบแน่น (Condensation)
15,[-CH2-CH(Cl)-]n,n CH2=CH-Cl,💧 เติม (Addition)
16,[-CH2-C(CH3)(COOCH3)-]n,n CH2=C(CH3)-COOCH3,💧 เติม (Addition)`,

    type3: String.raw`ข้อ,โชว์โจทย์: ชื่อปฏิกิริยา / พอลิเมอร์,หาใน Shuffle Pool: ภาพสมการฉบับเต็ม,The Lock (บังคับเลือก)
1,Addition Polymerization,n CH2=CH2 -> [-CH2-CH2-]n,💧 เติม (Addition)
2,Free-Radical Polymerization,"n CH2=CH-R --(R*, Δ)--> [-CH2-CH(R)-]n",💧 เติม (Addition)
3,Cationic Polymerization,n CH2=CH-R --(H+)--> [-CH2-CH(R)-]n,💧 เติม (Addition)
4,Anionic Polymerization,n CH2=CH-R --(R- / Base)--> [-CH2-CH(R)-]n,💧 เติม (Addition)
5,Coordination (Ziegler-Natta),n CH2=CH2 --(TiCl4/AlR3)--> [-CH2-CH2-]n,💧 เติม (Addition)
6,Ring-Opening Polymerization (ROP),Cyclic ester/ether --(cat.)--> [-O-(CH2)4-CO-]n,💧 เติม (Addition)
7,Step-Growth Polymerization,"n HO-R-OH + n HOOC-R'-COOH --(Δ, -nH2O)--> [-O-R-OCO-R'-CO-]n",☁️ ควบแน่น (Condensation)
8,Polyamide Formation,"n H2N-R-NH2 + n HOOC-R'-COOH --(Δ, -2nH2O)--> [-NH-R-NH-CO-R'-CO-]n",☁️ ควบแน่น (Condensation)
9,Polyester Formation,"n HO-R-OH + n HOOC-R'-COOH --(Δ, -2nH2O)--> [-O-R-OCO-R'-CO-]n",☁️ ควบแน่น (Condensation)
10,Polyurethane Formation,n HO-R-OH + n OCN-R'-NCO --(cat.)--> [-O-R-O-CO-NH-R'-NH-CO-]n,☁️ ควบแน่น (Condensation)
11,Polyurea Formation,n H2N-R-NH2 + n OCN-R'-NCO --(cat.)--> [-NH-R-NH-CO-NH-R'-NH-CO-]n,☁️ ควบแน่น (Condensation)
12,Phenol-Formaldehyde Resin,n Phenol + n HCHO --(acid/base)--> [-Phenol-CH2-]n,☁️ ควบแน่น (Condensation)
13,Epoxy Polymerization,Epoxy Ring --(cat.)--> [-CH2-CH(OH)-O-]n,💧 เติม (Addition)
14,Polycarbonate Formation,"n HO-R-OH + n Cl-CO-R'-CO-Cl --(base, -2nHCl)--> [-O-R-O-CO-R'-CO-]n",☁️ ควบแน่น (Condensation)
15,Polysulfone Formation,"n HO-R-OH + n Cl-SO2-R'-SO2-Cl --(base, -2nHCl)--> [-O-R-O-SO2-R'-SO2-]n",☁️ ควบแน่น (Condensation)
16,Silicone (Condensation),"n (HO-SiR2-OH) + n (HO-SiR2-OH) --(Δ, -2nH2O)--> [-Si(R2)-O-]n",☁️ ควบแน่น (Condensation)
17,Addition Polymerization of Dienes,n CH2=CH-CH=CH2 --(initiator)--> [-CH2-CH=CH-CH2-]n,💧 เติม (Addition)
18,Poly(ethylene terephthalate),"n HO-CH2-CH2-OH + n HOOC-Ph-COOH --(Δ, -2nH2O)--> [-O-CH2-CH2-O-CO-Ph-CO-]n",☁️ ควบแน่น (Condensation)
19,Poly(vinyl chloride) Formation,n CH2=CH-Cl --(initiator)--> [-CH2-CH(Cl)-]n,💧 เติม (Addition)
20,Poly(methyl methacrylate),n CH2=C(CH3)-COOCH3 --(initiator)--> [-CH2-C(CH3)(COOCH3)-]n,💧 เติม (Addition)`
  };

  /* =========================================================
     1) UTILITIES
     ========================================================= */
  var $ = function (id) { return document.getElementById(id); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  /** RFC-4180-ish CSV parser (handles quoted fields + escaped quotes). */
  function parseCSV(text) {
    var rows = [], row = [], field = '', inQuotes = false;
    text = String(text).replace(/^﻿/, '').replace(/\r\n?/g, '\n');
    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      if (inQuotes) {
        if (c === '"') {
          if (text[i + 1] === '"') { field += '"'; i++; }
          else { inQuotes = false; }
        } else { field += c; }
      } else if (c === '"') { inQuotes = true; }
      else if (c === ',') { row.push(field); field = ''; }
      else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
      else { field += c; }
    }
    if (field !== '' || row.length) { row.push(field); rows.push(row); }
    return rows.filter(function (r) { return r.length > 1 && r.join('').trim() !== ''; });
  }

  /** "💧 เติม (Addition)" -> "addition" ; "☁️ ควบแน่น (Condensation)" -> "condensation" */
  function normalizeLock(raw) {
    var s = String(raw || '').toLowerCase();
    if (s.indexOf('condensation') >= 0 || s.indexOf('ควบแน่น') >= 0) return 'condensation';
    return 'addition';
  }

  var LOCK_META = {
    addition:     { th: 'เติม',    en: 'Addition',     cls: 't-add' },
    condensation: { th: 'ควบแน่น', en: 'Condensation', cls: 't-cond' }
  };

  /* ภาพโซ่โมเลกุลที่ตัดมาจาก ui-bg.png — ใช้ตกแต่งการ์ดเท่านั้น
     สุ่มแบบไม่อิงชนิดปฏิกิริยา เพื่อไม่ให้เฉลยคำตอบของบัวรดน้ำ */
  var CHAIN_SPRITES = [
    'chain-a', 'chain-b', 'chain-c', 'chain-d',
    'chain-e', 'chain-f', 'chain-g', 'chain-h'
  ];

  /* =========================================================
     ภาพสมการเคมี (assets/images/eq/)
     ตัดมาจาก assets/imagesforselect/ — 20 ปฏิกิริยา × 3 รูป
     (r{nn}-name = ชื่อปฏิกิริยา, r{nn}-mono = สารตั้งต้น, r{nn}-poly = พอลิเมอร์)
     ========================================================= */
  var EQ_DIR = 'assets/images/eq/';

  /* แถวที่ i ของ CSV แต่ละชุด ตรงกับปฏิกิริยาลำดับใดในตาราง 20 PAIRS */
  var RXN_OF_ROW = {
    1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    2: [1, 2, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    3: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
  };

  /* ตัวเร่ง/เงื่อนไขเหนือลูกศร สำหรับประกอบเป็นสมการฉบับเต็ม */
  var RXN_COND = [
    '', 'initiator', 'R•, Δ', 'H⁺', 'R⁻ (or Base)', 'TiCl₄/AlR₃', 'cat.',
    'Δ, −n H₂O', 'Δ, −2n H₂O', 'Δ, −2n H₂O', 'cat.', 'cat.', 'acid / base',
    'cat.', 'base, −2n HCl', 'base, −2n HCl', 'Δ, −2n H₂O', 'initiator',
    'Δ, −2n H₂O', 'initiator', 'initiator'
  ];

  function eqSrc(rxn, kind) {
    return EQ_DIR + 'r' + (rxn < 10 ? '0' : '') + rxn + '-' + kind + '.png';
  }

  /** ใส่ข้อมูลรูปภาพให้โจทย์แต่ละข้อ ตามชนิดคำถาม */
  function attachArt(q, rowIndex) {
    var map = RXN_OF_ROW[q.type] || [];
    var rxn = map[rowIndex];
    if (!rxn) return;
    q.rxn = rxn;
    q.cond = RXN_COND[rxn] || 'cat.';
    if (q.type === 1) {                       // สารตั้งต้น -> พอลิเมอร์
      q.promptArt = { kind: 'img', src: eqSrc(rxn, 'mono') };
      q.answerArt = { kind: 'img', src: eqSrc(rxn, 'poly') };
    } else if (q.type === 2) {                // พอลิเมอร์ -> สารตั้งต้น
      q.promptArt = { kind: 'img', src: eqSrc(rxn, 'poly') };
      q.answerArt = { kind: 'img', src: eqSrc(rxn, 'mono') };
    } else {                                  // ชื่อปฏิกิริยา -> สมการฉบับเต็ม
      q.promptArt = { kind: 'img', src: eqSrc(rxn, 'name') };
      q.answerArt = {
        kind: 'eq',
        mono: eqSrc(rxn, 'mono'),
        poly: eqSrc(rxn, 'poly'),
        cond: q.cond
      };
    }
  }

  /** สร้าง HTML ของรูปคำตอบ (รูปเดี่ยว หรือสมการเต็มแบบเรียงบนล่าง) */
  function artHTML(art, cls) {
    if (!art) return '';
    if (art.kind === 'img') {
      return '<img class="' + cls + '" src="' + art.src + '" alt="" decoding="async">';
    }
    return '<span class="eq-stack">' +
             '<img class="' + cls + '" src="' + art.mono + '" alt="" decoding="async">' +
             '<span class="eq-arrow"><i>' + escapeHTML(art.cond) + '</i></span>' +
             '<img class="' + cls + '" src="' + art.poly + '" alt="" decoding="async">' +
           '</span>';
  }

  var TYPE_META = {
    1: { badge: 'สารตั้งต้น → พอลิเมอร์', ask: 'จงหา “พอลิเมอร์” ที่เกิดขึ้นจากสารตั้งต้นนี้' },
    2: { badge: 'พอลิเมอร์ → สารตั้งต้น', ask: 'จงหา “สารตั้งต้น (มอนอเมอร์)” ที่ใช้สังเคราะห์พอลิเมอร์นี้' },
    3: { badge: 'ชื่อปฏิกิริยา → สมการเต็ม', ask: 'จงหา “สมการฉบับเต็ม” ของปฏิกิริยานี้' }
  };

  /* =========================================================
     2) AUDIO SYSTEM (files + Web Audio synthetic fallback)
     ========================================================= */
  var Audio_ = {
    ctx: null,
    master: null,
    musicGain: null,
    sfxGain: null,
    muted: false,
    bgmEl: null,
    wowEl: null,
    bgmFileOK: true,
    synthTimer: null,
    synthStep: 0,
    unlocked: false,

    init: function () {
      this.bgmEl = $('bgmAudio');
      this.wowEl = $('wowAudio');
      this.muted = localStorage.getItem('polymer.muted') === '1';
      var self = this;
      this.bgmEl.addEventListener('error', function () { self.bgmFileOK = false; });
      this.bgmEl.volume = 0.42;
      this.wowEl.volume = 0.9;
      this.applyMute();
    },

    ensureCtx: function () {
      if (!this.ctx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        this.ctx = new AC();
        this.master = this.ctx.createGain();
        this.master.gain.value = this.muted ? 0 : 1;
        this.master.connect(this.ctx.destination);
        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.value = 0.16;
        this.musicGain.connect(this.master);
        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.value = 0.5;
        this.sfxGain.connect(this.master);
      }
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return this.ctx;
    },

    /** ต้องถูกเรียกจาก user gesture เพื่อปลดล็อก autoplay policy */
    unlock: function () {
      this.ensureCtx();
      this.unlocked = true;
      this.startBGM();
    },

    startBGM: function () {
      var self = this;
      if (this.muted) return;
      var p = this.bgmEl.play();
      if (p && typeof p.then === 'function') {
        p.then(function () { self.stopSynthBGM(); })
         .catch(function () { self.bgmFileOK = false; self.startSynthBGM(); });
      }
      // ถ้าไฟล์เสียหาย/ไม่มีจริง ให้ fallback ภายใน 800ms
      setTimeout(function () {
        if (!self.muted && (self.bgmEl.error || self.bgmEl.paused)) self.startSynthBGM();
      }, 800);
    },

    /* --- Synthetic chiptune / bossa-nova fallback loop --- */
    startSynthBGM: function () {
      if (this.synthTimer || this.muted) return;
      var ctx = this.ensureCtx();
      if (!ctx) return;
      var self = this;
      // Am7 - D7 - Gmaj7 - Cmaj7  (bossa-ish ii-V-I turnaround)
      var CHORDS = [
        { bass: 110.00, notes: [261.63, 329.63, 440.00] },  // Am7
        { bass: 146.83, notes: [293.66, 369.99, 440.00] },  // D7
        { bass: 98.00,  notes: [246.94, 293.66, 392.00] },  // Gmaj7
        { bass: 130.81, notes: [261.63, 329.63, 392.00] }   // Cmaj7
      ];
      var MELODY = [659.25, 587.33, 523.25, 587.33, 659.25, 783.99, 659.25, 523.25];
      var stepMs = 420;

      this.synthStep = 0;
      var tick = function () {
        if (self.muted) return;
        var s = self.synthStep;
        var chord = CHORDS[Math.floor(s / 4) % CHORDS.length];
        // bass on beats 1 & 3
        if (s % 2 === 0) self.blip(chord.bass, 0.34, 'triangle', 0.5, self.musicGain);
        // comping chord on off-beats
        if (s % 4 === 1 || s % 4 === 3) {
          chord.notes.forEach(function (f, i) {
            self.blip(f, 0.24, 'sine', 0.18 - i * 0.03, self.musicGain, 0.02 * i);
          });
        }
        // sparse melody
        if (s % 2 === 1) self.blip(MELODY[s % MELODY.length], 0.3, 'square', 0.075, self.musicGain);
        self.synthStep = (s + 1) % 16;
      };
      tick();
      this.synthTimer = setInterval(tick, stepMs);
    },

    stopSynthBGM: function () {
      if (this.synthTimer) { clearInterval(this.synthTimer); this.synthTimer = null; }
    },

    blip: function (freq, dur, type, vol, dest, delay) {
      var ctx = this.ensureCtx();
      if (!ctx || this.muted) return;
      var t0 = ctx.currentTime + (delay || 0);
      var osc = ctx.createOscillator();
      var g = ctx.createGain();
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, t0);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(Math.max(0.0002, vol || 0.2), t0 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + (dur || 0.2));
      osc.connect(g); g.connect(dest || this.sfxGain);
      osc.start(t0); osc.stop(t0 + (dur || 0.2) + 0.05);
    },

    sfx: function (name) {
      if (this.muted) return;
      var ctx = this.ensureCtx();
      if (!ctx) return;
      var self = this;
      switch (name) {
        case 'pop':
          this.blip(660, 0.09, 'triangle', 0.28); break;
        case 'place':
          this.blip(523.25, 0.1, 'sine', 0.3);
          this.blip(783.99, 0.12, 'sine', 0.2, null, 0.06); break;
        case 'correct':
          [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) {
            self.blip(f, 0.26, 'triangle', 0.3, null, i * 0.07);
          }); break;
        case 'wrong':
          this.blip(196, 0.22, 'sawtooth', 0.24);
          this.blip(146.83, 0.32, 'sawtooth', 0.22, null, 0.12); break;
        case 'reward':
          [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach(function (f, i) {
            self.blip(f, 0.34, 'square', 0.24, null, i * 0.09);
          }); break;
        case 'tick':
          this.blip(880, 0.05, 'sine', 0.15); break;
        case 'scare':
          // เสียงกรีดร้องสังเคราะห์ (fallback ของ wow.mp3)
          var osc = ctx.createOscillator(), g = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(880, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 1.1);
          g.gain.setValueAtTime(0.35, ctx.currentTime);
          g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
          osc.connect(g); g.connect(this.sfxGain);
          osc.start(); osc.stop(ctx.currentTime + 1.25);
          break;
      }
    },

    playWow: function () {
      if (this.muted) return;
      var self = this;
      try {
        this.wowEl.currentTime = 0;
        var p = this.wowEl.play();
        if (p && typeof p.then === 'function') {
          p.catch(function () { self.sfx('scare'); });
        }
      } catch (e) { this.sfx('scare'); }
    },

    toggleMute: function () {
      this.muted = !this.muted;
      localStorage.setItem('polymer.muted', this.muted ? '1' : '0');
      this.applyMute();
      if (!this.muted && this.unlocked) this.startBGM();
      return this.muted;
    },

    applyMute: function () {
      this.bgmEl.muted = this.muted;
      this.wowEl.muted = this.muted;
      if (this.master) this.master.gain.value = this.muted ? 0 : 1;
      if (this.muted) { this.stopSynthBGM(); this.bgmEl.pause(); }
      var icon = $('muteIcon'), btn = $('btnMute');
      if (icon) icon.classList.toggle('is-muted', this.muted);
      if (btn) btn.setAttribute('aria-pressed', this.muted ? 'true' : 'false');
    }
  };

  /* =========================================================
     3) DATA LOADING
     ========================================================= */
  var DB = { all: [], byType: { 1: [], 2: [], 3: [] } };

  function rowsToQuestions(rows, type) {
    var out = [];
    for (var i = 1; i < rows.length; i++) {         // ข้ามหัวตาราง
      var r = rows[i];
      var prompt = (r[1] || '').trim();
      var answer = (r[2] || '').trim();
      var lock = (r[3] || '').trim();
      if (!prompt || !answer) continue;
      var q = {
        id: type + '-' + (r[0] || i).trim(),
        type: type,
        no: (r[0] || i).toString().trim(),
        prompt: prompt,
        answer: answer,
        lock: normalizeLock(lock),
        lockRaw: lock
      };
      attachArt(q, i - 1);          // i-1 = ลำดับแถวข้อมูล (ตรงกับลำดับในตาราง 20 PAIRS)
      out.push(q);
    }
    return out;
  }

  function loadCSV(type) {
    var name = 'questions_type' + type + '.csv';
    var paths = ['data/' + name, 'assets/data/' + name];
    var idx = 0;
    function attempt() {
      if (idx >= paths.length) return Promise.reject(new Error('no path'));
      var url = paths[idx++];
      return fetch(url, { cache: 'no-cache' })
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return res.text();
        })
        .then(function (txt) {
          if (!txt || txt.indexOf(',') < 0) throw new Error('empty');
          return txt;
        })
        .catch(attempt);
    }
    if (typeof fetch !== 'function') return Promise.reject(new Error('no fetch'));
    return attempt();
  }

  function loadAllData() {
    var jobs = [1, 2, 3].map(function (t) {
      return loadCSV(t)
        .catch(function () { return EMBEDDED_CSV['type' + t]; })
        .then(function (txt) { return rowsToQuestions(parseCSV(txt), t); });
    });
    return Promise.all(jobs).then(function (sets) {
      DB.byType[1] = sets[0];
      DB.byType[2] = sets[1];
      DB.byType[3] = sets[2];
      DB.all = sets[0].concat(sets[1], sets[2]);
      return DB;
    });
  }

  /* =========================================================
     4) GAME STATE
     ========================================================= */
  var TOTAL_PHASES = 3;
  var ROUND_SECONDS = 480;          // 08:00
  var BONUS_SECONDS = 20;           // โบนัสเวลาเมื่อส่งออเดอร์สำเร็จ

  /* ใช้ตัวละครลูกค้าที่ตัดมาจาก ui-bg.png (assets/images/ui/customer.png)
     เปลี่ยนเฉพาะ "ออเดอร์" ในแต่ละรอบ */
  var CUSTOMER_NAME = 'น้องต้นกล้า';
  var ORDERS = [
    'พอลิเมอร์สายโซ่ยาว',
    'พอลิเมอร์เส้นใยเหนียว',
    'พอลิเมอร์ทนความร้อน',
    'พอลิเมอร์ยืดหยุ่นสูง',
    'พอลิเมอร์ห่ออาหาร',
    'พอลิเมอร์แข็งแรงพิเศษ',
    'พอลิเมอร์นุ่มละมุน',
    'พอลิเมอร์ใสแวววาว'
  ];

  var S = {
    ready: false,
    running: false,
    started: false,          // เริ่มเกมรอบนี้แล้วหรือยัง (ใช้ตัดสินว่ากด "เล่นต่อ" ได้ไหม)
    phase: 0,                 // 0..3
    consecutiveErrors: 0,
    stars: 0,
    coins: 0,
    orders: 0,
    attempts: 0,
    correctAttempts: 0,
    customer: { name: CUSTOMER_NAME, want: ORDERS[0] },
    question: null,
    lastQuestionId: null,
    pool: [],                 // [{key,text,lock,used}]
    slots: [null, null, null],   // ข้อมูลการ์ดที่วางแล้ว
    lockedSlots: [false, false, false],
    catalyst: null,
    timeLeft: ROUND_SECONDS,
    timerId: null,
    busy: false
  };

  /* =========================================================
     5) RENDERING HELPERS
     ========================================================= */
  function chainImg(sprite) {
    return '<img class="card-mol" src="assets/images/ui/' + sprite + '.png" alt="" aria-hidden="true">';
  }

  function fallbackPlantSVG(phase) {
    var leaves = '';
    if (phase >= 1) {
      leaves += '<ellipse cx="88" cy="112" rx="26" ry="12" fill="#5aa93b" transform="rotate(-24 88 112)"/>' +
                '<ellipse cx="132" cy="112" rx="26" ry="12" fill="#6dc04a" transform="rotate(24 132 112)"/>';
    }
    if (phase >= 2) {
      leaves += '<ellipse cx="72" cy="82" rx="32" ry="14" fill="#4f9a35" transform="rotate(-30 72 82)"/>' +
                '<ellipse cx="148" cy="82" rx="32" ry="14" fill="#7dbf4e" transform="rotate(30 148 82)"/>';
    }
    if (phase >= 3) {
      leaves += '<ellipse cx="66" cy="54" rx="34" ry="15" fill="#3f8f3a" transform="rotate(-36 66 54)"/>' +
                '<ellipse cx="154" cy="54" rx="34" ry="15" fill="#8ed15c" transform="rotate(36 154 54)"/>' +
                '<circle cx="110" cy="34" r="13" fill="#f2c46b"/>' +
                '<circle cx="110" cy="34" r="6" fill="#e0a33f"/>';
    }
    var stemTop = phase >= 3 ? 44 : phase >= 2 ? 74 : phase >= 1 ? 104 : 138;
    var stem = phase >= 1
      ? '<path d="M110 150 C 104 ' + (stemTop + 30) + ', 116 ' + (stemTop + 16) + ', 110 ' + stemTop +
        '" stroke="#4f7a2a" stroke-width="7" fill="none" stroke-linecap="round"/>'
      : '<ellipse cx="110" cy="140" rx="13" ry="9" fill="#7a5326"/>';
    return '<svg viewBox="0 0 220 180" role="img" aria-label="ต้นผัก Phase ' + phase + '">' +
      '<ellipse cx="110" cy="156" rx="86" ry="20" fill="#4a3018"/>' +
      '<ellipse cx="110" cy="150" rx="78" ry="17" fill="#603d1e"/>' +
      stem + leaves +
      '</svg>';
  }

  function renderPlant() {
    var img = $('plantImg'), fb = $('plantFallback');
    var frame = $('plantFrame');
    img.src = 'assets/images/phase' + S.phase + '.png';
    fb.innerHTML = fallbackPlantSVG(S.phase);
    frame.classList.add('is-growing');
    setTimeout(function () { frame.classList.remove('is-growing'); }, 850);

    var names = ['ยังไม่ได้ปลูก', 'ปลูกเมล็ด', 'กำลังเจริญเติบโต', 'โตเต็มที่'];
    $('phaseNow').textContent = S.phase;
    $('phaseName').textContent = names[S.phase];
  }

  function renderGrowthTrack() {
    $$('.growth-step').forEach(function (el) {
      var p = parseInt(el.dataset.phase, 10);
      el.classList.toggle('is-done', p <= S.phase);
      el.classList.toggle('is-active', p === S.phase + 1);
    });
  }

  function renderCustomer(isNew) {
    var c = S.customer;
    $('avatarName').textContent = c.name;
    $('customerWant').textContent = '“' + c.want + '”';
    var av = $('customerAvatar');
    av.classList.remove('is-new', 'is-happy');
    if (isNew) {
      void av.offsetWidth;
      av.classList.add('is-new');
      // ถอดคลาสทิ้งเมื่อเล่นจบ กัน transform ค้างถ้าเบราว์เซอร์ไม่รัน animation
      clearTimeout(renderCustomer._t);
      renderCustomer._t = setTimeout(function () { av.classList.remove('is-new'); }, 900);
    }
    renderChain();
  }

  function cheerCustomer() {
    var av = $('customerAvatar');
    av.classList.remove('is-happy');
    void av.offsetWidth;
    av.classList.add('is-happy');
    clearTimeout(cheerCustomer._t);
    cheerCustomer._t = setTimeout(function () { av.classList.remove('is-happy'); }, 1700);
  }

  /* โซ่ในบอลลูนคำพูด: เผยสีตามจำนวน Phase ที่ปลูกได้แล้ว */
  function renderChain() {
    var img = $('chainPreview').querySelector('img');
    if (!img) return;
    var pct = (S.phase / TOTAL_PHASES) * 100;
    img.style.filter = S.phase >= TOTAL_PHASES
      ? 'saturate(1.2) drop-shadow(0 0 9px rgba(125,191,78,.9))'
      : 'grayscale(' + (0.55 - 0.18 * S.phase).toFixed(2) + ') brightness(' + (0.88 + 0.06 * S.phase).toFixed(2) + ')';
    img.title = 'ความยาวสายโซ่ ' + Math.round(pct) + '%';
  }

  function renderScore(bump) {
    $('statStars').textContent = S.stars;
    $('statCoins').textContent = S.coins;
    $('statOrders').textContent = S.orders;
    if (bump) {
      $$('.reward-chip').slice(0, 2).forEach(function (el) {
        el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump');
      });
    }
  }

  function renderProgress() {
    var base = (S.phase / TOTAL_PHASES) * 100;
    var extra = (S.catalyst ? 4 : 0) + (S.slots[S.phase] ? 6 : 0);
    var pct = clamp(Math.round(base + extra), 0, 100);
    $('progressFill').style.width = pct + '%';
    $('progressPct').textContent = pct + '%';
    $('progressTrack').setAttribute('aria-valuenow', String(pct));
  }

  function renderQuestion() {
    var q = S.question;
    if (!q) return;
    $('qBadge').textContent = 'โจทย์ Phase ' + (S.phase + 1);
    $('qType').textContent = TYPE_META[q.type].badge;
    $('questionFigure').innerHTML = artHTML(q.promptArt, 'card-eq');
    $('questionText').textContent = q.prompt;
    $('questionAsk').textContent = TYPE_META[q.type].ask;
    $('questionCard').classList.remove('art-failed');
    // type 3: รูปคือ "ชื่อปฏิกิริยา" อยู่แล้ว ไม่ต้องโชว์ข้อความซ้ำ
    $('questionCard').classList.toggle('q-dup', q.type === 3 && !!q.promptArt);
  }

  function renderPool() {
    var grid = $('poolGrid');
    grid.innerHTML = '';
    S.pool.forEach(function (card, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pool-card' + (card.used ? ' is-used' : '');
      btn.dataset.key = card.key;
      btn.style.animationDelay = (i * 45) + 'ms';
      btn.setAttribute('aria-label', 'ตัวเลือกคำตอบ ' + card.text);
      btn.title = card.text;
      // ไม่แสดงชนิดปฏิกิริยาบนการ์ด ผู้เล่นต้องตัดสินใจเลือกบัวรดน้ำเอง
      // แสดง "ภาพสมการจริง" เป็นหลัก และมีข้อความสำรองเผื่อรูปโหลดไม่ขึ้น
      btn.innerHTML =
        '<span class="card-art">' + artHTML(card.art, 'card-eq') + '</span>' +
        '<span class="card-text">' + escapeHTML(card.text) + '</span>';
      grid.appendChild(btn);
    });
  }

  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function renderSlots() {
    for (var i = 0; i < TOTAL_PHASES; i++) {
      var el = $('slot' + (i + 1));
      var card = S.slots[i];
      var locked = S.lockedSlots[i];
      el.classList.toggle('is-current', i === S.phase && !locked);
      el.classList.toggle('is-filled', !!card);
      el.classList.toggle('is-locked', locked);
      if (card) {
        el.title = card.text;
        el.innerHTML = '<span class="card-art">' + artHTML(card.art, 'card-eq') + '</span>' +
                       '<span class="slot-content">' + escapeHTML(card.text) + '</span>';
      } else {
        el.removeAttribute('title');
        el.innerHTML = '<span class="slot-placeholder">' +
          (i === S.phase ? 'วางคำตอบที่นี่' : 'รอ Phase ' + (i + 1)) + '</span>';
      }
    }
    updateSubmitState();
  }

  function updateSubmitState() {
    var ok = !!S.catalyst && !!S.slots[S.phase] && S.running && !S.busy;
    $('btnSubmit').disabled = !ok;
    renderProgress();
  }

  function toast(msg, kind, ms) {
    var t = $('toast');
    t.textContent = msg;
    t.className = 'toast show ' + (kind || '');
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { t.className = 'toast ' + (kind || ''); }, ms || 2200);
  }

  function sparkle(count) {
    var layer = $('sparkleLayer');
    for (var i = 0; i < (count || 14); i++) {
      (function (i) {
        setTimeout(function () {
          var s = document.createElement('span');
          s.className = 'sparkle';
          s.style.left = (8 + Math.random() * 84) + '%';
          s.style.top = (35 + Math.random() * 55) + '%';
          var sz = 10 + Math.random() * 14;
          s.style.width = s.style.height = sz + 'px';
          layer.appendChild(s);
          setTimeout(function () { s.remove(); }, 1200);
        }, i * 55);
      })(i);
    }
  }

  /* =========================================================
     6) ROUND / QUESTION GENERATION
     ========================================================= */
  function nextQuestion() {
    if (!DB.all.length) return false;
    var candidates = DB.all.filter(function (q) { return q.id !== S.lastQuestionId; });
    var q = pick(candidates.length ? candidates : DB.all);
    S.question = q;
    S.lastQuestionId = q.id;
    buildPool(q);
    renderQuestion();
    renderPool();
    return true;
  }

  function buildPool(q) {
    var POOL_SIZE = 8;
    var seen = {};
    var correct = { key: 'c0', text: q.answer, lock: q.lock, correct: true, used: false,
                    art: q.answerArt };
    seen[q.answer] = true;

    // distractor จากชุดข้อมูลประเภทเดียวกันก่อน แล้วค่อยเติมจากชุดอื่น
    var samePool = shuffle(DB.byType[q.type]);
    var otherPool = shuffle(DB.all);
    var cards = [correct];

    function feed(list) {
      for (var i = 0; i < list.length && cards.length < POOL_SIZE; i++) {
        var cand = list[i];
        if (seen[cand.answer]) continue;
        seen[cand.answer] = true;
        cards.push({
          key: 'd' + cards.length,
          text: cand.answer,
          lock: cand.lock,
          correct: false,
          used: false,
          art: cand.answerArt
        });
      }
    }
    feed(samePool);
    feed(otherPool);

    S.pool = shuffle(cards);
  }

  function findCard(key) {
    for (var i = 0; i < S.pool.length; i++) if (S.pool[i].key === key) return S.pool[i];
    return null;
  }

  /* =========================================================
     7) PLAYER ACTIONS
     ========================================================= */
  function selectCatalyst(kind) {
    if (!S.running || S.busy) return;
    S.catalyst = (S.catalyst === kind) ? null : kind;
    $$('.catalyst').forEach(function (b) {
      b.setAttribute('aria-checked', b.dataset.catalyst === S.catalyst ? 'true' : 'false');
    });
    var hint = $('catalystHint');
    hint.classList.remove('is-warn');
    hint.textContent = S.catalyst
      ? 'เลือกบัวรดน้ำ “' + LOCK_META[S.catalyst].th + '” แล้ว — ต่อไปวางการ์ดคำตอบ'
      : 'เลือกชนิดปฏิกิริยาให้ตรงกับโจทย์ก่อนยืนยัน';
    Audio_.sfx('pop');
    updateSubmitState();
  }

  function placeCard(key, slotIndex) {
    if (!S.running || S.busy) return false;
    if (slotIndex !== S.phase) {
      toast('ต้องวางคำตอบในช่อง Phase ' + (S.phase + 1) + ' ก่อนนะ', 'bad', 1600);
      return false;
    }
    var card = findCard(key);
    if (!card || card.used) return false;

    // คืนการ์ดเดิมถ้ามีอยู่แล้ว
    var prev = S.slots[slotIndex];
    if (prev) { var p = findCard(prev.key); if (p) p.used = false; }

    card.used = true;
    S.slots[slotIndex] = { key: card.key, text: card.text, lock: card.lock,
                           correct: card.correct, art: card.art };
    Audio_.sfx('place');
    renderPool();
    renderSlots();
    return true;
  }

  function clearSlot(slotIndex) {
    if (S.lockedSlots[slotIndex] || !S.slots[slotIndex] || S.busy) return;
    var c = findCard(S.slots[slotIndex].key);
    if (c) c.used = false;
    S.slots[slotIndex] = null;
    Audio_.sfx('pop');
    renderPool();
    renderSlots();
  }

  function clearAll() {
    if (S.busy) return;
    for (var i = 0; i < TOTAL_PHASES; i++) {
      if (S.lockedSlots[i]) continue;
      if (S.slots[i]) { var c = findCard(S.slots[i].key); if (c) c.used = false; }
      S.slots[i] = null;
    }
    S.catalyst = null;
    $$('.catalyst').forEach(function (b) { b.setAttribute('aria-checked', 'false'); });
    $('catalystHint').textContent = 'เลือกชนิดปฏิกิริยาให้ตรงกับโจทย์ก่อนยืนยัน';
    $('catalystHint').classList.remove('is-warn');
    Audio_.sfx('pop');
    renderPool();
    renderSlots();
    toast('ล้างคำตอบทั้งหมดแล้ว');
  }

  function submitAnswer() {
    if (!S.running || S.busy) return;
    var idx = S.phase;
    var placed = S.slots[idx];
    var q = S.question;
    if (!q || !placed || !S.catalyst) return;

    S.busy = true;
    S.attempts++;

    var catalystOK = S.catalyst === q.lock;
    var answerOK = placed.text === q.answer;

    if (catalystOK && answerOK) {
      S.correctAttempts++;
      S.consecutiveErrors = 0;
      S.lockedSlots[idx] = true;
      S.phase++;
      S.stars += 20;
      Audio_.sfx('correct');
      renderPlant();
      renderGrowthTrack();
      renderChain();
      renderScore(true);
      sparkle(16);
      renderSlots();
      renderProgress();

      if (S.phase >= TOTAL_PHASES) {
        toast('เยี่ยมมาก! ต้นผักโตเต็มที่แล้ว', 'ok', 1500);
        setTimeout(completeOrder, 1000);
      } else {
        toast('ถูกต้อง! ต้นผักเติบโตเป็น Phase ' + S.phase, 'ok');
        S.catalyst = null;
        $$('.catalyst').forEach(function (b) { b.setAttribute('aria-checked', 'false'); });
        $('catalystHint').textContent = 'เลือกชนิดปฏิกิริยาให้ตรงกับโจทย์ก่อนยืนยัน';
        setTimeout(function () {
          nextQuestion();
          renderSlots();
          S.busy = false;
          updateSubmitState();
        }, 700);
      }
      return;
    }

    /* --- ตอบผิด --- */
    S.consecutiveErrors++;
    Audio_.sfx('wrong');
    var slotEl = $('slot' + (idx + 1));
    slotEl.classList.add('is-wrong');
    setTimeout(function () { slotEl.classList.remove('is-wrong'); }, 600);

    var why = !catalystOK && !answerOK
      ? 'ทั้งบัวรดน้ำและการ์ดคำตอบยังไม่ถูก'
      : (!catalystOK
          ? 'การ์ดถูกแล้ว แต่บัวรดน้ำผิดชนิด — ข้อนี้เป็น “' + LOCK_META[q.lock].th + '”'
          : 'บัวรดน้ำถูกแล้ว แต่การ์ดคำตอบยังไม่ใช่');
    toast('ยังไม่ถูก! ' + why, 'bad', 2600);
    if (!catalystOK) $('catalystHint').classList.add('is-warn');

    setTimeout(function () {
      // คืนช่องคำตอบและสุ่มโจทย์ใหม่
      if (S.slots[idx]) { var c = findCard(S.slots[idx].key); if (c) c.used = false; }
      S.slots[idx] = null;
      S.catalyst = null;
      $$('.catalyst').forEach(function (b) { b.setAttribute('aria-checked', 'false'); });

      if (S.consecutiveErrors >= 3) {
        showJumpscare();
      } else {
        nextQuestion();
        renderSlots();
        S.busy = false;
        updateSubmitState();
      }
    }, 800);
  }

  /* =========================================================
     8) ORDER COMPLETE / NEW CUSTOMER
     ========================================================= */
  function completeOrder() {
    S.orders++;
    S.stars += 50;
    S.coins += 5;
    S.timeLeft = Math.min(ROUND_SECONDS, S.timeLeft + BONUS_SECONDS);
    renderScore(true);
    renderTimer();
    renderChain();
    cheerCustomer();
    Audio_.sfx('reward');

    $('rewardPlant').src = 'assets/images/phase3.png';
    $('rewardCust').textContent = S.customer.name + ' พอใจมาก! ได้ “' + S.customer.want + '” ตามต้องการ';
    $('gainStars').textContent = '+50';
    $('gainCoins').textContent = '+5';
    $('rewardTotalStars').textContent = S.stars;
    $('rewardTotalCoins').textContent = S.coins;
    openModal('rewardModal');
    toast('+' + BONUS_SECONDS + ' วินาที โบนัสส่งออเดอร์!', 'ok', 1800);
  }

  function newCustomer() {
    closeModal('rewardModal');
    var others = ORDERS.filter(function (o) { return o !== S.customer.want; });
    S.customer = { name: CUSTOMER_NAME, want: pick(others) };
    S.phase = 0;
    S.slots = [null, null, null];
    S.lockedSlots = [false, false, false];
    S.catalyst = null;
    S.busy = false;
    $$('.catalyst').forEach(function (b) { b.setAttribute('aria-checked', 'false'); });
    $('catalystHint').textContent = 'เลือกชนิดปฏิกิริยาให้ตรงกับโจทย์ก่อนยืนยัน';
    $('catalystHint').classList.remove('is-warn');
    renderCustomer(true);
    renderPlant();
    renderGrowthTrack();
    nextQuestion();
    renderSlots();
    renderProgress();
    toast('ลูกค้าใหม่มาแล้ว! ' + S.customer.face + ' ' + S.customer.name, 'ok');
  }

  /* =========================================================
     9) JUMPSCARE
     ========================================================= */
  function showJumpscare() {
    var js = $('jumpscare');
    js.hidden = false;
    Audio_.playWow();
    if (navigator.vibrate) { try { navigator.vibrate([90, 60, 160]); } catch (e) {} }
    $('btnJsRetry').focus();
  }

  function hideJumpscare() {
    $('jumpscare').hidden = true;
    S.consecutiveErrors = 0;
    try { Audio_.wowEl.pause(); Audio_.wowEl.currentTime = 0; } catch (e) {}
    nextQuestion();
    renderSlots();
    S.busy = false;
    updateSubmitState();
    toast('เอาใหม่! ตั้งสติแล้วอ่านโจทย์ช้า ๆ');
  }

  /* =========================================================
     10) TIMER
     ========================================================= */
  function renderTimer() {
    var m = Math.floor(S.timeLeft / 60), s = S.timeLeft % 60;
    $('timerValue').textContent = (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
    $('timerBox').classList.toggle('is-low', S.timeLeft <= 30);
  }

  function startTimer() {
    stopTimer();
    S.timerId = setInterval(function () {
      S.timeLeft--;
      if (S.timeLeft <= 10 && S.timeLeft > 0) Audio_.sfx('tick');
      if (S.timeLeft <= 0) { S.timeLeft = 0; renderTimer(); gameOver(); return; }
      renderTimer();
    }, 1000);
  }
  function stopTimer() { if (S.timerId) { clearInterval(S.timerId); S.timerId = null; } }

  function gameOver() {
    stopTimer();
    S.running = false;
    S.started = false;          // หมดเวลาแล้ว ครั้งต่อไปต้องเริ่มใหม่
    var acc = S.attempts ? Math.round((S.correctAttempts / S.attempts) * 100) : 0;
    $('sumOrders').textContent = S.orders;
    $('sumStars').textContent = S.stars;
    $('sumCoins').textContent = S.coins;
    $('sumAcc').textContent = acc + '%';
    var rank = acc >= 90 ? 'ระดับ : นักเคมีพอลิเมอร์ตัวจริง!'
             : acc >= 70 ? 'ระดับ : เกษตรกรพอลิเมอร์ฝีมือดี'
             : acc >= 50 ? 'ระดับ : กำลังงอกงาม ฝึกต่ออีกนิด'
             : 'ระดับ : เมล็ดพันธุ์ใหม่ ลองอ่านคู่มือแล้วลุยอีกครั้ง';
    $('overRank').textContent = rank;
    openModal('overModal');
    Audio_.sfx('reward');
  }

  /* =========================================================
     11) MODALS
     ========================================================= */
  function openModal(id) {
    var el = $(id);
    el.hidden = false;
    el.classList.add('is-open');
    var focusable = el.querySelector('button');
    if (focusable) setTimeout(function () { focusable.focus(); }, 60);
  }
  function closeModal(id) {
    var el = $(id);
    el.hidden = true;
    el.classList.remove('is-open');
  }

  /* =========================================================
     12) GUIDE (โหมดเรียนรู้)
     ========================================================= */
  function buildGuide() {
    var t3 = DB.byType[3];
    var addHTML = '', condHTML = '', tableHTML = '';
    t3.forEach(function (q) {
      var meta = LOCK_META[q.lock];
      var item =
        '<div class="mech-item ' + meta.cls + '">' +
          '<p class="mech-name">' + escapeHTML(q.prompt) + '</p>' +
          '<p class="mech-eq">' + escapeHTML(q.answer) + '</p>' +
        '</div>';
      if (q.lock === 'addition') addHTML += item; else condHTML += item;

      tableHTML +=
        '<tr>' +
          '<td>' + escapeHTML(q.prompt) + '</td>' +
          '<td>' + escapeHTML(q.answer) + '</td>' +
          '<td><span class="pill ' + meta.cls + '">' + meta.th + '</span></td>' +
        '</tr>';
    });
    $('mechAdd').innerHTML = addHTML || '<p>—</p>';
    $('mechCond').innerHTML = condHTML || '<p>—</p>';
    $('guideTableBody').innerHTML = tableHTML;
  }

  function switchGuideTab(name) {
    $$('.gtab').forEach(function (b) {
      var on = b.dataset.tab === name;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    $$('.gpane').forEach(function (p) {
      p.classList.toggle('is-active', p.dataset.pane === name);
    });
  }

  /* =========================================================
     13) DRAG & DROP  +  TAP-TO-SELECT
     Pointer Events — ใช้ได้ทั้งเมาส์ ปากกา และนิ้ว
     ========================================================= */
  var Drag = {
    active: false, armed: false, card: null, ghost: null,
    startX: 0, startY: 0, pointerType: 'mouse', holdTimer: null, overSlot: null,

    onDown: function (e) {
      var cardEl = e.target.closest('.pool-card');
      if (!cardEl || cardEl.classList.contains('is-used')) return;
      if (e.button !== undefined && e.button !== 0) return;

      this.card = cardEl;
      this.startX = e.clientX; this.startY = e.clientY;
      this.pointerType = e.pointerType || 'mouse';
      this.armed = (this.pointerType === 'mouse' || this.pointerType === 'pen');
      this.active = false;

      if (!this.armed) {
        // touch: กดค้าง 200ms จึงเริ่มลาก (เพื่อให้เลื่อนหน้าจอได้ตามปกติ)
        var self = this;
        this.holdTimer = setTimeout(function () {
          self.armed = true;
          if (self.card) self.card.style.transform = 'scale(1.06)';
          if (navigator.vibrate) { try { navigator.vibrate(12); } catch (err) {} }
        }, 200);
      }
    },

    onMove: function (e) {
      if (!this.card) return;
      var dx = e.clientX - this.startX, dy = e.clientY - this.startY;
      var dist = Math.sqrt(dx * dx + dy * dy);

      if (!this.armed) {
        if (dist > 10) this.cancel();   // นิ้วเลื่อนจอ → ยกเลิกการลาก
        return;
      }
      if (!this.active) {
        if (dist < 7) return;
        this.begin(e);
      }
      this.moveGhost(e.clientX, e.clientY);
      this.highlight(e.clientX, e.clientY);
      if (e.cancelable) e.preventDefault();
    },

    begin: function () {
      this.active = true;
      this.card.classList.add('is-dragging');
      var rect = this.card.getBoundingClientRect();
      var g = this.card.cloneNode(true);
      g.classList.remove('is-dragging');
      g.style.cssText =
        'position:fixed;z-index:999;pointer-events:none;margin:0;' +
        'width:' + rect.width + 'px;height:' + rect.height + 'px;' +
        'opacity:.94;transform:rotate(-4deg) scale(1.05);' +
        'box-shadow:0 16px 30px rgba(0,0,0,.6);animation:none;';
      document.body.appendChild(g);
      this.ghost = g;
      this.gw = rect.width; this.gh = rect.height;
      document.body.style.userSelect = 'none';
    },

    moveGhost: function (x, y) {
      if (!this.ghost) return;
      this.ghost.style.left = (x - this.gw / 2) + 'px';
      this.ghost.style.top = (y - this.gh / 2) + 'px';
    },

    highlight: function (x, y) {
      var el = document.elementFromPoint(x, y);
      var slot = el && el.closest ? el.closest('.slot') : null;
      if (this.overSlot && this.overSlot !== slot) this.overSlot.classList.remove('is-over');
      if (slot && !slot.classList.contains('is-locked')) {
        slot.classList.add('is-over');
        this.overSlot = slot;
      } else {
        this.overSlot = null;
      }
    },

    onUp: function (e) {
      clearTimeout(this.holdTimer);
      if (!this.card) return;
      var cardEl = this.card;

      if (this.active) {
        var el = document.elementFromPoint(e.clientX, e.clientY);
        var slot = el && el.closest ? el.closest('.slot') : null;
        if (slot && !slot.classList.contains('is-locked')) {
          placeCard(cardEl.dataset.key, parseInt(slot.dataset.slot, 10) - 1);
        }
      } else if (this.armed || this.pointerType === 'touch') {
        // แตะ (ไม่ได้ลาก) → ส่งการ์ดเข้าช่องว่างถัดไปอัตโนมัติ
        this.tapSelect(cardEl);
      }
      this.cleanup();
    },

    tapSelect: function (cardEl) {
      var target = -1;
      for (var i = 0; i < TOTAL_PHASES; i++) {
        if (!S.lockedSlots[i] && !S.slots[i]) { target = i; break; }
      }
      if (target < 0) target = S.phase;
      if (placeCard(cardEl.dataset.key, target)) {
        cardEl.classList.add('is-fly');
      }
    },

    cancel: function () { clearTimeout(this.holdTimer); this.cleanup(); },

    cleanup: function () {
      clearTimeout(this.holdTimer);
      if (this.ghost) { this.ghost.remove(); this.ghost = null; }
      if (this.card) { this.card.classList.remove('is-dragging'); this.card.style.transform = ''; }
      if (this.overSlot) { this.overSlot.classList.remove('is-over'); this.overSlot = null; }
      document.body.style.userSelect = '';
      this.card = null; this.active = false; this.armed = false;
    }
  };

  function bindDragAndDrop() {
    var grid = $('poolGrid');
    grid.addEventListener('pointerdown', function (e) { Drag.onDown(e); });
    document.addEventListener('pointermove', function (e) { Drag.onMove(e); }, { passive: false });
    document.addEventListener('pointerup', function (e) { Drag.onUp(e); });
    document.addEventListener('pointercancel', function () { Drag.cancel(); });

    // กันหน้าจอเลื่อนขณะกำลังลากด้วยนิ้ว
    document.addEventListener('touchmove', function (e) {
      if (Drag.active && e.cancelable) e.preventDefault();
    }, { passive: false });

    // คีย์บอร์ด: Enter/Space บนการ์ด = tap
    grid.addEventListener('keydown', function (e) {
      var cardEl = e.target.closest('.pool-card');
      if (!cardEl) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        Drag.tapSelect(cardEl);
      }
    });

    // แตะช่องคำตอบที่มีการ์ดอยู่ = คืนการ์ดกลับกอง
    $$('.slot').forEach(function (slot) {
      var idx = parseInt(slot.dataset.slot, 10) - 1;
      slot.addEventListener('click', function () { clearSlot(idx); });
      slot.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); clearSlot(idx); }
      });
    });
  }

  /* =========================================================
     14) GAME START / RESTART
     ========================================================= */
  var pendingStart = null;

  function startGame(reset) {
    // ถ้าผู้เล่นกดเล่นก่อนชุดโจทย์โหลดเสร็จ ให้จำไว้แล้วเริ่มให้อัตโนมัติเมื่อพร้อม
    if (!S.ready) {
      pendingStart = !!reset;
      $('btnPlay').disabled = true;
      $('btnPlay').textContent = 'กำลังโหลดชุดโจทย์…';
      return;
    }
    closeModal('landingScreen');
    closeModal('guideModal');
    closeModal('overModal');
    closeModal('rewardModal');
    $('gameScreen').hidden = false;

    if (reset) {
      S.phase = 0; S.consecutiveErrors = 0;
      S.stars = 0; S.coins = 0; S.orders = 0;
      S.attempts = 0; S.correctAttempts = 0;
      S.slots = [null, null, null];
      S.lockedSlots = [false, false, false];
      S.catalyst = null;
      S.timeLeft = ROUND_SECONDS;
      S.customer = { name: CUSTOMER_NAME, want: pick(ORDERS) };
      S.busy = false;
      $$('.catalyst').forEach(function (b) { b.setAttribute('aria-checked', 'false'); });
      $('catalystHint').textContent = 'เลือกชนิดปฏิกิริยาให้ตรงกับโจทย์ก่อนยืนยัน';
      $('catalystHint').classList.remove('is-warn');
    }

    S.running = true;
    S.started = true;
    renderCustomer(!!reset);
    renderPlant();
    renderGrowthTrack();
    renderScore(false);
    renderTimer();
    if (reset || !S.question) {
      nextQuestion();               // เริ่มใหม่ = สุ่มโจทย์ใหม่
    } else {
      renderQuestion();             // เล่นต่อ = คงโจทย์เดิมไว้
      renderPool();
    }
    renderSlots();
    renderProgress();
    startTimer();
  }

  /* =========================================================
     15) IMAGE FALLBACKS
     ========================================================= */
  /** กลับไปหน้าเมนูแรก (หยุดเวลาไว้ แล้วเล่นต่อได้เมื่อกดเข้าเกมอีกครั้ง) */
  function backToMenu() {
    stopTimer();
    S.running = false;
    closeModal('guideModal');
    closeModal('rewardModal');
    closeModal('overModal');
    $('jumpscare').hidden = true;
    $('gameScreen').hidden = true;
    var play = $('btnPlay');
    play.textContent = S.started ? 'เล่นต่อ' : 'เข้าเล่นเกมเลย';
    $('btnRestartFromMenu').hidden = !S.started;
    openModal('landingScreen');
  }

  function bindImageFallbacks() {
    // รูปสมการโหลดไม่ขึ้น -> สลับไปแสดงข้อความแทน (error ไม่ bubble ต้องใช้ capture)
    document.addEventListener('error', function (e) {
      var el = e.target;
      if (el && el.tagName === 'IMG' && el.classList.contains('card-eq')) {
        var host = el.closest('.pool-card, .slot, .question-card');
        if (host) host.classList.add('art-failed');
      }
    }, true);

    var img = $('plantImg'), fb = $('plantFallback');
    img.addEventListener('error', function () {
      img.style.display = 'none';
      fb.hidden = false;
    });
    img.addEventListener('load', function () {
      img.style.display = '';
      fb.hidden = true;
    });

    var js = $('jsImg'), jsFb = $('jsFallback');
    js.addEventListener('error', function () {
      js.style.display = 'none';
      jsFb.hidden = false;
    });
  }

  /* =========================================================
     16) EVENT WIRING
     ========================================================= */
  function bindEvents() {
    $('btnPlay').addEventListener('click', function () {
      Audio_.unlock();
      // ถ้ากลับมาจากปุ่ม "เมนู" ระหว่างเกม ให้เล่นต่อจากเดิม
      startGame(!S.started || S.timeLeft <= 0);
    });

    $('btnBackMenu').addEventListener('click', backToMenu);

    $('btnRestartFromMenu').addEventListener('click', function () {
      Audio_.unlock();
      startGame(true);
    });

    $('btnLearnFromLanding').addEventListener('click', function () {
      Audio_.unlock();
      openModal('guideModal');
    });

    $('btnGuide').addEventListener('click', function () { openModal('guideModal'); });
    $('btnNoteMore').addEventListener('click', function () { openModal('guideModal'); });
    $('btnOverGuide').addEventListener('click', function () { openModal('guideModal'); });
    $('btnGuideClose').addEventListener('click', function () { closeModal('guideModal'); });
    $('btnGuidePlay').addEventListener('click', function () {
      Audio_.unlock();
      closeModal('guideModal');
      if (!S.running && $('gameScreen').hidden) startGame(true);
    });

    $$('.gtab').forEach(function (b) {
      b.addEventListener('click', function () { switchGuideTab(b.dataset.tab); });
    });

    $('btnMute').addEventListener('click', function () {
      var muted = Audio_.toggleMute();
      toast(muted ? 'ปิดเสียงแล้ว' : 'เปิดเสียงแล้ว', '', 1200);
    });

    $$('.catalyst').forEach(function (b) {
      b.addEventListener('click', function () { selectCatalyst(b.dataset.catalyst); });
    });

    $('btnSubmit').addEventListener('click', submitAnswer);
    $('btnClear').addEventListener('click', clearAll);
    $('btnJsRetry').addEventListener('click', hideJumpscare);
    $('btnNextCustomer').addEventListener('click', newCustomer);
    $('btnRestart').addEventListener('click', function () { startGame(true); });

    // ปิด modal ด้วย Esc / คลิกพื้นหลัง
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !$('guideModal').hidden) closeModal('guideModal');
    });
    $('guideModal').addEventListener('click', function (e) {
      if (e.target === $('guideModal')) closeModal('guideModal');
    });

    // หยุดเวลาเมื่อสลับแท็บ
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stopTimer();
      else if (S.running) startTimer();
    });
  }

  /* =========================================================
     17) BOOT
     ========================================================= */
  function onDataReady() {
    S.ready = true;
    buildGuide();
    if (!S.running) S.customer = { name: CUSTOMER_NAME, want: pick(ORDERS) };
    var btn = $('btnPlay');
    btn.disabled = false;
    btn.textContent = 'เข้าเล่นเกมเลย';
    if (pendingStart !== null) {
      var reset = pendingStart;
      pendingStart = null;
      startGame(reset);
    }
  }

  function boot() {
    Audio_.init();
    bindImageFallbacks();
    bindEvents();
    bindDragAndDrop();

    loadAllData()
      .then(onDataReady)
      .catch(function (err) {
        console.error('โหลดข้อมูลไม่สำเร็จ', err);
        // ยังเล่นได้ด้วยข้อมูลฝังในไฟล์
        DB.byType[1] = rowsToQuestions(parseCSV(EMBEDDED_CSV.type1), 1);
        DB.byType[2] = rowsToQuestions(parseCSV(EMBEDDED_CSV.type2), 2);
        DB.byType[3] = rowsToQuestions(parseCSV(EMBEDDED_CSV.type3), 3);
        DB.all = DB.byType[1].concat(DB.byType[2], DB.byType[3]);
        onDataReady();
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
