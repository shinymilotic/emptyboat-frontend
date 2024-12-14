import { Component, ElementRef, EventEmitter, Input, Output, Renderer2 } from '@angular/core';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss'
})
export class EditorComponent {
editor!: Editor;
  editors: any = {};
  items: Array<any> = [];
  editorFocus: boolean = false;
  @Output() content: EventEmitter<string> = new EventEmitter<string>();
  
  constructor(public elementRef: ElementRef, public renderer: Renderer2) {}

  ngOnInit(): void {
    this.editor = new Editor({
      element: this.elementRef.nativeElement.querySelector('.tiptap-editor') as HTMLElement,
      extensions: [
        StarterKit
      ],
      content: '<div class="editor-content"></div>',
    });

    this.items = [
      {
        icon: 'format_bold',
        title: 'Bold',
        action: () => this.editor.chain().focus().toggleBold().run(),
        isActive: () => this.editor.isActive('bold'),
      },
      {
        icon: 'format_italic',
        title: 'Italic',
        action: () => this.editor.chain().focus().toggleItalic().run(),
        isActive: () => this.editor.isActive('italic'),
      },
      {
        icon: 'format_strikethrough',
        title: 'Strike',
        action: () => this.editor.chain().focus().toggleStrike().run(),
        isActive: () => this.editor.isActive('strike'),
      },
      {
        icon: 'code',
        title: 'Code',
        action: () => this.editor.chain().focus().toggleCode().run(),
        isActive: () => this.editor.isActive('code'),
      },
      {
        icon: 'format_h1',
        title: 'Heading 1',
        action: () => this.editor.chain().focus().toggleHeading({ level: 1 }).run(),
        isActive: () => this.editor.isActive('heading', { level: 1 }),
      },
      {
        icon: 'format_h2',
        title: 'Heading 2',
        action: () => this.editor.chain().focus().toggleHeading({ level: 2 }).run(),
        isActive: () => this.editor.isActive('heading', { level: 2 }),
      },
      {
        icon: 'format_paragraph',
        title: 'Paragraph',
        action: () => this.editor.chain().focus().setParagraph().run(),
        isActive: () => this.editor.isActive('paragraph'),
      },
      {
        icon: 'format_list_bulleted',
        title: 'Bullet List',
        action: () => this.editor.chain().focus().toggleBulletList().run(),
        isActive: () => this.editor.isActive('bulletList'),
      },
      {
        icon: 'format_list_numbered',
        title: 'Ordered List',
        action: () => this.editor.chain().focus().toggleOrderedList().run(),
        isActive: () => this.editor.isActive('orderedList'),
      },
      {
        icon: 'code_blocks',
        title: 'Code Block',
        action: () => this.editor.chain().focus().toggleCodeBlock().run(),
        isActive: () => this.editor.isActive('codeBlock'),
      },
      {
        icon: 'format_quote',
        title: 'Blockquote',
        action: () => this.editor.chain().focus().toggleBlockquote().run(),
        isActive: () => this.editor.isActive('blockquote'),
      },
      {
        icon: 'horizontal_rule',
        title: 'Horizontal Rule',
        action: () => this.editor.chain().focus().setHorizontalRule().run(),
      },
      {
        icon: 'undo',
        title: 'Undo',
        action: () => this.editor.chain().focus().undo().run(),
        isActive: () => this.editor.isActive('undo'),
      },
      {
        icon: 'redo',
        title: 'Redo',
        action: () => this.editor.chain().focus().redo().run(),
        isActive: () => this.editor.isActive('redo'),
      },
    ];

    this.editor.on('update', () => {
      this.content.emit(this.editor.getHTML());
    });

    this.editor.on('focus', () => {
      this.editorFocus = true;
    });

    this.editor.on('blur', ($event) => {
      if ($event.event.relatedTarget != null && ($event.event.relatedTarget as HTMLElement).classList.contains('menu-item')) {
        return;
      }
      this.editorFocus = false;
    });
  }
}
