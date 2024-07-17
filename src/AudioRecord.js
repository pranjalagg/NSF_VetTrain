import React, {useState} from 'react';
import useSpeechToText from './hooks/useSpeechToText';

const AudioRecord = () => {

    const [textInput, setTextInput] = useState('');
    const {isListening, transcript, startListening, stopListening } = useSpeechToText({continuous: true});

    const startStopListening = () => {
      isListening ? stopVoiceInput() : startListening()
    }

    const stopVoiceInput = () =>{
        setTextInput(prevVal => prevVal + (transcript.length ? (prevVal.length ? ' ' : '') + transcript : ''))
        setTimeout(() => {
            stopListening();
        }, 1000);
    }
  return (
    <div style={{
        display: 'block', margin: '0 auto', width: '400px', textAlign: 'center', marginTop: '20px' }}>
            
    <button 
    onClick={()=>{startStopListening()}}
    style={{
        backgroundColor: isListening? "#d62d20" : "#008744",
        color: "white",
        padding: "10px 20px",
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    }}>
     {isListening ? 'Stop Recording' : 'Speak'}  
    </button>
    <textarea style={{
        marginTop: '20px',
        width: '100%',
        height: '150px',
        padding: "10px",
        border: '1px solid #ccc',
        borderRadius: '5px',
        transition: 'border-color 0.3s ease',
        resize: 'none',
        backgroundColor: '#f8f8f8',
        color: '#333'
    }} 
    disabled={isListening}
    value={isListening ? textInput + (transcript.length ? (textInput.length ? ' ' : ' ') + transcript : ' ') : textInput}
    onChange={(e) => {setTextInput(e.target.value) }}
    />
    </div>
  );
};
export default AudioRecord;


