import React, { useState } from "react";
import { Stage, Layer, Rect, Transformer } from "react-konva";

const RectComponent = ({ rectProps, isSelected, onSelect, onChange }) => {
  const shapeRef = React.useRef();
  const trRef = React.useRef();

  React.useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <React.Fragment>
      <Rect
        onClick={(e) => {
          e.cancelBubble = true; // This prevents the stage onClick event from firing when a rectangle is clicked
          onSelect();
        }}
        onTap={onSelect}
        ref={shapeRef}
        {...rectProps}
        draggable
        onDragEnd={(e) => {
          onChange({
            ...rectProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={() => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          node.scaleX(1);
          node.scaleY(1);

          onChange({
            ...rectProps,
            x: node.x(),
            y: node.y(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
          });
        }}
      />
      {isSelected && <Transformer ref={trRef} />}
    </React.Fragment>
  );
};

const App = () => {
  const [rectangles, setRectangles] = useState([]);
  const [selectedId, selectShape] = useState(null);

  const handleAddRect = () => {
    const newRect = {
      id: rectangles.length + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      width: 100,
      height: 100,
      fill: "green",
    };
    setRectangles([...rectangles, newRect]);
  };

  return (
    <div>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onClick={() => {
          // Reset the selected shape when the stage is clicked
          selectShape(null);
        }}
      >
        <Layer>
          {rectangles.map((rect, i) => (
            <RectComponent
              key={i}
              rectProps={rect}
              isSelected={rect.id === selectedId}
              onSelect={() => {
                selectShape(rect.id);
              }}
              onChange={(newAttrs) => {
                const rects = rectangles.slice();
                rects[i] = newAttrs;
                setRectangles(rects);
              }}
            />
          ))}
        </Layer>
      </Stage>
      <button onClick={handleAddRect}>Add Rectangle</button>
      {selectedId && (
        <div>
          <h2>Selected Rectangle ID: {selectedId}</h2>
          <pre>
            {JSON.stringify(
              rectangles.find((r) => r.id === selectedId),
              null,
              2
            )}
          </pre>
        </div>
      )}
    </div>
  );
};

export default App;
