import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import ReactPaginate from "react-paginate";
import axios from "axios";
import { format } from 'date-fns'; // Import date-fns để định dạng ngày

// Styled components for table and pagination
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const Th = styled.th`
  padding: 10px;
  background-color: #f2f2f2;
  text-align: left;
`;

const Td = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
`;

const Button = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  margin-right: 5px;

  &:hover {
    background-color: #45a049;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const Label = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin: 10px 0;
`;

const AdminRow = styled.tr`
  background-color: #f9f9f9;
  font-weight: bold;
`;

const ClubMember = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const clubsPerPage = 10; // Hiển thị 10 dữ liệu mỗi trang

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("user"));
    if (auth && auth.username) {
      fetchUsers(auth.username);
    }
    console.log("Authenticated username:", auth?.username);
  }, []);

  const fetchUsers = async (username) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/users/clubMember/${username}`
      );
      console.log("Fetched response:", response.data);

      // Cập nhật state với danh sách người dùng từ thuộc tính 'data'
      let sortedUsers = response.data.data.sort((a, b) => a.username.localeCompare(b.username));

      // Set state với dữ liệu đã sắp xếp
      setUsers(sortedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Lỗi khi lấy dữ liệu, vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  

  // Tính số trang dựa trên tổng số dữ liệu
  const pageCount = Math.ceil(users.filter(user => user.role !== 'admin').length / clubsPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  return (
    <div>
      {isLoading ? (
        <div>Đang tải dữ liệu...</div>
      ) : (
        <>
          <Label>Thông tin Câu lạc bộ</Label>
          <Table>
            <thead>
              <tr>
                <Th>Mã câu lạc bộ</Th>
                <Th>Họ và tên</Th>
                <Th>Email</Th>
                <Th>Ngày thành lập</Th> {/* Thay đổi tên cột */}
                <Th>Số điện thoại</Th>
                <Th>Hành động</Th>
              </tr>
            </thead>
            <tbody>
              {users
                .filter(user => user.role === 'admin') // Hiển thị admin lên đầu
                .map((user) => (
                  <tr key={user.username}>
                    <Td>{user.clubId}</Td> {/* Hiển thị Mã câu lạc bộ */}
                    <Td>{user.fullname}</Td>
                    <Td>{user.email}</Td>
                    <Td>{format(new Date(user.birthday), 'dd/MM/yyyy')}</Td> {/* Định dạng ngày */}
                    <Td>{user.phone}</Td>
                    <Td>
                      <Button onClick={() => navigate(`/details/${user.username}`)}>
                        Xem Chi Tiết
                      </Button>
                      <Button onClick={() => navigate(`/edit/${user.username}`)}>
                        Sửa
                      </Button>
                    </Td>
                  </tr>
                ))}
            </tbody>
          </Table>

          <Label>Thông tin Thành viên</Label>
          <Table>
            <thead>
              <tr>
                <Th>Mã thành viên</Th>
                <Th>Họ và tên</Th>
                <Th>Email</Th>
                <Th>Ngày sinh</Th>
                <Th>Số điện thoại</Th>
                <Th>Ban/Tổ/Nhóm</Th>
                <Th>Chức vụ</Th>
                <Th>Hành động</Th>
              </tr>
            </thead>
            <tbody>
              {users
                .filter(user => user.role !== 'admin') // Hiển thị các thành viên còn lại
                .slice(pageNumber * clubsPerPage, (pageNumber + 1) * clubsPerPage)
                .map((user) => (
                  <tr key={user.username}>
                    <Td>{user.username}</Td>
                    <Td>{user.fullname}</Td>
                    <Td>{user.email}</Td>
                    <Td>{format(new Date(user.birthday), 'dd/MM/yyyy')}</Td> {/* Định dạng ngày */}
                    <Td>{user.phone}</Td>
                    <Td>{user.team}</Td>
                    <Td>{user.position}</Td>
                    <Td>
                      <Button onClick={() => navigate(`/edit/${user.username}`)}>
                        Sửa
                      </Button>
                      <Button onClick={() => console.log("Xóa", user.username)}>
                        Xóa
                      </Button>
                    </Td>
                  </tr>
                ))}
            </tbody>
          </Table>
          <PaginationWrapper>
            <PaginationContainer>
              <ReactPaginate
                nextLabel="Tiếp theo >"
                onPageChange={changePage}
                pageCount={pageCount}
                previousLabel="< Trở về"
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
      )}
    </div>
  );
};

export default ClubMember;
