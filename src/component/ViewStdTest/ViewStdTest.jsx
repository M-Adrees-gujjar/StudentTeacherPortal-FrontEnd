import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function StudentExamList() {
  const [exams, setExams] = useState([]);
  const [open, setOpen] = useState(false);
  const [marks, setMarks] = useState({
    obtainMarks : 0,
    totalMarks : 0
  });

  const fetchExams = useCallback(() => {
    let token = localStorage.getItem("token");
    fetch("http://localhost:3000/stdGetExams", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: token }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setExams(res.response.exam);
        } else {
          alert("Failed to fetch exams.");
        }
      });
  }, []);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  function handleTestClick(exam) {
    const examData = JSON.stringify(exam);
    localStorage.setItem('currentExam', examData);
  }

  function handleViewResult(exam) {
    let obtainMarks = exam.test.testData[exam.test.testData.length-1];
    let totalMarks = exam.test.testData.length-1;
    setMarks( {...marks , 
      obtainMarks : obtainMarks.obtainMarks,
      totalMarks : totalMarks
    })
    setOpen(true);
    // localStorage.setItem('currentExam', examData);
  }

  return (
    <div className="max-w-screen-lg mx-auto p-6 my-10">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Upcoming Exams
        </h2>
        <p className="mt-2 text-lg leading-8 text-gray-600">
          Here are the exams you need to take.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {exams.map((paper,index) => (
          <div
            key={index}
            className="p-6 bg-white shadow-md rounded-lg transform transition duration-500 hover:scale-105 hover:shadow-xl"
          >
            <h3 className="text-xl font-semibold text-gray-900">{paper.test.exam}</h3>
            <p className="mt-2 text-gray-600">
              Time Allocation: {paper.test.time.hour}h {paper.test.time.minute}m
            </p>
            <div className="mt-4">
              {paper.test.testData.length === 0 ? (
                <Link 
                  to="/testpage" 
                  className="inline-block px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() => handleTestClick(paper)}
                >
                  Take Test
                </Link>
              ) : (
                <>
                <span className="inline-block px-4 py-2 text-sm font-medium text-green-600 bg-green-100 rounded">
                  Test Submitted
                </span>
                <Link 
                  to="#" 
                  className="inline-block px-4 py-2 text-sm font-medium rounded"
                  onClick={() => handleViewResult(paper)}
                >
                  <span className="text-blue-700 hover:border-b-blue-700 hover:border-b-2">View Result</span>
                </Link>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      <Transition show={open}>
      <Dialog className="relative z-10" onClose={() => setOpen(false)}>
        <Transition.Child
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                      <ExclamationTriangleIcon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                        Your Exam Result
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          You have obtained {marks.obtainMarks}/{marks.totalMarks}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                    onClick={() => setOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
    </div>

  );
}
