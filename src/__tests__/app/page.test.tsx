import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '@/app/page';

describe('Home', () => {
  it('renders the main heading', () => {
    render(<Home />);
    expect(screen.getByText('Financial Goal Planner')).toBeInTheDocument();
  });

  it('renders both Dashboard and BucketList components', () => {
    render(<Home />);
    expect(screen.getByText('Portfolio Value')).toBeInTheDocument();
    expect(screen.getByText('Your Buckets')).toBeInTheDocument();
  });

  it('updates dashboard when a new bucket is created', async () => {
    render(<Home />);

    // Initial state
    const initialPortfolioValue = screen.getByText((content, element) => {
      return element?.className?.includes('text-blue-600') && content === '₹0' || false;
    });
    expect(initialPortfolioValue).toBeInTheDocument();

    // Create a new bucket
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

    // Wait for updates
    await waitFor(() => {
      // Check if bucket appears in the list
      const bucketElements = screen.getAllByText('Test Bucket');
      expect(bucketElements.length).toBeGreaterThan(0);
      
      // Check if dashboard values are updated
      const updatedPortfolioValue = screen.getByText((content, element) => {
        return element?.className?.includes('text-blue-600') && content === '₹100' || false;
      });
      expect(updatedPortfolioValue).toBeInTheDocument();
    });
  });

  it('shows empty state initially', () => {
    render(<Home />);
    expect(screen.getByText('No buckets created yet. Click the button above to create one!')).toBeInTheDocument();
  });
}); 