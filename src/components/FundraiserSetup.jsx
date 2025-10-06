import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Grid,
  TextField,
  MenuItem,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
  Box,
} from "@mui/material";
import { Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import {
  useCreateCampaignByUserMutation,
  useUpdateCampaignByUserMutation,
  useGetCampaignQuery,
} from "../redux/services/campaignApi";
import { IMAGE_BASE_URL } from "../utils/imageUrl";

const steps = ["Beneficiary & Details", "Story & Photos", "Review & Submit"];

const toolbarOptions = [
  [{ header: [1, 2, false] }],
  ["bold", "italic", "underline"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["link", "image"],
  ["clean"],
];

const fieldStyles = {
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "#c4c4c4" },
    "&:hover fieldset": { borderColor: "#1976d2" },
    "&.Mui-focused fieldset": { borderColor: "#1976d2" },
  },
  "& .MuiInputLabel-root": { color: "#555" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#1976d2" },
};

const FundraiserSetup = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [uploading, setUploading] = useState(false);

  const [mainPictureFileList, setMainPictureFileList] = useState([]);
  const [otherPicturesFileList, setOtherPicturesFileList] = useState([]);

  const isEditMode = Boolean(id);

  const { data: campaignData, isLoading } = useGetCampaignQuery(id, {
    skip: !id,
  });

  const [createCampaign, { isLoading: creating }] =
    useCreateCampaignByUserMutation();
  const [updateCampaign, { isLoading: updating }] =
    useUpdateCampaignByUserMutation();

  const base64Image = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });

  const categoryFieldsMap = {
    medical: [
      { name: "hospital_name", label: "Hospital Name" },
      { name: "ailment", label: "Ailment" },
    ],
    education: [
      { name: "school_name", label: "School/College Name" },
      { name: "course_name", label: "Course Name" },
    ],
    ngo: [{ name: "ngo_name", label: "NGO Name" }],
    memorial: [
      { name: "memorial_name", label: "Memorial Name" },
      { name: "relation", label: "Relation" },
    ],
    others: [{ name: "other_details", label: "Other Details" }],
  };

  const allFields = Object.values(categoryFieldsMap).flat();
  const initialCategoryValues = allFields.reduce((acc, field) => {
    acc[field.name] = "";
    return acc;
  }, {});

  const form = useFormik({
    initialValues: {
      beneficiary_type: "",
      category: "",
      campaign_title: "",
      target_amount: "",
      story: "",
      main_picture: "",
      other_pictures: [],
      terms_agreed: false,
      beneficiary: "",
      location: "",
      user_id: user?.id || null,
      ...initialCategoryValues,
    },
    validationSchema: Yup.object({
      beneficiary_type: Yup.string().required("Required"),
      category: Yup.string().required("Required"),
      campaign_title: Yup.string().required("Title is required"),
      story: Yup.string().required("Story is required"),
      target_amount: Yup.number().required("Goal is required").min(2000),
      terms_agreed: Yup.boolean().oneOf([true], "You must agree"),
      ...Object.fromEntries(
        Object.entries(categoryFieldsMap).flatMap(([category, fields]) =>
          fields.map((field) => [
            field.name,
            Yup.string().when("category", {
              is: category,
              then: (schema) => schema.required(`${field.label} is required`),
              otherwise: (schema) => schema.notRequired(),
            }),
          ])
        )
      ),
    }),
    onSubmit: async (values) => {
      try {
        setUploading(true);
        const dynamicFields =
          categoryFieldsMap[values.category]?.map((f) => f.name) || [];

        const filteredValues = {
          ...values,
          campaign_description: values.story,
          dynamic_fields: dynamicFields.reduce((acc, key) => {
            acc[key] = values[key];
            return acc;
          }, {}),
          is_live: false,
        };
        if (isEditMode) {
          await updateCampaign({ id, ...filteredValues }).unwrap();
          message.success("Fundraiser updated successfully!");

          // redirect to that campaign's dashboard
          navigate(`/fundraiser-dashboard/${id}`);
        } else {
          const newCampaign = await createCampaign(filteredValues).unwrap();
          message.success("Fundraiser submitted for review!");

          // redirect to new campaign dashboard
          navigate(`/fundraiser-dashboard/${newCampaign.data._id}`);
        }
      } catch (err) {
        message.error("Error creating fundraiser");
      } finally {
        setUploading(false);
      }
    },
  });

  // Prefill form + fileLists in edit mode
  useEffect(() => {
    if (!isEditMode || !campaignData?.data?.campaign) return;

    const c = campaignData.data.campaign; // ✅ actual campaign object

    // File lists for AntD Upload
    const mainFileList = c.main_picture
      ? [
          {
            uid: "-1",
            name: "main_picture.png",
            status: "done",
            url: c.main_picture.startsWith("/images/")
              ? `${IMAGE_BASE_URL}${c.main_picture}`
              : c.main_picture,
          },
        ]
      : [];

    const otherFileList = (c.other_pictures || []).map((pic, idx) => ({
      uid: String(idx),
      name: `other_picture_${idx}.png`,
      status: "done",
      url: pic.startsWith("/images/") ? `${IMAGE_BASE_URL}${pic}` : pic,
    }));

    /// Prefill dynamic fields
    let categorySpecificValues = {};
    if (c.category && categoryFieldsMap[c.category]) {
      categoryFieldsMap[c.category].forEach((field) => {
        categorySpecificValues[field.name] =
          c.dynamic_fields?.[field.name] || "";
      });
    }

    // ✅ Set all values including dynamic ones
    form.setValues((prev) => ({
      ...prev,
      beneficiary_type: c.beneficiary_type || "",
      category: c.category || "",
      campaign_title: c.campaign_title || "",
      target_amount: c.target_amount?.$numberDecimal || c.target_amount || "",
      story: c.campaign_description || "",
      main_picture: c.main_picture || "",
      other_pictures: c.other_pictures || [],
      terms_agreed: c.terms_agreed || false,
      beneficiary: c.beneficiary || "",
      location: c.state || "",
      user_id: user?.id || null,
      ...categorySpecificValues, // ✅ merge category-specific prefilled fields
    }));

    setMainPictureFileList(mainFileList);
    setOtherPicturesFileList(otherFileList);
  }, [isEditMode, campaignData, user?.id]);

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      form.handleSubmit();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  // Show loading spinner if data is loading in edit mode
  if (isEditMode && isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "70vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: "900px", mx: "auto", p: 3 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box
        sx={{
          mt: 4,
          minHeight: "400px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Step 0 */}
        {activeStep === 0 && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Who will benefit?"
                name="beneficiary_type"
                value={form.values.beneficiary_type || ""}
                onChange={(e) =>
                  form.setFieldValue("beneficiary_type", e.target.value)
                }
                sx={fieldStyles}
              >
                <MenuItem value="myself">Myself</MenuItem>
                <MenuItem value="family">My family / Relatives</MenuItem>
                <MenuItem value="friends">Friends / Colleagues</MenuItem>
                <MenuItem value="others">Others (Community/Animals)</MenuItem>
                <MenuItem value="ngo">Registered NGO</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Cause Category"
                name="category"
                value={form.values.category || ""}
                onChange={(e) => form.setFieldValue("category", e.target.value)}
                sx={fieldStyles}
              >
                <MenuItem value="medical">Medical</MenuItem>
                <MenuItem value="education">Education</MenuItem>
                <MenuItem value="memorial">Memorial</MenuItem>
                <MenuItem value="others">Others</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Beneficiary Name"
                name="beneficiary"
                value={form.values.beneficiary}
                onChange={form.handleChange}
                sx={fieldStyles}
              />
            </Grid>
            {form.values.category &&
              categoryFieldsMap[form.values.category]?.map((field) => (
                <Grid item xs={12} key={field.name}>
                  <TextField
                    fullWidth
                    label={field.label}
                    name={field.name}
                    value={form.values[field.name] || ""}
                    onChange={form.handleChange}
                    sx={fieldStyles}
                  />
                </Grid>
              ))}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={form.values.location}
                onChange={form.handleChange}
                sx={fieldStyles}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Campaign Title"
                name="campaign_title"
                value={form.values.campaign_title}
                onChange={form.handleChange}
                sx={fieldStyles}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label="Fundraising Goal (INR)"
                name="target_amount"
                value={form.values.target_amount}
                onChange={form.handleChange}
                sx={fieldStyles}
              />
            </Grid>
          </Grid>
        )}

        {/* Step 1 */}
        {activeStep === 1 && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Upload
                listType="picture"
                fileList={mainPictureFileList}
                maxCount={1}
                beforeUpload={async (file) => {
                  const base64 = await base64Image(file);
                  form.setFieldValue("main_picture", base64);
                  setMainPictureFileList([
                    {
                      uid: file.uid,
                      name: file.name,
                      status: "done",
                      url: base64,
                    },
                  ]);
                  return false;
                }}
                onRemove={() => {
                  form.setFieldValue("main_picture", "");
                  setMainPictureFileList([]);
                }}
              >
                <Button icon={<UploadOutlined />}>Upload Main Picture</Button>
              </Upload>
            </Grid>
            <Grid item xs={12}>
              <ReactQuill
                theme="snow"
                value={form.values.story}
                onChange={(val) => form.setFieldValue("story", val)}
                modules={{ toolbar: toolbarOptions }}
              />
            </Grid>
            <Grid item xs={12}>
              <Upload
                listType="picture-card"
                multiple
                fileList={otherPicturesFileList}
                beforeUpload={async (file) => {
                  const base64 = await base64Image(file);
                  form.setFieldValue("other_pictures", [
                    ...form.values.other_pictures,
                    base64,
                  ]);
                  setOtherPicturesFileList((prev) => [
                    ...prev,
                    {
                      uid: file.uid,
                      name: file.name,
                      status: "done",
                      url: base64,
                    },
                  ]);
                  return false;
                }}
                onRemove={(file) => {
                  const updated = form.values.other_pictures.filter(
                    (img) => img !== file.url && img !== file.thumbUrl
                  );
                  form.setFieldValue("other_pictures", updated);
                  setOtherPicturesFileList((prev) =>
                    prev.filter((f) => f.uid !== file.uid)
                  );
                }}
              >
                + Upload Other Pictures
              </Upload>
            </Grid>
          </Grid>
        )}

        {/* Step 2 */}
        {activeStep === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review Your Fundraiser
            </Typography>
            {form.values.main_picture && (
              <img
                src={
                  form.values.main_picture.startsWith("/images/")
                    ? `${IMAGE_BASE_URL}${form.values.main_picture}`
                    : form.values.main_picture
                }
                alt="Cover"
                style={{ width: "100%", borderRadius: 8, marginBottom: 16 }}
              />
            )}
            {form.values.other_pictures?.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1">Gallery Photos</Typography>
                <Grid container spacing={2} mt={1}>
                  {form.values.other_pictures.map((img, idx) => (
                    <Grid item xs={6} sm={4} key={idx}>
                      <img
                        src={
                          img.startsWith("/images/")
                            ? `${IMAGE_BASE_URL}${img}`
                            : img
                        }
                        alt={`Gallery ${idx}`}
                        style={{
                          width: "100%",
                          borderRadius: 8,
                          objectFit: "cover",
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
            <Typography variant="h5">{form.values.campaign_title}</Typography>
            <Typography variant="body2" color="textSecondary">
              Goal: ₹{form.values.target_amount || 0}
            </Typography>
            <LinearProgress variant="determinate" value={0} sx={{ my: 2 }} />
            <Typography variant="body2">
              ₹0 raised of ₹{form.values.target_amount || 0}
            </Typography>
            <div
              style={{ marginTop: 16 }}
              dangerouslySetInnerHTML={{
                __html: form.values.story || "<i>Your story preview...</i>",
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="terms_agreed"
                  checked={form.values.terms_agreed}
                  onChange={form.handleChange}
                />
              }
              label="I agree to the terms & conditions"
            />
          </Box>
        )}

        {/* Navigation */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            variant="contained"
            disabled={uploading || creating || updating}
          >
            {uploading || creating || updating ? (
              <CircularProgress size={24} />
            ) : activeStep === steps.length - 1 ? (
              isEditMode ? (
                "Update"
              ) : (
                "Submit"
              )
            ) : (
              "Next"
            )}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default FundraiserSetup;
