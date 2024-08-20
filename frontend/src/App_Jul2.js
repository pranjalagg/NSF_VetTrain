import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import './App.css';

function App() {
  const [allQuestions, setAllQuestions] = useState([
    { id: 1, question: 'Tell me about yourself. What are you looking for currently?', category: 'Introduction', answer: '' },
    { id: 2, question: 'What is your biggest achievement/accomplishment that you are proud of?', category: 'Knowledge and Skills', answer: '' },
    { id: 3, question: 'What are the strengths you think are transferrable from your service in military?', category: 'Knowledge and Skills', answer: '' },
    { id: 4, question: 'What do you think is an area of improvement for you?', category: 'Knowledge and Skills', answer: '' },
    { id: 5, question: 'What would be the most impactful leadership role that you\'ve had that would demonstrate that behavior?', category: 'Leadership', answer: '' },
    { id: 6, question: 'How do you define leadership?', category: 'Leadership', answer: '' }
    // Add more questions as needed
  ]);
  const [isListening, setIsListening] = useState(false);
  const {transcript, resetTranscript } = useSpeechRecognition();
  // const [transcript, setTranscript] = useState('');
  const [textAreaValue, setTextAreaValue] = useState(transcript);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestion = allQuestions[currentQuestionIndex];

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
  // Use the stateful allQuestions for categorization
  const categorizedQuestions = allQuestions.reduce((acc, question) => {
    const { category } = question;
    if (!acc[category]) acc[category] = [];
    acc[category].push(question);
    return acc;
  }, {});

  // Logic for selectedQuestions remains the same
  const selectedQuestions = [
    ...categorizedQuestions['Introduction'].slice(0, 2),
    ...categorizedQuestions['Knowledge and Skills'].slice(0, 3),
    // Add more categories and selections as needed
  ];
  

  // Update handleAnswerChange to use setAllQuestions
  const handleAnswerChange = (newAnswer) => {
    const updatedQuestions = allQuestions.map((q, index) => 
      index === currentQuestionIndex ? { ...q, answer: newAnswer } : q
    );
    setAllQuestions(updatedQuestions); // Use setAllQuestions to update the state
  };
  // const handleAnswerChange = (newAnswer) => {
  //   setQuestions(prevQuestions => prevQuestions.map(q => 
  //     q.id === currentQuestion.id ? { ...q, answer: newAnswer } : q
  //   ));
  //   // Also update the currentQuestion state if it's separately managed
  //   setCurrentQuestion(prev => ({ ...prev, answer: newAnswer }));
  // };

  const handleSubmit = () => {
    console.log(`Submitting answer for question ${currentQuestion.id}: ${currentQuestion.answer}`);
    // Process the answer submission here (e.g., send to an API)
  };

  // const handleNextQuestion = () => {
  //   const nextIndex = (currentQuestionIndex + 1) % allQuestions.length;
  //   setCurrentQuestionIndex(nextIndex);
  // };

  const goToNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => Math.min(prevIndex + 1, allQuestions.length - 1));
  };

  // Function to go to the previous question
  const goToPreviousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  if (!currentQuestion) return <div>Loading...</div>;

 


  const handleAudioSubmit = async (event) => {
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
    
    <div className="app-container">
      <div className="question-container">
        <div className="category">{currentQuestion.category}</div>
        <div className="question">{currentQuestion.question}</div>
        {/* <textarea
          type="text"
          value={currentQuestion.answer}
          onChange={(e) => handleAnswerChange(e.target.value)}
          placeholder="Type your answer here"
          className="answer-input"
        /> */}
        <textarea
        // type="text"
        // value={currentQuestion.answer}
        value={transcript}
        placeholder="Type your answer here" 
        onChange={handleTextAreaChange}
        // onChange={(e) => handleAnswerChange(e.target.value)}
        className="answer-input"  />
        <div className="button-container">
         
          {/* <button onClick={handleNextQuestion} className="next-button">Next Question</button> */}
          <button onClick={goToPreviousQuestion} className="next-button" disabled={currentQuestionIndex === 0}>
        Previous Question
      </button>
      <button onClick={goToNextQuestion} className="next-button">
        Next Question
      </button>
      <button onClick={() => setIsListening(prevState => !prevState)}>
        {isListening ? 'Stop Recording' : 'Record Answer'}
      </button>
      <button onClick={transcript}>Reset Answer</button>
      
      <button onClick={handleSubmit} className="submit-button">Submit</button>
        </div>
      </div>
     
    </div>
  );
}

export default App;


// import React, { useState } from 'react';
// import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

// const App = () => {
//   const [text, setText] = useState('');
  
//   const { transcript, resetTranscript } = useSpeechRecognition({
//     onResult: (result) => setText(result)
//   });

//   const startListening = () => {
//     SpeechRecognition.startListening({ continuous: true });
//   };

//   const stopListening = () => {
//     SpeechRecognition.stopListening();
//   };

//   const handleTextAreaChange = (event) => {
//     setText(event.target.value);
//   };

//   const handleReset = () => {
//     resetTranscript();
//     setText('');
//   };

//   return (
//     <div>
//       <button onClick={startListening}>Start Recording</button>
//       <button onClick={stopListening}>Stop Recording</button>
//       <button onClick={handleReset}>Reset Transcript</button>
//       <textarea
//         value={text}
//         onChange={handleTextAreaChange}
//         placeholder="Your text will appear here..."
//       />
//     </div>
//   );
// };

// export default App;
