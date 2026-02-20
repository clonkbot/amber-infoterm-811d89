import { useState, useEffect, useCallback, useRef } from 'react';
import './crt.css';

type ContentCategory = 'NEWS' | 'WEATHER' | 'SPORTS' | 'MATHEMATICS' | 'EDUCATION' | 'DEVOTIONAL';

interface ContentBlock {
  category: ContentCategory;
  title: string;
  content: string;
  timestamp: string;
}

const newsContent: ContentBlock[] = [
  { category: 'NEWS', title: 'GLOBAL DISPATCH', timestamp: '14:32:07', content: 'Scientists at CERN announce breakthrough in quantum computing stability. New error correction methods show 99.7% accuracy rate in controlled environments. International collaboration expands.' },
  { category: 'NEWS', title: 'TECHNOLOGY UPDATE', timestamp: '14:45:23', content: 'Open source software movement reaches new milestone. Community-driven projects now power 78% of global internet infrastructure. Collaborative development models reshape industry.' },
  { category: 'NEWS', title: 'WORLD BRIEF', timestamp: '15:01:44', content: 'International space agencies confirm joint mission to establish permanent lunar research station. Construction materials to be manufactured from local regolith. Timeline set for 2031.' },
  { category: 'NEWS', title: 'ECONOMIC REPORT', timestamp: '15:18:09', content: 'Global markets show renewed stability as renewable energy sector posts record growth. Investment in sustainable infrastructure reaches unprecedented levels across developed nations.' },
];

const weatherContent: ContentBlock[] = [
  { category: 'WEATHER', title: 'REGIONAL FORECAST', timestamp: '14:00:00', content: 'CURRENT CONDITIONS: Clear skies. Temperature 72F (22C). Humidity 45%. Wind SW at 8 mph. Barometric pressure 30.12 inHg and rising. UV index moderate.' },
  { category: 'WEATHER', title: 'EXTENDED OUTLOOK', timestamp: '14:00:00', content: 'NEXT 48 HOURS: Continued fair weather expected. High pressure system maintaining position. Overnight lows near 58F. Afternoon highs reaching 75F. Precipitation probability 5%.' },
  { category: 'WEATHER', title: 'MARINE ADVISORY', timestamp: '14:00:00', content: 'COASTAL WATERS: Seas 2-4 feet. Visibility excellent. Small craft advisory lifted. Tides normal. Water temperature 64F. Favorable conditions for maritime activities.' },
];

const sportsContent: ContentBlock[] = [
  { category: 'SPORTS', title: 'ATHLETICS ROUNDUP', timestamp: '13:55:00', content: 'World Athletics Championships conclude with 23 new national records set. Kenya dominates distance events. USA leads medal count. Next championships scheduled for Tokyo 2025.' },
  { category: 'SPORTS', title: 'MATCH RESULTS', timestamp: '14:22:00', content: 'Premier League standings update: Top four separated by just 3 points. Weekend fixtures promise decisive matches. Record attendance figures reported across venues.' },
  { category: 'SPORTS', title: 'OLYMPIC UPDATE', timestamp: '14:40:00', content: 'IOC confirms new sports for upcoming games. Esports demonstration events approved. Traditional disciplines maintain core program status. Athlete village construction 87% complete.' },
];

const mathContent: ContentBlock[] = [
  { category: 'MATHEMATICS', title: 'NUMBER THEORY', timestamp: '00:00:00', content: 'THEOREM: Every even integer greater than 2 can be expressed as the sum of two primes (Goldbach Conjecture, unproven). Example: 28 = 11 + 17 = 5 + 23. Verified computationally to 4 x 10^18.' },
  { category: 'MATHEMATICS', title: 'DAILY FORMULA', timestamp: '00:00:00', content: 'EULER\'S IDENTITY: e^(i*pi) + 1 = 0. Connects five fundamental constants: e (2.718...), i (sqrt(-1)), pi (3.14159...), 1 (multiplicative identity), 0 (additive identity).' },
  { category: 'MATHEMATICS', title: 'GEOMETRY INSIGHT', timestamp: '00:00:00', content: 'GOLDEN RATIO (phi): (1 + sqrt(5)) / 2 = 1.618033988... Found in nature: nautilus shells, sunflower seeds, galaxy spirals. Rectangle with sides 1:phi considered most aesthetically pleasing.' },
  { category: 'MATHEMATICS', title: 'PRIME SEQUENCE', timestamp: '00:00:00', content: 'TWIN PRIMES: Pairs of primes differing by 2. Examples: (3,5), (11,13), (17,19), (29,31), (41,43). Infinitely many? Twin Prime Conjecture remains unproven after 2,300 years.' },
];

const educationContent: ContentBlock[] = [
  { category: 'EDUCATION', title: 'HISTORY LESSON', timestamp: '00:00:00', content: 'THE LIBRARY OF ALEXANDRIA: Founded c. 300 BCE. Largest collection of ancient knowledge. Housed 400,000+ scrolls. Scholars from across Mediterranean. Its destruction remains history\'s greatest intellectual loss.' },
  { category: 'EDUCATION', title: 'SCIENCE FACT', timestamp: '00:00:00', content: 'WATER ANOMALY: Unlike most substances, water is less dense as solid than liquid. Ice floats because hydrogen bonds create open hexagonal structure. This property enables aquatic life to survive winter.' },
  { category: 'EDUCATION', title: 'LANGUAGE ORIGIN', timestamp: '00:00:00', content: 'ETYMOLOGY: "Algorithm" derives from al-Khwarizmi, 9th century Persian mathematician. His work "Kitab al-Jabr" also gave us "algebra." Mathematics speaks across centuries and cultures.' },
  { category: 'EDUCATION', title: 'ASTRONOMY NOTE', timestamp: '00:00:00', content: 'LIGHT YEAR: Distance light travels in one year: 9.461 trillion kilometers. Nearest star (Proxima Centauri): 4.24 light years. We see it as it was 4.24 years ago. Looking up is looking back.' },
];

const devotionalContent: ContentBlock[] = [
  { category: 'DEVOTIONAL', title: 'BUDDHIST WISDOM', timestamp: '00:00:00', content: '"Peace comes from within. Do not seek it without." - Buddha. The Four Noble Truths teach that suffering exists, has cause, has end, and that end is achievable through the Eightfold Path.' },
  { category: 'DEVOTIONAL', title: 'CHRISTIAN REFLECTION', timestamp: '00:00:00', content: '"For where two or three gather in my name, there am I with them." - Matthew 18:20. Community strengthens faith. In fellowship we find support, accountability, and shared purpose.' },
  { category: 'DEVOTIONAL', title: 'ISLAMIC TEACHING', timestamp: '00:00:00', content: '"The best among you are those who have the best character." - Prophet Muhammad (PBUH). Islam emphasizes moral excellence. Kindness, honesty, and compassion are acts of worship.' },
  { category: 'DEVOTIONAL', title: 'HINDU SCRIPTURE', timestamp: '00:00:00', content: '"You have the right to work, but never to the fruit of work." - Bhagavad Gita 2:47. Karma Yoga teaches selfless action. True peace comes from releasing attachment to outcomes.' },
  { category: 'DEVOTIONAL', title: 'JEWISH PROVERB', timestamp: '00:00:00', content: '"Who is wise? One who learns from every person." - Pirkei Avot 4:1. The Torah values humility in learning. Every encounter offers potential for growth and understanding.' },
  { category: 'DEVOTIONAL', title: 'TAOIST REFLECTION', timestamp: '00:00:00', content: '"Nature does not hurry, yet everything is accomplished." - Lao Tzu, Tao Te Ching. Wu wei - effortless action. Align with natural flow rather than forcing against the current.' },
  { category: 'DEVOTIONAL', title: 'SIKH TEACHING', timestamp: '00:00:00', content: '"Before becoming a Muslim, a Hindu, a Sikh or a Christian, let us become human first." - Guru Nanak. Humanity transcends labels. Service to others is service to the Divine.' },
];

const allContent = [
  ...newsContent,
  ...weatherContent,
  ...sportsContent,
  ...mathContent,
  ...educationContent,
  ...devotionalContent,
];

function getRandomContent(): ContentBlock {
  return allContent[Math.floor(Math.random() * allContent.length)];
}

function App() {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentContent, setCurrentContent] = useState<ContentBlock>(getRandomContent());
  const [charIndex, setCharIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showInteractHint, setShowInteractHint] = useState(true);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Format full content block as terminal text
  const formatContent = useCallback((block: ContentBlock): string => {
    const divider = '═'.repeat(48);
    const header = `[${block.category}] ${block.title}`;
    return `\n${divider}\n${header}\n${divider}\n\n${block.content}\n`;
  }, []);

  // Typing effect
  useEffect(() => {
    if (isPaused) return;

    const fullText = formatContent(currentContent);

    if (charIndex < fullText.length) {
      const timeout = setTimeout(() => {
        const newChar = fullText[charIndex];

        if (newChar === '\n') {
          setDisplayedLines(prev => [...prev, '']);
        } else {
          setDisplayedLines(prev => {
            const updated = [...prev];
            if (updated.length === 0) updated.push('');
            updated[updated.length - 1] += newChar;
            return updated;
          });
        }

        setCharIndex(prev => prev + 1);
      }, 15 + Math.random() * 25); // Variable typing speed for authenticity

      return () => clearTimeout(timeout);
    } else {
      // Content finished, wait then load new content
      const timeout = setTimeout(() => {
        setCurrentContent(getRandomContent());
        setCharIndex(0);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [charIndex, currentContent, isPaused, formatContent]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [displayedLines]);

  // Trim old lines to prevent memory issues
  useEffect(() => {
    if (displayedLines.length > 200) {
      setDisplayedLines(prev => prev.slice(-150));
    }
  }, [displayedLines.length]);

  // Handle interaction
  const handleInteraction = useCallback(() => {
    setShowInteractHint(false);
    if (isPaused) {
      setIsPaused(false);
    } else {
      setIsPaused(true);
    }
  }, [isPaused]);

  const skipToNext = useCallback(() => {
    setCurrentContent(getRandomContent());
    setCharIndex(0);
    setIsPaused(false);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour12: false });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).toUpperCase();
  };

  return (
    <div className="crt-container" onClick={handleInteraction}>
      {/* CRT Effects Overlays */}
      <div className="scanlines" />
      <div className="screen-flicker" />
      <div className="screen-glow" />
      <div className="vignette" />

      {/* Main Terminal */}
      <div className="terminal">
        {/* Header Bar */}
        <div className="terminal-header">
          <div className="header-left">
            <span className="system-name">INFOTERM v2.4</span>
            <span className="separator">|</span>
            <span className="status">{isPaused ? 'PAUSED' : 'STREAMING'}</span>
          </div>
          <div className="header-right">
            <span className="date">{formatDate(currentTime)}</span>
            <span className="separator">|</span>
            <span className="time">{formatTime(currentTime)}</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="terminal-content" ref={terminalRef}>
          {displayedLines.map((line, index) => (
            <div key={index} className="terminal-line">
              {line}
              {index === displayedLines.length - 1 && !isPaused && (
                <span className="cursor">█</span>
              )}
            </div>
          ))}
          {isPaused && displayedLines.length > 0 && (
            <div className="terminal-line">
              <span className="cursor blink">█</span>
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="terminal-footer">
          <div className="footer-left">
            <span className="category-indicator">[{currentContent.category}]</span>
          </div>
          <div className="footer-center">
            {showInteractHint && (
              <span className="hint blink">TOUCH SCREEN TO INTERACT</span>
            )}
            {!showInteractHint && isPaused && (
              <span className="hint">TAP: RESUME | </span>
            )}
            {!showInteractHint && isPaused && (
              <button
                className="skip-btn"
                onClick={(e) => { e.stopPropagation(); skipToNext(); }}
              >
                [NEXT CONTENT]
              </button>
            )}
          </div>
          <div className="footer-right">
            <span className="buffer-status">BUF: {displayedLines.length}/200</span>
          </div>
        </div>
      </div>

      {/* Attribution Footer */}
      <div className="attribution">
        Requested by @simplify3 · Built by @clonkbot
      </div>
    </div>
  );
}

export default App;
