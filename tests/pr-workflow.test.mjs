import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const workflowPath = path.join(process.cwd(), '.github', 'workflows', 'pr-checks.yml');

test('pull requests run read-only build and artifact checks without deploying', () => {
  assert.ok(existsSync(workflowPath), 'expected a pull-request verification workflow');
  const workflow = readFileSync(workflowPath, 'utf8');

  const triggerBlock = workflow.match(/on:\n([\s\S]*?)\npermissions:/)?.[1].trim();
  assert.equal(triggerBlock, 'pull_request:\n    branches: [main]');

  const permissionsBlock = workflow.match(/permissions:\n([\s\S]*?)\nconcurrency:/)?.[1].trim();
  assert.equal(permissionsBlock, 'contents: read');
  assert.match(workflow, /group: pr-checks-\$\{\{ github\.event\.pull_request\.number \}\}/);
  assert.match(workflow, /cancel-in-progress: true/);

  const operations = [...workflow.matchAll(/^ {8}(uses|run): (.+)$/gm)]
    .map((match) => `${match[1]}: ${match[2]}`);
  assert.equal(operations.length, 5, 'expected exactly two actions and three npm commands');
  assert.match(operations[0], /^uses: actions\/checkout@[0-9a-f]{40} # v4$/);
  assert.match(operations[1], /^uses: actions\/setup-node@[0-9a-f]{40} # v4$/);
  assert.deepEqual(operations.slice(2), [
    'run: npm ci',
    'run: npm run build',
    'run: npm test',
  ]);

  assert.doesNotMatch(
    workflow,
    /pull_request_target|workflow_dispatch|schedule:|push:|deploy|publish|pages:|id-token:/i,
  );
});
