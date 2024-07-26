import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CenteredContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f4f4;
`;

const FormContainer = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 350px;
`;

const Header = styled.h2`
  background-color: #3498db;
  color: #fff;
  margin: 0;
  padding: 20px;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const FormInput = styled.input`
  margin-bottom: 15px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const SubmitButton = styled.button`
  background-color: #3498db;
  color: #fff;
  padding: 10px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #2980b9;
  }
`;

const CreateAccountLink = styled.p`
  text-align: center;
  margin-top: 15px;
  font-size: 14px;
  margin-bottom: 20px;

  a {
    color: #3498db;
    text-decoration: underline;

    &:hover {
      color: #2980b9;
    }
  }
`;

const SelectRole = styled.select`
  margin-bottom: 15px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Login = () => {
  const [clubCode, setClubCode] = useState("");
  const [memberCode, setMemberCode] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem("user");
    if (auth) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login clicked!");

    // Giả lập quá trình đăng nhập thành công
    const fakeUser = {
      clubCode,
      role,
    };
    const fakeAuthToken = "fake-token";

    // Đặt thông tin người dùng và mã thông báo vào localStorage
    localStorage.setItem("user", JSON.stringify(fakeUser));
    localStorage.setItem("token", JSON.stringify(fakeAuthToken));

    // Thông báo thành công
    toast.success("Login Successfully", {
      position: toast.POSITION.TOP_RIGHT,
    });

    // Chuyển hướng dựa trên vai trò của người dùng
    if (role === "admin") {
      navigate("/club/:clubPosts");
    } else {
      navigate("/");
    }
  };

  return (
    <CenteredContainer>
      <FormContainer>
        <Header>Dang nhap</Header>
        <LoginForm onSubmit={handleSubmit}>
          <label>Mã câu lạc bộ</label>
          <FormInput
            type="text"
            placeholder="Mã câu lạc bộ"
            value={clubCode}
            onChange={(e) => setClubCode(e.target.value)}
          />
          <label>Mat khau</label>
          <FormInput
            type="password"
            placeholder="Mat khau"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <SelectRole value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="user">Thanh vien</option>
            <option value="admin">Quan tri vien</option>
          </SelectRole>
          {role === "user" && (
            <><label>Mã thanh vien</label><FormInput
              type="text"
              placeholder="Mã thành viên"
              value={memberCode}
              onChange={(e) => setMemberCode(e.target.value)} /></>
          )}
          <SubmitButton type="submit">Dang nhap</SubmitButton>
        </LoginForm>
        <CreateAccountLink>
          Ban khong co tai khoan? <Link to="/signup">Tao tai khoan quan tri</Link>
          <p>Tai khoan thanh vien chi co the tao boi quan tri vien.</p>
        </CreateAccountLink>
      </FormContainer>
    </CenteredContainer>
  );
};

export default Login;
