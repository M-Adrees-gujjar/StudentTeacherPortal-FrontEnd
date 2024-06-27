import { useRef, useState } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";

export default function TestCreation() {
  const formValue = useRef();
  const [open, setOpen] = useState(false);
  const [testOptions, setTestOptions] = useState([]);
  const [option, setOption] = useState([1, 2]);
  const [questionVal, setQuestionVal] = useState({ value: "", image: null });
  const [optionValues, setOptionValues] = useState(["", ""]);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);
  const [correctOptionIndex, setCorrectOptionIndex] = useState(null);

  let test = localStorage.getItem('test');
  let testValue = JSON.parse(test);
  function addOption() {
    setOption([...option, option.length + 1]);
    setOptionValues([...optionValues, ""]);
  }

  function deleteOption(index) {
    if (option.length > 2) {
      setOption(option.filter((_, i) => i !== index));
      setOptionValues(optionValues.filter((_, i) => i !== index));
      if (correctOptionIndex === index) setCorrectOptionIndex(null);
    } else {
      alert("Minimum of two options required.");
    }
  }

  function handleClick() {
    setOpen(true);
  }

  function addQuestion() {
    const optionArr = Array.from(formValue.current.children).map(
      (element) => element.firstChild.value
    );

    if (optionArr.includes("") || optionArr.length < 2) {
      alert("Fill all Options and ensure minimum of two options.");
      return;
    }

    if (correctOptionIndex === null) {
      alert("Select a correct option");
      return;
    }

    const newQuestion = {
      questionNumber: testOptions.length + 1,
      question: questionVal.value,
      image: questionVal.image,
      options: optionArr,
      correctOption: optionArr[correctOptionIndex], // Saving correct option text instead of index
    };

    if (editingQuestionIndex !== null) {
      testOptions[editingQuestionIndex] = newQuestion;
      setTestOptions([...testOptions]);
      setEditingQuestionIndex(null);
    } else {
      setTestOptions([...testOptions, newQuestion]);
    }

    setQuestionVal({ value: "", image: null });
    setOption([1, 2]);
    setOptionValues(["", ""]);
    setCorrectOptionIndex(null);
    setOpen(false);
  }

  function editQuestion(index) {
    const question = testOptions[index];
    setQuestionVal({ value: question.question, image: question.image });
    setOption(question.options.map((_, i) => i + 1));
    setOptionValues(question.options);
    setCorrectOptionIndex(question.options.indexOf(question.correctOption));
    setEditingQuestionIndex(index);
    setOpen(true);
  }

  function deleteQuestion(index) {
    setTestOptions(testOptions.filter((_, i) => i !== index));
  }

  function markAsCorrect(optionIndex) {
    setCorrectOptionIndex(optionIndex);
  }

  function handleImageUpload(e) {
    setQuestionVal({
      ...questionVal,
      image: URL.createObjectURL(e.target.files[0]),
    });
  }

  function submitPaper() {
    if (testOptions.length === 0) {
      alert("There is nothing to Save");
      return;
    }

    console.log("Array of Questions and MCQs with correct option:");
    console.log(testOptions);

    let test = localStorage.getItem("test");
    let test1 = JSON.parse(test);
    let token = localStorage.getItem("token");
    console.log("Test ---- ", test1._id);
    // Replace with actual API endpoint and payload
    // Example fetch request commented out for illustration
    fetch("http://localhost:3000/addTestData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
        test: test1,
        id: test1._id,
        testData: testOptions,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("FrontEnd Res of Exam ---", res);
        location.replace("/mainportal/addtest");
      });
  }

  return (
    <div>
      <div className="">
        <div className="lg:w-5/6 w-full m-auto my-6 lg:px-4 px-2 pb-5 border-b-2 border-gray-600">
          <div className=" flex justify-between align-middle ">
            <div className="flex flex-col gap-3">
              <h1 className="font-bold text-3xl">Make Test for Students</h1>
            </div>
            <div className="">
              <button
                onClick={submitPaper}
                type="text"
                className="bg-blue-600 rounded-sm w-36 px-2 py-2 text-white"
              >
                Save & Publish
              </button>
            </div>
          </div>
          <div className="">
            <div className="flex justify-between my-5 px-5 w-full">
              <h1 className="lg:font-bold font-semibold text-xl text-gray-600">
                Subject : {testValue.exam}
              </h1>
              <h1 className="lg:font-bold font-semibold text-xl text-gray-600">
                Time Allowed : {testValue.time.hour} hours : {testValue.time.minute} mints
              </h1>
            </div>
              <h1 className="text-center lg:font-bold font-semibold text-xl text-gray-600">
                Teacher Email : {testValue.tch_email}
              </h1>
          </div>
        </div>
        <div className="lg:w-5/6 w-full m-auto py-5 rounded-md shadow-2xl">
          <div className="flex justify-around">
            <h1 className="font-bold text-2xl">Preview Questions</h1>
            <button
              onClick={handleClick}
              type="text"
              className="bg-blue-600 rounded-sm w-36 px-2 py-2 text-white"
            >
              Add Question
            </button>
          </div>
          {testOptions.map((question, qIndex) => (
            <div
              className="my-6 lg:mx-4 mx-2 py-4 shadow-inner shadow-gray-800 rounded-md"
              key={qIndex}
            >
              <div className="flex justify-between mx-3">
                <h1 className="font-bold text-xl">
                  Q No #{question.questionNumber}
                </h1>
                <div className="flex gap-4">
                  <button
                    type="text"
                    className="w-24 h-8 border-blue-600 border-2 rounded-sm"
                    onClick={() => editQuestion(qIndex)}
                  >
                    Edit
                  </button>
                  <button
                    type="text"
                    className="w-24 h-8 bg-blue-600 rounded-sm text-white"
                    onClick={() => deleteQuestion(qIndex)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="">
                <h1 className="font-semibold text-xl ms-4 text-gray-600">
                  {question.question}
                </h1>
                {question.image && (
                  <div className="ms-8 my-2 pb-2 h-60 w-60">
                    <img
                      src={question.image}
                      alt="Question"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <ol className="list-[lower-alpha] list-inside ms-8 my-4 font-semibold text-gray-500 lg:w-4/6 w-5/6">
                  {question.options.map((option, oIndex) => (
                    <li
                      className={`p-2 border-b-2 border-gray-400 relative ${
                        question.correctOption === option ? "bg-green-100" : ""
                      }`}
                      key={oIndex}
                    >
                      <span className="">
                        <span>{option}</span>
                        {question.correctOption === option ? (
                          <span className="border-blue-600 border-2 w-fit rounded-sm text-end px-2 absolute right-0">
                            Correct
                          </span>
                        ) : (
                          <span></span>
                        )}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Transition show={open}>
        <Dialog className="relative z-10" onClose={() => setOpen(false)}>
          <TransitionChild
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </TransitionChild>
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <TransitionChild
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-lg lg:p-0 p-8">
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <DialogTitle
                          as="h3"
                          className="text-base font-semibold leading-6 text-gray-900"
                        >
                          Add New Question
                        </DialogTitle>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white px-4 sm:px-6">
                    <div className="gap-2 my-3">
                      <label
                        htmlFor="ques"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Question
                      </label>
                      <div className="mt-1">
                        <input
                          onChange={(e) =>
                            setQuestionVal({
                              ...questionVal,
                              value: e.target.value,
                            })
                          }
                          value={questionVal.value}
                          id="ques"
                          name="ques"
                          type="text"
                          autoComplete="ques"
                          placeholder="Enter Question"
                          className="block w-full rounded-md border-0 ps-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="image"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Upload Image
                      </label>
                      <div className="mt-1">
                        <input
                          onChange={handleImageUpload}
                          id="image"
                          name="image"
                          type="file"
                          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="options"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Enter Options
                      </label>
                    </div>
                    <div>
                      <ul className="list-disc ms-4" ref={formValue}>
                        {option.map((element, index) => (
                          <li className="mt-1 flex gap-2" key={index}>
                            <input
                              id="option"
                              name="option"
                              type="text"
                              value={optionValues[index]}
                              onChange={(e) =>
                                setOptionValues(
                                  optionValues.map((opt, i) =>
                                    i === index ? e.target.value : opt
                                  )
                                )
                              }
                              placeholder={`Option No ${element}`}
                              className="block w-4/6 rounded-md border-0 ps-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                            <button
                              onClick={() => deleteOption(index)}
                              type="button"
                              className="bg-blue-600 rounded-sm px-2 py-1 text-white text-xs w-1/6"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => markAsCorrect(index)}
                              type="button"
                              className={`rounded-sm text-xs px-1 py-1 w-1/6 ${
                                correctOptionIndex === index
                                  ? "bg-green-600"
                                  : "bg-blue-600"
                              } text-white`}
                            >
                              {correctOptionIndex === index
                                ? "Correct"
                                : "Mark as Correct"}
                            </button>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-1">
                        <button
                          onClick={addOption}
                          type="button"
                          className="block bg-blue-600 w-full rounded-md border-0 ps-4 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        >
                          Add Option
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                        onClick={addQuestion}
                      >
                        Save Question
                      </button>
                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
