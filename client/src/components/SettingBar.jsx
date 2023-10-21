import { observer } from "mobx-react-lite";

import "../styles/toolbar.scss";
import toolState from "../store/toolState";

export const SettingBar = observer(() => {
  return (
    <div className="toolbar" style={{ top: 45 }}>
      <label htmlFor="line-width">line thickness</label>
      <input
        onChange={(e) => toolState.setLineWidth(e.target.value)}
        style={{ margin: "0 10px" }}
        id="line-width"
        type="number"
        min={1}
        max={50}
        defaultValue={1}
      />
      <label htmlFor="color-stroke">Color stroke</label>
      <input
        onChange={(e) => toolState.setStrokeColor(e.target.value)}
        value={toolState?.getStrokeColor()}
        style={{ margin: "0 10px" }}
        id="color-stroke"
        type="color"
      />
    </div>
  );
});
