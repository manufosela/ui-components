import { css } from 'lit';

export const photoCollageStyles = css`
  :host {
    display: block;
    overflow: hidden;
  }

  .collage {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  .cell {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: visible;
  }

  .photo-wrapper {
    position: relative;
    width: 85%;
    height: 85%;
    transition:
      opacity 0.6s ease-in-out,
      transform 0.3s ease;
  }

  .photo-wrapper.fading-out {
    opacity: 0;
  }

  .photo-wrapper.fading-in {
    opacity: 1;
  }

  .photo-wrapper.polaroid {
    background: #fff;
    padding: 4px 4px 14px 4px;
    box-shadow:
      2px 3px 10px rgba(0, 0, 0, 0.25),
      0 1px 3px rgba(0, 0, 0, 0.12);
    border-radius: 2px;
  }

  .photo-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    border-radius: 1px;
  }

  :host([zoomable]) .photo-wrapper {
    cursor: zoom-in;
  }

  .photo-wrapper:hover {
    transform: scale(1.05) rotate(0deg) !important;
    z-index: 10;
    transition: transform 0.2s ease;
  }

  .overlay {
    display: none;
    position: fixed;
    inset: 0;
    z-index: 100;
    background: rgba(0, 0, 0, 0);
    justify-content: center;
    align-items: center;
    cursor: zoom-out;
    transition: background 0.3s ease;
  }

  .overlay.active {
    display: flex;
    background: rgba(0, 0, 0, 0.85);
  }

  .overlay img {
    max-width: 90vw;
    max-height: 90vh;
    object-fit: contain;
    border-radius: 3px;
    transform: scale(0.3) rotate(5deg);
    opacity: 0;
    transition:
      transform 0.4s cubic-bezier(0.2, 0.9, 0.3, 1.2),
      opacity 0.3s ease;
  }

  .overlay.active img {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }

  .overlay.active.polaroid img {
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5);
    border: 6px solid #fff;
  }

  ::slotted(img) {
    display: none;
  }
`;
