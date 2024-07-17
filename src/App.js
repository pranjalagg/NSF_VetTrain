import React, { useState, useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useWhisper } from '@chengsokdara/use-whisper';
import './App.css';

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [allQuestions, setAllQuestions] = useState([
    { id: 1, question: 'Tell me about yourself. What are you looking for currently?', category: 'Introduction', answer: '' },
    { id: 2, question: 'How do you react in a situation where you need to make an immediate decision on a major issue? Can you give me an example where you were involved in such a situation?', category: 'Mental Capability', answer: '' },
    { id: 3, question: 'How do you react in a situation where you need to make an immediate decision on a major issue?', category: 'Mental Capability', answer: '' }, 
    { id: 4, question: 'What is your biggest achievement/accomplishment that you are proud of?', category: 'Knowledge and Skills', answer: '' },
    { id: 5, question: 'What are the strengths you think are transferrable from your service in military?', category: 'Knowledge and Skills', answer: '' },
    { id: 6, question: 'What do you think is an area of improvement for you?', category: 'Knowledge and Skills', answer: '' },
    { id: 7, question: 'What would be the most impactful leadership role that you\'ve had that would demonstrate that behavior?', category: 'Leadership', answer: '' },
    { id: 8, question: 'How do you define leadership?', category: 'Leadership', answer: '' },
    { id: 9, question: 'What questions would you ask to a candidate when you are selecting someone for your team?', category: 'Communication and Interpersonal Skills', answer: '' },
    { id: 10, question: 'How do you handle a conversation with someone with a different opinion than yours?', category: 'Communication and Interpersonal Skills', answer: '' },
    { id: 11, question: 'What is the most challenging work or school group that you had to collaborate with, and how did you establish rapport with that group? What actions did you take to gain their confidence?', category: 'Communication and Interpersonal Skills', answer: '' },
    { id: 12, question: 'Can you describe a time where you had to deal with a major change in your work process? How did you deal with that change?', category: 'Basic Personality Tendencies', answer: '' },
    { id: 13, question: 'Tell me about a time when you, or your team were not meeting an established goal or deadline. What steps did you take to ensure that goal or deadline was met?', category: 'Basic Personality Tendencies', answer: '' },
    { id: 14, question: 'When there is a difference of opinion, how do you arbitrate a system?', category: 'Persuasion and Negotiation', answer: '' },
    { id: 15, question: 'Can you think of a situation where there was some kind of tension, or conflict between a couple of your team members, and how you negotiated that with them?', category: 'Persuasion and Negotiation', answer: '' },
    { id: 16, question: 'What is your focus after graduation?', category: 'Interests and Preferences', answer: '' },
    { id: 17, question: 'What role would be of interest to you?', category: 'Interests and Preferences', answer: '' },
    { id: 18, question: 'Do you have any questions for us?', category: 'Conclusion', answer: '' },
    { id: 19, question: 'Why should we hire you?', category: 'Why', answer: '' },
    
  ]);

  const [currentQuestions, setCurrentQuestions] = useState([ ]);
  
  const [isListening, setIsListening] = useState(false);
  const [apiResponse, setApiResponse] = useState({ classification: '', justification: '' });
  // const [currentCategory, setCurrentCategory] = useState('All Categories');

  const {
    recording,
    speaking,
    transcribing,
    transcript,
    pauseRecording,
    startRecording,
    stopRecording,
  } = useWhisper({
    apiKey: `${process.env.REACT_APP_OPENAI_API_KEY}`, // YOUR_OPEN_AI_TOKEN
  })
  // const {transcript, resetTranscript } = useSpeechRecognition();
  const [textAreaValue, setTextAreaValue] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestion = allQuestions[currentQuestionIndex];
  const [lastAppendedTranscript, setLastAppendedTranscript] = useState(''); 
  const textareaRef = useRef(null);
  const [buttonColor, setButtonColor] = useState(true);

  const startInterview = () => {
    setShowIntro(false); // Hide the intro and show the main content

    // Step 1: Shuffle all questions and select a subset
    const shuffledQuestions = allQuestions.sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffledQuestions.slice(0, 8);
  
    setCurrentQuestions(selectedQuestions);
    // const questionsByCategory = allQuestions.reduce((acc, question) => {
    //   const { category } = question;
    //   if (!acc[category]) {
    //     acc[category] = [];
    //   }
    //   acc[category].push(question);
    //   return acc;
    // }, {});
  
    // // Step 2: Select one question from each category
    // const selectedQuestions = Object.values(questionsByCategory).map(categoryQuestions => {
    //   const randomIndex = Math.floor(Math.random() * categoryQuestions.length);
    //   return categoryQuestions[randomIndex];
    // });
  
    // // Step 3 & 4: Optionally shuffle the selected questions
    // const shuffledSelectedQuestions = selectedQuestions.sort(() => 0.5 - Math.random());
  
    // // Assuming you have a state to hold the current set of questions for the interview
    // setCurrentQuestions(shuffledSelectedQuestions);
  };

  const startOver = () => {
    setShowIntro(true); // Show the intro page again
    setCurrentQuestionIndex(0); // Reset the question index to the start
    // Reset other states as needed
  };

  const goToNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => Math.min(prevIndex + 1, currentQuestions.length - 1));
  };

  const goToPreviousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const onRecordingButton = () => {
    setIsListening(prevState => !prevState);
    setButtonColor(!buttonColor);
    // if (!isListening) {
    //   setTextAreaValue(transcript.text);
    // }
  };

  const updateCurrentAnswer = (newAnswer) => {
    const updatedQuestions = currentQuestions.map((item, index) => {
      if (index === currentQuestionIndex) {
        return { ...item, answer: newAnswer };
      }
      return item;
    });
    setCurrentQuestions(updatedQuestions);
  };

  useEffect(() => {
    if (isListening) {
      // SpeechRecognition.startListening({ continuous: true });
      startRecording();
    } else {
      stopRecording(); 
    }
    return () => {
      // stopRecording();
      // setTextAreaValue(transcript.text);
      // setTextAreaValue(appTranscript + ' ' + transcript);
      // resetTranscript();
    };
  }, [isListening]);

  useEffect(() => {
    // Assuming `transcript` is the variable holding the transcription text
    // and `setTextAreaValue` is the method to update the text area content
    setTextAreaValue(prevValue => `${prevValue} ${transcript.text}`);
    // setTextAreaValue(transcript.text);
    // Optionally, adjust the text area height here if needed
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [transcript.text]);

  // const [displayedQuestions, setDisplayedQuestions] = useState([]);

  
  // useEffect(() => {
  //   setTextAreaValue(''); // Reset text area value for new question
  //   // Optionally reset other states as needed
  // }, [currentQuestionIndex]);

  const handleTextAreaChange = (event) => {
    setTextAreaValue(event.target.value);
    updateCurrentAnswer(event.target.value);
    const textarea = textareaRef.current;
  if (textarea) {
    textarea.style.height = 'auto';
    // Set height based on scroll height
    textarea.style.height = `${textarea.scrollHeight}px`;
  }
  };

  // useEffect(() => {
    
  //     // Append transcript to current text area value without overwriting manually typed content
  //     setTextAreaValue((prevValue) => {
  //       // Determine the new part of the transcript since the last update
  //       const newTranscriptPart = transcript.text.substring(lastAppendedTranscript.length);
  //       // Update the last appended transcript state
  //       setLastAppendedTranscript(transcript.text);
  //       // Append only the new part of the transcript to prevent duplication
  //       return newTranscriptPart ? `${prevValue}${newTranscriptPart}`: prevValue;
  //     });
  //     const textarea = textareaRef.current;
  //     if (textarea) {
  //           textarea.style.height = 'auto';
  //           textarea.style.height = `${textarea.scrollHeight}px`;
  //         }

  //     // setTextAreaValue((prevValue) => `${prevValue} ${transcript}`);
  // }, [transcript.text]);

  useEffect(() => {
    const currentAnswer = currentQuestions[currentQuestionIndex]?.answer || '';
    setTextAreaValue(currentAnswer);
  }, [currentQuestionIndex, currentQuestions]);
  

  
  const handleSubmit = async () => {
    console.log(`Submitting answer for question ${currentQuestion.id}: ${currentQuestion.answer}`);
    const response = await new Promise(resolve => setTimeout(() => resolve({
      classification: 'Positive',
      justification: 'The answer is optimistic and forward-looking.'
    }), 1000)); // Simulate an API call

    // Update the state with the API response
    setApiResponse(response);
  };

  const resetingTranscript = () => {
    setTextAreaValue('');
    updateCurrentAnswer('');
  };

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return null;
  }

  let btn_class = buttonColor ? "record-button" : "redButton";
 
  if (showIntro) {
    return (  
      <div className="intro-page">
        <h1>Welcome to the Veteran Interview Preparation Application</h1>
        <p>This app will guide you through a series of questions to help prepare for your interview.</p>
        <button onClick={startInterview}>Start Interview Preparation</button>
      </div>
    );
  }

  return (
    <div className="app-container">
      <h1 className="app-title">NSF VetTrain</h1>
      <div className="question-container">
      <div className="question-number"> Question {currentQuestionIndex + 1} of {currentQuestions.length} </div>
        <div className="category">Category: {currentQuestion.category}</div>
        <div className="question">Question: {currentQuestion.question}</div>
        <textarea
        ref={textareaRef}
          value={textAreaValue}
          placeholder="Type your answer here"
          onChange={handleTextAreaChange}
          className="answer-input"
        />
        <div className="button-container">
          <button onClick={goToPreviousQuestion} className="next-button" disabled={currentQuestionIndex === 0}>
            Previous Question
          </button>
          <button onClick={goToNextQuestion} className="next-button">
            Next Question
          </button>
          <button onClick={startOver} className="start-over-button">Start Over</button>
          <button className={btn_class} onClick={onRecordingButton}>
            {isListening ? 'Stop Recording' : 'Record Answer'}
          </button>
          <button className="record-button" onClick={resetingTranscript}>Reset Answer</button>
          <button onClick={handleSubmit} className="submit-button">Submit</button>
        </div>
        {/* Displaying the API response */}
        {apiResponse.classification && (
          <div className="api-response">
            <div className="answer-api-response">Classification: {apiResponse.classification}</div>
            <div className="answer-api-response">Justification: {apiResponse.justification}</div>
          </div>
        )}
      </div>
    </div>
  );
}


export default App;