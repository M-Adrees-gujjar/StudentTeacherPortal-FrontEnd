import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./component/Account-Registeration/SignIn";
import SignUp from "./component/Account-Registeration/SignUp";
import Tabel from "./component/Tabels/Tabel";
import Exam from "./component/Exam/Exam";
import Home from "./Home";
import Profile from "./component/Profile/Profile";
import Setting from "./component/Setting/Setting";
import StdDashBoard from "./component/StdDashBoard/StdDashBoard";
import TestCreation from "./component/TestCreation/TestCreation";
import StudentTest from "./component/StudentTest/StudentTest";
import MainPortal from "./component/MainPortal/MainPortal";
import StdMainPortal from "./component/MainPortal/StdMainPortal";
import StdSignIn from "./component/Account-Registeration/Std_SignIn";
import AddTest from "./component/AddTest/AddTest";
import ViewStdTest from "./component/ViewStdTest/ViewStdTest";
import TestPage from "./component/ViewStdTest/TestPage";
import Result from "./component/Result/Result";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/setting" element={<Setting />} />
        <Route path="/testcreation" element={<TestCreation />} />
        <Route path="/exam" element={<Exam />} />
        <Route path="studenttest" element={<StudentTest />} />
        <Route path="/mainportal" element={<MainPortal />}>
          <Route path="stddashboard" element={<StdDashBoard />} />
          <Route path="addtest" element={<AddTest />} />
        </Route>
        <Route path="/stdmainportal" element={<StdMainPortal />}>
          <Route path="stddashboard" element={<StdDashBoard />} />
          <Route path="viewstdtest" element={<ViewStdTest />} />
        </Route>
        <Route path="/stdsignin" element={<StdSignIn />} />
        <Route path="/tabel" element={<Tabel />} />
        <Route path="/testpage" element={<TestPage />} />
        <Route path="/stdresult" element={<Result />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
