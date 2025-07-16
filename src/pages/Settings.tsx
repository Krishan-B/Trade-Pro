import React from 'react';
import { MainLayout } from '@/components/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SecuritySettings } from '@/components/account/SecuritySettings';
import { NotificationPreferences } from '@/components/account/NotificationPreferences';
import { ThemeSwitcher } from '@/components/theme/ThemeSwitcher';

const Settings = () => {
  return (
    <MainLayout>
      <div className="p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        <Tabs defaultValue="security" className="flex flex-col md:flex-row gap-6">
          <TabsList className="flex flex-col h-full w-full md:flex-row md:w-auto">
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="theme">Theme</TabsTrigger>
          </TabsList>
          <div className="flex-1">
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <SecuritySettings />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <NotificationPreferences />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="theme">
              <Card>
                <CardHeader>
                  <CardTitle>Theme Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <ThemeSwitcher />
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;