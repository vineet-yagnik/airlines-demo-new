import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders the Airlines Demo heading', () => {
    render(<App />)
    
    // Check if the main heading is present
    const heading = screen.getByText('✈️ AirlineDemo')
    expect(heading).toBeTruthy()
  })

  it('renders the flight search form', () => {
    render(<App />)
    
    // Check if search form elements are present
    const fromInput = screen.getByLabelText(/from/i)
    const toInput = screen.getByLabelText(/to/i)
    const dateInput = screen.getByLabelText(/departure date/i)
    
    expect(fromInput).toBeTruthy()
    expect(toInput).toBeTruthy()
    expect(dateInput).toBeTruthy()
  })

  it('renders the search button', () => {
    render(<App />)
    
    // Check if search button is present
    const searchButton = screen.getByRole('button', { name: /search flights/i })
    expect(searchButton).toBeTruthy()
  })

  it('has proper accessibility structure', () => {
    render(<App />)
    
    // Check for main landmarks
    const main = screen.getByRole('main')
    const banner = screen.getByRole('banner')
    
    expect(main).toBeTruthy()
    expect(banner).toBeTruthy()
  })
})