import 'vitest-localstorage-mock';
import { beforeEach } from 'vitest';

// Complete reset before each test for total isolation
beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  vi.clearAllMocks();
  vi.restoreAllMocks();
});
