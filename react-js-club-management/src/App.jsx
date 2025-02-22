import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import GlobalStyles from "./styles/GlobalStyles";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PageNotFound from "./pages/PageNotFound";
import AppLayout from "./ui/AppLayout";
import AddClubPost from "./pages/AddClubPost";
import Private from "./ui/Private";
import CreateAdmin from "./pages/AddClubUser";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClubPosts from "./pages/ClubPosts";
import Attend from "./pages/Attend";
import ClubMember from "./pages/ClubMember";
import AddClubUser from "./pages/AddClubUser";


function App() {
  return (
    <>
      <GlobalStyles />
      <BrowserRouter>
        <Routes>
          <Route element={<Private />}>
            <Route element={<AppLayout />}>
              <Route index element={<Navigate replace to="dashboard" />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="attend" element={<Attend />} />
              <Route path="settings" element={<Settings />} />
              <Route path="club/:clubName/post" element={<AddClubPost />} />
              <Route path="club/:clubPosts" element={<ClubPosts />} />
              <Route path="club/clubMember" element={<ClubMember/>} />
              <Route path="club/addMember" element={<AddClubUser/>} />
            </Route>
          </Route>


          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="createAdmin" element={<CreateAdmin />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>

      <ToastContainer />
    </>
  );
}

export default App;
