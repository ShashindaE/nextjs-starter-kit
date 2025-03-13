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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Pencil, Trash2, Copy, Tag } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { Switch } from "@/components/ui/switch";

export default function FAQsUpdatesPage() {
  const [activeTab, setActiveTab] = useState("faqs");
  
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">FAQs & Updates</h1>
        <p className="text-muted-foreground mt-2">
          Manage frequently asked questions and business updates
        </p>
      </div>

      <Tabs defaultValue="faqs" onValueChange={setActiveTab}>
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
          <TabsTrigger value="updates">Updates</TabsTrigger>
        </TabsList>

        <TabsContent value="faqs" className="mt-6">
          <FAQsTab />
        </TabsContent>

        <TabsContent value="updates" className="mt-6">
          <UpdatesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Mock data for FAQs
const mockFaqs = [
  {
    _id: "faq1" as Id<"faqs">,
    question: "How do I connect my social media accounts?",
    answer: "You can connect your social media accounts by navigating to the Integrations page and clicking on the 'Connect New Platform' button. Then follow the authentication steps for your desired platform.",
    keywords: ["connect", "account", "social media", "integration"],
    agentId: "agent1" as Id<"agents">,
    agentName: "Customer Service Agent",
    category: "Account",
    isActive: true,
    createdAt: "2025-02-15T10:30:00Z",
    updatedAt: "2025-02-15T10:30:00Z",
  },
  {
    _id: "faq2" as Id<"faqs">,
    question: "What do I do if an automation isn't working?",
    answer: "If an automation isn't working, first check if the connected platform is still authorized. Then verify the automation flow for any errors. If problems persist, you can contact our support team.",
    keywords: ["automation", "not working", "error", "troubleshoot"],
    agentId: "agent1" as Id<"agents">,
    agentName: "Customer Service Agent",
    category: "Troubleshooting",
    isActive: true,
    createdAt: "2025-02-20T14:45:00Z",
    updatedAt: "2025-03-05T09:15:00Z",
  },
  {
    _id: "faq3" as Id<"faqs">,
    question: "How can I upgrade my subscription?",
    answer: "To upgrade your subscription, go to the Settings page and select the 'Subscription' tab. From there, you can view available plans and select the one that best suits your needs.",
    keywords: ["upgrade", "subscription", "plan", "billing"],
    agentId: "agent2" as Id<"agents">,
    agentName: "Sales Representative",
    category: "Billing",
    isActive: true,
    createdAt: "2025-03-01T11:20:00Z",
    updatedAt: "2025-03-01T11:20:00Z",
  },
];

// Mock data for updates
const mockUpdates = [
  {
    _id: "update1" as Id<"updates">,
    title: "New Feature: Enhanced Analytics",
    content: "We've added enhanced analytics to help you better understand your audience engagement across all platforms. Visit the Integrations page to explore the new metrics.",
    category: "Feature Update",
    isActive: true,
    scheduledAt: "2025-03-10T09:00:00Z",
    publishedAt: "2025-03-10T09:00:00Z",
    createdAt: "2025-03-05T15:30:00Z",
    updatedAt: "2025-03-05T15:30:00Z",
  },
  {
    _id: "update2" as Id<"updates">,
    title: "System Maintenance Notice",
    content: "We will be performing system maintenance on March 20th from 2:00 AM to 4:00 AM UTC. During this time, some features may be temporarily unavailable.",
    category: "Maintenance",
    isActive: true,
    scheduledAt: "2025-03-15T12:00:00Z",
    publishedAt: "2025-03-15T12:00:00Z",
    createdAt: "2025-03-12T10:45:00Z",
    updatedAt: "2025-03-12T10:45:00Z",
  },
  {
    _id: "update3" as Id<"updates">,
    title: "Holiday Support Hours",
    content: "Our support team will be operating with limited availability during the upcoming holiday season. Please check our support page for detailed hours.",
    category: "Announcement",
    isActive: false,
    scheduledAt: "2025-04-01T08:00:00Z",
    publishedAt: null,
    createdAt: "2025-03-20T16:15:00Z",
    updatedAt: "2025-03-20T16:15:00Z",
  },
];

// Mock data for agents
const mockAgents = [
  { _id: "agent1" as Id<"agents">, name: "Customer Service Agent" },
  { _id: "agent2" as Id<"agents">, name: "Sales Representative" },
  { _id: "agent3" as Id<"agents">, name: "Content Creator" },
];

function FAQsTab() {
  const [faqs, setFaqs] = useState(mockFaqs);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState<Id<"faqs"> | null>(null);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    keywords: "",
    agentId: "",
    category: "",
  });

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      question: "",
      answer: "",
      keywords: "",
      agentId: "",
      category: "",
    });
  };

  const handleCreateFaq = () => {
    const newFaq = {
      _id: `faq${faqs.length + 1}` as Id<"faqs">,
      question: formData.question,
      answer: formData.answer,
      keywords: formData.keywords.split(',').map(k => k.trim()),
      agentId: formData.agentId as Id<"agents">,
      agentName: mockAgents.find(a => a._id === formData.agentId)?.name || "",
      category: formData.category,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setFaqs([...faqs, newFaq]);
    setIsCreating(false);
    resetForm();
  };

  const handleEditFaq = () => {
    if (!isEditing) return;
    
    const updatedFaqs = faqs.map(faq => {
      if (faq._id === isEditing) {
        const agentName = mockAgents.find(a => a._id === formData.agentId)?.name || faq.agentName;
        return {
          ...faq,
          question: formData.question,
          answer: formData.answer,
          keywords: typeof formData.keywords === 'string' 
            ? formData.keywords.split(',').map(k => k.trim())
            : formData.keywords,
          agentId: formData.agentId as Id<"agents"> || faq.agentId,
          agentName,
          category: formData.category || faq.category,
          updatedAt: new Date().toISOString(),
        };
      }
      return faq;
    });
    
    setFaqs(updatedFaqs);
    setIsEditing(null);
    resetForm();
  };

  const handleDeleteFaq = (id: Id<"faqs">) => {
    setFaqs(faqs.filter(faq => faq._id !== id));
  };

  const startEdit = (faq: typeof faqs[0]) => {
    setFormData({
      question: faq.question,
      answer: faq.answer,
      keywords: Array.isArray(faq.keywords) ? faq.keywords.join(', ') : faq.keywords,
      agentId: faq.agentId,
      category: faq.category,
    });
    setIsEditing(faq._id);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
        
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" /> Add FAQ
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New FAQ</DialogTitle>
              <DialogDescription>
                Add a new frequently asked question to your knowledge base
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-3">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="question">Question</Label>
                  <Input
                    id="question"
                    placeholder="Enter the frequently asked question"
                    value={formData.question}
                    onChange={(e) => handleFormChange("question", e.target.value)}
                  />
                </div>
                
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="answer">Answer</Label>
                  <Textarea
                    id="answer"
                    placeholder="Provide a detailed answer to the question"
                    rows={5}
                    value={formData.answer}
                    onChange={(e) => handleFormChange("answer", e.target.value)}
                  />
                </div>
                
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="keywords">Keywords (comma separated)</Label>
                  <Input
                    id="keywords"
                    placeholder="e.g., account, login, password"
                    value={formData.keywords}
                    onChange={(e) => handleFormChange("keywords", e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="agent">Assign to Agent</Label>
                    <Select 
                      value={formData.agentId} 
                      onValueChange={(value) => handleFormChange("agentId", value)}
                    >
                      <SelectTrigger id="agent">
                        <SelectValue placeholder="Select an agent" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockAgents.map(agent => (
                          <SelectItem key={agent._id} value={agent._id}>
                            {agent.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => handleFormChange("category", value)}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Account">Account</SelectItem>
                        <SelectItem value="Billing">Billing</SelectItem>
                        <SelectItem value="Technical">Technical</SelectItem>
                        <SelectItem value="Features">Features</SelectItem>
                        <SelectItem value="Troubleshooting">Troubleshooting</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                resetForm();
                setIsCreating(false);
              }}>
                Cancel
              </Button>
              <Button onClick={handleCreateFaq}>Create FAQ</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Dialog open={isEditing !== null} onOpenChange={(open) => !open && setIsEditing(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit FAQ</DialogTitle>
              <DialogDescription>
                Update this frequently asked question
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-3">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="edit-question">Question</Label>
                  <Input
                    id="edit-question"
                    placeholder="Enter the frequently asked question"
                    value={formData.question}
                    onChange={(e) => handleFormChange("question", e.target.value)}
                  />
                </div>
                
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="edit-answer">Answer</Label>
                  <Textarea
                    id="edit-answer"
                    placeholder="Provide a detailed answer to the question"
                    rows={5}
                    value={formData.answer}
                    onChange={(e) => handleFormChange("answer", e.target.value)}
                  />
                </div>
                
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="edit-keywords">Keywords (comma separated)</Label>
                  <Input
                    id="edit-keywords"
                    placeholder="e.g., account, login, password"
                    value={formData.keywords}
                    onChange={(e) => handleFormChange("keywords", e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="edit-agent">Assign to Agent</Label>
                    <Select 
                      value={formData.agentId} 
                      onValueChange={(value) => handleFormChange("agentId", value)}
                    >
                      <SelectTrigger id="edit-agent">
                        <SelectValue placeholder="Select an agent" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockAgents.map(agent => (
                          <SelectItem key={agent._id} value={agent._id}>
                            {agent.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="edit-category">Category</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => handleFormChange("category", value)}
                    >
                      <SelectTrigger id="edit-category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Account">Account</SelectItem>
                        <SelectItem value="Billing">Billing</SelectItem>
                        <SelectItem value="Technical">Technical</SelectItem>
                        <SelectItem value="Features">Features</SelectItem>
                        <SelectItem value="Troubleshooting">Troubleshooting</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                resetForm();
                setIsEditing(null);
              }}>
                Cancel
              </Button>
              <Button onClick={handleEditFaq}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {faqs.map((faq) => (
          <Card key={faq._id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{faq.question}</span>
                <div className="flex items-center">
                  <span className="text-xs bg-primary/10 text-primary py-1 px-2 rounded-full">
                    {faq.category}
                  </span>
                </div>
              </CardTitle>
              <CardDescription>
                Assigned to: {faq.agentName}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm">{faq.answer}</p>
                <div className="flex flex-wrap gap-2">
                  {faq.keywords.map((keyword, index) => (
                    <span 
                      key={index} 
                      className="text-xs bg-muted px-2 py-1 rounded-full flex items-center"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <div className="text-xs text-muted-foreground">
                Last updated: {new Date(faq.updatedAt).toLocaleDateString()}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startEdit(faq)}
                >
                  <Pencil className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteFaq(faq._id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

function UpdatesTab() {
  const [updates, setUpdates] = useState(mockUpdates);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState<Id<"updates"> | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    isActive: true,
    scheduledAt: new Date().toISOString().slice(0, 16)
  });

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      category: "",
      isActive: true,
      scheduledAt: new Date().toISOString().slice(0, 16)
    });
  };

  const handleCreateUpdate = () => {
    const newUpdate = {
      _id: `update${updates.length + 1}` as Id<"updates">,
      title: formData.title,
      content: formData.content,
      category: formData.category,
      isActive: formData.isActive,
      scheduledAt: formData.scheduledAt,
      publishedAt: formData.isActive ? new Date().toISOString() : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setUpdates([...updates, newUpdate]);
    setIsCreating(false);
    resetForm();
  };

  const handleEditUpdate = () => {
    if (!isEditing) return;
    
    const updatedUpdates = updates.map(update => {
      if (update._id === isEditing) {
        return {
          ...update,
          title: formData.title,
          content: formData.content,
          category: formData.category || update.category,
          isActive: formData.isActive,
          scheduledAt: formData.scheduledAt,
          publishedAt: formData.isActive ? (update.publishedAt || new Date().toISOString()) : null,
          updatedAt: new Date().toISOString(),
        };
      }
      return update;
    });
    
    setUpdates(updatedUpdates);
    setIsEditing(null);
    resetForm();
  };

  const handleDeleteUpdate = (id: Id<"updates">) => {
    setUpdates(updates.filter(update => update._id !== id));
  };

  const startEdit = (update: typeof updates[0]) => {
    setFormData({
      title: update.title,
      content: update.content,
      category: update.category,
      isActive: update.isActive,
      scheduledAt: new Date(update.scheduledAt).toISOString().slice(0, 16)
    });
    setIsEditing(update._id);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Business Updates</h2>
        
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" /> Add Update
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Business Update</DialogTitle>
              <DialogDescription>
                Add a new update or announcement for your business
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-3">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter the update title"
                    value={formData.title}
                    onChange={(e) => handleFormChange("title", e.target.value)}
                  />
                </div>
                
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Provide the update details"
                    rows={5}
                    value={formData.content}
                    onChange={(e) => handleFormChange("content", e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => handleFormChange("category", value)}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Feature Update">Feature Update</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                        <SelectItem value="Announcement">Announcement</SelectItem>
                        <SelectItem value="Promotion">Promotion</SelectItem>
                        <SelectItem value="News">News</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="scheduled-at">Schedule For</Label>
                    <Input
                      id="scheduled-at"
                      type="datetime-local"
                      value={formData.scheduledAt}
                      onChange={(e) => handleFormChange("scheduledAt", e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="publish-now"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => handleFormChange("isActive", checked)}
                  />
                  <Label htmlFor="publish-now">Publish immediately</Label>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                resetForm();
                setIsCreating(false);
              }}>
                Cancel
              </Button>
              <Button onClick={handleCreateUpdate}>Create Update</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Dialog open={isEditing !== null} onOpenChange={(open) => !open && setIsEditing(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Business Update</DialogTitle>
              <DialogDescription>
                Modify this business update or announcement
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-3">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    placeholder="Enter the update title"
                    value={formData.title}
                    onChange={(e) => handleFormChange("title", e.target.value)}
                  />
                </div>
                
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="edit-content">Content</Label>
                  <Textarea
                    id="edit-content"
                    placeholder="Provide the update details"
                    rows={5}
                    value={formData.content}
                    onChange={(e) => handleFormChange("content", e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="edit-category">Category</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => handleFormChange("category", value)}
                    >
                      <SelectTrigger id="edit-category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Feature Update">Feature Update</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                        <SelectItem value="Announcement">Announcement</SelectItem>
                        <SelectItem value="Promotion">Promotion</SelectItem>
                        <SelectItem value="News">News</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="edit-scheduled-at">Schedule For</Label>
                    <Input
                      id="edit-scheduled-at"
                      type="datetime-local"
                      value={formData.scheduledAt}
                      onChange={(e) => handleFormChange("scheduledAt", e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-publish-now"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => handleFormChange("isActive", checked)}
                  />
                  <Label htmlFor="edit-publish-now">
                    {formData.isActive ? "Published" : "Scheduled"}
                  </Label>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                resetForm();
                setIsEditing(null);
              }}>
                Cancel
              </Button>
              <Button onClick={handleEditUpdate}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid gap-4">
        {updates.map((update) => (
          <Card key={update._id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{update.title}</span>
                <div className="flex items-center">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    update.isActive 
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                      : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                  }`}>
                    {update.isActive ? 'Published' : 'Scheduled'}
                  </span>
                </div>
              </CardTitle>
              <CardDescription>
                Category: {update.category}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <p className="text-sm">{update.content}</p>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <div className="text-xs text-muted-foreground">
                {update.publishedAt 
                  ? `Published: ${new Date(update.publishedAt).toLocaleDateString()}` 
                  : `Scheduled: ${new Date(update.scheduledAt).toLocaleDateString()}`}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startEdit(update)}
                >
                  <Pencil className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteUpdate(update._id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
