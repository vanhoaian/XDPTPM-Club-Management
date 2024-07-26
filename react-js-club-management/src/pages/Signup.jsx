import React, { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

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

const SignupForm = styled.form`
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
  width: 100%;
`;

const Button = styled.button`
  background-color: #3498db;
  color: #fff;
  padding: 10px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #2980b9;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const LoginLink = styled.p`
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

const ErrorText = styled.p`
  color: red;
  font-size: 14px;
  margin-bottom: 15px;
`;

const Signup = () => {
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [birthday, setBirthday] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!/^[A-Za-z0-9]+$/.test(username)) {
      errors["username"] = "Mã CLB chỉ bao gồm chữ cái không dấu và số.";
    }

    if (password.length < 8) {
      errors["password"] = "Mật khẩu phải có ít nhất 8 ký tự.";
    }

    if (!/^\d+$/.test(phone)) {
      errors["phone"] = "Số điện thoại không hợp lệ.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !email.endsWith("@gmail.com")) {
      errors["email"] = "Email phải là địa chỉ Gmail hợp lệ.";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      console.log("Thông tin đăng ký không hợp lệ:", {
        username,
        fullname,
        birthday,
        phone,
        email,
        password,
        errors
      });
      return;
    }

    const userData = {
      username,
      fullname,
      birthday,
      phone,
      email,
      password,
    };

    console.log("Dữ liệu gửi đi:", userData);

    try {
      const response = await axios.post("http://localhost:8080/api/account/register", userData);
      const { code, message } = response.data;

      if (code === 200) {
        toast.success(`Đăng ký thành công. Bạn sẽ được chuyển đến trang đăng nhập trong 3 giây.`, {
          position: toast.POSITION.TOP_RIGHT,
        });
        setTimeout(() => {
          navigate("/login");
        }, 3000); // Chờ 3 giây trước khi chuyển hướng
      } else if (code === 409_001) { // Mã lỗi tài khoản đã tồn tại
        toast.error("Tài khoản đã tồn tại. Vui lòng chọn tên tài khoản khác.", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        toast.error(message || "Đã xảy ra lỗi. Vui lòng thử lại.", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra: " + error.response?.data?.message || "Vui lòng thử lại.", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  return (
    <CenteredContainer>
      <FormContainer>
        <Header>Đăng ký</Header>
        <SignupForm onSubmit={handleSubmit}>
          <FormInput
            type="text"
            placeholder="Mã câu lạc bộ"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {errors.username && <ErrorText>{errors.username}</ErrorText>}

          <FormInput
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <ErrorText>{errors.password}</ErrorText>}

          <FormInput
            type="text"
            placeholder="Tên câu lạc bộ"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
          />
          {errors.required && <ErrorText>{errors.required}</ErrorText>}

          <FormInput
            type="date"
            placeholder="Ngày thành lập"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
          />
          {errors.required && <ErrorText>{errors.required}</ErrorText>}

          <FormInput
            type="text"
            placeholder="Số điện thoại"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          {errors.phone && <ErrorText>{errors.phone}</ErrorText>}

          <FormInput
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <ErrorText>{errors.email}</ErrorText>}

          <Button type="submit" disabled={!username || !password || !birthday || !phone || !email}>
            Đăng ký
          </Button>
        </SignupForm>
        <LoginLink>
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
          <p>Chỉ có thể đăng ký tài khoản quản trị, tài khoản thành viên phải do tài khoản quản trị tạo.</p>
        </LoginLink>
      </FormContainer>
    </CenteredContainer>
  );
};

export default Signup;
