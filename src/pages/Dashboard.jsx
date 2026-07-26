import React from "react";
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
} from "lucide-react";
import { Link } from "react-router-dom";
import { adminDashboardApi } from "../api/adminService";
import { CardSkeleton } from "../components/ui/Skeleton";

export default function Dashboard() {
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

  // Calculate rates and derived metrics
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

  const pendingUsers = (stats.totalUsers || 0) - (stats.verifiedUsers || 0);
  const pendingPets = stats.pendingPets || 0;
  const unverifiedUsers = (stats.totalUsers || 0) - (stats.adharVerifiedUsers || 0);

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers || 0,
      icon: Users,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      href: "/users",
    },
    {
      title: "Total Pets",
      value: stats.totalPets || 0,
      icon: PawPrint,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      href: "/pets",
    },
    {
      title: "Aadhar Verified",
      value: `${aadharRate}%`,
      subtitle: `${stats.adharVerifiedUsers || 0} users`,
      icon: ShieldCheck,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
      href: "/users",
    },
    {
      title: "Adoption Rate",
      value: `${adoptionRate}%`,
      subtitle: `${stats.adoptedPets || 0} pets adopted`,
      icon: Heart,
      color: "text-pink-400",
      bgColor: "bg-pink-500/10",
      borderColor: "border-pink-500/20",
      href: "/pets",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-neutral-50">Dashboard</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-800 rounded-lg border border-neutral-700">
          <Calendar size={14} className="text-neutral-400" />
          <span className="text-xs text-neutral-300">
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>


      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Link
            key={index}
            to={stat.href}
            className={`group bg-neutral-900 border ${stat.borderColor} rounded-2xl p-5 hover:border-orange-500/40 transition-all duration-300`}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-neutral-50 mt-1">
                  {stat.value}
                </p>
                {stat.subtitle && (
                  <p className="text-xs text-neutral-500 mt-0.5">{stat.subtitle}</p>
                )}
              </div>
              <div className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform`}>
                <stat.icon size={22} className={stat.color} />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1">
              <TrendingUp size={12} className="text-neutral-500" />
              <span className="text-xs text-neutral-500">View details</span>
            </div>
          </Link>
        ))}
      </div>

            {/* Quick Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-orange-500/10">
            <AlertCircle size={20} className="text-orange-400" />
          </div>
          <div>
            <p className="text-[10px] text-neutral-400 uppercase tracking-wide">Pending Pets</p>
            <p className="text-xl font-bold text-neutral-50 mt-0.5">{pendingPets}</p>
          </div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-yellow-500/10">
            <Clock size={20} className="text-yellow-400" />
          </div>
          <div>
            <p className="text-[10px] text-neutral-400 uppercase tracking-wide">Unverified Users</p>
            <p className="text-xl font-bold text-neutral-50 mt-0.5">{unverifiedUsers}</p>
          </div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-green-500/10">
            <CheckCircle size={20} className="text-green-400" />
          </div>
          <div>
            <p className="text-[10px] text-neutral-400 uppercase tracking-wide">Adopted Pets</p>
            <p className="text-xl font-bold text-neutral-50 mt-0.5">{stats.adoptedPets || 0}</p>
          </div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-blue-500/10">
            <Home size={20} className="text-blue-400" />
          </div>
          <div>
            <p className="text-[10px] text-neutral-400 uppercase tracking-wide">Ready for Adoption</p>
            <p className="text-xl font-bold text-neutral-50 mt-0.5">{stats.approvedPets || 0}</p>
          </div>
        </div>
      </div>

      {/* Three Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Actions */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-neutral-50">
              Pending Actions
            </h2>
            <Clock size={18} className="text-orange-400" />
          </div>

          <div className="space-y-3">
            <Link
              to="/users"
              className="flex items-center justify-between p-4 bg-neutral-800/50 rounded-xl hover:bg-neutral-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-500/10">
                  <UserPlus size={18} className="text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-200">
                    User Verifications
                  </p>
                  <p className="text-xs text-neutral-500">
                    {pendingUsers} email, {unverifiedUsers} Aadhar
                  </p>
                </div>
              </div>
              <div className="px-2.5 py-1 bg-yellow-500/10 text-yellow-400 text-xs font-semibold rounded-full">
                {pendingUsers + unverifiedUsers}
              </div>
            </Link>

            <Link
              to="/pets"
              className="flex items-center justify-between p-4 bg-neutral-800/50 rounded-xl hover:bg-neutral-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-500/10">
                  <PawPrint size={18} className="text-orange-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-200">
                    Pet Approvals
                  </p>
                  <p className="text-xs text-neutral-500">
                    {pendingPets} listings awaiting review
                  </p>
                </div>
              </div>
              <div className="px-2.5 py-1 bg-orange-500/10 text-orange-400 text-xs font-semibold rounded-full">
                {pendingPets}
              </div>
            </Link>
          </div>
        </div>

        {/* Verification Breakdown */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-neutral-50">
              Verification Breakdown
            </h2>
            <ShieldCheck size={18} className="text-emerald-400" />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-300">Email Verified</span>
                <span className="text-sm font-semibold text-neutral-100">
                  {stats.verifiedUsers || 0}/{stats.totalUsers || 0}
                </span>
              </div>
              <div className="h-2.5 bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
                  style={{ width: `${emailVerificationRate}%` }}
                />
              </div>
              <div className="flex justify-end">
                <span className="text-xs text-neutral-500">{emailVerificationRate}%</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-300">Aadhar Verified</span>
                <span className="text-sm font-semibold text-neutral-100">
                  {stats.adharVerifiedUsers || 0}/{stats.totalUsers || 0}
                </span>
              </div>
              <div className="h-2.5 bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                  style={{ width: `${aadharRate}%` }}
                />
              </div>
              <div className="flex justify-end">
                <span className="text-xs text-neutral-500">{aadharRate}%</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-300">Pets Approved</span>
                <span className="text-sm font-semibold text-neutral-100">
                  {stats.approvedPets || 0}/{stats.totalPets || 0}
                </span>
              </div>
              <div className="h-2.5 bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-400 rounded-full"
                  style={{ width: `${petApprovalRate}%` }}
                />
              </div>
              <div className="flex justify-end">
                <span className="text-xs text-neutral-500">{petApprovalRate}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pet Distribution */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-neutral-50">
              Pet Distribution
            </h2>
            <Activity size={18} className="text-purple-400" />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-neutral-800/50 rounded-xl">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-400" />
                <span className="text-sm text-neutral-300">Available</span>
              </div>
              <span className="text-sm font-semibold text-neutral-100">
                {stats.approvedPets || 0}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-neutral-800/50 rounded-xl">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <span className="text-sm text-neutral-300">Pending Approval</span>
              </div>
              <span className="text-sm font-semibold text-neutral-100">
                {pendingPets}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-neutral-800/50 rounded-xl">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="text-sm text-neutral-300">Adopted</span>
              </div>
              <span className="text-sm font-semibold text-neutral-100">
                {stats.adoptedPets || 0}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-neutral-800/50 rounded-xl">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-400" />
                <span className="text-sm text-neutral-300">Total Listings</span>
              </div>
              <span className="text-sm font-semibold text-neutral-100">
                {stats.totalPets || 0}
              </span>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}