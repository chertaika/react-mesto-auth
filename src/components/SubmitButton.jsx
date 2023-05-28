const SubmitButton = ({ buttonText, placeSubmitButton, isValid }) => (
  <button
    className={`${placeSubmitButton}__submit-btn ${!isValid && `${placeSubmitButton}__submit-btn_disabled`}`}
    disabled={!isValid}
    type="submit"
  >
    {buttonText}
  </button>

);

export default SubmitButton;
