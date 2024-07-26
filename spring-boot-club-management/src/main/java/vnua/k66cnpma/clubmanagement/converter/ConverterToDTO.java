package vnua.k66cnpma.clubmanagement.converter;

import org.springframework.stereotype.Component;

import vnua.k66cnpma.clubmanagement.dto.EventDTO;
import vnua.k66cnpma.clubmanagement.dto.UserDTO;
import vnua.k66cnpma.clubmanagement.entity.Event;
import vnua.k66cnpma.clubmanagement.entity.User;

import java.util.*;

@Component
public class ConverterToDTO {

    
    public List<EventDTO> toEventDTOList(List<Event> events) {
        Map<String, EventDTO> eventMap = new HashMap<>();

        for (Event event : events) {
        	EventDTO eventDTO = new EventDTO(event);
            eventMap.put(event.getIdEvent(), eventDTO);
        }
        return new LinkedList<>(eventMap.values());
    }


    public List<UserDTO> toUserDTOList(List<User> users) {
        Map<String, UserDTO> userMap = new HashMap<>();

        for (User user : users) {
            UserDTO userDTO = new UserDTO(user);
            userMap.put(user.getUsername(), userDTO);
        }

        return new LinkedList<>(userMap.values());
    }

}
