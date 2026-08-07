'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Bold,
  Heading2,
  Heading3,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Redo,
  Underline,
  Undo,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

type ToolbarAction =
  | { type: 'command'; command: string; value?: string; icon: React.ElementType; label: string }
  | { type: 'block'; tag: string; icon: React.ElementType; label: string }
  | { type: 'link' };

const TOOLBAR: ToolbarAction[] = [
  { type: 'command', command: 'bold', icon: Bold, label: 'Bold' },
  { type: 'command', command: 'italic', icon: Italic, label: 'Italic' },
  { type: 'command', command: 'underline', icon: Underline, label: 'Underline' },
  { type: 'block', tag: 'H2', icon: Heading2, label: 'Heading 2' },
  { type: 'block', tag: 'H3', icon: Heading3, label: 'Heading 3' },
  { type: 'command', command: 'insertUnorderedList', icon: List, label: 'Bullet list' },
  { type: 'command', command: 'insertOrderedList', icon: ListOrdered, label: 'Numbered list' },
  { type: 'block', tag: 'BLOCKQUOTE', icon: Quote, label: 'Quote' },
  { type: 'link' },
  { type: 'command', command: 'undo', icon: Undo, label: 'Undo' },
  { type: 'command', command: 'redo', icon: Redo, label: 'Redo' },
];

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start writing...',
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isEmpty, setIsEmpty] = useState(!value);
  const lastValueRef = useRef(value);

  // Only overwrite the DOM when `value` changes from *outside* this
  // component (e.g. loading an existing article) — otherwise every
  // keystroke would blow away cursor position.
  useEffect(() => {
    if (editorRef.current && value !== lastValueRef.current) {
      editorRef.current.innerHTML = value;
      lastValueRef.current = value;
      setIsEmpty(!value.trim());
    }
  }, [value]);

  function handleInput() {
    const html = editorRef.current?.innerHTML ?? '';
    lastValueRef.current = html;
    setIsEmpty(!editorRef.current?.textContent?.trim());
    onChange(html);
  }

  function runCommand(command: string, commandValue?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, commandValue);
    handleInput();
  }

  function toggleBlock(tag: string) {
    editorRef.current?.focus();
    document.execCommand('formatBlock', false, tag);
    handleInput();
  }

  function insertLink() {
    const url = window.prompt('Link URL');
    if (!url) return;
    editorRef.current?.focus();
    document.execCommand('createLink', false, url);
    handleInput();
  }

  return (
    <div className="rounded-md border border-input">
      <div className="flex flex-wrap items-center gap-1 border-b border-input bg-secondary/30 p-1.5">
        {TOOLBAR.map((action, i) => {
          if (action.type === 'link') {
            return (
              <Button
                key="link"
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                title="Insert link"
                onClick={insertLink}
              >
                <LinkIcon className="h-4 w-4" />
              </Button>
            );
          }
          const Icon = action.icon;
          return (
            <Button
              key={`${action.label}-${i}`}
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              title={action.label}
              onClick={() =>
                action.type === 'command' ? runCommand(action.command, action.value) : toggleBlock(action.tag)
              }
            >
              <Icon className="h-4 w-4" />
            </Button>
          );
        })}
        <Separator orientation="vertical" className="mx-1 h-6" />
        <span className="text-[11px] text-muted-foreground">Select text, then apply formatting</span>
      </div>

      <div className="relative">
        {isEmpty && (
          <p className="pointer-events-none absolute left-4 top-3 text-sm text-muted-foreground">
            {placeholder}
          </p>
        )}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onBlur={handleInput}
          className={cn(
            'min-h-[320px] max-w-none px-4 py-3 text-sm leading-relaxed focus:outline-none',
            '[&_h2]:mt-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mt-3 [&_h3]:text-lg [&_h3]:font-semibold',
            '[&_blockquote]:border-l-2 [&_blockquote]:border-primary [&_blockquote]:pl-3 [&_blockquote]:italic',
            '[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-primary [&_a]:underline',
          )}
        />
      </div>
    </div>
  );
}
