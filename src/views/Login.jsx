import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { loginUser } from "../services/supabaseClient";
import { saveToLocalStorage } from "../utils/localStorage";
import AuthContext from "../contexts/AuthContext";
import { Link } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  //const { setUser } = useContext(AuthContext);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

 /* const handleLogin = async () => {
    const { data, error } = await loginUser(username, password);
    if (error || !data) {
      alert("Usuário ou senha inválidos!");
    } else {
      setUser(data);
      saveToLocalStorage("user", data);
      navigate("/home");
    }
  };*/

  const handleLogin = async () => {
    try {
      const { data, error } = await loginUser(username, password);
      if (error || !data) {
        alert('Usuário ou senha inválidos!');
        return;
      }

      login(data); // Atualiza o estado global com os dados do usuário
      navigate('/home'); // Redireciona para a página inicial
    } catch (err) {
      console.error('Erro ao tentar fazer login:', err);
      alert('Erro ao tentar fazer login. Tente novamente.');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box mt={10} display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h5">Login</Typography>
        <TextField
          fullWidth
          margin="normal"
          label="Usuário"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          type="password"
          label="Senha"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleLogin}
        >
          Entrar
        </Button>
      </Box>

      <Box mt={2}>
        <Typography variant="body2">
          Não tem uma conta? <Link to="/register">Cadastre-se</Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;
