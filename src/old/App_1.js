import React, { useState } from 'react';
import axios from 'axios';
// import { ReactMic } from 'react-mic';
import AudioUpload from '../AudioUpload';
import AudioRecord from '../AudioRecord';
import TestAudio from '../TestAudio';
import { FaMicrophone } from 'react-icons/fa';
import { useSpeechRecognition } from 'react-speech-recognition'; 
import './App.css';

function App() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [response, setResponse] = useState(null);
  // const [isRecording, setIsRecording] = useState(false);
  // const [recordedBlob, setRecordedBlob] = useState(null);
  


  const questions = ['Tell me about your previous job experience?', 'What are your Strengths and Weakness?']; 

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/', {
        question,
        answer,
        // audio: recordedBlob,
      });
      console.log(response.data);
      setResponse(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // const startRecording = () => {
  //   setIsRecording(true);
  //   startListening();
  // };

  // const stopRecording = () => {
  //   setIsRecording(false);
  //   stopListening();
  // };

  // const onData = (recordedBlob) => {
  //   console.log('chunk of real-time data is: ', recordedBlob);
  // };

  // const onStop = (recordedBlob) => {
  //   console.log('recordedBlob is: ', recordedBlob);
  //   setRecordedBlob(recordedBlob);
  // };

  return (
    <div className="App" style={{ backgroundColor: '#f5f5f5', padding: '20px' }}>
       <h1 style={{ color: '#333', textAlign: 'center' }}>NLP Vet Train</h1>
      <div style={{ marginBottom: '20px' }}>
        <select
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          style={{ width: '50%', height: '40px', fontSize: '16px', padding: '10px' }}
        >
          {questions.map((q, index) => (
            <option key={index} value={q}>
              {q}
            </option>
          ))}
        </select>
      </div>
       <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here"
          style={{ width: '50%', height: '40px', fontSize: '16px', padding: '10px' }}
        />
      </div>
     {/* <button onClick={startRecording} disabled={isRecording} style={{ fontSize: '20px' }}>
        <FaMicrophone />
      </button>
      <button onClick={stopRecording} disabled={!isRecording}>
        Stop
      </button>  */}
      {/* <ReactMic
        record={isRecording}
        className="sound-wave"
        onStop={onStop}
        onData={onData}
        strokeColor="#000000"
        backgroundColor="#FF4081"
      /> */}
      {/* <button onClick={handleSubmit} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
        Submit
      </button>
      {response && <div style={{ marginTop: '20px', color: '#333' }}>{JSON.stringify(response)}</div>}
      <p>{transcript}</p>  */} 
      
      {/* <AudioRecord /> */}
      
       
      {/* <div style={{ display: 'flex', flexDirection: 'column' }}> */}
      
      {/* <AudioUpload /> */}
    
  {/* </div> */}
   {/* <AudioUpload />  */}
  {/* <div style={{ marginTop: '100px' }}>
   <TestAudio />
    </div> */}
   
    </div>
  );
}

export default App;


