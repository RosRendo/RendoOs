const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projects = [
  { name: 'RendoOs', path: 'd:\\FOR RENDO (ONLY )\\Personal Project\\RendoOs' },
  { name: 'Portfolio', path: 'D:\\FOR RENDO (ONLY )\\Portfolio' },
  { name: 'Dashboard', path: 'D:\\FOR RENDO (ONLY )\\Personal Project\\Dashboard' },
  { name: 'Service_Finder', path: 'D:\\FOR RENDO (ONLY )\\Personal Project\\Service_Finder' },
  { name: 'Stackgen', path: 'D:\\FOR RENDO (ONLY )\\Personal Project\\Stackgen' },
  { name: 'TechTune Healer', path: 'D:\\CamtechUniversity\\ProgrammingYearIII\\techtune-healer' },
  { name: 'JARVIS', path: 'D:\\FOR RENDO (ONLY )\\JARVIS' },
  { name: 'AI-Command-Agent', path: 'D:\\FOR RENDO (ONLY )\\Personal Project\\AI-Command-Agent' },
  { name: 'Real-Estate', path: 'D:\\FOR RENDO (ONLY )\\Personal Project\\Real-Estate' },
  { name: 'Orchestrator', path: 'D:\\FOR RENDO (ONLY )\\Personal Project\\Orchestrator' },
  { name: 'Ecommerce', path: 'D:\\FOR RENDO (ONLY )\\Ecommerce\\Ecommerce' },
  { name: 'PrivateTutor', path: 'D:\\FOR RENDO (ONLY )\\Personal Project\\PrivateTutor' },
  { name: 'POS_SYSTEM', path: 'D:\\FOR RENDO (ONLY )\\Personal Project\\POS_SYSTEM' },
  { name: 'CV-Gen', path: 'D:\\FOR RENDO (ONLY )\\Personal Project\\CV-Gen' }
];

const results = [];
for (const p of projects) {
  const exists = fs.existsSync(p.path);
  let hasGit = false;
  let remote = '';
  let status = '';
  if (exists) {
    hasGit = fs.existsSync(path.join(p.path, '.git'));
    if (hasGit) {
      try {
        remote = execSync(`git -C "${p.path}" remote get-url origin`, { encoding: 'utf8' }).trim();
      } catch (e) {
        remote = 'no origin';
      }
      try {
        const diff = execSync(`git -C "${p.path}" status --porcelain`, { encoding: 'utf8' }).trim();
        status = diff.length === 0 ? 'CLEAN' : `${diff.split('\n').length} uncommitted files`;
      } catch (e) {
        status = 'error';
      }
    } else {
      status = 'NO .GIT';
    }
  } else {
    status = 'PATH NOT FOUND';
  }
  results.push({ name: p.name, exists, hasGit, remote, status, path: p.path });
}

console.table(results);
