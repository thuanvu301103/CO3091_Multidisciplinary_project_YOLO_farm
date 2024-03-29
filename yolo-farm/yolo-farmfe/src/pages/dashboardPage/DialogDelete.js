import React from "react";
import {
    IconButton,   
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

export function DialogDelete (props) {
    const [open, setOpen] = React.useState(false);
    const values = props.values;
    const handleOpen = () => setOpen(!open);

    return (
        <>
            <IconButton variant="outlined" onClick={handleOpen} className="rounded-full h-6 w-6 mx-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </IconButton>
            <Dialog open={open} size="m" handler={handleOpen} className="flex flex-col justify-center items-center py-12">
                <p style={{fontSize:"26px",color:"#5D7285", textAlign:'center'}}>XÓA KHU CÂY TRỒNG</p>
                <DialogBody className="text-center ">
                    Bạn có chắc chắn muốn xóa khu cây trồng
                    <span className="mx-1" style={{color:'#ef4444'}}>
                        {values.row.name}
                    </span>
                    không?
                </DialogBody>
                <div style={{display:'flex',justifyContent:'space-evenly',width:'100%'}}>
                    <Button
                        variant="text"
                        onClick={handleOpen}
                    >
                        <span>Không</span>
                    </Button>
                    <Button style={{backgroundColor:'#ef4444'}} onClick={handleOpen}>
                        <span>Có</span>
                    </Button>
                </div>
            </Dialog>
        </>
    )
}