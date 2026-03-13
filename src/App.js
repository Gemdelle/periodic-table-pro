import React, { useState, useEffect, useCallback, useRef } from 'react';
import { elements } from './data/elements';

import rightSound from './sounds/right.mp3';
import clickSound from './sounds/click.wav';

import bgImage from './assets/bg/bg.png';
import mainElementFrame from './assets/frames/main-element-frame.png';
import answersFrame from './assets/frames/answers-frame.png';
import elementFrame from './assets/frames/element-frame.png';
import rowHeader from './assets/frames/row-header.png';
import elementsChart from './assets/frames/elements-chart.png';
import bulletRight from './assets/bullets/bullet-right.png';
import bulletWrong from './assets/bullets/bullet-wrong.png';
import flagUk from './assets/flags/flag-uk.png';
import flagArgentina from './assets/flags/flag-argentina.png';
import lifeIcon from './assets/icons/life.png';
import lifeUsedIcon from './assets/icons/life-used.png';
import questionMark from './assets/icons/question-mark.png';

import num0 from './assets/numbers/0.png';
import num1 from './assets/numbers/1.png';
import num2 from './assets/numbers/2.png';
import num3 from './assets/numbers/3.png';
import num4 from './assets/numbers/4.png';
import num5 from './assets/numbers/5.png';
import num6 from './assets/numbers/6.png';
import num7 from './assets/numbers/7.png';
import num8 from './assets/numbers/8.png';
import num9 from './assets/numbers/9.png';

const numberImages = {
  0: num0, 1: num1, 2: num2, 3: num3, 4: num4, 5: num5, 6: num6, 7: num7, 8: num8, 9: num9
};

function App() {
  const [language, setLanguage] = useState('en');
  const [rightCount, setRightCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [currentElement, setCurrentElement] = useState(null);
  const [guessedElements, setGuessedElements] = useState([]);
  const [availableElements, setAvailableElements] = useState([]);
  const [lives, setLives] = useState(3);
  const [highlightedElement, setHighlightedElement] = useState(null);
  const [totalElements, setTotalElements] = useState(0);
  const [showChart, setShowChart] = useState(false);

  const rightAudioRef = useRef(new Audio(rightSound));
  const wrongAudioRef = useRef(new Audio(clickSound));

  const playSound = (audioRef) => {
    audioRef.current.currentTime = 0;
    audioRef.current.play();
  };

  const pickRandomElement = useCallback(() => {
    if (availableElements.length === 0) return;
    const randomIndex = Math.floor(Math.random() * availableElements.length);
    setCurrentElement(availableElements[randomIndex]);
  }, [availableElements]);

  useEffect(() => {
    setAvailableElements([...elements]);
    setTotalElements(elements.length);
  }, []);

  useEffect(() => {
    if (availableElements.length > 0 && !currentElement) {
      pickRandomElement();
    }
  }, [availableElements, currentElement, pickRandomElement]);

  const handleElementClick = (element) => {
    if (guessedElements.find(e => e.atomicNumber === element.atomicNumber)) return;
    if (!currentElement) return;

    if (element.atomicNumber === currentElement.atomicNumber) {
      playSound(rightAudioRef);
      setRightCount(prev => prev + 1);
      setGuessedElements(prev => [...prev, element]);
      setAvailableElements(prev => prev.filter(e => e.atomicNumber !== element.atomicNumber));
      setHighlightedElement(null);

      const remaining = availableElements.filter(e => e.atomicNumber !== element.atomicNumber);
      if (remaining.length > 0) {
        const randomIndex = Math.floor(Math.random() * remaining.length);
        setCurrentElement(remaining[randomIndex]);
      } else {
        setCurrentElement(null);
      }
    } else {
      playSound(wrongAudioRef);
      setWrongCount(prev => prev + 1);
    }
  };

  const handleSkip = () => {
    setHighlightedElement(null);
    if (availableElements.length > 1) {
      let newElement;
      do {
        const randomIndex = Math.floor(Math.random() * availableElements.length);
        newElement = availableElements[randomIndex];
      } while (newElement.atomicNumber === currentElement?.atomicNumber);
      setCurrentElement(newElement);
    }
  };

  const handleHint = () => {
    if (lives > 0 && currentElement && !highlightedElement) {
      setLives(prev => prev - 1);
      setHighlightedElement(currentElement.atomicNumber);
    }
  };

  const getElementImage = (name) => {
    try {
      return require(`./assets/elements/${name}.png`);
    } catch {
      return null;
    }
  };

  const renderAtomicNumber = (atomicNumber) => {
    const digits = String(atomicNumber).split('');
    return (
      <div className="periodic-table__cell-number">
        {digits.map((digit, index) => (
          <img
            key={index}
            src={numberImages[parseInt(digit)]}
            alt={digit}
            className="periodic-table__cell-number-digit"
          />
        ))}
      </div>
    );
  };

  const renderCell = (row, col, showFrame = true) => {
    const element = elements.find(e => e.row === row && e.col === col);
    const isGuessed = element && guessedElements.find(g => g.atomicNumber === element.atomicNumber);
    const isHighlighted = element && highlightedElement === element.atomicNumber;
    const isSpecialRow = row === 8 || row === 9;
    const gridColumn = isSpecialRow ? col + 1 : col + 1;

    if (!showFrame && !element) {
      return (
        <div
          key={`${row}-${col}`}
          className="periodic-table__cell periodic-table__cell--empty"
          style={{ gridColumn }}
        >
        </div>
      );
    }

    return (
      <div
        key={`${row}-${col}`}
        className={`periodic-table__cell ${element ? 'periodic-table__cell--has-element' : ''} ${isGuessed ? 'periodic-table__cell--guessed' : ''} ${isHighlighted ? 'periodic-table__cell--highlighted' : ''}`}
        style={{ gridColumn }}
        onClick={() => element && handleElementClick(element)}
      >
        <img src={elementFrame} alt="" className="periodic-table__cell-frame" />
        {element && renderAtomicNumber(element.atomicNumber)}
        {element && !isGuessed && (
          <img
            src={questionMark}
            alt="?"
            className="periodic-table__cell-element-img periodic-table__cell-element-img--question"
          />
        )}
        {isGuessed && getElementImage(element.name) && (
          <>
            <img
              src={getElementImage(element.name)}
              alt={element.name}
              className="periodic-table__cell-element-img"
            />
            <div className="periodic-table__cell-overlay">
              <span className="periodic-table__cell-symbol">{element.symbol}</span>
            </div>
          </>
        )}
        {isGuessed && !getElementImage(element.name) && (
          <span className="periodic-table__cell-symbol-only">{element.symbol}</span>
        )}
      </div>
    );
  };

  const renderRow = (rowNum) => {
    const cols = [];
    const isSpecialRow = rowNum === 8 || rowNum === 9;
    const startCol = isSpecialRow ? 3 : 1;
    const endCol = isSpecialRow ? 17 : 18;

    for (let col = startCol; col <= endCol; col++) {
      const isLanthanideActinideSlot = (rowNum === 6 || rowNum === 7) && col === 3;
      if (isLanthanideActinideSlot) continue;

      const hasElement = elements.find(e => e.row === rowNum && e.col === col);
      const showFrame = hasElement || rowNum >= 4 || isSpecialRow;
      cols.push(renderCell(rowNum, col, showFrame));
    }
    return cols;
  };

  return (
    <div className="game" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="game__header">
        <div className="game__left-spacer"></div>

        <div className="game__center">
          <div className="game__score">
            <div className="game__score-label">{guessedElements.length} / {totalElements}</div>
            <div className="game__score-bullets">
              <div className="game__bullet">
                <span className="game__bullet-letter">{rightCount}</span>
                <img src={bulletRight} alt="Right" />
              </div>
              <div className="game__bullet">
                <span className="game__bullet-letter">{wrongCount}</span>
                <img src={bulletWrong} alt="Wrong" />
              </div>
            </div>
          </div>

          <div className="game__current-element">
            <div className="game__particles">
              <span className="game__particle"></span>
              <span className="game__particle"></span>
              <span className="game__particle"></span>
              <span className="game__particle"></span>
              <span className="game__particle"></span>
              <span className="game__particle"></span>
              <span className="game__particle"></span>
              <span className="game__particle"></span>
            </div>
            <img src={mainElementFrame} alt="" className="game__current-element-frame" />
            <div className="game__current-element-img-container">
              {currentElement && (
                <img
                  src={getElementImage(currentElement.name)}
                  alt={currentElement.name}
                  className="game__current-element-img"
                />
              )}
            </div>
            <div className="game__current-element-name">
              <span>{currentElement ? (language === 'en' ? currentElement.name : currentElement.nameEs) : ''}</span>
            </div>
          </div>

          <div className="game__help-section">
            <div
              className={`game__hint-button ${lives === 0 ? 'game__hint-button--disabled' : ''}`}
              onClick={handleHint}
            >
              <img src={questionMark} alt="Hint" />
            </div>
            <div className="game__lives">
              {[0, 1, 2].map(i => (
                <img
                  key={i}
                  src={i < lives ? lifeIcon : lifeUsedIcon}
                  alt={i < lives ? "Life" : "Life used"}
                  className="game__life"
                />
              ))}
            </div>
            <div className="game__buttons">
              <button className="game__skip" onClick={handleSkip}>SKIP</button>
              <button className="game__chart-btn" onClick={() => setShowChart(true)}>CHART</button>
            </div>
          </div>
        </div>

        <div className="game__flags">
          <div
            className={`game__flag ${language === 'en' ? 'game__flag--active' : ''}`}
            onClick={() => setLanguage('en')}
          >
            <img src={flagUk} alt="English" />
            <span>EN</span>
          </div>
          <div
            className={`game__flag ${language === 'es' ? 'game__flag--active' : ''}`}
            onClick={() => setLanguage('es')}
          >
            <img src={flagArgentina} alt="Español" />
            <span>ES</span>
          </div>
        </div>
      </div>

      <div className="periodic-table">
        {[1, 2, 3, 4, 5, 6, 7].map(row => (
          <React.Fragment key={row}>
            <div className="periodic-table__row-header">
              <img src={rowHeader} alt="" className="periodic-table__row-header-bg" />
              <img src={numberImages[row]} alt={row} className="periodic-table__row-number" />
            </div>
            {renderRow(row)}
          </React.Fragment>
        ))}

        <div className="periodic-table__spacer"></div>

        <div className="periodic-table__row-header periodic-table__row-header--special">
          <img src={rowHeader} alt="" className="periodic-table__row-header-bg" />
          <img src={numberImages[6]} alt="6" className="periodic-table__row-number" />
        </div>
        {renderRow(8)}

        <div className="periodic-table__row-header periodic-table__row-header--special">
          <img src={rowHeader} alt="" className="periodic-table__row-header-bg" />
          <img src={numberImages[7]} alt="7" className="periodic-table__row-number" />
        </div>
        {renderRow(9)}
      </div>

      {showChart && (
        <div className="chart-overlay" onClick={() => setShowChart(false)}>
          <div className="chart" onClick={(e) => e.stopPropagation()}>
            <img src={elementsChart} alt="" className="chart__bg" />
            <button className="chart__close" onClick={() => setShowChart(false)}>×</button>
            <div className="chart__grid">
              {elements.map(element => (
                <div key={element.atomicNumber} className="chart__item">
                  <div className="chart__item-content">
                    <img
                      src={getElementImage(element.name)}
                      alt={element.name}
                      className="chart__item-img"
                    />
                    <span className="chart__item-symbol">{element.symbol}</span>
                    <span className="chart__item-name">
                      {language === 'en' ? element.name : element.nameEs}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
