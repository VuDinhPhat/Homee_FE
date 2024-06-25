import React, { useEffect, useState } from "react";
import apiResultInstance from "../../service/api-result";
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

const Results = () => {
  const [newResults, setNewResults] = useState(null);
  const [listResults, setListResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedResults, setSelectedResults] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openAdding, setOpenAdding] = React.useState(false);
  const itemPerPage = 6;
  const [totalPages, setTotalPage] = useState(5);
  const [valueSearch, setValueSearch] = useState("");

  useEffect(() => {
    apiResultInstance
      .get("/total")
      .then((response) => {
        setTotalPage(Math.ceil(response.data / itemPerPage));
      })
      .catch((error) => {
        console.error(error);
      });
    apiResultInstance
      .get("/results?page=" + (currentPage - 1) + "&size=" + itemPerPage)
      .then((response) => {
        setListResults(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  const handleRowClick = (Results) => {
    setSelectedResults(Results);
    setIsEditing(false);
  };
  const handleEditToggle = () => {
    if (selectedResults != null) {
      setIsEditing(!isEditing);
    }
  };

  const handleAddInput = (e) => {
    setNewResults({
      ...newResults,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddingNew = (e) => {
    e.preventDefault();

    apiResultInstance
      .post("/result", {
        score: newResults.score,
        finishTime: newResults.finishTime,
        contestantId: newResults.contestantId,
        matchId: newResults.matchId,
        carId: newResults.carId,
        status: "ACTIVE",
      })
      .then((response) => {
        setOpenAdding(false);
        setNewResults(null);
        apiResultInstance
          .get("/results?page=" + (currentPage - 1) + "&size=" + itemPerPage)
          .then((response) => {
            setListResults(response.data.data);
          })
          .catch((error) => {
            console.error(error);
          });
        apiResultInstance
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
    await apiResultInstance
      .get("/results?page=" + (newPage - 1) + "&size=" + itemPerPage)
      .then((response) => {
        console.log(response.data.data);
        setListResults(response.data.data);
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
    setSelectedResults({
      ...selectedResults,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);

    var contestantId = 0;
    var matchId = 0;
    var carId = 0;

    if (selectedResults.contestant.id) {
      contestantId = selectedResults.contestant.id;
    } else {
      contestantId = selectedResults.contestant;
    }

    if (selectedResults.match.id) {
      matchId = selectedResults.match.id;
    } else {
      matchId = selectedResults.match;
    }

    if (selectedResults.car.id) {
      carId = selectedResults.car.id;
    } else {
      carId = selectedResults.car;
    }

    apiResultInstance
      .put("/result/" + selectedResults.id, {
        score: selectedResults.score,
        finishTime: selectedResults.finishTime,
        contestantId: contestantId,
        matchId: matchId,
        carId: carId,
        status: "ACTIVE",
      })
      .then((response) => {
        apiResultInstance
          .get("/results?page=" + (currentPage - 1) + "&size=" + itemPerPage)
          .then((response) => {
            setListResults(response.data.data);

            //setTotalPage(Math.ceil(response.data.payload.length / itemPerPage));
          })
          .catch((error) => {
            console.error(error);
          });
      });
  };

  const handleClose = () => {
    apiResultInstance
      .put("/result-status/" + selectedResults.id)
      .then((response) => {
        apiResultInstance
          .get("/results?page=" + (currentPage - 1) + "&size=" + itemPerPage)
          .then((response) => {
            setListResults(response.data.data);
            apiResultInstance
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
      apiResultInstance
        .get("/results?page=" + (currentPage - 1) + "&size=" + itemPerPage)
        .then((response) => {
          setListResults(response.data.data);
          apiResultInstance
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
    } else {
      apiResultInstance
        .get("/getByName?name=" + valueSearch)
        .then((response) => {
          setListResults(response.data.data.Results);
          setTotalPage(1);
        })
        .catch((error) => {
          setListResults([]);
          setTotalPage(0);
        });
    }
  };

  const formattedDateTime =
    selectedResults && selectedResults.finishTime
      ? moment(selectedResults.finishTime).format("YYYY-MM-DDTHH:mm")
      : "";

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
            <h>Results</h>
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
                    Score
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Finish Time
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Team
                  </th>
                  <th scope="col" className="px-6 py-3">
                    School
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Match
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Competition
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Car
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {listResults.length !== 0 ? (
                  listResults.map((item, index) => (
                    <tr
                      key={item.id}
                      className="odd:bg-white  even:bg-gray-200  border-b cursor-pointer transition delay-50 hover:bg-[#668bfac9] hover:text-white"
                      onClick={() => handleRowClick(item)}
                    >
                      <td className="px-6 py-4">{item.id}</td>
                      <td className="px-6 py-4">{item.score}</td>
                      <td className="px-6 py-4">{item.finishTime}</td>
                      <td className="px-6 py-4">{item.contestant.team.name}</td>
                      <td className="px-6 py-4">
                        {item.contestant.student.school.name}
                      </td>
                      <td className="px-6 py-4">{item.match.name}</td>
                      <td className="px-6 py-4">
                        {item.match.bracket.round.competition.name}
                      </td>
                      <td className="px-6 py-4">{item.car.name}</td>

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
            <h2>Result Detail</h2>
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
                    Result ID
                  </label>
                  <input
                    type="text"
                    id="match_id"
                    name="id"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    placeholder=""
                    required
                    value={selectedResults ? selectedResults.id : ""}
                    disabled
                  />
                </div>
                <div>
                  <label
                    for="bracket_id"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Score
                  </label>
                  <input
                    type="text"
                    id="bracket_id"
                    name="score"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    placeholder=""
                    required
                    value={selectedResults ? selectedResults.score : ""}
                    disabled={!isEditing}
                    onChange={handleChangeInput}
                  />
                </div>
                <div>
                  <label
                    for="match_name"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Finish Time
                  </label>
                  <input
                    type="text"
                    id="finishTime"
                    name="finishTime"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    placeholder=""
                    required
                    value={selectedResults ? selectedResults.finishTime : ""}
                    disabled={!isEditing}
                    onChange={handleChangeInput}
                  />
                </div>
                <div>
                  <label
                    for="match_name"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Contestant ID
                  </label>
                  <input
                    type="number"
                    id="match_name"
                    name="contestant"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    placeholder=""
                    required
                    value={selectedResults ? selectedResults.contestant.id : ""}
                    disabled={!isEditing}
                    onChange={handleChangeInput}
                  />
                </div>
                <div>
                  <label
                    for="match_name"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Match ID
                  </label>
                  <input
                    type="number"
                    id="match_name"
                    name="match"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    placeholder=""
                    required
                    value={selectedResults ? selectedResults.match.id : ""}
                    disabled={!isEditing}
                    onChange={handleChangeInput}
                  />
                </div>
                <div>
                  <label
                    for="match_name"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Car ID
                  </label>
                  <input
                    type="number"
                    id="match_name"
                    name="car"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    placeholder=""
                    required
                    value={selectedResults ? selectedResults.car.id : ""}
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
          <DialogTitle>Add new result</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter all data fields to add a new result. This is
              required.
            </DialogContentText>
            <TextField
              autoFocus
              required
              margin="dense"
              id="id"
              name="score"
              label="Score"
              type="number"
              fullWidth
              variant="standard"
              onChange={handleAddInput}
            />

            <TextField
              autoFocus
              required
              margin="dense"
              id="startTime"
              name="finishTime"
              label="Finish Time"
              type="text"
              fullWidth
              variant="standard"
              onChange={handleAddInput}
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="startTime"
              name="contestantId"
              label="Contestant ID"
              type="number"
              fullWidth
              variant="standard"
              onChange={handleAddInput}
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="startTime"
              name="matchId"
              label="Match ID"
              type="number"
              fullWidth
              variant="standard"
              onChange={handleAddInput}
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="startTime"
              name="carId"
              label="Car ID"
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

export default Results;
