import { useState, useEffect } from 'react'
import { generate } from "random-words";
import Keyboard from './components/Keyboard';
import LanguageTags from './assets/languageTags';
import Confetti from "react-confetti"
import './App.css'

function App() {
  // answer (lazy initualiztion)
  const [answer, setAnswer] = useState(() => {
    const newAnswer = generate({ maxLength: 7 }).split('')
    return newAnswer;
  });
  // keyboard
  const [keyboard, setKeyboard] = useState(() => {
    const alphabet = Array.from({ length: 26 }, (_, i) => ({
      keyName: String.fromCharCode(97 + i),
      guessed: false,
    }));
    return alphabet
  })
  // language tags
  const [languageTag, setlanguageTag] = useState(LanguageTags)
  // chance Count: 9 ===LanguageTags.length
  const [wrongCount, setWrongCount] = useState(0)
  // decide wether the game has won or is lost due to running out of chances
  const [winGame, setWinGame] = useState(false);
  const [endGame, setEndGame] = useState(false);
  //matched Keys
  const [matchedKeys, setMatchedKeys] = useState([])


  // console.log(answer, keyboard, winGame, endGame)

  // // // // // // // // // // // // // useEffect // // // // // // // // // // // // // 
  // 每次keyboard變化就檢查有沒有贏
  useEffect(() => {
    const matchedKeys = keyboard.reduce((acc, item) => {
      if (item.guessed && answer.includes(item.keyName)) {
        acc.push(item.keyName);
      }
      return acc;
    }, []).sort((a, b) => a.localeCompare(b))
    const cleanAnswer = Array.from(new Set(answer)).sort((a, b) => a.localeCompare(b))

    console.log('XXX', matchedKeys, cleanAnswer, wrongCount)
    const matched = () => {
      if (matchedKeys.length !== cleanAnswer.length) return false
      for (let i = 0; i < matchedKeys.length; i++) {
        if (matchedKeys[i] !== cleanAnswer[i]) return false
      }
      return true
    }

    // 檢查邏輯：先確認「輸入與答案是否一致」：  [！]終局條件的優先判定
    //// 若是，就獲勝
    //// 若沒有，確認是否「用掉全部機會」：
    /////// 若是就輸
    /////// 若否啥也不做
    if (matched()) setWinGame(true)
    else {
      if (wrongCount > 8) setEndGame(true)
    }
  }, [keyboard])



  // // // // // // // // // // // // // functions // // // // // // // // // // // // // 
  // toggle wether btn being guessed
  function toggleGuessed(letter) {
    // 只要贏了或輸了，就不能按鍵盤
    if (winGame || endGame) return
    // 只要猜錯超過8次，就不能按鍵盤 
    if (wrongCount > 8) return
    // 猜錯的累計
    if (!answer.includes(letter)) setWrongCount(prev => prev + 1)

    setKeyboard(prev => prev.map(item => {
      // 注意大小寫要一致
      return item.keyName.toLowerCase() === letter.toLowerCase() ? { ...item, guessed: true } : item
    }))
    setMatchedKeys(prev => [...prev, letter])
  }


  // restart game 
  function restartGame() {
    setAnswer(generate({ maxLength: 7 }).split(''))
    setWinGame(false)
    setEndGame(false)
    setMatchedKeys([])
    setWrongCount(0)
    setKeyboard(prev => prev.map(item => ({ ...item, guessed: false })))
  }


  // // // // // // // // // // // // // elements // // // // // // // // // // // // // 
  // generate game status content：一樣小心終局條件與其他條件的優先順序
  const gameStatus = winGame ? 'You win!😍😍😍' :
    wrongCount < 9 && wrongCount > 0 ?
      languageTag[wrongCount - 1].displayContent :
      endGame && 'You lose!😶‍🌫️😶‍🌫️😶‍🌫️';

  // generate language tags  (#可以利用index!! loop以continue來跳過該次迭代，return會完全結束loop)
  const languageTagElements = languageTag.map((tag, index) => {
    return (
      <div
        className={` language_tag ${index < wrongCount ? 'used' : ''} `}
        key={index}
      >
        {tag.languageName}
      </div>
    );
  });

  // generate answer
  const displayAnswerElements = answer.map((letter, index) => {
    return (
      <div className="letter" key={index}>
        {/* 若確定輸了(endGame)，就把答案全部顯示出來 */}
        {/* 答案區是否顯示A，取決於 鍵盤中有A字母的鍵(字母要相同) + 該鍵被按下(guessed為true) => 若是，則顯示該答案字母，否則不顯示 */}
        {endGame ? letter : keyboard.find(item => item.keyName.toLowerCase() === letter.toLowerCase() && item.guessed) && letter}
      </div>
    )
  })

  // generate keyboard
  const keyboardElements = keyboard.map((key, index) => {
    return (
      <Keyboard key={index} {...key} answer={answer} toggleGuessed={toggleGuessed} />
    )
  });


  // // // // // // // // // // // // dynamic style // // // // // // // // // // // // // //
  const statusBackgroundColor = winGame ? 'win' :
    wrongCount < 9 && wrongCount > 0 ?
      'wrong' :
      endGame && 'lose';

  return (
    <>
      {winGame && <Confetti />}
      <div className="container">
        <div className="static_info">
          <h1>Assembly: Endgame</h1>
          <p>Guess the word in under 9 attempts to keep the programming world safe from Assembly!</p>
        </div>
        <div className={`gameSatus_box ${statusBackgroundColor}`}>{gameStatus}</div>
        <div className="languagetag_box">{languageTagElements}</div>
        <div className="answer_box">{displayAnswerElements}</div>
        <div className="keyboard_box">{keyboardElements}</div>
        {(winGame || endGame) && <button onClick={restartGame}>New Game</button>}
      </div>
    </>
  )
}

export default App
