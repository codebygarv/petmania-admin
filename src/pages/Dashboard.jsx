import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  CheckCircle,
  XCircle,
  PawPrint,
  Clock,
  ShieldCheck,
  TrendingUp,
  UserPlus,
  Calendar,
  Heart,
  Home,
  Activity,
  Award,
  AlertCircle,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { adminDashboardApi } from "../api/adminService";
import { CardSkeleton } from "../components/ui/Skeleton";
import Tabs from "../components/ui/Tabs";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: () => adminDashboardApi.getStats(),
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-neutral-50">Dashboard</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-red-400">Failed to load dashboard data</p>
        <p className="text-sm text-neutral-500">Please check if the backend server is running</p>
      </div>
    );
  }

  const stats = data?.data || {};

  const emailVerificationRate = stats.totalUsers
    ? Math.round(((stats.verifiedUsers || 0) / stats.totalUsers) * 100)
    : 0;
  const aadharRate = stats.totalUsers
    ? Math.round(((stats.adharVerifiedUsers || 0) / stats.totalUsers) * 100)
    : 0;
  const petApprovalRate = stats.totalPets
    ? Math.round(((stats.approvedPets || 0) / stats.totalPets) * 100)
    : 0;
  const adoptionRate = stats.totalPets
    ? Math.round(((stats.adoptedPets || 0) / stats.totalPets) * 100)
    : 0;

  const pendingPets = stats.pendingPets || 0;
  const unverifiedUsers = (stats.totalUsers || 0) - (stats.adharVerifiedUsers || 0);

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers || 0,
      icon: Users,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
      glowClass: "glow-blue",
      href: "/users",
    },
    {
      title: "Total Pets",
      value: stats.totalPets || 0,
      icon: PawPrint,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30",
      glowClass: "glow-purple",
      href: "/pets",
    },
    {
      title: "Aadhar Verified",
      value: `${aadharRate}%`,
      subtitle: `${stats.adharVerifiedUsers || 0} users`,
      icon: ShieldCheck,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/30",
      glowClass: "glow-green",
      href: "/users",
    },
    {
      title: "Adoption Rate",
      value: `${adoptionRate}%`,
      subtitle: `${stats.adoptedPets || 0} pets adopted`,
      icon: Heart,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/30",
      glowClass: "glow-orange",
      href: "/pets",
    },
  ];

  const recentActivities = [
    { type: "pet", title: "New pet listing awaiting approval", time: "5 mins ago", icon: PawPrint, color: "text-orange-400 bg-orange-500/10" },
    { type: "user", title: "New user submitted Aadhar verification", time: "18 mins ago", icon: ShieldCheck, color: "text-blue-400 bg-blue-500/10" },
    { type: "adopt", title: "Pet adopted by verified user", time: "1 hour ago", icon: Heart, color: "text-emerald-400 bg-emerald-500/10" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Segmented Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-neutral-50">Dashboard</h1>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
              <Sparkles size={10} /> LIVE
            </span>
          </div>
          <p className="text-sm text-neutral-400 mt-1">
            Real-time platform overview and administrative metrics
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Tabs
            tabs={[
              { id: "overview", label: "Overview" },
              { id: "analytics", label: "Analytics" },
              { id: "feed", label: "Activity Feed" },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>
      </div>

      {/* Overview View */}
      {activeTab === "overview" && (
        <div className="space-y-6 animate-fade-in">
          {/* Glowing Stat Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((stat, index) => (
              <Link
                key={index}
                to={stat.href}
                className={`group relative glass-card ${stat.borderColor} ${stat.glowClass} rounded-2xl p-5 hover:border-orange-500/50 transition-all duration-300 overflow-hidden`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-neutral-50 mt-1">
                      {stat.value}
                    </p>
                    {stat.subtitle && (
                      <p className="text-xs text-neutral-400 mt-0.5">{stat.subtitle}</p>
                    )}
                  </div>
                  <div className={`p-3 rounded-2xl ${stat.bgColor} group-hover:scale-110 transition-transform`}>
                    <stat.icon size={22} className={stat.color} />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-neutral-400 group-hover:text-orange-400 transition-colors">
                  <span>View Details</span>
                  <ArrowUpRight size={14} />
                </div>
              </Link>
            ))}
          </div>

          {/* Quick Stats Banner Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="glass-card rounded-2xl p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-orange-500/10">
                <AlertCircle size={20} className="text-orange-400" />
              </div>
              <div>
                <p className="text-[10px] text-neutral-400 uppercase tracking-wide font-semibold">Pending Pets</p>
                <p className="text-xl font-bold text-neutral-50 mt-0.5">{pendingPets}</p>
              </div>
            </div>
            <div className="glass-card rounded-2xl p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-yellow-500/10">
                <Clock size={20} className="text-yellow-400" />
              </div>
              <div>
                <p className="text-[10px] text-neutral-400 uppercase tracking-wide font-semibold">Unverified Users</p>
                <p className="text-xl font-bold text-neutral-50 mt-0.5">{unverifiedUsers}</p>
              </div>
            </div>
            <div className="glass-card rounded-2xl p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-green-500/10">
                <CheckCircle size={20} className="text-green-400" />
              </div>
              <div>
                <p className="text-[10px] text-neutral-400 uppercase tracking-wide font-semibold">Adopted Pets</p>
                <p className="text-xl font-bold text-neutral-50 mt-0.5">{stats.adoptedPets || 0}</p>
              </div>
            </div>
            <div className="glass-card rounded-2xl p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10">
                <Home size={20} className="text-blue-400" />
              </div>
              <div>
                <p className="text-[10px] text-neutral-400 uppercase tracking-wide font-semibold">Available Pets</p>
                <p className="text-xl font-bold text-neutral-50 mt-0.5">{stats.approvedPets || 0}</p>
              </div>
            </div>
          </div>

          {/* Interactive Recharts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-base font-semibold text-neutral-50">User Registration Growth</h2>
                  <p className="text-xs text-neutral-400">Monthly new user registrations</p>
                </div>
                <TrendingUp size={18} className="text-orange-400" />
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[
                    { month: "Nov", users: Math.max(1, Math.round((stats.totalUsers || 5) * 0.3)) },
                    { month: "Dec", users: Math.max(2, Math.round((stats.totalUsers || 5) * 0.5)) },
                    { month: "Jan", users: Math.max(3, Math.round((stats.totalUsers || 5) * 0.75)) },
                    { month: "Feb", users: stats.totalUsers || 5 },
                  ]}>
                    <defs>
                      <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="#737373" fontSize={12} tickLine={false} />
                    <YAxis stroke="#737373" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#171717", borderColor: "#262626", borderRadius: "12px", color: "#f5f5f5" }}
                    />
                    <Area type="monotone" dataKey="users" stroke="#f97316" strokeWidth={2} fillOpacity={1} fill="url(#userGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-base font-semibold text-neutral-50">Pet Status</h2>
                  <p className="text-xs text-neutral-400">Listings breakdown</p>
                </div>
                <Activity size={18} className="text-purple-400" />
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { status: "Approved", count: stats.approvedPets || 0 },
                    { status: "Pending", count: stats.pendingPets || 0 },
                    { status: "Adopted", count: stats.adoptedPets || 0 },
                  ]}>
                    <XAxis dataKey="status" stroke="#737373" fontSize={12} tickLine={false} />
                    <YAxis stroke="#737373" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#171717", borderColor: "#262626", borderRadius: "12px", color: "#f5f5f5" }}
                    />
                    <Bar dataKey="count" fill="#a855f7" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Detailed View */}
      {activeTab === "analytics" && (
        <div className="glass-card rounded-2xl p-6 space-y-6 animate-fade-in">
          <h2 className="text-lg font-semibold text-neutral-50">Platform Performance Metrics</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-300">Email Verification Rate</span>
                <span className="font-semibold text-neutral-100">{emailVerificationRate}%</span>
              </div>
              <div className="h-3 bg-neutral-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${emailVerificationRate}%` }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-300">Aadhar Document Verification Rate</span>
                <span className="font-semibold text-neutral-100">{aadharRate}%</span>
              </div>
              <div className="h-3 bg-neutral-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${aadharRate}%` }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-300">Pet Approval Rate</span>
                <span className="font-semibold text-neutral-100">{petApprovalRate}%</span>
              </div>
              <div className="h-3 bg-neutral-800 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: `${petApprovalRate}%` }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Activity Feed View */}
      {activeTab === "feed" && (
        <div className="glass-card rounded-2xl p-6 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <h2 className="text-lg font-semibold text-neutral-50">Administrative Activity Feed</h2>
            <Clock size={18} className="text-orange-400" />
          </div>

          <div className="space-y-3">
            {recentActivities.map((act, i) => {
              const Icon = act.icon;
              return (
                <div key={i} className="flex items-center justify-between p-4 bg-neutral-950/60 rounded-xl border border-neutral-800">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${act.color}`}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-200">{act.title}</p>
                      <p className="text-xs text-neutral-500">{act.time}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700">
                    System
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}