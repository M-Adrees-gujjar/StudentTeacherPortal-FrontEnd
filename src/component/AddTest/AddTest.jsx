import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { useCallback, useEffect, useState } from "react";

export default function ProductTable() {
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [globalIndex, setGlobalIndex] = useState("");

  const [val, setVal] = useState({
    exam: "",
    hour: "",
    minute: "",
    students: "",
  });

  function addExam() {
    console.log("Exam --- ", val);
    if (globalIndex) {
      fetch("http://localhost:3000/updateExam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: globalIndex,
          exam: val.exam,
          time: {
            hour: val.hour,
            minute: val.minute,
          },
          students: val.students,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          console.log("res----form ------", res);
          setGlobalIndex("");
        });
      setOpen(false);
      findStudent();
    } else {
      let token = localStorage.getItem("token");
      fetch("http://localhost:3000/addExam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          exam: val.exam,
          time: {
            hour: val.hour,
            minute: val.minute,
          },
          students: val.students,
          token: token,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          console.log("res----form ------", res);
        });
      setOpen(false);
      findStudent();
    }
  }

  const findStudent = useCallback(() => {
    let token = localStorage.getItem("token");
    fetch("http://localhost:3000/findExam", {
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
          setProducts(res.response);
        } else {
          alert("Wrong.......");
        }
      });
  }, []);

  useEffect(() => {
    findStudent();
  }, [findStudent]);

  function deleteStudent(id) {
    fetch("http://localhost:3000/deleteExam", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        element: id,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          findStudent();
        } else {
          alert("Wrong.......");
        }
      });
  }

  function updateStudent(id) {
    setOpen(true);
    let value = products.filter((element) => {
      return element._id == id;
    });
    const obj = value[0];
    let obj1 = {
      exam: obj.exam,
      hour: obj.time.hour,
      minute: obj.time.minute,
      students: obj.students,
    };
    setVal(obj1);
    console.log("obj --- ", val);
    setGlobalIndex(id);
    console.log("--- id - globalInd-- ", globalIndex, "---", id);
  }


  function createTeset(obj) {
    let obj1 = JSON.stringify(obj);
    console.log("ID -------- ",obj1);
    localStorage.setItem('test',obj1)
  } 

  function viewResult(obj) {
    console.log("viewResult -------- ",obj._id);
    localStorage.setItem("examID",obj._id);
  } 


  return (
    <>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white max-w-screen-lg m-auto flex flex-col gap-10 p-6 my-10">
        <div className="flex lg:flex-row flex-col justify-between">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Add New Exam 
            </h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              First you have to add Exam and their respective Exam details
            </p>
          </div>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <button
              onClick={() => setOpen(true)}
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Add Exam
            </button>
          </div>
        </div>
        <div className="flex justify-center">
                  <Link to="/tabel" className="text-blue-600 border-blue-400 border-2 rounded-md px-4 py-1 font-semibold">
                  Add Students
                  </Link>
        </div>
        <table className="w-full text-sm text-left text-gray-900">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                Exam Name
              </th>
              <th scope="col" className="px-6 py-3">
                Time Allocation
              </th>
              <th scope="col" className="px-6 py-3">
                Allowed Questions
              </th>
              <th scope="col" className="px-6 py-3 ">
                Test Status
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr
              key={product._id}
              className={`${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              } border-b`}
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  {product.exam}
                </th>
                <td className="px-6 py-4">
                  {product.time.hour + " : " + product.time.minute}
                </td>
                <td className="px-6 py-4 ">{product.students}</td>
                <td className="px-6 py-4">
                  {
                    product.testData.length===0  ? (
                      <Link to="/testcreation" className="text-blue-600 hover:border-b-2 hover:border-blue-400" onClick={
                        ()=>createTeset(product)
                      }>
                      Create Test
                      </Link>
                    ): (
                      <Link to="/stdresult" className="text-green-600 hover:border-b-2 hover:border-green-900" onClick={
                        ()=>viewResult(product)
                      }>
                      View Result
                      </Link>
                    )
                  }
                </td>
                <td className="px-6 py-4 flex gap-5">
                  <button
                    onClick={() => updateStudent(product._id)}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </button>
                  <button
                    onClick={() => deleteStudent(product._id)}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
                <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-lg lg:p-0 p-8">
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <DialogTitle
                          as="h3"
                          className="text-base font-semibold leading-6 text-gray-900"
                        >
                          Add Your Exam Details
                        </DialogTitle>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <form className="space-y-6 w-full" method="POST">
                      <div>
                        <label
                          htmlFor="exam"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Exam Name
                        </label>
                        <div className="mt-1">
                          <input
                            onChange={(e) =>
                              setVal({ ...val, exam: e.target.value })
                            }
                            value={val.exam}
                            id="exam"
                            name="exam"
                            type="text"
                            autoComplete="exam"
                            required
                            className="block w-full rounded-md border-0 ps-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="mt-1 flex gap-2">
                          <label
                            htmlFor="time"
                            className="block text-sm font-medium leading-6 text-gray-900 w-2/6"
                          >
                            Required Time
                          </label>
                          <input
                            // onChange={handleChange}
                            onChange={(e) =>
                              setVal({ ...val, hour: e.target.value })
                            }
                            value={val.hour}
                            id="hour"
                            name="hour"
                            type="number"
                            step="60"
                            max="23:59"
                            autoComplete="hour"
                            placeholder="Hours"
                            required
                            className="block w-2/6 rounded-md border-0 ps-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          <input
                            onChange={(e) =>
                              setVal({ ...val, minute: e.target.value })
                            }
                            value={val.minute}
                            id="minute"
                            name="minute"
                            type="number"
                            autoComplete="minute"
                            placeholder="Minutes"
                            required
                            className="block w-2/6 rounded-md border-0 ps-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <label
                            htmlFor="students"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Allowed Questions
                          </label>
                        </div>
                        <div className="mt-1">
                          <input
                            onChange={(e) =>
                              setVal({ ...val, students: e.target.value })
                            }
                            value={val.students}
                            id="students"
                            name="students"
                            type="number"
                            required
                            className="block w-full rounded-md border-0 ps-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                        onClick={addExam}
                      >
                        Save
                      </button>
                    </form>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
