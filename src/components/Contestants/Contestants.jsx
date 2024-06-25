import React, { useEffect, useState } from "react";
import apiContestantInstance from "../../service/api-contestant";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { FaEllipsisV } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import moment from "moment";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { FaEnvelope, FaRegBell, FaSearch } from "react-icons/fa";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Button } from "antd";

const Contestants = () => {
  const [newContestant, setNewContestant] = useState(null);
  const [listContestant, setListContestant] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedContestant, setSelectedContestant] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openAdding, setOpenAdding] = React.useState(false);
  const itemPerPage = 6;
  const [totalPages, setTotalPage] = useState(5);
  const [valueSearch, setValueSearch] = useState("");

  useEffect(() => {
    apiContestantInstance
      .get("/total")
      .then((response) => {
        setTotalPage(Math.ceil(response.data / itemPerPage));
      })
      .catch((error) => {
        console.error(error);
      });
    apiContestantInstance
      .get("/contestants?page=" + (currentPage - 1) + "&size=" + itemPerPage)
      .then((response) => {
        setListContestant(response.data.data);

        //setTotalPage(Math.ceil(response.data.payload.length / itemPerPage));
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  const handleRowClick = (match) => {
    setSelectedContestant(match);
    setIsEditing(false);
  };
  const handleEditToggle = () => {
    if (selectedContestant != null) {
      setIsEditing(!isEditing);
    }
  };

  const handleAddInput = (e) => {
    setNewContestant({
      ...newContestant,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddingNew = (e) => {
    e.preventDefault();

    apiContestantInstance
      .post("/contestant", {
        studentId: newContestant.studentId,
        coachId: newContestant.coachId,
        teamId: newContestant.teamId,
        status: "ACTIVE",
      })
      .then((response) => {
        setOpenAdding(false);
        setNewContestant(null);
        apiContestantInstance
          .get(
            "/contestants?page=" + (currentPage - 1) + "&size=" + itemPerPage
          )
          .then((response) => {
            setListContestant(response.data.data);

            //setTotalPage(Math.ceil(response.data.payload.length / itemPerPage));
          })
          .catch((error) => {
            console.error(error);
          });
        apiContestantInstance
          .get("/total")
          .then((response) => {
            setTotalPage(Math.ceil(response.data / itemPerPage));
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleAddToggle = () => {
    setIsAdding(!isAdding);
  };

  const handlePageChange = async (event, newPage) => {
    setCurrentPage(newPage);
    await apiContestantInstance
      .get("/contestants?page=" + (newPage - 1) + "&size=" + itemPerPage)
      .then((response) => {
        console.log(response.data.data);
        setListContestant(response.data.data);

        //setTotalPage(Math.ceil(response.data.payload.length / itemPerPage));
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const handleDeleteItem = () => {
    console.log("Delete item");
    setOpenDelete(true);
  };

  const handleChangeInput = (e) => {
    setSelectedContestant({
      ...selectedContestant,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);

    var studentTMP = 0;
    var coachTMP = 0;
    var teamTMP = 0;

    if (selectedContestant.student.id) {
      studentTMP = selectedContestant.student.id;
    } else {
      studentTMP = selectedContestant.student;
    }

    if (selectedContestant.coach.id) {
      coachTMP = selectedContestant.coach.id;
    } else {
      coachTMP = selectedContestant.coach;
    }

    if (selectedContestant.team.id) {
      teamTMP = selectedContestant.team.id;
    } else {
      teamTMP = selectedContestant.team;
    }

    apiContestantInstance
      .put("/contestant/" + selectedContestant.id, {
        studentId: studentTMP,
        coachId: coachTMP,
        teamId: teamTMP,
        status: "ACTIVE",
      })
      .then((response) => {
        console.log(response.data);
        apiContestantInstance
          .get(
            "/contestants?page=" + (currentPage - 1) + "&size=" + itemPerPage
          )
          .then((response) => {
            setListContestant(response.data.data);

            //setTotalPage(Math.ceil(response.data.payload.length / itemPerPage));
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleClose = () => {
    apiContestantInstance
      .put("/contestant-status/" + selectedContestant.id)
      .then((response) => {
        apiContestantInstance
          .get(
            "/contestants?page=" + (currentPage - 1) + "&size=" + itemPerPage
          )
          .then((response) => {
            setListContestant(response.data.data);
            apiContestantInstance
              .get("/total")
              .then((response) => {
                setTotalPage(Math.ceil(response.data / itemPerPage));
              })
              .catch((error) => {
                console.error(error);
              });
            //setTotalPage(Math.ceil(response.data.payload.length / itemPerPage));
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });

    setOpenDelete(false);
  };
  const handleClickOpenAdding = () => {
    setOpenAdding(true);
  };

  const handleCloseAdding = () => {
    setOpenAdding(false);
  };
  const handleInput = (e) => {
    setValueSearch(e.target.value);
  };

  const handleSearch = () => {
    if (valueSearch == "") {
      apiContestantInstance
        .get("/contestants?page=" + (currentPage - 1) + "&size=" + itemPerPage)
        .then((response) => {
          setListContestant(response.data.data);
          apiContestantInstance
            .get("/total")
            .then((response) => {
              setTotalPage(Math.ceil(response.data / itemPerPage));
            })
            .catch((error) => {
              console.error(error);
            });
          //setTotalPage(Math.ceil(response.data.payload.length / itemPerPage));
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      apiContestantInstance
        .get("/getByName?name=" + valueSearch)
        .then((response) => {
          setListContestant(response.data.data.Contestants);
          setTotalPage(1);
        })
        .catch((error) => {
          setListContestant([]);
          setTotalPage(0);
        });
    }
  };
  return (
    <div className="pt-[25px] px-[25px] bg-[#F9F8FC]">
      <div className="flex items-center rounded-[5px]">
        <input
          type="text"
          name=""
          id=""
          className="bg-[#F8F9FC] h-[40px] outline-none pl-[13px] w-[350px] rounded-[5px] placeholder:text-[14px] leading-[20px] font-normal"
          placeholder="Search for..."
          onChange={handleInput}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <div className="bg-[#4e73df] h-[40px] px-[14px] flex items-center justify-center cursor-pointer rounded-tr-[5px] rounded-br-[5px]">
          <FaSearch color="#fff" onClick={handleSearch} />
        </div>
      </div>
      <div className="flex mt-[22px] w-full gap-[30px]">
        <div className="basis-[70%] border bg-white shadow-md rounded-[4px]">
          <div className="bg-[#F8F9FC] flex items-center justify-between px-[20px] py-[15px] border-b-[1px] border-[#EDEDED]">
            <h>Contestants</h>
            <FaCirclePlus
              color="green"
              className="cursor-pointer"
              onClick={handleClickOpenAdding}
            />
          </div>
          <div className="relative overflow-x-auto shadow-md h-[400px]">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
              <thead className="text-xs text-gray-700 uppercase bg-gray-200  ">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Student Name
                  </th>

                  <th scope="col" className="px-6 py-3">
                    Team
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Coach
                  </th>
                  <th scope="col" className="px-6 py-3">
                    School
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Competition
                  </th>

                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>

                  <th></th>
                </tr>
              </thead>
              <tbody>
                {listContestant.length !== 0 ? (
                  listContestant.map((item, index) => (
                    <tr
                      key={item.id}
                      className="odd:bg-white  even:bg-gray-200  border-b cursor-pointer transition delay-50 hover:bg-[#668bfac9] hover:text-white"
                      onClick={() => handleRowClick(item)}
                    >
                      <td className="px-6 py-4">{item.id}</td>
                      <td className="px-6 py-4">{item.student.name}</td>
                      <td className="px-6 py-4">{item.team.name}</td>
                      <td className="px-6 py-4">{item.coach.name}</td>
                      <td className="px-6 py-4">{item.student.school.name}</td>
                      <td className="px-6 py-4">
                        {item.team.competition.name}
                      </td>
                      <td className="px-6 py-4">{item.status}</td>

                      <td className="px-6 py-4">
                        <RemoveCircleIcon
                          color="error"
                          onClick={handleDeleteItem}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td style={{ textAlign: "center" }} colSpan={7}>
                      No result found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center my-[15px]">
            <Stack spacing={1}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Stack>
          </div>
        </div>
        <div className="basis-[30%] border bg-white shadow-md rounded-[4px]">
          <div className="bg-[#F8F9FC] flex items-center justify-between px-[20px] py-[15px] border-b-[1px] border-[#EDEDED]">
            <h2>Contestant Detail</h2>
            <FaEllipsisV color="gray" className="cursor-pointer" />
          </div>
          <div className="flex flex-col">
            <form
              className="w-full pl-[15px] pt-[15px] pr-[15px] pb-[3px]"
              onSubmit={handleSubmit}
            >
              <div className="grid gap-6 mb-6 md:grid-cols-2">
                <div>
                  <label
                    for="match_id"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Contestant ID
                  </label>
                  <input
                    type="text"
                    id="match_id"
                    name="id"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    placeholder=""
                    required
                    value={selectedContestant ? selectedContestant.id : ""}
                    disabled
                  />
                </div>

                <div>
                  <label
                    for="lap"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Student ID
                  </label>
                  <input
                    type="number"
                    id="lap"
                    name="student"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    placeholder="0"
                    required
                    value={
                      selectedContestant ? selectedContestant.student.id : ""
                    }
                    disabled={!isEditing}
                    onChange={handleChangeInput}
                  />
                </div>
                <div>
                  <label
                    for="lap"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Coach ID
                  </label>
                  <input
                    type="number"
                    id="lap"
                    name="coach"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    placeholder="0"
                    required
                    value={
                      selectedContestant ? selectedContestant.coach.id : ""
                    }
                    disabled={!isEditing}
                    onChange={handleChangeInput}
                  />
                </div>
                <div>
                  <label
                    for="lap"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Team ID
                  </label>
                  <input
                    type="number"
                    id="lap"
                    name="team"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    placeholder="0"
                    required
                    value={selectedContestant ? selectedContestant.team.id : ""}
                    disabled={!isEditing}
                    onChange={handleChangeInput}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                {isEditing ? (
                  <button
                    type="submit"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center  "
                  >
                    Update
                  </button>
                ) : (
                  ""
                )}
                {isAdding ? (
                  <button
                    type="submit"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center  "
                  >
                    Submit
                  </button>
                ) : (
                  ""
                )}
              </div>
            </form>
            <div className="flex justify-between pl-[15px] pb-[15px] pr-[15px]">
              {!isEditing || isAdding ? (
                <button
                  onClick={handleEditToggle}
                  type="submit"
                  className="text-white bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                >
                  Edit
                </button>
              ) : (
                ""
              )}
              {isAdding ? (
                <button
                  onClick={handleAddToggle}
                  type="submit"
                  className="text-white bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                >
                  Add
                </button>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
      <Dialog
        open={openDelete}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Are you sure you want to delete?`}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <React.Fragment>
        <Dialog
          open={openAdding}
          onClose={handleCloseAdding}
          PaperProps={{
            component: "form",
            onSubmit: (event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries(formData.entries());
              const email = formJson.email;
              console.log(email);
              handleCloseAdding();
            },
          }}
        >
          <DialogTitle>Add new contestant</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter all data fields to add a new contestant. This is
              required.
            </DialogContentText>
            <TextField
              autoFocus
              required
              margin="dense"
              id="id"
              name="studentId"
              label="Student ID"
              type="number"
              fullWidth
              variant="standard"
              onChange={handleAddInput}
            />

            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              name="coachId"
              label="Coach ID"
              type="number"
              fullWidth
              variant="standard"
              onChange={handleAddInput}
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="teamId"
              name="teamId"
              label="Team ID"
              type="number"
              fullWidth
              variant="standard"
              onChange={handleAddInput}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAdding}>Cancel</Button>
            <Button variant="contained" type="submit" onClick={handleAddingNew}>
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </div>
  );
};

export default Contestants;
