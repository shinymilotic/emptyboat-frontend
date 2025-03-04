import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, signal, Signal, WritableSignal } from '@angular/core';
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
  items: Array<any> = [];
  editorFocus: boolean = false;
  @Input() questionId!: string;
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
