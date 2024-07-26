import Heading from "../ui/Heading";
import Row from "../ui/Row";
import Posts from "../ui/Posts";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import SearchBar from "../ui/Searchbar";
import Spinner from "../ui/Spinner";
import ReactPaginate from "react-paginate";
import "./Pagination.css";

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

const PaginationButton = styled.a`
  cursor: pointer;
  margin: 0 5px;
  padding: 8px 16px;
  background-color: #3498db;
  color: #fff;
  text-decoration: none;
  border-radius: 4px;

  &:hover {
    background-color: #2980b9;
  }
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const StatusButton = styled.button`
  background-color: ${({ active }) => (active ? "#2ecc71" : "#3498db")};
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  margin: 0 5px;

  &:hover {
    background-color: #2980b9;
  }
`;

function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageNumber, setPageNumber] = useState(0);
  const postsPerPage = 5;

  const auth = JSON.parse(localStorage.getItem("user"));
  const userID = auth._id;

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  useEffect(() => {
    // Uncomment when using real data
    // const fetchUserDetails = async () => {
    //   try {
    //     const response = await fetch(
    //       `http://localhost:8000/user/getUserDetails/like/save?userID=${userID}`,
    //       {
    //         headers: {
    //           "Content-Type": "application/json",
    //           authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
    //         },
    //       }
    //     );

    //     if (!response.ok) {
    //       throw new Error(`HTTP error! Status: ${response.status}`);
    //     }

    //     const userData = await response.json();
    //     setLikedPostsSet(new Set(userData.likedPostIds));
    //     setSavedPostsSet(new Set(userData.savedPostIds));
    //     localStorage.setItem("userData", JSON.stringify(userData));
    //   } catch (error) {
    //     console.error("Error fetching user details:", error.message);
    //   }
    // };

    // fetchUserDetails();

    // Fake data for testing
    const fakePosts = Array.from({ length: 20 }, (_, index) => ({
      _id: `post-${index + 1}`,
      title: `Bài viết ${index + 1}`,
      description: `Mô tả cho bài viết ${index + 1}`,
      startTime: new Date(`2024-07-12`),
      endTime: new Date(`2024-07-16`),
      style: `Su kien hang ngay`,
      status: `late`,
      note: `123`,
    }));

    setData(fakePosts);
    setLoading(false);
  }, []);

  const pageCount = Math.ceil(data.length / postsPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const updateStatus = (postId, status) => {
    setData(prevData =>
      prevData.map(post =>
        post._id === postId ? { ...post, status } : post
      )
    );
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Lich su kien</Heading>
      </Row>
      <Row>
        { <SearchBar onSearch={handleSearch} /> }
      </Row>
      <Row>
        {data
          .slice(pageNumber * postsPerPage, (pageNumber + 1) * postsPerPage)
          .map((post) => (
            <Posts
              key={post._id}
              id={post._id}
              title={post.title}
              description={post.description}
              style={post.style} // Changed to event type
              note={post.note}
              status={post.status}
              updateStatus={updateStatus}
            >
              <StatusButton
                active={post.status === 'attend'}
                onClick={() => updateStatus(post._id, 'attend')}
              >
                Tham gia
              </StatusButton>
              <StatusButton
                active={post.status === 'miss'}
                onClick={() => updateStatus(post._id, 'miss')}
              >
                Phép nghỉ
              </StatusButton>
              <StatusButton
                active={post.status === 'late'}
                onClick={() => updateStatus(post._id, 'late')}
              >
                Phép muộn
              </StatusButton>
            </Posts>
          ))}
      </Row>
      <PaginationWrapper>
        <PaginationContainer>
          <ReactPaginate
            nextLabel="next >"
            onPageChange={changePage}
            pageCount={pageCount}
            previousLabel="< previous"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakLabel="..."
            breakClassName="page-item"
            breakLinkClassName="page-link"
            containerClassName="pagination"
            activeClassName="active"
            renderOnZeroPageCount={null}
          />
        </PaginationContainer>
      </PaginationWrapper>
    </>
  );
}

export default Dashboard;
