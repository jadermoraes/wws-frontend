import { Observer } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

export class ObjectUtils {
  static copy<T>(obj: T) {
    return <T>JSON.parse(JSON.stringify(obj));
  }

  static getBase64ImageFromURL(url: string): Observable<string> {
    return Observable.create((observer: Observer<string>) => {
      let img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;

      if (!img.complete) {
        img.onload = () => {
          observer.next(this.getBase64Image(img));
          observer.complete();
        };
        img.onerror = (err) => {
          observer.next(null);
          observer.complete();
        };
      } else {
        observer.next(this.getBase64Image(img));
        observer.complete();
      }
    });
  }

  static getBase64Image(img: HTMLImageElement): string {
    var canvas: HTMLCanvasElement = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    let ctx: CanvasRenderingContext2D = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    let dataURL: string = canvas.toDataURL('image/png');
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, '');
  }

  static downloadFile(response: any, filename: string, type: any) {
    let dataType = response.type;
    let binaryData = [];
    binaryData.push(response);
    let downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(
      new Blob(binaryData, { type: dataType })
    );
    downloadLink.setAttribute(
      'download',
      filename + (type === 'PDF' ? '.pdf' : type === 'XLS' ? '.xlsx' : '.csv')
    );
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }
}
