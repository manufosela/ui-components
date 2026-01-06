import { LitElement, html, css } from 'lit';

// Minimal QR Code Generator (based on qrcode-generator by Kazuhiko Arase)
// Simplified for basic text encoding
const QRCode = (() => {
  const PAD0 = 0xec,
    PAD1 = 0x11;

  const QRMath = {
    _EXP_TABLE: new Array(256),
    _LOG_TABLE: new Array(256),
    glog(n) {
      return this._LOG_TABLE[n];
    },
    gexp(n) {
      let e = n;
      while (e < 0) e += 255;
      while (e >= 256) e -= 255;
      return this._EXP_TABLE[e];
    },
  };

  // Initialize math tables
  for (let i = 0; i < 8; i++) QRMath._EXP_TABLE[i] = 1 << i;
  for (let i = 8; i < 256; i++)
    QRMath._EXP_TABLE[i] =
      QRMath._EXP_TABLE[i - 4] ^
      QRMath._EXP_TABLE[i - 5] ^
      QRMath._EXP_TABLE[i - 6] ^
      QRMath._EXP_TABLE[i - 8];
  for (let i = 0; i < 255; i++) QRMath._LOG_TABLE[QRMath._EXP_TABLE[i]] = i;

  const QRPolynomial = function (num, shift) {
    let offset = 0;
    while (offset < num.length && num[offset] === 0) offset++;
    this.num = new Array(num.length - offset + shift);
    for (let i = 0; i < num.length - offset; i++) this.num[i] = num[i + offset];
  };

  QRPolynomial.prototype = {
    get(index) {
      return this.num[index];
    },
    getLength() {
      return this.num.length;
    },
    multiply(e) {
      const num = new Array(this.getLength() + e.getLength() - 1);
      for (let i = 0; i < this.getLength(); i++)
        for (let j = 0; j < e.getLength(); j++)
          num[i + j] ^= QRMath.gexp(QRMath.glog(this.get(i)) + QRMath.glog(e.get(j)));
      return new QRPolynomial(num, 0);
    },
    mod(e) {
      if (this.getLength() - e.getLength() < 0) return this;
      const ratio = QRMath.glog(this.get(0)) - QRMath.glog(e.get(0));
      const num = new Array(this.getLength());
      for (let i = 0; i < this.getLength(); i++) num[i] = this.get(i);
      for (let i = 0; i < e.getLength(); i++) num[i] ^= QRMath.gexp(QRMath.glog(e.get(i)) + ratio);
      return new QRPolynomial(num, 0).mod(e);
    },
  };

  const QRUtil = {
    PATTERN_POSITION_TABLE: [
      [],
      [6, 18],
      [6, 22],
      [6, 26],
      [6, 30],
      [6, 34],
      [6, 22, 38],
      [6, 24, 42],
      [6, 26, 46],
      [6, 28, 50],
      [6, 30, 54],
      [6, 32, 58],
      [6, 34, 62],
      [6, 26, 46, 66],
      [6, 26, 48, 70],
      [6, 26, 50, 74],
      [6, 30, 54, 78],
      [6, 30, 56, 82],
      [6, 30, 58, 86],
      [6, 34, 62, 90],
      [6, 28, 50, 72, 94],
      [6, 26, 50, 74, 98],
      [6, 30, 54, 78, 102],
      [6, 28, 54, 80, 106],
      [6, 32, 58, 84, 110],
      [6, 30, 58, 86, 114],
      [6, 34, 62, 90, 118],
      [6, 26, 50, 74, 98, 122],
      [6, 30, 54, 78, 102, 126],
      [6, 26, 52, 78, 104, 130],
      [6, 30, 56, 82, 108, 134],
      [6, 34, 60, 86, 112, 138],
      [6, 30, 58, 86, 114, 142],
      [6, 34, 62, 90, 118, 146],
      [6, 30, 54, 78, 102, 126, 150],
      [6, 24, 50, 76, 102, 128, 154],
      [6, 28, 54, 80, 106, 132, 158],
      [6, 32, 58, 84, 110, 136, 162],
      [6, 26, 54, 82, 110, 138, 166],
      [6, 30, 58, 86, 114, 142, 170],
    ],
    getPatternPosition(typeNumber) {
      return this.PATTERN_POSITION_TABLE[typeNumber - 1];
    },
    getMask(maskPattern, i, j) {
      switch (maskPattern) {
        case 0:
          return (i + j) % 2 === 0;
        case 1:
          return i % 2 === 0;
        case 2:
          return j % 3 === 0;
        case 3:
          return (i + j) % 3 === 0;
        case 4:
          return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0;
        case 5:
          return ((i * j) % 2) + ((i * j) % 3) === 0;
        case 6:
          return (((i * j) % 2) + ((i * j) % 3)) % 2 === 0;
        case 7:
          return (((i * j) % 3) + ((i + j) % 2)) % 2 === 0;
        default:
          throw new Error('bad maskPattern:' + maskPattern);
      }
    },
    getErrorCorrectPolynomial(errorCorrectLength) {
      let a = new QRPolynomial([1], 0);
      for (let i = 0; i < errorCorrectLength; i++)
        a = a.multiply(new QRPolynomial([1, QRMath.gexp(i)], 0));
      return a;
    },
    getBCHTypeInfo(data) {
      let d = data << 10;
      while (this.getBCHDigit(d) - this.getBCHDigit(1335) >= 0)
        d ^= 1335 << (this.getBCHDigit(d) - this.getBCHDigit(1335));
      return ((data << 10) | d) ^ 21522;
    },
    getBCHTypeNumber(data) {
      let d = data << 12;
      while (this.getBCHDigit(d) - this.getBCHDigit(7973) >= 0)
        d ^= 7973 << (this.getBCHDigit(d) - this.getBCHDigit(7973));
      return (data << 12) | d;
    },
    getBCHDigit(data) {
      let digit = 0;
      while (data !== 0) {
        digit++;
        data >>>= 1;
      }
      return digit;
    },
  };

  const RS_BLOCK_TABLE = [
    [1, 26, 19],
    [1, 26, 16],
    [1, 26, 13],
    [1, 26, 9],
    [1, 44, 34],
    [1, 44, 28],
    [1, 44, 22],
    [1, 44, 16],
    [1, 70, 55],
    [1, 70, 44],
    [2, 35, 17],
    [2, 35, 13],
    [1, 100, 80],
    [2, 50, 32],
    [2, 50, 24],
    [4, 25, 9],
    [1, 134, 108],
    [2, 67, 43],
    [2, 33, 15, 2, 34, 16],
    [2, 33, 11, 2, 34, 12],
    [2, 86, 68],
    [4, 43, 27],
    [4, 43, 19],
    [4, 43, 15],
    [2, 98, 78],
    [4, 49, 31],
    [2, 32, 14, 4, 33, 15],
    [4, 39, 13, 1, 40, 14],
    [2, 121, 97],
    [2, 60, 38, 2, 61, 39],
    [4, 40, 18, 2, 41, 19],
    [4, 40, 14, 2, 41, 15],
    [2, 146, 116],
    [3, 58, 36, 2, 59, 37],
    [4, 36, 16, 4, 37, 17],
    [4, 36, 12, 4, 37, 13],
    [2, 86, 68, 2, 87, 69],
    [4, 69, 43, 1, 70, 44],
    [6, 43, 19, 2, 44, 20],
    [6, 43, 15, 2, 44, 16],
  ];

  function QRCode(typeNumber, errorCorrectLevel) {
    this.typeNumber = typeNumber;
    this.errorCorrectLevel = errorCorrectLevel;
    this.modules = null;
    this.moduleCount = 0;
    this.dataCache = null;
    this.dataList = [];
  }

  QRCode.prototype = {
    addData(data) {
      this.dataList.push({ mode: 4, data });
    },
    make() {
      if (this.typeNumber < 1) {
        let typeNumber = 1;
        for (; typeNumber < 40; typeNumber++) {
          const rsBlocks = this.getRSBlocks(typeNumber, this.errorCorrectLevel);
          const buffer = { buffer: [], length: 0 };
          for (let i = 0; i < this.dataList.length; i++) {
            const data = this.dataList[i];
            this.putData(buffer, 4, 4);
            this.putData(buffer, data.data.length, this.getLengthInBits(4, typeNumber));
            for (let j = 0; j < data.data.length; j++)
              this.putData(buffer, data.data.charCodeAt(j), 8);
          }
          let totalDataCount = 0;
          for (let i = 0; i < rsBlocks.length; i++) totalDataCount += rsBlocks[i].dataCount;
          if (buffer.length <= totalDataCount * 8) break;
        }
        this.typeNumber = typeNumber;
      }
      this.makeImpl(false, this.getBestMaskPattern());
    },
    putData(buffer, data, length) {
      for (let i = length - 1; i >= 0; i--) buffer.buffer.push((data >>> i) & 1);
      buffer.length += length;
    },
    getLengthInBits(mode, type) {
      if (1 <= type && type < 10) return 8;
      else if (type < 27) return 16;
      else return 16;
    },
    getRSBlocks(typeNumber, errorCorrectLevel) {
      const rsBlock = RS_BLOCK_TABLE[(typeNumber - 1) * 4 + errorCorrectLevel];
      const list = [];
      for (let i = 0; i < rsBlock.length; i += 3) {
        const count = rsBlock[i];
        const totalCount = rsBlock[i + 1];
        const dataCount = rsBlock[i + 2];
        for (let j = 0; j < count; j++) list.push({ totalCount, dataCount });
      }
      return list;
    },
    makeImpl(test, maskPattern) {
      this.moduleCount = this.typeNumber * 4 + 17;
      this.modules = new Array(this.moduleCount);
      for (let row = 0; row < this.moduleCount; row++) {
        this.modules[row] = new Array(this.moduleCount);
        for (let col = 0; col < this.moduleCount; col++) this.modules[row][col] = null;
      }
      this.setupPositionProbePattern(0, 0);
      this.setupPositionProbePattern(this.moduleCount - 7, 0);
      this.setupPositionProbePattern(0, this.moduleCount - 7);
      this.setupPositionAdjustPattern();
      this.setupTimingPattern();
      this.setupTypeInfo(test, maskPattern);
      if (this.typeNumber >= 7) this.setupTypeNumber(test);
      if (this.dataCache === null)
        this.dataCache = this.createData(this.typeNumber, this.errorCorrectLevel, this.dataList);
      this.mapData(this.dataCache, maskPattern);
    },
    setupPositionProbePattern(row, col) {
      for (let r = -1; r <= 7; r++) {
        if (row + r <= -1 || this.moduleCount <= row + r) continue;
        for (let c = -1; c <= 7; c++) {
          if (col + c <= -1 || this.moduleCount <= col + c) continue;
          if (
            (0 <= r && r <= 6 && (c === 0 || c === 6)) ||
            (0 <= c && c <= 6 && (r === 0 || r === 6)) ||
            (2 <= r && r <= 4 && 2 <= c && c <= 4)
          ) {
            this.modules[row + r][col + c] = true;
          } else {
            this.modules[row + r][col + c] = false;
          }
        }
      }
    },
    setupPositionAdjustPattern() {
      const pos = QRUtil.getPatternPosition(this.typeNumber);
      for (let i = 0; i < pos.length; i++) {
        for (let j = 0; j < pos.length; j++) {
          const row = pos[i],
            col = pos[j];
          if (this.modules[row][col] !== null) continue;
          for (let r = -2; r <= 2; r++) {
            for (let c = -2; c <= 2; c++) {
              if (r === -2 || r === 2 || c === -2 || c === 2 || (r === 0 && c === 0)) {
                this.modules[row + r][col + c] = true;
              } else {
                this.modules[row + r][col + c] = false;
              }
            }
          }
        }
      }
    },
    setupTimingPattern() {
      for (let r = 8; r < this.moduleCount - 8; r++) {
        if (this.modules[r][6] !== null) continue;
        this.modules[r][6] = r % 2 === 0;
      }
      for (let c = 8; c < this.moduleCount - 8; c++) {
        if (this.modules[6][c] !== null) continue;
        this.modules[6][c] = c % 2 === 0;
      }
    },
    setupTypeInfo(test, maskPattern) {
      const data = (this.errorCorrectLevel << 3) | maskPattern;
      const bits = QRUtil.getBCHTypeInfo(data);
      for (let i = 0; i < 15; i++) {
        const mod = !test && ((bits >> i) & 1) === 1;
        if (i < 6) this.modules[i][8] = mod;
        else if (i < 8) this.modules[i + 1][8] = mod;
        else this.modules[this.moduleCount - 15 + i][8] = mod;
      }
      for (let i = 0; i < 15; i++) {
        const mod = !test && ((bits >> i) & 1) === 1;
        if (i < 8) this.modules[8][this.moduleCount - i - 1] = mod;
        else if (i < 9) this.modules[8][15 - i - 1 + 1] = mod;
        else this.modules[8][15 - i - 1] = mod;
      }
      this.modules[this.moduleCount - 8][8] = !test;
    },
    setupTypeNumber(test) {
      const bits = QRUtil.getBCHTypeNumber(this.typeNumber);
      for (let i = 0; i < 18; i++) {
        const mod = !test && ((bits >> i) & 1) === 1;
        this.modules[Math.floor(i / 3)][(i % 3) + this.moduleCount - 8 - 3] = mod;
      }
      for (let i = 0; i < 18; i++) {
        const mod = !test && ((bits >> i) & 1) === 1;
        this.modules[(i % 3) + this.moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
      }
    },
    createData(typeNumber, errorCorrectLevel, dataList) {
      const rsBlocks = this.getRSBlocks(typeNumber, errorCorrectLevel);
      const buffer = { buffer: [], length: 0 };
      for (let i = 0; i < dataList.length; i++) {
        const data = dataList[i];
        this.putData(buffer, 4, 4);
        this.putData(buffer, data.data.length, this.getLengthInBits(4, typeNumber));
        for (let j = 0; j < data.data.length; j++) this.putData(buffer, data.data.charCodeAt(j), 8);
      }
      let totalDataCount = 0;
      for (let i = 0; i < rsBlocks.length; i++) totalDataCount += rsBlocks[i].dataCount;
      if (buffer.length > totalDataCount * 8)
        throw new Error('code length overflow. (' + buffer.length + '>' + totalDataCount * 8 + ')');
      if (buffer.length + 4 <= totalDataCount * 8) this.putData(buffer, 0, 4);
      while (buffer.length % 8 !== 0) this.putData(buffer, 0, 1);
      // eslint-disable-next-line no-constant-condition
      while (true) {
        if (buffer.length >= totalDataCount * 8) break;
        this.putData(buffer, PAD0, 8);
        if (buffer.length >= totalDataCount * 8) break;
        this.putData(buffer, PAD1, 8);
      }
      return this.createBytes(buffer, rsBlocks);
    },
    createBytes(buffer, rsBlocks) {
      let offset = 0;
      let maxDcCount = 0,
        maxEcCount = 0;
      const dcdata = new Array(rsBlocks.length);
      const ecdata = new Array(rsBlocks.length);
      for (let r = 0; r < rsBlocks.length; r++) {
        const dcCount = rsBlocks[r].dataCount;
        const ecCount = rsBlocks[r].totalCount - dcCount;
        maxDcCount = Math.max(maxDcCount, dcCount);
        maxEcCount = Math.max(maxEcCount, ecCount);
        dcdata[r] = new Array(dcCount);
        for (let i = 0; i < dcdata[r].length; i++)
          dcdata[r][i] = 0xff & this.getByte(buffer, i + offset);
        offset += dcCount;
        const rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
        const rawPoly = new QRPolynomial(dcdata[r], rsPoly.getLength() - 1);
        const modPoly = rawPoly.mod(rsPoly);
        ecdata[r] = new Array(rsPoly.getLength() - 1);
        for (let i = 0; i < ecdata[r].length; i++) {
          const modIndex = i + modPoly.getLength() - ecdata[r].length;
          ecdata[r][i] = modIndex >= 0 ? modPoly.get(modIndex) : 0;
        }
      }
      let totalCodeCount = 0;
      for (let i = 0; i < rsBlocks.length; i++) totalCodeCount += rsBlocks[i].totalCount;
      const data = new Array(totalCodeCount);
      let index = 0;
      for (let i = 0; i < maxDcCount; i++)
        for (let r = 0; r < rsBlocks.length; r++)
          if (i < dcdata[r].length) data[index++] = dcdata[r][i];
      for (let i = 0; i < maxEcCount; i++)
        for (let r = 0; r < rsBlocks.length; r++)
          if (i < ecdata[r].length) data[index++] = ecdata[r][i];
      return data;
    },
    getByte(buffer, index) {
      let value = 0;
      for (let i = 0; i < 8; i++) value = (value << 1) | buffer.buffer[index * 8 + i];
      return value;
    },
    mapData(data, maskPattern) {
      let inc = -1,
        row = this.moduleCount - 1,
        bitIndex = 7,
        byteIndex = 0;
      for (let col = this.moduleCount - 1; col > 0; col -= 2) {
        if (col === 6) col--;
        // eslint-disable-next-line no-constant-condition
        while (true) {
          for (let c = 0; c < 2; c++) {
            if (this.modules[row][col - c] === null) {
              let dark = false;
              if (byteIndex < data.length) dark = ((data[byteIndex] >>> bitIndex) & 1) === 1;
              if (QRUtil.getMask(maskPattern, row, col - c)) dark = !dark;
              this.modules[row][col - c] = dark;
              bitIndex--;
              if (bitIndex === -1) {
                byteIndex++;
                bitIndex = 7;
              }
            }
          }
          row += inc;
          if (row < 0 || this.moduleCount <= row) {
            row -= inc;
            inc = -inc;
            break;
          }
        }
      }
    },
    getBestMaskPattern() {
      let minLostPoint = 0,
        pattern = 0;
      for (let i = 0; i < 8; i++) {
        this.makeImpl(true, i);
        const lostPoint = this.getLostPoint();
        if (i === 0 || minLostPoint > lostPoint) {
          minLostPoint = lostPoint;
          pattern = i;
        }
      }
      return pattern;
    },
    getLostPoint() {
      let lostPoint = 0;
      for (let row = 0; row < this.moduleCount; row++) {
        for (let col = 0; col < this.moduleCount; col++) {
          let sameCount = 0;
          const dark = this.modules[row][col];
          for (let r = -1; r <= 1; r++) {
            if (row + r < 0 || this.moduleCount <= row + r) continue;
            for (let c = -1; c <= 1; c++) {
              if (col + c < 0 || this.moduleCount <= col + c) continue;
              if (r === 0 && c === 0) continue;
              if (dark === this.modules[row + r][col + c]) sameCount++;
            }
          }
          if (sameCount > 5) lostPoint += 3 + sameCount - 5;
        }
      }
      return lostPoint;
    },
    isDark(row, col) {
      return this.modules[row][col];
    },
    getModuleCount() {
      return this.moduleCount;
    },
  };

  return QRCode;
})();

/**
 * QR Code generator web component.
 *
 * @element qr-code
 * @cssprop --qr-size - QR code size (default: 200px)
 * @cssprop --qr-fg - Foreground color (default: #000)
 * @cssprop --qr-bg - Background color (default: #fff)
 */
export class QrCode extends LitElement {
  static properties = {
    /** Text/URL to encode */
    data: { type: String },
    /** QR code size in pixels */
    size: { type: Number },
    /** Error correction level: L, M, Q, H */
    errorCorrection: { type: String, attribute: 'error-correction' },
    /** Foreground color */
    color: { type: String },
    /** Background color */
    background: { type: String },
  };

  static styles = css`
    :host {
      display: inline-block;
    }
    .qr-container {
      width: var(--qr-size, 200px);
      height: var(--qr-size, 200px);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    canvas {
      max-width: 100%;
      max-height: 100%;
    }
    .error {
      color: #ef4444;
      font-size: 0.875rem;
      text-align: center;
      padding: 1rem;
    }
  `;

  constructor() {
    super();
    this.data = '';
    this.size = 200;
    this.errorCorrection = 'M';
    this.color = '#000000';
    this.background = '#ffffff';
  }

  updated(changedProperties) {
    if (
      changedProperties.has('data') ||
      changedProperties.has('size') ||
      changedProperties.has('errorCorrection') ||
      changedProperties.has('color') ||
      changedProperties.has('background')
    ) {
      this._generateQR();
    }
  }

  _getErrorCorrectionLevel() {
    const levels = { L: 1, M: 0, Q: 3, H: 2 };
    return levels[this.errorCorrection.toUpperCase()] ?? 0;
  }

  _generateQR() {
    const canvas = this.shadowRoot?.querySelector('canvas');
    if (!canvas || !this.data) return;

    try {
      const qr = new QRCode(0, this._getErrorCorrectionLevel());
      qr.addData(this.data);
      qr.make();

      const ctx = canvas.getContext('2d');
      const moduleCount = qr.getModuleCount();
      const cellSize = this.size / moduleCount;

      canvas.width = this.size;
      canvas.height = this.size;

      // Background
      ctx.fillStyle = this.background;
      ctx.fillRect(0, 0, this.size, this.size);

      // Modules
      ctx.fillStyle = this.color;
      for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
          if (qr.isDark(row, col)) {
            ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
          }
        }
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('QR generation error:', e);
    }
  }

  /** Get QR code as data URL */
  toDataURL(type = 'image/png') {
    const canvas = this.shadowRoot?.querySelector('canvas');
    return canvas?.toDataURL(type) || '';
  }

  /** Download QR code as image */
  download(filename = 'qrcode.png') {
    const dataUrl = this.toDataURL();
    if (dataUrl) {
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = filename;
      link.click();
    }
  }

  render() {
    return html`
      <div class="qr-container" style="--qr-size: ${this.size}px">
        ${this.data ? html`<canvas></canvas>` : html`<div class="error">No data to encode</div>`}
      </div>
    `;
  }
}

customElements.define('qr-code', QrCode);
