const fs = require('fs');

try {
  const raw = fs.readFileSync('test-results.json', 'utf8');
  const report = JSON.parse(raw);
  const stats = report.stats;
  
  const failedTests = [];
  if (report.suites) {
    const findFailed = (suite) => {
      if (suite.specs) {
        suite.specs.forEach(spec => {
          if (spec.ok === false) {
            failedTests.push(spec.title);
          }
        });
      }
      if (suite.suites) {
        suite.suites.forEach(findFailed);
      }
    };
    report.suites.forEach(findFailed);
  }

  const data = {
    lastCheck: new Date().toISOString(),
    total: stats.expected + stats.unexpected + stats.flaky,
    passed: stats.expected + stats.flaky,
    failed: stats.unexpected,
    failedTests: failedTests
  };
  
  fs.writeFileSync('signal-status.json', JSON.stringify(data, null, 2));
  console.log('Signal status JSON generated successfully:', data);
} catch (e) {
  console.error('Error parsing report:', e);
  const data = { lastCheck: new Date().toISOString(), total: 0, passed: 0, failed: 1, failedTests: ['Error parsing test results'] };
  fs.writeFileSync('signal-status.json', JSON.stringify(data, null, 2));
}