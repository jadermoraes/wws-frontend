export enum Colors {
  PRIMARY = '#295abe',
  PRIMARY_LIGHT = '#9BA7D1',
  INFO = '#17a2b8',
  SUCCESS = '#28a745',
  WARNING = '#ffc107',
  DANGER = '#dc3545'
}

export class ColorUtils {


  static changeBrightness(hex: string, lum: number = 0): string {
		hex = String(hex).replace(/[^0-9a-f]/gi, '');

		if (hex.length < 6) {
			hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
		}

		let rgb = '#';
    let c;
    let i;

		for (i = 0; i < 3; i++) {
			c = parseInt(hex.substr(i * 2, 2), 16);
			c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
			rgb += ('00' + c).substr(c.length);
		}

		return rgb;
  }

  static opacity(hexColor: string, opacity: number): string {
    const rgbColor = this.hexToRgb(hexColor);
    const rgbWithOpacity = this.rgbaToRgb(rgbColor.r, rgbColor.g, rgbColor.b, opacity, 255, 255, 255);

    return this.rgbToHex(rgbWithOpacity.r, rgbWithOpacity.g, rgbWithOpacity.b);
  }

  static hexToRgb(hex: string): RGB {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  static rgbToHex(r: number, g: number, b: number): string {
    return `#${this.componentToHex(r)}${this.componentToHex(g)}${this.componentToHex(b)}`;
  }

  static componentToHex(component: number): string {
    const hex = component.toString(16);

    return hex.length === 1 ? '0' + hex : hex;
  }

  static rgbaToRgb(r: number, g: number, b: number, a: number, r2: number, g2: number, b2: number): RGB {
    const r3 = Math.round(((1 - a) * r2) + (a * r));
    const g3 = Math.round(((1 - a) * g2) + (a * g));
    const b3 = Math.round(((1 - a) * b2) + (a * b));

    return {
      r: r3,
      g: g3,
      b: b3
    };
  }

  static numberBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

}

type RGB = {
  r: number,
  g: number,
  b: number,
  a?: number
}
