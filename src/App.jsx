import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { Book, Layers, GraduationCap, ChevronRight, Search, Shuffle, Activity, Target, Zap, Clock, Trophy, Map } from 'lucide-react';
import criminalActData from './criminal_act.json';

// --- Helper: Data Processing ---
const allArticles = [];
const allGroups = []; // Store chunks (parts, chapters) for Phase 0

const enrichWithRanges = (nodes) => {
  let rangeStart = Infinity;
  let rangeEnd = -Infinity;
  
  for (const node of nodes) {
    if (node.type === 'article') {
      allArticles.push(node);
      const numMatch = node.article_num.match(/\d+/);
      if (numMatch) {
        const num = parseInt(numMatch[0], 10);
        rangeStart = Math.min(rangeStart, num);
        rangeEnd = Math.max(rangeEnd, num);
      }
    } else if (node.children) {
      const childRange = enrichWithRanges(node.children);
      node.rangeStart = childRange.start;
      node.rangeEnd = childRange.end;
      if (node.title) {
        allGroups.push(node);
      }
      rangeStart = Math.min(rangeStart, childRange.start);
      rangeEnd = Math.max(rangeEnd, childRange.end);
    }
  }
  return { start: rangeStart, end: rangeEnd };
};
enrichWithRanges(criminalActData);

const useWrongList = () => {
  const [wrongList, setWrongList] = useState(() => {
    const saved = localStorage.getItem('kclm_wrong_list');
    return saved ? JSON.parse(saved) : [];
  });
  const addWrong = (articleNum) => {
    setWrongList(prev => {
      const newList = [...new Set([...prev, articleNum])];
      localStorage.setItem('kclm_wrong_list', JSON.stringify(newList));
      return newList;
    });
  };
  const removeWrong = (articleNum) => {
    setWrongList(prev => {
      const newList = prev.filter(num => num !== articleNum);
      localStorage.setItem('kclm_wrong_list', JSON.stringify(newList));
      return newList;
    });
  };
  return { wrongList, addWrong, removeWrong };
};

// --- Dashboard Component ---
function Dashboard() {
  const navigate = useNavigate();
  return (
    <div className="container">
      <h1 style={{ textAlign: 'center', marginBottom: '16px', background: 'linear-gradient(to right, #60a5fa, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>형법 암기 마스터</h1>
      <p style={{ textAlign: 'center', marginBottom: '48px', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>뼈대 잡기부터 타임어택까지, 입체적 7단계 암기 시스템</p>

      <div className="grid-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        {/* Phase 0 */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', border: '1px solid rgba(59, 130, 246, 0.5)' }}>
          <Map size={40} color="#3b82f6" style={{ marginBottom: '16px' }} />
          <h3>0단계: 거시적 구조 (뼈대)</h3>
          <p style={{ fontSize: '0.9rem', marginBottom: '24px' }}>총론, 각론, 장, 절의 뭉탱이 범위(몇 조 ~ 몇 조)를 파악하고 숲을 봅니다.</p>
          <button className="btn btn-primary" style={{ marginTop: 'auto', width: '100%', backgroundColor: '#3b82f6' }} onClick={() => navigate('/phase0')}>숲 보기 <ChevronRight size={16} /></button>
        </div>

        {/* Phase 1 */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Layers size={40} color="var(--accent-color)" style={{ marginBottom: '16px' }} />
          <h3>1단계: 세부 개요 (나무)</h3>
          <p style={{ fontSize: '0.9rem', marginBottom: '24px' }}>세부 조문의 제목을 플래시카드로 가볍게 암기합니다.</p>
          <button className="btn btn-primary" style={{ marginTop: 'auto', width: '100%' }} onClick={() => navigate('/phase1')}>개요 학습 <ChevronRight size={16} /></button>
        </div>

        {/* Phase 2 */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Book size={40} color="var(--success-color)" style={{ marginBottom: '16px' }} />
          <h3>2단계: 세부 내용 및 벌칙</h3>
          <p style={{ fontSize: '0.9rem', marginBottom: '24px' }}>각 조문의 원문을 읽고 형량과 핵심 단어를 빈칸 채우기로 암기합니다.</p>
          <button className="btn btn-primary" style={{ marginTop: 'auto', width: '100%', backgroundColor: 'var(--success-color)' }} onClick={() => navigate('/phase2')}>상세 학습 <ChevronRight size={16} /></button>
        </div>

        {/* Phase 3 */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Shuffle size={40} color="#a855f7" style={{ marginBottom: '16px' }} />
          <h3>3단계: 랜덤 퀴즈</h3>
          <p style={{ fontSize: '0.9rem', marginBottom: '24px' }}>무작위 조문 퀴즈. 틀린 조문은 자동으로 오답 노트에 저장됩니다.</p>
          <button className="btn btn-primary" style={{ marginTop: 'auto', width: '100%', backgroundColor: '#a855f7' }} onClick={() => navigate('/phase3')}>랜덤 퀴즈 <ChevronRight size={16} /></button>
        </div>
        
        {/* Phase 4 */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Activity size={40} color="#f59e0b" style={{ marginBottom: '16px' }} />
          <h3>4단계: 핵심 구성요건</h3>
          <p style={{ fontSize: '0.9rem', marginBottom: '24px' }}>문장을 주체, 행위, 형벌 등 블록 단위로 시각적으로 쪼개어 분석합니다.</p>
          <button className="btn btn-primary" style={{ marginTop: 'auto', width: '100%', backgroundColor: '#f59e0b' }} onClick={() => navigate('/phase4')}>구조 분석 <ChevronRight size={16} /></button>
        </div>

        {/* Phase 5 */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Target size={40} color="#ef4444" style={{ marginBottom: '16px' }} />
          <h3>5단계: 스마트 오답 노트</h3>
          <p style={{ fontSize: '0.9rem', marginBottom: '24px' }}>퀴즈에서 틀렸던 조문만 모아서 하드 트레이닝합니다.</p>
          <button className="btn btn-primary" style={{ marginTop: 'auto', width: '100%', backgroundColor: '#ef4444' }} onClick={() => navigate('/phase5')}>약점 극복 <ChevronRight size={16} /></button>
        </div>

        {/* Phase 6 */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Zap size={40} color="#ec4899" style={{ marginBottom: '16px' }} />
          <h3>6단계: 마스터 타임어택</h3>
          <p style={{ fontSize: '0.9rem', marginBottom: '24px' }}>제한 시간 내에 쏟아지는 조문을 맞히는 반사 신경 서바이벌 게임입니다.</p>
          <button className="btn btn-primary" style={{ marginTop: 'auto', width: '100%', backgroundColor: '#ec4899' }} onClick={() => navigate('/phase6')}>최종 마스터 <ChevronRight size={16} /></button>
        </div>
      </div>
    </div>
  );
}

// --- Phase 0: Macro Structure (Chunk) Memorization ---
function RangeNode({ node }) {
  const [expanded, setExpanded] = useState(false);
  if (node.type === 'article') return null;
  return (
    <div className="tree-node" style={{ marginBottom: '8px' }}>
      <div className={`tree-header ${expanded ? 'expanded' : ''}`} onClick={() => setExpanded(!expanded)} style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px' }}>
        <ChevronRight size={16} className="tree-icon" />
        <span style={{ fontWeight: 'bold', fontSize: '1.1rem', flex: 1 }}>{node.title}</span>
        <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>제{node.rangeStart}조 ~ 제{node.rangeEnd}조</span>
      </div>
      {expanded && node.children && (
        <div style={{ paddingLeft: '16px', marginTop: '8px' }}>
          {node.children.map((child, idx) => <RangeNode key={idx} node={child} />)}
        </div>
      )}
    </div>
  );
}

function Phase0() {
  const [quizMode, setQuizMode] = useState(false);
  const [currentChunk, setCurrentChunk] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const startQuiz = () => {
    // Only pick major chunks (Parts and Chapters)
    const majorChunks = allGroups.filter(g => g.rangeStart !== Infinity && g.rangeStart !== g.rangeEnd);
    setCurrentChunk(majorChunks[Math.floor(Math.random() * majorChunks.length)]);
    setIsFlipped(false);
    setQuizMode(true);
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>0단계: 거시적 구조 (뼈대 잡기)</h2>
        <Link to="/" className="btn btn-secondary">돌아가기</Link>
      </div>

      {!quizMode ? (
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--surface-border)', paddingBottom: '16px' }}>
            <p style={{ color: 'var(--text-secondary)' }}>형법의 전체 숲을 먼저 파악하세요. 각 파트가 몇 조부터 몇 조까지인지 확인합니다.</p>
            <button className="btn btn-primary" style={{ background: '#3b82f6' }} onClick={startQuiz}>뭉탱이 퀴즈 시작</button>
          </div>
          <div>
            {criminalActData.map((node, idx) => <RangeNode key={idx} node={node} />)}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '48px' }}>
          <div className="flashcard-container" style={{ maxWidth: '700px', width: '100%' }}>
            <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} style={{ minHeight: '400px' }} onClick={() => !isFlipped && setIsFlipped(true)}>
              <div className="flashcard-face flashcard-front glass" style={{ border: '2px solid #3b82f6', cursor: 'pointer' }}>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>다음 항목은 제 몇 조부터 제 몇 조까지일까요?</p>
                <h2 style={{ fontSize: '2.5rem', margin: '32px 0', color: 'var(--text-primary)' }}>{currentChunk?.title}</h2>
                <p style={{ marginTop: 'auto', opacity: 0.7 }}>(클릭하여 정답 확인)</p>
              </div>
              <div className="flashcard-face flashcard-back glass" style={{ border: '2px solid #10b981', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '2rem', marginBottom: '16px' }}>{currentChunk?.title}</h3>
                <h4 style={{ fontSize: '3rem', color: '#10b981', marginBottom: '32px' }}>제{currentChunk?.rangeStart}조 ~ 제{currentChunk?.rangeEnd}조</h4>
                <div style={{ display: 'flex', gap: '16px', marginTop: 'auto' }}>
                  <button className="btn" style={{ background: '#3b82f6', color: 'white', flex: 1 }} onClick={(e) => { e.stopPropagation(); startQuiz(); }}>다음 문제</button>
                  <button className="btn btn-secondary" style={{ flex: 1 }} onClick={(e) => { e.stopPropagation(); setQuizMode(false); }}>구조도 보기</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- HierarchyNode for Phase 1 & 2 ---
function HierarchyNode({ node, onArticleClick }) {
  const [expanded, setExpanded] = useState(false);
  if (node.type === 'article') {
    return (
      <div className="tree-node" style={{ cursor: 'pointer', padding: '8px 12px', borderRadius: '6px', transition: 'background 0.2s' }} onClick={() => onArticleClick(node)} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
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
      {expanded && node.children && <div style={{ paddingLeft: '8px' }}>{node.children.map((child, idx) => <HierarchyNode key={idx} node={child} onArticleClick={onArticleClick} />)}</div>}
    </div>
  );
}

// --- Phase 1: Flashcards ---
function Phase1() {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>1단계: 구조 및 개요</h2>
        <Link to="/" className="btn btn-secondary">돌아가기</Link>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="glass-card" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <h3 style={{ marginBottom: '16px', borderBottom: '1px solid var(--surface-border)', paddingBottom: '8px' }}>목차</h3>
          {criminalActData.map((node, idx) => <HierarchyNode key={idx} node={node} onArticleClick={(a) => { setSelectedArticle(a); setIsFlipped(false); }} />)}
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
              <p>왼쪽 목차에서 조문을 선택하세요.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Phase 2: Fill in the Blanks ---
function Phase2() {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [answers, setAnswers] = useState({});
  const [showAnswers, setShowAnswers] = useState(false);

  const renderBlankText = (text, paraIdx = 0) => {
    if (!text) return null;
    const parts = text.split(/(\d+년|\d+만원|\d+천만원|사형|무기)/g);
    return parts.map((part, i) => {
      if (/(년|만원|천만원|사형|무기)/.test(part) && part.length > 0) {
        const answerKey = `${paraIdx}-${i}`;
        const isCorrect = answers[answerKey] === part;
        return (
          <input key={i} className={`blank-input ${isCorrect ? 'correct' : (answers[answerKey] ? 'incorrect' : '')}`} value={answers[answerKey] || ''} onChange={(e) => setAnswers({...answers, [answerKey]: e.target.value})} placeholder="?" style={{ width: `${Math.max(4, part.length)}ch` }} />
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  const getAnswersList = () => {
    if (!selectedArticle) return [];
    let text = selectedArticle.content || '';
    if (selectedArticle.paragraphs?.length > 0) text = selectedArticle.paragraphs.join(' ');
    return text.split(/(\d+년|\d+만원|\d+천만원|사형|무기)/g).filter(p => /(년|만원|천만원|사형|무기)/.test(p));
  };
  const correctAnswersList = getAnswersList();

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>2단계: 세부 내용 및 벌칙</h2>
        <Link to="/" className="btn btn-secondary">돌아가기</Link>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        <div className="glass-card" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {criminalActData.map((node, idx) => <HierarchyNode key={idx} node={node} onArticleClick={(a) => { setSelectedArticle(a); setAnswers({}); setShowAnswers(false); }} />)}
        </div>
        <div className="glass-card" style={{ minHeight: '500px' }}>
          {selectedArticle ? (
            <div className="article-detail">
              <h3 style={{ fontSize: '1.8rem', marginBottom: '24px', color: 'var(--accent-color)', borderBottom: '1px solid var(--surface-border)', paddingBottom: '12px' }}>제{selectedArticle.article_num}조({selectedArticle.title})</h3>
              {selectedArticle.paragraphs?.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>{selectedArticle.paragraphs.map((p, i) => <div key={i} className="article-content">{renderBlankText(p, i)}</div>)}</div>
              ) : <div className="article-content">{renderBlankText(selectedArticle.content, 0)}</div>}
              {correctAnswersList.length > 0 && (
                <div style={{ marginTop: '32px', borderTop: '1px solid var(--surface-border)', paddingTop: '16px' }}>
                  <button className="btn btn-secondary" onClick={() => setShowAnswers(!showAnswers)} style={{ marginBottom: '12px' }}>{showAnswers ? '정답 숨기기' : '정답 보기'}</button>
                  {showAnswers && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {correctAnswersList.map((ans, idx) => <span key={idx} style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--success-color)', padding: '4px 12px', borderRadius: '16px', fontSize: '0.9rem', fontWeight: '500' }}>{ans}</span>)}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '100px 0' }}><Book size={64} style={{ margin: '0 auto 16px', opacity: 0.5 }} /><p>조문을 선택하세요.</p></div>}
        </div>
      </div>
    </div>
  );
}

// --- Phase 3: Random Quiz ---
function Phase3() {
  const [currentArticle, setCurrentArticle] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [quizType, setQuizType] = useState('titleToNum');
  const { addWrong } = useWrongList();

  const nextQuiz = () => {
    setCurrentArticle(allArticles[Math.floor(Math.random() * allArticles.length)]);
    setIsFlipped(false);
    setQuizType(Math.random() > 0.5 ? 'titleToNum' : 'numToTitle');
  };
  useEffect(() => { nextQuiz(); }, []);
  const handleResult = (isCorrect) => { if (!isCorrect) addWrong(currentArticle.article_num); nextQuiz(); };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>3단계: 랜덤 퀴즈</h2>
        <div>
          <button className="btn btn-secondary" onClick={nextQuiz} style={{ marginRight: '12px' }}><Shuffle size={16} /> 건너뛰기</button>
          <Link to="/" className="btn btn-secondary">돌아가기</Link>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '48px' }}>
        {currentArticle && (
          <div className="flashcard-container" style={{ maxWidth: '700px' }}>
            <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} style={{ minHeight: '400px' }} onClick={() => !isFlipped && setIsFlipped(true)}>
              <div className="flashcard-face flashcard-front glass" style={{ border: '2px solid #a855f7', cursor: 'pointer' }}>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>{quizType === 'numToTitle' ? '다음 조문의 제목은?' : '다음 제목의 조문은 제 몇 조?'}</p>
                {quizType === 'numToTitle' ? (
                  <h2 style={{ fontSize: '3.5rem', margin: '24px 0', color: 'var(--text-primary)' }}>제{currentArticle.article_num}조</h2>
                ) : (
                  <h2 style={{ fontSize: '3rem', margin: '24px 0', color: '#c084fc' }}>"{currentArticle.title}"</h2>
                )}
                <p style={{ marginTop: 'auto', opacity: 0.7 }}>(클릭하여 정답 확인)</p>
              </div>
              <div className="flashcard-face flashcard-back glass" style={{ border: '2px solid #22c55e', display: 'flex', flexDirection: 'column' }}>
                <p style={{ fontSize: '1.2rem', color: 'var(--success-color)', marginBottom: '8px' }}>정답</p>
                <h3 style={{ fontSize: '2rem' }}>제{currentArticle.article_num}조</h3>
                <h4 style={{ fontSize: '1.8rem', color: 'var(--accent-color)', marginBottom: '32px' }}>{currentArticle.title}</h4>
                <div style={{ display: 'flex', gap: '16px', marginTop: 'auto' }}>
                  <button className="btn" style={{ background: '#ef4444', color: 'white', flex: 1 }} onClick={(e) => { e.stopPropagation(); handleResult(false); }}>❌ 틀림 (오답노트)</button>
                  <button className="btn" style={{ background: '#10b981', color: 'white', flex: 1 }} onClick={(e) => { e.stopPropagation(); handleResult(true); }}>✅ 맞음 (다음)</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Phase 4: Core Elements ---
function Phase4() {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const analyzeText = (text) => {
    return text.split(' ').map((word, i) => {
      if (word.match(/(한\s*자는|한\s*자|경우에는|때에는|인|자가|자에게는)/)) return <span key={i} style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '2px 4px', borderRadius: '4px', borderBottom: '2px solid #3b82f6', marginRight: '4px' }}>{word}</span>;
      if (word.match(/(사형|무기|징역|벌금|과료|구류|몰수|처한다|벌한다|과한다)/)) return <span key={i} style={{ background: 'rgba(239, 68, 68, 0.2)', padding: '2px 4px', borderRadius: '4px', borderBottom: '2px solid #ef4444', marginRight: '4px' }}>{word}</span>;
      if (word.match(/(아니한다|없다|한다|할\s*수\s*있다)/)) return <span key={i} style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '2px 4px', borderRadius: '4px', borderBottom: '2px solid #10b981', marginRight: '4px' }}>{word}</span>;
      return <span key={i} style={{ marginRight: '4px' }}>{word}</span>;
    });
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>4단계: 핵심 구성요건 분해</h2>
        <Link to="/" className="btn btn-secondary">돌아가기</Link>
      </div>
      <div style={{ marginBottom: '16px', display: 'flex', gap: '16px', padding: '16px', background: 'var(--surface-color)', borderRadius: '8px' }}>
        <span style={{ borderBottom: '2px solid #3b82f6' }}>📘 조건/주체</span>
        <span style={{ borderBottom: '2px solid #ef4444' }}>📕 형벌/결과</span>
        <span style={{ borderBottom: '2px solid #10b981' }}>📗 서술어</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        <div className="glass-card" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {criminalActData.map((node, idx) => <HierarchyNode key={idx} node={node} onArticleClick={setSelectedArticle} />)}
        </div>
        <div className="glass-card">
          {selectedArticle ? (
            <div className="article-detail">
              <h3 style={{ fontSize: '1.8rem', marginBottom: '24px', color: '#f59e0b' }}>제{selectedArticle.article_num}조({selectedArticle.title})</h3>
              <div style={{ fontSize: '1.2rem', lineHeight: '2' }}>
                {selectedArticle.paragraphs?.length > 0 ? selectedArticle.paragraphs.map((p, i) => <div key={i} style={{ marginBottom: '16px' }}>{analyzeText(p)}</div>) : <div>{analyzeText(selectedArticle.content)}</div>}
              </div>
            </div>
          ) : <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}><p>조문을 선택하세요.</p></div>}
        </div>
      </div>
    </div>
  );
}

// --- Phase 5: Wrong Notes ---
function Phase5() {
  const { wrongList, removeWrong } = useWrongList();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const wrongArticles = allArticles.filter(a => wrongList.includes(a.article_num));

  if (wrongArticles.length === 0) return (
    <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
      <Target size={64} color="var(--success-color)" style={{ margin: '0 auto 24px' }} />
      <h2>오답 노트가 비어있습니다!</h2>
      <Link to="/phase3" className="btn btn-primary" style={{ marginTop: '24px' }}>3단계 퀴즈로</Link>
    </div>
  );

  const current = wrongArticles[currentIndex % wrongArticles.length];
  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>5단계: 스마트 오답 노트 (남은 조문: {wrongArticles.length}개)</h2>
        <Link to="/" className="btn btn-secondary">돌아가기</Link>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '48px' }}>
        <div className="flashcard-container" style={{ maxWidth: '700px' }}>
          <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} style={{ minHeight: '400px' }} onClick={() => !isFlipped && setIsFlipped(true)}>
            <div className="flashcard-face flashcard-front glass" style={{ border: '2px solid #ef4444', cursor: 'pointer' }}>
              <h2 style={{ fontSize: '3.5rem', margin: '24px 0' }}>제{current.article_num}조</h2>
              <p style={{ marginTop: 'auto', opacity: 0.7 }}>(클릭하여 정답 확인)</p>
            </div>
            <div className="flashcard-face flashcard-back glass" style={{ border: '2px solid #f59e0b', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '2rem' }}>제{current.article_num}조</h3>
              <h4 style={{ fontSize: '1.8rem', color: 'var(--accent-color)', marginBottom: '24px' }}>{current.title}</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '24px', maxHeight: '100px', overflowY: 'auto' }}>{current.content}</p>
              <div style={{ display: 'flex', gap: '16px', marginTop: 'auto' }}>
                <button className="btn" style={{ background: '#374151', color: 'white', flex: 1 }} onClick={(e) => { e.stopPropagation(); setCurrentIndex(p => p+1); setIsFlipped(false); }}>다시 복습</button>
                <button className="btn" style={{ background: '#10b981', color: 'white', flex: 1 }} onClick={(e) => { e.stopPropagation(); removeWrong(current.article_num); setIsFlipped(false); }}>완벽히 외움</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Phase 6: Speed Survival ---
function Phase6() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    let timer;
    if (isPlaying && timeLeft > 0) timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    else if (timeLeft === 0 && isPlaying) { setGameOver(true); setIsPlaying(false); }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  const generateQuestion = () => {
    const correct = allArticles[Math.floor(Math.random() * allArticles.length)];
    const wrongs = [];
    while (wrongs.length < 3) {
      const r = allArticles[Math.floor(Math.random() * allArticles.length)];
      if (r.article_num !== correct.article_num && !wrongs.includes(r)) wrongs.push(r);
    }
    setCurrentQuestion(correct);
    setOptions([correct, ...wrongs].sort(() => Math.random() - 0.5));
  };

  const startGame = () => { setScore(0); setTimeLeft(60); setGameOver(false); setIsPlaying(true); generateQuestion(); };
  const handleAnswer = (opt) => {
    if (opt.article_num === currentQuestion.article_num) { setScore(s => s + 100); setTimeLeft(t => t + 2); generateQuestion(); }
    else { setTimeLeft(t => Math.max(0, t - 5)); }
  };

  if (!isPlaying && !gameOver) return (
    <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
      <Zap size={80} color="#ec4899" style={{ margin: '0 auto 24px' }} />
      <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>최종 마스터 타임어택</h2>
      <button className="btn btn-primary" style={{ fontSize: '1.2rem', padding: '16px 32px', background: '#ec4899' }} onClick={startGame}>게임 시작</button>
    </div>
  );

  if (gameOver) return (
    <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
      <Trophy size={80} color="#f59e0b" style={{ margin: '0 auto 24px' }} />
      <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>게임 종료! 점수: {score}점</h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}><button className="btn btn-primary" onClick={startGame}>다시 하기</button><Link to="/" className="btn btn-secondary">메인으로</Link></div>
    </div>
  );

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>점수: <span style={{ color: '#ec4899' }}>{score}</span></div>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: timeLeft <= 10 ? '#ef4444' : 'white' }}><Clock size={24} style={{ display: 'inline', marginRight: '8px' }}/> {timeLeft}초</div>
      </div>
      <div className="glass-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
        <h2 style={{ fontSize: '3rem', marginBottom: '48px', color: 'var(--accent-color)' }}>제{currentQuestion?.article_num}조</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {options.map((opt, i) => <button key={i} className="btn btn-secondary" style={{ padding: '24px', fontSize: '1.2rem', height: 'auto', background: 'rgba(255,255,255,0.1)' }} onClick={() => handleAnswer(opt)}>{opt.title}</button>)}
        </div>
      </div>
    </div>
  );
}

// --- SearchBar and App Shell ---
function ArticleDetailWrapper() {
  const { id } = useParams();
  const article = allArticles.find(a => a.article_num === id);
  if (!article) return <div className="container" style={{ padding: '48px 0', textAlign: 'center' }}>조문을 찾을 수 없습니다.</div>;
  return (
    <div className="container">
      <div style={{ marginBottom: '24px' }}><Link to="/" className="btn btn-secondary">돌아가기</Link></div>
      <div className="glass-card">
        <h3 style={{ fontSize: '1.8rem', marginBottom: '24px', color: 'var(--accent-color)' }}>제{article.article_num}조({article.title})</h3>
        {article.paragraphs?.length > 0 ? article.paragraphs.map((p, i) => <div key={i} className="article-content" style={{marginBottom:'20px'}}>{p}</div>) : <div className="article-content">{article.content}</div>}
      </div>
    </div>
  );
}

function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => { if (searchRef.current && !searchRef.current.contains(e.target)) setIsOpen(false); };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const q = query.toLowerCase();
    setResults(allArticles.filter(a => a.article_num.includes(q) || (a.title && a.title.toLowerCase().includes(q)) || (a.content && a.content.toLowerCase().includes(q))).slice(0, 10));
    setIsOpen(true);
  }, [query]);

  return (
    <div ref={searchRef} style={{ position: 'relative', width: '300px' }}>
      <div style={{ position: 'relative' }}>
        <input type="text" placeholder="조문 검색..." value={query} onChange={(e) => setQuery(e.target.value)} onFocus={() => { if(query) setIsOpen(true) }} style={{ width: '100%', padding: '10px 16px 10px 40px', borderRadius: '20px', border: '1px solid var(--surface-border)', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-primary)', outline: 'none' }} />
        <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
      </div>
      {isOpen && results.length > 0 && (
        <div className="glass" style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '8px', maxHeight: '400px', overflowY: 'auto', zIndex: 100, padding: '8px' }}>
          {results.map(a => (
            <div key={a.article_num} onClick={() => { setIsOpen(false); setQuery(''); navigate(`/article/${a.article_num}`); }} style={{ padding: '12px', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>제{a.article_num}조</div>
              <div>{a.title}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <div className="main-layout">
        <nav className="navbar">
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: 'var(--accent-color)', padding: '8px', borderRadius: '8px' }}><Book size={24} /></div>
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>형법마스터</span>
            </Link>
            <SearchBar />
            <div className="nav-links" style={{ display: 'flex', gap: '16px' }}>
              <Link to="/phase0" className="nav-link" style={{ color: '#3b82f6' }}>0단계</Link>
              <Link to="/phase4" className="nav-link" style={{ color: '#f59e0b' }}>4단계</Link>
              <Link to="/phase5" className="nav-link" style={{ color: '#ef4444' }}>5단계</Link>
              <Link to="/phase6" className="nav-link" style={{ color: '#ec4899' }}>6단계</Link>
            </div>
          </div>
        </nav>
        <main className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/phase0" element={<Phase0 />} />
            <Route path="/phase1" element={<Phase1 />} />
            <Route path="/phase2" element={<Phase2 />} />
            <Route path="/phase3" element={<Phase3 />} />
            <Route path="/phase4" element={<Phase4 />} />
            <Route path="/phase5" element={<Phase5 />} />
            <Route path="/phase6" element={<Phase6 />} />
            <Route path="/article/:id" element={<ArticleDetailWrapper />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
