import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { CgProfile } from "react-icons/cg";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CardContainer = styled.div`
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  margin: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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

const Posts = ({
  id,
  title,
  description,
  coordinators = [],
  clubName,
  updateStatus,
  status,
  note,
  setNote, // Nhận biến setNote từ props
}) => {
  const [isCommentVisible, setCommentVisible] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const auth = localStorage.getItem("user");

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:8000/user/comment/getComments/${id}`, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [isCommentVisible]);

  const addComment = async () => {
    const userId = JSON.parse(auth)._id;
    const name = JSON.parse(auth).name;

    try {
      const response = await fetch(`http://localhost:8000/user/comment/addComment/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
        body: JSON.stringify({ userId, name, comment }),
      });

      if (response.ok) {
        setComment("");
        fetchComments();
        setNote(comment); // Cập nhật biến note
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleStatusChange = (newStatus) => {
    updateStatus(id, newStatus);
    if (newStatus === 'late' || newStatus === 'miss') {
      setCommentVisible(true);
    } else {
      setCommentVisible(false);
      setNote(""); // Reset note khi chọn trạng thái khác
    }
  };

  return (
    <CardContainer>
      <LogoAndName>
        <CgProfile style={{ fontSize: "3rem" }} />
        <ClubName>{clubName || <Skeleton />}</ClubName>
      </LogoAndName>

      <h3>{title || <Skeleton />}</h3>
      <Description>{description || <Skeleton count={8} />}</Description>

      {coordinators.map((cor, key) => (
        <div key={cor.id}>
          <p>Contact {key + 1}: {cor.name} | {cor.email} | {cor.phone}</p>
        </div>
      ))}

      <Actions>
        <ActionButton
          active={status === 'attend'}
          onClick={() => handleStatusChange('attend')}
        >
          Tham gia
        </ActionButton>
        <ActionButton
          active={status === 'late'}
          onClick={() => handleStatusChange('late')}
        >
          Phép muộn
        </ActionButton>
        <ActionButton
          active={status === 'miss'}
          onClick={() => handleStatusChange('miss')}
        >
          Phép nghỉ
        </ActionButton>
      </Actions>

      {isCommentVisible && (
        <div>
          <StyledInput
            type="text"
            placeholder={`Lý do ${status === 'miss' ? 'nghỉ' : 'muộn'}...`}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <ActionButton onClick={addComment}>Add</ActionButton>

          {comments.length > 0 && (
            <CommentsContainer>
              <h3>Top Comments</h3>
              {comments.slice(0, 2).map((c) => (
                <CommentBox key={c._id}>
                  <CommentAuthor>{c.name}:</CommentAuthor> {c.comment}
                  <span style={{ float: "right", color: "#888" }}>
                    {new Date(c.date).toLocaleDateString()} {new Date(c.date).toLocaleTimeString()}
                  </span>
                </CommentBox>
              ))}
            </CommentsContainer>
          )}
        </div>
      )}

      {/* Hiển thị lý do nghỉ (muộn) */}
      {note && (
        <p>
          {status === 'miss' ? 'Lý do nghỉ:' : 'Lý do muộn:'} {note}
        </p>
      )}
    </CardContainer>
  );
};

export default Posts;
