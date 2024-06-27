import { useEffect, useState } from "react";
import {Dialog,DialogPanel,DialogTitle,Transition,TransitionChild,} from "@headlessui/react";
import socket from "../socket";
import {Link} from "react-router-dom";

export default function StdDashBoard() {
  let commitCondition = true;
  const [callouts, setCallouts] = useState([]);
  const [commits, setCommits] = useState([]);
  const [commitShow, setCommitShow] = useState(-1);
  const [input, setInput] = useState({
    imageFile: "",
    caption: "",
    commits: "",
  });

  const [open, setOpen] = useState(false);
  function like(value) {
    let token = localStorage.getItem("token");
    socket.emit("like", { token, value });
  }
  socket.on("like", function (success) {
    setCallouts([...success.response]);
  });

  function commit(id,element) {
    console.log("comitId---",element);
    if (commitCondition) {
      setCommitShow(id);
      commitCondition = false;
      socket.emit("allCommit", {
        element: element
      });
    } else {
      commitCondition = true;
      setCommitShow(-1);
    }
  }

  function postCommit(id) {
    console.log("Input Value ---", input.commits);
    console.log("Input ID ---", id);
    socket.emit("commit", {
      element: id,
      commit: `${input.commits}`,
    });
  }

  //---------0-------------------------
  socket.on("commit_response", function (msg) {
    console.log("frontEnd--commit_response---", msg);
    setCommits([...msg])
    setInput({...input,commits:""})
  });
  socket.on("allCommit_response", function (msg) {
    console.log("frontEnd--allCommits---", msg);
    setCommits([...msg])
  });
  //---------0-------------------------

  function handleClick() {
    setOpen(true);
  }

  function addPost() {
    let std_token = localStorage.getItem("token");
    let form = new FormData();
    form.append("file", input.imageFile);
    form.append("std_token", std_token);
    form.append("caption", input.caption);
    console.log("File ---", input.imageFile, "--", std_token);

    fetch("http://localhost:3000/post_image", {
      method: "POST",
      body: form,
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("BackEnd Response ---", res);
        setCallouts([...callouts, res.response]);
      });
    setOpen(false);
  }

  function dataDisplay() {
    fetch("http://localhost:3000/std_display")
      .then((res) => res.json())
      .then((res) => {
        console.log("BackEnd display ---", res);
        setCallouts(res.response);
      });
  }

  useEffect(() => {
    dataDisplay();
  }, [input]);

  return (
    <div className="bg-gray-100">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-none lg:py-32">
          <div className="commit_button m-2 mx-4 flex justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Posts</h2>
            <button
              type="button"
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
              onClick={handleClick}
            >
              Add New Post
            </button>
          </div>
          <div className="mt-6 space-y-12 lg:grid lg:grid-cols-1 lg:gap-y-11 lg:space-y-0">
            {callouts.map((callout, i) => (
              <div
                key={callout._id}
                className="group relative shadow-lg rounded-lg"
              >
                <div className="profile_box bg-white p-4 rounded-lg">
                  <div className="profile_info flex items-center mb-4">
                    <div className="profile_img mr-4">
                      <div className="img_box w-16 h-16 overflow-hidden rounded-full">
                        <img
                          src="/src/assets/Images/logo.png"
                          alt={"profileImage"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="about_box">
                      <h6 className="text-gray-800 font-semibold">
                        {"Muhammad Adrees Gujjar"}
                      </h6>
                      <p className="text-gray-500">{callout.std_email}</p>
                    </div>
                  </div>
                  <div className="profile_caption">
                    <h5 className="text-lg text-gray-700">{callout.caption}</h5>
                  </div>
                </div>
                <div className="relative lg:h-80 w-full overflow-hidden bg-white sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 h-64 ">
                  <img
                    src={callout.img_url}
                    alt={callout.imageAlt}
                    className="h-full w-full object-cover object-center"
                  />
                </div>

                <div className="my-4">
                  <div className="flex justify-end gap-5 px-10 py-2">
                    <p className="text-gray-800">{"0 Commits"}</p>
                    <p className="text-gray-800">{"0 Share"}</p>
                  </div>
                  <div className="post_commit flex justify-around py-4 border-t-2 mx-2 border-gray-400">
                    <div
                      className="post_icon flex items-center text-blue-500 cursor-pointer"
                      onClick={() => like(callout._id)}
                      id="like"
                    >
                      <span className="mr-2">
                        <i className="fa-regular fa-thumbs-up"></i>
                      </span>
                      Like{" "}
                      <span id={`like`} className="ml-1">
                        {callout.like_count}
                      </span>
                    </div>
                    <div
                      className="post_icon flex items-center text-blue-500 cursor-pointer"
                      onClick={() => commit(i,callout._id)}
                    >
                      <span className="mr-2">
                        <i className="fa-regular fa-comment"></i>
                      </span>
                      Comment
                    </div>
                    <div
                      className="post_icon flex items-center text-blue-500 cursor-pointer"
                      id="share"
                    >
                      <span className="mr-2">
                        <i className="fa-regular fa-share-from-square"></i>
                      </span>
                      Share
                    </div>
                  </div>
                  {commitShow === i && (
                    <div id={`commit`} className="transition-all duration-100">
                      <div className="commit_input mx-4">
                        <input
                          type="text"
                          placeholder="Enter Comment"
                          id={`commit_input`}
                          className="w-full px-3 py-2 border rounded-md"
                          value={input.commits}
                          onChange={(e) =>
                            setInput({ ...input, commits: e.target.value })
                          }
                        />
                      </div>
                      <div className="commit_button m-2 mx-4">
                        <button
                          type="button"
                          className="px-4 py-2 bg-blue-500 text-white rounded-md"
                          onClick={() => postCommit(callout._id)}
                        >
                          Post Comment
                        </button>
                      </div>
                      <h1 className="font-bold mx-5 my-3 text-lg">Commits</h1>
                      {
                        commits.map(element=>(
                          <div className="profile_box bg-white p-4 my-3 rounded-lg mx-4" key={element._id}>
                        <div className="profile_info flex items-center mb-4">
                          <div className="profile_img mr-4">
                            <div className="img_box w-7 h-7 overflow-hidden rounded-full">
                              <img
                                src="/src/assets/Images/logo.png"
                                alt={"profileImage"}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                          <div className="about_box">
                            <h6 className="text-gray-800 text-sm">
                              {element.commit_id}
                            </h6>
                          </div>
                        </div>
                        <div className="profile_caption">
                          <h5 className="text-gray-700 text-sm">
                            {element.commit}
                          </h5>
                          <div className="flex gap-3 text-sm text-blue-600">
                            <Link to="#" className="hover:underline italic">
                            Like
                            </Link>
                            <Link to="#" className="hover:underline italic">
                              Dislike
                            </Link>
                          </div>
                        </div>
                      </div>
                        ))
                      }
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
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
                          Add New Post
                        </DialogTitle>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <form className="space-y-6 w-full" method="POST">
                      <div>
                        <label
                          htmlFor="image"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Image
                        </label>
                        <div className="mt-1">
                          <input
                            id="image"
                            name="image"
                            type="file"
                            required
                            onChange={(e) => {
                              setInput({
                                ...input,
                                imageFile: e.target.files[0],
                              });
                            }}
                            className="block w-full rounded-md border-0 ps-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="caption"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Enter Image Caption
                        </label>
                        <div className="mt-1">
                          <textarea
                            id="caption"
                            name="caption"
                            type="message"
                            required
                            onChange={(e) => {
                              setInput({ ...input, caption: e.target.value });
                            }}
                            className="block w-full rounded-md border-0 ps-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                        onClick={addPost}
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
    </div>
  );
}
