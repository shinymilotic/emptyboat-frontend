import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';

@Component({
  selector: 'app-open-question',
  templateUrl: './open-question-editor.component.html',
  styleUrls: ['./open-question-editor.component.scss'],
  standalone: true,
})
export class OpenQuestionEditorComponent implements OnInit {
  editor!: Editor;
  editors: any = {};
  items: Array<any> = [];
  @Input() questionId!: string;
  
  constructor(public elementRef: ElementRef) {}

  ngOnInit(): void {
    
    this.editors[this.questionId] = new Editor({
      element: this.elementRef.nativeElement.querySelector('.tiptap-editor') as HTMLElement,
      extensions: [
        StarterKit,
      ],
      content: '<div class="editor-content"></div>',
    });
  }

  showEditorMenuOnClick(questionId: number) : void {
    this.items = [
      {
        icon: 'format_bold',
        title: 'Bold',
        action: () => this.editors[questionId].chain().focus().toggleBold().run(),
        isActive: () => this.editors[questionId].isActive('bold'),
      },
      {
        icon: 'format_italic',
        title: 'Italic',
        action: () => this.editors[questionId].chain().focus().toggleItalic().run(),
        isActive: () => this.editors[questionId].isActive('italic'),
      },
      {
        icon: 'format_strikethrough',
        title: 'Strike',
        action: () => this.editors[questionId].chain().focus().toggleStrike().run(),
        isActive: () => this.editors[questionId].isActive('strike'),
      },
      {
        icon: 'code',
        title: 'Code',
        action: () => this.editors[questionId].chain().focus().toggleCode().run(),
        isActive: () => this.editors[questionId].isActive('code'),
      },
      {
        icon: 'format_h1',
        title: 'Heading 1',
        action: () => this.editors[questionId].chain().focus().toggleHeading({ level: 1 }).run(),
        isActive: () => this.editors[questionId].isActive('heading', { level: 1 }),
      },
      {
        icon: 'format_h2',
        title: 'Heading 2',
        action: () => this.editors[questionId].chain().focus().toggleHeading({ level: 2 }).run(),
        isActive: () => this.editors[questionId].isActive('heading', { level: 2 }),
      },
      {
        icon: 'format_paragraph',
        title: 'Paragraph',
        action: () => this.editors[questionId].chain().focus().setParagraph().run(),
        isActive: () => this.editors[questionId].isActive('paragraph'),
      },
      {
        icon: 'format_list_bulleted',
        title: 'Bullet List',
        action: () => this.editors[questionId].chain().focus().toggleBulletList().run(),
        isActive: () => this.editors[questionId].isActive('bulletList'),
      },
      {
        icon: 'format_list_numbered',
        title: 'Ordered List',
        action: () => this.editors[questionId].chain().focus().toggleOrderedList().run(),
        isActive: () => this.editors[questionId].isActive('orderedList'),
      },
      {
        icon: 'code_blocks',
        title: 'Code Block',
        action: () => this.editors[questionId].chain().focus().toggleCodeBlock().run(),
        isActive: () => this.editors[questionId].isActive('codeBlock'),
      },
      {
        icon: 'format_quote',
        title: 'Blockquote',
        action: () => this.editors[questionId].chain().focus().toggleBlockquote().run(),
        isActive: () => this.editors[questionId].isActive('blockquote'),
      },
      {
        icon: 'horizontal_rule',
        title: 'Horizontal Rule',
        action: () => this.editors[questionId].chain().focus().setHorizontalRule().run(),
      },
      {
        icon: 'undo',
        title: 'Undo',
        action: () => this.editors[questionId].chain().focus().undo().run(),
        isActive: () => this.editors[questionId].isActive('undo'),
      },
      {
        icon: 'redo',
        title: 'Redo',
        action: () => this.editors[questionId].chain().focus().redo().run(),
        isActive: () => this.editors[questionId].isActive('redo'),
      },
    ];
  }
}
