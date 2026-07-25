import React, { useState, useMemo, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { Book, Layers, GraduationCap, ChevronRight, Search, Shuffle, FileText } from 'lucide-react';
import criminalActData from './criminal_act.json';

// --- Helper: Flatten Articles ---
const allArticles = [];
const flatten = (nodes) => {
  for (const node of nodes) {
    if (node.type === 'article') {
      allArticles.push(node);
    }
    if (node.children) {
      flatten(node.children);
    }
  }
};
flatten(criminalActData);

// --- Dashboard Component ---
function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1 style={{ textAlign: 'center', marginBottom: '16px' }}>대한민국 형법 암기 도우미</h1>
      <p style={{ textAlign: 'center', marginBottom: '48px', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
        체계적인 구조 학습부터 세부 조문 암기까지 완벽하게.
      </p>

      <div className="grid-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Layers size={48} color="var(--accent-color)" style={{ marginBottom: '16px' }} />
          <h2>1단계: 구조 및 개요</h2>
          <p>편, 장, 절의 위치를 파악하고 각 조문의 제목을 플래시카드로 암기합니다.</p>
          <button className="btn btn-primary" style={{ marginTop: 'auto', width: '100%' }} onClick={() => navigate('/phase1')}>
            학습 시작 <ChevronRight size={18} />
          </button>
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Book size={48} color="var(--success-color)" style={{ marginBottom: '16px' }} />
          <h2>2단계: 세부 내용 및 벌칙</h2>
          <p>각 조문의 원문을 읽고, 형량과 핵심 단어를 빈칸 채우기로 완벽하게 암기합니다.</p>
          <button className="btn btn-primary" style={{ marginTop: 'auto', width: '100%', backgroundColor: 'var(--success-color)' }} onClick={() => navigate('/phase2')}>
            학습 시작 <ChevronRight size={18} />
          </button>
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Shuffle size={48} color="#a855f7" style={{ marginBottom: '16px' }} />
          <h2>3단계: 랜덤 퀴즈</h2>
          <p>전체 조문 중 무작위로 출제되는 플래시카드 퀴즈로 암기 상태를 점검합니다.</p>
          <button className="btn btn-primary" style={{ marginTop: 'auto', width: '100%', backgroundColor: '#a855f7' }} onClick={() => navigate('/phase3')}>
            퀴즈 시작 <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Hierarchy Node Component ---
function HierarchyNode({ node, onArticleClick }) {
  const [expanded, setExpanded] = useState(false);
  const isArticle = node.type === 'article';

  if (isArticle) {
    return (
      <div 
        className="tree-node" 
        style={{ cursor: 'pointer', padding: '8px 12px', borderRadius: '6px', transition: 'background 0.2s' }}
        onClick={() => onArticleClick(node)}
        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
      >
        <span style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>제{node.article_num}조</span> {node.title}
      </div>
    );
  }

  return (
    <div className="tree-node">
      <div className={`tree-header ${expanded ? 'expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
        <ChevronRight size={16} className="tree-icon" />
        <span style={{ fontWeight: '600' }}>{node.title}</span>
      </div>
      {expanded && node.children && (
        <div style={{ paddingLeft: '8px' }}>
          {node.children.map((child, idx) => (
            <HierarchyNode key={idx} node={child} onArticleClick={onArticleClick} />
          ))}
        </div>
      )}
    </div>
  );
}

// --- Phase 1: Structure & Overview ---
function Phase1() {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
    setIsFlipped(false);
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>1단계: 구조 및 개요</h2>
        <Link to="/" className="btn btn-secondary">돌아가기</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="glass-card" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <h3 style={{ marginBottom: '16px', borderBottom: '1px solid var(--surface-border)', paddingBottom: '8px' }}>목차 (형법 구조)</h3>
          {criminalActData.map((node, idx) => (
            <HierarchyNode key={idx} node={node} onArticleClick={handleArticleClick} />
          ))}
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
          {selectedArticle ? (
            <div className="flashcard-container" onClick={() => setIsFlipped(!isFlipped)}>
              <div className={`flashcard ${isFlipped ? 'flipped' : ''}`}>
                <div className="flashcard-face flashcard-front glass" style={{ border: '2px solid var(--surface-border)' }}>
                  <h2 style={{ fontSize: '3rem' }}>제{selectedArticle.article_num}조</h2>
                  <p style={{ marginTop: '24px', opacity: 0.7, fontSize: '1.1rem' }}>(클릭하여 제목 확인)</p>
                </div>
                <div className="flashcard-face flashcard-back glass" style={{ border: '2px solid var(--accent-color)' }}>
                  <h3 style={{ fontSize: '2.5rem', color: 'var(--text-primary)' }}>{selectedArticle.title}</h3>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
              <GraduationCap size={64} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
              <p>왼쪽 목차에서 조문을 선택하여<br/>플래시카드를 시작하세요.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Phase 2: Detailed Text ---
function Phase2() {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [answers, setAnswers] = useState({});

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
    setAnswers({});
  };

  const renderBlankText = (text) => {
    if (!text) return null;
    const parts = text.split(/(\d+년|\d+만원|\d+천만원|사형|무기)/g);
    
    return parts.map((part, i) => {
      if (/(년|만원|천만원|사형|무기)/.test(part) && part.length > 0) {
        const isCorrect = answers[i] === part;
        const isAttempted = answers[i] !== undefined && answers[i] !== '';
        return (
          <input
            key={i}
            className={`blank-input ${isCorrect ? 'correct' : (isAttempted ? 'incorrect' : '')}`}
            value={answers[i] || ''}
            onChange={(e) => setAnswers({...answers, [i]: e.target.value})}
            placeholder="?"
            style={{ width: `${Math.max(4, part.length)}ch` }}
          />
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>2단계: 세부 내용 및 벌칙</h2>
        <Link to="/" className="btn btn-secondary">돌아가기</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        <div className="glass-card" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <h3 style={{ marginBottom: '16px', borderBottom: '1px solid var(--surface-border)', paddingBottom: '8px' }}>조문 선택</h3>
          {criminalActData.map((node, idx) => (
            <HierarchyNode key={idx} node={node} onArticleClick={handleArticleClick} />
          ))}
        </div>

        <div className="glass-card" style={{ minHeight: '500px' }}>
          {selectedArticle ? (
            <div className="article-detail">
              <h3 style={{ fontSize: '1.8rem', marginBottom: '24px', color: 'var(--accent-color)', borderBottom: '1px solid var(--surface-border)', paddingBottom: '12px' }}>
                제{selectedArticle.article_num}조({selectedArticle.title})
              </h3>
              
              {selectedArticle.paragraphs && selectedArticle.paragraphs.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {selectedArticle.paragraphs.map((para, idx) => (
                    <div key={idx} className="article-content">
                      {renderBlankText(para)}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="article-content">
                  {renderBlankText(selectedArticle.content)}
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '100px 0' }}>
              <Book size={64} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
              <p>형량 및 핵심어 암기를 위해 왼쪽에서 조문을 선택하세요.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Phase 3: Random Quiz ---
function Phase3() {
  const [currentArticle, setCurrentArticle] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [quizType, setQuizType] = useState('titleToNum'); // 'titleToNum' or 'numToTitle'

  const nextQuiz = () => {
    const randomIdx = Math.floor(Math.random() * allArticles.length);
    setCurrentArticle(allArticles[randomIdx]);
    setIsFlipped(false);
    setQuizType(Math.random() > 0.5 ? 'titleToNum' : 'numToTitle');
  };

  useEffect(() => {
    nextQuiz();
  }, []);

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>3단계: 랜덤 퀴즈</h2>
        <div>
          <button className="btn btn-secondary" onClick={nextQuiz} style={{ marginRight: '12px' }}>
            <Shuffle size={16} /> 다음 퀴즈
          </button>
          <Link to="/" className="btn btn-secondary">돌아가기</Link>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '48px' }}>
        {currentArticle && (
          <div className="flashcard-container" onClick={() => setIsFlipped(!isFlipped)} style={{ maxWidth: '700px' }}>
            <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} style={{ minHeight: '400px' }}>
              <div className="flashcard-face flashcard-front glass" style={{ border: '2px solid #a855f7' }}>
                <div style={{ position: 'absolute', top: '24px', left: '24px', opacity: 0.5, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Shuffle size={20} /> 랜덤 퀴즈
                </div>
                
                {quizType === 'numToTitle' ? (
                  <>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>다음 조문의 제목은 무엇일까요?</p>
                    <h2 style={{ fontSize: '3.5rem', margin: '24px 0', color: 'var(--text-primary)', background: 'none', WebkitTextFillColor: 'unset' }}>제{currentArticle.article_num}조</h2>
                  </>
                ) : (
                  <>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>다음 제목을 가진 조문은 제 몇 조일까요?</p>
                    <h2 style={{ fontSize: '3rem', margin: '24px 0', background: 'linear-gradient(to right, #c084fc, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      "{currentArticle.title}"
                    </h2>
                  </>
                )}
                
                <p style={{ marginTop: 'auto', opacity: 0.7, fontSize: '1.1rem' }}>(클릭하여 정답 확인)</p>
              </div>
              
              <div className="flashcard-face flashcard-back glass" style={{ border: '2px solid #22c55e' }}>
                <p style={{ fontSize: '1.2rem', color: 'var(--success-color)', marginBottom: '16px' }}>정답</p>
                <h3 style={{ fontSize: '2.5rem', color: 'var(--text-primary)', marginBottom: '16px' }}>
                  제{currentArticle.article_num}조
                </h3>
                <h4 style={{ fontSize: '2rem', color: 'var(--accent-color)' }}>
                  {currentArticle.title}
                </h4>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Search Result Detail Component ---
function ArticleDetail({ articleNum }) {
  const article = allArticles.find(a => a.article_num === articleNum);
  
  if (!article) return <div className="container" style={{ padding: '48px 0', textAlign: 'center' }}>조문을 찾을 수 없습니다.</div>;

  return (
    <div className="container">
      <div style={{ marginBottom: '24px' }}>
        <Link to="/" className="btn btn-secondary">돌아가기</Link>
      </div>
      <div className="glass-card">
        <div className="article-detail">
          <h3 style={{ fontSize: '1.8rem', marginBottom: '24px', color: 'var(--accent-color)', borderBottom: '1px solid var(--surface-border)', paddingBottom: '12px' }}>
            제{article.article_num}조({article.title})
          </h3>
          
          {article.paragraphs && article.paragraphs.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {article.paragraphs.map((para, idx) => (
                <div key={idx} className="article-content">{para}</div>
              ))}
            </div>
          ) : (
            <div className="article-content">{article.content}</div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Search Bar Component ---
function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    
    const lowerQuery = query.toLowerCase();
    const filtered = allArticles.filter(a => 
      a.article_num.includes(lowerQuery) || 
      (a.title && a.title.toLowerCase().includes(lowerQuery)) ||
      (a.content && a.content.toLowerCase().includes(lowerQuery)) ||
      (a.paragraphs && a.paragraphs.some(p => p.toLowerCase().includes(lowerQuery)))
    ).slice(0, 10); // Limit to 10 results
    
    setResults(filtered);
    setIsOpen(true);
  }, [query]);

  const handleResultClick = (article_num) => {
    setIsOpen(false);
    setQuery('');
    navigate(`/article/${article_num}`);
  };

  return (
    <div ref={searchRef} style={{ position: 'relative', width: '300px' }}>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          placeholder="조문 검색 (예: 250, 살인...)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if(query) setIsOpen(true) }}
          style={{
            width: '100%',
            padding: '10px 16px 10px 40px',
            borderRadius: '20px',
            border: '1px solid var(--surface-border)',
            background: 'rgba(255, 255, 255, 0.05)',
            color: 'var(--text-primary)',
            outline: 'none',
            fontFamily: 'inherit'
          }}
        />
        <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
      </div>

      {isOpen && results.length > 0 && (
        <div className="glass" style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '8px',
          maxHeight: '400px',
          overflowY: 'auto',
          zIndex: 100,
          padding: '8px'
        }}>
          {results.map(article => (
            <div 
              key={article.article_num}
              onClick={() => handleResultClick(article.article_num)}
              style={{
                padding: '12px',
                cursor: 'pointer',
                borderRadius: '8px',
                transition: 'background 0.2s',
                borderBottom: '1px solid rgba(255,255,255,0.05)'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ color: 'var(--accent-color)', fontWeight: 'bold', marginBottom: '4px' }}>제{article.article_num}조</div>
              <div style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>{article.title}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- App Layout ---
function App() {
  return (
    <Router>
      <div className="main-layout">
        <nav className="navbar">
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: 'var(--accent-color)', padding: '8px', borderRadius: '8px' }}>
                <Book size={24} />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold', letterSpacing: '-0.5px' }}>
                형법마스터
              </span>
            </Link>
            
            <SearchBar />

            <div className="nav-links">
              <Link to="/phase1" className="nav-link">1단계</Link>
              <Link to="/phase2" className="nav-link">2단계</Link>
              <Link to="/phase3" className="nav-link">3단계</Link>
            </div>
          </div>
        </nav>

        <main className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/phase1" element={<Phase1 />} />
            <Route path="/phase2" element={<Phase2 />} />
            <Route path="/phase3" element={<Phase3 />} />
            <Route path="/article/:id" element={<ArticleDetailWrapper />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function ArticleDetailWrapper() {
  const { id } = useParams();
  return <ArticleDetail articleNum={id} />;
}

export default App;
