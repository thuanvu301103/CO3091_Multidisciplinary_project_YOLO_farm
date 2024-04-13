import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Portal } from '@mui/base/Portal';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import {Typography} from '@material-tailwind/react'
import { DataGrid, GridToolbarQuickFilter, GridToolbar } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { Header } from "../../components/Navbar";
import { Sidebar } from "../../components/Sidebar";
import { Footer } from '../../components/Footer';
import {DialogDelete} from "./DialogDelete";
import {DialogUpdate} from "./DialogUpdate";
import {DialogView} from "./DialogView";
import {DialogCreate} from "./DialogCreate";
import {SSEComponent} from '../../components/SSEComponent';
import {useParams} from "react-router-dom";

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

const VISIBLE_FIELDS = ['id','ten', 'ma_feed_anh_sang', 'ma_feed_nhiet_do', 'ma_feed_do_am', 'operate'];

export function DashboardPageManager() {

	// Get params from URL
	const paramURL = useParams();
	let managerid = paramURL['managerid'];
	const [dataRows, setDataRows] = useState([]);

    const data = {
        columns: [
    
        { field: 'id', headerName: 'ID', align: 'left', headerAlign: 'left', flex: 0.5 },
        { field: 'ten', headerName: 'Khu cây trồng', align: 'center', headerAlign: 'center', flex: 1 },
        { field: 'ma_feed_anh_sang', headerName: 'Ánh sáng', align: 'center', headerAlign: 'center', flex: 1 },
        { field: 'ma_feed_nhiet_do', headerName: 'Nhiệt độ', align: 'center', headerAlign: 'center', flex: 1 },
        { field: 'ma_feed_do_am', headerName: 'Độ ẩm', align: 'center', headerAlign: 'center', flex: 1 },
        { field: 'operate', headerName: 'Thao tác', align: 'center', headerAlign: 'center', flex: 1,
      renderCell: (params) => {
        console.log(params);
        return (
          <>
            <Link to={`/manager/${managerid}/area/${params.row.id}`}>
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


	// fetch data
	useEffect(() => {
    		const fetchData = async () => {
      			try {
        			const apiUrl = `http://localhost:3000/envsense/user/${managerid}/plantarea/list`;
				    console.log ('apiURL = ', apiUrl);
        			// Make the HTTP GET request using Axios
        			const response = await axios.get(apiUrl);
                    let res_data = response.data;
                        console.log('Response: ', res_data);
				    for (let i in res_data) {
					res_data[i]['operate'] = true;
					res_data[i]['no'] = i+1;
					//data[i]['id'] = data[i]['_id'];		
				}
				let dataRow = [];
				for (let i in res_data) {
					dataRow.push({
							'id': res_data[i]['_id'], 
							'no': i+1,
							'ten': res_data[i]['ten'], 
							'ma_feed_anh_sang': res_data[i]['ma_feed_anh_sang'],
							'ma_feed_nhiet_do': res_data[i]['ma_feed_nhiet_do'],
							'ma_feed_do_am': res_data[i]['ma_feed_do_am'],
							'operate': true});
				}
				console.log ('Get datarow = ', dataRow);
        			setDataRows(dataRow);
      			} catch (error) {
        			console.error('Error fetching data:', error);
      			}
    		};
    		fetchData();
  	}, [managerid]);

	
	
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
      <Footer></Footer>
    </>
  );
}