"use client";

import { HTMLAttributes, forwardRef, useEffect, useRef, useState } from "react";
import { Card, CardHeader } from "./ui/card";
import { Separator } from "./ui/separator";
import {
  FontBoldIcon,
  FontItalicIcon,
  ListBulletIcon,
  QuoteIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from "@radix-ui/react-icons";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import "./rich-text.css";
import { cn } from "@/lib/utils";
import { Spinner } from "./icons";
import Quill from "quill";

interface RichTextEditorProps {
  id: string;
  value?: string;
  onChange: (value: string) => void;
}

// This code doesn't work well in development mode, but it works in production mode.
// Change this component when Quill.js 2.0 is released.
export default function RichTextEditor({
  id,
  value,
  onChange,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const [quill, setQuill] = useState<Quill | null>(null);

  useEffect(() => {
    const Quill = require("quill");

    setQuill(
      new Quill(editorRef.current!, {
        modules: {
          toolbar: toolbarRef.current!,
        },
      })
    );
  }, []);

  useEffect(() => {
    if (quill) {
      quill.on("text-change", () => {
        onChange(JSON.stringify(quill.getContents()));
      });
    }
  }, [onChange, quill]);

  useEffect(() => {
    if (quill && value) {
      try {
        if (value != JSON.stringify(quill.getContents())) {
          quill.setContents(JSON.parse(value));
        }
      } catch {
        quill.setText(value);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quill]);

  return (
    <>
      {quill == null && (
        <Spinner className="mx-auto mt-2 size-8 animate-spin" />
      )}
      <Card
        className={cn({
          invisible: quill == null,
        })}
      >
        <CardHeader className="p-0">
          <Toolbar ref={toolbarRef} />
          <Separator className="m-0" />
        </CardHeader>
        <div id={id} ref={editorRef} className="px-4 py-2"></div>
      </Card>
    </>
  );
}

const Toolbar = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  (_, ref) => {
    const toolbarButtonProps: ToolbarButtonProps[] = [
      {
        icon: <FontBoldIcon className="size-4" />,
        className: "ql-bold",
        value: "bold",
      },
      {
        icon: <FontItalicIcon className="size-4" />,
        className: "ql-italic",
        value: "italic",
      },
      {
        icon: <UnderlineIcon className="size-4" />,
        className: "ql-underline",
        value: "underline",
      },
      {
        icon: <StrikethroughIcon className="size-4" />,
        className: "ql-strike",
        value: "strike",
      },
      {
        icon: <ListBulletIcon className="size-4" />,
        className: "ql-list",
        value: "bullet",
      },
      {
        icon: <QuoteIcon className="size-4" />,
        className: "ql-blockquote",
        value: "blockquote",
      },
    ];

    return (
      <div className="flex p-1">
        <ToggleGroup ref={ref} type="multiple">
          {toolbarButtonProps.map((props) => (
            <ToolbarItem key={props.value} {...props} />
          ))}
        </ToggleGroup>
      </div>
    );
  }
);
Toolbar.displayName = "Toolbar";

interface ToolbarButtonProps {
  icon: React.ReactNode;
  className: string;
  value: string;
}

function ToolbarItem({ icon, className, value }: ToolbarButtonProps) {
  return (
    <ToggleGroupItem value={value} className={className}>
      {icon}
    </ToggleGroupItem>
  );
}
