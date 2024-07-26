package vnua.k66cnpma.clubmanagement.service.impl;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vnua.k66cnpma.clubmanagement.dto.EventDTO;
import vnua.k66cnpma.clubmanagement.dto.PostDTO;
import vnua.k66cnpma.clubmanagement.dto.UserEventDTO;
import vnua.k66cnpma.clubmanagement.entity.Event;
import vnua.k66cnpma.clubmanagement.entity.UserEvent;
import vnua.k66cnpma.clubmanagement.entity.UserEventId;
import vnua.k66cnpma.clubmanagement.commons.exception.DonException;
import vnua.k66cnpma.clubmanagement.commons.exception.ErrorMessages;
import vnua.k66cnpma.clubmanagement.repository.EventRepository;
import vnua.k66cnpma.clubmanagement.repository.UserEventRepository;
import vnua.k66cnpma.clubmanagement.service.EventService;
import vnua.k66cnpma.clubmanagement.converter.ConverterToDTO;
import vnua.k66cnpma.clubmanagement.converter.ConverterToEntity;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {

    private final ConverterToDTO converterToDTO;
    private final ConverterToEntity converterToEntity;
    
    @Autowired
    private EventRepository eventRepo;
    
    @Autowired
    private final UserEventRepository user_eventRepo;
    
	@Override
	public List<EventDTO> findByClubId(String clubId) {
		
	        List<Event> event = eventRepo.findByClubId(clubId);
	        if (event.isEmpty()) {
	            throw new DonException(ErrorMessages.NOT_FOUND);
	        }

		return converterToDTO.toEventDTOList(event);
	}
	
    @Override
    public List<PostDTO> getPostDTOByUsername(String username) {
        // Tìm tất cả các bản ghi UserEvent theo username từ cơ sở dữ liệu
        List<UserEvent> userEvents = user_eventRepo.findByUsername(username);

        // Lấy danh sách idEvent từ các bản ghi UserEvent và loại bỏ các idEvent trùng lặp
        List<String> idEvents = userEvents.stream()
                                          .map(UserEvent::getIdEvent) // Chuyển đổi từ UserEvent thành idEvent
                                          .distinct() // Loại bỏ các idEvent trùng lặp
                                          .collect(Collectors.toList()); // Thu thập vào danh sách

        // Tìm tất cả các sự kiện (Event) có idEvent nằm trong danh sách idEvents
        List<Event> events = eventRepo.findByIdEventIn(idEvents);

        // Tạo một bản đồ ánh xạ idEvent tới EventDTO từ danh sách sự kiện
        Map<String, EventDTO> eventDTOMap = new HashMap<>();
        for (Event event : events) {
            eventDTOMap.put(event.getIdEvent(), new EventDTO(event)); // Tạo EventDTO từ Event và lưu vào bản đồ
        }

        // Tạo danh sách PostDTO từ danh sách UserEvent
        return userEvents.stream()
                         .map(userEvent -> {
                             // Tìm EventDTO tương ứng với idEvent từ bản đồ
                             EventDTO eventDTO = eventDTOMap.get(userEvent.getIdEvent());
                             
                             // Nếu tìm thấy EventDTO, tạo PostDTO từ UserEventDTO và EventDTO, ngược lại trả về null
                             return eventDTO != null ? new PostDTO(new UserEventDTO(userEvent), eventDTO) : null;
                         })
                         .filter(Objects::nonNull) // Loại bỏ các PostDTO có giá trị null
                         .collect(Collectors.toList()); // Thu thập vào danh sách
    }

	@Override
	public void changeStatus(UserEventDTO userEventDTO) {
	    // Tạo đối tượng UserEventId từ thông tin trong DTO
	    UserEventId userEventId = new UserEventId(userEventDTO.getUsername(), userEventDTO.getIdEvent());

	    // Tìm UserEvent dựa trên UserEventId
	    Optional<UserEvent> userEventOptional = user_eventRepo.findById(userEventId);
	    
	        UserEvent userEvent = userEventOptional.get();

	        userEvent.setStatus(UserEvent.Status.fromString(userEventDTO.getStatus()));
	        userEvent.setNote(userEventDTO.getNote()); // Cập nhật ghi chú từ DTO

	        user_eventRepo.save(userEvent);
	}

    @Override
    public void addEvent(EventDTO eventDTO) {
        Event event = converterToEntity.toEventEntity(eventDTO);
        eventRepo.save(event);
    }


}
