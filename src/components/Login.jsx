import useFormValidator from '../hooks/useFormValidator';
import Form from './Form';
import Input from './Input';

const Login = ({ onLogin }) => {
  const {
    inputValues, errorMessages, isValid, handleChange,
  } = useFormValidator();

  const handleSubmit = (evt) => {
    evt.preventDefault();
    onLogin(inputValues);
  };

  return (
    <main>
      <section className="authentication">
        <h2 className="authentication__title">Вход</h2>
        <Form
          name="sign-in"
          buttonText="Войти"
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
            autoComplete="password"
            placeInput="authentication"
            inputValue={inputValues.password}
            errorMessage={errorMessages.password}
            handleChange={handleChange}
          />
        </Form>
      </section>
    </main>
  );
};

export default Login;
