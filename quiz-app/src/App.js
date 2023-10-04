import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [wordData, setWordData] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  useEffect(() => {
    fetch('wordlist.json')
      .then((response) => response.json())
      .then((data) => setWordData(data));
  }, []);

  const handleStart = () => {
    generateQuestion(wordData);
  };

  const generateQuestion = (data) => {
    const randomIndex = Math.floor(Math.random() * data.length);
    const selectedWord = data[randomIndex];
    const filteredData = data.filter((item) => item.category === selectedWord.category && item.japanese !== selectedWord.japanese);
    const option1 = filteredData[Math.floor(Math.random() * filteredData.length)];
    const option2 = filteredData[Math.floor(Math.random() * filteredData.length)];
    setCurrentQuestion({
      ...selectedWord,
      choices: [selectedWord.chinese, option1.chinese, option2.chinese].sort(() => Math.random() - 0.5),
      showImage: false,
    });
  };

  const handleAnswerClick = (answer) => {
    setSelectedAnswer(answer);
    setIsCorrect(answer === currentQuestion.chinese);
    setCurrentQuestion({ ...currentQuestion, showImage: true });
  };

  const handleNextClick = () => {
    setSelectedAnswer(null);
    setIsCorrect(null);
    generateQuestion(wordData);
  };

  const speak = (text, lang) => {
    if ('speechSynthesis' in window) {
      const synthesis = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      synthesis.speak(utterance);
    } else {
      console.error('Web Speech API is not supported in this browser.');
    }
  };
  

  if (wordData.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app">
      <div className="container">
        <h1 className="question">
          {currentQuestion ? (
            <>
              <span>{currentQuestion.japanese} はどんな意味でしょう？</span>
              <button onClick={() => speak(currentQuestion.japanese, 'ja-JP')} className="speak-button">
                🗣
              </button>
            </>
          ) : (
            'Ready to Start?'
          )}
        </h1>
        {currentQuestion && currentQuestion.showImage && (
          <img src={currentQuestion.image} alt={currentQuestion.english} className="question-image" />
        )}
        <div className="choices">
          {currentQuestion &&
            currentQuestion.choices.map((choice, index) => (
              <div key={index}>
                <button onClick={() => handleAnswerClick(choice)} disabled={selectedAnswer !== null} className="button">
                  {choice}
                </button>
                {selectedAnswer === choice && (
                  <span className="result" style={{ color: isCorrect ? 'blue' : 'red' }}>
                    {isCorrect ? '正解' : '不正解'}
                  </span>
                )}
                <button onClick={() => speak(choice, 'zh-CN')} className="speak-button">
                  🗣
                </button>
              </div>
            ))}
        </div>
        {currentQuestion ? (
          <button onClick={handleNextClick} disabled={selectedAnswer === null} className="button next-button">
            次の問題
          </button>
        ) : (
          <button onClick={handleStart} className="button start-button">
            Start
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
