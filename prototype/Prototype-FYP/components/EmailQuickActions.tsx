import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Clock, UserPlus, Flag, Archive, Tag, Send } from 'lucide-react';
import { toast } from 'sonner';

export function EmailQuickActions() {
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [addFollowUp, setAddFollowUp] = useState(false);

  const handleScheduleSend = () => {
    toast.success('Email scheduled for later');
  };

  const handleAddToContacts = () => {
    toast.success('Sender added to contacts');
  };

  const handleSetPriority = () => {
    if (selectedPriority) {
      toast.success(`Priority set to ${selectedPriority}`);
    } else {
      toast.error('Please select a priority level');
    }
  };

  const handleCategorize = () => {
    if (selectedCategory) {
      toast.success(`Email categorized as ${selectedCategory}`);
    } else {
      toast.error('Please select a category');
    }
  };

  const handleArchive = () => {
    toast.success('Email archived');
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Perform common tasks on the current email</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full justify-start gap-2" variant="outline" onClick={handleScheduleSend}>
            <Clock className="w-4 h-4" />
            Schedule Send
          </Button>
          
          <Button className="w-full justify-start gap-2" variant="outline" onClick={handleAddToContacts}>
            <UserPlus className="w-4 h-4" />
            Add Sender to Contacts
          </Button>
          
          <Button className="w-full justify-start gap-2" variant="outline" onClick={handleArchive}>
            <Archive className="w-4 h-4" />
            Archive & Next
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Set Priority</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label>Priority Level</Label>
            <Select value={selectedPriority} onValueChange={setSelectedPriority}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="followup" 
              checked={addFollowUp}
              onCheckedChange={(checked) => setAddFollowUp(checked as boolean)}
            />
            <label
              htmlFor="followup"
              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Add follow-up reminder
            </label>
          </div>

          <Button className="w-full gap-2" onClick={handleSetPriority}>
            <Flag className="w-4 h-4" />
            Apply Priority
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Categorize</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="work">Work</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="travel">Travel</SelectItem>
                <SelectItem value="projects">Projects</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button className="w-full gap-2" onClick={handleCategorize}>
            <Tag className="w-4 h-4" />
            Apply Category
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

