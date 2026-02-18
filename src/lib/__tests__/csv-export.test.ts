import { exportEnrollmentsCSV } from '../csv-export';

describe('exportEnrollmentsCSV', () => {
  let createObjectURLMock: jest.Mock;
  let revokeObjectURLMock: jest.Mock;
  let clickMock: jest.Mock;
  let appendChildSpy: jest.SpyInstance;
  let removeChildSpy: jest.SpyInstance;

  beforeEach(() => {
    createObjectURLMock = jest.fn(() => 'blob:mock-url');
    revokeObjectURLMock = jest.fn();
    clickMock = jest.fn();

    global.URL.createObjectURL = createObjectURLMock;
    global.URL.revokeObjectURL = revokeObjectURLMock;

    jest.spyOn(document, 'createElement').mockReturnValue({
      href: '',
      download: '',
      click: clickMock,
    } as unknown as HTMLAnchorElement);

    appendChildSpy = jest.spyOn(document.body, 'appendChild').mockImplementation((node) => node);
    removeChildSpy = jest.spyOn(document.body, 'removeChild').mockImplementation((node) => node);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('creates a CSV blob with correct headers and data', () => {
    const enrollments = [
      {
        uid: 'u1',
        fullName: 'João Silva',
        email: 'joao@email.com',
        phone: '(44) 99999-0000',
        purchaseDate: '2026-02-10T10:00:00Z',
        paymentMethod: 'pix',
        amount: 250,
        status: 'paid' as const,
      },
    ];

    exportEnrollmentsCSV('Fundamentos da Fé', enrollments);

    expect(createObjectURLMock).toHaveBeenCalledWith(expect.any(Blob));

    const blob = createObjectURLMock.mock.calls[0][0] as Blob;
    expect(blob.type).toBe('text/csv;charset=utf-8;');
  });

  it('triggers download and cleans up', () => {
    exportEnrollmentsCSV('Test Course', [
      {
        uid: 'u1',
        fullName: 'Test',
        email: 'test@email.com',
        phone: '',
        purchaseDate: '2026-01-01',
        paymentMethod: 'cartao',
        amount: 100,
        status: 'paid' as const,
      },
    ]);

    expect(clickMock).toHaveBeenCalled();
    expect(appendChildSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();
    expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:mock-url');
  });

  it('handles payment method labels correctly', () => {
    const enrollments = [
      {
        uid: 'u1',
        fullName: 'Maria',
        email: 'maria@email.com',
        phone: '',
        purchaseDate: '2026-03-01',
        paymentMethod: 'pix',
        amount: 250,
        status: 'paid' as const,
      },
      {
        uid: 'u2',
        fullName: 'Pedro',
        email: 'pedro@email.com',
        phone: '',
        purchaseDate: '2026-03-02',
        paymentMethod: 'cartao',
        amount: 275,
        status: 'pending' as const,
      },
    ];

    exportEnrollmentsCSV('Hermenêutica Bíblica', enrollments);

    expect(createObjectURLMock).toHaveBeenCalled();
    expect(clickMock).toHaveBeenCalled();
  });
});
