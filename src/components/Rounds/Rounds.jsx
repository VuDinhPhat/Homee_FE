import React, { useEffect, useState } from "react";
import apiRoundInstance from "../../service/api-round";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { FaEllipsisV } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";

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

const Rounds = () => {
  const [newRound, setNewRound] = useState(null);
  const [listRound, setListRound] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRound, setSelectedRound] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openAdding, setOpenAdding] = React.useState(false);
  const itemPerPage = 6;
  const [totalPages, setTotalPage] = useState(5);
  const [valueSearch, setValueSearch] = useState("");

  useEffect(() => {
    apiRoundInstance
      .get("/total")
      .then((response) => {
        setTotalPage(Math.ceil(response.data / itemPerPage));
      })
      .catch((error) => {
        console.error(error);
      });

    apiRoundInstance
      .get("/rounds?page=" + (currentPage - 1) + "&size=" + itemPerPage)
      .then((response) => {
        setListRound(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  const handleRowClick = (Round) => {
    setSelectedRound(Round);
    setIsEditing(false);
  };
  const handleEditToggle = () => {
    if (selectedRound != null) {
      setIsEditing(!isEditing);
    }
  };

  const handleAddInput = (e) => {
    setNewRound({
      ...newRound,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddingNew = (e) => {
    e.preventDefault();

    apiRoundInstance
      .post("/round", {
        name: newRound.name,
        map: newRound.map,
        competitionId: newRound.competitionId,
        status: "ACTIVE",
      })
      .then((response) => {
        setOpenAdding(false);
        setNewRound(null);
        apiRoundInstance
          .get("/rounds?page=" + (currentPage - 1) + "&size=" + itemPerPage)
          .then((response) => {
            setListRound(response.data.data);
          })
          .catch((error) => {
            console.error(error);
          });
        apiRoundInstance
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
    await apiRoundInstance
      .get("/rounds?page=" + (newPage - 1) + "&size=" + itemPerPage)
      .then((response) => {
        console.log(response.data.data);
        setListRound(response.data.data);

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
    setSelectedRound({
      ...selectedRound,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);

    if (selectedRound.competition.id) {
      apiRoundInstance
        .put("/round/" + selectedRound.id, {
          name: selectedRound.name,
          map: selectedRound.map,
          competitionId: selectedRound.competition.id,
          status: "ACTIVE",
        })
        .then((response) => {
          console.log(response.data);
          apiRoundInstance
            .get("/rounds?page=" + (currentPage - 1) + "&size=" + itemPerPage)
            .then((response) => {
              setListRound(response.data.data);

              //setTotalPage(Math.ceil(response.data.payload.length / itemPerPage));
            })
            .catch((error) => {
              console.error(error);
            });
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      apiRoundInstance
        .put("/round/" + selectedRound.id, {
          name: selectedRound.name,
          map: selectedRound.map,
          competitionId: selectedRound.competition,
          status: "ACTIVE",
        })
        .then((response) => {
          console.log(response.data);
          apiRoundInstance
            .get("/rounds?page=" + (currentPage - 1) + "&size=" + itemPerPage)
            .then((response) => {
              setListRound(response.data.data);

              //setTotalPage(Math.ceil(response.data.payload.length / itemPerPage));
            })
            .catch((error) => {
              console.error(error);
            });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const handleClose = () => {
    apiRoundInstance
      .put("/round-status/" + selectedRound.id)
      .then((response) => {
        apiRoundInstance
          .get("/rounds?page=" + (currentPage - 1) + "&size=" + itemPerPage)
          .then((response) => {
            setListRound(response.data.data);
            apiRoundInstance
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
      apiRoundInstance
        .get("/rounds?page=" + (currentPage - 1) + "&size=" + itemPerPage)
        .then((response) => {
          setListRound(response.data.data);
          apiRoundInstance
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
      apiRoundInstance
        .get("/round/name/" + valueSearch)
        .then((response) => {
          setListRound(response.data.data.Rounds);
          setTotalPage(1);
        })
        .catch((error) => {
          setListRound([]);
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
            <h>Rounds</h>
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
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Map
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Competition
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Competition Place
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {listRound.length !== 0 ? (
                  listRound.map((item, index) => (
                    <tr
                      key={item.id}
                      className="odd:bg-white  even:bg-gray-200  border-b cursor-pointer transition delay-50 hover:bg-[#668bfac9] hover:text-white"
                      onClick={() => handleRowClick(item)}
                    >
                      <td className="px-6 py-4">{item.id}</td>
                      <td className="px-6 py-4">{item.name}</td>
                      <td className="px-6 py-4">{item.map}</td>
                      <td className="px-6 py-4">{item.competition.name}</td>
                      <td className="px-6 py-4">
                        {item.competition.holdPlace}
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
            <h2>Round Detail</h2>
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
                    Round ID
                  </label>
                  <input
                    type="text"
                    id="match_id"
                    name="id"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    placeholder=""
                    required
                    value={selectedRound ? selectedRound.id : ""}
                    disabled
                  />
                </div>
                <div>
                  <label
                    for="bracket_id"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Round Name
                  </label>
                  <input
                    type="text"
                    id="bracket_id"
                    name="name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    placeholder=""
                    required
                    value={selectedRound ? selectedRound.name : ""}
                    disabled={!isEditing}
                    onChange={handleChangeInput}
                  />
                </div>
                <div>
                  <label
                    for="match_name"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Map
                  </label>
                  <input
                    type="text"
                    id="match_name"
                    name="map"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    placeholder=""
                    required
                    value={selectedRound ? selectedRound.map : ""}
                    disabled={!isEditing}
                    onChange={handleChangeInput}
                  />
                </div>
                <div>
                  <label
                    for="match_name"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Competition ID
                  </label>
                  <input
                    type="number"
                    id="match_name"
                    name="competition"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    placeholder=""
                    required
                    value={selectedRound ? selectedRound.competition.id : ""}
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
          <DialogTitle>Add new round</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter all data fields to add a new round. This is required.
            </DialogContentText>
            <TextField
              autoFocus
              required
              margin="dense"
              id="id"
              name="name"
              label="Name"
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
              name="map"
              label="Map"
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
              name="competitionId"
              label="Competition ID"
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

export default Rounds;
