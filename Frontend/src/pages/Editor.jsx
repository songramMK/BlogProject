import React from "react";
import styles from "./bubble.module.css";


import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { color } from "motion";

const Editor = ({ value, setValue }) => {

  function uploadAdapter(loader){
    return {
      upload : async()=>{
        //actual file 
        const file = await loader.file ; 
        console.log(file) ; 



        const formData = new FormData() ; 
        formData.append("image", file);

        const response = await fetch(
          `/api/post/UploadPostImage`,
          {
            method: "POST",
            body: formData,
            credentials : true // cookie send hobe 
          },
        );
       const data = await response.json();

       if (!response.ok) {
         throw new Error("Upload failed");
       }

       return {
         default: data.data.secure_url,
       };

       
      }
    }
  }
  //plugin
  function uploadPlugIn (editor){
    editor.plugins.get("FileRepository").createUploadAdapter = (loader)=>{
      return uploadAdapter(loader)
    }
  }
 
  return (
    <div className="max-w-lg sm:max-w-full text-black  py-10 rounded-lg">
      <div className="w-full">
        <CKEditor
          editor={ClassicEditor}
          data={value}
          config={{
            extraPlugins: [uploadPlugIn],
          }}
          onChange={(event, editor) => {
            const data = editor.getData();
            console.log("data: ", data);
            console.log("event: ", event);
            setValue(data);
          }}
        />
      </div>
    </div>
  );
};

export default Editor;
