export const FIXTURES = {
  highscores: {
    empty: [],

    top3: [
      { name: 'Alice', score: 15, time: 45, date: '2025-01-01T10:00:00.000Z' },
      { name: 'Bob', score: 14, time: 50, date: '2025-01-01T10:05:00.000Z' },
      { name: 'Charlie', score: 13, time: 55, date: '2025-01-01T10:10:00.000Z' }
    ],

    top5: [
      { name: 'Alice', score: 15, time: 45, date: '2025-01-01T10:00:00.000Z' },
      { name: 'Bob', score: 14, time: 50, date: '2025-01-01T10:05:00.000Z' },
      {
        name: 'Charlie',
        score: 13,
        time: 55,
        date: '2025-01-01T10:10:00.000Z'
      },
      { name: 'David', score: 12, time: 60, date: '2025-01-01T10:15:00.000Z' },
      { name: 'Eve', score: 11, time: 65, date: '2025-01-01T10:20:00.000Z' }
    ],

    sameScorediffTimes: [
      { name: 'Fast', score: 10, time: 30, date: '2025-01-01T10:00:00.000Z' },
      { name: 'Slow', score: 10, time: 60, date: '2025-01-01T10:05:00.000Z' }
    ],

    withUnicode: [
      {
        name: '🎮 Mathéo',
        score: 15,
        time: 45,
        date: '2025-01-01T10:00:00.000Z'
      },
      {
        name: '学生 Zhang',
        score: 14,
        time: 50,
        date: '2025-01-01T10:05:00.000Z'
      }
    ]
  },

  players: {
    valid: 'Mathéo',
    empty: '',
    long: 'A'.repeat(500),
    unicode: '🎮 Élève 数学 المعلم 🚀',
    withSpaces: '  Jean Dupont  ',
    specialChars: "O'Connor-Smith <script>alert('xss')</script>"
  },

  times: {
    zero: 0,
    underMinute: [1, 30, 59],
    exactMinute: 60,
    overMinute: [61, 90, 125],
    large: [3600, 7200],
    negative: -10
  },

  levels: ['facile', 'moyen', 'difficile', 'super-multi']
};
