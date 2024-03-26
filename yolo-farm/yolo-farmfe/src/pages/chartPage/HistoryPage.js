import {Header} from "../../components/Navbar";
import {Sidebar} from "../../components/Sidebar";
import { Typography, Button } from "@material-tailwind/react";
import { TempHistory } from "./TempHistory";
import { LightHistory } from "./LightHistory";
import { MoistureHistory } from "./MoistureHistory";
export function HistoryPage() {
    return (
        <>
            <Header></Header>
            <div className ="grid grid-cols-12">
                <div className="col-span-2">
                    <Sidebar></Sidebar>
                </div>
                <div className="col-span-10 grid grid-cols-12 gap-6 m-6">
                    <div className="flex col-span-12 justify-between items-center" style={{width:'100%'}}>
                        <Typography
                            variant="h5"
                            style={{color:'#444444'}}
                            className="mb-3 font-medium leading-[1.5] w-fit"
                            >
                            Khu: XXX
                            &nbsp;
                            Kế hoạch: YYY
                        </Typography>
                        <div>
                            <Button className="rounded-3xl" style={{height:'40px',backgroundColor:'#DEE2E6', color:'#000000'}}>
                                Trở về
                            </Button>
                        </div>
                    </div>
                    <div className="col-span-12">
                        <TempHistory></TempHistory>
                        <LightHistory></LightHistory>
                        <MoistureHistory></MoistureHistory>
                    </div>
                </div>
            </div>
        </>
    )
}