import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Grid,
  Typography,
  DialogActions,
  Button,
  Box,
} from "@mui/material";
import Select from "react-select";
import indianStates from "../data/indianStates.json"; // adjust path based on your structure

const PanAddressModal = ({ open, onClose, onSubmit, donationId }) => {
  console.log(donationId);
  const [pan, setPan] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [pincode, setPincode] = useState("");
  const [state, setState] = useState("");
  const [country] = useState("India");
  const [error, setError] = useState("");

  const validatePAN = (pan) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);
  const handleFormSubmit = () => {
    if (!validatePAN(pan)) {
      setError("Invalid PAN number format.");
      return;
    }
    if (!address1 || !pincode || !state || !country) {
      setError("Please fill all required address fields.");
      return;
    }

    const full_address = `${address1}, ${address2}, ${pincode}, ${state}, ${country}`;
    setError("");

    // You must pass `donationId` here
    console.log(donationId, pan, full_address);
    onSubmit({ donationId, pan_number: pan, full_address });

    onClose(); // close modal
  };

  const customSelectStyles = {
    control: (base) => ({
      ...base,
      minHeight: 56, // Match MUI TextField
      borderColor: "#ccc",
      borderRadius: 4,
      boxShadow: "none",
      marginBottom: "-20px",
      "&:hover": { borderColor: "#888" },
    }),
    menu: (base) => ({
      ...base,
      zIndex: 1300, // To appear above modal
      maxHeight: 200,
      //   overflowY: "auto",
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 1300,
    }),
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: { borderRadius: 4, overflow: "visible" }, // Rounded and allow overflow for dropdown
      }}
    >
      <DialogTitle>Get 80G Receipt</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Please enter your PAN and complete address to receive the 80G receipt.
        </Typography>

        <TextField
          label="PAN"
          fullWidth
          margin="normal"
          value={pan}
          onChange={(e) => setPan(e.target.value.toUpperCase())}
          inputProps={{ maxLength: 10 }}
        />

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Address Line 1"
              fullWidth
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Address Line 2"
              fullWidth
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <TextField
              label="Pincode"
              fullWidth
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <Box>
              <Select
                styles={customSelectStyles}
                menuPortalTarget={document.body}
                options={indianStates.map((state) => ({
                  value: state.value,
                  label: state.name,
                }))}
                value={state ? { value: state, label: state } : null}
                onChange={(selectedOption) => setState(selectedOption.value)}
                placeholder="Select State"
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField label="Country" fullWidth value={country} disabled />
          </Grid>
        </Grid>

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={handleFormSubmit}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PanAddressModal;
