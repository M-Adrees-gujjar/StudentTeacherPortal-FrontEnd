import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPenToSquare } from "@fortawesome/free-solid-svg-icons";

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
  const [products,setProducts] = useState([]);
  const [globalIndex,setGlobalIndex] = useState('');

  const [val,setVal] = useState({
    name : '',
    email : '',
    password : '',
    exam : ''
  });

  function addStudent() {
    if (globalIndex) {
      fetch('http://localhost:3000/update_student', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          id : globalIndex,
          name: val.name,
          email : val.email,
          password: val.password,
          exam : val.exam,
      })
  })
      .then(res => res.json())
      .then(res => {
        console.log("res----form ------",res);
        setGlobalIndex('');
      });
    setOpen(false);
    findStudent();
    } else {
    let token = localStorage.getItem('token');
    fetch('http://localhost:3000/add_std', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          name: val.name,
          email : val.email,
          password: val.password,
          exam : val.exam,
          token : token
      })
  })
      .then(res => res.json())
      .then(res => {
        console.log("res----form ------",res);
      });
    setOpen(false);
    findStudent();
    }
  }

  const findStudent = useCallback(()=>{
    let token = localStorage.getItem('token');
    fetch('http://localhost:3000/find_student', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          token : token
      })
  })
      .then(res => res.json())
      .then(res => {
        if (res.success) {
        setProducts(res.response);
        }else{
          alert("Wrong.......");
        }
      });
  },[]);

  useEffect(()=>{
    findStudent()
  },[findStudent]);

  function deleteStudent(id) {
    fetch('http://localhost:3000/delete_student', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        element : id
      })
  })
      .then(res => res.json())
      .then(res => {
        if (res.success) {
        findStudent();
        }else{
          alert("Wrong.......");
        }
      });
  }

  function updateStudent(id) {

    setOpen(true);
    let value = products.filter(element=>{
      return element._id == id
    })
    const obj = value[0]
    console.log("--- value --- ",value);
    setVal (obj);
    setGlobalIndex(id);
    console.log("--- id - globalInd-- ",globalIndex,"---",id);
  }

  return (
    <>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white max-w-screen-lg m-auto flex flex-col gap-10 p-6 my-10">
        <div className="flex lg:flex-row flex-col justify-between">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Add Students for Test Submission
            </h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              First you have to add students and their respective logIn details
            </p>
          </div>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <button
              onClick={() => setOpen(true)}
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Add Student
            </button>
          </div>
        </div>
        <table className="w-full text-sm text-left text-gray-900">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Password
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {console.log("pro --- ",products)}
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
                  {product.name}
                </th>
                <td className="px-6 py-4">{product.email}</td>
                <td className="px-6 py-4">{product.password}</td>
                <td className="px-6 py-4 flex gap-5">
                  <button
                    onClick={()=>updateStudent(product._id)}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </button>
                  <button
                    onClick={()=>deleteStudent(product._id)}
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
                          Add Your Student Details
                        </DialogTitle>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <form className="space-y-6 w-full" method="POST">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Username
                        </label>
                        <div className="mt-1">
                          <input
                          onChange={(e)=>setVal({...val,name : e.target.value})}
                            value = {val.name}
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            required
                            className="block w-full rounded-md border-0 ps-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Email Address
                        </label>
                        <div className="mt-1">
                          <input
                          onChange={(e)=>setVal({...val,email : e.target.value})}
                          value = {val.email}
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="block w-full rounded-md border-0 ps-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <label
                            htmlFor="password"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Password
                          </label>
                        </div>
                        <div className="mt-1">
                          <input
                          onChange={(e)=>setVal({...val,password : e.target.value})}
                          value = {val.password}
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="block w-full rounded-md border-0 ps-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <label
                            htmlFor="exam"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Exam
                          </label>
                        </div>
                        <div className="mt-1">
                          <input
                          onChange={(e)=>setVal({...val,exam : e.target.value})}
                          value = {val.exam}
                            id="exam"
                            name="exam"
                            type="text"
                            required
                            className="block w-full rounded-md border-0 ps-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                        onClick={addStudent}
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
