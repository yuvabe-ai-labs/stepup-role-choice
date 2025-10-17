import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface WeeklyData {
  day: string;
  previousWeek: number;
  thisWeek: number;
}

export interface MonthlyData {
  month: string;
  applications: number;
}

export interface ReportStats {
  totalApplications: number;
  hiredCandidates: number;
  interviewRate: number;
  averageMatchScore: number;
  totalInternships: number;
  activeInternships: number;
}

export const useUnitReports = () => {
  const { user } = useAuth();
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [stats, setStats] = useState<ReportStats>({
    totalApplications: 0,
    hiredCandidates: 0,
    interviewRate: 0,
    averageMatchScore: 0,
    totalInternships: 0,
    activeInternships: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string>("current");

  const fetchReportsData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch profile first
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (profileError) throw profileError;

      const profileId = profileData.id;

      // Fetch weekly applications data
      const weeklyApplications = await fetchWeeklyApplications(profileId);
      setWeeklyData(weeklyApplications);

      // Fetch monthly applications data
      const monthlyApplications = await fetchMonthlyApplications(profileId);
      setMonthlyData(monthlyApplications);

      // Fetch report statistics
      const reportStats = await fetchReportStats(profileId);
      setStats(reportStats);
    } catch (error) {
      console.error("Error fetching reports data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeeklyApplications = async (
    profileId: string
  ): Promise<WeeklyData[]> => {
    const days = ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"];
    const weeklyData: WeeklyData[] = [];

    // Get date ranges for previous week and current week
    const now = new Date();
    const currentWeekStart = new Date(now);
    currentWeekStart.setDate(now.getDate() - now.getDay() + 1); // Start from Monday
    const previousWeekStart = new Date(currentWeekStart);
    previousWeekStart.setDate(previousWeekStart.getDate() - 7);

    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(currentWeekStart);
      currentDay.setDate(currentWeekStart.getDate() + i);

      const previousDay = new Date(previousWeekStart);
      previousDay.setDate(previousWeekStart.getDate() + i);

      // Format dates for query
      const currentDayStr = currentDay.toISOString().split("T")[0];
      const previousDayStr = previousDay.toISOString().split("T")[0];

      // Fetch applications for current day (this week) - Join with internships to filter by created_by
      const { data: currentData, error: currentError } = await supabase
        .from("applications")
        .select(
          `
          id,
          internships!inner(created_by)
        `
        )
        .eq("internships.created_by", profileId)
        .gte("applied_date", `${currentDayStr}T00:00:00Z`)
        .lt("applied_date", `${currentDayStr}T23:59:59Z`);

      if (currentError) throw currentError;

      // Fetch applications for previous day (previous week) - Join with internships to filter by created_by
      const { data: previousData, error: previousError } = await supabase
        .from("applications")
        .select(
          `
          id,
          internships!inner(created_by)
        `
        )
        .eq("internships.created_by", profileId)
        .gte("applied_date", `${previousDayStr}T00:00:00Z`)
        .lt("applied_date", `${previousDayStr}T23:59:59Z`);

      if (previousError) throw previousError;

      weeklyData.push({
        day: days[i],
        previousWeek: previousData?.length || 0,
        thisWeek: currentData?.length || 0,
      });
    }

    return weeklyData;
  };

  const fetchMonthlyApplications = async (
    profileId: string
  ): Promise<MonthlyData[]> => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthlyData: MonthlyData[] = [];

    const currentYear = new Date().getFullYear();

    // Get last 6 months including current month
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthIndex = date.getMonth();
      const monthName = months[monthIndex];

      const monthStart = new Date(currentYear, monthIndex, 1);
      const monthEnd = new Date(currentYear, monthIndex + 1, 0);

      const { data, error } = await supabase
        .from("applications")
        .select(
          `
          id,
          internships!inner(created_by)
        `
        )
        .eq("internships.created_by", profileId)
        .gte("applied_date", monthStart.toISOString())
        .lt("applied_date", monthEnd.toISOString());

      if (error) throw error;

      monthlyData.push({
        month: monthName,
        applications: data?.length || 0,
      });
    }

    return monthlyData;
  };

  const fetchReportStats = async (profileId: string): Promise<ReportStats> => {
    // Total applications - Join with internships to filter by created_by
    const { data: totalData, error: totalError } = await supabase
      .from("applications")
      .select(
        `
        id,
        internships!inner(created_by)
      `
      )
      .eq("internships.created_by", profileId);

    if (totalError) throw totalError;

    // Hired candidates - Join with internships to filter by created_by
    const { data: hiredData, error: hiredError } = await supabase
      .from("applications")
      .select(
        `
        id,
        internships!inner(created_by)
      `
      )
      .eq("internships.created_by", profileId)
      .eq("status", "hired");

    if (hiredError) throw hiredError;

    // Interviewed candidates - Join with internships to filter by created_by
    const { data: interviewedData, error: interviewedError } = await supabase
      .from("applications")
      .select(
        `
        id,
        internships!inner(created_by)
      `
      )
      .eq("internships.created_by", profileId)
      .eq("status", "interviewed");

    if (interviewedError) throw interviewedError;

    // Average match score - Join with internships to filter by created_by
    const { data: scoreData, error: scoreError } = await supabase
      .from("applications")
      .select(
        `
        profile_match_score,
        internships!inner(created_by)
      `
      )
      .eq("internships.created_by", profileId)
      .not("profile_match_score", "is", null);

    if (scoreError) throw scoreError;

    // Total internships created by this unit
    const { data: internshipsData, error: internshipsError } = await supabase
      .from("internships")
      .select("id, status")
      .eq("created_by", profileId);

    if (internshipsError) throw internshipsError;

    // Active internships
    const activeInternships =
      internshipsData?.filter((internship) => internship.status === "active")
        .length || 0;

    const totalApplications = totalData?.length || 0;
    const hiredCandidates = hiredData?.length || 0;
    const interviewedCandidates = interviewedData?.length || 0;
    const totalInternships = internshipsData?.length || 0;

    const averageMatchScore =
      scoreData && scoreData.length > 0
        ? scoreData.reduce(
            (sum, app) => sum + (app.profile_match_score || 0),
            0
          ) / scoreData.length
        : 0;

    const interviewRate =
      totalApplications > 0
        ? (interviewedCandidates / totalApplications) * 100
        : 0;

    return {
      totalApplications,
      hiredCandidates,
      interviewRate,
      averageMatchScore,
      totalInternships,
      activeInternships,
    };
  };

  useEffect(() => {
    fetchReportsData();
  }, [user]);

  return {
    weeklyData,
    monthlyData,
    stats,
    loading,
    selectedMonth,
    setSelectedMonth,
    refetch: fetchReportsData,
  };
};
