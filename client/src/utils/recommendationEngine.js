export const generateRecommendations = (weakKeys) => {
  if (!weakKeys || weakKeys.length === 0) {
    return [
      {
        type: 'general',
        title: 'Keep Training',
        message:
          'Complete more typing runs to generate personalized training recommendations.',
        practice: 'Focus on maintaining consistent speed and accuracy.'
      }
    ];
  }

  const weakestKey = weakKeys[0].key;
  const weakestErrors = weakKeys[0].errors;

  const practiceWords = {
    a: ['area', 'again', 'always', 'available', 'accuracy'],
    b: ['basic', 'better', 'build', 'binary', 'browser'],
    c: ['code', 'clear', 'create', 'correct', 'character'],
    d: ['data', 'develop', 'debug', 'design', 'dashboard'],
    e: ['enter', 'error', 'execute', 'experience', 'efficient'],
    f: ['fast', 'focus', 'function', 'future', 'feature'],
    g: ['good', 'great', 'going', 'gaming', 'programming'],
    h: ['high', 'health', 'human', 'handle', 'hardware'],
    i: ['input', 'inside', 'important', 'information', 'interface'],
    j: ['just', 'job', 'join', 'javascript', 'journey'],
    k: ['key', 'keep', 'keyboard', 'knowledge', 'skill'],
    l: ['learn', 'level', 'logic', 'local', 'language'],
    m: ['make', 'memory', 'model', 'maximum', 'minimum'],
    n: ['new', 'next', 'network', 'number', 'training'],
    o: ['open', 'output', 'operation', 'option', 'control'],
    p: ['practice', 'process', 'project', 'performance', 'precision'],
    q: ['quick', 'query', 'quality', 'sequence', 'require'],
    r: ['read', 'right', 'result', 'error', 'practice'],
    s: ['speed', 'system', 'session', 'skill', 'success'],
    t: ['test', 'type', 'training', 'target', 'typing'],
    u: ['user', 'useful', 'update', 'unique', 'execute'],
    v: ['value', 'version', 'visual', 'verify', 'improve'],
    w: ['work', 'word', 'write', 'weak', 'workflow'],
    x: ['extra', 'experience', 'example', 'execute', 'maximum'],
    y: ['your', 'you', 'year', 'typing', 'accuracy'],
    z: ['zero', 'zone', 'size', 'organization', 'customize']
  };

  const words = practiceWords[weakestKey] || [
    'practice',
    'accuracy',
    'typing',
    'training',
    'performance'
  ];

  let priority = 'LOW';

  if (weakestErrors >= 10) {
    priority = 'HIGH';
  } else if (weakestErrors >= 5) {
    priority = 'MEDIUM';
  }

  return [
    {
      type: 'weak-key',
      title: 'Primary Weak Key',
      key: weakestKey === ' ' ? 'SPACE' : weakestKey.toUpperCase(),
      message: `You make the most mistakes around the ${weakestKey === ' ' ? 'SPACE' : `"${weakestKey.toUpperCase()}"`} key.`,
      practice: `Practice ${weakestKey === ' ' ? 'spacing between words' : `words containing "${weakestKey.toUpperCase()}"`}.`,
      priority
    },

    {
      type: 'accuracy',
      title: 'Accuracy Training',
      message:
        'Slow down slightly while practicing your weak keys. Build accuracy first, then increase speed.',
      practice: 'Aim for 95%+ accuracy before pushing your WPM higher.',
      priority
    },

    {
      type: 'practice',
      title: 'Suggested Practice',
      message:
        'Use these words to repeatedly train the key identified by your recent runs.',
      practice: words.join(' • '),
      priority
    }
  ];
};