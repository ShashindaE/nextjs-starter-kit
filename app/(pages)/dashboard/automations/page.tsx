"use client"

import { useState, useCallback, useRef } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  MarkerType,
  NodeTypes,
  Edge,
  Node,
  Connection
} from 'reactflow';
import 'reactflow/dist/style.css';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Plus, Save, Play, Pause, PencilLine, Trash2 } from "lucide-react";

// Custom node data types
interface NodeData {
  label: string;
  description: string;
  type?: string;
  options?: Record<string, any>;
}

// Node form data type
interface NodeFormData {
  label: string;
  description: string;
}

// Custom node components
const TriggerNode = ({ data }: { data: NodeData }) => {
  return (
    <div className="p-3 rounded-md bg-blue-100 dark:bg-blue-900 border border-blue-500 min-w-[150px]">
      <div className="font-semibold text-center mb-2">{data.label}</div>
      <div className="text-xs text-center text-muted-foreground">{data.description}</div>
    </div>
  );
};

const ActionNode = ({ data }: { data: NodeData }) => {
  return (
    <div className="p-3 rounded-md bg-green-100 dark:bg-green-900 border border-green-500 min-w-[150px]">
      <div className="font-semibold text-center mb-2">{data.label}</div>
      <div className="text-xs text-center text-muted-foreground">{data.description}</div>
    </div>
  );
};

const ConditionNode = ({ data }: { data: NodeData }) => {
  return (
    <div className="p-3 rounded-md bg-yellow-100 dark:bg-yellow-900 border border-yellow-500 min-w-[150px]">
      <div className="font-semibold text-center mb-2">{data.label}</div>
      <div className="text-xs text-center text-muted-foreground">{data.description}</div>
    </div>
  );
};

const OutputNode = ({ data }: { data: NodeData }) => {
  return (
    <div className="p-3 rounded-md bg-purple-100 dark:bg-purple-900 border border-purple-500 min-w-[150px]">
      <div className="font-semibold text-center mb-2">{data.label}</div>
      <div className="text-xs text-center text-muted-foreground">{data.description}</div>
    </div>
  );
};

// Node types registration
const nodeTypes: NodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  condition: ConditionNode,
  output: OutputNode,
};

// Initial nodes and edges
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'trigger',
    position: { x: 250, y: 100 },
    data: { 
      label: 'New Message',
      description: 'Triggers when a new message is received',
    },
  },
];

const initialEdges: Edge[] = [];

export default function AutomationsPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [automationName, setAutomationName] = useState('');
  const [automationDescription, setAutomationDescription] = useState('');
  const [isEditingAutomation, setIsEditingAutomation] = useState(false);
  const [selectedNodeType, setSelectedNodeType] = useState('action');
  const [selectedAgent, setSelectedAgent] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [nodeFormData, setNodeFormData] = useState<NodeFormData>({ label: '', description: '' });
  const reactFlowWrapper = useRef(null);
  
  // Mock automations data
  const mockAutomations = [
    {
      id: 'auto1',
      name: 'Customer Service Bot',
      description: 'Handles basic customer inquiries and routes complex issues',
      isActive: true,
      createdAt: '2025-02-20T10:30:00Z',
      agentName: 'Support Agent',
      platforms: ['Twitter', 'Facebook'],
    },
    {
      id: 'auto2',
      name: 'Content Scheduler',
      description: 'Posts scheduled content updates across platforms',
      isActive: false,
      createdAt: '2025-03-05T14:45:00Z',
      agentName: 'Content Agent',
      platforms: ['Instagram', 'LinkedIn'],
    }
  ];

  // Mock agents data
  const mockAgents = [
    { id: 'agent1', name: 'Support Agent' },
    { id: 'agent2', name: 'Content Agent' },
    { id: 'agent3', name: 'Sales Agent' },
  ];

  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => 
      addEdge({
        ...params,
        markerEnd: { type: MarkerType.ArrowClosed },
        animated: true,
      }, eds)
    );
  }, [setEdges]);

  const onAddNode = useCallback(() => {
    if (!nodeFormData.label) return;
    
    const newNode: Node = {
      id: `${nodes.length + 1}`,
      type: selectedNodeType,
      position: { 
        x: Math.random() * 300 + 200, 
        y: Math.random() * 300 + 100 
      },
      data: { 
        label: nodeFormData.label,
        description: nodeFormData.description || 'No description',
      },
    };
    
    setNodes((nds) => [...nds, newNode]);
    setNodeFormData({ label: '', description: '' });
    setIsDialogOpen(false);
  }, [nodes, selectedNodeType, nodeFormData, setNodes]);

  const onSaveAutomation = useCallback(() => {
    // Here you would normally save to Convex DB
    console.log('Saving automation:', {
      name: automationName,
      description: automationDescription,
      flowData: { nodes, edges },
      agentId: selectedAgent,
    });
    
    // Reset flow or navigate to automation list
    setIsEditingAutomation(true);
  }, [automationName, automationDescription, nodes, edges, selectedAgent]);

  const createNewAutomation = () => {
    setNodes(initialNodes);
    setEdges([]);
    setAutomationName('');
    setAutomationDescription('');
    setSelectedAgent('');
    setIsEditingAutomation(false);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Automations</h1>
        <p className="text-muted-foreground mt-2">
          Create and manage your automation workflows
        </p>
      </div>

      <Tabs defaultValue="editor" className="w-full">
        <TabsList>
          <TabsTrigger value="editor">Flow Editor</TabsTrigger>
          <TabsTrigger value="list">My Automations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="editor" className="mt-4">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>
                {isEditingAutomation ? 'Edit Automation' : 'Create New Automation'}
              </CardTitle>
              <CardDescription>
                Design your automation flow by adding nodes and connecting them
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="name">Automation Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter a name for this automation"
                    value={automationName}
                    onChange={(e) => setAutomationName(e.target.value)}
                  />
                </div>
                
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Describe what this automation does"
                    value={automationDescription}
                    onChange={(e) => setAutomationDescription(e.target.value)}
                  />
                </div>
                
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="agent">Assign Agent</Label>
                  <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                    <SelectTrigger id="agent">
                      <SelectValue placeholder="Select an agent" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockAgents.map((agent) => (
                        <SelectItem key={agent.id} value={agent.id}>
                          {agent.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="border rounded-md mb-4" style={{ height: 500 }} ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              fitView
            >
              <Background />
              <Controls />
              <Panel position="top-right">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="mr-2">
                      <Plus className="h-4 w-4 mr-1" /> Add Node
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Node</DialogTitle>
                      <DialogDescription>
                        Select a node type and configure its properties
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="flex flex-col space-y-2">
                        <Label htmlFor="nodeType">Node Type</Label>
                        <Select value={selectedNodeType} onValueChange={setSelectedNodeType}>
                          <SelectTrigger id="nodeType">
                            <SelectValue placeholder="Select node type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="trigger">Trigger</SelectItem>
                            <SelectItem value="action">Action</SelectItem>
                            <SelectItem value="condition">Condition</SelectItem>
                            <SelectItem value="output">Output</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <Label htmlFor="nodeLabel">Label</Label>
                        <Input
                          id="nodeLabel"
                          placeholder="Enter node label"
                          value={nodeFormData.label}
                          onChange={(e) => setNodeFormData({...nodeFormData, label: e.target.value})}
                        />
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <Label htmlFor="nodeDescription">Description</Label>
                        <Input
                          id="nodeDescription"
                          placeholder="Enter description"
                          value={nodeFormData.description}
                          onChange={(e) => setNodeFormData({...nodeFormData, description: e.target.value})}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={onAddNode}>Add Node</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <Button onClick={onSaveAutomation} variant="default" size="sm">
                  <Save className="h-4 w-4 mr-1" /> Save
                </Button>
              </Panel>
            </ReactFlow>
          </div>
          
          <div className="flex justify-end">
            <Button variant="outline" onClick={createNewAutomation} className="mr-2">
              Reset
            </Button>
            <Button onClick={onSaveAutomation}>
              Save Automation
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="list" className="mt-4">
          <div className="flex justify-between mb-4">
            <h2 className="text-2xl font-semibold">Your Automations</h2>
            <Button onClick={createNewAutomation}>
              <Plus className="h-4 w-4 mr-1" /> New Automation
            </Button>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockAutomations.map((automation) => (
              <Card key={automation.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{automation.name}</span>
                    <div className="flex items-center">
                      <Switch 
                        checked={automation.isActive} 
                        className="mr-2" 
                      />
                      <span className={`text-xs py-1 px-2 rounded-full ${
                        automation.isActive 
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                      }`}>
                        {automation.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    {automation.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Agent</span>
                      <span>{automation.agentName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Platforms</span>
                      <span>{automation.platforms.join(', ')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Created</span>
                      <span>{new Date(automation.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="ghost" size="sm">
                    <Play className="h-4 w-4 mr-1" /> 
                    {automation.isActive ? 'Test' : 'Activate'}
                  </Button>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <PencilLine className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
