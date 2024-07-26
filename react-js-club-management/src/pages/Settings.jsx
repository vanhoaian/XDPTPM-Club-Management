import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f4f4f4;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  flex: 1;
  margin-right: 20px;
  font-weight: bold;
`;

const Value = styled.p`
  flex: 2;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  font-size: 16px;
  margin: 10px;
`;

const Button = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }

  &:disabled {
    background-color: #c1c1c1;
    cursor: not-allowed;
  }
`;

const Settings = () => {
  const [user, setUser] = useState({});
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("user"));
    if (auth) {
      setUser(auth);
    }
  }, []);

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      toast.warning("Mật khẩu mới và xác nhận mật khẩu không khớp", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    if (password === newPassword) {
      toast.warning("Mật khẩu mới giống mật khẩu cũ", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    if (password !== user.password) {
      toast.warning("Mật khẩu hiện tại không chính xác", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/account/changePassword', {
        username: user.username,
        password: newPassword,
      });

      if (response.data.code === 200) {
        toast.success("Thay đổi mật khẩu thành công", {
          position: toast.POSITION.TOP_RIGHT,
        });
        navigate("/");
      } else {
        toast.error(`Lỗi: ${response.data.message}`, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      toast.error(`Lỗi khi thay đổi mật khẩu: ${error.message}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const isButtonDisabled = !password || !newPassword || !confirmNewPassword;

  return (
    <Container>
      <Section>
        <Row>
          <Label>Tên đăng nhập:</Label>
          <Value>{user.username}</Value>
        </Row>
        <Row>
          <Label>Họ và tên:</Label>
          <Value>{user.fullname}</Value>
        </Row>
        <Row>
          <Label>Email:</Label>
          <Value>{user.email}</Value>
        </Row>
        <Row>
          <Label>Số điện thoại:</Label>
          <Value>{user.phone}</Value>
        </Row>
        <Row>
          <Label>Ngày sinh:</Label>
          <Value>{new Date(user.birthday).toLocaleDateString()}</Value>
        </Row>
        <Row>
          <Label>Đội/Ban/Nhóm:</Label>
          <Value>{user.team}</Value>
        </Row>
        <Row>
          <Label>Chức vụ:</Label>
          <Value>{user.position}</Value>
        </Row>
      </Section>
      <Section>
        <h2>Đổi mật khẩu</h2>
        <Input
          type="password"
          placeholder="Mật khẩu hiện tại"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Mật khẩu mới"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Xác nhận mật khẩu mới"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
        />
        <Button onClick={handleChangePassword} disabled={isButtonDisabled}>Đổi mật khẩu</Button>
      </Section>
    </Container>
  );
};

export default Settings;
