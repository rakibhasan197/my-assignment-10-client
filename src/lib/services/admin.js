import { apiGet, apiPatch, apiDelete } from "@/lib/api";

// Dashboard Overview
export const getAdminOverview = () =>
  apiGet("/api/admin/overview");

// Startups
export const getAllStartups = () =>
  apiGet("/api/admin/startups");

export const approveStartup = (id) =>
  apiPatch(`/api/admin/startups/${id}/approve`);

export const rejectStartup = (id) =>
  apiPatch(`/api/admin/startups/${id}/reject`);

export const deleteStartup = (id) =>
  apiDelete(`/api/admin/startups/${id}`);

// Opportunities
export const getAllOpportunities = () =>
  apiGet("/api/admin/opportunities");

export const deleteOpportunity = (id) =>
  apiDelete(`/api/admin/opportunities/${id}`);

// Payments
export const getAllPayments = () =>
  apiGet("/api/admin/payments");