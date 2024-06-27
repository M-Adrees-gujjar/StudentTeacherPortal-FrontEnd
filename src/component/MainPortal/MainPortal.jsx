import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const MainPortal = () => {
  const [value, setValue] = useState({
    post: true,
    exam: false,
  });
  const navigate = useNavigate();

  console.log(value);

  function click(parms) {
    if (parms === "post") {
      setValue({ post: true, exam: false });
      navigate("stddashboard");
    } else {
      setValue({ post: false, exam: true });
      navigate("addtest");
    }
  }

  useEffect(()=>{
    click("post");
  },[])

  return (
    <div className="my-14 mx-1">
      <div className="flex justify-center align-middle gap-3">
        <button
          className={
            value.post
              ? "border-blue-600 border-b-2 text-blue-600 lg:w-1/3 w-1/2 h-11"
              : "border-gray-300 border-b-2 lg:w-1/3 w-1/2 h-11"
          }
          onClick={() => click("post")}
        >
          <h1 className="lg:text-3xl text-xl font-semibold text-center">
            Posts
          </h1>
        </button>
        <button
          className={
            value.exam
              ? "border-blue-600 border-b-2 lg:w-1/3 w-1/2 h-11 text-blue-600"
              : "border-gray-300 border-b-2 lg:w-1/3 w-1/2 h-11"
          }
          onClick={() => click("exam")}
        >
          <h1 className="lg:text-3xl text-xl font-semibold text-center">
            Manage Exam
          </h1>
        </button>
      </div>
      <Outlet />
    </div>
  );
};

export default MainPortal;

// import { useState } from "react";
// import { Link } from "react-router-dom";
// const MainPortal = () => {
//   const [value,setValue] = useState({
//     post : true,
//     exam : false
//   });
//   function click(parms) {
//     if (parms == 'post') {
//       setValue({post : true , exam : false});
//     }else{
//       setValue({post : false , exam : true});
//     }
//   }

//   return (
//     <div className="my-14 mx-1">
//       <div className=" flex justify-center align-middle gap-3">
//         <Link className={value.post ? "border-blue-600 border-b-2 text-blue-600 lg:w-1/3 w-1/2 h-11" :"border-gray-300 border-b-2 lg:w-1/3 w-1/2 h-11" } onClick={()=>click("post")}>
//           <h1 className="lg:text-3xl text-xl font-semibold text-center">Posts</h1>
//         </Link>
//         <Link className={value.exam ? "border-blue-600 border-b-2 lg:w-1/3 w-1/2 h-11 text-blue-600" :"border-gray-300 border-b-2 lg:w-1/3 w-1/2 h-11" } onClick={()=>click("Exam")}>
//           <h1 className="lg:text-3xl text-xl font-semibold text-center">
//             Manage Exam
//           </h1>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default MainPortal;
