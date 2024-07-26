package vnua.k66cnpma.clubmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vnua.k66cnpma.clubmanagement.entity.Event;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EventDTO {
    private String idEvent;
    private String titleEvent;
    private String descriptionEvent;
    private Date startTime;
    private Date endTime;
    private String eventStyle;
    private String eventType;
    private String clubId;

    public EventDTO(Event event) {
        this.idEvent = event.getIdEvent();
        this.titleEvent = event.getTitleEvent();
        this.descriptionEvent = event.getDescriptionEvent();
        this.startTime = event.getStartTime();
        this.endTime = event.getEndTime();
        this.eventStyle = event.getEventStyle();
        this.eventType = event.getEventType();
        this.clubId = event.getClubId();
    }


}
