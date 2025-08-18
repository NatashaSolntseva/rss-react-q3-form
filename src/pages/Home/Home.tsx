import { useState } from 'react';
import { AppButton, Modal } from '@/shared/ui';
import { ControlledForm } from '@/features';

export const Home = () => {
  const [form, setForm] = useState<'uncontrolled' | 'rhf' | null>(null);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 text-white">
      <h1 className="text-3xl font-bold">Welcome to React Forms</h1>
      <p className="mt-2 text-white/80">
        Two approaches, one UX. Open a modal to start:
      </p>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row">
        <AppButton
          text="Open Uncontrolled Form"
          onClick={() => setForm('uncontrolled')}
        />
        <AppButton text="Open RHF Form" onClick={() => setForm('rhf')} />
      </div>

      <Modal
        open={form !== null}
        onClose={() => setForm(null)}
        title={
          form === 'uncontrolled' ? 'Uncontrolled Form' : 'React Hook Form'
        }
      >
        <div className="space-y-3 text-white/90">
          {form === 'uncontrolled' ? (
            <p>Uncontrolled form placeholder (validate on submit)…</p>
          ) : (
            <ControlledForm />
          )}
          <div className="text-sm text-white/60">
            Press <kbd className="rounded bg-white/10 px-1">Esc</kbd> to close
            or click outside.
          </div>
        </div>
      </Modal>
    </div>
  );
};
