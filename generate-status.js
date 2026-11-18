const fs = require('fs');

// Настройки лора: сопоставляем названия тестовых файлов с "каналами"
const channelMapping = {
  'navigation.spec.js': 'Route integrity',
  'language.spec.js': 'Language channel sync',
  'a11y.spec.js': 'Channel accessibility',
  'forms.spec.js': 'Outgoing signal quality',
  'media.spec.js': 'Media integrity',
  'links.spec.js': 'Relay stability',
  'signal-room.spec.js': 'Relay stability',
  'default': 'Media integrity' 
};

try {
  const raw = fs.readFileSync('test-results.json', 'utf8');
  const report = JSON.parse(raw);

  const failedTests = [];
  const channelStats = {};
  let totalTests = 0;
  let passedTests = 0;
  let failedTestsCount = 0;

  // Инициализируем каналы
  Object.values(channelMapping).forEach(ch => channelStats[ch] = { passed: 0, failed: 0 });

  // Рекурсивный поиск тестов
  const findTests = (suite, fileName = '') => {
    if (suite.file) fileName = suite.file;
    
    if (suite.specs) {
      suite.specs.forEach(spec => {
        // Определяем канал
        let channelName = channelMapping[fileName.split('/').pop()] || channelMapping['default'];
        if (spec.title.includes('A11y') || spec.title.includes('Accessibility')) {
          channelName = 'Channel accessibility';
        }

        // Считаем тесты
        if (spec.tests && spec.tests.length > 0) {
          spec.tests.forEach(test => {
            totalTests++;
            // В Playwright статус теста может быть 'expected', 'unexpected', 'flaky', 'skipped'
            const status = test.results[0]?.status || 'unknown';
            if (status === 'passed' || status === 'expected') {
              passedTests++;
              channelStats[channelName].passed++;
            } else if (status === 'failed' || status === 'unexpected') {
              failedTestsCount++;
              channelStats[channelName].failed++;
              failedTests.push({
                title: spec.title,
                error: test.results[0]?.error?.message || 'Unknown error'
              });
            } else if (status === 'skipped') {
              // Пропущенные тоже считаем в total, но не в passed/failed
            }
          });
        }
      });
    }
    if (suite.suites) suite.suites.forEach(s => findTests(s, fileName));
  };

  if (report.suites) report.suites.forEach(s => findTests(s));

  // Формируем массив каналов для фронтенда
  const channels = Object.keys(channelStats).map(name => ({
    name: name,
    status: channelStats[name].failed > 0 ? 'fail' : 'pass'
  }));

  // --- ЛОГИКА ИСТОРИИ ---
  let history = [];
  try {
    const existingData = JSON.parse(fs.readFileSync('signal-status.json', 'utf8'));
    if (existingData.history) history = existingData.history;
  } catch (e) {
    // Файла еще нет, история пустая
  }

  const newRecord = {
    record: history.length > 0 ? history[0].record + 1 : 117,
    date: new Date().toISOString(),
    status: failedTestsCount > 0 ? 'unstable' : 'stable',
    total: totalTests,
    passed: passedTests
  };

  history.unshift(newRecord); // Добавляем в начало
  history = history.slice(0, 5); // Оставляем только 5 последних записей

  // --- ФОРМИРУЕМ ИТОГОВЫЙ JSON ---
  const data = {
    lastCheck: new Date().toISOString(),
    total: totalTests,
    passed: passedTests,
    failed: failedTestsCount,
    failedTests: failedTests,
    channels: channels,
    history: history
  };

  fs.writeFileSync('signal-status.json', JSON.stringify(data, null, 2));
  console.log(`Signal status updated successfully! Total: ${totalTests}, Passed: ${passedTests}, Failed: ${failedTestsCount}`);
} catch (e) {
  console.error('Error parsing report:', e);
  process.exit(1);
}
