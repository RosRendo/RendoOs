// Automated End-to-End Flow Runner for RendoOS (Replica Test)
import assert from 'node:assert';

const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('🚀 Running Replica E2E Flow Test Suite against', BASE_URL);
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      process.stdout.write(`  ▶ ${name}... `);
      await fn();
      console.log('✅ PASS');
      passed++;
    } catch (err) {
      console.log(`❌ FAIL: ${err.message}`);
      failed++;
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 1. ROUTE INTEGRITY & SSR CHECKS
  // ─────────────────────────────────────────────────────────────
  console.log('\n[1] Page Routes & Shell Health');
  const routes = ['/', '/projects', '/ideas', '/review', '/archive', '/settings'];
  for (const path of routes) {
    await test(`GET ${path} returns HTTP 200`, async () => {
      const res = await fetch(`${BASE_URL}${path}`);
      assert.strictEqual(res.status, 200, `Expected 200 for ${path}, got ${res.status}`);
      const text = await res.text();
      assert.ok(text.length > 500, `Page content for ${path} was suspiciously short`);
      assert.ok(!text.includes('Internal Server Error'), `Found 500 in ${path}`);
    });
  }

  // ─────────────────────────────────────────────────────────────
  // 2. FLOW F01: Morning Focus & Command Center
  // ─────────────────────────────────────────────────────────────
  console.log('\n[2] Flow F01: Morning Command Center & Tasks');
  let sampleTaskId = null;
  let initialTaskStatus = null;

  await test('F01-H1: Fetch /api/today and verify structure', async () => {
    const res = await fetch(`${BASE_URL}/api/today`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data.todayTasks), 'todayTasks should be an array');
    assert.ok(data.primaryProject !== undefined, 'primaryProject field should exist');

    if (data.todayTasks.length > 0) {
      sampleTaskId = data.todayTasks[0].id;
      initialTaskStatus = data.todayTasks[0].status;
    }
  });

  if (sampleTaskId) {
    await test(`F01-H2: Toggle task status (Task ${sampleTaskId})`, async () => {
      const newStatus = initialTaskStatus === 'DONE' ? 'TODO' : 'DONE';
      const patchRes = await fetch(`${BASE_URL}/api/tasks`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: sampleTaskId, status: newStatus }),
      });
      assert.strictEqual(patchRes.status, 200);
      const updated = await patchRes.json();
      assert.strictEqual(updated.status, newStatus);

      // Revert back
      await fetch(`${BASE_URL}/api/tasks`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: sampleTaskId, status: initialTaskStatus }),
      });
    });
  }

  // ─────────────────────────────────────────────────────────────
  // 3. FLOW F02: Quick Capture
  // ─────────────────────────────────────────────────────────────
  console.log('\n[3] Flow F02: Quick Capture Operations');
  let createdTaskId = null;
  let createdIdeaId = null;

  await test('F02-H1: Quick Capture Task creation', async () => {
    // Get a project id first
    const projectsRes = await fetch(`${BASE_URL}/api/projects?status=ALL`);
    const projects = await projectsRes.json();
    assert.ok(projects.length > 0, 'Should have at least 1 project');
    const projectId = projects[0].id;

    const res = await fetch(`${BASE_URL}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId,
        title: 'E2E Test Task ' + Date.now(),
        bucket: 'NOW',
        priority: 'HIGH',
      }),
    });
    assert.ok(res.status === 200 || res.status === 201, `Expected 200 or 201, got ${res.status}`);
    const task = await res.json();
    assert.ok(task.id, 'Task should have an ID');
    createdTaskId = task.id;
  });

  await test('F02-H2: Quick Capture Idea creation', async () => {
    const res = await fetch(`${BASE_URL}/api/ideas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'E2E Test Idea ' + Date.now(),
        description: 'Automated test idea payload',
        category: 'FEATURE',
      }),
    });
    assert.ok(res.status === 200 || res.status === 201, `Expected 200 or 201, got ${res.status}`);
    const idea = await res.json();
    assert.ok(idea.id, 'Idea should have an ID');
    createdIdeaId = idea.id;
  });

  await test('F02-N1: Negative validation on empty title', async () => {
    const res = await fetch(`${BASE_URL}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: '' }),
    });
    assert.ok(res.status >= 400, 'Empty title should return client error code');
  });

  // Cleanup created task
  if (createdTaskId) {
    await test('F02-Cleanup: Delete test task', async () => {
      const res = await fetch(`${BASE_URL}/api/tasks?id=${createdTaskId}`, {
        method: 'DELETE',
      });
      assert.strictEqual(res.status, 200);
    });
  }

  // ─────────────────────────────────────────────────────────────
  // 4. FLOW F03: Project Workspace & Progressive Disclosure
  // ─────────────────────────────────────────────────────────────
  console.log('\n[4] Flow F03: Project Workspace & Database Inspection');
  await test('F03-H1: Fetch Project Detail and verify tabs data', async () => {
    const projectsRes = await fetch(`${BASE_URL}/api/projects?status=ALL`);
    const projects = await projectsRes.json();
    const firstProject = projects[0];

    const res = await fetch(`${BASE_URL}/api/projects/${firstProject.slug || firstProject.id}`);
    assert.strictEqual(res.status, 200);
    const detail = await res.json();
    assert.ok(detail.name, 'Project detail must have name');
    assert.ok(Array.isArray(detail.tasks), 'Project detail must have tasks array');
  });

  await test('F03-E1: Graceful 404 for invalid project slug', async () => {
    const res = await fetch(`${BASE_URL}/api/projects/nonexistent-project-slug-99999`);
    assert.strictEqual(res.status, 404);
  });

  // ─────────────────────────────────────────────────────────────
  // 5. FLOW F04: Stale Repo Hygiene & Review
  // ─────────────────────────────────────────────────────────────
  console.log('\n[5] Flow F04: Weekly Review & Repo Triage');
  await test('F04-H1: Fetch Weekly Review data', async () => {
    const res = await fetch(`${BASE_URL}/api/review`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.completedCount !== undefined, 'Review must have completedCount');
    assert.ok(data.inactiveProjects !== undefined, 'Review must have inactiveProjects');
  });

  // ─────────────────────────────────────────────────────────────
  // SUMMARY
  // ─────────────────────────────────────────────────────────────
  console.log('\n=============================================================');
  console.log(`Test Execution Finished: ${passed} passed, ${failed} failed.`);
  console.log('=============================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
