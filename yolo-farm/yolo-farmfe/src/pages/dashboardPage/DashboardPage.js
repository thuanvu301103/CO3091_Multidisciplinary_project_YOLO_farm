import * as React from 'react';
import { Portal } from '@mui/base/Portal';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import {Typography} from '@material-tailwind/react'
import { DataGrid, GridToolbarQuickFilter, GridToolbar } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { Header } from "../../components/Navbar";
import { Sidebar } from "../../components/Sidebar";
import {DialogDelete} from "./DialogDelete";
import {DialogUpdate} from "./DialogUpdate";
import {DialogView} from "./DialogView";
import {DialogCreate} from "./DialogCreate";
function MyCustomToolbar(props) {
  return (
    <React.Fragment>
      <Portal container={() => document.getElementById('filter-panel')}>
        <GridToolbarQuickFilter />
      </Portal>
      <GridToolbar {...props} />
    </React.Fragment>
  );
}

const VISIBLE_FIELDS = ['id','name', 'lighting', 'temperature', 'moisture', 'operate'];

export function DashboardPage() {
  const data = {
    columns: [
      { field: 'id', headerName: 'ID', align: 'left', headerAlign: 'left', flex: 0.5 },
      { field: 'name', headerName: 'Khu cây trồng', align: 'center', headerAlign: 'center', flex: 1 },
      { field: 'lighting', headerName: 'Ánh sáng', align: 'center', headerAlign: 'center', flex: 1 },
      { field: 'temperature', headerName: 'Nhiệt độ', align: 'center', headerAlign: 'center', flex: 1 },
      { field: 'moisture', headerName: 'Độ ẩm', align: 'center', headerAlign: 'center', flex: 1 },
      { field: 'operate', headerName: 'Thao tác', align: 'center', headerAlign: 'center', flex: 1,
      renderCell: (params) => {
        console.log(params);
        return (
          <>
            <Link to='/detail'>
                <DialogView values={params} />
            </Link>
            <DialogUpdate values={params}/>
            <DialogDelete  values={params}/>
          </>
        );
      },
      }
    ]
  };
  
  const dataRows = [
    { id: 1, no: 1, name: 'Cà chua', lighting: '10', temperature: '10', moisture: '10', operate: true },
    { id: 2, no: 2, name: 'Cà rốt', lighting: '10', temperature: '10', moisture: '10', operate: false },
  ];
  
  const columns = React.useMemo(
    () => data.columns.filter((column) => VISIBLE_FIELDS.includes(column.field)),
    [data.columns]
  );

  return (
    <>
      <Header />
      <div className="grid grid-cols-12">
        <div className="col-span-2">
          <Sidebar />
        </div>
        <div className="col-span-10 m-6">
            <div style = {{display:'flex', justifyContent: 'space-between', alignItems: "center", marginBottom: "20px"}}>
                <div>
                    <Typography
                        variant="h3"
                        style={{color:'#444444'}}
                        className="mb-3 font-bold leading-[1.5] w-fit"
                        >
                        Danh sách khu cây trồng
                    </Typography>
                    <DialogCreate></DialogCreate>
                </div>              
                <div>
                    <Box id="filter-panel" />
                </div>
            </div>
            <Grid item style={{ height: 'calc(100vh - 250px)', width: '100%' }}>
              <DataGrid
                rows={dataRows}
                columns={columns}
                slots={{
                  toolbar: MyCustomToolbar
                }}
                autoHeight
                initialState={{
                  filter: {
                    items: [],
                    quickFilterExcludeHiddenColumns: true
                  }
                }}
              />
            </Grid>
        </div>
      </div>
    </>
  );
}