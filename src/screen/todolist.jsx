import React from "react";
import "./todo.css";
import { Modal, ModalHeader, ModalBody, Table } from "reactstrap";
import Axios from "axios";
import { API_URL } from "../constants/API";
import ButtonUI from "../components/Button/Button";
import TextField from "../components/TextField/TextField";

import swal from "sweetalert";

class Todo extends React.Component {
  state = {
    mainTodoList: [],
    subTodoList: [],
    tempList: [],
    createForm: {
      mainTodoName: "",
      status: "ongoing",
    },
    createSubForm: {
      subTodoName: "",
      status: "ongoing",
      mainId: 0,
    },
    activeProducts: [],
    modalOpen: false,
  };

  getMainTodoList = () => {
    Axios.get(`${API_URL}/mainTodos`)
      .then((res) => {
        this.setState({ mainTodoList: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getSubTodoList = () => {
    Axios.get(`${API_URL}/subTodos`)
      .then((res) => {
        this.setState({ subTodoList: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  renderMainTodoList = () => {
    return this.state.mainTodoList.map((val, idx) => {
      const { id, mainTodoName, status } = val;
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
            <td> {mainTodoName} </td>
            <td> {status} </td>
            <td>
              <ButtonUI
                onClick={() => this.checkBtnHandler(id)}
                type="contained"
              >
                Check
              </ButtonUI>
            </td>
            <td>
              <ButtonUI
                onClick={() => this.subTodoHandler(id)}
                className="mt-3"
                type="textual"
              >
                Sub Todo
              </ButtonUI>
            </td>
            <td>
              <ButtonUI
                onClick={() => this.deleteMainHandler(id)}
                className="mt-3"
                type="textual"
              >
                Delete
              </ButtonUI>
            </td>
          </tr>
        </>
      );
    });
  };

  inputHandler = (e, field, form) => {
    let { value } = e.target;
    this.setState({
      [form]: {
        ...this.state[form],
        [field]: value,
      },
    });
  };

  addTodo = () => {
    Axios.post(`${API_URL}/mainTodos`, this.state.createForm)
      .then((res) => {
        swal("Success", "Your items has been added to the list", "success");
        this.getMainTodoList();
        this.setState({
          createForm: {
            ...this.state.createForm,
            mainTodoName: "",
          },
        });
        this.getMainTodoList();
      })
      .catch((err) => {
        swal("Error!", "Your item could not be added to the list", "error");
      });
  };

  addSubTodo = () => {
    Axios.post(`${API_URL}/subTodos`, this.state.createSubForm)
      .then((res) => {
        swal("Success", "Your items has been added to the list", "success");
        this.getSubTodoList();
        this.setState({
          createSubForm: {
            ...this.state.createSubForm,
            subTodoName: "",
            // status:""
          },
        });
        this.getSubTodoList();
      })
      .catch((err) => {
        swal("Error!", "Your item could not be added to the list", "error");
      });
  };

  checkBtnHandler = (id) => {
    Axios.patch(`${API_URL}/mainTodos/${id}`, {
      status: "done",
    })
      .then((res) => {
        Axios.get(`${API_URL}/subTodos`, {
          params: {
            mainId: id,
          },
        })
          .then((res) => {
            res.data.map((val) => {
              return this.checkSubHandler(val.id);
            });
          })
          .catch((err) => {
            console.log(err);
          });
        this.getMainTodoList();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  checkSubHandler = (idx) => {
    Axios.patch(`${API_URL}/subTodos/${idx}`, {
      status: "done",
    })
      .then((res) => {
        console.log(res);
        this.getSubTodoList();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  editProductHandler = () => {
    Axios.put(
      `${API_URL}/products/${this.state.editForm.id}`,
      this.state.editForm
    )
      .then((res) => {
        swal("Success!", "Your item has been edited", "success");
        this.setState({ modalOpen: false });
        this.getMainTodoList();
      })
      .catch((err) => {
        swal("Error!", "Your item could not be edited", "error");
        console.log(err);
      });
  };

  deleteMainHandler = (id) => {
    Axios.delete(`${API_URL}/mainTodos/${id}`)
      .then((res) => {
        Axios.get(`${API_URL}/subTodos`, {
          params: {
            mainId: id,
          },
        })
          .then((res) => {
            this.setState({ tempList: res.data });
            console.log(res.data);
            res.data.map((val) => {
              return this.deleteSubHandler(val.id);
            });
          })
          .catch((err) => {
            console.log(err);
          });
        this.getMainTodoList();
      })
      .catch((err) => {
        console.log("gagal");
      });

    console.log(id);
  };

  deleteSubHandler = (id) => {
    Axios.delete(`${API_URL}/subTodos/${id}`)
      .then((res) => {
        console.log(res);
        this.getSubTodoList();
      })
      .catch((err) => {
        console.log("gagal");
      });
  };

  toggleModal = () => {
    this.setState({ modalOpen: !this.state.modalOpen });
  };

  subTodoHandler = (idx) => {
    this.setState({
      createSubForm: {
        mainId: idx,
        status:"ongoing"
      },
      modalOpen: true,
    });
  };

  renderSub = () => {
    const { subTodoList } = this.state;
    let totalPrice;
    return subTodoList.map((val, idx) => {
      const { subTodoName, status, id, mainId } = val;
      return (
        <>
          <tr>
            <td>{idx + 1}</td>
            <td>{subTodoName}</td>
            <td>{status}</td>
            <td>
              <ButtonUI
                onClick={() => this.checkSubHandler(id)}
                className="mt-3"
                type="textual"
              >
                Check
              </ButtonUI>
            </td>
            <td>
              <ButtonUI
                onClick={() => this.deleteSubHandler(id)}
                className="mt-3"
                type="textual"
              >
                Delete
              </ButtonUI>
            </td>
          </tr>
        </>
      );
    });
  };

  componentDidMount() {
    this.getMainTodoList();
    this.getSubTodoList();
  }

  render() {
    return (
      <div className="container py-4">
        <div className="dashboard">
          <caption className="p-3">
            <h2>TODO</h2>
          </caption>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Status</th>
                <th colSpan={2} className="text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>{this.renderMainTodoList()}</tbody>
          </table>
        </div>
        <div className="dashboard-form-container p-4">
          <caption className="mb-4 mt-2">
            <h2>Add TODO</h2>
          </caption>
          <div className="row">
            <div className="col-8">
              <TextField
                value={this.state.createForm.mainTodoName}
                placeholder="Main Todo Name"
                onChange={(e) =>
                  this.inputHandler(e, "mainTodoName", "createForm")
                }
              />
            </div>
            <div className="col-3 mt-3">
              <ButtonUI onClick={this.addTodo} type="contained">
                Add Todo
              </ButtonUI>
            </div>
          </div>
        </div>
        <Modal
          toggle={this.toggleModal}
          isOpen={this.state.modalOpen}
          size="lg"
          centered
        >
          <ModalHeader toggle={this.toggleModal}>
            <caption>
              <h3>Sub Todo</h3>
            </caption>
          </ModalHeader>
          <ModalBody>
            <div className="row d-flex justify-content-center">
              <div className="col-12 align-items-center">
                <Table centered className="mt-3">
                  <thead>
                    <th>No.</th>
                    <th>Sub Todo Name</th>
                    <th>Status</th>
                  </thead>
                  <tbody>{this.renderSub()}</tbody>
                </Table>
              </div>

              <div className="row">
                <div className="col-8">
                  <TextField
                    value={this.state.createSubForm.subTodoName}
                    placeholder="Sub Todo Name"
                    onChange={(e) =>
                      this.inputHandler(e, "subTodoName", "createSubForm")
                    }
                  />
                </div>
                <div className="col-3 mt-3">
                  <ButtonUI onClick={this.addSubTodo} type="contained">
                    Add Sub Todo
                  </ButtonUI>
                </div>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default Todo;