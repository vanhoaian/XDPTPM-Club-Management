import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import axios from "axios";

const PageContainer = styled.div`
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
  background-color: #f2f2f2;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
`;

const FormContainer = styled.form`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin: auto; /* Added to center the form */
`;

const InputGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const SubmitButton = styled.button`
  grid-column: span 2;
  width: 100%;
  padding: 10px;
  background-color: #3498db;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2980b9;
  }
`;

const AddClubUser = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    birthday: "",
    phone: "",
    email: "",
    team: "",
    position: "",
    memberCode: "", // New field for member code
  });
  const navigate = useNavigate();
  const adminUsername = JSON.parse(localStorage.getItem("user")).username; // Get admin username from localStorage

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const formatPasswordFromBirthday = (birthday) => {
    const date = new Date(birthday);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());
    return `${day}${month}${year}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullname, birthday, phone, email, team, position, memberCode } = formData;
    const username = `${adminUsername}-${memberCode}`;
    const password = formatPasswordFromBirthday(birthday);
    const role = "user";
    const clubId = adminUsername;

    const dataToSend = {
      username,
      fullname,
      password,
      birthday,
      phone,
      email,
      role,
      team,
      position,
      clubId,
    };

    console.log("Form submitted:", dataToSend);

    try {
      const response = await axios.post("http://localhost:8080/api/users/addUser", dataToSend);

      if (response.status !== 200) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      console.log("Success:", response.data.message);
      toast.success("Club Admin Created", {
        position: toast.POSITION.TOP_RIGHT,
        onClose: () => {
          setTimeout(() => {
            navigate("/login");
          }, 5000);
        },
      });
    } catch (error) {
      console.error("Error adding club:", error.message);
      toast.error(error.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  return (
    <PageContainer>
      <h1>Tạo tài khoản thành viên</h1>
      <FormContainer onSubmit={handleSubmit}>
      <InputGroup>
          <Label>Mã thành viên:</Label>
          <Input
            type="text"
            name="memberCode"
            value={formData.memberCode}
            onChange={handleChange}
            required
          />
        </InputGroup>
        <InputGroup>
          <Label>Họ và tên:</Label>
          <Input
            type="text"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            required
          />
        </InputGroup>
        <InputGroup>
          <Label>Ngày sinh:</Label>
          <Input
            type="date"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
            required
          />
        </InputGroup>
        <InputGroup>
          <Label>Số điện thoại:</Label>
          <Input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </InputGroup>
        <InputGroup>
          <Label>Email:</Label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </InputGroup>
        <InputGroup>
          <Label>Nhóm/Ban/Tổ:</Label>
          <Input
            type="text"
            name="team"
            value={formData.team}
            onChange={handleChange}
            required
          />
        </InputGroup>
        <InputGroup>
          <Label>Chức vụ:</Label>
          <Input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            required
          />
        </InputGroup>
        <SubmitButton type="submit">Tạo thành viên</SubmitButton>
      </FormContainer>
    </PageContainer>
  );
};

export default AddClubUser;
