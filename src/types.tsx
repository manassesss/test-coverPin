export type LeadStatus = 'New' | 'Contacted' | 'Qualified';
export type OpportunityStage = 'Prospecting' | 'Qualification' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';

export interface Lead {
  id: number;
  name: string;
  company: string;
  email: string;
  source: string;
  score: number;
  status: LeadStatus;
}

export interface Opportunity {
  id: number;
  name: string;
  stage: string;
  amount?: number;
  accountName: string;
  leadId: number;
}
