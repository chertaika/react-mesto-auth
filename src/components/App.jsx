import { useCallback, useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import Preloader from './Preloader';
import api from '../utils/Api';
import CurrentUserContext from '../contexts/CurrentUserContext';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import PopupWithConfirmation from './PopupWithConfirmation';
import Register from './Register';
import Login from './Login';
import ProtectedRoute from './ProtectedRoute';
import auth from '../utils/Auth';
import InfoTooltip from './InfoTooltip';

const App = () => {
  // анимация загрузки
  const [isLoading, setIsLoading] = useState(true);
  // состояние попапов
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  // текст кнопок попапов
  const [buttonTextEditPopup, setButtonTextEditPopup] = useState('Сохранить');
  const [buttonTextAddPopup, setButtonTextAddPopup] = useState('Создать');
  const [buttonTextConfirmPopup, setButtonTextConfirmPopup] = useState('Да');
  // текущая карточка
  const [selectedCard, setSelectedCard] = useState(null);
  // данные удаляемой карточки
  const [deletedCard, setDeletedCard] = useState(null);
  // состояние регистрации
  const [tooltipMessage, setTooltipMessage] = useState(null);
  // состояние авторизации
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // e-mail пользователя
  const [userEmail, setUserEmail] = useState(null);
  // данные пользователя
  const [currentUser, setCurrentUser] = useState({});
  // данные для карточек
  const [cards, setCards] = useState([]);

  const navigate = useNavigate();

  const handleCardClick = (card) => {
    setSelectedCard(card);
    console.log(handleCardClick);
  };

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  };

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  };

  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  };

  const handleCardDelete = (card) => {
    setDeletedCard(card);
  };

  const closeAllPopups = useCallback(() => {
    setIsEditAvatarPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setSelectedCard(null);
    setDeletedCard(null);
    setTooltipMessage(null);
  }, []);

  const handleCardLike = async (currentCardId, isLiked) => {
    try {
      const likedCard = await api.handleLike(currentCardId, isLiked);
      setCards(cards.map(card => (card._id === currentCardId ? likedCard : card)));
    } catch (error) {
      console.log(`Ошибка: ${error}`);
    }
  };

  const handleConfirmationOfDelete = async () => {
    try {
      setButtonTextConfirmPopup('Удаление...');
      await api.deleteCard(deletedCard._id);
      setCards(cards.filter(card => card._id !== deletedCard._id));
      closeAllPopups();
    } catch (error) {
      console.log(`Ошибка: ${error}`);
    } finally {
      setButtonTextConfirmPopup('Да');
    }
  };

  const handleAddPlaceSubmit = async (card) => {
    try {
      setButtonTextAddPopup('Создание...');
      const userCard = await api.addNewCard(card);
      setCards([userCard, ...cards]);
      closeAllPopups();
    } catch (error) {
      console.log(`Ошибка: ${error}`);
    } finally {
      setButtonTextAddPopup('Создать');
    }
  };

  const handleUpdateUser = async (data) => {
    try {
      setButtonTextEditPopup('Сохранение...');
      const userInfo = await api.editUserInfo(data);
      setCurrentUser(userInfo);
      closeAllPopups();
    } catch (error) {
      console.log(`Ошибка: ${error}`);
    } finally {
      setButtonTextEditPopup('Сохранить');
    }
  };

  const handleUpdateAvatar = async (data) => {
    try {
      setButtonTextEditPopup('Сохранение...');
      const userInfo = await api.editUserAvatar(data);
      setCurrentUser(userInfo);
      closeAllPopups();
    } catch (error) {
      console.log(`Ошибка: ${error}`);
    } finally {
      setButtonTextEditPopup('Сохранить');
    }
  };

  const handleRegistration = async (data) => {
    try {
      await auth.registration(data);
      setTooltipMessage({
        isSuccess: true,
        text: 'Вы успешно зарегистрировались!',
      });
      navigate('/sign-in', { replace: true });
    } catch (error) {
      setTooltipMessage({
        isSuccess: false,
        text: 'Что-то пошло не так! Попробуйте еще раз',
      });
      console.log(`Ошибка: ${error}`);
    }
  };

  const handleAuthorization = async (data) => {
    try {
      setIsLoading(true);
      const { token } = await auth.authorization(data);
      localStorage.setItem('token', token);
      setUserEmail(data.email);
      setIsLoggedIn(true);
      navigate('/', { replace: true });
    } catch (error) {
      if (error === 401) {
        setTooltipMessage({
          isSuccess: false,
          text: 'Неверный адрес электронной почты или пароль',
        });
      } else {
        setTooltipMessage({
          isSuccess: false,
          text: 'Что-то пошло не так! Попробуйте еще раз',
        });
      }
      setIsLoading(false);
      console.log(`Ошибка: ${error}`);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/sign-in', { replace: true });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      (async () => {
        try {
          const { data: { email } } = await auth.checkTokenValidity(token);
          setUserEmail(email);
          setIsLoggedIn(true);
          navigate('/', { replace: true });
        } catch (error) {
          setIsLoading(false);
          console.log(`Ошибка: ${error}`);
        }
      })();
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      (async () => {
        try {
          const [userData, initialCards] = await Promise.all([
            api.getUserInfo(),
            api.getInitialCards(),
          ]);
          setCurrentUser(userData);
          setCards(initialCards);
        } catch (error) {
          console.log(`Ошибка: ${error}`);
        } finally {
          setIsLoading(false);
        }
      })();
    }
  }, [isLoggedIn]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <>
        {isLoading && <Preloader size="large" />}
        <Header userEmail={userEmail} onSignOut={handleSignOut} />
        <Routes>
          <Route
            path="/"
            element={(
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <>
                  <Main
                    onEditProfile={handleEditProfileClick}
                    onAddPlace={handleAddPlaceClick}
                    onEditAvatar={handleEditAvatarClick}
                    onCardClick={handleCardClick}
                    onCardLike={handleCardLike}
                    onCardDelete={handleCardDelete}
                    cards={cards}
                  />
                  <Footer />
                </>
              </ProtectedRoute>
            )}
          />
          <Route
            path="/sign-up"
            element={<Register onRegister={handleRegistration} />}
          />
          <Route
            path="/sign-in"
            element={<Login onLogin={handleAuthorization} />}
          />
        </Routes>

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          buttonText={buttonTextEditPopup}
        />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          buttonText={buttonTextEditPopup}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
          buttonText={buttonTextAddPopup}
        />

        <PopupWithConfirmation
          isOpen={deletedCard}
          onClose={closeAllPopups}
          onConfirm={handleConfirmationOfDelete}
          buttonText={buttonTextConfirmPopup}
        />

        <ImagePopup
          card={selectedCard}
          onClose={closeAllPopups}
        />

        <InfoTooltip
          tooltipMessage={tooltipMessage}
          onClose={closeAllPopups}
        />
      </>
    </CurrentUserContext.Provider>
  );
};

export default App;
