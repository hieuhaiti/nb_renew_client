import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { RichContentViewer } from '@/components/common/RichContentViewer';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function ComponentShowcase() {
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [selectValue, setSelectValue] = useState('');
  const richSample = `
    <h4>Noi dung gioi thieu</h4>
    <p><strong>Ninh Binh</strong> co he sinh thai da dang va diem den van hoa dac sac.</p>
    <ul>
      <li>Kham pha danh thang va du lich sinh thai</li>
      <li>Theo doi thong tin canh bao va thoi tiet</li>
      <li>Tra cuu dich vu va hanh trinh</li>
    </ul>
  `;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-4 text-2xl font-bold">Component Examples</h2>
      </div>

      {/* Buttons */}
      <section className="space-y-3">
        <h3 className="text-lg font-semibold">Buttons</h3>
        <div className="flex flex-wrap gap-2">
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="ghost">Ghost</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>

      {/* Button Sizes */}
      <section className="space-y-3">
        <h3 className="text-lg font-semibold">Button Sizes</h3>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      {/* Input */}
      <section className="space-y-3">
        <h3 className="text-lg font-semibold">Input Fields</h3>
        <div className="space-y-2">
          <Label htmlFor="input1">Normal Input</Label>
          <Input
            id="input1"
            placeholder="Enter text..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="input2">Disabled Input</Label>
          <Input id="input2" placeholder="Disabled..." disabled />
        </div>
      </section>

      {/* Rich Content */}
      <section className="space-y-3">
        <h3 className="text-lg font-semibold">Rich Content (Read Only)</h3>
        <div className="space-y-2">
          <Label>Content Preview</Label>
          <RichContentViewer value={richSample} />
        </div>
      </section>

      {/* Checkbox */}
      <section className="space-y-3">
        <h3 className="text-lg font-semibold">Checkbox</h3>
        <div className="flex items-center space-x-2">
          <Checkbox id="checkbox1" checked={checkboxValue} onCheckedChange={setCheckboxValue} />
          <Label htmlFor="checkbox1">Accept terms and conditions</Label>
        </div>
      </section>

      {/* Select */}
      <section className="space-y-3">
        <h3 className="text-lg font-semibold">Select Dropdown</h3>
        <div className="space-y-2">
          <Label>Choose an option</Label>
          <Select value={selectValue} onValueChange={setSelectValue}>
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">Option 1</SelectItem>
              <SelectItem value="option2">Option 2</SelectItem>
              <SelectItem value="option3">Option 3</SelectItem>
              <SelectItem value="option4">Option 4</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* Dialog */}
      <section className="space-y-3">
        <h3 className="text-lg font-semibold">Dialog Modal</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Open Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog Title</DialogTitle>
              <DialogDescription>
                This is a dialog description. You can use it to create modals with titles,
                descriptions, and custom content.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input placeholder="Enter something..." />
              <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
            </div>
          </DialogContent>
        </Dialog>
      </section>

      {/* Color Indicators */}
      <section className="space-y-3">
        <h3 className="text-lg font-semibold">Color Variants</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          <div className="bg-primary text-primary-foreground flex h-20 items-center justify-center rounded-lg font-semibold">
            Primary
          </div>
          <div className="bg-secondary text-secondary-foreground flex h-20 items-center justify-center rounded-lg font-semibold">
            Secondary
          </div>
          <div className="bg-accent text-accent-foreground flex h-20 items-center justify-center rounded-lg font-semibold">
            Accent
          </div>
          <div className="bg-destructive text-destructive-foreground flex h-20 items-center justify-center rounded-lg font-semibold">
            Destructive
          </div>
          <div className="bg-muted text-muted-foreground flex h-20 items-center justify-center rounded-lg font-semibold">
            Muted
          </div>
          <div className="bg-card border-border text-card-foreground flex h-20 items-center justify-center rounded-lg border font-semibold">
            Card
          </div>
        </div>
      </section>
    </div>
  );
}
