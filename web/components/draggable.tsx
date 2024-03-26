import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import {
  useState,
  useEffect,
  createContext,
  useContext,
  useRef,
  RefObject,
} from "react";

interface Dragged {
  index: number;
  handleOffsetY: number;
  height: number;
  width: number;
}

interface DraggableData {
  dragged: Dragged | null;
  setDragged: React.Dispatch<React.SetStateAction<Dragged | null>>;
  dropZone: number;
  setMouseY: React.Dispatch<React.SetStateAction<number>>;
  mouseY: number;
}

const DraggableContext = createContext<DraggableData | null>(null);

export function Draggable({
  children,
  reorder,
}: {
  children: React.ReactNode;
  reorder: (from: number, to: number) => void;
}) {
  const [dragged, setDragged] = useState<Dragged | null>(null);

  const [dropZone, setDropZone] = useState<number>(0);

  const [mouseY, setMouseY] = useState<number>(0);

  const [scrollInterval, setScrollInterval] = useState<NodeJS.Timeout | null>(
    null
  );

  // get mouse coordenates
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!dragged) return;
      setMouseY(e.y);

      // scroll if the mouse is near the top or bottom of the screen
      if (e.clientY < window.innerHeight / 5) {
        if (scrollInterval == null) {
          setScrollInterval(
            setInterval(() => {
              if (!dragged && scrollInterval) clearInterval(scrollInterval);
              window.scrollBy(0, -5);
            }, 10)
          );
        }
      } else if (e.clientY > window.innerHeight - window.innerHeight / 5) {
        if (scrollInterval == null) {
          setScrollInterval(
            setInterval(() => {
              if (!dragged && scrollInterval) clearInterval(scrollInterval);
              window.scrollBy(0, 5);
            }, 10)
          );
        }
      } else {
        if (scrollInterval != null) {
          clearInterval(scrollInterval);
          setScrollInterval(null);
        }
      }
    };

    document.addEventListener("mousemove", handler);

    return () => document.removeEventListener("mousemove", handler);
  }, [dragged, scrollInterval]);

  useEffect(() => {
    if (dragged != null) {
      const elements = Array.from(
        document.querySelectorAll(".drop-zone")
      ).filter((el, index) => index != dragged.index);

      const positions = elements.map((el) => el.getBoundingClientRect().top);

      const absDifferences = positions.map((v) => Math.abs(v - mouseY));

      let index = absDifferences.indexOf(Math.min(...absDifferences));

      // if the item is below the dragged item, we must add 1 to the index
      if (index > dragged.index) index += 1;

      setDropZone(index);
    }
  }, [dragged, mouseY]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dragged !== null) {
        e.preventDefault();

        if (scrollInterval != null) {
          clearInterval(scrollInterval);
          setScrollInterval(null);
        }

        setDragged(null);
        reorder(
          dragged.index,
          // if the dragged item above the drop zone, we must subtract 1 from the index
          dragged.index < dropZone ? dropZone - 1 : dropZone
        );
      }
    };

    document.addEventListener("mouseup", handler);
    return () => document.removeEventListener("mouseup", handler);
  }, [dragged, dropZone, reorder, scrollInterval]);

  return (
    <DraggableContext.Provider
      value={{ dragged, setDragged, dropZone, setMouseY, mouseY }}
    >
      <div
        className="drop-zone overflow-hidden"
        style={{
          height: dragged != null && dropZone == 0 ? dragged.height : 0,
        }}
      />
      {children}
    </DraggableContext.Provider>
  );
}

interface DraggableItemData {
  index: number;
  item: RefObject<HTMLDivElement> | null;
}

const ItemContext = createContext<{
  handleMouseEvent: (e: React.MouseEvent<Element, MouseEvent>) => void;
}>({ handleMouseEvent: () => undefined });

export function DraggableItem({
  children,
  index,
  useDragHandle = true,
}: {
  children: React.ReactNode;
  index: number;
  useDragHandle?: boolean;
}) {
  const context = useContext(DraggableContext);

  if (!context)
    throw new Error("DraggableItem must be used inside a Draggable");

  const { dragged, dropZone, mouseY, setDragged, setMouseY } = context;

  const itemRef = useRef<HTMLDivElement>(null);

  function handleMouseEvent(e: React.MouseEvent<Element, MouseEvent>) {
    e.preventDefault();
    if (itemRef.current) {
      setDragged({
        index,
        handleOffsetY: e.clientY - itemRef.current!.getBoundingClientRect().top,
        height: itemRef.current!.offsetHeight,
        width: itemRef.current!.offsetWidth,
      });
      setMouseY(e.pageY);
    }
  }

  return (
    <ItemContext.Provider value={{ handleMouseEvent }}>
      <div
        className={useDragHandle ? "" : "cursor-grab"}
        ref={itemRef}
        onMouseDown={!useDragHandle ? handleMouseEvent : undefined}
      >
        {dragged?.index != index ? (
          children
        ) : (
          <div
            className="fixed z-50 cursor-grabbing opacity-50"
            style={{
              top: `${mouseY - dragged.handleOffsetY}px`,
              width: `${dragged.width}px`,
            }}
          >
            {children}
          </div>
        )}
        <div
          className="drop-zone overflow-hidden"
          style={{
            height:
              dragged != null && dropZone == index + 1 ? dragged.height : 0,
          }}
        />
      </div>
    </ItemContext.Provider>
  );
}

export function DragHandle() {
  const { handleMouseEvent } = useContext(ItemContext);

  const handleRef = useRef<SVGSVGElement>(null);

  return (
    <DragHandleDots2Icon
      ref={handleRef}
      className="text-muted-foreground size-6 cursor-grab rotate-90 sm:rotate-0"
      onMouseDown={handleMouseEvent}
    />
  );
}

export function defaultReorder<T>(l: T[], from: number, to: number): T[] {
  if (from < to) {
    const temp = l[from];

    for (let i = from; i < to; i++) {
      l[i] = l[i + 1];
    }
    l[to] = temp;
  } else if (from > to) {
    const temp = l[from];

    for (let i = from; i > to; i--) {
      l[i] = l[i - 1];
    }

    l[to] = temp;
  }

  return l;
}
