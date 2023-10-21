import { observer } from "mobx-react-lite";
import clsx from "clsx";

import "../styles/toolbar.scss";
import toolState from "../store/toolState";
import Brush from "../tools/Brush";
import canvasState from "../store/canvasState";
import Rect from "../tools/Rect";
import Line from "../tools/Line";
import Circle from "../tools/Circle";
import Eraser from "../tools/Eraser";

export const ToolBar = observer(() => {
  const changeColor = (e) => {
    toolState.setStrokeColor(e.target.value);
    toolState.setFillColor(e.target.value);
    console.log("toolState.tool.fillColor", toolState.tool.fillColor);
    console.log("toolState.tool.strokeColor", toolState.tool.strokeColor);
  };

  console.log("toolState", toolState.fillColor);
  const download = () => {
    const dataUrl = canvasState.canvas.toDataURL();
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = canvasState.sessionid + ".jpg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="toolbar">
      <button
        className={clsx("toolbar__btn brush", {
          active: toolState?.tool?.name === "brush",
        })}
        onClick={() =>
          toolState.setTool(
            new Brush(
              canvasState.canvas,
              canvasState.socket,
              canvasState.sessionid
            )
          )
        }
      />
      <button
        className={clsx("toolbar__btn rect", {
          active: toolState?.tool?.name === "rect",
        })}
        onClick={() =>
          toolState.setTool(
            new Rect(
              canvasState.canvas,
              canvasState.socket,
              canvasState.sessionid
            )
          )
        }
      />
      <button
        className={clsx("toolbar__btn circle", {
          active: toolState?.tool?.name === "circle",
        })}
        onClick={() =>
          toolState.setTool(
            new Circle(
              canvasState.canvas,
              canvasState.socket,
              canvasState.sessionid
            )
          )
        }
      />
      <button
        className={clsx("toolbar__btn eraser", {
          active: toolState?.tool?.name === "eraser",
        })}
        onClick={() =>
          toolState.setTool(
            new Eraser(
              canvasState.canvas,
              canvasState.socket,
              canvasState.sessionid
            )
          )
        }
      />
      <button
        className={clsx("toolbar__btn line", {
          active: toolState?.tool?.name === "line",
        })}
        onClick={() =>
          toolState.setTool(
            new Line(
              canvasState.canvas,
              canvasState.socket,
              canvasState.sessionid
            )
          )
        }
      />
      <input
        onChange={(e) => changeColor(e)}
        value={toolState?.getFillColor()}
        style={{ marginLeft: 10 }}
        type="color"
      />
      <button
        className="toolbar__btn undo"
        onClick={() => canvasState.undo()}
      />
      <button
        className="toolbar__btn redo"
        d
        onClick={() => canvasState.redo()}
      />
      <button className="toolbar__btn save" onClick={() => download()} />
    </div>
  );
});