import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const PageContainer = styled.div`
  max-width: 600px;
  margin: auto;
`;

const FormContainer = styled.div`
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
`;

const InputGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const AddButton = styled.button`
  padding: 10px 20px;
  background-color: #3498db;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  resize: vertical;
`;

const AddClubPost = () => {
  const [titleEvent, setTitleEvent] = useState("");
  const [descriptionEvent, setDescriptionEvent] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [eventStyle, setEventStyle] = useState("");
  const [eventType, setEventType] = useState("");
  const navigate = useNavigate();
  const auth = localStorage.getItem("user");

  const handleAddPost = async () => {
    const { clubName, _id: adminID } = JSON.parse(auth);
    const eventType = null;

    
    try {
      const postData = {
        adminID,
        clubId: clubName,
        titleEvent,
        descriptionEvent,
        startTime,
        endTime,
        eventStyle,
        eventType,
      };
      const response = await axios.post("http://localhost:8080/api/events/addEvent", postData, {
        headers: {
        },
      });

      console.log("Post added successfully:", response.data);
      toast.success("Post Created successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });

      navigate("/club/:clubPosts");
    } catch (error) {
      console.error("Error adding post:", error.message);
      toast.error("Error adding post", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  return (
    <PageContainer>
      <h1>Add Club Post</h1>
      <FormContainer>
        <InputGroup>
          <Label>Title:</Label>
          <Input
            type="text"
            value={titleEvent}
            onChange={(e) => setTitleEvent(e.target.value)}
          />
        </InputGroup>
        <InputGroup>
          <Label>Club Name:</Label>
          <Input
            type="text"
            value={JSON.parse(auth).clubName}
            disabled
          />
        </InputGroup>
        <InputGroup>
          <Label>Description:</Label>
          <Textarea
            value={descriptionEvent}
            onChange={(e) => setDescriptionEvent(e.target.value)}
          />
        </InputGroup>
        <InputGroup>
          <Label>Start Time:</Label>
          <Input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </InputGroup>
        <InputGroup>
          <Label>End Time:</Label>
          <Input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </InputGroup>
        <InputGroup>
          <Label>Event Style:</Label>
          <Select
            value={eventType}
            onChange={(e) => setEventStyle(e.target.value)}
          >
            <option value="">Select Event Type</option>
            <option value="Sự kiện không bắt buộc">Sự kiện không bắt buộc</option>
            <option value="Sự kiện bắt buộc">Sự kiện bắt buộc</option>
            <option value="Sự kiện phải đăng ký">Sự kiện phải đăng ký</option>
          </Select>
        </InputGroup>
        <AddButton onClick={handleAddPost}>Add Post</AddButton>
      </FormContainer>
    </PageContainer>
  );
};

export default AddClubPost;
