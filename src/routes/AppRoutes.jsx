import React, { useMemo } from "react";
import { Navigate, Routes, Route, Outlet, useParams } from "react-router-dom";
import MainLayout from "../layout/mainLayout/MainLayout";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../store/slices/authSlice";
import SponsorDashboard from "../pages/dashboard/SponsorDashboard";
import SiteAdminDashboard from "../pages/dashboard/SiteAdminDashboard";
import TrialDetails from "../pages/trialDetails/TrialDetails";
import CreateTrial from "../pages/createTrial/CreateTrial";
import TrialSiteDetails from "../pages/trialSiteDetails/TrialSiteDetails";
import GenericNotFound from "../pages/GenericNotFound";
import _ from 'lodash'
import { getUserRole } from "../pages/util";
import SiteInitiationForm from "../pages/siteIinitiation/SiteInitiationForm";
import Login from "../pages/login/Login";
import EnrollSubject from "../pages/enrollSubject/EnrollSubject";
import SubjectDetails from "../pages/subjectDetails/SubjectDetails";
import SubjectCRFForm from "../pages/subjectCRF/SubjectCRFForm";
import VisitDetailCRFInfo from "../pages/subjectDetails/visitDetailCRF/VisitDetailCRFInfo";
import SubjectWithdrawForm from "../pages/subjectWithdraw/SubjectWithdrawForm";
import VisitSchedule from "../pages/visitScheudle";
import SubjectDashboard from "../pages/dashboard/SubjectDashboard";
import SubjectVisitDetailCRFInfo from "../pages/subjectDetails/visitDetailCRF/SubjectVisitDetailCRFInfo";
import SubjectProfile from "../pages/eConsent/SubjectProfile";
import SubjectSchedule from "../pages/visitScheudle/SubjectSchedule";
import UpdateSchedule from "../pages/visitScheudle/UpdateSchedule";
import ScheduleCalendar from "../pages/visitScheudle/ScheduleCalendar";
import Forgot from "../pages/forgotPassword/forgotPassword";

const ProtectedRoute = ({ user, roles, redirectPath = "/login" }) => {
  //trialSiteDetail
  const loggedInUser = useSelector((state) => state.auth.user);
  const trialSiteDetail = useSelector((state) => state.trial.trialSiteDetail);
  
  const currentUserRoleOfTrailSite = useMemo(() => {
    if (trialSiteDetail) {
      const users = trialSiteDetail.users;
      const logginUserEmail = loggedInUser.email;
      const userObject = _.find(users, (user) => {
        return user.user.email?.toLowerCase() == logginUserEmail?.toLowerCase();
      })

      if (userObject) {
        return userObject.role;
      }

      return "sponsor";

    }
    const userRole = getUserRole(user);
    return userRole;

  }, [trialSiteDetail]);


  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }
  // const canAccess = _.find(roles, (role) => {
  //   return role == currentUserRoleOfTrailSite;
  // })
  if (true) {
    return <Outlet />;
  }
  return <Navigate to={"/unauthorized"} />;
};

const AppRoutes = () => {
  const user = useSelector(selectCurrentUser);

  const userRole = getUserRole(user);
  return (
    <Routes>
      <Route exact path="/login" element={<Login />} />
      <Route exact path="/forgotPassword" element={<Forgot />} />

      <Route path="/" element={<MainLayout />}>
        <Route
          element={
            <ProtectedRoute user={user} roles={["site_admin", "sponsor", "PI", "site_coordinator"]} />
          }
        >
          <Route
            path="/"
            element={userRole == "subject" ? (
              <SubjectDashboard />
            ) :
              userRole == "site_admin" || userRole == "PI" || userRole == 'site_coordinator' ||
                userRole == 'site_monitor' ? (
                <SiteAdminDashboard />
              ) : userRole == "sponsor" ? (
                <SponsorDashboard />
              ) : null
            }
          />
          <Route path="/trial/:trialId?" element={<TrialDetails />} />
          <Route
            exact
            path="/trial/:trialId/trial-site/:trialSiteId"
            element={<TrialSiteDetails />}
          />
        </Route>
        <Route
          element={
            <ProtectedRoute user={user} roles={["site_admin", "sponsor", "PI", "site_coordinator"]} />
          }
        >
          <Route
            exact
            path="/trial/:trialId/trial-site/:trialSiteId/:siteInitStep"
            element={<SiteInitiationForm />}
          />
          <Route path="/schedule" element={<VisitSchedule />} >
              <Route exact path="/schedule/:scheduleId" element={<ScheduleCalendar />} />
          </Route>
        </Route>
        <Route element={<ProtectedRoute user={user} roles={["sponsor"]} />}>
          <Route path="/trialDetails" element={<TrialDetails />} />
          <Route path="/createTrial/:trialId?" element={<CreateTrial />} />
        </Route>
        <Route element={<ProtectedRoute user={user} roles={["subject"]} />}>
          <Route exact path="/eConcent/:trialId/trial-site/:trialSiteId/site/:siteId/subject/:subjectMasterId/crf/:crfMasterId/:visitStepKey/subject" element={<SubjectVisitDetailCRFInfo />} />
          <Route path="/profile" element={<SubjectProfile />} />
          <Route path="/trial/:trialId/site/:siteId/subject/:subjectId/schedule" element={<SubjectSchedule />} />
        </Route>
        <Route element={<ProtectedRoute user={user} roles={["PI", "site_coordinator"]} />}>
          <Route path="/eConcent/:trialId/trial-site/:trialSiteId/:siteInitStep/:subjectMasterId?" element={<EnrollSubject />} />
          <Route path="/eConcent/:trialId/trial-site/:trialSiteId/:siteInitStep/:subjectMasterId/withdraw" element={<SubjectWithdrawForm />} />
          <Route path="/eConcent/:trialId/trial-site/:trialSiteId/:siteInitStep/:subjectMasterId/crf/:crfMasterId" element={<SubjectCRFForm />} />
          <Route path="/eConcent/:trialId/trial-site/:trialSiteId/site/:siteId/subject/:subjectMasterId/details" element={<SubjectDetails />} />
          <Route exact path="/eConcent/:trialId/trial-site/:trialSiteId/site/:siteId/subject/:subjectMasterId/crf/:crfMasterId/:visitStepKey" element={<VisitDetailCRFInfo />} />
        </Route>
      </Route>
      <Route path="*" element={<GenericNotFound />} />
    </Routes>
  );
};

export default AppRoutes;
