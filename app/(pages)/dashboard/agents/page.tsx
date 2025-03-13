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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Plus, 
  Bot, 
  Trash2, 
  Copy, 
  Pencil, 
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  RefreshCw
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Id } from "@/convex/_generated/dataModel";

// Mock data for agents
const mockAgents = [
  {
    _id: "agent1" as Id<"agents">,
    name: "Customer Service Agent",
    description: "Handles customer inquiries and support requests",
    instructions: "You are a helpful customer service agent. Your job is to assist customers with their inquiries and resolve their issues in a friendly and professional manner. If you don't know the answer, refer to the FAQs or escalate to a human agent.",
    model: "gpt-4o",
    temperature: 0.7,
    isActive: true,
    stats: {
      messagesHandled: 156,
      avgResponseTime: "45s",
      positiveRating: 92,
    }
  },
  {
    _id: "agent2" as Id<"agents">,
    name: "Sales Representative",
    description: "Handles sales inquiries and product recommendations",
    instructions: "You are a knowledgeable sales representative. Your goal is to help customers find the right products for their needs and assist with purchase decisions. Be informative about product features and benefits, but never pushy.",
    model: "gpt-4o",
    temperature: 0.5,
    isActive: true,
    stats: {
      messagesHandled: 98,
      avgResponseTime: "37s",
      positiveRating: 88,
    }
  },
  {
    _id: "agent3" as Id<"agents">,
    name: "Content Creator",
    description: "Creates and schedules social media content",
    instructions: "You are a creative content specialist. Your job is to draft engaging social media posts that align with the brand voice and marketing goals. Focus on creating content that drives engagement and highlights product benefits.",
    model: "claude-3-haiku",
    temperature: 0.8,
    isActive: false,
    stats: {
      messagesHandled: 45,
      avgResponseTime: "2m 10s",
      positiveRating: 95,
    }
  }
];

// OpenAI models
const AI_MODELS = [
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", provider: "OpenAI" },
  { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI" },
  { id: "claude-3-opus", name: "Claude 3 Opus", provider: "Anthropic" },
  { id: "claude-3-sonnet", name: "Claude 3 Sonnet", provider: "Anthropic" },
  { id: "claude-3-haiku", name: "Claude 3 Haiku", provider: "Anthropic" },
];

export default function AgentsPage() {
  const [agents, setAgents] = useState(mockAgents);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState<Id<"agents"> | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    instructions: "",
    model: "gpt-4o",
    temperature: 0.7,
  });

  const handleFormChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      instructions: "",
      model: "gpt-4o",
      temperature: 0.7,
    });
  };

  const handleCreateAgent = () => {
    const newAgent = {
      _id: `agent${agents.length + 1}` as Id<"agents">,
      ...formData,
      isActive: true,
      stats: {
        messagesHandled: 0,
        avgResponseTime: "0s",
        positiveRating: 0,
      }
    };
    
    setAgents([...agents, newAgent]);
    setIsCreating(false);
    resetForm();
  };

  const handleEditAgent = () => {
    if (!isEditing) return;
    
    const updatedAgents = agents.map(agent => 
      agent._id === isEditing ? { ...agent, ...formData } : agent
    );
    
    setAgents(updatedAgents);
    setIsEditing(null);
    resetForm();
  };

  const handleDeleteAgent = (id: Id<"agents">) => {
    setAgents(agents.filter(agent => agent._id !== id));
  };

  const handleToggleActive = (id: Id<"agents">) => {
    setAgents(agents.map(agent => 
      agent._id === id ? { ...agent, isActive: !agent.isActive } : agent
    ));
  };

  const startEdit = (agent: typeof agents[0]) => {
    setFormData({
      name: agent.name,
      description: agent.description,
      instructions: agent.instructions,
      model: agent.model,
      temperature: agent.temperature,
    });
    setIsEditing(agent._id);
  };

  const duplicateAgent = (agent: typeof agents[0]) => {
    // Destructure to separate _id from other properties
    const { _id, ...agentWithoutId } = agent;
    
    const newAgent = {
      _id: `agent${agents.length + 1}` as Id<"agents">,
      ...agentWithoutId,
      name: `${agent.name} (Copy)`,
      isActive: false,
    };
    
    setAgents([...agents, newAgent]);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">AI Agents</h1>
        <p className="text-muted-foreground mt-2">
          Create and manage AI agents with custom instructions
        </p>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Your Agents</h2>
        
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> New Agent
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Agent</DialogTitle>
              <DialogDescription>
                Configure your AI agent's personality and behavior
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-3">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Agent Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Customer Support Agent"
                    value={formData.name}
                    onChange={(e) => handleFormChange("name", e.target.value)}
                  />
                </div>
                
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="What this agent does"
                    value={formData.description}
                    onChange={(e) => handleFormChange("description", e.target.value)}
                  />
                </div>
                
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="instructions">Instructions</Label>
                  <Textarea
                    id="instructions"
                    placeholder="Detailed instructions for how the agent should behave..."
                    rows={8}
                    value={formData.instructions}
                    onChange={(e) => handleFormChange("instructions", e.target.value)}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Provide clear instructions about the agent's role, tone, knowledge boundaries, and how to handle different scenarios.
                  </p>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="model">AI Model</Label>
                    <Select 
                      value={formData.model} 
                      onValueChange={(value) => handleFormChange("model", value)}
                    >
                      <SelectTrigger id="model">
                        <SelectValue placeholder="Select a model" />
                      </SelectTrigger>
                      <SelectContent>
                        {AI_MODELS.map(model => (
                          <SelectItem key={model.id} value={model.id}>
                            {model.name} ({model.provider})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="temperature">
                      Temperature: {formData.temperature}
                    </Label>
                    <Input
                      id="temperature"
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={formData.temperature}
                      onChange={(e) => handleFormChange("temperature", parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Precise</span>
                      <span>Creative</span>
                    </div>
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
              <Button onClick={handleCreateAgent}>Create Agent</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Dialog open={isEditing !== null} onOpenChange={(open) => !open && setIsEditing(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Agent</DialogTitle>
              <DialogDescription>
                Update your AI agent's configuration
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-3">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="edit-name">Agent Name</Label>
                  <Input
                    id="edit-name"
                    placeholder="e.g., Customer Support Agent"
                    value={formData.name}
                    onChange={(e) => handleFormChange("name", e.target.value)}
                  />
                </div>
                
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="edit-description">Description</Label>
                  <Input
                    id="edit-description"
                    placeholder="What this agent does"
                    value={formData.description}
                    onChange={(e) => handleFormChange("description", e.target.value)}
                  />
                </div>
                
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="edit-instructions">Instructions</Label>
                  <Textarea
                    id="edit-instructions"
                    placeholder="Detailed instructions for how the agent should behave..."
                    rows={8}
                    value={formData.instructions}
                    onChange={(e) => handleFormChange("instructions", e.target.value)}
                    className="resize-none"
                  />
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="edit-model">AI Model</Label>
                    <Select 
                      value={formData.model} 
                      onValueChange={(value) => handleFormChange("model", value)}
                    >
                      <SelectTrigger id="edit-model">
                        <SelectValue placeholder="Select a model" />
                      </SelectTrigger>
                      <SelectContent>
                        {AI_MODELS.map(model => (
                          <SelectItem key={model.id} value={model.id}>
                            {model.name} ({model.provider})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="edit-temperature">
                      Temperature: {formData.temperature}
                    </Label>
                    <Input
                      id="edit-temperature"
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={formData.temperature}
                      onChange={(e) => handleFormChange("temperature", parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Precise</span>
                      <span>Creative</span>
                    </div>
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
              <Button onClick={handleEditAgent}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <Card key={agent._id} className={`border-l-4 ${agent.isActive ? 'border-l-green-500' : 'border-l-gray-300'}`}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  <span>{agent.name}</span>
                </div>
                <Switch 
                  checked={agent.isActive} 
                  onCheckedChange={() => handleToggleActive(agent._id)}
                />
              </CardTitle>
              <CardDescription>{agent.description}</CardDescription>
            </CardHeader>
            
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="instructions">
                  <AccordionTrigger className="text-sm font-medium">
                    Agent Instructions
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="bg-muted/50 p-3 rounded-md text-sm max-h-48 overflow-y-auto">
                      {agent.instructions}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="stats">
                  <AccordionTrigger className="text-sm font-medium">
                    Performance Stats
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Messages Handled</span>
                        <span>{agent.stats.messagesHandled}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Avg. Response Time</span>
                        <span>{agent.stats.avgResponseTime}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Positive Rating</span>
                        <span>{agent.stats.positiveRating}%</span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="technical">
                  <AccordionTrigger className="text-sm font-medium">
                    Technical Details
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Model</span>
                        <span>{agent.model}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Temperature</span>
                        <span>{agent.temperature}</span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => duplicateAgent(agent)}
              >
                <Copy className="h-4 w-4 mr-1" /> Clone
              </Button>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startEdit(agent)}
                >
                  <Pencil className="h-4 w-4 mr-1" /> Edit
                </Button>
                
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteAgent(agent._id)}
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
