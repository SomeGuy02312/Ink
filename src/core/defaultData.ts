
import type { SavedProfile } from './storage';

const EMAIL_REGEX = '[\\w.-]+@[\\w.-]+\\.\\w+';
const PHONE_REGEX = '(?:\\+?\\d{1,3})?[-. (]*\\d{3}[-. )]*\\d{3}[-. ]*\\d{4}';
const URL_REGEX = 'https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&//=]*)';

// Helpers to generate contact groups with consistent styling
const createContactGroups = (idPrefix: string) => [
    {
        id: `${idPrefix}-email`,
        name: 'Emails',
        color: '#FDE68A', // Yellow (original contact color)
        enabled: true,
        type: 'regex' as const,
        terms: [EMAIL_REGEX]
    },
    {
        id: `${idPrefix}-phone`,
        name: 'Phone Numbers',
        color: '#fdba74', // Orange-300
        enabled: true,
        type: 'regex' as const,
        terms: [PHONE_REGEX]
    },
    {
        id: `${idPrefix}-website`,
        name: 'Websites',
        color: '#bae6fd', // Sky-200
        enabled: true,
        type: 'regex' as const,
        terms: [URL_REGEX]
    }
];

export const DEFAULT_PROFILES: SavedProfile[] = [
    {
        id: 'profile-web-dev',
        name: 'Modern Web Development',
        createdAt: Date.now(),
        groups: [
            {
                id: 'group-wd-js',
                name: 'JavaScript Ecosystem',
                color: '#fef08a', // Yellow-200
                enabled: true,
                type: 'text',
                terms: ['JavaScript', 'JS', 'TypeScript', 'TS', 'ES6', 'Node.js', 'NodeJS', 'Deno', 'Bun']
            },
            {
                id: 'group-wd-frontend',
                name: 'Frontend Frameworks',
                color: '#a7f3d0', // Green-200
                enabled: true,
                type: 'text',
                terms: ['React', 'React.js', 'Redux', 'Vue', 'Vue.js', 'VueJS', 'Angular', 'Svelte', 'Next.js', 'Nuxt']
            },
            {
                id: 'group-wd-backend',
                name: 'Backend & DB',
                color: '#bfdbfe', // Blue-200
                enabled: true,
                type: 'text',
                terms: ['Express', 'NestJS', 'Python', 'Django', 'Flask', 'FastAPI', 'GraphQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes']
            },
            {
                id: 'group-wd-titles',
                name: 'Job Titles',
                color: '#ddd6fe', // Purple-200
                enabled: true,
                type: 'text',
                terms: ['Software Engineer', 'Software Developer', 'Full Stack', 'Frontend Developer', 'Backend Developer', 'Web Developer', 'UI Engineer']
            },
            ...createContactGroups('group-wd')
        ]
    },
    {
        id: 'profile-networking',
        name: 'Data Networking',
        createdAt: Date.now(),
        groups: [
            {
                id: 'group-net-proto',
                name: 'Protocols & Tech',
                color: '#bfdbfe', // Blue
                enabled: true,
                type: 'text',
                terms: ['TCP/IP', 'BGP', 'OSPF', 'MPLS', 'VLAN', 'VPN', 'DNS', 'DHCP', 'SD-WAN', 'IPv6']
            },
            {
                id: 'group-net-vendors',
                name: 'Vendors (Cisco/Juniper)',
                color: '#fecaca', // Red
                enabled: true,
                type: 'text',
                terms: ['Cisco', 'Juniper', 'Arista', 'Palo Alto', 'Fortinet', 'IOS', 'NX-OS', 'Junos']
            },
            {
                id: 'group-net-certs',
                name: 'Certifications',
                color: '#ddd6fe', // Purple
                enabled: true,
                type: 'text',
                terms: ['CCNA', 'CCNP', 'CCIE', 'JNCIA', 'JNCIP', 'JNCIE', 'CompTIA Network+', 'PCNSE']
            },
            {
                id: 'group-net-titles',
                name: 'Titles',
                color: '#a7f3d0', // Green
                enabled: true,
                type: 'text',
                terms: ['Network Engineer', 'Network Administrator', 'Network Architect', 'NOC Technician', 'NOC Engineer', 'Systems Administrator']
            },
            ...createContactGroups('group-net')
        ]
    },
    {
        id: 'profile-sales',
        name: 'Sales',
        createdAt: Date.now(),
        groups: [
            {
                id: 'group-sales-skills',
                name: 'Sales Skills',
                color: '#a7f3d0', // Green
                enabled: true,
                type: 'text',
                terms: ['B2B', 'SaaS', 'Prospecting', 'Cold Calling', 'Closing', 'Account Management', 'Pipeline Management', 'Discovery', 'Negotiation', 'Enterprise Sales']
            },
            {
                id: 'group-sales-crm',
                name: 'CRM & Tools',
                color: '#fed7aa', // Orange
                enabled: true,
                type: 'text',
                terms: ['Salesforce', 'SFDC', 'HubSpot', 'Zoho', 'Pipedrive', 'Outreach', 'SalesLoft', 'Gong', 'ZoomInfo']
            },
            {
                id: 'group-sales-titles',
                name: 'Titles',
                color: '#bfdbfe', // Blue
                enabled: true,
                type: 'text',
                terms: ['Account Executive', 'AE', 'Sales Development', 'SDR', 'BDR', 'Business Development', 'Sales Manager', 'VP of Sales', 'Customer Success Manager', 'CSM']
            },
            ...createContactGroups('group-sales')
        ]
    },
    {
        id: 'profile-accounting',
        name: 'Accounting & Finance',
        createdAt: Date.now(),
        groups: [
            {
                id: 'group-acct-certs',
                name: 'Certifications',
                color: '#ddd6fe', // Purple
                enabled: true,
                type: 'text',
                terms: ['CPA', 'Certified Public Accountant', 'CFA', 'CMA', 'ACCA', 'Enrolled Agent', 'CIA']
            },
            {
                id: 'group-acct-tools',
                name: 'Software',
                color: '#a7f3d0', // Green
                enabled: true,
                type: 'text',
                terms: ['QuickBooks', 'Xero', 'NetSuite', 'SAP', 'Oracle', 'Excel', 'VBA', 'Tableau', 'Sage']
            },
            {
                id: 'group-acct-standards',
                name: 'Standards & Skills',
                color: '#fef08a', // Yellow
                enabled: true,
                type: 'text',
                terms: ['GAAP', 'IFRS', 'SOX', 'Sarbanes-Oxley', 'General Ledger', 'Reconciliation', 'Taxation', 'Audit', 'Financial Reporting', 'Payroll']
            },
            {
                id: 'group-acct-titles',
                name: 'Titles',
                color: '#bfdbfe', // Blue
                enabled: true,
                type: 'text',
                terms: ['Accountant', 'Senior Accountant', 'Controller', 'Auditor', 'Bookkeeper', 'Finance Manager', 'Financial Analyst', 'CFO']
            },
            ...createContactGroups('group-acct')
        ]
    },
    {
        id: 'profile-product',
        name: 'Product Management',
        createdAt: Date.now(),
        groups: [
            {
                id: 'group-pm-method',
                name: 'Methodologies',
                color: '#fbcfe8', // Pink
                enabled: true,
                type: 'text',
                terms: ['Agile', 'Scrum', 'Kanban', 'Waterfall', 'Lean', 'Design Thinking', 'SDLC', 'Product Lifecycle']
            },
            {
                id: 'group-pm-tools',
                name: 'Tools',
                color: '#bfdbfe', // Blue
                enabled: true,
                type: 'text',
                terms: ['Jira', 'Confluence', 'Trello', 'Asana', 'Linear', 'Figma', 'Miro', 'Amplitude', 'Mixpanel', 'Pendo']
            },
            {
                id: 'group-pm-strategy',
                name: 'Strategy & Metrics',
                color: '#a7f3d0', // Green
                enabled: true,
                type: 'text',
                terms: ['KPI', 'OKR', 'Roadmap', 'User Stories', 'PRD', 'MVP', 'A/B Testing', 'Growth', 'Retention', 'Churn', 'Go-to-Market', 'GTM']
            },
            {
                id: 'group-pm-titles',
                name: 'Titles',
                color: '#ddd6fe', // Purple
                enabled: true,
                type: 'text',
                terms: ['Product Manager', 'PM', 'Product Owner', 'PO', 'Technical Product Manager', 'Head of Product', 'CPO', 'Group Product Manager']
            },
            ...createContactGroups('group-pm')
        ]
    }
];
