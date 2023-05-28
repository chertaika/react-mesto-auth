import PopupWithForm from './PopupWithForm';

const PopupWithConfirmation = ({
  isOpen, onClose, onConfirm, buttonText,
}) => {
  const handleConfirm = (evt) => {
    evt.preventDefault();
    onConfirm();
  };

  return (
    <PopupWithForm
      name="delete-card"
      title="Вы уверены?"
      buttonText={buttonText}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleConfirm}
      isValid
    />
  );
};

export default PopupWithConfirmation;
