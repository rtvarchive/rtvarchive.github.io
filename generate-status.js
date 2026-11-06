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
  const stats = report.stats;

  const failedTests = [];
  const channelStats = {};

  // Инициализируем каналы
  Object.values(channelMapping).forEach(ch => channelStats[ch] = { passed: 0, failed: 0 });

  // Рекурсивный поиск тестов
  const findTests = (suite, fileName = '') => {
    if (suite.file) fileName = suite.file;
    
    if (suite.specs) {
      suite.specs.forEach(spec => {
        let channelName = channelMapping[fileName.split('/').pop()] || channelMapping['default'];
	// Если в названии теста есть A11y или Accessibility, принудительно кидаем в Channel accessibility
	if (spec.title.includes('A11y') || spec.title.includes('Accessibility')) {
	channelName = 'Channel accessibility';
	}
        
        if (spec.ok === false) {
        failedTests.push({
		title: spec.title,
		error: spec.tests && spec.tests[0] && spec.tests[0].results && spec.tests[0].results[0] && spec.tests[0].results[0].error 
		? spec.tests[0].results[0].error.message 
		: 'Unknown error'
		});
          channelStats[channelName].failed++;
        } else {
          channelStats[channelName].passed++;
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
    status: stats.unexpected > 0 ? 'unstable' : 'stable',
    total: stats.expected + stats.unexpected + stats.flaky,
    passed: stats.expected + stats.flaky
  };

  history.unshift(newRecord); // Добавляем в начало
  history = history.slice(0, 5); // Оставляем только 5 последних записей

  // --- ФОРМИРУЕМ ИТОГОВЫЙ JSON ---
  const data = {
    lastCheck: new Date().toISOString(),
    total: newRecord.total,
    passed: newRecord.passed,
    failed: stats.unexpected,
    failedTests: failedTests,
    channels: channels,
    history: history
  };

  fs.writeFileSync('signal-status.json', JSON.stringify(data, null, 2));
  console.log('Signal status updated successfully!');
} catch (e) {
  console.error('Error parsing report:', e);
  process.exit(1);
}