# Unit Tests

This project includes comprehensive unit tests for all components and pages using Jest and React Testing Library.

## Test Suite Overview

### Components Tested (8)
- **Header** - Navigation bar with conditional login/logout buttons
- **HeroSection** - Landing page hero with CTAs
- **Footer** - Footer with links and contact info
- **AboutSection** - About the institute section
- **CTASection** - Call-to-action section
- **VideoSection** - YouTube video embed
- **Loading** - Loading animation component
- **Skeleton** - Skeleton loading components (7 variants)

### Pages Tested (3)
- **Home** (`/`) - Main landing page with all sections
- **Login** (`/login`) - Login form page
- **Dashboard** (`/dashboard`) - Dashboard page

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Statistics

- **Total Test Suites**: 11
- **Total Tests**: 90
- **All Passing**: ✅

## Test Coverage

Tests cover:
- ✅ Component rendering
- ✅ Props and data flow
- ✅ User interactions (clicks, form inputs)
- ✅ Navigation and routing
- ✅ Conditional rendering
- ✅ Loading states
- ✅ Links and external URLs
- ✅ Styling and CSS classes
- ✅ Accessibility attributes

## Test Files Structure

```
src/
├── components/
│   └── __tests__/
│       ├── Header.test.tsx
│       ├── HeroSection.test.tsx
│       ├── Footer.test.tsx
│       ├── AboutSection.test.tsx
│       ├── CTASection.test.tsx
│       ├── VideoSection.test.tsx
│       ├── Loading.test.tsx
│       └── Skeleton.test.tsx
└── __tests__/
    └── pages/
        ├── home.test.tsx
        ├── login.test.tsx
        └── dashboard.test.tsx
```

## Key Test Examples

### Component Rendering
```tsx
it('renders the logo and brand name', () => {
  render(<Header />)
  expect(screen.getByAltText('Logo 2ª IPI de Maringá')).toBeInTheDocument()
  expect(screen.getByText('Instituto Casa Bíblica')).toBeInTheDocument()
})
```

### User Interactions
```tsx
it('navigates to dashboard on form submission', async () => {
  render(<LoginPage />)
  const emailInput = screen.getByLabelText('E-mail')
  const submitButton = screen.getByRole('button', { name: /entrar/i })
  
  fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
  fireEvent.click(submitButton)
  
  await waitFor(() => {
    expect(mockPush).toHaveBeenCalledWith('/dashboard')
  })
})
```

### Conditional Rendering
```tsx
it('shows login button on home page', () => {
  usePathname.mockReturnValue('/')
  render(<Header />)
  expect(screen.getAllByText('Login').length).toBeGreaterThan(0)
})

it('hides login button on non-home pages', () => {
  usePathname.mockReturnValue('/login')
  render(<Header />)
  expect(screen.queryAllByText('Login').length).toBe(0)
})
```

## Dependencies

- `jest` - Test runner
- `@testing-library/react` - React component testing utilities
- `@testing-library/jest-dom` - Custom jest matchers
- `@testing-library/user-event` - User interaction simulation
- `jest-environment-jsdom` - DOM environment for tests

## Configuration

- **jest.config.js** - Jest configuration with Next.js support
- **jest.setup.js** - Global test setup (jest-dom matchers)

## Continuous Integration

These tests can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Run tests
  run: npm test
  
- name: Generate coverage
  run: npm run test:coverage
```

## Writing New Tests

When adding new components:

1. Create a test file in `__tests__` directory next to the component
2. Follow the naming convention: `ComponentName.test.tsx`
3. Import necessary testing utilities
4. Write descriptive test cases
5. Ensure all critical functionality is covered

Example template:

```tsx
import { render, screen } from '@testing-library/react'
import { YourComponent } from '../YourComponent'

describe('YourComponent', () => {
  it('renders correctly', () => {
    render(<YourComponent />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })
})
```
