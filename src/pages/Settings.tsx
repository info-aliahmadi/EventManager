import React from 'react';
import { User, Bell, Shield, Palette, Globe, CreditCard, Mail, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/sonner';

const Settings = () => {
  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="space-y-6 w-full mx-auto max-w-5xl">
      <h1 className="text-2xl font-semibold">Settings</h1>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-auto">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Billing</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Manage your personal information and account settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="flex flex-col items-center gap-2">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">Change Photo</Button>
                </div>
                
                <div className="grid gap-4 flex-1">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue="Sarah Johnson" />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue="sarah.j@example.com" />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" defaultValue="+971 55 123 4567" />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="bio">About</Label>
                  <Textarea 
                    id="bio" 
                    rows={4}
                    defaultValue="Event manager and organizer for Rumba events. Passionate about creating memorable dance experiences."
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Select defaultValue="manager">
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="manager">Event Manager</SelectItem>
                      <SelectItem value="analyst">Financial Analyst</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your password and security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
              
              <div className="flex items-center justify-between pt-4">
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="two-factor">Two-factor Authentication</Label>
                  <span className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </span>
                </div>
                <Switch id="two-factor" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSave}>
                <Shield className="mr-2 h-4 w-4" />
                Update Security
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose what notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="email-notifs">Email Notifications</Label>
                  <span className="text-sm text-muted-foreground">
                    Receive email notifications for important events
                  </span>
                </div>
                <Switch id="email-notifs" defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between py-2">
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="financial-updates">Financial Updates</Label>
                  <span className="text-sm text-muted-foreground">
                    Notifications about revenue and expense changes
                  </span>
                </div>
                <Switch id="financial-updates" defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between py-2">
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="event-reminders">Event Reminders</Label>
                  <span className="text-sm text-muted-foreground">
                    Reminders about upcoming events
                  </span>
                </div>
                <Switch id="event-reminders" defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between py-2">
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="marketing-emails">Marketing Emails</Label>
                  <span className="text-sm text-muted-foreground">
                    Receive promotional emails and updates
                  </span>
                </div>
                <Switch id="marketing-emails" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSave}>
                <Bell className="mr-2 h-4 w-4" />
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize the look and feel of your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="theme">Theme</Label>
                <Select defaultValue="system">
                  <SelectTrigger id="theme">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2 pt-4">
                <Label htmlFor="language">Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ar">Arabic</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between pt-4">
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="dense-mode">Dense Mode</Label>
                  <span className="text-sm text-muted-foreground">
                    Compact UI with less whitespace
                  </span>
                </div>
                <Switch id="dense-mode" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSave}>
                <Palette className="mr-2 h-4 w-4" />
                Save Appearance
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>
                Manage your billing details and subscription
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="plan">Current Plan</Label>
                <div className="flex items-center justify-between border rounded-md p-3">
                  <div>
                    <h3 className="font-medium">Pro Plan</h3>
                    <p className="text-sm text-muted-foreground">All features included</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
                </div>
              </div>
              
              <div className="grid gap-2 pt-4">
                <Label htmlFor="payment-method">Payment Method</Label>
                <div className="flex items-center border rounded-md p-3">
                  <div className="mr-4 h-10 w-14 rounded border flex items-center justify-center bg-slate-50">
                    <CreditCard className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">•••• •••• •••• 4242</p>
                    <p className="text-sm text-muted-foreground">Expires 12/2025</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="mt-2 w-fit">
                  Update Payment Method
                </Button>
              </div>
              
              <div className="grid gap-2 pt-4">
                <Label htmlFor="billing-address">Billing Address</Label>
                <Textarea 
                  id="billing-address" 
                  rows={3}
                  defaultValue="123 Business Center, Dubai Media City, Dubai, UAE"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" className="text-destructive hover:bg-destructive/10">
                Cancel Subscription
              </Button>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Billing Info
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings; 