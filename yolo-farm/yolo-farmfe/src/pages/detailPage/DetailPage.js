import {Header} from "../../components/Navbar";
import {Sidebar} from "../../components/Sidebar";
import { Button, CardFooter } from "@material-tailwind/react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import LightImg from '../../assets/image/Light.jpg';
import TempImg from '../../assets/image/Temp.jpg';
import MoistureImg from '../../assets/image/Moisture.jpg';


export function DetailPage(){
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
                            <Link to = "/history">
                                <Button className="rounded-3xl mx-6" style={{height:'40px',backgroundColor:'#0BB489', color:'#ffffff'}}>
                                    Xem lịch sử
                                </Button>
                            </Link>
                            <Link to = "/">
                                <Button className="rounded-3xl" style={{height:'40px',backgroundColor:'#DEE2E6', color:'#000000'}}>
                                    Trở về
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <div className="col-span-4">
                        <Card
                        shadow={false}
                        className="relative grid w-full max-w-[28rem] items-end justify-center overflow-hidden text-center py-5"
                        >
                        <CardHeader
                            floated={false}
                            shadow={false}
                            color="transparent"
                            className="absolute inset-0 m-0 h-full w-full rounded-none bg-cover bg-center"
                            style={{background:`url(${TempImg})`, filter: 'brightness(30%)'}}
                        >
                            <div className="to-bg-black-10 absolute inset-0 h-full w-full" />
                        </CardHeader>
                        <CardBody className="relative py-14 px-6 md:px-12">
                            <Typography
                            style={{fontSize:'100px', color: '#FCF671', fontWeight:'bold'}}
                            className="mb-3 font-medium leading-[1.5]"
                            >
                            30
                            </Typography>
                            <Typography
                            variant="h3"
                            color="white"
                            className="mb-3 font-medium leading-[1.5] w-full"
                            >
                            Nhiệt độ
                            </Typography>
                            <Typography variant="h6" className="mb-4 text-gray-400 w-full">
                            Nhiệt độ khuyến nghị: 30
                            </Typography>
                            <Button className="rounded-3xl" style={{backgroundColor:'white', color:'#4CA844', backgroundColor:'rgb(255,255,255)'}}>
                                Tình trạng: Tốt
                            </Button>
                        </CardBody>
                        </Card>
                    </div>
                    <div className="col-span-4">
                        <Card
                        shadow={false}
                        className="relative grid w-full max-w-[28rem] items-end justify-center overflow-hidden text-center py-5"
                        >
                        <CardHeader
                            floated={false}
                            shadow={false}
                            color="transparent"
                            className="absolute inset-0 m-0 h-full w-full rounded-none bg-cover bg-center"
                            style={{background:`url(${LightImg})`,  filter: 'brightness(30%)'}}
                        >
                            <div className="to-bg-black-10 absolute inset-0 h-full w-full " />
                            
                        </CardHeader>
                        <CardBody className="relative py-14 px-6 md:px-12">
                            <Typography
                            style={{fontSize:'100px', color: '#C0D82B', fontWeight:'bold'}}
                            className="mb-3 font-medium leading-[1.5]"
                            >
                            30
                            </Typography>
                            <Typography
                            variant="h3"
                            color="white"
                            className="mb-3 font-medium leading-[1.5]"
                            >
                            Ánh sáng
                            </Typography>
                            <Typography variant="h6" className="mb-4 text-gray-400">
                            Ánh sáng khuyến nghị: XX
                            </Typography>
                            <Button className="rounded-3xl" style={{backgroundColor:'white', color:'#4CA844', backgroundColor:'rgb(255,255,255)'}}>
                                Tình trạng: Tốt
                            </Button>
                        </CardBody>
                        </Card>
                    </div>
                    <div className="col-span-4">
                        <Card
                        shadow={false}
                        className="relative grid w-full max-w-[28rem] items-end justify-center overflow-hidden text-center py-5"
                        >
                        <CardHeader
                            floated={false}
                            shadow={false}
                            color="transparent"
                            className="absolute inset-0 m-0 h-full w-full rounded-none bg-cover bg-center"
                            style={{background:`url(${MoistureImg})`, filter: 'brightness(30%)'}}
                        >
                            <div className="to-bg-black-10 absolute inset-0 h-full w-full" />
                        </CardHeader>
                        <CardBody className="relative py-14 px-6 md:px-12">
                            <Typography
                            style={{fontSize:'100px', color: '#1152FA', fontWeight:'bold'}}
                            className="mb-3 font-medium leading-[1.5]"
                            >
                            30
                            </Typography>
                            <Typography
                            variant="h3"
                            color="white"
                            className="mb-3 font-medium leading-[1.5]"
                            >
                            Độ ẩm
                            </Typography>
                            <Typography variant="h6" className="mb-4 text-gray-400">
                            Độ ẩm khuyến nghị: XX
                            </Typography>
                            <Button className="rounded-3xl" style={{backgroundColor:'white', color:'#4CA844', backgroundColor:'rgb(255,255,255)'}}>
                                Tình trạng: Tốt
                            </Button>
                        </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    )
}