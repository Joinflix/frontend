import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router";
import BrowsingPage from "../pages/BrowsingPage";
import LandingPage from "../pages/LandingPage";

const routes = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route index element={<LandingPage />} />;
      <Route path="/browsing" element={<BrowsingPage />} />,
    </>,
  ),
);

export default routes;
