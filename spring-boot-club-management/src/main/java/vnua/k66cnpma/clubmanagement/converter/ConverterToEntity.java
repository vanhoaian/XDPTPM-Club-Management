package vnua.k66cnpma.clubmanagement.converter;

import org.springframework.stereotype.Component;
import vnua.k66cnpma.clubmanagement.dto.EventDTO;
import vnua.k66cnpma.clubmanagement.dto.UserDTO;
import vnua.k66cnpma.clubmanagement.entity.Event;
import vnua.k66cnpma.clubmanagement.entity.User;


@Component
public class ConverterToEntity {
	public User toUserEntity(UserDTO userDTO) {
        User user = new User();
        user.setUsername(userDTO.getUsername());  // Ánh xạ username
        user.setFullname(userDTO.getFullname());  // Ánh xạ fullname
        user.setPassword(userDTO.getPassword());  // Ánh xạ password
        user.setBirthday(userDTO.getBirthday());  // Ánh xạ birthday
        user.setPhone(userDTO.getPhone());  // Ánh xạ phone
        user.setEmail(userDTO.getEmail());  // Ánh xạ email
        user.setRole(userDTO.getRole());  // Ánh xạ role
        user.setTeam(userDTO.getTeam());  // Ánh xạ team
        user.setPosition(userDTO.getPosition());  // Ánh xạ position

        return user;
    }

    
    public Event toEventEntity(EventDTO eventDTO) {
        Event event = new Event();
        event.setIdEvent(eventDTO.getIdEvent());
        event.setTitleEvent(eventDTO.getTitleEvent());
        event.setDescriptionEvent(eventDTO.getDescriptionEvent());
        event.setStartTime(eventDTO.getStartTime());
        event.setEndTime(eventDTO.getEndTime());
        event.setEventStyle(eventDTO.getEventStyle());
        event.setEventType(eventDTO.getEventType());
        return event;
    }

    
}
