import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import BookingCard from './BookingCard';

// 🛡️ MOCK AXIOS: Prevent real API calls during UI testing
vi.mock('axios');

describe('BookingCard UI Component', () => {
  
  // Clear all mocks before each test to ensure a clean slate
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('1. Modal Interaction', () => {
    it('opens the modal when the "Book Appointment" button is clicked', () => {
      render(<BookingCard />);
      
      // The modal content shouldn't be visible yet
      expect(screen.queryByText(/Upload Prescription/i)).not.toBeInTheDocument();

      // Click the trigger button
      const openButton = screen.getByRole('button', { name: /Book Appointment/i });
      fireEvent.click(openButton);

      // Now the modal content should be visible
      expect(screen.getByText(/Upload Prescription/i)).toBeInTheDocument();
    });
  });

  describe('2. Booking A Test Flow', () => {
    it('shows a validation error if submitting an empty form', async () => {
      render(<BookingCard />);
      
      // Open Modal
      fireEvent.click(screen.getByRole('button', { name: /Book Appointment/i }));

      // Click Submit without filling anything
      const submitButton = screen.getByRole('button', { name: /Submit Booking/i });
      fireEvent.click(submitButton);

      // Check for the error message
      expect(await screen.findByText(/Please fill all fields and attach a prescription/i)).toBeInTheDocument();
      // Ensure Axios was NEVER called
      expect(axios.post).not.toHaveBeenCalled();
    });

    it('successfully submits a booking and shows the tracking code', async () => {
      // Mock the Axios response to return a fake success and tracking code
      axios.post.mockResolvedValueOnce({ 
        data: { success: true, trackingCode: 'X7Y8Z9' } 
      });

      render(<BookingCard />);
      fireEvent.click(screen.getByRole('button', { name: /Book Appointment/i }));

      // Fill out the text fields
      fireEvent.change(screen.getByLabelText(/Patient Full Name/i), { target: { value: 'Jane Doe' } });
      fireEvent.change(screen.getByLabelText(/Mobile Number/i), { target: { value: '9876543210' } });
      fireEvent.change(screen.getByLabelText(/Address \/ Remarks/i), { target: { value: 'Lucknow' } });

      // Simulate a file upload
      const file = new File(['dummy content'], 'prescription.png', { type: 'image/png' });
      // Since the input is hidden, we find it by the button text wrapping it (or just use the DOM structure)
      // The easiest way is to find the input of type "file"
      const fileInput = document.querySelector('input[type="file"]');
      fireEvent.change(fileInput, { target: { files: [file] } });

      // Submit the form
      fireEvent.click(screen.getByRole('button', { name: /Submit Booking/i }));

      // Wait for the success screen to render
      await waitFor(() => {
        expect(screen.getByText(/Booking Confirmed!/i)).toBeInTheDocument();
      });

      // Verify the generated tracking code is displayed
      expect(screen.getByText('X7Y8Z9')).toBeInTheDocument();
      
      // Verify Axios was called exactly once
      expect(axios.post).toHaveBeenCalledTimes(1);
    });
  });

  describe('3. Getting a Report Flow', () => {
    it('blocks search if tracking code or phone is missing', async () => {
      render(<BookingCard />);
      fireEvent.click(screen.getByRole('button', { name: /Book Appointment/i }));

      // Switch to the "Get Report" Tab
      fireEvent.click(screen.getByRole('tab', { name: /Get Report/i }));

      // The button should be disabled natively by your component logic if fields are empty
      const searchButton = screen.getByRole('button', { name: /Find Report/i });
      expect(searchButton).toBeDisabled();
    });

    it('successfully fetches and displays a ready report', async () => {
      // Mock the Axios response for the search API
      axios.post.mockResolvedValueOnce({ 
        data: { 
          success: true,
          data: { 
            patientName: 'Jane Doe', 
            status: 'Report Ready', 
            downloadLink: 'https://cloudinary.com/fake-pdf-link.pdf' 
          } 
        } 
      });

      render(<BookingCard />);
      fireEvent.click(screen.getByRole('button', { name: /Book Appointment/i }));
      fireEvent.click(screen.getByRole('tab', { name: /Get Report/i }));

      // Fill in the dual-factor auth fields
      fireEvent.change(screen.getByLabelText(/Enter Tracking Code/i), { target: { value: 'X7Y8Z9' } });
      fireEvent.change(screen.getByLabelText(/Registered Phone Number/i), { target: { value: '9876543210' } });

      // Click Search
      const searchButton = screen.getByRole('button', { name: /Find Report/i });
      expect(searchButton).not.toBeDisabled();
      fireEvent.click(searchButton);

      // Wait for the result to render
      await waitFor(() => {
        expect(screen.getByText('Jane Doe')).toBeInTheDocument();
      });

      // Verify the download button appears with the correct link
      const downloadButton = await screen.findByRole('link', { name: /Download PDF Report/i });
      expect(downloadButton).toHaveAttribute('href', 'https://cloudinary.com/fake-pdf-link.pdf');
          });
  });
});