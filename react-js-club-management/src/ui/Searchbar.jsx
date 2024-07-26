import React, { useState } from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  padding: 8px;
  border: 1px solid #3498db;
  border-radius: 4px;
  margin: 5px;
  flex: 1 1 150px;
`;

const DateInputContainer = styled.div`
  position: relative;
  margin: 5px;
  width: 250px;  // Tăng chiều rộng của ô ngày
  display: flex;
  align-items: center;

  .date-picker-wrapper {
    width: 100%;
  }

  .react-datepicker-wrapper {
    width: 100%;
  }

  .react-datepicker__input-container input {
    padding: 8px;
    border: 1px solid #3498db;
    border-radius: 4px;
    width: 100%;
    box-sizing: border-box;
  }
`;

const SearchButton = styled.button`
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

const ResetButton = styled.button`
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  margin: 5px;

  &:hover {
    background-color: #c0392b;
  }
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  margin: 5px;
`;

function SearchBar({ data, onSearch }) {
  const [query, setQuery] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchResult, setSearchResult] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = () => {
    if (!query && !startDate && !endDate) {
      onSearch(data);  // Nếu không có truy vấn, trả về toàn bộ dữ liệu
      return;
    }

    const lowerCaseQuery = query.toLowerCase();
    const result = data.filter(item => {
      const itemString = JSON.stringify(item).toLowerCase();
      const hasQueryMatch = lowerCaseQuery ? itemString.includes(lowerCaseQuery) : true;

      const eventStartTime = new Date(item.event?.startTime);
      const eventEndTime = new Date(item.event?.endTime);

      const hasDateMatch = (!startDate || eventEndTime >= startDate) &&
                            (!endDate || eventStartTime <= endDate);

      return hasQueryMatch && hasDateMatch;
    });

    setSearchResult(result);
    onSearch(result);  // Trả về dữ liệu đã lọc

    if (result.length === 0) {
      setQuery("");
      setStartDate(null);
      setEndDate(null);
    }
  };

  const handleReset = () => {
    setQuery("");
    setStartDate(null);
    setEndDate(null);
    setError("");
    onSearch(data);  // Trả về toàn bộ dữ liệu
  };

  return (
    <SearchContainer>
      <SearchInput
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Tìm kiếm theo từ khóa..."
      />
      <DateInputContainer>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          dateFormat="dd/MM/yyyy"
          placeholderText="Từ ngày"
          className="date-picker-wrapper"
        />
      </DateInputContainer>
      <DateInputContainer>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          dateFormat="dd/MM/yyyy"
          placeholderText="Đến ngày"
          minDate={startDate}
          className="date-picker-wrapper"
        />
      </DateInputContainer>
      <SearchButton onClick={handleSearch}>Tìm kiếm</SearchButton>
      {searchResult.length === 0 && (
        <ResetButton onClick={handleReset}>Quay lại</ResetButton>
      )}
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </SearchContainer>
  );
}

export default SearchBar;
