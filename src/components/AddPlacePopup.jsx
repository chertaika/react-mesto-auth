import PopupWithForm from './PopupWithForm';
import useFormValidator from '../hooks/useFormValidator';
import Input from './Input';

const AddPlacePopup = ({
  isOpen, onClose, onAddPlace, buttonText,
}) => {
  const {
    inputValues, errorMessages, isValid, handleChange, resetForm,
  } = useFormValidator();

  const handleSubmit = (evt) => {
    evt.preventDefault();
    onAddPlace(inputValues);
  };

  return (
    <PopupWithForm
      name="add-card"
      title="Новое место"
      buttonText={buttonText}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      isValid={isValid}
      resetForm={resetForm}
    >
      <Input
        type="text"
        placeholder="Название"
        name="name"
        minLength="2"
        maxLength="30"
        placeInput="popup"
        inputValue={inputValues.name}
        errorMessage={errorMessages.name}
        handleChange={handleChange}
      />
      <Input
        type="url"
        placeholder="Ссылка на картинку"
        name="link"
        placeInput="popup"
        inputValue={inputValues.link}
        errorMessage={errorMessages.link}
        handleChange={handleChange}
      />
    </PopupWithForm>
  );
};

export default AddPlacePopup;
