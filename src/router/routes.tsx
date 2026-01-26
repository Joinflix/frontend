import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router";
import BrowsingPage from "../pages/BrowsingPage";
import LandingPage from "../pages/LandingPage";
import SignupPage from "../pages/SignupPage";

const routes = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route index element={<LandingPage />} />;
      <Route path="/browsing" element={<BrowsingPage />} />,
      <Route path="/signup" element={<SignupPage />} />
    </>,
  ),
);

export default routes;
