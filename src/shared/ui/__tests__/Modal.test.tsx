import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Modal } from '..';

function ModalHarness() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button type="button" onClick={() => setOpen(true)}>
        Open modal
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Test Modal">
        <div>
          <button type="button">Inner A</button>
          <button type="button">Inner B</button>
        </div>
      </Modal>
    </div>
  );
}

beforeAll(() => {
  const modalRoot = document.createElement('div');
  modalRoot.setAttribute('id', 'modal-root');
  document.body.appendChild(modalRoot);
});

afterEach(() => {
  vi.restoreAllMocks();

  document.body.style.overflow = '';
});

describe('Modal', () => {
  it('renders into #modal-root (portal) when open', () => {
    render(<ModalHarness />);

    fireEvent.click(screen.getByRole('button', { name: /open modal/i }));

    expect(
      screen.getByRole('dialog', { name: /test modal/i })
    ).toBeInTheDocument();
  });

  it('calls onClose when pressing Escape', () => {
    render(<ModalHarness />);

    fireEvent.click(screen.getByRole('button', { name: /open modal/i }));
    const dialog = screen.getByRole('dialog', { name: /test modal/i });
    expect(dialog).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByRole('dialog', { name: /test modal/i })).toBeNull();
  });

  it('closes when clicking outside (backdrop), but not when clicking inside', () => {
    render(<ModalHarness />);

    fireEvent.click(screen.getByRole('button', { name: /open modal/i }));
    const dialog = screen.getByRole('dialog', { name: /test modal/i });
    const backdrop = screen.getByRole('presentation');

    fireEvent.mouseDown(dialog);
    expect(
      screen.getByRole('dialog', { name: /test modal/i })
    ).toBeInTheDocument();

    fireEvent.mouseDown(backdrop);
    expect(screen.queryByRole('dialog', { name: /test modal/i })).toBeNull();
  });

  it('focuses first focusable element on open and restores focus on close', () => {
    render(<ModalHarness />);

    const opener = screen.getByRole('button', { name: /open modal/i });
    opener.focus();
    expect(opener).toHaveFocus();

    fireEvent.click(opener);

    const closeBtn = screen.getByRole('button', { name: /close/i });
    expect(closeBtn).toHaveFocus();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(opener).toHaveFocus();
  });
  it('traps focus with Tab and Shift+Tab between first and last focusable elements', async () => {
    const user = userEvent.setup();
    render(<ModalHarness />);

    await user.click(screen.getByRole('button', { name: /open modal/i }));

    const closeBtn = screen.getByRole('button', { name: /close/i });
    const innerA = screen.getByRole('button', { name: /inner a/i });
    const innerB = screen.getByRole('button', { name: /inner b/i });

    innerB.focus();
    expect(innerB).toHaveFocus();
    await user.tab();
    expect(closeBtn).toHaveFocus();

    closeBtn.focus();
    await user.tab({ shift: true });
    expect(innerB).toHaveFocus();

    closeBtn.focus();
    await user.tab();
    expect(innerA).toHaveFocus();
  });
  it('locks body scroll while open and restores after close', () => {
    render(<ModalHarness />);

    fireEvent.click(screen.getByRole('button', { name: /open modal/i }));
    expect(document.body.style.overflow).toBe('hidden');

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(document.body.style.overflow).toBe('');
  });
});
