package vnua.k66cnpma.clubmanagement.service;

import java.util.List;

import vnua.k66cnpma.clubmanagement.dto.EventDTO;
import vnua.k66cnpma.clubmanagement.dto.PostDTO;
import vnua.k66cnpma.clubmanagement.dto.UserEventDTO;


public interface EventService {
//    Set<EventDTO> getAll();
//    EventDTO getById(String id);
//    void addEvent(EventDTO eventDTO);
//	Set<EventDTO> getEventsByClubId(String clubId);
	
	List<EventDTO> findByClubId(String clubId);

	List<PostDTO> getPostDTOByUsername(String username);

	void changeStatus(UserEventDTO userEventDTO);

	void addEvent(EventDTO eventDTO);
}
