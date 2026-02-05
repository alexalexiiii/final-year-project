import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Clock, UserPlus, Flag, Archive, Tag, Send } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

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
