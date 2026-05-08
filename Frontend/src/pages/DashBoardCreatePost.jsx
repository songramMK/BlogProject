import React, { useState } from 'react'
import styles from "./bubble.module.css";



import Editor from './Editor.jsx' 


import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DashBoardCreatePost = () => {

  const [content, setContent] = useState("");

  const handleSubmit = () => {
    console.log(content); // HTML যাবে DB তে
  };

  return (
    <div className="w-full max-w-4xl mx-auto  md:px-4">
      <BubbleText />

      <form className="mt-20 " action="">
        <div className="flex justify-center flex-col  md:flex-row gap-3   mt-20">
          <input
            className="max-w-sm md:max-w-md border-r-0 border-[#F05252] border-l-0 border-t-0  w-full border  rounded focus:outline-none py-1 px-4 text-indigo-100"
            type="text"
            placeholder="Blog Title"
          />
          <Select>
            <SelectTrigger className="w-full max-w-48 py-4 border-[#F05252] border-r-0 border-t-0  border-l-0 text-white">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup className="text-white bg-black ">
                <SelectLabel className="text-white ">Category</SelectLabel>
                <SelectItem value="worldnews">World News</SelectItem>
                <SelectItem value="sportsnews">Sports News</SelectItem>
                <SelectItem value="localnews">Local News</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col md:flex-row   items-center mt-5">
          <input
            type="file"
            className="  border py-1 w-1/3 sm:w-1/3  md:border-r-0  rounded border-[#f05252] "
            accept="image/*"
          />
          <button  className="text-xs md:text-sm  border bg-[#f05252] rounded border-[#f05252] px-1 py-2 font-extralight text-black">
            Upload Poster Image
          </button>
        </div>
        <Editor value={content} setValue={setContent} />{" "}
      </form>
    </div>
  );
}


const BubbleText = () => {
  return (
    <h2 className="underline text-center text-5xl font-thin text-indigo-300">
      {"__Write A New Post__".split("").map((child, idx) => (
        <span className={styles.hoverText} key={idx}>
          {child}
        </span>
      ))}
    </h2>
  );
};


export default DashBoardCreatePost