# @manufosela/capture-image

[![npm version](https://img.shields.io/npm/v/@manufosela/capture-image)](https://www.npmjs.com/package/@manufosela/capture-image)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Webcam capture with zoom & pan.** Point, zoom in, frame the shot exactly how you want it, then snap — the image captures precisely what you see. Optional rectangular mask overlay for ID-style framing. Built with [Lit](https://lit.dev/).

## Install

```bash
npm install @manufosela/capture-image
```

## Quick Start

### Basic

```html
<script type="module">
  import '@manufosela/capture-image';
</script>

<capture-image size-x="640" size-y="480"></capture-image>
```

### With mask overlay

Use `mask` to show a rectangular framing guide. `maskpercent` controls the border thickness as a percentage of each dimension.

```html
<capture-image size-x="640" size-y="480" mask maskpercent="20"></capture-image>
```

### With zoom

Set `max-zoom` to control how far the user can zoom in. The default is `5` (5×). Zoom is also available via mouse wheel and the built-in ± buttons.

```html
<capture-image size-x="640" size-y="480" max-zoom="8"></capture-image>

<script type="module">
  import '@manufosela/capture-image';

  const cam = document.querySelector('capture-image');

  cam.addEventListener('capture-image-snap', (e) => {
    console.log('Snapped:', e.detail.dataURL); // base64 PNG data URL
  });

  cam.addEventListener('capture-image-save', (e) => {
    console.log('Saved as:', e.detail.filename);
  });

  cam.addEventListener('capture-image-error', (e) => {
    console.error('Camera error:', e.detail.error);
  });
</script>
```

## Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `size-x` | Number | `640` | Video/canvas width in pixels |
| `size-y` | Number | `480` | Video/canvas height in pixels |
| `mask` | Boolean | `false` | Show a rectangular mask overlay |
| `maskpercent` | Number | `30` | Mask border thickness as % of each dimension (0–100) |
| `max-zoom` | Number | `5` | Maximum zoom level |

## Methods

| Method | Description |
| --- | --- |
| `snapImage()` | Captures the current view (including zoom/pan) onto the canvas and fires `capture-image-snap` |
| `resetImage()` | Clears the snapshot canvas and hides the Save button |
| `saveImage(event)` | Triggers a PNG download of the current snapshot and fires `capture-image-save`. Pass the click `Event` from a link/button. |
| `zoomIn()` | Increases zoom by 0.5× (up to `max-zoom`) |
| `zoomOut()` | Decreases zoom by 0.5× (minimum 1×, resets pan at 1×) |
| `resetZoom()` | Resets zoom to 1× and pan to origin |

## Events

| Event | Detail | When |
| --- | --- | --- |
| `capture-image-snap` | `{ dataURL }` | Photo snapped — `dataURL` is a base64 PNG data URL of the captured frame |
| `capture-image-save` | `{ filename }` | Save link clicked — `filename` is the generated `snapshot-<timestamp>.png` name |
| `capture-image-error` | `{ error }` | `getUserMedia` unavailable, permission denied, or any camera error |

## Zoom & Pan

The component renders a live video feed inside a fixed-size viewport. Zoom and pan apply a CSS transform to the video element — the rest of the component stays the same size.

**Zoom in:** scroll up with the mouse wheel, or click the `+` button in the control bar.  
**Zoom out:** scroll down, or click the `−` button. At 1× zoom the pan resets automatically.  
**Pan:** while zoomed in, click and drag anywhere on the video to reframe the shot. The cursor changes to a grab hand when panning is available.  
**Reset:** click the `1:1` button (visible only when zoomed) to snap back to 1× and centred.

**What you see is what you get.** `snapImage()` computes the visible region of the native video frame — accounting for zoom level, pan offset, and any difference between display size and camera resolution — and draws only that region onto the canvas at full output resolution. Snapping a 3× zoomed and panned view produces the same crop as cropping a full-res frame to that rectangle.

When `mask` is enabled the snap further crops to the unmasked area, so the framing guide is reflected in the output.

## HTTPS requirement

`navigator.mediaDevices.getUserMedia` is only available on **secure contexts**: `https://` origins and `localhost`. Serving the page over plain `http://` on any non-localhost host will cause the component to fire `capture-image-error` immediately on load.

## Accessibility

- **`prefers-reduced-motion`** — button hover/active transitions are disabled when the user requests reduced motion
- Zoom buttons carry `aria-label="Zoom in"` and `aria-label="Zoom out"` so screen readers announce their purpose (the visible labels are `+` and `−`)
- Snap, Reset, and 1:1 buttons are native `<button type="button">` elements — keyboard-focusable and announced by screen readers
- The component requires a **secure context** (`https://` or `localhost`) — `getUserMedia` is unavailable on plain HTTP and the component fires `capture-image-error` immediately in that case
- Camera permission must be granted by the user; denial is reported via the `capture-image-error` event

## License

MIT
