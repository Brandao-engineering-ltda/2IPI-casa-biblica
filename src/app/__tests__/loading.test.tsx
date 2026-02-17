import { render } from '@testing-library/react';
import LoadingPage from '../loading';

jest.mock('@/components/Loading', () => ({
  Loading: () => <div data-testid="loading">Loading...</div>,
}));

describe('LoadingPage', () => {
  it('should render Loading component', () => {
    const { getByTestId } = render(<LoadingPage />);
    expect(getByTestId('loading')).toBeInTheDocument();
  });
});
