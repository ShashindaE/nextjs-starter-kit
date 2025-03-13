"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PlusCircle, Trash2, RefreshCw, BarChart3 } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

// Mock data for platforms that can be integrated
const PLATFORMS = [
  { id: "twitter", name: "Twitter", icon: "twitter.svg" },
  { id: "instagram", name: "Instagram", icon: "instagram.svg" },
  { id: "facebook", name: "Facebook", icon: "facebook.svg" },
  { id: "linkedin", name: "LinkedIn", icon: "linkedin.svg" },
  { id: "whatsapp", name: "WhatsApp", icon: "whatsapp.svg" },
];

export default function IntegrationsPage() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  // We would normally use this to fetch actual integrations
  // const integrations = useQuery(api.integrations.listIntegrations) || [];

  // Mock integrations data for demonstration
  const mockIntegrations = [
    {
      _id: "mock1" as Id<"integrations">,
      platformId: "twitter",
      platformName: "Twitter",
      isActive: true,
      metadata: {
        profileName: "@business_account",
        followerCount: 1245,
        lastSync: "2025-03-13T10:30:00Z",
      },
    },
    {
      _id: "mock2" as Id<"integrations">,
      platformId: "facebook",
      platformName: "Facebook",
      isActive: true,
      metadata: {
        profileName: "Business Page",
        followerCount: 5432,
        lastSync: "2025-03-12T14:20:00Z",
      },
    },
  ];

  const integrations = mockIntegrations;

  // Function to handle connecting to a platform via Unipile
  const connectToPlatform = async (platformId: string) => {
    setIsConnecting(true);
    
    try {
      // In a real implementation, this would initiate the Unipile OAuth flow
      console.log(`Connecting to ${platformId} via Unipile`);
      
      // Simulate API call to Unipile
      // const authUrl = await unipileClient.getAuthorizationUrl({
      //   provider: platformId,
      //   redirectUri: `${window.location.origin}/api/unipile/callback`,
      //   state: JSON.stringify({ platformId }),
      // });
      
      // window.location.href = authUrl;
      
      // For demo, we'll just show a loading state
      setTimeout(() => {
        setIsConnecting(false);
        // In a real app, the redirect would happen before this timeout completes
      }, 2000);
      
    } catch (error) {
      console.error("Failed to connect:", error);
      setIsConnecting(false);
    }
  };

  // Function to handle platform disconnect
  const disconnectPlatform = async (integrationId: Id<"integrations">) => {
    try {
      // In a real app, we would call the Convex mutation to delete the integration
      // await deleteMutation({ id: integrationId });
      console.log(`Disconnecting integration ${integrationId}`);
    } catch (error) {
      console.error("Failed to disconnect:", error);
    }
  };

  // Function to handle refreshing the integration
  const refreshIntegration = async (integrationId: Id<"integrations">) => {
    try {
      // In a real app, we would call the Convex mutation to refresh the integration
      console.log(`Refreshing integration ${integrationId}`);
    } catch (error) {
      console.error("Failed to refresh:", error);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Integrations</h1>
        <p className="text-muted-foreground mt-2">
          Connect and manage your social media accounts
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Card to add new integration */}
        <Dialog>
          <DialogTrigger asChild>
            <Card className="cursor-pointer hover:shadow-md transition-shadow border-dashed">
              <CardHeader className="flex flex-row items-center justify-center pb-2 pt-6">
                <CardTitle className="text-center text-muted-foreground">
                  <PlusCircle className="h-12 w-12 mx-auto" />
                  <span className="block mt-2">Connect New Platform</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center pb-6">
                <p className="text-xs text-muted-foreground px-4">
                  Add a new social media or messaging platform to automate your communications
                </p>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Connect a platform</DialogTitle>
              <DialogDescription>
                Select a social media or messaging platform to connect via Unipile.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                {PLATFORMS.map((platform) => (
                  <Button
                    key={platform.id}
                    variant={selectedPlatform === platform.id ? "default" : "outline"}
                    className="h-20 flex-col space-y-2"
                    onClick={() => setSelectedPlatform(platform.id)}
                  >
                    <span>{platform.name}</span>
                  </Button>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setSelectedPlatform(null)}
              >
                Cancel
              </Button>
              <Button 
                onClick={() => selectedPlatform && connectToPlatform(selectedPlatform)}
                disabled={!selectedPlatform || isConnecting}
              >
                {isConnecting ? "Connecting..." : "Connect"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Connected integrations */}
        {integrations.map((integration) => (
          <Card key={integration._id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{integration.platformName}</span>
                <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 py-1 px-2 rounded-full">
                  Connected
                </span>
              </CardTitle>
              <CardDescription>
                {integration.metadata.profileName}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Followers</span>
                  <span>{integration.metadata.followerCount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Synced</span>
                  <span>{new Date(integration.metadata.lastSync).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => refreshIntegration(integration._id)}
                  title="Refresh"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  title="Analytics"
                >
                  <BarChart3 className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => disconnectPlatform(integration._id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Disconnect
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Analytics Section */}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-4">Platform Analytics</h2>
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Overview</CardTitle>
                <CardDescription>
                  Combined statistics from all connected platforms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-primary/10 rounded-lg p-4">
                    <h3 className="font-medium text-sm text-muted-foreground">Total Followers</h3>
                    <p className="text-2xl font-bold">6,677</p>
                    <p className="text-xs text-green-600">+2.5% from last month</p>
                  </div>
                  <div className="bg-primary/10 rounded-lg p-4">
                    <h3 className="font-medium text-sm text-muted-foreground">Messages Handled</h3>
                    <p className="text-2xl font-bold">253</p>
                    <p className="text-xs text-green-600">+15% from last month</p>
                  </div>
                  <div className="bg-primary/10 rounded-lg p-4">
                    <h3 className="font-medium text-sm text-muted-foreground">Response Rate</h3>
                    <p className="text-2xl font-bold">98.2%</p>
                    <p className="text-xs text-green-600">+5.3% from last month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="messages" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Message Statistics</CardTitle>
                <CardDescription>
                  Details about messages across platforms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Message analytics content will appear here</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="engagement" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Metrics</CardTitle>
                <CardDescription>
                  Interaction data from your audiences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Engagement analytics content will appear here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
