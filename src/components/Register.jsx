import { Link } from 'react-router-dom';
import useFormValidator from '../hooks/useFormValidator';
import Form from './Form';
import Input from './Input';

const Register = ({ onRegister }) => {
  const {
    inputValues, errorMessages, isValid, handleChange,
  } = useFormValidator();

  const handleSubmit = (evt) => {
    evt.preventDefault();
    onRegister(inputValues);
  };

  return (
    <main>
      <section className="authentication">
        <h2 className="authentication__title">Регистрация</h2>
        <Form
          name="sign-up"
          buttonText="Зарегистрироваться"
          onSubmit={handleSubmit}
          placeForm="authentication"
          isValid={isValid}
        >
          <Input
            type="email"
            placeholder="Email"
            name="email"
            minLength="2"
            maxLength="30"
            placeInput="authentication"
            inputValue={inputValues.email}
            errorMessage={errorMessages.email}
            handleChange={handleChange}
          />
          <Input
            type="password"
            placeholder="Пароль"
            name="password"
            minLength="6"
            placeInput="authentication"
            inputValue={inputValues.password}
            errorMessage={errorMessages.password}
            handleChange={handleChange}
          />
        </Form>
        <p className="authentication__paragraph">
          Уже зарегистрированы?
          {' '}
          <Link
            className="authentication__link link-hover"
            to="/sign-in"
          >
            Войти
          </Link>
        </p>
      </section>
    </main>
  );
};

export default Register;
