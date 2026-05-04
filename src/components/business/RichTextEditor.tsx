'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { 
  Bold, Italic, List, ListOrdered, Link as LinkIcon, 
  Image as ImageIcon, AlignLeft, AlignCenter, AlignRight, 
  Heading1, Heading2, Undo, Redo, Quote, Palette
} from 'lucide-react';

interface Props {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt('URL');
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt('Image URL');
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const setTextColor = () => {
    const color = window.prompt('Hex Color (e.g. #7A1E2E)');
    if (color) editor.chain().focus().setColor(color).run();
  };

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50 rounded-t-xl sticky top-0 z-10">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-200 text-blue-600' : ''}`}
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-200 text-blue-600' : ''}`}
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200 text-blue-600' : ''}`}
        title="Heading 1"
      >
        <Heading1 className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 text-blue-600' : ''}`}
        title="Heading 2"
      >
        <Heading2 className="w-4 h-4" />
      </button>
      <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-200 text-blue-600' : ''}`}
        title="Bullet List"
      >
        <List className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-200 text-blue-600' : ''}`}
        title="Ordered List"
      >
        <ListOrdered className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('blockquote') ? 'bg-gray-200 text-blue-600' : ''}`}
        title="Quote"
      >
        <Quote className="w-4 h-4" />
      </button>
      <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
      <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'left' }) ? 'text-blue-600' : ''}`} title="Align Left"><AlignLeft className="w-4 h-4" /></button>
      <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'center' }) ? 'text-blue-600' : ''}`} title="Align Center"><AlignCenter className="w-4 h-4" /></button>
      <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'right' }) ? 'text-blue-600' : ''}`} title="Align Right"><AlignRight className="w-4 h-4" /></button>
      <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
      <button onClick={setTextColor} className="p-2 rounded hover:bg-gray-200" title="Text Color"><Palette className="w-4 h-4" /></button>
      <button onClick={addLink} className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('link') ? 'text-blue-600' : ''}`} title="Add Link"><LinkIcon className="w-4 h-4" /></button>
      <button onClick={addImage} className="p-2 rounded hover:bg-gray-200" title="Add Image"><ImageIcon className="w-4 h-4" /></button>
      <div className="flex-1" />
      <button onClick={() => editor.chain().focus().undo().run()} className="p-2 rounded hover:bg-gray-200" title="Undo"><Undo className="w-4 h-4" /></button>
      <button onClick={() => editor.chain().focus().redo().run()} className="p-2 rounded hover:bg-gray-200" title="Redo"><Redo className="w-4 h-4" /></button>
    </div>
  );
};

export const RichTextEditor = ({ content, onChange, placeholder = 'Start writing...' }: Props) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder }),
      TextStyle,
      Color,
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="border border-gray-200 rounded-xl focus-within:ring-4 focus-within:ring-primary/10 transition-all bg-white shadow-sm overflow-hidden">
      <MenuBar editor={editor} />
      <div className="p-6 min-h-[350px] prose prose-lg max-w-none prose-primary selection:bg-primary/20">
        <EditorContent editor={editor} className="min-h-[300px]" />
      </div>
      <style jsx global>{`
        .ProseMirror:focus { outline: none; }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: right;
          color: #9ca3af;
          pointer-events: none;
          height: 0;
          text-align: right;
          font-style: italic;
        }
        [dir="ltr"] .ProseMirror p.is-editor-empty:first-child::before {
          float: left;
          text-align: left;
        }
        .ProseMirror {
          min-height: 300px;
        }
        .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 1.5rem;
          margin: 2rem auto;
          display: block;
          box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
        }
        .ProseMirror blockquote {
          border-right: 4px solid var(--primary);
          padding-right: 1.5rem;
          margin-right: 0;
          font-style: italic;
          color: #4b5563;
        }
        [dir="ltr"] .ProseMirror blockquote {
          border-left: 4px solid var(--primary);
          border-right: 0;
          padding-left: 1.5rem;
          margin-left: 0;
        }
      `}</style>
    </div>
  );
};
