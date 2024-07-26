import React, { useState } from "react";
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

const FormInputWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  width: 100%;
`;

const InputField = styled(FormInput)`
  flex: 1;
  margin-bottom: 0;
`;

const Button = styled.button`
  background-color: #3498db;
  color: #fff;
  padding: 10px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
  flex: 1; /* Chiếm hết không gian còn lại */

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

const SuccessIcon = styled.span`
  color: green;
  font-size: 20px;
  margin-left: 10px;
`;

const Signup = () => {
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [birthday, setBirthday] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const navigate = useNavigate();

  const validateClubCode = (code) => /^[A-Z0-9]+$/.test(code);
  const validateBirthday = (date) => new Date(date) < new Date();

  const handleSendCode = async () => {
    try {
      let response = await fetch("http://localhost:8000/send-code", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });

      response = await response.json();

      if (response.success) {
        setVerificationCode(response.code);
        toast.success("Mã xác minh đã được gửi đến email của bạn.", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        toast.error("Gửi mã xác minh thất bại.", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const handleVerifyCode = async () => {
    if (emailCode.length === 6) {
      try {
        let response = await fetch("http://localhost:8000/verify-code", {
          method: "POST",
          body: JSON.stringify({ email, emailCode }),
          headers: { "Content-Type": "application/json" },
        });

        response = await response.json();

        if (response.success) {
          setIsEmailVerified(true);
          toast.success("Xác minh email thành công.", {
            position: toast.POSITION.TOP_RIGHT,
          });
        } else {
          setIsEmailVerified(false);
          toast.error("Mã xác minh không đúng. Vui lòng thử lại.", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      } catch (error) {
        setIsEmailVerified(false);
        toast.error("Có lỗi xảy ra. Vui lòng thử lại.", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } else {
      setIsEmailVerified(false);
      toast.error("Mã xác minh phải có 6 ký tự.", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEmailVerified) {
      toast.error("Vui lòng xác minh email trước khi đăng ký.", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    if (!validateClubCode(username)) {
      toast.error("Mã CLB không hợp lệ. Vui lòng nhập lại.", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    if (!validateBirthday(birthday)) {
      toast.error("Ngày thành lập phải là quá khứ. Vui lòng nhập lại.", {
        position: toast.POSITION.TOP_RIGHT,
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

    let result = await fetch("http://localhost:8000/register", {
      method: "POST",
      body: JSON.stringify(userData),
      headers: { "Content-Type": "application/json" },
    });

    result = await result.json();

    if (result.auth) {
      localStorage.setItem("user", JSON.stringify(result.user));
      localStorage.setItem("token", JSON.stringify(result.auth));
      toast.success("Đăng ký thành công", {
        position: toast.POSITION.TOP_RIGHT,
      });
      navigate("/");
    } else {
      toast.warning(result.error, {
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
          <FormInput
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormInput
            type="text"
            placeholder="Tên câu lạc bộ"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
          />
          <FormInput
            type="date"
            placeholder="Ngày thành lập"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
          />
          <FormInput
            type="text"
            placeholder="Số điện thoại"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <FormInput
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormInputWrapper>
            <InputField
              type="text"
              placeholder="Nhập mã xác minh"
              value={emailCode}
              onChange={(e) => setEmailCode(e.target.value)}
            />
            <Button type="button" onClick={handleSendCode}>
              Gửi mã
            </Button>
            <Button type="button" onClick={handleVerifyCode}>
              Kiểm tra
            </Button>
            {isEmailVerified && <SuccessIcon>✔️</SuccessIcon>}
          </FormInputWrapper>
          <Button type="submit" disabled={!isEmailVerified}>
            Đăng ký
          </Button>
        </SignupForm>
        <LoginLink>
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
          <p>Chi co the dang ky tai khoan quan tri, tai khoan thanh vien phai do tai khoan quan tri tao.</p>
        </LoginLink>
      </FormContainer>
    </CenteredContainer>
  );
};

export default Signup;
