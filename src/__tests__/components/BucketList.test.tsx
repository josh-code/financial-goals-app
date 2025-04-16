import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BucketList from '@/components/BucketList';

describe('BucketList', () => {
  const mockBuckets = [
    {
      id: '1',
      name: 'Test Bucket',
      targetAmount: 1000,
      currentAmount: 100,
      monthlyContribution: 75,
    },
  ];

  const mockOnCreateBucket = jest.fn();

  it('renders empty state when no buckets exist', () => {
    render(<BucketList buckets={[]} onCreateBucket={mockOnCreateBucket} />);
    expect(screen.getByText('No buckets created yet. Click the button above to create one!')).toBeInTheDocument();
  });

  it('opens creation form when create button is clicked', () => {
    render(<BucketList buckets={[]} onCreateBucket={mockOnCreateBucket} />);
    const createButton = screen.getByText('Create New Bucket');
    fireEvent.click(createButton);
    expect(screen.getByLabelText('Bucket Name')).toBeInTheDocument();
  });

  it('creates a new bucket when form is submitted', async () => {
    render(<BucketList buckets={[]} onCreateBucket={mockOnCreateBucket} />);
    
    // Open creation form
    const createButton = screen.getByText('Create New Bucket');
    fireEvent.click(createButton);

    // Fill out form
    fireEvent.change(screen.getByLabelText('Bucket Name'), { target: { value: 'Test Bucket' } });
    fireEvent.change(screen.getByLabelText('Goal Amount'), { target: { value: '1000' } });
    fireEvent.change(screen.getByLabelText('Timeline (years)'), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText('Expected Return Rate (%)'), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText('Annual SIP Increase (%)'), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText('Initial Lumpsum (optional)'), { target: { value: '100' } });

    // Submit form
    const submitButton = screen.getByText('Create Bucket');
    fireEvent.click(submitButton);

    // Verify onCreateBucket was called with correct data
    await waitFor(() => {
      expect(mockOnCreateBucket).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Test Bucket',
        targetAmount: 1000,
        currentAmount: 100,
        monthlyContribution: expect.any(Number),
      }));
    });
  });

  it('closes creation form when cancel button is clicked', () => {
    render(<BucketList buckets={[]} onCreateBucket={mockOnCreateBucket} />);
    
    // Open creation form
    const createButton = screen.getByText('Create New Bucket');
    fireEvent.click(createButton);

    // Click cancel
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    // Form should be closed
    expect(screen.queryByLabelText('Bucket Name')).not.toBeInTheDocument();
  });

  it('displays existing buckets', () => {
    render(<BucketList buckets={mockBuckets} onCreateBucket={mockOnCreateBucket} />);
    
    expect(screen.getByText('Test Bucket')).toBeInTheDocument();
    expect(screen.getByText('Current: $100')).toBeInTheDocument();
    expect(screen.getByText('Target: $1000')).toBeInTheDocument();
  });
}); 