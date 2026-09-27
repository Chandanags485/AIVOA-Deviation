import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  form: {
    deviation_title: "",
    batch_number: "",
    process_step: "",
    parameter: "",
    observed_value: "",
    approved_range: "",
    duration: "",
    description: "",
    potential_impact: "",
    severity: "",
    severity_reason: "",
    status: "Draft",
  },
  sourceText: "",
  loading: false,
  error: "",
};

const deviationSlice = createSlice({
  name: "deviation",
  initialState,

  reducers: {
    updateField: (state, action) => {
      const { field, value } = action.payload;
      state.form[field] = value;
    },

    setForm: (state, action) => {
      state.form = {
        ...state.form,
        ...action.payload,
      };
    },

    setSourceText: (state, action) => {
      state.sourceText = action.payload;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    resetForm: (state) => {
      state.form = initialState.form;
      state.sourceText = "";
      state.error = "";
    },
  },
});

export const {
  updateField,
  setForm,
  setSourceText,
  setLoading,
  setError,
  resetForm,
} = deviationSlice.actions;

export default deviationSlice.reducer;
