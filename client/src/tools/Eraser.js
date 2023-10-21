import Brush from "./Brush";

export default class Eraser extends Brush {
  constructor(canvas, socket, id) {
    super(canvas, socket, id);
    this.name = "eraser";
  }
  mouseMoveHandler(e) {
    if (this.mouseDown) {
      this.socket.send(
        JSON.stringify({
          method: "draw",
          id: this.id,
          figure: {
            type: this.name,
            x: e.pageX - e.target.offsetLeft,
            y: e.pageY - e.target.offsetTop,
            lineWidth: this.ctx.lineWidth,
          },
        })
      );
    }
  }

  static draw(
    ctx,
    x,
    y,
    lineWidth,
    pageFillColor,
    pageStrokeColor,
    pageLineWidth
  ) {
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = lineWidth;
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.stroke();
    ctx.fillStyle = pageFillColor;
    ctx.strokeStyle = pageStrokeColor;
    ctx.lineWidth = pageLineWidth;
  }
}
