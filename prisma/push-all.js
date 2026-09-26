const { execSync } = require('child_process');

const projects = [
  { name: 'RendoOs', path: 'd:\\FOR RENDO (ONLY )\\Personal Project\\RendoOs' },
  { name: 'Portfolio', path: 'D:\\FOR RENDO (ONLY )\\Portfolio' },
  { name: 'Dashboard', path: 'D:\\FOR RENDO (ONLY )\\Personal Project\\Dashboard' },
  { name: 'Service_Finder', path: 'D:\\FOR RENDO (ONLY )\\Personal Project\\Service_Finder' },
  { name: 'Stackgen', path: 'D:\\FOR RENDO (ONLY )\\Personal Project\\Stackgen' },
  { name: 'Ecommerce', path: 'D:\\FOR RENDO (ONLY )\\Ecommerce\\Ecommerce' },
  { name: 'TechTune Healer', path: 'D:\\CamtechUniversity\\ProgrammingYearIII\\techtune-healer' },
  { name: 'JARVIS', path: 'D:\\FOR RENDO (ONLY )\\JARVIS' },
  { name: 'AI-Command-Agent', path: 'D:\\FOR RENDO (ONLY )\\Personal Project\\AI-Command-Agent' },
  { name: 'Real-Estate', path: 'D:\\FOR RENDO (ONLY )\\Personal Project\\Real-Estate' },
  { name: 'Orchestrator', path: 'D:\\FOR RENDO (ONLY )\\Personal Project\\Orchestrator' },
  { name: 'PrivateTutor', path: 'D:\\FOR RENDO (ONLY )\\Personal Project\\PrivateTutor' },
  { name: 'POS_SYSTEM', path: 'D:\\FOR RENDO (ONLY )\\Personal Project\\POS_SYSTEM' }
];

const results = [];
for (const p of projects) {
  let remote = '';
  let pushResult = '';
  try {
    remote = execSync(`git -C "${p.path}" remote get-url origin`, { encoding: 'utf8' }).trim();
  } catch (e) {
    remote = 'none';
  }

  // Attempt push
  try {
    const out = execSync(`git -C "${p.path}" push -u origin main 2>&1`, { encoding: 'utf8' }).trim();
    pushResult = 'SUCCESS: ' + (out.includes('up-to-date') ? 'Up to date' : 'Pushed to origin/main');
  } catch (err) {
    const msg = (err.stdout || '') + (err.stderr || '') + (err.message || '');
    if (msg.includes('Repository not found') || msg.includes('not found')) {
      pushResult = 'NOT CREATED ON GITHUB YET';
    } else if (msg.includes('fetch first') || msg.includes('non-fast-forward')) {
      pushResult = 'DIVERGED / REBASE NEEDED';
    } else {
      pushResult = 'FAILED: ' + msg.slice(0, 80).replace(/\r?\n/g, ' ');
    }
  }

  results.push({ name: p.name, remote, pushResult });
}

console.table(results);
