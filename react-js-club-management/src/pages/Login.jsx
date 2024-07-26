import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from 'js-cookie'; // Thư viện js-cookie để xử lý cookie

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

  &.error {
    border-color: red;
  }
`;

const ErrorText = styled.p`
  color: red;
  margin: 0;
  font-size: 14px;
  margin-bottom: 10px;
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

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
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
  const [role, setRole] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem("user");
    if (auth) {
      navigate("/");
    }
  }, [navigate]);

  const validate = () => {
    const errors = {};
    const codeRegex = /^[a-zA-Z0-9]+$/; // Chỉ cho phép chữ cái và số

    if (!clubCode || !codeRegex.test(clubCode)) {
      errors.clubCode = "Mã câu lạc bộ chỉ được nhập chữ cái không dấu và số";
    }

    if (role === "user" && (!memberCode || !codeRegex.test(memberCode))) {
      errors.memberCode = "Mã thành viên chỉ được nhập chữ cái không dấu và số";
    }

    if (password.length < 8) {
      errors.password = "Mật khẩu phải có ít nhất 8 ký tự";
    }

    if (!role) {
      errors.role = "Bạn phải chọn vai trò";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    console.log("Login clicked!");

    // Tạo username dựa trên role
    const username = role === "admin" ? clubCode : `${clubCode}-${memberCode}`;
    console.log("Username:", username);

    try {
      // Gửi yêu cầu đăng nhập đến API
      await axios.post("http://localhost:8080/api/account/login", {
        username,
        password,
        role
      });

      // Gửi yêu cầu để lấy thông tin người dùng
      const response = await axios.get(`http://localhost:8080/api/users/${username}`);
      console.log("API Response:", response.data);

      // Trích xuất dữ liệu từ phản hồi
      const userData = response.data.data; // Lấy dữ liệu từ trường <data>
      console.log("User Data:", userData);

      // Lưu thông tin người dùng vào localStorage
      localStorage.setItem("user", JSON.stringify(userData));

      // Lưu quyền đăng nhập vào cookie
      Cookies.set('loginRole', role, { expires: 7 }); // Cookie hết hạn sau 7 ngày

      // Thông báo thành công
      toast.success(`Xin chào ${userData.fullname}. Đăng nhập thành công!`, {
        position: toast.POSITION.TOP_RIGHT,
      });

      // Chuyển hướng dựa trên vai trò của người dùng
      if (userData.role === "admin") {
        navigate("/club/:clubPosts");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      toast.error("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  return (
    <CenteredContainer>
      <FormContainer>
        <Header>Đăng nhập</Header>
        <LoginForm onSubmit={handleSubmit}>
          <label>Mã câu lạc bộ</label>
          <FormInput
            type="text"
            placeholder="Mã câu lạc bộ"
            value={clubCode}
            onChange={(e) => setClubCode(e.target.value)}
            className={errors.clubCode ? "error" : ""}
          />
          {errors.clubCode && <ErrorText>{errors.clubCode}</ErrorText>}

          <label>Mật khẩu</label>
          <FormInput
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={errors.password ? "error" : ""}
          />
          {errors.password && <ErrorText>{errors.password}</ErrorText>}

          <SelectRole value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">Chọn vai trò</option>
            <option value="user">Thành viên</option>
            <option value="admin">Quản trị viên</option>
          </SelectRole>
          {errors.role && <ErrorText>{errors.role}</ErrorText>}

          {role === "user" && (
            <>
              <label>Mã thành viên</label>
              <FormInput
                type="text"
                placeholder="Mã thành viên"
                value={memberCode}
                onChange={(e) => setMemberCode(e.target.value)}
                className={errors.memberCode ? "error" : ""}
              />
              {errors.memberCode && <ErrorText>{errors.memberCode}</ErrorText>}
            </>
          )}

          <SubmitButton type="submit" disabled={!role || !clubCode || !password || (role === "user" && !memberCode)}>
            Đăng nhập
          </SubmitButton>
        </LoginForm>
        <CreateAccountLink>
          Bạn không có tài khoản? <Link to="/signup">Tạo tài khoản quản trị</Link>
          <p>Tài khoản thành viên chỉ có thể tạo bởi quản trị viên.</p>
        </CreateAccountLink>
      </FormContainer>
    </CenteredContainer>
  );
};

export default Login;
