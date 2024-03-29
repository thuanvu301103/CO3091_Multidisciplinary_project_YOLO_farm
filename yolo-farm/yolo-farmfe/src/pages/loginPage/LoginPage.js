import * as React from "react";
import { Input, Button } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import LoginImg from '../../assets/image/Login.jpg'
export function LoginPage() {
  return (
    <div className="flex justify-center items-center bg-stone-50 max-md:px-5">
      <div className=" max-w-full bg-white w-full max-md:pl-5">
        <div className="flex gap-5 max-md:flex-col max-md:gap-0">
          <div className="flex flex-col w-[60%] max-md:ml-0 max-md:w-full">
            <div className="flex flex-col self-stretch my-auto text-base font-medium max-md:mt-10 px-12">
              <div className="text-3xl font-bold leading-10 text-gray-800 py-5">
                Đăng nhập
              </div>
              <div className="my-2">
                <Input size="lg" label="Email" className="" />
              </div>
              <div className="my-2">
                <Input size="lg" label="Mật khẩu" className="" />
              </div>
              
                <Link to="/" style={{width:'100%'}}>
                    <Button fullWidth className="justify-center items-center px-7 py-3.5 mt-5 text-center text-white bg-blue-600 rounded-md leading-[150%] max-md:px-5">
                        Đăng nhập
                    </Button>
                </Link>
              <div className="flex gap-5 justify-between mt-10">
                <div className="text-gray-500 leading-[150%]">
                  Quên mật khẩu?
                </div>
                <div className="leading-6 text-right text-gray-500">
                  Không có tài khoản?{" "}
                  <span className="text-blue-600">Đăng kí</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col ml-5 w-[59%] max-md:ml-0 max-md:w-full h-screen">
            <div className="flex grow gap-0 items-start pr-3.5 pb-16 w-full max-md:flex-wrap max-md:mt-10 max-md:max-w-full" style={{background:`url(${LoginImg})`, backgroundSize:'cover'}}>
              <div className="flex flex-col grow shrink-0 self-start basis-0 w-fit max-md:max-w-full">
                <div className="flex flex-col justify-center items-start py-px rounded-full max-md:pr-5 max-md:max-w-full">
                  <div className="shrink-0 rounded-full h-[354px] w-[177px]" />
                </div>
                <div className="mt-11 ml-14 text-3xl font-semibold leading-9 text-white max-md:mt-10 max-md:ml-2.5">
                  Hey
                  <br />
                  Welcome
                  <br />
                  <span strong>YOLO FARM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

