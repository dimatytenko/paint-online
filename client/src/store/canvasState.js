import { makeAutoObservable } from "mobx";

class CanvasState {
  canvas = null;
  socket = null;
  sessionid = null;
  undoList = [];
  redoList = [];
  username = "";

  constructor() {
    makeAutoObservable(this);
  }

  drawList(dataUrl) {
    this.draw(dataUrl);
  }

  setSessionId(id) {
    this.sessionid = id;
  }
  setSocket(socket) {
    this.socket = socket;
  }

  setUsername(username) {
    this.username = username;
  }

  setCanvas(canvas) {
    this.canvas = canvas;
  }

  pushToUndo(data) {
    this.undoList.push(data);
  }

  pushToRedo(data) {
    this.redoList.push(data);
  }

  undo() {
    if (this.undoList.length > 0) {
      this.redoList.push(this.canvas.toDataURL());
      const dataUrl = this.undoList.pop();
      this.draw(dataUrl);

      this.socket.send(
        JSON.stringify({
          method: "draw",
          id: this.sessionid,
          figure: {
            type: "list",
            dataUrl: dataUrl,
          },
        })
      );
    }
  }

  redo() {
    this.undoList.push(this.canvas.toDataURL());
    const dataUrl = this.redoList.pop();
    this.draw(dataUrl);
    this.socket.send(
      JSON.stringify({
        method: "draw",
        id: this.sessionid,
        figure: {
          type: "list",
          dataUrl: dataUrl,
        },
      })
    );
  }

  draw(dataUrl) {
    let ctx = this.canvas.getContext("2d");
    let img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
    };
  }
}

export default new CanvasState();
