package vnua.k66cnpma.clubmanagement.controller;

import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import vnua.k66cnpma.clubmanagement.commons.DonResponse;
import vnua.k66cnpma.clubmanagement.dto.EventDTO;
import vnua.k66cnpma.clubmanagement.dto.PostDTO;
import vnua.k66cnpma.clubmanagement.dto.UserEventDTO;
import vnua.k66cnpma.clubmanagement.service.EventService;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/events")
//@RequiredArgsConstructor
@Validated
@Slf4j
public class EventController {
	@Autowired
	private EventService eventService;


		@CrossOrigin(origins = "http://localhost:3000")
		@GetMapping(value = "/clubPost/{clubId}", produces = MediaType.APPLICATION_JSON_VALUE)
		public DonResponse<List<EventDTO>> findByClubId(@PathVariable("clubId") String clubId) {
        List<EventDTO> result = eventService.findByClubId(clubId);
        return DonResponse.build(result);
		}
		
        @CrossOrigin(origins = "http://localhost:3000")
        @GetMapping(value = "/userPost/{username}", produces = MediaType.APPLICATION_JSON_VALUE)
        public DonResponse<List<PostDTO>> getPostsByUsername(@PathVariable("username") String username) {
            List<PostDTO> result = eventService.getPostDTOByUsername(username);
            return DonResponse.build(result);
        }

    	@CrossOrigin(origins = "http://localhost:3000")
    	@PostMapping("/changeStatus")
    	public DonResponse<String> changeStatus(@RequestBody UserEventDTO userEventDTO) {
    		eventService.changeStatus(userEventDTO);
    		return DonResponse.build("Thay đổi trạng thái tham gia thành công.");
    	}
    	
    	@CrossOrigin(origins = "http://localhost:3000")
    	@PostMapping("/addEvent")
    	public DonResponse<String> addEvent(@RequestBody EventDTO eventDTO) {
    		eventService.addEvent(eventDTO);
    		return DonResponse.build("Thêm sự kiện thành công");
    	}

}

