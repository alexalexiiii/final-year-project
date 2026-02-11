// Mock data for FLARE analysis results
// In production, this data would come from backend API responses

import {
  Shield,
  Network,
  FileCode,
  Lock,
  Eye,
  Server,
  Ban,
  Trash2,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import type { ExtractedString, Capability, PESection, PEHeader, ImportedFunction } from '../types/analysis';

export const MOCK_STRINGS: ExtractedString[] = [
  { value: 'C:\\Windows\\System32\\cmd.exe', type: 'suspicious', category: 'Command Execution' },
  { value: 'http://malicious-domain.com/payload', type: 'suspicious', category: 'Network' },
  { value: 'SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run', type: 'suspicious', category: 'Persistence' },
  { value: 'GET', type: 'normal', category: 'Network' },
  { value: 'POST', type: 'normal', category: 'Network' },
  { value: 'User-Agent: Mozilla/5.0', type: 'normal', category: 'Network' },
  { value: 'AdjustTokenPrivileges', type: 'suspicious', category: 'Privilege Escalation' },
  { value: 'CreateRemoteThread', type: 'suspicious', category: 'Process Injection' },
  { value: 'VirtualAllocEx', type: 'suspicious', category: 'Memory Management' },
  { value: 'WriteProcessMemory', type: 'suspicious', category: 'Process Injection' },
  { value: 'kernel32.dll', type: 'normal', category: 'DLL' },
  { value: 'ntdll.dll', type: 'normal', category: 'DLL' },
  { value: 'ws2_32.dll', type: 'normal', category: 'DLL' },
  { value: 'admin123', type: 'suspicious', category: 'Credential' },
  { value: 'password', type: 'suspicious', category: 'Credential' },
];

export const MOCK_CAPABILITIES: Capability[] = [
  {
    category: 'Execution',
    icon: FileCode,
    severity: 'high',
    items: [
      'execute shell commands',
      'create process',
      'inject code into remote process'
    ]
  },
  {
    category: 'Persistence',
    icon: Lock,
    severity: 'high',
    items: [
      'modify Windows Registry for persistence',
      'create scheduled task',
      'create Windows service'
    ]
  },
  {
    category: 'Defense Evasion',
    icon: Eye,
    severity: 'critical',
    items: [
      'bypass User Account Control',
      'disable security tools',
      'obfuscate strings',
      'check for virtual machine'
    ]
  },
  {
    category: 'Network',
    icon: Network,
    severity: 'medium',
    items: [
      'HTTP communication',
      'download file from internet',
      'resolve domain names'
    ]
  },
  {
    category: 'Discovery',
    icon: Shield,
    severity: 'medium',
    items: [
      'enumerate system information',
      'query registry',
      'check running processes'
    ]
  },
  {
    category: 'Command and Control',
    icon: Server,
    severity: 'critical',
    items: [
      'connect to remote server',
      'receive commands from C2',
      'exfiltrate data'
    ]
  }
];

export const MOCK_PE_HEADERS: PEHeader = {
  imageBase: '0x00400000',
  entryPoint: '0x00001234',
  subsystem: 'Windows GUI',
  timestamp: '0x65F3A2B7 (2024-03-15 14:23:11)',
  checksum: '0x0024A3F1'
};

export const MOCK_PE_SECTIONS: PESection[] = [
  {
    name: '.text',
    virtualSize: '0x00124000',
    virtualAddress: '0x00001000',
    rawSize: '0x00124000',
    entropy: 6.4,
    characteristics: ['CODE', 'EXECUTE', 'READ']
  },
  {
    name: '.rdata',
    virtualSize: '0x00042000',
    virtualAddress: '0x00125000',
    rawSize: '0x00042000',
    entropy: 5.1,
    characteristics: ['INITIALIZED_DATA', 'READ']
  },
  {
    name: '.data',
    virtualSize: '0x00008000',
    virtualAddress: '0x00167000',
    rawSize: '0x00002000',
    entropy: 3.2,
    characteristics: ['INITIALIZED_DATA', 'READ', 'WRITE']
  },
  {
    name: '.rsrc',
    virtualSize: '0x00012000',
    virtualAddress: '0x0016F000',
    rawSize: '0x00012000',
    entropy: 7.8,
    characteristics: ['INITIALIZED_DATA', 'READ']
  },
  {
    name: '.reloc',
    virtualSize: '0x00004000',
    virtualAddress: '0x00181000',
    rawSize: '0x00004000',
    entropy: 6.7,
    characteristics: ['INITIALIZED_DATA', 'DISCARDABLE', 'READ']
  }
];

export const MOCK_IMPORTS: ImportedFunction[] = [
  {
    dll: 'kernel32.dll',
    function: 'VirtualAllocEx',
    suspicious: true,
    description: 'Memory allocation in remote process'
  },
  {
    dll: 'kernel32.dll',
    function: 'WriteProcessMemory',
    suspicious: true,
    description: 'Write to remote process memory'
  },
  {
    dll: 'kernel32.dll',
    function: 'CreateRemoteThread',
    suspicious: true,
    description: 'Create thread in remote process'
  },
  {
    dll: 'kernel32.dll',
    function: 'GetProcAddress',
    suspicious: true,
    description: 'Retrieve function address dynamically'
  },
  {
    dll: 'kernel32.dll',
    function: 'LoadLibraryA',
    suspicious: true,
    description: 'Load DLL dynamically'
  },
  {
    dll: 'kernel32.dll',
    function: 'CreateProcessA',
    suspicious: false,
    description: 'Create new process'
  },
  {
    dll: 'advapi32.dll',
    function: 'AdjustTokenPrivileges',
    suspicious: true,
    description: 'Modify process privileges'
  },
  {
    dll: 'advapi32.dll',
    function: 'RegCreateKeyExA',
    suspicious: true,
    description: 'Create registry key'
  },
  {
    dll: 'advapi32.dll',
    function: 'RegSetValueExA',
    suspicious: true,
    description: 'Set registry value'
  },
  {
    dll: 'advapi32.dll',
    function: 'OpenProcessToken',
    suspicious: true,
    description: 'Open process token'
  },
  {
    dll: 'ws2_32.dll',
    function: 'WSAStartup',
    suspicious: false,
    description: 'Initialize Winsock'
  },
  {
    dll: 'ws2_32.dll',
    function: 'socket',
    suspicious: false,
    description: 'Create socket'
  },
  {
    dll: 'ws2_32.dll',
    function: 'connect',
    suspicious: false,
    description: 'Connect to remote host'
  }
];
