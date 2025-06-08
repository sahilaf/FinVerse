import { GlossaryTerm } from '@/types';

export const glossaryTerms: GlossaryTerm[] = [
  {
    id: '1',
    term: 'APR',
    definition: 'Annual Percentage Rate - The yearly cost of a loan including interest and fees, expressed as a percentage.',
    category: 'Credit',
    relatedTerms: ['Interest Rate', 'Credit Card', 'Loan']
  },
  {
    id: '2',
    term: 'Emergency Fund',
    definition: 'Money set aside to cover unexpected expenses or financial emergencies, typically covering 3-6 months of living expenses.',
    category: 'Saving',
    relatedTerms: ['Budgeting', 'Savings Account', 'Financial Security']
  },
  {
    id: '3',
    term: 'Compound Interest',
    definition: 'Interest earned on both the initial principal and previously earned interest, causing wealth to grow exponentially over time.',
    category: 'Investing',
    relatedTerms: ['Interest', 'Investment', 'Retirement Planning']
  },
  {
    id: '4',
    term: 'Credit Score',
    definition: 'A three-digit number (300-850) that represents your creditworthiness based on your credit history.',
    category: 'Credit',
    relatedTerms: ['Credit Report', 'FICO Score', 'Credit History']
  },
  {
    id: '5',
    term: 'ETF',
    definition: 'Exchange-Traded Fund - A investment fund that trades on stock exchanges like individual stocks, typically tracking an index.',
    category: 'Investing',
    relatedTerms: ['Index Fund', 'Diversification', 'Stock Market']
  },
  {
    id: '6',
    term: '401(k)',
    definition: 'An employer-sponsored retirement savings plan that allows employees to save and invest for retirement with tax advantages.',
    category: 'Retirement',
    relatedTerms: ['Retirement Planning', 'Employer Match', 'Tax-Deferred']
  }
];