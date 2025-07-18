import { Code } from "bright";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

import { fixMDXContent } from "@/lib/utils";

Code.theme = {
  light: "github-light",
  dark: "github-dark",
  lightSelector: "html.light",
};

const Preview = ({ content = "" }: { content: string }) => {
  // const formattedContent = content.replace(/\\/g, "").replace(/&#x20;/g, "");

  // First apply basic content cleaning
  let formattedContent = content
    .replace(/\\/g, "")
    .replace(/&#x20;/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\u00A0/g, " ") // Non-breaking space
    .replace(/\r\n/g, "\n") // Windows line endings
    .replace(/\r/g, "\n") // Mac line endings
    .trim();

  // Only apply MDX fixes if there are angle bracket URLs (the main cause of errors)
  if (formattedContent.includes("<http")) {
    formattedContent = fixMDXContent(formattedContent);
  }
  return (
    <section className="markdown prose grid break-words">
      <div>Test Preview </div>
      <MDXRemote
        source={formattedContent}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
          },
        }}
        components={{
          pre: (props) => (
            <Code
              {...props}
              lineNumbers
              className="shadow-light-200 dark:shadow-dark-200"
            />
          ),
        }}
      />
    </section>
  );
};

export default Preview;

// import { Code } from "bright";
// import { MDXRemote } from "next-mdx-remote/rsc";
// import React from "react";

// Code.theme = {
//   light: "github-light",
//   dark: "github-dark",
//   lightSelector: "html.light",
// };

// const Preview = ({ content }: { content: string }) => {
//   const formattedContent = content.replace(/\\/g, "").replace(/&#x20;/g, "");

//   return (
//     <section className="markdown prose grid break-words">
//       <MDXRemote
//         source={formattedContent}
//         components={{
//           pre: (props) => (
//             <Code
//               {...props}
//               lineNumbers
//               className="shadow-light-200 dark:shadow-dark-200"
//             />
//           ),
//         }}
//       />
//     </section>
//   );
// };

// export default Preview;
