import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import { Input } from "@mui/material";
import axios from "axios";
const AddSpPath = () => {
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState([]);
  const [NameError, setNameError] = useState(false);
  const [FileError, setFileError] = useState(false);
  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleNameBlur = () => {
    name == "" ? setNameError(true) : setNameError(false);
  };

  const handleFileBlur = () => {
    file == null ? setFileError(true) : setFileError(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(file);
    // Do something with the name and file

    if (name=="" || file==null) {
      setErrors([{ loc: [1], msg: "Input all the required fields" }]);
    } else {
      const formdata = {
        name: name,
        path_url: "https://google.com",
      };

      const response = axios({
        method:"POST",
        url:"http://127.0.0.1:5000/admin/addpath",
        data:formdata,
        withCredentials : true 
    });

      const data = (await response).data;
      console.log(data);
      if (data.success) {
        // Redirect to the success page
      } else {
        setErrors(data.errors);
      }
    }
  };

  return (
    <Box
      component="form"
      sx={{
        "& > :not(style)": { m: 1 },
        width: "400px",
        margin: "auto",
        border: "solid",
        padding: "20px",
      }}
      autoComplete="on"
    >
      {errors.map((error) => (
        <div key={error.loc.join("-")}>{error.msg}</div>
      ))}
      <TextField
        label="Name"
        value={name}
        onChange={handleNameChange}
        onBlur={handleNameBlur}
        error={NameError}
        helperText={NameError ? "This field is required" : ""}
        fullWidth
        required
        margin="normal"
        variant="outlined"
      />
      <Input
        type="file"
        inputProps={{ accept: ".jpg, .jpeg, .png" }}
        onChange={handleFileChange}
        onBlur={handleFileBlur}
        error={FileError}
        helperText={FileError ? "This Field is Required" : ""}
        required
      />
      <Button
        type="submit"
        variant="contained"
        color="success"
        style={{ marginTop: "20px" }}
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </Box>
  );
};

export default AddSpPath;
