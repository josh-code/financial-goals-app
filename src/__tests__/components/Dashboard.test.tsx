import { render, screen } from '@testing-library/react';
import Dashboard from '../../components/Dashboard';

describe('Dashboard', () => {
  const mockBuckets = [
    {
      _id: '1',
      name: 'Retirement',
      targetAmount: 1000000,
      currentAmount: 500000,
      monthlyContribution: 5000,
      description: 'Retirement savings',
      returnRate: 8,
      timeline: 20,
      sipIncrease: 5,
      userId: 'user1',
    },
    {
      _id: '2',
      name: 'House',
      targetAmount: 500000,
      currentAmount: 100000,
      monthlyContribution: 3000,
      description: 'House down payment',
      returnRate: 7,
      timeline: 10,
      sipIncrease: 3,
      userId: 'user1',
    },
  ];

  it('renders the total portfolio value correctly', () => {
    render(<Dashboard buckets={mockBuckets} />);
    const totalValue = screen.getByText(/Portfolio Value/i);
    expect(totalValue).toBeInTheDocument();
  });

  it('renders the monthly investment total correctly', () => {
    render(<Dashboard buckets={mockBuckets} />);
    const monthlyInvestment = screen.getByText(/Monthly Investment/i);
    expect(monthlyInvestment).toBeInTheDocument();
  });

  it('renders the overall progress section', () => {
    render(<Dashboard buckets={mockBuckets} />);
    const progressSection = screen.getByText(/Overall Progress/i);
    expect(progressSection).toBeInTheDocument();
  });

  it('renders all investment buckets', () => {
    render(<Dashboard buckets={mockBuckets} />);
    mockBuckets.forEach(bucket => {
      expect(screen.getByText(bucket.name)).toBeInTheDocument();
    });
  });
}); 