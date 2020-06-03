import React from "react";
import Axios from "axios";
import { API_URL } from "../constants/API";
import ButtonUI from "../components/Button/Button";

class mainToDoList extends React.Component {
  // state = {
  //     mainToDoList:[]
  // }

  // getMainToDoList = () => {
  //         Axios.get(`${API_URL}/mainToDos`, {
  //           params: {
  //             status: "pending",
  //             _embed: "subToDo",
  //           },
  //         })
  //           .then((res) => {
  //             console.log(res.data);
  //             this.setState({ mainToDoList: res.data });
  //           })
  //           .catch((err) => {
  //             console.log(err);
  //           });
  //       };
  //      renderToDoList = () => {
  //          return this.state.mainToDoList.map((val) => {
  //              return(
  //                  <>
  //                  <tr>
  //              <td> {val.id}</td>
  //              <td>{val.status}</td>
  //                  </tr>
  //                  </>
  //              )
  //          })
  //      }

  //      render(){
  //          return(
  //              <div className="container">
  //                  <div className ="row">
  //                      <div className = "col-12">
  //                          <caption className="p-3">
  //                              <h2>ToDoList</h2>
  //                          </caption>
  //                          <div className="d-flex flex-row ml-3 mb-3">
  //           <ButtonUI
  //               className={`auth-screen-btn ${
  //                 this.state.paymentStatus == "pending" ? "active" : null
  //               }`}
  //               type="outlined"
  //               onClick={() => this.setState({ paymentStatus: "pending" })}
  //             >
  //               On Going
  //             </ButtonUI>
  //             <ButtonUI
  //               className={`ml-3 auth-screen-btn ${
  //                 this.state.paymentStatus == "completed" ? "active" : null
  //               }`}
  //               type="outlined"
  //               onClick={() => this.setState({ paymentStatus: "completed" })}
  //             >
  //               Done
  //             </ButtonUI>
  //           </div>
  //           <table className="dashboard-table">
  //              <thead>
  //                <tr>
  //                  <th>To Do List </th>
  //                  {this.state.paymentStatus === "pending" ? (
  //                   <th>To Do List</th>
  //                 ) : null}
  //               </tr>
  //             </thead>
  //             <tbody>{this.renderToDoList()}</tbody>
  //           </table>
  //                      </div>

  //                  </div>

  //              </div>
  //          )
  //      }
  state = {
    toDoList: [],
  };
  getToDo = () => {
    Axios.get(`${API_URL}/toDos`)
      .then((res) => {
        console.log(res);
        this.setState({ toDoList: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  renderTodoList = () => {
    this.state.toDoList.map((val, idx) => {
      return (
        <>
          <tr>
            <td>{val.todoName}</td>
            <td>
              <ButtonUI>Check</ButtonUI>
            </td>
          </tr>
        </>
      );
    });
  };
  componentDidMount() {
    this.getToDo();
  }
  checkButtonHandler = () => {
    Axios.post(`${API_URL}todoList`, {
      ...this.state.toDoList,
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  render() {
    return (
      <div>
        <h2>To Do List</h2>
        <table className="ml-5">
          <thead>
            <tr>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{this.renderTodoList()}</tbody>
        </table>
      </div>
    );
  }
}
export default mainToDoList;
