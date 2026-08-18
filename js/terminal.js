/**
 * Cyberpunk Interactive Developer Terminal CLI
 */

document.addEventListener('DOMContentLoaded', () => {
  const terminalBody = document.getElementById('terminal-body');
  const terminalInput = document.getElementById('terminal-input');
  const terminalOutput = document.getElementById('terminal-output');

  if (!terminalInput || !terminalOutput) return;

  const commandHistory = [];
  let historyIndex = -1;

  const commands = {
    help: () => `
<span class="info">⚡ Available Terminal Commands:</span>
  <span class="cmd-echo">about</span>         - Discover Amit's background & education
  <span class="cmd-echo">skills</span>        - List technical capabilities across Data & Web
  <span class="cmd-echo">projects</span>      - View top featured physical & software projects
  <span class="cmd-echo">experience</span>    - Display work history & internships
  <span class="cmd-echo">awards</span>        - Show hackathon victories & certificates
  <span class="cmd-echo">contact</span>       - Show direct contact channels & links
  <span class="cmd-echo">resume</span>        - Trigger direct PDF resume download
  <span class="cmd-echo">whoami</span>        - View current session user
  <span class="cmd-echo">matrix</span>        - Enter cyberpunk Matrix mode
  <span class="cmd-echo">clear</span>         - Clear the terminal screen
`,
    about: () => `
<span class="success">👤 Amit Kumar</span> - B.Tech CSE (Vision Institute of Technology, AKTU Class of 2027)
Location: Vill-Amarpur, Post-Harfari, Sambhal (UP)
Focus: Data Analytics (Python, SQL, Power BI, Pandas), Frontend Web (React, JavaScript), IoT (ESP8266, Arduino).
Certified Data Annotator by IIT Mandi & iHub HCI Foundation.
`,
    skills: () => `
<span class="info">🛠️ Technical Stack:</span>
• <b>Languages:</b> Python, JavaScript (ES6+), SQL, HTML5, CSS3, Embedded C
• <b>Data & Analytics:</b> Excel, Power BI, Pandas, NumPy, Matplotlib, Data Annotation
• <b>Frontend & Tools:</b> React.js (Basics), REST APIs, Git, GitHub, VS Code, UI Testing
• <b>IoT / Hardware:</b> Arduino, ESP8266, Sensor Interfacing, Automation Systems
• <b>Soft Skills:</b> Teamwork, Problem Solving, Critical Thinking, Time Management, Leadership
`,
    projects: () => `
<span class="warning">🚀 Featured Projects:</span>
1. <b>SafeSphere:</b> Web / Safety monitoring platform with real-time alerts & threat logging.
2. <b>AI Resume Maker:</b> Intelligent ATS-friendly resume generation platform with live preview & tailoring.
3. <b>Smart Home Automation System:</b> ESP8266 remote appliance control & telemetry. (District Award)
4. <b>AI Interview System:</b> Web-based mock interview platform with speech synthesis & scoring.
5. <b>Drop Sensor Wiper Car System:</b> Automatic rainfall detection & servo control.
6. <b>Data Analytics & SQL Suite:</b> Python wrangling, SQL queries & Power BI dashboards.
`,
    experience: () => `
<span class="info">💼 Experience:</span>
• <b>Data Analytics Intern</b> @ HexaSoftware - Data extraction, cleaning, reporting (Python, SQL, Power BI).
• <b>Technical Support Engineer</b> @ Computer Net World - Hardware, networking & OS troubleshooting.
`,
    awards: () => `
<span class="warning">🏆 Achievements & Recognitions:</span>
• <b>3rd Position</b> - HackGear 2.0 (Team Quantum Coders) - National Hackathon
• <b>District Level Certificate</b> - Technical Innovation on Smart Home Automation System (ATL Lab)
• <b>HackGear 1.0</b> - National-level participation & coordination certificates
• <b>Certified Data Annotator</b> - IIT Mandi & iHub HCI Foundation
`,
    contact: () => `
<span class="success">📬 Connect with Amit Kumar:</span>
• Email:    <a href="mailto:amitk55575@gmail.com" style="color:#38bdf8; text-decoration:underline;">amitk55575@gmail.com</a>
• Phone:    +91 7817034503
• LinkedIn: <a href="https://linkedin.com/in/amit-kumar-479211332" target="_blank" style="color:#38bdf8; text-decoration:underline;">linkedin.com/in/amit-kumar-479211332</a>
• GitHub:   <a href="https://github.com/Amitydv2007" target="_blank" style="color:#38bdf8; text-decoration:underline;">github.com/Amitydv2007</a>
• Location: Sambhal (UP), India
`,
    resume: () => {
      const link = document.createElement('a');
      link.href = 'assets/resume/Amit_Kumar_Resume.pdf';
      link.download = 'Amit_Kumar_Resume.pdf';
      link.click();
      return `<span class="success">✓ Downloading Amit Kumar's Resume (PDF)...</span>`;
    },
    whoami: () => `<span class="info">visitor@portfolio.amitkumar.dev [Access Level: Guest / Recruiter]</span>`,
    matrix: () => `<span class="success">Wake up, Neo... Follow the white rabbit 🐇</span>`,
    clear: () => {
      terminalOutput.innerHTML = '';
      return '';
    }
  };

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const inputVal = terminalInput.value.trim();
      terminalInput.value = '';

      if (!inputVal) return;

      commandHistory.push(inputVal);
      historyIndex = commandHistory.length;

      // Echo command
      const cmdRow = document.createElement('div');
      cmdRow.className = 'terminal-line';
      cmdRow.innerHTML = `<span style="color:#34d399;">amit@portfolio:~$</span> <span class="cmd-echo">${inputVal}</span>`;
      terminalOutput.appendChild(cmdRow);

      // Process command
      const lowerCmd = inputVal.toLowerCase();
      let response = '';

      if (commands[lowerCmd]) {
        response = commands[lowerCmd]();
      } else {
        response = `<span class="error">Command not found: "${inputVal}". Type <b style="color:#38bdf8;">help</b> to see valid commands.</span>`;
      }

      if (response) {
        const resRow = document.createElement('div');
        resRow.className = 'terminal-line';
        resRow.innerHTML = response;
        terminalOutput.appendChild(resRow);
      }

      if (terminalBody) {
        terminalBody.scrollTop = terminalBody.scrollHeight;
      }
    } else if (e.key === 'ArrowUp') {
      if (historyIndex > 0) {
        historyIndex--;
        terminalInput.value = commandHistory[historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        terminalInput.value = commandHistory[historyIndex];
      } else {
        historyIndex = commandHistory.length;
        terminalInput.value = '';
      }
    }
  });
});
