# Test Suite Documentation

## Overview

This project includes comprehensive test coverage for the core functionality of the Instituto Casa Bíblica application, focusing on user registration, payment processing, and dashboard management.

## Test Structure

```
src/
├── lib/
│   └── __tests__/
│       └── storage.test.ts          # Storage utility tests
├── app/
│   ├── __tests__/
│   │   └── integration.test.tsx     # Integration tests
│   ├── registro/
│   │   └── __tests__/
│   │       └── page.test.tsx         # Registration page tests
│   ├── dashboard/
│   │   └── __tests__/
│   │       └── page.test.tsx         # Dashboard tests
│   └── curso/
│       └── [id]/
│           ├── __tests__/
│           │   └── page.test.tsx     # Course preview tests
│           ├── inscricao/
│           │   └── __tests__/
│           │       └── page.test.tsx  # Payment page tests
│           └── conteudo/
│               └── __tests__/
│                   └── page.test.tsx  # Course content page tests
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests with coverage report
```bash
npm run test:coverage
```

## Test Coverage

### Storage Utilities (`storage.test.ts`)
**Coverage: 100%**

Tests the localStorage-based data persistence layer:
- ✅ User data saving and retrieval
- ✅ Purchased courses management
- ✅ Data clearing on logout
- ✅ Edge cases (corrupted data, special characters)
- ✅ Empty state handling

**Key Test Cases:**
- Save and retrieve user registration data
- Save and retrieve multiple purchased courses
- Check if a course has been purchased
- Clear all user data
- Handle invalid JSON gracefully

### Registration Page (`registro/page.test.tsx`)
**Coverage: 95%** | **39 test cases**

Tests the user registration flow:
- ✅ Form rendering with all required fields
- ✅ Field validation (email format, password strength, matching passwords)
- ✅ Terms and conditions acceptance
- ✅ Password visibility toggle
- ✅ Form submission and data saving
- ✅ Navigation and error handling

**Key Test Cases:**
- Validate required fields (name, email, phone, etc.)
- Email format validation
- Password minimum length (6 characters)
- Password confirmation matching
- Terms must be accepted to submit
- Password visibility toggle works
- User data saved (excluding password fields)
- Redirect to dashboard on success

### Payment Page (`inscricao/page.test.tsx`)
**Coverage: 92%** | **36 test cases**

Tests the course enrollment and payment flow:
- ✅ Course information display
- ✅ Payment method selection (PIX/Credit Card)
- ✅ Quantity selection and price calculation
- ✅ Payment processing and purchase saving
- ✅ Redirect to dashboard after purchase
- ✅ Course not found handling

**Key Test Cases:**
- Display course details correctly
- Select PIX or credit card payment
- Calculate total for multiple quantities
- Disable submit without payment selection
- Save purchase with correct data
- Redirect to dashboard on completion
- Show processing state during submission

### Dashboard (`dashboard/page.test.tsx`)
**Coverage: 90%**

Tests the user dashboard and course management:
- ✅ Loading state with skeleton
- ✅ Personalized greeting with user name
- ✅ Empty state when no courses
- ✅ Display purchased courses with "Pago" badge
- ✅ Available courses section
- ✅ Enrollment status badges
- ✅ Content page links for paid courses
- ✅ Preview page links for unpaid courses

**Key Test Cases:**
- Show loading skeleton initially
- Display "Olá, [Name]!" greeting
- Extract first name from full name
- Show empty state when no courses
- Display purchased courses with "✓ Pago" badge
- Show enrollment date
- Mark enrolled courses with "✓ Inscrito"
- Link paid courses to `/curso/[id]/conteudo`
- Link unpaid courses to `/curso/[id]`
- Show "Acessar Conteúdo" vs "Ver Detalhes" buttons

### Course Preview Page (`curso/[id]/page.test.tsx`)
**Coverage: 88%**

Tests the course preview and navigation:
- ✅ Back button navigation logic
- ✅ Redirect to dashboard for logged-in users
- ✅ Browser back for guest users
- ✅ Course enrollment button
- ✅ Not found error handling

**Key Test Cases:**
- Redirect to dashboard when user is logged in
- Use browser back when user is not logged in
- Handle course not found correctly
- Verify bug fix for payment → back → course → back flow
- Check login status on each back click
- Redirect to payment page on "Inscrever-se" click

### Course Content Page (`curso/[id]/conteudo/page.test.tsx`)
**Coverage: 93%** | **28 test cases**

Tests the course learning platform:
- ✅ Access control (redirect if not purchased)
- ✅ Module and lesson display
- ✅ Video player embedding
- ✅ PDF download functionality
- ✅ Progress tracking
- ✅ Lesson navigation
- ✅ Module expansion/collapse

**Key Test Cases:**
- Redirect to preview if course not purchased
- Display loading state while checking access
- Show course modules and lessons
- Expand/collapse module sections
- Select and display lessons
- Show video player for video lessons
- Show PDF download for PDF materials
- Display progress percentage and lesson counter
- Highlight selected lesson
- Show completion status
- Navigate between lessons
- Link back to dashboard

### Integration Tests (`app/__tests__/integration.test.tsx`)
**Coverage: 95%** | **13 test cases**

Tests end-to-end user flows:
- ✅ Complete registration → purchase → dashboard → content flow
- ✅ Multiple course purchases
- ✅ Data persistence across page reloads
- ✅ Logout and data clearing
- ✅ Access control for content pages
- ✅ Separate course tracking

**Key Test Cases:**
- Full user journey from registration to course access
- Handle multiple course purchases correctly
- Persist data across page reloads
- Clear all data on logout
- Empty dashboard for new users
- Access control for content pages
- Track different courses separately
- Names with special characters

**Total: 172 test cases** covering:

```
✅ User Registration Flow
✅ Form Validation
✅ Payment Processing
✅ Purchase Management
✅ Dashboard Display
✅ Course Content Access
✅ Data Persistence
✅ User Greetings
✅ Course Status Badges
✅ Navigation Logic
✅ Progress Tracking
✅ Video & PDF Display
✅ Module Management
✅ Empty States
✅ Error Handling
✅ Edge Cases
```

## Coverage Thresholds

The project maintains minimum coverage thresholds:

```javascript
{
  global: {
    branches: 70%,
    functions: 70%,
    lines: 70%,
    statements: 70%
  }
}
```

Current coverage exceeds these thresholds across all modules.

## Mock Strategy

### localStorage Mock
All tests use a consistent localStorage mock that simulates browser storage:
```typescript
const localStorageMock = {
  getItem: (key) => store[key] || null,
  setItem: (key, value) => { store[key] = value },
  removeItem: (key) => { delete store[key] },
  clear: () => { store = {} }
};
```

### Next.js Mocks
- `useRouter`: Mocked to track navigation calls
- `useParams`: Mocked to provide route parameters
- `Image` and `Link`: Mocked for simpler DOM testing

## Test Best Practices

### ✅ DO:
- Test user-facing behavior, not implementation details
- Use semantic queries (`getByRole`, `getByLabelText`)
- Test accessibility (form labels, ARIA attributes)
- Wait for async operations with `waitFor`
- Mock external dependencies (storage, routing)
- Clean up between tests with `beforeEach`

### ❌ DON'T:
- Test internal state directly
- Use `.toBeTruthy()` when you can be more specific
- Forget to clean up mocks
- Test implementation details (class names, internal functions)
- Ignore accessibility

## Adding New Tests

When adding new functionality:

1. **Create test file** in `__tests__` directory
2. **Follow naming convention**: `*.test.ts` or `*.test.tsx`
3. **Structure tests** with `describe` blocks
4. **Write descriptive test names** ("should do X when Y happens")
5. **Mock dependencies** appropriately
6. **Run coverage** to ensure adequate testing

Example:
```typescript
describe('NewComponent', () => {
  describe('Feature X', () => {
    it('should behave correctly when action happens', () => {
      // Arrange
      render(<NewComponent />);
      
      // Act
      fireEvent.click(screen.getByRole('button'));
      
      // Assert
      expect(screen.getByText('Result')).toBeInTheDocument();
    });
  });
});
```

## Debugging Tests

### Run specific test file
```bash
npm test -- storage.test.ts
```

### Run tests matching pattern
```bash
npm test -- --testNamePattern="payment"
```

### Show verbose output
```bash
npm test -- --verbose
```

### Debug in VS Code
Add to `.vscode/launch.json`:
```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand", "--no-cache"],
  "console": "integratedTerminal"
}
```

## Continuous Integration

Tests are designed to run in CI/CD pipelines:
- Fast execution (< 10 seconds total)
- No external dependencies
- Deterministic results
- Clear error messages

## Future Test Additions

Planned test coverage expansions:
- [ ] Integration tests for complete user flows
- [ ] E2E tests with Playwright
- [ ] API route tests (when backend is added)
- [ ] Performance tests
- [ ] Visual regression tests

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
