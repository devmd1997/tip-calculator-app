const form = document.querySelector("form");
const inputs = document.querySelectorAll("input");
const formSections = [...form.querySelectorAll(".form-section")];
const resetButton = document.getElementById("reset-button");

// Data Validation
const isDataValid = (key, value) => {
  console.log(key, value);
  if (key === "tip") {
    return value !== "" && value !== undefined ? "" : "Must select a tip";
  } else {
    return value && value != "" && Number(value) > 0 ? "" : "Can't be zero";
  }
};

const handleInvalidForm = (formSection, message) => {
  const formLabel = formSection.querySelector("label");
  if (formLabel) {
    const invalidMessageElement = formLabel.children[1];
    const input = formSection.querySelector("input");
    invalidMessageElement.textContent = message;
    message === ""
      ? (input.dataset.invalid = false)
      : (input.dataset.invalid = true);
  }
};

const resetFormValidation = () => {
  formSections.forEach((field) => {
    handleInvalidForm(field, "");
  });
};

// Event handlers

const handleTipChange = (e) => {
  const value = e.target?.value ?? e.target.dataset.tipValue;
  const isValid = isDataValid("tip", value) == "";
  const tipField = document.getElementById("tip-form-section");
  unselectTipOptions();
  e.target.dataset.selected = isValid;
  handleInputChange(value, tipField.id);
};

const handleInputChange = (value, formSectionId) => {
  const formSection = document.getElementById(formSectionId);
  formSection.dataset.value = value;
  handleInvalidForm(
    formSection,
    isDataValid(formatSectionId(formSectionId), value)
  );
  calculateTotal(formSections);
};

const unselectTipOptions = () => {
  const tipOptions = document.querySelectorAll(".tip-option");
  const customTipInput = document.getElementById("custom-tip");
  tipOptions.forEach((option) => (option.dataset.selected = false));
  customTipInput.dataset.selected = false;
};

const displayResults = (tipAmount, totalAmount) => {
  const tipAmountElement = document.getElementById("tip-amount");
  const totalAmountElement = document.getElementById("total-amount");

  tipAmountElement.textContent = `$${tipAmount.toFixed(2)}`;
  totalAmountElement.textContent = `$${totalAmount.toFixed(2)}`;
};

const formatSectionId = (id) => id.replace("-form-section", "");

const calculateTotal = (formFields) => {
  const isValid = formFields.every(
    (field) =>
      isDataValid(formatSectionId(field.id), field.dataset.value) === ""
  );
  resetButton.disabled = !isValid;

  console.log(isValid);

  if (isValid) {
    const formData = formFields.reduce((acc, curr) => {
      const id = formatSectionId(curr.id);
      acc[id] = Number(curr.dataset.value);
      return acc;
    }, {}); // should convert array into object like {tip: value, bill: value, people: value}

    console.log(formData);

    const { tip, bill, people } = formData;
    const tipAmount = (bill * (tip / 100)) / people;
    const totalAmount = (bill + tipAmount) / people;

    displayResults(tipAmount, totalAmount);
  }
};

// UI Functions
const renderTipOptions = () => {
  const tipSection = document.getElementById("tip-section");

  const tipPercentages = [5, 10, 15, 25, 50];

  tipPercentages.forEach((percentage) => {
    const tipButton = document.createElement("div");
    tipButton.classList.add("tip-option");

    tipButton.textContent = `${percentage}%`;
    tipButton.dataset.tipValue = percentage;
    tipButton.dataset.selected = false;

    tipButton.addEventListener("click", handleTipChange);

    tipSection.appendChild(tipButton);
  });

  const customTipInput = document.createElement("input");
  customTipInput.type = "number";
  customTipInput.min = "0";
  customTipInput.placeholder = "Custom";
  customTipInput.id = "custom-tip";
  customTipInput.name = "custom-tip";
  customTipInput.step = "1";

  customTipInput.addEventListener("focus", (e) => {
    unselectTipOptions();
    if (e.target.value !== "") {
      handleTipChange(e);
    }
  });

  customTipInput.addEventListener("input", handleTipChange);

  tipSection.appendChild(customTipInput);
};

document.addEventListener("DOMContentLoaded", () => {
  console.log(resetButton);

  renderTipOptions();

  inputs.forEach((input) => {
    input.addEventListener("input", (e) => {
      handleInputChange(e.target.value, `${e.target.id}-form-section`);
      calculateTotal(formSections);
    });
  });

  resetButton.addEventListener("click", (e) => {
    e.preventDefault();
    form.reset();
    unselectTipOptions();

    formSections.forEach((field) => {
      field.dataset.value = "";
    });
    displayResults(0, 0);
    resetButton.disabled = true;
    resetFormValidation();
  });
});
