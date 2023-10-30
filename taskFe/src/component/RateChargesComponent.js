import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import axiosInstance from "../axiosInstance";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PetrolPumpIcon from "@mui/icons-material/LocalGasStation";
import IconButton from "@mui/material/IconButton";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const columns = [
  { id: "rateName", label: "Rate Name", minWidth: 120, type: "text", align:"left", },
  {
    id: "invoiceDescription",
    label: "Invoice Descr",
    minWidth: 120,
    align:"left",
    type: "text",
  },
  {
    id: "rate",
    label: "Rate",
    minWidth: 30,
    align:"right",
    type: "number",
  },
  {
    id: "unit",
    label: "Unit",
    minWidth: 30,
    align: "right",
    type: "number",
  },
  {
    id: "amount",
    label: "Amount",
    minWidth: 30,
    align: "right",
    type: "number",
  },
];
const columns1 = [
  {
    id: "payableDescription",
    label: "Payable Descr",
    minWidth: 120,
    align:"left",
    type: "text",
  },
  
  {
    id: "rate",
    label: "Rate",
    minWidth: 30,
    align: "right",
    type: "number",
  },
  {
    id: "unit",
    label: "Unit",
    minWidth: 30,
    align: "right",
    type: "number",
  },
  {
    id: "amount",
    label: "Amount",
    minWidth: 30,
    align: "right",
    type: "number",
  },
  {
    id: "truck",
    label: "Truck",
    minWidth: 30,
    align: "right",
    type: "number",
  },
  {
    id: "PT_date",
    label: "PT Date",
    align: "right",
    minWidth: 100,

    align: "right",
    type: "date",
    format: (datedata) => {
      const date = new Date(datedata);
      const day = date.getUTCDate().toString().padStart(2, "0");
      const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
      const year = date.getUTCFullYear();
      return (
        <span>
          {day}/{month}/{year}
        </span>
      );
    },
  },
];

const RateChargesComponent = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
 
  const [response, setResponse] = useState({
    message: '',
    severity: 'success',
    open: false,
  });

  // const [rows, setRows] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [editedRowData, setEditedRowData] = useState({});
  const [editingSubRow, setEditingSubRow] = useState(null);
  const [editedSubRowData, setEditedSubRowData] = useState({});
  const [isAddingRow, setIsAddingRow] = useState(false);
  const [isAddingSubRow, setIsAddingSubRow] = useState(false);
  const [initialRow, SetInitialRow] = useState([]);

  const [newRowData, setNewRowData] = useState({
    receivable: {
      rateName: "",
      invoiceDescription: "",
      rate: "",
      unit: "",
      amount: "",
    },
    payable: {
      payableDescription: "",
      rate: "",
      unit: "",
      amount: "",
      truck: "",
      PT_Date: "",
    },
  });
  

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get("/invoices");
      console.log("response", response.data);
    
      SetInitialRow(response.data);
      setRows(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  
  const handleRowSubmit = async (updatedRow, rowId) => {
    console.log("rakesh");
    if (isAddingRow) {
      try {
        let data = {
          receivable: updatedRow.receivable,
          payable: updatedRow.payable,
        };
        const response = await axiosInstance.post("/invoices", data);
        console.log("response", response);
       
        fetchData();
        setEditingRow(null);
        setEditedRowData({});
       
        setIsAddingRow(false);
        setResponse({message:"row has been added",severity:"success",open:true})
      } catch (error) {
        console.error("Error fetching employees:", error);
        setResponse({message:error.message,severity:"error",open:true})
      }
     
    } else if (editingRow) {
      console.log("editrow", updatedRow);
      try {
        let data = {
          receivable: updatedRow.receivable,
          payable: updatedRow.payable,
        };
        const response = await axiosInstance.put(
          `/invoices/${updatedRow._id}`,
          data
        );
        console.log("response", response.data);
      
        fetchData();
        setEditingRow(null);
        setEditedRowData({});
       
        setIsAddingRow(false);
        // setRows(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    } else if (isAddingSubRow) {
      console.log("editrow", updatedRow, rowId);
      try {
        let data = {
          subInvoice: [
            {
              receivable: updatedRow.receivable,
              payable: updatedRow.payable,
            },
          ],
        };
        const response = await axiosInstance.post(
          `/invoices/${rowId}/subinvoice`,
          data
        );

        console.log("responseaddsub", response.data);
        fetchData();
        setEditingSubRow(null);
        setEditedSubRowData({});
        setIsAddingSubRow(false);
        // setRows(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    } else if (editingSubRow) {
      console.log("editrow", updatedRow);
      try {
        let data = {
          receivable: updatedRow.receivable,
          payable: updatedRow.payable,
        };
        const response = await axiosInstance.put(
          `/invoices/subinvoice/${updatedRow._id}`,
          data
        );
        console.log("response", response.data);
        fetchData();
        setEditingSubRow(null);
      setEditedSubRowData({});
        // setRows(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    }
  };

  const deleteHandler=()=>{

  }

  const handleRowCancel = () => {
    setIsAddingRow(false);
    setIsAddingSubRow(false);
    setEditingRow(null);
    setEditingSubRow(null);
    setRows(initialRow);
    fetchData()
  };
  const handleEditRow = (row, isRow) => {
    setEditingRow(null);
    setEditedRowData({});
    setEditingSubRow(null);
    setEditedSubRowData({});
    setRows(initialRow);

    if (isRow == "row") {
      console.log("row", row);

      setEditingRow(row);
      setEditedRowData({ ...row });
    } else if (isRow == "subRow") {
      console.log("subrow", row);
      setEditingSubRow(row);
      setEditedSubRowData({ ...row });
    } else if (isRow == "addSubRow") {
      let data = {
        receivable: {
          rateName: "",
          invoiceDescription: "",
          rate: "",
          unit: "",
          amount: "",
        },
        payable: {
          payableDescription: "",
          rate: "",
          unit: "",
          amount: "",
          truck: "",
          PT_date: "",
        },
        _id: new Date().getTime(),
      };

      let newRows = rows;

      const newsubRow = [...newRows];
      newsubRow.forEach((item, index) => {
        if (item._id === row._id) {
          const subItem = item.subInvoice;
          subItem.push(data);

          newRows[index].subInvoice = subItem;
        }
      });

      setRows(newRows);
      setEditingSubRow(data);
      setEditedSubRowData(data);
      setIsAddingSubRow(true);
    }
    else{
      
      let data={
        receivable: {
          rateName: "",
          invoiceDescription: "",
          rate: "",
          unit: "",
          amount: "",
        },
        payable: {
          payableDescription: "",
          rate: "",
          unit: "",
          amount: "",
          truck: "",
          PT_date: "",
        },
        _id: new Date().getTime()
      }
      
      let newRows=rows
   
    //  const newsubRow=[...newRows]
     console.log("addrownew",newRows)
     newRows.push(data)
      
      setRows(newRows)
      setEditingRow(data);
      setEditedRowData(data);
      setIsAddingRow(true)
     
     
    }
  };
  const handleDeleteRow = async(invoiceId,from,subInvoiceId) => {
    handleRowCancel()
  
    if(from=="invoice"){
   
      try {
      
        // localhost:3000/invoices/6537515bfc7edf55be092cc2
        const response = await axiosInstance.delete(`/invoices/${invoiceId}`);
        console.log("response", response);
        fetchData()
        // SetInitialRow(response.data);
        // setRows(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
      
    }else if(from=="receivableRow"){
      try {
       
       
        const response = await axiosInstance.delete(`/invoices/receivable/${invoiceId}`);
        console.log("response", response);
        fetchData()
        // SetInitialRow(response.data);
        // setRows(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
      
    }
    else if(from =="subRowReceivable"){
      
      try {
        console.log(invoiceId,subInvoiceId,from)
        // localhost:3000/invoices/6537515bfc7edf55be092cc2
        const data={"receivable":true}
      //   const response = await axiosInstance.delete(`/invoices/${invoiceId}/subinvoice/${subInvoiceId}`,data);
      //   console.log("response", response.data);
      //  fetchData()
      } catch (error) {
        console.error("Error fetching employees:", error);
      }

    }
    else if(from =="payableRow"){
      try {
       
       
        const response = await axiosInstance.delete(`/invoices/payable/${invoiceId}`);
        console.log("response", response);
        fetchData()
       
      } catch (error) {
        console.error("Error fetching employees:", error);
      }

    }else if(from =="subRowPayable"){
      try {
        // localhost:3000/invoices/6537515bfc7edf55be092cc2
        // const response = await axiosInstance.get(`/invoices/${invoiceId}`);
        // console.log("response", response.data);
        // SetInitialRow(response.data);
        // setRows(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }

    }
    
  };
  const handleClose = () => {
    setResponse({message:"",severity:"success",open:false})
  };

  return (
    <Paper sx={{ width: "100%" }}>
      <TableContainer sx={{ maxHeight: "100vh" }}  >
        <Table stickyHeader aria-label="sticky table" size="small" sx={{ minWidth: 650 }} >
        <Snackbar open={response.open} autoHideDuration={3000} onClose={handleClose}       anchorOrigin={{ vertical: 'top', horizontal: 'center' }} >
        <MuiAlert elevation={6} variant="filled" severity={response.severity} onClose={handleClose}>
          {response.message}
        </MuiAlert>
      </Snackbar>
        
          <TableHead>
            <TableRow style={{
                    height: 33
                  }}>
              <TableCell align="start" colSpan={1}>
                Receivables
              </TableCell>
              <TableCell align="start" colSpan={5} >
           
                <IconButton
                  color="primary"
                  aria-label="Add"
                  
                  onClick={handleEditRow}
                  sx={{fontSize:12}}
                >
                 ADD ROW
                  <AddIcon />
                </IconButton>
              </TableCell>
              <TableCell align="start" colSpan={6}>
                Payables
              </TableCell>
            </TableRow>
            <TableRow style={{
                    height: 33
                  }}>
              <TableCell key="modify" style={{ top: 57, minWidth: 120 }}>
                Modify
              </TableCell>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ top: 57, minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
              {columns1.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ top: 57, minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
               <TableCell key="action" style={{ top: 57, minWidth: 150 }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
        
            {rows?.map((row) => {
              return (
                <React.Fragment key={row._id}>
                  <TableRow hover role="checkbox" tabIndex={-1} style={{
                    height: 33
                  }}>
                    {editingRow == row ? (
                      <TableCell>
                        <IconButton
                          color="primary"
                          aria-label="OK"
                          onClick={() => handleRowSubmit(editedRowData, "edit")}
                        >
                         <CheckCircleIcon/>
                        </IconButton>
                        <IconButton
                          color="secondary"
                          aria-label="Cancel"
                          onClick={handleRowCancel}
                        >
                         <CancelIcon/>
                        </IconButton>
                      </TableCell>
                    ) : (
                      <TableCell>
                        <IconButton color="primary" aria-label="Edit">
                          <EditIcon onClick={() => handleEditRow(row, "row")} />
                        </IconButton>
                        <IconButton color="secondary" aria-label="Delete">
                          <DeleteIcon  onClick={() => handleDeleteRow(row._id, "receivableRow")}/>
                        </IconButton>
                        <IconButton color="secondary" aria-label="AddSubRow">
                          <PetrolPumpIcon
                            onClick={() => handleEditRow(row, "addSubRow")}
                          />
                        </IconButton>
                      </TableCell>
                    )}
                    {columns.map((column) => (
                      <TableCell key={column.id} align={column.align}>
                          {editingRow?._id === row?._id ? (
                       
                          <input
                            type={column.type}
                            style={{width:"100px"}}
                            value={editedRowData?.receivable?.[column.id]}
                            onChange={(e) =>
                              setEditedRowData({
                                ...editedRowData,
                                receivable: {
                                  ...editedRowData.receivable,
                                  [column.id]: e.target.value,
                                },
                              })
                            }
                          />
                        ) : (
                          row?.receivable?.[column.id]
                        )}
                      </TableCell>
                    ))}
                    {columns1.map((column) => (
                      <>
                      <TableCell key={column.id} align={column.align}>
                         {editingRow?._id === row?._id ? (
                          <input
                            type={column.type}
                            style={{width:"100px"}}
                            value={editedRowData?.payable?.[column.id]}
                            onChange={(e) =>
                              setEditedRowData({
                                ...editedRowData,
                                payable: {
                                  ...editedRowData.payable,
                                  [column.id]: e.target.value,
                                },
                              })
                            }
                          />
                        ) : column.id == "PT_date" && row?.payable?.[column.id]? (
                          column.format(row?.payable?.[column.id])
                        ) : (
                          row?.payable?.[column.id]
                        )}
                      </TableCell>
                      
                     </>
                    ))}
                     <TableCell>
                       <IconButton color="primary" aria-label="Edit">
                         <PlaylistAddIcon
                           onClick={() => handleEditRow(row, "subRow")}
                         />
                       </IconButton>
                       <IconButton color="secondary" aria-label="Delete">
                         <DeleteIcon    onClick={() => handleDeleteRow(row?._id, "payableRow")} />
                       </IconButton>
                     </TableCell>
                  </TableRow>
                  {console.log("rowhere", row?.subInvoice)}
                  {row?.subInvoice?.map((subInv) => (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={subInv._id}
                      style={{
                       
                   
                        backgroundColor: '#eceff1', // Different background color for subinvoice rows
                      }}
                    >
                      {console.log("subhere", subInv)}
                      {editingSubRow == subInv ? (
                        <TableCell>
                          <IconButton
                            color="primary"
                            aria-label="OK"
                            onClick={() =>
                              handleRowSubmit(editedSubRowData, row._id)
                            }
                          >
                           <CheckCircleIcon/>
                          </IconButton>
                          <IconButton
                            color="secondary"
                            aria-label="Cancel"
                            onClick={handleRowCancel}
                          >
                            <CancelIcon/>
                          </IconButton>
                        </TableCell>
                      ) : (
                        <TableCell>
                          <IconButton color="primary" aria-label="Edit">
                            <EditIcon
                              onClick={() => handleEditRow(subInv, "subRow")}
                            />
                          </IconButton>
                          <IconButton color="secondary" aria-label="Delete">
                            <DeleteIcon   onClick={() => handleDeleteRow(row?._id, "subRowReceivable",subInv?._id)} />
                          </IconButton>
                        </TableCell>
                      )}
                      {columns.map((column) => (
                        <TableCell key={column.id} align={column.align}>
                          {editingSubRow?._id === subInv?._id ? (
                            <input
                              type={column.type}
                              value={editedSubRowData?.receivable?.[column.id]}
                              style={{width:"100px"}}
                              onChange={(e) =>
                                setEditedSubRowData({
                                  ...editedSubRowData,
                                  receivable: {
                                    ...editedSubRowData.receivable,
                                    [column.id]: e.target.value,
                                  },
                                })
                              }
                            />
                          ) : (
                            subInv?.receivable?.[column.id]
                          )}
                        </TableCell>
                      ))}
                      {columns1.map((column) => (
                        <TableCell key={column.id} align={column.align}>
                          {editingSubRow?._id === subInv?._id ? (
                            <input
                              type={column.type}
                              value={editedSubRowData?.payable?.[column.id]}
                              style={{width:"100px"}}
                              onChange={(e) =>
                                setEditedSubRowData({
                                  ...editedSubRowData,
                                  payable: {
                                    ...editedSubRowData.payable,
                                    [column.id]: e.target.value,
                                  },
                                })
                              }
                            />
                          ) : column.id == "PT_date" && subInv?.payable?.[column.id] ? (
                            column.format(subInv?.payable?.[column.id])
                          ) : (
                            subInv?.payable?.[column.id]
                          )}
                        </TableCell>
                      ))}
                      <TableCell>
                       <IconButton color="primary" aria-label="Edit">
                         <PlaylistAddIcon
                           onClick={() => handleEditRow(row, "subRow")}
                         />
                       </IconButton>
                       <IconButton color="secondary" aria-label="Delete">
                         <DeleteIcon    onClick={() => handleDeleteRow(row?._id, "subRowPayable",subInv?._id)} />
                       </IconButton>
                     </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              );
            })}
           
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default RateChargesComponent;
