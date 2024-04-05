import React, { useState } from "react";
import {
    IconButton,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  Input,

} from "@material-tailwind/react";
export function DialogUpdate(props) {
    const [open, setOpen] = React.useState(false);
    const values = props.values;
    const handleOpen = () => setOpen(!open);

    const [name, setName] = useState(values.row.ten);
    const [lighting, setLighting] = useState(values.row.ma_feed_anh_sang);
    const [temperature, setTemperature] = useState(values.row.ma_feed_nhiet_do);
    const [moisture, setMoisture] = useState(values.row.ma_feed_do_am);

    const handleNameChange = (e) => setName(e.target.value);
    const handleLightingChange = (e) => setLighting(e.target.value);
    const handleTemperatureChange = (e) => setTemperature(e.target.value);
    const handleMoistureChange = (e) => setMoisture(e .target.value);
    return (
        <>
        <IconButton onClick={handleOpen} variant="outlined" className="rounded-full h-6 w-6 mx-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
            </svg>
        </IconButton>
        <Dialog open={open} size="m" handler={handleOpen} className="flex flex-col justify-center items-center py-12">
            <p style={{fontSize:"26px",color:"#5D7285"}}>CHỈNH SỬA THÔNG TIN</p>
            <DialogBody style={{height:'fit-content',overflow:'auto', scrollbarWidth: '0px'}} className="!overflow-x-hidden !overflow-y-visible">
                <form className="w-100 max-w-screen-lg sm:w-96" method="post">
                    <div className="mb-1 flex flex-col gap-3">
                        <Input size="lg" type="text" name='name' label="Tên khu cây trồng" value={name} onChange={handleNameChange} required/>   
                        <Input size="lg"  type="text" name='lighting' label="Ánh sáng" value={lighting}  onChange={handleLightingChange} required/>     
                        <Input size="lg" type='text' name='temperature' label="Nhiệt độ"  value={temperature} onChange={handleTemperatureChange} required/>     
                        <Input size="lg" type="text" name='moisture' label="Độ ẩm" value={moisture} onChange={handleMoistureChange} required/>     
                    </div>
                    <Button className="mt-6" type="submit" fullWidth style={{backgroundColor: '#3758F9'}}>
                    Lưu thay đổi
                    </Button>
                </form>
            </DialogBody>
        </Dialog>
    </>
  );
}