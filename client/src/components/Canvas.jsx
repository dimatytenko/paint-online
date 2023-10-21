import { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { Modal, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axios from "axios";

import "../styles/canvas.scss";
import canvasState from "../store/canvasState";
import toolState from "../store/toolState";
import Brush from "../tools/Brush";
import Rect from "../tools/Rect";
import Eraser from "../tools/Eraser";
import Line from "../tools/Line";
import Circle from "../tools/Circle";

export const Canvas = observer(() => {
  const [inputValue, setInputValue] = useState("");
  const [modal, setModal] = useState(true);
  const canvasRef = useRef();
  const params = useParams();

  const onInputChange = (value) => {
    setInputValue(value);
  };

  useEffect(() => {
    canvasState.setCanvas(canvasRef.current);
    let ctx = canvasRef.current.getContext("2d");
    axios
      .get(`http://localhost:5000/image?id=${params.id}`)
      .then((response) => {
        const img = new Image();
        img.src = response.data;
        img.onload = () => {
          ctx.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );
          ctx.drawImage(
            img,
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );
        };
      });
  }, [params.id]);

  useEffect(() => {
    if (canvasState.username) {
      const socket = new WebSocket(`ws://localhost:5000/`);
      canvasState.setSocket(socket);
      canvasState.setSessionId(params.id);
      toolState.setTool(new Brush(canvasRef.current, socket, params.id));
      socket.onopen = () => {
        console.log("Подключение установлено");
        socket.send(
          JSON.stringify({
            id: params.id,
            username: canvasState.username,
            method: "connection",
          })
        );
      };
      socket.onmessage = (event) => {
        let msg = JSON.parse(event.data);
        switch (msg.method) {
          case "connection":
            console.log(`пользователь ${msg.username} присоединился`);
            break;
          case "draw":
            drawHandler(msg);
            break;
        }
      };
    }
  }, [canvasState.username]);

  const drawHandler = (msg) => {
    const figure = msg.figure;
    const ctx = canvasRef.current.getContext("2d");
    switch (figure.type) {
      case "brush":
        Brush.draw(
          ctx,
          figure.x,
          figure.y,
          figure.color,
          figure.lineWidth,
          toolState?.getFillColor(),
          toolState?.getStrokeColor(),
          toolState?.getLineWidth()
        );
        break;
      case "eraser":
        Eraser.draw(
          ctx,
          figure.x,
          figure.y,
          figure.lineWidth,
          toolState?.getFillColor(),
          toolState?.getStrokeColor(),
          toolState?.getLineWidth()
        );
        break;
      case "circle":
        Circle.staticDraw(
          ctx,
          figure.x,
          figure.y,
          figure.r,
          figure.color,
          figure.strokeColor,
          figure.lineWidth,
          toolState?.getFillColor(),
          toolState?.getStrokeColor(),
          toolState?.getLineWidth()
        );
        break;
      case "line":
        Line.staticDraw(
          ctx,
          figure.x,
          figure.y,
          figure.x2,
          figure.y2,
          figure.color,
          figure.strokeColor,
          figure.lineWidth,
          toolState?.getFillColor(),
          toolState?.getStrokeColor(),
          toolState?.getLineWidth()
        );
        break;
      case "rect":
        Rect.staticDraw(
          ctx,
          figure.x,
          figure.y,
          figure.width,
          figure.height,
          figure.color,
          figure.strokeColor,
          figure.lineWidth,
          toolState?.getFillColor(),
          toolState?.getStrokeColor(),
          toolState?.getLineWidth()
        );
        break;
      case "finish":
        ctx.beginPath();
        break;
      case "list":
        canvasState.drawList(figure.dataUrl);
        break;
    }
  };

  const mouseDownHandler = () => {
    console.log("pushToUndo");
    canvasState.pushToUndo(canvasRef.current.toDataURL());
    axios
      .post(`http://localhost:5000/image?id=${params.id}`, {
        img: canvasRef.current.toDataURL(),
      })
      .then((response) => console.log(response.data));
  };

  const connectHandler = () => {
    canvasState.setUsername(inputValue);
    setModal(false);
  };

  return (
    <div className="canvas">
      <Modal show={modal} onHide={() => {}}>
        <Modal.Header>
          <Modal.Title>Input your name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => connectHandler()}>
            Enter
          </Button>
        </Modal.Footer>
      </Modal>
      <canvas
        onMouseUp={() => mouseDownHandler()}
        ref={canvasRef}
        width={600}
        height={400}
      />
    </div>
  );
});
