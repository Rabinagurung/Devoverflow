"use client";
import "@mdxeditor/editor/style.css";
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  MDXEditor,
  MDXEditorMethods,
  linkPlugin,
  imagePlugin,
  tablePlugin,
  codeBlockPlugin,
  markdownShortcutPlugin,
  sandpackPlugin,
  codeMirrorPlugin,
  toolbarPlugin,
  BoldItalicUnderlineToggles,
  UndoRedo,
  CreateLink,
  InsertImage,
  InsertTable,
  ListsToggle,
  ConditionalContents,
  ChangeCodeMirrorLanguage,
  InsertCodeBlock,
  linkDialogPlugin,
  diffSourcePlugin,
  InsertThematicBreak,
  Separator,
} from "@mdxeditor/editor";
import { basicDark } from "cm6-theme-basic-dark";
import { useTheme } from "next-themes";
import React from "react";
import type { ForwardedRef } from "react";
import "./dark-editor.css";

interface Props {
  editorRef: ForwardedRef<MDXEditorMethods> | null;
  value: string;
  fieldChange: (value: string) => void;
}

const Editor = ({ editorRef, value, fieldChange, ...props }: Props) => {
  const { resolvedTheme } = useTheme();

  const theme = resolvedTheme === "dark" ? [basicDark] : [];

  return (
    <MDXEditor
      key={resolvedTheme}
      markdown={value}
      ref={editorRef}
      onChange={fieldChange}
      plugins={[
        // Example Plugin Usage
        headingsPlugin(),
        listsPlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        quotePlugin(),
        imagePlugin(),
        tablePlugin(),
        sandpackPlugin(),
        codeBlockPlugin({ defaultCodeBlockLanguage: "" }),
        codeMirrorPlugin({
          codeBlockLanguages: {
            css: "css",
            txt: "txt",
            sql: "sql",
            html: "html",
            saas: "saas",
            scss: "scss",
            bash: "bash",
            json: "json",
            js: "javascript",
            ts: "typescript",
            "": "unspecified",
            tsx: "TypeScript (React)",
            jsx: "JavaScript (React)",
          },
          autoLoadLanguageSupport: true,
          codeMirrorExtensions: theme,
        }),

        diffSourcePlugin({ viewMode: "rich-text", diffMarkdown: "" }),
        toolbarPlugin({
          toolbarClassName: "",
          toolbarContents: () => (
            <ConditionalContents
              options={[
                {
                  when: (editor) => editor?.editorType === "codeblock",
                  contents: () => <ChangeCodeMirrorLanguage />,
                },

                {
                  fallback: () => (
                    <>
                      <UndoRedo />
                      <Separator />
                      <BoldItalicUnderlineToggles />
                      <Separator />
                      <ListsToggle />
                      <Separator />
                      <CreateLink />
                      <InsertImage />
                      <Separator />
                      <InsertTable />
                      <InsertThematicBreak />
                      <InsertCodeBlock />
                    </>
                  ),
                },
              ]}
            />
          ),
        }),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
      ]}
      className=" light-border-2 background-light800_dark300 markdown-editor dark-editor grid  w-full   border"
      {...props}
    />
  );
};

export default Editor;

/*

*/
