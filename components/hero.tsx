import Link from 'next/link';
import { EditModeToggle, EditableCopy } from '@/components/editable-copy';

export default function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-28 sm:px-6">
      <div className="flex justify-end border-b border-border pb-4">
        <EditModeToggle />
      </div>

      <div className="border-b border-border py-12">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-tertiary">
            public archive / reviewed work / human-written notes
          </p>
          <h1 className="mt-6 max-w-2xl text-5xl font-semibold leading-tight tracking-normal text-primary sm:text-6xl">
            <EditableCopy
              storageKey="home.headline"
              placeholder="i build small apps and write about what they reveal."
              multiline
              textareaClassName="min-h-40 text-4xl leading-tight sm:text-5xl"
            />
          </h1>
          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link href="/work/" className="text-primary hover:underline underline-offset-4">
              see my work
            </Link>
            <Link href="/posts/" className="text-primary hover:underline underline-offset-4">
              read writing →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
