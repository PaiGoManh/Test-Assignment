import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Add, Close } from "@mui/icons-material";
import { Path } from "../../utils";
import { Chip, FormControl, Input, InputAdornment, Tooltip } from "@mui/material";
import { PiMagnifyingGlass } from "react-icons/pi";
import { FiFilter } from "react-icons/fi";
import CreateUser from "./CreateEmployee";
import CreateClient from "./CreateClient"; // Import your CreateClient component
import Filter from "./Filter";
import { searchUserReducer } from "../../redux/reducer/user";
import { useDispatch } from "react-redux";
import { PiList, PiTimerLight } from "react-icons/pi";


const Topbar = ({ setIsFiltered, isFiltered }) => {
  const dispatch = useDispatch();

  ///////////////////////////////////////// VARIABLES ///////////////////////////////////////////////////
  const { pathname } = useLocation();
  const pathArr = pathname.split("/").filter((item) => item !== "");
  const isEmployeePage = pathArr.includes("employees");
  const isClientPage = pathArr.includes("clients");
  const isCreatePage = pathArr.includes("create");
  const title = isCreatePage
    ? `Create ${pathname.split("/")[1].slice(0, -1)}`
    : pathname.split("/")[1];
  const descriptionElementRef = useRef(null);

  ///////////////////////////////////////// STATES ///////////////////////////////////////////////////
  const [openCreateUser, setOpenCreateUser] = useState(false);
  const [openCreateClient, setOpenCreateClient] = useState(false);
  const [openFilters, setOpenFilters] = useState(false);
  const [scroll, setScroll] = useState("paper");
  const [date, setDate] = useState(new Date());

  ///////////////////////////////////////// USE EFFECTS ///////////////////////////////////////////////////
  useEffect(() => {
    if (openCreateUser || openCreateClient) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement != null) {
        descriptionElement.focus();
      }
    }
  }, [openCreateUser, openCreateClient]);

    useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  ///////////////////////////////////////// FUNCTIONS ///////////////////////////////////////////////////
  const handleSearch = (searchTerm) => {
    dispatch(searchUserReducer(searchTerm));
  };

  const handleToggleFilters = () => {
    // Only toggle filters for Employees page
    if (isEmployeePage) {
      setOpenFilters((prev) => !prev);
    }
  };

  const handleCreateOpen = (scrollType) => () => {
    if (isEmployeePage) setOpenCreateUser(true);
    else if (isClientPage) setOpenCreateClient(true);
    setScroll(scrollType);
  };

  return (
    <div className="flex flex-col">
      <div className="w-full text-[14px]">
        <Path />
      </div>
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-primary-blue text-[32px] capitalize font-light">{title}</h1>
        {/* Right side controls: search, filter, add, timer */}
        <div className="flex items-center gap-3">
              <p className="text-sky-400 text-xl gap-1 flex items-center whitespace-nowrap ml-4">
            <PiTimerLight className="text-[25px]" /> {date.toLocaleTimeString()}
          </p>
          {/* Employee or Client controls here */}
          {isEmployeePage && (
            <>
              {isFiltered && (
                <Chip
                  label="Filtered"
                  onDelete={() => setIsFiltered(false)}
                  deleteIcon={<Close />}
                />
              )}
              <div className="bg-[#ebf2f5] hover:bg-[#dfe6e8] p-1 pl-2 pr-2 rounded-md w-48">
                <FormControl>
                  <Input
                    name="search"
                    placeholder="Search Employees"
                    startAdornment={
                      <InputAdornment position="start">
                        <PiMagnifyingGlass className="text-[25px]" />
                      </InputAdornment>
                    }
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </FormControl>
              </div>
              <Tooltip title="Filter" arrow placement="top">
                <div
                  onClick={handleToggleFilters}
                  className={`p-2 rounded-md cursor-pointer ${
                    openFilters ? "text-[#20aee3] bg-[#e4f1ff]" : "bg-[#ebf2f5] hover:bg-[#dfe6e8] text-[#a6b5bd]"
                  }`}
                >
                  <FiFilter className="text-[25px]" />
                </div>
              </Tooltip>
              <Tooltip title="Add New Employee" placement="top" arrow>
                <div onClick={handleCreateOpen("body")}>
                  <button className="bg-primary-red hover:bg-red-400 transition-all text-white w-[44px] h-[44px] flex justify-center items-center rounded-full shadow-xl">
                    <Add />
                  </button>
                </div>
              </Tooltip>
            </>
          )}

          {isClientPage && (
            <>
              {isFiltered && (
                <Chip
                  label="Filtered"
                  onDelete={() => setIsFiltered(false)}
                  deleteIcon={<Close />}
                />
              )}
              <div className="bg-[#ebf2f5] hover:bg-[#dfe6e8] p-1 pl-2 pr-2 rounded-md w-48">
                <FormControl>
                  <Input
                    name="search"
                    placeholder="Search Clients"
                    startAdornment={
                      <InputAdornment position="start">
                        <PiMagnifyingGlass className="text-[25px]" />
                      </InputAdornment>
                    }
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </FormControl>
              </div>
              {/* No filter for clients */}
              <Tooltip title="Add New Client" placement="top" arrow>
                <div onClick={handleCreateOpen("body")}>
                  <button className="bg-primary-red hover:bg-red-400 transition-all text-white w-[44px] h-[44px] flex justify-center items-center rounded-full shadow-xl">
                    <Add />
                  </button>
                </div>
              </Tooltip>
            </>
          )}
        </div>
      </div>

      <CreateUser open={openCreateUser} scroll={scroll} setOpen={setOpenCreateUser} />
      <CreateClient open={openCreateClient} scroll={scroll} setOpen={setOpenCreateClient} />
      <Filter open={openFilters} setOpen={setOpenFilters} setIsFiltered={setIsFiltered} />    
    </div>
  );
};

export default Topbar;
