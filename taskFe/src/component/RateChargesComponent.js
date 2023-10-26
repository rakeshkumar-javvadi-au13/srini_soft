import React, { useState, useEffect } from "react";
import { Table, Button, Space, Input, Popconfirm, message, DatePicker } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import axiosInstance from "../axiosInstance";



const { Column } = Table;

const RateChargesComponent = () => {

  const [receivables, setReceivables] = useState([]);
  const [payables, setPayables] = useState([]);


  const [newReceivableData, setNewReceivableData] = useState({});
  const [newPayableData, setNewPayableData] = useState({});
  const [rowKey, setRowKey] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get("/invoices"); 
      console.log("response", response.data);

      let receivableData = [];
      let payableData = [];
      response.data.map((item) => {
        const receivableSubRows=[]
        item?.subInvoice.map(subdata=>{
          receivableSubRows.push(subdata?.receviable)
        })
        const  payableSubRows=[]
        item?.subInvoice.map(subdata=>{
          payableSubRows.push(subdata?.payable)
        })

        receivableData.push({...item?.receviable,key:item?._id,children:receivableSubRows,
        });
        payableData.push({...item?.payable,key:item?._id,children:payableSubRows});
      });
      console.log("data", receivableData, payableData);
      setReceivables(receivableData || []);
      setPayables(payableData || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };
 


  const addRow = (table) => {
    console.log("table");
    if (table === "receivable") {
      const newKey = Date.now(); 
      setReceivables([...receivables, {key:newKey}]);
      setRowKey(newKey)
      
      setNewReceivableData({});
    } else if (table === "payable") {
      const newKey = Date.now(); 
      setPayables([...payables, {key:newKey}]);
      setRowKey(newKey)
      
      setNewPayableData({});
    } else {
      const newKey = Date.now(); 
      setReceivables([...receivables, {key:newKey}]);
      setPayables([...payables,{key:newKey}]);
      setRowKey(newKey)
     
      setNewPayableData({});
      setNewReceivableData({});
    }
  };
  const addChildRow=(record)=>{
    console.log("e",record.key)
    receivables.map(item=>{
      if(item.key==record.key){
       
      }
    })

  }
  const renderReceivableActions = (text, record, index) => {
    if (isEditing && rowKey == record.key) {
      return (
        <Space size="middle">
          <CheckOutlined onClick={() => handleSaveEdit(record.key)} />
          <CloseOutlined onClick={() => handleCancelEdit()} />
        </Space>
      );
    }
    if (rowKey == record.key) {
      return (
        <Space size="middle">
          <CheckOutlined onClick={() => handleSubmitRowData()} />
          <CloseOutlined onClick={() => handleCancelReceivable(index)} />
        </Space>
      );
    }
    

    return (
      <Space size="middle">
        <EditOutlined onClick={() => handleEdit(record)} />
        <Popconfirm
          title="Are you sure to delete this row?"
          onConfirm={() => handleDelete(receivables, setReceivables, record,"receviable")}
          okText="Yes"
          cancelText="No"
        >
          <DeleteOutlined/>
        </Popconfirm>
        <PlusCircleOutlined onClick={() => addChildRow(record)} />
      </Space>
    );
  };
  const renderPayableActions = (text, record) => {
    if (isEditing && rowKey == record._id) {
      return (
        <Space size="middle">
          <CheckOutlined onClick={() => handleSaveEdit(record.key)} />
          <CloseOutlined onClick={() => handleCancelEdit()} />
        </Space>
      );
    }
    return (
    <Space size="middle">
      <EditOutlined onClick={() => handleEditPayable(record)} />
      <Popconfirm
        title="Are you sure to delete this row?"
        onConfirm={() => handleDelete(payables, setPayables, record,"payable")}
        okText="Yes"
        cancelText="No"
      >
        <DeleteOutlined />
      </Popconfirm>
      <PlusCircleOutlined onClick={() => handleAdd(payables, setPayables)} />
    </Space>
    )
  };

  const handleEdit = (record) => {
 
    // Set the row data for editing
    console.log("key",record.key)
    setRowKey(record.key);
    setIsEditing(true)
   receivables.filter(item=>{
    if(item.key===record.key){
      setNewReceivableData(item)
    }
    })
   payables.filter(item=>{
    if(item.key===record.key){
    setNewPayableData(item)
    }

    })
  
  };

  const handleEditPayable=(record)=>{
    console.log("payablerecord",record)
    setRowKey(record._id);
    setIsEditing(true)
  }
  const handleSaveEdit = async(invoice_id) => {
    // save the edited data

    try {
      let data = { receviable: newReceivableData, payable: newPayableData };
      console.log("here",data)
      const response = await axiosInstance.put(`/invoices/${invoice_id}`, data); // Adjust the API route as needed
      console.log("response", response);
      message.success("Data submitted to receivables successfully");
    } catch (error) {
      console.error("Error fetching employees:", error);
    }

    // Implement data submission logic for the newly added row using axios
    // Show success message
    setNewReceivableData({});
    setNewPayableData({})
    setRowKey(null); // Clear editing state
    fetchData()
 
  };
  const handleCancelEdit = () => {
    setRowKey(null); // Clear editing state
  };


  const handleDelete = async(data, setData, record,from) => {
    console.log("data",data)
    console.log("setdata",setData)
    console.log("record",record)
    try {
     
      const response = await axiosInstance.delete(`/invoices/${from}/${record?.key}`); // Adjust the API route as needed
      console.log("response", response);
      message.success("Data submitted to receivables successfully");
      fetchData()
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
    
    // Implement delete logic
    // Remove the row from the data
    // setData(data.filter((item) => item !== record));
    console.log("Delete row:", record);
  };

  const handleAdd = (data, setData, record) => {
   
    // Implement add row logic
    // Add an empty row
    setData([...data, {}]);
  };
  const handleCancelReceivable = (index) => {
    
    setNewReceivableData({});
  };

  const handleSubmitRowData = async () => {
   
    try {
      let data = { receviable: newReceivableData, payable: newPayableData };
      const response = await axiosInstance.post("/invoices", data); // Adjust the API route as needed
      console.log("response", response);
      message.success("Data submitted to receivables successfully");
    } catch (error) {
      console.error("Error fetching employees:", error);
    }

    // Implement data submission logic for the newly added row using axios
    // Show success message

    // setAddingReceivable(false);
    setNewReceivableData({});
    setNewPayableData({})
    fetchData()
    // You can add actual data submission and updating logic here
  };

  const handleSubmit = async (data, setData, table) => {
    try {
      // Implement data submission logic here using axios
      // Example: const response = await axiosInstance.post('/invoices', data);

      // Show success message
      message.success(`Data submitted to ${table} successfully`);
      // Clear the data or update with the new data received from the backend
      // Example: setData(response.data);
    } catch (error) {
      // Handle error
      console.error("Error submitting data:", error);
      message.error(`Failed to submit data to ${table}`);
    }
  };
  const handleReceivableInputChange = (e, dataIndex, record, setState) => {
    // Update the newReceivableData with the input value
 
    const updatedData = { ...newReceivableData }; 
    updatedData[dataIndex] = e.target.value
 
    
    setNewReceivableData(updatedData);
  };
  const handlePayableInputChange = (e, dataIndex, record) => {
    // Update the newReceivableData with the input value
   
    // if (dataIndex === "PT_date") {
    //   // Handle date input
    //   const updatedData = {...newPayableData}; 
    //   updatedData[dataIndex] = e
      
    //   setNewPayableData[updatedData]
    // } else {

      const updatedData = { ...newPayableData }; 
      updatedData[dataIndex] = e.target.value
    setNewPayableData(updatedData);
  // };
}
// const MainSubRowTable = ({ data,showHeader }) => {
  const receivableColumns = [
    {
      title: "Actions",
      key: "actions",
      render: renderReceivableActions,
    },
    {
      title: "Rate Name",
      dataIndex: "rateName",
      key: "rateName",
      //   render: (text, record) => <Input value={record.rateName} readOnly />,
      render: (text, record) => {
        if (rowKey === record.key  ) {
          // Editing mode: Display an input field
          return (
            <Input
            // defaultValue={record.rateName}
              value={newReceivableData?.rateName}
              onChange={(e) => handleReceivableInputChange(e, 'rateName', record)}
            />
          );
        } else {
          // View mode: Display plain text
          return <span>{record.rateName}</span>;
        }
      },
     
    },

    {
      title: "Invoice Descr",
      dataIndex: "invoiceDescr",
      key: "invoiceDescr",
      render: (text, record) => {
        if (rowKey === record.key  ) {
          // Editing mode: Display an input field
          return (
            <Input
            // defaultValue={record.invoiceDescription}
            value={newReceivableData?.invoiceDescription}
              onChange={(e) => handleReceivableInputChange(e, 'invoiceDescription', record)}
            />
          );
        } else {
          // View mode: Display plain text
          return <span>{record.invoiceDescription}</span>;
        }
      },
     
    },

    {
      title: " Rate",
      dataIndex: "rate",
      key: "rate",
      render: (text, record) => {
        if (rowKey === record.key) {
          // Editing mode: Display an input field
          return (
            <Input
            // defaultValue={record.rate}
            value={newReceivableData?.rate}
           
              onChange={(e) => handleReceivableInputChange(e, 'rate', record)}
            />
          );
        } else {
          // View mode: Display plain text
          return <span>{record.rate}</span>;
        }
      },
   
    },

    {
      title: "Unit",
      dataIndex: "unit",
      key: "unit",
      render: (text, record) => {
        if (rowKey === record.key ) {
          // Editing mode: Display an input field
          return (
            <Input
            defaultValue={record.unit}
            value={newReceivableData?.unit}
              onChange={(e) => handleReceivableInputChange(e, 'unit', record)}
            />
          );
        } else {
          // View mode: Display plain text
          return <span>{record.unit}</span>;
        }
      },
    },

    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (text, record ) => {
        if (rowKey === record.key ) {
          // Editing mode: Display an input field
          return (
            <Input
            defaultValue={record.amount}
            value={newReceivableData?.amount}
            
              onChange={(e) => handleReceivableInputChange(e, 'amount', record)}
            />
          );
        } else {
          // View mode: Display plain text
          return <span>{record.amount}</span>;
        }
      },
  
    },
  ];

  const payableColumns = [
    {
      title: "Payment Desc",
      dataIndex: "paymentDesc",
      key: "paymentDesc",
      render: (text, record) => {
        if (rowKey === record.key || rowKey === record._id ) {
          // Editing mode: Display an input field
          return (
            <Input
            defaultValue={record.payableDescription}
            value={newPayableData?.payableDescription}
       
              onChange={(e) => handlePayableInputChange(e, 'payableDescription', record)}
            />
          );
        } else {
          // View mode: Display plain text
          return <span>{record.payableDescription}</span>;
        }
      },
     
    },

    {
      title: "Rate",
      dataIndex: "rate",
      key: "rate",
      render: (text, record) => {
        if (rowKey === record.key || rowKey === record._id ) {
          // Editing mode: Display an input field
          return (
            <Input
            defaultValue={record.rate}
            value={newPayableData?.rate}
           
              onChange={(e) => handlePayableInputChange(e, 'rate', record)}
            />
          );
        } else {
          // View mode: Display plain text
          return <span>{record.rate}</span>;
        }
      },
    
    },

    {
      title: "Unit",
      dataIndex: "unit",
      key: "unit",
      render: (text, record) => {
        if (rowKey === record.key || rowKey === record._id ) {
          // Editing mode: Display an input field
          return (
            <Input
            defaultValue={record.unit}
            value={newPayableData?.unit}
             
              onChange={(e) => handlePayableInputChange(e, 'unit', record)}
            />
          );
        } else {
          // View mode: Display plain text
          return <span>{record.unit}</span>;
        }
      },
     
    },

    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (text, record) => {
        if (rowKey === record.key || rowKey === record._id ) {
          // Editing mode: Display an input field
          return (
            <Input
            defaultValue={record.amount}
            value={newPayableData?.amount}
              onChange={(e) => handlePayableInputChange(e, 'amount', record)}
            />
          );
        } else {
          // View mode: Display plain text
          return <span>{record.amount}</span>;
        }
      },
      
    },

    {
      title: "Truck",
      dataIndex: "truck",
      key: "truck",
      render: (text, record) => {
        if (rowKey === record.key || rowKey === record._id ) {
          // Editing mode: Display an input field
          return (
            <Input
            defaultValue={record.truck}
            value={newPayableData?.truck}
              onChange={(e) => handlePayableInputChange(e, 'truck', record)}
            />
          );
        } else {
          // View mode: Display plain text
          return <span>{record.truck}</span>;
        }
      },
     
    },
    {
      title: "PT Date",
      dataIndex: "ptDate",
      key: "ptDate",
      render: (text, record) => {
        if (rowKey === record.key || rowKey === record._id ) {
          return (
            <Input
              type="date"
              defaultValue={record.PT_date}
              value={newPayableData.PT_date }
              readOnly={!isEditing && record.editing}
              onChange={(e) => handlePayableInputChange(e, "PT_date", record)}
            />
          );
          
        } else {
          const date = new Date(record?.PT_date);
          const day = date.getUTCDate().toString().padStart(2, "0");
          const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
          const year = date.getUTCFullYear();
          return record?.PT_date?(<span>{day}/{month}/{year}</span>):null;
         
        }
      },
    },
   
    
    {
      title: "Actions",
      key: "actions",
      render: renderPayableActions,
    },
  ];
  const handleAddSubRow = (mainRowIndex) => {
    console.log(mainRowIndex)
    // const newData = [...data];
    // newData[mainRowIndex].subrows.push({
    //   rateName: '', // Provide default values
    //   invoiceDescription: '',
    //   rate: 0,
    //   unit: 0,
    //   amount: 0,
    //   _id: 'newSubRow', // Use a temporary ID for the new subrow
    // });
    // setData(newData);
  };
 
  

  return (
    <div>
      <div style={{ display: "flex" }}>
        <div style={{ flex: 1 }}>
          <Button>Receivable</Button>
          <Button onClick={() => addRow()}>Add Row</Button>
          <Table dataSource={receivables} pagination={false} >
            {receivableColumns.map((column) => (
              <Column {...column} key={column.key}  />
            ))}
          </Table>
         
          <div>
      
    </div>
        </div>
        <div style={{ flex: 1 }}>
          <Button>Payable</Button>
          <Table dataSource={payables}  pagination={false} >
            {payableColumns.map((column) => (
              <Column {...column} key={column.key} />
            ))}
          </Table>
        </div>
      </div>
      
    </div>
  );
};

export default RateChargesComponent ;


