import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { CgProfile } from "react-icons/cg";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { format, parseISO } from 'date-fns';
import vi from 'date-fns/locale/vi';
import axios from 'axios';

const CardContainer = styled.div`
  width: 95%;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  margin: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: white;
`;

const LogoAndName = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ClubName = styled.h3`
  margin: 0;
`;

const Description = styled.p`
  margin: 16px 0;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
`;

const ActionButton = styled.button`
  background-color: ${({ active }) => (active ? "#2ecc71" : "#3498db")};
  border: none;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${({ active }) => (active ? "#27ae60" : "#2980b9")};
  }
`;

const StyledInput = styled.input`
  width: 80%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 20px;
  margin: 10px 0;

  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const CommentsContainer = styled.div`
  margin-top: 20px;
  padding: 3px;
`;

const CommentBox = styled.div`
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 10px;
`;

const CommentAuthor = styled.span`
  font-weight: bold;
`;

const formatDateTime = (dateTime) => {
  const date = parseISO(dateTime);
  return {
    formattedDate: format(date, 'dd-MM-yyyy', { locale: vi }),
    formattedTime: format(date, 'HH:mm', { locale: vi }),
    weekday: format(date, 'EEEE', { locale: vi }),
  };
};

const statusLabels = {
  Phép_nghỉ: 'Phép nghỉ',
  Phép_muộn: 'Phép muộn',
  Tham_gia: 'Tham gia',
  Không_tham_gia: 'Không tham gia',
  Nghỉ_không_phép: 'Nghỉ không phép'
};

const Posts = ({
  id,
  title,
  description,
  startTime,
  endTime,
  style,
}) => {
  const [isCommentVisible, setCommentVisible] = useState(false);
  const [comment, setComment] = useState("");
  const [username, setUsername] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const auth = localStorage.getItem("user");
    if (auth) {
      const parsedAuth = JSON.parse(auth);
      setUsername(parsedAuth.username);
    } else {
      console.log('No user data found');
    }
  }, []);

  const handleStatusChange = async (newStatus) => {
    updateNote(comment);

    try {
      await axios.post('http://localhost:8080/api/events/changeStatus', {
        username: username,
        idEvent: id,
        status: newStatus,
        note: comment
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      updateStatus(id, newStatus);
      if (newStatus === 'Phép_muộn' || newStatus === 'Nghỉ_không_phép') {
        setCommentVisible(true);
      } else {
        setCommentVisible(false);
        updateNote("");
      }
      setSuccessMessage('Status updated successfully!');
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const startTimeFormatted = formatDateTime(startTime);
  const endTimeFormatted = formatDateTime(endTime);

  return (
    <CardContainer>
      <LogoAndName>
        <CgProfile style={{ fontSize: "3rem" }} />
        <ClubName>{style || <Skeleton />}</ClubName>
      </LogoAndName>

      <h3>{title || <Skeleton />}</h3>
      <Description>{description || <Skeleton count={8} />}</Description>

      <p><strong>Thời gian bắt đầu:</strong> {startTimeFormatted.formattedTime}, {startTimeFormatted.weekday}, {startTimeFormatted.formattedDate}</p>
      <p><strong>Thời gian kết thúc:</strong> {endTimeFormatted.formattedTime}, {endTimeFormatted.weekday}, {endTimeFormatted.formattedDate}</p>


      {isCommentVisible && (
        <div>
          <StyledInput
            type="text"
            placeholder={`Lý do ${status === 'Nghỉ_không_phép' ? 'nghỉ' : 'muộn'}...`}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <ActionButton onClick={() => handleStatusChange(status)}>
            Gửi
          </ActionButton>
        </div>
      )}

      {note && (
        <p>
          {status === 'Nghỉ_không_phép' ? 'Lý do nghỉ:' : 'Lý do muộn:'} {note}
        </p>
      )}

      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
    </CardContainer>
  );
};

export default Posts;
