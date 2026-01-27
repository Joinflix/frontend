import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router";
import BrowsingPage from "../pages/BrowsingPage";
import LandingPage from "../pages/LandingPage";
import SignupPage from "../pages/SignupPage";
import { Step1SendCode } from "../components/signup/step/Step1SendCode";
import { Step1ConfirmCode } from "../components/signup/step/Step1ConfirmCode";
import { Step2Membership } from "../components/signup/step/Step2Membership";
import { Step2SelectPlan } from "../components/signup/step/Step2SelectPlan";
import SigninPage from "../pages/SigninPage";
import Step1Email from "../components/signin/step/Step1Email";
import Step2Code from "../components/signin/step/Step2Code";
import Step2Password from "../components/signin/step/Step2Password";

const routes = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route index element={<LandingPage />} />;
      <Route path="/signin" element={<SigninPage />}>
        <Route index element={<Step1Email />} />
        <Route path="code" element={<Step2Code />} />
        <Route path="password" element={<Step2Password />} />
      </Route>
      <Route path="/browsing" element={<BrowsingPage />} />,
      <Route path="/signup" element={<SignupPage />}>
        <Route path="step1-send-code" element={<Step1SendCode />} />
        <Route path="step1-confirm-code" element={<Step1ConfirmCode />} />
        <Route path="step2-membership" element={<Step2Membership />} />
        <Route path="step2-select-plan" element={<Step2SelectPlan />} />
      </Route>
    </>,
  ),
);

export default routes;
