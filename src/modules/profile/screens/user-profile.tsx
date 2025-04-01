import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { Outlet } from 'react-router-dom';

const UserProfileScreen: React.FC = () => {
  const { user: fb_user } = useAuth();

  if (!fb_user) return null;

  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Profile</CardTitle>
          <CardDescription>Manage your personal information</CardDescription>
        </CardHeader>

        <CardContent>
          <Outlet />
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfileScreen;
