const fs = require('fs');

// Настройки лора: сопоставляем файлы с двуязычными названиями каналов
const channelMapping = {
  'navigation.spec.js': { en: 'Route integrity', ru: 'Целостность маршрутов' },
  'language.spec.js': { en: 'Language channel sync', ru: 'Синхронизация языков' },
  'a11y.spec.js': { en: 'Channel accessibility', ru: 'Доступность канала' },
  'forms.spec.js': { en: 'Outgoing signal quality', ru: 'Качество сигнала' },
  'media.spec.js': { en: 'Media integrity', ru: 'Целостность носителя' },
  'links.spec.js': { en: 'Relay stability', ru: 'Стабильность ретрансляции' },
  'signal-room.spec.js': { en: 'Relay stability', ru: 'Стабильность ретрансляции' },
  'easter-eggs.spec.js': { en: 'Hidden protocols', ru: 'Скрытые протоколы' },
  'archive-room.spec.js': { en: 'Archive integrity', ru: 'Целостность архива' },
  'project-pages.spec.js': { en: 'Project database sync', ru: 'Синхронизация базы проектов' },
  'default': { en: 'Media integrity', ru: 'Целостность носителя' }
};

try {
  const raw = fs.readFileSync('test-results.json', 'utf8');
  const report = JSON.parse(raw);

  const failedTests = [];
  const channelStats = {};
  let totalTests = 0;
  let passedTests = 0;
  let failedTestsCount = 0;

  // Инициализируем каналы (используем английское название как ключ)
  Object.values(channelMapping).forEach(ch => {
    if (!channelStats[ch.en]) {
      channelStats[ch.en] = { passed: 0, failed: 0, ruName: ch.ru };
    }
  });

  const findTests = (suite, fileName = '') => {
    if (suite.file) fileName = suite.file;
    
    if (suite.specs) {
      suite.specs.forEach(spec => {
        let channelInfo = channelMapping[fileName.split('/').pop()] || channelMapping['default'];
        
        // Если в названии теста есть A11y, кидаем в Accessibility
        if (spec.title.includes('A11y') || spec.title.includes('Accessibility')) {
          channelInfo = channelMapping['a11y.spec.js'];
        }

        if (spec.tests && spec.tests.length > 0) {
          spec.tests.forEach(test => {
            totalTests++;
            const status = test.results[0]?.status || 'unknown';
            if (status === 'passed' || status === 'expected') {
              passedTests++;
              channelStats[channelInfo.en].passed++;
            } else if (status === 'failed' || status === 'unexpected') {
              failedTestsCount++;
              channelStats[channelInfo.en].failed++;
              failedTests.push({
                title: spec.title,
                error: test.results[0]?.error?.message || 'Unknown error'
              });
            }
          });
        }
      });
    }
    if (suite.suites) suite.suites.forEach(s => findTests(s, fileName));
  };

  if (report.suites) report.suites.forEach(s => findTests(s));

  // Формируем массив каналов для фронтенда (с двуязычными названиями)
  const channels = Object.keys(channelStats).map(key => ({
    name: key,
    name_ru: channelStats[key].ruName,
    status: channelStats[key].failed > 0 ? 'fail' : 'pass'
  }));

  // --- ЛОГИКА ИСТОРИИ ---
  let history = [];
  try {
    const existingData = JSON.parse(fs.readFileSync('signal-status.json', 'utf8'));
    if (existingData.history) history = existingData.history;
  } catch (e) {}

  const newRecord = {
    record: history.length > 0 ? history[0].record + 1 : 117,
    date: new Date().toISOString(),
    status: failedTestsCount > 0 ? 'unstable' : 'stable',
    total: totalTests,
    passed: passedTests
  };

  history.unshift(newRecord);
  history = history.slice(0, 5);

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
