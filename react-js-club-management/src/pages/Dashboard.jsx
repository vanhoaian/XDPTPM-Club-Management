import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import Posts from "../ui/Posts";
import SearchBar from "../ui/Searchbar";
import Spinner from "../ui/Spinner";
import ReactPaginate from "react-paginate";
import axios from "axios";
import { format, parseISO, isToday, isBefore, isAfter, endOfMonth, endOfWeek, startOfWeek, startOfMonth } from 'date-fns';

// Styled-components
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

const TodayEventsContainer = styled.div`
  border: 2px solid #3498db;
  border-radius: 8px;
  padding: 16px;
  margin-top: 20px;
  background-color: #eaf4f4;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 100%;
`;

const TodayHeading = styled.h2`
  font-size: 1.5em;
  color: #3498db;
  border-bottom: 2px solid #3498db;
  padding-bottom: 8px;
  margin-bottom: 16px;
  text-align: center;
  font-weight: bold;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
`;

const Dropdown = styled.select`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #3498db;
  background-color: white;
`;

const EventsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
`;

const EventSection = styled.div`
  width: 48%;
`;

const SectionHeading = styled.h3`
  color: #3498db;
  border-bottom: 1px solid #3498db;
  padding-bottom: 8px;

`;

const NoteInput = styled.textarea`
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #3498db;
  margin-top: 10px;
`;



// Format date for display
const formatDate = (dateString) => {
  const date = parseISO(dateString);
  return format(date, "HH:mm 'sáng', thứ e, dd-MM-yyyy");
};

function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageNumber, setPageNumber] = useState(0);
  const [viewMode, setViewMode] = useState("day");
  const [notes, setNotes] = useState({});
  const postsPerPage = 10;
  const [filteredData, setFilteredData] = useState(data);
  const [searchData, setSearchData] = useState([]);


  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("user"));
    if (auth && auth.username) {
      fetchEvents(auth.username);
    }
  }, []);

  useEffect(() => {
    const storedNotes = JSON.parse(localStorage.getItem("notes")) || {};
    setNotes(storedNotes);
  }, []);

  useEffect(() => {
    setSearchData(data);
  }, [data]);

  const fetchEvents = async (username) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/events/userPost/${username}`);
      const eventData = response.data.data;
      
      if (!Array.isArray(eventData)) {
        throw new Error("Data received is not an array");
      }

      localStorage.setItem(".event", JSON.stringify(eventData));
      setData(eventData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (result) => {
    setSearchData(result);  // Cập nhật kết quả tìm kiếm
  };

  const handleViewModeChange = (event) => {
    setViewMode(event.target.value);
  };

  const handleNoteChange = (eventId, newNote) => {
    setNotes(prevNotes => ({
      ...prevNotes,
      [eventId]: newNote
    }));
  };

  const handleNoteSave = async (eventId) => {
    try {
      await axios.post(`http://localhost:8080/api/events/updateNote`, {
        eventId,
        note: notes[eventId]
      });
      localStorage.setItem("notes", JSON.stringify(notes));
    } catch (error) {
      console.error("Failed to save note:", error);
    }
  };

  const pageCount = Math.ceil(searchData.length / postsPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const updateStatus = (postId, status) => {
    setData(prevData =>
      prevData.map(post =>
        post.event.idEvent === postId ? { ...post, userEvent: { ...post.userEvent, status } } : post
      )
    );
  };

  const now = new Date();
  
  const checkViewMode = (start, end, viewMode) => {
    const now = new Date();
    const startDate = parseISO(start);
    const endDate = parseISO(end);
  
    const isEventInRange = (startDate, endDate, now, viewMode) => {
      switch (viewMode) {
        case 'day':
          return isToday(startDate) || isToday(endDate) || isBefore(startDate, now) && isAfter(endDate, now);
        case 'week':
          return startDate <= endOfWeek(now) && endDate >= startOfWeek(now);
        case 'month':
          return startDate <= endOfMonth(now) && endDate >= startOfMonth(now);
        default:
          throw new Error('Invalid viewMode');
      }
    };
    return isEventInRange(startDate, endDate, now, viewMode);
  };

  
  // Filter events based on view mode and time
  const filterTimeEvents = (searchData, viewMode) => {
    const now = new Date();
    const filteredEvents = searchData.filter(post => {
      const start = post.event.startTime;
      const end = post.event.endTime;
      return checkViewMode(start, end, viewMode);
    });

    const futureEventsIn = filteredEvents
      .filter(post => isAfter(parseISO(post.event.startTime), now))
      .sort((a, b) => parseISO(a.event.startTime) - parseISO(b.event.startTime));
  
    const pastEventsIn = filteredEvents
      .filter(post => isBefore(parseISO(post.event.startTime), now))
      .sort((a, b) => parseISO(a.event.startTime) - parseISO(b.event.startTime));
  
    return { futureEventsIn, pastEventsIn };
  };


const { futureEventsIn, pastEventsIn } = filterTimeEvents(searchData, viewMode);

const futureEvents = searchData
  .filter(post => isAfter(parseISO(post.event.startTime), now))
  .sort((a, b) => parseISO(a.event.startTime) - parseISO(b.event.startTime));

const pastEvents = searchData
  .filter(post => isBefore(parseISO(post.event.startTime), now))
  .sort((a, b) => parseISO(b.event.startTime) - parseISO(a.event.startTime));

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const headerText = () => {
    switch (viewMode) {
      case "day":
        return "trong ngày";
      case "week":
        return "trong tuần";
      case "month":
        return "trong tháng";
      default:
        return "";
    }
  };

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Lịch sự kiện</Heading>
      </Row>
      <Row>
      <SearchBar data={data} onSearch={handleSearch} />
      </Row>

      <Header>
        <h2>Sự kiện {headerText()}</h2>
        <div>
          <label>Chế độ xem: </label>
          <Dropdown value={viewMode} onChange={handleViewModeChange}>
            <option value="day">Trong ngày</option>
            <option value="week">Trong tuần</option>
            <option value="month">Trong tháng</option>
          </Dropdown>
        </div>
      </Header>

      <TodayEventsContainer>
        <TodayHeading>Sự kiện {headerText()}</TodayHeading>
        <EventsContainer>
        {futureEventsIn.length === 0 && pastEventsIn.length === 0 ? (
        <p>Không có sự kiện nào {headerText()}.</p>
        ) : (
          <>
            <EventSection>
              <SectionHeading>Sự kiện sắp diễn ra</SectionHeading>
              {futureEventsIn.length === 0 ? (
                <p>Không có sự kiện nào sắp diễn ra.</p>
              ) : (
                futureEventsIn.map(post => (
                  <Posts
                  key={post.event.idEvent}
                  id={post.event.idEvent}
                  title={post.event.titleEvent}
                  description={post.event.descriptionEvent}
                  startTime={post.event.startTime}
                  endTime={post.event.endTime}
                  style={post.event.eventStyle}
                  updateStatus={updateStatus}
                  status={post.userEvent.status}
                  note={post.userEvent.note || ""}
                  updateNote={(newNote) => handleNoteChange(post.event.idEvent, newNote)}
                  >
                    <NoteInput
                      value={notes[post.event.idEvent] || ''}
                      onChange={(e) => handleNoteChange(post.event.idEvent, e.target.value)}
                      placeholder="Thêm ghi chú..."
                    />
                    <button onClick={() => handleNoteSave(post.event.idEvent)}>
                      Lưu ghi chú
                    </button>
                    <StatusButton
                      active={post.userEvent.status === 'Tham_gia'}
                      onClick={() => updateStatus(post.event.idEvent, 'Tham_gia')}
                    >
                      Tham gia
                    </StatusButton>
                    <StatusButton
                      active={post.userEvent.status === 'Phép_muộn'}
                      onClick={() => updateStatus(post.event.idEvent, 'Phép_muộn')}
                    >
                      Phép muộn
                    </StatusButton>
                    <StatusButton
                      active={post.userEvent.status === 'Phép_nghỉ'}
                      onClick={() => updateStatus(post.event.idEvent, 'Phép_nghỉ')}
                    >
                      Phép nghỉ
                    </StatusButton>
                  </Posts>
                ))
              )}
            </EventSection>
            <EventSection>
              <SectionHeading>Sự kiện đang và đã diễn ra</SectionHeading>
              {pastEventsIn.length === 0 ? (
                <p>Không có sự kiện nào đang và đã diễn ra.</p>
              ) : (
                pastEventsIn.map(post => (
                  <Posts
                  key={post.event.idEvent}
                  id={post.event.idEvent}
                  title={post.event.titleEvent}
                  description={post.event.descriptionEvent}
                  startTime={post.event.startTime}
                  endTime={post.event.endTime}
                  style={post.event.eventStyle}
                  updateStatus={updateStatus}
                  status={post.userEvent.status}
                  note={post.userEvent.note || ""}
                  updateNote={(newNote) => handleNoteChange(post.event.idEvent, newNote)}
                  >
                    <NoteInput
                      value={notes[post.event.idEvent] || ''}
                      onChange={(e) => handleNoteChange(post.event.idEvent, e.target.value)}
                      placeholder="Thêm ghi chú..."
                    />
                    <button onClick={() => handleNoteSave(post.event.idEvent)}>
                      Lưu ghi chú
                    </button>
                    <StatusButton
                      active={post.userEvent.status === 'Tham_gia'}
                      onClick={() => updateStatus(post.event.idEvent, 'Tham_gia')}
                    >
                      Tham gia
                    </StatusButton>
                    <StatusButton
                      active={post.userEvent.status === 'Phép_muộn'}
                      onClick={() => updateStatus(post.event.idEvent, 'Phép_muộn')}
                    >
                      Phép muộn
                    </StatusButton>
                    <StatusButton
                      active={post.userEvent.status === 'Phép_nghỉ'}
                      onClick={() => updateStatus(post.event.idEvent, 'Phép_nghỉ')}
                    >
                      Phép nghỉ
                    </StatusButton>
                  </Posts>
                ))
              )}
            </EventSection>
          </>
        )}
        </EventsContainer>
      </TodayEventsContainer>

      <EventsContainer>
        <EventSection>
          <SectionHeading>Sự kiện sắp diễn ra</SectionHeading>
          {futureEvents.length === 0 ? (
            <p>Không có sự kiện nào sắp diễn ra.</p>
          ) : (
            futureEvents.map(post => (
              <Posts
              key={post.event.idEvent}
              id={post.event.idEvent}
              title={post.event.titleEvent}
              description={post.event.descriptionEvent}
              startTime={post.event.startTime}
              endTime={post.event.endTime}
              style={post.event.eventStyle}
              updateStatus={updateStatus}
              status={post.userEvent.status}
              note={post.userEvent.note || ""}
              updateNote={(newNote) => handleNoteChange(post.event.idEvent, newNote)}
              >
                <NoteInput
                  value={notes[post.event.idEvent] || ''}
                  onChange={(e) => handleNoteChange(post.event.idEvent, e.target.value)}
                  placeholder="Thêm ghi chú..."
                />
                <button onClick={() => handleNoteSave(post.event.idEvent)}>
                  Lưu ghi chú
                </button>
                <StatusButton
                  active={post.userEvent.status === 'Tham_gia'}
                  onClick={() => updateStatus(post.event.idEvent, 'Tham_gia')}
                >
                  Tham gia
                </StatusButton>
                <StatusButton
                  active={post.userEvent.status === 'Phép_muộn'}
                  onClick={() => updateStatus(post.event.idEvent, 'Phép_muộn')}
                >
                  Phép muộn
                </StatusButton>
                <StatusButton
                  active={post.userEvent.status === 'Phép_nghỉ'}
                  onClick={() => updateStatus(post.event.idEvent, 'Phép_nghỉ')}
                >
                  Phép nghỉ
                </StatusButton>
              </Posts>
            ))
          )}
        </EventSection>
        <EventSection>
          <SectionHeading>Sự kiện đang và đã diễn ra</SectionHeading>
          {pastEvents.length === 0 ? (
            <p>Không có sự kiện nào đang và đã diễn ra.</p>
          ) : (
            pastEvents.map(post => (
              <Posts
              key={post.event.idEvent}
              id={post.event.idEvent}
              title={post.event.titleEvent}
              description={post.event.descriptionEvent}
              startTime={post.event.startTime}
              endTime={post.event.endTime}
              style={post.event.eventStyle}
              updateStatus={updateStatus}
              status={post.userEvent.status}
              note={post.userEvent.note || ""}
              updateNote={(newNote) => handleNoteChange(post.event.idEvent, newNote)}
              >
                <NoteInput
                  value={notes[post.event.idEvent] || ''}
                  onChange={(e) => handleNoteChange(post.event.idEvent, e.target.value)}
                  placeholder="Thêm ghi chú..."
                />
                <button onClick={() => handleNoteSave(post.event.idEvent)}>
                  Lưu ghi chú
                </button>
                <StatusButton
                  active={post.userEvent.status === 'Tham_gia'}
                  onClick={() => updateStatus(post.event.idEvent, 'Tham_gia')}
                >
                  Tham gia
                </StatusButton>
                <StatusButton
                  active={post.userEvent.status === 'Phép_muộn'}
                  onClick={() => updateStatus(post.event.idEvent, 'Phép_muộn')}
                >
                  Phép muộn
                </StatusButton>
                <StatusButton
                  active={post.userEvent.status === 'Phép_nghỉ'}
                  onClick={() => updateStatus(post.event.idEvent, 'Phép_nghỉ')}
                >
                  Phép nghỉ
                </StatusButton>
              </Posts>
            ))
          )}
        </EventSection>
      </EventsContainer>

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
