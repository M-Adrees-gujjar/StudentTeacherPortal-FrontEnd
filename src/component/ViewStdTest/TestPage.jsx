import { useState, useEffect, useCallback } from "react";
import "./TestPage.css"; // Assuming you have a CSS file for styles

const useExamData = (numberOfQuestions = 5) => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const currentExam = localStorage.getItem("currentExam");
    if (currentExam) {
      const objCurrentExam = JSON.parse(currentExam);
      const randomizedQuestions = getRandomizedQuestions(objCurrentExam.examData || [], numberOfQuestions);
      setQuestions(randomizedQuestions);
    }
  }, [numberOfQuestions]);

  return questions;
};

const getRandomizedQuestions = (questions, numberOfQuestions) => {
  const shuffledQuestions = questions.sort(() => 0.5 - Math.random());
  const selectedQuestions = shuffledQuestions.slice(0, numberOfQuestions);
  
  return selectedQuestions.map(question => ({
    ...question,
    options: question.options.sort(() => 0.5 - Math.random())
  }));
};

const FULLSCREEN_OPTIONS = [
  "requestFullscreen",
  "mozRequestFullScreen",
  "webkitRequestFullscreen",
  "msRequestFullscreen",
];

const EXIT_FULLSCREEN_OPTIONS = [
  "exitFullscreen",
  "webkitExitFullscreen",
  "mozCancelFullScreen",
  "msExitFullscreen",
];

const TestPage = () => {
  let examVal = localStorage.getItem("currentExam");
    let val = JSON.parse(examVal);
  const numberOfQuestions = val.test.students; // Specify the number of questions to display
  console.log("Numer --- ",val.test.students);
  const questions = useExamData(numberOfQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [attempted, setAttempted] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  const [fullscreen, setFullscreen] = useState(false);

  const requestFullscreen = () => {
    const docElement = document.documentElement;
    for (const method of FULLSCREEN_OPTIONS) {
      if (docElement[method]) {
        docElement[method]();
        setFullscreen(true);
        break;
      }
    }
  };

  const exitFullscreen = () => {
    for (const method of EXIT_FULLSCREEN_OPTIONS) {
      if (document[method]) {
        document[method]();
        setFullscreen(false);
        break;
      }
    }
  };

  const startTest = () => {
    let examTime = localStorage.getItem("currentExam");
    let timeValue = JSON.parse(examTime);
    let time = timeValue.test.time;
    let hour = time.hour;
    let minute = time.minute;
    let minutes = hour * 60 + minute;
    let seconds = minutes * 60;

    setIsTestStarted(true);
    setTimeRemaining(seconds);
    startTimer();
    requestFullscreen();
  };

  const startTimer = () => {
    const interval = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 0) {
          submitTest();
          clearInterval(interval);
        }
        return prevTime - 1;
      });
    }, 1000);
    setTimerInterval(interval);
  };

  const handleAnswerSelect = (selectedAnswer) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [currentQuestionIndex]: selectedAnswer,
    }));

    setAttempted(Object.keys(userAnswers).length + 1);
  };

  const submitTest = useCallback(() => {
    clearInterval(timerInterval);
    setIsTestStarted(false);
    exitFullscreen();
    let obtainMarks = 0;
    const results = questions.map((question, index) => {
      const userAnswer = userAnswers[index];
      const correct = userAnswer === question.correctOption;
      if (correct) {
        obtainMarks++;
      }
      return {
        question: question.question,
        userAnswer: userAnswer || "Not answered",
        correctAnswer: question.correctOption,
        correct,
      };
    });
    results.push({
      obtainMarks,
    });
    let totalMarks = results.length - 1;
    console.log("Percentage Results:", obtainMarks, "/", totalMarks);
    console.log("Test Results:", results);
    const correctCount = results.filter((result) => result.correct).length;
    alert(`Test submitted successfully! Correct Answers: ${correctCount}`);

    let token = localStorage.getItem("token");
    let examID = localStorage.getItem("currentExam");
    let idValue = JSON.parse(examID);
    let id = idValue.test._id;
    fetch("http://localhost:3000/stdAddExams", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
        id: id,
        data: results,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          location.replace("//stdmainportal/viewstdtest");
        } else {
          alert("Submission failed.");
        }
      });
  }, [questions, userAnswers, timerInterval]);

  useEffect(() => {
    if (isTestStarted && fullscreen) {
      const handleFullscreenChange = () => {
        if (!document.fullscreenElement) {
          requestFullscreen();
        }
      };
      document.addEventListener("fullscreenchange", handleFullscreenChange);

      return () => {
        document.removeEventListener("fullscreenchange", handleFullscreenChange);
      };
    }
  }, [isTestStarted, fullscreen]);

  useEffect(() => {
    return () => {
      clearInterval(timerInterval);
    };
  }, [timerInterval]);

  // Disable right-click context menu
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
    };
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  return (
    <div className="max-w-screen-lg mx-auto p-6 my-10" id="mainTestPage">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Test Page
        </h2>
        {!isTestStarted ? (
          <>
            <div>
              <p className="text-justify my-9">
                During the online exam, ensure your computer, webcam, and
                microphone are functioning properly, and use a stable internet
                connection with an updated browser. Choose a quiet, well-lit,
                and distraction-free environment, and have your student ID and
                any allowed materials ready. The exam will begin in full-screen
                mode, and you must not exit this mode until the exam is
                submitted. Switching tabs, minimizing the browser, or navigating
                away from the exam is strictly prohibited and will be monitored.
                Do not open new tabs, windows, or applications, and avoid using
                any external devices like phones or tablets. Copying text,
                taking screenshots, screen recordings, or printing any part of
                the exam is also not allowed. Read each question carefully and
                select your answers directly on the exam interface.
              </p>
            </div>
            <button
              onClick={startTest}
              className="mt-4 inline-block px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Start Test
            </button>
          </>
        ) : (
          <div className="mt-4">
            <div className="flex justify-between">
              <p className="text-xl font-bold bg-gray-700 py-2 px-3 rounded-md text-white">
                <span className="">Timer</span>:{" "}
                {Math.floor(timeRemaining / 360000)}:
                {Math.floor((timeRemaining % 3600) / 60) < 10
                  ? `0${Math.floor((timeRemaining % 3600) / 60)}`
                  : Math.floor((timeRemaining % 3600) / 60)}
                :
                {timeRemaining % 60 < 10
                  ? `0${timeRemaining % 60}`
                  : timeRemaining % 60}{" "}
                <span>Hrs</span>
              </p>
              <div className="text-xl font-bold bg-gray-700 py-2 px-3 rounded-md text-white">
                <span>
                  Attempted: {attempted} / {questions.length}
                </span>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mt-4">
              {questions[currentQuestionIndex].question}
            </h3>
            <div className="mt-2 space-y-2">
              {questions[currentQuestionIndex].options.map((option, index) => (
                <button
                  key={index}
                  className={`w-full text-left p-2 border rounded ${
                    userAnswers[currentQuestionIndex] === option
                      ? "bg-yellow-200"
                      : "bg-white"
                  }`}
                  onClick={() => handleAnswerSelect(option)}
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="mt-4 space-x-4">
              {currentQuestionIndex > 0 && (
                <button
                  onClick={() =>
                    setCurrentQuestionIndex(currentQuestionIndex - 1)
                  }
                  className="inline-block px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded hover:bg-gray-700"
                >
                  Previous
                </button>
              )}
              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  onClick={() =>
                    setCurrentQuestionIndex(currentQuestionIndex + 1)
                  }
                  className="inline-block px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded hover:bg-gray-700"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={submitTest}
                  className="inline-block px-4 py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700"
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestPage;






















// import { useState, useEffect, useCallback } from "react";
// import "./TestPage.css"; // Assuming you have a CSS file for styles

// const useExamData = () => {
//   const [questions, setQuestions] = useState([]);

//   useEffect(() => {
//     const currentExam = localStorage.getItem("currentExam");
//     if (currentExam) {
//       const objCurrentExam = JSON.parse(currentExam);
//       setQuestions(objCurrentExam.examData || []);
//     }
//   }, []);

//   return questions;
// };

// const FULLSCREEN_OPTIONS = [
//   "requestFullscreen",
//   "mozRequestFullScreen",
//   "webkitRequestFullscreen",
//   "msRequestFullscreen",
// ];

// const EXIT_FULLSCREEN_OPTIONS = [
//   "exitFullscreen",
//   "webkitExitFullscreen",
//   "mozCancelFullScreen",
//   "msExitFullscreen",
// ];

// const TestPage = () => {
//   const questions = useExamData();
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [isTestStarted, setIsTestStarted] = useState(false);
//   const [timeRemaining, setTimeRemaining] = useState(0);
//   const [userAnswers, setUserAnswers] = useState({});
//   const [attempted, setAttempted] = useState(0);
//   const [timerInterval, setTimerInterval] = useState(null);
//   const [fullscreen, setFullscreen] = useState(false);

//   const requestFullscreen = () => {
//     const docElement = document.documentElement;
//     for (const method of FULLSCREEN_OPTIONS) {
//       if (docElement[method]) {
//         docElement[method]();
//         setFullscreen(true);
//         break;
//       }
//     }
//   };

//   const exitFullscreen = () => {
//     for (const method of EXIT_FULLSCREEN_OPTIONS) {
//       if (document[method]) {
//         document[method]();
//         setFullscreen(false);
//         break;
//       }
//     }
//   };

//   const startTest = () => {
//     let examTime = localStorage.getItem("currentExam");
//     let timeValue = JSON.parse(examTime);
//     let time = timeValue.test.time;
//     let hour = time.hour;
//     let minute = time.minute;
//     let minutes = hour * 60 + minute;
//     let seconds = minutes * 60;

//     setIsTestStarted(true);
//     setTimeRemaining(seconds); // 10 minutes in seconds
//     startTimer();
//     requestFullscreen();
//   };

//   const startTimer = () => {
//     const interval = setInterval(() => {
//       setTimeRemaining((prevTime) => {
//         if (prevTime <= 0) {
//           submitTest();
//           clearInterval(interval);
//         }
//         return prevTime - 1;
//       });
//     }, 1000);
//     setTimerInterval(interval);
//   };

//   const handleAnswerSelect = (selectedAnswer) => {
//     setUserAnswers((prevAnswers) => ({
//       ...prevAnswers,
//       [currentQuestionIndex]: selectedAnswer,
//     }));

//     setAttempted(Object.keys(userAnswers).length + 1);
//   };

//   const submitTest = useCallback(() => {
//     clearInterval(timerInterval);
//     setIsTestStarted(false);
//     exitFullscreen();
//     let obtainMarks = 0;
//     const results = questions.map((question, index) => {
//       const userAnswer = userAnswers[index];
//       const correct = userAnswer === question.correctOption;
//       if (correct) {
//         obtainMarks++;
//       }
//       return {
//         question: question.question,
//         userAnswer: userAnswer || "Not answered",
//         correctAnswer: question.correctOption,
//         correct,
//       };
//     });
//     results.push({
//       obtainMarks,
//     });
//     let totalMarks = results.length - 1;
//     console.log("Percentage Results:", obtainMarks, "/", totalMarks);
//     console.log("Test Results:", results);
//     const correctCount = results.filter((result) => result.correct).length;
//     alert(`Test submitted successfully! Correct Answers: ${correctCount}`);

//     let token = localStorage.getItem("token");
//     let examID = localStorage.getItem("currentExam");
//     let idValue = JSON.parse(examID);
//     let id = idValue.test._id;
//     fetch("http://localhost:3000/stdAddExams", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         token: token,
//         id: id,
//         data: results,
//       }),
//     })
//       .then((res) => res.json())
//       .then((res) => {
//         if (res.success) {
//           // Handle success
//           location.replace("//stdmainportal/viewstdtest");
//         } else {
//           alert("Submission failed.");
//         }
//       });
//   }, [questions, userAnswers, timerInterval]);

//   useEffect(() => {
//     if (isTestStarted && fullscreen) {
//       const handleFullscreenChange = () => {
//         if (!document.fullscreenElement) {
//           requestFullscreen();
//         }
//       };
//       document.addEventListener("fullscreenchange", handleFullscreenChange);

//       return () => {
//         document.removeEventListener(
//           "fullscreenchange",
//           handleFullscreenChange
//         );
//       };
//     }
//   }, [isTestStarted, fullscreen]);

//   useEffect(() => {
//     return () => {
//       clearInterval(timerInterval);
//     };
//   }, [timerInterval]);

//   // Disable right-click context menu
//   useEffect(() => {
//     const handleContextMenu = (e) => {
//       e.preventDefault();
//     };
//     document.addEventListener("contextmenu", handleContextMenu);

//     return () => {
//       document.removeEventListener("contextmenu", handleContextMenu);
//     };
//   }, []);

//   return (
//     <div className="max-w-screen-lg mx-auto p-6 my-10" id="mainTestPage">
//       <div className="mx-auto max-w-2xl text-center">
//         <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
//           Test Page
//         </h2>
//         {!isTestStarted ? (
//           <>
//             <div>
//               <p className="text-justify my-9">
//                 During the online exam, ensure your computer, webcam, and
//                 microphone are functioning properly, and use a stable internet
//                 connection with an updated browser. Choose a quiet, well-lit,
//                 and distraction-free environment, and have your student ID and
//                 any allowed materials ready. The exam will begin in full-screen
//                 mode, and you must not exit this mode until the exam is
//                 submitted. Switching tabs, minimizing the browser, or navigating
//                 away from the exam is strictly prohibited and will be monitored.
//                 Do not open new tabs, windows, or applications, and avoid using
//                 any external devices like phones or tablets. Copying text,
//                 taking screenshots, screen recordings, or printing any part of
//                 the exam is also not allowed. Read each question carefully and
//                 select your answers directly on the exam interface.
//               </p>
//             </div>
//             <button
//               onClick={startTest}
//               className="mt-4 inline-block px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               Start Test
//             </button>
//           </>
//         ) : (
//           <div className="mt-4">
//             <div className="flex justify-between">
//               <p className="text-xl font-bold bg-gray-700 py-2 px-3 rounded-md text-white">
//                 <span className="">Timer</span>:{" "}
//                 {Math.floor(timeRemaining / 360000)}:
//                 {Math.floor((timeRemaining % 3600) / 60) < 10
//                   ? `0${Math.floor((timeRemaining % 3600) / 60)}`
//                   : Math.floor((timeRemaining % 3600) / 60)}
//                 :
//                 {timeRemaining % 60 < 10
//                   ? `0${timeRemaining % 60}`
//                   : timeRemaining % 60}{" "}
//                 <span>Hrs</span>
//               </p>
//               <div className="text-xl font-bold bg-gray-700 py-2 px-3 rounded-md text-white">
//                 <span>
//                   Attempted: {attempted} / {questions.length}
//                 </span>
//               </div>
//             </div>
//             <h3 className="text-xl font-semibold text-gray-900 mt-4">
//               {questions[currentQuestionIndex].question}
//             </h3>
//             <div className="mt-2 space-y-2">
//               {questions[currentQuestionIndex].options.map((option, index) => (
//                 <button
//                   key={index}
//                   className={`w-full text-left p-2 border rounded ${
//                     userAnswers[currentQuestionIndex] === option
//                       ? "bg-yellow-200"
//                       : "bg-white"
//                   }`}
//                   onClick={() => handleAnswerSelect(option)}
//                 >
//                   {option}
//                 </button>
//               ))}
//             </div>
//             <div className="mt-4 space-x-4">
//               {currentQuestionIndex > 0 && (
//                 <button
//                   onClick={() =>
//                     setCurrentQuestionIndex(currentQuestionIndex - 1)
//                   }
//                   className="inline-block px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded hover:bg-gray-700"
//                 >
//                   Previous
//                 </button>
//               )}
//               {currentQuestionIndex < questions.length - 1 ? (
//                 <button
//                   onClick={() =>
//                     setCurrentQuestionIndex(currentQuestionIndex + 1)
//                   }
//                   className="inline-block px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded hover:bg-gray-700"
//                 >
//                   Next
//                 </button>
//               ) : (
//                 <button
//                   onClick={submitTest}
//                   className="inline-block px-4 py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700"
//                 >
//                   Submit
//                 </button>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TestPage;








// import { useState, useEffect, useCallback } from "react";

// const useExamData = () => {
//   const [questions, setQuestions] = useState([]);

//   useEffect(() => {
//     const currentExam = localStorage.getItem("currentExam");
//     if (currentExam) {
//       const objCurrentExam = JSON.parse(currentExam);
//       setQuestions(objCurrentExam.examData || []);
//     }
//   }, []);

//   return questions;
// };

// const FULLSCREEN_OPTIONS = [
//   "requestFullscreen",
//   "mozRequestFullScreen",
//   "webkitRequestFullscreen",
//   "msRequestFullscreen",
// ];

// const EXIT_FULLSCREEN_OPTIONS = [
//   "exitFullscreen",
//   "webkitExitFullscreen",
//   "mozCancelFullScreen",
//   "msExitFullscreen",
// ];

// const TestPage = () => {
//   const questions = useExamData();
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [isTestStarted, setIsTestStarted] = useState(false);
//   const [timeRemaining, setTimeRemaining] = useState(0);
//   const [userAnswers, setUserAnswers] = useState({});
//   const [attempted, setAttempted] = useState(0);
//   const [timerInterval, setTimerInterval] = useState(null);
//   const [fullscreen, setFullscreen] = useState(false);

//   const requestFullscreen = () => {
//     const docElement = document.documentElement;
//     for (const method of FULLSCREEN_OPTIONS) {
//       if (docElement[method]) {
//         docElement[method]();
//         setFullscreen(true);
//         break;
//       }
//     }
//   };

//   const exitFullscreen = () => {
//     for (const method of EXIT_FULLSCREEN_OPTIONS) {
//       if (document[method]) {
//         document[method]();
//         setFullscreen(false);
//         break;
//       }
//     }
//   };

//   const startTest = () => {
//     let examTime = localStorage.getItem("currentExam");
//     let timeValue = JSON.parse(examTime);
//     let time = timeValue.test.time;
//     let hour = time.hour;
//     let minute = time.minute;
//     let minutes = hour * 60 + minute;
//     let seconds = minutes * 60;

//     setIsTestStarted(true);
//     setTimeRemaining(seconds); // 10 minutes in seconds
//     startTimer();
//     requestFullscreen();
//   };

//   const startTimer = () => {
//     const interval = setInterval(() => {
//       setTimeRemaining((prevTime) => {
//         if (prevTime <= 0) {
//           submitTest();
//           clearInterval(interval);
//         }
//         return prevTime - 1;
//       });
//     }, 1000);
//     setTimerInterval(interval);
//   };

//   const handleAnswerSelect = (selectedAnswer) => {
//     setUserAnswers((prevAnswers) => ({
//       ...prevAnswers,
//       [currentQuestionIndex]: selectedAnswer,
//     }));

//     setAttempted(Object.keys(userAnswers).length + 1);
//   };

//   const submitTest = useCallback(() => {
//     clearInterval(timerInterval);
//     setIsTestStarted(false);
//     exitFullscreen();
//     let obtainMarks = 0;
//     const results = questions.map((question, index) => {
//       const userAnswer = userAnswers[index];
//       const correct = userAnswer === question.correctOption;
//       if (correct) {
//         obtainMarks++;
//       }
//       return {
//         question: question.question,
//         userAnswer: userAnswer || "Not answered",
//         correctAnswer: question.correctOption,
//         correct,
//       };
//     });
//     results.push({
//       obtainMarks,
//     });
//     let totalMarks = results.length - 1;
//     console.log("Percentage Results:", obtainMarks, "/", totalMarks);
//     console.log("Test Results:", results);
//     const correctCount = results.filter((result) => result.correct).length;
//     alert(`Test submitted successfully! Correct Answers: ${correctCount}`);

//     let token = localStorage.getItem("token");
//     let examID = localStorage.getItem("currentExam");
//     let idValue = JSON.parse(examID);
//     let id = idValue.test._id;
//     fetch("http://localhost:3000/stdAddExams", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         token: token,
//         id: id,
//         data: results,
//       }),
//     })
//       .then((res) => res.json())
//       .then((res) => {
//         if (res.success) {
//           // Handle success
//           location.replace("//stdmainportal/viewstdtest");
//         } else {
//           alert("Submission failed.");
//         }
//       });
//   }, [questions, userAnswers, timerInterval]);

//   useEffect(() => {
//     if (isTestStarted && fullscreen) {
//       const handleFullscreenChange = () => {
//         if (!document.fullscreenElement) {
//           requestFullscreen();
//         }
//       };
//       document.addEventListener("fullscreenchange", handleFullscreenChange);

//       return () => {
//         document.removeEventListener(
//           "fullscreenchange",
//           handleFullscreenChange
//         );
//       };
//     }
//   }, [isTestStarted, fullscreen]);

//   useEffect(() => {
//     return () => {
//       clearInterval(timerInterval);
//     };
//   }, [timerInterval]);

//   return (
//     <div className="max-w-screen-lg mx-auto p-6 my-10">
//       <div className="mx-auto max-w-2xl text-center">
//         <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
//           Test Page
//         </h2>
//         {!isTestStarted ? (
//           <>
//             <div>
//               <p className="text-justify my-9">
//                 During the online exam, ensure your computer, webcam, and
//                 microphone are functioning properly, and use a stable internet
//                 connection with an updated browser. Choose a quiet, well-lit,
//                 and distraction-free environment, and have your student ID and
//                 any allowed materials ready. The exam will begin in full-screen
//                 mode, and you must not exit this mode until the exam is
//                 submitted. Switching tabs, minimizing the browser, or navigating
//                 away from the exam is strictly prohibited and will be monitored.
//                 Do not open new tabs, windows, or applications, and avoid using
//                 any external devices like phones or tablets. Copying text,
//                 taking screenshots, screen recordings, or printing any part of
//                 the exam is also not allowed. Read each question carefully and
//                 select your answers directly on the exam interface.
//               </p>
//             </div>
//             <button
//               onClick={startTest}
//               className="mt-4 inline-block px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               Start Test
//             </button>
//           </>
//         ) : (
//           <div className="mt-4">
//             <div className="flex justify-between">
//               <p className="text-xl font-bold bg-gray-700 py-2 px-3 rounded-md text-white">
//                 <span className="">Timer</span>:{" "}
//                 {Math.floor(timeRemaining / 360000)}:
//                 {Math.floor((timeRemaining % 3600) / 60) < 10
//                   ? `0${Math.floor((timeRemaining % 3600) / 60)}`
//                   : Math.floor((timeRemaining % 3600) / 60)}
//                 :
//                 {timeRemaining % 60 < 10
//                   ? `0${timeRemaining % 60}`
//                   : timeRemaining % 60}{" "}
//                 <span>Hrs</span>
//               </p>
//               <div className="text-xl font-bold bg-gray-700 py-2 px-3 rounded-md text-white">
//                 <span>
//                   Attempted: {attempted} / {questions.length}
//                 </span>
//               </div>
//             </div>
//             <h3 className="text-xl font-semibold text-gray-900 mt-4">
//               {questions[currentQuestionIndex].question}
//             </h3>
//             <div className="mt-2 space-y-2">
//               {questions[currentQuestionIndex].options.map((option, index) => (
//                 <button
//                   key={index}
//                   className={`w-full text-left p-2 border rounded ${
//                     userAnswers[currentQuestionIndex] === option
//                       ? "bg-yellow-200"
//                       : "bg-white"
//                   }`}
//                   onClick={() => handleAnswerSelect(option)}
//                 >
//                   {option}
//                 </button>
//               ))}
//             </div>
//             <div className="mt-4 space-x-4">
//               {currentQuestionIndex > 0 && (
//                 <button
//                   onClick={() =>
//                     setCurrentQuestionIndex(currentQuestionIndex - 1)
//                   }
//                   className="inline-block px-4 py-2 text-sm font-medium text-gray-900 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
//                 >
//                   Previous
//                 </button>
//               )}
//               {currentQuestionIndex < questions.length - 1 && (
//                 <>
//                   <button
//                     onClick={() =>
//                       setCurrentQuestionIndex(currentQuestionIndex + 1)
//                     }
//                     className="inline-block px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     Next
//                   </button>
//                   <button
//                     onClick={() =>
//                       setCurrentQuestionIndex(currentQuestionIndex + 1)
//                     }
//                     className="inline-block px-4 py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
//                   >
//                     Skip
//                   </button>
//                 </>
//               )}
//             </div>
//             <div className="mt-4">
//               <button
//                 onClick={submitTest}
//                 className="inline-block px-6 py-3 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
//               >
//                 Submit Test
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TestPage;
