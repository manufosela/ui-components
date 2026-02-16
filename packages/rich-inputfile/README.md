# @manufosela/rich-inputfile

[![npm version](https://img.shields.io/npm/v/@manufosela/rich-inputfile)](https://www.npmjs.com/package/@manufosela/rich-inputfile)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Enhanced file input web component with preview and validation. Built with [Lit](https://lit.dev/).

## Installation

```bash
npm install @manufosela/rich-inputfile
```

## Usage

```javascript
import '@manufosela/rich-inputfile';
```

```html
<rich-inputfile label="Upload File"></rich-inputfile>
```

## Features

- Drag and drop support
- Image preview thumbnails
- File type validation
- File size validation
- Clear button
- Programmatic file access
- CSS custom properties for theming

## Attributes

| Attribute            | Type    | Default | Description                        |
| -------------------- | ------- | ------- | ---------------------------------- |
| `name`               | String  | `''`    | Input name attribute               |
| `label`              | String  | `''`    | Label text                         |
| `allowed-extensions` | String  | `''`    | Comma-separated allowed extensions |
| `accept`             | String  | `''`    | HTML accept attribute value        |
| `max-size`           | Number  | `0`     | Maximum file size in bytes (0=no limit) |
| `show-preview`       | Boolean | `true`  | Show image thumbnail preview       |
| `preview-size`       | Number  | `60`    | Preview thumbnail size in pixels   |
| `dropzone`           | Boolean | `true`  | Enable drag and drop               |
| `disabled`           | Boolean | `false` | Disable the input                  |

## Methods

| Method                  | Returns                | Description                |
| ----------------------- | ---------------------- | -------------------------- |
| `getFile()`             | `File \| null`         | Get selected file          |
| `getFileArrayBuffer()`  | `Promise<ArrayBuffer>` | Get file as ArrayBuffer    |
| `getFileUint8Array()`   | `Promise<Uint8Array>`  | Get file as Uint8Array     |
| `getFileDataURL()`      | `Promise<string>`      | Get file as Data URL       |
| `setFile(file)`         | `void`                 | Set file programmatically  |
| `clear()`               | `void`                 | Clear selected file        |

## Events

| Event         | Detail                        | Description               |
| ------------- | ----------------------------- | ------------------------- |
| `file-change` | `{file, name, size, type}`    | Fired on file selection   |
| `file-clear`  | -                             | Fired when file is cleared|
| `file-error`  | `{message, file}`             | Fired on validation error |

## Examples

### Basic

```html
<rich-inputfile label="Upload File"></rich-inputfile>
```

### Image Upload

```html
<rich-inputfile
  label="Upload Image"
  allowed-extensions="jpg,jpeg,png,gif,webp"
></rich-inputfile>
```

### Document Upload

```html
<rich-inputfile
  label="Upload Document"
  allowed-extensions="pdf,doc,docx"
  max-size="5242880"
></rich-inputfile>
```

### Size Limit

```html
<rich-inputfile
  label="Max 1MB"
  max-size="1048576"
></rich-inputfile>
```

### No Preview

```html
<rich-inputfile
  label="Upload"
  .showPreview="${false}"
></rich-inputfile>
```

### Disabled

```html
<rich-inputfile
  label="Disabled"
  disabled
></rich-inputfile>
```

### Click Only (No Drag)

```html
<rich-inputfile
  label="Click to Upload"
  .dropzone="${false}"
></rich-inputfile>
```

### Handle Events

```javascript
const input = document.querySelector('rich-inputfile');

input.addEventListener('file-change', (e) => {
  console.log('File:', e.detail.name);
  console.log('Size:', e.detail.size);
  console.log('Type:', e.detail.type);
});

input.addEventListener('file-error', (e) => {
  console.log('Error:', e.detail.message);
});

input.addEventListener('file-clear', () => {
  console.log('File cleared');
});
```

### Programmatic Access

```javascript
const input = document.querySelector('rich-inputfile');

// Get file
const file = input.getFile();

// Get as ArrayBuffer
const buffer = await input.getFileArrayBuffer();

// Get as Uint8Array
const uint8 = await input.getFileUint8Array();

// Get as Data URL (for images)
const dataUrl = await input.getFileDataURL();

// Clear file
input.clear();
```

## CSS Custom Properties

| Property              | Default    | Description         |
| --------------------- | ---------- | ------------------- |
| `--input-border`      | `#d1d5db`  | Border color        |
| `--input-border-focus`| `#3b82f6`  | Focus border color  |
| `--input-bg`          | `#fff`     | Background color    |
| `--input-radius`      | `8px`      | Border radius       |

## Styling Example

```css
rich-inputfile {
  --input-border: #e5e7eb;
  --input-border-focus: #8b5cf6;
  --input-radius: 12px;
}
```

## Compared to Original

| Feature | Original | New |
| ------- | -------- | --- |
| Lit version | Lit 2.x | Lit 3.x |
| Drag & drop | Manual | Built-in |
| Validation | Extension only | Extension + size |
| Preview | Basic | Improved |
| Methods | Limited | Full API |
| Tests | Basic | Comprehensive |

## Accessibility

- Native `<input type="file">` element ensures screen reader compatibility
- Label text properly associated with input area
- Visual feedback for drag-over state
- Error messages displayed clearly for validation failures
- Clear button provides explicit file removal action
- Disabled state visually distinct with reduced opacity
- File size and type information displayed after selection
- Respects `prefers-reduced-motion` by disabling transitions

## License

Apache-2.0
