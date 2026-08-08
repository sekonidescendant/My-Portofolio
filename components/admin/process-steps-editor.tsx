'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { CaseStudyProcessStep } from '@/lib/types/database';

export function ProcessStepsEditor({
  steps,
  onChange,
}: {
  steps: CaseStudyProcessStep[];
  onChange: (steps: CaseStudyProcessStep[]) => void;
}) {
  function updateStep(index: number, patch: Partial<CaseStudyProcessStep>) {
    onChange(steps.map((step, i) => (i === index ? { ...step, ...patch } : step)));
  }

  function removeStep(index: number) {
    onChange(steps.filter((_, i) => i !== index));
  }

  function addStep() {
    onChange([...steps, { title: '', description: '' }]);
  }

  return (
    <div className="space-y-3">
      {steps.map((step, i) => (
        <div key={i} className="space-y-2 rounded-md border border-border p-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-secondary text-xs font-semibold text-muted-foreground">
              {i + 1}
            </span>
            <Input
              value={step.title}
              onChange={(e) => updateStep(i, { title: e.target.value })}
              placeholder="Step title, e.g. Launch Strategy"
              className="h-8"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 text-destructive hover:text-destructive"
              onClick={() => removeStep(i)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
          <Textarea
            value={step.description}
            onChange={(e) => updateStep(i, { description: e.target.value })}
            placeholder="What happened in this step..."
            rows={2}
            className="text-sm"
          />
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addStep}>
        <Plus className="mr-1.5 h-3.5 w-3.5" />
        Add step
      </Button>
    </div>
  );
}
