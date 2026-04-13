# @manufosela/capture-image

Webcam capture web component that lets users snap, reset and save photos. Optional rectangular mask overlay. Built with Lit 3.

## Installation

```bash
npm install @manufosela/capture-image
```

## Usage

```html
<script type="module">
  import '@manufosela/capture-image';
</script>

<capture-image size-x="640" size-y="480" mask maskpercent="25"></capture-image>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `size-x` | Number | 640 | Video/canvas width in pixels |
| `size-y` | Number | 480 | Video/canvas height in pixels |
| `maskpercent` | Number | 30 | Mask border percentage (0-100) |
| `mask` | Boolean | false | Show rectangular mask overlay |

## Events

- `capture-image-snap` — Fired when a photo is snapped. `detail: { dataURL }`
- `capture-image-save` — Fired when a photo is saved. `detail: { filename }`
- `capture-image-error` — Fired on getUserMedia errors. `detail: { error }`

## Browser support

Requires `navigator.mediaDevices.getUserMedia`. Works on secure contexts (HTTPS or localhost).

## License

MIT
