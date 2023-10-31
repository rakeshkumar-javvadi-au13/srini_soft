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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const columns = [
  {
    id: "rateName",
    label: "Rate Name",
    minWidth: 120,
    type: "text",
    align: "left",
  },
  {
    id: "invoiceDescription",
    label: "Invoice Descr",
    minWidth: 120,
    align: "left",
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
];
const columns1 = [
  {
    id: "payableDescription",
    label: "Payable Descr",
    minWidth: 120,
    align: "left",
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
  const [rows, setRows] = useState([]);

  const [response, setResponse] = useState({
    message: "",
    severity: "success",
    open: false,
  });

  const [editingRow, setEditingRow] = useState(null);
  const [editedRowData, setEditedRowData] = useState({});
  const [editingSubRow, setEditingSubRow] = useState(null);
  const [editedSubRowData, setEditedSubRowData] = useState({});
  const [isAddingRow, setIsAddingRow] = useState(false);
  const [isAddingSubRow, setIsAddingSubRow] = useState(false);
 

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

     
      setRows(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleRowSubmit = async (updatedRow, rowId) => {
    try {
      if (isAddingRow) {
        const data = {
          receivable: updatedRow.receivable,
          payable: updatedRow.payable,
        };
        const response = await axiosInstance.post("/invoices", data);
        handleCommonSuccess(response, "Row has been added");
      } else if (editingRow) {
        const data = {
          receivable: updatedRow.receivable,
          payable: updatedRow.payable,
        };
        const response = await axiosInstance.put(
          `/invoices/${updatedRow._id}`,
          data
        );
        handleCommonSuccess(response, "Row has been edited");
      } else if (isAddingSubRow) {
        const data = {
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
        handleCommonSuccess(response, "SubRow has been added");
      } else if (editingSubRow) {
        const data = {
          receivable: updatedRow.receivable,
          payable: updatedRow.payable,
        };
        const response = await axiosInstance.put(
          `/invoices/subinvoice/${updatedRow._id}`,
          data
        );
        handleCommonSuccess(response, "Sub Row has been updated");
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      setResponse({ message: error.message, severity: "error", open: true });
    }
  };

  const handleCommonSuccess = (response, successMessage) => {
    console.log("response", response);
    fetchData();
    resetEditingState();
    setResponse({ message: successMessage, severity: "success", open: true });
  };

  const resetEditingState = () => {
    setEditingRow(null);
    setEditingSubRow(null);
    setEditedRowData({});
    setEditedSubRowData({});
    setIsAddingRow(false);
    setIsAddingSubRow(false);
  };

  const handleRowCancel = () => {
    setIsAddingRow(false);
    setIsAddingSubRow(false);
    setEditingRow(null);
    setEditingSubRow(null);
   
    fetchData();
  };
  const handleEdit_AddRow = (row, isRow) => {
    // Reset editing states
    setEditingRow(null);
    setEditedRowData({});
    setEditingSubRow(null);
    setEditedSubRowData({});
   

    if (isRow === "row") {
  
      setEditingRow(row);
      setEditedRowData({ ...row });
    } else if (isRow === "subRow") {
     
      setEditingSubRow(row);
      setEditedSubRowData({ ...row });
    } else if (isRow === "addSubRow") {
      const newRow = initializeData();
      newRow._id = new Date().getTime();
      const newRows = updateRowInRows(rows, row._id, newRow);

      setRows(newRows);
      setEditingSubRow(newRow);
      setEditedSubRowData(newRow);
      setIsAddingSubRow(true);
    } else {
      const newRow = initializeData();
      newRow._id = new Date().getTime();
      const newRows = [...rows, newRow];

      setRows(newRows);
      setEditingRow(newRow);
      setEditedRowData(newRow);
      setIsAddingRow(true);
    }
  };

  const initializeData = () => ({
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
  });

  const updateRowInRows = (rows, parentId, newRow) => {
    return rows.map((row) => {
      if (row._id === parentId) {
        row.subInvoice.push(newRow);
      }
      return row;
    });
  };

  const handleDeleteRow = async (invoiceId, from, subInvoiceId) => {
    handleRowCancel();

    try {
      let url, data;
      switch (from) {
        case "invoice":
          url = `/invoices/${invoiceId}`;
          break;
        case "receivableRow":
          url = `/invoices/receivable/${invoiceId}`;
          break;
        case "subRowReceivable":
          url = `/invoices/${invoiceId}/subinvoice/${subInvoiceId}`;
          data = { text: "receivable" };
          break;
        case "payableRow":
          url = `/invoices/payable/${invoiceId}`;
          break;
        case "subRowPayable":
          url = `/invoices/${invoiceId}/subinvoice/${subInvoiceId}`;
          data = { text: "payable" };
          break;
        default:
          console.error('Invalid "from" value');
          return;
      }

      const response = await axiosInstance.delete(url, { data });

      console.log("response", response);
      fetchData();
     
    } catch (error) {
      console.error("Error deleting row:", error);
    }
  };
  const handleClose = () => {
    setResponse({ message: "", severity: "success", open: false });
  };

  return (
    <Paper sx={{ width: "100%" }}>
      <TableContainer sx={{ maxHeight: "100vh" }}>
        <Table
          stickyHeader
          aria-label="sticky table"
          size="small"
          sx={{ minWidth: 650 }}
        >
          <Snackbar
            open={response.open}
            autoHideDuration={3000}
            onClose={handleClose}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <MuiAlert
              elevation={6}
              variant="filled"
              severity={response.severity}
              onClose={handleClose}
            >
              {response.message}
            </MuiAlert>
          </Snackbar>

          <TableHead>
            <TableRow
              style={{
                height: 33,
              }}
            >
              <TableCell align="start" colSpan={1}>
                Receivables
              </TableCell>
              <TableCell align="start" colSpan={5}>
                <IconButton
                  color="primary"
                  aria-label="Add"
                  onClick={handleEdit_AddRow}
                  sx={{ fontSize: 12 }}
                >
                  ADD ROW
                  <AddIcon />
                </IconButton>
              </TableCell>
              <TableCell align="start" colSpan={8}>
                Payables
              </TableCell>
            </TableRow>
            <TableRow
              style={{
                height: 33,
              }}
            >
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
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    style={{
                      height: 33,
                    }}
                  >
                    {editingRow == row ? (
                      <TableCell>
                        <IconButton
                          color="primary"
                          aria-label="OK"
                          onClick={() => handleRowSubmit(editedRowData, "edit")}
                        >
                          <CheckCircleIcon />
                        </IconButton>
                        <IconButton
                          color="secondary"
                          aria-label="Cancel"
                          onClick={handleRowCancel}
                        >
                          <CancelIcon />
                        </IconButton>
                      </TableCell>
                    ) : (
                      <TableCell>
                        <IconButton color="primary" aria-label="Edit">
                          <EditIcon
                            onClick={() => handleEdit_AddRow(row, "row")}
                          />
                        </IconButton>
                        <IconButton color="secondary" aria-label="Delete">
                          <DeleteIcon
                            onClick={() =>
                              handleDeleteRow(row._id, "receivableRow")
                            }
                          />
                        </IconButton>
                        <IconButton color="secondary" aria-label="AddSubRow">
                          <PetrolPumpIcon
                            onClick={() => handleEdit_AddRow(row, "addSubRow")}
                          />
                        </IconButton>
                      </TableCell>
                    )}
                    {columns.map((column) => (
                      <TableCell key={column.id} align={column.align}>
                        {editingRow?._id === row?._id ? (
                          <input
                            type={column.type}
                            style={{ width: "100px" }}
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
                              style={{ width: "100px" }}
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
                          ) : column.id == "PT_date" &&
                            row?.payable?.[column.id] ? (
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
                          onClick={() => handleEdit_AddRow(row, "subRow")}
                        />
                      </IconButton>
                      <IconButton color="secondary" aria-label="Delete">
                        <DeleteIcon
                          onClick={() =>
                            handleDeleteRow(row?._id, "payableRow")
                          }
                        />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                 
                  {row?.subInvoice?.map((subInv) => (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={subInv._id}
                      style={{
                        backgroundColor: "#eceff1", // Different background color for subinvoice rows
                      }}
                    >
                    
                      {editingSubRow == subInv ? (
                        <TableCell>
                          <IconButton
                            color="primary"
                            aria-label="OK"
                            onClick={() =>
                              handleRowSubmit(editedSubRowData, row._id)
                            }
                          >
                            <CheckCircleIcon />
                          </IconButton>
                          <IconButton
                            color="secondary"
                            aria-label="Cancel"
                            onClick={handleRowCancel}
                          >
                            <CancelIcon />
                          </IconButton>
                        </TableCell>
                      ) : (
                        <TableCell>
                          <IconButton color="primary" aria-label="Edit">
                            <EditIcon
                              onClick={() =>
                                handleEdit_AddRow(subInv, "subRow")
                              }
                            />
                          </IconButton>
                          <IconButton color="secondary" aria-label="Delete">
                            <DeleteIcon
                              onClick={() =>
                                handleDeleteRow(
                                  row?._id,
                                  "subRowReceivable",
                                  subInv?._id
                                )
                              }
                            />
                          </IconButton>
                        </TableCell>
                      )}
                      {columns.map((column) => (
                        <TableCell key={column.id} align={column.align}>
                          {editingSubRow?._id === subInv?._id ? (
                            <input
                              type={column.type}
                              value={editedSubRowData?.receivable?.[column.id]}
                              style={{ width: "100px" }}
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
                              style={{ width: "100px" }}
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
                          ) : column.id == "PT_date" &&
                            subInv?.payable?.[column.id] ? (
                            column.format(subInv?.payable?.[column.id])
                          ) : (
                            subInv?.payable?.[column.id]
                          )}
                        </TableCell>
                      ))}
                      <TableCell>
                        <IconButton color="primary" aria-label="Edit">
                          <PlaylistAddIcon
                            onClick={() => handleEdit_AddRow(row, "subRow")}
                          />
                        </IconButton>
                        <IconButton color="secondary" aria-label="Delete">
                          <DeleteIcon
                            onClick={() =>
                              handleDeleteRow(
                                row?._id,
                                "subRowPayable",
                                subInv._id
                              )
                            }
                          />
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
