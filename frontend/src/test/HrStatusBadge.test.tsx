import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HrStatusBadge } from '../components/hr/HrStatusBadge'

describe('HrStatusBadge', () => {
  it('renders Active status with label', () => {
    render(<HrStatusBadge status="ACTIVE" />)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('renders Terminated status', () => {
    render(<HrStatusBadge status="TERMINATED" />)
    expect(screen.getByText('Terminated')).toBeInTheDocument()
  })

  it('hides dot when showDot=false', () => {
    const { container } = render(<HrStatusBadge status="ACTIVE" showDot={false} />)
    const dots = container.querySelectorAll('.rounded-full.bg-green-500')
    expect(dots.length).toBe(0)
  })

  it('handles unknown status gracefully', () => {
    // @ts-expect-error — testing unknown status fallback
    render(<HrStatusBadge status="UNKNOWN" />)
    expect(screen.getByText('Terminated')).toBeInTheDocument()
  })
})
