import React from "react";
import sanitizeHtml from "sanitize-html";

const QuillDeltaToHtmlConverter =
  require("quill-delta-to-html").QuillDeltaToHtmlConverter;

export default function renderRichText(richText: any): React.ReactNode {
  try {
    const quillDelta = JSON.parse(richText);
    if (!quillDelta["ops"]) throw new Error("No ops field");

    const converter = new QuillDeltaToHtmlConverter(quillDelta["ops"], {
      inlineStyles: true,
    });

    const html = converter.convert();

    return <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }} />;
  } catch (e) {
    if (richText.toString) richText = richText.toString();
    return <p>{richText}</p>;
  }
}
