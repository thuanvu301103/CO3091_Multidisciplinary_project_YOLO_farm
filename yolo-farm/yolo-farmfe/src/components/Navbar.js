import React from "react";
import {
  Navbar,
  MobileNav,
  Typography,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import Logo from '../assets/image/Logo.png';
import { useParams } from "react-router-dom";
import { BellAlertIcon, BellIcon } from "@heroicons/react/24/solid";

export function Header({ logined, role, username, reverseNotifyExpand, haveNotify, reverseHaveNotify}) {

    const [openNav, setOpenNav] = React.useState(false);
    const [openProfile, setOpenProfile] = React.useState(false);

    const profileDropdown = () => { setOpenProfile(!openProfile); }
 
    React.useEffect(() => {
        window.addEventListener(
            "resize",
            () => window.innerWidth >= 960 && setOpenNav(false),
        );
    }, []);

    const reverseNotify = () => {
        reverseNotifyExpand();
        if (haveNotify) reverseHaveNotify();
    }

  return (
    <Navbar className="mx-auto max-w-screen-xl px-4 py-2 border-r-2 border-blue-gray-900/5" style={{margin:'0', minWidth:'100%', borderRadius:'0',}}>
        <div className="container mx-auto flex items-center justify-between text-blue-gray-900">
              <img src={Logo} style={{ height: '60px' }}></img>

              {/*Notification button*/}
              {(logined && role == "user") ? (
                    <div className="flex">
                      <Button variant="text" size="sm" className="hidden lg:inline-block"
                          onClick={reverseNotify}>
                          {haveNotify?
                              (<span><BellAlertIcon className="h-5 w-5" /></span>):
                              (<span><BellIcon className="h-5 w-5" /></span>)
                          }
                          
                        </Button>
                      <Button variant="text" size="sm" className="hidden lg:inline-block">
                          <span>Xin chào, {username}</span>
                      </Button>

                    </div>
                ): null
              }

              {(logined && role == "manager") ? (
                  <div className="flex">
                      <Button variant="text" size="sm" className="hidden lg:inline-block">
                          <span>manager</span>
                      </Button>
                      <Button variant="text" size="sm" className="hidden lg:inline-block">
                          <span>Xin chào, {username}</span>
                      </Button>

                  </div>
              ) : null
              }

              {/*Login logout*/}
              {logined ? null : (
                  <div className="flex items-center gap-x-1">
                      <Link to='/login'>
                          <Button variant="text" size="sm" className="hidden lg:inline-block">
                              <span>Đăng nhập</span>
                          </Button>
                      </Link>
                      <Button
                          variant="gradient"
                          size="sm"
                          className="hidden lg:inline-block"
                      >
                          <span>Đăng kí</span>
                      </Button>
                  </div>
              )
              }

        <IconButton
          variant="text"
          className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
          ripple={false}
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </IconButton>
      </div>
      <MobileNav open={openNav}>
        <div className="container mx-auto">
          <div className="flex items-center gap-x-1">
            <>
              <Button fullWidth variant="text" size="sm" className="">
                <span>Log In</span>
              </Button>
              <Button fullWidth variant="gradient" size="sm" className="">
                <span>Sign in</span>
              </Button>
            </>
          </div>
        </div>
      </MobileNav>
    </Navbar>
  );
}