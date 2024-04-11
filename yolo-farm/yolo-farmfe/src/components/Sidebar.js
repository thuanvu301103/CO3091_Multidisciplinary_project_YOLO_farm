import {
  Card,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  Cog6ToothIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";
 
export function Sidebar() {
  return (
    <Card className="h-full w-full max-w-[20rem] pt-4" style={{borderRadius:'0', padding:'40px 0'}}>
      <List style={{padding:'20px 0', minWidth:'100%'}}>
        <div style={{margin:'0 10px', borderRadius:'10px'}}>
          <ListItem>
            <ListItemPrefix>
              <PresentationChartBarIcon className="h-5 w-5" />
            </ListItemPrefix>
            Khu cây trồng
          </ListItem>
        </div>
        <div style={{margin:'0 10px', borderRadius:'10px'}}>
          <ListItem>
            <ListItemPrefix>
              <Cog6ToothIcon className="h-5 w-5" />
            </ListItemPrefix>
            Cài đặt
          </ListItem>
        </div>
        <div style={{margin:'0 10px', borderRadius:'10px', backgroundColor:'#667A8A', color:'#FFFFFF'}}>
          <ListItem>
            <ListItemPrefix>
              <PowerIcon className="h-5 w-5" />
            </ListItemPrefix>
            Đăng xuất
          </ListItem>
        </div>
      </List>
    </Card>
  );
}