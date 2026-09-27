import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, useSearchParams } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { ScrollInertiaController } from "@/components/ScrollInertiaController";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import Index from "./pages/Index.tsx";
import Quiz from "./pages/Quiz.tsx";
import Results from "./pages/Results.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Discover from "./pages/Discover.tsx";
import Plans from "./pages/Plans.tsx";
import Roadmap from "./pages/Roadmap.tsx";
import AboutMe from "./pages/AboutMe.tsx";
import Chat from "./pages/Chat.tsx";
import JourneyLog from "./pages/JourneyLog.tsx";
import ExperienceDetail from "./pages/ExperienceDetail.tsx";
import NewExperience from "./pages/NewExperience.tsx";
import Rewards from "./pages/Rewards.tsx";
import Waitlist from "./pages/Waitlist.tsx";
import SignIn from "./pages/SignIn.tsx";
import NotFound from "./pages/NotFound.tsx";
import RecruitersLanding from "./pages/Recruiters.tsx";
import { RecruiterLayout } from "./components/recruiter/RecruiterLayout";
import RecruiterDashboard from "./pages/recruiter/Dashboard.tsx";
import RecruiterDiscover from "./pages/recruiter/Discover.tsx";
import RecruiterMyTalent from "./pages/recruiter/MyTalent.tsx";
import RecruiterAnalytics from "./pages/recruiter/Analytics.tsx";
import RecruiterStudentProfile from "./pages/recruiter/StudentProfile.tsx";

const queryClient = new QueryClient();

function PreserveQueryRedirect({ to, filter }: { to: string; filter?: string }) {
  const [params] = useSearchParams();
  const next = new URLSearchParams(params);
  if (filter) next.set("filter", filter);
  const qs = next.toString();
  return <Navigate to={qs ? `${to}?${qs}` : to} replace />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <ScrollInertiaController />
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/recruiters" element={<RecruitersLanding />} />
          <Route path="/waitlist" element={<Waitlist />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/results" element={<Results />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/recruiter" element={<RecruiterLayout />}>
            <Route index element={<RecruiterDashboard />} />
            <Route path="dashboard" element={<RecruiterDashboard />} />
            <Route path="discover" element={<RecruiterDiscover />} />
            <Route path="talent" element={<RecruiterMyTalent />} />
            <Route path="shortlist" element={<PreserveQueryRedirect to="/recruiter/talent" filter="shortlist" />} />
            <Route path="student/:id" element={<RecruiterStudentProfile />} />
            <Route path="messages" element={<PreserveQueryRedirect to="/recruiter/talent" />} />
            <Route path="analytics" element={<RecruiterAnalytics />} />
          </Route>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/about-me" element={<AboutMe />} />
            <Route path="/journey" element={<JourneyLog />} />
            <Route path="/journey/new" element={<NewExperience />} />
            <Route path="/journey/:id" element={<ExperienceDetail />} />
            <Route path="/rewards" element={<Rewards />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
