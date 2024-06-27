import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";

const DemoTable = () => {
  const [products, setProducts] = useState([]);
  const [paper, setPaper] = useState([]);
  const [open, setOpen] = useState(false);

  const findStudentExam = useCallback(() => {
    let token = localStorage.getItem("token");
    let examID = localStorage.getItem("examID");
    const id = examID;
    fetch("http://localhost:3000/find_student", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          console.log("Response --- ", res.response);
          // setProducts(res.response);
          let examArray = [];
          res.response.map((mainElement) => {
            mainElement.exam.map((element) => {
              if (element.test._id == id) {
                console.log("Element --- ", element.test.testData);
                let obj = {
                  name: mainElement.name,
                  email: mainElement.email,
                  marks:
                    element.test.testData[element.test.testData.length - 1],
                  submitData: element.test.testData,
                };
                examArray.push(obj);
              } else {
                return;
              }
            });
          });
          setProducts([...examArray]);
          console.log("resultResponse --- ", examArray);
        } else {
          alert("Wrong.......");
        }
      });
  }, []);

  useEffect(() => {
    findStudentExam();
  }, [findStudentExam]);

  // const createTest = (product) => {
  //   console.log("Create Test for:", product);
  // };

  // const viewResult = (product) => {
  //   console.log("View Result for:", product);
  // };

  function handleEachStdResult(param) {
    console.log("handleEachStdResult ---- ", param);
    setOpen(true);
    setPaper([...param]);
  }

  return (
    <div className="w-11/12 m-auto">
      <div className="">
        <h1 className="text-4xl font-semibold text-center my-10">
          Result Details
        </h1>
      </div>
      <table className="w-full text-sm text-left text-gray-900">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">
              Student Name
            </th>
            <th scope="col" className="px-6 py-3">
              Student Email
            </th>
            <th scope="col" className="px-6 py-3">
              Obtained Marks
            </th>
            <th scope="col" className="px-6 py-3">
              Test Status
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr
              key={index}
              className={`${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              } border-b`}
            >
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
              >
                {product.name}
              </th>
              <td className="px-6 py-4">{product.email}</td>
              <td className="px-6 py-4">
                {product.marks == undefined ? (
                  <p
                    to="#"
                    className="text-red-600"
                    // onClick={() => createTest(product)}
                  >
                    {"Not Submitted"}
                  </p>
                ) : (
                  <p
                    to="#"
                    className="text-green-600 "
                    // onClick={() => viewResult(product)}
                  >
                    {product.marks.obtainMarks}
                  </p>
                )}
              </td>
              <td className="px-6 py-4">
                {console.log("--DataMarks--", product.submitData)}
                {product.submitData.length == 0 ? (
                  <p to="#" className="text-blue-600">
                    Nothing to Show
                  </p>
                ) : (
                  <Link
                    to="#"
                    className="text-green-600 "
                    onClick={() => handleEachStdResult(product.submitData)}
                  >
                    View Result
                  </Link>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Transition show={open}>
        <Dialog className="relative z-10" onClose={setOpen}>
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
                <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-full mx-10">
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10"></div>
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <DialogTitle
                          as="h3"
                          className="text-base font-semibold leading-6 text-gray-900"
                        >
                          All Question details
                        </DialogTitle>
                      </div>
                    </div>
                  </div>
                  <table className="w-full text-sm text-left text-gray-900">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-nowrap">
                          Question heading
                        </th>
                        <th scope="col" className="px-6 py-3">
                          UserAnswer
                        </th>
                        <th scope="col" className=" px-6 py-3">
                          Correct Answer
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Question Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paper.map((product, index) => (
                        <tr
                          key={index}
                          className={`${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          } border-b`}
                        >
                          <th
                            scope="row"
                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                          >
                            {product.question}
                          </th>
                          <td className="px-6 py-4">{product.userAnswer}</td>
                          <td className="px-6 py-4">{product.correctAnswer}</td>
                          <td>
                            {index < paper.length - 1 ? (
                              product.correct ? (
                                <p className=" text-green-700">
                                  Right
                                </p>
                              ) : (
                                <p className=" text-red-700">
                                  Wrong
                                </p>
                              )
                            ) : (
                              ''
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default DemoTable;
