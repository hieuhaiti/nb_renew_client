import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const READONLY_MODULES = {
  toolbar: false,
};

export function RichContentViewer({ value }) {
  return (
    <div className="border-border bg-card overflow-hidden rounded-md border [&_.ql-container]:border-0 [&_.ql-editor]:min-h-35 [&_.ql-editor]:text-sm [&_.ql-toolbar]:hidden">
      <ReactQuill theme="snow" value={value} readOnly={true} modules={READONLY_MODULES} />
    </div>
  );
}
