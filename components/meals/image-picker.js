"use client"
import Image from "next/image";
import { useRef, useState } from "react"
import classes from "./image-picker.module.css"
export default function ImagePicker({label,name}){
    const imageInput=useRef();
    const [pickedImage,setPickedImage]=useState();
    function PickerHandler(){
     imageInput.current.click();
    }

    function handleImagePicker(event){
        const file=event.target.files[0];

        if(!file){
            setPickedImage(null);
            return;
        }
        setPickedImage('');
        const fileReader=new FileReader();
        fileReader.onload=() =>{
            setPickedImage(fileReader.result)
        };
        fileReader.readAsDataURL(file);

    }
    return(
     <div className={classes.picker}>
        <label htmlFor={name}>{label}</label>
        <div className={classes.control}>
            <div className={classes.preview}>
                {!pickedImage && <p>No image picked yet.</p>}
                {pickedImage && (<Image src={pickedImage} alt="The image selected by the user" fill/>)}
            </div>
            <input className={classes.input} type="file" id={name} accept="image/png, image/jpeg" name={name} ref={imageInput} onChange={handleImagePicker} required />
            <button className={classes.button} type="button" onClick={PickerHandler}>Pick an Image</button>
        </div>
     </div>
        
    )
}