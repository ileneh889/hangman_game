

export default function Keyboard({ keyName, guessed, answer, toggleGuessed }) {

  const style = {
    backgroundColor: guessed ?
      answer.includes(keyName) ? "#10A95B" : "#EC5D49" :
      "#FCBA29"
  }

  return (
    <div className="keys" style={style} onClick={() => toggleGuessed(keyName)}>{keyName}</div>
  )
}


