import Tool from "./Tool";

export default class Line extends Tool {
  constructor(canvas, socket, id) {
    super(canvas, socket, id);
    this.listen();
    this.name = "line";
  }

  listen() {
    this.canvas.onmousedown = this.mouseDownHandler.bind(this);
    this.canvas.onmouseup = this.mouseUpHandler.bind(this);
    this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
  }

  mouseDownHandler(e) {
    this.mouseDown = true;
    this.currentX = e.pageX - e.target.offsetLeft;
    this.currentY = e.pageY - e.target.offsetTop;
    this.ctx.beginPath();
    this.ctx.strokeStyle = this.ctx.fillStyle;
    this.ctx.moveTo(this.currentX, this.currentY);
    this.saved = this.canvas.toDataURL();
  }

  mouseUpHandler(e) {
    this.mouseDown = false;
    this.socket.send(
      JSON.stringify({
        method: "draw",
        id: this.id,
        figure: {
          type: this.name,
          x: this.currentX,
          y: this.currentY,
          x2: e.pageX - e.target.offsetLeft,
          y2: e.pageY - e.target.offsetTop,
          color: this.ctx.fillStyle,
          strokeColor: this.ctx.fillStyle,
          lineWidth: this.ctx.lineWidth,
        },
      })
    );
  }

  mouseMoveHandler(e) {
    if (this.mouseDown) {
      this.draw(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop);
    }
  }

  draw(x, y) {
    const img = new Image();
    img.src = this.saved;
    img.onload = async function () {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
      this.ctx.beginPath();
      this.ctx.strokeStyle = this.ctx.fillStyle;
      this.ctx.moveTo(this.currentX, this.currentY);
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
    }.bind(this);
  }

  static staticDraw(
    ctx,
    x,
    y,
    x2,
    y2,
    color,
    strokeColor,
    lineWidth,
    pageFillColor,
    pageStrokeColor,
    pageLineWidth
  ) {
    ctx.fillStyle = color;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.fill();
    ctx.fillStyle = pageFillColor;
    ctx.strokeStyle = pageStrokeColor;
    ctx.lineWidth = pageLineWidth;
  }
}
