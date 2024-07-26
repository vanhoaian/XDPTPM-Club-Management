import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import ReactPaginate from "react-paginate";
import "./Pagination.css";
import { format, startOfMonth, endOfMonth, parseISO, isWithinInterval, addMonths, subMonths } from 'date-fns';

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

const JoinButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  cursor: pointer;

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

const InfoContainer = styled.div`
  background-color: #f2f2f2;
  padding: 15px;
  margin: 20px 0;
  border-radius: 5px;
`;

const InfoItem = styled.p`
  margin: 5px 0;
  font-weight: bold;
`;

const Button = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  margin: 5px;

  &:hover {
    background-color: #2980b9;
  }
`;

const MonthInput = styled.input`
  width: 150px;
  padding: 8px;
  margin: 5px;
  border: 1px solid #3498db;
  border-radius: 4px;
`;

// Bản đồ trạng thái
const statusMap = {
  "Phép_nghỉ": "Phép nghỉ",
  "Phép_muộn": "Phép muộn",
  "Nghỉ_không_phép": "Nghỉ không lý do",
};

const Attend = () => {
  const [admins, setAdmins] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalLeave, setTotalLeave] = useState(0);
  const [totalLate, setTotalLate] = useState(0);
  const [totalUnexcusedLeave, setTotalUnexcusedLeave] = useState(0);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthInput, setMonthInput] = useState(format(currentMonth, "MM/yyyy"));
  const clubsPerPage = 5;

  useEffect(() => {
    // Lấy dữ liệu sự kiện từ localStorage
    const storedData = JSON.parse(localStorage.getItem(".event")) || [];

    if (!Array.isArray(storedData)) {
      toast.error("No event data found."); // Thông báo lỗi nếu dữ liệu không phải là mảng
      return;
    }

    console.log(storedData);

    const startOfCurrentMonth = startOfMonth(currentMonth);
    const endOfCurrentMonth = endOfMonth(currentMonth);

    let totalLeave = 0;
    let totalLate = 0;
    let totalUnexcusedLeave = 0;

    const filteredData = storedData.filter(event => {
      const startTime = parseISO(event.event?.startTime);
      return isWithinInterval(startTime, { start: startOfCurrentMonth, end: endOfCurrentMonth }) &&
             ["Phép_nghỉ", "Phép_muộn", "Nghỉ_không_phép"].includes(event.userEvent?.status);
    });

    console.log(filteredData);
    setAdmins(filteredData);

    filteredData.forEach((event) => {
      switch (event.userEvent?.status) {
        case "Phép_nghỉ":
          totalLeave += 1;
          break;
        case "Phép_muộn":
          totalLate += 1;
          break;
        case "Nghỉ_không_phép":
          totalUnexcusedLeave += 1;
          totalLeave += 1;
          break;
        default:
          break;
      }
    });

    setTotalLeave(totalLeave);
    setTotalLate(totalLate);
    setTotalUnexcusedLeave(totalUnexcusedLeave);
  }, [currentMonth]);

  const pageCount = Math.ceil(admins.length / clubsPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const handleMonthChange = (direction) => {
    setCurrentMonth(prevMonth => {
      const newMonth = direction === "next" ? addMonths(prevMonth, 1) : subMonths(prevMonth, 1);
      return newMonth;
    });
  };

  const handleMonthInputChange = (e) => {
    setMonthInput(e.target.value);
  };

  // Hàm xử lý khi nhấn phím Enter trong input tháng
  const handleMonthInputSubmit = (e) => {
    if (e.key === 'Enter') {
      const [month, year] = monthInput.split('/').map(Number);
      if (month >= 1 && month <= 12 && year) {
        setCurrentMonth(new Date(year, month - 1));
      } else {
        toast.error("Invalid month/year format. Use MM/yyyy.", { position: toast.POSITION.TOP_RIGHT });
      }
    }
  };

  return (
    <div>
      <h2>Thông tin tham gia sự kiện</h2>
      <InfoContainer>
        <InfoItem>Tổng buổi nghỉ trong tháng: {totalLeave}</InfoItem>
        <InfoItem>Tổng buổi đến muộn trong tháng: {totalLate}</InfoItem>
        <InfoItem>Tổng buổi nghỉ không phép trong tháng: {totalUnexcusedLeave}</InfoItem>
      </InfoContainer>
      <div>
        <Button onClick={() => handleMonthChange("prev")}>Tháng trước</Button>
        <span>{format(currentMonth, "MMMM yyyy")}</span>
        <Button onClick={() => handleMonthChange("next")}>Tháng sau</Button>
        <MonthInput
          type="text"
          value={monthInput}
          onChange={handleMonthInputChange}
          onKeyDown={handleMonthInputSubmit}
          placeholder="MM/yyyy"
        />
      </div>
      <Table>
        <thead>
          <tr>
            <Th>STT</Th>
            <Th>Tên sự kiện</Th>
            <Th>Trạng thái</Th>
            <Th>Chi tiết</Th>
            <Th>Báo cáo</Th>
          </tr>
        </thead>
        <tbody>
          {admins
            .slice(pageNumber * clubsPerPage, (pageNumber + 1) * clubsPerPage)
            .map((event, index) => (
              <tr key={event.event?.idEvent}>
                <Td>{index + 1}</Td>
                <Td>{event.event?.titleEvent}</Td>
                <Td>{statusMap[event.userEvent?.status] || event.userEvent?.status}</Td>
                <Td>{event.userEvent?.note}</Td>
                <Td>
                  <JoinButton onClick={() => console.log("Report Clicked")}>Báo cáo</JoinButton>
                </Td>
              </tr>
            ))}
        </tbody>
      </Table>
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
    </div>
  );
};

export default Attend;
