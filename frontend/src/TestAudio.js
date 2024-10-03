import React, { useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const TestAudio = () => {
  const [isListening, setIsListening] = useState(false);
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [textAreaValue, setTextAreaValue] = useState(transcript);

  useEffect(() => {
    setTextAreaValue(transcript);
  }, [transcript]);

  const handleTextAreaChange = (event) => {
    setTextAreaValue(event.target.value);
  };

  useEffect(() => {
    if (isListening) {
      SpeechRecognition.startListening({ continuous: true });
    } else {
      SpeechRecognition.stopListening();
    }
    return () => {
      SpeechRecognition.stopListening();
    };
  }, [isListening]);

  const [isEditable, setIsEditable] = useState(true);

useEffect(() => {
  if (!isListening) {
    setIsEditable(true);
  } else {
    setIsEditable(false);
  }
}, [isListening]);

  useEffect(() => {
    SpeechRecognition.onend = () => {
      if (isListening) {
        SpeechRecognition.startListening({ continuous: true });
      }
    };
    return () => {
      SpeechRecognition.onend = null;
    };
  }, [isListening]);

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return null;
  }

  const handleSubmit = async (event) => {
    // try {
      event.preventDefault();
      // Do something with the transcript
      console.log(transcript);
    //   const response = await axios.post('http://127.0.0.1:5000/', {
    //     question,
    //     answer,
    //     // audio: recordedBlob,
    //   });
    //   console.log(response.data);
    //   setResponse(response.data);
    // } catch (error) {
    //   console.error(error);
    // }
  };
  
  return (
    <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
      <button onClick={() => setIsListening(prevState => !prevState)}>
        {isListening ? 'Stop Recording' : 'Start Recording'}
      </button>
      <button onClick={resetTranscript}>Reset Transcript</button>
      <form onSubmit={handleSubmit}>
        <textarea value={transcript} onChange={handleTextAreaChange} rows="5" cols="50"  />
        <button type="submit">Submit</button>
       {/* <button onClick={handleSubmit} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
        Submit
      </button>
      {response && <div style={{ marginTop: '20px', color: '#333' }}>{JSON.stringify(response)}</div>}
      <p>{transcript}</p>  */}
      </form>
    </div>
  );
};

export default TestAudio;