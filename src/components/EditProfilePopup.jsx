import { useContext, useEffect } from 'react';
import PopupWithForm from './PopupWithForm';
import CurrentUserContext from '../contexts/CurrentUserContext';
import useFormValidator from '../hooks/useFormValidator';
import Input from './Input';

const EditProfilePopup = ({
  isOpen, onClose, onUpdateUser, buttonText,
}) => {
  const {
    inputValues, errorMessages, isValid, handleChange, resetForm, setInputValues,
  } = useFormValidator();
  const { name, about } = useContext(CurrentUserContext);

  useEffect(() => {
    setInputValues({ name, about });
  }, [isOpen, name, about]);

  const handleSubmit = (evt) => {
    evt.preventDefault();
    onUpdateUser(inputValues);
  };

  return (
    <PopupWithForm
      name="edit-profile"
      title="Редактировать профиль"
      buttonText={buttonText}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      isValid={isValid}
      resetForm={resetForm}
    >
      <Input
        type="text"
        placeholder="Имя"
        name="name"
        minLength="2"
        maxLength="40"
        placeInput="popup"
        inputValue={inputValues.name}
        errorMessage={errorMessages.name}
        handleChange={handleChange}
      />
      <Input
        type="text"
        placeholder="О себе"
        name="about"
        minLength="2"
        maxLength="200"
        placeInput="popup"
        inputValue={inputValues.about}
        errorMessage={errorMessages.about}
        handleChange={handleChange}
      />
    </PopupWithForm>
  );
};

export default EditProfilePopup;
