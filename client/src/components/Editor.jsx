import { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

// Configure highlight.js
hljs.configure({
  languages: ['javascript', 'typescript', 'python', 'html', 'css', 'json', 'bash']
});

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],
    ['blockquote', 'code-block'],
    ['link', 'image'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'align': [] }],
    ['clean']
  ],
  syntax: {
    highlight: (text) => hljs.highlightAuto(text).value
  },
  clipboard: {
    matchVisual: false
  }
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet', 'check',
  'indent',
  'blockquote', 'code-block',
  'link', 'image',
  'color', 'background',
  'align'
];

function Editor({ value, onChange, placeholder }) {
  const quillRef = useRef(null);

  useEffect(() => {
    // Apply syntax highlighting to existing code blocks
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block);
    });
  }, [value]);

  return (
    <div className="editor-wrapper bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || "Start writing your note..."}
        className="min-h-[400px]"
      />
    </div>
  );
}

export default Editor;
