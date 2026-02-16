import type { Preview } from "@storybook/react";
import "../src/globals.css";

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: "vspo",
      values: [
        { name: "vspo", value: "#F7F6F3" },
        { name: "white", value: "#ffffff" },
        { name: "dark", value: "#1a1a1a" },
      ],
    },
  },
};

export default preview;
