import React, { useEffect, useState } from "react";
import apiCoachInstance from "../../service/api-coach";
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

const Coachs = () => {
  const [newCoach, setNewCoach] = useState(null);
  const [listCoach, setListCoach] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openAdding, setOpenAdding] = React.useState(false);
  const itemPerPage = 6;
  const [totalPages, setTotalPage] = useState(5);
  const [valueSearch, setValueSearch] = useState("");

  useEffect(() => {
    apiCoachInstance
      .get("/total")
      .then((response) => {
        setTotalPage(Math.ceil(response.data / itemPerPage));
      })
      .catch((error) => {
        console.error(error);
      });

    apiCoachInstance
      .get("/coaches?page=" + (currentPage - 1) + "&size=" + itemPerPage)
      .then((response) => {
        setListCoach(response.data.data.Coach);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  const handleRowClick = (Coach) => {
    setSelectedCoach(Coach);
    setIsEditing(false);
  };
  const handleEditToggle = () => {
    if (selectedCoach != null) {
      setIsEditing(!isEditing);
    }
  };

  const handleAddInput = (e) => {
    setNewCoach({
      ...newCoach,
      [e.target.name]: e.target.value,
    });
  };

  const formattedDateTime =
    selectedCoach && selectedCoach.dob
      ? moment(selectedCoach.dob).format("YYYY-MM-DDTHH:mm")
      : "";

  const formattedDateTimeForAdd =
    newCoach && newCoach.dob
      ? moment(newCoach.dob).format("YYYY-MM-DDTHH:mm")
      : "";

  const handleAddingNew = (e) => {
    e.preventDefault();
    apiCoachInstance
      .post("/coach", {
        name: newCoach.name,
        dob: newCoach.dob,
        sex: newCoach.sex,
        status: "ACTIVE",
        schoolId: newCoach.schoolId,
      })
      .then((response) => {
        setOpenAdding(false);
        setNewCoach(null);
        apiCoachInstance
          .get("/coaches?page=" + (currentPage - 1) + "&size=" + itemPerPage)
          .then((response) => {
            setListCoach(response.data.data.Coach);
          })
          .catch((error) => {
            console.error(error);
          });
        apiCoachInstance
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
    await apiCoachInstance
      .get("/coaches?page=" + (newPage - 1) + "&size=" + itemPerPage)
      .then((response) => {
        setListCoach(response.data.data.Coach);
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
    setSelectedCoach({
      ...selectedCoach,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);

    if (selectedCoach.school.id) {
      apiCoachInstance
        .put("/coach/" + selectedCoach.id, {
          name: selectedCoach.name,
          dob: selectedCoach.dob,

          sex: selectedCoach.sex,
          status: "ACTIVE",
          schoolId: selectedCoach.school.id,
        })
        .then((response) => {
          console.log(response.data);
          apiCoachInstance
            .get("/coaches?page=" + (currentPage - 1) + "&size=" + itemPerPage)
            .then((response) => {
              setListCoach(response.data.data.Coach);

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
      apiCoachInstance
        .put("/coach/" + selectedCoach.id, {
          name: selectedCoach.name,
          dob: selectedCoach.dob,

          sex: selectedCoach.sex,
          status: "ACTIVE",
          schoolId: selectedCoach.school,
        })
        .then((response) => {
          console.log(response.data);
          apiCoachInstance
            .get("/coaches?page=" + (currentPage - 1) + "&size=" + itemPerPage)
            .then((response) => {
              setListCoach(response.data.data.Coach);

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
    apiCoachInstance
      .put("/coach-status/" + selectedCoach.id)
      .then((response) => {
        apiCoachInstance
          .get("/coaches?page=" + (currentPage - 1) + "&size=" + itemPerPage)
          .then((response) => {
            setListCoach(response.data.data.Coach);
            apiCoachInstance
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
      apiCoachInstance
        .get("/coaches?page=" + (currentPage - 1) + "&size=" + itemPerPage)
        .then((response) => {
          setListCoach(response.data.data.Coach);
          apiCoachInstance
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
      apiCoachInstance
        .get("/coach/name/" + valueSearch)
        .then((response) => {
          setListCoach(response.data.data.Coaches);
          setTotalPage(1);
        })
        .catch((error) => {
          setListCoach([]);
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
            <h>Coaches</h>
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
                    Date of birth
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Gender
                  </th>
                  <th scope="col" className="px-6 py-3">
                    School
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>

                  <th></th>
                </tr>
              </thead>
              <tbody>
                {listCoach.length !== 0 ? (
                  listCoach.map((item, index) => (
                    <tr
                      key={item.id}
                      className="odd:bg-white  even:bg-gray-200  border-b cursor-pointer transition delay-50 hover:bg-[#668bfac9] hover:text-white"
                      onClick={() => handleRowClick(item)}
                    >
                      <td className="px-6 py-4">{item.id}</td>
                      <td className="px-6 py-4">{item.name}</td>
                      <td className="px-6 py-4">{item.dob}</td>
                      <td className="px-6 py-4">{item.sex}</td>
                      <td className="px-6 py-4">{item.school.name}</td>
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
            <h2>Coach Detail</h2>
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
                    ID
                  </label>
                  <input
                    type="text"
                    id="match_id"
                    name="id"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    placeholder=""
                    required
                    value={selectedCoach ? selectedCoach.id : ""}
                    disabled
                  />
                </div>
                <div>
                  <label
                    for="bracket_id"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="bracket_id"
                    name="name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    placeholder=""
                    required
                    value={selectedCoach ? selectedCoach.name : ""}
                    disabled={!isEditing}
                    onChange={handleChangeInput}
                  />
                </div>
                <div>
                  <label
                    for="match_name"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Date of birth
                  </label>
                  <input
                    type="datetime-local"
                    id="match_name"
                    name="dob"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    placeholder=""
                    required
                    value={formattedDateTime}
                    disabled={!isEditing}
                    onChange={handleChangeInput}
                  />
                </div>
                <div>
                  <label
                    for="bracket_id"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Gender
                  </label>
                  <input
                    type="text"
                    id="bracket_id"
                    name="sex"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    placeholder=""
                    required
                    value={selectedCoach ? selectedCoach.sex : ""}
                    disabled={!isEditing}
                    onChange={handleChangeInput}
                  />
                </div>
                <div>
                  <label
                    for="bracket_id"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    School ID
                  </label>
                  <input
                    type="number"
                    id="bracket_id"
                    name="school"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    placeholder=""
                    required
                    value={selectedCoach ? selectedCoach.school.id : ""}
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
          <DialogTitle>Add new coach</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter all data fields to add a new coach. This is required.
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
              name="dob"
              label="Date of birth"
              type="datetime-local"
              fullWidth
              variant="standard"
              value={formattedDateTimeForAdd}
              onChange={handleAddInput}
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="id"
              name="sex"
              label="Gender"
              type="text"
              fullWidth
              variant="standard"
              onChange={handleAddInput}
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="id"
              name="schoolId"
              label="School ID"
              type="text"
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

export default Coachs;
