import {
  Alignment,
  Autoformat,
  Base64UploadAdapter,
  BlockQuote,
  Bold,
  ClassicEditor,
  Essentials,
  FontColor,
  FontFamily,
  FontSize,
  Heading,
  Image,
  ImageCaption,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  Indent,
  Italic,
  Link,
  List,
  MediaEmbed,
  Paragraph,
  PasteFromOffice,
  Table,
  TableToolbar,
  TextTransformation,
  Undo,
} from 'ckeditor5';
import type {EditorConfig} from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';

class MinimalEditor extends ClassicEditor {
  public static override builtinPlugins = [Bold, Essentials, Italic, List, Paragraph, Undo];

  public static override defaultConfig: EditorConfig = {
    toolbar: {
      items: ['bold', 'italic', 'bulletedList', 'numberedList', '|', 'undo', 'redo'],
    },
    language: 'en',
    licenseKey: 'GPL',
  };
}

class Editor extends ClassicEditor {
  public static override builtinPlugins = [
    Alignment,
    Autoformat,
    Base64UploadAdapter,
    BlockQuote,
    Bold,
    Essentials,
    FontColor,
    FontFamily,
    FontSize,
    Heading,
    Image,
    ImageCaption,
    ImageStyle,
    ImageToolbar,
    ImageUpload,
    Indent,
    Italic,
    Link,
    List,
    MediaEmbed,
    Paragraph,
    PasteFromOffice,
    Table,
    TableToolbar,
    TextTransformation,
    Undo,
  ];

  public static override defaultConfig: EditorConfig = {
    toolbar: {
      items: [
        'heading',
        'fontFamily',
        'fontSize',
        'fontColor',
        '|',
        'bold',
        'italic',
        'link',
        'bulletedList',
        'numberedList',
        '|',
        'indent',
        'outdent',
        '|',
        'alignment',
        '|',
        'imageUpload',
        'blockQuote',
        'insertTable',
        'mediaEmbed',
        '|',
        'undo',
        'redo',
      ],
    },
    language: 'en',
    image: {
      toolbar: [
        'imageTextAlternative',
        'toggleImageCaption',
        'imageStyle:inline',
        'imageStyle:block',
        'imageStyle:side',
      ],
    },
    table: {
      contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
    },
    licenseKey: 'GPL',
  };
}

type AnyEditor = typeof MinimalEditor | typeof Editor;

export {MinimalEditor, AnyEditor};
export default Editor;
