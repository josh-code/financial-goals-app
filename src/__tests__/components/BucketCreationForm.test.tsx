import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BucketCreationForm from '@/components/BucketCreationForm';

describe('BucketCreationForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form fields', () => {
    render(<BucketCreationForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    expect(screen.getByLabelText('Bucket Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Goal Amount')).toBeInTheDocument();
    expect(screen.getByLabelText('Timeline (years)')).toBeInTheDocument();
    expect(screen.getByLabelText('Expected Return Rate (%)')).toBeInTheDocument();
    expect(screen.getByLabelText('Annual SIP Increase (%)')).toBeInTheDocument();
    expect(screen.getByLabelText('Initial Lumpsum (optional)')).toBeInTheDocument();
  });

  it('shows validation errors for required fields', async () => {
    render(<BucketCreationForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    // Submit empty form
    const submitButton = screen.getByText('Create Bucket');
    fireEvent.click(submitButton);

    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(screen.getAllByText(/Expected number, received nan/i)).toHaveLength(5);
    });
  });

  it('calls onSubmit with correct data when form is valid', async () => {
    render(<BucketCreationForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    // Fill out form with valid data
    fireEvent.change(screen.getByLabelText('Bucket Name'), { target: { value: 'Test Bucket' } });
    fireEvent.change(screen.getByLabelText('Goal Amount'), { target: { value: '1000' } });
    fireEvent.change(screen.getByLabelText('Timeline (years)'), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText('Expected Return Rate (%)'), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText('Annual SIP Increase (%)'), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText('Initial Lumpsum (optional)'), { target: { value: '100' } });

    // Submit form
    const submitButton = screen.getByText('Create Bucket');
    fireEvent.click(submitButton);

    // Verify onSubmit was called with correct data
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
        id: expect.any(String),
        name: 'Test Bucket',
        targetAmount: 1000,
        currentAmount: 100,
        monthlyContribution: expect.any(Number),
      }));
    });
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(<BucketCreationForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('shows calculated SIP amount after form submission', async () => {
    render(<BucketCreationForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    // Fill out form with valid data
    fireEvent.change(screen.getByLabelText('Bucket Name'), { target: { value: 'Test Bucket' } });
    fireEvent.change(screen.getByLabelText('Goal Amount'), { target: { value: '1000' } });
    fireEvent.change(screen.getByLabelText('Timeline (years)'), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText('Expected Return Rate (%)'), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText('Annual SIP Increase (%)'), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText('Initial Lumpsum (optional)'), { target: { value: '100' } });

    // Submit form
    const submitButton = screen.getByText('Create Bucket');
    fireEvent.click(submitButton);

    // Verify SIP amount is displayed
    await waitFor(() => {
      expect(screen.getByText(/Required Monthly SIP: ₹/)).toBeInTheDocument();
    });
  });
}); 