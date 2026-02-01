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
import { Step4SelectPlan } from "../components/signup/step/Step4SelectPlan";
import SigninPage from "../pages/SigninPage";
import Step2SetPassword from "../components/signup/step/Step2SetPassword";
import Step3SetNickname from "../components/signup/step/Step3SetNickname";
import Step4ListMembership from "../components/signup/step/Step4ListMembership";
import PasswordSignin from "../components/signin/step/PasswordSignin";
import PartyRoomPage from "../pages/PartyRoomPage";
import AuthProvider from "../components/auth/AuthProvider";

const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AuthProvider />}>
      <Route index element={<LandingPage />} />;
      <Route path="/signin" element={<SigninPage />}>
        <Route index element={<PasswordSignin />} />
      </Route>
      <Route path="/browsing" element={<BrowsingPage />} />,
      <Route path="/signup" element={<SignupPage />}>
        <Route path="step1-send-code" element={<Step1SendCode />} />
        <Route path="step1-confirm-code" element={<Step1ConfirmCode />} />
        <Route path="step2-set-password" element={<Step2SetPassword />} />
        <Route path="step3-set-nickname" element={<Step3SetNickname />} />
        <Route path="step4-list-membership" element={<Step4ListMembership />} />
        <Route path="step4-select-plan" element={<Step4SelectPlan />} />
      </Route>
      <Route path="/watch">
        <Route path="party" element={<PartyRoomPage />} />
      </Route>
    </Route>,
  ),
);

export default routes;
