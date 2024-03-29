import React from "react";
import {
    IconButton,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  Input,
} from "@material-tailwind/react";
export function DialogCreate() {
  const [open, setOpen] = React.useState(false);
 
  const handleOpen = () => setOpen(!open);
 
  return (
    <>
        <Button onClick={handleOpen} style={{backgroundColor:'#0bb489'}}>
            Thêm khu cây trồng
        </Button>
        <Dialog open={open} size="m" handler={handleOpen} className="flex flex-col justify-center items-center py-12">
            <p style={{fontSize:"26px",color:"#5D7285"}}>THÊM KHU CÂY TRỒNG</p>
            <DialogBody style={{height:'fit-content',overflow:'auto', scrollbarWidth: '0px'}} className="!overflow-x-hidden !overflow-y-visible">
                <form className="w-100 max-w-screen-lg sm:w-96" method="post">
                    <div className="mb-1 flex flex-col gap-3">
                        <Input size="lg" type="text" name='name' label="Tên khu cây trồng" required/>   
                        <Input size="lg"  type="number" name='lighting' label="Ánh sáng" required/>     
                        <Input size="lg" type='number' name='temperature' label="Nhiệt độ"  required/>     
                        <Input size="lg" type="number" name='phone_number' label="Độ ẩm" required/>   
                    </div>
                    <Button className="mt-6" type="submit" fullWidth style={{backgroundColor: '#3758F9'}}>
                    XÁC NHẬN
                    </Button>
                </form>
            </DialogBody>
        </Dialog>
    </>
  );
}