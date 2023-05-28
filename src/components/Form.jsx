import SubmitButton from './SubmitButton';

const Form = ({
  name, buttonText, onSubmit, children, placeForm, isValid,
}) => (
  <form
    className={`form ${placeForm}__form`}
    name={name}
    onSubmit={onSubmit}
    noValidate
  >
    {children}
    <SubmitButton buttonText={buttonText} placeSubmitButton={placeForm} isValid={isValid} />
  </form>
);

export default Form;
