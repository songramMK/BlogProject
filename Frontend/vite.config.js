// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from "@tailwindcss/vite";
// import flowbiteReact from "flowbite-react/plugin/vite";

// // https://vite.dev/config/
// export default defineConfig({
//   server:{
//     proxy: {
//       '/api':{
//         target: 'http://localhost:3000' ,
//         secure : false ,

//       }
//     }
//   },
//   plugins: [tailwindcss(), react(), flowbiteReact()],
// });

import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});