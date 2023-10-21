import { makeAutoObservable } from "mobx";

class ToolState {
  tool = null;
  fillColor = "#000000";
  strokeColor = "#000000";
  lineWidth = 1;
  constructor() {
    makeAutoObservable(this);
  }

  setTool(tool) {
    this.tool = tool;
  }

  setFillColor(color) {
    this.tool.fillColor = color;
    this.fillColor = color;
  }

  getFillColor() {
    return this.fillColor;
  }

  setStrokeColor(color) {
    this.tool.strokeColor = color;
    this.strokeColor = color;
  }
  getStrokeColor() {
    return this.strokeColor;
  }

  setLineWidth(width) {
    this.tool.lineWidth = width;
    this.lineWidth = width;
  }

  getLineWidth() {
    return this.lineWidth;
  }
}

export default new ToolState();
