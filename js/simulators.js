/**
 * Amit Kumar Portfolio - Live Simulators & Interactive Playgrounds
 * (IoT Dashboard, AI Interview Voice Engine, SQL Engine, Smart Wiper Rain Sim & Live Analytics)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Simulator Tabs
  const tabBtns = document.querySelectorAll('.sim-tab-btn');
  const tabContents = document.querySelectorAll('.sim-tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      const targetContent = document.getElementById(targetId);
      if (targetContent) targetContent.classList.add('active');
    });
  });

  // ==========================================================================
  // 1. IoT SMART HOME SIMULATOR
  // ==========================================================================
  const tempValEl = document.getElementById('iot-temp-val');
  const humValEl = document.getElementById('iot-hum-val');
  const dhtStatusEl = document.getElementById('iot-dht-status');

  let baseTemp = 26.4;
  let baseHum = 58;

  setInterval(() => {
    if (tempValEl && humValEl) {
      const deltaTemp = (Math.random() - 0.5) * 0.4;
      const deltaHum = (Math.random() - 0.5) * 0.8;
      baseTemp = Math.max(22, Math.min(32, baseTemp + deltaTemp));
      baseHum = Math.max(40, Math.min(75, baseHum + deltaHum));

      tempValEl.innerText = `${baseTemp.toFixed(1)}°C`;
      humValEl.innerText = `${Math.round(baseHum)}%`;
      if (dhtStatusEl) {
        dhtStatusEl.innerText = `DHT11: Active (${new Date().toLocaleTimeString()})`;
      }
    }
  }, 2500);

  const iotSwitches = document.querySelectorAll('.iot-toggle-input');
  iotSwitches.forEach(sw => {
    sw.addEventListener('change', (e) => {
      const card = e.target.closest('.switch-card');
      const label = card ? card.querySelector('.switch-title')?.innerText : 'Device';
      if (card) {
        if (e.target.checked) {
          card.classList.add('on');
          window.showToast(`ESP8266 Command Sent: ${label} turned ON`, 'success');
        } else {
          card.classList.remove('on');
          window.showToast(`ESP8266 Command Sent: ${label} turned OFF`, 'info');
        }
      }
    });
  });

  // ==========================================================================
  // 2. AI MOCK INTERVIEW SIMULATOR (WITH SPEECH SYNTHESIS)
  // ==========================================================================
  const interviewQuestions = {
    data: [
      {
        q: "What is the difference between WHERE and HAVING in SQL, and when would you use Pandas .groupby() over SQL?",
        tip: "Mention row-level vs aggregated filtering and memory/computational tradeoffs in Python."
      },
      {
        q: "How do you handle missing or inconsistent values when preparing datasets for Power BI dashboards?",
        tip: "Discuss imputation, removal, validation flags, and Power Query ETL steps."
      },
      {
        q: "Explain how you calculate Customer Retention and Churn rate using Python Pandas.",
        tip: "Mention cohort analysis, date parsing, groupby user_id, and percentage churn formula."
      }
    ],
    web: [
      {
        q: "How does the JavaScript Event Loop handle asynchronous promises and setTimeout callbacks?",
        tip: "Explain the Microtask queue vs Macrotask queue and call stack execution."
      },
      {
        q: "What are the core differences between React state and props, and how do you optimize re-renders?",
        tip: "Discuss immutable one-way data flow, memoization, useMemo, and useCallback."
      }
    ],
    iot: [
      {
        q: "How does an ESP8266 microcontroller communicate sensor data to a cloud MQTT/REST server?",
        tip: "Explain WiFi station mode, TCP sockets, JSON payload transmission, and AT / Arduino C++ code."
      },
      {
        q: "How does your Drop Sensor Smart Wiper system filter false positives from intermittent noise?",
        tip: "Explain analog threshold calibration, sampling averages, and debounce timing in embedded C."
      }
    ]
  };

  let currentRole = 'data';
  let questionIdx = 0;

  const roleBtns = document.querySelectorAll('.role-btn');
  const qTextEl = document.getElementById('interview-q-text');
  const qBadgeEl = document.getElementById('interview-q-badge');
  const submitAnswerBtn = document.getElementById('btn-submit-answer');
  const nextQBtn = document.getElementById('btn-next-question');
  const speakQBtn = document.getElementById('btn-speak-question');
  const answerInput = document.getElementById('interview-answer-input');
  const feedbackScoreEl = document.getElementById('interview-score');
  const feedbackTextEl = document.getElementById('interview-feedback-text');

  function updateQuestion() {
    const list = interviewQuestions[currentRole];
    const qObj = list[questionIdx % list.length];
    if (qTextEl && qBadgeEl) {
      qBadgeEl.innerText = `Question ${ (questionIdx % list.length) + 1 } of ${list.length} (${currentRole.toUpperCase()})`;
      qTextEl.innerText = qObj.q;
    }
  }

  // Voice speech synthesis
  if (speakQBtn) {
    speakQBtn.addEventListener('click', () => {
      const textToSpeak = qTextEl?.innerText || 'Interview Question';
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.rate = 1.0;
        utterance.pitch = 1.05;
        window.speechSynthesis.speak(utterance);
        window.showToast('Playing AI Voice Readout...', 'info');
      } else {
        window.showToast('Speech synthesis not supported in this browser.', 'warning');
      }
    });
  }

  roleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      roleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentRole = btn.getAttribute('data-role');
      questionIdx = 0;
      updateQuestion();
    });
  });

  if (nextQBtn) {
    nextQBtn.addEventListener('click', () => {
      questionIdx++;
      updateQuestion();
      if (answerInput) answerInput.value = '';
    });
  }

  if (submitAnswerBtn) {
    submitAnswerBtn.addEventListener('click', () => {
      const text = (answerInput?.value || '').trim();
      if (!text) {
        window.showToast('Please type your simulated answer or notes first!', 'warning');
        return;
      }

      submitAnswerBtn.innerText = 'Analyzing with AI Model...';
      submitAnswerBtn.disabled = true;

      setTimeout(() => {
        submitAnswerBtn.innerText = 'Submit for AI Evaluation';
        submitAnswerBtn.disabled = false;

        const wordCount = text.split(/\s+/).length;
        let score = Math.min(98, Math.max(75, 72 + Math.floor(wordCount * 1.2)));

        if (feedbackScoreEl) feedbackScoreEl.innerText = `${score}%`;
        if (feedbackTextEl) {
          feedbackTextEl.innerHTML = `
            <strong>AI Evaluation Summary:</strong><br>
            • <em>Technical Depth:</em> Well-structured explanation covering core concepts.<br>
            • <em>Clarity & Articulation:</em> Strong terminology and domain knowledge demonstrated.<br>
            • <em>Recommendation:</em> Solid answer! Continue highlighting measurable results from your projects.
          `;
        }
        if (window.triggerConfetti) window.triggerConfetti();
        window.showToast(`AI Assessment Complete! Score: ${score}/100`, 'success');
      }, 1100);
    });
  }

  // ==========================================================================
  // 3. SQL PLAYGROUND
  // ==========================================================================
  const sqlInput = document.getElementById('sql-query-input');
  const runSqlBtn = document.getElementById('btn-run-sql');
  const sqlOutputWrap = document.getElementById('sql-table-output');
  const sqlMetaEl = document.getElementById('sql-meta-info');

  const database = {
    students: [
      { id: 101, name: 'Amit Kumar', branch: 'CSE', gpa: 8.8, college: 'Vision Institute of Technology' },
      { id: 102, name: 'Rahul Sharma', branch: 'CSE', gpa: 8.4, college: 'AKTU Lucknow' },
      { id: 103, name: 'Priya Patel', branch: 'IT', gpa: 9.1, college: 'Vision Institute of Technology' },
      { id: 104, name: 'Sneha Verma', branch: 'CSE', gpa: 8.9, college: 'IIT Mandi iHub' }
    ],
    iot_telemetry: [
      { device_id: 'ESP8266_01', location: 'Living Room', temp_c: 26.5, humidity_pct: 55, status: 'ONLINE' },
      { device_id: 'ESP8266_02', location: 'Smart Wiper Car', temp_c: 28.1, humidity_pct: 82, status: 'RAIN_DETECTED' },
      { device_id: 'ESP8266_03', location: 'ATL Lab Hub', temp_c: 24.0, humidity_pct: 50, status: 'ONLINE' }
    ],
    sales_analytics: [
      { region: 'North', category: 'IoT Modules', units_sold: 1420, revenue_inr: 426000 },
      { region: 'West', category: 'Data Solutions', units_sold: 890, revenue_inr: 712000 },
      { region: 'East', category: 'Smart Automation', units_sold: 1100, revenue_inr: 550000 },
      { region: 'South', category: 'Data Solutions', units_sold: 1350, revenue_inr: 1080000 }
    ]
  };

  const presetBtns = document.querySelectorAll('.sql-chip-btn');
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const q = btn.getAttribute('data-query');
      if (sqlInput && q) {
        sqlInput.value = q;
        executeSql(q);
      }
    });
  });

  if (runSqlBtn) {
    runSqlBtn.addEventListener('click', () => {
      const q = (sqlInput?.value || '').trim();
      executeSql(q);
    });
  }

  function executeSql(query) {
    const startTime = performance.now();
    let lowerQ = query.toLowerCase();

    let data = [];
    if (lowerQ.includes('students')) {
      data = database.students;
    } else if (lowerQ.includes('iot') || lowerQ.includes('telemetry')) {
      data = database.iot_telemetry;
    } else {
      data = database.sales_analytics;
    }

    if (data.length === 0) {
      if (sqlOutputWrap) sqlOutputWrap.innerHTML = '<p style="padding:16px; color:#f87171;">No records found.</p>';
      return;
    }

    const headers = Object.keys(data[0]);
    let tableHtml = `<table class="sql-table"><thead><tr>`;
    headers.forEach(h => {
      tableHtml += `<th>${h.toUpperCase()}</th>`;
    });
    tableHtml += `</tr></thead><tbody>`;

    data.forEach(row => {
      tableHtml += `<tr>`;
      headers.forEach(h => {
        tableHtml += `<td>${row[h]}</td>`;
      });
      tableHtml += `</tr>`;
    });
    tableHtml += `</tbody></table>`;

    const elapsed = (performance.now() - startTime).toFixed(2);
    if (sqlOutputWrap) sqlOutputWrap.innerHTML = tableHtml;
    if (sqlMetaEl) sqlMetaEl.innerText = `✓ Query executed successfully: ${data.length} rows returned in ${elapsed}ms`;
  }

  if (sqlInput && sqlInput.value) {
    executeSql(sqlInput.value);
  }

  // ==========================================================================
  // 4. SMART WIPER RAINFALL & SERVO SIMULATOR
  // ==========================================================================
  const rainSlider = document.getElementById('rain-intensity-slider');
  const rainIntensityLbl = document.getElementById('rain-intensity-val');
  const wiperSpeedLbl = document.getElementById('wiper-speed-val');
  const wiperStatusLbl = document.getElementById('wiper-status-val');
  const windshieldCanvas = document.getElementById('windshield-canvas');

  if (windshieldCanvas) {
    const wCtx = windshieldCanvas.getContext('2d');
    let cWidth = windshieldCanvas.width = windshieldCanvas.parentElement.clientWidth || 400;
    let cHeight = windshieldCanvas.height = 260;

    let raindrops = [];
    let rainIntensity = 45; // percentage
    let wiperAngle = 0;
    let wiperDirection = 1;
    let wiperSpeed = 0.04;

    function resizeWindshield() {
      if (windshieldCanvas.parentElement) {
        cWidth = windshieldCanvas.width = windshieldCanvas.parentElement.clientWidth;
        cHeight = windshieldCanvas.height = windshieldCanvas.parentElement.clientHeight || 260;
      }
    }
    window.addEventListener('resize', resizeWindshield);
    resizeWindshield();

    function createRaindrops() {
      raindrops = [];
      const count = Math.floor(rainIntensity * 1.5);
      for (let i = 0; i < count; i++) {
        raindrops.push({
          x: Math.random() * cWidth,
          y: Math.random() * cHeight,
          len: Math.random() * 12 + 6,
          speed: Math.random() * 4 + (rainIntensity * 0.08)
        });
      }
    }
    createRaindrops();

    if (rainSlider) {
      rainSlider.addEventListener('input', (e) => {
        rainIntensity = parseInt(e.target.value);
        if (rainIntensityLbl) rainIntensityLbl.innerText = `${rainIntensity}%`;

        if (rainIntensity === 0) {
          wiperSpeed = 0;
          if (wiperSpeedLbl) wiperSpeedLbl.innerText = '0 RPM (OFF)';
          if (wiperStatusLbl) wiperStatusLbl.innerText = 'DRY (STANDBY)';
        } else if (rainIntensity < 35) {
          wiperSpeed = 0.025;
          if (wiperSpeedLbl) wiperSpeedLbl.innerText = '30 RPM (LOW)';
          if (wiperStatusLbl) wiperStatusLbl.innerText = 'LIGHT DRIZZLE';
        } else if (rainIntensity < 75) {
          wiperSpeed = 0.055;
          if (wiperSpeedLbl) wiperSpeedLbl.innerText = '65 RPM (MEDIUM)';
          if (wiperStatusLbl) wiperStatusLbl.innerText = 'MODERATE RAINFALL';
        } else {
          wiperSpeed = 0.095;
          if (wiperSpeedLbl) wiperSpeedLbl.innerText = '110 RPM (HIGH SPEED)';
          if (wiperStatusLbl) wiperStatusLbl.innerText = 'TORRENTIAL DOWNPOUR';
        }
        createRaindrops();
      });
    }

    function renderWindshield() {
      wCtx.clearRect(0, 0, cWidth, cHeight);

      // Draw Raindrops
      wCtx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
      wCtx.lineWidth = 1.5;

      raindrops.forEach(drop => {
        wCtx.beginPath();
        wCtx.moveTo(drop.x, drop.y);
        wCtx.lineTo(drop.x - 2, drop.y + drop.len);
        wCtx.stroke();

        drop.y += drop.speed;
        drop.x -= 0.5;

        if (drop.y > cHeight) {
          drop.y = -10;
          drop.x = Math.random() * cWidth;
        }
      });

      // Draw Wiper Blade Sweep
      if (wiperSpeed > 0) {
        wiperAngle += wiperSpeed * wiperDirection;
        if (wiperAngle > Math.PI * 0.75) wiperDirection = -1;
        if (wiperAngle < -Math.PI * 0.1) wiperDirection = 1;
      }

      const pivotX = cWidth * 0.5;
      const pivotY = cHeight * 0.95;
      const bladeLen = cHeight * 0.8;

      const tipX = pivotX + Math.cos(wiperAngle - Math.PI / 2) * bladeLen;
      const tipY = pivotY + Math.sin(wiperAngle - Math.PI / 2) * bladeLen;

      // Wiper Arm
      wCtx.beginPath();
      wCtx.moveTo(pivotX, pivotY);
      wCtx.lineTo(tipX, tipY);
      wCtx.strokeStyle = '#e2e8f0';
      wCtx.lineWidth = 4;
      wCtx.stroke();

      // Blade Sweep glow
      wCtx.beginPath();
      wCtx.arc(pivotX, pivotY, bladeLen, -Math.PI * 0.8, -Math.PI * 0.2);
      wCtx.strokeStyle = 'rgba(99, 102, 241, 0.15)';
      wCtx.lineWidth = 2;
      wCtx.stroke();

      requestAnimationFrame(renderWindshield);
    }
    renderWindshield();
  }

  // ==========================================================================
  // 5. INTERACTIVE LIVE DATA ANALYTICS CHART VISUALIZER
  // ==========================================================================
  const chartDatasets = {
    revenue: [
      { label: 'Q1', val: 78, num: '$1.4M' },
      { label: 'Q2', val: 88, num: '$2.1M' },
      { label: 'Q3', val: 95, num: '$2.8M' },
      { label: 'Q4', val: 100, num: '$3.4M' }
    ],
    iot_nodes: [
      { label: 'Living Room', val: 65, num: '26°C' },
      { label: 'Wiper Car', val: 92, num: '85% Rain' },
      { label: 'ATL Lab', val: 50, num: '24°C' },
      { label: 'Gateway', val: 82, num: '99% Up' }
    ],
    user_growth: [
      { label: 'Jan', val: 45, num: '12.4K' },
      { label: 'Apr', val: 68, num: '28.9K' },
      { label: 'Jul', val: 85, num: '54.2K' },
      { label: 'Oct', val: 96, num: '78.4K' }
    ]
  };

  const chartCategoryBtns = document.querySelectorAll('.chart-toggle-btn');
  const chartCols = document.querySelectorAll('.chart-bar-col');

  function updateAnalyticsChart(key) {
    const data = chartDatasets[key] || chartDatasets.revenue;
    chartCols.forEach((col, idx) => {
      const item = data[idx];
      if (item) {
        const fill = col.querySelector('.chart-bar-fill');
        const valEl = col.querySelector('.chart-bar-val');
        const lblEl = col.querySelector('.chart-bar-lbl');
        if (fill) fill.style.height = `${item.val}%`;
        if (valEl) valEl.innerText = item.num;
        if (lblEl) lblEl.innerText = item.label;
      }
    });
  }

  chartCategoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      chartCategoryBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const key = btn.getAttribute('data-chart');
      updateAnalyticsChart(key);
      window.showToast(`Analytics Metric: ${btn.innerText} Loaded`, 'info');
    });
  });

  // ==========================================================================
  // 6. SAFESPHERE THREAT RADAR SIMULATOR
  // ==========================================================================
  const threatFeedEl = document.getElementById('threat-alert-feed');
  const btnTriggerThreat = document.getElementById('btn-trigger-threat');
  const threatFilterBtns = document.querySelectorAll('.threat-filter-btn');

  const simulatedThreatsPool = [
    { type: 'Intrusion Detected', loc: 'Sector 7A - Perimeter', badge: 'Critical', class: 'critical', desc: 'Unauthorized movement logged at smart perimeter node.' },
    { type: 'Fire Hazard Sensor', loc: 'Sector 7B - Lab Unit', badge: 'Critical', class: 'critical', desc: 'DHT / Smoke threshold spike detected (78°C).' },
    { type: 'API Rate Limit Spike', loc: 'Gateway Auth Server', badge: 'High', class: 'high', desc: 'Unusual authentication payload burst intercepted.' },
    { type: 'CCTV Node Offline', loc: 'Sector 4B - Main Gate', badge: 'High', class: 'high', desc: 'Heartbeat lost; failover node activated.' },
    { type: 'Node Telemetry Synced', loc: 'All 14 IoT Relays', badge: 'Normal', class: 'normal', desc: 'Secure AES-256 encrypted handshake verified.' },
    { type: 'Perimeter Check Ok', loc: 'Sector 1 - Zone North', badge: 'Normal', class: 'normal', desc: 'Routine automated telemetry check passed.' }
  ];

  function addThreatItem(threat) {
    if (!threatFeedEl) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString();
    const item = document.createElement('div');
    item.className = `threat-item ${threat.class}`;
    item.setAttribute('data-severity', threat.class);
    item.innerHTML = `
      <div class="threat-meta">
        <div class="threat-type">${threat.type} <span style="font-size:0.75rem; color:var(--text-muted); font-weight:normal;">• ${threat.loc}</span></div>
        <div class="threat-time">⏰ ${timeStr} — ${threat.desc}</div>
      </div>
      <span class="threat-badge ${threat.class}">${threat.badge}</span>
    `;
    threatFeedEl.prepend(item);

    // Limit to 10 items
    while (threatFeedEl.children.length > 10) {
      threatFeedEl.removeChild(threatFeedEl.lastChild);
    }
  }

  if (btnTriggerThreat) {
    btnTriggerThreat.addEventListener('click', () => {
      const randomThreat = simulatedThreatsPool[Math.floor(Math.random() * simulatedThreatsPool.length)];
      addThreatItem(randomThreat);
      window.showToast(`SafeSphere Alert: ${randomThreat.type} (${randomThreat.badge}) logged!`, randomThreat.class === 'critical' ? 'error' : randomThreat.class === 'high' ? 'warning' : 'success');
    });
  }

  threatFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      threatFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-threat-filter');
      const items = threatFeedEl?.querySelectorAll('.threat-item') || [];
      items.forEach(item => {
        const sev = item.getAttribute('data-severity');
        if (filter === 'all' || sev === filter) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // ==========================================================================
  // 7. AI RESUME MAKER SIMULATOR (ATS PROMPT WORKFLOW & SCORE ENGINE)
  // ==========================================================================
  const resumeRoleSelect = document.getElementById('resume-role-select');
  const resumeKeywordInput = document.getElementById('resume-keywords-input');
  const btnGenerateResume = document.getElementById('btn-generate-resume');
  const resumeOutputText = document.getElementById('resume-output-text');
  const atsScoreNum = document.getElementById('ats-score-num');
  const atsKeywordsList = document.getElementById('ats-keywords-list');
  const btnCopyResume = document.getElementById('btn-copy-resume');

  const resumeTemplates = {
    data: {
      score: '98%',
      keywords: ['Python', 'SQL', 'Power BI', 'Pandas', 'NumPy', 'Data Annotation', 'ETL', 'Matplotlib'],
      text: `B.Tech CSE undergraduate (Vision Institute of Technology, AKTU, Class of 2027) with deep expertise in Data Analytics, automated Python pipelines (Pandas, NumPy), and relational SQL databases. Experienced in building executive Power BI reporting dashboards, translating unstructured datasets into actionable business intelligence, and executing ML data preparation certified by IIT Mandi & iHub HCI Foundation.`
    },
    web: {
      score: '96%',
      keywords: ['JavaScript (ES6+)', 'React.js', 'REST APIs', 'HTML5/CSS3', 'UI Testing', 'Git/GitHub', 'Responsive Design'],
      text: `Frontend Software Engineer specializing in modern JavaScript (ES6+), React.js, and responsive web architectures. Proven track record developing intuitive user interfaces, integrating secure REST APIs, and architecting real-time web applications like SafeSphere and AI Mock Interview simulators with sub-second latency and zero layout shifts.`
    },
    iot: {
      score: '97%',
      keywords: ['Arduino', 'ESP8266', 'Embedded C', 'Sensor Interfacing', 'Relays', 'DHT11', 'Automation Systems'],
      text: `Embedded IoT Engineer experienced in microcontroller programming (ESP8266 & Arduino), sensor telemetry networks (DHT11, Raindrop Sensors), and hardware automation. Awarded District-Level Certificate by Atal Tinkering Lab (ATL Lab) for innovative Smart Home Automation and vehicle safety systems.`
    }
  };

  function updateResumeSimulator() {
    const role = resumeRoleSelect ? resumeRoleSelect.value : 'data';
    const template = resumeTemplates[role] || resumeTemplates.data;
    const customKw = resumeKeywordInput?.value.trim();

    let finalText = template.text;
    if (customKw) {
      finalText += ` Tailored for roles demanding: ${customKw}.`;
    }

    if (resumeOutputText) {
      resumeOutputText.innerText = finalText;
    }

    if (atsScoreNum) {
      atsScoreNum.innerText = template.score;
    }

    if (atsKeywordsList) {
      atsKeywordsList.innerHTML = template.keywords.map(k => `<span class="tech-chip" style="font-size:0.75rem; background:rgba(16,185,129,0.15); color:#34d399; border-color:rgba(16,185,129,0.3);">✓ ${k}</span>`).join('');
    }
  }

  if (btnGenerateResume) {
    btnGenerateResume.addEventListener('click', () => {
      updateResumeSimulator();
      if (window.triggerConfetti) window.triggerConfetti();
      window.showToast('AI Resume Maker: ATS Tailored Summary & Keywords Generated!', 'success');
    });
  }

  if (resumeRoleSelect) {
    resumeRoleSelect.addEventListener('change', updateResumeSimulator);
  }

  if (btnCopyResume) {
    btnCopyResume.addEventListener('click', () => {
      if (resumeOutputText) {
        navigator.clipboard.writeText(resumeOutputText.innerText).then(() => {
          window.showToast('Summary copied to clipboard!', 'success');
        }).catch(() => {
          window.showToast('Summary copied!', 'info');
        });
      }
    });
  }
});

