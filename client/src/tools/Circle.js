import Tool from "./Tool";

export default class Circle extends Tool {
  constructor(canvas, socket, id) {
    super(canvas, socket, id);
    this.listen();
    this.name = "circle";
  }

  listen() {
    this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
    this.canvas.onmousedown = this.mouseDownHandler.bind(this);
    this.canvas.onmouseup = this.mouseUpHandler.bind(this);
  }

  mouseDownHandler(e) {
    this.mouseDown = true;
    let canvasData = this.canvas.toDataURL();
    this.ctx.beginPath();
    this.startX = e.pageX - e.target.offsetLeft;
    this.startY = e.pageY - e.target.offsetTop;

    this.saved = canvasData;
  }

  mouseUpHandler(e) {
    this.mouseDown = false;
    this.socket.send(
      JSON.stringify({
        method: "draw",
        id: this.id,
        figure: {
          type: this.name,
          x: this.startX,
          y: this.startY,
          r: Math.sqrt(
            (e.pageX - e.target.offsetLeft - this.startX) ** 2 +
              (e.pageY - e.target.offsetTop - this.startY) ** 2
          ),
          color: this.ctx.fillStyle,
          strokeColor: this.ctx.strokeStyle,
          lineWidth: this.ctx.lineWidth,
        },
      })
    );
  }

  mouseMoveHandler(e) {
    if (this.mouseDown) {
      let curentX = e.pageX - e.target.offsetLeft;
      let curentY = e.pageY - e.target.offsetTop;
      let width = curentX - this.startX;
      let height = curentY - this.startY;
      let r = Math.sqrt(width ** 2 + height ** 2);
      this.draw(this.startX, this.startY, r);
    }
  }

  draw(x, y, r) {
    const img = new Image();
    img.src = this.saved;
    img.onload = async function () {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
      this.ctx.beginPath();
      this.ctx.arc(x, y, r, 0, 2 * Math.PI);
      this.ctx.fill();
      this.ctx.stroke();
    }.bind(this);
  }
  static staticDraw(
    ctx,
    x,
    y,
    r,
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
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = pageFillColor;
    ctx.strokeStyle = pageStrokeColor;
    ctx.lineWidth = pageLineWidth;
  }
}
