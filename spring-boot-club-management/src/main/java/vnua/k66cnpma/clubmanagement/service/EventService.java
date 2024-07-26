package vnua.k66cnpma.clubmanagement.service;

import java.util.List;

import vnua.k66cnpma.clubmanagement.dto.EventDTO;
import vnua.k66cnpma.clubmanagement.dto.PostDTO;
import vnua.k66cnpma.clubmanagement.dto.UserEventDTO;


public interface EventService {
	
	List<EventDTO> findByClubId(String clubId);

	List<PostDTO> getPostDTOByUsername(String username);

	void changeStatus(UserEventDTO userEventDTO);

	void addEvent(EventDTO eventDTO);
}
