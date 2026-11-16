import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/layouts/AppLayout';
import { LoginGateway } from '@/features/gateway/LoginGateway';
import { HospitalAuthorityView } from '@/features/hospital/HospitalAuthorityView';
import { DoctorWorkspaceView } from '@/features/doctor/DoctorWorkspaceView';
import { PatientPortalView } from '@/features/patient/PatientPortalView';
import { StaffOperationsView } from '@/features/staff/StaffOperationsView';
import { CustomerCareView } from '@/features/customer-care/CustomerCareView';
import { PlatformAdminView } from '@/features/platform-admin/PlatformAdminView';
import { RouteErrorBoundary } from '@/components/ui/RouteErrorBoundary';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginGateway />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: '/gateway',
    element: <LoginGateway />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: '/login',
    element: <LoginGateway />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: 'hospital',
        element: <HospitalAuthorityView />,
      },
      {
        path: 'doctor',
        element: <DoctorWorkspaceView />,
      },
      {
        path: 'patient',
        element: <PatientPortalView />,
      },
      {
        path: 'staff',
        element: <StaffOperationsView />,
      },
      {
        path: 'support',
        element: <CustomerCareView />,
      },
      {
        path: 'admin',
        element: <PlatformAdminView />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
