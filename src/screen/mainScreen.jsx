import React from "react";
import "./mainscreen.css"
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import Axios from "axios";
import { API_URL } from "../constants/API";
import ButtonUI from "../components/Button/Button";
import TextField from "../components/TextField/TextField";
import swal from "sweetalert";

class mainscreen extends React.Component{
state ={
    mainToDoList:[],
    createToDoList :{
        toDoList:"",
        toDoName:""
    },
    editToDoList:{
        id:0,
        toDoList:"",
        toDoName:""

    },
    activeProducts:[],
    modalOpen:false
}
getMainToDoList =() => {
    Axios.get(`${API_URL}/mainToDo`)
      .then((res) => {
        this.setState({ productList: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
}
deleteHandler = (id) => {
    Axios.delete(`${API_URL}/mainToDo/${id}`)
      .then((res) => {
        console.log(res);
        this.getProductList();
      })
      .catch((err) => {
        console.log("gagal");
      });
  };
  editBtnHandler = (idx) => {
    this.setState({
      editToDoList: {
        ...this.state.mainToDoList[idx],
      },
      modalOpen: true,
    });
  };
  renderMainToDoList = () => {
      return this.mainToDoList.map((val,idx) => {
          const {id} = val
          return (
              <>
              <tr
            onClick={() => {
              if (this.state.activeProducts.includes(idx)) {
                this.setState({
                  activeProducts: [
                    ...this.state.activeProducts.filter((item) => item !== idx),
                  ],
                });
              } else {
                this.setState({
                  activeProducts: [...this.state.activeProducts, idx],
                });
              }
            }}
          >
              <td> {id} </td>
        <td>{toDoName}</td>
          </tr>
          <tr
            className={`collapse-item ${
              this.state.activeProducts.includes(idx) ? "active" : null
            }`}
          >
               <td className="" colSpan={2}>
               <div className="d-flex justify-content-around align-items-center">
               <div className="d-flex">
        <h5>{toDoName}</h5>
                   
                   </div>
                   <div className="d-flex flex-column align-items-center">
                   <ButtonUI
                    onClick={(_) => this.editBtnHandler(idx)}
                    type="contained"
                  >
                    Edit
                  </ButtonUI>
                  <ButtonUI
                    onClick={() => this.deleteHandler(idx)}
                    className="mt-3"
                    type="textual"
                  >
                    Delete
                  </ButtonUI> 
                   </div>
                   </div>
               </td>
          </tr>
              </>
          )
      })
  }
}

export default mainscreen