import * as React from "react";
import Logo from '../assets/image/Logo.png'
import { IconButton, Typography } from "@material-tailwind/react";
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
export function Footer() {
  return (
    <div className="flex flex-col pt-10 pr-10 pb-20 pl-20 bg-white max-md:px-5">
      <div className="shrink-0 self-end rounded-full bg-[linear-gradient(180deg,rgba(19,194,150,0.31)_0%,rgba(196,196,196,0.00)_100%)] h-[75px] w-[75px]" />
      <div className="self-center mt-1.5 w-full max-w-[1265px] max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col max-md:gap-0">
          <div className="flex flex-col w-[44%] max-md:ml-0 max-md:w-full">
            <div className="grow max-md:mt-10 max-md:max-w-full">
              <div className="flex gap-5 max-md:flex-col max-md:gap-0">
                <div className="flex flex-col w-[66%] max-md:ml-0 max-md:w-full">
                  <div className="flex flex-col grow max-md:mt-8">
                    <img
                      src={Logo}
                      className="max-w-full aspect-[3.57] w-[232px]"
                    />
                    <div className="flex gap-2.5 mt-6 text-sm font-medium leading-5 text-gray-900">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                        </svg>
                        <div>HCMUT, Đông Hòa, Dĩ An, Bình Dương</div>
                    </div>
                    <div className="flex gap-2.5 mt-6 text-sm font-medium leading-5 text-gray-900">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                        </svg>
                      <div>+012 (345) 678 99</div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col ml-5 w-[34%] max-md:ml-0 max-md:w-full">
                  <div className="flex flex-col text-base leading-6 text-gray-500 max-md:mt-8">
                    <div className="text-lg font-semibold leading-6 text-gray-900">
                      Hỗ trợ khách hàng
                    </div>
                    <Typography
                        as="a"
                        href="#"
                        color="blue-gray"
                        className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500 mt-3"
                    >
                        Hướng dẫn sử dụng
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col ml-5 w-[56%] max-md:ml-0 max-md:w-full">
            <div className="max-md:mt-10 max-md:max-w-full">
              <div className="flex gap-5 max-md:flex-col max-md:gap-0">
                <div className="flex flex-col w-[33%] max-md:ml-0 max-md:w-full">
                  <div className="flex flex-col grow text-base leading-6 text-gray-500 max-md:mt-10">
                    <div className="text-lg font-semibold leading-6 text-gray-900">
                      Giới thiệu chung
                    </div>
                    <Typography
                        as="a"
                        href="#"
                        color="blue-gray"
                        className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500 mt-3"
                    >
                        Thành viên sáng lập
                    </Typography>
                  </div>
                </div>
                <div className="flex flex-col ml-5 w-[33%] max-md:ml-0 max-md:w-full">
                  <div className="flex flex-col grow text-base leading-6 text-gray-500 max-md:mt-10">
                    <div className="text-lg font-semibold leading-6 text-gray-900">
                      Công ty
                    </div>
                    <Typography
                        as="a"
                        href="#"
                        color="blue-gray"
                        className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500 mt-3"
                    >
                        Dịch vụ của chúng tôi
                    </Typography>
                  </div>
                </div>
                <div className="flex flex-col ml-5 w-[33%] max-md:ml-0 max-md:w-full">
                  <div className="flex flex-col max-md:mt-10">
                    <div className="text-lg font-semibold leading-6 text-gray-900">
                      Theo dõi chúng tôi tại
                    </div>
                    <div className="flex gap-4 mt-9">
                        <IconButton variant="outlined" className="rounded-full hover:text-white hover:bg-black">
                            <FacebookOutlinedIcon></FacebookOutlinedIcon>
                        </IconButton>
                        <IconButton variant="outlined" className="rounded-full hover:text-white hover:bg-black" >
                            <GitHubIcon></GitHubIcon>
                        </IconButton>
                        <IconButton variant="outlined" className="rounded-full hover:text-white hover:bg-black" >
                            <YouTubeIcon></YouTubeIcon>
                        </IconButton>
                        <IconButton variant="outlined" className="rounded-full hover:text-white hover:bg-black" >
                            <LinkedInIcon></LinkedInIcon>
                        </IconButton>
                    </div>
                    <div className="mt-6 text-base leading-6 text-gray-500">
                      © 2024 YoloFarm.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

