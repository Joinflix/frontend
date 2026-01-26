import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router";
import BrowsingPage from "../pages/BrowsingPage";
import LandingPage from "../pages/LandingPage";
import SignupPage from "../pages/SignupPage";
import { Step1SendEmail } from "../components/signup/step/Step1SendEmail";
import { Step1ConfirmEmail } from "../components/signup/step/Step1ConfirmEmail";
import { Step2Membership } from "../components/signup/step/Step2Membership";
import { Step2SelectPlan } from "../components/signup/step/Step2SelectPlan";

const routes = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route index element={<LandingPage />} />;
      <Route path="/browsing" element={<BrowsingPage />} />,
      <Route path="/signup" element={<SignupPage />}>
        <Route path="step1-send-email" element={<Step1SendEmail />} />
        <Route path="step1-confirm-email" element={<Step1ConfirmEmail />} />
        <Route path="step2-membership" element={<Step2Membership />} />
        <Route path="step2-select-plan" element={<Step2SelectPlan />} />
      </Route>
    </>,
  ),
);

export default routes;
