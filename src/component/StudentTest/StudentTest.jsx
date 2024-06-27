import { useCallback, useEffect, useState } from "react";
export default function TestCreation() {
  const [question, setQuestion] = useState([]);

  const showExam = useCallback(()=>{
    fetch("http://localhost:3000/submit_exam", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        teacherEmail: "madreesgujjar522@gmail.com",
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        let obj = res.response.response;
        // let obj1 = [obj];
        // console.log("FrontEnd Show ---", obj1);
      setQuestion([...obj]);
        console.log("FrontEnd ques ---", question);
      });
  },[]);

  useEffect(() => {
    showExam();
  }, [showExam]);
  // showExam();
  // function showExam() {

  // }
  return (
    <div>
      <div className="">
        <div className="border-gray-600 border-b-2 flex justify-between align-middle lg:w-5/6 w-full m-auto my-6 lg:px-4 px-2 pb-5">
          <div className="flex flex-col gap-3">
            <h1 className="font-bold text-3xl">Make Test for Students</h1>
            <h1 className="lg:font-bold font-semibold text-xl text-gray-600">
              Subject : Mathematics
            </h1>
          </div>
        </div>
        <div className="lg:w-5/6 w-full m-auto py-5 rounded-md  shadow-2xl">
          <div className="flex justify-around">
            <h1 className="font-bold text-2xl text-center">
              Preview Questions
            </h1>
          </div>
          {question.map((element, index) => {
            <div
              className=" my-6 lg:mx-4 mx-2 py-4 shadow-inner shadow-gray-800 rounded-md"
              key={index}
            >
              <div className="flex justify-between mx-3">
                <h1 className="font-bold text-xl">
                  Q No # {element.questionNo}
                </h1>
              </div>
              <div className="">
                <h1 className="font-semibold text-xl ms-4 text-gray-600">
                  {"element.question"}
                </h1>
                <ol className="list-[lower-alpha] list-inside ms-8 my-4 font-semibold text-gray-500 lg:w-4/6 w-5/6">
                  <div className="flex gap-3">
                    <input type="radio" id="one" />
                    <label
                      htmlFor="one"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Password
                    </label>
                  </div>
                  <div className="flex gap-3">
                    <input type="radio" id="three" />
                    <label
                      htmlFor="three"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      name
                    </label>
                  </div>
                  <div className="flex gap-3">
                    <input type="radio" id="two" />
                    <label
                      htmlFor="two"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Email
                    </label>
                  </div>
                </ol>
              </div>
            </div>;
          })}

          <div className="flex gap-4 justify-end mx-6">
            <button
              type="text"
              className="w-24 h-8 border-blue-600 border-2 rounded-sm "
            >
              Previous
            </button>
            <button
              type="text"
              className="w-24 h-8 bg-blue-600 rounded-sm text-white"
            >
              Next
            </button>
          </div>
          {/* {testOptions.map((element, index) => (
            <div
              className=" my-6 lg:mx-4 mx-2 py-4 shadow-inner shadow-gray-800 rounded-md"
              key={index}
            >
              <div className="flex justify-between mx-3">
                <h1 className="font-bold text-xl">
                  Q No # {element.questionNo}
                </h1>

                <div className="flex gap-4">
                  <button
                    type="text"
                    className="w-24 h-8 border-blue-600 border-2 rounded-sm "
                  >
                    Edit
                  </button>
                  <button
                    type="text"
                    className="w-24 h-8 bg-blue-600 rounded-sm text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="">
                <h1 className="font-semibold text-xl ms-4 text-gray-600">
                  {element.question}
                </h1>
                <ol className="list-[lower-alpha] list-inside ms-8 my-4 font-semibold text-gray-500 lg:w-4/6 w-5/6">
                  {element.options.map((element, index) => (
                    <li
                      className="p-2 border-b-2 border-gray-400 relative"
                      key={index}
                    >
                      <span className=" ">
                        <span>{element}</span>
                        <span className=" border-blue-600 border-2 w-fit rounded-sm text-end px-2 absolute right-0">
                          Mark as Correct
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ))} */}
        </div>
      </div>
    </div>
  );
}
